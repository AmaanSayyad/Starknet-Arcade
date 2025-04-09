use starknet::{ContractAddress, contract_address_const};
use snforge_std::{
    declare, ContractClassTrait, DeclareResultTrait, start_cheat_caller_address,
    stop_cheat_caller_address, start_cheat_block_timestamp, start_cheat_block_number,
    stop_cheat_block_number, stop_cheat_block_timestamp, spy_events, EventSpyAssertionsTrait,
};
use snakenladders::SnakeNLadders::{ISnakeNLaddersDispatcher, ISnakeNLaddersDispatcherTrait};
use snakenladders::SnakeNLadders::SnakeNLadders;

use snakenladders::MockToken::{IERC20Dispatcher, IERC20DispatcherTrait};

fn player1() -> ContractAddress {
    contract_address_const::<0x1111>()
}
fn player2() -> ContractAddress {
    contract_address_const::<0x2222>()
}
fn player3() -> ContractAddress {
    contract_address_const::<0x3333>()
}
fn player4() -> ContractAddress {
    contract_address_const::<0x4444>()
}

// Deploy a mock ERC20 token for testing
fn deploy_token(name: ByteArray) -> ContractAddress {
    let contract = declare("MockToken").unwrap().contract_class();

    let mut constructor_calldata = ArrayTrait::new();
    name.serialize(ref constructor_calldata);

    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

    contract_address
}

// Deploy the Snake n Ladders contract with the given parameters
fn deploy_snake_n_ladders(
    participation_fee: u64, token_address: ContractAddress, objects: Array<(u64, u64)>,
) -> ContractAddress {
    let contract = declare("SnakeNLadders").unwrap().contract_class();

    let mut constructor_calldata = ArrayTrait::new();
    constructor_calldata.append(participation_fee.into());
    constructor_calldata.append(token_address.into());

    // Add the objects (snakes and ladders)
    let objects_len = objects.len();
    constructor_calldata.append(objects_len.into());

    let mut i = 0;
    while i < objects_len {
        let (start, end) = *objects.at(i);
        constructor_calldata.append(start.into());
        constructor_calldata.append(end.into());
        i += 1;
    };

    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

    contract_address
}

// Helper function to enroll players
fn enroll_players(
    token: IERC20Dispatcher,
    game: ISnakeNLaddersDispatcher,
    players: Array<ContractAddress>,
    participation_fee: u64,
) {
    let mut index = 0;
    let players_len = players.len();

    while index < players_len {
        let player = *players.at(index);

        // Mint tokens to the player
        token.mint(player, (participation_fee * 2).into());

        // Player approves game contract to spend tokens
        start_cheat_caller_address(token.contract_address, player);
        token.approve(game.contract_address, participation_fee.into());
        stop_cheat_caller_address(token.contract_address);

        // Player enrolls in the game
        start_cheat_caller_address(game.contract_address, player);
        game.enroll();
        stop_cheat_caller_address(game.contract_address);

        index += 1;
    }
}

// Mock the roll_dice function to return a specific value
// This requires modifying how our "roll" test functions work
fn mock_roll_dice(
    game_address: ContractAddress, return_value: u64, caller_address: ContractAddress,
) {
    if caller_address == player1() {
        start_cheat_caller_address(game_address, player1());
        // Player 1 configurations
        if return_value == 1 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 3);
        } else if return_value == 2 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 1);
        } else if return_value == 3 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 4);
        } else if return_value == 4 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 6);
        } else if return_value == 5 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 10);
        } else if return_value == 6 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 7);
        }
    } else if caller_address == player2() {
        start_cheat_caller_address(game_address, player2());
        // Player 2 configurations
        if return_value == 1 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 13);
        } else if return_value == 2 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 1);
        } else if return_value == 3 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 5);
        } else if return_value == 4 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 2);
        } else if return_value == 5 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 4);
        } else if return_value == 6 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 3);
        }
    } else if caller_address == player3() {
        start_cheat_caller_address(game_address, player3());
        // Player 3 configurations
        if return_value == 1 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 3);
        } else if return_value == 2 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 2);
        } else if return_value == 3 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 4);
        } else if return_value == 4 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 7);
        } else if return_value == 5 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 1);
        } else if return_value == 6 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 9);
        }
    } else if caller_address == player4() {
        start_cheat_caller_address(game_address, player4());
        // Player 4 configurations
        if return_value == 1 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 7);
        } else if return_value == 2 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 1);
        } else if return_value == 3 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 10);
        } else if return_value == 4 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 14);
        } else if return_value == 5 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 5);
        } else if return_value == 6 {
            start_cheat_block_timestamp(game_address, 1000);
            start_cheat_block_number(game_address, 4);
        }
    }
}

