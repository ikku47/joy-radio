import { Feather } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  withDelay,
  Easing 
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { usePlayer } from '@/lib/player-context';

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

export function Scale({ 
  height = 54, 
  withLabels = false,
  animated = false
}: { 
  height?: number; 
  withLabels?: boolean;
  animated?: boolean;
}) {
  const marks = Array.from({ length: animated ? 120 : 61 }, (_, index) => index);
  const { staticWaveform } = usePlayer();
  const offset = useSharedValue(0);
  const needlePos = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      // Step-by-step seeking motion
      needlePos.value = withRepeat(
        withSequence(
          withTiming(30, { duration: 1200, easing: Easing.out(Easing.quad) }),
          withDelay(800, withTiming(30, { duration: 0 })), // Pause
          withTiming(80, { duration: 1500, easing: Easing.out(Easing.quad) }),
          withDelay(1200, withTiming(80, { duration: 0 })), // Pause
          withTiming(140, { duration: 1000, easing: Easing.out(Easing.quad) }),
          withDelay(600, withTiming(140, { duration: 0 })), // Pause
          withTiming(180, { duration: 1800, easing: Easing.out(Easing.quad) }),
          withDelay(1000, withTiming(180, { duration: 0 })), // Long pause
        ),
        -1,
        true
      );
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 0 }],
  }));

  const needleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: needlePos.value - 80 }, // Center-aligned sweep
    ],
  }));

  return (
    <View style={[styles.scaleWrap, { height }]}>
      <Animated.View style={[styles.scaleMarks, animated ? animatedStyle : null]}>
        {marks.map((mark) => {
          const major = mark % 5 === 0;
          return <View key={mark} style={[styles.scaleMark, major ? styles.scaleMarkMajor : styles.scaleMarkMinor]} />;
        })}
      </Animated.View>
      {animated ? (
        <Animated.View style={[styles.scaleNeedle, needleStyle]} />
      ) : null}
      {withLabels ? (
        <View style={styles.scaleLabels}>
          {[92, 93, 94, 95, 96, 97].map((value) => (
            <Text key={value} style={styles.scaleLabel}>
              {value}
            </Text>
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

const styles = StyleSheet.create({
  scaleWrap: {
    justifyContent: 'center',
    backgroundColor: palette.shell,
  },
  scaleMarks: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  scaleMark: {
    width: 1,
    backgroundColor: '#bebebe',
  },
  scaleMarkMajor: {
    height: 26,
  },
  scaleMarkMinor: {
    height: 15,
  },
  scaleLabels: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  scaleLabel: {
    color: palette.softInk,
    fontSize: 11,
    fontWeight: '500',
  },
  capsule: {
    borderRadius: 18,
    backgroundColor: palette.chip,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  capsuleCompact: {
    minWidth: 74,
    alignItems: 'center',
  },
  capsuleSelected: {
    backgroundColor: palette.ink,
  },
  capsuleText: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.7,
  },
  capsuleTextSelected: {
    color: palette.shell,
  },
  iconCircle: {
    height: 56,
    width: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e6e3df',
    backgroundColor: '#fbfaf8',
  },
  scaleNeedle: {
    position: 'absolute',
    top: -10,
    bottom: -10,
    left: '50%',
    width: 3,
    backgroundColor: palette.accent,
    zIndex: 10,
  },
});
