#[starknet::interface]
pub trait IRockPaperScissor<TContractState> {
    fn join(ref self: TContractState, bet: u256, rounds: u8);
    fn update_winner(ref self: TContractState, id: u32, winner: starknet::ContractAddress);
    fn play_round(ref self: TContractState, id: u32, round: u8, player_move: u8);
}

#[starknet::contract]
mod RockPaperScissor {
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};

    const MOVE_ROCK: u8 = 0;
    const MOVE_PAPER: u8 = 1;
    const MOVE_SCISSOR: u8 = 2;

    const RESULT_NOT_PLAYED: u8 = 0;
    const RESULT_P1_WIN: u8 = 1;
    const RESULT_P2_WIN: u8 = 2;
    const RESULT_DRAW: u8 = 3;

    #[storage]
    struct Storage {
        balance: u256,
        games_len: u32,
        player1: Map<u32, ContractAddress>,
        player2: Map<u32, ContractAddress>,
        winner: Map<u32, ContractAddress>,
        bets: Map<u32, u256>,
        rounds: Map<u32, u8>,
        player1_moves: Map<u64, u8>,
        player2_moves: Map<u64, u8>,
        round_results: Map<u64, u8>,
        round_wins_p1: Map<u32, u8>,
        round_wins_p2: Map<u32, u8>,
    }

    #[abi(embed_v0)]
    impl RockPaperScissorImpl of super::IRockPaperScissor<ContractState> {
        fn join(ref self: ContractState, bet: u256, rounds: u8) {
            let caller = get_caller_address();
            let games_len = self.games_len.read();
            let zero_addr: ContractAddress = 0.try_into().unwrap();

            let mut found = false;
            let mut i = 0;
            while i != games_len {
                if self.player2.entry(i).read() == zero_addr
                    && self.rounds.entry(i).read() == rounds {
                    self.player2.entry(i).write(caller);
                    self._increase_balance(bet, i);
                    found = true;
                    break;
                }
                i += 1;
            }

            if !found {
                let id = self._play(rounds, bet);
                self._increase_balance(bet, id);
            }
        }

        fn update_winner(ref self: ContractState, id: u32, winner: ContractAddress) {
            let caller = get_caller_address();
            let player1 = self.player1.entry(id).read();
            let player2 = self.player2.entry(id).read();

            assert(caller == player1 || caller == player2, 'You are not a player');

            self.winner.entry(id).write(winner);
            self._payout(id);
        }

        fn play_round(ref self: ContractState, id: u32, round: u8, player_move: u8) {
            let caller = get_caller_address();
            let player1 = self.player1.entry(id).read();
            let player2 = self.player2.entry(id).read();

            assert(caller == player1 || caller == player2, 'You are not a player');
            let total_rounds = self.rounds.entry(id).read();
            assert(round < total_rounds, 'Invalid round');
            let id_u64: u64 = id.into();
            let round_u64: u64 = round.into();

            let key: u64 = id_u64 * 256 + round_u64;

            if caller == player1 {
                self.player1_moves.entry(key).write(player_move);
            } else {
                self.player2_moves.entry(key).write(player_move);
            }

            let p1 = self.player1_moves.entry(key).read();
            let p2 = self.player2_moves.entry(key).read();

            if p1 != 255 && p2 != 255 {
                self._evaluate_round(id, round);
            }
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _play(ref self: ContractState, rounds: u8, bets: u256) -> u32 {
            let caller = get_caller_address();
            let game_id = self.games_len.read();

            self.player1.entry(game_id).write(caller);
            self.rounds.entry(game_id).write(rounds);
            self.games_len.write(game_id + 1);

            return game_id;
        }

        fn _increase_balance(ref self: ContractState, amount: u256, id: u32) {
            assert(amount != 0, 'Amount cannot be 0');

            let strk_addr: ContractAddress =
                0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
                .try_into()
                .unwrap();

            let strk_dispatcher = IERC20Dispatcher { contract_address: strk_addr };
            let balance = strk_dispatcher.balance_of(get_contract_address());

            assert(self.balance.read() + amount == balance, 'Not enough balance');
            self.balance.write(amount);
            self.bets.entry(id).write(self.bets.entry(id).read() + amount);
        }

        fn _decrease_balance(ref self: ContractState, amount: u256) {
            assert(amount != 0, 'Amount cannot be 0');
            self.balance.write(self.balance.read() - amount);
        }

        fn _payout(ref self: ContractState, id: u32) {
            let caller = get_caller_address();
            let rewardee = self.winner.entry(id).read();
            assert(caller == rewardee, 'You are not the winner');

            let strk_addr: ContractAddress =
                0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
                .try_into()
                .unwrap();

            let strk_dispatcher = IERC20Dispatcher { contract_address: strk_addr };
            strk_dispatcher.transfer(caller, self.bets.entry(id).read());

            self._decrease_balance(self.bets.entry(id).read());
        }

        fn _evaluate_round(ref self: ContractState, id: u32, round: u8) {
            let id_u64: u64 = id.into();
            let round_u64: u64 = round.into();
            let key: u64 = id_u64 * 256 + round_u64;
            let p1 = self.player1_moves.entry(key).read();
            let p2 = self.player2_moves.entry(key).read();

            let mut result: u8 = 0;
            if p1 == p2 {
                result = RESULT_DRAW;
            } else if (p1 == MOVE_ROCK && p2 == MOVE_SCISSOR)
                || (p1 == MOVE_PAPER && p2 == MOVE_ROCK)
                || (p1 == MOVE_SCISSOR && p2 == MOVE_PAPER) {
                result = RESULT_P1_WIN;
                let prev = self.round_wins_p1.entry(id).read();
                self.round_wins_p1.entry(id).write(prev + 1);
            } else {
                result = RESULT_P2_WIN;
                let prev = self.round_wins_p2.entry(id).read();
                self.round_wins_p2.entry(id).write(prev + 1);
            }

            self.round_results.entry(key).write(result);

            let total = self.rounds.entry(id).read();
            let half = (total / 2) + 1;

            let p1_wins = self.round_wins_p1.entry(id).read();
            let p2_wins = self.round_wins_p2.entry(id).read();

            if p1_wins >= half {
                self.update_winner(id, self.player1.entry(id).read());
            } else if p2_wins >= half {
                self.update_winner(id, self.player2.entry(id).read());
            }
        }
    }
}
