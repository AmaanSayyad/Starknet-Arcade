import Link from 'next/link'
import React from 'react'

const CasinoGames = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-5xl font-techno font-extrabold mb-16 text-center text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] tracking-widest">
        🎰 Casino Games on Starknet
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          {
            title: 'Roulette Game',
            subtitle: '🎡 Classic Roulette',
            description: 'Try your luck on the spinning wheel of fortune!',
            btn: 'Play Now',
            rating: '4.9',
            url: '/roulette',
            imgUrl:
              'https://img.freepik.com/premium-vector/casino-roulette-wheel-with-flying-cards-poker-chips-dice-isolated-white-background_134830-2038.jpg?w=740',
          },
          {
            title: 'Mines Game',
            subtitle: '💣 Mines Strategy',
            description: 'Avoid the mines and collect points as you go!',
            btn: 'Play Now',
            rating: '4.7',
            url: '/mines',
            imgUrl:
              'https://img.freepik.com/premium-vector/vector_863384-153.jpg?w=740',
          },
          {
            title: 'Plinko Game',
            subtitle: '🎯 Plinko Drop',
            description: 'Drop the disc and see where it lands for rewards!',
            btn: 'Play Now',
            rating: '4.8',
            url: '/plinko',
            imgUrl:
              'https://img.freepik.com/premium-psd/realistic-lottery-symbol-isolated_23-2151177241.jpg?w=740',
          },
        ].map((game, i) => (
          <div
            key={i}
            className="relative rounded-3xl overflow-hidden shadow-xl h-[500px] group transform transition-transform duration-300 hover:scale-105"
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center z-0 duration-300 "
              style={{ backgroundImage: `url(${game.imgUrl})` }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-10 z-10" />

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-between p-6 text-black font-techno">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">{game.title}</h3>
                  <p className="text-black text-sm">{game.subtitle}</p>
                </div>
                <div className="bg-gray-300 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                  <span className="text-sm mr-1">⭐</span>
                  <span className="font-bold">{game.rating}</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link href={game.url}>
                <button className="w-full text-white bg-yellow-500 py-3 rounded-xl hover:bg-yellow-400 hover:text-black transition-all font-bold tracking-wide active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,0.8)] shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-white">
                  {game.btn}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CasinoGames;
