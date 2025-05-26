"use client";
import { useState, useEffect } from "react";
import { useCoinFlip } from "../contexts/CoinFlipContext";
import { useGameContract } from "../hooks/useGameContract";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { addOrUpdatePlayer } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/Button";

export default function CoinFlipGame() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"starknet" | "cartridge" | null>(null);
  const [userChoice, setUserChoice] = useState<"starknet" | "cartridge" | null>(
    null
  );
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const [flips, setFlips] = useState(0);
  const [wins, setWins] = useState(0);
  const [coinAnimation, setCoinAnimation] = useState("");
  const [coinSide, setCoinSide] = useState<"starknet" | "cartridge" | null>(null);
  const [showModal, setShowModal] = useState(true);
  const [modalChoice, setModalChoice] = useState<"starknet" | "cartridge" | null>(
    null
  );
  const [betAmount, setBetAmount] = useState("");
  const [betError, setBetError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
  const { connectors } = useConnect();
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

  const validateBet = () => {
    if (!betAmount) {
      setBetError("Please enter a bet amount");
      return false;
    }
    
    const amount = Number(betAmount);
    if (isNaN(amount) || amount <= 0) {
      setBetError("Please enter a valid bet amount");
      return false;
    }
    
    setBetError("");
    return true;
  };

  const handleFlipCoin = async () => {
    try {
      if (!validateBet()) return;
      
      setIsLoading(true);
      const choice = modalChoice === "starknet" ? 1 : 0;
      console.log("inside flip", choice);
      
      let id = await flipCoin(betAmount, choice);
      console.log("Flip ID:", id);
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      await fetchFlipDetails(id);
      setShowModal(false);
      handleStartGame();
    } catch (error) {
      console.error("Error flipping coin:", error);
      setBetError("An error occurred while processing your bet");
    } finally {
      setIsLoading(false);
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

  const handleFlip = (choice: "starknet" | "cartridge") => {
    if (isFlipping) return;

    setUserChoice(choice);
    setIsFlipping(true);
    setGameResult(null);
    setCoinSide(null);

    // Use result from blockchain if available, otherwise fall back to random
    const actualResult = currentFlip?.result === 1 ? "starknet" : 
                          currentFlip?.result === 0 ? "cartridge" : 
                          Math.random() > 0.5 ? "starknet" : "cartridge";
    
    setCoinAnimation("animate-toss");

    setTimeout(() => {
      setCoinAnimation("animate-flip");

      setTimeout(() => {
        setCoinAnimation("animate-drop");
        setCoinSide(actualResult);

        setTimeout(() => {
          setCoinAnimation("");
          setResult(actualResult);
          setIsFlipping(false);
          setFlips((prev) => prev + 1);

          const didWin = choice === actualResult;
          const earnedPoints = didWin ? 100 : 0;

          if (didWin) {
            setWins((prev) => prev + 1);
            setGameResult("win");
          } else {
            setGameResult("lose");
          }

          // Update LocalStorage Leaderboard
          addOrUpdatePlayer({
            address: address, // make sure you have this variable from context or state
            gameType: "Coin Flip",
            status: didWin ? "Win" : "Loss",
            earnedPoints,
          });
        }, 500);
      }, 1000);
    }, 500);
  };

  const handleStartGame = () => {
    if (!modalChoice) return;
    setUserChoice(modalChoice);
    handleFlip(modalChoice);
  };

  return (
    <div className="flex flex-col items-center min-h-screen relative">
      {/* Page Header */}
      <PageHeader 
        title="StarkNet vs Cartridge"
        subtitle="Flip the coin and test your luck! Choose between StarkNet and Cartridge to win tokens."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Coin Flip", href: "/coin-flip" }
        ]}
        size="md"
      />
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-80"></div>
        <div className="absolute inset-0 grid-bg-medium opacity-20"></div>
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 filter blur-[150px]"
          animate={{ 
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-blue-600/10 filter blur-[120px]"
          animate={{ 
            x: [0, -40, 30, 0],
            y: [0, 40, -30, 0],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Bet Selection Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="glass-effect-dark max-w-md w-full p-8 rounded-2xl border border-gray-700 shadow-lg"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <h2 className="text-2xl font-bold text-white font-techno mb-6 text-center">Place Your Bet</h2>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4 text-center">Choose your side:</p>
                <div className="flex gap-4 justify-center">
                  {["starknet", "cartridge"].map((opt) => (
                    <motion.button
                      key={opt}
                      onClick={() => setModalChoice(opt as "starknet" | "cartridge")}
                      className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
                        modalChoice === opt
                          ? "ring-4 ring-purple-500 shadow-glow"
                          : "ring-1 ring-gray-700"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
                      <img
                        src={
                          opt === "starknet"
                            ? "/starknet.png"
                            : "/cartridge.png"
                        }
                        alt={opt}
                        className={`w-20 h-20 rounded-full object-contain relative z-10 ${modalChoice === opt ? 'scale-110' : 'scale-100'} transition-transform duration-300`}
                      />
                      <p className={`mt-2 text-sm font-medium ${modalChoice === opt ? 'text-purple-300' : 'text-gray-400'} relative z-10`}>
                        {opt === "starknet" ? "StarkNet" : "Cartridge"}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 text-sm text-center">Enter Bet Amount:</label>
                <input
                  type="number"
                  className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border text-center ${betError ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  value={betAmount}
                  onChange={(e) => {
                    setBetAmount(e.target.value);
                    if (betError) validateBet();
                  }}
                  placeholder="Enter amount"
                />
                {betError && (
                  <p className="text-red-500 text-xs mt-1 text-center">{betError}</p>
                )}
              </div>
              
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleFlipCoin}
                disabled={!modalChoice || !betAmount || isLoading}
                isLoading={isLoading}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                }
              >
                Place Bet & Flip
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Content */}
      <div className="w-full max-w-4xl mx-auto px-6 py-12">
        <div className="glass-effect-dark rounded-2xl p-8 border border-gray-800 shadow-lg mb-8">
          {/* Game Info */}
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            <div className="glass-effect p-4 rounded-xl text-center w-[30%]">
              <p className="text-gray-400 text-sm mb-1">Total Flips</p>
              <p className="text-2xl font-bold text-white font-techno">{flips}</p>
            </div>
            
            <div className="glass-effect p-4 rounded-xl text-center w-[30%]">
              <p className="text-gray-400 text-sm mb-1">Total Wins</p>
              <p className="text-2xl font-bold text-white font-techno">{wins}</p>
            </div>
            
            <div className="glass-effect p-4 rounded-xl text-center w-[30%]">
              <p className="text-gray-400 text-sm mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-white font-techno">
                {flips > 0 ? `${Math.round((wins / flips) * 100)}%` : "0%"}
              </p>
            </div>
          </div>
          
          {/* Current Bet */}
          <div className="mb-8">
            <div className="glass-effect p-6 rounded-xl text-center max-w-sm mx-auto">
              <p className="text-gray-400 text-sm mb-2">Current Bet</p>
              <p className="text-3xl font-bold text-white font-techno bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">{betAmount || "0"}</p>
            </div>
          </div>

          {/* Coin Flip Area */}
          <div className="flex flex-col items-center justify-center py-8">
            {/* Coin */}
            <div className="perspective-500 mb-10">
              <motion.div
                className={`relative w-40 h-40 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg ${coinAnimation}`}
                animate={
                  gameResult === "win" 
                    ? { scale: [1, 1.2, 1], boxShadow: ["0 0 0 rgba(139, 92, 246, 0)", "0 0 30px rgba(139, 92, 246, 0.8)", "0 0 0 rgba(139, 92, 246, 0)"] } 
                    : gameResult === "lose" 
                    ? { scale: [1, 0.8, 1], boxShadow: ["0 0 0 rgba(239, 68, 68, 0)", "0 0 30px rgba(239, 68, 68, 0.8)", "0 0 0 rgba(239, 68, 68, 0)"] }
                    : {}
                }
                transition={{ duration: 1.5 }}
              >
                {coinSide ? (
                  <img
                    src={
                      coinSide === "starknet"
                        ? "/starknet.png"
                        : "/cartridge.png"
                    }
                    alt={coinSide}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="text-3xl font-bold text-white font-techno">?</div>
                )}
              </motion.div>
            </div>

            {/* Game Result */}
            <AnimatePresence mode="wait">
              {gameResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`text-2xl font-bold mb-6 font-techno ${
                    gameResult === "win" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {gameResult === "win" ? "You Won!" : "You Lost!"}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Flip Again Button */}
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowModal(true)}
              disabled={isFlipping}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              }
            >
              Flip Again
            </Button>
          </div>
        </div>
        
        {/* Game Rules */}
        <div className="glass-effect-dark rounded-2xl p-8 border border-gray-800 shadow-lg">
          <h3 className="text-xl font-bold text-white font-techno mb-4">Game Rules</h3>
          <div className="space-y-3 text-gray-300">
            <p className="flex items-start">
              <span className="text-purple-400 mr-2">1.</span>
              Choose your side: StarkNet or Cartridge
            </p>
            <p className="flex items-start">
              <span className="text-purple-400 mr-2">2.</span>
              Enter your bet amount
            </p>
            <p className="flex items-start">
              <span className="text-purple-400 mr-2">3.</span>
              If the coin lands on your chosen side, you win double your bet
            </p>
            <p className="flex items-start">
              <span className="text-purple-400 mr-2">4.</span>
              If the coin lands on the other side, you lose your bet
            </p>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
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
        
        .perspective-500 {
          perspective: 500px;
        }
      `}</style>
    </div>
  );
}
