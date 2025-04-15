use starknet::ContractAddress;

#[starknet::interface]
pub trait ISnakeNLadders<TContractState> {
    fn create_game(ref self: TContractState, bet_amount: u256) -> u64;
    fn roll(ref self: TContractState) -> u64;
    fn roll_for_computer(ref self: TContractState) -> u64;
    fn end_game(ref self: TContractState) -> u64;
    fn get_player_position(self: @TContractState, player_address: ContractAddress) -> u64;
    fn get_computer_position(self: @TContractState, player_address: ContractAddress) -> u64;
    fn get_current_turn(self: @TContractState, player_address: ContractAddress) -> bool; // true for player, false for computer
    fn get_objects(self: @TContractState) -> Array<(u64, u64)>;
    fn get_winner(self: @TContractState, player_address: ContractAddress) -> u8; // 0 = no winner yet, 1 = player, 2 = computer
    fn get_active_game_id(self: @TContractState, player_address: ContractAddress) -> u64;
    fn get_game_bet(self: @TContractState, player_address: ContractAddress) -> u256;
    fn get_fee_address(self: @TContractState) -> ContractAddress;
    fn set_fee_address(ref self: TContractState, new_address: ContractAddress);
}

#[derive(Drop, Hash)]
pub struct Entropy {
    pub seed: u256,
    pub timestamp: u64,
    pub block_number: u64,
}

#[derive(Drop, starknet::Store, Copy)]
pub struct Game {
    player: ContractAddress,
    player_position: u64,
    computer_position: u64,
    is_player_turn: bool,
    winner: u8, // 0 = none, 1 = player, 2 = computer, 3 = game ended
    bet_amount: u256,
    created_at: u64,
}

