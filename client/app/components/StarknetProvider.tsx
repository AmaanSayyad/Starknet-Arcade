/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useConnect,
  useDisconnect,
  useAccount,
  useProvider,
  argent,
  braavos,
  Connector,
  useInjectedConnectors,
  StarknetConfig,
  voyager,
  jsonRpcProvider,
} from "@starknet-react/core";
import { sepolia, mainnet } from "@starknet-react/chains";
import { constants } from "starknet";

import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import {
  COIN_FLIP_ADDRESS,
  STRK_TOKEN_ADDRESS,
  RPS_CONTRACT_ADDRESS,
  SNAKE_N_LADDERS_ADDRESS,
  ROULETTE_ADDRESS,
} from "../constants";

const CONTRACT_ADDRESS = COIN_FLIP_ADDRESS;
const StarkTokenAddress = STRK_TOKEN_ADDRESS;

// const policies = {
//   contracts: {
//     [CONTRACT_ADDRESS]: {
//       name: 'Flappy Bird Game',
//       description: 'Allows interaction with the Flappy Bird game contract',
//       methods: [
//         { name: 'Start New Game', entrypoint: 'start_new_game', session: true },
//         { name: 'Increment Score', entrypoint: 'increment_score', session: true },
//         { name: 'End Game', entrypoint: 'end_game', session: true },
//         { name: 'Get High Score', entrypoint: 'get_high_score', session: true },
//       ],
//     },
//   },
// };

const policies = {
  contracts: {
    [CONTRACT_ADDRESS]: {
      name: "Coin Flip",
      description: "Allows interaction with the Flappy Bird game contract",
      methods: [{ name: "Flip Coin", entrypoint: "flip_coin", session: true }],
    },
    [StarkTokenAddress]: {
      name: "STRK Token",
      description: "Allows interaction with the STRK token contract",
      methods: [{ name: "Approve", entrypoint: "approve", session: true }],
    },
    [RPS_CONTRACT_ADDRESS]: {
      name: "Rock Paper Scissors",
      description:
        "Allows interaction with the Rock Paper Scissors game contract",
      methods: [{ name: "Join", entrypoint: "join", session: true }],
    },
    [SNAKE_N_LADDERS_ADDRESS]: {
      name: "Snake Ladder game",
      description: "Allows interaction with the Snake and ladder game contract",
      methods: [
        { name: "Dice Roll", entrypoint: "roll", session: true },
        {
          name: "Computer Dice Roll",
          entrypoint: "roll_for_computer",
          session: true,
        },
        { name: "Create Game", entrypoint: "create_game", session: true },
        {name:"End game",entrypoint:"end_game",session:true}
      ],
    },
    [ROULETTE_ADDRESS]: {
      name: "Roulette Game",
      description: "Allows interaction with the Roulette game contract for automated betting",
      methods: [
        // Betting methods
        { name: "Place Multiple Bets", entrypoint: "place_multiple_bets", session: true },
        { name: "Place Single Bet", entrypoint: "place_single_bet", session: true },
        { name: "Spin Wheel", entrypoint: "spin_wheel", session: true },
        
        // User withdrawal methods
        { name: "Withdraw User Winnings", entrypoint: "withdraw_user_winnings", session: true },
        
        // View functions (for automation to check states)
        { name: "Get User Balance", entrypoint: "get_user_balance", session: true },
        { name: "Get House Balance", entrypoint: "get_house_balance", session: true },
        { name: "Get Last Result", entrypoint: "get_last_result", session: true },
        { name: "Get Pending Bets", entrypoint: "get_pending_bets", session: true },
        { name: "Get Max Payout", entrypoint: "get_max_payout", session: true },
        { name: "Get Bet Type Info", entrypoint: "get_bet_type_info", session: true },
        
        // House management (if user has permissions)
        { name: "Deposit House Funds", entrypoint: "deposit_house_funds", session: true },
        { name: "Withdraw House Funds", entrypoint: "withdraw_house_funds", session: true },
        { name: "Set Bet Limits", entrypoint: "set_bet_limits", session: true },
        { name: "Set Max Payout Percentage", entrypoint: "set_max_payout_percentage", session: true },
        
        // Admin functions
        { name: "Pause Contract", entrypoint: "pause_contract", session: true },
        { name: "Unpause Contract", entrypoint: "unpause_contract", session: true },
        { name: "Cleanup Old Bets", entrypoint: "cleanup_old_bets", session: true },
      ],
    },
  },
};

const SEPOLIA_RPC_URL = "https://api.cartridge.gg/x/starknet/sepolia";
const MAINNET_RPC_URL = "https://api.cartridge.gg/x/starknet/mainnet";
const CURRENT_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || "SN_SEPOLIA";

const customProvider = jsonRpcProvider({
  rpc: (chain) => {
    switch (chain) {
      case mainnet:
        return { nodeUrl: MAINNET_RPC_URL };
      case sepolia:
      default:
        return { nodeUrl: SEPOLIA_RPC_URL };
    }
  },
});

const StarknetContext = createContext<any | null>(null);

export const useStarknetContext = () => {
  const context = useContext(StarknetContext);
  if (!context) {
    throw new Error(
      "useStarknetContext must be used within a StarknetProvider"
    );
  }
  return context;
};

const StarknetContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (connector: any) => {
    try {
      setIsLoading(true);
      setError(null);
      await connect({ connector });
    } catch (err) {
      console.error("Connection error:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await disconnect();
    } catch (err) {
      console.error("Disconnection error:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    connect: handleConnect,
    disconnect: handleDisconnect,
    connectors,
    account: provider,
    connected: isConnected,
    address,
    isLoading,
    error,
  };

  return (
    <StarknetContext.Provider value={value}>
      {children}
    </StarknetContext.Provider>
  );
};

export const StarknetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const chains = [mainnet, sepolia];
  const { connectors: injected } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "always",
  });

  const [controllerConnector, setControllerConnector] = useState<Connector | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
      const { default: ControllerConnector } = await import(
        "@cartridge/connector/controller"
      );

        let chainId;
        if (CURRENT_CHAIN_ID === "SN_SEPOLIA") {
          chainId = constants.StarknetChainId.SN_SEPOLIA;
        } else if (CURRENT_CHAIN_ID === "SN_MAIN") {
          chainId = constants.StarknetChainId.SN_MAIN;
        } else {
          chainId = constants.StarknetChainId.SN_SEPOLIA;
        }

      const controller = new ControllerConnector({
        chains: [{ rpcUrl: SEPOLIA_RPC_URL }, { rpcUrl: MAINNET_RPC_URL }],
          defaultChainId: chainId,
        policies,
      });

      setControllerConnector(controller);
      } catch (error) {
        console.error("Failed to initialize controller:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const allConnectors: Connector[] = [
    ...injected,
    new WebWalletConnector({
      url: "https://web.argent.xyz",
    }) as unknown as Connector,
    ArgentMobileConnector.init({
      options: {
        dappName: "Starknet Arcade",
        url: typeof window !== 'undefined' ? window.location.origin : "https://starknet-arcade.vercel.app/",
      },
    }) as unknown as Connector,
    ...(controllerConnector ? [controllerConnector] : []),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <StarknetConfig
      autoConnect
      chains={chains}
      provider={customProvider}
      connectors={allConnectors}
      explorer={voyager}
    >
      <StarknetContextProvider>{children}</StarknetContextProvider>
    </StarknetConfig>
  );
};
