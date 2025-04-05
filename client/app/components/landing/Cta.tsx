import React from 'react'

const Cta = () => {
  return (
    <section className="py-16 px-6 text-center max-w-4xl mx-auto">
    <div className="bg-gradient-to-r from-purple-900 to-pink-900 bg-opacity-30 p-10 rounded-3xl">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Ready to Play?
      </h2>
      <p className="text-xl mb-8 text-gray-300">
        Connect your wallet and start playing games on Starknet today!
      </p>
      <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 rounded-full font-medium text-lg hover:opacity-90 transition-opacity">
        Connect Wallet
      </button>
    </div>
  </section>
  )
}

export default Cta