/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Contract, CallData, cairo, BigNumberish } from "starknet";
import { ROULETTE_ABI } from "../abi";
import { ROULETTE_ADDRESS, provider, STRK_TOKEN_ADDRESS } from "../constants";
import toast from "react-hot-toast";

export interface GameState {
  gameId: number;
  status: number; // 0: betting, 1: spinning, 2: completed
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

  // Helper function to safely convert hex to number
  const safeHexToNumber = (hexValue: any): number => {
    if (!hexValue || hexValue === "0x" || hexValue === "0x0") return 0;
    try {
      return parseInt(hexValue.toString(), 16);
    } catch (error) {
      console.error("Error converting hex to number:", hexValue, error);
      return 0;
    }
  };

  // Helper function to safely convert hex to BigInt
  const safeHexToBigInt = (hexValue: any): bigint => {
    if (!hexValue || hexValue === "0x" || hexValue === "0x0") return BigInt(0);
    try {
      return BigInt(hexValue.toString());
    } catch (error) {
      console.error("Error converting hex to BigInt:", hexValue, error);
      return BigInt(0);
    }
  };

  // Fund contract (owner only - for house balance)
  const fundContract = useCallback(
    async (amount: BigNumberish): Promise<boolean> => {
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
          {
            contractAddress: ROULETTE_ADDRESS,
            entrypoint: "deposit_funds",
            calldata: CallData.compile({
              amount: cairo.uint256(amount),
            }),
          },
        ]);

        const txHash = multiCall?.transaction_hash;
        if (!txHash) throw new Error("Transaction hash missing");

        toast.success("Funding contract...");
        await provider.waitForTransaction(txHash);
        toast.success("Contract funded successfully!");
        
