"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useConnect, Connector } from "@starknet-react/core";
import { X } from "lucide-react";
import Image from "next/image";
// import { useLottery } from "../contexts/LotteryContext";

interface WalletModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface WalletDetails {
  name: string;
  subtext: string;
  icon: string;
}

const walletIcons = {
  argentX: "/argent.svg",
  argentMobile:
    "data:image/svg+xml;base64,PHN2ZwogICAgd2lkdGg9IjMyIgogICAgaGVpZ2h0PSIzMiIKICAgIHZpZXdCb3g9IjAgMCAzMiAzMiIKICAgIGZpbGw9Im5vbmUiCiAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgPgogICAgPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iI0ZGODc1QiIgLz4KICAgIDxwYXRoCiAgICAgIGQ9Ik0xOC4zMTYgOEgxMy42ODRDMTMuNTI5MiA4IDEzLjQwNTIgOC4xMjcyIDEzLjQwMTggOC4yODUzMUMxMy4zMDgyIDEyLjcyOTYgMTEuMDMyMyAxNi45NDc3IDcuMTE1MTMgMTkuOTM1NUM2Ljk5MDc3IDIwLjAzMDMgNi45NjI0MyAyMC4yMDg1IDcuMDUzMzUgMjAuMzM2OUw5Ljc2MzQ5IDI0LjE2NTRDOS44NTU2OSAyNC4yOTU3IDEwLjAzNTMgMjQuMzI1MSAxMC4xNjE4IDI0LjIyOTRDMTIuNjExMSAyMi4zNzM0IDE0LjU4MTIgMjAuMTM0NSAxNiAxNy42NTI5QzE3LjQxODcgMjAuMTM0NSAxOS4zODkgMjIuMzczNCAyMS44MzgzIDI0LjIyOTRDMjEuOTY0NiAyNC4zMjUxIDIyLjE0NDMgMjQuMjk1NyAyMi4yMzY2IDI0LjE2NTRMMjQuOTQ2NyAyMC4zMzY5QzI1LjAzNzUgMjAuMjA4NSAyNS4wMDkyIDIwLjAzMDMgMjQuODg1IDE5LjkzNTVDMjAuOTY3NiAxNi45NDc3IDE4LjY5MTggMTIuNzI5NiAxOC41OTgzIDguMjg1MzFDMTguNTk0OSA4LjEyNzIgMTguNDcwOCA4IDE4LjMxNiA4WiIKICAgICAgZmlsbD0id2hpdGUiCiAgICAvPgogIDwvc3ZnPg==",
  webwallet:
    "data:image/svg+xml;base64,PHN2ZwogICAgd2lkdGg9IjMyIgogICAgaGVpZ2h0PSIyOCIKICAgIHZpZXdCb3g9IjAgMCAxOCAxNCIKICAgIGZpbGw9Im5vbmUiCiAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgPgogICAgPHBhdGgKICAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgICBjbGlwLXJ1bGU9ImV2ZW5vZGQiCiAgICAgIGQ9Ik0xLjUgMC40Mzc1QzAuOTgyMjMzIDAuNDM3NSAwLjU2MjUgMC44NTcyMzMgMC41NjI1IDEuMzc1VjEyQzAuNTYyNSAxMi40MTQ0IDAuNzI3MTIgMTIuODExOCAxLjAyMDE1IDEzLjEwNDlDMS4zMTMxNyAxMy4zOTc5IDEuNzEwNiAxMy41NjI1IDIuMTI1IDEzLjU2MjVIMTUuODc1QzE2LjI4OTQgMTMuNTYyNSAxNi42ODY4IDEzLjM5NzkgMTYuOTc5OSAxMy4xMDQ5QzE3LjI3MjkgMTIuODExOCAxNy40Mzc1IDEyLjQxNDQgMTcuNDM3NSAxMlYxLjM3NUMxNy40Mzc1IDAuODU3MjMzIDE3LjAxNzggMC40Mzc1IDE2LjUgMC40Mzc1SDEuNVpNMi40Mzc1IDMuNTA2MTZWMTEuNjg3NUgxNS41NjI1VjMuNTA2MTZMOS42MzM0OSA4Ljk0MTA4QzkuMjc1MDcgOS4yNjk2NCA4LjcyNDkzIDkuMjY5NjQgOC4zNjY1MSA4Ljk0MTA4TDIuNDM3NSAzLjUwNjE2Wk0xNC4wODk5IDIuMzEyNUgzLjkxMDEzTDkgNi45NzgyMkwxNC4wODk5IDIuMzEyNVoiCiAgICAgIGZpbGw9ImN1cnJlbnRDb2xvciIKICAgIC8+CiAgPC9zdmc+",
  braavos: "/braavos.svg",
} as const;

export function WalletModal({ isOpen, setIsOpen }: WalletModalProps) {
  // const { fetchProfile } = useLottery();
  const { connectors, connectAsync } = useConnect();
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(
    null
  );

  const getWalletDetails = (connector: Connector): WalletDetails => {
    switch (connector.id) {
      case "argentX":
        return {
          name: "Argent",
          subtext: "WEBSITE",
          icon: walletIcons.argentX,
        };
      case "braavos":
        return {
          name: "Braavos",
          subtext: "WEBSITE",
          icon: walletIcons.braavos,
        };
      case "argentMobile":
        return {
          name: "Argent",
          subtext: "MOBILE",
          icon: walletIcons.argentMobile,
        };
      case "webwallet":
      case "argentWebWallet":
        return {
          name: "Argent Web Wallet",
          subtext: "WEBSITE",
          icon: walletIcons.webwallet,
        };
      default:
        return {
          name: connector.id,
          subtext: "WEBSITE",
          icon: walletIcons.argentX,
        };
    }
  };

  const connectWallet = async (connector: Connector | null) => {
    if (connector) {
      await connectAsync({ connector });
      // await fetchProfile();
      setSelectedConnector(connector);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedConnector(null);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform rounded-xl bg-[#1a1a1a] border-2 border-gray-400 p-6 shadow-[0_0_25px_#000] transition-all font-techno text-white">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-border-gray-400 tracking-wider animate-pulse">
                    Select Wallet
                  </h2>
                  <button
                    onClick={handleClose}
                    className="text-gray-700 hover:text-gray-border-gray-400 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-[#cccccc] text-center mb-6">
                  Choose a wallet to connect with Starknet
                </p>

                <div className="space-y-4">
                  {connectors.map((connector) => {
                    const walletDetails = getWalletDetails(connector);
                    const isSelected = selectedConnector?.id === connector.id;

                    return (
                      <button
                        key={connector.id}
                        onClick={() => connectWallet(connector)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                          ${
                            isSelected
                              ? "bg-[#00FF00] text-black"
                              : "bg-[#222] border-gray-700 text-white hover:bg-gray-border-gray-400 hover:text-white"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={walletDetails.icon}
                            alt={walletDetails.name}
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                          <div className="text-left">
                            <p className="text-sm font-medium">
                              {walletDetails.name}
                            </p>
                            <p className="text-xs text-[#aaaaaa]">
                              {walletDetails.subtext}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
