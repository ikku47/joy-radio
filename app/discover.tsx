import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withDelay,
  withRepeat,
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';

import { MiniPlayer, palette, typography, Scale } from '@/components/radio-ui';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const router = useRouter();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        {/* Decorative Grid Lines */}
        <View style={styles.decorativeLines}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.line} />
          ))}
        </View>

        <View style={styles.header}>
          <Animated.View entering={FadeInDown.duration(800).delay(100)}>
            <Text style={styles.brand}>JOY RADIO</Text>
            <Text style={styles.headerTitle}>
              <Text style={styles.headerPrimary}>Explore </Text>
              <Text style={styles.headerSecondary}>Mode</Text>
            </Text>
          </Animated.View>
        </View>

        <View style={styles.content}>
          {/* Main Hero Card (Countries) */}
          <Animated.View entering={FadeInDown.duration(800).delay(300)}>
            <Pressable
              style={[styles.heroCard, { backgroundColor: palette.dark }]}
              onPress={() => router.push({
                pathname: '/browse',
                params: { type: 'countries' }
              })}
            >
              <View style={styles.heroContent}>
                <Text style={styles.heroLabel}>Global Waves</Text>
                <Text style={styles.heroSublabel}>Browse every country</Text>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>200+ REGIONS</Text>
                </View>
              </View>
              <View style={styles.heroIconBox}>
                <Feather name="globe" size={100} color="rgba(255,255,255,0.08)" />
              </View>
            </Pressable>
          </Animated.View>

          {/* Secondary Grid (Languages & Genres) */}
          <View style={styles.grid}>
            {/* Language Card (Talk) */}
            <Animated.View entering={FadeInDown.duration(800).delay(500)} style={styles.gridItem}>
              <Pressable
                style={[styles.card, styles.cardWarm]}
                onPress={() => router.push({
                  pathname: '/browse',
                  params: { type: 'languages' }
                })}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardIndicator}>01</Text>
                  <Text style={styles.cardLabelLarge}>Talk</Text>
                  <Text style={styles.cardLabelSmall}>LANGUAGES</Text>
                </View>
                <View style={styles.cardIconFloating}>
                   <Feather name="mic" size={54} color="rgba(0,0,0,0.05)" />
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardMeta}>100+ CODES</Text>
                  <View style={styles.cardArrow}>
                    <Feather name="arrow-up-right" size={16} color={palette.ink} />
                  </View>
                </View>
              </Pressable>
            </Animated.View>

            {/* Genre Card (Vibe) */}
            <Animated.View entering={FadeInDown.duration(800).delay(600)} style={styles.gridItem}>
              <Pressable
                style={[styles.card, styles.cardAccent]}
                onPress={() => router.push({
                  pathname: '/browse',
                  params: { type: 'tags' }
                })}
              >
                <View style={styles.cardContent}>
                  <Text style={[styles.cardIndicator, { color: 'rgba(255,255,255,0.4)' }]}>02</Text>
                  <Text style={[styles.cardLabelLarge, { color: '#fff' }]}>Vibe</Text>
                  <Text style={[styles.cardLabelSmall, { color: 'rgba(255,255,255,0.6)' }]}>GENRES</Text>
                </View>
                <Animated.View style={[styles.cardIconFloating, animatedIconStyle]}>
                   <Feather name="music" size={54} color="rgba(255,255,255,0.1)" />
                </Animated.View>
                <View style={styles.cardFooter}>
                  <Text style={[styles.cardMeta, { color: 'rgba(255,255,255,0.8)' }]}>500+ STYLES</Text>
                  <View style={[styles.cardArrow, { backgroundColor: '#fff' }]}>
                    <Feather name="arrow-up-right" size={16} color={palette.accent} />
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          </View>

          {/* Decorative Scale */}
          <View style={styles.scaleContainer}>
             <Scale animated animateNeedleOnly height={40} />
          </View>
        </View>

        <View style={styles.footer}>
          <MiniPlayer />
          <View style={styles.footerInfo}>
             <Text style={styles.footerTime}>Live</Text>
             <View style={styles.liveDot} />
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
    backgroundColor: palette.shell,
    paddingTop: 20,
  },
  decorativeLines: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    pointerEvents: 'none',
  },
  line: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  brand: {
    fontSize: 12,
    fontFamily: typography.bold,
    color: palette.accent,
    letterSpacing: 2,
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 52,
    fontFamily: typography.bold,
    lineHeight: 52,
    letterSpacing: -3,
  },
  headerPrimary: { color: palette.ink },
  headerSecondary: { color: palette.softInk, fontFamily: typography.medium },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  heroCard: {
    borderRadius: 32,
    height: 180,
    padding: 24,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  heroLabel: {
    fontSize: 36,
    fontFamily: typography.bold,
    color: '#fff',
    letterSpacing: -1.5,
  },
  heroSublabel: {
    fontSize: 14,
    fontFamily: typography.medium,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroBadgeText: {
    fontSize: 10,
    fontFamily: typography.bold,
    color: '#fff',
  },
  heroIconBox: {
    position: 'absolute',
    right: -20,
    top: -10,
    zIndex: 1,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  gridItem: {
    flex: 1,
  },
  card: {
    borderRadius: 32,
    padding: 24,
    height: 220,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cardWarm: {
    backgroundColor: palette.warm,
  },
  cardAccent: {
    backgroundColor: palette.accent,
  },
  cardContent: {
    zIndex: 2,
  },
  cardIndicator: {
    fontSize: 12,
    fontFamily: typography.bold,
    color: 'rgba(0,0,0,0.3)',
    marginBottom: 8,
  },
  cardLabelLarge: {
    fontSize: 32,
    fontFamily: typography.bold,
    color: palette.ink,
    letterSpacing: -1.5,
    lineHeight: 32,
  },
  cardLabelSmall: {
    fontSize: 11,
    fontFamily: typography.bold,
    color: 'rgba(0,0,0,0.4)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  cardIconFloating: {
    position: 'absolute',
    right: -10,
    top: '30%',
    zIndex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  cardMeta: {
    fontSize: 11,
    fontFamily: typography.bold,
    color: palette.ink,
    opacity: 0.8,
  },
  cardArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleContainer: {
    marginTop: 40,
    opacity: 0.5,
  },
  footer: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 32,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerTime: {
    fontSize: 14,
    fontFamily: typography.bold,
    color: palette.ink,
    textTransform: 'uppercase',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.accent,
  },
});
