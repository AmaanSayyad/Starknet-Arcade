"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineSound } from "react-icons/ai";
import { RiResetLeftFill } from "react-icons/ri";
import { ImSpinner4 } from "react-icons/im";
import { useAccount, useConnect } from "@starknet-react/core";
import { useRoulette, CHIP_VALUES, SPECIAL_BET_TYPES } from "../hooks/useRouletteContract";
import toast from "react-hot-toast";


//controller
// @ts-ignore
// final controller touch 
let ControllerConnector: any;
if (typeof window !== 'undefined') {
  import('@cartridge/connector/controller').then(module => {
    ControllerConnector = module.default;
  }).catch(() => {});
}

const ROULETTE_NUMBERS = Array.from({ length: 37 }, (_, i) => i);
const OWNER_ADDRESS = "0x038eeEB2075B9e4a97dE0756f1516F8D33716591827BAf389e89426Fdc8Be98f";

export default function RoulettePage() {
  const [connected, setConnected] = useState(false);
  const { connectors } = useConnect();
  const { address, account } = useAccount();
  const [username, setUsername] = useState<string | undefined>();
  const [controllerReady, setControllerReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if user is owner
  const isOwner = address?.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  // Modals
  const [showFundModal, setShowFundModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showWithdrawHouseModal, setShowWithdrawHouseModal] = useState(false);

  // Form states
  const [fundAmount, setFundAmount] = useState("100000");
  const [withdrawAmount, setWithdrawAmount] = useState("1000");
  const [withdrawHouseAmount, setWithdrawHouseAmount] = useState("5000");

  // Game states
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameResult, setGameResult] = useState<{ number: number; isWin: boolean; winAmount: string } | null>(null);
  const [lastResults, setLastResults] = useState<number[]>([]);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [spinStartTime, setSpinStartTime] = useState<number>(0);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (ControllerConnector) {
      setControllerReady(true);
    } else if (typeof window !== 'undefined') {
      import('@cartridge/connector/controller').then(module => {
        ControllerConnector = module.default;
        setControllerReady(true);
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!address || !controllerReady) return;
    try {
      const controller = connectors.find((c) =>
        c.constructor.name === 'ControllerConnector' ||
        (ControllerConnector && c instanceof ControllerConnector)
      );
      if (controller) {
        setConnected(true);
        const controllerWithUsername = controller as any;
        if (controllerWithUsername.username && typeof controllerWithUsername.username === 'function') {
          controllerWithUsername.username()
            .then((name: string | undefined) => {
              if (name) setUsername(name);
            })
            .catch(() => {});
        }
      }
    } catch {}
  }, [address, connectors, controllerReady]);

  const {
    userBalance,
    houseBalance,
    selectedNumbers,
    setSelectedNumbers,
    selectedSpecialBets,
    toggleSpecialBet,
    selectedChip,
    setSelectedChip,
    totalBetAmount,
    pendingBets,
    loading,
    depositHouseFunds,
    placeBets,
    spinWheel,
    withdrawUserWinnings,
    withdrawHouseFunds,
    resetBets,
    toggleNumber,
  } = useRoulette(connected, account);

  // Auto-detect bet type based on selected numbers and special bets
  const getBetTypeInfo = () => {
    const numberCount = selectedNumbers.length;
    const specialBetsCount = Object.keys(selectedSpecialBets).length;
    const totalBets = numberCount + specialBetsCount;
    
    if (totalBets === 0) return { type: "None", multiplier: 0, description: "Select numbers or bets" };
    if (totalBets === 1) {
      if (numberCount === 1) return { type: "Straight", multiplier: 35, description: "Single number" };
      if (specialBetsCount === 1) return { type: "Special", multiplier: "1-2", description: "Special bet" };
    }
    return { type: "Multi-bet", multiplier: "Various", description: `${totalBets} bets selected` };
  };

  // Enhanced spin function
  const handleSpin = async () => {
    const totalBets = selectedNumbers.length + Object.keys(selectedSpecialBets).length;
    if (totalBets === 0) {
      toast.error("Please select at least one bet before spinning");
      return;
    }
    
    setIsSpinning(true);
    setGameResult(null);
    setSpinResult(null);
    setSpinStartTime(Date.now());
    
    // Start spinning animation
    const baseRotation = 3600 + Math.random() * 3600;
    const newRotation = wheelRotation + baseRotation;
    setWheelRotation(newRotation);
    
    // Spin the wheel
    const result = await spinWheel();
    
    if (result !== null) {
      const elapsedTime = Date.now() - spinStartTime;
      const minSpinTime = 4000;
      const remainingTime = Math.max(1000, minSpinTime - elapsedTime);
      
      setTimeout(() => {
        setSpinResult(result);
        setLastResults(prev => [result, ...prev.slice(0, 4)]);
        
        const numberWins = selectedNumbers.some(bet => bet.number === result);
        const specialWins = checkSpecialBetWins(result);
        const isWin = numberWins || specialWins;
        
        const winAmount = isWin ? calculateWinAmount(result).toString() : "0";
        setGameResult({ number: result, isWin, winAmount });
        
        setTimeout(() => {
          if (isWin) {
            toast.success(`🎉 You won! Number ${result}`);
          } else {
            toast.error(`😞 You lost! Number ${result}`);
          }
          setIsSpinning(false);
          resetBets();
        }, 1500);
      }, remainingTime);
    } else {
      setIsSpinning(false);
    }
  };

  // Check special bet wins
  const checkSpecialBetWins = (result: number): boolean => {
    if (result === 0) return false;
    
    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    const isRed = redNumbers.includes(result);
    const isOdd = result % 2 === 1;
    const isLow = result <= 18;
    const dozen = Math.ceil(result / 12);
    const column = ((result - 1) % 3) + 1;
    
    return (
      (selectedSpecialBets.red && isRed) ||
      (selectedSpecialBets.black && !isRed) ||
      (selectedSpecialBets.odd && isOdd) ||
      (selectedSpecialBets.even && !isOdd) ||
      (selectedSpecialBets.low && isLow) ||
      (selectedSpecialBets.high && !isLow) ||
      (selectedSpecialBets.dozen1 && dozen === 1) ||
      (selectedSpecialBets.dozen2 && dozen === 2) ||
      (selectedSpecialBets.dozen3 && dozen === 3) ||
      (selectedSpecialBets.column1 && column === 1) ||
      (selectedSpecialBets.column2 && column === 2) ||
      (selectedSpecialBets.column3 && column === 3)
    );
  };

  // Calculate win amount with individual chip values
  const calculateWinAmount = (result: number): number => {
    let totalWin = 0;
    
    const winningNumberBet = selectedNumbers.find(bet => bet.number === result);
    if (winningNumberBet) {
      totalWin += winningNumberBet.chip * 35 * 0.98;
    }
    
    if (result !== 0) {
      const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
      const isRed = redNumbers.includes(result);
      const isOdd = result % 2 === 1;
      const isLow = result <= 18;
      const dozen = Math.ceil(result / 12);
      const column = ((result - 1) % 3) + 1;
      
      Object.entries(selectedSpecialBets).forEach(([betKey, chip]) => {
        const betInfo = SPECIAL_BET_TYPES[betKey as keyof typeof SPECIAL_BET_TYPES];
        if (!betInfo) return;
        
        let won = false;
        
        switch (betKey) {
          case 'red': won = isRed; break;
          case 'black': won = !isRed; break;
          case 'odd': won = isOdd; break;
          case 'even': won = !isOdd; break;
          case 'low': won = isLow; break;
          case 'high': won = !isLow; break;
          case 'dozen1': won = dozen === 1; break;
          case 'dozen2': won = dozen === 2; break;
          case 'dozen3': won = dozen === 3; break;
          case 'column1': won = column === 1; break;
          case 'column2': won = column === 2; break;
          case 'column3': won = column === 3; break;
        }
        
        if (won) {
          totalWin += chip * betInfo.payout * 0.98;
        }
      });
    }
    
    return totalWin;
  };

  // Place bets with auto-detection
  const handlePlaceBets = async () => {
    const totalBets = selectedNumbers.length + Object.keys(selectedSpecialBets).length;
    if (totalBets === 0) {
      toast.error("Please select at least one bet");
      return;
    }
    if (totalBets > 20) {
      toast.error("Maximum 20 bets allowed");
      return;
    }
    
    await placeBets();
  };

  // Professional casino colors
  const getNumberColor = (number: number) => {
    if (number === 0) return "#00C853";
    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    return redNumbers.includes(number) ? "#DC143C" : "#000000";
  };

  // Get chip image path
  const getChipImage = (value: number) => {
    const chipMap: { [key: number]: string } = {
      5000: "/chips/chip-5.png",
      10000: "/chips/chip-10.png",
      20000: "/chips/chip-20.png",
      50000: "/chips/chip-50.png",
      100000: "/chips/chip-100.png",
      200000: "/chips/chip-200.png"
    };
    return chipMap[value] || "/chips/chip-5.png";
  };

  const betTypeInfo = getBetTypeInfo();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      fontFamily: "'Orbitron', 'Arial', sans-serif",
      color: "#FFD700"
    }}>
      {/* INCREASED: Sidebar with larger sizes */}
      <div style={{
        width: isMobile ? "100%" : 320, // INCREASED from 260
        background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
        color: "#FFD700",
        padding: isMobile ? "20px" : "24px 20px", // INCREASED padding
        borderRight: isMobile ? "none" : "3px solid #FFD700",
        borderBottom: isMobile ? "3px solid #FFD700" : "none",
        height: isMobile ? "auto" : "calc(100vh - 160px)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        justifyContent: isMobile ? "space-between" : "flex-start",
        alignItems: isMobile ? "center" : "stretch",
        gap: isMobile ? 12 : 20, // INCREASED gap
        boxShadow: "0 0 30px rgba(255, 215, 0, 0.3)",
        overflowY: isMobile ? "visible" : "auto",
        position: isMobile ? "static" : "fixed",
        left: isMobile ? "auto" : 0,
        top: isMobile ? "auto" : 80,
        zIndex: 10
      }}>
        <div style={{ 
          fontSize: isMobile ? 16 : 22, // INCREASED font sizes
          fontWeight: 700, 
          letterSpacing: 2, 
          marginBottom: isMobile ? 0 : 16, // INCREASED margin
          textShadow: "0 0 15px #FFD700",
          background: "linear-gradient(45deg, #FFD700, #FFA500)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
          whiteSpace: isMobile ? "nowrap" : "normal"
        }}>
          {isMobile ? "STARKNET ROULETTE" : "STARKNET\nROULETTE"}
        </div>
        
        {!isMobile && (
          <>
            <div style={{ 
              fontSize: 14, // INCREASED from 12
              marginBottom: 16, // INCREASED margin
              padding: "16px", // INCREASED padding
              background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05))",
              borderRadius: "12px",
              border: "2px solid rgba(255, 215, 0, 0.3)",
              boxShadow: "0 4px 16px rgba(255, 215, 0, 0.1)"
            }}>
              <div style={{ marginBottom: 8 }}>
                <strong>Status:</strong> <span style={{ color: connected ? "#00FF88" : "#FF4444" }}>
                  {connected ? "Connected" : "Disconnected"}
                </span>
              </div>
              {username && <div style={{ marginBottom: 8 }}>User: {username}</div>}
              {address && <div>Address: {address.slice(0, 6)}...{address.slice(-4)}</div>}
            </div>
            
            <div style={{ 
              fontSize: 14, // INCREASED from 12
              marginBottom: 16, // INCREASED margin
              padding: "16px", // INCREASED padding
              background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05))",
              borderRadius: "12px",
              border: "2px solid rgba(255, 215, 0, 0.3)",
              boxShadow: "0 4px 16px rgba(255, 215, 0, 0.1)"
            }}>
              <div><strong>User Balance:</strong> {userBalance.toString()}</div>
              <div><strong>House Balance:</strong> {houseBalance.toString()}</div>
              <div><strong>Current Bets:</strong> {pendingBets.length}</div>
              <div><strong>Total Bet:</strong> {totalBetAmount}</div>
              <div><strong>Bet Type:</strong> {betTypeInfo.type}</div>
              <div><strong>Special Bets:</strong> {Object.entries(selectedSpecialBets).map(([key, chip]) => `${SPECIAL_BET_TYPES[key as keyof typeof SPECIAL_BET_TYPES]?.label}(${chip/1000}k)`).join(", ") || "None"}</div>
            </div>
          </>
        )}
        
        <div style={{ 
          display: "flex", 
          flexDirection: isMobile ? "row" : "column", 
          gap: isMobile ? 12 : 12 // INCREASED gap
        }}>
          {isOwner && (
            <>
              <button onClick={() => setShowFundModal(true)} style={enhancedSidebarBtn(false, isMobile)}>
                💰 {isMobile ? "Fund" : "Fund Contract"}
              </button>
              <button onClick={() => setShowWithdrawHouseModal(true)} style={enhancedSidebarBtn(false, isMobile)}>
                🏦 {isMobile ? "Withdraw" : "Withdraw House"}
              </button>
            </>
          )}
          <button onClick={() => setShowWithdrawModal(true)} style={enhancedSidebarBtn(false, isMobile)}>
            💸 {isMobile ? "Winnings" : "Withdraw Winnings"}
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div style={{
        marginLeft: isMobile ? 0 : 320, // INCREASED from 260
        width: isMobile ? "100%" : "calc(100% - 320px)", // INCREASED
        minHeight: isMobile ? "auto" : "100vh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #2a2a2a 100%)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          padding: isMobile ? "24px 20px" : "50px 40px", // INCREASED padding
          height: isMobile ? "auto" : "100vh",
          overflowY: "auto",
          background: "radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 70%)"
        }}>
          {/* Enhanced Top Bar with MIN/MAX */}
          <div style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: isMobile ? 25 : 40 // INCREASED margin
          }}>
            <div style={{
              fontSize: isMobile ? 16 : 22, // INCREASED font size
              color: "#FFD700",
              fontWeight: "bold",
              textShadow: "0 0 15px #FFD700",
              padding: isMobile ? "12px 20px" : "14px 28px", // INCREASED padding
              background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05))",
              borderRadius: "24px", // INCREASED border radius
              border: "3px solid #FFD700", // INCREASED border
              boxShadow: "0 6px 20px rgba(255, 215, 0, 0.3)" // INCREASED shadow
            }}>
              MIN: 5000&nbsp;&nbsp;MAX: 200000
            </div>
          </div>

          {/* INCREASED: Centered layout with proper spacing */}
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 40 : 100, // INCREASED spacing
            alignItems: "center",
            justifyContent: "center",
            marginBottom: isMobile ? 40 : 50 // INCREASED margin
          }}>
            {/* Left Side - Roulette Wheel with Result on Top */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: isMobile ? 20 : 30, // INCREASED gap
              order: isMobile ? 1 : 1
            }}>
              {/* Result Display on Top of Wheel */}
              {gameResult && !isSpinning && (
                <div style={{
                  background: gameResult.isWin 
                    ? "linear-gradient(135deg, #00FF88, #00CC6A)" 
                    : "linear-gradient(135deg, #FF4444, #CC3333)",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: isMobile ? 24 : 32, // INCREASED font size
                  borderRadius: 20, // INCREASED border radius
                  padding: isMobile ? "16px 32px" : "20px 40px", // INCREASED padding
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)", // INCREASED shadow
                  border: "4px solid #fff", // INCREASED border
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: "0 3px 6px rgba(0, 0, 0, 0.6)", // INCREASED shadow
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: isMobile ? 28 : 40, marginBottom: 10 }}>{gameResult.number}</div>
                  <div>{gameResult.isWin ? '🎉 WIN!' : '😞 LOSE'}</div>
                </div>
              )}

              {/* Recent Results */}
              <div style={{
                display: "flex",
                gap: isMobile ? 8 : 12, // INCREASED gap
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center"
              }}>
                <span style={{ 
                  color: "#FFD700", 
                  fontWeight: "bold", 
                  marginRight: 12, // INCREASED margin
                  textShadow: "0 0 12px #FFD700", // INCREASED shadow
                  fontSize: isMobile ? 14 : 18 // INCREASED font size
                }}>Recent:</span>
                {lastResults.map((result, i) => (
                  <div key={i} style={{
                    width: isMobile ? 35 : 45, // INCREASED size
                    height: isMobile ? 35 : 45, // INCREASED size
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${getNumberColor(result)}, ${getNumberColor(result)}dd)`,
                    color: "#fff", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    fontWeight: 700, 
                    fontSize: isMobile ? 14 : 18, // INCREASED font size
                    border: "3px solid #FFD700", // INCREASED border
                    boxShadow: "0 0 20px rgba(255, 215, 0, 0.4)" // INCREASED shadow
                  }}>
                    {result}
                  </div>
                ))}
              </div>

              {/* Enhanced Roulette Wheel */}
              <div style={{
                width: isMobile ? 250 : 380, // INCREASED size
                height: isMobile ? 250 : 380, // INCREASED size
                borderRadius: "50%",
                background: "radial-gradient(circle, #8B4513 0%, #654321 50%, #3E2723 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 0 60px rgba(255, 215, 0, 0.6), inset 0 0 50px rgba(0, 0, 0, 0.6)", // INCREASED shadow
                border: "8px solid #FFD700", // INCREASED border
                position: "relative"
              }}>
                <img
                  src="/chips/roulette-wheel.png"
                  alt="Roulette Wheel"
                  style={{
                    width: isMobile ? "230px" : "360px", // INCREASED size
                    height: isMobile ? "230px" : "360px", // INCREASED size
                    borderRadius: "50%",
                    transform: `rotate(${wheelRotation}deg)`,
                    transition: isSpinning ? "transform 8s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
                    filter: "drop-shadow(0 0 25px rgba(255, 215, 0, 0.5))" // INCREASED shadow
                  }}
                />
                <div style={{
                  position: "absolute",
                  top: "10px", // INCREASED position
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "14px", // INCREASED size
                  height: "14px", // INCREASED size
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #fff, #ccc)",
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.9)", // INCREASED shadow
                  zIndex: 10
                }} />
              </div>
            </div>

            {/* Right Side - Professional Roulette Table */}
            <div style={{
              background: "linear-gradient(135deg, #1a5d1a 0%, #0d4a0d 100%)",
              padding: isMobile ? "20px 16px" : "32px 28px", // INCREASED padding
              borderRadius: 20, // INCREASED border radius
              boxShadow: "0 15px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)", // INCREASED shadow
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "4px solid #FFD700", // INCREASED border
              position: "relative",
              order: isMobile ? 2 : 2,
              maxWidth: isMobile ? "100%" : "auto",
              overflowX: isMobile ? "auto" : "visible"
            }}>
              {/* Board grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile 
                  ? "60px repeat(12, 42px) 42px"  // INCREASED sizes
                  : "85px repeat(12, 60px) 60px", // INCREASED sizes
                gridTemplateRows: isMobile 
                  ? "repeat(3, 42px)"  // INCREASED sizes
                  : "repeat(3, 60px)", // INCREASED sizes
                gap: "3px", // INCREASED gap
                marginBottom: 16 // INCREASED margin
              }}>
                {/* Zero */}
                <div
                  style={{
                    gridColumn: "1",
                    gridRow: "1 / span 3",
                    background: "linear-gradient(135deg, #00C853, #00A843)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px", // INCREASED border radius
                    fontWeight: 700,
                    fontSize: isMobile ? 20 : 28, // INCREASED font size
                    border: selectedNumbers.some(bet => bet.number === 0) ? "4px solid #FFD700" : "3px solid #fff", // INCREASED border
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)", // INCREASED shadow
                    transition: "all 0.3s ease",
                    textShadow: "0 3px 6px rgba(0, 0, 0, 0.6)", // INCREASED shadow
                    position: "relative"
                  }}
                  onClick={() => toggleNumber(0)}
                >
                  0
                  {selectedNumbers.find(bet => bet.number === 0) && (
                    <span style={{
                      position: "absolute",
                      bottom: "-15px", // INCREASED position
                      background: "gold",
                      color: "black",
                      borderRadius: "4px", // INCREASED border radius
                      padding: "2px 6px", // INCREASED padding
                      fontSize: "10px", // INCREASED font size
                      fontWeight: "bold"
                    }}>
                      {selectedNumbers.find(bet => bet.number === 0)!.chip / 1000}k
                    </span>
                  )}
                </div>
                
                {/* Numbers 1-36 */}
                {Array.from({ length: 36 }, (_, i) => {
                  const number = i + 1;
                  const row = (i % 3) + 1;
                  const col = Math.floor(i / 3) + 2;
                  const baseColor = getNumberColor(number);
                  const bet = selectedNumbers.find(b => b.number === number);
                  return (
                    <div
                      key={number}
                      style={{
                        gridColumn: col,
                        gridRow: row,
                        background: `linear-gradient(135deg, ${baseColor}, ${baseColor}dd)`,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px", // INCREASED border radius
                        fontWeight: 700,
                        fontSize: isMobile ? 16 : 22, // INCREASED font size
                        border: bet ? "4px solid #FFD700" : "3px solid #fff", // INCREASED border
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)", // INCREASED shadow
                        transition: "all 0.3s ease",
                        textShadow: "0 3px 6px rgba(0, 0, 0, 0.6)", // INCREASED shadow
                        position: "relative"
                      }}
                      onClick={() => toggleNumber(number)}
                    >
                      {number}
                      {bet && (
                        <span style={{
                          position: "absolute",
                          bottom: "-15px", // INCREASED position
                          background: "gold",
                          color: "black",
                          borderRadius: "4px", // INCREASED border radius
                          padding: "2px 6px", // INCREASED padding
                          fontSize: "10px", // INCREASED font size
                          fontWeight: "bold"
                        }}>
                          {bet.chip / 1000}k
                        </span>
                      )}
                    </div>
                  );
                })}
                
                {/* 2 to 1 bets (clickable columns) */}
                {[1, 2, 3].map(column => (
                  <div
                    key={`column${column}`}
                    style={{
                      gridColumn: isMobile ? "14" : "14",
                      gridRow: column,
                      background: selectedSpecialBets[`column${column}`] 
                        ? "linear-gradient(135deg, #FFD700, #FFA500)" 
                        : "linear-gradient(135deg, #2a2a2a, #1a1a1a)",
                      color: selectedSpecialBets[`column${column}`] 
                        ? "#000" 
                        : "#FFD700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px", // INCREASED border radius
                      fontWeight: 700,
                      fontSize: isMobile ? 10 : 14, // INCREASED font size
                      border: selectedSpecialBets[`column${column}`] ? "4px solid #FFD700" : "3px solid #FFD700", // INCREASED border
                      cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)", // INCREASED shadow
                      transition: "all 0.3s ease",
                      textShadow: selectedSpecialBets[`column${column}`] ? "0 2px 4px rgba(0, 0, 0, 0.4)" : "0 0 8px #FFD700", // INCREASED shadow
                      position: "relative"
                    }}
                    onClick={() => toggleSpecialBet(`column${column}`)}
                  >
                    2 to 1
                    {selectedSpecialBets[`column${column}`] && (
                      <span style={{
                        position: "absolute",
                        bottom: "-15px", // INCREASED position
                        background: "gold",
                        color: "black",
                        borderRadius: "4px", // INCREASED border radius
                        padding: "2px 6px", // INCREASED padding
                        fontSize: "10px", // INCREASED font size
                        fontWeight: "bold"
                      }}>
                        {selectedSpecialBets[`column${column}`] / 1000}k
                      </span>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Bottom betting areas (clickable) */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile 
                  ? "repeat(9, 1fr)" 
                  : "repeat(9, 1fr)",
                gap: "3px", // INCREASED gap
                width: "100%",
                maxWidth: isMobile ? "100%" : "850px" // INCREASED max width
              }}>
                {[
                  { label: "1st 12", betKey: "dozen1", color: "#2a2a2a" },
                  { label: "2nd 12", betKey: "dozen2", color: "#2a2a2a" },
                  { label: "3rd 12", betKey: "dozen3", color: "#2a2a2a" },
                  { label: "1 to 18", betKey: "low", color: "#2a2a2a" },
                  { label: "EVEN", betKey: "even", color: "#2a2a2a" },
                  { label: "RED", betKey: "red", color: "#DC143C" },
                  { label: "BLACK", betKey: "black", color: "#000000" },
                  { label: "ODD", betKey: "odd", color: "#2a2a2a" },
                  { label: "19 to 36", betKey: "high", color: "#2a2a2a" }
                ].map((item) => {
                  const isSelected = !!selectedSpecialBets[item.betKey];
                  return (
                    <div
                      key={item.betKey}
                      style={{
                        background: isSelected 
                          ? "linear-gradient(135deg, #FFD700, #FFA500)" 
                          : `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                        color: isSelected ? "#000" : "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px", // INCREASED border radius
                        fontWeight: 700,
                        fontSize: isMobile ? 11 : 15, // INCREASED font size
                        border: isSelected ? "4px solid #FFD700" : "3px solid #FFD700", // INCREASED border
                        cursor: "pointer",
                        height: isMobile ? 38 : 50, // INCREASED height
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)", // INCREASED shadow
                        transition: "all 0.3s ease",
                        textShadow: isSelected ? "0 2px 4px rgba(0, 0, 0, 0.4)" : "0 3px 6px rgba(0, 0, 0, 0.6)", // INCREASED shadow
                        position: "relative"
                      }}
                      onClick={() => toggleSpecialBet(item.betKey)}
                    >
                      {item.label}
                      {isSelected && (
                        <span style={{
                          position: "absolute",
                          bottom: "-15px", // INCREASED position
                          background: "gold",
                          color: "black",
                          borderRadius: "4px", // INCREASED border radius
                          padding: "2px 6px", // INCREASED padding
                          fontSize: "10px", // INCREASED font size
                          fontWeight: "bold"
                        }}>
                          {selectedSpecialBets[item.betKey] / 1000}k
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Enhanced Place Bet Button */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: isMobile ? 40 : 50 }}>
            <button
              onClick={handlePlaceBets}
              disabled={loading || (selectedNumbers.length === 0 && Object.keys(selectedSpecialBets).length === 0)}
              style={{
                background: loading || (selectedNumbers.length === 0 && Object.keys(selectedSpecialBets).length === 0)
                  ? "linear-gradient(135deg, #666, #444)" 
                  : "linear-gradient(135deg, #FFD700, #FFA500)",
                color: loading || (selectedNumbers.length === 0 && Object.keys(selectedSpecialBets).length === 0) ? "#999" : "#000",
                border: "none",
                borderRadius: "18px", // INCREASED border radius
                padding: isMobile ? "16px 40px" : "20px 60px", // INCREASED padding
                fontSize: isMobile ? 18 : 24, // INCREASED font size
                fontWeight: "bold",
                cursor: loading || (selectedNumbers.length === 0 && Object.keys(selectedSpecialBets).length === 0) ? "not-allowed" : "pointer",
                boxShadow: loading || (selectedNumbers.length === 0 && Object.keys(selectedSpecialBets).length === 0)
                  ? "0 6px 20px rgba(0, 0, 0, 0.4)" 
                  : "0 8px 32px rgba(255, 215, 0, 0.5)", // INCREASED shadow
                transition: "all 0.3s ease",
                textShadow: "0 3px 6px rgba(0, 0, 0, 0.4)", // INCREASED shadow
                fontFamily: "'Orbitron', sans-serif"
              }}
            >
              {loading ? 'Placing...' : `Place Bet (${totalBetAmount} tokens)`}
            </button>
          </div>

          {/* INCREASED: Chips and Controls with proper spacing */}
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            alignItems: "center",
            gap: isMobile ? 40 : 100, // INCREASED spacing between chips and controls
            marginBottom: 30, // INCREASED margin
            padding: isMobile ? "20px" : "28px", // INCREASED padding
            background: "linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(10, 10, 10, 0.9))",
            borderRadius: "20px", // INCREASED border radius
            border: "3px solid #FFD700", // INCREASED border
            boxShadow: "0 10px 40px rgba(255, 215, 0, 0.3)", // INCREASED shadow
            backdropFilter: "blur(20px)" // INCREASED blur
          }}>
            {/* Chips */}
            <div style={{
              display: "flex",
              gap: isMobile ? 15 : 20, // INCREASED gap
              alignItems: "center",
              flexWrap: isMobile ? "wrap" : "nowrap",
              justifyContent: "center"
            }}>
              {CHIP_VALUES.map(chip => (
                <div
                  key={chip.label}
                  style={{
                    width: isMobile ? 55 : 75, // INCREASED size
                    height: isMobile ? 55 : 75, // INCREASED size
                    borderRadius: "50%",
                    border: selectedChip === chip.value ? "4px solid #FFD700" : "3px solid #fff", // INCREASED border
                    boxShadow: selectedChip === chip.value
                      ? "0 0 30px 8px #FFD700, 0 6px 20px #222" // INCREASED shadow
                      : "0 6px 20px #111", // INCREASED shadow
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backgroundImage: `url(${getChipImage(chip.value)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    transform: selectedChip === chip.value ? "scale(1.15)" : "scale(1)" // INCREASED scale
                  }}
                  onClick={() => setSelectedChip(chip.value)}
                >
                  <span style={{
                    position: "absolute",
                    bottom: "-8px", // INCREASED position
                    background: "rgba(0, 0, 0, 0.9)",
                    color: "#FFD700",
                    padding: "2px 6px", // INCREASED padding
                    borderRadius: "6px", // INCREASED border radius
                    fontSize: isMobile ? 9 : 11, // INCREASED font size
                    fontWeight: "bold",
                    border: "2px solid #FFD700" // INCREASED border
                  }}>
                    {chip.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Money Display */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 8, // INCREASED gap
              color: "#FFD700",
              fontWeight: 700,
              fontSize: isMobile ? 14 : 18, // INCREASED font size
              textShadow: "0 0 12px #FFD700", // INCREASED shadow
              textAlign: "center"
            }}>
              <div>Balance: {userBalance.toString()}</div>
              <div>Bet Total: {totalBetAmount}</div>
            </div>

            {/* Control Buttons */}
            <div style={{
              display: "flex",
              gap: isMobile ? 20 : 25 // INCREASED gap
            }}>
              <button 
                onClick={handleSpin} 
                disabled={isSpinning || loading || pendingBets.length === 0}
                style={enhancedControlBtn(isSpinning || loading || pendingBets.length === 0, isMobile)}
              >
                <ImSpinner4 size={isMobile ? 24 : 32} className={isSpinning ? "spinning" : ""} />
                <div style={{ fontSize: isMobile ? 10 : 12, fontWeight: "bold" }}>SPIN</div>
              </button>
              <button onClick={resetBets} style={enhancedControlBtn(false, isMobile)}>
                <RiResetLeftFill size={isMobile ? 24 : 32} />
                <div style={{ fontSize: isMobile ? 10 : 12, fontWeight: "bold" }}>RESET</div>
              </button>
              <button style={enhancedControlBtn(false, isMobile)}>
                <AiOutlineSound size={isMobile ? 24 : 32} />
                <div style={{ fontSize: isMobile ? 10 : 12, fontWeight: "bold" }}>SOUNDS</div>
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {selectedNumbers.length === 0 && Object.keys(selectedSpecialBets).length === 0 && !isSpinning && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={enhancedAlertBox(isMobile)}>🎯 SELECT NUMBERS OR BETS TO PLACE</div>
            </div>
          )}
          {pendingBets.length > 0 && !isSpinning && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{...enhancedAlertBox(isMobile), background: "linear-gradient(135deg, #00FF88, #00CC6A)"}}>
                🎲 READY TO SPIN - {pendingBets.length} BETS PLACED
              </div>
            </div>
          )}
          {isSpinning && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{...enhancedAlertBox(isMobile), background: "linear-gradient(135deg, #FF6B35, #F7931E)"}}>
                🌀 SPINNING...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modals */}
      {showFundModal && (
        <EnhancedModal title="💰 Fund Contract (Owner Only)" onClose={() => setShowFundModal(false)} isMobile={isMobile}>
          <input
            type="number"
            value={fundAmount}
            onChange={e => setFundAmount(e.target.value)}
            placeholder="Amount to fund"
            className="modal-input"
          />
          <button className="modal-btn" onClick={() => depositHouseFunds(BigInt(fundAmount))} disabled={loading}>
            {loading ? 'Funding...' : 'Fund Contract'}
          </button>
        </EnhancedModal>
      )}
      
      {showWithdrawModal && (
        <EnhancedModal title="💸 Withdraw User Winnings" onClose={() => setShowWithdrawModal(false)} isMobile={isMobile}>
          <input
            type="number"
            value={withdrawAmount}
            onChange={e => setWithdrawAmount(e.target.value)}
            placeholder="Amount to withdraw"
            className="modal-input"
          />
          <button className="modal-btn" onClick={() => withdrawUserWinnings(BigInt(withdrawAmount))} disabled={loading}>
            {loading ? 'Withdrawing...' : 'Withdraw'}
          </button>
        </EnhancedModal>
      )}
      
      {showWithdrawHouseModal && (
        <EnhancedModal title="🏦 Withdraw House Funds (Owner)" onClose={() => setShowWithdrawHouseModal(false)} isMobile={isMobile}>
          <input
            type="number"
            value={withdrawHouseAmount}
            onChange={e => setWithdrawHouseAmount(e.target.value)}
            placeholder="Amount to withdraw"
            className="modal-input"
          />
          <button className="modal-btn" onClick={() => withdrawHouseFunds(BigInt(withdrawHouseAmount))} disabled={loading}>
            {loading ? 'Withdrawing...' : 'Withdraw House Funds'}
          </button>
        </EnhancedModal>
      )}

      <style jsx>{`
        .spinning { 
          animation: spin 0.5s linear infinite; 
        }
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .modal-input {
          width: 100%;
          padding: 16px 20px;
          margin-bottom: 20px;
          border-radius: 12px;
          border: 3px solid #FFD700;
          background: linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(10, 10, 10, 0.9));
          color: #FFD700;
          font-size: 16px;
          font-family: "Orbitron", monospace;
          outline: none;
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
          transition: all 0.3s ease;
        }
        .modal-input:focus {
          border: 3px solid #FFA500;
          box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.4);
          background: linear-gradient(135deg, rgba(10, 10, 10, 0.9), rgba(26, 26, 26, 0.9));
        }
        .modal-btn {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          border: none;
          border-radius: 12px;
          padding: 16px 32px;
          font-size: 16px;
          font-family: "Orbitron", monospace;
          font-weight: bold;
          margin-top: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
        }
        .modal-btn:hover {
          background: linear-gradient(135deg, #FFA500, #FFD700);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.6);
        }
      `}</style>
    </div>
  );
}

// Enhanced Helper Styles with INCREASED sizes
const enhancedSidebarBtn = (disabled = false, isMobile = false) => ({
  background: disabled 
    ? "linear-gradient(135deg, #666, #444)" 
    : "linear-gradient(135deg, #FFD700, #FFA500)",
  color: disabled ? "#999" : "#000",
  border: "none",
  borderRadius: 12, // INCREASED
  padding: isMobile ? "10px 16px" : "16px 20px", // INCREASED
  fontWeight: 700,
  fontSize: isMobile ? 12 : 15, // INCREASED
  marginBottom: 6, // INCREASED
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
  transition: "all 0.3s ease",
  boxShadow: disabled 
    ? "0 3px 12px rgba(0, 0, 0, 0.4)" 
    : "0 6px 20px rgba(255, 215, 0, 0.4)", // INCREASED
  fontFamily: "'Orbitron', sans-serif",
  textShadow: disabled ? "none" : "0 2px 4px rgba(0, 0, 0, 0.6)", // INCREASED
  whiteSpace: "nowrap" as const
});

const enhancedControlBtn = (disabled = false, isMobile = false) => ({
  background: disabled 
    ? "linear-gradient(135deg, #666, #444)" 
    : "linear-gradient(135deg, #FFD700, #FFA500)",
  color: disabled ? "#999" : "#000",
  border: "none",
  borderRadius: "50%",
  width: isMobile ? 65 : 85, // INCREASED
  height: isMobile ? 65 : 85, // INCREASED
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: isMobile ? 10 : 12, // INCREASED
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
  gap: 4, // INCREASED
  boxShadow: disabled 
    ? "0 6px 20px rgba(0, 0, 0, 0.4)" 
    : "0 8px 32px rgba(255, 215, 0, 0.5)", // INCREASED
  transition: "all 0.3s ease",
  fontFamily: "'Orbitron', sans-serif",
  textShadow: disabled ? "none" : "0 2px 4px rgba(0, 0, 0, 0.4)" // INCREASED
});

const enhancedAlertBox = (isMobile = false) => ({
  background: "linear-gradient(135deg, #FFD700, #FFA500)",
  color: "#000",
  fontWeight: 900,
  fontSize: isMobile ? 16 : 24, // INCREASED
  borderRadius: 16, // INCREASED
  padding: isMobile ? "16px 32px" : "20px 50px", // INCREASED
  boxShadow: "0 8px 32px rgba(255, 215, 0, 0.6)", // INCREASED
  border: "3px solid #FFD700", // INCREASED
  fontFamily: "'Orbitron', sans-serif",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)", // INCREASED
  textAlign: "center" as const
});

// Enhanced Modal Component with INCREASED sizes
function EnhancedModal({ title, children, onClose, isMobile }: { title: string; children: React.ReactNode; onClose: () => void; isMobile: boolean }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(20px)", // INCREASED
      padding: isMobile ? "24px" : "0" // INCREASED
    }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(10, 10, 10, 0.95))",
        border: "3px solid #FFD700", // INCREASED
        borderRadius: "20px", // INCREASED
        padding: isMobile ? "32px" : "40px", // INCREASED
        minWidth: isMobile ? "90%" : "450px", // INCREASED
        maxWidth: isMobile ? "90%" : "450px", // INCREASED
        color: "#FFD700",
        boxShadow: "0 15px 60px rgba(0, 0, 0, 0.6)", // INCREASED
        backdropFilter: "blur(25px)" // INCREASED
      }}>
        <h3 style={{ 
          marginBottom: "24px", // INCREASED
          textAlign: "center", 
          fontSize: isMobile ? "20px" : "24px", // INCREASED
          color: "#FFD700",
          textShadow: "0 0 15px #FFD700", // INCREASED
          fontFamily: "'Orbitron', sans-serif"
        }}>
          {title}
        </h3>
        <div style={{ marginBottom: "24px" }}>{children}</div>
        <div style={{ textAlign: "center" }}>
          <button onClick={onClose} style={{
            background: "transparent",
            color: "#FFD700",
            border: "3px solid #FFD700", // INCREASED
            borderRadius: "12px", // INCREASED
            padding: "12px 24px", // INCREASED
            cursor: "pointer",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: "bold",
            fontSize: "14px", // INCREASED
            transition: "all 0.3s ease"
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
