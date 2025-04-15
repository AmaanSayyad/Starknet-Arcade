"use client";
import React, { useEffect } from 'react';
import PlinkoGameBoard from './PlinkoGameBoard';

const PlinkoGame: React.FC = () => {
  const alertUser = (e: BeforeUnloadEvent) => {
    if (gamesRunning > 0) {
      e.preventDefault();
      alert('Tu quer mermo sair feladaputa?');
      e.returnValue = '';
    }
  };
  const gamesRunning = 20;
  useEffect(() => {
    window.addEventListener('beforeunload', alertUser);
    return () => {
      window.removeEventListener('beforeunload', alertUser);
    };
  }, [gamesRunning]);

  return (
    <div className='bg-[#1A181A] flex w-full flex-col justify-center items-center'>
      <div className='flex h-full w-[100%] bg-[#1A181A] justify-center items-center'>
          <PlinkoGameBoard/>
      </div>
    </div>
  );
};

export default PlinkoGame;
