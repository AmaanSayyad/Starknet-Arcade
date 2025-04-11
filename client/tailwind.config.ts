import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        retro: ['"Press Start 2P"', "cursive"],
        techno: ['"Orbitron"', "sans-serif"],
        silk: ["'Silkscreen', sans-serif"],
      },
      keyframes: {
        toss: {
          "0%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(1800deg)" },
          "100%": { transform: "rotateY(3600deg)" },
        },
      },
      animation: {
        toss: "toss 2s ease-in-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
