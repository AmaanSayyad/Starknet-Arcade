"use client";
import { motion } from "framer-motion";
import { Calendar, Trophy, Zap, Users, Shield } from "lucide-react";

const newsItems = [
  {
    id: 1,
    type: "Major Update",
    title: "Starknet Arcade 2.0 Launch",
    description: "Introducing new games, enhanced UI, and improved blockchain integration with 50% faster transactions.",
    date: "2025-05-25",
    category: "Platform Update",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    featured: true
  },
  {
    id: 2,
    type: "Tournament",
    title: "$100K Winter Championship",
    description: "Join our biggest tournament yet! Compete across multiple games and win from a massive prize pool.",
    date: "2025-04-10",
    category: "Tournament",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
    featured: true
  },
  {
    id: 3,
    type: "Security",
    title: "Enhanced Security Audit Completed",
    description: "Our smart contracts have been audited by three leading security firms with zero critical issues found.",
    date: "2025-06-08",
    category: "Security",
    icon: Shield,
    color: "from-green-500 to-emerald-500",
    featured: false
  },
  {
    id: 4,
    type: "Community",
    title: "50,000 Players Milestone",
    description: "We've reached 50,000 active players! Thank you for making Starknet Arcade the premier blockchain gaming platform.",
    date: "2025-06-05",
    category: "Milestone",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    featured: false
  },
  {
    id: 5,
    type: "New Game",
    title: "Texas Hold'em Poker Now Live",
    description: "Experience the classic poker game with provably fair dealing and real-time multiplayer action.",
    date: "2025-06-02",
    category: "Game Release",
    icon: Zap,
    color: "from-red-500 to-pink-500",
    featured: false
  },
  {
    id: 6,
    type: "Partnership",
    title: "Strategic Partnership with StarkWare",
    description: "Announcing our official partnership to bring cutting-edge Layer 2 technology to blockchain gaming.",
    date: "2025-06-01",
    category: "Partnership",
    icon: Users,
    color: "from-indigo-500 to-purple-500",
    featured: false
  }
];



const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export default function News() {
  const featuredNews = newsItems.filter(item => item.featured);
  const regularNews = newsItems.filter(item => !item.featured);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white font-techno">
            Latest News & Updates
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest developments, tournaments, and announcements from Starknet Arcade
          </p>
        </motion.div>


        {/* Regular News Grid */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center font-techno">
            <Calendar className="w-6 h-6 mr-3 text-blue-400" />
            Recent Updates
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regularNews.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-900 bg-opacity-60 backdrop-blur-lg rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all hover:transform hover:scale-105"
                >
                  {/* Icon and Category */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-gray-300">{formatDate(item.date)}</span>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-purple-400">{item.type}</span>
                    <h4 className="font-bold text-white text-sm leading-tight font-techno">
                      {item.title}
                    </h4>
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Category Badge */}
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <span className="text-xs text-gray-400">Category:</span>
                    <span className="ml-2 text-xs font-bold text-blue-400">{item.category}</span>
                  </div>
                </motion.div>
                           );
           })}
         </div>
        </div>

        {/* Newsletter Signup */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-blue-800/30"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4 font-techno">Stay in the Loop</h3>
            <p className="text-gray-300 mb-6">
              Get the latest updates, tournament announcements, and exclusive offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold rounded-lg hover:transform hover:scale-105 transition-all duration-300 font-techno">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 