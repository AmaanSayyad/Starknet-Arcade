"use client";
import React from 'react';
import { motion } from 'framer-motion';

const featuresData = [
  {
    id: 1,
    title: "Provably Fair",
    description: "All game outcomes are verified on-chain with transparent randomness you can trust",
    icon: "🔍",
    gradient: "from-blue-600 to-blue-400",
    delay: 0.1
  },
  {
    id: 2,
    title: "Zero Gas Fees",
    description: "Play without worrying about transaction costs thanks to our gasless implementation",
    icon: "💸",
    gradient: "from-green-600 to-green-400",
    delay: 0.2
  },
  {
    id: 3,
    title: "Instant Withdrawals",
    description: "Claim your winnings immediately with no delays or waiting periods",
    icon: "⚡",
    gradient: "from-yellow-600 to-yellow-400",
    delay: 0.3
  },
  {
    id: 4,
    title: "On-chain Security",
    description: "Your funds and game data are secured by StarkNet's battle-tested infrastructure",
    icon: "🔐",
    gradient: "from-purple-600 to-purple-400",
    delay: 0.4
  }
];

const Features = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Section header */}
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-white font-techno"
        >
          Why Choose Starknet Arcade?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto"
        >
          Experience the next generation of blockchain gaming with cutting-edge technology
        </motion.p>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {featuresData.map((feature) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: feature.delay }}
            className="bg-gray-900 bg-opacity-60 backdrop-blur-lg rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all hover:transform hover:scale-105"
          >
            {/* Feature icon */}
            <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.gradient}`}>
              <span className="text-2xl">{feature.icon}</span>
            </div>
            
            {/* Feature content */}
            <h3 className="text-2xl font-bold mb-3 text-white font-techno">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
            
            {/* Animated particles */}
            <div className="relative h-20 mt-4">
              <motion.div
                className="absolute w-2 h-2 rounded-full bg-white/20"
                initial={{ x: "10%", y: "10%", opacity: 0 }}
                animate={{ 
                  x: "90%", 
                  y: "60%",
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  delay: feature.id * 0.5
                }}
              />
              <motion.div
                className="absolute w-2 h-2 rounded-full bg-white/20"
                initial={{ x: "90%", y: "10%", opacity: 0 }}
                animate={{ 
                  x: "10%", 
                  y: "90%",
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  delay: feature.id * 0.5 + 1
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Technology showcase */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 max-w-6xl mx-auto border border-blue-800/30"
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-techno text-white">Powered by StarkNet VRF</h3>
            <p className="text-gray-300 mb-6">
              Our games utilize StarkNet's Verifiable Random Function (VRF) to ensure complete fairness and transparency. Every outcome is cryptographically provable.
            </p>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-green-400">Live and operational</span>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl"></div>
              <motion.div 
                className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-2xl"
                animate={{ 
                  boxShadow: ["0 0 10px rgba(79, 70, 229, 0.5)", "0 0 20px rgba(79, 70, 229, 0.7)", "0 0 10px rgba(79, 70, 229, 0.5)"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
          >
                <div className="bg-gray-900 rounded-xl p-4">
                  <pre className="text-xs text-gray-300 overflow-auto">
                    <code>
                      {`{
  "game_id": "0x42f7...",
  "player": "0x891a...",
  "seed": "0x7de9...",
  "outcome": "19",
  "timestamp": 1678324585,
  "signature": "0x3a2c..."
}`}
                    </code>
                  </pre>
                </div>
              </motion.div>
            </div>
          </div>
      </div>
      </motion.div>
    </section>
  );
};

export default Features;
