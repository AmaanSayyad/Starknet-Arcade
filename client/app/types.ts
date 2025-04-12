import { ReactNode } from "react";

export type FetchedLottery = {
  token: bigint;
  participation_fee: bigint;
  lottery_address: bigint;
};

export type LotteryDetails = {
  address: string;
  owner: string;
  participants: string[];
  token: TokenDetails;
  minimum_participants: bigint;
  participant_fees: bigint;
  winner: string;
  state: LotteryState;
};

export interface LotteryContextType {
  lotteries: LotteryDetails[];
  loading: boolean;
  filteredLotteries: LotteryDetails[];
  activeSection: LotterySection;
  myLotteryType: MyLotteryType;
  profile: Profile | null;
  setActiveSection: (section: LotterySection) => void;
  setMyLotteryType: (type: MyLotteryType) => void;
  fetchProfile: () => Promise<void>;
  createProfile: (
    username: string,
    profilePicture: string,
    bio: string
  ) => Promise<void>;
  createLottery: (
    token: string,
    participantFees: string,
    minimumParticipants: string
  ) => Promise<void>;
  enrollInLottery: (
    lotteryAddress: string,
    participantFees: string,
    token: string
  ) => Promise<void>;
  unenrollFromLottery: (lotteryAddress: string) => Promise<void>;
  selectWinner: (lotteryAddress: string) => Promise<void>;
  withdrawOracleFees: (lotteryAddress: string) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refreshLotteries: () => Promise<any[]>;
  flipCoin: () => Promise<void>;
}

export type Profile = {
  isRegistered: boolean;
  username: string;
  profilePicture: string;
  bio: string;
};

export type TokenDetails = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logo: any;
};

export enum LotteryState {
  ACTIVE = 0,
  WINNER_SELECTED = 1,
  CLOSED = 2,
}

export type LotterySection = "active" | "past" | "my";
export type MyLotteryType = "enrolled" | "created";

// Enum matching the contract's FlipState
export enum FlipState {
  Idle = 0,
  Flipping = 1,
  Complete = 2,
}

// Enum matching the contract's FlipChoice
export enum FlipChoice {
  Tails = 0,
  Heads = 1,
}

// Interface for FlipDetails structure returned from the contract
export interface FlipDetails {
  player: string;
  amount: bigint;
  choice: FlipChoice;
  result: FlipChoice | null;
  state: FlipState;
  request_id: bigint;
}

// Contract interaction status types
export type Status = "idle" | "loading" | "success" | "error";

// Context interface to define what the context will provide
export interface CoinFlipContextValue {
  // Core functionality
  flipCoin: (choice: FlipChoice, amount: string) => Promise<void>;
  getFlipDetails: (requestId: bigint) => Promise<FlipDetails | undefined>;
  getContractBalance: (tokenAddress: string) => Promise<bigint | undefined>;

  // State management
  status: Status;
  error: string | null;
  currentFlip: FlipDetails | null;
  setCurrentFlip: (flip: FlipDetails | null) => void;
}

export interface CoinFlipProviderProps {
  children: ReactNode;
  initialContractAddress?: string;
}
