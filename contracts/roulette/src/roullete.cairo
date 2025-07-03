//class hash 0x056887ddd237c0095c3eae528b1443cad3eb4002793fb55f30f71e713ffae7dd
//deployed at 0x07ed0942bbe9f65ddcbdab2ccf42770295d9caa588df4c5c57e24621fe50a822


//final contract 
use starknet::ContractAddress;

#[starknet::interface]
pub trait IRouletteGame<TContractState> {
    // Enhanced multi-bet placement system
    fn place_multiple_bets(ref self: TContractState, bets: Array<IndividualBet>) -> Array<u64>;
    fn place_single_bet(ref self: TContractState, bet_type: u8, numbers: Array<u64>, amount: u256) -> u64;
    fn spin_wheel(ref self: TContractState) -> u64;
    
    // View functions
    fn get_user_balance(self: @TContractState, user: ContractAddress) -> u256;
    fn get_house_balance(self: @TContractState) -> u256;
    fn get_last_result(self: @TContractState, player: ContractAddress) -> (u64, u256);
    fn get_pending_bets(self: @TContractState, player: ContractAddress) -> Array<Bet>;
    fn get_max_payout(self: @TContractState) -> u256;
    fn get_bet_type_info(self: @TContractState, bet_type: u8) -> (felt252, u256, felt252);
    
    // Owner functions
    fn deposit_house_funds(ref self: TContractState, amount: u256);
    fn withdraw_house_funds(ref self: TContractState, amount: u256);
    fn set_bet_limits(ref self: TContractState, min_bet: u256, max_bet: u256);
    fn set_max_payout_percentage(ref self: TContractState, percentage: u16);
    
    // User withdrawal (no fee on original deposits)
    fn withdraw_user_winnings(ref self: TContractState, amount: u256);
    
    // Admin functions
    fn pause_contract(ref self: TContractState);
    fn unpause_contract(ref self: TContractState);
    fn cleanup_old_bets(ref self: TContractState, player: ContractAddress);
}

// Enhanced bet structure for multi-betting
#[derive(Drop, Serde, Clone)]
pub struct IndividualBet {
    pub bet_type: u8,
    pub numbers: Array<u64>,
    pub amount: u256,
}

#[derive(Drop, Serde, Clone)]
pub struct Bet {
    pub bet_type: u8,
    pub numbers: Span<u64>,
    pub amount: u256,
}

#[derive(Drop, Serde, starknet::Store, Copy)]
pub struct PlayerSession {
    pub player: ContractAddress,
    pub total_bet_amount: u256,
    pub bet_count: u32,
    pub last_spin_result: u64,
    pub last_payout: u256,
    pub created_at: u64,
    pub original_deposit: u256,
}

#[starknet::contract]
pub mod RouletteGameFinal {
    use core::array::ArrayTrait;
    use core::num::traits::{Zero, Pow};
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
    use super::{PlayerSession, Bet, IndividualBet};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: ReentrancyGuardComponent, storage: reentrancy_guard, event: ReentrancyGuardEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl ReentrancyGuardInternalImpl = ReentrancyGuardComponent::InternalImpl<ContractState>;

    const MIN_BET_AMOUNT: u256 = 1000;
    const MAX_BETS_PER_SPIN: u32 = 50;
    const HOUSE_EDGE_BPS: u16 = 200; // 2%
    const WITHDRAWAL_FEE_BPS: u16 = 200; // 2% only on winnings
    const DEFAULT_MAX_PAYOUT_PERCENTAGE: u16 = 1000; // 10% of house balance
    const MAX_U256: u256 = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

    #[storage]
    struct Storage {
        // Player sessions
        player_sessions: Map<ContractAddress, PlayerSession>,
        
        // Optimized bet storage
        player_bet_data: Map<(ContractAddress, u32), (u8, u256)>,
        player_bet_numbers_packed: Map<(ContractAddress, u32), felt252>,
        
        // Contract state
        token_address: ContractAddress,
        house_balance: u256,
        min_bet_amount: u256,
        max_bet_amount: u256,
        max_payout_percentage: u16,
        
        // FIXED: Proper user balance tracking
        user_balances: Map<ContractAddress, u256>,
        user_original_deposits: Map<ContractAddress, u256>,
        
