"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/PageHeader";

// Slot symbols and their values
const SYMBOLS = [
  { id: "btc", label: "₿", value: 10, color: "text-amber-500" },
  { id: "eth", label: "Ξ", value: 5, color: "text-blue-500" },
  { id: "stark", label: "S", value: 3, color: "text-purple-500" },
  { id: "doge", label: "Ð", value: 2, color: "text-yellow-400" },
  { id: "xrp", label: "✕", value: 1, color: "text-gray-400" },
];

// Paylines configuration
const PAYLINES = [
  [0, 0, 0], // Top row
  [1, 1, 1], // Middle row
  [2, 2, 2], // Bottom row
  [0, 1, 2], // Diagonal top-left to bottom-right
  [2, 1, 0], // Diagonal bottom-left to top-right
];

export default function SlotsGame() {
  const [reels, setReels] = useState<string[][][]>([
    [['btc'], ['eth'], ['stark']],
    [['eth'], ['stark'], ['doge']],
    [['stark'], ['doge'], ['xrp']],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [wins, setWins] = useState<{ payline: number[]; symbol: string; amount: number }[]>([]);
  const [totalWin, setTotalWin] = useState(0);
  const [autoSpin, setAutoSpin] = useState(false);
  
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up any timers on unmount
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle auto-spin
  useEffect(() => {
    if (autoSpin && !spinning && balance >= bet) {
      const timeout = setTimeout(() => {
        handleSpin();
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [autoSpin, spinning, balance, bet]);
  
  const generateRandomReels = () => {
    const newReels = [[], [], []].map(() => {
      return [0, 1, 2].map(() => {
        const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
        return [SYMBOLS[randomIndex].id];
      });
    });
    
    return newReels as string[][][];
  };
  
  const handleSpin = () => {
    if (spinning || balance < bet) return;
    
    setSpinning(true);
    setWins([]);
    setTotalWin(0);
    setBalance(prev => prev - bet);
    
    // Create a spinning animation by changing symbols rapidly
    const spinDuration = 2000; // 2 seconds
    const framesPerSecond = 10;
    const totalFrames = spinDuration / 1000 * framesPerSecond;
    
    let currentFrame = 0;
    
    const spinInterval = setInterval(() => {
      setReels(generateRandomReels());
      currentFrame++;
      
      if (currentFrame >= totalFrames) {
        clearInterval(spinInterval);
        const finalReels = generateRandomReels();
        setReels(finalReels);
        
        // Check for wins after spinning stops
        spinTimeoutRef.current = setTimeout(() => {
          checkWins(finalReels);
          setSpinning(false);
        }, 300);
      }
    }, 1000 / framesPerSecond);
  };
  
  const checkWins = (finalReels: string[][][]) => {
    const newWins: { payline: number[]; symbol: string; amount: number }[] = [];
    let winTotal = 0;
    
    // Check each payline
    PAYLINES.forEach((payline, index) => {
      const [row1, row2, row3] = payline;
      const symbol1 = finalReels[0][row1][0];
      const symbol2 = finalReels[1][row2][0];
      const symbol3 = finalReels[2][row3][0];
      
      // Win condition: all symbols in a payline match
      if (symbol1 === symbol2 && symbol2 === symbol3) {
        const symbolObj = SYMBOLS.find(s => s.id === symbol1);
        if (symbolObj) {
          const winAmount = symbolObj.value * bet;
          winTotal += winAmount;
          
          newWins.push({
            payline: [row1, row2, row3],
            symbol: symbol1,
            amount: winAmount
          });
        }
      }
    });
    
    if (newWins.length > 0) {
      setWins(newWins);
      setTotalWin(winTotal);
      setBalance(prev => prev + winTotal);
    }
  };
  
  const getSymbolDetails = (symbolId: string) => {
    return SYMBOLS.find(s => s.id === symbolId) || SYMBOLS[0];
  };
  
  const handleBetChange = (amount: number) => {
    if (!spinning) {
      setBet(Math.max(1, Math.min(100, bet + amount)));
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Crypto Slots"
        subtitle="Spin the reels and match crypto symbols to win big!"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Games", href: "/games" },
          { label: "Crypto Slots", href: "/slots" }
        ]}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Game Container */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-8">
          {/* Game Stats */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-gray-400 text-sm">Balance</h3>
              <p className="text-white text-xl font-bold">${balance.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Bet</h3>
              <p className="text-white text-xl font-bold">${bet}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Last Win</h3>
              <p className={`text-xl font-bold ${totalWin > 0 ? "text-green-500" : "text-white"}`}>
                ${totalWin.toFixed(2)}
              </p>
            </div>
          </div>
          
          {/* Slot Machine */}
          <div className="relative mb-8">
            {/* Slot Frame */}
            <div className="bg-gray-800 border-4 border-yellow-500 rounded-lg p-4 shadow-inner shadow-black/50">
              {/* Reels Container */}
              <div className="grid grid-cols-3 gap-2 h-64">
                {reels.map((reel, reelIndex) => (
                  <div 
                    key={reelIndex} 
                    className="bg-gray-900 rounded-md overflow-hidden relative"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {reel.map((symbol, symbolIndex) => (
                        <div 
                          key={`${reelIndex}-${symbolIndex}`} 
                          className="h-1/3 w-full flex items-center justify-center"
                        >
                          <motion.div
                            className={`text-5xl font-bold ${getSymbolDetails(symbol[0]).color}`}
                            animate={{ scale: spinning ? [1, 1.1, 1] : 1 }}
                            transition={{ repeat: spinning ? Infinity : 0, duration: 0.5 }}
                          >
                            {getSymbolDetails(symbol[0]).label}
                          </motion.div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Highlight winning paylines */}
                    {wins.map((win, winIndex) => {
                      if (win.payline[reelIndex] !== undefined) {
                        return (
                          <div 
                            key={`win-${winIndex}-${reelIndex}`}
                            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                          >
                            <div 
                              className="h-1/3 w-full relative"
                              style={{ top: `${win.payline[reelIndex] * 33.33}%` }}
                            >
                              <div className="absolute inset-0 bg-yellow-500/30 animate-pulse"></div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ))}
              </div>
              
              {/* Lever (decoration) */}
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 h-32 w-6">
                <div className="bg-red-600 w-6 h-6 rounded-full"></div>
                <div className="bg-gray-400 w-2 h-28 mx-auto"></div>
              </div>
            </div>
            
            {/* Win Notification */}
            <AnimatePresence>
              {totalWin > 0 && !spinning && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500/80 backdrop-blur-sm text-black font-bold py-4 px-8 rounded-lg text-3xl shadow-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  WIN! ${totalWin.toFixed(2)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBetChange(-1)}
                  disabled={spinning}
                  className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                >
                  -1
                </button>
                <button
                  onClick={() => handleBetChange(-5)}
                  disabled={spinning}
                  className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                >
                  -5
                </button>
                <button
                  onClick={() => handleBetChange(1)}
                  disabled={spinning}
                  className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                >
                  +1
                </button>
                <button
                  onClick={() => handleBetChange(5)}
                  disabled={spinning}
                  className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                >
                  +5
                </button>
              </div>
              
              <button
                onClick={() => setAutoSpin(!autoSpin)}
                disabled={spinning || balance < bet}
                className={`w-full py-3 rounded-lg ${
                  autoSpin 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-gray-800 hover:bg-gray-700"
                } disabled:opacity-50 text-white font-medium`}
              >
                {autoSpin ? "Stop Auto Spin" : "Auto Spin"}
              </button>
            </div>
            
            <button
              onClick={handleSpin}
              disabled={spinning || balance < bet}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold py-6 rounded-lg transition-colors"
            >
              {spinning ? "Spinning..." : "SPIN"}
            </button>
          </div>
        </div>
        
        {/* Paytable */}
        <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Paytable</h3>
          <div className="grid grid-cols-2 gap-4">
            {SYMBOLS.map((symbol) => (
              <div key={symbol.id} className="flex items-center p-3 bg-gray-800 rounded-lg">
                <div className={`text-4xl mr-4 ${symbol.color}`}>{symbol.label}</div>
                <div>
                  <p className="text-white font-medium">{symbol.id.toUpperCase()}</p>
                  <p className="text-gray-400">Pays {symbol.value}x your bet</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="text-lg font-medium text-white mb-2">Paylines</h4>
            <p className="text-gray-300">
              Match 3 identical symbols on any of the 5 paylines to win. Paylines include horizontal rows and diagonals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 