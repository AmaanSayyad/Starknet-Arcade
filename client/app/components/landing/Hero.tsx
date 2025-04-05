import React from "react";
import RetroButton from "../RetroButton";

const Hero = () => {
  return (
    <section
      className="relative overflow-hidden pt-20 pb-32 px-6 text-center w-full mx-auto text-white"
      style={{
        background:
          "radial-gradient(104.56% 104.56% at 50% 52.81%, rgba(0, 0, 0, 0) 0%, rgba(229, 4, 152, 0.2) 100%)",
      }}
    >
      {/* Chessboard Pattern Overlay */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.05 }}
      >
        <defs>
          <pattern
            id="chessboardPattern"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <rect width="5" height="5" fill="#EC4899" />
            <rect x="5" y="5" width="5" height="5" fill="#EC4899" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#chessboardPattern)" />
      </svg>
      {/* Snake Path Pattern with Snake Mouth and Ladder */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.1 }}
      >
        <defs>
          <pattern
            id="snakeTrailWithLadders"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            {/* Snake body path */}
            <path
              d="M0 10 Q5 0 10 10 T20 10"
              stroke="#9333EA"
              strokeWidth="0.8"
              fill="none"
            />

            {/* Ladder steps */}
            <line
              x1="6"
              y1="6"
              x2="6"
              y2="14"
              stroke="#F472B6"
              strokeWidth="0.5"
            />
            <line
              x1="10"
              y1="6"
              x2="10"
              y2="14"
              stroke="#F472B6"
              strokeWidth="0.5"
            />
            <line
              x1="6"
              y1="8"
              x2="10"
              y2="8"
              stroke="#F472B6"
              strokeWidth="0.3"
            />
            <line
              x1="6"
              y1="10"
              x2="10"
              y2="10"
              stroke="#F472B6"
              strokeWidth="0.3"
            />
            <line
              x1="6"
              y1="12"
              x2="10"
              y2="12"
              stroke="#F472B6"
              strokeWidth="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#snakeTrailWithLadders)" />
      </svg>

      {/* Dice Dots */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.03 }}
      >
        <defs>
          <pattern
            id="diceDots"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="4" cy="4" r="1.5" fill="#F472B6" />
            <circle cx="16" cy="16" r="1.5" fill="#F472B6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diceDots)" />
      </svg>

      {/* Rock-Paper-Scissors Icons */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.03 }}
      >
        <text x="20" y="40" fontSize="30" fill="#EC4899" fontFamily="monospace">
          ✊ ✋ ✌️
        </text>
        <text
          x="120"
          y="120"
          fontSize="30"
          fill="#EC4899"
          fontFamily="monospace"
        >
          ✋ ✌️ ✊
        </text>
      </svg>

      {/* Memory Grid */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.015 }}
      >
        <defs>
          <pattern
            id="memoryGrid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="1"
              y="1"
              width="8"
              height="8"
              fill="none"
              stroke="#e879f9"
              strokeWidth="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#memoryGrid)" />
      </svg>

      {/* Main Content */}
      <div className="relative z-10">
        <h1
          className="text-4xl md:text-6xl font-bold mb-6 font-silk"
        //   style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          STARKNET ARCADE
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 max-w-xl mx-auto">
          Play classic games like Snake & Ladder, Memory Match, and more —
          powered by Web3 magic ✨
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
          <RetroButton href="#">Play Now</RetroButton>

          <RetroButton
            href="#"
            textColor="text-purple-300"
            borderColor="border-purple-500"
            shadowColor="shadow-[4px_4px_0_0_#EC4899]"
            bgColor="bg-transparent"
          >
            Join Community
          </RetroButton>
        </div>
      </div>
    </section>
  );
};

export default Hero;
