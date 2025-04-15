[
  {
    type: "impl",
    name: "ISnakeNLadders",
    interface_name: "snakenladders::SnakeNLadders::ISnakeNLadders",
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      {
        name: "False",
        type: "()",
      },
      {
        name: "True",
        type: "()",
      },
    ],
  },
  {
    type: "interface",
    name: "snakenladders::SnakeNLadders::ISnakeNLadders",
    items: [
      {
        type: "function",
        name: "create_game",
        inputs: [
          {
            name: "bet_amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "roll",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "roll_for_computer",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "end_game",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_player_position",
        inputs: [
          {
            name: "player_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_computer_position",
        inputs: [
          {
            name: "player_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_current_turn",
        inputs: [
          {
            name: "player_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_objects",
        inputs: [],
        outputs: [
          {
            type: "core::array::Array::<(core::integer::u64, core::integer::u64)>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_winner",
        inputs: [
          {
            name: "player_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u8",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_active_game_id",
        inputs: [
          {
            name: "player_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_game_bet",
        inputs: [
          {
            name: "player_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_fee_address",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "set_fee_address",
        inputs: [
          {
            name: "new_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      {
        name: "token_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "fee_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "objects",
        type: "core::array::Array::<(core::integer::u64, core::integer::u64)>",
      },
    ],
  },
  {
    type: "event",
    name: "snakenladders::SnakeNLadders::SnakeNLadders::GameCreated",
    kind: "struct",
    members: [
      {
        name: "game_id",
        type: "core::integer::u64",
        kind: "key",
      },
      {
        name: "player_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "bet_amount",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "snakenladders::SnakeNLadders::SnakeNLadders::PlayerMoved",
    kind: "struct",
    members: [
      {
        name: "game_id",
        type: "core::integer::u64",
        kind: "key",
      },
      {
        name: "player_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "new_position",
        type: "core::integer::u64",
        kind: "data",
      },
      {
        name: "dice_roll",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "snakenladders::SnakeNLadders::SnakeNLadders::ComputerMoved",
    kind: "struct",
    members: [
      {
        name: "game_id",
        type: "core::integer::u64",
        kind: "key",
      },
      {
        name: "new_position",
        type: "core::integer::u64",
        kind: "data",
      },
      {
        name: "dice_roll",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "snakenladders::SnakeNLadders::SnakeNLadders::PlayerWon",
    kind: "struct",
    members: [
      {
        name: "game_id",
        type: "core::integer::u64",
        kind: "key",
      },
      {
        name: "player_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "prize_amount",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "snakenladders::SnakeNLadders::SnakeNLadders::ComputerWon",
    kind: "struct",
    members: [
      {
        name: "game_id",
        type: "core::integer::u64",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "snakenladders::SnakeNLadders::SnakeNLadders::FeeAddressChanged",
    kind: "struct",
    members: [
      {
        name: "old_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "new_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "snakenladders::SnakeNLadders::SnakeNLadders::DiceRolled",
    kind: "struct",
    members: [
      {
        name: "roll_result",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "snakenladders::SnakeNLadders::SnakeNLadders::GameEnded",
    kind: "struct",
    members: [
      {
        name: "game_id",
        type: "core::integer::u64",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "snakenladders::SnakeNLadders::SnakeNLadders::Event",
    kind: "enum",
    variants: [
      {
        name: "GameCreated",
        type: "snakenladders::SnakeNLadders::SnakeNLadders::GameCreated",
        kind: "nested",
      },
      {
        name: "PlayerMoved",
        type: "snakenladders::SnakeNLadders::SnakeNLadders::PlayerMoved",
        kind: "nested",
      },
      {
        name: "ComputerMoved",
        type: "snakenladders::SnakeNLadders::SnakeNLadders::ComputerMoved",
        kind: "nested",
      },
      {
        name: "PlayerWon",
        type: "snakenladders::SnakeNLadders::SnakeNLadders::PlayerWon",
        kind: "nested",
      },
      {
        name: "ComputerWon",
        type: "snakenladders::SnakeNLadders::SnakeNLadders::ComputerWon",
        kind: "nested",
      },
      {
        name: "FeeAddressChanged",
        type: "snakenladders::SnakeNLadders::SnakeNLadders::FeeAddressChanged",
        kind: "nested",
      },
      {
        name: "DiceRolled",
        type: "snakenladders::SnakeNLadders::SnakeNLadders::DiceRolled",
        kind: "nested",
      },
      {
        name: "GameEnded",
        type: "snakenladders::SnakeNLadders::SnakeNLadders::GameEnded",
        kind: "nested",
      },
    ],
  },
];
