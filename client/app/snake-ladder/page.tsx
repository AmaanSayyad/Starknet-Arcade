"use client";

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

let socket: any;

const SnakeLadder = () => {
  const [name, setName] = useState('');
  const [players, setPlayers] = useState<any[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const [diceNum, setDiceNum] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    socket = io();
    socket.emit('joined');

    socket.on('join', (data: any) => {
      setPlayers((prev) => [...prev, data]);
    });

    socket.on('joined', (data: any[]) => {
      setPlayers(data);
    });

    socket.on('rollDice', (data: any) => {
      setDiceNum(data.num);
      setPlayers((prev) => {
        const newPlayers = [...prev];
        newPlayers[data.id].pos = data.pos;
        return newPlayers;
      });
    });

    socket.on('restart', () => {
      window.location.reload();
    });
  }, []);

  const handleJoin = () => {
    const id = players.length;
    const img = `./images/${['red', 'blue', 'yellow', 'green'][id]}_piece.png`;
    const newPlayer = { id, name, pos: 0, img };
    setCurrentPlayer(newPlayer);
    socket.emit('join', newPlayer);
  };

  const handleRoll = () => {
    const num = Math.ceil(Math.random() * 6);
    const newPos = Math.min(currentPlayer.pos + num, 99);
    const updatedPlayer = { ...currentPlayer, pos: newPos };
    setCurrentPlayer(updatedPlayer);
    socket.emit('rollDice', { num, id: currentPlayer.id, pos: newPos });
  };

  return (
    <div>
      <h1>Snakes and Ladders</h1>
      <canvas ref={canvasRef} width={600} height={600}></canvas>
      {!currentPlayer && (
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <button onClick={handleJoin}>Join</button>
        </div>
      )}
      {currentPlayer && (
        <div>
          <p>{currentPlayer.name}, it's your turn</p>
          <button onClick={handleRoll}>Roll Dice</button>
          <img src={`/images/dice/dice${diceNum}.png`} alt="dice" width={50} />
        </div>
      )}
      <h3>Players:</h3>
      <ul>
        {players.map((p, i) => (
          <li key={i}>
            {p.name} <img src={p.img} width={30} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SnakeLadder  ;
