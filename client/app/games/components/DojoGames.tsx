import React from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/Button";
import Link from "next/link";

interface DojoGame {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  url: string;
  comingSoon?: boolean;
  features?: string[];
}

const dojoGames: DojoGame[] = [
  {
    id: "dojo-platformer",
    title: "Dojo Platformer",
    description: "Jump and run in this fully on-chain platformer built with Dojo Engine. Collect tokens, avoid obstacles, and compete for the highest score!",
    image: "/gameicons/revenge_of_loki.png",
    category: "adventure",
    url: "/dojo-platformer",
    features: ["On-chain movement", "Verifiable randomness", "NFT rewards"]
  },
  {
    id: "dojo-chess",
    title: "Starknet Chess",
    description: "Strategic chess game with provable fairness and on-chain state using Dojo. Challenge players worldwide and earn rewards based on your ELO rating!",
    image: "/gameicons/fire_portal.png",
    category: "strategy",
    url: "/dojo-chess",
    features: ["Provable moves", "Tournament play", "Ranked matches"]
  },
  {
    id: "dojo-rpg",
    title: "Crypto Warriors",
    description: "RPG adventure game powered by Dojo Engine with NFT integration. Collect heroes, battle monsters, and explore an expansive on-chain world!",
    image: "/gameicons/sugar_rush.png",
    category: "rpg",
    url: "/dojo-rpg",
    comingSoon: true,
    features: ["Character progression", "Composable items", "Guild systems"]
  }
];

export default function DojoGames() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 opacity-50">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-600/10 filter blur-[80px]"></div>
        <div className="absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full bg-blue-600/10 filter blur-[100px]"></div>
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute" 
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                background: 'white',
                opacity: Math.random() * 0.5 + 0.3,
                borderRadius: '50%'
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-4 py-1 rounded-full">
              <span className="text-purple-400 text-sm font-bold">Powered by Dojo Engine</span>
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
              <span className="text-blue-400 text-sm font-bold">On-chain Gaming</span>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Dojo-Powered Games
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Experience the next generation of blockchain gaming with our Dojo Engine games. 
            Fully on-chain mechanics, provable fairness, and seamless gameplay.
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dojoGames.map((game, index) => (
            <motion.div
              key={game.id}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Game Card */}
              <div className="h-full bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20">
                {/* Game Image */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-xs font-medium text-white rounded-full border border-white/10">
                      {game.category}
                    </span>
                  </div>
                  {/* Coming Soon Badge */}
                  {game.comingSoon && (
                    <div className="absolute top-0 right-0 z-10 bg-gradient-to-l from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                      COMING SOON
                    </div>
                  )}
                  {/* Game Title */}
                  <div className="absolute bottom-0 left-0 w-full p-4 z-10">
                    <h3 className="text-xl font-bold text-white mb-1">{game.title}</h3>
                  </div>
                </div>

                {/* Game Details */}
                <div className="p-5">
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{game.description}</p>
                  
                  {/* Features */}
                  {game.features && (
                    <div className="mb-5">
                      <div className="flex flex-wrap gap-2">
                        {game.features.map((feature, i) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300 border border-purple-500/20"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <div className="mt-auto">
                    {!game.comingSoon ? (
                      <Link href={game.url} className="w-full">
                        <Button 
                          variant="primary" 
                          fullWidth
                          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        >
                          Play Now
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        variant="outline" 
                        fullWidth 
                        disabled
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                      >
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300 -z-10"></div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/dojo-games" className="inline-block">
            <Button 
              variant="outline" 
              size="lg"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>}
              iconPosition="right"
            >
              Explore All Dojo Games
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 