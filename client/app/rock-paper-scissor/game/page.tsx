"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import io, { Socket } from "socket.io-client";

// Define types for our game state
interface Player {
  id: string;
  name: string;
  choice: string | null;
  ready: boolean;
}

interface GameState {
  gameId: string;
  players: Record<string, Player>;
  round: number;
  results: {
    winner: string | null;
    player1Choice: string | null;
    player2Choice: string | null;
  };
  status: "waiting" | "ready" | "choosing" | "results";
}

let socket: Socket;

export default function Game() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const isHost = searchParams.get("isHost");
  const code = searchParams.get("code");


  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameCode, setGameCode] = useState<string>("");
  const [opponentName, setOpponentName] = useState<string>("");
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [roundResults, setRoundResults] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, opponent: 0 });

  const choices = ["rock", "paper", "scissors"];

  const choiceEmojis: Record<string, string> = {
    rock: "👊",
    paper: "✋",
    scissors: "✌️",
  };

  useEffect(() => {
    // Wait for router to be ready
    if (!router.isReady) return;

    // Initialize socket connection
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();

      socket.on("connect", () => {
        setConnected(true);
        setSocketId(socket.id);

        // If hosting, create a new game
        if (isHost === "true") {
          socket.emit("createGame", { playerName: name });
        }
        // If joining, connect to existing game
        else if (code) {
          socket.emit("joinGame", { playerName: name, gameId: code });
        }
      });

      socket.on("gameCreated", (data) => {
        setGameState(data.gameState);
        setGameCode(data.gameState.gameId);
      });

      socket.on("playerJoined", (data) => {
        setGameState(data.gameState);

        // Find opponent's name
        const players = Object.values(data.gameState.players);
        if (players.length === 2) {
          const opponent = players.find((p) => p.id !== socketId);
          if (opponent) {
            setOpponentName(opponent.name);
          }
        }
      });

      socket.on("gameUpdated", (data) => {
        setGameState(data.gameState);

        // If we're at results stage, calculate who won
        if (data.gameState.status === "results") {
          const { results } = data.gameState;
          if (results.winner === socketId) {
            setRoundResults("You win this round!");
            setScore((prev) => ({ ...prev, player: prev.player + 1 }));
          } else if (results.winner === "draw") {
            setRoundResults("It's a draw!");
          } else if (results.winner) {
            setRoundResults("Opponent wins this round!");
            setScore((prev) => ({ ...prev, opponent: prev.opponent + 1 }));
          }

          // Reset choice for next round
          setTimeout(() => {
            setPlayerChoice(null);
          }, 2000);
        }
      });

      socket.on("disconnect", () => {
        setConnected(false);
      });

      socket.on("opponentLeft", () => {
        alert("Your opponent left the game");
        router.push("/");
      });
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [router.isReady, isHost, code, name, router, socketId]);

  // Update opponent name when game state changes
  useEffect(() => {
    if (gameState && socketId) {
      const players = Object.values(gameState.players);
      if (players.length === 2) {
        const opponent = players.find((p) => p.id !== socketId);
        if (opponent) {
          setOpponentName(opponent.name);
        }
      }
    }
  }, [gameState, socketId]);

  const handleChoiceClick = (choice: string) => {
    if (!gameState || gameState.status !== "choosing" || playerChoice) return;

    setPlayerChoice(choice);
    socket.emit("makeChoice", { gameId: gameState.gameId, choice });
  };

  const handleReadyClick = () => {
    if (!gameState) return;
    socket.emit("playerReady", { gameId: gameState.gameId });
  };

  const leaveGame = () => {
    router.push("/");
  };

  // Display loading until connected
  if (!connected || !gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl">Connecting to game...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Head>
        <title>Rock Paper Scissors - Game</title>
      </Head>

      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Rock Paper Scissors
          </h1>

          {gameState.status === "waiting" && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              Game Code: <span className="font-mono font-bold">{gameCode}</span>
            </div>
          )}
        </div>

        {/* Game Status */}
        {gameState.status === "waiting" && (
          <div className="text-center py-6">
            <div className="text-xl mb-4">Waiting for opponent to join...</div>
            <div className="bg-blue-50 p-4 rounded-lg inline-block">
              <p>Share this code with your friend:</p>
              <div className="text-3xl font-mono font-bold text-blue-600">
                {gameCode}
              </div>
            </div>
          </div>
        )}

        {gameState.status === "ready" && (
          <div className="text-center py-6">
            <div className="text-xl mb-4">{opponentName} has joined!</div>
            <button
              onClick={handleReadyClick}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
            >
              Ready to Play!
            </button>
          </div>
        )}

        {(gameState.status === "choosing" ||
          gameState.status === "results") && (
          <>
            {/* Score */}
            <div className="flex justify-between bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-500">You ({name})</p>
                <p className="text-2xl font-bold">{score.player}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">{opponentName}</p>
                <p className="text-2xl font-bold">{score.opponent}</p>
              </div>
            </div>

            <div className="text-center text-lg">Round {gameState.round}</div>

            {/* Game Area */}
            <div className="flex justify-center items-center space-x-8 h-32">
              <div className="text-center">
                <div className="text-6xl mb-2">
                  {playerChoice
                    ? choiceEmojis[playerChoice]
                    : gameState.status === "choosing"
                    ? "❓"
                    : "🤔"}
                </div>
                <p className="text-sm text-gray-600">You</p>
              </div>

              <div className="text-3xl font-bold text-gray-600">VS</div>

              <div className="text-center">
                <div className="text-6xl mb-2">
                  {gameState.status === "results" &&
                  gameState.results.player2Choice
                    ? choiceEmojis[gameState.results.player2Choice]
                    : gameState.players[
                        Object.keys(gameState.players).find(
                          (id) => id !== socketId
                        ) || ""
                      ]?.choice
                    ? "✅"
                    : "❓"}
                </div>
                <p className="text-sm text-gray-600">{opponentName}</p>
              </div>
            </div>

            {/* Result */}
            {gameState.status === "results" && roundResults && (
              <div
                className={`text-center text-xl font-bold ${
                  roundResults.includes("You win")
                    ? "text-green-500"
                    : roundResults.includes("draw")
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {roundResults}
              </div>
            )}

            {/* Controls */}
            {gameState.status === "choosing" && !playerChoice && (
              <div className="text-center">
                <p className="mb-3">Make your choice:</p>
                <div className="flex justify-center space-x-4">
                  {choices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => handleChoiceClick(choice)}
                      className="p-4 rounded-full text-3xl bg-gray-100 hover:bg-gray-200 hover:scale-105 transform transition-transform"
                    >
                      {choiceEmojis[choice]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {gameState.status === "choosing" && playerChoice && (
              <div className="text-center text-lg text-gray-600">
                Waiting for opponent to choose...
              </div>
            )}
          </>
        )}

        <button
          onClick={leaveGame}
          className="w-full py-2 mt-6 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition"
        >
          Leave Game
        </button>
      </div>
    </div>
  );
}
