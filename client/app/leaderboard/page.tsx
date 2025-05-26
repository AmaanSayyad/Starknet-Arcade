"use client";
import { useEffect, useState } from "react";
import { getLeaderboard, setLeaderboard, shortenAddress } from "../utils";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/Button";
import { useAccount } from "@starknet-react/core";

// Achievement badges data
const achievementBadges = {
  streak: {
    icon: "🔥",
    name: "Hot Streak",
    description: "Win 5 games in a row",
  },
  master: {
    icon: "🎮",
    name: "Game Master",
    description: "Reach 1000 XP in a single game type",
  },
  early: {
    icon: "🌟",
    name: "Early Adopter",
    description: "Among the first 100 players",
  },
  highscore: {
    icon: "🏆",
    name: "High Scorer",
    description: "Top 3 on the leaderboard",
  },
  social: {
    icon: "🤝",
    name: "Social Butterfly",
    description: "Refer 5 friends to the platform",
  },
};

export default function LeaderboardPage() {
  const { address, isConnected } = useAccount();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("all-time");
  const [sortBy, setSortBy] = useState("totalXP");
  const [personalStats, setPersonalStats] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // On initial load: set default data if localStorage is empty
    const existing = getLeaderboard();
    if (existing.length === 0) {
      const defaultData = [
        {
          address:
            "0x071c77157a819b7e02204ef928d1fb0c896d2c18bac9488db8bc6e54a5ab51cc",
          totalXP: 1450,
          gameType: "Coin Flip",
          status: "Win",
          earnedPoints: 130,
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
          winStreak: 3,
          achievements: ["streak", "early"],
        },
        {
          address:
            "0x0393119d6e999a247dcbcf5d30627d4f4a908e034b7a75632c67abd4451022ea",
          totalXP: 1380,
          gameType: "Snake & Ladder",
          status: "Loss",
          earnedPoints: 75,
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
          winStreak: 0,
          achievements: ["master", "social"],
        },
        {
          address:
            "0x0199817e04cac5d66e13dacd5c2a8b65fe0c53c6f8dcabb66ad463be9a35b11c",
          totalXP: 1250,
          gameType: "Rock Paper Scissor",
          status: "Win",
          earnedPoints: 100,
          timestamp: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
          winStreak: 2,
          achievements: ["early"],
        },
        {
          address:
            "0x0793feb8c8e0557bbbf6370c0e316091bd9553da5c05de854d78d22859b88454",
          totalXP: 1130,
          gameType: "Coin Flip",
          status: "Loss",
          earnedPoints: 60,
          timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
          winStreak: 0,
          achievements: [],
        },
        {
          address:
            "0x02584d564c97eccdb04ae7cb0881c28f246b4c81e6ccd40fe2cd8716796e8a2b",
          totalXP: 990,
          gameType: "Snake & Ladder",
          status: "Win",
          earnedPoints: 110,
          timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
          winStreak: 1,
          achievements: [],
        },
      ];
      setLeaderboard(defaultData);
      setLeaderboardData(defaultData);
      setFilteredData(defaultData);
    } else {
      setLeaderboardData(existing);
      setFilteredData(existing);
    }
  }, []);

  // Set personal stats when connected
  useEffect(() => {
    if (isConnected && address) {
      const playerData = leaderboardData.find(
        (player) => player.address.toLowerCase() === address.toLowerCase()
      );
      
      if (playerData) {
        // Player exists in leaderboard
        setPersonalStats(playerData);
      } else {
        // Player not in leaderboard, create placeholder
        setPersonalStats({
          address: address,
          totalXP: 0,
          gameType: "None",
          status: "N/A",
          winStreak: 0,
          achievements: [],
        });
      }
    } else {
      setPersonalStats(null);
    }
  }, [isConnected, address, leaderboardData]);

  // Apply filters when filter state changes
  useEffect(() => {
    let filtered = [...leaderboardData];
    
    // Filter by game type tab
    if (activeTab !== "all") {
      filtered = filtered.filter(player => player.gameType === activeTab);
    }
    
    // Filter by game type (secondary filter)
    if (activeFilter !== "all") {
      filtered = filtered.filter(player => player.gameType === activeFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(player => 
        player.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by timeframe
    if (timeframe !== "all-time") {
      const now = Date.now();
      let timeLimit;
      
      switch(timeframe) {
        case "today":
          timeLimit = now - 1000 * 60 * 60 * 24; // 24 hours
          break;
        case "week":
          timeLimit = now - 1000 * 60 * 60 * 24 * 7; // 7 days
          break;
        case "month":
          timeLimit = now - 1000 * 60 * 60 * 24 * 30; // 30 days
          break;
      }
      
      filtered = filtered.filter(player => player.timestamp >= timeLimit);
    }
    
    // Sort the data
    switch(sortBy) {
      case "totalXP":
        filtered.sort((a, b) => b.totalXP - a.totalXP);
        break;
      case "recent":
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case "winStreak":
        filtered.sort((a, b) => b.winStreak - a.winStreak);
        break;
    }
    
    setFilteredData(filtered);
  }, [activeFilter, searchQuery, timeframe, leaderboardData, sortBy, activeTab]);

  // Function to calculate player rank
  const getPlayerRank = (playerAddress) => {
    const sortedPlayers = [...leaderboardData].sort((a, b) => b.totalXP - a.totalXP);
    const index = sortedPlayers.findIndex(player => player.address === playerAddress);
    return index !== -1 ? index + 1 : "N/A";
  };

  return (
    <div className="min-h-screen">
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

      <PageHeader 
        title="Leaderboard"
        subtitle="Track the top players across all Starknet Arcade games and compete for the highest ranks."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Leaderboard", href: "/leaderboard" }
        ]}
        size="md"
      />

      <section className="py-8 px-6 w-full max-w-6xl mx-auto">
        {/* Personal Stats (when connected) */}
        {isConnected && personalStats && (
          <motion.div 
            className="glass-effect-dark rounded-xl p-6 border border-purple-500/30 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="bg-purple-500/20 p-2 rounded-lg mr-3">👤</span>
              Your Stats
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="glass-effect p-4 rounded-lg text-center">
                <p className="text-xs text-gray-400 mb-1">Your Rank</p>
                <p className="text-2xl font-bold text-white">#{getPlayerRank(address)}</p>
              </div>
              
              <div className="glass-effect p-4 rounded-lg text-center">
                <p className="text-xs text-gray-400 mb-1">Total XP</p>
                <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  {personalStats.totalXP}
                </p>
              </div>
              
              <div className="glass-effect p-4 rounded-lg text-center">
                <p className="text-xs text-gray-400 mb-1">Favorite Game</p>
                <p className="text-lg font-medium text-white">{personalStats.gameType}</p>
              </div>
              
              <div className="glass-effect p-4 rounded-lg text-center">
                <p className="text-xs text-gray-400 mb-1">Win Streak</p>
                <p className="text-2xl font-bold text-yellow-400">{personalStats.winStreak}🔥</p>
              </div>
              
              <div className="glass-effect p-4 rounded-lg text-center">
                <p className="text-xs text-gray-400 mb-1">Achievements</p>
                <div className="flex justify-center gap-1 mt-1">
                  {personalStats.achievements && personalStats.achievements.length > 0 ? (
                    personalStats.achievements.map((badge, idx) => (
                      <div 
                        key={idx} 
                        className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center"
                        title={achievementBadges[badge]?.name}
                      >
                        <span className="text-sm">{achievementBadges[badge]?.icon}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">None yet</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top Players Summary */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Top Players</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredData.slice(0, 3).map((player, idx) => (
              <motion.div 
                key={player.address}
                className="glass-effect-dark rounded-xl p-5 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.3)' }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`text-4xl ${
                    idx === 0 ? "text-yellow-400" : 
                    idx === 1 ? "text-gray-300" : 
                    "text-amber-600"
                  }`}>
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Wallet</p>
                    <div className="flex items-center">
                      <p className="text-white font-medium">{shortenAddress(player.address)}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(player.address);
                          toast.success("Address Copied");
                        }}
                        className="ml-2 text-blue-400 hover:text-blue-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-400">Favorite Game</p>
                    <p className="text-white">{player.gameType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total XP</p>
                    <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">{player.totalXP}</p>
                  </div>
                </div>
                {/* Achievement badges */}
                {player.achievements && player.achievements.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex gap-1">
                      {player.achievements.map((badge, idx) => (
                        <div 
                          key={idx}
                          className="group relative"
                        >
                          <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                            <span className="text-sm">{achievementBadges[badge]?.icon}</span>
                          </div>
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {achievementBadges[badge]?.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tournament Integration */}
        <div className="mb-8">
          <motion.div 
            className="glass-effect-dark rounded-xl border border-yellow-500/20 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-600/30 px-6 py-4 border-b border-yellow-500/30">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏆</span>
                <h3 className="text-xl font-bold text-white">Upcoming Tournament</h3>
                <div className="ml-auto px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-300 text-xs font-medium">
                  Starts in 3 days
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-2">StarkNet Masters Cup</h4>
                  <p className="text-gray-300 mb-4">
                    Compete against the best players in an elimination tournament with a prize pool of 5000 STRK tokens.
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <span className="text-gray-400 mr-2">Qualification:</span>
                      {getPlayerRank(address) <= 100 ? (
                        <span className="text-green-400 font-medium">Qualified ✓</span>
                      ) : (
                        <span className="text-yellow-400 font-medium">Need top 100 rank</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">Entry Fee:</span>
                      <span className="text-white font-medium">50 STRK</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary"
                    size="md"
                    disabled={!isConnected || getPlayerRank(address) > 100}
                  >
                    Register Now
                  </Button>
                </div>
                
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-gray-300 mb-3">Top Registered Players</h5>
                  <div className="space-y-2">
                    {leaderboardData.slice(0, 3).map((player, idx) => (
                      <div key={idx} className="flex items-center bg-black/30 rounded-lg p-2">
                        <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs mr-2">
                          {idx + 1}
                        </div>
                        <span className="text-sm text-white font-medium">{shortenAddress(player.address)}</span>
                        <span className="ml-auto text-gray-400 text-sm">{player.totalXP} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Game-specific Tabs */}
        <div className="mb-8">
          <div className="border-b border-white/10 mb-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              {["all", "Coin Flip", "Snake & Ladder", "Rock Paper Scissor"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-purple-500 text-white"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tab === "all" ? "All Games" : tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="glass-effect-dark p-6 rounded-xl mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex-1">
              <h4 className="text-white text-sm mb-2">Filter by Game</h4>
              <div className="flex flex-wrap gap-2">
                {["all", "Coin Flip", "Snake & Ladder", "Rock Paper Scissor"].map(filter => (
                  <Button 
                    key={filter} 
                    variant={activeFilter === filter ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter === "all" ? "All Games" : filter}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-white text-sm mb-2">Time Period</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  {id: "all-time", label: "All Time"}, 
                  {id: "month", label: "This Month"}, 
                  {id: "week", label: "This Week"}, 
                  {id: "today", label: "Today"}
                ].map(period => (
                  <Button 
                    key={period.id} 
                    variant={timeframe === period.id ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setTimeframe(period.id)}
                  >
                    {period.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-white text-sm mb-2">Search by Address</h4>
            <input
              type="text"
              placeholder="Search wallet address..."
              className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Historical Data View */}
        <div className="glass-effect-dark rounded-xl p-6 mb-8 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <span className="text-purple-400 mr-2">📊</span>
            Activity Trend
          </h3>

          <div className="relative h-56 mb-4">
            {/* Fake chart visualization using CSS */}
            <div className="absolute inset-0">
              <div className="absolute inset-x-0 bottom-0 h-px bg-white/20"></div>
              <div className="absolute inset-y-0 left-0 w-px bg-white/20"></div>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500">
                <div className="transform -translate-x-1/2">7d ago</div>
                <div className="transform -translate-x-1/2">6d ago</div>
                <div className="transform -translate-x-1/2">5d ago</div>
                <div className="transform -translate-x-1/2">4d ago</div>
                <div className="transform -translate-x-1/2">3d ago</div>
                <div className="transform -translate-x-1/2">2d ago</div>
                <div className="transform -translate-x-1/2">Yesterday</div>
                <div className="transform -translate-x-1/2">Today</div>
              </div>
              
              {/* Data visualization */}
              <div className="absolute inset-0 mt-6 mb-6 flex items-end">
                {/* Chart bars */}
                <div className="flex-1 h-full flex items-end justify-around">
                  <div className="w-6 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm" style={{height: '30%'}}></div>
                  <div className="w-6 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm" style={{height: '45%'}}></div>
                  <div className="w-6 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm" style={{height: '60%'}}></div>
                  <div className="w-6 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm" style={{height: '40%'}}></div>
                  <div className="w-6 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm" style={{height: '75%'}}></div>
                  <div className="w-6 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm" style={{height: '55%'}}></div>
                  <div className="w-6 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm" style={{height: '85%'}}></div>
                  <div className="w-6 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm" style={{height: '65%'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-center">
              <p className="text-xs text-gray-400">Games Played</p>
              <p className="text-2xl font-bold text-white">127</p>
              <p className="text-xs text-green-400">+24% vs last week</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Active Players</p>
              <p className="text-2xl font-bold text-white">54</p>
              <p className="text-xs text-green-400">+18% vs last week</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Total XP Earned</p>
              <p className="text-2xl font-bold text-white">12,450</p>
              <p className="text-xs text-green-400">+32% vs last week</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Popular Game</p>
              <p className="text-2xl font-bold text-white">Coin Flip</p>
              <p className="text-xs text-gray-400">42% of all games</p>
            </div>
          </div>
        </div>


        {/* Results Summary */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
          <div className="flex items-center">
            <p className="text-white">
              Showing <span className="font-bold text-purple-400">{filteredData.length}</span> players
              {activeFilter !== "all" && <span className="text-gray-400"> in {activeFilter}</span>}
              {timeframe !== "all-time" && <span className="text-gray-400"> from {
                timeframe === "today" ? "today" : 
                timeframe === "week" ? "this week" : 
                "this month"
              }</span>}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <select 
                className="bg-black/50 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="totalXP">Highest XP</option>
                <option value="recent">Recent Activity</option>
                <option value="winStreak">Win Streak</option>
              </select>
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setActiveFilter("all");
                setSearchQuery("");
                setTimeframe("all-time");
                setActiveTab("all");
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Reset
            </Button>
          </div>
        </div>

        {/* Main Leaderboard Table */}
        <div className="glass-effect-dark rounded-xl overflow-hidden border border-white/10">
          <div className="h-[50vh] overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <table className="min-w-full text-sm text-left text-white">
              <thead className="bg-black/50 text-white uppercase text-xs sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Game Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Earned Points</th>
                  <th className="px-6 py-4">Total XP</th>
                  <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-transparent">
                {filteredData
                .map((player, idx) => {
                  let rankIcon = "";
                  if (idx === 0) rankIcon = "🥇";
                  else if (idx === 1) rankIcon = "🥈";
                  else if (idx === 2) rankIcon = "🥉";

                    // Determine if this is a friend (for demo, just marking some entries)
                    const isFriend = idx === 1 || idx === 3;

                  return (
                      <motion.tr
                      key={player.address}
                        className={`border-b border-white/10 hover:bg-white/5 transition-colors ${isFriend ? 'bg-blue-900/10' : ''}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                      >
                        <td className={`px-6 py-4 font-medium ${idx < 3 ? "text-2xl" : ""}`}>
                          <div className="flex items-center">
                            {rankIcon || (
                              <span className="bg-gray-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">
                                {idx + 1}
                              </span>
                            )}
                          </div>
                      </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {isFriend && (
                              <span className="text-blue-400 text-sm mr-1" title="Friend">👥</span>
                            )}
                            <span className="font-mono">{shortenAddress(player.address)}</span>
                        <button
                              onClick={() => {
                                navigator.clipboard.writeText(player.address);
                              toast.success("Address Copied");
                              }}
                              className="text-blue-500 hover:text-blue-400 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                        </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/30 border border-white/10">
                            {player.gameType}
                          </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            player.status === "Win"
                                ? "bg-green-600/30 text-green-400 border border-green-500/30"
                                : "bg-red-600/30 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {player.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                          {player.status === "Win" ? (
                            <span className="font-medium text-white">+{player.earnedPoints} XP</span>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold">{player.totalXP} XP</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {player.address !== address && (
                              <button
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Challenge to a game"
                                onClick={() => toast.success(`Challenge sent to ${shortenAddress(player.address)}!`)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </button>
                            )}
                            {isFriend && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-md text-xs">
                                Friend
                              </span>
                            )}
                            {player.winStreak >= 3 && (
                              <span className="ml-2 text-yellow-400" title={`${player.winStreak} win streak`}>
                                🔥 {player.winStreak}
                              </span>
                            )}
                          </div>
                      </td>
                      </motion.tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
        
        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-medium text-white mb-2">No players found</h3>
            <p className="text-gray-400 text-center max-w-md mb-6">
              No players match your current filter criteria. Try adjusting your filters or check back later.
            </p>
            <Button 
              variant="primary" 
              size="md"
              onClick={() => {
                setActiveFilter("all");
                setSearchQuery("");
                setTimeframe("all-time");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
    </section>
    </div>
  );
}
