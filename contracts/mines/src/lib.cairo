use starknet::ContractAddress;

#[starknet::interface]
pub trait IMinesGame<TContractState> {
    fn start_game(ref self: TContractState, bet_amount: u256, number_of_mines: u8) -> u64;
    fn open_tile(ref self: TContractState, tile_index: u8) -> bool; // returns true if safe, false if mine
    fn cash_out(ref self: TContractState) -> u256; // returns the payout amount
    fn get_game_state(self: @TContractState, player_address: ContractAddress) -> GameState;
    fn get_active_game_id(self: @TContractState, player_address: ContractAddress) -> u64;
    fn get_payout_multiplier(self: @TContractState, mines: u8, tiles_opened: u8) -> u256;
    fn set_payout_multiplier(ref self: TContractState, mines: u8, tiles_opened: u8, multiplier: u256);
    fn get_contract_balance(self: @TContractState) -> u256;
    fn withdraw(ref self: TContractState, amount: u256);
    fn fund_contract(ref self: TContractState, amount: u256);
}

#[derive(Copy, Drop, Serde, starknet::Store)]
struct Multiplier {
    mines: u8,
    tiles_opened: u8,
    multiplier: u256,
}

#[derive(Copy, Drop, Serde, starknet::Store, PartialEq)]
enum GameStatus {
    #[default]
    Inactive,
    Active,
    Completed,
    Failed,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
struct GameState {
    player: ContractAddress,
    bet_amount: u256,
    number_of_mines: u8,
    tiles_opened: u8,
    status: GameStatus,
    created_at: u64,
}

#[derive(Drop, Hash)]
pub struct Entropy {
    pub seed: u256,
    pub timestamp: u64,
    pub block_number: u64,
    pub player_address: ContractAddress,
    pub game_id: u64,
    pub tile_index: u8,
}

#[starknet::contract]
pub mod MinesGame {
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
    use openzeppelin::access::ownable::OwnableComponent;
    use super::{GameState, GameStatus, Entropy, Multiplier};

