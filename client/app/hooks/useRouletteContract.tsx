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

  // FIXED: Enhanced hex parsing with detailed logging
  const safeHexToNumber = (hexValue: any): number => {
    console.log("Parsing hex value:", hexValue, "Type:", typeof hexValue);
    
    if (!hexValue || hexValue === "0x" || hexValue === "0x0") return 0;
    
    try {
      let numStr = hexValue.toString();
      
      // Handle BigInt conversion
      if (typeof hexValue === 'bigint') {
        const num = Number(hexValue);
        console.log("BigInt converted to number:", num);
        if (num < 0 || num > 36) {
          console.warn(`Invalid roulette number from BigInt: ${num}, setting to 0`);
          return 0;
        }
        return num;
      }
      
      // Handle hex string
      if (typeof numStr === 'string' && numStr.startsWith('0x')) {
        const num = parseInt(numStr, 16);
        console.log("Hex string converted to number:", numStr, "->", num);
        if (num < 0 || num > 36) {
          console.warn(`Invalid roulette number from hex: ${num}, setting to 0`);
          return 0;
        }
        return num;
      }
      
      // Handle direct number
      const num = Number(hexValue);
      console.log("Direct number conversion:", num);
      if (num < 0 || num > 36) {
        console.warn(`Invalid roulette number: ${num}, setting to 0`);
        return 0;
      }
      return num;
    } catch (error) {
      console.error("Error converting hex to number:", hexValue, error);
      return 0;
    }
  };

  // Helper function to safely convert hex to BigInt
  const safeHexToBigInt = (hexValue: any): bigint => {
    console.log("Parsing hex to BigInt:", hexValue, "Type:", typeof hexValue);
    
    if (!hexValue || hexValue === "0x" || hexValue === "0x0") return BigInt(0);
    
    try {
      if (typeof hexValue === 'bigint') {
        return hexValue;
      }
      
      if (typeof hexValue === 'string' && hexValue.startsWith('0x')) {
        return BigInt(hexValue);
      }
      
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

  // FIXED: Spin wheel with comprehensive result parsing
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
        
        // FIXED: Enhanced game result parsing with multiple format support
        const gameResultRaw = await contractRef.current.get_game_result(account.address);
        console.log("Raw game result from contract:", gameResultRaw);
        console.log("Game result type:", typeof gameResultRaw);
        console.log("Game result constructor:", gameResultRaw?.constructor?.name);
        
        let result: number = 0;
        let winAmount: bigint = BigInt(0);
        
        // FIXED: Handle multiple response formats
        if (Array.isArray(gameResultRaw)) {
          // Response is an array [winning_number, total_payout]
          console.log("Parsing as array format");
          if (gameResultRaw.length >= 2) {
            result = safeHexToNumber(gameResultRaw[0]);
            winAmount = safeHexToBigInt(gameResultRaw[1]);
          } else {
            throw new Error("Array response too short");
          }
        } else if (gameResultRaw && typeof gameResultRaw === 'object') {
          // Response is an object
          console.log("Parsing as object format");
          console.log("Object keys:", Object.keys(gameResultRaw));
          
          // Try different possible property names
          if ('0' in gameResultRaw && '1' in gameResultRaw) {
            // Tuple format with numeric keys
            result = safeHexToNumber(gameResultRaw['0']);
            winAmount = safeHexToBigInt(gameResultRaw['1']);
          } else if ('winning_number' in gameResultRaw && 'total_payout' in gameResultRaw) {
            // Named tuple format
            result = safeHexToNumber(gameResultRaw.winning_number);
            winAmount = safeHexToBigInt(gameResultRaw.total_payout);
          } else if ('result' in gameResultRaw && 'winAmount' in gameResultRaw) {
            // Alternative naming
            result = safeHexToNumber(gameResultRaw.result);
            winAmount = safeHexToBigInt(gameResultRaw.winAmount);
          } else {
            // Try to get first two values from object
            const values = Object.values(gameResultRaw);
            if (values.length >= 2) {
              result = safeHexToNumber(values[0]);
              winAmount = safeHexToBigInt(values[1]);
            } else {
              console.error("Cannot parse object format:", gameResultRaw);
              throw new Error("Cannot parse object response format");
            }
          }
        } else {
          console.error("Unknown response format:", gameResultRaw);
          throw new Error("Unknown response format from contract");
        }
        
        console.log("Parsed result:", result, "Win amount:", winAmount.toString());
        
        // SECURITY: Final validation
        if (result < 0 || result > 36) {
          console.error("Invalid result from contract:", result);
          throw new Error(`Invalid result from contract: ${result}`);
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

  // End game
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

  // Get user balance
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

  // Get house balance
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

  // Get game status
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

  // Get current bets
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
