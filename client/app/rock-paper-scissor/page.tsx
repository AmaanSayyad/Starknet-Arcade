"use client";
import { useState, useEffect } from "react";

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState("");
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [countdown, setCountdown] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const choices = ["rock", "paper", "scissors"];
  const choiceEmojis = {
    rock: "👊",
    paper: "✋",
    scissors: "✌️",
  };
  const getComputerChoice = () => {
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
  };

  const determineWinner = (player, computer) => {
    if (player === computer) return "draw";
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "player";
    }
    return "computer";
  };

  const handleChoiceClick = (choice) => {
    if (countdown !== null) return;

    setPlayerChoice(choice);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      const computer = getComputerChoice();
      setComputerChoice(computer);
      const gameResult = determineWinner(playerChoice, computer);
      setResult(gameResult);

      // Update score
      if (gameResult === "player") {
        setScore((prev) => ({ ...prev, player: prev.player + 1 }));
      } else if (gameResult === "computer") {
        setScore((prev) => ({ ...prev, computer: prev.computer + 1 }));
      }

      // Add to history
      setGameHistory((prev) => [
        {
          id: Date.now(),
          player: playerChoice,
          computer,
          result: gameResult,
        },
        ...prev,
      ]);

      setCountdown(null);
    }
  }, [countdown, playerChoice]);

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult("");
  };

  const resetScore = () => {
    setScore({ player: 0, computer: 0 });
    setGameHistory([]);
    resetGame();
  };

  const renderResultMessage = () => {
    if (result === "draw") return "It's a draw!";
    if (result === "player") return "You win!";
    if (result === "computer") return "Computer wins!";
    return "";
  };

  const getResultClass = (gameResult) => {
    if (gameResult === "draw") return "text-yellow-500";
    if (gameResult === "player") return "text-green-500";
    if (gameResult === "computer") return "text-red-500";
    return "";
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-80">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>
      <main className=" relative z-10">
        <div className="flex justify-center gap-4 min-h-screen p-4 ">
          <div className="w-1/3  p-4 font-['Press_Start_2P']">
            {/* Game History */}
            {gameHistory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-blue-500 mb-2">
                  Game History
                </h3>
                <div className="bg-black rounded-md p-2 space-y-2 h-[90vh] border overflow-y-auto">
                  {gameHistory.map((game) => (
                    <div
                      key={game.id}
                      className="flex justify-between items-center p-2 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-4xl">
                          {choiceEmojis[game.player]}
                        </span>
                        <span className="text-gray-400">vs</span>
                        <span className="text-4xl">
                          {choiceEmojis[game.computer]}
                        </span>
                      </div>
                      <span className={getResultClass(game.result)}>
                        {game.result === "draw"
                          ? "Draw"
                          : game.result === "player"
                          ? "Win"
                          : "Loss"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div
            className="w-1/3 flex-1 bg-transparent rounded-none border-4 border-white  relative p-6 space-y-6 font-['Press_Start_2P']  "
          >
            <h1 className="text-3xl font-bold  text-center text-white ">
              Rock Paper Scissors
            </h1>
            {/* Score */}
            <div className="flex justify-between bg-black p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-green-400">You</p>
                <p className="text-4xl font-bold mt-4">{score.player}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-blue-400">Opponent</p>
                <p className="text-4xl font-bold mt-4">{score.computer}</p>
              </div>
            </div>

            {/* Game Area */}
            <div className="flex justify-center items-center space-x-8 h-32">
              <div className="text-center">
                <div className="text-6xl mb-2">
                  {playerChoice ? choiceEmojis[playerChoice] : "❓"}
                </div>
                <p className="text-xl text-green-400">You</p>
              </div>

              <div className="text-3xl font-bold text-gray-600">
                {countdown !== null ? countdown : "VS"}
              </div>

              <div className="text-center">
                <div className="text-6xl mb-2">
                  {computerChoice ? choiceEmojis[computerChoice] : "❓"}
                </div>
                <p className="text-xl text-blue-400">Opponent</p>
              </div>
            </div>

            {/* Result */}
            {result && (
              <div
                className={`text-center text-xl font-bold mt-8 ${getResultClass(
                  result
                )}`}
              >
                {renderResultMessage()}
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center space-x-6">
              {choices.map((choice) => (
                <button
                  key={choice}
                  onClick={() => handleChoiceClick(choice)}
                  disabled={countdown !== null}
                  className={`p-6 rounded-xl border-4 shadow-xl w-[150px] flex justify-center items-center transform transition-all duration-300 ${
                    playerChoice === choice
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 border-yellow-300 scale-110 text-white"
                      : "bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500 hover:border-yellow-400 hover:scale-105 text-white"
                  } ${
                    countdown !== null
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg hover:shadow-purple-500/30"
                  }`}
                >
                  <div className="relative">
                    <div className="text-6xl mb-2">{choiceEmojis[choice]}</div>
                    <div
                      className={`text-xs font-bold uppercase tracking-wider mt-4 ${
                        playerChoice === choice
                          ? "text-yellow-200"
                          : "text-gray-300"
                      }`}
                    >
                      {choice}
                    </div>
                    {playerChoice === choice && (
                      <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-center space-x-6 mt-4">
  <button
    onClick={resetGame}
    className="w-full py-3 text-white font-extrabold uppercase tracking-wider border-4 border-indigo-900 bg-gradient-to-b from-blue-500 to-indigo-700 rounded-2xl transform transition-all hover:scale-105 shadow-lg hover:shadow-indigo-500/40 relative group"
  >
    <div className="absolute inset-x-0 -top-px h-2 bg-blue-300 opacity-50 rounded-t-xl"></div>
    <div className="px-6 py-2 bg-gradient-to-b from-blue-600 to-blue-800 rounded-xl border-2 border-indigo-800 transform group-hover:-translate-y-1 group-active:translate-y-1 transition-transform">
      NEW ROUND
    </div>
  </button>

  <button
    onClick={resetScore}
    className="w-full py-3 text-white font-extrabold uppercase tracking-wider border-4 border-red-900 bg-gradient-to-b from-red-500 to-red-700 rounded-2xl transform transition-all hover:scale-105 shadow-lg hover:shadow-red-500/40 relative group"
  >
    <div className="absolute inset-x-0 -top-px h-2 bg-red-300 opacity-50 rounded-t-xl"></div>
    <div className="px-6 py-2 bg-gradient-to-b from-red-600 to-red-800 rounded-xl border-2 border-red-800 transform group-hover:-translate-y-1 group-active:translate-y-1 transition-transform">
      RESET GAME
    </div>
  </button>
</div>
          </div>
        </div>
      </main>
    </div>
  );
}
