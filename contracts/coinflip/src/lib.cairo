use starknet::{ContractAddress, contract_address_const};

#[derive(Copy, Drop, Serde, starknet::Store, PartialEq)]
enum FlipState {
    #[default]
    Idle,
    Flipping,
    Complete,
}

#[derive(Copy, Drop, Serde, starknet::Store, PartialEq)]
#[allow(starknet::store_no_default_variant)]
enum FlipChoice {
    Tails, // 0
    Heads, // 1
}

#[derive(Copy, Drop, Serde, starknet::Store)]
struct FlipDetails {
    player: ContractAddress,
    amount: u256,
    choice: FlipChoice,
    result: Option<FlipChoice>,
    state: FlipState,
    request_id: u64,
}

#[starknet::interface]
pub trait ICoinFlip<TContractState> {
    fn flip_coin(ref self: TContractState, choice: FlipChoice, amount: u256) -> u64;
    fn get_flip_details(self: @TContractState, request_id: u64) -> FlipDetails;
    fn get_contract_balance(self: @TContractState, token: ContractAddress) -> u256;
    fn withdraw(ref self: TContractState, token: ContractAddress, amount: u256);
    fn fund_contract(ref self: TContractState, token: ContractAddress, amount: u256);
    fn update_pragma_vrf_contract_address(ref self: TContractState, new_address: ContractAddress);
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
mod CoinFlip {
    use starknet::{ContractAddress, get_caller_address, get_contract_address, get_block_number};
    use starknet::storage::{
        StoragePointerWriteAccess, StoragePointerReadAccess, Map, StoragePathEntry,
    };
    use pragma_lib::abi::{IRandomnessDispatcher, IRandomnessDispatcherTrait};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use super::{FlipState, FlipChoice, FlipDetails, ETH};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        pragma_vrf_contract_address: ContractAddress,
        min_block_number_storage: Map<u64, u64>, // Map of flip_id to min block number
        flips: Map<u64, FlipDetails>,
        token_address: ContractAddress,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        CoinFlipStarted: CoinFlipStarted,
        CoinFlipCompleted: CoinFlipCompleted,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    struct CoinFlipStarted {
        request_id: u64,
        player: ContractAddress,
        amount: u256,
        choice: FlipChoice,
    }

    #[derive(Drop, starknet::Event)]
    struct CoinFlipCompleted {
        request_id: u64,
        player: ContractAddress,
        choice: FlipChoice,
        result: FlipChoice,
        won: bool,
        amount: u256,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        pragma_vrf_contract_address: ContractAddress,
        owner: ContractAddress,
        token_address: ContractAddress,
    ) {
        self.pragma_vrf_contract_address.write(pragma_vrf_contract_address);
        self.ownable.initializer(owner);
        self.token_address.write(token_address);
    }

    #[abi(embed_v0)]
    impl CoinFlip of super::ICoinFlip<ContractState> {
        fn flip_coin(ref self: ContractState, choice: FlipChoice, amount: u256) -> u64 {
            // Check if amount is valid
            assert!(amount > 0, "Amount must be greater than 0");
            
            // Check if contract has enough funds to pay if player wins
            let token = IERC20Dispatcher { contract_address: self.token_address.read() };
            let contract_balance = token.balance_of(get_contract_address());
            assert!(contract_balance >= amount, "Contract doesn't have enough funds to pay potential winnings");
            
            // Transfer bet amount from player to contract
            let player = get_caller_address();
            let this = get_contract_address();
            
            // Check allowance
            assert!(
                token.allowance(player, this) >= amount,
                "Contract does not have enough allowance",
            );
            
            // Transfer tokens
            let transfer_success = token.transfer_from(player, this, amount);
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
            let seed: u64 = get_block_number(); // use flip_id as seed
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

            // Create new flip            
            let flip_details = FlipDetails {
                player,
                amount,
                choice,
                result: Option::None,
                state: FlipState::Flipping,
                request_id,
            };

            // Store flip details
            self.flips.entry(request_id).write(flip_details);
            
            // Emit event
            self.emit(
                CoinFlipStarted { 
                    request_id, 
                    player, 
                    amount, 
                    choice 
                }
            );
            
            // Store the minimum block number for validation in callback
            let current_block_number = get_block_number();
            self.min_block_number_storage.entry(request_id).write(current_block_number + publish_delay);
            
            request_id
        }
        
        fn get_flip_details(self: @ContractState, request_id: u64) -> FlipDetails {
            self.flips.entry(request_id).read()
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
            
            // Get the random word and reduce it to 0 or 1
            let random_word = *random_words.at(0);
            let random_word_u256: u256 = random_word.into();
            let result = random_word_u256 % 2; // 0 for tails, 1 for heads
            
            // Convert to FlipChoice
            let flip_result = if result == 0 {
                FlipChoice::Tails
            } else {
                FlipChoice::Heads
            };
            
            // Update flip details
            let mut flip = self.flips.entry(request_id).read();
            
            // Ensure the flip is in the Flipping state
            assert(flip.state == FlipState::Flipping, 'Flip not in flipping state');
            
            flip.result = Option::Some(flip_result);
            flip.state = FlipState::Complete;
            flip.request_id = request_id;
            self.flips.entry(request_id).write(flip);
            
            // Check if player won
            let won = flip_result == flip.choice;
            
            // Process payment if player won
            if won {
                let token = IERC20Dispatcher { contract_address: self.token_address.read() };
                let payout = flip.amount * 2; // Double the bet
                let user_share = payout * 98000 / 100000; // 98% of the payout
                let success = token.transfer(flip.player, user_share);
                assert!(success, "Payout failed");
            }
            
            // Emit completion event
            self.emit(
                CoinFlipCompleted { 
                    request_id,
                    player: flip.player,
                    choice: flip.choice,
                    result: flip_result,
                    won,
                    amount: if won { flip.amount * 2 } else { 0 }
                }
            );
        }
    }
}