"use client"
import { useCallback, useRef } from 'react';
import { useProvider } from '@starknet-react/core';
import { Contract } from 'starknet';

const CONTRACT_ADDRESS = '0x03730b941e8d3ece030a4a0d5f1008f34fbde0976e86577a78648c8b35079464';

const CONTRACT_ABI = [
  {
    name: 'start_new_game',
    type: 'function',
    inputs: [],
    outputs: [],
    stateMutability: 'external'
  },
  {
    name: 'increment_score',
    type: 'function',
    inputs: [],
    outputs: [],
    stateMutability: 'external'
  },
  {
    name: 'end_game',
    type: 'function',
    inputs: [],
    outputs: [],
    stateMutability: 'external'
  },
  {
    name: 'get_high_score',
    type: 'function',
    inputs: [
      { name: 'address', type: 'felt' },
      { name: 'leaderboard_id', type: 'felt' }
    ],
    outputs: [{ name: 'score', type: 'felt' }],
    stateMutability: 'view'
  },
  {
    name: 'get_current_leaderboard_id',
    type: 'function',
    inputs: [],
    outputs: [{ name: 'id', type: 'felt' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'get_leaderboard',
    inputs: [],
    outputs: [{ type: 'core::array::Array::<(core::starknet::contract_address::ContractAddress, core::integer::u32)>' }],
    stateMutability: 'view'
  }
];

export const useGameContract = (connected, account) => {
  const provider = useProvider();
  const contractRef = useRef(null);

  if (!contractRef.current && account) {
    contractRef.current = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);
  }

  const executeContractCall = useCallback(async (entrypoint, calldata = []) => {
    if (!connected || !account) return false;
    try {
      await account.execute({
        contractAddress: CONTRACT_ADDRESS,
        entrypoint,
        calldata,
        session: true
      });
      return true;
    } catch (error) {
      return false;
    }
  }, [account, connected]);

  const startNewGame = useCallback(() => executeContractCall('start_new_game'), [executeContractCall]);
  const incrementScore = useCallback(() => executeContractCall('increment_score'), [executeContractCall]);
  const endGame = useCallback(() => executeContractCall('end_game'), [executeContractCall]);

  const getCurrentLeaderboardId = useCallback(async () => {
    if (!contractRef.current) return 0;
    
    try {
      const result = await contractRef.current.get_current_leaderboard_id();
      return Number(result.id);
    } catch (error) {
      return 0;
    }
  }, []);

  const getHighScore = useCallback(async (address) => {
    if (!contractRef.current || !address) return 0;
    
    try {
      const currentLeaderboardId = await getCurrentLeaderboardId();
      const result = await contractRef.current.get_high_score(address, currentLeaderboardId);
      return Number(result.score);
    } catch (error) {
      return 0;
    }
  }, [getCurrentLeaderboardId]);

  const getLeaderboard = useCallback(async () => {
    if (!contractRef.current) {
      return [];
    }
    
    try {
      const result = await contractRef.current.get_leaderboard();
      console.log('getLeaderboard: Raw result from contract:', result);
      
      if (!Array.isArray(result)) {
        return [];
      }
      
      return result.map(entry => ({
        address: `0x${entry[0].toString(16)}`, // Convert BigInt to hex string
        score: Number(entry[1])
      }));
    } catch (error) {
      return [];
    }
  }, [contractRef]);

  return {
    startNewGame,
    incrementScore,
    endGame,
    getHighScore,
    getLeaderboard,
    getCurrentLeaderboardId
  };
}; 