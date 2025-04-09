// contexts/GameContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Contract, cairo, CallData, byteArray } from "starknet";
import { useAccount } from "@starknet-react/core";
import {
  ETH_TOKEN_ADDRESS,
  rps_contract,
  provider,
  RPS_ADDRESS,
  PRAGMA_VRF_FEES,
  KNOWN_TOKENS,
} from "../constants";
import { LotteryABI } from "../abi";
import {
  LotteryDetails,
  LotterySection,
  MyLotteryType,
  TokenDetails,
  FetchedLottery,
  GameContextType,
  Profile,
} from "../types";
import {
  getRandomNumber,
  convertToStarknetAddress,
  decimalToText,
} from "../utils";

const GameContext = createContext<GameContextType | undefined>(undefined);

export function LotteryProvider({ children }: { children: React.ReactNode }) {
  const { account, isConnected } = useAccount();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lotteries, setLotteries] = useState<LotteryDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<LotterySection>("active");
  const [myLotteryType, setMyLotteryType] = useState<MyLotteryType>("enrolled");
  const [filteredLotteries, setFilteredLotteries] = useState<LotteryDetails[]>(
    []
  );

  const getTokenDetails = async (
    tokenAddress: string
  ): Promise<TokenDetails> => {
    if (KNOWN_TOKENS.find((token) => token.address === tokenAddress)) {
      return KNOWN_TOKENS.find((token) => token.address === tokenAddress)!;
    }

    const { abi: ERC20Abi } = await provider.getClassAt(tokenAddress);
    const tokenContract = new Contract(
      ERC20Abi,
      tokenAddress,
      provider
    ).typedv2(ERC20Abi);

    try {
      let [symbol, name, decimals] = await Promise.all([
        tokenContract.symbol(),
        tokenContract.name(),
        tokenContract.decimals(),
      ]);

      name = decimalToText(name);
      symbol = decimalToText(symbol);
      decimals = Number(decimals);

      const tokenDetails: TokenDetails = {
        address: tokenAddress,
        name,
        symbol,
        decimals,
        logo: null,
      };
      return tokenDetails;
    } catch (error) {
      console.error(`Error fetching token details for ${tokenAddress}:`, error);
      return {
        address: tokenAddress,
        name: "Unknown Token",
        symbol: "???",
        decimals: 18,
        logo: null,
      };
    }
  };
  // const fetchLotteries = useCallback(async () => {
  //   try {
  //     const lotteryAddresses = await rps_contract.get_lotteries();
  //     const detailPromises = lotteryAddresses.map((lottery: FetchedLottery) => {
  //       const starknetAddress = convertToStarknetAddress(
  //         lottery.lottery_address
  //       );
  //       return fetchLotteryDetails(starknetAddress);
  //     });

  //     const allDetails = await Promise.allSettled(detailPromises);
  //     const successfulFetches = allDetails
  //       .filter(
  //         (result) => result.status === "fulfilled" && result.value !== null
  //       )
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       .map((result: any) => result.value);

  //     setLotteries(successfulFetches.reverse());
  //     return successfulFetches;
  //   } catch (error) {
  //     console.error("Error fetching lotteries:", error);
  //     setLotteries([]);
  //     return [];
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [account]);

  const declareRPSResult = async (id: number, winner_address: string) => {
    try {
      const response = await account?.execute([
        {
          contractAddress: RPS_ADDRESS,
          entrypoint: "update_winner",
          calldata: CallData.compile({
            id,
            winner: winner_address,
          }),
        },
      ]);

      await provider.waitForTransaction(response?.transaction_hash || "");
    } catch (error) {
      console.error("Error declaring result:", error);
    }
  };

  const playRPSRound = async (
    id: number,
    round: number,
    player_move: number
  ) => {
    try {
      const response = await account?.execute([
        {
          contractAddress: RPS_ADDRESS,
          entrypoint: "play_round",
          calldata: CallData.compile({
            id,
            round,
            player_move,
          }),
        },
      ]);

      await provider.waitForTransaction(response?.transaction_hash || "");
    } catch (error) {
      console.error("Error playing round:", error);
    }
  };

  const joinRPSGame = async (_amount: string, rounds: number) => {
    try {
      const amount = BigInt(Math.floor(parseFloat(_amount) * Math.pow(10, 18)));
      console.log("amount", amount);
      const response = await account?.execute([
        {
          contractAddress: RPS_ADDRESS,
          entrypoint: "join",
          calldata: CallData.compile({
            bet: amount,
            rounds: rounds,
          }),
        },
      ]);

      await provider.waitForTransaction(response?.transaction_hash || "");
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };


  const value: GameContextType = {
    profile,
    lotteries,
    loading,
    filteredLotteries,
    activeSection,
    myLotteryType,
    setActiveSection,
    setMyLotteryType,
    declareRPSResult,
    playRPSRound,
    joinRPSGame
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Custom hook to use the lottery context
export function useLottery() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useLottery must be used within a LotteryProvider");
  }
  return context;
}
