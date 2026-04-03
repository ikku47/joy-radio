import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { palette, Scale } from '@/components/radio-ui';

const scatterLayout = [
  { key: 'France', top: '12%', left: '7%', tone: 'dark' },
  { key: 'Portugal', top: '6%', left: '66%', tone: 'soft' },
  { key: 'Spain', top: '24%', left: '54%', tone: 'dark' },
  { key: 'Germany', top: '41%', left: '24%', tone: 'soft' },
  { key: 'Italy', top: '56%', left: '73%', tone: 'soft' },
  { key: 'Georgia', top: '66%', left: '7%', tone: 'dark' },
] as const;

export default function IntroScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        <View style={styles.panel}>
          <View style={styles.introTop}>
            {scatterLayout.map((item) => (
              <Text
                key={item.key}
                style={[
                  styles.scatterLabel,
                  {
                    top: item.top,
                    left: item.left,
                    color: item.tone === 'dark' ? palette.ink : palette.softInk,
                  },
                ]}>
                {item.key.toUpperCase()}
              </Text>
            ))}
          </View>

          <Scale height={58} />

          <View style={styles.introBottom}>
            <View style={styles.verticalLines}>
              {Array.from({ length: 48 }, (_, index) => (
                <View key={index} style={styles.verticalLine} />
              ))}
            </View>

            <Text style={styles.listenTitle}>Listen</Text>
            <Text style={styles.listenSubtitle}>Online</Text>

            <Link href="/countries" asChild>
              <Pressable style={styles.knob}>
                <View style={styles.knobCore} />
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
    fontWeight: '700',
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
    fontWeight: '700',
    letterSpacing: -1.3,
  },
  listenSubtitle: {
    color: '#9d9d9d',
    fontSize: 34,
    fontWeight: '400',
    letterSpacing: -1.3,
  },
  knob: {
    marginTop: 'auto',
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: palette.warm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  knobCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: palette.dark,
    opacity: 0.4,
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
    fontWeight: '300',
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
