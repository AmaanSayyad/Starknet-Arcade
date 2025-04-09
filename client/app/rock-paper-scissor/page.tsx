"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function RockPaperScissor() {
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const router = useRouter();

  const createGame = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    router.push({
      pathname: '/game',
      query: { name: playerName, isHost: true }
    });
  };

  const joinGame = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!gameCode.trim()) {
      alert('Please enter a game code');
      return;
    }
    
    router.push({
      pathname: '/game',
      query: { name: playerName, isHost: false, code: gameCode }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Head>
        <title>Rock Paper Scissors Multiplayer</title>
      </Head>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Rock Paper Scissors</h1>
        <p className="text-center text-gray-600">Play with friends in real-time!</p>
        
        <div className="space-y-4">
          <div>

            <input
              type="text"
              id="name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>
          
          <div className="flex flex-col space-y-4">
            <button
              onClick={createGame}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Create New Game
            </button>
            
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <div>
             
              <input
                type="text"
                id="code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter game code"
              />
            </div>
            
            <button
              onClick={joinGame}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}