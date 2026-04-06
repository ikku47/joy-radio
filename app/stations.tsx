import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  FadeInDown, 
  Layout, 
  FadeIn
} from 'react-native-reanimated';

import { MiniPlayer, palette, typography } from '@/components/radio-ui';
import { usePlayer } from '@/lib/player-context';
import { 
  getStationsByCountry, 
  getStationsByLanguage, 
  getStationsByTag, 
  type RadioStation 
} from '@/lib/radio';

function StationRow({ station, index, onPress }: { station: RadioStation, index: number, onPress: () => void }) {
  const [error, setError] = useState(false);

  return (
    <Animated.View 
      entering={FadeInDown.duration(400).delay(Math.min(index * 30, 600))}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          pressed && styles.rowPressed
        ]}
      >
        <View style={styles.stationIconBox}>
          {(station.favicon && !error) ? (
            <Image 
              source={{ uri: station.favicon }} 
              style={styles.stationFavicon} 
              contentFit="contain" 
              onError={() => setError(true)}
            />
          ) : (
            <Feather name="radio" size={20} color={palette.softInk} />
          )}
        </View>
        <View style={styles.rowInfo}>
          <Text numberOfLines={1} style={styles.stationName}>{station.name}</Text>
          <Text numberOfLines={1} style={styles.stationMeta}>
            {station.tags ? station.tags.split(',').slice(0, 2).join(' • ') : (station.language || station.country)}
          </Text>
        </View>
        <View style={styles.rowAction}>
           <Feather name="chevron-right" size={20} color={palette.softInk} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function StationsScreen() {
  const router = useRouter();
  const { play } = usePlayer();
  const { type, id, name } = useLocalSearchParams<{ 
    type?: 'countries' | 'languages' | 'tags', 
    id: string, 
    name: string 
  }>();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        setLoading(true);
        let data: RadioStation[] = [];
        if (type === 'languages') {
          data = await getStationsByLanguage(id, 500);
        } else if (type === 'tags') {
          data = await getStationsByTag(id, 500);
        } else {
          data = await getStationsByCountry(id, 500);
        }
        setStations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, type]);

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
             <View style={styles.iconCircle}>
                <Feather name="arrow-left" size={24} color={palette.ink} />
             </View>
          </Pressable>
          
          <View style={styles.headerTitleWrap}>
            {!showSearch ? (
              <Animated.View entering={FadeIn.duration(400)} style={styles.headerTextRow}>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={styles.headerSubtitle}>{name || 'Selected region'}</Text>
                  <Text style={styles.headerTitle}>Stations</Text>
                </View>
                <Pressable onPress={() => setShowSearch(true)} style={styles.searchToggle}>
                  <Feather name="search" size={28} color={palette.ink} />
                </Pressable>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeIn.duration(400)} style={styles.searchHeader}>
                <TextInput
                  autoFocus
                  style={styles.searchField}
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search stations..."
                  placeholderTextColor={palette.softInk}
                />
                <Pressable onPress={() => { setShowSearch(false); setSearch(''); }}>
                  <Feather name="x" size={28} color={palette.ink} />
                </Pressable>
              </Animated.View>
            )}
          </View>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={palette.ink} size="large" />
            <Text style={styles.loadingText}>Searching the airwaves...</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            style={styles.listScroll}
            contentContainerStyle={styles.listContent}
            initialNumToRender={15}
            ListEmptyComponent={
               <View style={styles.emptyState}>
                  <Feather name="radio" size={48} color={palette.line} />
                  <Text style={styles.emptyText}>No stations found for "{search}"</Text>
               </View>
            }
            renderItem={({ item: station, index }) => (
              <StationRow 
                station={station} 
                index={index} 
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
              />
            )}
          />
        )}

        <View style={styles.footer}>
          <MiniPlayer />
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
    paddingTop: 24,
    paddingBottom: 20,
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.app,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    zIndex: 10,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSubtitle: {
    color: palette.softInk,
    fontSize: 12,
    fontFamily: typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    color: palette.ink,
    fontSize: 28,
    fontFamily: typography.bold,
    letterSpacing: -1.5,
    marginTop: -2,
  },
  searchToggle: {
    padding: 4,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.chip,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 48,
  },
  searchField: {
    flex: 1,
    fontSize: 16,
    color: palette.ink,
    fontFamily: typography.semiBold,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: typography.medium,
    color: palette.softInk,
    fontSize: 14,
  },
  listScroll: { flex: 1 },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  rowPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  stationIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: palette.app,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  stationFavicon: {
    width: '100%',
    height: '100%',
  },
  rowInfo: {
    flex: 1,
  },
  stationName: {
    color: palette.ink,
    fontSize: 24,
    fontFamily: typography.bold,
    letterSpacing: -1,
  },
  stationMeta: {
    color: palette.softInk,
    fontSize: 13,
    fontFamily: typography.medium,
    marginTop: 0,
  },
  rowAction: {
    marginLeft: 12,
  },
  emptyState: {
    paddingTop: 80,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontFamily: typography.medium,
    color: palette.softInk,
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    backgroundColor: palette.shell,
  },
});
