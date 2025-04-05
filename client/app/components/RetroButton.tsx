import React from 'react';
import '@fontsource/press-start-2p';

interface RetroButtonProps {
  children: React.ReactNode;
  href?: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  shadowColor?: string;
  fontSize?: string;
  className?: string;
}

const RetroButton: React.FC<RetroButtonProps> = ({
  children,
  href = '#',
  bgColor = 'bg-pink-600',
  textColor = 'text-white',
  borderColor = 'border-white',
  shadowColor = 'shadow-[4px_4px_0_0_#9333EA]',
  fontSize = 'text-lg',
  className = '',
}) => {
  return (
    <a
      href={href}
      className={`
        relative inline-block px-6 py-4 font-bold border-4 
        ${bgColor} ${textColor} ${borderColor} ${shadowColor} ${fontSize}
        hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-transform
        ${className}
      `}
      style={{ fontFamily: '"Press Start 2P", cursive' }}
    >
      {children}
    </a>
  );
};

export default RetroButton;
