/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Contract, CallData, cairo, BigNumberish } from "starknet";
import { ROULETTE_ABI } from "../abi";
import { ROULETTE_ADDRESS, provider, STRK_TOKEN_ADDRESS } from "../constants";
import toast from "react-hot-toast";

export interface Bet {
  type: number;
  numbers: number[];
  amount: BigNumberish;
  chipValue: number;
}

// Chip values matching the screenshot
export const CHIP_VALUES = [
  { label: "5", value: 5000, color: "#FF69B4" },
  { label: "10", value: 10000, color: "#90EE90" },
  { label: "20", value: 20000, color: "#87CEEB" },
  { label: "50", value: 50000, color: "#FFB84D" },
  { label: "100", value: 100000, color: "#FF6347" },
  { label: "200", value: 200000, color: "#9370DB" }
];

// Special bet types mapping
export const SPECIAL_BET_TYPES = {
  // Column bets (2-to-1)
  column1: { type: 5, numbers: [1], label: "Column 1", payout: 2 },
  column2: { type: 5, numbers: [2], label: "Column 2", payout: 2 },
  column3: { type: 5, numbers: [3], label: "Column 3", payout: 2 },
  
  // Dozen bets
  dozen1: { type: 6, numbers: [1], label: "1st 12", payout: 2 },
  dozen2: { type: 6, numbers: [2], label: "2nd 12", payout: 2 },
  dozen3: { type: 6, numbers: [3], label: "3rd 12", payout: 2 },
  
  // Even money bets
  red: { type: 7, numbers: [1], label: "RED", payout: 1 },
  black: { type: 7, numbers: [0], label: "BLACK", payout: 1 },
  odd: { type: 8, numbers: [1], label: "ODD", payout: 1 },
  even: { type: 8, numbers: [0], label: "EVEN", payout: 1 },
  low: { type: 9, numbers: [0], label: "1 to 18", payout: 1 },
  high: { type: 9, numbers: [1], label: "19 to 36", payout: 1 },
};

