"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Enhanced card data with gradients and SVG patterns
const cards = [
  { 
    id: 1,
    title: "Roulette",
    description: "Spin the wheel and test your luck with our premium roulette experience",
    gradient: "from-red-600 via-red-500 to-orange-500",
    hoverGradient: "from-red-500 via-red-400 to-orange-400",
    icon: "🎰",
    url: "/roulette",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="roulette-pattern" patternUnits="userSpaceOnUse" width="30" height="30" patternTransform="scale(2) rotate(0)">
            <circle cx="10" cy="10" r="1.5" fill="white" />
            <circle cx="20" cy="20" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#roulette-pattern)" />
      </svg>
    ),
    rating: 4.8,
  },
  { 
    id: 2,
    title: "Snake Ladder",
    description: "Navigate through twists and turns in this classic board game with a modern twist",
    gradient: "from-green-600 via-green-500 to-emerald-500",
    hoverGradient: "from-green-500 via-green-400 to-emerald-400",
    icon: "🎲",
    url: "/snake-ladder",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="snake-pattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(2) rotate(45)">
            <path d="M0 20 L40 20" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M20 0 L20 40" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#snake-pattern)" />
      </svg>
    ),
    rating: 4.7,
  },
  { 
    id: 3,
    title: "Rock Paper Scissor",
    description: "Outplay your opponent with strategy in this timeless game of chance",
    gradient: "from-blue-600 via-blue-500 to-indigo-500",
    hoverGradient: "from-blue-500 via-blue-400 to-indigo-400",
    icon: "✂️",
    url: "/rock-paper-scissor",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="rps-pattern" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="scale(2) rotate(0)">
            <path d="M15 15 L45 45" stroke="white" strokeWidth="2" />
            <path d="M45 15 L15 45" stroke="white" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rps-pattern)" />
      </svg>
    ),
    rating: 4.6,
  },
  { 
    id: 4,
    title: "Mines Game",
    description: "Carefully navigate the minefield for big rewards or explosive consequences",
    gradient: "from-purple-600 via-purple-500 to-violet-500",
    hoverGradient: "from-purple-500 via-purple-400 to-violet-400",
    icon: "💣",
    url: "/mines",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mines-pattern" patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="scale(2) rotate(0)">
            <circle cx="25" cy="25" r="5" fill="none" stroke="white" strokeWidth="1" />
            <circle cx="25" cy="25" r="2" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mines-pattern)" />
      </svg>
    ),
    rating: 4.9,
  },
  { 
    id: 5,
    title: "Coin Flip",
    description: "Heads or tails? A 50/50 chance with exciting multipliers",
    gradient: "from-yellow-600 via-yellow-500 to-amber-500",
    hoverGradient: "from-yellow-500 via-yellow-400 to-amber-400",
    icon: "🪙",
    url: "/coin-flip",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="coin-pattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(2) rotate(0)">
            <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#coin-pattern)" />
      </svg>
    ),
    rating: 4.7,
  },
];

