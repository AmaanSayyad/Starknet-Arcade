import { Abi } from "starknet";

export const FactoryABI: Abi = [
  {
    type: "impl",
    name: "Factory",
    interface_name: "lottery::factory::ILotteryFactory",
  },
  {
    type: "struct",
    name: "core::byte_array::ByteArray",
    members: [
      {
        name: "data",
        type: "core::array::Array::<core::bytes_31::bytes31>",
      },
      {
        name: "pending_word",
        type: "core::felt252",
      },
      {
        name: "pending_word_len",
        type: "core::integer::u32",
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
    type: "struct",
    name: "lottery::factory::LotteryDetails",
    members: [
      {
        name: "lottery_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "token",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "participant_fees",
        type: "core::integer::u256",
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
    type: "struct",
    name: "lottery::factory::Profile",
    members: [
      {
        name: "is_registered",
        type: "core::bool",
      },
      {
        name: "username",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "profile_picture",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "bio",
        type: "core::byte_array::ByteArray",
      },
    ],
  },
  {
    type: "interface",
    name: "lottery::factory::ILotteryFactory",
    items: [
      {
        type: "function",
        name: "register_user",
        inputs: [
          {
            name: "username",
            type: "core::byte_array::ByteArray",
          },
          {
            name: "profile_picture",
            type: "core::byte_array::ByteArray",
          },
          {
            name: "bio",
            type: "core::byte_array::ByteArray",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "create_lottery",
        inputs: [
          {
            name: "token",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "minimum_participants",
            type: "core::integer::u256",
          },
          {
            name: "participant_fees",
            type: "core::integer::u256",
          },
          {
            name: "salt",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_pragma_vrf_contract_address",
        inputs: [
          {
            name: "new_pragma_vrf_contract_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_lottery_class_hash",
        inputs: [
          {
            name: "new_lottery_class_hash",
            type: "core::starknet::class_hash::ClassHash",
          },
        ],
        outputs: [],
        state_mutability: "external",
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
        name: "get_lotteries",
        inputs: [],
        outputs: [
          {
            type: "core::array::Array::<lottery::factory::LotteryDetails>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "is_registered",
        inputs: [
          {
            name: "user_address",
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
        name: "get_user_profile",
        inputs: [
          {
            name: "user_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "lottery::factory::Profile",
          },
        ],
        state_mutability: "view",
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
        name: "lottery_class_hash",
        type: "core::starknet::class_hash::ClassHash",
      },
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "event",
    name: "lottery::factory::Factory::LotteryCreated",
    kind: "struct",
    members: [
      {
        name: "lottery_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "token",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "participant_fees",
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
    name: "lottery::factory::Factory::Event",
    kind: "enum",
    variants: [
      {
        name: "LotteryCreated",
        type: "lottery::factory::Factory::LotteryCreated",
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

export const LotteryABI: Abi = [
  {
    type: "impl",
    name: "ILottery",
    interface_name: "lottery::lottery::ILottery",
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
    name: "lottery::lottery::State",
    variants: [
      {
        name: "Active",
        type: "()",
      },
      {
        name: "WinnerSelected",
        type: "()",
      },
      {
        name: "Closed",
        type: "()",
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
    name: "lottery::lottery::ILottery",
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
        name: "unenroll",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "withdraw_oracle_fees",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_lottery_details",
        inputs: [],
        outputs: [
          {
            type: "(core::starknet::contract_address::ContractAddress, core::array::Array::<core::starknet::contract_address::ContractAddress>, core::starknet::contract_address::ContractAddress, core::integer::u256, core::starknet::contract_address::ContractAddress, lottery::lottery::State, core::integer::u256)",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_participant_id",
        inputs: [
          {
            name: "participant_address",
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
        name: "is_enrolled",
        inputs: [
          {
            name: "participant_address",
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
    ],
  },
  {
    type: "impl",
    name: "PragmaVRFOracle",
    interface_name: "lottery::lottery::IPragmaVRF",
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
    name: "lottery::lottery::IPragmaVRF",
    items: [
      {
        type: "function",
        name: "get_last_random_number",
        inputs: [],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "select_winner",
        inputs: [
          {
            name: "seed",
            type: "core::integer::u64",
          },
          {
            name: "callback_fee_limit",
            type: "core::integer::u128",
          },
          {
            name: "publish_delay",
            type: "core::integer::u64",
          },
          {
            name: "num_words",
            type: "core::integer::u64",
          },
          {
            name: "calldata",
            type: "core::array::Array::<core::felt252>",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
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
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "minimum_participants",
        type: "core::integer::u256",
      },
      {
        name: "participant_fees",
        type: "core::integer::u256",
      },
      {
        name: "token_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "pragma_vrf_contract_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "event",
    name: "lottery::lottery::Lottery::ParticipantEnrolled",
    kind: "struct",
    members: [
      {
        name: "participant",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "lottery::lottery::Lottery::WinnerSelected",
    kind: "struct",
    members: [
      {
        name: "winner",
        type: "core::starknet::contract_address::ContractAddress",
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
    name: "lottery::lottery::Lottery::Event",
    kind: "enum",
    variants: [
      {
        name: "ParticipantEnrolled",
        type: "lottery::lottery::Lottery::ParticipantEnrolled",
        kind: "nested",
      },
      {
        name: "WinnerSelected",
        type: "lottery::lottery::Lottery::WinnerSelected",
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
