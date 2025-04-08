import React from 'react'

const Features = () => {
  return (
    <section
      className="py-20 px-6 w-full mx-auto font-['Press_Start_2P,_sans-serif'] text-white"
     
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-16 font-techno text-center text-white ">
        Why Play on Starknet Arcade?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          {
            color: 'bg-gray-800',
            title: 'Fast & Low Fees',
            desc: `Enjoy lightning-fast transactions with minimal gas fees on Starknet's Layer 2.`,
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            ),
          },
          {
            color: 'bg-gray-700',
            title: 'Secure Gaming',
            desc: `All games are provably fair and verified on-chain using ZK tech.`,
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            ),
          },
          {
            color: 'bg-gray-600',
            title: 'Win Tokens',
            desc: `Earn STARK tokens by completing challenges and climbing the leaderboard.`,
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ),
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className={`text-center p-6 border-4 border-black bg-gradient-to-br from-blue-900 to-violet-800 shadow-[6px_6px_0_rgba(0,0,0,1)] transition-transform hover:translate-y-1 hover:shadow-[2px_2px_0_rgba(0,0,0,1)]`}
          >
            <div
              className={`w-16 h-16 ${feature.color} border-2 border-black rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {feature.icon}
              </svg>
            </div>
            <h3 className="text-lg mb-4 text-red-300 font-mono">{feature.title}</h3>
            <p className="text-sm text-gray-300 leading-relaxed font-mono">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