// Card component with enhanced 3D effects
const Card = ({ card, isActive, index, activeIndex, onClick }) => {
  // Calculate position relative to active card
  const relativePosition = index - activeIndex;
  
  // Card scaling and positioning based on position
  const getCardStyles = () => {
    // Default values for off-screen cards
    let zIndex = 0;
    let x = relativePosition > 0 ? 1200 : -1200;
    let scale = 0.8;
    let opacity = 0;
    let rotateY = relativePosition > 0 ? 45 : -45;
    
    // Position visible cards
    if (relativePosition >= -2 && relativePosition <= 2) {
      if (relativePosition === 0) {
        // Active card
        zIndex = 10;
        x = 0;
        scale = 1;
        opacity = 1;
        rotateY = 0;
      } else if (relativePosition === 1) {
        // Right card
        zIndex = 5;
        x = 250;
        scale = 0.85;
        opacity = 0.7;
        rotateY = 15;
      } else if (relativePosition === -1) {
        // Left card
        zIndex = 5;
        x = -250;
        scale = 0.85;
        opacity = 0.7;
        rotateY = -15;
      } else if (relativePosition === 2) {
        // Far right card
        zIndex = 1;
        x = 450;
        scale = 0.7;
        opacity = 0.4;
        rotateY = 30;
      } else if (relativePosition === -2) {
        // Far left card
        zIndex = 1;
        x = -450;
        scale = 0.7;
        opacity = 0.4;
        rotateY = -30;
      }
    }
    
    return {
      zIndex,
      x,
      scale,
      opacity,
      rotateY
    };
  };
  
  const styles = getCardStyles();

  return (
    <motion.div
      className="absolute top-0 w-full flex justify-center"
      initial={false}
      animate={{
        zIndex: styles.zIndex,
        x: styles.x,
        scale: styles.scale,
        opacity: styles.opacity,
        rotateY: styles.rotateY,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
      }}
      onClick={() => onClick(index)}
      style={{ 
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <motion.div 
        className={`w-80 h-96 rounded-2xl overflow-hidden cursor-pointer shadow-2xl`}
        whileHover={isActive ? { scale: 1.05, y: -10 } : {}}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-full w-full group">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} transition-all duration-300 group-hover:bg-gradient-to-br group-hover:${card.hoverGradient}`}></div>

          {/* SVG Pattern */}
          {card.pattern}
          
          {/* Glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-40"></div>

          {/* Card content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
            {/* Card header */}
        <div className="flex justify-between items-start">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{card.icon}</span>
                <h3 className="text-3xl font-bold font-techno text-white tracking-wide leading-tight">
                  {card.title}
                </h3>
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-lg px-2 py-1 flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-white font-medium">{card.rating}</span>
              </div>
            </div>
            
            {/* Card middle with animated particle effects */}
            <div className="relative h-16 flex items-center">
              {isActive && (
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-white/60"
                      initial={{ 
                        x: "50%", 
                        y: "50%", 
                        opacity: 0,
                        scale: 0
                      }}
                      animate={{ 
                        x: `${Math.random() * 100}%`, 
                        y: `${Math.random() * 100}%`,
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Card description */}
            <div>
              <p className="text-white/90 text-sm mb-4 line-clamp-2">
                {card.description}
              </p>
              
              {/* Play button with hover effect */}
              <Link href={card.url}>
                <motion.button 
                  className="w-full py-3 rounded-lg font-bold text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Play Now</span>
                  <motion.span
                    className="ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </Link>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/20 rounded-tr-full"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function GameCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [dragStartX, setDragStartX] = useState(0);
  const carouselRef = useRef(null);
  const controlsRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  
  // Handle autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayTimerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
      }, 5000);
    }
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay]);
  
  // Mouse/touch handlers to pause autoplay
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);
  
  // Handle card click
  const handleCardClick = (index) => {
    setActiveIndex(index);
    setAutoplay(false);
    // Resume autoplay after 8 seconds of inactivity
    setTimeout(() => setAutoplay(true), 8000);
  };
  
  // Handle navigation
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 8000);
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 8000);
  };
  
  // Handle swipe
  const handleDragStart = (e) => {
    setDragStartX(e.clientX || (e.touches && e.touches[0].clientX) || 0);
    setAutoplay(false);
  };
  
  const handleDragEnd = (e) => {
    const dragEndX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
    const diff = dragEndX - dragStartX;
    
    if (Math.abs(diff) > 100) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    
    setTimeout(() => setAutoplay(true), 8000);
  };
  
          return (
            <div
      className="w-full relative h-[500px]"
      ref={carouselRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
    >
      {/* Cards carousel */}
      <div className="w-full h-full flex items-center justify-center relative">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            activeIndex={activeIndex}
            isActive={activeIndex === index}
            onClick={handleCardClick}
          />
        ))}
      </div>
      
      {/* Navigation controls */}
      <motion.div 
        className="absolute bottom-4 inset-x-0 mx-auto w-fit flex items-center justify-center space-x-8 z-20"
        ref={controlsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg flex items-center justify-center text-white border border-white/20 hover:bg-black/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        
        <div className="flex space-x-2">
          {cards.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/30 hover:bg-white/50"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <motion.button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg flex items-center justify-center text-white border border-white/20 hover:bg-black/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
}
