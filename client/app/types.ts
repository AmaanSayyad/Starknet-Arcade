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
