"use client";
import React from 'react'
import WalletBar from '../WalletBar'
import { motion } from 'framer-motion'

const Cta = () => {
  return (
    <section className="py-20 px-6 text-center max-w-7xl mx-auto w-full font-techno relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-pink-600/20 filter blur-[60px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-600/20 filter blur-[60px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <motion.div 
        className="relative z-10 bg-gradient-to-br from-violet-900 to-purple-700 rounded-3xl p-12 transition-all hover:shadow-[0_0_50px_rgba(139,92,246,0.3)] overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <svg className="absolute -top-16 -right-16 text-purple-500/10 w-64 h-64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M42.8,-73.1C56.9,-67.8,70.8,-58.8,79.4,-45.9C88,-33,91.2,-16.5,89.9,-0.8C88.5,15,82.5,30,73.2,42.1C63.9,54.2,51.3,63.5,37.5,70.3C23.7,77.1,8.7,81.4,-5.5,79.9C-19.7,78.4,-33.3,71.1,-43.9,61.3C-54.5,51.6,-62.1,39.4,-68.3,25.8C-74.5,12.2,-79.3,-2.8,-77.6,-17C-75.9,-31.2,-67.7,-44.5,-56.6,-50C-45.5,-55.5,-31.5,-53.2,-19.7,-60.3C-7.9,-67.5,1.5,-84.1,13.8,-86.1C26,-88.1,40.1,-75.5,42.8,-73.1Z" transform="translate(100 100)" />
          </svg>
          <svg className="absolute -bottom-20 -left-20 text-violet-500/10 w-80 h-80" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M47.7,-57.2C59,-47.3,63.6,-29.7,68.3,-11.1C73,7.5,77.8,27.1,71.6,41.1C65.4,55.2,48.3,63.5,30.8,68.3C13.4,73,-4.5,74.1,-23.8,70.8C-43.1,67.4,-64,59.5,-73.4,44.1C-82.8,28.7,-80.8,5.9,-73.6,-12.3C-66.3,-30.5,-53.9,-44,-39.8,-54C-25.7,-64,-12.8,-70.5,2.4,-73.4C17.7,-76.4,35.3,-75.8,47.7,-57.2Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="relative z-10">
          <motion.span 
            className="inline-block py-1 px-4 bg-white/10 rounded-full text-sm text-purple-200 backdrop-blur-sm mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Start your journey
          </motion.span>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 text-white font-techno"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
          Ready to Play?
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Connect your wallet and start playing games on Starknet! 100% safe, secure, fair and transparent gameplay with instant withdrawals.
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
          <WalletBar />
          </motion.div>
        </div>

        {/* Visual indicators for step process */}
        <motion.div 
          className="flex flex-col md:flex-row justify-center items-center gap-6 mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          {[
            { number: 1, title: "Connect", description: "Link your wallet" },
            { number: 2, title: "Select", description: "Choose a game" },
            { number: 3, title: "Play", description: "Have fun & win" }
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 backdrop-blur-sm">
                <span className="text-white font-bold">{step.number}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
              <p className="text-sm text-purple-200">{step.description}</p>
      </div>
          ))}
        </motion.div>

        {/* Animated security indicator */}
        <motion.div 
          className="mt-10 flex items-center justify-center text-xs text-gray-300 gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Secured by StarkNet • 100% On-Chain • Zero Fraud</span>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Cta
