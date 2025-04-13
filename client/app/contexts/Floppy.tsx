/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { createContext, useContext, useState } from 'react';
import { 
  useConnect, 
  useDisconnect, 
  useAccount, 
  useProvider
} from '@starknet-react/core';
import { useGameContract } from '../hooks/useGameContract';
import { constants } from "starknet";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  jsonRpcProvider,
  starkscan,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";

// Contract address
const CONTRACT_ADDRESS = '0x03730b941e8d3ece030a4a0d5f1008f34fbde0976e86577a78648c8b35079464';

// Define session policies for the game contract
const policies = {
  contracts: {
    [CONTRACT_ADDRESS]: {
      name: "Flappy Bird Game",
      description: "Allows interaction with the Flappy Bird game contract",
      methods: [
        {
          name: "Start New Game",
          description: "Start a new game session",
          entrypoint: "start_new_game",
          session: true
        },
        {
          name: "Increment Score",
          description: "Increment the player's score",
          entrypoint: "increment_score",
          session: true
        },
        {
          name: "End Game",
          description: "End the current game session",
          entrypoint: "end_game",
          session: true
        },
        {
          name: "Get High Score",
          description: "Get the player's high score",
          entrypoint: "get_high_score",
          session: true
        }
      ]
    }
  }
};

// Initialize the connector with Sepolia chain configuration
const SEPOLIA_RPC_URL =  'https://api.cartridge.gg/x/starknet/sepolia'
const MAINNET_RPC_URL =  'https://api.cartridge.gg/x/starknet/mainnet'
const CURRENT_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || 'SN_SEPOLIA'

// Initialize the connector
const controllerConnector = new ControllerConnector({
  chains: [
      { rpcUrl: SEPOLIA_RPC_URL },
      { rpcUrl: MAINNET_RPC_URL },
  ],
  defaultChainId: CURRENT_CHAIN_ID === 'SN_SEPOLIA' ? constants.StarknetChainId.SN_SEPOLIA : constants.StarknetChainId.SN_MAIN,
  policies: policies
})

// Configure RPC provider
const provider = jsonRpcProvider({
  rpc: (chain) => {
    switch (chain) {
      case mainnet:
        return { nodeUrl: MAINNET_RPC_URL }
      case sepolia:
      default:
        return { nodeUrl: SEPOLIA_RPC_URL }
    }
  },
})

const StarknetContext = createContext<any | null>(null);

export const useStarknetContext = () => {
  const context = useContext(StarknetContext);
  if (!context) {
    throw new Error('useStarknetContext must be used within a StarknetProvider');
  }
  return context;
};

const StarknetContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startNewGame, incrementScore, endGame, getHighScore } = useGameContract(isConnected, provider);

  const handleConnect = async (connector: any) => {
    try {
      setIsLoading(true);
      setError(null);
      await connect({ connector });
    } catch (err) {
      console.error('Connection error:', err);
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
      console.error('Disconnection error:', err);
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
    startNewGame,
    incrementScore,
    endGame,
    getHighScore
  };

  return (
    <StarknetContext.Provider value={value}>
      {children}
    </StarknetContext.Provider>
  );
};

export const StarknetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StarknetConfig
      autoConnect
      chains={[sepolia]}
      provider={provider}
      connectors={[controllerConnector]}
      explorer={starkscan}
    >
      <StarknetContextProvider>
        {children}
      </StarknetContextProvider>
    </StarknetConfig>
  );
}; 