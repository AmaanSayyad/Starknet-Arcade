/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useRef } from "react";
import { Contract, CallData, cairo, BigNumberish } from "starknet";
import { RPS_ABI } from "../abi";
import { toast } from "react-hot-toast";
import {
  RPS_CONTRACT_ADDRESS,
  provider,
  STRK_TOKEN_ADDRESS,
} from "../constants";

export const useRPSGameContract = (
  connected: boolean,
  account: any
) => {
  const contractRef = useRef<Contract | null>(null);
  useEffect(() => {
    if (account && !contractRef.current) {
      contractRef.current = new Contract(
        RPS_ABI,
        RPS_CONTRACT_ADDRESS,
        account
      );
    }
  }, [account]);

  const executeContractCall = useCallback(
    async (amount: BigNumberish, rounds: number) => {
      if (!amount) {
        toast.error("Amount must be greater than zero");
        return null;
      }
      if (!rounds) {
        toast.error("Choice must be either 0 or 1");
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
              spender: RPS_CONTRACT_ADDRESS,
              amount: cairo.uint256(amount),
            }),
          },
          {
            contractAddress: RPS_CONTRACT_ADDRESS,
            entrypoint: "join",
            calldata: CallData.compile({
              amount: cairo.uint256(amount),
              rounds,
            }),
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

  const joinRPs = useCallback(
    (amount: BigNumberish) => {
      return executeContractCall(amount, 5);
    },
    [executeContractCall]
  );

  return { joinRPs };
};
