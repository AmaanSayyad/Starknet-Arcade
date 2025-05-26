"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

const CURRENT_TOURNAMENT = {
  name: "Weekly Roulette Challenge",
  description: "Compete against other players in our weekly roulette tournament. Top 3 players win STARK tokens!",
  startDate: "June 2, 2025",
  endDate: "June 9, 2025",
  prize: "1,000 STARK",
  entryFee: "10 STARK",
  participants: 128,
  maxParticipants: 256,
  image: "/images/games-fixed/roulette.svg"
};

const LEADERBOARD = [
  { rank: 1, name: "CryptoKing", score: 1450, avatar: "/images/avatars/player1.png" },
  { rank: 2, name: "StarkPlayer", score: 1380, avatar: "/images/avatars/player2.png" },
  { rank: 3, name: "BlockchainGamer", score: 1320, avatar: "/images/avatars/player3.png" },
  { rank: 4, name: "L2Enthusiast", score: 1290, avatar: "/images/avatars/player4.png" },
  { rank: 5, name: "ZkGamer", score: 1150, avatar: "/images/avatars/player5.png" }
];

export default function TournamentSection() {
  return (
    <section className="py-16 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Column - Tournament Info */}
        <motion.div 
          className="w-full md:w-7/12"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={CURRENT_TOURNAMENT.image} 
                alt={CURRENT_TOURNAMENT.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="bg-purple-600/80 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-3 backdrop-blur-sm">
                  Active Tournament
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{CURRENT_TOURNAMENT.name}</h2>
                <p className="text-gray-300 text-sm md:text-base">{CURRENT_TOURNAMENT.description}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-purple-400 text-xs uppercase font-medium mb-1">Start Date</div>
                  <div className="text-white font-medium">{CURRENT_TOURNAMENT.startDate}</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 text-xs uppercase font-medium mb-1">End Date</div>
                  <div className="text-white font-medium">{CURRENT_TOURNAMENT.endDate}</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 text-xs uppercase font-medium mb-1">Prize Pool</div>
                  <div className="text-white font-medium">{CURRENT_TOURNAMENT.prize}</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 text-xs uppercase font-medium mb-1">Entry Fee</div>
                  <div className="text-white font-medium">{CURRENT_TOURNAMENT.entryFee}</div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Participants</span>
                  <span className="text-gray-300 text-sm">{CURRENT_TOURNAMENT.participants}/{CURRENT_TOURNAMENT.maxParticipants}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2.5 rounded-full" 
                    style={{width: `${(CURRENT_TOURNAMENT.participants / CURRENT_TOURNAMENT.maxParticipants) * 100}%`}}
                  ></div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/tournaments/join">
                  <motion.button 
                    className="w-full sm:w-auto flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Join Tournament
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                </Link>
                
                <Link href="/tournaments/rules">
                  <motion.button 
                    className="w-full sm:w-auto flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Rules
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Right Column - Leaderboard */}
        <motion.div 
          className="w-full md:w-5/12"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Current Leaderboard
            </h3>
            
            <div className="space-y-4">
              {LEADERBOARD.map((player, index) => (
                <motion.div 
                  key={player.rank}
                  className="flex items-center p-3 rounded-lg bg-gray-700/50 border border-gray-600"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                    player.rank === 1 ? 'bg-yellow-500 text-yellow-900' :
                    player.rank === 2 ? 'bg-gray-300 text-gray-800' :
                    player.rank === 3 ? 'bg-amber-600 text-amber-900' :
                    'bg-gray-600 text-gray-300'
                  } mr-3`}>
                    {player.rank}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden mr-3">
                    <img 
                      src={player.avatar || "/images/avatars/default.png"} 
                      alt={player.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-white">{player.name}</div>
                    <div className="text-xs text-gray-400">Score: {player.score}</div>
                  </div>
                  
                  {player.rank <= 3 && (
                    <div className="text-sm text-green-400 font-medium">
                      +{(4 - player.rank) * 250} STARK
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/tournaments/leaderboard">
                <motion.button 
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  View Full Leaderboard
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </Link>
            </div>
          </div>
          
          <motion.div 
            className="mt-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-lg font-bold text-white mb-2">Host Your Own Tournament</h3>
            <p className="text-gray-300 text-sm mb-4">
              Want to create and host your own tournament? You can set custom rules, prize pools, and more!
            </p>
            <Link href="/tournaments/create">
              <motion.button 
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors inline-flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Tournament
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 