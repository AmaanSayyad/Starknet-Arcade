"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import GameCards from "./GameCard";

const statsItems = [
  { label: "Players", value: 100, prefix: "", suffix: "+" },
  { label: "Games Played", value: 5, prefix: "", suffix: "+" },
  { label: "STRK Won", value: 1500, prefix: "", suffix: "+" },
];

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const calculateTransform = (factor: number) => {
    const moveX = (mousePosition.x / window.innerWidth - 0.5) * factor;
    const moveY = (mousePosition.y / window.innerHeight - 0.5) * factor;
    return { x: moveX, y: moveY };
  };

  // Animate count for stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => {
        if (prevCount < 100) {
          return prevCount + 1;
        }
        clearInterval(interval);
        return 100;
      });
    }, 20);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2 }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500 filter blur-[80px]"
          style={{ transform: `translate(${calculateTransform(15).x}px, ${calculateTransform(15).y}px)` }}
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500 filter blur-[100px]"
          style={{ transform: `translate(${calculateTransform(-20).x}px, ${calculateTransform(-20).y}px)` }}
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2, delay: 0.6 }}
          className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full bg-pink-500 filter blur-[90px]"
          style={{ transform: `translate(${calculateTransform(25).x}px, ${calculateTransform(25).y}px)` }}
            />
          </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full absolute">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/5 h-px w-full"
              style={{ top: `${i * 5}%` }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: i * 0.05 }}
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/5 w-px h-full"
              style={{ left: `${i * 5}%` }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1, delay: i * 0.05 }}
            />
          ))}
        </div>
      </div>

      {/* Floating game items */}
      <motion.div 
        className="absolute top-20 left-[10%] z-10"
        initial={{ y: -20, rotate: 12, opacity: 0 }}
        animate={{ y: 0, rotate: 15, opacity: 1 }}
        transition={{ 
          opacity: { duration: 0.8, delay: 0.5 },
          y: { repeat: Infinity, repeatType: "reverse", duration: 2 },
          rotate: { repeat: Infinity, repeatType: "reverse", duration: 3 }
        }}
      >
        <img src="/icons/gun.svg" alt="weapon" className="w-16 h-16 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
      </motion.div>
      
      <motion.div 
        className="absolute top-1/3 right-[15%] z-10"
        initial={{ y: 0, rotate: -12, opacity: 0 }}
        animate={{ y: -15, rotate: -18, opacity: 1 }}
        transition={{ 
          opacity: { duration: 0.8, delay: 0.7 },
          y: { repeat: Infinity, repeatType: "reverse", duration: 2.5 },
          rotate: { repeat: Infinity, repeatType: "reverse", duration: 3.5 }
        }}
      >
        <img src="/icons/gun.svg" alt="grenade" className="w-12 h-12 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-1/4 left-[20%] z-10"
        initial={{ y: 10, rotate: -45, opacity: 0 }}
        animate={{ y: -10, rotate: -35, opacity: 1 }}
        transition={{ 
          opacity: { duration: 0.8, delay: 0.9 },
          y: { repeat: Infinity, repeatType: "reverse", duration: 3 },
          rotate: { repeat: Infinity, repeatType: "reverse", duration: 4 }
        }}
      >
        <img src="/icons/gun.svg" alt="weapon" className="w-14 h-14 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-6 max-w-7xl mx-auto mt-12 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center mb-4"
        >
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold my-4 font-techno bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
        >
          Starknet Arcade
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
        >
          100% fair, fully on-chain, gasless, and transparent arcade - powered by StarkNet VRF, Cartridge Controllers and Session Keys.
        </motion.p>

        {/* Stats counter row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto"
        >
          <motion.div 
            className="glass-effect-dark overflow-hidden relative rounded-md border border-purple-500/20 shadow-sm hover:shadow-purple-500/20 transition-all"
            whileHover={{ y: -2, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-purple-600/20 filter blur-md"></div>
            <div className="p-3 relative z-10 flex flex-col items-center justify-center">
              <div className="text-xl md:text-3xl font-bold text-white font-mono bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                {Math.floor((count / 100) * statsItems[0].value)}{statsItems[0].suffix}
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-3 h-3 rounded-full bg-purple-500/30 flex items-center justify-center">
                  <svg className="w-2 h-2 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-xs text-gray-400">{statsItems[0].label}</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="glass-effect-dark overflow-hidden relative rounded-md border border-blue-500/20 shadow-sm hover:shadow-blue-500/20 transition-all"
            whileHover={{ y: -2, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-600/20 filter blur-md"></div>
            <div className="p-3 relative z-10 flex flex-col items-center justify-center">
              <div className="text-xl md:text-3xl font-bold text-white font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
                {Math.floor((count / 100) * statsItems[1].value)}{statsItems[1].suffix}
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-3 h-3 rounded-full bg-blue-500/30 flex items-center justify-center">
                  <svg className="w-2 h-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div className="text-xs text-gray-400">{statsItems[1].label}</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="glass-effect-dark overflow-hidden relative rounded-md border border-yellow-500/20 shadow-sm hover:shadow-yellow-500/20 transition-all"
            whileHover={{ y: -2, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-yellow-600/20 filter blur-md"></div>
            <div className="p-3 relative z-10 flex flex-col items-center justify-center">
              <div className="text-xl md:text-3xl font-bold text-white font-mono bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">
                {Math.floor((count / 100) * statsItems[2].value)}{statsItems[2].suffix}
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500/30 flex items-center justify-center">
                  <svg className="w-2 h-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-xs text-gray-400">{statsItems[2].label}</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
         
          
          <Link href="/games">
            <motion.button 
              className="bg-transparent border-2 border-purple-500 hover:bg-purple-500/10 text-white font-bold py-3 px-8 rounded-full transform transition-all duration-300 hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Games
            </motion.button>
          </Link>
          
        </motion.div>

        {/* Live indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center mb-6 space-x-2"
        >
          <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-sm rounded-full px-4 py-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-gray-300">
              <span className="text-green-400 font-semibold">5</span> players online
            </span>
          </div>
          <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-sm rounded-full px-4 py-1">
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-xs text-gray-300">
              <span className="text-purple-400 font-semibold">1.2K</span> STARK won today
            </span>
          </div>
        </motion.div>
      </div>

      {/* Game Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="w-full"
      >
        <GameCards />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 1.2,
          y: { repeat: Infinity, repeatType: "reverse", duration: 1.5 }
        }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/70"
      >
        
      </motion.div>
    </section>
  );
};

export default Hero;
