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

export const SNAKE_N_LADDERS_ABI: Abi =  [
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

export const RPS_ABI: Abi = [
  {
    type: "impl",
    name: "RockPaperScissorImpl",
    interface_name: "rps::IRockPaperScissor",
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
    type: "interface",
    name: "rps::IRockPaperScissor",
    items: [
      {
        type: "function",
        name: "join",
        inputs: [
          {
            name: "bet",
            type: "core::integer::u256",
          },
          {
            name: "rounds",
            type: "core::integer::u8",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_winner",
        inputs: [
          {
            name: "id",
            type: "core::integer::u32",
          },
          {
            name: "winner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "play_round",
        inputs: [
          {
            name: "id",
            type: "core::integer::u32",
          },
          {
            name: "round",
            type: "core::integer::u8",
          },
          {
            name: "player_move",
            type: "core::integer::u8",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "event",
    name: "rps::RockPaperScissor::Event",
    kind: "enum",
    variants: [],
  },
];


export const ROULETTE_ABI : Abi =[
  {
    "name": "IRouletteGame",
    "type": "impl",
    "interface_name": "roullete::roullete2::IRouletteGame"
  },
  {
    "name": "core::integer::u256",
    "type": "struct",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "name": "core::bool",
    "type": "enum",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "name": "core::array::Span::<core::integer::u64>",
    "type": "struct",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<core::integer::u64>"
      }
    ]
  },
  {
    "name": "roullete::roullete2::Bet",
    "type": "struct",
    "members": [
      {
        "name": "bet_type",
        "type": "core::integer::u8"
      },
      {
        "name": "numbers",
        "type": "core::array::Span::<core::integer::u64>"
      },
      {
        "name": "amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "name": "roullete::roullete2::IRouletteGame",
    "type": "interface",
    "items": [
      {
        "name": "create_game",
        "type": "function",
        "inputs": [
          {
            "name": "bet_amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u64"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "place_bet",
        "type": "function",
        "inputs": [
          {
            "name": "bet_type",
            "type": "core::integer::u8"
          },
          {
            "name": "bet_numbers",
            "type": "core::array::Array::<core::integer::u64>"
          },
          {
            "name": "bet_amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "spin_wheel",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u64"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "end_game",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u64"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "get_active_game_id",
        "type": "function",
        "inputs": [
          {
            "name": "player_address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u64"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_game_result",
        "type": "function",
        "inputs": [
          {
            "name": "player_address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "(core::integer::u64, core::integer::u256)"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_game_status",
        "type": "function",
        "inputs": [
          {
            "name": "player_address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u8"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_game_bets",
        "type": "function",
        "inputs": [
          {
            "name": "player_address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<roullete::roullete2::Bet>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_fee_address",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "set_fee_address",
        "type": "function",
        "inputs": [
          {
            "name": "new_address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "get_house_balance",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "withdraw_house_funds",
        "type": "function",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "deposit_funds",
        "type": "function",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "set_bet_limits",
        "type": "function",
        "inputs": [
          {
            "name": "min_bet",
            "type": "core::integer::u256"
          },
          {
            "name": "max_bet",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "withdraw_user_winnings",
        "type": "function",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "get_user_balance",
        "type": "function",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "pause_contract",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "unpause_contract",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "OwnableImpl",
    "type": "impl",
    "interface_name": "openzeppelin_access::ownable::interface::IOwnable"
  },
  {
    "name": "openzeppelin_access::ownable::interface::IOwnable",
    "type": "interface",
    "items": [
      {
        "name": "owner",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "transfer_ownership",
        "type": "function",
        "inputs": [
          {
            "name": "new_owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "renounce_ownership",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": [
      {
        "name": "token_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "fee_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "min_bet_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "max_bet_amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "roullete::roullete2::RouletteG::GameCreated",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "game_id",
        "type": "core::integer::u64"
      },
      {
        "kind": "data",
        "name": "player_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "initial_bet_amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "roullete::roullete2::RouletteG::BetPlaced",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "game_id",
        "type": "core::integer::u64"
      },
      {
        "kind": "data",
        "name": "player_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "bet_type",
        "type": "core::integer::u8"
      },
      {
        "kind": "data",
        "name": "bet_amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "roullete::roullete2::RouletteG::WheelSpun",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "game_id",
        "type": "core::integer::u64"
      },
      {
        "kind": "data",
        "name": "winning_number",
        "type": "core::integer::u64"
      },
      {
        "kind": "data",
        "name": "total_payout",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "entropy_hash",
        "type": "core::felt252"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "roullete::roullete2::RouletteG::PlayerWon",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "game_id",
        "type": "core::integer::u64"
      },
      {
        "kind": "data",
        "name": "player_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "payout_amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "roullete::roullete2::RouletteG::GameEnded",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "game_id",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "roullete::roullete2::RouletteG::FeeAddressChanged",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "old_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "new_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "roullete::roullete2::RouletteG::HouseFundsWithdrawn",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "amount",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "to_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "roullete::roullete2::RouletteG::UserWithdrawal",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "amount",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "fee",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "net_amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "roullete::roullete2::RouletteG::ContractPaused",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "roullete::roullete2::RouletteG::ContractUnpaused",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "OwnershipTransferred",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred"
      },
      {
        "kind": "nested",
        "name": "OwnershipTransferStarted",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
    "type": "event",
    "variants": []
  },
  {
    "kind": "enum",
    "name": "roullete::roullete2::RouletteG::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "GameCreated",
        "type": "roullete::roullete2::RouletteG::GameCreated"
      },
      {
        "kind": "nested",
        "name": "BetPlaced",
        "type": "roullete::roullete2::RouletteG::BetPlaced"
      },
      {
        "kind": "nested",
        "name": "WheelSpun",
        "type": "roullete::roullete2::RouletteG::WheelSpun"
      },
      {
        "kind": "nested",
        "name": "PlayerWon",
        "type": "roullete::roullete2::RouletteG::PlayerWon"
      },
      {
        "kind": "nested",
        "name": "GameEnded",
        "type": "roullete::roullete2::RouletteG::GameEnded"
      },
      {
        "kind": "nested",
        "name": "FeeAddressChanged",
        "type": "roullete::roullete2::RouletteG::FeeAddressChanged"
      },
      {
        "kind": "nested",
        "name": "HouseFundsWithdrawn",
        "type": "roullete::roullete2::RouletteG::HouseFundsWithdrawn"
      },
      {
        "kind": "nested",
        "name": "UserWithdrawal",
        "type": "roullete::roullete2::RouletteG::UserWithdrawal"
      },
      {
        "kind": "nested",
        "name": "ContractPaused",
        "type": "roullete::roullete2::RouletteG::ContractPaused"
      },
      {
        "kind": "nested",
        "name": "ContractUnpaused",
        "type": "roullete::roullete2::RouletteG::ContractUnpaused"
      },
      {
        "kind": "flat",
        "name": "OwnableEvent",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "ReentrancyGuardEvent",
        "type": "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event"
      }
    ]
  }
];
