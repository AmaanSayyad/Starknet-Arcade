"use client";
import { useEffect, useState } from "react";

const cards = [
  { title: "Fortnite", color: "bg-gradient-to-b from-[#193BCE] to-[#0E1539]", rating: 34 },
  { title: "Mario", color: "bg-gradient-to-b from-[#BD5068] to-[#9B111F]", rating: 34 },
  { title: "Kirby", color: "bg-gradient-to-br from-[#16D4FF] via-[#00AFFF] to-[#1774FF]", rating: 34 },
  { title: "League of Legends", color: "bg-gradient-to-b from-[#FABE4E] to-[#272A1F]", rating: 34 },
  { title: "Counter-Strike", color: "bg-gradient-to-b from-[#43382F] to-[#FEFBBD]", rating: 34 },
];

interface GameCardProps {
  title: string;
  rating: number;
  color: string;
  position: string;
}

const GameCard = ({ title, rating, color, position }: GameCardProps) => {
  const baseClasses = "rounded-3xl border border-white/20 text-white font-semibold flex flex-col relative overflow-hidden shadow-xl transition-all duration-500 ease-in-out";

  let transform = "";
  let size = "w-72 h-80";
  let z = "z-10";

  switch (position) {
    case "left":
      transform = "-translate-x-36 rotate-[-5deg] scale-95";
      break;
    case "right":
      transform = "translate-x-36 rotate-[5deg] scale-95";
      break;
    case "back-left":
      transform = "-translate-x-64 rotate-[-10deg] scale-90";
      z = "z-0";
      break;
    case "back-right":
      transform = "translate-x-64 rotate-[10deg] scale-90";
      z = "z-0";
      break;
    case "center":
    default:
      size = "w-80 h-96 scale-110";
      z = "z-30";
      break;
  }

  return (
    <div className={`${baseClasses} ${color} ${transform} ${size} ${z}`}>
      <div className="p-6 flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
          <span className="text-sm mr-1">⭐</span>
          <span className="font-bold">{rating}</span>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center px-8">
        <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-4xl">SVG</span>
        </div>
      </div>
    </div>
  );
};

export default function FigmaCardsStack() {
  const [activeIndex, setActiveIndex] = useState(2); // Start from Kirby

  const getPosition = (index: number) => {
    const diff = (index - activeIndex + cards.length) % cards.length;
    switch (diff) {
      case 0:
        return "center";
      case 1:
        return "right";
      case 2:
        return "back-right";
      case cards.length - 1:
        return "left";
      case cards.length - 2:
        return "back-left";
      default:
        return "hidden";
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 3000); // rotates every 3 seconds

    return () => clearInterval(interval); // clean up on unmount
  }, []);

  return (
    <div className="relative w-full mt-24 h-[400px] flex justify-center items-center">
      <div className="relative flex items-center justify-center w-full h-full">
        {cards.map((card, index) => {
          const position = getPosition(index);
          return (
            <div
              key={index}
              className={`absolute transition-all duration-500 ease-in-out`}
            >
              <GameCard {...card} position={position} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
