import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Contract, cairo, CallData, byteArray } from "starknet";
import { useAccount } from "@starknet-react/core";
import { CoinFlipABI, ERC20Abi } from "../abi"; // Assume this is defined elsewhere
import {
  ETH_TOKEN_ADDRESS,
  COIN_FLIP_ADDRESS,
  coin_flip_contract,
  provider,
  STRK_TOKEN_ADDRESS,
} from "../constants";
import {
  CoinFlipContextValue,
  CoinFlipProviderProps,
  FlipChoice,
  FlipDetails,
  FlipState,
  Status,
} from "../types";

// Create the context with an undefined initial value
const CoinFlipContext = createContext<CoinFlipContextValue | undefined>(
  undefined
);

// Custom hook to use the context
export function useCoinFlip() {
  const context = useContext(CoinFlipContext);
  if (context === undefined) {
    throw new Error("useCoinFlip must be used within a CoinFlipProvider");
  }
  return context;
}

// Provider component
export function CoinFlipProvider({ children }: CoinFlipProviderProps) {
  // State
  const { account, isConnected } = useAccount();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [currentFlip, setCurrentFlip] = useState<FlipDetails | null>(null);

  // Helper to handle errors in a consistent way
  const handleError = useCallback((error: unknown) => {
    console.error("CoinFlip contract error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    setError(errorMessage);
    setStatus("error");
    return errorMessage;
  }, []);

  // Flip coin function - includes approving the token transfer
  const flipCoin = useCallback(async (choice: FlipChoice, amount: string) => {
    try {
      console.log(account);
      const multiCall = await account?.execute([
        {
          contractAddress: STRK_TOKEN_ADDRESS,
          entrypoint: "approve",
          calldata: CallData.compile({
            spender: COIN_FLIP_ADDRESS,
            amount: cairo.uint256(amount),
          }),
        },
        {
          contractAddress: COIN_FLIP_ADDRESS,
          entrypoint: "flip_coin",
          calldata: CallData.compile({
            choice,
            amount: cairo.uint256(amount),
          }),
        },
      ]);
      await provider.waitForTransaction(multiCall?.transaction_hash || "");
    } catch (error) {
      console.error("Error flipping coin :", error);
      throw error;
    }
  }, []);

  // Get flip details
  const getFlipDetails = useCallback(
    async (requestId: string): Promise<FlipDetails | undefined> => {
      try {
        if (!coin_flip_contract) {
          throw new Error("Contract not available");
        }

        setStatus("loading");
        setError(null);

        const response = await coin_flip_contract.get_flip_details(
          CallData.compile({
            request_id: requestId,
          })
        );

        // Convert the contract response to our FlipDetails interface
        const flipDetails: FlipDetails = {
          player: response.player.toString(),
          amount: BigInt(response.amount.toString()),
          choice: response.choice as FlipChoice,
          result: response.result ? (response.result as FlipChoice) : null,
          state: response.state as FlipState,
          request_id: BigInt(response.request_id.toString()),
        };

        setStatus("success");
        return flipDetails;
      } catch (err) {
        handleError(err);
        return undefined;
      }
    },
    [coin_flip_contract, handleError]
  );

  // Get contract balance
  const getContractBalance = useCallback(
    async (tokenAddress: string): Promise<bigint | undefined> => {
      try {
        if (!coin_flip_contract) {
          throw new Error("Contract not available");
        }

        setStatus("loading");
        setError(null);

        const response = await coin_flip_contract.get_contract_balance(
          CallData.compile({
            token: tokenAddress,
          })
        );
        setStatus("success");

        return BigInt(response.toString());
      } catch (err) {
        handleError(err);
        return undefined;
      }
    },
    [coin_flip_contract, handleError]
  );

  // Create value object for the context
  const value = useMemo(
    () => ({
      flipCoin,
      getFlipDetails,
      getContractBalance,
      status,
      error,
      currentFlip,
      setCurrentFlip,
    }),
    [flipCoin, getFlipDetails, getContractBalance, status, error, currentFlip]
  );

  // Return the provider
  return (
    <CoinFlipContext.Provider value={value}>
      {children}
    </CoinFlipContext.Provider>
  );
}
