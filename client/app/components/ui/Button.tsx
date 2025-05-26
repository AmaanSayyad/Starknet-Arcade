"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  href,
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  type = 'button',
}: ButtonProps) => {
  // Styles based on variant
  const variantStyles = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-transparent shadow-md shadow-purple-900/20',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700 hover:border-gray-600 shadow-md shadow-black/20',
    outline: 'bg-transparent hover:bg-white/5 text-white border-gray-600 hover:border-gray-500',
    danger: 'bg-red-600 hover:bg-red-500 text-white border-transparent shadow-md shadow-red-900/20',
    success: 'bg-green-600 hover:bg-green-500 text-white border-transparent shadow-md shadow-green-900/20',
    ghost: 'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white border-transparent',
  };

  // Sizes
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-lg',
  };

  // Base classes
  const baseClasses = `
    inline-flex items-center justify-center 
    font-medium rounded-lg border transition-all 
    duration-200 ease-in-out focus:outline-none focus:ring-2 
    focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    ${fullWidth ? 'w-full' : ''}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${className}
  `;

  // Loading spinner
  const loadingSpinner = (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // Content with icon
  const content = (
    <>
      {isLoading && loadingSpinner}
      {!isLoading && icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </>
  );

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
    disabled: { scale: 1 }
  };

  // Render as link if href is provided
  if (href) {
    return (
      <Link href={href} className="inline-block">
        <motion.span
          className={baseClasses}
          whileHover={!disabled ? "hover" : "disabled"}
          whileTap={!disabled ? "tap" : "disabled"}
          variants={buttonVariants}
        >
          {content}
        </motion.span>
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={!disabled ? "hover" : "disabled"}
      whileTap={!disabled ? "tap" : "disabled"}
      variants={buttonVariants}
    >
      {content}
    </motion.button>
  );
}; 