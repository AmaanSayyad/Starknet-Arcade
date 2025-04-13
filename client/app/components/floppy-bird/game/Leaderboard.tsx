"use client"
import React, { useState } from 'react';
import { sharedButtonStyle, sharedOverlayStyle, sharedPopupStyle } from './sharedStyles';

const Leaderboard = ({ getLeaderboard, currentState, GAME_STATES }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const formatAddress = (address) => {
    if (!address) return '';
    if (typeof address !== 'string') return address;
    if (address.length <= 10) return address;
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  const handleLeaderboardClick = async (e) => {
    e.stopPropagation();
    const data = await getLeaderboard();
    const sortedData = data
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setLeaderboard(sortedData);
    setShowPopup(true);
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    setShowPopup(false);
  };

  const buttonStyle = {
    ...sharedButtonStyle,
    top: '40px',
    backgroundColor: '#2c3e50'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #2c3e50'
  };

  const titleStyle = {
    margin: 0,
    color: '#2c3e50',
    fontSize: '12px',
    textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#2c3e50',
    padding: '4px 8px',
    lineHeight: 1,
    fontFamily: "'Press Start 2P', cursive",
    textShadow: '1px 1px 0 rgba(0,0,0,0.2)'
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const entryStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid #2c3e50',
    borderRadius: 0,
    transition: 'all 0.2s ease',
    fontSize: '8px'
  };

  const rankStyle = {
    fontWeight: 'bold',
    color: '#2c3e50',
    minWidth: '30px',
    textShadow: '1px 1px 0 rgba(0,0,0,0.1)'
  };

  const addressStyle = {
    flex: 1,
    margin: '0 10px',
    color: '#2c3e50',
    textShadow: '1px 1px 0 rgba(0,0,0,0.1)'
  };

  const scoreStyle = {
    fontWeight: 'bold',
    color: '#2c3e50',
    textShadow: '1px 1px 0 rgba(0,0,0,0.1)'
  };

  return (
    <>
      <button 
        id="leaderboard-button"
        onClick={handleLeaderboardClick}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translate(1px, 1px)';
          e.currentTarget.style.boxShadow = '1px 1px 0 #34495e';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translate(0, 0)';
          e.currentTarget.style.boxShadow = '2px 2px 0 #34495e';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translate(2px, 2px)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translate(1px, 1px)';
          e.currentTarget.style.boxShadow = '1px 1px 0 #34495e';
        }}
      >
        Leaderboard
      </button>
      {showPopup && (
        <div style={sharedOverlayStyle}>
          <div style={sharedPopupStyle}>
            <div style={headerStyle}>
              <h2 style={titleStyle}>Top 10 Players</h2>
              <button 
                style={closeButtonStyle}
                onClick={handleCloseClick}
                className="close-button"
              >
                ×
              </button>
            </div>
            <div style={contentStyle}>
              {leaderboard.map((entry, index) => (
                <div 
                  key={index} 
                  style={{
                    ...entryStyle,
                    ':hover': {
                      backgroundColor: '#fff',
                      transform: 'translate(-1px, -1px)',
                      boxShadow: '2px 2px 0 #2c3e50'
                    }
                  }}
                >
                  <span style={rankStyle}>{index + 1}</span>
                  <span style={addressStyle}>
                    {formatAddress(entry.address)}
                  </span>
                  <span style={scoreStyle}>{entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Leaderboard; 