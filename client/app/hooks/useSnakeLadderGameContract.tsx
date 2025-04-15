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

  const createGame = useCallback(
    async (amount: BigNumberish) => {
      if (!amount || amount === "0") {
        toast.error("Amount must be greater than zero");
        return null;
      }

      if (!connected || !account) {
        toast.error("Wallet not connected");
        return null;
      }

      console.log({ amount });

      try {
        const calls = [
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
            entrypoint: "create_game",
            calldata: CallData.compile({
              bet_amount: cairo.uint256(amount),
            }),
          },
        ];

        const tx = await account.execute(calls);
        const txHash = tx?.transaction_hash;
        console.log({ txHash });

        if (!txHash) {
          throw new Error("Transaction hash missing");
        }

        const receipt = await provider.waitForTransaction(txHash);
        console.log("Game created! Receipt:", receipt);
        return receipt;
      } catch (error) {
        console.error("createGame failed:", error);
        toast.error("Failed to create game");
        return null;
      }
    },
    [connected, account]
  );

  const roll = useCallback(async () => {
    if (!connected || !account) {
      toast.error("Wallet not connected");
      return null;
    }

    try {
      const tx = await account.execute({
        contractAddress: SNAKE_N_LADDERS_ADDRESS,
        entrypoint: "roll",
      });

      const txHash = tx?.transaction_hash;
      if (!txHash) {
        throw new Error("Transaction hash missing");
      }

      const receipt = await provider.waitForTransaction(txHash);
      console.log("Rolled for player. Receipt:", receipt);
      const event = receipt?.events?.find(
        (e) =>
          e.from_address ===
          "0x686f21556c4e995e61e1bf02f10155207f8921dceffe88d9bb794e4c66ee26c"
      );
      console.log({ event });
      return Number(event?.data?.[0]?.toString()) || 1;
    } catch (error) {
      console.error("roll failed:", error);
      toast.error("Roll failed");
      return null;
    }
  }, [connected, account]);

  const rollForComputer = useCallback(async () => {
    if (!connected || !account) {
      toast.error("Wallet not connected");
      return null;
    }

    try {
      const tx = await account.execute({
        contractAddress: SNAKE_N_LADDERS_ADDRESS,
        entrypoint: "roll_for_computer",
      });

      const txHash = tx?.transaction_hash;
      if (!txHash) {
        throw new Error("Transaction hash missing");
      }

      const receipt = await provider.waitForTransaction(txHash);
      console.log("Rolled for computer. Receipt:", receipt);
      const event = receipt?.events?.find(
        (e) =>
          e.from_address ===
          "0x686f21556c4e995e61e1bf02f10155207f8921dceffe88d9bb794e4c66ee26c"
      );
      console.log({ event });
      return Number(event?.data?.[0]?.toString()) || 1;
    } catch (error) {
      console.error("rollForComputer failed:", error);
      toast.error("Roll for computer failed");
      return null;
    }
  }, [connected, account]);

  const endGame = useCallback(async () => {
    if (!connected || !account) {
      toast.error("Wallet not connected");
      return null;
    }

    try {
      const tx = await account.execute({
        contractAddress: SNAKE_N_LADDERS_ADDRESS,
        entrypoint: "end_game",
      });

      const txHash = tx?.transaction_hash;
      if (!txHash) {
        throw new Error("Transaction hash missing");
      }

      const receipt = await provider.waitForTransaction(txHash);
      console.log("Rolled for player. Receipt:", receipt);

      return receipt;
    } catch (error) {
      console.error("roll failed:", error);
      toast.error("Roll failed");
      return null;
    }
  }, [connected, account]);

  return { createGame, roll, rollForComputer, endGame };
};
