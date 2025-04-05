"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";
import { useDisconnect } from "@starknet-react/core";

interface DisconnectWalletModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DisconnectModal({
  isOpen,
  setIsOpen,
}: DisconnectWalletModalProps) {
  const { disconnect } = useDisconnect();

  const handleClose = () => setIsOpen(false);
  const handleDisconnect = () => disconnect();

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
          <div className="fixed inset-0 bg-black/60" />
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
              <Dialog.Panel className="w-full max-w-sm transform rounded-3xl bg-white border border-[#E6E6FA] p-4 shadow-xl transition-all">
                <div className="flex relative justify-center mt-2 text-center items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium text-[#483D8B]"
                  >
                    Disconnect wallet
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-[#9370DB] hover:text-[#483D8B] absolute right-2 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-[#483D8B] text-sm my-4 text-center">
                  Are you sure you want to disconnect your wallet?
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6 mb-2">
                  <button
                    className="py-3 rounded-full bg-[#E6E6FA] hover:bg-[#9370DB] text-[#483D8B] hover:text-white text-sm transition-colors"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="py-3 rounded-full bg-[#9370DB] hover:bg-[#483D8B] text-white text-sm transition-colors"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