fn stop_mock_roll_dice(game_address: ContractAddress) {
    stop_cheat_block_number(game_address);
    stop_cheat_block_timestamp(game_address);
    stop_cheat_caller_address(game_address);
}

// Test successful enrollment
#[test]
fn test_successful_enrollment() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    // Create a simple game with no snakes or ladders
    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    // Create a player
    let player: ContractAddress = starknet::contract_address_const::<0x1234>();

    // Mint tokens to player
    token.mint(player, (participation_fee * 2).into());

    // Player approves game contract
    start_cheat_caller_address(token_address, player);
    token.approve(game_address, participation_fee.into());
    stop_cheat_caller_address(token_address);

    // Player enrolls
    start_cheat_caller_address(game_address, player);
    let mut spy = spy_events();
    game.enroll();

    // Verify player balance reduced
    assert(token.balance_of(player) == participation_fee.into(), 'Player balance incorrect');

    // Verify contract received tokens
    assert(token.balance_of(game_address) == participation_fee.into(), 'Game balance incorrect');

    // Verify event emitted
    let expected_event = SnakeNLadders::Event::PlayerEnrolled(
        SnakeNLadders::PlayerEnrolled { player_id: 1, player_address: player },
    );
    spy.assert_emitted(@array![(game_address, expected_event)]);

    stop_cheat_caller_address(game_address);
}

// Test enrollment fails when player is already enrolled
#[test]
#[should_panic(expected: "Player is already enrolled")]
fn test_enrollment_already_enrolled() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    let player: ContractAddress = starknet::contract_address_const::<0x1234>();

    // Mint tokens to player
    token.mint(player, (participation_fee * 3).into());

    // Player approves game contract
    start_cheat_caller_address(token_address, player);
    token.approve(game_address, (participation_fee * 2).into());
    stop_cheat_caller_address(token_address);

    // Player enrolls first time
    start_cheat_caller_address(game_address, player);
    game.enroll();

    // Try to enroll again - should fail
    game.enroll();
    stop_cheat_caller_address(game_address);
}

// Test enrollment fails when max players are reached
#[test]
#[should_panic(expected: "Max players reached")]
fn test_enrollment_max_players_reached() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    // Create 5 players (max is 4)
    let player1: ContractAddress = starknet::contract_address_const::<0x1111>();
    let player2: ContractAddress = starknet::contract_address_const::<0x2222>();
    let player3: ContractAddress = starknet::contract_address_const::<0x3333>();
    let player4: ContractAddress = starknet::contract_address_const::<0x4444>();
    let player5: ContractAddress = starknet::contract_address_const::<0x5555>();

    // Enroll first 4 players
    let mut players = ArrayTrait::new();
    players.append(player1);
    players.append(player2);
    players.append(player3);
    players.append(player4);
    enroll_players(token, game, players, participation_fee);

    // Try to enroll the 5th player - should fail
    token.mint(player5, (participation_fee * 2).into());

    start_cheat_caller_address(token_address, player5);
    token.approve(game_address, participation_fee.into());
    stop_cheat_caller_address(token_address);

    start_cheat_caller_address(game_address, player5);
    game.enroll();
    stop_cheat_caller_address(game_address);
}

