import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Audio } from 'expo-av';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { palette, Scale, typography } from '@/components/radio-ui';

const scatterLayout = [
  { key: 'France', top: '12%', left: '7%', tone: 'dark' },
  { key: 'Portugal', top: '6%', left: '66%', tone: 'soft' },
  { key: 'Spain', top: '24%', left: '54%', tone: 'dark' },
  { key: 'Germany', top: '41%', left: '24%', tone: 'soft' },
  { key: 'Italy', top: '56%', left: '73%', tone: 'soft' },
  { key: 'Georgia', top: '66%', left: '7%', tone: 'dark' },
] as const;

export default function IntroScreen() {
  const router = useRouter();
  const rotation = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const staticRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 5000, easing: Easing.linear }),
      -1,
      false
    );

    const interval = setInterval(() => {
      setActiveIndex((prev: number) => (prev + 1) % scatterLayout.length);
    }, 2800);

    // Play static audio and navigate when done
    async function setupStatic() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/fm-static.mp3'),
          { shouldPlay: true, isLooping: false, volume: 0.15 }
        );
        staticRef.current = sound;
        
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            router.replace('/countries');
          }
        });
      } catch (e) {
        console.warn('Static intro failed', e);
      }
    }
    setupStatic();

    return () => {
      clearInterval(interval);
      staticRef.current?.unloadAsync();
    };
  }, []);

  const animatedKnobStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        <View style={styles.panel}>
          <View style={styles.introTop}>
            {scatterLayout.map((item, index) => {
              const active = index === activeIndex;
              return (
                <Text
                  key={item.key}
                  style={[
                    styles.scatterLabel,
                    {
                      top: item.top,
                      left: item.left,
                      color: active ? palette.accent : (item.tone === 'dark' ? palette.ink : palette.softInk),
                      opacity: active ? 1 : 0.8,
                    },
                  ]}>
                  {item.key.toUpperCase()}
                </Text>
              );
            })}
          </View>

          <Scale height={58} animated />

          <View style={styles.introBottom}>
            <View style={styles.verticalLines}>
              {Array.from({ length: 48 }, (_, index) => (
                <View key={index} style={styles.verticalLine} />
              ))}
            </View>

            <Text style={styles.listenTitle}>Listen</Text>
            <Text style={styles.listenSubtitle}>Online</Text>

            <Link href="/countries" asChild>
              <Pressable style={styles.knobContainer}>
                <Animated.View style={[styles.knob, animatedKnobStyle]}>
                  <View style={styles.knobGroove1} />
                  <View style={styles.knobGroove2} />
                  <View style={styles.knobCore} />
                </Animated.View>
              </Pressable>
            </Link>

            <View style={styles.radioWordmark}>
              <Text style={styles.radioWord}>Radio</Text>
              <View style={styles.radioDot} />
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
    backgroundColor: palette.app,
  },
  screen: {
    flex: 1,
    backgroundColor: palette.app,
    padding: 0,
  },
  panel: {
    flex: 1,
    backgroundColor: palette.shell,
    borderRadius: 0, // Root level, fills screen
  },
  introTop: {
    flex: 0.92,
    position: 'relative',
    backgroundColor: palette.shell,
  },
  scatterLabel: {
    position: 'absolute',
    fontSize: 14,
    fontFamily: typography.bold,
    letterSpacing: -0.6,
  },
  introBottom: {
    flex: 1.6,
    overflow: 'hidden',
    backgroundColor: palette.dark,
    paddingHorizontal: 26,
    paddingTop: 28,
    paddingBottom: 18,
  },
  verticalLines: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    opacity: 0.8,
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#1f1f1f',
  },
  listenTitle: {
    color: '#f6f5f3',
    fontSize: 34,
    fontFamily: typography.bold,
    letterSpacing: -1.3,
  },
  listenSubtitle: {
    color: '#9d9d9d',
    fontSize: 34,
    fontFamily: typography.regular,
    letterSpacing: -1.3,
  },
  knobContainer: {
    marginTop: 'auto',
    alignSelf: 'flex-start',
  },
  knob: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: palette.warm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  knobGroove1: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  knobGroove2: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  knobCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.dark,
    opacity: 0.5,
  },
  radioWordmark: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  radioWord: {
    color: '#f7f6f4',
    fontSize: 72,
    lineHeight: 72,
    fontFamily: typography.regular,
    letterSpacing: -4.2,
  },
  radioDot: {
    marginBottom: 9,
    height: 15,
    width: 15,
    borderRadius: 7.5,
    backgroundColor: palette.accent,
  },
});
