export const RADIO_API_BASE = 'https://de1.api.radio-browser.info/json';

export type RadioStation = {
  id: string;
  name: string;
  url: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countryCode: string;
  language: string;
  codec: string;
  bitrate: number;
  votes: number;
  clicks: number;
  lastCheckOk: number;
  type: 'radio';
};

export type RadioCountry = {
  name: string;
  iso_3166_1: string;
  stationcount: number;
};

type CacheEntry = {
  data: unknown;
  timestamp: number;
};

const memoryCache = new Map<string, CacheEntry>();

function readCachedValue(cacheKey: string, expiry: number) {
  const cached = memoryCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < expiry) {
    return cached.data;
  }

  if (typeof window === 'undefined' || !window.sessionStorage) {
    return null;
  }

  const raw = window.sessionStorage.getItem(cacheKey);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CacheEntry;

    if (Date.now() - parsed.timestamp < expiry) {
      memoryCache.set(cacheKey, parsed);
      return parsed.data;
    }
  } catch {
    window.sessionStorage.removeItem(cacheKey);
  }

  return null;
}

function writeCachedValue(cacheKey: string, data: unknown) {
  const entry = {
    data,
    timestamp: Date.now(),
  };

  memoryCache.set(cacheKey, entry);

  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.setItem(cacheKey, JSON.stringify(entry));
  }
}

async function fetchWithCache<T>(url: string, expiry = 3_600_000): Promise<T> {
  const cacheKey = `radio_cache_${url}`;
  const cached = readCachedValue(cacheKey, expiry);

  if (cached) {
    return cached as T;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Radio Browser request failed: ${response.status}`);
  }

  const data = (await response.json()) as T;
  writeCachedValue(cacheKey, data);
  return data;
}

export async function getRadioCountries() {
  const url = `${RADIO_API_BASE}/countries?order=stationcount&reverse=true`;
  return fetchWithCache<RadioCountry[]>(url, 86_400_000);
}

export async function getTopRadioStations(limit = 24, offset = 0) {
  const url = `${RADIO_API_BASE}/stations?order=votes&reverse=true&offset=${offset}&limit=${limit}&lastcheckok=1`;
  const data = await fetchWithCache<unknown[]>(url);
  return formatStations(data);
}

export async function getStationsByCountry(countryCode: string, limit = 100, offset = 0) {
  const url = `${RADIO_API_BASE}/stations/bycountrycodeexact/${countryCode}?order=votes&reverse=true&offset=${offset}&limit=${limit}&lastcheckok=1`;
  const data = await fetchWithCache<unknown[]>(url);
  return formatStations(data);
}

function formatStations(data: unknown[]) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((station) => {
    const item = station as Record<string, string | number | undefined>;

    return {
      id: String(item.stationuuid ?? ''),
      name: String(item.name ?? '').trim(),
      url: String(item.url_resolved ?? item.url ?? ''),
      homepage: String(item.homepage ?? ''),
      favicon: String(item.favicon ?? ''),
      tags: String(item.tags ?? ''),
      country: String(item.country ?? ''),
      countryCode: String(item.countrycode ?? ''),
      language: String(item.language ?? ''),
      codec: String(item.codec ?? ''),
      bitrate: Number(item.bitrate ?? 0),
      votes: Number(item.votes ?? 0),
      clicks: Number(item.clickcount ?? 0),
      lastCheckOk: Number(item.lastcheckok ?? 0),
      type: 'radio' as const,
    };
  });
}
