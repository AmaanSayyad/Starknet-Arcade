"use client";
import { useCallback, useEffect, useRef } from "react";

type SoundMap = {
  [key: string]: HTMLAudioElement;
};

export const useAudio = () => {
  const soundsRef = useRef<SoundMap>({});

  const createAudio = useCallback((src: string) => {
    if (typeof window !== "undefined") {
      const audio = new Audio(src);
      audio.preload = "auto";
      return audio;
    }
    return null;
  }, []);

  const loadSounds = useCallback(() => {
    soundsRef.current = {
      wing: createAudio("/assets/floppy/sounds/sfx_wing.ogg")!,
      hit: createAudio("/assets/floppy/sounds/sfx_hit.ogg")!,
      point: createAudio("/assets/floppy/sounds/sfx_point.ogg")!,
      swooshing: createAudio("/assets/floppy/sounds/sfx_swooshing.ogg")!,
      die: createAudio("/assets/floppy/sounds/sfx_die.ogg")!,
    };

    Object.values(soundsRef.current).forEach((sound) => {
      try {
        sound.load();
      } catch (e) {
        console.error("Error loading sound", e);
      }
    });
  }, [createAudio]);

  useEffect(() => {
    loadSounds();
  }, [loadSounds]);

  const playSound = useCallback((soundName: string) => {
    const sound = soundsRef.current[soundName];
    if (sound) {
      try {
        sound.currentTime = 0;
        const playPromise = sound.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Play was interrupted", error);
          });
        }
      } catch (e) {
        console.error("Error playing sound", e);
      }
    }
  }, []);

  const loadSound = useCallback((soundName: string, src: string) => {
    const audio = createAudio(src);
    if (audio) {
      audio.load();
      soundsRef.current[soundName] = audio;
    }
  }, [createAudio]);

  return {
    playSound,
    loadSounds,
    loadSound,
  };
};
