"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

interface GameFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "prize", label: "Highest Prize" },
];

export default function GameFilters({ 
  searchQuery, 
  setSearchQuery, 
  activeCategory,
  setActiveCategory
}: GameFiltersProps) {
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
  
  return (
    <section className="mb-10">
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
    </section>
  );
} 