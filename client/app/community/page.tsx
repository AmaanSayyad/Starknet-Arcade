"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/Button";
import DiscordSection from "./components/DiscordSection";
import ForumSection from "./components/ForumSection";
import FAQSection from "./components/FAQSection";
import ContributionSection from "./components/ContributionSection";

export default function CommunityPage() {
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
        title="Community Hub"
        subtitle="Join the growing Starknet Arcade community. Connect with players, participate in events, and contribute to our ecosystem."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Community", href: "/community" }
        ]}
        size="md"
        actions={
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="primary" size="lg">
              Join Discord
            </Button>
            <Button variant="outline" size="lg">
              Contribute
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Discord Community Section */}
        <DiscordSection />

        {/* Forum Section */}
        <ForumSection />

        {/* Contribution Section */}
        <ContributionSection />

        {/* FAQ Section */}
        <FAQSection />
      </div>
    </div>
  );
} 