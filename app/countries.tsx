import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import { getRadioCountries, type RadioCountry } from '@/lib/radio';

export default function CountriesScreen() {
  const router = useRouter();
  const [countries, setCountries] = useState<RadioCountry[]>([]);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRadioCountries();
        setCountries(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalStations = countries.reduce((sum, c) => sum + c.stationcount, 0);
  const filtered = useMemo(() => {
    if (!search) return countries;
    const q = search.toLowerCase();
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [countries, search]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        <View style={styles.header}>
          {!showSearch ? (
            <>
              <Text style={styles.headerText}>
                <Text style={styles.headerPrimary}>Choose </Text>
                <Text style={styles.headerSecondary}>Country</Text>
              </Text>
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
                placeholder="Search countries..."
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
            keyExtractor={(item) => item.iso_3166_1}
            keyboardShouldPersistTaps="handled"
            style={styles.listScroll}
            contentContainerStyle={styles.listContent}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={10}
            renderItem={({ item: country }) => (
              <Pressable
                onPress={() => router.push({
                  pathname: '/stations',
                  params: { code: country.iso_3166_1, name: country.name }
                })}
                style={styles.row}
              >
                <Text style={styles.countryName}>{country.name}</Text>
                <Text style={styles.countryCount}>({country.stationcount})</Text>
              </Pressable>
            )}
          />
        )}

        <View style={styles.footer}>
          <MiniPlayer />
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.footerLabel}>Total Global</Text>
            <Text style={styles.footerValue}>{totalStations ? totalStations.toLocaleString() : '...'}</Text>
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
  backButton: {
    marginLeft: -8,
  },
  headerText: {
    flex: 1,
    fontSize: 28,
    fontFamily: typography.bold,
    letterSpacing: -1.5,
  },
  headerPrimary: { color: palette.ink },
  headerSecondary: { color: palette.softInk, fontFamily: typography.medium },
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
    justifyContent: 'space-between',
    width: '100%',
  },
  countryName: {
    flex: 1,
    color: palette.ink,
    fontSize: 34,
    lineHeight: 41,
    fontFamily: typography.bold,
    letterSpacing: -2.2,
    marginRight: 10,
  },
  countryCount: {
    marginLeft: 4,
    color: palette.softInk,
    fontSize: 14,
    fontFamily: typography.medium,
    lineHeight: 24,
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
