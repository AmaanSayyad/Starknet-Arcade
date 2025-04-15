/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useRef } from "react";
import { Contract, CallData, cairo, BigNumberish } from "starknet";
import { ROULETTE_ABI } from "../abi";
import { ROULETTE_ADDRESS, provider, STRK_TOKEN_ADDRESS } from "../constants";
import toast from "react-hot-toast";

export const useRouletteContract = (connected: boolean, account: any) => {
  const contractRef = useRef<Contract | null>(null);

  useEffect(() => {
    if (account && !contractRef.current) {
      contractRef.current = new Contract(
        ROULETTE_ABI,
        ROULETTE_ADDRESS,
        account
      );
    }
  }, [account]);

  const executeSpinWheelContractCall = useCallback(
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
              spender: ROULETTE_ADDRESS,
              amount: cairo.uint256(amount),
            }),
          },
          {
            contractAddress: ROULETTE_ADDRESS,
            entrypoint: "spin_roulette",
            calldata: CallData.compile({
              bets: [
                {
                  amount: cairo.uint256(100),
                  numbers: [1, 2, 3],
                },
                {
                  amount: cairo.uint256(100),
                  numbers: [4, 5, 6],
                },
              ],
            }),
          },
        ]);

        const txHash = multiCall?.transaction_hash;
        if (!txHash) {
          throw new Error("Transaction hash missing");
        }
        console.log("Transaction is ongoingg...");
        const receipt = await provider.waitForTransaction(txHash);
        console.log("Transaction receipt:", receipt);
      } catch (err) {
        console.error("Contract call failed:", err);
        return null;
      }
    },
    [connected, account]
  );

  const spinwheel = useCallback(
    (amount: BigNumberish) => {
      return executeSpinWheelContractCall(amount);
    },
    [executeSpinWheelContractCall]
  );

  return { spinwheel };
};
