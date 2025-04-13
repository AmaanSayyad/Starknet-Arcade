"use client";
import { useState } from "react";
import { useCoinFlip } from "../contexts/CoinFlipContext";
import { useGameContract } from "../hooks/useGameContract";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { useEffect } from "react";

export default function CoinFlipGame() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"starknet" | "reclaim" | null>(null);
  const [userChoice, setUserChoice] = useState<"starknet" | "reclaim" | null>(
    null
  );
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const [flips, setFlips] = useState(0);
  const [wins, setWins] = useState(0);
  const [coinAnimation, setCoinAnimation] = useState("");
  const [coinSide, setCoinSide] = useState<"starknet" | "reclaim" | null>(null);
  const [showModal, setShowModal] = useState(true);
  const [modalChoice, setModalChoice] = useState<"starknet" | "reclaim" | null>(
    null
  );
  const [betAmount, setBetAmount] = useState("");

  const {
    // flipCoin,
    getFlipDetails,
    getContractBalance,
    status,
    error,
    currentFlip,
    setCurrentFlip,
    latestRequestedId,
  } = useCoinFlip();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, account } = useAccount();
  const [username, setUsername] = useState<string | undefined>();
  const [connected, setConnected] = useState(false);

  // Initialize hooks
  const { flipCoin } = useGameContract(connected, account);

  // Controller connection
  useEffect(() => {
    if (!address) return;
    const controller = connectors.find((c) => c instanceof ControllerConnector);
    if (controller) {
      controller.username()?.then((n) => setUsername(n));
      setConnected(true);
    }
  }, [address, connectors]);

  const handleFlipCoin = async () => {
    try {
      const choice = modalChoice === "starknet" ? 1 : 0;
      if (!betAmount || isNaN(Number(betAmount))) return;
      let id = await flipCoin(choice, betAmount);
      console.log("Flip ID:", id);
      if (!id) return;
      await fetchFlipDetails(id);
      setShowModal(false);
      handleStartGame();
    } catch (error) {
      console.error("Error flipping coin:", error);
    }
  };

  const fetchFlipDetails = async (id: bigint | string) => {
    try {
      const requestIdBigInt = BigInt(id);
      const details = await getFlipDetails(requestIdBigInt);
      console.log("Flip details:", details);
      if (details) {
        setCurrentFlip(details);
      }
    } catch (error) {
      console.error("Error fetching flip details:", error);
    }
  };

  const handleFlip = (choice: "starknet" | "reclaim") => {
    if (isFlipping) return;
    setUserChoice(choice);
    setIsFlipping(true);
    setGameResult(null);
    setCoinSide(null);

    const randomResult = Math.random() > 0.5 ? "starknet" : "reclaim";
    setCoinAnimation("animate-toss");

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

          if (choice === randomResult) {
            setWins((prev) => prev + 1);
            setGameResult("win");
          } else {
            setGameResult("lose");
          }
        }, 500);
      }, 1000);
    }, 500);
  };

  const handleStartGame = () => {
    if (!modalChoice || !betAmount || isNaN(Number(betAmount))) return;
    setUserChoice(modalChoice);
    handleFlip(modalChoice);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 relative">
      {showModal && (
        <div className="absolute inset-0 z-50 h-[100vh] bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-gray-900 font-techno p-6 rounded-xl border border-gray-700 w-120">
            <h2 className="text-white text-xl font-bold mb-4 text-center">
              Let's Begin the Game
            </h2>
            <div className="flex gap-4 mb-4 justify-center items-center">
              {["starknet", "reclaim"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setModalChoice(opt as "starknet" | "reclaim")}
                  className={`w-32 h-32 px-4 py-2 flex justify-center items-center rounded-full ${
                    modalChoice === opt
                      ? "bg-white text-black font-bold"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  <img
                    src={
                      opt === "starknet"
                        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyryehB1_k7vVWpfloLj_2NeOxHTmOubzNHQ&s"
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa-Eg_DQYr78RTTdcPHdnWEPFwgBNLMAEMoQ&s"
                    }
                    alt={opt}
                    className="w-24 h-24 rounded-full object-contain"
                  />
                </button>
              ))}
            </div>
            <input
              type="number"
              className="w-full px-3 py-2 mt-5 rounded bg-gray-700 text-white border border-gray-600 mb-4"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <button
              onClick={() => {
                handleFlipCoin();
              }}
              disabled={!modalChoice || !betAmount}
              className="w-full bg-green-600 mt-2 hover:bg-green-700 text-white py-2 rounded-lg font-bold"
            >
              Submit & Flip
            </button>
          </div>
        </div>
      )}

      <div className="absolute h-[90vh] inset-0 bg-gradient-to-br from-black to-gray-900 opacity-80">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Animations */}
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
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          StarkNet vs Reclaim
        </h1>

        <div className="flex justify-center mb-8 perspective-500">
          <div
            className={`relative w-32 h-32 rounded-full bg-blue-800 flex items-center justify-center shadow-lg ${coinAnimation}`}
          >
            <div className="absolute w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center">
              <img
                src={
                  coinSide === "reclaim"
                    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa-Eg_DQYr78RTTdcPHdnWEPFwgBNLMAEMoQ&s"
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyryehB1_k7vVWpfloLj_2NeOxHTmOubzNHQ&s"
                }
                alt={coinSide || "coin"}
                className="w-20 h-20 rounded-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Game Results */}
        <div className="text-center mb-6">
          {isFlipping ? (
            <p className="text-lg text-gray-300">Flipping...</p>
          ) : result ? (
            <>
              <p className="text-lg mb-2 text-gray-300">
                Result:{" "}
                <span className="font-bold">{result.toUpperCase()}</span>
              </p>
              <p className="text-lg mb-2 text-gray-300">
                Your Choice:{" "}
                <span className="font-bold">{userChoice?.toUpperCase()}</span>
              </p>
              <p
                className={`text-xl font-bold ${
                  gameResult === "win" ? "text-green-500" : "text-red-500"
                }`}
              >
                {gameResult === "win" ? "You Win! 🎉" : "You Lose! 😢"}
              </p>
            </>
          ) : (
            <p className="text-lg text-gray-300">Make your choice to begin!</p>
          )}
        </div>

        {/* Stats */}
        <div className="text-gray-400 text-center">
          <p>Total Flips: {flips}</p>
          <p>Wins: {wins}</p>
        </div>
      </div>
    </div>
  );
}
