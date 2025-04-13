/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useRef } from "react";
import { Contract, CallData, cairo, BigNumberish } from "starknet";
import { CoinFlipABI } from "../abi";
import { COIN_FLIP_ADDRESS, provider, STRK_TOKEN_ADDRESS } from "../constants";
import { toast } from "react-hot-toast";
export const useGameContract = (connected: boolean, account: any) => {
  const contractRef = useRef<Contract | null>(null);

  useEffect(() => {
    if (account && !contractRef.current) {
      contractRef.current = new Contract(
        CoinFlipABI,
        COIN_FLIP_ADDRESS,
        account
      );
    }
  }, [account]);

  const executeContractCall = useCallback(
    async (amount: BigNumberish, choice: number) => {
      if (!amount) {
        toast.error("Amount must be greater than zero");
        return null;
      }
      if (choice !== 0 && choice !== 1) {
        toast.error("Choice must be either 0 or 1");
        return null;
      }
      if (!connected || !account) {
        console.warn("Not connected or account is missing");
        return null;
      }

      let id = toast.loading("Submitting your flip...");

      try {
        const multiCall = await account.execute([
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

        const txHash = multiCall?.transaction_hash;
        if (!txHash) {
          throw new Error("Transaction hash missing");
        }

        const receipt = await provider.waitForTransaction(txHash);
        console.log("Transaction receipt:", receipt);

        const event = receipt?.events?.find(
          (e) =>
            e.from_address ===
            "0x32ee3f9b4263aae8fe9547b6bd3aaf45efe2806b9cf41f266028c743857edd3"
        );
        toast.success("Flip successful!", {
          id,
        });
        return event?.data?.[0]?.toString() || null;
      } catch (err) {
        console.error("Contract call failed:", err);
        toast.error("Error flipping coin", {
          id,
        });
        return null;
      }
    },
    [connected, account]
  );

  const flipCoin = useCallback(
    (amount: BigNumberish, choice: number) => {
      return executeContractCall(amount, choice);
    },
    [executeContractCall]
  );

  return { flipCoin };
};
