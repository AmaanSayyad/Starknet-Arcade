use starknet::ContractAddress;

#[starknet::interface]
pub trait ISnakeNLadders<TContractState> {
    fn enroll(ref self: TContractState);
    fn roll(ref self: TContractState) -> u64;
    fn is_enrolled(ref self: TContractState, player_address: ContractAddress) -> bool;
    fn get_player_id(ref self: TContractState, player_address: ContractAddress) -> u64;
    fn get_player_position(ref self: TContractState, player_id: u64) -> u64;
    fn get_current_turn(ref self: TContractState) -> u64;
    fn get_participation_fee(ref self: TContractState) -> u64;
    fn get_objects(ref self: TContractState) -> Array<(u64, u64)>;
}

#[derive(Drop, Hash)]
pub struct Entropy {
    pub seed: u64,
    pub timestamp: u64,
    pub block_number: u64,
}

#[starknet::contract]
pub mod SnakeNLadders {
    use core::hash::{HashStateExTrait, HashStateTrait};
    use core::poseidon::PoseidonTrait;
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, get_block_number,
        get_block_timestamp,
    };
    use starknet::storage::{
        Map, StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapReadAccess,
        StorageMapWriteAccess,
    };
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use super::Entropy;

    #[storage]
    struct Storage {
        is_enrolled: Map<ContractAddress, bool>,
        player_ids: Map<ContractAddress, u64>,
        player_id_to_address: Map<u64, ContractAddress>,
        turn_accumulation: Map<u64, u64>,
        player_positions: Map<u64, u64>,
        objects: Map<u64, u64>,
        participation_fee: u64,
        token_address: ContractAddress,
        next_player_id: u64,
        current_turn: u64,
        prize_factor: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        PlayerEnrolled: PlayerEnrolled,
        PlayerUnenrolled: PlayerUnenrolled,
        PlayerMoved: PlayerMoved,
        PlayerWon: PlayerWon,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PlayerEnrolled {
        #[key]
        pub player_id: u64,
        pub player_address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PlayerUnenrolled {
        #[key]
        pub player_id: u64,
        pub player_address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PlayerMoved {
        #[key]
        pub player_id: u64,
        pub player_address: ContractAddress,
        pub new_position: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PlayerWon {
        #[key]
        pub player_id: u64,
        pub player_address: ContractAddress,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        participation_fee: u64,
        token_address: ContractAddress,
        objects: Array<(u64, u64)>,
    ) {
        assert!(participation_fee > 0, "Participation fee must be greater than 0");
        self.participation_fee.write(participation_fee);

        self.token_address.write(token_address);
        self.next_player_id.write(1);
        self.prize_factor.write(37500);
        self.current_turn.write(1);

        for (starting_position, ending_position) in objects {
            assert!(
                starting_position != ending_position,
                "Starting and ending positions must be different",
            );
            assert!(
                starting_position > 0 && ending_position > 0,
                "Starting and ending positions must be greater than 0",
            );
            assert!(starting_position < 100, "Starting positions must be less than 100");
            assert!(ending_position <= 100, "Ending positions must be less than or equal to 100");
            self.objects.write(starting_position, ending_position);
        }
    }

    #[abi(embed_v0)]
    impl ISnakeNLadders of super::ISnakeNLadders<ContractState> {
        fn enroll(ref self: ContractState) {
            // Check eligibility for enrolling
            let player_address = get_caller_address();
            assert!(!self.is_enrolled.read(player_address), "Player is already enrolled");
            assert!(self.next_player_id.read() <= 4, "Max players reached");

            // Check if the player has enough balance and allowance
            let participation_fee = self.participation_fee.read();
            let token = IERC20Dispatcher { contract_address: self.token_address.read() };
            let allowance = token.allowance(player_address, get_contract_address());
            assert!(allowance >= participation_fee.into(), "Insufficient allowance to enroll");
            let player_balance = token.balance_of(player_address);
            assert!(player_balance >= participation_fee.into(), "Insufficient balance to enroll");
            let success = token
                .transfer_from(player_address, get_contract_address(), participation_fee.into());
            assert!(success, "Transfer failed");

            // Enroll the player
            let player_id = self.next_player_id.read();
            self.is_enrolled.write(player_address, true);
            self.player_ids.write(player_address, player_id);
            self.player_id_to_address.write(player_id, player_address);
            self.next_player_id.write(player_id + 1);
            self.emit(PlayerEnrolled { player_id, player_address });
        }

        fn roll(ref self: ContractState) -> u64 {
            // Check if 4 players are enrolled
            assert!(self.next_player_id.read() == 5, "Not enough players enrolled");

            // Check if the player is enrolled
            let player_address = get_caller_address();
            assert!(self.is_enrolled.read(player_address), "Player is not enrolled");

            // Check if it's the player's turn
            let player_id = self.player_ids.read(player_address);
            assert!(self.current_turn.read() == player_id, "It's not your turn");

            // Roll the dice
            let seed_felt: felt252 = get_caller_address().into();
            let seed: u64 = seed_felt.try_into().unwrap();
            let roll_result = self.roll_dice(seed);

            if roll_result == 6 {
                let current_position = self.player_positions.read(player_id);
                let turn_accumulation = self.turn_accumulation.read(player_id);
                let mut new_position = current_position + roll_result + turn_accumulation;
                if new_position > 100 {
                    self.turn_accumulation.write(player_id, 0);
                    self.current_turn.write(self.get_next_player_id(player_id));
                    return roll_result;
                }

                // Player gets another turn
                self.current_turn.write(player_id);
                let total_moves = turn_accumulation + roll_result;
                self.turn_accumulation.write(player_id, total_moves);
                return roll_result;
            } else {
                // Move the player
                let current_position = self.player_positions.read(player_id);
                let turn_accumulation = self.turn_accumulation.read(player_id);
                let mut new_position = current_position + roll_result + turn_accumulation;
                if new_position > 100 {
                    self.turn_accumulation.write(player_id, 0);
                    self.current_turn.write(self.get_next_player_id(player_id));
                    return roll_result;
                }

                // Check for snakes or ladders
                if self.objects.read(new_position) != 0 {
                    new_position = self.objects.read(new_position);
                    self.player_positions.write(player_id, new_position);
                    self
                        .emit(
                            PlayerMoved { player_id, player_address: player_address, new_position },
                        );
                } else {
                    self.player_positions.write(player_id, new_position);
                    self
                        .emit(
                            PlayerMoved { player_id, player_address: player_address, new_position },
                        );
                }

                // Check for win condition
                if new_position == 100 {
                    self.turn_accumulation.write(player_id, 0);
                    self.current_turn.write(self.get_next_player_id(player_id));
                    self.distribute_prize(player_address);
                    self.emit(PlayerWon { player_id, player_address });
                    return roll_result;
                }

                // Pass the turn to the next player;
                self.turn_accumulation.write(player_id, 0);
                self.current_turn.write(self.get_next_player_id(player_id));
                return roll_result;
            }
        }

        fn is_enrolled(ref self: ContractState, player_address: ContractAddress) -> bool {
            self.is_enrolled.read(player_address)
        }

        fn get_player_id(ref self: ContractState, player_address: ContractAddress) -> u64 {
            self.player_ids.read(player_address)
        }

        fn get_player_position(ref self: ContractState, player_id: u64) -> u64 {
            self.player_positions.read(player_id)
        }

        fn get_current_turn(ref self: ContractState) -> u64 {
            self.current_turn.read()
        }

        fn get_participation_fee(ref self: ContractState) -> u64 {
            self.participation_fee.read()
        }

        fn get_objects(ref self: ContractState) -> Array<(u64, u64)> {
            let mut objects: Array = ArrayTrait::new();
            for i in 1_u64..100 {
                if self.objects.read(i) != 0 {
                    objects.append((i, self.objects.read(i)));
                }
            };
            objects
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn roll_dice(self: @ContractState, seed: u64) -> u64 {
            // Generate a random number between 1 and 6
            let entropy = Entropy {
                seed, timestamp: get_block_timestamp(), block_number: get_block_number(),
            };
            let rand_felt = PoseidonTrait::new().update_with(entropy).finalize();
            let rand_u256: u256 = rand_felt.into();
            let rand_u256_in_range: u256 = 1 + rand_u256 % 6;
            let rand: u64 = rand_u256_in_range.try_into().unwrap();
            return rand;
        }

        fn get_next_player_id(ref self: ContractState, current_player_id: u64) -> u64 {
            let mut i: u64 = 1;
            let mut ans = 0;
            while i <= 4 {
                let next_player_id = i + current_player_id % 4;
                if self.player_positions.read(next_player_id) == 100 {
                    i += 1;
                } else {
                    ans = next_player_id;
                    break;
                }
            };
            ans
        }

        fn distribute_prize(ref self: ContractState, player_address: ContractAddress) {
            let participation_fee = self.participation_fee.read();
            let token = IERC20Dispatcher { contract_address: self.token_address.read() };
            let prize_factor = self.prize_factor.read();
            let prize_pool = participation_fee * 4;
            let player_prize_pool = prize_pool * 9800 / 10000;
            let prize = player_prize_pool * prize_factor / 100000;
            let success = token.transfer(player_address, prize.into());
            assert!(success, "Transfer failed");
            if prize_factor == 37500 {
                self.prize_factor.write(32500);
            } else if prize_factor == 32500 {
                self.prize_factor.write(30000);
            } else {
                self.prize_factor.write(0);
            }
        }
    }
}
