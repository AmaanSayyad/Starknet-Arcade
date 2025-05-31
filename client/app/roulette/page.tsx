"use client";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineSound } from "react-icons/ai";
import { RiResetLeftFill } from "react-icons/ri";
import { ImSpinner4 } from "react-icons/im";
import { useAccount, useConnect } from "@starknet-react/core";
import { useRoulette } from "../hooks/useRouletteContract";
import toast from "react-hot-toast";

// Use dynamic import for the controller
let ControllerConnector: any;
if (typeof window !== 'undefined') {
  import('@cartridge/connector/controller').then(module => {
    ControllerConnector = module.default;
  });
}

const BET_TYPES = [
  { id: 0, name: "Straight", multiplier: 35, description: "Single number" },
  { id: 1, name: "Split", multiplier: 17, description: "Two adjacent numbers" },
  { id: 2, name: "Street", multiplier: 11, description: "Three numbers in a row" },
  { id: 3, name: "Corner", multiplier: 8, description: "Four numbers forming a square" },
  { id: 4, name: "Six Line", multiplier: 5, description: "Six numbers in two rows" },
  { id: 5, name: "Column", multiplier: 2, description: "Entire column" },
  { id: 6, name: "Dozen", multiplier: 2, description: "1-12, 13-24, or 25-36" },
  { id: 7, name: "Red/Black", multiplier: 1, description: "Color bet" },
  { id: 8, name: "Odd/Even", multiplier: 1, description: "Odd or even" },
  { id: 9, name: "Low/High", multiplier: 1, description: "1-18 or 19-36" },
];

const ROULETTE_NUMBERS = Array.from({ length: 37 }, (_, i) => i);

