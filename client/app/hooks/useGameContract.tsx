/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useRef } from "react";
import { Contract, CallData, cairo, BigNumberish } from "starknet";
import { CoinFlipABI } from "../abi";
import { COIN_FLIP_ADDRESS, provider, STRK_TOKEN_ADDRESS } from "../constants";

export const useGameContract = (connected: boolean, account: any) => {
  const contractRef = useRef<Contract | null>(null);

  useEffect(() => {
    if (account && !contractRef.current) {
      contractRef.current = new Contract(CoinFlipABI, COIN_FLIP_ADDRESS, account);
    }
  }, [account]);

  const executeContractCall = useCallback(
    async (amount: BigNumberish, choice: number) => {
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

        return event?.data?.[0]?.toString() || null;
      } catch (err) {
        console.error("Contract call failed:", err);
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
