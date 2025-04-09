"use client";

import { useAccount } from "@starknet-react/core";
import { MoreVertical } from "lucide-react";
import DisconnectModal from "./disconnect-modal";

import { useState } from "react";
import { useLottery } from "../contexts/GameContext";
import Image from "next/image";

interface AddressProps {
  isMobile?: boolean;
}

const Address: React.FC<AddressProps> = ({ isMobile = false }) => {
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const { address } = useAccount();
  const { profile } = useLottery();

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-lg max-w-full overflow-x-auto ${
        isMobile ? "w-full" : ""
      }`}
    >
      <div
        className={`flex items-center gap-3 w-full ${
          isMobile ? "flex-row" : "flex-col sm:flex-row sm:gap-4"
        }`}
      >
        {!profile?.isRegistered ? (
          <button
            onClick={() => setIsDisconnectModalOpen(true)}
            className={`
              flex items-center gap-3 border border-gray-300 rounded-full px-4 py-2 hover:border-gray-500 transition-all
              ${isMobile ? "w-full justify-between" : "sm:w-[170px]"}
            `}
          >
            <Image
              src="/icons/girl.svg"
              width={36}
              height={36}
              alt="User avatar"
              className="rounded-full bg-orange-300 object-cover"
            />
            <span className="truncate text-sm text-white font-medium">
              {address ? shortenAddress(address) : ""}
            </span>
          </button>
        ) : (
          <div
            className={`flex items-center justify-between bg-[#E6E6FA] rounded-full gap-3
              ${isMobile ? "w-full px-4 py-3" : "sm:w-auto px-4 py-2"}
            `}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Image
                src="/icons/girl.svg"
                width={36}
                height={36}
                alt="User avatar"
                className="rounded-full bg-orange-300 object-cover"
              />
              <span
                className={`
                  text-[#483D8B] truncate font-medium
                  ${isMobile ? "text-base" : "text-sm sm:text-base"}
                `}
              >
                {profile.username || (address ? shortenAddress(address) : "")}
              </span>
            </div>
            <button
              onClick={() => setIsDisconnectModalOpen(true)}
              className="p-1 hover:bg-[#9370DB] rounded-full transition-colors ml-1"
            >
              <MoreVertical
                className={`text-[#483D8B] ${isMobile ? "w-5 h-5" : "w-4 h-4 sm:w-5 sm:h-5"}`}
              />
            </button>
          </div>
        )}
      </div>

      <DisconnectModal
        isOpen={isDisconnectModalOpen}
        setIsOpen={setIsDisconnectModalOpen}
      />
    </div>
  );
};

export default Address;
