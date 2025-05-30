//class hash 0x066ff6c1ddaa3b1ee05263a991ffc7c3b4d2a9681dc2940000d4b52772e4efdc
//deployed at 0x07f312dcda01167b67f0c31002a70f5721d834bbaab1ae0d1134faf8cae52c58

use starknet::ContractAddress;

#[starknet::interface]
pub trait IRouletteGame<TContractState> {
    fn create_game(ref self: TContractState, bet_amount: u256) -> u64;
    fn place_bet(ref self: TContractState, bet_type: u8, bet_numbers: Array<u64>, bet_amount: u256) -> bool; // FIXED: Added bet_amount back
    fn spin_wheel(ref self: TContractState) -> u64;
    fn end_game(ref self: TContractState) -> u64;
    
    fn get_active_game_id(self: @TContractState, player_address: ContractAddress) -> u64;
    fn get_game_result(self: @TContractState, player_address: ContractAddress) -> (u64, u256);
    fn get_game_status(self: @TContractState, player_address: ContractAddress) -> u8;
    fn get_game_bets(self: @TContractState, player_address: ContractAddress) -> Array<Bet>;
    
    fn get_fee_address(self: @TContractState) -> ContractAddress;
    fn set_fee_address(ref self: TContractState, new_address: ContractAddress);
    fn get_house_balance(self: @TContractState) -> u256;
    fn withdraw_house_funds(ref self: TContractState, amount: u256);
    fn deposit_funds(ref self: TContractState, amount: u256);
    fn set_bet_limits(ref self: TContractState, min_bet: u256, max_bet: u256);
    
    // Fixed user withdrawal function
    fn withdraw_user_winnings(ref self: TContractState, amount: u256);
    fn get_user_balance(self: @TContractState, user: ContractAddress) -> u256;
    fn pause_contract(ref self: TContractState);
    fn unpause_contract(ref self: TContractState);
}

#[derive(Drop, Serde, Clone)]
pub struct Bet {
    pub bet_type: u8,
    pub numbers: Span<u64>,
    pub amount: u256,
}

#[derive(Drop, Serde, starknet::Store, Copy)]
pub struct Game {
    pub player: ContractAddress,
    pub total_bet_amount: u256,
    pub status: u8, // 0=betting, 1=spinning, 2=completed
    pub winning_number: u64,
    pub total_payout: u256,
    pub created_at: u64,
    pub entropy_sources: felt252, // Store the entropy hash used
}

