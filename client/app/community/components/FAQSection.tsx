"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_ITEMS = [
  {
    id: 1,
    question: "What is Starknet Arcade?",
    answer: "Starknet Arcade is a decentralized gaming platform built on StarkNet, a Layer 2 scaling solution for Ethereum. We offer a variety of blockchain games that are fun, fair, and gas-efficient."
  },
  {
    id: 2,
    question: "How do I get started with Starknet Arcade?",
    answer: "To get started, you'll need a wallet compatible with StarkNet (like Argent X or Braavos). Connect your wallet to our platform, deposit some tokens if needed, and you're ready to play!"
  },
  {
    id: 3,
    question: "Are the games really provably fair?",
    answer: "Yes! All our games use verifiable random functions (VRFs) that ensure each outcome is truly random and cannot be manipulated. The game logic is implemented as smart contracts on StarkNet, which means it's transparent and verifiable."
  },
  {
    id: 4,
    question: "Do I need to pay gas fees to play?",
    answer: "One of the benefits of StarkNet is extremely low gas fees. While there are minimal transaction costs, they're significantly lower than on Ethereum mainnet, making gameplay affordable and accessible."
  },
  {
    id: 5,
    question: "How do I earn rewards from playing?",
    answer: "You can earn STARK tokens by winning games, participating in tournaments, and completing challenges. These tokens can be used for staking, gameplay, or exchanged for other cryptocurrencies."
  },
  {
    id: 6,
    question: "How can I participate in tournaments?",
    answer: "Tournaments are announced on our Discord server and website. To participate, you typically need to register in advance and sometimes pay an entry fee. Check the Events section for upcoming tournaments."
  },
  {
    id: 7,
    question: "Is my data and funds safe on Starknet Arcade?",
    answer: "Security is our priority. Starknet Arcade uses StarkNet's proven security infrastructure, and our smart contracts have been audited by leading security firms. However, always practice good security habits and never risk more than you can afford to lose."
  },
  {
    id: 8,
    question: "How can I report bugs or suggest new features?",
    answer: "We welcome bug reports and feature suggestions! Please join our Discord server and post in the appropriate channels, or submit issues directly to our GitHub repository if you're technically inclined."
  }
];

export default function FAQSection() {
  const [openItemId, setOpenItemId] = useState<number | null>(1);
  
  const toggleItem = (id: number) => {
    setOpenItemId(openItemId === id ? null : id);
  };
  
  return (
    <section className="py-16 border-t border-gray-800">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl font-bold text-white font-techno mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p 
          className="text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Find answers to common questions about Starknet Arcade. If you can't find what you're looking for, join our Discord server for more help.
        </motion.p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {FAQ_ITEMS.map((item, index) => (
          <motion.div
            key={item.id}
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className={`w-full text-left p-6 rounded-xl flex justify-between items-center transition-colors ${
                openItemId === item.id 
                  ? 'bg-purple-900/30 text-white' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <span className="font-medium text-lg">{item.question}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transform transition-transform ${openItemId === item.id ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <AnimatePresence>
              {openItemId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-gray-800/30 rounded-b-xl border-t border-gray-700 text-gray-300">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-6">Still have questions? We're here to help!</p>
        <div className="flex flex-wrap justify-center gap-4">
          <motion.a
            href="https://discord.gg/starknet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.283a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.283.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.202 13.202 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z" />
            </svg>
            Ask on Discord
          </motion.a>
          
        
          
          <motion.a
            href="/docs"
            className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Read Documentation
          </motion.a>
        </div>
      </div>
    </section>
  );
} 