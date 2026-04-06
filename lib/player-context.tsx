import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import Animated, { 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  type SharedValue
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
  staticWaveform: SharedValue<number>;
  meter: SharedValue<number>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [stationList, setStationList] = useState<RadioStation[]>([]);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const playerRef = useRef<AudioPlayer | null>(null);
  const activeIdRef = useRef<string | null>(null);
  
  const staticWaveform = useSharedValue(0);
  const meter = useSharedValue(0);

  useEffect(() => {
    void setAudioModeAsync({
      shouldPlayInBackground: true,
      playsInSilentMode: true,
      interruptionMode: 'doNotMix',
    });

    const player = createAudioPlayer(null, {
      updateInterval: 250,
      keepAudioSessionActive: true,
    });
    playerRef.current = player;

    const subscription = player.addListener('playbackStatusUpdate', (status) => {
      setPlaying(status.playing);
      setLoading(!status.isLoaded || status.isBuffering);
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
      subscription.remove();
      player.clearLockScreenControls();
      player.remove();
      playerRef.current = null;
    };
  }, []);

  // Audio energy/meter simulation loop
  useEffect(() => {
    if (playing) {
      meter.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 150, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.4, { duration: 100, easing: Easing.inOut(Easing.sin) }),
          withTiming(1.0, { duration: 200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.6, { duration: 120, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    } else {
      meter.value = withTiming(0, { duration: 500 });
    }
  }, [playing]);


  const play = async (station: RadioStation, list?: RadioStation[]) => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    if (list) {
      setStationList(list);
    }
    activeIdRef.current = station.id;

    setCurrentStation(station);
    setLoading(true);
    setPlaying(false);

    player.replace({ uri: station.url });
    player.setActiveForLockScreen(
      true,
      {
        title: station.name || 'Joy Radio',
        artist: station.country || station.language || 'Live radio',
        albumTitle: 'Joy Radio',
        artworkUrl: station.favicon || undefined,
      },
      {
        showSeekBackward: true,
        showSeekForward: true,
      }
    );
    player.play();
  };

  const pause = async () => {
    if (playerRef.current) {
      playerRef.current.pause();
      setPlaying(false);
    }
  };

  const resume = async () => {
    if (playerRef.current) {
      if (currentStation) {
        playerRef.current.setActiveForLockScreen(
          true,
          {
            title: currentStation.name || 'Joy Radio',
            artist: currentStation.country || currentStation.language || 'Live radio',
            albumTitle: 'Joy Radio',
            artworkUrl: currentStation.favicon || undefined,
          },
          {
            showSeekBackward: true,
            showSeekForward: true,
          }
        );
      }
      playerRef.current.play();
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
      staticWaveform,
      meter
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
