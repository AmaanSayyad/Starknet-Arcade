import React from 'react'

const Games = () => {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
    <h2 className="text-4xl font-bold mb-12 text-center">
      Games on Starknet
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Game Card 1 */}
      <div className="bg-black bg-opacity-40 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform">
        <div className="h-64 bg-gradient-to-b from-purple-800 to-pink-700 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold">Chess Masters</div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">StarkChess</h3>
          <p className="text-gray-300 mb-4">
            A Starknet community chess game, where each player makes a
            move as Black or White. Play with STARK; if your team wins,
            earn tokens.
          </p>
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Play Now
          </button>
        </div>
      </div>

      {/* Game Card 2 */}
      <div className="bg-black bg-opacity-40 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform">
        <div className="h-64 bg-gradient-to-b from-blue-800 to-purple-700 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold">Snake & Ladders</div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">
            StarkSnakes & Ladders
          </h3>
          <p className="text-gray-300 mb-4">
            Classic board game reimagined on Starknet. Roll the dice,
            climb ladders, avoid snakes, and race to the finish line to
            win tokens.
          </p>
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Play Now
          </button>
        </div>
      </div>

      {/* Game Card 3 */}
      <div className="bg-black bg-opacity-40 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform">
        <div className="h-64 bg-gradient-to-b from-pink-800 to-red-700 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold">Token Flip</div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">
            Double or Nothing
          </h3>
          <p className="text-gray-300 mb-4">
            Flip the coin for a chance to win 2x your STARK tokens.
            Simple, fast, and exciting with provably fair outcomes
            on-chain.
          </p>
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Play Now
          </button>
        </div>
      </div>

      {/* Game Card 4 */}
      <div className="bg-black bg-opacity-40 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform">
        <div className="h-64 bg-gradient-to-b from-green-800 to-blue-700 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold">Rock Paper Scissors</div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">StarkRPS</h3>
          <p className="text-gray-300 mb-4">
            Challenge other players to Rock Paper Scissors on Starknet.
            Choose your move, commit on-chain, and win STARK tokens.
          </p>
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Play Now
          </button>
        </div>
      </div>

      {/* Game Card 5 */}
      <div className="bg-black bg-opacity-40 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform">
        <div className="h-64 bg-gradient-to-b from-yellow-700 to-orange-600 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold">Starknet Score</div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">Activity Score</h3>
          <p className="text-gray-300 mb-4">
            Show the world your degen side. View and share your Starknet
            activity score based on your on-chain activity.
          </p>
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Check Score
          </button>
        </div>
      </div>

      {/* Game Card 6 */}
      <div className="bg-black bg-opacity-40 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform">
        <div className="h-64 bg-gradient-to-b from-blue-700 to-cyan-600 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold">Clean It</div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">Dust Cleaner</h3>
          <p className="text-gray-300 mb-4">
            Clean up token dust in your wallet and convert small balances
            into STARK tokens with this useful utility.
          </p>
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Clean Wallet
          </button>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Games