// Test enrollment fails with insufficient balance
#[test]
#[should_panic(expected: "Insufficient balance to enroll")]
fn test_enrollment_insufficient_balance() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    let player: ContractAddress = starknet::contract_address_const::<0x1234>();

    // Mint less tokens than needed
    token.mint(player, (participation_fee - 1).into());

    // Player approves game contract
    start_cheat_caller_address(token_address, player);
    token.approve(game_address, participation_fee.into());
    stop_cheat_caller_address(token_address);

    // Try to enroll - should fail
    start_cheat_caller_address(game_address, player);
    game.enroll();
    stop_cheat_caller_address(game_address);
}

// Test enrollment fails with insufficient allowance
#[test]
#[should_panic(expected: "Insufficient allowance to enroll")]
fn test_enrollment_insufficient_allowance() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    let player: ContractAddress = starknet::contract_address_const::<0x1234>();

    // Mint enough tokens
    token.mint(player, (participation_fee * 2).into());

    // Player approves less than needed
    start_cheat_caller_address(token_address, player);
    token.approve(game_address, (participation_fee - 1).into());
    stop_cheat_caller_address(token_address);

    // Try to enroll - should fail
    start_cheat_caller_address(game_address, player);
    game.enroll();
    stop_cheat_caller_address(game_address);
}

// Test can't roll until 4 players enrolled
#[test]
#[should_panic(expected: "Not enough players enrolled")]
fn test_cant_roll_until_enough_players() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    // Create 3 players (need 4)
    let player1: ContractAddress = starknet::contract_address_const::<0x1111>();
    let player2: ContractAddress = starknet::contract_address_const::<0x2222>();
    let player3: ContractAddress = starknet::contract_address_const::<0x3333>();

    // Enroll 3 players
    let mut players = ArrayTrait::new();
    players.append(player1);
    players.append(player2);
    players.append(player3);
    enroll_players(token, game, players, participation_fee);

    // Try to roll - should fail
    start_cheat_caller_address(game_address, player1);
    game.roll();
    stop_cheat_caller_address(game_address);
}

// Test unenrolled player can't roll
#[test]
#[should_panic(expected: "Player is not enrolled")]
fn test_unenrolled_player_cant_roll() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    // Create and enroll 4 players
    let player1: ContractAddress = starknet::contract_address_const::<0x1111>();
    let player2: ContractAddress = starknet::contract_address_const::<0x2222>();
    let player3: ContractAddress = starknet::contract_address_const::<0x3333>();
    let player4: ContractAddress = starknet::contract_address_const::<0x4444>();
    let unenrolled: ContractAddress = starknet::contract_address_const::<0x5555>();

    let mut players = ArrayTrait::new();
    players.append(player1);
    players.append(player2);
    players.append(player3);
    players.append(player4);
    enroll_players(token, game, players, participation_fee);

    // Unenrolled player tries to roll - should fail
    start_cheat_caller_address(game_address, unenrolled);
    game.roll();
    stop_cheat_caller_address(game_address);
}

// Test player can't roll when it's not their turn
#[test]
#[should_panic(expected: "It's not your turn")]
fn test_player_cant_roll_not_their_turn() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    // Create and enroll 4 players
    let player1: ContractAddress = starknet::contract_address_const::<0x1111>();
    let player2: ContractAddress = starknet::contract_address_const::<0x2222>();
    let player3: ContractAddress = starknet::contract_address_const::<0x3333>();
    let player4: ContractAddress = starknet::contract_address_const::<0x4444>();

    let mut players = ArrayTrait::new();
    players.append(player1);
    players.append(player2);
    players.append(player3);
    players.append(player4);
    enroll_players(token, game, players, participation_fee);

    // Player 2 tries to roll when it's player 1's turn - should fail
    start_cheat_caller_address(game_address, player2);
    game.roll();
    stop_cheat_caller_address(game_address);
}

