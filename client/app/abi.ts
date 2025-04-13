import { Abi } from "starknet";

export const ERC20Abi: Abi = [
  {
    inputs: [],
    name: "finalized",
    outputs: [
      {
        name: "res",
        type: "felt",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    data: [
      {
        name: "new_governor_nominee",
        type: "felt",
      },
      {
        name: "nominated_by",
        type: "felt",
      },
    ],
    keys: [],
    name: "governor_nominated",
    type: "event",
  },
  {
    data: [
      {
        name: "cancelled_nominee",
        type: "felt",
      },
      {
        name: "cancelled_by",
        type: "felt",
      },
    ],
    keys: [],
    name: "nomination_cancelled",
    type: "event",
  },
  {
    data: [
      {
        name: "removed_governor",
        type: "felt",
      },
      {
        name: "removed_by",
        type: "felt",
      },
    ],
    keys: [],
    name: "governor_removed",
    type: "event",
  },
  {
    data: [
      {
        name: "new_governor",
        type: "felt",
      },
    ],
    keys: [],
    name: "governance_accepted",
    type: "event",
  },
  {
    inputs: [
      {
        name: "account",
        type: "felt",
      },
    ],
    name: "is_governor",
    outputs: [
      {
        name: "is_governor_",
        type: "felt",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "nominee",
        type: "felt",
      },
    ],
    name: "nominate_new_governor",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "cancelee",
        type: "felt",
      },
    ],
    name: "cancel_nomination",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "removee",
        type: "felt",
      },
    ],
    name: "remove_governor",
    outputs: [],
    type: "function",
  },
  {
    inputs: [],
    name: "accept_governance",
    outputs: [],
    type: "function",
  },
  {
    data: [
      {
        name: "implementation_hash",
        type: "felt",
      },
      {
        name: "eic_hash",
        type: "felt",
      },
      {
        name: "init_vector_len",
        type: "felt",
      },
      {
        name: "init_vector",
        type: "felt*",
      },
      {
        name: "final",
        type: "felt",
      },
    ],
    keys: [],
    name: "implementation_added",
    type: "event",
  },
  {
    data: [
      {
        name: "implementation_hash",
        type: "felt",
      },
      {
        name: "eic_hash",
        type: "felt",
      },
      {
        name: "init_vector_len",
        type: "felt",
      },
      {
        name: "init_vector",
        type: "felt*",
      },
      {
        name: "final",
        type: "felt",
      },
    ],
    keys: [],
    name: "implementation_removed",
    type: "event",
  },
  {
    data: [
      {
        name: "implementation_hash",
        type: "felt",
      },
      {
        name: "eic_hash",
        type: "felt",
      },
      {
        name: "init_vector_len",
        type: "felt",
      },
      {
        name: "init_vector",
        type: "felt*",
      },
    ],
    keys: [],
    name: "implementation_upgraded",
    type: "event",
  },
  {
    data: [
      {
        name: "implementation_hash",
        type: "felt",
      },
    ],
    keys: [],
    name: "implementation_finalized",
    type: "event",
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [
      {
        name: "implementation_hash_",
        type: "felt",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "get_upgrade_delay",
    outputs: [
      {
        name: "delay_seconds",
        type: "felt",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "implementation_hash_",
        type: "felt",
      },
      {
        name: "eic_hash",
        type: "felt",
      },
      {
        name: "init_vector_len",
        type: "felt",
      },
      {
        name: "init_vector",
        type: "felt*",
      },
      {
        name: "final",
        type: "felt",
      },
    ],
    name: "implementation_time",
    outputs: [
      {
        name: "time",
        type: "felt",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "implementation_hash_",
        type: "felt",
      },
      {
        name: "eic_hash",
        type: "felt",
      },
      {
        name: "init_vector_len",
        type: "felt",
      },
      {
        name: "init_vector",
        type: "felt*",
      },
      {
        name: "final",
        type: "felt",
      },
    ],
    name: "add_implementation",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "implementation_hash_",
        type: "felt",
      },
      {
        name: "eic_hash",
        type: "felt",
      },
      {
        name: "init_vector_len",
        type: "felt",
      },
      {
        name: "init_vector",
        type: "felt*",
      },
      {
        name: "final",
        type: "felt",
      },
    ],
    name: "remove_implementation",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "implementation_hash_",
        type: "felt",
      },
      {
        name: "eic_hash",
        type: "felt",
      },
      {
        name: "init_vector_len",
        type: "felt",
      },
      {
        name: "init_vector",
        type: "felt*",
      },
      {
        name: "final",
        type: "felt",
      },
    ],
    name: "upgrade_to",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "init_vector_len",
        type: "felt",
      },
      {
        name: "init_vector",
        type: "felt*",
      },
    ],
    name: "initialize",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "upgrade_delay_seconds",
        type: "felt",
      },
    ],
    name: "constructor",
    outputs: [],
    type: "constructor",
  },
  {
    inputs: [
      {
        name: "selector",
        type: "felt",
      },
      {
        name: "calldata_size",
        type: "felt",
      },
      {
        name: "calldata",
        type: "felt*",
      },
    ],
    name: "__default__",
    outputs: [
      {
        name: "retdata_size",
        type: "felt",
      },
      {
        name: "retdata",
        type: "felt*",
      },
    ],
    type: "function",
  },
  {
    inputs: [
      {
        name: "selector",
        type: "felt",
      },
      {
        name: "calldata_size",
        type: "felt",
      },
      {
        name: "calldata",
        type: "felt*",
      },
    ],
    name: "__l1_default__",
    outputs: [],
    type: "l1_handler",
  },
];

