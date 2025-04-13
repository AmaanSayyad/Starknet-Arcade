"use client"
import React, { useEffect, useState } from 'react';
import SmallNumber from './SmallNumber';

const ScoreBoard = ({ 
  showScoreboard, 
  showReplay, 
  score, 
  highScore, 
  handleReplayClick,
  address,
  getLeaderboard
}) => {
  const [leaderboardPosition, setLeaderboardPosition] = useState(null);

  useEffect(() => {
    if (showScoreboard && address) {
      const loadLeaderboard = async () => {
        const leaderboard = await getLeaderboard();
        const position = leaderboard.findIndex(entry => entry.address === address);
        setLeaderboardPosition(position >= 0 ? position + 1 : null);
      };
      loadLeaderboard();
    }
  }, [showScoreboard, address, getLeaderboard]);

  if (!showScoreboard) return null;

  const getMedalImage = () => {
    if (!leaderboardPosition) return null;
    switch (leaderboardPosition) {
      case 1:
        return 'medal_gold.png';
      case 2:
        return 'medal_silver.png';
      case 3:
        return 'medal_bronze.png';
      default:
        return null;
    }
  };

  const medalImage = getMedalImage();

  return (
    <div id="scoreboard" className={showScoreboard ? 'show' : ''}>
      <div id="currentscore">
        <SmallNumber number={score} />
      </div>
      <div id="highscore">
        <SmallNumber number={highScore} />
      </div>
      {medalImage && (
        <div id="medal" style={{ backgroundImage: `url('../assets/${medalImage}')` }} />
      )}
      {showReplay && (
        <div id="replay" className={showReplay ? 'show' : ''} onClick={handleReplayClick} />
      )}
    </div>
  );
};

export default ScoreBoard; 