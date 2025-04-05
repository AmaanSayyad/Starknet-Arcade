import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import WalletBar from "./WalletBar";
import starknet from "../../public/starknet.svg";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
           
          </div>
          {/* Wallet Section */}
          <div className="hidden md:flex items-center">
            <WalletBar isMobile={false} />
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className={`h-6 w-6 transition-transform duration-300 ${
                  isMenuOpen ? "rotate-90" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="relative w-12 h-12">
                  <Image
                    src={starknet}
                    alt="Starknet"
                    width={48}
                    height={48}
                    className="rounded-full shadow-lg"
                  />
                </div>
                <span className="ml-3 text-2xl font-bold text-gray-800">
                  Starknet Arcade
                </span>
              </div>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <svg
                  className="h-6 w-6 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
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
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Wallet Section */}
            <div className="p-6 border-b border-gray-200">
              <WalletBar isMobile={true} />
            </div>

            {/* Navigation Links */}
            <div className="p-6 space-y-6">
              <Link
                href="/"
                className="flex items-center text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                onClick={toggleMenu}
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </Link>
             
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
