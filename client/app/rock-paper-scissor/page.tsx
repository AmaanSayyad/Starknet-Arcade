/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const socket = io("http://localhost:4000");

interface Player {
  username: string;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [choice, setChoice] = useState("");
  const [roundResult, setRoundResult] = useState("");
  const [gameWinner, setGameWinner] = useState("");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState<{ [key: string]: number }>({});

  

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);

    const params = new URLSearchParams(window.location.search);
    const room = params.get("room");
    if (room) setRoomId(room);
  }, []);

  useEffect(() => {
    socket.on("players", (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });
  
    socket.on("roundResult", (data: { result: string; round: number; score: any }) => {
      setRoundResult(data.result);
      setScore(data.score);
      
      // After showing result briefly, reset it and allow next move
      setTimeout(() => {
        setRound(data.round);
        setRoundResult("");
        setChoice(""); // reset for next round
      }, 2000); // show result for 2 seconds
    });
  
    socket.on("gameWinner", (data: { winner: string }) => {
      setGameWinner(data.winner);
    });
  
    return () => {
      socket.off("players");
      socket.off("roundResult");
      socket.off("gameWinner");
    };
  }, []);
  

  const handleCreateRoom = () => {
    const newRoomId = uuidv4().split("-")[0];
    setRoomId(newRoomId);
    window.history.replaceState(null, "", `?room=${newRoomId}`);
  };

  const handleJoin = () => {
    if (!username || !roomId) return;
    localStorage.setItem("username", username);
    socket.emit("join", { username, roomId });
    setJoined(true);
  };

  const makeChoice = (value: string) => {
    if (choice || gameWinner) return;
    setChoice(value);
    socket.emit("choice", { username, choice: value, roomId });
  };

  const resetGame = () => {
    setChoice("");
    setRoundResult("");
    setGameWinner("");
    setRound(1);
    setScore({});
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-extrabold mb-6">🪨 📄 ✂️ RPS Multiplayer</h1>

      {!roomId && (
        <button
          onClick={handleCreateRoom}
          className="mb-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-lg"
        >
          Create Game Room
        </button>
      )}

      {roomId && !joined && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-400">
            Room ID: <code className="text-green-400">{roomId}</code>
          </p>
          <input
            type="text"
            className="p-2 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={handleJoin}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Join Room
          </button>
        </div>
      )}

      {joined && (
        <div className="mt-6 w-full max-w-md">
          <p className="text-sm mb-2">
            You: <strong className="text-blue-400">{username}</strong>
          </p>
          <p className="mb-2 text-gray-400">Share this URL to invite your friend:</p>
          <div className="bg-gray-800 p-2 rounded mb-4 text-sm break-all">{window.location.href}</div>

          <p className="text-lg font-semibold mb-2">Players:</p>
          <ul className="mb-4 list-disc pl-5 text-gray-300">
            {players.map((p) => (
              <li key={p.username}>{p.username}</li>
            ))}
          </ul>

          {players.length === 2 && !gameWinner && (
            <>
              <p className="text-lg font-semibold mb-2">Round {round}: Make your choice</p>
              <div className="flex gap-4 mb-4">
                {["rock", "paper", "scissors"].map((item) => (
                  <button
                    key={item}
                    disabled={!!choice}
                    onClick={() => makeChoice(item)}
                    className={`px-4 py-2 rounded transition-transform transform hover:scale-105 ${
                      choice === item ? "bg-green-500 text-white" : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {choice && <p className="mb-2">You chose: <strong>{choice}</strong></p>}
              {roundResult && <p className="text-yellow-400">{roundResult}</p>}
              <div className="mt-4">
                <p className="font-semibold text-white mb-1">Scoreboard:</p>
                <ul className="text-sm text-gray-300">
                  {Object.entries(score).map(([name, s]) => (
                    <li key={name}>
                      {name}: {s}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {gameWinner && (
            <div className="mt-4 text-center">
              <p className="text-xl font-bold text-green-400 animate-pulse">
                🎉 {gameWinner} wins the game!
              </p>
              <button
                onClick={resetGame}
                className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Play Again
              </button>
            </div>
          )}

          {players.length < 2 && <p className="text-yellow-400 font-semibold">Waiting for another player...</p>}
        </div>
      )}
    </main>
  );
}