        // Contract controls
        is_paused: bool,
        entropy_nonce: u256,
        
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        reentrancy_guard: ReentrancyGuardComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        MultipleBetsPlaced: MultipleBetsPlaced,
        SingleBetPlaced: SingleBetPlaced,
        WheelSpun: WheelSpun,
        PlayerWon: PlayerWon,
        PlayerLost: PlayerLost,
        HouseFundsDeposited: HouseFundsDeposited,
        HouseFundsWithdrawn: HouseFundsWithdrawn,
        UserWithdrawal: UserWithdrawal,
        BetRejectedInsufficientHouseFunds: BetRejectedInsufficientHouseFunds,
        OldBetsCleanedUp: OldBetsCleanedUp,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    pub struct MultipleBetsPlaced {
        #[key]
        pub player: ContractAddress,
        pub bet_count: u32,
        pub total_amount: u256,
        pub bet_details: Array<(u8, u256)>,
    }

    #[derive(Drop, starknet::Event)]
    pub struct SingleBetPlaced {
        #[key]
        pub player: ContractAddress,
        pub bet_type: u8,
        pub bet_amount: u256,
        pub bet_numbers: Array<u64>,
    }

    #[derive(Drop, starknet::Event)]
    pub struct WheelSpun {
        #[key]
        pub player: ContractAddress,
        pub winning_number: u64,
        pub total_payout: u256,
        pub entropy_hash: felt252,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PlayerWon {
        #[key]
        pub player: ContractAddress,
        pub payout_amount: u256,
    }

    // FIXED: Added PlayerLost event
    #[derive(Drop, starknet::Event)]
    pub struct PlayerLost {
        #[key]
        pub player: ContractAddress,
        pub lost_amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct HouseFundsDeposited {
        pub amount: u256,
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
        pub is_original_deposit: bool,
    }

    #[derive(Drop, starknet::Event)]
    pub struct BetRejectedInsufficientHouseFunds {
        #[key]
        pub player: ContractAddress,
        pub required_payout: u256,
        pub available_house_balance: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct OldBetsCleanedUp {
        #[key]
        pub player: ContractAddress,
        pub bets_cleaned: u32,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        token_address: ContractAddress,
        owner: ContractAddress,
        min_bet_amount: u256,
        max_bet_amount: u256,
    ) {
        self.ownable.initializer(owner);
        self.token_address.write(token_address);
        self.house_balance.write(0);
        self.min_bet_amount.write(min_bet_amount);
        self.max_bet_amount.write(max_bet_amount);
        self.max_payout_percentage.write(DEFAULT_MAX_PAYOUT_PERCENTAGE);
        self.is_paused.write(false);
        self.entropy_nonce.write(1);
    }

