"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  category: string;
  players?: string;
  isNew?: boolean;
  isHot?: boolean;
  technology?: string;
  logoIcon?: string;
}

export default function GameCard({ 
  title, 
  description, 
  image, 
  link, 
  category, 
  players = "1 Player", 
  isNew = false, 
  isHot = false,
  technology = "StarkNet",
  logoIcon
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={link}>
        <motion.div 
          className="overflow-hidden rounded-2xl bg-gray-900/40 backdrop-blur-lg border border-purple-500/20 shadow-lg shadow-purple-500/10 transition-all duration-300 h-full"
          whileHover={{ 
            scale: 1.03, 
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)"
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Image section */}
          <div className="relative h-48 overflow-hidden">
            <motion.img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-80"></div>
            
            {/* Game logo icon (if provided) */}
            {logoIcon && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <motion.img 
                  src={logoIcon} 
                  alt={`${title} logo`} 
                  className="w-16 h-16 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                  initial={{ opacity: 0.8, scale: 0.9 }}
                  animate={{ 
                    opacity: isHovered ? 1 : 0.8,
                    scale: isHovered ? 1.1 : 1,
                    y: isHovered ? -5 : 0
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
            
            {/* Category badge */}
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white border border-purple-500/30 shadow-sm shadow-purple-500/20">
              {category}
            </div>
            
            {/* Technology badge */}
            <div className="absolute top-3 right-3 bg-purple-900/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-purple-200 border border-purple-700/50 flex items-center shadow-sm shadow-purple-500/20">
              <span className="w-2 h-2 rounded-full bg-purple-400 mr-1.5 animate-pulse"></span>
              {technology}
            </div>
            
            {/* New badge */}
            {isNew && (
              <motion.div 
                className="absolute bottom-3 left-3 bg-green-900/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-green-200 border border-green-700/50 shadow-sm shadow-green-500/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                NEW
              </motion.div>
            )}
            
            {/* Hot badge */}
            {isHot && (
              <motion.div 
                className="absolute bottom-3 right-3 bg-red-900/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-red-200 border border-red-700/50 flex items-center shadow-sm shadow-red-500/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span className="w-2 h-2 rounded-full bg-red-400 mr-1.5 animate-pulse"></span>
                HOT
              </motion.div>
            )}
          </div>
          
          {/* Content section */}
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 font-techno">{title}</h3>
              <div className="text-xs text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {players}
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
            
            {/* Play button */}
            <motion.div 
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all border border-purple-700/30 shadow-md"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 15px rgba(139,92,246,0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Play Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.div>
          </div>
          
          {/* Animated particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {/* Particle 1 */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-purple-500/50"
              animate={{ 
                x: [0, 30, -20, 0],
                y: [0, -30, 20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
            {/* Particle 2 */}
            <motion.div
              className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-blue-500/50"
              animate={{ 
                x: [0, -40, 30, 0],
                y: [0, 40, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 7,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
            {/* Particle 3 */}
            <motion.div
              className="absolute top-1/2 right-1/4 w-1.5 h-1.5 rounded-full bg-pink-500/50"
              animate={{ 
                x: [0, 20, -30, 0],
                y: [0, -20, 10, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
            {/* Glow effect when hovered */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 rounded-2xl"
              animate={{ 
                background: isHovered 
                  ? 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.05), rgba(59, 130, 246, 0.05))'
                  : 'linear-gradient(to bottom right, rgba(168, 85, 247, 0), rgba(59, 130, 246, 0))'
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
} 