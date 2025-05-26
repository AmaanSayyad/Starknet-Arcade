import React from 'react';
import GameCard from './GameCard';
import SectionHeader from './ui/SectionHeader';

const CasinoGames = () => {
  const games = [
    {
      title: 'StarkNet Roulette',
      description: 'Try your luck on the spinning wheel of fortune! Place your bets and watch the wheel decide your fate.',
      image: '/images/games/roulette.jpg',
      link: '/roulette',
      category: 'Casino',
      players: '1-8 Players',
      isHot: true,
      logoIcon: '/images/figma-assets/roulette-icon.svg'
    },
    {
      title: 'Crypto BlackJack',
      description: 'Beat the dealer in this card game classic. Get as close to 21 as possible without going over.',
      image: '/images/games/blackjack.jpg',
      link: '/blackjack',
      category: 'Card',
      players: '1-7 Players',
      isNew: true,
      isHot: true,
      logoIcon: '/images/figma-assets/memory-icon.svg'
    },
    {
      title: 'Crypto Mines',
      description: 'Avoid the mines and collect points as you go! Strategic gameplay with increasing rewards.',
      image: '/images/games/mines.jpg',
      link: '/mines',
      category: 'Strategy',
      players: '1 Player',
      isNew: true,
      logoIcon: '/images/figma-assets/mines-icon.svg'
    },
    {
      title: 'StarkNet Slots',
      description: 'Spin the reels and match symbols to win big in this crypto-themed slot machine.',
      image: '/images/games/slots.jpg',
      link: '/slots',
      category: 'Casino',
      players: '1 Player',
      isHot: false,
      logoIcon: '/images/figma-assets/dust-cleaner-icon.svg'
    },
    {
      title: 'Crypto Plinko',
      description: 'Drop the disc and see where it lands for rewards! Watch as physics determines your win.',
      image: '/cartridge-bak.png',
      link: '/plinko',
      category: 'Casino',
      players: '1 Player',
      logoIcon: '/images/figma-assets/plinko-icon.svg'
    },
    {
      title: 'Crypto Crash',
      description: 'Watch the multiplier rise and cash out before the crash! The ultimate risk vs. reward game.',
      image: '/images/games/coming-soon-2.jpg',
      link: '/crash',
      category: 'Casino',
      players: '1+ Players',
      isNew: true,
      isHot: true,
      logoIcon: '/images/figma-assets/mines-icon.svg'
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title="Casino Games on Starknet" 
        emoji="🎰" 
        subtitle="Try your luck in our provably fair casino games. With transparent mechanics and on-chain verifiability, every play is fair and secure."
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

export default CasinoGames;
