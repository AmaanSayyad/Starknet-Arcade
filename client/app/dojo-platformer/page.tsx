"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/Button";
import ControllerConnector from "@cartridge/connector/controller";
import { useConnect } from "@starknet-react/core";

// Mock Dojo world configuration
const DOJO_WORLD_ADDRESS = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

export default function DojoPlatformerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [character, setCharacter] = useState({ x: 50, y: 300 });
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const { connect, disconnect, connectors } = useConnect();
  
  // Connect to Cartridge Controller
  useEffect(() => {
    const initController = async () => {
      try {
        const controller = new ControllerConnector({
          url: "https://api.cartridge.gg/x/starknet/sepolia"
        });
        
        await controller.init({
          rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
          worldAddress: DOJO_WORLD_ADDRESS
        });
        
        setIsConnected(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize controller:", error);
        setIsLoading(false);
      }
    };
    
    initController();
  }, []);
  
  // Handle movement
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!gameStarted) return;
    
    switch (e.key) {
      case "ArrowLeft":
        setCharacter(prev => ({ ...prev, x: Math.max(0, prev.x - 10) }));
        break;
      case "ArrowRight":
        setCharacter(prev => ({ ...prev, x: Math.min(window.innerWidth - 50, prev.x + 10) }));
        break;
      case "ArrowUp":
      case " ":
        // Simple jump mechanic
        if (character.y === 300) { // Only jump if on the ground
          const jump = async () => {
            setCharacter(prev => ({ ...prev, y: 200 }));
            // Record score on-chain
            setScore(prev => prev + 10);
            
            // After jump, return to ground
            setTimeout(() => {
              setCharacter(prev => ({ ...prev, y: 300 }));
            }, 500);
          };
          
          jump();
        }
        break;
    }
  };
  
  // Start game and add event listeners
  const startGame = () => {
    setGameStarted(true);
    window.addEventListener("keydown", handleKeyDown);
  };
  
  // Cleanup
  useEffect(() => {
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted, character.y]);
  
  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 to-gray-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/gameicons/noise.png')] opacity-5"></div>
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
        
        {/* Add some animated stars */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i} 
            className="star absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Page Header */}
      <PageHeader 
        title="Dojo Platformer"
        subtitle="Jump and run in this fully on-chain platformer built with Dojo Engine"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Games", href: "/games" },
          { label: "Dojo Platformer", href: "/dojo-platformer" }
        ]}
        size="sm"
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-96 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent"></div>
            <p className="text-gray-300 animate-pulse">Connecting to Dojo Engine...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/30 backdrop-blur-md rounded-xl overflow-hidden border border-purple-500/20 shadow-xl shadow-purple-900/20"
          >
            <div className="p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Dojo Platformer</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 text-xs font-medium">Powered by</span>
                        <span className="px-2 py-0.5 bg-purple-900/50 rounded-full text-purple-300 text-xs font-medium">Dojo Engine</span>
                        <span className="px-2 py-0.5 bg-blue-900/50 rounded-full text-blue-300 text-xs font-medium">Cartridge Controller</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {!isConnected ? (
                    <Button 
                      variant="primary" 
                      onClick={() => connect({ connector: connectors[0] })}
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>}
                    >
                      Connect Wallet
                    </Button>
                  ) : !gameStarted ? (
                    <Button 
                      variant="primary" 
                      onClick={startGame}
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>}
                    >
                      Start Game
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setGameStarted(false);
                        setScore(0);
                        setCharacter({ x: 50, y: 300 });
                      }}
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>}
                    >
                      Reset Game
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Game Canvas */}
              <div className="relative bg-gradient-to-b from-gray-900 to-purple-900/30 w-full h-96 rounded-lg overflow-hidden border border-purple-500/20 shadow-lg shadow-purple-500/10">
                {/* Sky with stars */}
                <div className="absolute inset-0">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-1 h-1 bg-white rounded-full" 
                      style={{
                        top: `${Math.random() * 70}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.7 + 0.3,
                        animation: `twinkle ${Math.random() * 5 + 3}s infinite ease-in-out`
                      }}
                    />
                  ))}
                </div>

                {/* Hills in background */}
                <div className="absolute bottom-0 left-0 right-0 h-32">
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-purple-900/30 rounded-t-full" style={{ borderRadius: "100% 100% 0 0" }}></div>
                  <div className="absolute bottom-0 left-20 right-20 h-24 bg-purple-800/30 rounded-t-full" style={{ borderRadius: "100% 100% 0 0" }}></div>
                </div>

                {/* Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-purple-900/60 to-gray-800/60 backdrop-blur-sm"></div>
                
                {/* Platforms */}
                <div className="absolute left-[150px] bottom-[100px] w-[100px] h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded"></div>
                <div className="absolute left-[350px] bottom-[140px] w-[120px] h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded"></div>
                <div className="absolute right-[150px] bottom-[120px] w-[100px] h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded"></div>
                
                {/* Collectibles */}
                <div className="absolute left-[190px] bottom-[120px] w-5 h-5 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute left-[400px] bottom-[160px] w-5 h-5 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute right-[180px] bottom-[140px] w-5 h-5 bg-yellow-400 rounded-full animate-pulse"></div>
                
                {/* Character */}
                {gameStarted && (
                  <motion.div
                    className="absolute"
                    style={{ 
                      left: character.x, 
                      top: character.y,
                      transition: "top 0.5s ease-out" 
                    }}
                  >
                    {/* Character body */}
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full shadow-lg shadow-purple-500/50"></div>
                      <div className="absolute bottom-2 left-2 right-2 top-5 bg-gradient-to-b from-purple-400 to-purple-600 rounded-t-full"></div>
                      {/* Eyes */}
                      <div className="absolute top-3 left-2 w-2 h-2 bg-white rounded-full"></div>
                      <div className="absolute top-3 right-2 w-2 h-2 bg-white rounded-full"></div>
                      {/* Jump effect */}
                      <div className={`absolute -bottom-1 left-0 right-0 h-1 bg-purple-300 rounded-full ${character.y < 300 ? 'opacity-0' : 'opacity-70'}`}></div>
                    </div>
                  </motion.div>
                )}
                
                {/* Score display */}
                {gameStarted && (
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30">
                    <div className="text-xl font-bold text-white flex items-center">
                      <span className="text-purple-400 mr-2">Score:</span> {score}
                    </div>
                  </div>
                )}
                
                {/* Game instructions */}
                {!gameStarted && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 backdrop-blur-sm bg-black/40">
                    <div className="bg-gradient-to-r from-purple-900/90 to-blue-900/90 p-8 rounded-xl border border-purple-500/30 shadow-lg max-w-xl">
                      <div className="mb-2 inline-flex px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm font-medium">
                        Powered by Dojo Engine
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Dojo Platformer</h3>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        Use the arrow keys to move and space to jump. Every jump earns points that are recorded on-chain using Dojo Engine. Collect coins to increase your score!
                      </p>
                      <div className="flex justify-center gap-4 flex-wrap">
                        {isConnected ? (
                          <Button 
                            variant="primary" 
                            size="lg" 
                            onClick={startGame}
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                          >
                            Start Game
                          </Button>
                        ) : (
                          <Button 
                            variant="primary" 
                            size="lg" 
                            onClick={() => connect({ connector: connectors[0] })}
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>}
                          >
                            Connect Wallet to Play
                          </Button>
                        )}
                      </div>
                      
                      {/* Controls hint */}
                      <div className="mt-6 flex justify-center gap-4">
                        <div className="flex gap-1">
                          <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white">←</div>
                          <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white">→</div>
                        </div>
                        <div className="w-20 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-xs">SPACE</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Game Details */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Game Details
                  </h3>
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    This game is built using Dojo Engine and Cartridge Controller, providing a fully on-chain gaming experience on Starknet.
                    Player movements, scores, and achievements are all recorded on-chain, ensuring complete transparency and fairness.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-3 py-2 bg-purple-900/50 text-purple-300 text-xs font-medium rounded-lg border border-purple-500/30 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Dojo Engine
                    </div>
                    <div className="px-3 py-2 bg-blue-900/50 text-blue-300 text-xs font-medium rounded-lg border border-blue-500/30 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Cartridge Controller
                    </div>
                    <div className="px-3 py-2 bg-green-900/50 text-green-300 text-xs font-medium rounded-lg border border-green-500/30 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      On-chain
                    </div>
                    <div className="px-3 py-2 bg-red-900/50 text-red-300 text-xs font-medium rounded-lg border border-red-500/30 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                      Platformer
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                    How it Works
                  </h3>
                  <ul className="text-gray-300 text-sm space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-purple-400 text-xs font-bold">1</span>
                      </div>
                      <div>
                        <span className="font-medium text-white">Player actions are sent to Starknet</span> using Cartridge Controller, providing a seamless gaming experience with zero gas fees.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-purple-400 text-xs font-bold">2</span>
                      </div>
                      <div>
                        <span className="font-medium text-white">Dojo Engine processes the game state</span> and updates it on-chain using a fully verifiable system that ensures transparency.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-purple-400 text-xs font-bold">3</span>
                      </div>
                      <div>
                        <span className="font-medium text-white">Scores and achievements are permanently recorded</span> on Starknet, providing a verifiable gaming history that can't be altered.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-purple-400 text-xs font-bold">4</span>
                      </div>
                      <div>
                        <span className="font-medium text-white">Players can earn tokens and NFTs</span> based on their performance, creating true ownership of in-game assets and rewards.
                      </div>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 