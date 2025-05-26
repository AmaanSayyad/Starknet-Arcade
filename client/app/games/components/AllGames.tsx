"use client";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import GameCard from '../../components/GameCard';

interface AllGamesProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

// Game data
const GAMES = [
  {
    id: 1,
    title: "Crypto Coin Flip",
    description: "Double your STARK tokens with a flip! Simple, thrilling, and potentially rewarding in seconds.",
    image: "/gameicons/Carp_diem.png",
    link: "/coin-flip",
    category: "casino",
    players: "1 Player",
    isNew: false,
    isHot: true,
    technology: "StarkNet"
  },
  {
    id: 2,
    title: "Rock Paper Scissors",
    description: "The classic game with a blockchain twist! Challenge players worldwide and win STARK tokens.",
    image: "/gameicons/fire_in_the_hole.png",
    link: "/rock-paper-scissor",
    category: "multiplayer",
    players: "2 Players",
    isNew: false,
    isHot: false,
    technology: "StarkNet"
  },
  {
    id: 3,
    title: "Crypto Snakes & Ladders",
    description: "Climb to victory in this blockchain version of the classic board game. Dodge snakes, climb ladders, win big!",
    image: "/gameicons/Carp_diem.png",
    link: "/snake-ladder",
    category: "board",
    players: "2-4 Players",
    isNew: false,
    isHot: true,
    technology: "StarkNet"
  },
  {
    id: 4,
    title: "NFT Memory Match",
    description: "Test your memory by matching crypto-themed cards. Each match earns you $STRK rewards!",
    image: "/gameicons/gates-of-olympus.png",
    link: "/memory-matching",
    category: "puzzle",
    players: "1 Player",
    isNew: true,
    isHot: false,
    technology: "StarkNet"
  },
  {
    id: 5,
    title: "Crypto Mines",
    description: "Navigate a dangerous minefield of crypto tokens. Each safe click increases your potential reward!",
    image: "/gameicons/mines.png",
    link: "/mines",
    category: "casino",
    players: "1 Player",
    isNew: false,
    isHot: false,
    technology: "StarkNet"
  },
  {
    id: 6,
    title: "StarkNet Roulette",
    description: "The classic casino game now on StarkNet! Place your bets and watch the wheel of fortune spin.",
    image: "/gameicons/roulette.png",
    link: "/roulette",
    category: "casino",
    players: "1-8 Players",
    isNew: false,
    isHot: false,
    technology: "StarkNet"
  },
  {
    id: 7,
    title: "Crypto BlackJack",
    description: "The world's favorite card game now on StarkNet. Beat the dealer and win STARK tokens!",
    image: "/gameicons/blackjack.png",
    link: "/blackjack",
    category: "card",
    players: "1-7 Players",
    isNew: true,
    isHot: true,
    technology: "StarkNet"
  },
  {
    id: 8,
    title: "StarkNet Slots",
    description: "Spin the crypto-themed reels and match symbols to win big! The classic slot machine with a blockchain twist.",
    image: "/gameicons/fortune-tiger.png",
    link: "/slots",
    category: "casino",
    players: "1 Player",
    isNew: false,
    isHot: false,
    technology: "StarkNet"
  },
  {
    id: 9,
    title: "Blockchain Chess",
    description: "The ancient game of strategy meets blockchain. Challenge players globally and earn rewards.",
    image: "/gameicons/games.png",
    link: "/chess",
    category: "strategy",
    players: "2 Players",
    isNew: false,
    isHot: false,
    technology: "StarkNet"
  },
  {
    id: 10,
    title: "Crypto Poker",
    description: "Test your poker face in this multiplayer card game. Bluff, bet, and win in this StarkNet poker room!",
    image: "/gameicons/poker.png",
    link: "/poker",
    category: "card",
    players: "2-8 Players",
    isNew: true,
    isHot: false,
    technology: "StarkNet"
  },
  {
    id: 11,
    title: "Blockchain Trivia",
    description: "Test your crypto knowledge and win tokens for correct answers. The ultimate web3 quiz game!",
    image: "/gameicons/fire_portal.png",
    link: "/trivia",
    category: "puzzle",
    players: "1-10 Players",
    isNew: false,
    isHot: false,
    technology: "StarkNet"
  },
  {
    id: 12,
    title: "Crypto Dice",
    description: "Roll the dice and predict the outcome to win. Simple mechanics, exciting rewards, provably fair!",
    image: "/gameicons/dices.png",
    link: "/dice",
    category: "casino",
    players: "1 Player",
    isNew: false,
    isHot: false,
    technology: "StarkNet"
  },
  {
    id: 13,
    title: "StarkNet Baccarat",
    description: "The elegant casino card game now on StarkNet. Bet on Player, Banker, or Tie and win big!",
    image: "/gameicons/sugar_rush.png",
    link: "/baccarat",
    category: "card",
    players: "1-14 Players",
    isNew: true,
    isHot: false,
    technology: "StarkNet"
  },
  {
    id: 14,
    title: "Crypto Crash",
    description: "Watch the multiplier rise and cash out before the crash! The ultimate risk vs. reward game.",
    image: "/gameicons/revenge_of_loki.png",
    link: "/crash",
    category: "casino",
    players: "1+ Players",
    isNew: true,
    isHot: true,
    technology: "StarkNet"
  },
  {
    id: 15,
    title: "NFT Racing",
    description: "Race your NFT vehicles on various tracks. Upgrade your car, challenge others, and win prizes!",
    image: "/gameicons/fire_portal.png",
    link: "/racing",
    category: "arcade",
    players: "1-8 Players",
    isNew: true,
    isHot: false,
    technology: "StarkNet"
  }
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "prize", label: "Highest Prize" },
];

