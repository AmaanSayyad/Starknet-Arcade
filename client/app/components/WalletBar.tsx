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
              py-2 px-4 bg-[#9370DB] rounded-full text-sm leading-5 
              hover:bg-[#483D8B] text-white font-semibold transition-colors
              ${isMobile ? "w-full py-3 text-base" : "sm:py-3 sm:w-[200px]"}
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
