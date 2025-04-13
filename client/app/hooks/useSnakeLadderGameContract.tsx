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

export const useSnakeLadderGameContract = (
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

  const executeContractCall = useCallback(async () => {
    if (!connected || !account) {
      console.warn("Not connected or account is missing");
      return null;
    }

    try {
      const multiCall = await account.execute({
        contractAddress: SNAKE_N_LADDERS_ADDRESS,
        entrypoint: "enroll",
        calldata: CallData.compile({}),
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

  const enroll = useCallback(() => {
    return executeContractCall();
  }, [executeContractCall]);

  return { enroll };
};
