import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  type SharedValue
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Capsule, palette, typography, VinylRecord } from '@/components/radio-ui';
import { usePlayer } from '@/lib/player-context';

const { width } = Dimensions.get('window');

function SignalBar({ index, active, meter }: { index: number, active: boolean, meter: SharedValue<number> }) {
  const animatedStyle = useAnimatedStyle(() => {
    // Each bar activates if the meter exceeds a certain threshold
    // Bar 1: 0.1, Bar 2: 0.3, Bar 3: 0.5, Bar 4: 0.7, Bar 5: 0.9
    const threshold = (index + 1) * 0.18;
    const isLit = active && meter.value >= threshold;

    return {
      backgroundColor: isLit ? palette.accent : palette.line,
      opacity: isLit ? 1 : 0.3,
    };
  });

  return (
    <Animated.View
      style={[
        styles.meterBar,
        { height: 4 * (index + 1) },
        animatedStyle
      ]}
    />
  );
}

export default function PlayerScreen() {
  const router = useRouter();
  const { currentStation, playing, loading, toggle, next, previous, meter } = usePlayer();
  const params = useLocalSearchParams<{
    id: string,
    name: string,
    url: string,
    country: string,
    lang: string,
    tags: string,
    homepage: string,
    favicon: string
  }>();

  const station = currentStation || params;
  const tags = (station.tags || '').split(',').map(t => t.trim()).filter(Boolean).slice(0, 3);

  const subLabel = station.homepage
    ? station.homepage.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : station.name || 'Station Info';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        {/* Background Decoration */}
        <View style={styles.backgroundDecoration}>
          <View style={styles.decorLine} />
          <View style={[styles.decorLine, { left: width * 0.33 }]} />
          <View style={[styles.decorLine, { left: width * 0.66 }]} />
        </View>

        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={32} color={palette.ink} />
          </Pressable>
          <Capsule label={station.country || 'Global'} />
          <View style={styles.liveIndicator}>
            <View style={[styles.liveDot, playing && styles.liveDotActive]} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.main}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.vinylContainer}>
            <VinylRecord uri={station.favicon} active={playing} size={width * 0.7} />
          </Animated.View>

          <View style={styles.metaContainer}>
            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <Text style={styles.stationLabel}>{subLabel.toUpperCase()}</Text>
              <Text numberOfLines={2} style={styles.stationName}>
                {loading ? 'Connecting...' : (station.name || 'Station')}
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.tagContainer}>
              {tags.map((tag, i) => (
                <View key={tag} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag.toUpperCase()}</Text>
                </View>
              ))}
              {tags.length === 0 && <Text style={styles.tagText}>BROADCASTING LIVE</Text>}
            </Animated.View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.controls}>
            <Pressable style={styles.controlBtn} onPress={previous}>
              <Feather name="skip-back" size={28} color={palette.ink} />
            </Pressable>

            <Pressable
              style={[styles.playBtn, playing && styles.playBtnActive]}
              onPress={toggle}
            >
              <Feather
                name={playing ? "pause" : "play"}
                size={34}
                color={playing ? "#fff" : palette.ink}
                style={!playing && { marginLeft: 4 }}
              />
            </Pressable>

            <Pressable style={styles.controlBtn} onPress={next}>
              <Feather name="skip-forward" size={28} color={palette.ink} />
            </Pressable>
          </View>

          <View style={styles.signalMeter}>
            <View style={styles.meterInfo}>
              <Text style={styles.meterLabel}>SIGNAL</Text>
              <Text style={styles.meterValue}>
                {loading ? 'TUNING...' : ((station as any).bitrate ? `${(station as any).bitrate} KBPS` : (playing ? 'STRONG' : 'IDLE'))}
              </Text>
            </View>
            <View style={styles.meterBars}>
              {[0, 1, 2, 3, 4].map(b => (
                <SignalBar key={b} index={b} active={playing && !loading} meter={meter} />
              ))}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.shell,
  },
  screen: {
    flex: 1,
    backgroundColor: palette.shell,
    paddingTop: 10,
  },
  backgroundDecoration: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  decorLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: palette.ink,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.softInk,
  },
  liveDotActive: {
    backgroundColor: palette.accent,
  },
  liveText: {
    fontSize: 10,
    fontFamily: typography.bold,
    color: palette.ink,
    letterSpacing: 1,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinylContainer: {
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
  },
  visualizerContainer: {
    height: 60,
    width: '100%',
    marginBottom: 40,
  },
  metaContainer: {
    width: '100%',
    paddingHorizontal: 30,
  },
  stationLabel: {
    fontSize: 12,
    fontFamily: typography.bold,
    color: palette.softInk,
    letterSpacing: 2,
    marginBottom: 8,
  },
  stationName: {
    fontSize: 38,
    fontFamily: typography.bold,
    color: palette.ink,
    lineHeight: 42,
    letterSpacing: -2,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  tagBadge: {
    borderWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontFamily: typography.bold,
    color: palette.softInk,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 20,
    gap: 30,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  playBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.app,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  playBtnActive: {
    backgroundColor: palette.ink,
  },
  pauseText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: typography.bold,
  },
  signalMeter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  meterInfo: {
    gap: 2,
  },
  meterLabel: {
    fontSize: 9,
    fontFamily: typography.bold,
    color: palette.softInk,
    letterSpacing: 1,
  },
  meterValue: {
    fontSize: 12,
    fontFamily: typography.bold,
    color: palette.ink,
  },
  meterBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  meterBar: {
    width: 3,
    backgroundColor: palette.line,
    borderRadius: 1,
  },
});