    #[abi(embed_v0)]
    impl IRouletteGame of super::IRouletteGame<ContractState> {
        // Enhanced multi-bet placement system
        fn place_multiple_bets(ref self: ContractState, bets: Array<IndividualBet>) -> Array<u64> {
            assert(!self.is_paused.read(), 'Contract is paused');
            assert(bets.len() > 0, 'No bets provided');
            assert(bets.len() <= MAX_BETS_PER_SPIN, 'Too many bets');
            
            self.reentrancy_guard.start();
            
            let player = get_caller_address();
            let mut session = self.player_sessions.read(player);
            
            // Initialize session if new player
            if session.player.is_zero() {
                session = PlayerSession {
                    player,
                    total_bet_amount: 0,
                    bet_count: 0,
                    last_spin_result: 0,
                    last_payout: 0,
                    created_at: get_block_timestamp(),
                    original_deposit: 0,
                };
            }
            
            // Calculate total bet amount and validate each bet
            let mut total_bet_amount = 0;
            let mut max_potential_payout = 0;
            let mut bet_details = ArrayTrait::new();
            let mut i = 0;
            
            loop {
                if i >= bets.len() {
                    break;
                }
                
                let bet = bets.at(i);
                let bet_type = *bet.bet_type;
                let bet_amount = *bet.amount;
                
                // Validate individual bet
                assert(bet_amount >= self.min_bet_amount.read(), 'Bet amount too small');
                assert(bet_amount <= self.max_bet_amount.read(), 'Bet amount too large');
                self.validate_bet_complete(bet_type, bet.numbers);
                
                // Check for overflow
                assert(total_bet_amount <= MAX_U256 - bet_amount, 'Total bet overflow');
                total_bet_amount += bet_amount;
                
                // Calculate potential payout for this bet
                let multiplier = self.get_accurate_payout_multiplier(bet_type);
                let potential_payout = bet_amount * multiplier * (10000 - HOUSE_EDGE_BPS.into()) / 10000;
                
                // Check for overflow
                assert(max_potential_payout <= MAX_U256 - potential_payout, 'Payout overflow');
                max_potential_payout += potential_payout;
                
                // Store bet details for event
                bet_details.append((bet_type, bet_amount));
                
                i += 1;
            };
            
            // Check house balance can cover maximum potential payout
            let house_balance = self.house_balance.read();
            let max_allowed_payout = house_balance * self.max_payout_percentage.read().into() / 10000;
            
            if max_potential_payout > max_allowed_payout {
                self.emit(BetRejectedInsufficientHouseFunds {
                    player,
                    required_payout: max_potential_payout,
                    available_house_balance: house_balance,
                });
                self.reentrancy_guard.end();
                assert(false, 'House cannot cover max payout');
            }
            
            // Transfer tokens from user
            let token = ERC20ABIDispatcher { contract_address: self.token_address.read() };
            let allowance = token.allowance(player, get_contract_address());
            assert(allowance >= total_bet_amount, 'Insufficient allowance');
            
            let success = token.transfer_from(player, get_contract_address(), total_bet_amount);
            assert(success, 'Transfer failed');
            
            // FIXED: Proper balance tracking - DON'T add bet amount to user balance
            // The bet amount is now in the contract, not in user's balance
            let current_deposits = self.user_original_deposits.read(player);
            self.user_original_deposits.write(player, current_deposits + total_bet_amount);
            
            // Store bets efficiently
            let mut bet_indices = ArrayTrait::new();
            let mut j = 0;
            
            loop {
                if j >= bets.len() {
                    break;
                }
                
                let bet = bets.at(j);
                let bet_index = session.bet_count + j;
                
                // Store bet data
                self.player_bet_data.write((player, bet_index), (*bet.bet_type, *bet.amount));
                
                // Pack numbers efficiently
                let packed_numbers = self.pack_numbers(bet.numbers);
                self.player_bet_numbers_packed.write((player, bet_index), packed_numbers);
                
                bet_indices.append(bet_index.into());
                j += 1;
            };
            
            // Update session
            session.total_bet_amount += total_bet_amount;
            session.bet_count += bets.len();
            session.original_deposit += total_bet_amount;
            self.player_sessions.write(player, session);
            
            self.emit(MultipleBetsPlaced {
                player,
                bet_count: bets.len(),
                total_amount: total_bet_amount,
                bet_details,
            });
            
            self.reentrancy_guard.end();
            bet_indices
        }

        // Single bet placement for simpler use cases
        fn place_single_bet(ref self: ContractState, bet_type: u8, numbers: Array<u64>, amount: u256) -> u64 {
            let bet = IndividualBet {
                bet_type,
                numbers,
                amount,
            };
            let mut bets = ArrayTrait::new();
            bets.append(bet);
            
            let indices = self.place_multiple_bets(bets);
            *indices.at(0)
        }

