"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/Button";
import Link from "next/link";
import { useAccount } from "@starknet-react/core";

// Reward item interface
interface RewardItem {
  id: string;
  title: string;
  description: string;
  image: string;
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  available: boolean;
  category: "token" | "nft" | "boost" | "merchandise";
  claimable: boolean;
  timeRemaining?: string;
}

// Sample rewards data
const rewardsData: RewardItem[] = [
  {
    id: "stark-token-100",
    title: "100 STARK Tokens",
    description: "Redeem for 100 STARK tokens that can be used across all games on the platform.",
    image: "/governance.png",
    points: 500,
    rarity: "common",
    available: true,
    category: "token",
    claimable: true
  },
  {
    id: "arcade-nft",
    title: "Arcade Cabinet NFT",
    description: "Exclusive NFT with special perks in the Starknet Arcade ecosystem.",
    image: "/shorter.png",
    points: 2500,
    rarity: "epic",
    available: true,
    category: "nft",
    claimable: true
  },
  {
    id: "stark-token-500",
    title: "500 STARK Tokens",
    description: "Redeem for 500 STARK tokens that can be used across all games on the platform.",
    image: "/governance.png",
    points: 2000,
    rarity: "rare",
    available: true,
    category: "token",
    claimable: true
  },
  {
    id: "vip-access",
    title: "VIP Tournament Access",
    description: "Gain exclusive access to the upcoming VIP tournament with 10,000 STARK prize pool.",
    image: "/partnership.png",
    points: 5000,
    rarity: "legendary",
    available: true,
    category: "boost",
    claimable: true
  }
];

// Rarity color mapping
const rarityColors = {
  common: "from-blue-500 to-blue-600",
  rare: "from-purple-500 to-purple-600",
  epic: "from-pink-500 to-pink-600",
  legendary: "from-amber-500 to-amber-600"
};

// Category icon mapping
const categoryIcons = {
  token: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    </svg>
  ),
  nft: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
  ),
  boost: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
  ),
  merchandise: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
  )
};

