"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Paper from "../components/rock-paper-scissor-components/paper";
import Scissors from "../components/rock-paper-scissor-components/scissors";
import Rock from "../components/rock-paper-scissor-components/rock";
import { toast } from "react-hot-toast";
import CreateGameRoom, { GameTypes } from "../components/CreateGameRoom";
const socket = io("http://localhost:4000");

interface Player {
  username: string;
}

interface Choices {
  [key: string]: string;
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
  const [playerChoices, setPlayerChoices] = useState<Choices>({});

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

    socket.on(
      "roundResult",
      (data: {
        result: string;
        round: number;
        score: any;
        choices: Choices;
      }) => {
        setRoundResult(data.result);
        setScore(data.score);
        setPlayerChoices(data.choices);

        setTimeout(() => {
          setRound(data.round);
          setRoundResult("");
          setChoice("");
          setPlayerChoices({});
        }, 4000);
      }
    );
    
    socket.on("gameWinner", (data: { winner: string }) => {
      setGameWinner(data.winner);
    });

    return () => {
      socket.off("players");
      socket.off("roundResult");
      socket.off("gameWinner");
    };
  }, [username]); // Added username to dependency array

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

  const handleRoomJoin = ({ username, roomId, joined }) => {
    setUsername(username);
    setRoomId(roomId);
    setJoined(joined);
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
    setPlayerChoices({});
  };

  // Get opponent's username
  const getOpponentName = () => {
    return players.find(player => player.username !== username)?.username || "";
  };

  // Render choice component based on choice string
  const renderChoice = (choiceType: string) => {
    switch(choiceType) {
      case "rock": return <Rock />;
      case "paper": return <Paper />;
      case "scissors": return <Scissors />;
      default: return null;
    }
  };

  return (
    <>
        <main className="flex flex-col font-techno mt-10 items-center justify-center min-h-screen bg-transparent text-white px-4">
        <h1 className="text-4xl font-extrabold mt-1">RPS Multiplayer</h1>

        <CreateGameRoom 
          gameType={GameTypes.RPS} 
          socket={socket} 
          onJoin={handleRoomJoin}
          buttonText="Create RPS Game Room"
          buttonClassName="mb-6 px-6 py-2 mt-8 bg-indigo-600 hover:bg-indigo-700 rounded text-lg text-white"
        />

        {joined && (
          <div className="mt-6 w-full h-[90vh] p-6 rounded-lg grid grid-cols-2 overflow-hidden">
            <div className="flex flex-col p-6 rounded-lg shadow-lg">
              <p className="text-md mb-2 text-gray-300">
                You: <strong className="text-blue-400">{username}</strong>
              </p>

              <p className="text-md mt-4 font-semibold mb-2 text-gray-200">
                Players:
              </p>
              <ul className="mb-4 list-none pl-0 text-gray-300">
                {players.map((p, i) => (
                  <li
                    key={p.username}
                    className="py-1 px-2 rounded mb-2"
                  >
                    {i+1}. {p.username}
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <p className="font-semibold text-white mb-2">Scoreboard:</p>
                <table className="table-auto border-collapse border border-gray-700 text-sm text-gray-300 w-full">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="border border-gray-700 px-4 py-2">
                        Player
                      </th>
                      <th className="border border-gray-700 px-4 py-2">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(score).map(([name, s]) => (
                      <tr key={name} className="hover:bg-gray-700">
                        <td className="border border-gray-700 px-4 py-2 text-center">
                          {name}
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-center">
                          {s}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="border border-gray-700 px-4 py-2 text-center text-red-500 font-semibold">
                        Round
                      </td>
                      <td className="border border-gray-700 px-4 py-2 text-center text-red-500 font-semibold">
                        {round}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-10">
              {players.length === 2 && !gameWinner && (
                <>
                  <p className="text-lg font-semibold text-center">
                    Round {round}: Make your choice
                  </p>

                  <div className="mt-4">
                    {choice ? (
                      <>
                        <div className="flex flex-col items-center justify-center h-full mt-10">
                          <table className="table-auto border-collapse border border-gray-700 text-sm text-gray-300 w-full max-w-md">
                            <thead>
                              <tr className="bg-gray-800">
                                <th className="border border-gray-700 px-4 py-2 text-center">
                                  You ({username})
                                </th>
                                <th className="border border-gray-700 px-4 py-2 text-center">
                                  Opponent ({getOpponentName()})
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-gray-700 px-4 py-2 text-center relative">
                                  {renderChoice(choice)}
                                  {roundResult === "win" && (
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                      <div className="w-16 h-16 border-4 border-white rounded-full"></div>
                                    </div>
                                  )}
                                </td>
                                <td className="border border-gray-700 px-4 py-2 text-center relative">
                                  {playerChoices[getOpponentName()] ? (
                                    renderChoice(playerChoices[getOpponentName()])
                                  ) : (
                                    <p className="text-yellow-400">
                                      Waiting for opponent's choice...
                                    </p>
                                  )}
                                  {roundResult === "lose" && (
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                      <div className="w-16 h-16 border-4 border-white rounded-full"></div>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex flex-row mt-32 scale-90 sm:scale-125">
                          <div
                            onClick={() => makeChoice("paper")}
                            className="absolute z-10 -mx-48 -my-12 transition hover:scale-125 duration-300 cursor-pointer"
                          >
                            <Paper />
                          </div>
                          <div
                            onClick={() => makeChoice("scissors")}
                            className="absolute z-10 mx-8 -my-12 transition hover:scale-125 duration-300 cursor-pointer"
                          >
                            <Scissors />
                          </div>
                          <div
                            onClick={() => makeChoice("rock")}
                            className="absolute z-10 -mx-20 my-32 transition hover:scale-125 duration-300 cursor-pointer"
                          >
                            <Rock />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {roundResult && (
                    <p className="text-yellow-400 mt-4 text-center text-2xl font-bold">
                      {roundResult === "win" && "You win this round! 🎉"}
                      {roundResult === "lose" && "You lost this round! 😔"}
                      {roundResult === "draw" && "It's a draw! 🤝"}
                    </p>
                  )}
                </>
              )}
            </div>

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

            {players.length < 2 && (
              <p className="text-yellow-400 font-semibold">
                Waiting for another player...
              </p>
            )}
          </div>
        )}
      </main>
    </>
  );
}