import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { palette, Scale, Capsule, IconCircle } from '@/components/radio-ui';

export default function PlayerScreen() {
  const router = useRouter();
  const station = useLocalSearchParams<{ 
    id: string, 
    name: string, 
    url: string, 
    country: string, 
    lang: string, 
    tags: string, 
    homepage: string 
  }>();

  const [favorite, setFavorite] = useState(false);
  const [playing, setPlaying] = useState(true);

  // Derive a pseudo-frequency for design flavor
  const frequency = (92 + (parseInt(station.id?.slice(0, 4), 16) % 5.8 || 0)).toFixed(1);
  
  const subLabel = station.homepage
    ? station.homepage.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : station.name || 'Station Info';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        <View style={styles.panel}>
          <View style={styles.playerTopBar}>
            <View style={styles.playerBackRow}>
              <Pressable onPress={() => router.back()}>
                <Feather name="chevron-left" size={34} color={palette.ink} />
              </Pressable>
              <Capsule label={station.country || 'Malaga'} />
            </View>

            <View style={styles.playerModeRow}>
              <Capsule label="FM" selected compact />
              <Capsule label="AM" compact />
            </View>
          </View>

          <View style={styles.frequencyWrap}>
            <Text style={styles.frequencyText}>
              <Text style={styles.frequencyLead}>0</Text>
              {frequency.slice(1)}
            </Text>
            <Text numberOfLines={1} style={styles.stationCaption}>{subLabel}</Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable onPress={() => setFavorite(f => !f)}>
               <IconCircle icon="star" accent={favorite} />
            </Pressable>
            <IconCircle icon="share" />
          </View>

          <View style={styles.tunerWrap}>
            <Scale height={76} withLabels />
            <View style={styles.tunerNeedle} />
          </View>

          <View style={styles.trackMeta}>
            <Text style={styles.trackEyebrow}>{station.lang || station.tags?.split(',')[0] || 'Radio Browser'}</Text>
            <Text numberOfLines={2} style={styles.trackHeadline}>
              {station.name || 'Buffering...'}
            </Text>
          </View>

          <View style={styles.transportRow}>
            <Pressable style={styles.sideButton}>
              <Feather name="skip-back" size={28} color={palette.ink} />
            </Pressable>
            <Pressable 
              style={[styles.pauseButton, !playing && { backgroundColor: palette.accent }]} 
              onPress={() => setPlaying(!playing)}
            >
              <Text style={styles.pauseText}>{playing ? 'Pause' : 'Play'}</Text>
            </Pressable>
            <Pressable style={styles.sideButton}>
              <Feather name="skip-forward" size={28} color={palette.ink} />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.app,
  },
  screen: {
    flex: 1,
    backgroundColor: palette.app,
  },
  panel: {
    flex: 1,
    backgroundColor: palette.shell,
    borderRadius: 0,
  },
  playerTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 30,
  },
  playerBackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  playerModeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  frequencyWrap: {
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  frequencyText: {
    color: palette.ink,
    fontSize: 82,
    lineHeight: 82,
    fontWeight: '700',
    letterSpacing: -6,
  },
  frequencyLead: {
    color: '#b2b2b2',
    fontWeight: '400',
  },
  stationCaption: {
    marginTop: 8,
    color: palette.softInk,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionRow: {
    marginTop: 42,
    marginBottom: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 46,
  },
  tunerWrap: {
    paddingHorizontal: 0,
    position: 'relative',
  },
  tunerNeedle: {
    position: 'absolute',
    top: -20,
    bottom: -44,
    left: '50%',
    width: 3,
    marginLeft: -1.5,
    backgroundColor: palette.accent,
  },
  trackMeta: {
    marginTop: 'auto',
    paddingHorizontal: 24,
    paddingBottom: 22,
  },
  trackEyebrow: {
    color: palette.softInk,
    fontSize: 14,
    fontWeight: '500',
  },
  trackHeadline: {
    marginTop: 4,
    color: palette.ink,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -1.5,
  },
  transportRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  sideButton: {
    flex: 1,
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: palette.mutedPanel,
  },
  pauseButton: {
    flex: 2.6,
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: palette.ink,
  },
  pauseText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});