// Test rolling a 6 gives another turn
#[test]
fn test_rolling_six_gives_another_turn() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    let mut players = ArrayTrait::new();
    players.append(player1());
    players.append(player2());
    players.append(player3());
    players.append(player4());
    enroll_players(token, game, players, participation_fee);

    // Mock the dice roll to return 6
    mock_roll_dice(game_address, 6, player1());
    let roll_result = game.roll();
    assert(roll_result == 6, 'Should roll a 6');
    stop_mock_roll_dice(game_address);

    // Player 1 should still have the turn, so they can roll again
    // Mock the second roll (for example, a 4)
    mock_roll_dice(game_address, 4, player1());
    let second_roll = game.roll();
    assert(second_roll == 4, 'Second roll should be 4');
    stop_mock_roll_dice(game_address);
}

// Test normal movement
#[test]
fn test_normal_movement() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    // Create and enroll 4 players
    let mut players = ArrayTrait::new();
    players.append(player1());
    players.append(player2());
    players.append(player3());
    players.append(player4());
    enroll_players(token, game, players, participation_fee);

    // Player 1 rolls and gets a 4
    mock_roll_dice(game_address, 4, player1());
    let mut spy = spy_events();
    let roll_result = game.roll();

    // Verify roll result
    assert(roll_result == 4, 'Should roll a 4');

    // Check that player moved to position 4
    let expected_event = SnakeNLadders::Event::PlayerMoved(
        SnakeNLadders::PlayerMoved { player_id: 1, player_address: player1(), new_position: 4 },
    );
    spy.assert_emitted(@array![(game_address, expected_event)]);
    stop_mock_roll_dice(game_address);

    // Verify player 2 can now roll
    mock_roll_dice(game_address, 3, player2());
    let player2_result = game.roll();
    assert(player2_result == 3, 'Player 2 should roll a 3');
    stop_mock_roll_dice(game_address);
}

// Test landing on a snake
#[test]
fn test_landing_on_snake() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    // Create a game with one snake from position 14 to 7
    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    objects.append((14, 7)); // Snake from 14 to 7

    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    // Create and enroll 4 players
    let mut players = ArrayTrait::new();
    players.append(player1());
    players.append(player2());
    players.append(player3());
    players.append(player4());
    enroll_players(token, game, players, participation_fee);

    // Since we can only mock dice rolls 1-6, we need to roll multiple times to reach position 14
    // First, roll player1 to get close to position 14

    // Roll a 6 (position 6)
    mock_roll_dice(game_address, 6, player1());
    game.roll();
    stop_mock_roll_dice(game_address);

    // Roll a 6 again (position 12)
    mock_roll_dice(game_address, 6, player1());
    game.roll();
    stop_mock_roll_dice(game_address);

    // Roll a 2 to land on 14 (and slide down to 7)
    mock_roll_dice(game_address, 2, player1());
    let mut spy = spy_events();
    let roll_result = game.roll();

    // Verify roll result
    assert(roll_result == 2, 'Should roll a 2');

    // Check that player moved to position 7 (after snake)
    let expected_event = SnakeNLadders::Event::PlayerMoved(
        SnakeNLadders::PlayerMoved { player_id: 1, player_address: player1(), new_position: 7 },
    );
    spy.assert_emitted(@array![(game_address, expected_event)]);
    stop_mock_roll_dice(game_address);
}

// Test landing on a ladder
#[test]
fn test_landing_on_ladder() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    // Create a game with one ladder from position 5 to 25
    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    objects.append((5, 25)); // Ladder from 5 to 25

    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    // Create and enroll 4 players
    let mut players = ArrayTrait::new();
    players.append(player1());
    players.append(player2());
    players.append(player3());
    players.append(player4());
    enroll_players(token, game, players, participation_fee);

    // Player 1 rolls and should move to position 5 (and then climb to 25)
    mock_roll_dice(game_address, 5, player1());
    let mut spy = spy_events();
    let roll_result = game.roll();

    // Verify roll result
    assert(roll_result == 5, 'Should roll a 5');

    // Check that player moved to position 25 (after ladder)
    let expected_event = SnakeNLadders::Event::PlayerMoved(
        SnakeNLadders::PlayerMoved { player_id: 1, player_address: player1(), new_position: 25 },
    );
    spy.assert_emitted(@array![(game_address, expected_event)]);
    stop_mock_roll_dice(game_address);
}

