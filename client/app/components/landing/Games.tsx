import React from 'react'

const Games = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-5xl font-techno font-extrabold mb-16 text-center text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] tracking-widest">
        🎮 Games on Starknet
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          {
            title: 'StarkChess',
            subtitle: '♟ Chess Masters',
            description:
              'Make your move as Black or White. Earn tokens when your team wins. Classic chess with a Starknet twist!',
            bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
            btn: 'Play Now',
            rating: '4.8'
            // You'll add your SVG here
          },
          {
            title: 'Snakes & Ladders',
            subtitle: '🐍🎲 Classic Chaos',
            description:
              'Roll the dice, climb fast, dodge snakes! Board game mayhem meets on-chain rewards.',
            bg: 'bg-gradient-to-br from-green-400 to-blue-500',
            btn: 'Play Now',
            rating: '4.6'
            // You'll add your SVG here
          },
          {
            title: 'Token Flip',
            subtitle: '🪙 Double or Nothing',
            description:
              'Flip a token and let luck decide. Win 2x your STARK — fast, flashy, and fair!',
            bg: 'bg-gradient-to-br from-pink-400 to-purple-600',
            btn: 'Play Now',
            rating: '4.9'
            // You'll add your SVG here
          },
          {
            title: 'Rock Paper Scissors',
            subtitle: '✊🖐✌ RPS Showdown',
            description:
              'On-chain RPS battles! Pick a side and win with style. Fast hands, faster rewards.',
            bg: 'bg-gradient-to-br from-indigo-400 to-green-400',
            btn: 'Play Now',
            rating: '4.5'
            // You'll add your SVG here
          },
          {
            title: 'Starknet Score',
            subtitle: '⭐ Degen Stats',
            description:
              'Track your Starknet journey. Brag about your degen moves. Score high, stay fly.',
            bg: 'bg-gradient-to-br from-blue-400 to-cyan-500',
            btn: 'Check Score',
            rating: '4.7'
            // You'll add your SVG here
          },
          {
            title: 'Dust Cleaner',
            subtitle: '🧼 Clean It',
            description:
              'Turn small token dust into STARK. The cleanest way to earn something from nothing.',
            bg: 'bg-gradient-to-br from-blue-300 to-blue-500',
            btn: 'Clean Wallet',
            rating: '4.4'
            // You'll add your SVG here
          },
        ].map((game, i) => (
          <div
            key={i}
            className={`rounded-3xl ${game.bg} text-white font-semibold flex flex-col relative overflow-hidden shadow-xl transition-all duration-300 hover:scale-105 h-96`}
          >
            {/* Header with title, subtitle and rating */}
            <div className="p-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-white">{game.title}</h3>
                <p className="text-white/80 text-sm">{game.subtitle}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                <span className="text-sm mr-1">⭐</span>
                <span className="font-bold">{game.rating}</span>
              </div>
            </div>

            {/* Center area for SVG - placeholder for now */}
            <div className="flex-1 flex justify-center items-center px-8">
              {/* This is where you'll insert your SVG */}
              <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-4xl">SVG</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="p-6">
              <button className="w-full text-white bg-violet-600 py-3 rounded-xl hover:bg-purple-400 hover:text-black transition-all font-bold tracking-wide active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,0.8)] shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-black">
                {game.btn}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Games