        fn spin_wheel(ref self: ContractState) -> u64 {
            assert(!self.is_paused.read(), 'Contract is paused');
            self.reentrancy_guard.start();
            
            let player = get_caller_address();
            let mut session = self.player_sessions.read(player);
            assert(!session.player.is_zero(), 'No bets placed');
            assert(session.bet_count > 0, 'No bets to spin');
            
            // Generate winning number using mixed entropy
            let entropy_hash = self.mixed_entropy_randomness();
            let randomness: u256 = entropy_hash.into();
            let winning_number: u64 = (randomness % 37).try_into().unwrap();
            
            // Calculate total payout with house edge
            let total_payout = self.calculate_payouts_with_edge(player, session.bet_count, winning_number);
            
            // Update session
            session.last_spin_result = winning_number;
            session.last_payout = total_payout;
            
            // FIXED: Proper balance handling after spin
            if total_payout > 0 {
                // Player won - add winnings to balance
                let current_balance = self.user_balances.read(player);
                self.user_balances.write(player, current_balance + total_payout);
                self.emit(PlayerWon { player, payout_amount: total_payout });
            } else {
                // Player lost - emit loss event (balance already deducted when betting)
                self.emit(PlayerLost { player, lost_amount: session.total_bet_amount });
            }
            
            // House profit calculation - house gets the difference
            let house_profit = if session.total_bet_amount > total_payout {
                session.total_bet_amount - total_payout
            } else {
                0
            };
            
            if house_profit > 0 {
                self.house_balance.write(self.house_balance.read() + house_profit);
            }
            
            // Reset session for next round
            session.total_bet_amount = 0;
            session.bet_count = 0;
            self.player_sessions.write(player, session);
            
            self.emit(WheelSpun { player, winning_number, total_payout, entropy_hash });
            
            self.reentrancy_guard.end();
            winning_number
        }

        fn get_user_balance(self: @ContractState, user: ContractAddress) -> u256 {
            self.user_balances.read(user)
        }

        fn get_house_balance(self: @ContractState) -> u256 {
            self.house_balance.read()
        }

        fn get_max_payout(self: @ContractState) -> u256 {
            let house_balance = self.house_balance.read();
            house_balance * self.max_payout_percentage.read().into() / 10000
        }

        fn get_last_result(self: @ContractState, player: ContractAddress) -> (u64, u256) {
            let session = self.player_sessions.read(player);
            (session.last_spin_result, session.last_payout)
        }

