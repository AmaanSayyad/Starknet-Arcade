"use client";
import { useState, useEffect, useRef } from "react";
import ControllerConnector from "@cartridge/connector/controller";
import { useAccount, useConnect } from "@starknet-react/core";
import { useSnakeLadderGameContract } from "../hooks/useSnakeLadderGameContract";
export default function SnakeAndLadderGame() {
  const [playerPosition, setPlayerPosition] = useState(1);
  const [computerPosition, setComputerPosition] = useState(1);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [turn, setTurn] = useState("player"); // 'player' or 'computer'
  const [message, setMessage] = useState("Roll the dice to start!");
  const [winner, setWinner] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [connected, setConnected] = useState(false);
  const { connectors } = useConnect();
  const { address, account } = useAccount();
  const [username, setUsername] = useState<string | undefined>();
  useEffect(() => {
    if (!address) return;
    const controller = connectors.find((c) => c instanceof ControllerConnector);
    if (controller) {
      controller.username()?.then((n) => setUsername(n));
      setConnected(true);
    }
  }, [address, connectors]);

  const { enroll, roll } = useSnakeLadderGameContract(connected, account);


  const enrollSnakeLadder = async ()=>{
    try {
      let res = await enroll(100);
    } catch (error) {
      console.log(error);
    }
  }

  // Define snakes and ladders on the board
  const snakesAndLadders: Record<number, number> = {
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
  const audioRef = useRef(new Audio("sounds/roullete/ambient-sounds.mp3"));
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // Play sound initially
    audioRef.current.play();
    // Cleanup on unmount
    return () => {
      audioRef.current.pause();
    };
  }, []);

  const toggleSound = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const rollDice = () => {
    if (isRolling || isMoving || winner) return;

    const moveSound = new Audio("/sounds/dice.mp3");
    moveSound.play();
    setIsRolling(true);
    setMessage("Rolling dice...");

    // Simulate dice rolling animation
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);

    // Stop rolling after 1 second
    setTimeout(() => {
      clearInterval(rollInterval);
      const value = Math.floor(Math.random() * 6) + 1;
      setDiceValue(value);
      setIsRolling(false);

      // Move player
      movePlayer(value);
    }, 1000);
  };

  const movePlayer = (steps: number) => {
    setIsMoving(true);

    // 🔊 Play move sound
    const moveSound = new Audio("/sounds/move.mp3");
    moveSound.play();

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
      const moveSound = new Audio("/sounds/win.mp3");
      moveSound.play();
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
    setTurn(turn === "player" ? "opponent" : "player");
  };

  // Computer turn logic
  useEffect(() => {
    if (turn === "opponent" && !winner && !isMoving) {
      const timeout = setTimeout(() => {
        rollDice();
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [turn, winner, isMoving]);

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
    setMessage("Roll the dice to start!");
    setWinner(null);
    setIsMoving(false);
  };

  // Player piece position coordinates
  const playerPos = getPositionCoordinates(playerPosition);
  const computerPos = getPositionCoordinates(computerPosition);

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
              isRolling ? "animate-bounce" : ""
            }`}
            onClick={
              turn === "player" && !isMoving && !winner ? rollDice : undefined
            }
            style={{
              cursor:
                turn === "player" && !isMoving && !winner
                  ? "pointer"
                  : "default",
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
              <th className="px-4 py-2 border-r border-gray-700">Address</th>
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
              <td className="px-4 py-3 text-xs text-gray-300 break-all border-r border-gray-700">
                oxsqsqs
              </td>
              <td className="px-4 py-3 text-green-400">10 STRK</td>
            </tr>
            <tr className="hover:bg-gray-800 transition border-b border-gray-700">
              <td className="px-4 py-3 font-medium text-red-400 border-r border-gray-700">
                Opponent
              </td>
              <td className="px-4 py-3 text-white border-r border-gray-700">
                {computerPosition}
              </td>
              <td className="px-4 py-3 text-xs text-gray-300 break-all border-r border-gray-700">
                oxsqsqs
              </td>
              <td className="px-4 py-3 text-green-400">10 STRK</td>
            </tr>

            {/* Gap Row */}
            <tr>
              <td colSpan="4" className="py-2"></td>
            </tr>

            {/* Status Row */}
            <tr className="bg-gray-950">
              <td
                colSpan="4"
                className="px-4 py-4 text-center border-t border-gray-700"
              >
                <p className="text-md text-gray-400 italic mb-1">{message}</p>
                <p className="text-md font-bold text-blue-500">
                  {!winner
                    ? `${turn === "player" ? "Your" : "Opponent"} turn`
                    : ""}
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {turn === "player" && !isMoving && !winner && (
            <button
              onClick={rollDice}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
              disabled={isRolling || isMoving}
            >
              🎲 Roll Dice
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

          <button onClick={enrollSnakeLadder}>Enroll</button>
        </div>
        <div
          className="button button-sound cursor-pointer mt-4"
          onClick={toggleSound}
        >
          <div className="circle-overlay"></div>
          <div className="button-text">{isPlaying ? "PAUSE" : "SOUNDS"}</div>
        </div>
      </div>
    </div>
  );
}
