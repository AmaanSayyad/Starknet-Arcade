"use client";
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const TRENDING_GAMES = [
  {
    id: 1,
    title: "Crypto Coin Flip",
    image: "/gameicons/crash.png",
    playCount: "2.5K",
    playerGain: "+12%",
    url: "/coin-flip",
    category: "Casino",
    isHot: true
  },
  {
    id: 2,
    title: "Crypto Snakes & Ladders",
    image: "/gameicons/Carp_diem.png",
    playCount: "1.8K",
    playerGain: "+8%",
    url: "/snake-ladder",
    category: "Board",
    isHot: false
  },
  {
    id: 3,
    title: "NFT Memory Match",
    image: "/gameicons/gates-of-olympus.png",
    playCount: "1.2K",
    playerGain: "+15%",
    url: "/memory-matching",
    category: "Puzzle",
    isHot: true
  },
  {
    id: 4,
    title: "Rock Paper Scissors",
    image: "/gameicons/fire_in_the_hole.png",
    playCount: "980",
    playerGain: "+5%",
    url: "/rock-paper-scissor",
    category: "Casual",
    isHot: false
  },
  {
    id: 5,
    title: "Crypto Mines",
    image: "/gameicons/mines.png",
    playCount: "750",
    playerGain: "+20%",
    url: "/mines",
    category: "Strategy",
    isHot: true
  },
  {
    id: 6,
    title: "StarkNet Roulette",
    image: "/gameicons/roulette.png",
    playCount: "620",
    playerGain: "+7%",
    url: "/roulette",
    category: "Casino",
    isHot: false
  },
  {
    id: 7,
    title: "Crypto Crash",
    image: "/gameicons/revenge_of_loki.png",
    playCount: "950",
    playerGain: "+25%",
    url: "/crash",
    category: "Casino",
    isHot: true
  }
];

export default function TrendingGames() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-techno">Trending Now 🔥</h2>
          <p className="text-gray-400">The most played games this week</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleScrollLeft}
            className="p-2 rounded-full border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={handleScrollRight}
            className="p-2 rounded-full border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
      >
        {TRENDING_GAMES.map((game) => (
          <motion.div
            key={game.id}
            className="flex-shrink-0 w-64 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600/50 transition-all"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <Link href={game.url}>
              <div className="relative h-36">
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"
                  style={{
                    backgroundImage: `url(${game.image || "/public/images/games/game-placeholder.svg"})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
                
                {/* Category Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-xs text-white">
                  {game.category}
                </div>
                
                {/* Hot Badge */}
                {game.isHot && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-500/80 backdrop-blur-sm rounded-md text-xs text-white flex items-center">
                    <span className="animate-pulse mr-1">🔥</span>
                    HOT
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2">{game.title}</h3>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {game.playCount} plays
                  </div>
                  
                  <div className="text-sm text-green-400 font-medium">
                    {game.playerGain}
                  </div>
                </div>
                
                <div className="mt-4">
                  <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Play Now
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 