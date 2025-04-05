/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
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
    <>
    <header className="relative z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">SA</span>
          </div>
          <span className="text-2xl font-bold">Starknet Arcade</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="hover:text-purple-400 transition-colors">Games</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Leaderboard</a>
          <a href="#" className="hover:text-purple-400 transition-colors">About</a>
          <WalletBar />
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <a href="#" className="text-xl">Games</a>
            <a href="#" className="text-xl">Leaderboard</a>
            <a href="#" className="text-xl">About</a>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-full font-medium">
              Connect Wallet
            </button>
          </div>
        </div>
      )}</>
  );
}
