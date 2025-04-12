/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CreateGameRoom.jsx
"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";

// Usage example in RPS game
export const GameTypes = {
    RPS: "rps",
    SNAKE_LADDER: "snakeLadder"
  };


interface CreateGameRoomProps {
  onJoin?: (data: { username: string; roomId: string; joined: boolean }) => void;
  gameType?: string;
  socket: any;
  buttonText?: string;
  buttonClassName?: string;
}

const CreateGameRoom = ({ 
  onJoin, 
  gameType = GameTypes.RPS, 
  socket, 
  buttonText = "Create Game Room",
  buttonClassName = "px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-lg text-white"
}: CreateGameRoomProps) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    // Get username from localStorage if available
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);

    // Check for room ID in URL
    const params = new URLSearchParams(window.location.search);
    const room = params.get("room");
    if (room) setRoomId(room);
  }, []);

  const handleCreateRoom = () => {
    const newRoomId = uuidv4().split("-")[0];
    setRoomId(newRoomId);
    window.history.replaceState(null, "", `?room=${newRoomId}`);
  };

  const handleJoin = () => {
    if (!username || !roomId) {
      toast.error("Username and room ID are required");
      return;
    }

    localStorage.setItem("username", username);
    
    // Join the appropriate game type
    if (gameType === GameTypes.RPS) {
      socket.emit("join", { username, roomId });
    } else if (gameType === GameTypes.SNAKE_LADDER) {
      socket.emit("joinSnakeGame", { username, roomId });
    }
    
    setJoined(true);
    
    // Call the parent component's join handler
    if (onJoin) {
      onJoin({ username, roomId, joined: true });
    }
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Game link copied to clipboard!");
  };

  // If already joined, show room info
  if (joined) {
    return (
      <div className="flex flex-col items-center mb-6">
        <p className="text-sm text-gray-400 mb-2">
          Room ID: <code className="text-green-400">{roomId}</code>
        </p>
        <div className="bg-gray-800 p-3 mb-4 rounded-lg text-sm flex items-center justify-between w-full max-w-md">
          <span className="break-all text-xs text-gray-300 mr-2">
            {window.location.href}
          </span>
          <button
            onClick={copyRoomLink}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs flex-shrink-0"
            aria-label="Copy room link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // If there's no room ID yet, show the create room button
  if (!roomId) {
    return (
      <div className="flex flex-col items-center gap-3 mb-6">
        <button
          onClick={handleCreateRoom}
          className={buttonClassName}
        >
          {buttonText}
        </button>
      </div>
    );
  }

  // Show join room form once we have a room ID
  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <p className="text-sm text-gray-400">
        Room ID: <code className="text-green-400">{roomId}</code>
      </p>
      <input
        type="text"
        className="p-2 bg-gray-800 border border-gray-700 rounded text-white w-full max-w-xs"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        onClick={handleJoin}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full max-w-xs"
      >
        Join Room
      </button>
    </div>
  );
};

export default CreateGameRoom;

