import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { usePathname } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing 
} from 'react-native-reanimated';
import { type RadioStation } from './radio';

interface PlayerContextType {
  currentStation: RadioStation | null;
  playing: boolean;
  loading: boolean;
  play: (station: RadioStation, list?: RadioStation[]) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  toggle: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  staticWaveform: { value: number };
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [stationList, setStationList] = useState<RadioStation[]>([]);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const pathname = usePathname();
  
  const staticWaveform = useSharedValue(0);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });

    // Highly chaotic noise waveform simulation
    staticWaveform.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 20 }),
        withTiming(-1.3, { duration: 15 }),
        withTiming(0.7, { duration: 25 }),
        withTiming(-1.8, { duration: 10 }),
        withTiming(0.5, { duration: 30 }),
        withTiming(-1.1, { duration: 20 })
      ),
      -1,
      true
    );

    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);


  const play = async (station: RadioStation, list?: RadioStation[]) => {
    if (list) {
      setStationList(list);
    }
    activeIdRef.current = station.id;

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
      console.error('Radio play error', error);
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

  const next = async () => {
    if (!currentStation || stationList.length === 0) return;
    const currentIndex = stationList.findIndex(s => s.id === currentStation.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % stationList.length;
    await play(stationList[nextIndex]);
  };

  const previous = async () => {
    if (!currentStation || stationList.length === 0) return;
    const currentIndex = stationList.findIndex(s => s.id === currentStation.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + stationList.length) % stationList.length;
    await play(stationList[prevIndex]);
  };

  return (
    <PlayerContext.Provider value={{ 
      currentStation, 
      playing, 
      loading, 
      play, 
      pause, 
      resume, 
      toggle, 
      next, 
      previous, 
      staticWaveform 
    }}>
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