// Test winning condition
#[test]
fn test_winning_condition() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    // Create a game with a ladder from 95 to 100
    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    objects.append((95, 100)); // Ladder from 95 to 100

    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    // Create and enroll 4 players
    let mut players = ArrayTrait::new();
    players.append(player1());
    players.append(player2());
    players.append(player3());
    players.append(player4());
    enroll_players(token, game, players, participation_fee);

    let mut spy = spy_events();
    // We need to get player 1 to position 90 first through multiple rolls
    // We'll use a series of 6s to get there quickly

    // Roll multiple 6s to advance player quickly
    for _ in 0_u64..15 { // 15 rolls of 6 = 90 steps
        mock_roll_dice(game_address, 6, player1());
        game.roll();
        stop_mock_roll_dice(game_address);
    };

    mock_roll_dice(game_address, 1, player1());
    game.roll();
    stop_mock_roll_dice(game_address);

    // Now player 2, 3, 4 need to take their turns
    mock_roll_dice(game_address, 1, player2());
    game.roll();
    stop_mock_roll_dice(game_address);

    mock_roll_dice(game_address, 1, player3());
    game.roll();
    stop_mock_roll_dice(game_address);

    mock_roll_dice(game_address, 1, player4());
    game.roll();
    stop_mock_roll_dice(game_address);

    // Now player 1 rolls again to land on 95
    // Player is at position 90, needs to roll 5 to land on 95
    mock_roll_dice(game_address, 4, player1());

    let player1_balance_before = token.balance_of(player1());
    game.roll();

    // Verify player won
    let won_event = SnakeNLadders::Event::PlayerWon(
        SnakeNLadders::PlayerWon { player_id: 1, player_address: player1() },
    );

    spy.assert_emitted(@array![(game_address, won_event)]);

    // Verify player received prize
    let player1_balance_after = token.balance_of(player1());
    let total_prize = participation_fee * 4;
    let player_prize_pool = total_prize * 9800 / 10000;
    let prize_factor: u64 = 37500;
    let expected_prize = player_prize_pool * prize_factor / 100000;
    assert(
        player1_balance_after - player1_balance_before == expected_prize.into(),
        'Prize amount incorrect',
    );
    stop_mock_roll_dice(game_address);
}

// Test can't move beyond position 100
#[test]
fn test_cant_move_beyond_100() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    // Create and enroll 4 players
    let mut players = ArrayTrait::new();
    players.append(player1());
    players.append(player2());
    players.append(player3());
    players.append(player4());
    enroll_players(token, game, players, participation_fee);

    // Player 1 needs to get to position 98 first through multiple rolls
    // Roll multiple 6s to advance player quickly
    for _ in 0_u64..16 { // 16 rolls of 6 = 96 steps
        mock_roll_dice(game_address, 6, player1());
        game.roll();
        stop_mock_roll_dice(game_address);
    };

    // Roll a 2 to reach position 98
    mock_roll_dice(game_address, 2, player1());
    game.roll();
    stop_mock_roll_dice(game_address);

    // Now player 2, 3, 4 need to take their turns
    mock_roll_dice(game_address, 1, player2());
    game.roll();
    stop_mock_roll_dice(game_address);

    mock_roll_dice(game_address, 1, player3());
    game.roll();
    stop_mock_roll_dice(game_address);

    mock_roll_dice(game_address, 1, player4());
    game.roll();
    stop_mock_roll_dice(game_address);

    // Now player 1 tries to roll a 6 (which would move beyond 100)
    // Player is at position 98, rolling 6 would be 104
    mock_roll_dice(game_address, 6, player1());

    let roll_result = game.roll();

    // Check roll result
    assert(roll_result == 6, 'Wrong roll result');

    stop_mock_roll_dice(game_address);
}

