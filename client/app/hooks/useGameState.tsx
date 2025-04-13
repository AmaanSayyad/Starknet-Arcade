"use client"
import { useState, useRef, useCallback, useEffect } from 'react';

export const GAME_STATES = {
  SplashScreen: 0,
  GameScreen: 1,
  ScoreScreen: 2
};

export const useGameState = (GAME_CONFIG: unknown, AUDIO: unknown, incrementScore: unknown, endGame: unknown, startNewGame: unknown) => {
  // Game state refs
  const positionRef = useRef(180);
  const velocityRef = useRef(0);
  const deathAnimationStartedRef = useRef(false);
  const lastScoredPipeIdRef = useRef(null);
  const playerRef = useRef(null);
  const gameLoopRef = useRef(null);
  const pipeLoopRef = useRef(null);
  const replayClickableRef = useRef(false);
  const flyareaRef = useRef(null);
  const currentStateRef = useRef(GAME_STATES.SplashScreen);
  const gameOverInProgressRef = useRef(false);
  const lastStateRef = useRef(GAME_STATES.SplashScreen);
  const gameEndedRef = useRef(false);

  // Game state
  const [currentState, setCurrentState] = useState(GAME_STATES.SplashScreen);
  const [score, setScore] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [splashOpacity, setSplashOpacity] = useState(1);

  // Game state sync
  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  // Pipe management
  const updatePipes = useCallback(() => {
    if (currentStateRef.current !== GAME_STATES.GameScreen) return;

    const flyareaHeight = flyareaRef.current?.offsetHeight || 0;
    const availableHeight = flyareaHeight - GAME_CONFIG.GROUND_HEIGHT;
    
    const padding = 80;
    const constraint = availableHeight - (padding * 2);
    const topHeight = Math.floor((Math.random() * constraint) + padding);

    setPipes(prevPipes => [
      ...prevPipes,
      {
        id: Date.now(),
        topHeight,
        left: GAME_CONFIG.GAME_WIDTH
      }
    ]);
  }, []);

  const gameOver = useCallback(() => {
    if (currentStateRef.current !== GAME_STATES.GameScreen || gameOverInProgressRef.current || gameEndedRef.current) return;

    gameOverInProgressRef.current = true;
    gameEndedRef.current = true;
    setCurrentState(GAME_STATES.ScoreScreen);
    AUDIO.play('hit');

    // End game on blockchain
    endGame().then(success => {
      if (!success) {
        // Error handling
      }
    });

    if (pipeLoopRef.current) clearInterval(pipeLoopRef.current);
    deathAnimationStartedRef.current = false;

    gameOverInProgressRef.current = false;
  }, [endGame]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (currentStateRef.current === GAME_STATES.SplashScreen) {
      return;
    }

    // Only log state changes
    if (currentStateRef.current !== lastStateRef.current) {
      lastStateRef.current = currentStateRef.current;
    }

    velocityRef.current += GAME_CONFIG.GRAVITY;
    positionRef.current += velocityRef.current;

    const newRotation = velocityRef.current < 0 ? -25 : Math.min((velocityRef.current * 10), 90);
    const flyareaHeight = flyareaRef.current?.offsetHeight || 0;
    const groundPosition = flyareaHeight - GAME_CONFIG.GROUND_HEIGHT - GAME_CONFIG.BIRD_HEIGHT;
    
    if (positionRef.current >= groundPosition) {
      positionRef.current = groundPosition;
      
      if (currentStateRef.current === GAME_STATES.ScoreScreen) {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
          gameLoopRef.current = null;
        }
        
        AUDIO.play('hit');
        
        setTimeout(() => {
          AUDIO.play('swooshing');
          setShowScoreboard(true);
          
          setTimeout(() => {
            setShowReplay(true);
            replayClickableRef.current = true;
          }, 600);
        }, 500);
      } else {
        gameOver();
      }
    }

    if (playerRef.current) {
      playerRef.current.style.top = `${positionRef.current}px`;
      playerRef.current.style.transform = `rotate(${newRotation}deg)`;
    }

    if (currentStateRef.current === GAME_STATES.ScoreScreen && !deathAnimationStartedRef.current) {
      deathAnimationStartedRef.current = true;
      velocityRef.current = -2;
    }

    if (currentStateRef.current === GAME_STATES.GameScreen) {
      if (positionRef.current <= 0) {
        gameOver();
        return;
      }

      setPipes(prevPipes => {
        const movedPipes = prevPipes.map(pipe => ({
          ...pipe,
          left: pipe.left - GAME_CONFIG.PIPE_SPEED
        })).filter(pipe => pipe.left > -GAME_CONFIG.PIPE_WIDTH);

        const playerBox = {
          left: 60,
          right: 60 + GAME_CONFIG.BIRD_WIDTH - 10,
          top: positionRef.current + 5,
          bottom: positionRef.current + GAME_CONFIG.BIRD_HEIGHT - 5
        };

        for (const pipe of movedPipes) {
          const pipeBox = {
            left: pipe.left + 2,
            right: pipe.left + GAME_CONFIG.PIPE_WIDTH - 2,
            upperBottom: pipe.topHeight,
            lowerTop: pipe.topHeight + GAME_CONFIG.PIPE_GAP
          };

          if (playerBox.right > pipeBox.left && playerBox.left < pipeBox.right) {
            if (playerBox.top < pipeBox.upperBottom || playerBox.bottom > pipeBox.lowerTop) {
              gameOver();
              return prevPipes;
            }
          }

          if (pipe.left + GAME_CONFIG.PIPE_WIDTH < playerBox.left && lastScoredPipeIdRef.current !== pipe.id) {
            lastScoredPipeIdRef.current = pipe.id;
            AUDIO.play('point');
            setScore(s => s + 1);
            incrementScore().then(success => {
              if (!success) {
                console.log('Failed to increment score on blockchain');
              }
            });
          }
        }
        return movedPipes;
      });
    }
  }, [gameOver, incrementScore, AUDIO, GAME_CONFIG]);

  const startGame = useCallback(async () => {
    // Only start if we're explicitly in SplashScreen state and not already starting
    if (currentStateRef.current !== GAME_STATES.SplashScreen || gameOverInProgressRef.current) {
      return;
    }

    gameOverInProgressRef.current = true;
    gameEndedRef.current = false;
    
    // Try to start game on blockchain if connected
    const success = await startNewGame();
    
    // Only proceed if we're either not connected or the blockchain transaction succeeded
    if (!success) {
      gameOverInProgressRef.current = false;
      return;
    }

    setCurrentState(GAME_STATES.GameScreen);
    setSplashOpacity(0);
    AUDIO.play('swooshing');

    setPipes([]);
    setScore(0);
    lastScoredPipeIdRef.current = null;
    
    positionRef.current = 180;
    velocityRef.current = 0;
    
    if (playerRef.current) {
      playerRef.current.style.top = `${positionRef.current}px`;
      playerRef.current.style.transform = 'rotate(0deg)';
    }
    
    // Clear any existing intervals
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (pipeLoopRef.current) {
      clearInterval(pipeLoopRef.current);
      pipeLoopRef.current = null;
    }

    // Start game loop immediately
    gameLoop();
    gameLoopRef.current = setInterval(gameLoop, 1000 / 60);

    // Start pipe loop
    pipeLoopRef.current = setInterval(updatePipes, GAME_CONFIG.PIPE_SPACING);
    
    gameOverInProgressRef.current = false;
  }, [gameLoop, updatePipes, AUDIO, startNewGame]);

  const playerJump = useCallback(() => {
    if (currentStateRef.current === GAME_STATES.GameScreen) {
      velocityRef.current = GAME_CONFIG.JUMP_AMOUNT;
      AUDIO.play('wing');
    } else if (currentStateRef.current === GAME_STATES.SplashScreen) {
      startGame();
    }
  }, [startGame]);

  const handleReplayClick = useCallback(() => {
    if (!replayClickableRef.current) return;
    
    // Set game over in progress to prevent immediate start
    gameOverInProgressRef.current = true;
    
    // Reset all game state
    setCurrentState(GAME_STATES.SplashScreen);
    setScore(0);
    setPipes([]);
    setShowScoreboard(false);
    setShowReplay(false);
    setSplashOpacity(1);
    
    // Reset refs
    velocityRef.current = 0;
    positionRef.current = 180;
    replayClickableRef.current = false;
    gameEndedRef.current = false;
    deathAnimationStartedRef.current = false;
    lastScoredPipeIdRef.current = null;
    
    // Clear any existing intervals
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (pipeLoopRef.current) {
      clearInterval(pipeLoopRef.current);
      pipeLoopRef.current = null;
    }
    
    // Reset player position
    if (playerRef.current) {
      playerRef.current.style.top = `${positionRef.current}px`;
      playerRef.current.style.transform = 'rotate(0deg)';
    }
    
    AUDIO.play('swooshing');
    
    // Add a small delay before allowing the game to start
    setTimeout(() => {
      gameOverInProgressRef.current = false;
    }, 500);
  }, [AUDIO]);

  const showSplash = () => {
    setCurrentState(GAME_STATES.SplashScreen);
    velocityRef.current = 0;
    positionRef.current = 180;
    setScore(0);
    setPipes([]);
    setShowScoreboard(false);
    setShowReplay(false);
    setSplashOpacity(1);
    replayClickableRef.current = false;

    if (playerRef.current) {
      playerRef.current.style.top = `${positionRef.current}px`;
      playerRef.current.style.transform = 'rotate(0deg)';
    }
  };

  // Cleanup function
  const cleanup = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (pipeLoopRef.current) {
      clearInterval(pipeLoopRef.current);
      pipeLoopRef.current = null;
    }
  }, []);

  // Add cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    // Refs
    playerRef,
    flyareaRef,
    // State
    currentState,
    score,
    pipes,
    showScoreboard,
    showReplay,
    splashOpacity,
    // Methods
    startGame,
    playerJump,
    handleReplayClick,
    showSplash,
    // Cleanup
    cleanup,
    // Additional refs
    gameOverInProgressRef
  };
}; 