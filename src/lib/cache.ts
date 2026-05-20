import { CACHE_TTL_MS } from "./constants";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  isRefreshing: boolean;
}

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Stale-while-revalidate cache.
 * Returns fresh data immediately if available.
 * Returns stale data and triggers background refresh if expired.
 * Fetches synchronously on cache miss.
 */
export async function getWithSWR<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL_MS
): Promise<T> {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  if (entry) {
    const age = now - entry.timestamp;

    if (age < ttl) {
      return entry.data;
    }

    if (!entry.isRefreshing) {
      entry.isRefreshing = true;
      fetcher()
        .then((freshData) => {
          cache.set(key, {
            data: freshData,
            timestamp: Date.now(),
            isRefreshing: false,
          });
        })
        .catch(() => {
          entry.isRefreshing = false;
        });
    }

    return entry.data;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: now, isRefreshing: false });
  return data;
}

export function invalidateCache(key: string): void {
  cache.delete(key);
}

export function clearCache(): void {
  cache.clear();
}
