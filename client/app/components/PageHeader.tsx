"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  backgroundImage?: string;
  actions?: React.ReactNode;
  align?: 'center' | 'left';
  size?: 'sm' | 'md' | 'lg';
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  backgroundImage,
  actions,
  align = 'center',
  size = 'md'
}: PageHeaderProps) {
  // Dynamic classes based on alignment
  const alignClasses = align === 'center' ? 'text-center mx-auto' : 'text-left';
  
  // Dynamic classes based on size
  const titleSizeClasses = {
    sm: 'text-3xl md:text-4xl',
    md: 'text-4xl md:text-5xl',
    lg: 'text-5xl md:text-6xl'
  }[size];
  
  const subtitleSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  }[size];
  
  const paddingClasses = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20'
  }[size];
  
  return (
    <div className={`relative ${paddingClasses} px-6 overflow-hidden`}>
      {/* Background elements */}
      {backgroundImage ? (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black z-10"></div>
          <motion.img
            initial={{ scale: 1.1, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{ duration: 1.5 }}
            src={backgroundImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600/10 filter blur-[100px]"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-blue-600/10 filter blur-[120px]"></div>
        </div>
      )}
      
      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>
      
      <div className={`max-w-7xl mx-auto relative z-10 ${alignClasses}`}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav 
            className="flex items-center space-x-2 text-sm text-gray-400 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {breadcrumbs.map((item, index) => (
              <div key={item.href} className="flex items-center">
                {index > 0 && (
                  <svg className="mx-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                <Link 
                  href={item.href}
                  className={`hover:text-purple-400 transition-colors ${
                    index === breadcrumbs.length - 1 ? 'text-purple-400 font-medium' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </motion.nav>
        )}
        
        {/* Title */}
        <motion.h1 
          className={`${titleSizeClasses} font-bold text-white font-techno mb-4 max-w-4xl ${align === 'center' ? 'mx-auto' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {title}
        </motion.h1>
        
        {/* Subtitle */}
        {subtitle && (
          <motion.p 
            className={`${subtitleSizeClasses} text-gray-300 max-w-3xl ${align === 'center' ? 'mx-auto' : ''} mb-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}
        
        {/* Actions */}
        {actions && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {actions}
          </motion.div>
        )}
        
        {/* Decorative elements */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70"></div>
      </div>
    </div>
  );
} 