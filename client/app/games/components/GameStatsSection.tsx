"use client";
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

const STATS = [
  {
    id: 1,
    label: "Total Players",
    value: 100,
    unit: "+",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    id: 2,
    label: "Games Played",
    value: 10,
    unit: "+",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    )
  },
  {
    id: 3,
    label: "$STRK Rewards",
    value: 4000,
    unit: "+",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

export default function GameStatsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <section ref={ref} className="py-10 mb-16 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-3xl overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 rounded-full filter blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600 rounded-full filter blur-[150px] translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div className="relative px-6 py-10 z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white font-techno mb-4">Starknet Arcade Stats</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform is growing fast with more games, players, and rewards every day.
            Join the community and be part of the blockchain gaming revolution!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <CountUpAnimation 
                  end={stat.value} 
                  duration={2.5} 
                  inView={inView} 
                  suffix={stat.unit} 
                />
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Animated counter component
function CountUpAnimation({ end, duration = 2, inView, suffix = '' }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercent = Math.min(progress / (duration * 1000), 1);
      
      setCount(Math.floor(progressPercent * end));
      
      if (progressPercent < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, inView]);
  
  // Format the number with commas
  const formattedCount = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return (
    <div className="text-3xl font-bold text-white">
      {formattedCount}{suffix}
    </div>
  );
} 