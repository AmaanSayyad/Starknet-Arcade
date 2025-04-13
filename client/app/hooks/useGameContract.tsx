"use client";
import { useCallback, useRef } from "react";
import { useProvider } from "@starknet-react/core";
import { Contract } from "starknet";
import { CoinFlipABI } from "../abi";
import { COIN_FLIP_ADDRESS } from "../constants";

const CONTRACT_ADDRESS = COIN_FLIP_ADDRESS;

const CONTRACT_ABI = CoinFlipABI;

export const useGameContract = (connected, account) => {
  const provider = useProvider();
  const contractRef = useRef(null);

  if (!contractRef.current && account) {
    contractRef.current = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);
  }

  const executeContractCall = useCallback(
    async (entrypoint, calldata = []) => {
      if (!connected || !account) return false;
      try {
        await account.execute({
          contractAddress: CONTRACT_ADDRESS,
          entrypoint,
          calldata,
          session: true,
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    [account, connected]
  );

  const flipCoin = useCallback(
    () => executeContractCall("flip_coin"),
    [executeContractCall]
  );
  return {
    flipCoin,
  };
};
