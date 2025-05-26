"use client";

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  emoji, 
  align = 'center',
  size = 'large'
}: SectionHeaderProps) {
  // Text alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  // Title size classes
  const titleSizeClasses = {
    small: 'text-3xl md:text-4xl',
    medium: 'text-4xl md:text-5xl',
    large: 'text-5xl md:text-6xl'
  };

  // Subtitle size classes
  const subtitleSizeClasses = {
    small: 'text-sm md:text-base',
    medium: 'text-base md:text-lg',
    large: 'text-lg md:text-xl'
  };

  return (
    <div className={`mb-16 ${alignClasses[align]}`}>
      {/* Line decoration */}
      <div className="flex items-center justify-center mb-4">
        <motion.div 
          className="h-0.5 w-16 bg-gradient-to-r from-purple-500/0 via-purple-500 to-purple-500/0"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 64, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Title with emoji */}
      <motion.h2 
        className={`font-techno font-extrabold mb-4 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] ${titleSizeClasses[size]}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {emoji && <span className="mr-3">{emoji}</span>}
        {title}
      </motion.h2>
      
      {/* Subtitle (optional) */}
      {subtitle && (
        <motion.p 
          className={`max-w-2xl mx-auto text-gray-300 leading-relaxed ${subtitleSizeClasses[size]}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
      
      {/* Bottom decoration */}
      <div className="flex items-center justify-center mt-6">
        <motion.div 
          className="h-1 w-24 bg-gradient-to-r from-purple-600/0 via-purple-600 to-blue-600/0 rounded-full"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 96, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
      </div>
    </div>
  );
} 