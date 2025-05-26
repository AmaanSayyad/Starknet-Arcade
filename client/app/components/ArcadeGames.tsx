import React from "react";
import GameCard from "./GameCard";
import SectionHeader from "./ui/SectionHeader";

const ArcadeGames = () => {
  const games = [
    {
      title: "Blockchain Chess",
      description: "Make your move as Black or White. Earn tokens when your team wins. Classic chess with a Starknet twist!",
      image: "/gameicons/games.png",
      link: "/chess",
      category: "Strategy",
      players: "2 Players",
      isHot: true,
      logoIcon: "/images/figma-assets/chess-icon.svg"
    },
    {
      title: "Crypto Snakes & Ladders",
      description: "Roll the dice, climb fast, dodge snakes! Board game mayhem meets on-chain rewards.",
      image: "/images/games/snake-ladder.jpg",
      link: "/snake-ladder",
      category: "Board Game",
      players: "2-4 Players",
      isNew: true,
      logoIcon: "/images/figma-assets/snake-ladder-icon.svg"
    },
    {
      title: "Crypto Coin Flip",
      description: "Flip a token and let luck decide. Win 2x your STARK — fast, flashy, and fair!",
      image: "/images/games/coin-flip.jpg",
      link: "/coin-flip",
      category: "Gambling",
      players: "1 Player",
      isHot: true,
      logoIcon: "/images/figma-assets/coin-flip-icon.svg"
    },
    {
      title: "Rock Paper Scissors",
      description: "On-chain RPS battles! Pick a side and win with style. Fast hands, faster rewards.",
      image: "/images/games/rock-paper-scissor.jpg",
      link: "/rock-paper-scissor",
      category: "Classic",
      players: "2 Players",
      logoIcon: "/images/figma-assets/rps-icon.svg"
    },
    {
      title: "NFT Memory Match",
      description: "Match pairs of cards in this classic memory game with a Starknet twist. Train your brain, earn rewards!",
      image: "/images/games/memory-matching.jpg",
      link: "/memory-matching",
      category: "Puzzle",
      players: "1 Player",
      logoIcon: "/images/figma-assets/memory-icon.svg"
    },
    {
      title: "StarkNet Dust Cleaner",
      description: "Turn small token dust into STARK. The cleanest way to earn something from nothing.",
      image: "/assets/floppy/logo.png",
      link: "/dust-cleaner",
      category: "Utility",
      players: "1 Player",
      logoIcon: "/images/figma-assets/dust-cleaner-icon.svg"
    },
    {
      title: "NFT Racing",
      description: "Race your NFT vehicles on various tracks. Upgrade your car, challenge others, and win prizes!",
      image: "/images/games/coming-soon-3.jpg",
      link: "/racing",
      category: "Racing",
      players: "1-8 Players",
      isNew: true,
      logoIcon: "/images/figma-assets/dust-cleaner-icon.svg"
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title="Arcade Games on Starknet" 
        emoji="🎮" 
        subtitle="Experience classic and innovative arcade games on Starknet. Play, earn, and compete with other players in our growing collection of on-chain games."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {games.map((game, i) => (
          <GameCard
            key={i}
            title={game.title}
            description={game.description}
            image={game.image}
            link={game.link}
            category={game.category}
            players={game.players}
            isNew={game.isNew}
            isHot={game.isHot}
            logoIcon={game.logoIcon}
          />
        ))}
      </div>
    </section>
  );
};

export default ArcadeGames;
