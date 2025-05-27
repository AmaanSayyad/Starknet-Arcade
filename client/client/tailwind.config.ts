import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'retro': ['"Press Start 2P"', 'monospace'],
        'techno': ['Orbitron', 'Arial', 'sans-serif'],
        'silk': ['Silkscreen', 'monospace'],
      },
      colors: {
        'arcade-purple': '#8A2BE2',
        'arcade-blue': '#4169E1',
        'arcade-pink': '#FF69B4',
        'arcade-neon': '#39FF14',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern': 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1h18v18H1V1zm1 1v16h16V2H2z\' fill=\'%23FFFFFF\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
      },
      animation: {
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 15s linear infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'shimmer': 'shimmer 2s infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'fade-in-out': 'fade-in-out 3s ease-in-out infinite',
        'scale-pulse': 'scale-pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'slide-in-bottom': 'slide-in-bottom 0.5s ease-out forwards',
        'rotate-3d': 'rotate-3d 15s linear infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'fade-in-out': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        'scale-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(138, 75, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(138, 75, 255, 0.8)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-bottom': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'rotate-3d': {
          '0%': { transform: 'perspective(1200px) rotateY(0deg)' },
          '100%': { transform: 'perspective(1200px) rotateY(360deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
    },
  },
  plugins: [],
};

export default config;