export default function RewardsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(2500);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { address } = useAccount();

  // Sample reward history data
  const rewardHistory = [
    { id: "1", name: "50 STARK Tokens", date: "2023-11-15", points: 250, status: "completed" },
    { id: "2", name: "24h XP Boost", date: "2023-11-10", points: 750, status: "completed" },
    { id: "3", name: "Starknet Sticker Pack", date: "2023-10-28", points: 500, status: "shipped" }
  ];
  
  // Featured/limited time rewards
  const featuredRewards = [
    {
      id: "winter-nft",
      title: "Winter Edition NFT",
      description: "Limited edition winter-themed NFT available only until Jan 1st.",
      image: "/governance.png",
      points: 3000,
      rarity: "legendary" as const,
      timeRemaining: "14d 6h",
      available: true,
      category: "nft" as const,
      claimable: true
    },
    {
      id: "holiday-boost",
      title: "Holiday Points Boost",
      description: "Earn triple points in all games during the holiday season.",
      image: "/partnership.png",
      points: 1500,
      rarity: "epic" as const,
      timeRemaining: "7d 12h",
      available: true,
      category: "boost" as const,
      claimable: true
    }
  ];

  useEffect(() => {
    // Check if user is connected with wallet
    setIsConnected(!!address);
  }, [address]);

  const filteredRewards = selectedCategory 
    ? rewardsData.filter(reward => reward.category === selectedCategory)
    : rewardsData;

  const categories = [
    { id: null, name: "All Rewards" },
    { id: "token", name: "Tokens" },
    { id: "nft", name: "NFTs" },
    { id: "boost", name: "Boosts" },
    { id: "merchandise", name: "Merchandise" }
  ];

  const handleClaimReward = (reward: RewardItem) => {
    if (!isConnected) {
      alert("Please connect your wallet to claim rewards");
      return;
    }
    
    if (claimedRewards.includes(reward.id)) {
      alert("You have already claimed this reward");
      return;
    }
    
    if (userPoints < reward.points) {
      alert("You don't have enough points to claim this reward");
      return;
    }

    setSelectedReward(reward);
    setShowConfirmation(true);
  };

  const confirmClaim = () => {
    if (selectedReward) {
      setUserPoints(prev => prev - selectedReward.points);
      setClaimedRewards(prev => [...prev, selectedReward.id]);
      setShowConfirmation(false);
      setSelectedReward(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <PageHeader 
        title="Rewards"
        subtitle="Earn points by playing games and redeem them for exclusive rewards"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Rewards", href: "/rewards" }
        ]}
        size="md"
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* User points display */}
        <motion.div 
          className="glass-effect-dark rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
              🏆
            </div>
            <div>
              <h3 className="text-white text-xl font-bold font-techno">Your Reward Points</h3>
              <p className="text-gray-400 text-sm">Play more games to earn additional points</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-white font-techno bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{userPoints}</div>
            <div className="ml-2 text-gray-400">points</div>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4"
              href="/"
            >
              Earn More
            </Button>
          </div>
        </motion.div>
        
        {/* Featured/Limited Time Rewards */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white font-techno flex items-center">
              <span className="animate-pulse text-2xl mr-2">🔥</span> Limited Time Rewards
            </h2>
            <div className="text-sm text-gray-400">Don't miss out on these exclusive offers</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredRewards.map((reward) => (
              <motion.div
                key={reward.id}
                className="relative glass-effect-dark rounded-xl overflow-hidden border border-purple-500/30 shadow-glow transition-all"
                whileHover={{ y: -5 }}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rarityColors[reward.rarity]}`}></div>
                
                {/* Time remaining badge */}
                <div className="absolute top-3 right-3 bg-red-900/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-red-200 border border-red-700/50 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {reward.timeRemaining} left
                </div>
                
                <div className="flex flex-col md:flex-row h-full">
                  {/* Image */}
                  <div className="relative md:w-1/3 h-48 md:h-auto bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4">
                    <img 
                      src={reward.image} 
                      alt={reward.title} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 md:w-2/3 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-bold text-xl font-techno">{reward.title}</h3>
                      <div className="flex items-center bg-gray-800 px-2 py-1 rounded-full">
                        <span className="text-purple-400 text-xs font-bold mr-1">{reward.points}</span>
                        <span className="text-gray-400 text-xs">pts</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">{reward.description}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center text-gray-400 text-xs">
                        <span className="mr-1">{categoryIcons[reward.category]}</span>
                        <span className="capitalize">{reward.category}</span>
                      </div>
                      
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={userPoints < reward.points}
                        onClick={() => handleClaimReward(reward)}
                      >
                        {userPoints >= reward.points ? "Claim Now" : "Not Enough Points"}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Reward History */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-techno">Your Reward History</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? "Hide" : "Show"} History
            </Button>
          </div>
          
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="glass-effect-dark rounded-xl overflow-hidden border border-gray-800">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Reward</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Points</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rewardHistory.map((item) => (
                          <tr key={item.id} className="border-b border-gray-800">
                            <td className="py-3 px-4 text-white">{item.name}</td>
                            <td className="py-3 px-4 text-gray-400">{item.date}</td>
                            <td className="py-3 px-4 text-purple-400">{item.points}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.status === 'completed' 
                                  ? 'bg-green-900/50 text-green-400' 
                                  : 'bg-blue-900/50 text-blue-400'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Categories filter */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 font-techno">Browse Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <motion.button
                key={category.id ?? "all"}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category.id 
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                } transition-all`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Rewards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRewards.map(reward => {
            const isClaimed = claimedRewards.includes(reward.id);
            const canAfford = userPoints >= reward.points;
            
            return (
              <motion.div
                key={reward.id}
                className={`relative glass-effect-dark rounded-xl overflow-hidden border ${
                  isClaimed 
                    ? "border-gray-700 opacity-75" 
                    : canAfford 
                    ? "border-purple-500/30 hover:border-purple-500/60" 
                    : "border-gray-700"
                } transition-all`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: isClaimed || !canAfford ? "none" : "0 10px 25px -5px rgba(124, 58, 237, 0.3)" 
                }}
              >
                {/* Rarity indicator */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rarityColors[reward.rarity]}`}></div>
                
                {/* Rarity badge */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white border border-gray-700/50 capitalize">
                  {reward.rarity}
                </div>
                
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4">
                  <img 
                    src={reward.image} 
                    alt={reward.title} 
                    className="max-h-full max-w-full object-contain"
                  />
                  
                  {/* Claimed overlay */}
                  {isClaimed && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="bg-green-500/90 text-white px-4 py-2 rounded-full font-bold transform -rotate-12 text-sm">
                        CLAIMED
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-bold text-lg font-techno">{reward.title}</h3>
                    <div className="flex items-center bg-gray-800 px-2 py-1 rounded-full">
                      <span className="text-purple-400 text-xs font-bold mr-1">{reward.points}</span>
                      <span className="text-gray-400 text-xs">pts</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{reward.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-xs">
                      <span className="mr-1">{categoryIcons[reward.category]}</span>
                      <span className="capitalize">{reward.category}</span>
                    </div>
                    
                    <Button
                      variant={canAfford && !isClaimed ? "primary" : "secondary"}
                      size="sm"
                      disabled={isClaimed || !canAfford}
                      onClick={() => handleClaimReward(reward)}
                    >
                      {isClaimed ? "Claimed" : canAfford ? "Claim Reward" : "Not Enough Points"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="h-14"></div>
        
        {/* Points Earning Guide */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white font-techno mb-6">How to Earn Points</h2>
          
          <div className="glass-effect-dark rounded-xl overflow-hidden border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Activity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Points</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Frequency</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">Win a Game</td>
                    <td className="py-3 px-4 text-purple-400">50-200</td>
                    <td className="py-3 px-4 text-gray-400">Unlimited</td>
                    <td className="py-3 px-4 text-gray-400">Points vary by game and bet amount</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">Daily Login</td>
                    <td className="py-3 px-4 text-purple-400">25</td>
                    <td className="py-3 px-4 text-gray-400">Once per day</td>
                    <td className="py-3 px-4 text-gray-400">Consecutive days multiply points (max 5x)</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">Refer a Friend</td>
                    <td className="py-3 px-4 text-purple-400">500</td>
                    <td className="py-3 px-4 text-gray-400">Per friend</td>
                    <td className="py-3 px-4 text-gray-400">Friend must play at least one game</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">Tournament Participation</td>
                    <td className="py-3 px-4 text-purple-400">100</td>
                    <td className="py-3 px-4 text-gray-400">Per tournament</td>
                    <td className="py-3 px-4 text-gray-400">Additional points for top placements</td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">Complete Achievements</td>
                    <td className="py-3 px-4 text-purple-400">50-2000</td>
                    <td className="py-3 px-4 text-gray-400">Once per achievement</td>
                    <td className="py-3 px-4 text-gray-400">Points vary by achievement difficulty</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
        
        {/* Referral Program with New Image */}
        <motion.div
          className="mb-16 glass-effect-dark rounded-xl p-8 border border-purple-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8 md:w-2/3">
              <div className="flex items-center mb-4">
                <img 
                  src="/new-games.png" 
                  alt="Refer Friends" 
                  className="w-16 h-16 mr-4 rounded-lg object-cover"
                />
                <h2 className="text-2xl font-bold text-white font-techno">Refer Friends, Earn Rewards</h2>
              </div>
              <p className="text-gray-400 mb-4">Invite your friends to Starknet Arcade and earn 500 points for each friend who joins and plays a game.</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value="https://starknetarcade.com/ref/amaan123" 
                    readOnly
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => navigator.clipboard.writeText("https://starknetarcade.com/ref/amaan123")}
                  >
                    Copy
                  </Button>
                </div>
                
                <Button
                  variant="primary"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  }
                >
                  Share
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/3 glass-effect p-6 rounded-xl flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white mb-2">5</div>
              <div className="text-sm text-gray-400">Friends Referred</div>
              <div className="w-full h-0.5 bg-gray-800 my-3"></div>
              <div className="text-xl font-bold text-purple-400">2,500</div>
              <div className="text-sm text-gray-400">Points Earned</div>
            </div>
          </div>
        </motion.div>

        {/* Earn more points CTA with New Image */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass-effect-dark rounded-2xl overflow-hidden border border-gray-800 max-w-4xl mx-auto">
            <div className="relative">
              <img 
                src="/governance.png" 
                alt="Governance Banner" 
                className="w-full h-36 object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </div>
            
            <div className="p-8 relative -mt-12">
              <h2 className="text-2xl font-bold text-white mb-2 font-techno">Want More Rewards?</h2>
              <p className="text-gray-400 mb-6">Play games, complete achievements, and participate in tournaments to earn more points!</p>
              <div className="flex flex-wrap justify-center gap-4">
                              <Button
                variant="primary"
                size="lg"
                href="/coin-flip"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                }
              >
                Play Coin Flip
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  href="/leaderboard"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  }
                >
                  View Leaderboard
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirmation && selectedReward && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="glass-effect-dark max-w-md w-full p-8 rounded-2xl border border-gray-700 shadow-lg"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <h2 className="text-2xl font-bold text-white font-techno mb-4">Confirm Reward Claim</h2>
              <p className="text-gray-300 mb-6">
                You are about to claim <span className="text-purple-400 font-semibold">{selectedReward.title}</span> for <span className="text-purple-400 font-semibold">{selectedReward.points}</span> points.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={confirmClaim}
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedReward(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 