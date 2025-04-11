"use client";
import { useState } from "react";

export default function CoinFlipGame() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"starknet" | "reclaim" | null>(null);
  const [userChoice, setUserChoice] = useState<"starknet" | "reclaim" | null>(null);
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const [flips, setFlips] = useState(0);
  const [wins, setWins] = useState(0);
  const [coinAnimation, setCoinAnimation] = useState("");
  const [coinSide, setCoinSide] = useState<"starknet" | "reclaim" | null>(null);

  const handleFlip = (choice: "starknet" | "reclaim") => {
    if (isFlipping) return;

    setUserChoice(choice);
    setIsFlipping(true);
    setGameResult(null);
    setCoinSide(null);

    // Random result generation
    const randomResult = Math.random() > 0.5 ? "starknet" : "reclaim";

    // Animation sequence - toss up, flip, and drop
    setCoinAnimation("animate-toss");

    // Simulate the complete coin flip animation sequence
    setTimeout(() => {
      setCoinAnimation("animate-flip");

      setTimeout(() => {
        setCoinAnimation("animate-drop");
        setCoinSide(randomResult);

        setTimeout(() => {
          setCoinAnimation("");
          setResult(randomResult);
          setIsFlipping(false);
          setFlips((prev) => prev + 1);

          // Check if user won
          if (choice === randomResult) {
            setWins((prev) => prev + 1);
            setGameResult("win");
          } else {
            setGameResult("lose");
          }
        }, 500); // Drop animation time
      }, 1000); // Flip animation time
    }, 500); // Toss animation time
  };

  return (
    <div className="flex flex-col items-center justify-center  h-full p-4">
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
      
      <style jsx>{`
        @keyframes toss {
          0% {
            transform: translateY(0) scale(1);
          }
          100% {
            transform: translateY(-100px) scale(0.8);
          }
        }

        @keyframes flip {
          0% {
            transform: translateY(-100px) rotateY(0) scale(0.8);
          }
          100% {
            transform: translateY(-100px) rotateY(1080deg) scale(0.8);
          }
        }

        @keyframes drop {
          0% {
            transform: translateY(-100px) scale(0.8);
          }
          60% {
            transform: translateY(20px) scale(1.1);
          }
          80% {
            transform: translateY(-10px) scale(0.9);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }

        .animate-toss {
          animation: toss 0.5s ease-out forwards;
        }

        .animate-flip {
          animation: flip 1s linear forwards;
        }

        .animate-drop {
          animation: drop 0.5s ease-in forwards;
        }
      `}</style>

      <div className="bg-gradient-to-br from-black via-gray-500 to-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md border border-gray-700 relative z-10 mt-24">
        <h1 className="text-2xl font-techno font-bold text-center mb-6 text-white">
          StarkNet vs Reclaim
        </h1>

        {/* Logo Coin */}
        <div className="flex justify-center mb-8 perspective-500">
          <div
            className={`relative w-32 h-32 rounded-full bg-blue-800 flex items-center justify-center
            shadow-lg ${coinAnimation}`}
          >
            <div className="absolute w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center">
              {coinSide === "reclaim" ? (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa-Eg_DQYr78RTTdcPHdnWEPFwgBNLMAEMoQ&s"
                  alt="Reclaim Logo"
                  className="w-20 h-20 rounded-full object-contain"
                />
              ) : (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyryehB1_k7vVWpfloLj_2NeOxHTmOubzNHQ&s"
                  alt="StarkNet Logo"
                  className="w-20 h-20 rounded-full object-contain"
                />
              )}
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-6 font-techno">
          {isFlipping ? (
            <p className="text-lg font-medium text-gray-300">Flipping...</p>
          ) : result ? (
            <div>
              <p className="text-lg font-medium mb-2 text-gray-300">
                Result:{" "}
                <span className="font-bold text-gray-300">
                  {result.toUpperCase()}
                </span>
              </p>
              <p className="text-lg font-medium mb-2 text-gray-300">
                Your choice:{" "}
                <span className="font-bold text-gray-300">
                  {userChoice?.toUpperCase()}
                </span>
              </p>
              <p
                className={`text-xl font-bold ${
                  gameResult === "win" ? "text-green-500" : "text-red-500"
                }`}
              >
                {gameResult === "win" ? "You Win! 🎉" : "You Lose! 😢"}
              </p>
            </div>
          ) : (
            <p className="text-lg font-medium text-gray-300">
              Choose StarkNet or Reclaim
            </p>
          )}
        </div>

        {/* Game Controls */}
        <div className="flex gap-4 justify-center mb-6 w-full ">
          {[
            { name: "STARKNET", value: "starknet" },
            { name: "RECLAIM", value: "reclaim" }
          ].map((side) => (
            <button
              key={side.value}
              onClick={() => handleFlip(side.value as "starknet" | "reclaim")}
              disabled={isFlipping}
              className={`font-sans text-xs w-full text-white py-3 px-6 sm:px-8 rounded-lg
                border border-white bg-gray-900 transition-all duration-300 whitespace-nowrap
                shadow-[4px_4px_0_0_#000] hover:bg-gray-800 hover:shadow-[2px_2px_0_0_#000]
                ${
                  isFlipping
                    ? "opacity-50 cursor-not-allowed hover:shadow-[4px_4px_0_0_#000]"
                    : ""
                }`}
            >
              {side.name}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-between font-techno px-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-300">Total Flips</p>
            <p className="text-xl font-bold text-gray-300">{flips}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-300">Wins</p>
            <p className="text-xl font-bold text-gray-300">{wins}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-300">Win Rate</p>
            <p className="text-xl font-bold text-gray-300">
              {flips > 0 ? `${Math.round((wins / flips) * 100)}%` : "0%"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}