export const abi = [
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
