import { usePlayer } from '@/lib/player-context';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

export const palette = {
  app: '#c9c6c3',
  shell: '#f8f7f4',
  ink: '#0d0d0d',
  softInk: '#a8a8a8',
  line: '#d2d2d2',
  dark: '#0c0c0c',
  warm: '#a89d91',
  warmSoft: '#cdc4b9',
  accent: '#ff3937',
  chip: '#ecebea',
  mutedPanel: '#d7d7d7',
};

export const typography = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semiBold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extraBold: 'Manrope_800ExtraBold',
};

export function Scale({
  height = 54,
  withLabels = false,
  animated = false,
  value,
  animateNeedleOnly = false,
}: {
  height?: number;
  withLabels?: boolean;
  animated?: boolean;
  value?: number;
  animateNeedleOnly?: boolean;
}) {
  const marks = Array.from({ length: 121 }, (_, index) => index);
  const { staticWaveform } = usePlayer();
  const offset = useSharedValue(0);
  const needlePos = useSharedValue(0);

  const MARK_STEP = 13;
  const BASE_FREQ = 92;

  useEffect(() => {
    if (value !== undefined) {
      const freqOffset = (value - BASE_FREQ) * 5 * MARK_STEP;
      offset.value = withTiming(-freqOffset, { duration: 1200, easing: Easing.out(Easing.exp) });
    } else if (animated) {
      needlePos.value = withRepeat(
        withSequence(
          withTiming(30, { duration: 1200, easing: Easing.out(Easing.quad) }),
          withDelay(800, withTiming(30, { duration: 0 })),
          withTiming(80, { duration: 1500, easing: Easing.out(Easing.quad) }),
          withDelay(1200, withTiming(80, { duration: 0 })),
          withTiming(140, { duration: 1000, easing: Easing.out(Easing.quad) }),
          withDelay(600, withTiming(140, { duration: 0 })),
          withTiming(180, { duration: 1800, easing: Easing.out(Easing.quad) }),
          withDelay(1000, withTiming(180, { duration: 0 })),
        ),
        -1,
        true
      );
    }
  }, [animated, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: animateNeedleOnly ? 0 : offset.value },
      { translateX: animateNeedleOnly ? 0 : (animated ? staticWaveform.value : 0) * 1.5 }
    ],
  }));

  const needleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animateNeedleOnly ? needlePos.value : needlePos.value - 80 }],
  }));

  return (
    <View style={[styles.scaleWrap, { height }]}>
      <Animated.View
        style={[
          animateNeedleOnly ? styles.scaleMarksFullWidth : styles.scaleMarks,
          animated ? animatedStyle : null,
          !animateNeedleOnly ? styles.scaleMarksCentered : null,
        ]}>
        {marks.map((mark) => {
          const major = mark % 5 === 0;
          return <View key={mark} style={[styles.scaleMark, major ? styles.scaleMarkMajor : styles.scaleMarkMinor]} />;
        })}
      </Animated.View>
      {animated ? (
        <Animated.View style={[styles.scaleNeedle, needleStyle]} />
      ) : null}
      {withLabels ? (
        <View style={[styles.scaleLabels, { marginLeft: '50%', paddingLeft: 0 }]}>
          {[92, 93, 94, 95, 96, 97].map((val, i) => (
            <Animated.View key={val} style={useAnimatedStyle(() => ({
              position: 'absolute',
              left: i * 5 * MARK_STEP,
              transform: [{ translateX: offset.value - 7 }]
            }))}>
              <Text style={styles.scaleLabel}>{val}</Text>
            </Animated.View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function Capsule({
  label,
  selected = false,
  compact = false,
}: {
  label: string;
  selected?: boolean;
  compact?: boolean;
}) {
  return (
    <View style={[styles.capsule, compact ? styles.capsuleCompact : null, selected ? styles.capsuleSelected : null]}>
      <Text style={[styles.capsuleText, selected ? styles.capsuleTextSelected : null]}>{label}</Text>
    </View>
  );
}

export function IconCircle({
  icon,
  color = palette.softInk,
  accent = false,
}: {
  icon: keyof typeof Feather.glyphMap;
  color?: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.iconCircle}>
      <Feather name={icon} size={24} color={accent ? palette.accent : color} />
    </View>
  );
}

export function WaveformVisualizer({ active = false }: { active?: boolean }) {
  const bars = Array.from({ length: 48 }, (_, i) => i);

  return (
    <View style={visualizerStyles.container}>
      {bars.map((i) => (
        <WaveformBar key={i} active={active} />
      ))}
    </View>
  );
}

function WaveformBar({ active }: { active: boolean }) {
  const { meter } = usePlayer();
  const heightValue = useSharedValue(active ? 5 + Math.random() * 20 : 2);

  useEffect(() => {
    if (active) {
      heightValue.value = withRepeat(
        withSequence(
          withTiming(10 + Math.random() * 60, { duration: 150 + Math.random() * 300 }),
          withTiming(5 + Math.random() * 10, { duration: 150 + Math.random() * 300 })
        ),
        -1,
        true
      );
    } else {
      heightValue.value = withTiming(2, { duration: 400 });
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: 4 + heightValue.value * (0.8 + meter.value * 1.2),
    backgroundColor: active ? palette.ink : palette.softInk,
    opacity: active ? (0.6 + meter.value * 0.4) : 0.2,
  }));

  return <Animated.View style={[visualizerStyles.bar, animatedStyle]} />;
}

export function MiniPlayer() {
  const router = useRouter();
  const { currentStation, playing } = usePlayer();

  if (!currentStation) return <View style={{ width: 1 }} />;

  return (
    <Pressable
      onPress={() => router.push('/player')}
      style={miniStyles.container}
    >
      <VinylRecord
        uri={currentStation.favicon}
        active={playing}
        size={40}
        isMini={true}
      />
      <View style={miniStyles.info}>
        <Text numberOfLines={1} style={miniStyles.name}>{currentStation.name}</Text>
      </View>
    </Pressable>
  );
}

export function VinylRecord({
  uri,
  active = false,
  size = 260,
  isMini = false
}: {
  uri?: string,
  active?: boolean,
  size?: number,
  isMini?: boolean
}) {
  const rotation = useSharedValue(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [uri]);

  useEffect(() => {
    if (active) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 4000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      rotation.value = rotation.value % 360;
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[vinylStyles.container, { width: size, height: size }]}>
      <Animated.View style={[vinylStyles.record, animatedStyle]}>
        <View style={vinylStyles.grooves} />
        <View style={[vinylStyles.label, isMini ? vinylStyles.labelMini : null]}>
          {(uri && !error) ? (
            <Image
              source={{ uri }}
              style={vinylStyles.labelImage}
              contentFit="cover"
              onError={() => setError(true)}
            />
          ) : (
            <View style={vinylStyles.labelPlaceholder}>
              <Feather name="mic" size={isMini ? 18 : 40} color={palette.ink} />
            </View>
          )}
        </View>
        {/* <View style={vinylStyles.spindle} /> */}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scaleWrap: { justifyContent: 'center', backgroundColor: palette.shell },
  scaleMarks: { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  scaleMarksCentered: { marginLeft: '50%' },
  scaleMarksFullWidth: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  scaleMark: { width: 1, backgroundColor: '#bebebe' },
  scaleMarkMajor: { height: 26 },
  scaleMarkMinor: { height: 15 },
  scaleLabels: { marginTop: 6, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  scaleLabel: {
    color: palette.softInk,
    fontSize: 11,
    fontFamily: typography.medium,
  },
  capsule: { borderRadius: 18, backgroundColor: palette.chip, paddingHorizontal: 18, paddingVertical: 11 },
  capsuleCompact: { minWidth: 74, alignItems: 'center' },
  capsuleSelected: { backgroundColor: palette.ink },
  capsuleText: {
    color: palette.ink,
    fontSize: 18,
    fontFamily: typography.semiBold,
    letterSpacing: -0.7,
  },
  capsuleTextSelected: { color: palette.shell },
  iconCircle: { height: 56, width: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e6e3df', backgroundColor: '#fbfaf8' },
  scaleNeedle: { position: 'absolute', top: -10, bottom: -10, left: '50%', width: 3, backgroundColor: palette.accent, zIndex: 10 },
});

const visualizerStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 100, gap: 3, width: '100%' },
  bar: { width: 3, borderRadius: 2 },
});

const miniStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '40%',
    gap: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});

const vinylStyles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  record: { width: '100%', height: '100%', borderRadius: 999, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  grooves: { position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  label: { width: '45%', height: '45%', borderRadius: 999, backgroundColor: '#fff', overflow: 'hidden', borderWidth: 2, borderColor: '#000', alignItems: 'center', justifyContent: 'center' },
  labelMini: { width: '90%', height: '90%' },
  labelImage: { width: '100%', height: '100%' },
  labelPlaceholder: { width: '100%', height: '100%', backgroundColor: palette.chip, alignItems: 'center', justifyContent: 'center' },
  spindle: { position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: palette.accent, borderWidth: 2, borderColor: '#000' },
});
