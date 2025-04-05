import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { LotteryDetails, LotterySection } from "../types";
import { formatTokenAmount, shortenAddress } from "../utils";
import Image from "next/image";

export const LotteryCard = ({
  lottery,
  router,
  activeSection,
}: {
  lottery: LotteryDetails;
  router: AppRouterInstance;
  activeSection: LotterySection;
}) => (
  <div
    onClick={() => router.push(`/lotteries/${lottery.address}`)}
    className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 space-y-2 hover:border-purple-300 transition-colors cursor-pointer"
  >
    <div className="text-sm text-purple-900 font-medium">
      Token:{" "}
      {lottery.token.logo ? (
        <div className="flex items-center gap-2">
          <Image
            src={lottery.token.logo}
            alt="Token Logo"
            width={16}
            height={16}
          />
          {lottery.token.name}
        </div>
      ) : (
        lottery.token.name
      )}
    </div>

    <div className="text-sm text-purple-900 font-medium">
      Entry Fee:{" "}
      {formatTokenAmount(
        lottery.participant_fees,
        lottery.token.decimals,
        lottery.token.symbol
      )}
    </div>

    <div className="text-sm text-purple-900 font-medium">
      Current Pot:{" "}
      {formatTokenAmount(
        lottery.participant_fees * BigInt(lottery.participants.length),
        lottery.token.decimals,
        lottery.token.symbol
      )}
    </div>

    <div className="text-sm text-purple-900 font-mono">
      Contract Address: {shortenAddress(lottery.address)}
    </div>

    {activeSection === "past" && (
      <div className="text-sm text-purple-900 font-mono">
        Winner: {shortenAddress(lottery.winner)}
      </div>
    )}
  </div>
);
