"use client";

import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { WalletModal } from "./WalletModal";
import Address from "./address";

const WalletBar: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected } = useAccount();

  return (
    <div className={`flex items-center ${isMobile ? "w-full" : ""}`}>
      {!isConnected ? (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className={`
              font-['Press_Start_2P'] text-xs  text-purple-200
              py-3 px-6 sm:px-8 rounded-lg border border-pink-400 bg-[#1e002e]
              hover:bg-[#2b0050] transition-all duration-300 whitespace-nowrap
              shadow-[4px_4px_0_0_#EC4899] hover:shadow-[2px_2px_0_0_#EC4899]
              ${isMobile ? "w-full text-sm" : "sm:w-[240px]"}
            `}
          >
            Connect Wallet
          </button>
          <WalletModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        </>
      ) : (
        <Address isMobile={isMobile} />
      )}
    </div>
  );
};

export default WalletBar;
