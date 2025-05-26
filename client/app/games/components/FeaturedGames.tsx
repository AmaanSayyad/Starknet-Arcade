"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';

const FEATURED_GAMES = [
  {
    id: 1,
    title: "Coin Flip",
    description: "Flip a coin and double your STARK in this simple yet thrilling game of chance! Play instantly with minimal gas fees.",
    image: "/images/games/coin-flip.jpg",
    url: "/coin-flip",
    ctaText: "Play Now",
    highlight: "2× Rewards!"
  },
  {
    id: 2,
    title: "Snakes & Ladders",
    description: "The classic board game reimagined on Starknet! Roll the dice, avoid the snakes, and climb to victory.",
    image: "/images/games/snake-ladder.jpg",
    url: "/snake-ladder",
    ctaText: "Play Now",
    highlight: "Tournament Live!"
  },
  {
    id: 3,
    title: "Rock Paper Scissors",
    description: "Challenge players worldwide in this blockchain version of the timeless game. Smart contracts ensure fair play.",
    image: "/images/games/rock-paper-scissor.jpg",
    url: "/rock-paper-scissor",
    ctaText: "Challenge Now",
    highlight: "PvP Battles"
  }
];

export default function FeaturedGames() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-rotate slides
  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    
    resetTimeout();
    
    timeoutRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev === FEATURED_GAMES.length - 1 ? 0 : prev + 1));
    }, 6000);
    
    return () => {
      resetTimeout();
    };
  }, [currentSlide]);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === FEATURED_GAMES.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? FEATURED_GAMES.length - 1 : prev - 1));
  };
  
  return (
    <section className="py-10 mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white font-techno">Featured Games</h2>
        <div className="flex space-x-2">
          <button 
            onClick={prevSlide}
            className="p-2 rounded-full border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="p-2 rounded-full border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="relative overflow-hidden rounded-3xl bg-gray-900 shadow-2xl h-[500px]">
        {/* Slides */}
        <div className="absolute inset-0">
          {FEATURED_GAMES.map((game, index) => (
            <motion.div
              key={game.id}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: currentSlide === index ? 1 : 0,
                zIndex: currentSlide === index ? 10 : 0
              }}
              transition={{ duration: 0.7 }}
            >
              {/* Background Image with Gradient Overlay */}
              <div className="absolute inset-0">
                {/* Fallback image if the specified one doesn't exist */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-900/70 via-blue-900/60 to-transparent z-10"
                  style={{
                    backgroundImage: `url(${game.image || "/public/images/games/game-placeholder.svg"})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-20"></div>
              </div>
              
              {/* Content */}
              <div className="relative h-full z-30 flex flex-col justify-center px-12 lg:px-20">
                <div className="max-w-xl">
                  {/* Highlight Badge */}
                  {game.highlight && (
                    <motion.span 
                      className="inline-block px-4 py-1 rounded-full bg-purple-600/80 text-white text-sm font-medium mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      {game.highlight}
                    </motion.span>
                  )}
                  
                  <motion.h3 
                    className="text-4xl md:text-5xl font-bold font-techno text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {game.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-lg text-gray-300 mb-8 max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {game.description}
                  </motion.p>
                  
                  <motion.div
                    className="flex space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Link href={game.url}>
                      <Button variant="primary" size="lg">
                        {game.ctaText}
                      </Button>
                    </Link>
                    <Link href={`/games?game=${game.id}`}>
                      <Button variant="outline" size="lg">
                        Learn More
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-40">
          {FEATURED_GAMES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white w-8' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 