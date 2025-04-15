"use client";
import { useState, useEffect, useRef } from "react";
import ControllerConnector from "@cartridge/connector/controller";
import { useAccount, useConnect } from "@starknet-react/core";
import { useSnakeLadderGameContract } from "../hooks/useSnakeLadderGameContract";
import toast from "react-hot-toast";

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

  const { connectors } = useConnect();
  const { address, account } = useAccount();
  const [username, setUsername] = useState();
  
  // Only create audio refs after component mounts (client-side only)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if code is running in browser
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    // Initialize audio only on client side
    if (isBrowser) {
      audioRef.current = new Audio("sounds/roullete/ambient-sounds.mp3");
      
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
      // Call the contract's rollForComputer function
      const result = await rollForComputer();

      if (result) {
        const rollValue = result;
        setDiceValue(Number(rollValue));

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

  const movePlayer = (steps: number) => {
    setIsMoving(true);

    // 🔊 Play move sound - only on client side
    if (isBrowser) {
      const moveSound = new Audio("/sounds/move.mp3");
      moveSound.play().catch(err => console.log("Move sound error:", err));
    }

    const currentPosition =
      turn === "player" ? playerPosition : computerPosition;
    let newPosition = currentPosition + steps;

    // Cannot move beyond 100
    if (newPosition > 100) {
      newPosition = currentPosition;
      setMessage(`Can't move beyond 100. You need exact number.`);

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
      
      // Play win sound - only on client side
      if (isBrowser) {
        const winSound = new Audio("/sounds/win.mp3");
        winSound.play().catch(err => console.log("Win sound error:", err));
      }
      
      setMessage(
        `${turn === "player" ? "You" : "Opponent"} reached 100! ${
          turn === "player" ? "You win!" : "Opponent wins!"
        }`
      );
      setIsMoving(false);
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
    <div className="flex font-techno items-center mt-5 justify-around p-4 container mx-auto">
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Snake and Ladder Game</h1>

        <div className="relative w-full max-w-3xl aspect-square mb-4">
          {/* Game board */}
          <img
            src="https://img.freepik.com/premium-vector/snakes-ladders-board-game-template-kids-holiday_600323-3075.jpg?semt=ais_hybrid&w=740"
            alt="Snake and Ladder Board"
            className="w-full h-full"
          />

          {/* Player piece */}
          <div
            className="absolute w-6 h-6 rounded-full bg-blue-500 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-10"
            style={{
              top: `${playerPos.top}px`,
              left: `${playerPos.left}px`,
            }}
          />

          {/* Computer piece */}
          <div
            className="absolute w-6 h-6 rounded-full bg-red-500 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-10"
            style={{
              top: `${computerPos.top}px`,
              left: `${computerPos.left}px`,
            }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center w-full max-w-md mx-auto p-6 bg-transparent shadow-xl rounded-2xl">
        {/* Header Section */}
        <div className="flex w-full justify-between items-center mb-6">
          {/* Player */}
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-md animate-pulse"></div>
            <p className="text-blue-500 font-medium">You</p>
          </div>

          {/* Dice */}
          <div
            className={`w-20 h-20 border-4 border-gray-300 rounded-xl flex items-center justify-center text-3xl font-black text-gray-700 bg-gray-100 shadow-inner ${
              isRolling && turn === "player" ? "animate-bounce" : ""
            }`}
            onClick={shouldShowRollButton ? handleRoll : undefined}
            style={{
              cursor: shouldShowRollButton ? "pointer" : "default",
            }}
          >
            {diceValue || "?"}
          </div>

          {/* Computer */}
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-md"></div>
            <p className="text-red-500 font-medium">Opponent</p>
          </div>
        </div>

        {/* Table of Positions */}
        <table className="table-auto w-full text-left mb-6 border border-gray-700 rounded-lg overflow-hidden shadow-md bg-black text-white">
          <thead className="bg-gray-900 text-white border-b border-gray-700">
            <tr>
              <th className="px-4 py-2 border-r border-gray-700">Player</th>
              <th className="px-4 py-2 border-r border-gray-700">Position</th>
              <th className="px-4 py-2">Stake Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="hover:bg-gray-800 transition border-b border-gray-700">
              <td className="px-4 py-3 font-medium text-blue-400 border-r border-gray-700">
                You
              </td>
              <td className="px-4 py-3 text-white border-r border-gray-700">
                {playerPosition}
              </td>
              <td className="px-4 py-3 text-green-400">{stakeAmount} STRK</td>
            </tr>
            <tr className="hover:bg-gray-800 transition border-b border-gray-700">
              <td className="px-4 py-3 font-medium text-red-400 border-r border-gray-700">
                Opponent
              </td>
              <td className="px-4 py-3 text-white border-r border-gray-700">
                {computerPosition}
              </td>
              <td className="px-4 py-3 text-green-400">{stakeAmount} STRK</td>
            </tr>

            {/* Gap Row */}
            <tr>
              <td colSpan={4} className="py-2"></td>
            </tr>

            {/* Status Row */}
            <tr className="bg-gray-950">
              <td
                colSpan={4}
                className="px-4 py-4 text-center border-t border-gray-700"
              >
                <p className="text-md text-gray-400 italic mb-1">{message}</p>
                <p className="text-md font-bold text-blue-500">
                  {!winner && gameCreated
                    ? `${turn === "player" ? "Your" : "Opponent's"} turn`
                    : ""}
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Stake Amount Input (when game not created) */}
        {!gameCreated && !winner && (
          <div className="w-full mb-4">
           
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              min="1"
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!gameCreated && (
            <button
              onClick={createNewGame}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition"
              disabled={!connected}
            >
              🎮 Create Game
            </button>
          )}

          {shouldShowRollButton && (
            <button
              onClick={handleRoll}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
            >
              🎲 Roll Dice
            </button>
          )}

          {(
            <button
              onClick={endGameHandle}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition"
            >
              End Game
            </button>
          )}

          {winner && (
            <button
              onClick={resetGame}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition"
            >
              🔄 Play Again
            </button>
          )}
        </div>

        {/* Sound Toggle Button */}
        <div
          className="button button-sound cursor-pointer mt-4"
          onClick={toggleSound}
        >
          <div className="circle-overlay"></div>
          <div className="button-text">{isPlaying ? "PAUSE" : "SOUNDS"}</div>
        </div>

        {/* Connection Status */}
        <div className="mt-4 text-sm">
          {connected ? (
            <span className="text-green-500">✓ Wallet Connected</span>
          ) : (
            <span className="text-red-500">✗ Wallet Not Connected</span>
          )}
        </div>
      </div>
    </div>
  );
}