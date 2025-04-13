"use client";
import { useEffect, useState } from "react";
import WalletBar from "./WalletBar";
import ControllerButton from "./floppy-bird/game/ControllerButton";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";

export function Navbar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, account } = useAccount();
  const [username, setUsername] = useState<string | undefined>();
  const [connected, setConnected] = useState(false);

  // Controller connection
  useEffect(() => {
    if (!address) return;
    const controller = connectors.find((c) => c instanceof ControllerConnector);
    if (controller) {
      controller.username()?.then((n) => setUsername(n));
      setConnected(true);
    }
  }, [address, connectors]);

  const handleControllerClick = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    try {
      if (address) {
        await disconnect();
        setConnected(false);
        setUsername(undefined);
      } else {
        const controller = connectors.find(
          (c) => c instanceof ControllerConnector
        );
        if (!controller) {
          throw new Error("Controller connector not found");
        }
        await connect({ connector: controller });
        setConnected(true);
      }
    } catch (error) {
      console.error("Controller connection error:", error);
    }
  };

  return (
    <>
      <header className="w-full px-6 py-4 flex justify-between items-center text-white relative z-10 font-sans">
        {/* Left: Logo & Links */}
        <div className="flex items-center space-x-10">
          <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-300 transition-colors">
            <img src="/icons/gamepad.svg" alt="Games" className="w-6 h-6" />
            <span className="font-semibold text-lg">Games</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
            <img src="/icons/store.svg" alt="Store" className="w-6 h-6" />
            <span className="font-semibold text-lg">Store</span>
          </div>
          <div
            className={`transition-all duration-200 ease-in-out border border-[#ffffff1a] bg-[#6f6f6f33] backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-3 ${
              searchFocused ? "ring-2 ring-white" : ""
            }`}
          >
            <img
              src="/icons/search.svg"
              alt="Search"
              className="w-4 h-4 opacity-70"
            />
            <input
              type="text"
              placeholder="Search Games..."
              className="bg-transparent outline-none text-base text-white placeholder-gray-400 w-48 sm:w-32"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <img
              src="/icons/settings.png"
              alt="Settings"
              className="w-4 h-4 opacity-70 cursor-pointer"
            />
          </div>
        </div>

        {/* Center Logo */}
        <div className="flex-shrink-0">
          <img src="/icons/center.png" alt="Logo" className="w-12 h-12" />
        </div>

        {/* Right: Icons or Wallet */}
        <div className="flex items-center space-x-6">
          <img
            src="/icons/bag.png"
            alt="Bag"
            className="w-6 h-6 opacity-80 cursor-pointer hover:opacity-100"
          />
          <div className="relative cursor-pointer">
            <img
              src="/icons/bell.svg"
              alt="Notifications"
              className="w-6 h-6 opacity-80 hover:opacity-100"
            />
            <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-black"></span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-sm">
              🪙
            </div>
            <span className="text-white text-base font-semibold">
              1290.0000
            </span>
            <img src="/icons/plus-circle.svg" alt="Add" className="w-5 h-5" />
          </div>

          <WalletBar />
          <ControllerButton
            connected={connected}
            username={username}
            handleControllerClick={handleControllerClick}
          />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white ml-4"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-90">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <button
              className="absolute top-4 right-6"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <a href="#" className="text-xl text-white hover:text-purple-400">
              Games
            </a>
            <a href="#" className="text-xl text-white hover:text-purple-400">
              Leaderboard
            </a>
            <a href="#" className="text-xl text-white hover:text-purple-400">
              About
            </a>

            <WalletBar />
          </div>
        </div>
      )}
    </>
  );
}
