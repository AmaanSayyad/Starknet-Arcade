"use client";

import { useAccount } from "@starknet-react/core";
import DisconnectModal from "./disconnect-modal";
import { lookupAddresses } from "@cartridge/controller";
import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface AddressProps {
  isMobile?: boolean;
}

const Address: React.FC<AddressProps> = ({ isMobile = false }) => {
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const { address } = useAccount();
  const [username, setUserName] = useState("nikku");

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied!");
    }
  };

  useEffect(() => {
    (async () => {
      if (address) {
        const addressMap = await lookupAddresses([address]);
        setUserName(addressMap.get(address) || "nikku");
      }
    })();
  }, [address]);

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
              {address ? shortenAddress(address) : ""} | {username}
            </span>
            {address && (
              <>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-[#D8BFD8] text-black rounded-full transition-colors"
                  title="Copy address"
                >
                  ㊢
                </button>

                <button
                  onClick={() => setIsDisconnectModalOpen(true)}
                  className="p-1 hover:bg-red-200 text-[#D10000] font-medium text-sm rounded-full transition-colors"
                  title="Disconnect"
                >
                  Disconnect
                  {/* OR use icon instead of text:
                  <LogOut className="w-4 h-4" /> */}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <DisconnectModal
        isOpen={isDisconnectModalOpen}
        setIsOpen={setIsDisconnectModalOpen}
      />
    </div>
  );
};

export default Address;
