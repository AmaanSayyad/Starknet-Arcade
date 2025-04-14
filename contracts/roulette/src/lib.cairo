use starknet::{ContractAddress, contract_address_const};

#[derive(Copy, Drop, Serde, starknet::Store, PartialEq)]
enum RouletteState {
    #[default]
    Idle,
    Spinning,
    Complete,
}

// This struct is only for external interfaces, not for storage
#[derive(Drop, Serde)]
struct Bet {
    amount: u256,
    numbers: Array<u8>,
}

// The constant arrays for validation
const MAX_ROULETTE_NUMBER: u8 = 36;

#[starknet::interface]
pub trait IRouletteContract<TContractState> {
    fn spin_roulette(ref self: TContractState, bets: Array<Bet>) -> u64;
    fn get_spin_details(self: @TContractState, request_id: u64) -> (SpinDetails, Array<Bet>);
    fn get_contract_balance(self: @TContractState, token: ContractAddress) -> u256;
    fn withdraw(ref self: TContractState, token: ContractAddress, amount: u256);
    fn fund_contract(ref self: TContractState, token: ContractAddress, amount: u256);
    fn update_pragma_vrf_contract_address(ref self: TContractState, new_address: ContractAddress);
}

#[derive(Copy, Drop, Serde, starknet::Store)]
struct SpinDetails {
    player: ContractAddress,
    total_bet_amount: u256,
    winning_number: u8,
    state: RouletteState,
    request_id: u64,
    total_payout: u256,
}

#[starknet::interface]
pub trait IPragmaVRF<TContractState> {
    fn receive_random_words(
        ref self: TContractState,
        requester_address: ContractAddress,
        request_id: u64,
        random_words: Span<felt252>,
        calldata: Array<felt252>,
    );
}

pub fn ETH() -> ContractAddress {
    contract_address_const::<0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7>()
}

    #[starknet::contract]