        fn get_pending_bets(self: @ContractState, player: ContractAddress) -> Array<Bet> {
            let session = self.player_sessions.read(player);
            let mut bets = ArrayTrait::new();
            
            let mut i = 0;
            loop {
                if i >= session.bet_count {
                    break;
                }
                
                let (bet_type, bet_amount) = self.player_bet_data.read((player, i));
                let packed_numbers = self.player_bet_numbers_packed.read((player, i));
                let numbers = self.unpack_numbers(packed_numbers, bet_type);
                
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

        fn get_bet_type_info(self: @ContractState, bet_type: u8) -> (felt252, u256, felt252) {
            if bet_type == 0 {
                ('Straight', 35, 'Single number bet')
            } else if bet_type == 1 {
                ('Split', 17, 'Two adjacent numbers')
            } else if bet_type == 2 {
                ('Street', 11, 'Three numbers in a row')
            } else if bet_type == 3 {
                ('Corner', 8, 'Four numbers in a square')
            } else if bet_type == 4 {
                ('Six Line', 5, 'Six numbers in two rows')
            } else if bet_type == 5 {
                ('Column', 2, 'Entire column')
            } else if bet_type == 6 {
                ('Dozen', 2, '12 numbers (1-12, 13-24, 25-36)')
            } else if bet_type == 7 {
                ('Red/Black', 1, 'Color bet')
            } else if bet_type == 8 {
                ('Odd/Even', 1, 'Odd or even numbers')
            } else if bet_type == 9 {
                ('Low/High', 1, '1-18 or 19-36')
            } else {
                ('Unknown', 0, 'Invalid bet type')
            }
        }

        fn deposit_house_funds(ref self: ContractState, amount: u256) {
            self.ownable.assert_only_owner();
            
            let caller = get_caller_address();
            let token = ERC20ABIDispatcher { contract_address: self.token_address.read() };
            
            let success = token.transfer_from(caller, get_contract_address(), amount);
            assert(success, 'Deposit failed');
            
            let current_balance = self.house_balance.read();
            assert(current_balance <= MAX_U256 - amount, 'House balance overflow');
            
            self.house_balance.write(current_balance + amount);
            self.emit(HouseFundsDeposited { amount });
        }

        fn withdraw_house_funds(ref self: ContractState, amount: u256) {
            self.ownable.assert_only_owner();
            self.reentrancy_guard.start();
            
            let house_balance = self.house_balance.read();
            assert(amount <= house_balance, 'Insufficient house balance');
            
            let token = ERC20ABIDispatcher { contract_address: self.token_address.read() };
            let owner = self.ownable.owner();
            let success = token.transfer(owner, amount);
            assert(success, 'Withdrawal failed');
            
            self.house_balance.write(house_balance - amount);
            self.emit(HouseFundsWithdrawn { amount, to_address: owner });
            
            self.reentrancy_guard.end();
        }

        fn set_bet_limits(ref self: ContractState, min_bet: u256, max_bet: u256) {
            self.ownable.assert_only_owner();
            assert(min_bet < max_bet, 'Invalid limits');
            assert(min_bet > 0, 'Min bet must be positive');
            
            self.min_bet_amount.write(min_bet);
            self.max_bet_amount.write(max_bet);
        }

        fn set_max_payout_percentage(ref self: ContractState, percentage: u16) {
            self.ownable.assert_only_owner();
            assert(percentage <= 5000, 'Max 50% of house balance');
            assert(percentage >= 100, 'Min 1% of house balance');
            
            self.max_payout_percentage.write(percentage);
        }

        fn withdraw_user_winnings(ref self: ContractState, amount: u256) {
            self.reentrancy_guard.start();
            
            let caller = get_caller_address();
            assert(amount > 0, 'Amount must be positive');
            
            let user_balance = self.user_balances.read(caller);
            let original_deposits = self.user_original_deposits.read(caller);
            assert(amount <= user_balance, 'Insufficient user balance');
            
            let mut fee_amount = 0;
            let mut is_original_deposit = false;
            
            if amount <= original_deposits {
                is_original_deposit = true;
                self.user_original_deposits.write(caller, original_deposits - amount);
            } else {
                let winnings_amount = amount - original_deposits;
                fee_amount = winnings_amount * WITHDRAWAL_FEE_BPS.into() / 10000;
                self.user_original_deposits.write(caller, 0);
            }
            
            let net_amount = amount - fee_amount;
            
            self.user_balances.write(caller, user_balance - amount);
            
            let token = ERC20ABIDispatcher { contract_address: self.token_address.read() };
            
            if fee_amount > 0 {
                let house_balance = self.house_balance.read();
                assert(house_balance <= MAX_U256 - fee_amount, 'House balance overflow');
                self.house_balance.write(house_balance + fee_amount);
            }
            
            let success = token.transfer(caller, net_amount);
            assert(success, 'Withdrawal failed');
            
            self.emit(UserWithdrawal {
                user: caller,
                amount,
                fee: fee_amount,
                net_amount,
                is_original_deposit,
            });
            
            self.reentrancy_guard.end();
        }

        fn pause_contract(ref self: ContractState) {
            self.ownable.assert_only_owner();
            self.is_paused.write(true);
        }

        fn unpause_contract(ref self: ContractState) {
            self.ownable.assert_only_owner();
            self.is_paused.write(false);
        }

        fn cleanup_old_bets(ref self: ContractState, player: ContractAddress) {
            let mut session = self.player_sessions.read(player);
            let bets_cleaned = session.bet_count;
            
            session.bet_count = 0;
            session.total_bet_amount = 0;
            self.player_sessions.write(player, session);
            
            self.emit(OldBetsCleanedUp { player, bets_cleaned });
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn mixed_entropy_randomness(ref self: ContractState) -> felt252 {
            let current_block = get_block_number();
            let timestamp = get_block_timestamp();
            let tx_info = get_tx_info().unbox();
            let tx_hash = tx_info.transaction_hash;
            let contract_address = get_contract_address();
            let caller_address = get_caller_address();
            let nonce = tx_info.nonce;
            
            let signature_hash = if tx_info.signature.len() > 0 {
                *tx_info.signature.at(0)
            } else {
                0
            };
            
            let current_entropy_nonce = self.entropy_nonce.read();
            self.entropy_nonce.write(current_entropy_nonce + 1);
            
            let entropy_array = array![
                timestamp.into(),
                tx_hash,
                contract_address.into(),
                caller_address.into(),
                nonce,
                signature_hash,
                current_block.into(),
                current_entropy_nonce.try_into().unwrap(),
                tx_info.max_fee.try_into().unwrap()
            ];
            
            poseidon_hash_span(entropy_array.span())
        }

        fn pack_numbers(self: @ContractState, numbers: @Array<u64>) -> felt252 {
            let mut packed: u256 = 0;
            let mut i = 0;
            
            loop {
                if i >= numbers.len() || i >= 4 {
                    break;
                }
                
                let number: u256 = (*numbers.at(i)).into();
                packed = packed + (number * Pow::pow(256_u256, i));
                i += 1;
            };
            
            packed.try_into().unwrap()
        }

        fn unpack_numbers(self: @ContractState, packed: felt252, bet_type: u8) -> Array<u64> {
            let mut numbers = ArrayTrait::new();
            let packed_u256: u256 = packed.into();
            
            let count = self.get_expected_number_count(bet_type);
            let mut i = 0;
            
            loop {
                if i >= count {
                    break;
                }
                
                let number = (packed_u256 / Pow::pow(256_u256, i)) % 256;
                numbers.append(number.try_into().unwrap());
                i += 1;
            };
            
            numbers
        }

        fn get_expected_number_count(self: @ContractState, bet_type: u8) -> u32 {
            if bet_type == 0 { 1 }      // Straight
            else if bet_type == 1 { 2 } // Split
            else if bet_type == 2 { 3 } // Street
            else if bet_type == 3 { 4 } // Corner
            else if bet_type == 4 { 6 } // Six line
            else { 1 }                  // Others
        }

        fn validate_bet_complete(self: @ContractState, bet_type: u8, numbers: @Array<u64>) {
            if bet_type == 0 {
                assert(numbers.len() == 1, 'Straight needs 1 number');
                assert(*numbers.at(0) <= 36, 'Number must be 0-36');
            } else if bet_type == 1 {
                assert(numbers.len() == 2, 'Split needs 2 numbers');
                let num1 = *numbers.at(0);
                let num2 = *numbers.at(1);
                assert(num1 <= 36 && num2 <= 36, 'Numbers must be 0-36');
                assert(self.are_adjacent_on_board(num1, num2), 'Numbers not adjacent');
            } else if bet_type == 2 {
                assert(numbers.len() == 3, 'Street needs 3 numbers');
                assert(self.is_valid_street_bet(numbers), 'Invalid street');
            } else if bet_type == 3 {
                assert(numbers.len() == 4, 'Corner needs 4 numbers');
                assert(self.is_valid_corner_bet(numbers), 'Invalid corner');
            } else if bet_type == 4 {
                assert(numbers.len() == 6, 'Six line needs 6 numbers');
                assert(self.is_valid_six_line_bet(numbers), 'Invalid six line');
            } else if bet_type == 5 {
                assert(numbers.len() == 1, 'Column needs 1 value');
                assert(*numbers.at(0) >= 1 && *numbers.at(0) <= 3, 'Column must be 1-3');
            } else if bet_type == 6 {
                assert(numbers.len() == 1, 'Dozen needs 1 value');
                assert(*numbers.at(0) >= 1 && *numbers.at(0) <= 3, 'Dozen must be 1-3');
            } else if bet_type == 7 {
                assert(numbers.len() == 1, 'Color needs 1 value');
                assert(*numbers.at(0) <= 1, 'Color must be 0 or 1');
            } else if bet_type == 8 {
                assert(numbers.len() == 1, 'Odd/Even needs 1 value');
                assert(*numbers.at(0) <= 1, 'Type must be 0 or 1');
            } else if bet_type == 9 {
                assert(numbers.len() == 1, 'Low/High needs 1 value');
                assert(*numbers.at(0) <= 1, 'Type must be 0 or 1');
            } else {
                assert(false, 'Invalid bet type');
            }
        }

        fn calculate_payouts_with_edge(self: @ContractState, player: ContractAddress, bet_count: u32, winning_number: u64) -> u256 {
            let mut total_payout = 0;
            
            let mut i = 0;
            loop {
                if i >= bet_count {
                    break;
                }
                
                let (bet_type, bet_amount) = self.player_bet_data.read((player, i));
                let packed_numbers = self.player_bet_numbers_packed.read((player, i));
                
                if self.is_winning_bet_packed(bet_type, packed_numbers, winning_number) {
                    let multiplier = self.get_accurate_payout_multiplier(bet_type);
                    let base_payout = bet_amount * multiplier;
                    
                    let payout_with_edge = base_payout * (10000 - HOUSE_EDGE_BPS.into()) / 10000;
                    
                    assert(total_payout <= MAX_U256 - payout_with_edge, 'Payout calculation overflow');
                    total_payout += payout_with_edge;
                }
                
                i += 1;
            };
            
            total_payout
        }

        fn is_winning_bet_packed(self: @ContractState, bet_type: u8, packed_numbers: felt252, winning_number: u64) -> bool {
            let numbers = self.unpack_numbers(packed_numbers, bet_type);
            
            if bet_type == 0 {
                *numbers.at(0) == winning_number
            } else if bet_type == 1 || bet_type == 2 || bet_type == 3 || bet_type == 4 {
                let mut i = 0;
                loop {
                    if i >= numbers.len() {
                        break false;
                    }
                    if *numbers.at(i) == winning_number {
                        break true;
                    }
                    i += 1;
                }
            } else if bet_type == 5 {
                if winning_number == 0 { 
                    false 
                } else {
                    let column = *numbers.at(0);
                    (winning_number - 1) % 3 + 1 == column
                }
            } else if bet_type == 6 {
                if winning_number == 0 { 
                    false 
                } else {
                    let dozen = *numbers.at(0);
                    let winning_dozen = (winning_number - 1) / 12 + 1;
                    dozen == winning_dozen
                }
            } else if bet_type == 7 {
                if winning_number == 0 {
                    false
                } else {
                    let is_red = self.is_red_number(winning_number);
                    let bet_red = *numbers.at(0) == 1;
                    is_red == bet_red
                }
            } else if bet_type == 8 {
                if winning_number == 0 { 
                    false 
                } else {
                    let is_odd = winning_number % 2 == 1;
                    let bet_odd = *numbers.at(0) == 1;
                    is_odd == bet_odd
                }
            } else if bet_type == 9 {
                if winning_number == 0 { 
                    false 
                } else {
                    let is_low = winning_number <= 18;
                    let bet_low = *numbers.at(0) == 0;
                    is_low == bet_low
                }
            } else {
                false
            }
        }

        fn get_accurate_payout_multiplier(self: @ContractState, bet_type: u8) -> u256 {
            if bet_type == 0 {
                36 // Straight: 35:1 + original bet
            } else if bet_type == 1 {
                18 // Split: 17:1 + original bet
            } else if bet_type == 2 {
                12 // Street: 11:1 + original bet
            } else if bet_type == 3 {
                9  // Corner: 8:1 + original bet
            } else if bet_type == 4 {
                6  // Six line: 5:1 + original bet
            } else if bet_type == 5 {
                3  // Column: 2:1 + original bet
            } else if bet_type == 6 {
                3  // Dozen: 2:1 + original bet
            } else if bet_type == 7 {
                2  // Red/Black: 1:1 + original bet
            } else if bet_type == 8 {
                2  // Odd/Even: 1:1 + original bet
            } else if bet_type == 9 {
                2  // Low/High: 1:1 + original bet
            } else {
                1
            }
        }

        fn are_adjacent_on_board(self: @ContractState, num1: u64, num2: u64) -> bool {
            if num1 == 0 || num2 == 0 {
                return false;
            }
            
            let diff = if num1 > num2 { num1 - num2 } else { num2 - num1 };
            
            if diff == 1 {
                let row1 = (num1 - 1) / 3;
                let row2 = (num2 - 1) / 3;
                return row1 == row2;
            }
            
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
            
            if (first - 1) % 3 != 0 {
                return false;
            }
            
            let second = *numbers.at(1);
            let third = *numbers.at(2);
            second == first + 1 && third == first + 2
        }

        fn is_valid_corner_bet(self: @ContractState, numbers: @Array<u64>) -> bool {
            if numbers.len() != 4 {
                return false;
            }
            
            let first = *numbers.at(0);
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

        fn is_red_number(self: @ContractState, number: u64) -> bool {
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
