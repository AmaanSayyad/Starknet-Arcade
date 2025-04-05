/* eslint-disable @next/next/no-page-custom-font */
// pages/index.js

import Hero from "./components/landing/Hero";
import Games from "./components/landing/Games";
import Features from "./components/landing/Features";
import Cta from "./components/landing/Cta";
// import '@fontsource/press-start-2p'; 
export default function Home() {
  return (
    <div className="min-h-screen bg-[#070005] text-white">
      

      {/* Custom radial gradient background overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(104.56%_104.56%_at_50%_52.81%,rgba(0,0,0,0)_0%,rgba(229,4,152,0.2)_100%)] pointer-events-none"></div>

      <main className="relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Games Section */}
        <Games />

        {/* Features Section */}
        <Features />

        {/* CTA Section */}
        <Cta />
      </main>
    </div>
  );
}