mod RouletteContract {
    use starknet::{ContractAddress, get_caller_address, get_contract_address, get_block_number};
    use starknet::storage::{
        StoragePointerWriteAccess, StoragePointerReadAccess, Map, StoragePathEntry
    };
    use pragma_lib::abi::{IRandomnessDispatcher, IRandomnessDispatcherTrait};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use super::{RouletteState, Bet, SpinDetails, ETH, MAX_ROULETTE_NUMBER};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        pragma_vrf_contract_address: ContractAddress,
        min_block_number_storage: Map<u64, u64>, // Map of spin_id to min block number
        spins: Map<u64, SpinDetails>,
        bet_numbers: Map<(u64, u32, u32), u8>, // Map of (request_id, bet_index, number_index) to number
        bet_amounts: Map<(u64, u32), u256>, // Map of (request_id, bet_index) to bet amount  
        bet_counts: Map<u64, u32>, // Count of bets for each request_id
        bet_number_counts: Map<(u64, u32), u32>, // Count of numbers for each bet
        token_address: ContractAddress,
        house_edge_bps: u16, // House edge in basis points (e.g., 200 = 2%)
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        RouletteSpinStarted: RouletteSpinStarted,
        RouletteSpinCompleted: RouletteSpinCompleted,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    struct RouletteSpinStarted {
        request_id: u64,
        player: ContractAddress,
        total_bet_amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct RouletteSpinCompleted {
        request_id: u64,
        player: ContractAddress,
        winning_number: u8,
        total_payout: u256,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        pragma_vrf_contract_address: ContractAddress,
        owner: ContractAddress,
        token_address: ContractAddress,
        house_edge_bps: u16,
    ) {
        self.pragma_vrf_contract_address.write(pragma_vrf_contract_address);
        self.ownable.initializer(owner);
        self.token_address.write(token_address);
        self.house_edge_bps.write(house_edge_bps);
    }

    #[abi(embed_v0)]
    impl Roulette of super::IRouletteContract<ContractState> {
        fn spin_roulette(ref self: ContractState, bets: Array<Bet>) -> u64 {
            // Validate bets are not empty
            assert!(!bets.is_empty(), "No bets provided");
            
            // Calculate total bet amount and validate bets
            let mut total_bet_amount: u256 = 0;
            
            // Validate all bets
            let bets_span = bets.span();
            let mut i: usize = 0;
            while i < bets_span.len() {
                // Get bet reference without copying the struct
                let bet_ref = bets_span.at(i);
                
                // Ensure bet amount is greater than 0
                assert!(*bet_ref.amount > 0, "Bet amount must be greater than 0");
                
                // Validate the numbers in the bet
                self._validate_bet_numbers(bet_ref.numbers.span());
                
                // Add to total bet amount
                total_bet_amount += *bet_ref.amount;
                
                i += 1;
            };
            
            // Check if contract has enough funds to pay maximum possible winnings
            let token = IERC20Dispatcher { contract_address: self.token_address.read() };
            let contract_balance = token.balance_of(get_contract_address());
            let max_possible_payout = self._calculate_max_possible_payout(bets.span());
            assert!(contract_balance >= max_possible_payout, "Contract doesn't have enough funds to cover potential payout");
            
            // Transfer total bet amount from player to contract
            let player = get_caller_address();
            let this = get_contract_address();
            
            // Check allowance
            assert!(
                token.allowance(player, this) >= total_bet_amount,
                "Contract does not have enough allowance",
            );
            
            // Transfer tokens
            let transfer_success = token.transfer_from(player, this, total_bet_amount);
            assert!(transfer_success, "Transfer failed");
            
            // Request randomness
            let randomness_contract_address = self.pragma_vrf_contract_address.read();
            let randomness_dispatcher = IRandomnessDispatcher {
                contract_address: randomness_contract_address,
            };
            
            // Prepare for VRF callback
            let callback_fee_limit: u128 = 10_000_000_000_000_000; // 0.01 ETH
            let publish_delay: u64 = 1; // minimal delay
            let num_words: u64 = 1; // we only need one random word
            let seed: u64 = get_block_number(); // use block_number as seed
            let calldata: Array<felt252> = array![];
            
            // Approve the randomness contract to transfer the callback fee
            let eth_dispatcher = IERC20Dispatcher {
                contract_address: ETH() // ETH Contract Address
            };
            
            eth_dispatcher.approve(
                randomness_contract_address,
                (callback_fee_limit + callback_fee_limit / 5).into(),
            );
            
            // Request the randomness
            let request_id = randomness_dispatcher.request_random(
                seed,
                get_contract_address(),
                callback_fee_limit,
                publish_delay,
                num_words,
                calldata,
            );
            
            // Create new spin details
            let spin_details = SpinDetails {
                player,
                total_bet_amount,
                winning_number: 0, // Will be set in the callback
                state: RouletteState::Spinning,
                request_id,
                total_payout: 0, // Will be calculated in the callback
            };
            
            // Store spin details
            self.spins.entry(request_id).write(spin_details);
            
            // Store bets in storage-compatible format
            self._store_bets(request_id, bets);
            
            // Emit event
            self.emit(
                RouletteSpinStarted { 
                    request_id, 
                    player, 
                    total_bet_amount,
                }
            );
            
            // Store the minimum block number for validation in callback
            let current_block_number = get_block_number();
            self.min_block_number_storage.entry(request_id).write(current_block_number + publish_delay);
            
            request_id
        }
        
        fn get_spin_details(self: @ContractState, request_id: u64) -> (SpinDetails, Array<Bet>) {
            (self.spins.entry(request_id).read(), self._retrieve_bets(request_id))
        }
        
        fn get_contract_balance(self: @ContractState, token: ContractAddress) -> u256 {
            let token = IERC20Dispatcher { contract_address: token };
            token.balance_of(get_contract_address())
        }
        
        fn withdraw(ref self: ContractState, token: ContractAddress, amount: u256) {
            // Only owner can withdraw
            self.ownable.assert_only_owner();
            
            let token = IERC20Dispatcher { contract_address: token };
            let contract_balance = token.balance_of(get_contract_address());
            assert!(contract_balance >= amount, "Not enough balance to withdraw");
            
            let success = token.transfer(get_caller_address(), amount);
            assert!(success, "Withdrawal failed");
        }
        
        fn fund_contract(ref self: ContractState, token: ContractAddress, amount: u256) {
            let token = IERC20Dispatcher { contract_address: token };
            let caller = get_caller_address();
            let this = get_contract_address();
            
            // Check allowance
            assert!(
                token.allowance(caller, this) >= amount,
                "Contract does not have enough allowance",
            );
            
            // Transfer tokens
            let transfer_success = token.transfer_from(caller, this, amount);
            assert!(transfer_success, "Funding failed");
        }
        
        fn update_pragma_vrf_contract_address(ref self: ContractState, new_address: ContractAddress) {
            // Only owner can update the Pragma VRF contract address
            self.ownable.assert_only_owner();
            self.pragma_vrf_contract_address.write(new_address);
        }
    }
    
    #[abi(embed_v0)]
    impl PragmaVRF of super::IPragmaVRF<ContractState> {
        fn receive_random_words(
            ref self: ContractState,
            requester_address: ContractAddress,
            request_id: u64,
            random_words: Span<felt252>,
            calldata: Array<felt252>,
        ) {
            // Verify the caller is the Pragma randomness contract
            let caller_address = get_caller_address();
            assert(
                caller_address == self.pragma_vrf_contract_address.read(),
                'caller not randomness contract',
            );
            
            // Verify the minimum block number
            let current_block_number = get_block_number();
            let min_block_number = self.min_block_number_storage.entry(request_id).read();
            assert(min_block_number <= current_block_number, 'block number issue');
            
            // Get the random word and reduce it to 0-36 (European roulette)
            let random_word = *random_words.at(0);
            let random_word_u256: u256 = random_word.into();
            let winning_number: u8 = (random_word_u256 % 37).try_into().unwrap(); // 0-36
            
            // Get the spin details
            let mut spin = self.spins.entry(request_id).read();
            
            // Ensure the spin is in the Spinning state
            assert(spin.state == RouletteState::Spinning, 'Spin not in spinning state');
            
            // Retrieve bets from storage and calculate winnings
            let bets = self._retrieve_bets(request_id);
            let (total_payout, _) = self._calculate_payout(bets.span(), winning_number);
            
            // Update spin details
            spin.winning_number = winning_number;
            spin.state = RouletteState::Complete;
            spin.total_payout = total_payout;
            self.spins.entry(request_id).write(spin);
            
            // Process payment if player won anything
            if total_payout > 0 {
                let token = IERC20Dispatcher { contract_address: self.token_address.read() };
                let success = token.transfer(spin.player, total_payout);
                assert!(success, "Payout failed");
            }
            
            // Emit completion event
            self.emit(
                RouletteSpinCompleted { 
                    request_id,
                    player: spin.player,
                    winning_number,
                    total_payout,
                }
            );
        }
    }
    
    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        // Store bets in storage-compatible format
        fn _store_bets(ref self: ContractState, request_id: u64, bets: Array<Bet>) {
            let bets_span = bets.span();
            
            // Store the count of bets
            self.bet_counts.entry(request_id).write(bets_span.len().try_into().unwrap());
            
            // For each bet, store its amount and numbers
            let mut i: u32 = 0;
            let bets_len = bets_span.len();
            
            while i < bets_len.try_into().unwrap() {
                // Get the bet reference without copying the struct
                let bet_ref = bets_span.at(i.into());
                
                // Store the bet amount
                self.bet_amounts.entry((request_id, i)).write(*bet_ref.amount);
                
                // Get the numbers span
                let numbers_span = bet_ref.numbers.span();
                let numbers_len: u32 = numbers_span.len().try_into().unwrap();
                
                // Store the count of numbers for this bet
                self.bet_number_counts.entry((request_id, i)).write(numbers_len);
                
                // Store each number individually
                let mut j: u32 = 0;
                while j < numbers_len {
                    let number = *numbers_span.at(j.into());
                    self.bet_numbers.entry((request_id, i, j)).write(number);
                    j += 1;
                };
                
                i += 1;
            };
        }
        
        // Retrieve bets from storage in Array format for calculations
        fn _retrieve_bets(self: @ContractState, request_id: u64) -> Array<Bet> {
            let mut bets = ArrayTrait::new();
            let bet_count: u32 = self.bet_counts.entry(request_id).read();
            
            let mut i: u32 = 0;
            while i < bet_count {
                // Get bet amount
                let amount = self.bet_amounts.entry((request_id, i)).read();
                
                // Get number count for this bet
                let number_count = self.bet_number_counts.entry((request_id, i)).read();
                
                // Create array for numbers
                let mut numbers = ArrayTrait::new();
                
                // Retrieve each number
                let mut j: u32 = 0;
                while j < number_count {
                    let number = self.bet_numbers.entry((request_id, i, j)).read();
                    numbers.append(number);
                    j += 1;
                };
                
                // Create Bet struct and add to array
                let bet = Bet { amount, numbers };
                bets.append(bet);
                
                i += 1;
            };
            
            bets
        }
        
        // Validate that all numbers in a bet are valid (0-36)
        fn _validate_bet_numbers(self: @ContractState, numbers: Span<u8>) {
            let mut i: usize = 0;
            while i < numbers.len() {
                let number = *numbers.at(i);
                assert!(number <= MAX_ROULETTE_NUMBER, "Invalid roulette number");
                i += 1;
            };
        }
        
        // Calculate the maximum possible payout for a set of bets
        fn _calculate_max_possible_payout(self: @ContractState, bets: Span<Bet>) -> u256 {
            let mut max_payout: u256 = 0;
            let mut i: usize = 0;
            
            while i < bets.len() {
                // Access bet fields without copying
                let bet_ref = bets.at(i);
                let amount = bet_ref.amount;
                let numbers_count = bet_ref.numbers.len();
                
                // Calculate the payout multiplier based on bet type
                let payout_multiplier = self._get_payout_multiplier(numbers_count);
                
                // Calculate payout without house edge
                let bet_payout = *amount * payout_multiplier;
                
                // Add to max possible payout
                max_payout += bet_payout;
                
                i += 1;
            };
            
            max_payout
        }
        
        // Calculate the payout for all bets based on the winning number
        fn _calculate_payout(
            self: @ContractState, bets: Span<Bet>, winning_number: u8
        ) -> (u256, Array<(u256, bool)>) {
            let mut total_payout: u256 = 0;
            let mut bet_results = ArrayTrait::new();
            let house_edge_bps = self.house_edge_bps.read();
            
            let mut i: usize = 0;
            while i < bets.len() {
                // Access bet fields without copying
                let bet_ref = bets.at(i);
                let amount = bet_ref.amount;
                let numbers_span = bet_ref.numbers.span();
                let numbers_count = numbers_span.len();
                
                let mut won = false;
                let mut bet_payout: u256 = 0;
                
                // Check if the winning number is in the bet numbers
                let mut j: usize = 0;
                while j < numbers_span.len() {
                    if *numbers_span.at(j) == winning_number {
                        won = true;
                        break;
                    }
                    j += 1;
                };
                
                if won {
                    // Calculate payout based on bet type
                    let payout_multiplier = self._get_payout_multiplier(numbers_count);
                    
                    // Calculate base payout 
                    bet_payout = *amount * payout_multiplier;
                    
                    // Apply house edge
                    // payout = bet_payout * (10000 - house_edge_bps) / 10000
                    bet_payout = bet_payout * (10000 - house_edge_bps.into()) / 10000;
                    
                    // Add to total payout
                    total_payout += bet_payout;
                }
                
                bet_results.append((bet_payout, won));
                i += 1;
            };
            
            (total_payout, bet_results)
        }
        
        // Get the payout multiplier based on the number of numbers in the bet
        fn _get_payout_multiplier(self: @ContractState, numbers_count: usize) -> u256 {
            if numbers_count == 1 {
                return 36; // Straight up - 35:1 plus original bet
            } else if numbers_count == 2 {
                return 18; // Split - 17:1 plus original bet
            } else if numbers_count == 3 {
                return 12; // Street - 11:1 plus original bet
            } else if numbers_count == 4 {
                return 9; // Corner/Basket - 8:1 plus original bet
            } else if numbers_count == 6 {
                return 6; // Six line - 5:1 plus original bet
            } else if numbers_count == 12 {
                return 3; // Column/Dozen - 2:1 plus original bet
            } else if numbers_count == 18 {
                return 2; // Red/Black/Even/Odd/1-18/19-36 - 1:1 plus original bet
            } else {
                return 1; // Invalid bet type defaults to 1
            } 
        }
    }
}