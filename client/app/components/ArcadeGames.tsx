import Link from "next/link";
import React from "react";

const ArcadeGames = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-5xl font-techno font-extrabold mb-16 text-center text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] tracking-widest">
        🎮 Arcade Games on Starknet
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          {
            title: "StarkChess",
            subtitle: "♟ Chess Masters",
            description:
              "Make your move as Black or White. Earn tokens when your team wins. Classic chess with a Starknet twist!",
            bg: "bg-gradient-to-br from-blue-400 to-blue-600",
            btn: "Play Now",
            rating: "4.8",
            url: "/chess",
            imgUrl:
              "https://img.freepik.com/premium-vector/leader-chess-game-business-team-white-background-vector-illustration_3482-3946.jpg?w=740",
            // You'll add your SVG here
          },
          {
            title: "Snakes & Ladders",
            subtitle: "🐍🎲 Classic Chaos",
            description:
              "Roll the dice, climb fast, dodge snakes! Board game mayhem meets on-chain rewards.",
            bg: "bg-gradient-to-br from-green-400 to-blue-500",
            btn: "Play Now",
            rating: "4.6",
            url: "/snake-ladder",
            imgUrl:
              "https://img.freepik.com/free-vector/green-path-with-strawberry-jam_1308-71571.jpg?t=st=1744624662~exp=1744628262~hmac=38242eceaaf8cd5d8a7e0957840db8dff7178ba965e6abde0bd25ae868373285&w=740",

            // You'll add your SVG here
          },
          {
            title: "Token Flip",
            subtitle: "🪙 Double or Nothing",
            description:
              "Flip a token and let luck decide. Win 2x your STARK — fast, flashy, and fair!",
            bg: "bg-gradient-to-br from-pink-400 to-purple-600",
            btn: "Play Now",
            rating: "4.9",
            url: "/coin-flip",
            imgUrl:
              "https://img.freepik.com/premium-vector/bitcoin-trader-man-with-suit-coin-front-face-trading-chart-background-question-marks-flying-around-crypto-currency-day-trading-technical-analysis-illustration_161121-5.jpg?w=740",
            // You'll add your SVG here
          },
          {
            title: "Rock Paper Scissors",
            subtitle: "✊🖐✌ RPS Showdown",
            description:
              "On-chain RPS battles! Pick a side and win with style. Fast hands, faster rewards.",
            bg: "bg-gradient-to-br from-indigo-400 to-green-400",
            btn: "Play Now",
            rating: "4.5",
            url: "/rock-paper-scissor",
            imgUrl:
              "https://img.freepik.com/premium-vector/hand-rock-paper-scissor-clip-art_107355-34.jpg?w=740",
            // You'll add your SVG here
          },
          {
            title: "Memory Matching",
            subtitle: "⭐ Match Degens",
            description:
              "Track your Starknet journey. Brag about your degen moves. Score high, stay fly.",
            bg: "bg-gradient-to-br from-blue-400 to-cyan-500",
            btn: "Play Now",
            rating: "4.7",
            url: "/memory-matching",
            imgUrl:
              "https://img.freepik.com/free-vector/hand-drawn-memory-game-card_23-2150140066.jpg?t=st=1744702157~exp=1744705757~hmac=418f97b7978424b76b6ab9dd2070e29f47c93693cd564996a59f3dd400d6b3ea&w=740",
            // You'll add your SVG here
          },
          {
            title: "Dust Cleaner",
            subtitle: "🧼 Clean It",
            description:
              "Turn small token dust into STARK. The cleanest way to earn something from nothing.",
            bg: "bg-gradient-to-br from-blue-300 to-blue-500",
            btn: "Clean Wallet",
            rating: "4.4",
            url: "/dust-cleaner",
            imgUrl:
              "https://img.freepik.com/free-vector/hand-drawn-kids-game-illustration_23-2150651870.jpg?t=st=1744526129~exp=1744529729~hmac=0db791e91bea8b7e03c667202d1e90f71047d09b5004117fb0698c3c2ceef61b&w=740",
            // You'll add your SVG here
          },
        ].map((game, i) => (
          <div
            key={i}
            className={`relative rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-105 h-96 font-techno text-white`}
          >
            {/* Background Image */}
            <img
              src={game.imgUrl}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover "
            />

            {/* Overlay Content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-black">{game.title}</h3>
                  <p className="text-black text-sm">{game.subtitle}</p>
                </div>
                <div className="bg-gray-300 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                  <span className="text-sm mr-1">⭐</span>
                  <span className="font-bold">{game.rating}</span>
                </div>
              </div>

          
              {/* CTA Button */}
              <Link
                href={game.url}
                className="mt-6 inline-block text-center bg-violet-600 hover:bg-purple-400 hover:text-black transition-all font-bold tracking-wide active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,0.8)] shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-black py-2 rounded-xl"
              >
                {game.btn}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArcadeGames;
