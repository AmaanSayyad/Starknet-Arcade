// contexts/LotteryContext.tsx
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
  factory_contract,
  provider,
  LOTTERY_FACTORY_ADDRESS,
  PRAGMA_VRF_FEES,
  CALLBACK_FEE_LIMIT,
  KNOWN_TOKENS,
} from "../constants";
import { LotteryABI } from "../abi";
import {
  LotteryDetails,
  LotterySection,
  MyLotteryType,
  TokenDetails,
  LotteryState,
  FetchedLottery,
  LotteryContextType,
  Profile,
} from "../types";
import {
  getRandomNumber,
  convertToStarknetAddress,
  convertAddressToStarknetAddress,
  decimalToText,
} from "../utils";

const LotteryContext = createContext<LotteryContextType | undefined>(undefined);

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

  const fetchLotteryDetails = useCallback(async (lotteryAddress: string) => {
    try {
      const lotteryContract = new Contract(
        LotteryABI,
        lotteryAddress,
        provider
      ).typedv2(LotteryABI);
      const details = await lotteryContract.get_lottery_details();
      console.log(details);

      const participants = details[1].map((participant: bigint) =>
        convertToStarknetAddress(participant)
      );
      const tokenAddress = convertToStarknetAddress(details[2]);
      const tokenDetails = await getTokenDetails(tokenAddress);

      let state;
      if (details[5].variant.Active) {
        state = LotteryState.ACTIVE;
      } else if (details[5].variant.WinnerSelected) {
        state = LotteryState.WINNER_SELECTED;
      } else {
        state = LotteryState.CLOSED;
      }

      return {
        address: lotteryAddress,
        owner: convertToStarknetAddress(details[0]),
        participants,
        token: tokenDetails,
        minimum_participants: details[6],
        participant_fees: details[3],
        winner:
          details[4] == BigInt(0)
            ? "No winner yet"
            : convertToStarknetAddress(details[4]),
        state,
      };
    } catch (error) {
      console.error(
        `Error fetching details for lottery ${lotteryAddress}:`,
        error
      );
      return null;
    }
  }, []);

  const fetchLotteries = useCallback(async () => {
    try {
      const lotteryAddresses = await factory_contract.get_lotteries();
      const detailPromises = lotteryAddresses.map((lottery: FetchedLottery) => {
        const starknetAddress = convertToStarknetAddress(
          lottery.lottery_address
        );
        return fetchLotteryDetails(starknetAddress);
      });

      const allDetails = await Promise.allSettled(detailPromises);
      const successfulFetches = allDetails
        .filter(
          (result) => result.status === "fulfilled" && result.value !== null
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((result: any) => result.value);

      setLotteries(successfulFetches.reverse());
      return successfulFetches;
    } catch (error) {
      console.error("Error fetching lotteries:", error);
      setLotteries([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [fetchLotteryDetails]);

  const fetchProfile = useCallback(async () => {
    if (isConnected && account?.address) {
      try {
        const res = await factory_contract.get_user_profile(account?.address);
        const profile = {
          username: res.username,
          profilePicture: res.profile_picture,
          bio: res.bio,
          isRegistered: res.is_registered,
        };
        setProfile(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      }
    }
  }, [account?.address, isConnected]);

  const createProfile = async (
    username: string,
    profilePicture: string,
    bio: string
  ) => {
    try {
      const tx = await account?.execute([
        {
          contractAddress: LOTTERY_FACTORY_ADDRESS,
          entrypoint: "register_user",
          calldata: CallData.compile({
            username: byteArray.byteArrayFromString(username),
            profilePicture: byteArray.byteArrayFromString(profilePicture),
            bio: byteArray.byteArrayFromString(bio),
          }),
        },
      ]);
      await provider.waitForTransaction(tx?.transaction_hash || "");
      await fetchProfile();
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  const createLottery = async (
    token: string,
    participantFees: string,
    minimumParticipants: string
  ) => {
    try {
      const selectedToken = await getTokenDetails(token);
      const amount = BigInt(
        Math.floor(
          parseFloat(participantFees) * Math.pow(10, selectedToken.decimals)
        )
      );
      console.log("amount", amount);

      const multiCall = await account?.execute([
        {
          contractAddress: ETH_TOKEN_ADDRESS,
          entrypoint: "approve",
          calldata: CallData.compile({
            spender: LOTTERY_FACTORY_ADDRESS,
            amount: cairo.uint256(PRAGMA_VRF_FEES),
          }),
        },
        {
          contractAddress: LOTTERY_FACTORY_ADDRESS,
          entrypoint: "create_lottery",
          calldata: CallData.compile({
            token,
            minimum_participants: cairo.uint256(minimumParticipants),
            participant_fees: cairo.uint256(amount),
            salt: getRandomNumber(),
          }),
        },
      ]);

      await provider.waitForTransaction(multiCall?.transaction_hash || "");
      await fetchLotteries();
    } catch (error) {
      console.error("Error creating lottery:", error);
      throw error;
    }
  };

  const enrollInLottery = async (
    lotteryAddress: string,
    participantFees: string,
    token: string
  ) => {
    try {
      const amount = BigInt(participantFees);

      const multiCall = await account?.execute([
        {
          contractAddress: token,
          entrypoint: "approve",
          calldata: CallData.compile({
            spender: lotteryAddress,
            amount: cairo.uint256(amount),
          }),
        },
        {
          contractAddress: lotteryAddress,
          entrypoint: "enroll",
          calldata: CallData.compile({}),
        },
      ]);

      await provider.waitForTransaction(multiCall?.transaction_hash || "");
      await fetchLotteries();
    } catch (error) {
      console.error("Error enrolling in lottery:", error);
      throw error;
    }
  };

  const unenrollFromLottery = async (lotteryAddress: string) => {
    try {
      const multiCall = await account?.execute([
        {
          contractAddress: lotteryAddress,
          entrypoint: "unenroll",
          calldata: CallData.compile({}),
        },
      ]);
      await provider.waitForTransaction(multiCall?.transaction_hash || "");
      await fetchLotteries();
    } catch (error) {
      console.error("Error unenrolling from lottery:", error);
      throw error;
    }
  };

  const selectWinner = async (lotteryAddress: string) => {
    try {
      const multiCall = await account?.execute([
        {
          contractAddress: lotteryAddress,
          entrypoint: "select_winner",
          calldata: CallData.compile({
            seed: BigInt(getRandomNumber()).toString(),
            callback_fee_limit: CALLBACK_FEE_LIMIT,
            publish_delay: "1",
            num_words: "1",
            calldata: [],
          }),
        },
      ]);

      await provider.waitForTransaction(multiCall?.transaction_hash || "");
      await fetchLotteries();
    } catch (error) {
      console.error("Error selecting the winner:", error);
      throw error;
    }
  };

  const withdrawOracleFees = async (lotteryAddress: string) => {
    try {
      const multiCall = await account?.execute([
        {
          contractAddress: lotteryAddress,
          entrypoint: "withdraw_oracle_fees",
          calldata: CallData.compile({}),
        },
      ]);

      await provider.waitForTransaction(multiCall?.transaction_hash || "");
      await fetchLotteries();
    } catch (error) {
      console.error("Error withdrawing the oracle fees:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (activeSection === "active") {
      setFilteredLotteries(
        lotteries.filter((lottery) => lottery.state === LotteryState.ACTIVE)
      );
    } else if (activeSection === "past") {
      setFilteredLotteries(
        lotteries.filter(
          (lottery) =>
            lottery.state === LotteryState.CLOSED ||
            lottery.state === LotteryState.WINNER_SELECTED
        )
      );
    } else if (activeSection === "my") {
      if (myLotteryType === "created") {
        setFilteredLotteries(
          lotteries.filter(
            (lottery) =>
              lottery.owner ===
              convertAddressToStarknetAddress(account?.address || "")
          )
        );
      } else {
        setFilteredLotteries(
          lotteries.filter((lottery) =>
            lottery.participants.includes(
              convertAddressToStarknetAddress(account?.address || "")
            )
          )
        );
      }
    }
  }, [account, activeSection, lotteries, myLotteryType]);

  useEffect(() => {
    fetchLotteries();
  }, [fetchLotteries]);

  useEffect(() => {
    fetchProfile();
  }, [account, fetchProfile, isConnected]);

  const value: LotteryContextType = {
    profile,
    lotteries,
    loading,
    filteredLotteries,
    activeSection,
    myLotteryType,
    unenrollFromLottery,
    fetchProfile,
    setActiveSection,
    setMyLotteryType,
    createProfile,
    createLottery,
    enrollInLottery,
    selectWinner,
    withdrawOracleFees,
    refreshLotteries: fetchLotteries,
  };

  return (
    <LotteryContext.Provider value={value}>{children}</LotteryContext.Provider>
  );
}

// Custom hook to use the lottery context
export function useLottery() {
  const context = useContext(LotteryContext);
  if (context === undefined) {
    throw new Error("useLottery must be used within a LotteryProvider");
  }
  return context;
}