        await getHouseBalance();
        return true;
      } catch (err) {
        console.error("Fund contract failed:", err);
        toast.error("Failed to fund contract");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [connected, account]
  );

  // Create game with initial deposit
  const createGame = useCallback(
    async (betAmount: BigNumberish): Promise<boolean> => {
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
        
        // Get active game ID and update state
        await getGameStatus();
        await getUserBalance();
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

  // Place bet (uses user's deposited balance)
  const placeBet = useCallback(
    async (betType: number, betNumbers: number[], betAmount: BigNumberish): Promise<boolean> => {
      if (!connected || !account || !contractRef.current) {
        toast.error("Please connect your wallet");
        return false;
      }

      setLoading(true);
      try {
        const multiCall = await account.execute([
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
        
        // Add bet to current bets and update balance
        const newBet: Bet = { type: betType, numbers: betNumbers, amount: betAmount };
        setCurrentBets(prev => [...prev, newBet]);
        
        await getUserBalance();
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

  // Spin wheel - FIXED
  const spinWheel = useCallback(
    async (): Promise<number | null> => {
      if (!connected || !account || !contractRef.current) {
        toast.error("Please connect your wallet");
        return null;
      }

      setLoading(true);
      setGameState(prev => ({ ...prev, status: 1 })); // Set to spinning
      
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
        
        // FIXED: Get game result with proper parsing
        const gameResultRaw = await contractRef.current.get_game_result(account.address);
        console.log("Raw game result:", gameResultRaw);
        
        // Parse the result properly - contract returns array of hex strings
        let result: number = 0;
        let winAmount: bigint = BigInt(0);
        
        if (Array.isArray(gameResultRaw)) {
          result = safeHexToNumber(gameResultRaw[0]);
          winAmount = safeHexToBigInt(gameResultRaw[1]);
        } else if (gameResultRaw && typeof gameResultRaw === 'object') {
          // If it's an object with properties
          result = safeHexToNumber(gameResultRaw[0] || gameResultRaw.result || gameResultRaw.winning_number);
          winAmount = safeHexToBigInt(gameResultRaw[1] || gameResultRaw.winAmount || gameResultRaw.total_payout);
        }
        
        setGameState(prev => ({ 
          ...prev, 
          result: result, 
          winAmount: winAmount,
          status: 2 // Game completed
        }));
        
        await getUserBalance();
        toast.success(`Wheel stopped at ${result}!`);
        return result;
      } catch (err) {
        console.error("Spin wheel failed:", err);
        toast.error("Failed to spin wheel");
        setGameState(prev => ({ ...prev, status: 0 }));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [connected, account]
  );

  // End game - FIXED
  const endGame = useCallback(
    async (): Promise<boolean> => {
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
        
        await getUserBalance();
        await getGameStatus();
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
    async (amount: BigNumberish): Promise<boolean> => {
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
        
        // Calculate fee and net amount for display
        const fee = Number(amount) * 0.02; // 2% fee
        const netAmount = Number(amount) - fee;
        toast.success(`Withdrawn ${netAmount} tokens (${fee} fee)`);
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
    async (amount: BigNumberish): Promise<boolean> => {
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

  // Get user balance - FIXED
  const getUserBalance = useCallback(
    async (): Promise<BigNumberish> => {
      if (!connected || !account || !contractRef.current) return 0;

      try {
        const balanceRaw = await contractRef.current.get_user_balance(account.address);
        const balance = safeHexToBigInt(balanceRaw);
        setGameState(prev => ({ ...prev, userBalance: balance }));
        return balance;
      } catch (err) {
        console.error("Get user balance failed:", err);
        return 0;
      }
    },
    [connected, account]
  );

  // Get house balance - FIXED
  const getHouseBalance = useCallback(
    async (): Promise<BigNumberish> => {
      if (!connected || !account || !contractRef.current) return 0;

      try {
        const balanceRaw = await contractRef.current.get_house_balance();
        const balance = safeHexToBigInt(balanceRaw);
        setGameState(prev => ({ ...prev, houseBalance: balance }));
        return balance;
      } catch (err) {
        console.error("Get house balance failed:", err);
        return 0;
      }
    },
    [connected, account]
  );

  // Get game status - FIXED
  const getGameStatus = useCallback(
    async (): Promise<number> => {
      if (!connected || !account || !contractRef.current) return 0;

      try {
        // Check if user has an active game first
        const gameIdRaw = await contractRef.current.get_active_game_id(account.address);
        const gameId = safeHexToNumber(gameIdRaw);
        
        if (gameId === 0) {
          setGameState(prev => ({ ...prev, status: 0, gameId: 0 }));
          return 0;
        }

        const statusRaw = await contractRef.current.get_game_status(account.address);
        const status = safeHexToNumber(statusRaw);
        
        setGameState(prev => ({ ...prev, status: status, gameId: gameId }));
        return status;
      } catch (err) {
        console.error("Get game status failed:", err);
        // If no active game, set status to 0
        setGameState(prev => ({ ...prev, status: 0, gameId: 0 }));
        return 0;
      }
    },
    [connected, account]
  );

  // Get current bets - FIXED
  const getCurrentBets = useCallback(
    async (): Promise<Bet[]> => {
      if (!connected || !account || !contractRef.current) return [];

      try {
        // Check if user has an active game first
        const gameIdRaw = await contractRef.current.get_active_game_id(account.address);
        const gameId = safeHexToNumber(gameIdRaw);
        
        if (gameId === 0) {
          setCurrentBets([]);
          return [];
        }

        const betsRaw = await contractRef.current.get_game_bets(account.address);
        console.log("Raw bets:", betsRaw);
        
        // Parse bets if they exist
        const parsedBets: Bet[] = [];
        if (Array.isArray(betsRaw) && betsRaw.length > 0) {
          betsRaw.forEach((bet: any) => {
            if (bet && typeof bet === 'object') {
              const parsedBet: Bet = {
                type: safeHexToNumber(bet.bet_type || bet.type || 0),
                numbers: Array.isArray(bet.numbers) ? bet.numbers.map(safeHexToNumber) : [],
                amount: safeHexToBigInt(bet.amount || bet.bet_amount || 0),
              };
              parsedBets.push(parsedBet);
            }
          });
        }
        
        setCurrentBets(parsedBets);
        return parsedBets;
      } catch (err) {
        console.error("Get current bets failed:", err);
        setCurrentBets([]);
        return [];
      }
    },
    [connected, account]
  );

  return {
    gameState,
    currentBets,
    loading,
    fundContract,
    createGame,
    placeBet,
    spinWheel,
    endGame,
    withdrawUserWinnings,
    withdrawHouseFunds,
    getUserBalance,
    getHouseBalance,
    getGameStatus,
    getCurrentBets,
  };
};
