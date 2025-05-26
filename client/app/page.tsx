/* eslint-disable @next/next/no-page-custom-font */
// pages/index.js

"use client";
import { useEffect, useState, useRef } from "react";
import Hero from "./components/landing/Hero";
import Features from "./components/landing/Features";
import Cta from "./components/landing/Cta";
import Partners from "./components/landing/Partners";
import FAQ from "./components/landing/FAQ";
import Testimonials from "./components/landing/Testimonials";
import News from "./components/landing/News";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
// import '@fontsource/press-start-2p'; 

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

// Animation for floating objects
const floatingAnimation = {
  y: ["-5%", "5%"],
  transition: {
    repeat: Infinity,
    repeatType: "reverse" as const,
    duration: 3,
    ease: "easeInOut"
  }
};

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Reference to each section for intersection observer
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    features: useRef<HTMLDivElement>(null),
    casinoGames: useRef<HTMLDivElement>(null),
    arcadeGames: useRef<HTMLDivElement>(null),
    partners: useRef<HTMLDivElement>(null),
    testimonials: useRef<HTMLDivElement>(null),
    news: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
    cta: useRef<HTMLDivElement>(null),
  };

  // Parallax effects
  const gradientY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const gradientScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.1, 0.05, 0.02]);
  
  // Intersection observer to detect which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all section refs
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  // Floating decorative elements
  const floatingElements = [
    { icon: '🎮', size: 'w-10 h-10', top: '10%', left: '5%', delay: 0 },
    { icon: '🎲', size: 'w-8 h-8', top: '15%', right: '10%', delay: 1 },
    { icon: '🏆', size: 'w-12 h-12', bottom: '20%', left: '8%', delay: 0.5 },
    { icon: '💰', size: 'w-9 h-9', bottom: '25%', right: '15%', delay: 1.5 },
    { icon: '🎯', size: 'w-7 h-7', top: '40%', right: '5%', delay: 2 },
  ];

  return (
    <div ref={scrollRef} className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background grid with animated gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black to-gray-900 opacity-80">
        <motion.div
          className="w-full h-full"
          style={{ 
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: gridOpacity
          }}
        ></motion.div>
        
        {/* Animated gradients */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-purple-600/20 filter blur-[120px] animate-pulse-slow"
          style={{ y: gradientY, scale: gradientScale }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-blue-600/20 filter blur-[150px] animate-pulse-slow animation-delay-2000"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]), scale: useTransform(scrollYProgress, [0, 1], [1, 1.3]) }}
        ></motion.div>
      </div>

      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className={`absolute ${element.size} bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-glow hidden lg:flex`}
            style={{
              top: element.top,
              left: element.left,
              right: element.right,
              bottom: element.bottom,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.7, 
              scale: 1,
              ...floatingAnimation,
              transition: {
                ...floatingAnimation.transition,
                delay: element.delay,
              }
            }}
          >
            {element.icon}
          </motion.div>
        ))}
      </div>

      {/* Scroll progress indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 z-50"
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      />

      <main className="relative z-10">
        {/* Hero Section */}
        <section id="hero" ref={sectionRefs.hero}>
          <Hero />
        </section>

        {/* Features Section */}
        <section id="features" ref={sectionRefs.features}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <Features />
          </motion.div>
        </section>

    

        <section id="partners" ref={sectionRefs.partners}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <Partners />
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" ref={sectionRefs.testimonials}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <Testimonials />
          </motion.div>
        </section>

        {/* News Section */}
        <section id="news" ref={sectionRefs.news}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <News />
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section id="faq" ref={sectionRefs.faq}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <FAQ />
          </motion.div>
        </section>

        {/* CTA Section */}
        <section id="cta" ref={sectionRefs.cta}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <Cta />
          </motion.div>
        </section>
      </main>

      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg z-50 shadow-glow"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: scrollYProgress.get() > 0.1 ? 1 : 0,
          y: scrollYProgress.get() > 0.1 ? 0 : 20
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
}
