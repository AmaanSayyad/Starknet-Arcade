import React from 'react'

const Games = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-5xl font-retro font-extrabold mb-16 text-center text-yellow-400 drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] tracking-widest">
        🎮 Games on Starknet
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          {
            title: 'StarkChess',
            subtitle: '♟ Chess Masters',
            description:
              'Make your move as Black or White. Earn tokens when your team wins. Classic chess with a Starknet twist!',
            bg: 'bg-gradient-to-br from-yellow-300 to-red-500',
            btn: 'Play Now',
          },
          {
            title: 'Snakes & Ladders',
            subtitle: '🐍🎲 Classic Chaos',
            description:
              'Roll the dice, climb fast, dodge snakes! Board game mayhem meets on-chain rewards.',
            bg: 'bg-gradient-to-br from-green-300 to-blue-500',
            btn: 'Play Now',
          },
          {
            title: 'Token Flip',
            subtitle: '🪙 Double or Nothing',
            description:
              'Flip a token and let luck decide. Win 2x your STARK — fast, flashy, and fair!',
            bg: 'bg-gradient-to-br from-pink-400 to-purple-600',
            btn: 'Play Now',
          },
          {
            title: 'Rock Paper Scissors',
            subtitle: '✊🖐✌ RPS Showdown',
            description:
              'On-chain RPS battles! Pick a side and win with style. Fast hands, faster rewards.',
            bg: 'bg-gradient-to-br from-indigo-400 to-green-400',
            btn: 'Play Now',
          },
          {
            title: 'Starknet Score',
            subtitle: '⭐ Degen Stats',
            description:
              'Track your Starknet journey. Brag about your degen moves. Score high, stay fly.',
            bg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
            btn: 'Check Score',
          },
          {
            title: 'Dust Cleaner',
            subtitle: '🧼 Clean It',
            description:
              'Turn small token dust into STARK. The cleanest way to earn something from nothing.',
            bg: 'bg-gradient-to-br from-cyan-300 to-blue-400',
            btn: 'Clean Wallet',
          },
        ].map((game, i) => (
          <div
            key={i}
            className={`rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] border-4 border-black text-black ${game.bg} p-5 transition-transform duration-300 hover:scale-105 hover:rotate-[-1deg]`}
          >
            <div className="h-56 flex items-center justify-center text-3xl font-extrabold text-center">
              {game.subtitle}
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold mb-2">{game.title}</h3>
              <p className="text-sm leading-relaxed mb-4">{game.description}</p>
              <button
  className="w-full text-white bg-red-600 py-2 rounded hover:bg-red-400 hover:text-black transition-all font-bold tracking-wide active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,0.8)] shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-black"
>
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
