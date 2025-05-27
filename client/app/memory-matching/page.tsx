"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";

type Card = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const initialCardImages = [
  "/images/games/memory-card-1.svg",
  "/images/games/memory-card-2.svg",
  "/images/games/memory-card-3.svg",
  "/images/games/memory-card-4.svg",
  "/images/games/memory-card-5.svg",
  "/images/games/memory-card-6.svg",
  "/images/games/memory-card-7.svg",
  "/images/games/memory-card-8.svg",
];

export default function MemoryMatchingGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);

  // Initialize the game
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameCompleted]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs === initialCardImages.length && gameStarted) {
      setGameCompleted(true);
      setGameStarted(false);
    }
  }, [matchedPairs, gameStarted]);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);
      
      // Increment moves
      setMoves(prevMoves => prevMoves + 1);

      if (firstCard?.value === secondCard?.value) {
        // Match found
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const initializeGame = () => {
    // Create paired cards
    const cardPairs = [...initialCardImages, ...initialCardImages]
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5); // Shuffle
    
    setCards(cardPairs);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimer(0);
    setGameCompleted(false);
  };

  const handleCardClick = (id: number) => {
    // Start game on first card click
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    // Ignore clicks if already flipped or matched
    const clickedCard = cards.find(card => card.id === id);
    if (
      !clickedCard ||
      clickedCard.isFlipped ||
      clickedCard.isMatched ||
      flippedCards.length >= 2
    ) {
      return;
    }
    
    // Flip the card
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
    
    // Add to flipped cards
    setFlippedCards(prev => [...prev, id]);
  };

  const resetGame = () => {
    initializeGame();
  };

  // Format time display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Memory Matching"
        subtitle="Match pairs of cards to test your memory. Find all matches to win rewards!"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Games", href: "/games" },
          { label: "Memory Matching", href: "/memory-matching" }
        ]}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Game Stats */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-8 flex justify-between items-center">
          <div className="flex space-x-8">
            <div>
              <h3 className="text-gray-400 text-sm">Moves</h3>
              <p className="text-white text-xl font-bold">{moves}</p>
          </div>
            <div>
              <h3 className="text-gray-400 text-sm">Pairs Found</h3>
              <p className="text-white text-xl font-bold">{matchedPairs} / {initialCardImages.length}</p>
      </div>
            <div>
              <h3 className="text-gray-400 text-sm">Time</h3>
              <p className="text-white text-xl font-bold">{formatTime(timer)}</p>
            </div>
          </div>
          
          <button
            onClick={resetGame}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Reset Game
          </button>
        </div>
        
        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 md:gap-6">
          {cards.map(card => (
            <motion.div
              key={card.id}
              className={`relative aspect-square rounded-xl cursor-pointer ${
                card.isFlipped || card.isMatched
                  ? "shadow-purple-500/20 shadow-lg"
                  : "shadow-md"
              }`}
              whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
            >
              {/* Card Front (when flipped) */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center p-4"
                initial={{ rotateY: 180 }}
                animate={{
                  rotateY: card.isFlipped || card.isMatched ? 0 : 180,
                  opacity: card.isFlipped || card.isMatched ? 1 : 0
                }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={card.value}
                  alt="Card"
                  className="w-full h-full object-contain"
                />
              </motion.div>
              
              {/* Card Back */}
              <motion.div
                className="absolute inset-0 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center"
                initial={{ rotateY: 0 }}
                animate={{
                  rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                  opacity: card.isFlipped || card.isMatched ? 0 : 1
                }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-12 h-12 text-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                    <path d="M11 11h2v6h-2zm0-4h2v2h-2z" />
                  </svg>
            </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Game Complete Modal */}
        {gameCompleted && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <motion.div
              className="bg-gray-900 border border-purple-500/30 rounded-xl p-8 max-w-md mx-4 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">🎉 Congratulations! 🎉</h2>
              <p className="text-gray-300 mb-6">
                You've completed the Memory Matching game!
            </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm">Moves</h3>
                  <p className="text-white text-xl font-bold">{moves}</p>
            </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm">Time</h3>
                  <p className="text-white text-xl font-bold">{formatTime(timer)}</p>
          </div>
        </div>
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Play Again
              </button>
            </motion.div>
          </div>
        )}
        </div>
    </div>
  );
}
