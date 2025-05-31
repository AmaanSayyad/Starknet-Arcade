/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Contract, CallData, cairo, BigNumberish } from "starknet";
import { ROULETTE_ABI } from "../abi";
import { ROULETTE_ADDRESS, provider, STRK_TOKEN_ADDRESS } from "../constants";
import toast from "react-hot-toast";

export interface GameState {
  gameId: number;
  status: number; // 0: not started, 1: betting, 2: spinning, 3: ended
  result: number;
  winAmount: BigNumberish;
  userBalance: BigNumberish;
  houseBalance: BigNumberish;
}

export interface Bet {
  type: number;
  numbers: number[];
  amount: BigNumberish;
}

export const useRoulette = (connected: boolean, account: any) => {
  const contractRef = useRef<Contract | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    gameId: 0,
    status: 0,
    result: 0,
    winAmount: 0,
    userBalance: 0,
    houseBalance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [currentBets, setCurrentBets] = useState<Bet[]>([]);

  useEffect(() => {
    if (account && !contractRef.current) {
      contractRef.current = new Contract(
        ROULETTE_ABI,
        ROULETTE_ADDRESS,
        account
      );
    }
  }, [account]);

  // Fund account (approve tokens)
  const fundAccount = useCallback(
    async (amount: BigNumberish) => {
      if (!connected || !account) {
        toast.error("Please connect your wallet");
        return false;
      }

      setLoading(true);
      try {
        const multiCall = await account.execute([
          {
            contractAddress: STRK_TOKEN_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: ROULETTE_ADDRESS,
              amount: cairo.uint256(amount),
            }),
          },
        ]);

        const txHash = multiCall?.transaction_hash;
        if (!txHash) throw new Error("Transaction hash missing");

        toast.success("Funding account...");
        await provider.waitForTransaction(txHash);
        toast.success("Account funded successfully!");
        
        // Update user balance
        await getUserBalance();
        return true;
      } catch (err) {
        console.error("Fund account failed:", err);
        toast.error("Failed to fund account");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [connected, account]
  );

  // Create game
  const createGame = useCallback(
    async (betAmount: BigNumberish) => {
      if (!connected || !account || !contractRef.current) {
        toast.error("Please connect your wallet");
        return false;
      }

      setLoading(true);
      try {
        const multiCall = await account.execute([
          {
            contractAddress: STRK_TOKEN_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: ROULETTE_ADDRESS,
              amount: cairo.uint256(betAmount),
            }),
          },
          {
            contractAddress: ROULETTE_ADDRESS,
            entrypoint: "create_game",
            calldata: CallData.compile({
              bet_amount: cairo.uint256(betAmount),
            }),
          },
        ]);

        const txHash = multiCall?.transaction_hash;
        if (!txHash) throw new Error("Transaction hash missing");

        toast.success("Creating game...");
        await provider.waitForTransaction(txHash);
        
        // Get active game ID
        const gameId = await contractRef.current.get_active_game_id(account.address);
        setGameState(prev => ({ ...prev, gameId: Number(gameId), status: 1 }));
        
        toast.success("Game created successfully!");
        return true;
      } catch (err) {
        console.error("Create game failed:", err);
        toast.error("Failed to create game");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [connected, account]
  );

  // Place bet
  const placeBet = useCallback(
    async (betType: number, betNumbers: number[], betAmount: BigNumberish) => {
      if (!connected || !account || !contractRef.current) {
        toast.error("Please connect your wallet");
        return false;
      }

      setLoading(true);
      try {
        const multiCall = await account.execute([
          {
            contractAddress: STRK_TOKEN_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: ROULETTE_ADDRESS,
              amount: cairo.uint256(betAmount),
            }),
          },
          {
            contractAddress: ROULETTE_ADDRESS,
            entrypoint: "place_bet",
            calldata: CallData.compile({
              bet_type: betType,
              bet_numbers: betNumbers,
              bet_amount: cairo.uint256(betAmount),
            }),
          },
        ]);

        const txHash = multiCall?.transaction_hash;
        if (!txHash) throw new Error("Transaction hash missing");

        toast.success("Placing bet...");
        await provider.waitForTransaction(txHash);
        
        // Add bet to current bets
        const newBet: Bet = { type: betType, numbers: betNumbers, amount: betAmount };
        setCurrentBets(prev => [...prev, newBet]);
        
        toast.success("Bet placed successfully!");
        return true;
      } catch (err) {
        console.error("Place bet failed:", err);
        toast.error("Failed to place bet");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [connected, account]
  );

  // Spin wheel
  const spinWheel = useCallback(
    async () => {
      if (!connected || !account || !contractRef.current) {
        toast.error("Please connect your wallet");
        return null;
      }

      setLoading(true);
      setGameState(prev => ({ ...prev, status: 2 }));
      
      try {
        const multiCall = await account.execute([
          {
            contractAddress: ROULETTE_ADDRESS,
            entrypoint: "spin_wheel",
            calldata: CallData.compile({}),
          },
        ]);

        const txHash = multiCall?.transaction_hash;
        if (!txHash) throw new Error("Transaction hash missing");

        toast.success("Spinning wheel...");
        await provider.waitForTransaction(txHash);
        
        // Get game result
        const [result, winAmount] = await contractRef.current.get_game_result(account.address);
        setGameState(prev => ({ 
          ...prev, 
          result: Number(result), 
          winAmount: winAmount,
          status: 3 
        }));
        
        toast.success(`Wheel stopped at ${result}!`);
        return Number(result);
      } catch (err) {
        console.error("Spin wheel failed:", err);
        toast.error("Failed to spin wheel");
        setGameState(prev => ({ ...prev, status: 1 }));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [connected, account]
  );

  // End game
  const endGame = useCallback(
    async () => {
      if (!connected || !account || !contractRef.current) {
        toast.error("Please connect your wallet");
        return false;
      }

      setLoading(true);
      try {
        const multiCall = await account.execute([
          {
            contractAddress: ROULETTE_ADDRESS,
            entrypoint: "end_game",
            calldata: CallData.compile({}),
          },
        ]);

        const txHash = multiCall?.transaction_hash;
        if (!txHash) throw new Error("Transaction hash missing");

        toast.success("Ending game...");
        await provider.waitForTransaction(txHash);
        
        // Reset game state
        setGameState({
          gameId: 0,
          status: 0,
          result: 0,
          winAmount: 0,
          userBalance: 0,
          houseBalance: 0,
        });
        setCurrentBets([]);
        
        toast.success("Game ended successfully!");
        return true;
      } catch (err) {
        console.error("End game failed:", err);
        toast.error("Failed to end game");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [connected, account]
  );

  // Withdraw user winnings
  const withdrawUserWinnings = useCallback(
    async (amount: BigNumberish) => {
      if (!connected || !account || !contractRef.current) {
        toast.error("Please connect your wallet");
        return false;
      }

      setLoading(true);
      try {
        const multiCall = await account.execute([
          {
            contractAddress: ROULETTE_ADDRESS,
            entrypoint: "withdraw_user_winnings",
            calldata: CallData.compile({
              amount: cairo.uint256(amount),
            }),
          },
        ]);

        const txHash = multiCall?.transaction_hash;
        if (!txHash) throw new Error("Transaction hash missing");

        toast.success("Withdrawing winnings...");
        await provider.waitForTransaction(txHash);
        
        await getUserBalance();
        toast.success("Winnings withdrawn successfully!");
        return true;
      } catch (err) {
        console.error("Withdraw winnings failed:", err);
        toast.error("Failed to withdraw winnings");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [connected, account]
  );

  // Withdraw house funds (owner only)
  const withdrawHouseFunds = useCallback(
    async (amount: BigNumberish) => {
      if (!connected || !account || !contractRef.current) {
        toast.error("Please connect your wallet");
        return false;
      }

      setLoading(true);
      try {
        const multiCall = await account.execute([
          {
            contractAddress: ROULETTE_ADDRESS,
            entrypoint: "withdraw_house_funds",
            calldata: CallData.compile({
              amount: cairo.uint256(amount),
            }),
          },
        ]);

        const txHash = multiCall?.transaction_hash;
        if (!txHash) throw new Error("Transaction hash missing");

        toast.success("Withdrawing house funds...");
        await provider.waitForTransaction(txHash);
        
        await getHouseBalance();
        toast.success("House funds withdrawn successfully!");
        return true;
      } catch (err) {
        console.error("Withdraw house funds failed:", err);
        toast.error("Failed to withdraw house funds");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [connected, account]
  );

  // Get user balance
  const getUserBalance = useCallback(
    async () => {
      if (!connected || !account || !contractRef.current) return;

      try {
        const balance = await contractRef.current.get_user_balance(account.address);
        setGameState(prev => ({ ...prev, userBalance: balance }));
        return balance;
      } catch (err) {
        console.error("Get user balance failed:", err);
        return 0;
      }
    },
    [connected, account]
  );

  // Get house balance
  const getHouseBalance = useCallback(
    async () => {
      if (!connected || !account || !contractRef.current) return;

      try {
        const balance = await contractRef.current.get_house_balance();
        setGameState(prev => ({ ...prev, houseBalance: balance }));
        return balance;
      } catch (err) {
        console.error("Get house balance failed:", err);
        return 0;
      }
    },
    [connected, account]
  );

  // Get game status
  const getGameStatus = useCallback(
    async () => {
      if (!connected || !account || !contractRef.current) return;

      try {
        const status = await contractRef.current.get_game_status(account.address);
        setGameState(prev => ({ ...prev, status: Number(status) }));
        return Number(status);
      } catch (err) {
        console.error("Get game status failed:", err);
        return 0;
      }
    },
    [connected, account]
  );

  return {
    gameState,
    currentBets,
    loading,
    fundAccount,
    createGame,
    placeBet,
    spinWheel,
    endGame,
    withdrawUserWinnings,
    withdrawHouseFunds,
    getUserBalance,
    getHouseBalance,
    getGameStatus,
  };
};