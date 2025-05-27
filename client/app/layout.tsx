"use client";
import "./globals.css";
import "../public/css/game-animations.css";
import { useEffect, useState } from "react";
// import { LotteryProvider } from "./contexts/LotteryContext";
import Head from "next/head";

import "@fontsource/press-start-2p";
import "@fontsource/orbitron"; // Optional weights: /400.css, /700.css
import "@fontsource/silkscreen";
import { Toaster } from "react-hot-toast";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import { CoinFlipProvider } from "./contexts/CoinFlipContext";
import Script from "next/script";
import { StarknetProvider } from "./components/StarknetProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    document.title = "Starknet Arcade";
    document.head
      .querySelector("link[rel='icon']")
      ?.setAttribute("href", "/starknet.svg");
  }, []);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (htmlElement.hasAttribute('data-new-gr-c-s-check-loaded')) {
      htmlElement.removeAttribute('data-new-gr-c-s-check-loaded');
    }
    if (htmlElement.hasAttribute('data-gr-ext-installed')) {
      htmlElement.removeAttribute('data-gr-ext-installed');
    }
  }, []);

  return (
    <html lang="en">
      <Head>
        <title>Starknet Arcade - Gamifying Starknet</title>
        <meta name="description" content="Play games on Starknet blockchain" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/css/style.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Added meta tags for better SEO and sharing */}
        <meta property="og:title" content="Starknet Arcade - Gamifying Starknet" />
        <meta property="og:description" content="The premier on-chain gaming platform powered by StarkNet. Enjoy provably fair games with zero gas fees and instant withdrawals." />
        <meta property="og:image" content="/images/starknet-arcade-og.png" />
        <meta property="og:url" content="https://starknetarcade.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body className="min-h-screen flex flex-col">
        <Script
          src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"
          strategy="beforeInteractive"
        />
        <Script src="/js/scripts.js" strategy="afterInteractive" />
        
        {/* Page loader */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="fixed inset-0 bg-black z-50 flex items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="flex flex-col items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="/icons/center.png" 
                  alt="Starknet Arcade" 
                  className="w-24 h-24 animate-pulse-slow" 
                />
                <h2 className="text-2xl font-techno mt-4 text-white">Loading Arcade...</h2>
                <div className="mt-4 w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Background animation elements */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 filter blur-[150px] animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/10 filter blur-[150px] animate-float animation-delay-1000"></div>
          <div className="absolute top-3/4 left-1/3 w-64 h-64 rounded-full bg-pink-600/10 filter blur-[120px] animate-float animation-delay-2000"></div>
        </div>
        
        <StarknetProvider>
          <CoinFlipProvider>
            <Navbar />
            <main className="w-full flex-grow pt-20 relative z-10">
              <AnimatePresence mode="wait">
                {!isLoading && (
                  <motion.div
                    key="page-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                  >
                    {children}
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
            <Footer />
          </CoinFlipProvider>
        </StarknetProvider>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
          },
          success: {
            icon: '🎮',
            duration: 4000,
          },
          error: {
            icon: '❌',
            duration: 5000,
          }
        }} />
      </body>
    </html>
  );
}
