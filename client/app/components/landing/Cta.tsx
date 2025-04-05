import React from 'react'
import WalletBar from '../WalletBar'

const Cta = () => {
  return (
    <section className="py-16 px-6 text-center max-w-4xl mx-auto">
    <div className="bg-gradient-to-r from-pink-700 to-red-950 bg-opacity-30 p-10 rounded-3xl">
      <h2 className="text-3xl md:text-4xl font-bold  mb-6 font-silk">
        Ready to Play?
      </h2>
      <p className="text-xl mb-8 text-gray-300 font-techno">
        Connect your wallet and start playing games on Starknet today!
      </p>
     <div className='flex items-center justify-center'>
     <WalletBar/>
     </div>
    </div>
  </section>
  )
}

export default Cta