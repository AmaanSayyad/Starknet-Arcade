"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";

// Card types and deck generation
type Suit = "hearts" | "diamonds" | "clubs" | "spades";
type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";
type Card = { suit: Suit; rank: Rank; value: number; hidden?: boolean };

type GameState = "betting" | "playing" | "dealerTurn" | "gameOver";

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
  const ranks: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      let value = 0;
      if (rank === "A") {
        value = 11;
      } else if (["J", "Q", "K"].includes(rank)) {
        value = 10;
      } else {
        value = parseInt(rank);
      }
      
      deck.push({ suit, rank, value });
    }
  }
  
  return shuffleDeck(deck);
};

const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

const getHandValue = (hand: Card[]): number => {
  let value = hand.reduce((total, card) => total + (card.hidden ? 0 : card.value), 0);
  let aces = hand.filter(card => card.rank === "A" && !card.hidden).length;
  
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  
  return value;
};

export default function BlackjackGame() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<GameState>("betting");
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(1000);
  const [message, setMessage] = useState("");
  
  // Initialize the game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newDeck = createDeck();
    setDeck(newDeck);
    setPlayerHand([]);
    setDealerHand([]);
    setGameState("betting");
    setMessage("Place your bet to begin!");
  };

  const dealInitialCards = () => {
    if (betAmount > balance) {
      setMessage("You don't have enough balance for this bet!");
      return;
    }
    
    setBalance(prev => prev - betAmount);
    
    const newDeck = [...deck];
    const playerCards = [newDeck.pop()!, newDeck.pop()!];
    
    const dealerCards = [newDeck.pop()!, {...newDeck.pop()!, hidden: true}];
    
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setDeck(newDeck);
    setGameState("playing");
    
    // Check for blackjack
    if (getHandValue(playerCards) === 21) {
      handleDealerTurn(playerCards, dealerCards, newDeck);
    }
  };
  
  const handleHit = () => {
    if (gameState !== "playing") return;
    
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newPlayerHand = [...playerHand, newCard];
    
    setPlayerHand(newPlayerHand);
    setDeck(newDeck);
    
    const handValue = getHandValue(newPlayerHand);
    
    if (handValue > 21) {
      setMessage("Bust! You went over 21.");
      setGameState("gameOver");
    } else if (handValue === 21) {
      handleDealerTurn(newPlayerHand, dealerHand, newDeck);
    }
  };
  
  const handleStand = () => {
    if (gameState !== "playing") return;
    handleDealerTurn(playerHand, dealerHand, deck);
  };
  
  const handleDealerTurn = (playerCards: Card[], dealerCards: Card[], currentDeck: Card[]) => {
    setGameState("dealerTurn");
    
    // Reveal dealer's hidden card
    const revealedDealerHand = dealerCards.map(card => ({...card, hidden: false}));
    setDealerHand(revealedDealerHand);
    
    setTimeout(() => {
      let newDealerHand = [...revealedDealerHand];
      let newDeck = [...currentDeck];
      
      // Dealer draws until 17 or higher
      let dealerValue = getHandValue(newDealerHand);
      
      while (dealerValue < 17) {
        const newCard = newDeck.pop();
        if (newCard) {
          // Ensure hidden property is defined
          const dealerCard = { ...newCard, hidden: false };
          newDealerHand = [...newDealerHand, dealerCard];
          dealerValue = getHandValue(newDealerHand);
        } else {
          // Handle case where deck is empty
          break;
        }
      }
      
      setDealerHand(newDealerHand);
      setDeck(newDeck);
      
      // Determine winner
      const playerValue = getHandValue(playerCards);
      
      if (dealerValue > 21) {
        setMessage("Dealer busts! You win!");
        setBalance(prev => prev + betAmount * 2);
      } else if (playerValue > dealerValue) {
        setMessage("You win!");
        setBalance(prev => prev + betAmount * 2);
      } else if (playerValue === dealerValue) {
        setMessage("Push! It's a tie.");
        setBalance(prev => prev + betAmount);
      } else {
        setMessage("Dealer wins!");
      }
      
      setGameState("gameOver");
    }, 1000);
  };
  
  const playerHandValue = getHandValue(playerHand);
  const dealerHandValue = getHandValue(dealerHand);
  
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Blackjack"
        subtitle="Beat the dealer by getting a hand value closer to 21 without going over."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Games", href: "/games" },
          { label: "Blackjack", href: "/blackjack" }
        ]}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Game UI */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-gray-400 text-sm">Balance</h3>
              <p className="text-white text-xl font-bold">${balance}</p>
            </div>
            
            <div>
              <h3 className="text-gray-400 text-sm">Current Bet</h3>
              <p className="text-white text-xl font-bold">${betAmount}</p>
            </div>
            
            {gameState === "gameOver" && (
              <button
                onClick={startNewGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                New Game
              </button>
            )}
          </div>
          
          {message && (
            <div className="bg-gray-800 rounded-lg p-3 mb-6 text-center">
              <p className="text-white">{message}</p>
            </div>
          )}
          
          {/* Dealer's Hand */}
          <div className="mb-8">
            <h3 className="text-gray-400 text-sm mb-2">Dealer's Hand {gameState !== "betting" && `(${dealerHandValue})`}</h3>
            <div className="flex space-x-2">
              {dealerHand.map((card, index) => (
                <motion.div
                  key={index}
                  className="w-20 h-28 bg-white rounded-lg relative shadow-md overflow-hidden"
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: card.hidden ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {!card.hidden ? (
                    <div className={`w-full h-full p-2 ${card.suit === "hearts" || card.suit === "diamonds" ? "text-red-600" : "text-black"}`}>
                      <div className="text-lg font-bold">{card.rank}</div>
                      <div className="absolute bottom-2 right-2 text-lg">
                        {card.suit === "hearts" ? "♥" : 
                         card.suit === "diamonds" ? "♦" : 
                         card.suit === "clubs" ? "♣" : "♠"}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-purple-600 flex items-center justify-center">
                      <div className="text-2xl text-white">?</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Player's Hand */}
          <div className="mb-8">
            <h3 className="text-gray-400 text-sm mb-2">Your Hand {gameState !== "betting" && `(${playerHandValue})`}</h3>
            <div className="flex space-x-2">
              {playerHand.map((card, index) => (
                <motion.div
                  key={index}
                  className="w-20 h-28 bg-white rounded-lg relative shadow-md"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className={`w-full h-full p-2 ${card.suit === "hearts" || card.suit === "diamonds" ? "text-red-600" : "text-black"}`}>
                    <div className="text-lg font-bold">{card.rank}</div>
                    <div className="absolute bottom-2 right-2 text-lg">
                      {card.suit === "hearts" ? "♥" : 
                       card.suit === "diamonds" ? "♦" : 
                       card.suit === "clubs" ? "♣" : "♠"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Controls */}
          {gameState === "betting" ? (
            <div className="mt-6">
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={() => setBetAmount(prev => Math.max(10, prev - 10))}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  -10
                </button>
                <button
                  onClick={() => setBetAmount(prev => Math.max(50, prev - 50))}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  -50
                </button>
                <button
                  onClick={() => setBetAmount(prev => Math.min(prev + 10, balance))}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  +10
                </button>
                <button
                  onClick={() => setBetAmount(prev => Math.min(prev + 50, balance))}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  +50
                </button>
              </div>
              
              <button
                onClick={dealInitialCards}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Deal Cards
              </button>
            </div>
          ) : gameState === "playing" ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleHit}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Hit
              </button>
              <button
                onClick={handleStand}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Stand
              </button>
            </div>
          ) : null}
        </div>
        
        {/* Game Rules */}
        <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">How to Play Blackjack</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>The goal is to get a hand value closer to 21 than the dealer without going over.</li>
            <li>Number cards are worth their face value. Face cards (J, Q, K) are worth 10. Aces are worth 11 or 1.</li>
            <li>Hit to take another card, Stand to keep your current hand.</li>
            <li>The dealer must hit until they have at least 17.</li>
            <li>If you win, you get double your bet amount back.</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 