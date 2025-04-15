"use client";
import React, { useState, useEffect } from "react";
import "./style.css";
import MineSelection from "../components/selection";
const MineGamblingGame: React.FC = () => {
  const [clickedBoxes, setClickedBoxes] = useState<boolean[]>(
    Array(25).fill(false)
  );
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [bombs, setBombs] = useState<number[]>([]);
  const [selectedMines, setSelectedMines] = useState({
    id: 10,
    name: "10 Mines",
  });

  // Function to place bombs randomly
  const placeBombs = () => {
    const bombIndices: number[] = [];
    while (bombIndices.length < selectedMines.id) {
      const index = Math.floor(Math.random() * 25);
      if (!bombIndices.includes(index)) {
        bombIndices.push(index);
      }
    }
    setBombs(bombIndices);
  };

  useEffect(() => {
    placeBombs();
  }, [selectedMines]);

  const handleClick = (index: number) => {
    if (isGameOver || clickedBoxes[index]) return; // Do nothing if game is over or the box is already clicked
    const newClickedBoxes = [...clickedBoxes];
    newClickedBoxes[index] = true;
    setClickedBoxes(newClickedBoxes);

    if (bombs.includes(index)) {
      setIsGameOver(true); // Game over if clicked on a bomb
    }
  };

  const resetGame = () => {
    setClickedBoxes(Array(25).fill(false));
    setIsGameOver(false);
    placeBombs();
  };

  return (
    <div className="relative antialiased bg-grid-white/[0.02] font-techno ">
      <div className="relative z-10">
        <div className="flex flex-row-reverse items-baseline justify-around pt-8 pr-10 pl-10">
          <div className="grid bg-gray-800">
            {clickedBoxes.map((clicked, index) => (
              <div
                key={index}
                className={`box ${clicked ? "clicked" : ""}`}
                onClick={() => handleClick(index)}
              >
                {clicked && bombs.includes(index) && (
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/009/350/665/small_2x/explosive-bomb-black-png.png"
                    alt="bomb"
                  />
                )}

                {clicked && !bombs.includes(index) && (
                  <img
                    src="https://freepngimg.com/thumb/diamond/30147-1-diamond-vector-clip-art-thumb.png"
                    alt="diamond"
                  />
                )}
              </div>
            ))}
            <div>
              <button
                className={
                  "group/button rounded-lg bg-[#222222] text-black mt-6"
                }
                onClick={resetGame}
              >
                <span
                  className={
                    "block -translate-x-1 uppercase whitespace-nowrap -translate-y-1 rounded-lg border-2 border-[#222222] bg-green-400 px-4 py-1 text-sm font-medium tracking-tight transition-all group-hover/button:-translate-y-2 group-active/button:translate-x-0 group-active/button:translate-y-0"
                  }
                >
                  Reset Game
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center font-techno p-6 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl shadow-xl space-y-6">
            {/* 📜 Game Rules */}
            <div className="text-white text-lg sm:text-xl max-w-xl leading-relaxed">
              <h2 className="text-2xl font-bold mb-2 text-yellow-400">
                💣 Mines Game Rules:
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Click tiles to reveal safe spots.</li>
                <li>Avoid mines – one wrong move and it’s over!</li>
                <li>
                  The more safe tiles you uncover, the higher your rewards!
                </li>
                <li>You can stop and cash out at any time.</li>
              </ul>
            </div>

            {/* ⛏️ Mine Selection UI */}
            <MineSelection
              selectedMines={selectedMines}
              setSelectedMines={setSelectedMines}
            />

            {/* 🔥 Win/Loss Message */}
            {isGameOver ? (
              <p className="text-6xl text-red-600 mt-4 font-techno animate-pulse">
                💥 Game Over!
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MineGamblingGame;
