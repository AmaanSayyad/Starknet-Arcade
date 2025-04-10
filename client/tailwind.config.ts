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
        retro: ['"Press Start 2P"', 'cursive'],
        techno: ['"Orbitron"', 'sans-serif'],
        silk:["'Silkscreen', sans-serif"]
      },
    },
  },
  plugins: [],
} satisfies Config;
