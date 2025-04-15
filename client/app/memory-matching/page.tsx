"use client";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";

type Card = {
  id: number;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
};
const initialCards: string[] = [
  "https://substackcdn.com/image/fetch/w_1200,h_600,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F7d9a5fa7-68d8-46ad-9056-378ce13e56ea_280x280.png",
  "https://pbs.twimg.com/profile_images/1855150178002706432/P6liMWCZ_400x400.jpg",
  "https://pbs.twimg.com/profile_images/1879931250955235329/zQtCRR5U_400x400.jpg",
  "https://pbs.twimg.com/profile_images/1904592020007489536/AG870Qta_400x400.jpg",
  "https://pbs.twimg.com/profile_images/1880776070418354176/LbH4udpm_400x400.jpg",
  "https://pbs.twimg.com/media/GohGZdqWsAAX4pK?format=jpg&name=large",
  "https://pbs.twimg.com/media/Gnh7elrXsAAeHfO?format=jpg&name=large",
  "https://www.starknet-ecosystem.com/astro_3.png",
];

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [totalMoves, setTotalMoves] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [initialModalOpen, setInitialModalOpen] = useState(false);
  const [playModalOpen, setPlayModalOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [playAgainModalOpen, setPlayAgainModalOpen] = useState(false);

  const closeInitialModal = () => setInitialModalOpen(false);
  const closeGameOverModal = () => setGameOver(false);
  const closePlayAgainModal = () => setPlayAgainModalOpen(false);
  const closePlayModal = () => setPlayModalOpen(false);

  /**
   * Shuffle and initialize the card states
   */
  useEffect(() => {
    resetCards();
  }, []);

  const resetCards = () => {
    const duplicatedCards = [...initialCards, ...initialCards].map(
      (value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      })
    );
    const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  };

  /**
   * Check for matches whenever two cards are flipped
   */
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard?.value === secondCard?.value) {
        // Mark matched
        setCards((prev) =>
          prev.map((card) =>
            card.value === firstCard?.value
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedCount((prev) => prev + 1);
      } else {
        // Flip them back if not matched
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 1000);
      }

      // Use up one move
      setTotalMoves((prev) => prev - 1);
      setFlippedCards([]);
    }
  }, [flippedCards, cards]);

  /**
   * If we run out of moves and haven't matched everything, game over
   */
  useEffect(() => {
    if (totalMoves === 0 && matchedCount < initialCards.length && gameStarted) {
      setGameOver(true);
    }
  }, [totalMoves, matchedCount, gameStarted]);

  /**
   * Flip a card if allowed
   */
  const handleCardClick = (id: number) => {
    if (totalMoves === 0 || flippedCards.length === 2) return;

    const clickedCard = cards.find((card) => card.id === id);
    if (clickedCard && !clickedCard.isFlipped && !clickedCard.isMatched) {
      setCards((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, isFlipped: true } : card
        )
      );
      setFlippedCards((prev) => [...prev, id]);
    }
  };

  /**
   * Reset the entire game (with 10 moves).
   * Usually called after we've confirmed user is paying again.
   */
  const resetGame = () => {
    resetCards();
    setFlippedCards([]);
    setMatchedCount(0);
    setTotalMoves(10);
    setGameOver(false);
    setGameStarted(true); // Mark as started again
  };

  /**
   * Reset the game if user chooses "No" in the Game Over modal,
   * but do NOT set totalMoves to 10 => remains 0
   */
  const resetGameNoMoves = () => {
    resetCards();
    setFlippedCards([]);
    setMatchedCount(0);
    setTotalMoves(0); // keep at 0
    setGameOver(false);
    setGameStarted(false);
  };

  /**
   * Deposit & stake
   */
  const handleSelectAmount = async (amount: number) => {
    try {
      setInitialModalOpen(false);
    } catch (error: any) {
      console.error("Error in handleSelectAmount:", error);
    }
  };

  /**
   * Called when the user confirms they want to pay 40 to play
   */
  const handleConfirmPlay = () => {
    try {
    } catch (error) {
      console.error("Error in handleConfirmPlay:", error);
      toast.error("An error occurred while confirming play.");
    }
  };

  /**
   * The user clicked "Play" or "Play Again" outside of the game-over scenario
   */
  const handlePlayAgain = () => {
    try {
    } catch (error) {
      console.error("Error in handlePlayAgain:", error);
      toast.error("An error occurred while handling play again.");
    }
  };

  const handleCancelPlay = () => {
    setPlayModalOpen(false);
  };

  /**
   * If user says "Yes" in Game Over modal => Pay 40, resetGame()
   */
  const handleGameOverPlayAgain = () => {
    setGameOver(false);
  };

  /**
   * If user says "No" in Game Over => just reset deck (0 moves)
   */
  const handleGameOverNo = () => {
    resetGameNoMoves();
    // Close the modal
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-techno text-white p-6">
      <h1 className="text-white mb-4 text-center text-4xl font-bold">
        Memory Matching
      </h1>
      {/* Cards Grid */}
      <div className="grid grid-cols-4 gap-6 mt-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`w-32 h-32 bg-blue-700 rounded-lg flex items-center justify-center text-3xl cursor-pointer shadow-lg transform transition-transform duration-300 overflow-hidden ${
              card.isFlipped || card.isMatched
                ? "bg-gray-700 text-white scale-105"
                : "hover:bg-blue-600"
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.isFlipped || card.isMatched ? (
              <img
                src={card.value}
                alt="card image"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <img
                src="https://pbs.twimg.com/profile_images/1722902684196311040/50CwdgeX_400x400.jpg" // Make sure this file exists in your `public/images/` folder
                alt="card back"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
        ))}
      </div>

      {/* If user matched all pairs, show "You Won!" */}
      {matchedCount === initialCards.length && (
        <p className="text-2xl mt-4">🎉 You Won! 🎉</p>
      )}

      {/* 1. Initial Modal for deposit & stake */}
      {initialModalOpen && !gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-[85%] max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <IoClose onClick={closeInitialModal} className="cursor-pointer" />
            <h2 className="mb-4 text-center text-2xl font-semibold text-blue-500">
              Choose Deposit & Stake Amount
            </h2>
            <p className="mb-4 text-center text-gray-700 dark:text-gray-300">
              Select an amount to deposit and stake:
            </p>
            <div className="flex flex-col gap-2">
              <button
                className={
                  "group/button rounded-lg bg-[#222222] text-black mt-6"
                }
              >
                <span
                  className={
                    "block -translate-x-1 uppercase whitespace-nowrap -translate-y-1 rounded-lg border-2 border-[#222222] bg-green-400 px-4 py-1 text-sm font-medium tracking-tight transition-all group-hover/button:-translate-y-2 group-active/button:translate-x-0 group-active/button:translate-y-0"
                  }
                >
                  Reset Game
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Play Confirmation Modal */}
      {playModalOpen && !gameStarted && !gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <IoClose onClick={closePlayModal} className="cursor-pointer" />
            <h2 className="mb-4 text-center text-2xl font-semibold text-blue-500">
              Ready to Play?
            </h2>
            <p className="mb-4 text-center text-gray-700 dark:text-gray-300">
              You need to pay <span className="font-bold">40 WIN</span> from
              your deposit to start.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmPlay}
                className="btn bg-green-500 hover:bg-green-600 focus:ring-green-300 rounded-lg px-4 py-2"
              >
                Confirm
              </button>
              <button
                onClick={handleCancelPlay}
                className="btn bg-gray-500 hover:bg-gray-600 focus:ring-gray-300 rounded-lg px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <IoClose onClick={closeGameOverModal} className="cursor-pointer" />
            <h2 className="text-red-500 mb-4 text-center text-2xl font-semibold">
              Game Over
            </h2>
            <p className="mb-4 text-center text-gray-700 dark:text-gray-300">
              You ran out of moves! Do you want to play again?
            </p>
            <div className="flex justify-center gap-4">
              {/* "YES" => Check deposit, subtract 40, resetGame() */}
              <button
                onClick={handleGameOverPlayAgain}
                className="bg-green-500 hover:bg-green-600 focus:ring-green-300 rounded-lg px-4 py-2"
              >
                Yes
              </button>
              {/* "NO" => Reset game with 0 moves */}
              <button
                onClick={handleGameOverNo}
                className="bg-gray-500 hover:bg-gray-600 focus:ring-gray-300 rounded-lg px-4 py-2"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. "Play Again?" Modal (if user chooses to start a new game but isn't game-over) */}
      {playAgainModalOpen && !gameOver && !gameStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-[85%] max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <IoClose onClick={closePlayAgainModal} className="cursor-pointer" />
            <h2 className="mb-4 text-center text-2xl font-semibold text-blue-500">
              Play Again?
            </h2>
            <p className="mb-4 text-center text-gray-700 dark:text-gray-300">
              You have enough funds to start a new game. Would you like to
              continue?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePlayAgain}
                className="btn bg-green-500 hover:bg-green-600 focus:ring-green-300 rounded-lg px-4 py-2"
              >
                Confirm
              </button>
              <button
                onClick={() => setPlayAgainModalOpen(false)}
                className="btn bg-gray-500 hover:bg-gray-600 focus:ring-gray-300 rounded-lg px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
