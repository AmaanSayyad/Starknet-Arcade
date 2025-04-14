/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useRef } from "react";
import { Contract, CallData, cairo, BigNumberish } from "starknet";
import { SNAKE_N_LADDERS_ABI } from "../abi";
import {
  SNAKE_N_LADDERS_ADDRESS,
  provider,
  STRK_TOKEN_ADDRESS,
} from "../constants";
import toast from "react-hot-toast";

export const useRouletteContract = (
  connected: boolean,
  account: any
) => {
  const contractRef = useRef<Contract | null>(null);

  useEffect(() => {
    if (account && !contractRef.current) {
      contractRef.current = new Contract(
        SNAKE_N_LADDERS_ABI,
        SNAKE_N_LADDERS_ADDRESS,
        account
      );
    }
  }, [account]);

  const executeContractRollCall = useCallback(async () => {
    if (!connected || !account) {
      console.warn("Not connected or account is missing");
      return null;
    }
    try {
      const multiCall = await account.execute({
        contractAddress: SNAKE_N_LADDERS_ADDRESS,
        entrypoint: "roll",
      });

      const txHash = multiCall?.transaction_hash;
      if (!txHash) {
        throw new Error("Transaction hash missing");
      }
      const receipt = await provider.waitForTransaction(txHash);
      console.log("Transaction receipt:", receipt);
    } catch (err) {
      console.error("Contract call failed:", err);
      return null;
    }
  }, [connected, account]);

  
  const executeContractCall = useCallback(
    async (amount: BigNumberish) => {
      if (!amount) {
        toast.error("Amount must be greater than zero");
        return null;
      }
      if (!connected || !account) {
        console.warn("Not connected or account is missing");
        return null;
      }
      try {
        const multiCall = await account.execute([
          {
            contractAddress: STRK_TOKEN_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: SNAKE_N_LADDERS_ADDRESS,
              amount: cairo.uint256(amount),
            }),
          },
          {
            contractAddress: SNAKE_N_LADDERS_ADDRESS,
            entrypoint: "enroll",
          },
        ]);

        const txHash = multiCall?.transaction_hash;
        if (!txHash) {
          throw new Error("Transaction hash missing");
        }
        const receipt = await provider.waitForTransaction(txHash);
        console.log("Transaction receipt:", receipt);
      } catch (err) {
        console.error("Contract call failed:", err);
        return null;
      }
    },
    [connected, account]
  );

  const enroll = useCallback(
    (amount: BigNumberish) => {
      return executeContractCall(amount);
    },
    [executeContractCall]
  );

  const roll = useCallback(() => {
    return executeContractRollCall();
  }, [executeContractRollCall]);

  return { enroll,roll };
};
