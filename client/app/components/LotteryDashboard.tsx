import React, { useState } from "react";
import { useAccount } from "@starknet-react/core";
import Link from "next/link";
import {
  convertAddressToStarknetAddress,
  formatTokenAmount,
} from "@/app/utils";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Trophy,
  Clock,
  ExternalLink,
} from "lucide-react";
import { LotteryDetails, LotteryState } from "../types";
import { useLottery } from "../contexts/LotteryContext";
import Loader from "./Loader";
import { voyagerScanBaseUrl } from "../constants";
import Image from "next/image";

const AddressLink = ({
  address,
  label,
}: {
  address: string;
  label?: string;
}) => (
  <Link href={`${voyagerScanBaseUrl}/contract/${address}`} target="_blank">
    <div className="inline-flex items-center gap-2 group hover:bg-purple-50 p-1 rounded-md transition-colors">
      <p className="text-sm font-mono break-all text-purple-900 group-hover:text-purple-700">
        {label || address}
      </p>
      <ExternalLink className="h-4 w-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </Link>
);

const LotteryDashboard = ({
  lotteryDetails,
}: {
  lotteryDetails: LotteryDetails | undefined;
}) => {
  const [showParticipants, setShowParticipants] = useState(false);
  const { account, isConnected } = useAccount();
  const {
    enrollInLottery,
    selectWinner,
    withdrawOracleFees,
    unenrollFromLottery,
  } = useLottery();

  const isOwner =
    convertAddressToStarknetAddress(account?.address || "") ===
    lotteryDetails?.owner;
  const isEnrolled = lotteryDetails?.participants.includes(
    convertAddressToStarknetAddress(account?.address || "")
  );

  const handleClick = (lotteryDetails: LotteryDetails) => {
    if (isEnrolled) {
      unenrollFromLottery(lotteryDetails?.address);
    } else {
      enrollInLottery(
        lotteryDetails?.address,
        lotteryDetails.participant_fees.toString(),
        lotteryDetails.token.address
      );
    }
  };

  const getStatusConfig = (state: LotteryState | undefined) => {
    switch (state) {
      case 0:
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: <Clock className="h-5 w-5" />,
          text: "Active",
          description:
            "This lottery is currently active and accepting participants",
        };
      case 1:
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          icon: <Trophy className="h-5 w-5" />,
          text: "Winner Selected",
          description: "A winner has been selected for this lottery",
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          icon: <Trophy className="h-5 w-5" />,
          text: "Closed",
          description: "This lottery has concluded",
        };
    }
  };

  const status = getStatusConfig(lotteryDetails?.state);

  if (!lotteryDetails) return <Loader isLoading={true} />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Status Banner */}
      <div className={`${status.bgColor} ${status.textColor} p-4 rounded-lg`}>
        <div className="flex items-center gap-2 font-medium">
          {status.icon}
          <span>Lottery Status: {status.text}</span>
        </div>
        <p className="mt-1 text-sm">{status.description}</p>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Lottery Details
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Lottery Address
                </h3>
                <AddressLink address={lotteryDetails.address} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Owner Address
                </h3>
                <AddressLink address={lotteryDetails.owner} />
              </div>
              {lotteryDetails?.winner && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Winner Address
                  </h3>
                  {lotteryDetails.winner === "No winner yet" ? (
                    <p className="text-sm font-mono break-all text-purple-900 group-hover:text-purple-700">
                      No Winner yet
                    </p>
                  ) : (
                    <AddressLink address={lotteryDetails.winner} />
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Token Details
                </h3>
                {lotteryDetails.token.logo ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src={lotteryDetails.token.logo}
                      alt="Token Logo"
                      width={16}
                      height={16}
                    />
                    <p className="mt-1 text-sm">
                      {lotteryDetails.token.name} ({lotteryDetails.token.symbol}
                      )
                    </p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm">
                    {lotteryDetails.token.name} ({lotteryDetails.token.symbol})
                  </p>
                )}
                <AddressLink address={lotteryDetails.token.address} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Entry Fee</h3>
                <p className="mt-1 text-sm">
                  {formatTokenAmount(
                    lotteryDetails.participant_fees,
                    lotteryDetails.token.decimals,
                    lotteryDetails.token.symbol
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Minimum Number of Participants
                </h3>
                <p className="mt-1 text-sm">
                  {lotteryDetails.minimum_participants}
                </p>
              </div>
            </div>
          </div>

          {/* Owner Disclaimer */}
          {isOwner && lotteryDetails.state === 0 && (
            <div className="mt-4 text-sm text-red-600">
              <p>
                Please wait for a few minutes for the Pragma VRF Oracle to
                submit the random number. Do not send the Select Winner
                transaction again during this time.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {lotteryDetails.state === 0 && (
              <button
                disabled={!isConnected}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => handleClick(lotteryDetails)}
              >
                {!isConnected
                  ? "Connect Wallet to Enroll"
                  : isEnrolled
                  ? "Withdraw from Lottery"
                  : "Enroll in Lottery"}
              </button>
            )}

            {isOwner && lotteryDetails.state === 0 && (
              <button
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => selectWinner(lotteryDetails.address)}
                disabled={
                  BigInt(lotteryDetails.participants.length) <
                  lotteryDetails.minimum_participants
                }
              >
                Select Winner
              </button>
            )}

            {isOwner && lotteryDetails.state === 1 && (
              <button
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={() => withdrawOracleFees(lotteryDetails.address)}
              >
                Withdraw Oracle Fees
              </button>
            )}
          </div>

          {/* Participants Section */}
          <div className="pt-4">
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-900">
                  Participants ({lotteryDetails.participants.length})
                </span>
              </div>
              {showParticipants ? (
                <ChevronUp className="h-5 w-5 text-purple-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-purple-600" />
              )}
            </button>

            {showParticipants && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {lotteryDetails.participants.map((participant, index) => (
                  <AddressLink key={index} address={participant} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotteryDashboard;
