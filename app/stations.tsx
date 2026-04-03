import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { MiniPlayer, palette, typography } from '@/components/radio-ui';
import { usePlayer } from '@/lib/player-context';
import { getStationsByCountry, type RadioStation } from '@/lib/radio';

export default function StationsScreen() {
  const router = useRouter();
  const { play } = usePlayer();
  const { code, name } = useLocalSearchParams<{ code: string, name: string }>();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    async function load() {
      try {
        const data = await getStationsByCountry(code, 5000);
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
          {!showSearch ? (
            <>
              <View style={styles.headerTitleWrap}>
                <Text numberOfLines={1} style={styles.headerSubtitle}>{name || 'Selected region'}</Text>
                <Text style={styles.headerTitle}>Stations</Text>
              </View>
              <Pressable onPress={() => setShowSearch(true)}>
                <Feather name="search" size={34} color={palette.ink} />
              </Pressable>
            </>
          ) : (
            <View style={styles.searchHeader}>
              <Feather name="search" size={24} color={palette.softInk} style={styles.searchIconInline} />
              <TextInput
                autoFocus
                style={styles.searchField}
                value={search}
                onChangeText={setSearch}
                placeholder="Search stations..."
                placeholderTextColor={palette.softInk}
              />
              <Pressable onPress={() => { setShowSearch(false); setSearch(''); }}>
                <Feather name="x" size={32} color={palette.ink} />
              </Pressable>
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={palette.ink} size="large" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            style={styles.listScroll}
            contentContainerStyle={styles.listContent}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={10}
            renderItem={({ item: station }) => (
              <Pressable
                onPress={() => {
                  play(station, filtered);
                  router.push({
                    pathname: '/player',
                    params: {
                      id: station.id,
                      name: station.name,
                      url: station.url,
                      country: station.country,
                      lang: station.language,
                      tags: station.tags,
                      homepage: station.homepage,
                      favicon: station.favicon,
                    }
                  });
                }}
                style={styles.row}
              >
                <Text numberOfLines={1} style={styles.stationName}>{station.name}</Text>
              </Pressable>
            )}
          />
        )}

        <View style={styles.footer}>
          <MiniPlayer />
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.footerLabel}>Found channels</Text>
            <Text style={styles.footerValue}>{filtered.length}</Text>
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
  headerSubtitle: {
    color: palette.softInk,
    fontSize: 13,
    fontFamily: typography.bold,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: palette.ink,
    fontSize: 28,
    fontFamily: typography.bold,
    letterSpacing: -1.5,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.chip,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  searchIconInline: { marginRight: 10 },
  searchField: {
    flex: 1,
    fontSize: 18,
    color: palette.ink,
    fontFamily: typography.semiBold,
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
    alignItems: 'baseline',
    width: '100%',
  },
  stationName: {
    flex: 1,
    color: palette.ink,
    fontSize: 34,
    lineHeight: 41,
    fontFamily: typography.bold,
    letterSpacing: -2.2,
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  footerLabel: {
    color: palette.softInk,
    fontSize: 14,
    fontFamily: typography.medium,
  },
  footerValue: {
    color: palette.ink,
    fontSize: 46,
    lineHeight: 46,
    fontFamily: typography.bold,
    letterSpacing: -3.2,
  },
});
