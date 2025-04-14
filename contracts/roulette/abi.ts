export const abi = [
  {
    type: "impl",
    name: "Roulette",
    interface_name: "roulette::IRouletteContract",
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
    type: "struct",
    name: "roulette::Bet",
    members: [
      {
        name: "amount",
        type: "core::integer::u256",
      },
      {
        name: "numbers",
        type: "core::array::Array::<core::integer::u8>",
      },
    ],
  },
  {
    type: "enum",
    name: "roulette::RouletteState",
    variants: [
      {
        name: "Idle",
        type: "()",
      },
      {
        name: "Spinning",
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
    name: "roulette::SpinDetails",
    members: [
      {
        name: "player",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "total_bet_amount",
        type: "core::integer::u256",
      },
      {
        name: "winning_number",
        type: "core::integer::u8",
      },
      {
        name: "state",
        type: "roulette::RouletteState",
      },
      {
        name: "request_id",
        type: "core::integer::u64",
      },
      {
        name: "total_payout",
        type: "core::integer::u256",
      },
    ],
  },
  {
    type: "interface",
    name: "roulette::IRouletteContract",
    items: [
      {
        type: "function",
        name: "spin_roulette",
        inputs: [
          {
            name: "bets",
            type: "core::array::Array::<roulette::Bet>",
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
        name: "get_spin_details",
        inputs: [
          {
            name: "request_id",
            type: "core::integer::u64",
          },
        ],
        outputs: [
          {
            type: "(roulette::SpinDetails, core::array::Array::<roulette::Bet>)",
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
    interface_name: "roulette::IPragmaVRF",
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
    name: "roulette::IPragmaVRF",
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
      {
        name: "house_edge_bps",
        type: "core::integer::u16",
      },
    ],
  },
  {
    type: "event",
    name: "roulette::RouletteContract::RouletteSpinStarted",
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
        name: "total_bet_amount",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "roulette::RouletteContract::RouletteSpinCompleted",
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
        name: "winning_number",
        type: "core::integer::u8",
        kind: "data",
      },
      {
        name: "total_payout",
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
    name: "roulette::RouletteContract::Event",
    kind: "enum",
    variants: [
      {
        name: "RouletteSpinStarted",
        type: "roulette::RouletteContract::RouletteSpinStarted",
        kind: "nested",
      },
      {
        name: "RouletteSpinCompleted",
        type: "roulette::RouletteContract::RouletteSpinCompleted",
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
