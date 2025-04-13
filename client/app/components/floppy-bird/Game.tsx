/* eslint-disable @typescript-eslint/no-explicit-any */
"use clent";
import React, { useEffect, useState } from "react";

import { useConnect, useDisconnect, useAccount } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";

import ControllerButton from "./game/ControllerButton";
import { useAudio } from "@/app/hooks/useAudio";
import { useGameContract } from "@/app/hooks/useGameContract";
import { useGameState } from "@/app/hooks/useGameState";

// Game states
const GAME_STATES = {
  SplashScreen: 0,
  GameScreen: 1,
  ScoreScreen: 2,
};

// Game configuration
const GAME_CONFIG = {
  GRAVITY: 0.25,
  JUMP_AMOUNT: -4.6,
  PIPE_WIDTH: 52,
  PIPE_SPACING: 1500,
  PIPE_SPEED: 3,
  PIPE_GAP: 90,
  BIRD_WIDTH: 34,
  BIRD_HEIGHT: 24,
  GROUND_HEIGHT: 112,
  GAME_WIDTH: 400,
};

const Game = () => {
  // Wallet state
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, account } = useAccount();
  const [username, setUsername] = useState<string | undefined>();
  const [connected, setConnected] = useState(false);

  // Initialize hooks
  const { playSound, loadSounds } = useAudio();
  const { startNewGame, incrementScore, endGame } = useGameContract(
    connected,
    account
  );
  const {
    currentState,

    showSplash,
    cleanup,
  } = useGameState(
    GAME_CONFIG,
    { play: playSound },
    incrementScore,
    endGame,
    startNewGame
  );

  // Controller connection
  useEffect(() => {
    if (!address) return;
    const controller = connectors.find((c) => c instanceof ControllerConnector);
    if (controller) {
      controller.username()?.then((n) => setUsername(n));
      setConnected(true);
    }
  }, [address, connectors]);

  // Initialize game
  useEffect(() => {
    loadSounds();
    showSplash();

    return () => {
      cleanup();
    };
  }, []);

  // Controller connection
  const handleControllerClick = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    try {
      if (address) {
        await disconnect();
        setConnected(false);
        setUsername(undefined);
      } else {
        const controller = connectors.find(
          (c) => c instanceof ControllerConnector
        );
        if (!controller) {
          throw new Error("Controller connector not found");
        }
        await connect({ connector: controller });
        setConnected(true);
      }
    } catch (error) {
      console.error("Controller connection error:", error);
    }
  };

  // Render
  return (
    <div
      id="gamecontainer"
      className={currentState === GAME_STATES.ScoreScreen ? "dead" : ""}
    >
      <div id="gamescreen">
        <ControllerButton
          connected={connected}
          username={username}
          handleControllerClick={handleControllerClick}
        />
      </div>
    </div>
  );
};

export default Game;
