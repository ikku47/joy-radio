import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { type RadioStation } from './radio';

interface PlayerContextType {
  currentStation: RadioStation | null;
  playing: boolean;
  loading: boolean;
  play: (station: RadioStation) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  toggle: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const activeIdRef = useRef<string | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const play = async (station: RadioStation) => {
    // Mark this request as the active one
    activeIdRef.current = station.id;

    // Unload existing immediately if a new request comes in
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    setCurrentStation(station);
    setLoading(true);
    setPlaying(false);

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: station.url },
        { shouldPlay: true }
      );

      // CRITICAL: If the active ID has changed while loading, kill this sound immediately
      if (activeIdRef.current !== station.id) {
        await newSound.unloadAsync();
        return;
      }

      soundRef.current = newSound;
      setPlaying(true);
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPlaying(status.isPlaying);
        }
      });
    } catch (error) {
      console.error('Failed to play station', error);
      if (activeIdRef.current === station.id) {
        setPlaying(false);
      }
    } finally {
      if (activeIdRef.current === station.id) {
        setLoading(false);
      }
    }
  };

  const pause = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setPlaying(false);
    }
  };

  const resume = async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setPlaying(true);
    }
  };

  const toggle = async () => {
    if (playing) {
      await pause();
    } else {
      await resume();
    }
  };

  return (
    <PlayerContext.Provider value={{ currentStation, playing, loading, play, pause, resume, toggle }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
