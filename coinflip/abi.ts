export const abi = [
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