#[starknet::contract]
pub mod SnakeNLadders {
    use core::hash::{HashStateExTrait, HashStateTrait};
    use core::poseidon::PoseidonTrait;
    use core::array::ArrayTrait;
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, get_block_number,
        get_block_timestamp,
    };
    use starknet::storage::{
        Map, StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapReadAccess,
        StorageMapWriteAccess,
    };
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use super::{Entropy, Game};

    const PRIZE_MULTIPLIER: u256 = 196; // 196% = 2x - 2% fee (stored as percentage * 100)
    const FEE_PERCENTAGE: u256 = 2; // 2% fee

    #[storage]
    struct Storage {
        // Game state
        games: Map<u64, Game>,
        next_game_id: u64,
        player_active_game: Map<ContractAddress, u64>,
        
        // Game board configuration
        objects: Map<u64, u64>, // position -> new position (snakes and ladders)
        
        // Game parameters
        token_address: ContractAddress,
        fee_address: ContractAddress,
        owner: ContractAddress,
        roll_number: u256
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        GameCreated: GameCreated,
        PlayerMoved: PlayerMoved,
        ComputerMoved: ComputerMoved,
        PlayerWon: PlayerWon,
        ComputerWon: ComputerWon,
        FeeAddressChanged: FeeAddressChanged,
        DiceRolled: DiceRolled,
        GameEnded: GameEnded,
    }

    #[derive(Drop, starknet::Event)]
    pub struct GameCreated {
        #[key]
        pub game_id: u64,
        pub player_address: ContractAddress,
        pub bet_amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct GameEnded {
        #[key]
        pub game_id: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PlayerMoved {
        #[key]
        pub game_id: u64,
        pub player_address: ContractAddress,
        pub new_position: u64,
        pub dice_roll: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ComputerMoved {
        #[key]
        pub game_id: u64,
        pub new_position: u64,
        pub dice_roll: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PlayerWon {
        #[key]
        pub game_id: u64,
        pub player_address: ContractAddress,
        pub prize_amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ComputerWon {
        #[key]
        pub game_id: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct FeeAddressChanged {
        pub old_address: ContractAddress,
        pub new_address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    pub struct DiceRolled {
        pub roll_result: u64,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        token_address: ContractAddress,
        fee_address: ContractAddress,
        objects: Array<(u64, u64)>,
    ) {
        self.token_address.write(token_address);
        self.next_game_id.write(1);
        self.fee_address.write(fee_address);
        self.owner.write(get_caller_address());

        // Initialize the game board with the provided objects (snakes and ladders)
        for (starting_position, ending_position) in objects {
            assert!(
                starting_position != ending_position,
                "Starting and ending positions must be different"
            );
            assert!(
                starting_position > 0 && ending_position > 0,
                "Starting and ending positions must be greater than 0"
            );
            assert!(starting_position < 100, "Starting positions must be less than 100");
            assert!(ending_position <= 100, "Ending positions must be less than or equal to 100");
            self.objects.write(starting_position, ending_position);
        }
    }

    #[abi(embed_v0)]
    impl ISnakeNLadders of super::ISnakeNLadders<ContractState> {
        fn create_game(ref self: ContractState, bet_amount: u256) -> u64 {
            let player_address = get_caller_address();
            
            // Check if player already has an active game
            let active_game = self.player_active_game.read(player_address);
            if active_game != 0 {
                let game = self.games.read(active_game);
                assert(game.winner != 0, 'You already have an active game');
            }
            
            // Check if the player has enough balance and allowance
            let token = IERC20Dispatcher { contract_address: self.token_address.read() };
            let allowance = token.allowance(player_address, get_contract_address());
            assert(allowance >= bet_amount, 'Insufficient allowance for bet');
            
            let player_balance = token.balance_of(player_address);
            assert(player_balance >= bet_amount, 'Insufficient balance for bet');
            
            // Check if the contract can pay potential prizes
            let contract_balance = token.balance_of(get_contract_address());
            assert(contract_balance >= bet_amount, 'Insufficient contract balance');

            // Transfer bet amount to contract
            let success = token.transfer_from(
                player_address, 
                get_contract_address(), 
                bet_amount
            );
            assert(success, 'Transfer failed');

            // Create a new game
            let game_id = self.next_game_id.read();
            
            // Initialize game state
            let new_game = Game {
                player: player_address,
                player_position: 0,
                computer_position: 0,
                is_player_turn: true,
                winner: 0,
                bet_amount: bet_amount,
                created_at: get_block_timestamp(),
            };
            
            self.games.write(game_id, new_game);
            
            // Track player's active game
            self.player_active_game.write(player_address, game_id);
            
            // Increment game ID for next game
            self.next_game_id.write(game_id + 1);
            
            // Emit event
            self.emit(GameCreated { game_id, player_address, bet_amount });
            
            game_id
        }

        fn end_game(ref self: ContractState) -> u64 {
            let player_address = get_caller_address();
            
            // Get player's active game
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            // Get game state
            let mut game = self.games.read(game_id);
            assert(game.winner == 0, 'Game already has a winner');
            
            // Emit event
            self.emit(GameEnded { game_id });
            
            // Reset player's active game
            self.player_active_game.write(player_address, 0);
            
            // Delete the game
            self.games.write(game_id, Game { winner: 3, ..game });
            
            game_id
        }

        fn roll(ref self: ContractState) -> u64 {
            self.roll_number.write(self.roll_number.read() + 1);
            let player_address = get_caller_address();
            
            // Get player's active game
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            // Get game state
            let mut game = self.games.read(game_id);
            assert(game.winner == 0, 'Game already has a winner');
            assert(game.is_player_turn, 'It\'s not your turn');

            // Roll the dice
            let roll_result = self.roll_dice();
            self.emit(DiceRolled { roll_result });

            let current_position = game.player_position;
            let mut new_position = current_position + roll_result;

            if new_position > 100 {
                self.games.write(game_id, Game { is_player_turn: false, ..game });
                return roll_result;
            }

            // Check for snakes or ladders
            if self.objects.read(new_position) != 0 {
                new_position = self.objects.read(new_position);
            }

            game = Game { player_position: new_position, is_player_turn: false, ..game };
            self
            .emit(
                PlayerMoved { game_id, player_address, new_position, dice_roll: roll_result },
            );

            // Check for win condition
            if new_position == 100 {
                game = Game { winner: 1, ..game };
                self.distribute_prize(player_address, game.bet_amount);
                self.emit(PlayerWon { game_id, player_address, prize_amount: game.bet_amount * 2 });
            }

            self.games.write(game_id, game);
            return roll_result;
        }
        
        fn roll_for_computer(ref self: ContractState) -> u64 {
            self.roll_number.write(self.roll_number.read() + 1);
            let player_address = get_caller_address();
            
            // Get player's active game
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            // Get game state
            let mut game = self.games.read(game_id);
            assert(game.winner == 0, 'Game already has a winner');
            assert(!game.is_player_turn, 'It\'s not computer\'s turn');

            // Roll the dice
            let roll_result = self.roll_dice();
            self.emit(DiceRolled { roll_result });

                // Move the player
                let current_position = game.computer_position;
                let mut new_position = current_position + roll_result;
                if new_position > 100 {
                    self.games.write(game_id, Game {  is_player_turn: true, ..game });
                    return roll_result;
                }

                // Check for snakes or ladders
                if self.objects.read(new_position) != 0 {
                    new_position = self.objects.read(new_position);
                }
                game = Game { computer_position: new_position,  is_player_turn: true, ..game };
                self
                .emit(
                    ComputerMoved { game_id, new_position, dice_roll: roll_result },
                );

                // Check for win condition
                if new_position == 100 {
                    game = Game { winner: 2, ..game };
                    self.emit(ComputerWon { game_id });
                }
                self.games.write(game_id, game);
                return roll_result;
            
        }
        
        fn get_player_position(self: @ContractState, player_address: ContractAddress) -> u64 {
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            let game = self.games.read(game_id);
            game.player_position
        }
        
        fn get_computer_position(self: @ContractState, player_address: ContractAddress) -> u64 {
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            let game = self.games.read(game_id);
            game.computer_position
        }
        
        fn get_current_turn(self: @ContractState, player_address: ContractAddress) -> bool {
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            let game = self.games.read(game_id);
            game.is_player_turn
        }
        
        fn get_objects(self: @ContractState) -> Array<(u64, u64)> {
            let mut objects: Array<(u64, u64)> = ArrayTrait::new();
            
            for i in 1_u64..100 {
                let target = self.objects.read(i);
                if target != 0 {
                    objects.append((i, target));
                }
            };
            
            objects
        }
        
        fn get_winner(self: @ContractState, player_address: ContractAddress) -> u8 {
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            let game = self.games.read(game_id);
            game.winner
        }
        
        fn get_active_game_id(self: @ContractState, player_address: ContractAddress) -> u64 {
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            game_id
        }
        
        fn get_game_bet(self: @ContractState, player_address: ContractAddress) -> u256 {
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            let game = self.games.read(game_id);
            game.bet_amount
        }
        
        fn get_fee_address(self: @ContractState) -> ContractAddress {
            self.fee_address.read()
        }
        
        fn set_fee_address(ref self: ContractState, new_address: ContractAddress) {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Only owner can change');
            
            let old_address = self.fee_address.read();
            self.fee_address.write(new_address);
            
            self.emit(FeeAddressChanged { old_address, new_address });
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn roll_dice(self: @ContractState) -> u64 {
            // Generate a random number between 1 and 6
            let entropy = Entropy {
                seed: self.roll_number.read(), 
                timestamp: get_block_timestamp(), 
                block_number: get_block_number(),
            };
            let rand_felt = PoseidonTrait::new().update_with(entropy).finalize();
            let rand_u256: u256 = rand_felt.into();
            let rand_u256_in_range: u256 = 1 + rand_u256 % 6;
            let rand: u64 = rand_u256_in_range.try_into().unwrap();
            rand
        }
        
        fn distribute_prize(ref self: ContractState, player_address: ContractAddress, bet_amount: u256) -> u256 {
            let token = IERC20Dispatcher { contract_address: self.token_address.read() };
            
            // Calculate prize (bet amount * 1.96 = 2x with 2% fee)
            let gross_prize = bet_amount * 2;
            let fee_amount = gross_prize * FEE_PERCENTAGE / 100;
            let net_prize = gross_prize - fee_amount;
            
            // Transfer prize to player
            let success = token.transfer(player_address, net_prize);
            assert(success, 'Prize transfer failed');
            
            // Transfer fee to fee address
            if fee_amount > 0 {
                let fee_success = token.transfer(self.fee_address.read(), fee_amount);
                assert(fee_success, 'Fee transfer failed');
            }
            
            net_prize
        }
    }
}