export default function RoulettePage() {
  const [connected, setConnected] = useState(false);
  const { connectors } = useConnect();
  const { address, account } = useAccount();
  const [username, setUsername] = useState<string | undefined>();
  const [controllerReady, setControllerReady] = useState(false);
  
  // Game state
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [betType, setBetType] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<string>("1000");
  const [fundAmount, setFundAmount] = useState<string>("10000");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("1000");
  const [selectedChip, setSelectedChip] = useState<number>(1000);
  const [totalBetAmount, setTotalBetAmount] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Track when ControllerConnector is loaded
  useEffect(() => {
    if (ControllerConnector) {
      setControllerReady(true);
    } else if (typeof window !== 'undefined') {
      import('@cartridge/connector/controller').then(module => {
        ControllerConnector = module.default;
        setControllerReady(true);
      }).catch(error => {
        console.error("Error loading controller:", error);
      });
    }
  }, []);
  
  // Controller connection - with safety checks
  useEffect(() => {
    if (!address || !controllerReady) return;
    
    try {
      const controller = connectors.find((c) => 
        c.constructor.name === 'ControllerConnector' || 
        (ControllerConnector && c instanceof ControllerConnector)
      );
      
      if (controller) {
        setConnected(true);
        
        // Fixed: Type assertion for username property
        const controllerWithUsername = controller as any;
        if (controllerWithUsername.username && typeof controllerWithUsername.username === 'function') {
          try {
            Promise.resolve().then(() => {
              controllerWithUsername.username()
                .then((name: string | undefined) => {
                  if (name) setUsername(name);
                })
                .catch((error: any) => {
                  if (!error.message?.includes('Not ready to connect')) {
                    console.error("Username error:", error);
                  }
                });
            });
          } catch (e) {
            // Ignore errors here
          }
        }
      }
    } catch (error) {
      console.error("Error in controller setup:", error);
    }
  }, [address, connectors, controllerReady]);

  const {
    gameState,
    currentBets,
    loading,
    fundAccount,
    createGame,
    placeBet,
    spinWheel,
    endGame,
    withdrawUserWinnings,
    withdrawHouseFunds,
    getUserBalance,
    getHouseBalance,
    getGameStatus,
  } = useRoulette(connected, account);

  // Handle fund account
  const handleFund = async () => {
    try {
      const success = await fundAccount(BigInt(fundAmount));
      if (success) {
        await getUserBalance();
      }
    } catch (error) {
      console.error("Funding error:", error);
    }
  };

  // Handle create game
  const handleCreateGame = async () => {
    try {
      const success = await createGame(BigInt(betAmount));
      if (success) {
        await getGameStatus();
      }
    } catch (error) {
      console.error("Game creation error:", error);
    }
  };

  // Handle place bet
  const handlePlaceBet = async () => {
    if (!selectedNumbers.length && betType < 5) {
      toast.error("Select numbers first");
      return;
    }

    let numbers = selectedNumbers;
    
    // Handle special bet types
    if (betType === 5) { // Column
      const column = selectedNumbers[0] || 1;
      numbers = [column];
    } else if (betType === 6) { // Dozen
      const dozen = selectedNumbers[0] || 1;
      numbers = [dozen];
    } else if (betType === 7) { // Red/Black
      numbers = [selectedNumbers[0] || 0]; // 0 = black, 1 = red
    } else if (betType === 8) { // Odd/Even
      numbers = [selectedNumbers[0] || 0]; // 0 = even, 1 = odd
    } else if (betType === 9) { // Low/High
      numbers = [selectedNumbers[0] || 0]; // 0 = low, 1 = high
    }

    try {
      const success = await placeBet(betType, numbers, BigInt(selectedChip));
      if (success) {
        setTotalBetAmount(prev => prev + selectedChip);
        setSelectedNumbers([]);
      }
    } catch (error) {
      console.error("Bet placement error:", error);
    }
  };

  // Handle spin wheel
  const handleSpin = async () => {
    if (currentBets.length === 0) {
      toast.error("Please place at least one bet before spinning");
      return;
    }

    try {
      setIsSpinning(true);
      const result = await spinWheel();
      if (result !== null) {
        // Show result with animation delay
        setTimeout(() => {
          const isWin = currentBets.some(bet => bet.numbers.includes(result));
          if (isWin) {
            toast.success(`🎉 You won! Number ${result}`);
          } else {
            toast.error(`😞 You lost! Number ${result}`);
          }
          setIsSpinning(false);
        }, 3000);
      } else {
        setIsSpinning(false);
      }
    } catch (error) {
      console.error("Spin error:", error);
      setIsSpinning(false);
    }
  };

  // Handle end game
  const handleEndGame = async () => {
    try {
      const success = await endGame();
      if (success) {
        setSelectedNumbers([]);
        setTotalBetAmount(0);
        await getUserBalance();
      }
    } catch (error) {
      console.error("End game error:", error);
    }
  };

  // Handle withdraw user winnings
  const handleWithdrawUser = async () => {
    try {
      const success = await withdrawUserWinnings(BigInt(withdrawAmount));
      if (success) {
        await getUserBalance();
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
    }
  };

  // Handle withdraw house funds
  const handleWithdrawHouse = async () => {
    try {
      const success = await withdrawHouseFunds(BigInt(withdrawAmount));
      if (success) {
        await getHouseBalance();
      }
    } catch (error) {
      console.error("House withdrawal error:", error);
    }
  };

  // Toggle number selection
  const toggleNumber = (number: number) => {
    setSelectedNumbers(prev => 
      prev.includes(number) 
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  // Reset bets
  const resetBets = () => {
    setSelectedNumbers([]);
    setTotalBetAmount(0);
  };

  // Get game status text
  const getGameStatusText = () => {
    switch (gameState.status) {
      case 0: return "No Active Game";
      case 1: return "Betting Phase";
      case 2: return "Spinning";
      case 3: return "Game Completed";
      default: return "Unknown";
    }
  };

  // Get number color class
  const getNumberColor = (number: number) => {
    if (number === 0) return "regular0";
    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    return redNumbers.includes(number) ? "red" : "black";
  };

  return (
    <>
      <div className="website-wrapper font-techno" id="website-wrapper">
        <div className="roulette-table">
          <div className="top-bar">
            <div className="roulette-rolls-container">
              <div className="roll roll5"></div>
              <div className="roll roll4"></div>
              <div className="roll roll3"></div>
              <div className="roll roll2"></div>
              <div className="roll roll1"></div>
              <div className="roll roll-last">{gameState.result || 0}</div>
            </div>
            <div className="game-name">STARKNET ROULETTE</div>
            <div className="min-max-bet">
              <div className="min-bet bet-size">
                <span className="text-color">MIN:</span> $5.00
              </div>
              <div className="max-bet bet-size">
                <span className="text-color">MAX:</span> $1000.00
              </div>
            </div>
          </div>

          {/* Game Controls Section */}
          <div className="game-controls" style={{ 
            position: 'absolute', 
            top: '100px', 
            left: '20px', 
            background: 'rgba(0,0,0,0.8)', 
            padding: '20px', 
            borderRadius: '10px',
            color: 'white',
            minWidth: '300px'
          }}>
            <h3>Game Controls</h3>
            
            {/* Fund Account */}
            <div style={{ marginBottom: '15px' }}>
              <h4>1. Fund Account</h4>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                style={{ width: '150px', marginRight: '10px', padding: '5px', color: 'black' }}
                placeholder="Amount"
              />
              <button 
                onClick={handleFund}
                disabled={loading}
                style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px' }}
              >
                {loading ? 'Funding...' : 'Fund Account'}
              </button>
            </div>

            {/* Create Game */}
            <div style={{ marginBottom: '15px' }}>
              <h4>2. Create Game</h4>
              <button 
                onClick={handleCreateGame}
                disabled={loading || Number(gameState.gameId) > 0}
                style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '3px' }}
              >
                {loading ? 'Creating...' : 'Create Game'}
              </button>
            </div>

            {/* Bet Type Selection */}
            <div style={{ marginBottom: '15px' }}>
              <h4>3. Select Bet Type</h4>
              <select
                value={betType}
                onChange={(e) => setBetType(Number(e.target.value))}
                style={{ width: '100%', padding: '5px', color: 'black' }}
              >
                {BET_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.multiplier}x)
                  </option>
                ))}
              </select>
            </div>

            {/* Place Bet */}
            <div style={{ marginBottom: '15px' }}>
              <h4>4. Place Bet</h4>
              <p>Selected Numbers: {selectedNumbers.join(', ') || 'None'}</p>
              <button 
                onClick={handlePlaceBet}
                disabled={loading || gameState.status !== 1}
                style={{ padding: '5px 10px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '3px' }}
              >
                {loading ? 'Placing...' : `Place Bet ($${selectedChip})`}
              </button>
            </div>

            {/* Game Status */}
            <div style={{ marginBottom: '15px' }}>
              <h4>Game Status</h4>
              <p>Status: {getGameStatusText()}</p>
              <p>Game ID: {gameState.gameId.toString()}</p>
              <p>User Balance: {gameState.userBalance.toString()}</p>
              <p>Total Bet: ${totalBetAmount}</p>
              {Number(gameState.result) > 0 && <p>Last Result: {gameState.result.toString()}</p>}
            </div>

            {/* End Game */}
            <div style={{ marginBottom: '15px' }}>
              <button 
                onClick={handleEndGame}
                disabled={loading || gameState.status !== 3}
                style={{ padding: '5px 10px', backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: '3px' }}
              >
                {loading ? 'Ending...' : 'End Game'}
              </button>
            </div>

            {/* Withdrawals */}
            <div>
              <h4>Withdrawals</h4>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                style={{ width: '100px', marginRight: '10px', padding: '5px', color: 'black' }}
                placeholder="Amount"
              />
              <button 
                onClick={handleWithdrawUser}
                disabled={loading}
                style={{ padding: '5px 10px', backgroundColor: '#795548', color: 'white', border: 'none', borderRadius: '3px', marginRight: '5px' }}
              >
                Withdraw User
              </button>
              <button 
                onClick={handleWithdrawHouse}
                disabled={loading}
                style={{ padding: '5px 10px', backgroundColor: '#607D8B', color: 'white', border: 'none', borderRadius: '3px' }}
              >
                Withdraw House
              </button>
            </div>
          </div>

          <div className="roulette-wheel-container">
            <div className="roulette-wheel">
              <div className={`roulette-wheel-main roulette-image ${isSpinning ? 'spinning' : ''}`}></div>
              <div className="roulette-center roulette-image"></div>
              <div className="roulette-cross-shadow roulette-image"></div>
              <div className="roulette-cross roulette-image">
                <div className="number-glow-container"></div>
              </div>
              <div className="ball-container"></div>
            </div>
          </div>

          <div className="betting-area">
            <div className="top-area">
              {/* Number 0 */}
              <div 
                className={`number number0 regular regular0 part ${selectedNumbers.includes(0) ? 'selected' : ''}`}
                onClick={() => toggleNumber(0)}
              >
                0
              </div>
              
              {/* Numbers 1-36 */}
              {ROULETTE_NUMBERS.slice(1).map((number) => (
                <div 
                  key={number}
                  className={`number number${number} ${getNumberColor(number)} ${selectedNumbers.includes(number) ? 'selected' : ''}`}
                  onClick={() => toggleNumber(number)}
                >
                  {number}
                </div>
              ))}
              
              {/* 2 to 1 bets */}
              <div className="number bet2to1-1 part" onClick={() => setBetType(5)}>2 to 1</div>
              <div className="number bet2to1-2 part" onClick={() => setBetType(5)}>2 to 1</div>
              <div className="number bet2to1-3 part" onClick={() => setBetType(5)}>2 to 1</div>
            </div>

            <div className="bottom-area">
              <div className="bottom-column bottom-column1 column-1st12 part" onClick={() => setBetType(6)}>1st 12</div>
              <div className="bottom-column bottom-column2 column-2nd12 part" onClick={() => setBetType(6)}>2nd 12</div>
              <div className="bottom-column bottom-column3 column-3rd12 part" onClick={() => setBetType(6)}>3rd 12</div>
              <div className="bottom-column bottom-column4 column-1to18 part" onClick={() => setBetType(9)}>1 to 18</div>
              <div className="bottom-column bottom-column5 column-even part" onClick={() => setBetType(8)}>EVEN</div>
              <div className="bottom-column bottom-column6 column-red part" onClick={() => setBetType(7)}>RED</div>
              <div className="bottom-column bottom-column7 column-black part" onClick={() => setBetType(7)}>BLACK</div>
              <div className="bottom-column bottom-column8 column-odd part" onClick={() => setBetType(8)}>ODD</div>
              <div className="bottom-column bottom-column9 column-19to36 part" onClick={() => setBetType(9)}>19 to 36</div>
            </div>
          </div>

          <div className="selections-container">
            <div className="betting-chips-container">
              {[5, 10, 20, 50, 100, 200].map((chipValue) => (
                <div
                  key={chipValue}
                  className={`betting-chip betting-chip-menu betting-chip-menu${chipValue} betting-chip${chipValue} ${selectedChip === chipValue ? 'selected' : ''}`}
                  onClick={() => setSelectedChip(chipValue)}
                >
                  {chipValue}
                </div>
              ))}
            </div>

            <div className="menu-container">
              <div className="button button-spin" onClick={handleSpin}>
                <div className="circle">
                  <ImSpinner4 size={50} className={isSpinning ? 'spinning' : ''} />
                </div>
                <div className="circle-overlay"></div>
                <div className="button-text">SPIN</div>
              </div>

              <div className="button button-reset" onClick={resetBets}>
                <div className="circle">
                  <RiResetLeftFill size={50} />
                </div>
                <div className="circle-overlay"></div>
                <div className="button-text">RESET</div>
              </div>

              <div className="button button-sound">
                <div className="circle">
                  <AiOutlineSound size={50} />
                </div>
                <div className="circle-overlay"></div>
                <div className="button-text">SOUNDS</div>
              </div>
            </div>
          </div>

          <div className="money-container">
            <div className="cash-area area">
              <div className="text">Balance:</div>
              <div className="cash-total">${gameState.userBalance.toString()}</div>
            </div>
            <div className="bet-area area">
              <div className="text"><span>BET</span> $</div>
              <div className="bet-total">{totalBetAmount.toFixed(2)}</div>
            </div>
          </div>

          {/* Alert Messages */}
          {gameState.status === 1 && currentBets.length === 0 && (
            <div className="alert-message-container alert-bets">
              <div className="alert-message">PLEASE PLACE YOUR BETS</div>
            </div>
          )}

          {gameState.status === 2 && (
            <div className="alert-message-container alert-spin-result">
              <div className="results">
                <div className="roll-number text">{gameState.result.toString()}</div>
                <div className="win-lose text">
                  {currentBets.some(bet => bet.numbers.includes(Number(gameState.result))) ? 'WIN' : 'LOSE'}
                </div>
                {Number(gameState.winAmount) > 0 && (
                  <div className="win-amount text">{gameState.winAmount.toString()}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .selected {
          background-color: #FFD700 !important;
          border: 2px solid #FFA500 !important;
        }
        .spinning {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .number {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .number:hover {
          transform: scale(1.1);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        .betting-chip {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .betting-chip:hover {
          transform: scale(1.1);
        }
        .betting-chip.selected {
          border: 3px solid #FFD700;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
        }
      `}</style>
    </>
  );
}
