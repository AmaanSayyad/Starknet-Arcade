"use client";
import { motion } from 'framer-motion';

const COMING_SOON_GAMES = [
  {
    id: 1,
    title: "Crypto Monopoly",
    description: "Buy, sell, and trade blockchain properties in this reimagining of the classic board game.",
    releaseDate: "May 2025",
    image: "/gameicons/sugar_rush.png",
    progress: 85
  },
  {
    id: 2,
    title: "NFT Racing League",
    description: "Race your NFT vehicles on tracks across the metaverse. Upgrade parts to improve performance.",
    releaseDate: "May 2025",
    image: "/gameicons/revenge_of_loki.png",
    progress: 65
  },
  {
    id: 3,
    title: "Crypto Crush Saga",
    description: "Match tokens in this addictive puzzle game. Unlock special powers and earn rewards.",
    releaseDate: "July 2025",
    image: "/gameicons/gates-of-olympus.png",
    progress: 40
  },
];

export default function ComingSoonGames() {
  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-techno">Coming Soon to StarkNet Arcade</h2>
          <p className="text-gray-400">New games in development - Get early access and rewards by registering your interest</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COMING_SOON_GAMES.map((game) => (
          <motion.div
            key={game.id}
            className="bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 relative"
            whileHover={{ scale: 1.02, borderColor: 'rgba(124, 58, 237, 0.5)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            {/* Diagonal "Coming Soon" Ribbon */}
            <div className="absolute top-5 right-0 transform rotate-45 translate-x-10 bg-purple-600 text-white py-1 px-10 text-xs font-bold z-10 shadow-lg">
              COMING SOON
            </div>
            
            <div className="relative h-48 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
              <img 
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20 z-10"></div>
            </div>
            
            <div className="p-5">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                {game.title}
                {game.progress > 75 && (
                  <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">NEARLY READY</span>
                )}
              </h3>
              
              <p className="text-gray-400 text-sm mb-4">
                {game.description}
              </p>
              
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-gray-400">Development Progress:</span>
                <span className={`font-mono ${
                  game.progress < 40 ? 'text-red-400' : 
                  game.progress < 70 ? 'text-yellow-400' : 
                  'text-green-400'
                }`}>{game.progress}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
                <div 
                  className={`h-2.5 rounded-full ${
                    game.progress < 40 ? 'bg-red-600' : 
                    game.progress < 70 ? 'bg-yellow-600' : 
                    'bg-green-600'
                  }`}
                  style={{ width: `${game.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Expected Release:
                </div>
                <div className="text-sm text-white font-medium">
                  {game.releaseDate}
                </div>
              </div>
              
              <div className="mt-4">
                <button className="w-full py-2 bg-gray-800 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Get Early Access
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 