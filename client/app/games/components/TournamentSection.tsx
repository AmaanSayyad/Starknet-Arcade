"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const TOURNAMENTS = [
  {
    id: 1,
    title: "Starknet Champions Cup",
    game: "Coin Flip Masters",
    prizePool: "10,000 STARK",
    entryFee: "50 STARK",
    players: "128/256",
    startDate: "2023-10-15T10:00:00",
    endDate: "2023-10-18T22:00:00",
    status: "ongoing",
    image: "/gameicons/games.png"
  },
  {
    id: 2,
    title: "Weekend Warriors",
    game: "Rock Paper Scissors League",
    prizePool: "5,000 STARK",
    entryFee: "25 STARK",
    players: "64/128",
    startDate: "2023-10-20T18:00:00",
    endDate: "2023-10-22T22:00:00",
    status: "upcoming",
    image: "/gameicons/games.png"
  },
  {
    id: 3,
    title: "Crypto Cup Challenge",
    game: "Multi-Game Tournament",
    prizePool: "15,000 STARK",
    entryFee: "100 STARK",
    players: "87/128",
    startDate: "2023-11-01T09:00:00",
    endDate: "2023-11-10T23:59:00",
    status: "upcoming",
    image: "/gameicons/games.png"
  }
];

export default function TournamentSection() {
  const [activeTab, setActiveTab] = useState("ongoing");
  
  // Filter tournaments based on active tab
  const filteredTournaments = TOURNAMENTS.filter(tournament => 
    activeTab === "all" || tournament.status === activeTab
  );
  
  return (
    <section className="mb-16 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-3xl p-8 border border-purple-900/30">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-techno">Tournaments & Competitions</h2>
          <p className="text-gray-400">Compete against other players and win big prizes</p>
        </div>
        
        <div className="flex space-x-2 bg-gray-900/50 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "all" 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab("ongoing")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "ongoing" 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Ongoing
          </button>
          <button 
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "upcoming" 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTournaments.map((tournament) => (
          <motion.div
            key={tournament.id}
            className="bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600/50 transition-all"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <Link href={`/tournaments/${tournament.id}`}>
              <div className="relative h-40">
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"
                  style={{
                    backgroundImage: `url(${tournament.image || "/public/images/games/game-placeholder.svg"})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
                
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                  tournament.status === 'ongoing' 
                    ? 'bg-green-500/80 text-white' 
                    : 'bg-blue-500/80 text-white'
                }`}>
                  {tournament.status === 'ongoing' ? 'LIVE NOW' : 'UPCOMING'}
                </div>
                
                {/* Game Badge */}
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-md text-xs text-white">
                  {tournament.game}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2">{tournament.title}</h3>
                
                <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                  <div className="text-gray-400">Prize Pool:</div>
                  <div className="text-purple-400 font-medium text-right">{tournament.prizePool}</div>
                  
                  <div className="text-gray-400">Entry Fee:</div>
                  <div className="text-right">{tournament.entryFee}</div>
                  
                  <div className="text-gray-400">Players:</div>
                  <div className="text-right">{tournament.players}</div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${parseInt(tournament.players.split('/')[0]) / parseInt(tournament.players.split('/')[1]) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-400">
                    {tournament.status === 'ongoing' ? 'Ends in:' : 'Starts in:'}
                  </div>
                  <div className="font-mono bg-gray-800 px-3 py-1 rounded text-white">
                    {tournament.status === 'ongoing' ? '2d 10h 45m' : '5d 8h 30m'}
                  </div>
                </div>
                
                <div className="mt-4">
                  <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
                    {tournament.status === 'ongoing' ? 'Join Tournament' : 'Register Now'}
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/tournaments">
          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors inline-flex items-center">
            View All Tournaments
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </Link>
      </div>
    </section>
  );
} 