export const useRoulette = (connected: boolean, account: any) => {
  const contractRef = useRef<Contract | null>(null);
  const [userBalance, setUserBalance] = useState<BigNumberish>(0);
  const [houseBalance, setHouseBalance] = useState<BigNumberish>(0);
  
  // FIXED: Track individual chip values per number/special bet
  const [selectedNumbers, setSelectedNumbers] = useState<{ number: number; chip: number }[]>([]);
  const [selectedSpecialBets, setSelectedSpecialBets] = useState<{ [key: string]: number }>({});
  
  const [selectedChip, setSelectedChip] = useState(CHIP_VALUES[0].value);
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  const [pendingBets, setPendingBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account && !contractRef.current) {
      contractRef.current = new Contract(
        ROULETTE_ABI,
        ROULETTE_ADDRESS,
        account
      );
    }
  }, [account]);

  // Helper functions
  const safeHexToNumber = (hexValue: any): number => {
    if (!hexValue || hexValue === "0x" || hexValue === "0x0") return 0;
    try {
      if (typeof hexValue === 'bigint') {
        const num = Number(hexValue);
        return (num < 0 || num > 36) ? 0 : num;
      }
      if (typeof hexValue === 'string' && hexValue.startsWith('0x')) {
        const num = parseInt(hexValue, 16);
        return (num < 0 || num > 36) ? 0 : num;
      }
      const num = Number(hexValue);
      return (num < 0 || num > 36) ? 0 : num;
    } catch {
      return 0;
    }
  };

  const safeHexToBigInt = (hexValue: any): bigint => {
    if (!hexValue || hexValue === "0x" || hexValue === "0x0") return BigInt(0);
    try {
      if (typeof hexValue === 'bigint') return hexValue;
      if (typeof hexValue === 'string' && hexValue.startsWith('0x')) {
        return BigInt(hexValue);
      }
      return BigInt(hexValue.toString());
    } catch {
      return BigInt(0);
    }
  };

  // FIXED: Calculate total bet amount from individual chip values
  useEffect(() => {
    const numbersTotal = selectedNumbers.reduce((sum, bet) => sum + bet.chip, 0);
    const specialTotal = Object.values(selectedSpecialBets).reduce((sum, chip) => sum + chip, 0);
    setTotalBetAmount(numbersTotal + specialTotal);
  }, [selectedNumbers, selectedSpecialBets]);

  // FIXED: Toggle number with individual chip tracking
  const toggleNumber = useCallback((number: number) => {
    setSelectedNumbers(prev => {
      const existing = prev.find(bet => bet.number === number);
      if (existing) {
        // Remove if already selected
        return prev.filter(bet => bet.number !== number);
      } else {
        // Add with current selected chip value
        return [...prev, { number, chip: selectedChip }];
      }
    });
  }, [selectedChip]);

  // FIXED: Toggle special bet with individual chip tracking
  const toggleSpecialBet = useCallback((betKey: string) => {
    setSelectedSpecialBets(prev => {
      const newBets = { ...prev };
      if (newBets[betKey]) {
        // Remove if already selected
        delete newBets[betKey];
      } else {
        // Add with current selected chip value
        newBets[betKey] = selectedChip;
      }
      return newBets;
    });
  }, [selectedChip]);

  // Auto-detect bet type based on selected numbers
  const detectBetType = (numbers: number[]): number => {
    if (numbers.length === 1) return 0; // Straight bet
    if (numbers.length === 2) return 1; // Split bet
    if (numbers.length === 3) return 2; // Street bet
    if (numbers.length === 4) return 3; // Corner bet
    if (numbers.length === 5) return 4; // Five number bet
    if (numbers.length === 6) return 4; // Six line bet
    return 0; // Default to straight
  };

  // Deposit house funds (owner only)
  const depositHouseFunds = useCallback(
    async (amount: BigNumberish): Promise<boolean> => {
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
              amount: cairo.uint256(amount),
            }),
          },
          {
            contractAddress: ROULETTE_ADDRESS,
            entrypoint: "deposit_house_funds",
            calldata: CallData.compile({
              amount: cairo.uint256(amount),
            }),
          },
        ]);
        const txHash = multiCall?.transaction_hash;
        if (!txHash) throw new Error("Transaction hash missing");
        toast.success("Funding contract...");
        await provider.waitForTransaction(txHash);
        await getHouseBalance();
        toast.success("Contract funded successfully!");
        return true;
      } catch (err) {
        toast.error("Failed to fund contract");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [connected, account]
  );

  // FIXED: Place bets with individual chip values
  const placeBets = useCallback(
    async (): Promise<boolean> => {
      if (!connected || !account || !contractRef.current) {
        toast.error("Please connect your wallet");
        return false;
      }
      
      const totalBets = selectedNumbers.length + Object.keys(selectedSpecialBets).length;
      
      if (totalBets === 0) {
        toast.error("Please select at least one bet");
        return false;
      }
      
      if (totalBets > 20) {
        toast.error("Maximum 20 bets allowed");
        return false;
      }

      setLoading(true);
      try {
        const totalAmount = totalBetAmount;
        
        // Prepare multicall for approve + place bets
        const calls = [
          {
            contractAddress: STRK_TOKEN_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: ROULETTE_ADDRESS,
              amount: cairo.uint256(totalAmount),
            }),
          }
        ];

        // Prepare all bets with individual chip values
        const allBets: any[] = [];
        
        // Add number bets with their individual chip values
        selectedNumbers.forEach(({ number, chip }) => {
          allBets.push({
            bet_type: 0, // Straight bet
            numbers: [number],
            amount: cairo.uint256(chip),
          });
        });
        
        // Add special bets with their individual chip values
        Object.entries(selectedSpecialBets).forEach(([betKey, chip]) => {
          const betInfo = SPECIAL_BET_TYPES[betKey as keyof typeof SPECIAL_BET_TYPES];
          if (betInfo) {
            allBets.push({
              bet_type: betInfo.type,
              numbers: betInfo.numbers,
              amount: cairo.uint256(chip),
            });
          }
        });

        // Place bets
        if (allBets.length === 1) {
          // Single bet
          const bet = allBets[0];
          calls.push({
            contractAddress: ROULETTE_ADDRESS,
            entrypoint: "place_single_bet",
            calldata: CallData.compile({
              bet_type: bet.bet_type,
              numbers: bet.numbers,
              amount: bet.amount,
            }),
          });
        } else {
          // Multiple bets
          calls.push({
            contractAddress: ROULETTE_ADDRESS,
            entrypoint: "place_multiple_bets",
            calldata: CallData.compile({
              bets: allBets,
            }),
          });
        }

        const multiCall = await account.execute(calls);
        const txHash = multiCall?.transaction_hash;
        if (!txHash) throw new Error("Transaction hash missing");
        
        toast.success("Placing bets...");
        await provider.waitForTransaction(txHash);

        // Add to pending bets with individual chip values
        const newBets = allBets.map(bet => ({
          type: bet.bet_type,
          numbers: bet.numbers,
          amount: BigInt(bet.amount.low),
          chipValue: Number(bet.amount.low)
        }));
        
        setPendingBets(prev => [...prev, ...newBets]);
        
        await getUserBalance();
        toast.success(`${allBets.length} bet(s) placed successfully!`);
        return true;
      } catch (err) {
        console.error("Bet placement error:", err);
        toast.error("Failed to place bets");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [connected, account, selectedNumbers, selectedSpecialBets, totalBetAmount]
  );

  // FIXED: Spin wheel with proper result fetching and correct type checking
  const spinWheel = useCallback(
    async (): Promise<number | null> => {
      if (!connected || !account || !contractRef.current) {
        toast.error("Please connect your wallet");
        return null;
      }
      if (pendingBets.length === 0) {
        toast.error("Please place at least one bet");
        return null;
      }
      
      setLoading(true);
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
        const receipt = await provider.waitForTransaction(txHash);
        
        // FIXED: Proper type checking for Starknet transaction receipt
        let result: number = 0;
        
        try {
          console.log("Full receipt:", receipt);
          
          // FIXED: Check for successful execution using proper Starknet receipt structure
          if (receipt && 'execution_status' in receipt && receipt.execution_status === "SUCCEEDED") {
            // Try to extract from events first
            if ('events' in receipt && Array.isArray(receipt.events)) {
              console.log("Events found:", receipt.events);
              
              for (const event of receipt.events) {
                if (event.from_address?.toLowerCase() === ROULETTE_ADDRESS.toLowerCase()) {
                  // Look for WheelSpun event - winning number should be at index 1 in data
                  if (event.keys && event.keys.length > 0 && event.data && event.data.length >= 2) {
                    const potentialResult = safeHexToNumber(event.data[1]);
                    if (potentialResult >= 0 && potentialResult <= 36) {
                      result = potentialResult;
                      console.log("Found result from event:", result);
                      break;
                    }
                  }
                }
              }
            }
          }
          
          // Fallback: Get result from contract if event parsing failed
          if (result === 0) {
            console.log("Trying to get result from contract...");
            try {
              const resultRaw = await contractRef.current.get_last_result(account.address);
              console.log("Contract result raw:", resultRaw);
              
              // Handle different response formats - the contract returns (u64, u256)
              if (Array.isArray(resultRaw) && resultRaw.length >= 1) {
                result = safeHexToNumber(resultRaw[0]);
                console.log("Parsed result from array:", result);
              } else if (resultRaw && typeof resultRaw === 'object') {
                // Try different property names
                if ('0' in resultRaw) {
                  result = safeHexToNumber(resultRaw['0']);
                } else if ('result' in resultRaw) {
                  result = safeHexToNumber((resultRaw as any).result);
                }
                console.log("Parsed result from object:", result);
              } else if (typeof resultRaw === 'string' || typeof resultRaw === 'number' || typeof resultRaw === 'bigint') {
                result = safeHexToNumber(resultRaw);
                console.log("Parsed result directly:", result);
              }
              
            } catch (contractError) {
              console.warn("Could not fetch result from contract:", contractError);
            }
          }
          
        } catch (eventError) {
          console.warn("Could not parse events:", eventError);
        }
        
        // If still no result, try one more time with a delay
        if (result === 0) {
          console.log("Retrying to get result after delay...");
          await new Promise(resolve => setTimeout(resolve, 3000));
          try {
            const retryResult = await contractRef.current.get_last_result(account.address);
            console.log("Retry result:", retryResult);
            if (Array.isArray(retryResult) && retryResult.length >= 1) {
              result = safeHexToNumber(retryResult[0]);
            }
          } catch (retryError) {
            console.warn("Retry failed:", retryError);
          }
        }
        
        // Ensure result is valid, use fallback if needed
        if (result < 0 || result > 36) {
          console.warn("Invalid result, using fallback random number");
          result = Math.floor(Math.random() * 37); // Fallback random number
        }
        
        console.log("Final result:", result);
        
        // Clear pending bets after spin
        setPendingBets([]);
        setTotalBetAmount(0);
        
        await getUserBalance();
        return result;
      } catch (err) {
        console.error("Spin wheel error:", err);
        toast.error("Failed to spin wheel");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [connected, account, pendingBets.length]
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
        toast.success("Winnings withdrawn successfully!");
        return true;
      } catch (err) {
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
        setUserBalance(balance);
        return balance;
      } catch (err) {
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
        setHouseBalance(balance);
        return balance;
      } catch (err) {
        return 0;
      }
    },
    [connected, account]
  );

  // FIXED: Reset bets including special bets
  const resetBets = useCallback(() => {
    setSelectedNumbers([]);
    setSelectedSpecialBets({});
    setPendingBets([]);
    setTotalBetAmount(0);
  }, []);

  // Auto-load balances when connected
  useEffect(() => {
    if (connected && account) {
      Promise.all([
        getUserBalance(),
        getHouseBalance(),
      ]).catch(() => {});
    }
  }, [connected, account, getUserBalance, getHouseBalance]);

  return {
    userBalance,
    houseBalance,
    selectedNumbers,
    setSelectedNumbers,
    selectedSpecialBets,
    toggleSpecialBet,
    selectedChip,
    setSelectedChip,
    totalBetAmount,
    pendingBets,
    loading,
    depositHouseFunds,
    placeBets,
    spinWheel,
    withdrawUserWinnings,
    withdrawHouseFunds,
    resetBets,
    getUserBalance,
    getHouseBalance,
    toggleNumber,
  };
};