    const TOTAL_TILES: u8 = 25; // 5x5 grid
    const BASE_MULTIPLIER: u256 = 100; // 100 = 1.00x multiplier

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        games: Map<u64, GameState>,
        next_game_id: u64,
        player_active_game: Map<ContractAddress, u64>,
        payout_multipliers: Map<(u8, u8), u256>, // (mines, tiles_opened) -> multiplier
        token_address: ContractAddress,
        game_seed: u256,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameStarted: GameStarted,
        TileOpened: TileOpened,
        GameLost: GameLost,
        GameWon: GameWon,
        FeeAddressChanged: FeeAddressChanged,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    struct GameStarted {
        #[key]
        game_id: u64,
        player_address: ContractAddress,
        bet_amount: u256,
        number_of_mines: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct TileOpened {
        #[key]
        game_id: u64,
        player_address: ContractAddress,
        tile_index: u8,
        is_safe: bool,
        tiles_opened: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct GameLost {
        #[key]
        game_id: u64,
        player_address: ContractAddress,
        tiles_opened: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct GameWon {
        #[key]
        game_id: u64,
        player_address: ContractAddress,
        payout_amount: u256,
        tiles_opened: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct FeeAddressChanged {
        old_address: ContractAddress,
        new_address: ContractAddress,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        token_address: ContractAddress,
        owner: ContractAddress,
        multipliers: Array<Multiplier>
    ) {
        self.token_address.write(token_address);
        self.next_game_id.write(1);
        self.ownable.initializer(owner);
        
        // Initialize some base payout multipliers
        // These should be set properly by the owner after deployment
        // Format: (mines, tiles_opened) -> multiplier
        // E.g., (1, 1) -> 104 = 1.04x payout for 1 mine and 1 tile opened
        self._initialize_default_multipliers(multipliers);
    }

    #[abi(embed_v0)]
    impl MinesGame of super::IMinesGame<ContractState> {
        fn start_game(ref self: ContractState, bet_amount: u256, number_of_mines: u8) -> u64 {
            // Validate inputs
            assert!(bet_amount > 0, "Bet amount must be greater than 0");
            assert!(number_of_mines > 0, "Number of mines must be greater than 0");
            assert!(number_of_mines < TOTAL_TILES, "Too many mines");
            
            let player_address = get_caller_address();
            
            // Check if player already has an active game
            let active_game_id = self.player_active_game.read(player_address);
            if active_game_id != 0 {
                let game = self.games.read(active_game_id);
                assert!(game.status != GameStatus::Active, "You already have an active game");
            }
            
            // Check if the player has enough balance and allowance
            let token = IERC20Dispatcher { contract_address: self.token_address.read() };
            let player_balance = token.balance_of(player_address);
            assert!(player_balance >= bet_amount, "Insufficient balance for bet");
            
            let contract_address = get_contract_address();
            let allowance = token.allowance(player_address, contract_address);
            assert!(allowance >= bet_amount, "Insufficient allowance for bet");
            
            // Check if the contract has enough balance to potentially pay out
            let max_possible_payout = self._calculate_max_possible_payout(number_of_mines);
            let contract_balance = token.balance_of(contract_address);
            assert!(contract_balance >= max_possible_payout, "Contract doesn't have enough funds");
            
            // Transfer bet amount from player to contract
            let success = token.transfer_from(player_address, contract_address, bet_amount);
            assert!(success, "Transfer failed");
            
            // Create a new game
            let game_id = self.next_game_id.read();
            
            // Initialize game state
            let new_game = GameState {
                player: player_address,
                bet_amount: bet_amount,
                number_of_mines: number_of_mines,
                tiles_opened: 0,
                status: GameStatus::Active,
                created_at: get_block_timestamp(),
            };
            
            self.games.write(game_id, new_game);
            
            // Track player's active game
            self.player_active_game.write(player_address, game_id);
            
            // Increment game ID for next game
            self.next_game_id.write(game_id + 1);
            
            // Increment seed for better randomness
            self.game_seed.write(self.game_seed.read() + 1);
            
            // Emit event
            self.emit(GameStarted { game_id, player_address, bet_amount, number_of_mines });
            
            game_id
        }
        
        fn open_tile(ref self: ContractState, tile_index: u8) -> bool {
            // Validate tile index
            assert!(tile_index < TOTAL_TILES, "Invalid tile index");
            
            let player_address = get_caller_address();
            
            // Get player's active game
            let game_id = self.player_active_game.read(player_address);
            assert!(game_id != 0, "No active game found");
            
            // Get game state
            let mut game = self.games.read(game_id);
            assert!(game.status == GameStatus::Active, "Game not active");
            
            // Determine if the tile is a mine or safe
            let is_safe = self._is_tile_safe(
                player_address, 
                game_id, 
                tile_index, 
                game.tiles_opened, 
                game.number_of_mines
            );
            
            if is_safe {
                // Safe tile discovered
                game.tiles_opened += 1;
                
                // Update game state
                self.games.write(game_id, game);
                
                // Emit event
                self.emit(
                    TileOpened { 
                        game_id, 
                        player_address, 
                        tile_index, 
                        is_safe, 
                        tiles_opened: game.tiles_opened 
                    }
                );
                
                true // Indicate safe tile
            } else {
                // Mine discovered, game over
                game.status = GameStatus::Failed;
                
                // Update game state
                self.games.write(game_id, game);
                
                // Emit events
                self.emit(
                    TileOpened { 
                        game_id, 
                        player_address, 
                        tile_index, 
                        is_safe, 
                        tiles_opened: game.tiles_opened 
                    }
                );
                self.emit(GameLost { game_id, player_address, tiles_opened: game.tiles_opened });
                
                false // Indicate mine
            }
        }
        
        fn cash_out(ref self: ContractState) -> u256 {
            let player_address = get_caller_address();
            
            // Get player's active game
            let game_id = self.player_active_game.read(player_address);
            assert!(game_id != 0, "No active game found");
            
            // Get game state
            let mut game = self.games.read(game_id);
            assert!(game.status == GameStatus::Active, "Game not active");
            assert!(game.tiles_opened > 0, "You must open at least one tile before cashing out");
            
            // Calculate payout amount
            let multiplier = self.payout_multipliers.read((game.number_of_mines, game.tiles_opened));
            
            let gross_payout = game.bet_amount * multiplier / BASE_MULTIPLIER;
            
            // Mark game as completed
            game.status = GameStatus::Completed;
            self.games.write(game_id, game);
            
            // Transfer payout to player
            let token = IERC20Dispatcher { contract_address: self.token_address.read() };
            let player_payout_success = token.transfer(player_address, gross_payout);
            assert!(player_payout_success, "Payout transfer failed");
            
            // Emit event
            self.emit(
                GameWon { 
                    game_id, 
                    player_address, 
                    payout_amount: gross_payout, 
                    tiles_opened: game.tiles_opened 
                }
            );
            
            gross_payout
        }
        
        fn get_game_state(self: @ContractState, player_address: ContractAddress) -> GameState {
            let game_id = self.player_active_game.read(player_address);
            assert!(game_id != 0, "No game found for player");
            
            self.games.read(game_id)
        }
        
        fn get_active_game_id(self: @ContractState, player_address: ContractAddress) -> u64 {
            let game_id = self.player_active_game.read(player_address);
            assert!(game_id != 0, "No game found for player");
            
            game_id
        }
        
        fn get_payout_multiplier(self: @ContractState, mines: u8, tiles_opened: u8) -> u256 {
            assert!(mines > 0 && mines < TOTAL_TILES, "Invalid number of mines");
            assert!(tiles_opened > 0 && tiles_opened <= (TOTAL_TILES - mines), "Invalid tiles opened");
            
            let multiplier = self.payout_multipliers.read((mines, tiles_opened));
            
            multiplier
        }
        
        fn set_payout_multiplier(ref self: ContractState, mines: u8, tiles_opened: u8, multiplier: u256) {
            // Only owner can set payout multipliers
            self.ownable.assert_only_owner();
            
            assert!(mines > 0 && mines < TOTAL_TILES, "Invalid number of mines");
            assert!(tiles_opened > 0 && tiles_opened <= (TOTAL_TILES - mines), "Invalid tiles opened");
            assert!(multiplier >= BASE_MULTIPLIER, "Multiplier must be at least 100 (1.00x)");
            
            self.payout_multipliers.write((mines, tiles_opened), multiplier);
        }
        
        
        fn get_contract_balance(self: @ContractState) -> u256 {
            let token = IERC20Dispatcher { contract_address: self.token_address.read() };
            token.balance_of(get_contract_address())
        }
        
        fn withdraw(ref self: ContractState, amount: u256) {
            // Only owner can withdraw
            self.ownable.assert_only_owner();
            
            let token = IERC20Dispatcher { contract_address: self.token_address.read() };
            let contract_balance = token.balance_of(get_contract_address());
            assert!(contract_balance >= amount, "Not enough balance to withdraw");
            
            let success = token.transfer(get_caller_address(), amount);
            assert!(success, "Withdrawal failed");
        }
        
        fn fund_contract(ref self: ContractState, amount: u256) {
            let token = IERC20Dispatcher { contract_address: self.token_address.read() };
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
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _is_tile_safe(
            self: @ContractState,
            player_address: ContractAddress,
            game_id: u64,
            tile_index: u8,
            tiles_opened: u8,
            number_of_mines: u8
        ) -> bool {
            // Create entropy for randomness
            let entropy = Entropy {
                seed: self.game_seed.read(),
                timestamp: get_block_timestamp(),
                block_number: get_block_number(),
                player_address,
                game_id,
                tile_index,
            };
            
            // Generate random number using Pedersen hash
            let rand_felt = PoseidonTrait::new().update_with(entropy).finalize();
            let rand_u256: u256 = rand_felt.into();
            
            // Calculate number of remaining tiles
            let remaining_tiles = TOTAL_TILES - tiles_opened;
            
            // Calculate number of remaining mines
            let remaining_mines = number_of_mines;
            
            // Random number in range [0, remaining_tiles - 1]
            let rand_tile = rand_u256 % remaining_tiles.into();
            
            // If random number is less than number of mines, it's a mine
            !(rand_tile < remaining_mines.into())
        }
        
        fn _calculate_max_possible_payout(self: @ContractState, number_of_mines: u8) -> u256 {
            // Calculate the maximum possible payout for a game with this many mines
            // This would be if a player opened all possible safe tiles
            let max_safe_tiles = TOTAL_TILES - number_of_mines;
            
            // Get the multiplier for this configuration
            let multiplier = self.payout_multipliers.read((number_of_mines, max_safe_tiles));
            
            // Multiply by the largest possible bet amount (this is a simplified calculation)
            // In a real contract, you might want to use a max_bet parameter
            // For now, let's assume the contract can handle 100x the bet amount
            100 * multiplier / BASE_MULTIPLIER
        }
        
        fn _initialize_default_multipliers(ref self: ContractState, multipliers: Array<Multiplier>) {
            // Set some default multipliers for 1-5 mines
            // These are just examples and should be adjusted for proper game economics
            let mut i: u32 = 0;
            while i < multipliers.len() {
                let mines = *multipliers[i].mines;
                let tiles_opened = *multipliers[i].tiles_opened;
                let multiplier = *multipliers[i].multiplier;
                assert!(mines > 0 && mines < TOTAL_TILES, "Invalid number of mines");
                assert!(tiles_opened > 0 && tiles_opened <= (TOTAL_TILES - mines), "Invalid tiles opened");
                assert!(multiplier >= BASE_MULTIPLIER, "Multiplier must be at least 100 (1.00x)");
                
                self.payout_multipliers.write((mines, tiles_opened), multiplier);
                i += 1;
            }
        }
    }
}