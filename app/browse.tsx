import { Feather } from '@expo/vector-icons';
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
import { 
  getRadioCountries, 
  getRadioLanguages, 
  getRadioTags, 
  type RadioCountry, 
  type RadioLanguage, 
  type RadioTag 
} from '@/lib/radio';

type BrowseItem = {
  name: string;
  count: number;
  id: string; // ISO for country, name for others
};

export default function BrowseScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: 'countries' | 'languages' | 'tags' }>();
  const [items, setItems] = useState<BrowseItem[]>([]);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        let data: BrowseItem[] = [];
        if (type === 'countries') {
          const res = await getRadioCountries();
          data = res.map(c => ({ name: c.name, count: c.stationcount, id: c.iso_3166_1 }));
        } else if (type === 'languages') {
          const res = await getRadioLanguages();
          data = res.map(l => ({ name: l.name, count: l.stationcount, id: l.name }));
        } else if (type === 'tags') {
          const res = await getRadioTags();
          data = res.map(t => ({ name: t.name, count: t.stationcount, id: t.name }));
        }
        setItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [type]);

  const titles = {
    countries: 'Country',
    languages: 'Language',
    tags: 'Style',
  };

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, search]);

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
                <Text style={styles.headerText}>
                  <Text style={styles.headerPrimary}>Browse </Text>
                  <Text style={styles.headerSecondary}>{titles[type || 'countries']}</Text>
                </Text>
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
                  placeholder="Search..."
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
            <Text style={styles.loadingText}>Tuning in...</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item, index) => item.id + index}
            keyboardShouldPersistTaps="handled"
            style={styles.listScroll}
            contentContainerStyle={styles.listContent}
            initialNumToRender={15}
            ListEmptyComponent={
               <View style={styles.emptyState}>
                  <Feather name="search" size={48} color={palette.line} />
                  <Text style={styles.emptyText}>No results found for "{search}"</Text>
               </View>
            }
            renderItem={({ item, index }) => (
              <Animated.View 
                entering={FadeInDown.duration(400).delay(Math.min(index * 30, 600))}
              >
                <Pressable
                  onPress={() => router.push({
                    pathname: '/stations',
                    params: { 
                      type: type,
                      id: item.id, 
                      name: item.name 
                    }
                  })}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && styles.rowPressed
                  ]}
                >
                  <View style={styles.rowInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCount}>{item.count.toLocaleString()} stations</Text>
                  </View>
                  <View style={styles.rowAction}>
                     <Feather name="chevron-right" size={20} color={palette.softInk} />
                  </View>
                </Pressable>
              </Animated.View>
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
  headerText: {
    fontSize: 24,
    fontFamily: typography.bold,
    letterSpacing: -1,
  },
  headerPrimary: { color: palette.ink, opacity: 0.4 },
  headerSecondary: { color: palette.ink },
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
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  rowPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  rowInfo: {
    flex: 1,
  },
  itemName: {
    color: palette.ink,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: typography.bold,
    letterSpacing: -1.5,
    textTransform: 'capitalize',
  },
  itemCount: {
    color: palette.softInk,
    fontSize: 13,
    fontFamily: typography.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
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
