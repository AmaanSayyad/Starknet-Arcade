"use client";
import { useState, useEffect, useRef } from "react";
import ControllerConnector from "@cartridge/connector/controller";
import { useAccount, useConnect } from "@starknet-react/core";
import { useSnakeLadderGameContract } from "../hooks/useSnakeLadderGameContract";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";

// Game components
import GameBoard from "./components/GameBoard";
import GameControls from "./components/GameControls";
import GameHistory from "./components/GameHistory";
import GameRules from "./components/GameRules";
import PlayerProfileCard from "./components/PlayerProfileCard";

export default function SnakeAndLadderGame() {
  const [playerPosition, setPlayerPosition] = useState(1);
  const [computerPosition, setComputerPosition] = useState(1);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [turn, setTurn] = useState("player"); // 'player' or 'opponent'
  const [message, setMessage] = useState("Roll the dice to start!");
  const [winner, setWinner] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [connected, setConnected] = useState(false);
  const [gameCreated, setGameCreated] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(true);
  const [gameHistory, setGameHistory] = useState<Array<{
    player: string;
    action: string;
    position: number;
    diceValue?: number;
  }>>([]);
  const [showRules, setShowRules] = useState(false);

  const { connectors } = useConnect();
  const { address, account } = useAccount();
  const [username, setUsername] = useState();
  
  // Only create audio refs after component mounts (client-side only)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const diceSoundRef = useRef<HTMLAudioElement | null>(null);
  const moveSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);

  // Check if code is running in browser
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    // Initialize audio only on client side
    if (isBrowser) {
      audioRef.current = new Audio("/sounds/roullete/ambient-sounds.mp3");
      diceSoundRef.current = new Audio("/sounds/dice-roll.mp3");
      moveSoundRef.current = new Audio("/sounds/move.mp3");
      winSoundRef.current = new Audio("/sounds/win.mp3");
      
      // Play sound initially
      audioRef.current.play().catch(error => {
        // Handle autoplay restrictions gracefully
        console.log("Audio autoplay was prevented:", error);
      });
      
      // Cleanup on unmount
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [isBrowser]);

  useEffect(() => {
    if (!address) return;
    const controller = connectors.find((c) => c instanceof ControllerConnector);
    if (controller) {
      controller.username()?.then((n) => setUsername(n));
      setConnected(true);
    }
  }, [address, connectors]);

  const { createGame, roll, rollForComputer, endGame } =
    useSnakeLadderGameContract(connected, account);

  const createNewGame = async () => {
    try {
      const res = await createGame(stakeAmount);
      if (res) {
        setGameCreated(true);
        toast.success("Game created successfully!");
        setMessage("Game created! Roll the dice to start!");
        setTurn("player"); // Ensure player starts first
        
        // Add to game history
        addToHistory("system", "Game created", 0);
      }
    } catch (error) {
      console.error("Game creation error:", error);
      toast.error("Failed to create game");
    }
  };

  const handleRoll = async () => {
    if (isRolling || isMoving || winner || !gameCreated || turn !== "player") return;

    try {
      setIsRolling(true);
      setMessage("Rolling dice...");

      // Play dice sound
      if (diceSoundRef.current) {
        diceSoundRef.current.currentTime = 0;
        diceSoundRef.current.play().catch(err => console.log("Dice sound error:", err));
      }

      // Play roll animation
      const rollInterval = setInterval(() => {
        setDiceValue(Math.floor(Math.random() * 6) + 1);
      }, 100);

      // Call the contract's roll function
      const result = await roll();

      // Stop rolling animation
      clearInterval(rollInterval);

      if (result) {
        const rollValue = result;
        setDiceValue(Number(rollValue));
        setIsRolling(false);

        // Add to game history
        addToHistory("player", "Rolled", playerPosition, Number(rollValue));

        // Move player
        movePlayer(Number(rollValue));
      } else {
        setIsRolling(false);
        setMessage("Roll failed. Try again.");
      }
    } catch (error) {
      console.error("Roll error:", error);
      setIsRolling(false);
      setMessage("Roll failed. Try again.");
    }
  };

  const handleComputerTurn = async () => {
    if (turn !== "opponent" || isRolling || isMoving || winner || !gameCreated)
      return;

    // Set rolling state
    setIsRolling(true);
    setMessage("Opponent is rolling...");

    try {
      // Play dice sound
      if (diceSoundRef.current) {
        diceSoundRef.current.currentTime = 0;
        diceSoundRef.current.play().catch(err => console.log("Dice sound error:", err));
      }

      // Roll animation for computer
      const rollInterval = setInterval(() => {
        setDiceValue(Math.floor(Math.random() * 6) + 1);
      }, 100);

      // Call the contract's rollForComputer function
      const result = await rollForComputer();

      // Stop rolling animation
      clearInterval(rollInterval);

      if (result) {
        const rollValue = result;
        setDiceValue(Number(rollValue));

        // Add to game history
        addToHistory("opponent", "Rolled", computerPosition, Number(rollValue));

        // Move computer piece based on blockchain result
        movePlayer(Number(rollValue));
      } else {
        setIsRolling(false);
        setMessage("Computer roll failed. Trying again...");
        // Auto-retry after a short delay
        setTimeout(() => {
          setIsRolling(false);
          // Turn will still be "opponent", so the useEffect will trigger another try
        }, 2000);
      }
    } catch (error) {
      console.error("Computer roll error:", error);
      setIsRolling(false);
      setMessage("Computer roll failed. Trying again...");
      // Auto-retry after a short delay
      setTimeout(() => {
        setIsRolling(false);
      }, 2000);
    }
  };

  const endGameHandle = async () => {
    try {
      await endGame();
      toast.success("Game ended successfully!");
      
      // Add to game history
      addToHistory("system", "Game ended", 0);
      
      resetGame();
    } catch (error) {
      console.error("End game error:", error);
      toast.error("Failed to end game");
    }
  };

  // Define snakes and ladders on the board
  const snakesAndLadders = {
    // Ladders (start -> end)
    4: 25,
    21: 39,
    26: 67,
    43: 76,
    59: 80,
    71: 89,
    // Snakes (start -> end)
    30: 7,
    47: 13,
    56: 19,
    73: 51,
    82: 42,
    92: 75,
    98: 55,
  };

  const toggleSound = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Play error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  // Add an entry to the game history
  const addToHistory = (player: string, action: string, position: number, diceValue?: number) => {
    const newEntry = {
      player,
      action,
      position,
      diceValue,
      timestamp: new Date().getTime()
    };
    
    setGameHistory(prev => [newEntry, ...prev].slice(0, 10)); // Keep only the last 10 entries
  };

  const movePlayer = (steps: number) => {
    setIsMoving(true);

    // 🔊 Play move sound
    if (moveSoundRef.current) {
      moveSoundRef.current.currentTime = 0;
      moveSoundRef.current.play().catch(err => console.log("Move sound error:", err));
    }

    const currentPosition =
      turn === "player" ? playerPosition : computerPosition;
    let newPosition = currentPosition + steps;

    // Cannot move beyond 100
    if (newPosition > 100) {
      newPosition = currentPosition;
      setMessage(`Can't move beyond 100. You need exact number.`);
      
      // Add to game history
      addToHistory(
        turn === "player" ? "player" : "opponent", 
        "Stayed at", 
        currentPosition
      );

      setTimeout(() => {
        setIsMoving(false);
        switchTurn();
      }, 1000);
      return;
    }

    setMessage(
      `${
        turn === "player" ? "You" : "Opponent"
      } rolled a ${steps}. Moving from ${currentPosition} to ${newPosition}.`
    );

    // Add to game history
    addToHistory(
      turn === "player" ? "player" : "opponent", 
      "Moved to", 
      newPosition
    );

    if (turn === "player") {
      setPlayerPosition(newPosition);
    } else {
      setComputerPosition(newPosition);
    }

    setTimeout(() => {
      checkSnakesAndLadders(newPosition);
    }, 1000);
  };

  const checkSnakesAndLadders = (position: number) => {
    if (snakesAndLadders[position]) {
      const isMoveUp = snakesAndLadders[position] > position;

      setMessage(
        `${turn === "player" ? "You" : "Opponent"} found a ${
          isMoveUp ? "ladder" : "snake"
        }! Moving from ${position} to ${snakesAndLadders[position]}.`
      );
      
      // Add to game history
      addToHistory(
        turn === "player" ? "player" : "opponent", 
        isMoveUp ? "Climbed ladder to" : "Slid down snake to", 
        snakesAndLadders[position]
      );

      // Update position after snake or ladder
      if (turn === "player") {
        setPlayerPosition(snakesAndLadders[position]);
      } else {
        setComputerPosition(snakesAndLadders[position]);
      }

      // Check for win condition after a brief delay
      setTimeout(() => {
        checkWinCondition(snakesAndLadders[position]);
      }, 1000);
    } else {
      // Check for win condition
      checkWinCondition(position);
    }
  };

  const checkWinCondition = (position: number) => {
    if (position === 100) {
      setWinner(turn);
      
      // Play win sound
      if (winSoundRef.current) {
        winSoundRef.current.play().catch(err => console.log("Win sound error:", err));
      }
      
      const winMessage = `${turn === "player" ? "You" : "Opponent"} reached 100! ${
        turn === "player" ? "You win!" : "Opponent wins!"
      }`;
      
      setMessage(winMessage);
      
      // Add to game history
      addToHistory(
        turn === "player" ? "player" : "opponent", 
        "Won the game at position", 
        100
      );
      
      setIsMoving(false);
      
      // Show toast notification
      toast.success(winMessage, {
        icon: "🏆",
        duration: 5000
      });
    } else {
      setIsMoving(false);
      switchTurn();
    }
  };

  const switchTurn = () => {
    // Important: Reset isRolling to ensure buttons show correctly
    setIsRolling(false);
    setTurn(turn === "player" ? "opponent" : "player");
  };

  // Computer turn logic
  useEffect(() => {
    if (
      turn === "opponent" &&
      !winner &&
      !isMoving &&
      !isRolling &&
      gameCreated
    ) {
      const timeout = setTimeout(() => {
        handleComputerTurn();
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [turn, winner, isMoving, isRolling, gameCreated]);

  // Calculate position coordinates from board number
  const getPositionCoordinates = (position: number) => {
    // Adjusted for 10x10 grid
    const boardSize = 725; // Board size in pixels
    const cellSize = boardSize / 10;

    // Calculate row (0-9, bottom to top)
    const row = 9 - Math.floor((position - 1) / 10);
    const rowFromBottom = Math.floor((position - 1) / 10);

    let col;
    if (rowFromBottom % 2 === 0) {
      // Even row from bottom (1-10, 21-30, etc.) → left to right
      col = (position - 1) % 10;
    } else {
      // Odd row from bottom → right to left
      col = 9 - ((position - 1) % 10);
    }

    return {
      top: row * cellSize + cellSize / 2,
      left: col * cellSize + cellSize / 2,
    };
  };

  const resetGame = () => {
    setPlayerPosition(1);
    setComputerPosition(1);
    setDiceValue(null);
    setIsRolling(false);
    setTurn("player");
    setMessage("Create a new game to start!");
    setWinner(null);
    setIsMoving(false);
    setGameCreated(false);
    // Clear game history
    setGameHistory([]);
  };

  // Player piece position coordinates
  const playerPos = getPositionCoordinates(playerPosition);
  const computerPos = getPositionCoordinates(computerPosition);

  // Debug what's happening with the Roll Dice button
  const shouldShowRollButton = 
    gameCreated && 
    turn === "player" && 
    !isMoving && 
    !winner && 
    !isRolling;

  return (
    <div className="min-h-screen bg-gray-900 pb-16">
      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-blue-900 py-8 mb-8">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl font-bold text-white font-techno mb-2">
                <span className="text-blue-400">Starknet</span> Snake & Ladder
              </h1>
              <p className="text-gray-300 max-w-2xl">
                The classic game reimagined for StarkNet blockchain. Climb the ladders of success, but beware of the snakes that will bring you down!
              </p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowRules(!showRules)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showRules ? "Hide Rules" : "Game Rules"}
              </button>
              
              <Link href="/leaderboard">
                <button className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg transition-all flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Leaderboard
                </button>
              </Link>
              
              {/* Sound Toggle Button */}
              <button
                onClick={toggleSound}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all flex items-center"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.784 2.5M5.64 5.64a9 9 0 0112.72 0M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m-3.536 1.464a7.975 7.975 0 01-5.784-2.5M5.64 5.64a9 9 0 0112.72 0" />
                  </svg>
                )}
                {isPlaying ? "Mute" : "Sound"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game Rules Modal */}
      {showRules && (
        <GameRules onClose={() => setShowRules(false)} />
      )}
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Player Cards - Left Column */}
          <div className="lg:col-span-3 space-y-4">
            {/* You */}
            <PlayerProfileCard 
              isPlayer={true}
              position={playerPosition}
              stakeAmount={stakeAmount}
              isCurrentTurn={turn === "player" && !winner}
              username={username || "You"}
            />
            
            {/* Opponent */}
            <PlayerProfileCard 
              isPlayer={false}
              position={computerPosition}
              stakeAmount={stakeAmount}
              isCurrentTurn={turn === "opponent" && !winner}
              username="Opponent"
            />
            
            {/* Game History */}
            <GameHistory history={gameHistory} />
          </div>
          
          {/* Game Board - Center Column */}
          <div className="lg:col-span-6">
            <GameBoard 
              playerPosition={playerPosition}
              computerPosition={computerPosition}
              getPositionCoordinates={getPositionCoordinates}
              snakesAndLadders={snakesAndLadders}
            />
          </div>
          
          {/* Game Controls - Right Column */}
          <div className="lg:col-span-3">
            <GameControls 
              diceValue={diceValue}
              isRolling={isRolling}
              turn={turn}
              message={message}
              winner={winner}
              gameCreated={gameCreated}
              stakeAmount={stakeAmount}
              setStakeAmount={setStakeAmount}
              connected={connected}
              shouldShowRollButton={shouldShowRollButton}
              createNewGame={createNewGame}
              handleRoll={handleRoll}
              endGameHandle={endGameHandle}
              resetGame={resetGame}
            />
          </div>
        </div>
      </div>
    </div>
  );
}