export const CoinFlipABI: Abi = [
  {
    type: "impl",
    name: "CoinFlip",
    interface_name: "coinflip::ICoinFlip",
  },
  {
    type: "enum",
    name: "coinflip::FlipChoice",
    variants: [
      {
        name: "Tails",
        type: "()",
      },
      {
        name: "Heads",
        type: "()",
      },
    ],
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
    name: "core::option::Option::<coinflip::FlipChoice>",
    variants: [
      {
        name: "Some",
        type: "coinflip::FlipChoice",
      },
      {
        name: "None",
        type: "()",
      },
    ],
  },
  {
    type: "enum",
    name: "coinflip::FlipState",
    variants: [
      {
        name: "Idle",
        type: "()",
      },
      {
        name: "Flipping",
        type: "()",
      },
      {
        name: "Complete",
        type: "()",
      },
    ],
  },
  {
    type: "struct",
    name: "coinflip::FlipDetails",
    members: [
      {
        name: "player",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "amount",
        type: "core::integer::u256",
      },
      {
        name: "choice",
        type: "coinflip::FlipChoice",
      },
      {
        name: "result",
        type: "core::option::Option::<coinflip::FlipChoice>",
      },
      {
        name: "state",
        type: "coinflip::FlipState",
      },
      {
        name: "request_id",
        type: "core::integer::u64",
      },
    ],
  },
  {
    type: "interface",
    name: "coinflip::ICoinFlip",
    items: [
      {
        type: "function",
        name: "flip_coin",
        inputs: [
          {
            name: "choice",
            type: "coinflip::FlipChoice",
          },
          {
            name: "amount",
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
        name: "get_flip_details",
        inputs: [
          {
            name: "request_id",
            type: "core::integer::u64",
          },
        ],
        outputs: [
          {
            type: "coinflip::FlipDetails",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_contract_balance",
        inputs: [
          {
            name: "token",
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
        name: "withdraw",
        inputs: [
          {
            name: "token",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "fund_contract",
        inputs: [
          {
            name: "token",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_pragma_vrf_contract_address",
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
    type: "impl",
    name: "PragmaVRF",
    interface_name: "coinflip::IPragmaVRF",
  },
  {
    type: "struct",
    name: "core::array::Span::<core::felt252>",
    members: [
      {
        name: "snapshot",
        type: "@core::array::Array::<core::felt252>",
      },
    ],
  },
  {
    type: "interface",
    name: "coinflip::IPragmaVRF",
    items: [
      {
        type: "function",
        name: "receive_random_words",
        inputs: [
          {
            name: "requester_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "request_id",
            type: "core::integer::u64",
          },
          {
            name: "random_words",
            type: "core::array::Span::<core::felt252>",
          },
          {
            name: "calldata",
            type: "core::array::Array::<core::felt252>",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "OwnableImpl",
    interface_name: "openzeppelin_access::ownable::interface::IOwnable",
  },
  {
    type: "interface",
    name: "openzeppelin_access::ownable::interface::IOwnable",
    items: [
      {
        type: "function",
        name: "owner",
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
        name: "transfer_ownership",
        inputs: [
          {
            name: "new_owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "renounce_ownership",
        inputs: [],
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
        name: "pragma_vrf_contract_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "token_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "event",
    name: "coinflip::CoinFlip::CoinFlipStarted",
    kind: "struct",
    members: [
      {
        name: "request_id",
        type: "core::integer::u64",
        kind: "data",
      },
      {
        name: "player",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "amount",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "choice",
        type: "coinflip::FlipChoice",
        kind: "data",
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
    type: "event",
    name: "coinflip::CoinFlip::CoinFlipCompleted",
    kind: "struct",
    members: [
      {
        name: "request_id",
        type: "core::integer::u64",
        kind: "data",
      },
      {
        name: "player",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "choice",
        type: "coinflip::FlipChoice",
        kind: "data",
      },
      {
        name: "result",
        type: "coinflip::FlipChoice",
        kind: "data",
      },
      {
        name: "won",
        type: "core::bool",
        kind: "data",
      },
      {
        name: "amount",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    kind: "struct",
    members: [
      {
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    kind: "struct",
    members: [
      {
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "OwnershipTransferred",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        kind: "nested",
      },
      {
        name: "OwnershipTransferStarted",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "coinflip::CoinFlip::Event",
    kind: "enum",
    variants: [
      {
        name: "CoinFlipStarted",
        type: "coinflip::CoinFlip::CoinFlipStarted",
        kind: "nested",
      },
      {
        name: "CoinFlipCompleted",
        type: "coinflip::CoinFlip::CoinFlipCompleted",
        kind: "nested",
      },
      {
        name: "OwnableEvent",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
        kind: "flat",
      },
    ],
  },
];

export const SNAKE_N_LADDERS_ABI: Abi = [
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