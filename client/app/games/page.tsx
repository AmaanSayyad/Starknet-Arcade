"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/Button";
import FeaturedGames from "./components/FeaturedGames";
import GameCategories from "./components/GameCategories";
import TrendingGames from "./components/TrendingGames";
import ComingSoonGames from "./components/ComingSoonGames";
import AllGames from "./components/AllGames";
import GameStatsSection from "./components/GameStatsSection";
import TournamentSection from "./components/TournamentSection";

export default function GamesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-80"></div>
        <div className="absolute inset-0 grid-bg-medium opacity-20"></div>
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 filter blur-[150px]"
          animate={{ 
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-blue-600/10 filter blur-[120px]"
          animate={{ 
            x: [0, -40, 30, 0],
            y: [0, 40, -30, 0],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Page Header */}
      <PageHeader 
        title="Arcade Games"
        subtitle="Discover and play the latest blockchain games on Starknet. Win tokens, collect rewards, and compete with players worldwide."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Games", href: "/games" }
        ]}
        size="md"
        actions={
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="primary" size="lg">
              Play Now
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Featured Games Carousel */}
        <FeaturedGames />

        {/* Game Categories */}
        <GameCategories 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Trending Games */}
        <TrendingGames />

        {/* Tournament Section */}
        <TournamentSection />

        {/* All Games Grid (now includes filters) */}
        <AllGames 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Coming Soon Games */}
        <ComingSoonGames />

        {/* Game Stats */}
        <GameStatsSection />
      </div>
    </div>
  );
} 