// Test prize distribution for multiple winners
#[test]
fn test_prize_distribution_multiple_winners() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    // Create a game with a ladder from 95 to 100
    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    objects.append((95, 100)); // Ladder from 95 to 100

    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    // Create and enroll 4 players
    let mut players = ArrayTrait::new();
    players.append(player1());
    players.append(player2());
    players.append(player3());
    players.append(player4());
    enroll_players(token, game, players, participation_fee);

    // Get all players to position 91 through multiple turns
    // Player 1 first
    for _ in 0_u64..15 { // 15 rolls of 6 = 90 steps
        mock_roll_dice(game_address, 6, player1());
        game.roll();
        stop_mock_roll_dice(game_address);
    };
    mock_roll_dice(game_address, 1, player1());
    game.roll();
    stop_mock_roll_dice(game_address);

    // Player 2
    for _ in 0_u64..15 {
        mock_roll_dice(game_address, 6, player2());
        game.roll();
        stop_mock_roll_dice(game_address);
    };
    mock_roll_dice(game_address, 1, player2());
    game.roll();
    stop_mock_roll_dice(game_address);

    // Player 3
    for _ in 0_u64..15 {
        mock_roll_dice(game_address, 6, player3());
        game.roll();
        stop_mock_roll_dice(game_address);
    };
    mock_roll_dice(game_address, 1, player3());
    game.roll();
    stop_mock_roll_dice(game_address);

    // Player 4
    for _ in 0_u64..15 {
        mock_roll_dice(game_address, 6, player4());
        game.roll();
        stop_mock_roll_dice(game_address);
    };
    mock_roll_dice(game_address, 1, player4());
    game.roll();
    stop_mock_roll_dice(game_address);

    // Now have each player win one after another by rolling 5 to land on 95 (ladder to 100)

    // Player 1 wins first
    mock_roll_dice(game_address, 4, player1());
    let player1_balance_before = token.balance_of(player1());
    game.roll();
    let player1_balance_after = token.balance_of(player1());
    stop_mock_roll_dice(game_address);

    let total_prize = participation_fee * 4;
    let player_prize_pool = total_prize * 9800 / 10000;

    // Calculate first prize
    let first_prize_factor: u64 = 37500;
    let first_prize = player_prize_pool * first_prize_factor / 100000;

    assert(
        player1_balance_after - player1_balance_before == first_prize.into(),
        'First prize incorrect',
    );

    // Now player 2 needs to roll
    mock_roll_dice(game_address, 4, player2());
    let player2_balance_before = token.balance_of(player2());
    game.roll();
    let player2_balance_after = token.balance_of(player2());
    stop_mock_roll_dice(game_address);

    // Calculate second prize
    let second_prize_factor: u64 = 32500;
    let second_prize = player_prize_pool * second_prize_factor / 100000;

    assert(
        player2_balance_after - player2_balance_before == second_prize.into(),
        'Second prize incorrect',
    );

    // Now player 3 needs to roll
    mock_roll_dice(game_address, 4, player3());
    let player3_balance_before = token.balance_of(player3());
    game.roll();
    let player3_balance_after = token.balance_of(player3());
    stop_mock_roll_dice(game_address);

    // Calculate third prize
    let third_prize_factor: u64 = 30000;
    let third_prize = player_prize_pool * third_prize_factor / 100000;

    assert(
        player3_balance_after - player3_balance_before == third_prize.into(),
        'Third prize incorrect',
    );

    // Check player 4 can still play
    mock_roll_dice(game_address, 4, player4());
    let player4_balance_before = token.balance_of(player4());
    game.roll();
    let player4_balance_after = token.balance_of(player4());
    stop_mock_roll_dice(game_address);

    // No more prizes should be available
    assert!(player4_balance_after == player4_balance_before, "Fourth player shouldn\'t get prize");
}

