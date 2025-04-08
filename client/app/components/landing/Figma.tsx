import React from "react";
import { Navbar } from "../Navbar";
import FigmaCardsStack from "./GameCard";

export default function Figma() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-80">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-6 py-8">
        {/* Floating game items */}
        <div className="absolute top-10 left-40">
          <img
            src="/icons/gun.svg"
            alt="weapon"
            className="transform rotate-12"
          />
        </div>
        <div className="absolute top-1/2 right-64">
          <img
            src="/icons/gun.svg"
            alt="grenade"
            className="transform -rotate-12"
          />
        </div>
        <div className="absolute bottom-40 left-80">
          <img
            src="/icons/gun.svg"
            alt="weapon"
            className="transform -rotate-45"
          />
        </div>

        {/* Main content */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-yellow-500 rounded-full p-2 mr-2">
              <span className="text-black">🎮</span>
            </div>
            <span className="text-yellow-500 text-xl font-bold">5-Month</span>
            <span className="text-gray-400 text-xl ml-2">— Free Access</span>
          </div>

          <h1 className="text-6xl font-bold mb-2">Fun Games</h1>
          <h2 className="text-5xl font-bold mb-20">Nintendo Switch</h2>

          {/* Game cards */}
         <FigmaCardsStack/>
        </div>
      </main>
    </div>
  );
}
