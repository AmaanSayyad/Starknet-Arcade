"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

const FORUM_TOPICS = [
  {
    id: 1,
    title: "Best strategy for Coin Flip game?",
    author: "CryptoFlipMaster",
    avatar: "/images/avatars/avatar1.png",
    date: "2 hours ago",
    category: "Game Strategies",
    replies: 24,
    views: 342,
    excerpt: "Hey everyone! I've been playing the Coin Flip game and I'm curious what strategies you all use to maximize wins..."
  },
  {
    id: 2,
    title: "Feedback on the Roulette UI/UX",
    author: "DesignWhiz",
    avatar: "/images/avatars/avatar2.png",
    date: "Yesterday",
    category: "Feedback",
    replies: 18,
    views: 205,
    excerpt: "I've been using the Roulette game quite a bit lately and have some suggestions for improving the user experience..."
  },
  {
    id: 3,
    title: "How does the StarkNet VRF actually work?",
    author: "BlockchainCurious",
    avatar: "/images/avatars/avatar3.png",
    date: "3 days ago",
    category: "Technical",
    replies: 42,
    views: 687,
    excerpt: "I'm curious about the technical implementation of the Verifiable Random Function used in the games. Can someone explain..."
  },
  {
    id: 4,
    title: "Tournament strategies and tips",
    author: "TournamentChamp",
    avatar: "/images/avatars/avatar4.png",
    date: "1 week ago",
    category: "Tournaments",
    replies: 35,
    views: 529,
    excerpt: "With the upcoming Roulette tournament, I wanted to share some tips that have helped me place in the top 3 consistently..."
  }
];

export default function ForumSection() {
  return (
    <section className="py-16 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white font-techno mb-2">Community Forum</h2>
          <p className="text-gray-300">
            Join discussions, share strategies, and connect with other players on our community forum.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex gap-3"
        >
          <Link href="/forum">
            <motion.button 
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Visit Forum
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </Link>
          
          <Link href="/forum/new">
            <motion.button 
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              New Topic
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
      
      {/* Forum Discussions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {FORUM_TOPICS.map((topic, index) => (
          <motion.div
            key={topic.id}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-600/50 transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                {topic.author.charAt(0)}
              </div>
              
              <div className="flex-1">
                <Link href={`/forum/topic/${topic.id}`}>
                  <h3 className="text-xl font-bold text-white hover:text-purple-400 transition-colors">{topic.title}</h3>
                </Link>
                
                <div className="flex items-center text-sm text-gray-400 mt-1 mb-3">
                  <span className="font-medium text-purple-400">{topic.author}</span>
                  <span className="mx-2">•</span>
                  <span>{topic.date}</span>
                  <span className="mx-2">•</span>
                  <span className="bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded text-xs">{topic.category}</span>
                </div>
                
                <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                  {topic.excerpt}
                </p>
                
                <div className="flex items-center text-sm text-gray-400">
                  <div className="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {topic.replies} replies
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {topic.views} views
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Forum categories */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-600/30 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -5 }}
        >
          <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Game Strategies</h3>
          <p className="text-gray-400 text-sm mb-3">
            Share tips, tricks, and winning strategies for all arcade games.
          </p>
          <div className="text-purple-400 text-sm">128 topics</div>
        </motion.div>
        
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-600/30 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Technical Discussions</h3>
          <p className="text-gray-400 text-sm mb-3">
            Talk about Starknet, smart contracts, and blockchain technology.
          </p>
          <div className="text-blue-400 text-sm">97 topics</div>
        </motion.div>
        
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-green-600/30 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Feedback & Ideas</h3>
          <p className="text-gray-400 text-sm mb-3">
            Share your thoughts and suggestions for improving Starknet Arcade.
          </p>
          <div className="text-green-400 text-sm">76 topics</div>
        </motion.div>
        
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-600/30 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <div className="w-12 h-12 rounded-full bg-yellow-600/20 flex items-center justify-center text-yellow-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Community Chat</h3>
          <p className="text-gray-400 text-sm mb-3">
            General discussions, introduce yourself, and make friends!
          </p>
          <div className="text-yellow-400 text-sm">214 topics</div>
        </motion.div>
      </div>
    </section>
  );
} 