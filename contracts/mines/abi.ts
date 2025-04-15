[
  {
    type: "impl",
    name: "MinesGame",
    interface_name: "mines::IMinesGame",
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
    type: "enum",
    name: "mines::GameStatus",
    variants: [
      {
        name: "Inactive",
        type: "()",
      },
      {
        name: "Active",
        type: "()",
      },
      {
        name: "Completed",
        type: "()",
      },
      {
        name: "Failed",
        type: "()",
      },
    ],
  },
  {
    type: "struct",
    name: "mines::GameState",
    members: [
      {
        name: "player",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "bet_amount",
        type: "core::integer::u256",
      },
      {
        name: "number_of_mines",
        type: "core::integer::u8",
      },
      {
        name: "tiles_opened",
        type: "core::integer::u8",
      },
      {
        name: "status",
        type: "mines::GameStatus",
      },
      {
        name: "created_at",
        type: "core::integer::u64",
      },
    ],
  },
  {
    type: "interface",
    name: "mines::IMinesGame",
    items: [
      {
        type: "function",
        name: "start_game",
        inputs: [
          {
            name: "bet_amount",
            type: "core::integer::u256",
          },
          {
            name: "number_of_mines",
            type: "core::integer::u8",
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
        name: "open_tile",
        inputs: [
          {
            name: "tile_index",
            type: "core::integer::u8",
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
        name: "cash_out",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_game_state",
        inputs: [
          {
            name: "player_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "mines::GameState",
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
        name: "get_payout_multiplier",
        inputs: [
          {
            name: "mines",
            type: "core::integer::u8",
          },
          {
            name: "tiles_opened",
            type: "core::integer::u8",
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
        name: "set_payout_multiplier",
        inputs: [
          {
            name: "mines",
            type: "core::integer::u8",
          },
          {
            name: "tiles_opened",
            type: "core::integer::u8",
          },
          {
            name: "multiplier",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_contract_balance",
        inputs: [],
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
            name: "amount",
            type: "core::integer::u256",
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
        name: "token_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "event",
    name: "mines::MinesGame::GameStarted",
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
      {
        name: "number_of_mines",
        type: "core::integer::u8",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "mines::MinesGame::TileOpened",
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
        name: "tile_index",
        type: "core::integer::u8",
        kind: "data",
      },
      {
        name: "is_safe",
        type: "core::bool",
        kind: "data",
      },
      {
        name: "tiles_opened",
        type: "core::integer::u8",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "mines::MinesGame::GameLost",
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
        name: "tiles_opened",
        type: "core::integer::u8",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "mines::MinesGame::GameWon",
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
        name: "payout_amount",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "tiles_opened",
        type: "core::integer::u8",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "mines::MinesGame::FeeAddressChanged",
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
    name: "mines::MinesGame::Event",
    kind: "enum",
    variants: [
      {
        name: "GameStarted",
        type: "mines::MinesGame::GameStarted",
        kind: "nested",
      },
      {
        name: "TileOpened",
        type: "mines::MinesGame::TileOpened",
        kind: "nested",
      },
      {
        name: "GameLost",
        type: "mines::MinesGame::GameLost",
        kind: "nested",
      },
      {
        name: "GameWon",
        type: "mines::MinesGame::GameWon",
        kind: "nested",
      },
      {
        name: "FeeAddressChanged",
        type: "mines::MinesGame::FeeAddressChanged",
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
