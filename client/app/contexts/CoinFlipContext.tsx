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
import { toast } from "react-hot-toast";
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
  const [latestRequestedId, setLatestRequestedId] = useState<string | null>(
    null
  );

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
  const flipCoin = useCallback(
    async (choice: FlipChoice, amount: string) => {
      let id = toast.loading("Submitting your flip...");
      try {
        const _amount = BigInt(amount);
        const multiCall = await account?.execute([
          {
            contractAddress: STRK_TOKEN_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: COIN_FLIP_ADDRESS,
              amount: cairo.uint256(_amount),
            }),
          },
          {
            contractAddress: COIN_FLIP_ADDRESS,
            entrypoint: "flip_coin",
            calldata: CallData.compile({
              choice,
              amount: cairo.uint256(_amount),
            }),
          },
        ]);
        const res = await provider.waitForTransaction(
          multiCall?.transaction_hash || ""
        );
        console.log("Transaction result:", res?.events);
        let requestId = res?.events?.find(
          (item) =>
            item.from_address ===
            "0x32ee3f9b4263aae8fe9547b6bd3aaf45efe2806b9cf41f266028c743857edd3"
        );
        setLatestRequestedId(+requestId?.data[0].toString());
        toast.success("Flip successful!", {
          id,
        });
        return requestId?.data[0].toString();
      } catch (error) {
        console.error("Error flipping coin :", error);
        toast.error("Error flipping coin", {
          id,
        });
        throw error;
      }
    },
    [account]
  );

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
      latestRequestedId
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
