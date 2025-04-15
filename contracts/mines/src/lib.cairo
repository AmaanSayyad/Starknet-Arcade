use starknet::ContractAddress;

#[starknet::interface]
pub trait IMinesGame<TContractState> {
    fn start_game(ref self: TContractState, bet_amount: u256, number_of_mines: u8) -> u64;
    fn open_tile(
        ref self: TContractState, tile_index: u8,
    ) -> bool; // returns true if safe, false if mine
    fn cash_out(ref self: TContractState) -> u256; // returns the payout amount
    fn get_game_state(self: @TContractState, player_address: ContractAddress) -> GameState;
    fn get_active_game_id(self: @TContractState, player_address: ContractAddress) -> u64;
    fn get_payout_multiplier(self: @TContractState, mines: u8, tiles_opened: u8) -> u256;
    fn set_payout_multiplier(
        ref self: TContractState, mines: u8, tiles_opened: u8, multiplier: u256,
    );
    fn get_contract_balance(self: @TContractState) -> u256;
    fn withdraw(ref self: TContractState, amount: u256);
    fn fund_contract(ref self: TContractState, amount: u256);
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
    use super::{GameState, GameStatus, Entropy};

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
        ref self: ContractState, token_address: ContractAddress, owner: ContractAddress,
    ) {
        self.token_address.write(token_address);
        self.next_game_id.write(1);
        self.ownable.initializer(owner);
        self._initialize_default_multipliers()
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
            let is_safe = self
                ._is_tile_safe(
                    player_address, game_id, tile_index, game.tiles_opened, game.number_of_mines,
                );

            if is_safe {
                // Safe tile discovered
                game.tiles_opened += 1;

                // Update game state
                self.games.write(game_id, game);

                // Emit event
                self
                    .emit(
                        TileOpened {
                            game_id,
                            player_address,
                            tile_index,
                            is_safe,
                            tiles_opened: game.tiles_opened,
                        },
                    );

                true // Indicate safe tile
            } else {
                // Mine discovered, game over
                game.status = GameStatus::Failed;

                // Update game state
                self.games.write(game_id, game);

                // Emit events
                self
                    .emit(
                        TileOpened {
                            game_id,
                            player_address,
                            tile_index,
                            is_safe,
                            tiles_opened: game.tiles_opened,
                        },
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
            let multiplier = self
                .payout_multipliers
                .read((game.number_of_mines, game.tiles_opened));

            let gross_payout = game.bet_amount * multiplier / BASE_MULTIPLIER;

            // Mark game as completed
            game.status = GameStatus::Completed;
            self.games.write(game_id, game);

            // Transfer payout to player
            let token = IERC20Dispatcher { contract_address: self.token_address.read() };
            let player_payout_success = token.transfer(player_address, gross_payout);
            assert!(player_payout_success, "Payout transfer failed");

            // Emit event
            self
                .emit(
                    GameWon {
                        game_id,
                        player_address,
                        payout_amount: gross_payout,
                        tiles_opened: game.tiles_opened,
                    },
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
            assert!(
                tiles_opened > 0 && tiles_opened <= (TOTAL_TILES - mines), "Invalid tiles opened",
            );

            let multiplier = self.payout_multipliers.read((mines, tiles_opened));

            multiplier
        }

        fn set_payout_multiplier(
            ref self: ContractState, mines: u8, tiles_opened: u8, multiplier: u256,
        ) {
            // Only owner can set payout multipliers
            self.ownable.assert_only_owner();

            assert!(mines > 0 && mines < TOTAL_TILES, "Invalid number of mines");
            assert!(
                tiles_opened > 0 && tiles_opened <= (TOTAL_TILES - mines), "Invalid tiles opened",
            );
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
                token.allowance(caller, this) >= amount, "Contract does not have enough allowance",
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
            number_of_mines: u8,
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

        fn _initialize_default_multipliers(ref self: ContractState) {
            self.payout_multipliers.write((1, 1), 103);
            self.payout_multipliers.write((1, 2), 108);
            self.payout_multipliers.write((1, 3), 112);
            self.payout_multipliers.write((1, 4), 118);
            self.payout_multipliers.write((1, 5), 124);
            self.payout_multipliers.write((1, 6), 130);
            self.payout_multipliers.write((1, 7), 137);
            self.payout_multipliers.write((1, 8), 146);
            self.payout_multipliers.write((1, 9), 155);
            self.payout_multipliers.write((1, 10), 165);
            self.payout_multipliers.write((1, 11), 177);
            self.payout_multipliers.write((1, 12), 190);
            self.payout_multipliers.write((1, 13), 206);
            self.payout_multipliers.write((1, 14), 225);
            self.payout_multipliers.write((1, 15), 247);
            self.payout_multipliers.write((1, 16), 275);
            self.payout_multipliers.write((1, 17), 309);
            self.payout_multipliers.write((1, 18), 354);
            self.payout_multipliers.write((1, 19), 412);
            self.payout_multipliers.write((1, 20), 495);
            self.payout_multipliers.write((1, 21), 619);
            self.payout_multipliers.write((1, 22), 825);
            self.payout_multipliers.write((1, 23), 1238);
            self.payout_multipliers.write((1, 24), 2475);
            self.payout_multipliers.write((2, 1), 108);
            self.payout_multipliers.write((2, 2), 117);
            self.payout_multipliers.write((2, 3), 129);
            self.payout_multipliers.write((2, 4), 141);
            self.payout_multipliers.write((2, 5), 156);
            self.payout_multipliers.write((2, 6), 174);
            self.payout_multipliers.write((2, 7), 194);
            self.payout_multipliers.write((2, 8), 218);
            self.payout_multipliers.write((2, 9), 247);
            self.payout_multipliers.write((2, 10), 283);
            self.payout_multipliers.write((2, 11), 326);
            self.payout_multipliers.write((2, 12), 381);
            self.payout_multipliers.write((2, 13), 450);
            self.payout_multipliers.write((2, 14), 540);
            self.payout_multipliers.write((2, 15), 660);
            self.payout_multipliers.write((2, 16), 825);
            self.payout_multipliers.write((2, 17), 1061);
            self.payout_multipliers.write((2, 18), 1414);
            self.payout_multipliers.write((2, 19), 1980);
            self.payout_multipliers.write((2, 20), 2970);
            self.payout_multipliers.write((2, 21), 4950);
            self.payout_multipliers.write((2, 22), 9900);
            self.payout_multipliers.write((2, 23), 29700);
            self.payout_multipliers.write((3, 1), 112);
            self.payout_multipliers.write((3, 2), 129);
            self.payout_multipliers.write((3, 3), 148);
            self.payout_multipliers.write((3, 4), 171);
            self.payout_multipliers.write((3, 5), 200);
            self.payout_multipliers.write((3, 6), 235);
            self.payout_multipliers.write((3, 7), 279);
            self.payout_multipliers.write((3, 8), 335);
            self.payout_multipliers.write((3, 9), 407);
            self.payout_multipliers.write((3, 10), 500);
            self.payout_multipliers.write((3, 11), 626);
            self.payout_multipliers.write((3, 12), 796);
            self.payout_multipliers.write((3, 13), 1035);
            self.payout_multipliers.write((3, 14), 1380);
            self.payout_multipliers.write((3, 15), 1897);
            self.payout_multipliers.write((3, 16), 2711);
            self.payout_multipliers.write((3, 17), 4066);
            self.payout_multipliers.write((3, 18), 6506);
            self.payout_multipliers.write((3, 19), 11385);
            self.payout_multipliers.write((3, 20), 22770);
            self.payout_multipliers.write((3, 21), 56925);
            self.payout_multipliers.write((3, 22), 227700);
            self.payout_multipliers.write((4, 1), 118);
            self.payout_multipliers.write((4, 2), 141);
            self.payout_multipliers.write((4, 3), 171);
            self.payout_multipliers.write((4, 4), 209);
            self.payout_multipliers.write((4, 5), 258);
            self.payout_multipliers.write((4, 6), 323);
            self.payout_multipliers.write((4, 7), 409);
            self.payout_multipliers.write((4, 8), 526);
            self.payout_multipliers.write((4, 9), 688);
            self.payout_multipliers.write((4, 10), 917);
            self.payout_multipliers.write((4, 11), 1251);
            self.payout_multipliers.write((4, 12), 1752);
            self.payout_multipliers.write((4, 13), 2530);
            self.payout_multipliers.write((4, 14), 3795);
            self.payout_multipliers.write((4, 15), 5964);
            self.payout_multipliers.write((4, 16), 9939);
            self.payout_multipliers.write((4, 17), 17891);
            self.payout_multipliers.write((4, 18), 35781);
            self.payout_multipliers.write((4, 19), 83490);
            self.payout_multipliers.write((4, 20), 250470);
            self.payout_multipliers.write((4, 21), 1252350);
            self.payout_multipliers.write((5, 1), 124);
            self.payout_multipliers.write((5, 2), 156);
            self.payout_multipliers.write((5, 3), 200);
            self.payout_multipliers.write((5, 4), 258);
            self.payout_multipliers.write((5, 5), 339);
            self.payout_multipliers.write((5, 6), 452);
            self.payout_multipliers.write((5, 7), 614);
            self.payout_multipliers.write((5, 8), 850);
            self.payout_multipliers.write((5, 9), 1204);
            self.payout_multipliers.write((5, 10), 1752);
            self.payout_multipliers.write((5, 11), 2627);
            self.payout_multipliers.write((5, 12), 4087);
            self.payout_multipliers.write((5, 13), 6641);
            self.payout_multipliers.write((5, 14), 11385);
            self.payout_multipliers.write((5, 15), 20872);
            self.payout_multipliers.write((5, 16), 41745);
            self.payout_multipliers.write((5, 17), 93926);
            self.payout_multipliers.write((5, 18), 250470);
            self.payout_multipliers.write((5, 19), 876645);
            self.payout_multipliers.write((5, 20), 5259870);
            self.payout_multipliers.write((6, 1), 130);
            self.payout_multipliers.write((6, 2), 174);
            self.payout_multipliers.write((6, 3), 235);
            self.payout_multipliers.write((6, 4), 323);
            self.payout_multipliers.write((6, 5), 452);
            self.payout_multipliers.write((6, 6), 646);
            self.payout_multipliers.write((6, 7), 944);
            self.payout_multipliers.write((6, 8), 1417);
            self.payout_multipliers.write((6, 9), 2189);
            self.payout_multipliers.write((6, 10), 3503);
            self.payout_multipliers.write((6, 11), 5838);
            self.payout_multipliers.write((6, 12), 10217);
            self.payout_multipliers.write((6, 13), 18975);
            self.payout_multipliers.write((6, 14), 37950);
            self.payout_multipliers.write((6, 15), 83490);
            self.payout_multipliers.write((6, 16), 208725);
            self.payout_multipliers.write((6, 17), 626175);
            self.payout_multipliers.write((6, 18), 2504700);
            self.payout_multipliers.write((6, 19), 17532900);
            self.payout_multipliers.write((7, 1), 137);
            self.payout_multipliers.write((7, 2), 194);
            self.payout_multipliers.write((7, 3), 279);
            self.payout_multipliers.write((7, 4), 409);
            self.payout_multipliers.write((7, 5), 614);
            self.payout_multipliers.write((7, 6), 944);
            self.payout_multipliers.write((7, 7), 1495);
            self.payout_multipliers.write((7, 8), 2447);
            self.payout_multipliers.write((7, 9), 4160);
            self.payout_multipliers.write((7, 10), 7395);
            self.payout_multipliers.write((7, 11), 13866);
            self.payout_multipliers.write((7, 12), 27733);
            self.payout_multipliers.write((7, 13), 60087);
            self.payout_multipliers.write((7, 14), 144210);
            self.payout_multipliers.write((7, 15), 396577);
            self.payout_multipliers.write((7, 16), 1321925);
            self.payout_multipliers.write((7, 17), 5948662);
            self.payout_multipliers.write((7, 18), 47589300);
            self.payout_multipliers.write((8, 1), 146);
            self.payout_multipliers.write((8, 2), 218);
            self.payout_multipliers.write((8, 3), 335);
            self.payout_multipliers.write((8, 4), 526);
            self.payout_multipliers.write((8, 5), 850);
            self.payout_multipliers.write((8, 6), 1417);
            self.payout_multipliers.write((8, 7), 2447);
            self.payout_multipliers.write((8, 8), 4405);
            self.payout_multipliers.write((8, 9), 8320);
            self.payout_multipliers.write((8, 10), 16640);
            self.payout_multipliers.write((8, 11), 35656);
            self.payout_multipliers.write((8, 12), 83198);
            self.payout_multipliers.write((8, 13), 216315);
            self.payout_multipliers.write((8, 14), 648945);
            self.payout_multipliers.write((8, 15), 2379465);
            self.payout_multipliers.write((8, 16), 11897325);
            self.payout_multipliers.write((8, 17), 107075925);
            self.payout_multipliers.write((9, 1), 155);
            self.payout_multipliers.write((9, 2), 247);
            self.payout_multipliers.write((9, 3), 407);
            self.payout_multipliers.write((9, 4), 688);
            self.payout_multipliers.write((9, 5), 1204);
            self.payout_multipliers.write((9, 6), 2189);
            self.payout_multipliers.write((9, 7), 4160);
            self.payout_multipliers.write((9, 8), 8320);
            self.payout_multipliers.write((9, 9), 17680);
            self.payout_multipliers.write((9, 10), 40410);
            self.payout_multipliers.write((9, 11), 101026);
            self.payout_multipliers.write((9, 12), 282873);
            self.payout_multipliers.write((9, 13), 919339);
            self.payout_multipliers.write((9, 14), 3677355);
            self.payout_multipliers.write((9, 15), 20225452);
            self.payout_multipliers.write((9, 16), 202254525);
            self.payout_multipliers.write((10, 1), 165);
            self.payout_multipliers.write((10, 2), 283);
            self.payout_multipliers.write((10, 3), 500);
            self.payout_multipliers.write((10, 4), 917);
            self.payout_multipliers.write((10, 5), 1752);
            self.payout_multipliers.write((10, 6), 3503);
            self.payout_multipliers.write((10, 7), 7395);
            self.payout_multipliers.write((10, 8), 16640);
            self.payout_multipliers.write((10, 9), 40410);
            self.payout_multipliers.write((10, 10), 107761);
            self.payout_multipliers.write((10, 11), 323284);
            self.payout_multipliers.write((10, 12), 1131494);
            self.payout_multipliers.write((10, 13), 4903140);
            self.payout_multipliers.write((10, 14), 29418840);
            self.payout_multipliers.write((10, 15), 323607240);
            self.payout_multipliers.write((11, 1), 177);
            self.payout_multipliers.write((11, 2), 326);
            self.payout_multipliers.write((11, 3), 626);
            self.payout_multipliers.write((11, 4), 1251);
            self.payout_multipliers.write((11, 5), 2627);
            self.payout_multipliers.write((11, 6), 5838);
            self.payout_multipliers.write((11, 7), 13866);
            self.payout_multipliers.write((11, 8), 35656);
            self.payout_multipliers.write((11, 9), 101026);
            self.payout_multipliers.write((11, 10), 323284);
            self.payout_multipliers.write((11, 11), 1212315);
            self.payout_multipliers.write((11, 12), 5657469);
            self.payout_multipliers.write((11, 13), 36773550);
            self.payout_multipliers.write((11, 14), 441282600);
            self.payout_multipliers.write((12, 1), 190);
            self.payout_multipliers.write((12, 2), 381);
            self.payout_multipliers.write((12, 3), 796);
            self.payout_multipliers.write((12, 4), 1752);
            self.payout_multipliers.write((12, 5), 4087);
            self.payout_multipliers.write((12, 6), 10217);
            self.payout_multipliers.write((12, 7), 27733);
            self.payout_multipliers.write((12, 8), 83198);
            self.payout_multipliers.write((12, 9), 282873);
            self.payout_multipliers.write((12, 10), 1131494);
            self.payout_multipliers.write((12, 11), 5657469);
            self.payout_multipliers.write((12, 12), 39602285);
            self.payout_multipliers.write((12, 13), 514829700);
            self.payout_multipliers.write((13, 1), 206);
            self.payout_multipliers.write((13, 2), 450);
            self.payout_multipliers.write((13, 3), 1035);
            self.payout_multipliers.write((13, 4), 2530);
            self.payout_multipliers.write((13, 5), 6641);
            self.payout_multipliers.write((13, 6), 18975);
            self.payout_multipliers.write((13, 7), 60087);
            self.payout_multipliers.write((13, 8), 216315);
            self.payout_multipliers.write((13, 9), 919339);
            self.payout_multipliers.write((13, 10), 4903140);
            self.payout_multipliers.write((13, 11), 36773550);
            self.payout_multipliers.write((13, 12), 514829700);
            self.payout_multipliers.write((14, 1), 225);
            self.payout_multipliers.write((14, 2), 540);
            self.payout_multipliers.write((14, 3), 1380);
            self.payout_multipliers.write((14, 4), 3795);
            self.payout_multipliers.write((14, 5), 11385);
            self.payout_multipliers.write((14, 6), 37950);
            self.payout_multipliers.write((14, 7), 144210);
            self.payout_multipliers.write((14, 8), 648945);
            self.payout_multipliers.write((14, 9), 3677355);
            self.payout_multipliers.write((14, 10), 29418840);
            self.payout_multipliers.write((14, 11), 441282600);
            self.payout_multipliers.write((15, 1), 247);
            self.payout_multipliers.write((15, 2), 660);
            self.payout_multipliers.write((15, 3), 1897);
            self.payout_multipliers.write((15, 4), 5964);
            self.payout_multipliers.write((15, 5), 20872);
            self.payout_multipliers.write((15, 6), 83490);
            self.payout_multipliers.write((15, 7), 396577);
            self.payout_multipliers.write((15, 8), 2379465);
            self.payout_multipliers.write((15, 9), 20225452);
            self.payout_multipliers.write((15, 10), 323607240);
            self.payout_multipliers.write((16, 1), 275);
            self.payout_multipliers.write((16, 2), 825);
            self.payout_multipliers.write((16, 3), 2711);
            self.payout_multipliers.write((16, 4), 9939);
            self.payout_multipliers.write((16, 5), 41745);
            self.payout_multipliers.write((16, 6), 208725);
            self.payout_multipliers.write((16, 7), 1321925);
            self.payout_multipliers.write((16, 8), 11897325);
            self.payout_multipliers.write((16, 9), 202254525);
            self.payout_multipliers.write((17, 1), 309);
            self.payout_multipliers.write((17, 2), 1061);
            self.payout_multipliers.write((17, 3), 4066);
            self.payout_multipliers.write((17, 4), 17891);
            self.payout_multipliers.write((17, 5), 93926);
            self.payout_multipliers.write((17, 6), 626175);
            self.payout_multipliers.write((17, 7), 5948662);
            self.payout_multipliers.write((17, 8), 107075925);
            self.payout_multipliers.write((18, 1), 354);
            self.payout_multipliers.write((18, 2), 1414);
            self.payout_multipliers.write((18, 3), 6506);
            self.payout_multipliers.write((18, 4), 35781);
            self.payout_multipliers.write((18, 5), 250470);
            self.payout_multipliers.write((18, 6), 2504700);
            self.payout_multipliers.write((18, 7), 47589300);
            self.payout_multipliers.write((19, 1), 412);
            self.payout_multipliers.write((19, 2), 1980);
            self.payout_multipliers.write((19, 3), 11385);
            self.payout_multipliers.write((19, 4), 83490);
            self.payout_multipliers.write((19, 5), 876645);
            self.payout_multipliers.write((19, 6), 17532900);
            self.payout_multipliers.write((20, 1), 495);
            self.payout_multipliers.write((20, 2), 2970);
            self.payout_multipliers.write((20, 3), 22770);
            self.payout_multipliers.write((20, 4), 250470);
            self.payout_multipliers.write((20, 5), 5259870);
            self.payout_multipliers.write((21, 1), 619);
            self.payout_multipliers.write((21, 2), 4950);
            self.payout_multipliers.write((21, 3), 56925);
            self.payout_multipliers.write((21, 4), 1252350);
            self.payout_multipliers.write((22, 1), 825);
            self.payout_multipliers.write((22, 2), 9900);
            self.payout_multipliers.write((22, 3), 227700);
            self.payout_multipliers.write((23, 1), 1237);
            self.payout_multipliers.write((23, 2), 29700);
            self.payout_multipliers.write((24, 1), 2475);
        }
    }
}
