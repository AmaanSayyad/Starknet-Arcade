export const abi = [
  {
    type: "impl",
    name: "ISnakeNLadders",
    interface_name: "snakenladders::SnakeNLadders::ISnakeNLadders",
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
        name: "enroll",
        inputs: [],
        outputs: [],
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
        name: "is_enrolled",
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
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_player_id",
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
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_player_position",
        inputs: [
          {
            name: "player_id",
            type: "core::integer::u64",
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
        name: "get_current_turn",
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
        name: "get_participation_fee",
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
        name: "get_objects",
        inputs: [],
        outputs: [
          {
            type: "core::array::Array::<(core::integer::u64, core::integer::u64)>",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      {
        name: "participation_fee",
        type: "core::integer::u64",
      },
      {
        name: "token_address",
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
    name: "snakenladders::SnakeNLadders::SnakeNLadders::PlayerEnrolled",
    kind: "struct",
    members: [
      {
        name: "player_id",
        type: "core::integer::u64",
        kind: "key",
      },
      {
        name: "player_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "snakenladders::SnakeNLadders::SnakeNLadders::PlayerUnenrolled",
    kind: "struct",
    members: [
      {
        name: "player_id",
        type: "core::integer::u64",
        kind: "key",
      },
      {
        name: "player_address",
        type: "core::starknet::contract_address::ContractAddress",
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
        name: "player_id",
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
    ],
  },
  {
    type: "event",
    name: "snakenladders::SnakeNLadders::SnakeNLadders::PlayerWon",
    kind: "struct",
    members: [
      {
        name: "player_id",
        type: "core::integer::u64",
        kind: "key",
      },
      {
        name: "player_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "snakenladders::SnakeNLadders::SnakeNLadders::Event",
    kind: "enum",
    variants: [
      {
        name: "PlayerEnrolled",
        type: "snakenladders::SnakeNLadders::SnakeNLadders::PlayerEnrolled",
        kind: "nested",
      },
      {
        name: "PlayerUnenrolled",
        type: "snakenladders::SnakeNLadders::SnakeNLadders::PlayerUnenrolled",
        kind: "nested",
      },
      {
        name: "PlayerMoved",
        type: "snakenladders::SnakeNLadders::SnakeNLadders::PlayerMoved",
        kind: "nested",
      },
      {
        name: "PlayerWon",
        type: "snakenladders::SnakeNLadders::SnakeNLadders::PlayerWon",
        kind: "nested",
      },
    ],
  },
];
