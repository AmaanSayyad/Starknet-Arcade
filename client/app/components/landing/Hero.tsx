import React from "react";
import FigmaCardsStack from "./GameCard";

const Hero = () => {
  return (
    <section className="w-screen">
      <div className=" text-white flex flex-col  overflow-hidden ">
        {/* Main Content */}
        <main className="relative z-10 px-6 py-8">
          {/* Floating game items */}
          <div className="absolute top-10 left-40">
            <img
              src="/icons/gun.svg"
              alt="weapon"
              className="transform rotate-12"
            />
          </div>
          <div className="absolute top-52 right-64">
            <img
              src="/icons/gun.svg"
              alt="grenade"
              className="transform -rotate-12"
            />
          </div>
          <div className="absolute top-96 left-24">
            <img
              src="/icons/gun.svg"
              alt="weapon"
              className="transform -rotate-45"
            />
          </div>

          {/* Main content */}
          <div className="mt-16 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-yellow-500 rounded-full p-2 mr-2">
                <span className="text-black">🎮</span>
              </div>
              <span className="text-yellow-500 text-xl font-bold">5-Month</span>
              <span className="text-gray-400 text-xl ml-2">— Free Access</span>
            </div>

            <h1 className="text-6xl font-bold my-2 font-techno ">Straknet Arcade</h1>
            {/* <h2 className="text-5xl font-bold mb-0">Nintendo Switch</h2> */}

            {/* Game cards */}
            <FigmaCardsStack />
          </div>
        </main>
      </div>
    </section>
  );
};

export default Hero;
