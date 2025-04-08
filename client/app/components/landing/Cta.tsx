import React from 'react'
import WalletBar from '../WalletBar'

const Cta = () => {
  return (
    <section className="py-20 px-6 text-center max-w-4xl mx-auto w-full font-techno">
      <div className="bg-gradient-to-br from-violet-900 to-purple-700   rounded-3xl p-10 transition-transform hover:translate-y-1 ">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white  font-techno">
          Ready to Play?
        </h2>
        <p className="text-lg md:text-xl mb-8 text-gray-300 font-mono">
          Connect your wallet and start playing games on Starknet today!
        </p>
        <div className="flex items-center justify-center">
          <WalletBar />
        </div>
      </div>
    </section>
  )
}

export default Cta
