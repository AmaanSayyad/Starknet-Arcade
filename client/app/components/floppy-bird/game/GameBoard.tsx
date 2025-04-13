import React from 'react';

const GameBoard = ({ 
  playerRef, 
  flyareaRef, 
  pipes, 
  score, 
  currentState, 
  GAME_CONFIG 
}) => {
  return (
    <div id="flyarea" ref={flyareaRef}>
      <div id="ceiling" className="animated" />
      <div id="player" ref={playerRef} />
      <div id="bigscore">{score}</div>
      {pipes.map(pipe => (
        <div key={pipe.id} id={`pipe-${pipe.id}`} className="pipe" style={{ left: `${pipe.left}px` }}>
          <div className="pipe_upper" style={{ height: `${pipe.topHeight}px` }} />
          <div className="pipe_lower" style={{ 
            height: `${(flyareaRef.current?.offsetHeight || 0) - pipe.topHeight - GAME_CONFIG.PIPE_GAP - GAME_CONFIG.GROUND_HEIGHT}px`,
            top: `${pipe.topHeight + GAME_CONFIG.PIPE_GAP}px`
          }} />
        </div>
      ))}
    </div>
  );
};

export default GameBoard; 