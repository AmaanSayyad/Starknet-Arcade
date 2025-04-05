"use client";

import { useAccount } from "@starknet-react/core";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import userIcon from "../../public/user.png";
import DisconnectModal from "./disconnect-modal";

import { useState } from "react";
import { useLottery } from "../contexts/LotteryContext";

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
        className={`flex items-center gap-2 w-full ${
          isMobile ? "flex-row" : "flex-col sm:flex-row sm:gap-3"
        }`}
      >
        {!profile?.isRegistered ? (
          <>
           
            <button
              onClick={() => setIsDisconnectModalOpen(true)}
              className={`
            py-2 px-4 bg-[#9370DB] rounded-full text-sm leading-5 
            hover:bg-[#483D8B] text-white font-semibold transition-colors
            ${isMobile ? "w-full py-3 text-base" : "sm:py-3 sm:w-[200px]"}
            `}
            >
            ({address ? shortenAddress(address) : ""})
            </button>
          </>
        ) : (
          <div
            className={`
            flex bg-[#E6E6FA] justify-between items-center gap-2 rounded-full
            ${
              isMobile
                ? "w-full px-6 py-3"
                : "px-4 sm:px-6 py-2 sm:py-2 sm:w-auto"
            }
          `}
          >
            <div className="flex items-center gap-2 flex-shrink-0">
             
              <div className="flex-shrink min-w-0">
                <span
                  className={`
                  text-[#483D8B] truncate
                  ${isMobile ? "text-base" : "text-sm sm:text-base"}
                `}
                >
                  {profile.username || (address ? shortenAddress(address) : "")}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsDisconnectModalOpen(true)}
              className="p-1 hover:bg-[#9370DB] rounded transition-colors ml-1"
            >
              <MoreVertical
                className={`
                text-[#483D8B]
                ${isMobile ? "w-5 h-5" : "w-4 h-4 sm:w-5 sm:h-5"}
              `}
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
