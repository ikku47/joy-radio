import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getStationsByCountry, type RadioStation } from '@/lib/radio';
import { palette } from '@/components/radio-ui';

export default function StationsScreen() {
  const router = useRouter();
  const { code, name } = useLocalSearchParams<{ code: string, name: string }>();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    async function load() {
      try {
        const data = await getStationsByCountry(code, 100);
        setStations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [code]);

  const filtered = useMemo(() => {
    if (!search) return stations;
    const q = search.toLowerCase();
    return stations.filter((s) => s.name.toLowerCase().includes(q));
  }, [stations, search]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={32} color={palette.ink} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text numberOfLines={1} style={styles.headerSubtitle}>{name || 'Selected region'}</Text>
            <Text style={styles.headerTitle}>Stations</Text>
          </View>
          <View style={styles.headerIcons}>
            <Feather name="radio" size={34} color={palette.ink} />
          </View>
        </View>

        <View style={styles.searchWrap}>
          <Feather name="search" size={20} color={palette.softInk} style={styles.searchIcon} />
          <TextInput
            style={styles.searchField}
            value={search}
            onChangeText={setSearch}
            placeholder="Search regional stations..."
            placeholderTextColor={palette.softInk}
          />
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={palette.ink} size="large" />
          </View>
        ) : (
          <ScrollView keyboardShouldPersistTaps="handled" style={styles.listScroll} contentContainerStyle={styles.listContent}>
            {filtered.map((station) => (
              <Pressable 
                key={station.id} 
                onPress={() => router.push({
                   pathname: '/player',
                   params: { 
                     id: station.id, 
                     name: station.name,
                     url: station.url,
                     country: station.country,
                     lang: station.language,
                     tags: station.tags,
                     homepage: station.homepage
                   }
                })}
                style={styles.row}
              >
                <Text numberOfLines={1} style={styles.stationName}>{station.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerLabel}>Found channels</Text>
          <Text style={styles.footerValue}>{filtered.length}</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 18,
    gap: 12,
  },
  headerTitleWrap: { flex: 1 },
  headerSubtitle: { color: palette.softInk, fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  headerTitle: { color: palette.ink, fontSize: 28, fontWeight: '700', letterSpacing: -1.5 },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.chip,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -4,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 18,
  },
  searchWrap: {
    marginHorizontal: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.chip,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: { marginRight: 10 },
  searchField: {
    flex: 1,
    fontSize: 16,
    color: palette.ink,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listScroll: { flex: 1 },
  listContent: {
    paddingHorizontal: 24,
    gap: 8,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stationName: {
    color: palette.ink,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700',
    letterSpacing: -2.2,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footerLabel: {
    color: palette.softInk,
    fontSize: 14,
  },
  footerValue: {
    color: palette.ink,
    fontSize: 46,
    lineHeight: 46,
    fontWeight: '700',
    letterSpacing: -3.2,
  },
});