#[starknet::contract]
pub mod RouletteG {
    use core::array::ArrayTrait;
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, get_block_number,
        get_block_timestamp, get_tx_info,
    };
    use starknet::storage::{
        Map, StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapReadAccess,
        StorageMapWriteAccess,
    };
    use openzeppelin::token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::security::reentrancyguard::ReentrancyGuardComponent;
    use core::poseidon::poseidon_hash_span;
    use super::{Game, Bet};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: ReentrancyGuardComponent, storage: reentrancy_guard, event: ReentrancyGuardEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    impl ReentrancyGuardInternalImpl = ReentrancyGuardComponent::InternalImpl<ContractState>;

    const MIN_BET_AMOUNT: u256 = 1000;
    const MAX_BETS_PER_GAME: u32 = 20;
    const HOUSE_EDGE_BPS: u16 = 200; // 2%

    #[storage]
    struct Storage {
        games: Map<u64, Game>,
        next_game_id: u64,
        player_active_game: Map<ContractAddress, u64>,
        
        // Flexible bet storage - allows different bet amounts
        game_bet_types: Map<(u64, u32), u8>,
        game_bet_amounts: Map<(u64, u32), u256>,
        game_bet_numbers: Map<(u64, u32, u32), u64>, // (game_id, bet_index, number_index) -> number
        game_bet_number_counts: Map<(u64, u32), u32>, // (game_id, bet_index) -> count of numbers
        game_bet_count: Map<u64, u32>,
        
        token_address: ContractAddress,
        fee_address: ContractAddress,
        house_balance: u256,
        
        // Economic safeguards
        min_bet_amount: u256,
        max_bet_amount: u256,
        total_active_bets: u256, // Track total potential payouts
        
        // FIXED: Proper user balance tracking for initial deposits
        user_balances: Map<ContractAddress, u256>, // Track user's available balance (initial deposit + winnings - bets)
        withdrawal_fee_bps: u16, // Withdrawal fee in basis points (200 = 2%)
        
        // Emergency controls
        is_paused: bool,
        
        // Additional entropy storage for randomness
        entropy_nonce: u256,
        
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        reentrancy_guard: ReentrancyGuardComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        GameCreated: GameCreated,
        BetPlaced: BetPlaced,
        WheelSpun: WheelSpun,
        PlayerWon: PlayerWon,
        GameEnded: GameEnded,
        FeeAddressChanged: FeeAddressChanged,
        HouseFundsWithdrawn: HouseFundsWithdrawn,
        UserWithdrawal: UserWithdrawal,
        ContractPaused: ContractPaused,
        ContractUnpaused: ContractUnpaused,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    pub struct GameCreated {
        #[key]
        pub game_id: u64,
        pub player_address: ContractAddress,
        pub initial_bet_amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct BetPlaced {
        #[key]
        pub game_id: u64,
        pub player_address: ContractAddress,
        pub bet_type: u8,
        pub bet_amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct WheelSpun {
        #[key]
        pub game_id: u64,
        pub winning_number: u64,
        pub total_payout: u256,
        pub entropy_hash: felt252,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PlayerWon {
        #[key]
        pub game_id: u64,
        pub player_address: ContractAddress,
        pub payout_amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct GameEnded {
        #[key]
        pub game_id: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct FeeAddressChanged {
        pub old_address: ContractAddress,
        pub new_address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    pub struct HouseFundsWithdrawn {
        pub amount: u256,
        pub to_address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    pub struct UserWithdrawal {
        #[key]
        pub user: ContractAddress,
        pub amount: u256,
        pub fee: u256,
        pub net_amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ContractPaused {
        pub timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ContractUnpaused {
        pub timestamp: u64,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        token_address: ContractAddress,
        fee_address: ContractAddress,
        owner: ContractAddress,
        min_bet_amount: u256,
        max_bet_amount: u256,
    ) {
        self.ownable.initializer(owner);
        self.token_address.write(token_address);
        self.next_game_id.write(1);
        self.fee_address.write(fee_address);
        self.house_balance.write(0);
        self.min_bet_amount.write(min_bet_amount);
        self.max_bet_amount.write(max_bet_amount);
        self.withdrawal_fee_bps.write(200); // 2% withdrawal fee
        self.is_paused.write(false);
        self.total_active_bets.write(0);
        self.entropy_nonce.write(1);
    }

    #[abi(embed_v0)]
    impl IRouletteGame of super::IRouletteGame<ContractState> {
        fn create_game(ref self: ContractState, bet_amount: u256) -> u64 {
            assert(!self.is_paused.read(), 'Contract is paused');
            self.reentrancy_guard.start();
            
            let player_address = get_caller_address();
            
            // Check for active games
            let active_game = self.player_active_game.read(player_address);
            if active_game != 0 {
                let game = self.games.read(active_game);
                assert(game.status == 2, 'You already have an active game');
            }
            
            // Validate bet amount with proper bounds
            assert(bet_amount >= self.min_bet_amount.read(), 'Bet amount too small');
            assert(bet_amount <= self.max_bet_amount.read(), 'Bet amount too large');
            assert(bet_amount > 0, 'Bet amount must be positive');
            
            let token = ERC20ABIDispatcher { contract_address: self.token_address.read() };
            
            // Validate allowance and balance before transfer
            let allowance = token.allowance(player_address, get_contract_address());
            assert(allowance >= bet_amount, 'Insufficient allowance');
            
            let player_balance = token.balance_of(player_address);
            assert(player_balance >= bet_amount, 'Insufficient balance');

            // Transfer tokens (external call first)
            let success = token.transfer_from(
                player_address, 
                get_contract_address(), 
                bet_amount
            );
            assert(success, 'Transfer failed');

            // FIXED: Add the deposited amount to user's available balance
            let current_user_balance = self.user_balances.read(player_address);
            self.user_balances.write(player_address, current_user_balance + bet_amount);

            // Update state after successful transfer
            let game_id = self.next_game_id.read();
            
            let new_game = Game {
                player: player_address,
                total_bet_amount: bet_amount,
                status: 0,
                winning_number: 0,
                total_payout: 0,
                created_at: get_block_timestamp(),
                entropy_sources: 0,
            };
            
            self.games.write(game_id, new_game);
            self.player_active_game.write(player_address, game_id);
            self.next_game_id.write(game_id + 1);
            self.game_bet_count.write(game_id, 0);
            
            self.emit(GameCreated { game_id, player_address, initial_bet_amount: bet_amount });
            
            self.reentrancy_guard.end();
            game_id
        }

        // FIXED: Added bet_amount parameter back - users specify how much they want to bet
        fn place_bet(ref self: ContractState, bet_type: u8, bet_numbers: Array<u64>, bet_amount: u256) -> bool {
            assert(!self.is_paused.read(), 'Contract is paused');
            let player_address = get_caller_address();
            
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            let game = self.games.read(game_id);
            assert(game.status == 0, 'Game not in betting phase');
            
            let current_bet_count = self.game_bet_count.read(game_id);
            assert(current_bet_count < MAX_BETS_PER_GAME, 'Maximum bets reached');
            
            // Validate bet amount
            assert(bet_amount > 0, 'Bet amount must be positive');
            assert(bet_amount >= self.min_bet_amount.read(), 'Bet amount too small');
            assert(bet_amount <= self.max_bet_amount.read(), 'Bet amount too large');
            
            // FIXED: Check if user has enough balance from their initial deposit
            let current_user_balance = self.user_balances.read(player_address);
            assert(current_user_balance >= bet_amount, 'Insufficient user balance');
            
            // Comprehensive bet validation
            self.validate_bet_complete(bet_type, @bet_numbers);
            
            // Calculate potential payout and check house can cover it
            let multiplier = self.get_accurate_payout_multiplier(bet_type);
            let potential_payout = bet_amount * multiplier;
            let new_total_active = self.total_active_bets.read() + potential_payout;
            assert(self.house_balance.read() >= new_total_active, 'Insufficient house funds');
            
            // FIXED: Deduct bet amount from user's available balance
            self.user_balances.write(player_address, current_user_balance - bet_amount);
            
            // Store bet information in separate mappings
            self.game_bet_types.write((game_id, current_bet_count), bet_type);
            self.game_bet_amounts.write((game_id, current_bet_count), bet_amount);
            self.game_bet_number_counts.write((game_id, current_bet_count), bet_numbers.len());
            
            // Store each number individually
            let mut i = 0;
            loop {
                if i >= bet_numbers.len() {
                    break;
                }
                self.game_bet_numbers.write((game_id, current_bet_count, i), *bet_numbers.at(i));
                i += 1;
            };
            
            self.game_bet_count.write(game_id, current_bet_count + 1);
            self.total_active_bets.write(new_total_active);
            
            self.emit(BetPlaced { game_id, player_address, bet_type, bet_amount });
            
            true
        }

        fn spin_wheel(ref self: ContractState) -> u64 {
            assert(!self.is_paused.read(), 'Contract is paused');
            let player_address = get_caller_address();
            
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            let mut game = self.games.read(game_id);
            assert(game.status == 0, 'Game not ready for spinning');
            
            let bet_count = self.game_bet_count.read(game_id);
            assert(bet_count > 0, 'No bets placed');
            
            // Generate secure randomness using mixed entropy
            let entropy_hash = self.mixed_entropy_randomness();
            let randomness: u256 = entropy_hash.into();
            
            // Generate winning number (0-36) using mixed entropy
            let winning_number: u64 = (randomness % 37).try_into().unwrap();
            
            // Calculate payouts with house edge
            let total_payout = self.calculate_payouts_with_edge(game_id, winning_number);
            
            // Update game state
            game.status = 2;
            game.winning_number = winning_number;
            game.total_payout = total_payout;
            game.entropy_sources = entropy_hash;
            self.games.write(game_id, game);
            
            // FIXED: Add winnings to user's balance (with 2% fee already deducted)
            if total_payout > 0 {
                let current_user_balance = self.user_balances.read(game.player);
                self.user_balances.write(game.player, current_user_balance + total_payout);
                self.emit(PlayerWon { game_id, player_address: game.player, payout_amount: total_payout });
            }
            
            // FIXED: Calculate house profit correctly - lost bets go to house
            let total_bet_amount_used = self.calculate_total_bet_amount_used(game_id);
            let house_profit = if total_bet_amount_used > total_payout {
                total_bet_amount_used - total_payout
            } else {
                0
            };
            
            if house_profit > 0 {
                self.house_balance.write(self.house_balance.read() + house_profit);
            }
            
            // Reduce active bets tracking
            let bet_total = self.calculate_total_bet_potential_payout(game_id);
            self.total_active_bets.write(self.total_active_bets.read() - bet_total);
            
            self.emit(WheelSpun { game_id, winning_number, total_payout, entropy_hash });
            
            winning_number
        }

        fn end_game(ref self: ContractState) -> u64 {
            let player_address = get_caller_address();
            
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            let game = self.games.read(game_id);
            assert(game.status == 2, 'Game not completed');
            
            // Game is completed, clear active game
            self.player_active_game.write(player_address, 0);
            
            self.emit(GameEnded { game_id });
            
            game_id
        }

        fn get_active_game_id(self: @ContractState, player_address: ContractAddress) -> u64 {
            self.player_active_game.read(player_address)
        }

        fn get_game_result(self: @ContractState, player_address: ContractAddress) -> (u64, u256) {
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            let game = self.games.read(game_id);
            (game.winning_number, game.total_payout)
        }

        fn get_game_status(self: @ContractState, player_address: ContractAddress) -> u8 {
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            let game = self.games.read(game_id);
            game.status
        }

        fn get_game_bets(self: @ContractState, player_address: ContractAddress) -> Array<Bet> {
            let game_id = self.player_active_game.read(player_address);
            assert(game_id != 0, 'No active game found');
            
            let bet_count = self.game_bet_count.read(game_id);
            let mut bets = ArrayTrait::new();
            
            let mut i = 0;
            loop {
                if i >= bet_count {
                    break;
                }
                
                let bet_type = self.game_bet_types.read((game_id, i));
                let bet_amount = self.game_bet_amounts.read((game_id, i));
                let number_count = self.game_bet_number_counts.read((game_id, i));
                
                let mut numbers = ArrayTrait::new();
                let mut j = 0;
                loop {
                    if j >= number_count {
                        break;
                    }
                    numbers.append(self.game_bet_numbers.read((game_id, i, j)));
                    j += 1;
                };
                
                let bet = Bet {
                    bet_type,
                    numbers: numbers.span(),
                    amount: bet_amount,
                };
                bets.append(bet);
                i += 1;
            };
            
            bets
        }

        fn get_fee_address(self: @ContractState) -> ContractAddress {
            self.fee_address.read()
        }

        fn set_fee_address(ref self: ContractState, new_address: ContractAddress) {
            self.ownable.assert_only_owner();
            
            let old_address = self.fee_address.read();
            self.fee_address.write(new_address);
            
            self.emit(FeeAddressChanged { old_address, new_address });
        }

        fn get_house_balance(self: @ContractState) -> u256 {
            self.house_balance.read()
        }

        fn withdraw_house_funds(ref self: ContractState, amount: u256) {
            self.ownable.assert_only_owner();
            
            let house_balance = self.house_balance.read();
            let available_balance = house_balance - self.total_active_bets.read();
            assert(amount <= available_balance, 'Insufficient available balance');
            
            let token = ERC20ABIDispatcher { contract_address: self.token_address.read() };
            let success = token.transfer(self.fee_address.read(), amount);
            assert(success, 'Withdrawal failed');
            
            self.house_balance.write(house_balance - amount);
            
            self.emit(HouseFundsWithdrawn { amount, to_address: self.fee_address.read() });
        }

        fn deposit_funds(ref self: ContractState, amount: u256) {
            let caller = get_caller_address();
            let token = ERC20ABIDispatcher { contract_address: self.token_address.read() };
            
            let success = token.transfer_from(caller, get_contract_address(), amount);
            assert(success, 'Deposit failed');
            
            self.house_balance.write(self.house_balance.read() + amount);
        }

        fn set_bet_limits(ref self: ContractState, min_bet: u256, max_bet: u256) {
            self.ownable.assert_only_owner();
            assert(min_bet < max_bet, 'Invalid limits');
            assert(min_bet > 0, 'Min bet must be positive');
            
            self.min_bet_amount.write(min_bet);
            self.max_bet_amount.write(max_bet);
        }

        // SECURE USER WITHDRAWAL - Only allows users to withdraw their available balance
        fn withdraw_user_winnings(ref self: ContractState, amount: u256) {
            self.reentrancy_guard.start();
            
            let caller = get_caller_address();
            assert(amount > 0, 'Amount must be positive');
            
            // SECURITY: Check user's available balance (unused deposits + winnings)
            let user_balance = self.user_balances.read(caller);
            assert(amount <= user_balance, 'Insufficient user balance');
            
            // Calculate 2% withdrawal fee
            let fee_bps = self.withdrawal_fee_bps.read();
            let fee_amount = amount * fee_bps.into() / 10000;
            let net_amount = amount - fee_amount;
            
            // SECURITY: Update user balance BEFORE external calls (CEI pattern)
            self.user_balances.write(caller, user_balance - amount);
            
            let token = ERC20ABIDispatcher { contract_address: self.token_address.read() };
            
            // Transfer fee to fee address
            if fee_amount > 0 {
                let fee_success = token.transfer(self.fee_address.read(), fee_amount);
                assert(fee_success, 'Fee transfer failed');
            }
            
            // Transfer remaining amount to user
            let success = token.transfer(caller, net_amount);
            assert(success, 'Withdrawal failed');
            
            self.emit(UserWithdrawal { user: caller, amount, fee: fee_amount, net_amount });
            
            self.reentrancy_guard.end();
        }

        fn get_user_balance(self: @ContractState, user: ContractAddress) -> u256 {
            self.user_balances.read(user)
        }

        fn pause_contract(ref self: ContractState) {
            self.ownable.assert_only_owner();
            self.is_paused.write(true);
            self.emit(ContractPaused { timestamp: get_block_timestamp() });
        }

        fn unpause_contract(ref self: ContractState) {
            self.ownable.assert_only_owner();
            self.is_paused.write(false);
            self.emit(ContractUnpaused { timestamp: get_block_timestamp() });
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        // MIXED ENTROPY RANDOMNESS - Combines multiple unpredictable sources
        fn mixed_entropy_randomness(ref self: ContractState) -> felt252 {
            let current_block = get_block_number();
            let timestamp = get_block_timestamp();
            let tx_info = get_tx_info().unbox();
            let tx_hash = tx_info.transaction_hash;
            let contract_address = get_contract_address();
            let caller_address = get_caller_address();
            
            // Additional entropy sources
            let nonce = tx_info.nonce;
            let signature_hash = if tx_info.signature.len() > 0 {
                *tx_info.signature.at(0)
            } else {
                0
            };
            
            // Use and increment entropy nonce for additional uniqueness
            let current_entropy_nonce = self.entropy_nonce.read();
            self.entropy_nonce.write(current_entropy_nonce + 1);
            
            // Convert u256 to felt252 using try_into().unwrap()
            let entropy_nonce_felt: felt252 = current_entropy_nonce.try_into().unwrap();
            let max_fee_felt: felt252 = tx_info.max_fee.try_into().unwrap();
            
            // Combine all entropy sources using Poseidon hash
            let entropy_array = array![
                timestamp.into(),
                tx_hash,
                contract_address.into(),
                caller_address.into(),
                nonce,
                signature_hash,
                current_block.into(),
                entropy_nonce_felt,
                max_fee_felt
            ];
            
            poseidon_hash_span(entropy_array.span())
        }

        // Calculate total bet amount actually used in the game
        fn calculate_total_bet_amount_used(self: @ContractState, game_id: u64) -> u256 {
            let bet_count = self.game_bet_count.read(game_id);
            let mut total_used = 0;
            
            let mut i = 0;
            loop {
                if i >= bet_count {
                    break;
                }
                
                let bet_amount = self.game_bet_amounts.read((game_id, i));
                total_used += bet_amount;
                
                i += 1;
            };
            
            total_used
        }

        fn validate_bet_complete(self: @ContractState, bet_type: u8, numbers: @Array<u64>) {
            if bet_type == 0 {
                // Straight up
                assert(numbers.len() == 1, 'Straight needs 1 number');
                assert(*numbers.at(0) <= 36, 'Number must be 0-36');
            } else if bet_type == 1 {
                // Split
                assert(numbers.len() == 2, 'Split needs 2 numbers');
                let num1 = *numbers.at(0);
                let num2 = *numbers.at(1);
                assert(num1 <= 36 && num2 <= 36, 'Numbers must be 0-36');
                assert(self.are_adjacent_on_board(num1, num2), 'Numbers not adjacent');
            } else if bet_type == 2 {
                // Street
                assert(numbers.len() == 3, 'Street needs 3 numbers');
                assert(self.is_valid_street_bet(numbers), 'Invalid street');
            } else if bet_type == 3 {
                // Corner
                assert(numbers.len() == 4, 'Corner needs 4 numbers');
                assert(self.is_valid_corner_bet(numbers), 'Invalid corner');
            } else if bet_type == 4 {
                // Six line
                assert(numbers.len() == 6, 'Six line needs 6 numbers');
                assert(self.is_valid_six_line_bet(numbers), 'Invalid six line');
            } else if bet_type == 5 {
                // Column
                assert(numbers.len() == 1, 'Column needs 1 value');
                assert(*numbers.at(0) >= 1 && *numbers.at(0) <= 3, 'Column must be 1-3');
            } else if bet_type == 6 {
                // Dozen
                assert(numbers.len() == 1, 'Dozen needs 1 value');
                assert(*numbers.at(0) >= 1 && *numbers.at(0) <= 3, 'Dozen must be 1-3');
            } else if bet_type == 7 {
                // Red/Black
                assert(numbers.len() == 1, 'Color needs 1 value');
                assert(*numbers.at(0) <= 1, 'Color must be 0 or 1');
            } else if bet_type == 8 {
                // Odd/Even
                assert(numbers.len() == 1, 'Odd/Even needs 1 value');
                assert(*numbers.at(0) <= 1, 'Type must be 0 or 1');
            } else if bet_type == 9 {
                // Low/High
                assert(numbers.len() == 1, 'Low/High needs 1 value');
                assert(*numbers.at(0) <= 1, 'Type must be 0 or 1');
            } else {
                assert(false, 'Invalid bet type');
            }
        }

        fn are_adjacent_on_board(self: @ContractState, num1: u64, num2: u64) -> bool {
            if num1 == 0 || num2 == 0 {
                return false;
            }
            
            let diff = if num1 > num2 { num1 - num2 } else { num2 - num1 };
            
            // Horizontal adjacency
            if diff == 1 {
                let row1 = (num1 - 1) / 3;
                let row2 = (num2 - 1) / 3;
                return row1 == row2;
            }
            
            // Vertical adjacency
            diff == 3
        }

        fn is_valid_street_bet(self: @ContractState, numbers: @Array<u64>) -> bool {
            if numbers.len() != 3 {
                return false;
            }
            
            let first = *numbers.at(0);
            if first == 0 || first > 34 {
                return false;
            }
            
            // Street must start with number where (num-1) % 3 == 0
            if (first - 1) % 3 != 0 {
                return false;
            }
            
            // Verify consecutive numbers
            let second = *numbers.at(1);
            let third = *numbers.at(2);
            second == first + 1 && third == first + 2
        }

        fn is_valid_corner_bet(self: @ContractState, numbers: @Array<u64>) -> bool {
            if numbers.len() != 4 {
                return false;
            }
            
            // Enhanced corner validation
            let mut sorted_nums = ArrayTrait::new();
            let mut i = 0;
            loop {
                if i >= 4 {
                    break;
                }
                sorted_nums.append(*numbers.at(i));
                i += 1;
            };
            
            // Basic validation - should form a 2x2 square on the board
            let first = *sorted_nums.at(0);
            first > 0 && first <= 32 && (first - 1) % 3 != 2
        }

        fn is_valid_six_line_bet(self: @ContractState, numbers: @Array<u64>) -> bool {
            if numbers.len() != 6 {
                return false;
            }
            
            let first = *numbers.at(0);
            if first == 0 || first > 31 {
                return false;
            }
            
            (first - 1) % 3 == 0
        }

        fn calculate_payouts_with_edge(self: @ContractState, game_id: u64, winning_number: u64) -> u256 {
            let mut total_payout = 0;
            let bet_count = self.game_bet_count.read(game_id);
            
            let mut i = 0;
            loop {
                if i >= bet_count {
                    break;
                }
                
                let bet_type = self.game_bet_types.read((game_id, i));
                let bet_amount = self.game_bet_amounts.read((game_id, i));
                let number_count = self.game_bet_number_counts.read((game_id, i));
                
                if self.is_winning_bet_accurate(bet_type, game_id, i, number_count, winning_number) {
                    let multiplier = self.get_accurate_payout_multiplier(bet_type);
                    let base_payout = bet_amount * multiplier;
                    
                    // Apply house edge (2% fee deducted from winnings)
                    let payout_with_edge = base_payout * (10000 - HOUSE_EDGE_BPS.into()) / 10000;
                    total_payout += payout_with_edge;
                }
                
                i += 1;
            };
            
            total_payout
        }

        fn calculate_total_bet_potential_payout(self: @ContractState, game_id: u64) -> u256 {
            let mut total_potential = 0;
            let bet_count = self.game_bet_count.read(game_id);
            
            let mut i = 0;
            loop {
                if i >= bet_count {
                    break;
                }
                
                let bet_type = self.game_bet_types.read((game_id, i));
                let bet_amount = self.game_bet_amounts.read((game_id, i));
                let multiplier = self.get_accurate_payout_multiplier(bet_type);
                total_potential += bet_amount * multiplier;
                
                i += 1;
            };
            
            total_potential
        }

        fn is_winning_bet_accurate(
            self: @ContractState, 
            bet_type: u8, 
            game_id: u64,
            bet_index: u32,
            number_count: u32,
            winning_number: u64
        ) -> bool {
            if bet_type == 0 {
                // Straight up
                let bet_number = self.game_bet_numbers.read((game_id, bet_index, 0));
                bet_number == winning_number
            } else if bet_type == 1 || bet_type == 2 || bet_type == 3 || bet_type == 4 {
                // Split, Street, Corner, Six line
                let mut i = 0;
                loop {
                    if i >= number_count {
                        break false;
                    }
                    let bet_number = self.game_bet_numbers.read((game_id, bet_index, i));
                    if bet_number == winning_number {
                        break true;
                    }
                    i += 1;
                }
            } else if bet_type == 5 {
                // Column
                if winning_number == 0 { 
                    false 
                } else {
                    let column = self.game_bet_numbers.read((game_id, bet_index, 0));
                    (winning_number - 1) % 3 + 1 == column
                }
            } else if bet_type == 6 {
                // Dozen
                if winning_number == 0 { 
                    false 
                } else {
                    let dozen = self.game_bet_numbers.read((game_id, bet_index, 0));
                    let winning_dozen = (winning_number - 1) / 12 + 1;
                    dozen == winning_dozen
                }
            } else if bet_type == 7 {
                // Red/Black
                if winning_number == 0 {
                    false
                } else {
                    let is_red = self.is_red_number(winning_number);
                    let bet_red = self.game_bet_numbers.read((game_id, bet_index, 0)) == 1;
                    is_red == bet_red
                }
            } else if bet_type == 8 {
                // Odd/Even
                if winning_number == 0 { 
                    false 
                } else {
                    let is_odd = winning_number % 2 == 1;
                    let bet_odd = self.game_bet_numbers.read((game_id, bet_index, 0)) == 1;
                    is_odd == bet_odd
                }
            } else if bet_type == 9 {
                // Low/High
                if winning_number == 0 { 
                    false 
                } else {
                    let is_low = winning_number <= 18;
                    let bet_low = self.game_bet_numbers.read((game_id, bet_index, 0)) == 0;
                    is_low == bet_low
                }
            } else {
                false
            }
        }

        fn get_accurate_payout_multiplier(self: @ContractState, bet_type: u8) -> u256 {
            if bet_type == 0 {
                36 // Straight: 35:1 + original
            } else if bet_type == 1 {
                18 // Split: 17:1 + original
            } else if bet_type == 2 {
                12 // Street: 11:1 + original
            } else if bet_type == 3 {
                9  // Corner: 8:1 + original
            } else if bet_type == 4 {
                6  // Six line: 5:1 + original
            } else if bet_type == 5 {
                3  // Column: 2:1 + original
            } else if bet_type == 6 {
                3  // Dozen: 2:1 + original
            } else if bet_type == 7 {
                2  // Red/Black: 1:1 + original
            } else if bet_type == 8 {
                2  // Odd/Even: 1:1 + original
            } else if bet_type == 9 {
                2  // Low/High: 1:1 + original
            } else {
                1
            }
        }

        // FIXED: Correct red number mapping for European roulette
        fn is_red_number(self: @ContractState, number: u64) -> bool {
            // Standard European roulette red numbers
            if number == 1 || number == 3 || number == 5 || number == 7 || number == 9 {
                true
            } else if number == 12 || number == 14 || number == 16 || number == 18 {
                true
            } else if number == 30 || number == 32 || number == 34 || number == 36 {
                true
            } else if number == 19 || number == 21 || number == 23 || number == 25 || number == 27 {
                true
            } else {
                false
            }
        }
    }
}
