"use client"
import { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";


export default function SnakeAndLadderGame() {
  const [playerPosition, setPlayerPosition] = useState(1);
  const [computerPosition, setComputerPosition] = useState(1);
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [turn, setTurn] = useState('player'); // 'player' or 'computer'
  const [message, setMessage] = useState('Roll the dice to start!');
  const [winner, setWinner] = useState(null);
  const [isMoving, setIsMoving] = useState(false);

  // Define snakes and ladders on the board
  const snakesAndLadders = {
    // Ladders (start -> end)
    4: 25,
    21: 39,
    26: 67,
    43: 76,
    59:80,
    71: 89,
    // Snakes (start -> end)
    30: 7,
    47: 13,
    56: 19,
    73: 51,
    82: 42,
    92:75,
    98: 55,
  };

  const rollDice = () => {
    if (isRolling || isMoving || winner) return;
    
    setIsRolling(true);
    setMessage('Rolling dice...');
    
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

  const movePlayer = (steps) => {
    setIsMoving(true);
    const currentPosition = turn === 'player' ? playerPosition : computerPosition;
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
    
    setMessage(`${turn === 'player' ? 'You' : 'Computer'} rolled a ${steps}. Moving from ${currentPosition} to ${newPosition}.`);
    
    // Update position
    if (turn === 'player') {
      setPlayerPosition(newPosition);
    } else {
      setComputerPosition(newPosition);
    }
    
    // Check for snakes or ladders after a brief delay
    setTimeout(() => {
      checkSnakesAndLadders(newPosition);
    }, 1000);
  };

  const checkSnakesAndLadders = (position) => {
    if (snakesAndLadders[position]) {
      const isMoveUp = snakesAndLadders[position] > position;
      
      setMessage(
        `${turn === 'player' ? 'You' : 'Computer'} found a ${isMoveUp ? 'ladder' : 'snake'}! Moving from ${position} to ${snakesAndLadders[position]}.`
      );
      
      // Update position after snake or ladder
      if (turn === 'player') {
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

  const checkWinCondition = (position) => {
    if (position === 100) {
      setWinner(turn);
      setMessage(`${turn === 'player' ? 'You' : 'Computer'} reached 100! ${turn === 'player' ? 'You win!' : 'Computer wins!'}`);
      setIsMoving(false);
    } else {
      setIsMoving(false);
      switchTurn();
    }
  };

  const switchTurn = () => {
    setTurn(turn === 'player' ? 'computer' : 'player');
  };

  // Computer turn logic
  useEffect(() => {
    if (turn === 'computer' && !winner && !isMoving) {
      const timeout = setTimeout(() => {
        rollDice();
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [turn, winner, isMoving]);

  // Calculate position coordinates from board number
  const getPositionCoordinates = (position) => {
    // Adjusted for 10x10 grid
    const boardSize = 500; // Board size in pixels
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
      top: row * cellSize + (cellSize / 2),
      left: col * cellSize + (cellSize / 2)
    };
  };

  const resetGame = () => {
    setPlayerPosition(1);
    setComputerPosition(1);
    setDiceValue(null);
    setIsRolling(false);
    setTurn('player');
    setMessage('Roll the dice to start!');
    setWinner(null);
    setIsMoving(false);
  };

  // Player piece position coordinates
  const playerPos = getPositionCoordinates(playerPosition);
  const computerPos = getPositionCoordinates(computerPosition);

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Snake and Ladder Game</h1>
      
      <div className="relative w-full max-w-lg aspect-square mb-4">
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
            left: `${playerPos.left}px`
          }}
        />
        
        {/* Computer piece */}
        <div 
          className="absolute w-6 h-6 rounded-full bg-red-500 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-10"
          style={{ 
            top: `${computerPos.top}px`, 
            left: `${computerPos.left}px`
          }}
        />
      </div>
      
      <div className="flex w-full justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <p>You: {playerPosition}</p>
        </div>
        
        {/* Dice display */}
        <div 
          className={`w-16 h-16 border-2 border-gray-300 rounded flex items-center justify-center text-2xl font-bold ${isRolling ? 'animate-bounce' : ''}`}
          onClick={turn === 'player' && !isMoving && !winner ? rollDice : undefined}
          style={{ cursor: turn === 'player' && !isMoving && !winner ? 'pointer' : 'default' }}
        >
          {diceValue || '?'}
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <p>Computer: {computerPosition}</p>
        </div>
      </div>
      
      <div className="w-full text-center mb-4">
        <p className="mb-2">{message}</p>
        <p className="font-semibold">
          {!winner ? `${turn === 'player' ? 'Your' : 'Computer\'s'} turn` : ''}
        </p>
      </div>
      
      <div className="flex gap-4">
        {turn === 'player' && !isMoving && !winner && (
          <button 
            onClick={rollDice}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            disabled={isRolling || isMoving}
          >
            Roll Dice
          </button>
        )}
        
        {winner && (
          <button 
            onClick={resetGame}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}