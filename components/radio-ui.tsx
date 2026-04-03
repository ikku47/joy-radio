import { Feather } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

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

export function Scale({ height = 54, withLabels = false }: { height?: number; withLabels?: boolean }) {
  const marks = Array.from({ length: 61 }, (_, index) => index);

  return (
    <View style={[styles.scaleWrap, { height }]}>
      <View style={styles.scaleMarks}>
        {marks.map((mark) => {
          const major = mark % 5 === 0;
          return <View key={mark} style={[styles.scaleMark, major ? styles.scaleMarkMajor : styles.scaleMarkMinor]} />;
        })}
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 0,
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
});
