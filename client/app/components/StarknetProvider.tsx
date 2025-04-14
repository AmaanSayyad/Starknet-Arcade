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

  const [controllerConnector, setControllerConnector] =
    useState<Connector | null>(null);

  useEffect(() => {
    const init = async () => {
      const { default: ControllerConnector } = await import(
        "@cartridge/connector/controller"
      );

      const controller = new ControllerConnector({
        chains: [{ rpcUrl: SEPOLIA_RPC_URL }, { rpcUrl: MAINNET_RPC_URL }],
        defaultChainId:
          CURRENT_CHAIN_ID === "SN_SEPOLIA"
            ? constants.StarknetChainId.SN_SEPOLIA
            : constants.StarknetChainId.SN_MAIN,
        policies,
      });

      setControllerConnector(controller);
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
        dappName: "Lottery Starknet",
        url: "https://lottery-dapp-starknet.vercel.app/",
      },
    }) as unknown as Connector,
    ...(controllerConnector ? [controllerConnector] : []),
  ];

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