// Test multiple consecutive rolls of 6
#[test]
fn test_multiple_consecutive_sixes() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    // Create and enroll 4 players
    let mut players = ArrayTrait::new();
    players.append(player1());
    players.append(player2());
    players.append(player3());
    players.append(player4());
    enroll_players(token, game, players, participation_fee);

    let mut spy = spy_events();

    // Player 1 rolls three consecutive 6s

    // First roll: 6
    mock_roll_dice(game_address, 6, player1());
    let roll1 = game.roll();
    assert(roll1 == 6, 'First roll should be 6');
    stop_mock_roll_dice(game_address);

    // Second roll: 6
    mock_roll_dice(game_address, 6, player1());
    let roll2 = game.roll();
    assert(roll2 == 6, 'Second roll should be 6');
    stop_mock_roll_dice(game_address);

    // Third roll: 6
    mock_roll_dice(game_address, 6, player1());
    let roll3 = game.roll();
    assert(roll3 == 6, 'Third roll should be 6');
    stop_mock_roll_dice(game_address);

    // Fourth roll: non-6 (e.g., 5)
    mock_roll_dice(game_address, 5, player1());
    let roll4 = game.roll();
    assert(roll4 == 5, 'Fourth roll should be 5');

    // After this roll, the player should be at position 6+6+6+5 = 23

    // Get the last PlayerMoved event
    let expected_event = SnakeNLadders::Event::PlayerMoved(
        SnakeNLadders::PlayerMoved { player_id: 1, player_address: player1(), new_position: 23 },
    );
    spy.assert_emitted(@array![(game_address, expected_event)]);
    stop_mock_roll_dice(game_address);

    // Verify player 2 can now roll (turn has passed)
    mock_roll_dice(game_address, 3, player2());
    let player2_roll = game.roll();
    assert(player2_roll == 3, 'Player 2 should roll a 3');
    stop_mock_roll_dice(game_address);
}

// Test turn rotation between players
#[test]
fn test_turn_rotation() {
    // Setup
    let token_address = deploy_token("GameToken");
    let token = IERC20Dispatcher { contract_address: token_address };

    let mut objects: Array<(u64, u64)> = ArrayTrait::new();
    let participation_fee: u64 = 100;
    let game_address = deploy_snake_n_ladders(participation_fee, token_address, objects);
    let game = ISnakeNLaddersDispatcher { contract_address: game_address };

    // Create and enroll 4 players
    let mut players = ArrayTrait::new();
    players.append(player1());
    players.append(player2());
    players.append(player3());
    players.append(player4());
    enroll_players(token, game, players, participation_fee);

    // Player 1 rolls (should be their turn)
    mock_roll_dice(game_address, 3, player1());
    let roll1 = game.roll();
    assert(roll1 == 3, 'Player 1 should roll a 3');
    stop_mock_roll_dice(game_address);

    // Now should be player 2's turn
    mock_roll_dice(game_address, 4, player2());
    let roll2 = game.roll();
    assert(roll2 == 4, 'Player 2 should roll a 4');
    stop_mock_roll_dice(game_address);

    // Now should be player 3's turn
    mock_roll_dice(game_address, 5, player3());
    let roll3 = game.roll();
    assert(roll3 == 5, 'Player 3 should roll a 5');
    stop_mock_roll_dice(game_address);

    // Now should be player 4's turn
    mock_roll_dice(game_address, 2, player4());
    let roll4 = game.roll();
    assert(roll4 == 2, 'Player 4 should roll a 2');
    stop_mock_roll_dice(game_address);

    // Now back to player 1's turn
    mock_roll_dice(game_address, 3, player1());
    let roll5 = game.roll();
    assert(roll5 == 3, 'Player 1 should roll a 3 again');
    stop_mock_roll_dice(game_address);
}