export default function AllGames({ searchQuery, setSearchQuery, activeCategory, setActiveCategory }: AllGamesProps) {
  const [filteredGames, setFilteredGames] = useState(GAMES);
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    singlePlayer: true,
    multiplayer: true,
    freeToPlay: true,
    staking: false,
  });
  
  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };
  
  // Filter games based on search query and active category
  useEffect(() => {
    let result = GAMES;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(game => 
        game.title.toLowerCase().includes(query) || 
        game.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (activeCategory && activeCategory !== 'all') {
      result = result.filter(game => game.category === activeCategory);
    }
    
    setFilteredGames(result);
    // Reset visible count when filters change
    setVisibleCount(8);
  }, [searchQuery, activeCategory]);
  
  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, filteredGames.length));
  };
  
  return (
    <section className="mb-16">
      {/* Game Filters Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-white font-techno">All Games</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="bg-gray-900 border border-gray-700 text-white w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-gray-900 border border-gray-700 text-white pl-4 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-800 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filters
          </button>
        </div>
      </div>
      
      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Game Type</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.singlePlayer}
                    onChange={() => handleFilterChange('singlePlayer')}
                    className="rounded border-gray-700 text-purple-600 focus:ring-purple-600 h-5 w-5"
                  />
                  <span className="ml-3 text-gray-300">Single Player</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.multiplayer}
                    onChange={() => handleFilterChange('multiplayer')}
                    className="rounded border-gray-700 text-purple-600 focus:ring-purple-600 h-5 w-5"
                  />
                  <span className="ml-3 text-gray-300">Multiplayer</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Game Mode</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.freeToPlay}
                    onChange={() => handleFilterChange('freeToPlay')}
                    className="rounded border-gray-700 text-purple-600 focus:ring-purple-600 h-5 w-5"
                  />
                  <span className="ml-3 text-gray-300">Free to Play</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.staking}
                    onChange={() => handleFilterChange('staking')}
                    className="rounded border-gray-700 text-purple-600 focus:ring-purple-600 h-5 w-5"
                  />
                  <span className="ml-3 text-gray-300">Staking Required</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Reward Type</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-full text-sm border border-purple-600/30 transition-colors">
                  STARK Tokens
                </button>
                <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-700 transition-colors">
                  NFT Rewards
                </button>
                <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-700 transition-colors">
                  Achievement Badges
                </button>
                <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-700 transition-colors">
                  Leaderboard Points
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <button 
              onClick={() => {
                setFilters({
                  singlePlayer: true,
                  multiplayer: true,
                  freeToPlay: true,
                  staking: false,
                });
                setSortBy("popular");
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Reset All
            </button>
            <button 
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.slice(0, visibleCount).map((game) => (
              <GameCard
                key={game.id}
                title={game.title}
                description={game.description}
                image={game.image || "/images/games/game-placeholder.svg"}
                link={game.link}
                category={game.category}
                players={game.players}
                isNew={game.isNew}
                isHot={game.isHot}
                technology={game.technology}
              />
            ))}
          </div>
          
          {/* Load More Button */}
          {visibleCount < filteredGames.length && (
            <div className="mt-10 text-center">
              <motion.button
                onClick={loadMore}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors inline-flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Load More Games
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Games Found</h3>
          <p className="text-gray-400 mb-6">
            We couldn't find any games matching your filters. Try adjusting your search criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
              setFilters({
                singlePlayer: true,
                multiplayer: true,
                freeToPlay: true,
                staking: false,
              });
            }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
} 