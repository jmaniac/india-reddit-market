import { useQueries } from '@tanstack/react-query';
import { useFiltersStore } from '@/store/filtersStore';
import { SUBS } from '@/lib/subreddits';
import { parsePrice } from '@/lib/price';
import { detectSold, parseBulkItems } from '@/lib/sold';
import type { Listing, RedditPost } from '@/types';

const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day

function getFromCache(subId: string, query: string): Listing[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = `reddit_cache_${subId}_${query}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

function saveToCache(subId: string, query: string, data: Listing[]) {
  if (typeof window === 'undefined') return;
  try {
    const key = `reddit_cache_${subId}_${query}`;
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    // Silently ignore if localStorage is full or disabled
  }
}

// Simple semaphore to limit concurrent requests
const MAX_CONCURRENT = 3;
let activeRequests = 0;
const queue: (() => void)[] = [];

async function acquire() {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests++;
    return;
  }
  return new Promise<void>((resolve) => {
    queue.push(resolve);
  });
}

function release() {
  activeRequests--;
  if (queue.length > 0) {
    activeRequests++;
    const next = queue.shift();
    next?.();
  }
}

async function fetchT(url: string, ms: number, opts?: RequestInit) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal, ...opts });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

const PROXIES = [
  (url: string) => `/api/reddit?path=${encodeURIComponent(url.replace('https://www.reddit.com', ''))}`, // Next.js proxy
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

function parsePriceSafe(text: string): number | null {
  const m = text.match(/(?:rs\.?|inr|₹)\s*([\d,]+)/i);
  if (!m) return null;
  return parseInt(m[1].replace(/,/g, ''), 10);
}

function mapPost(r: RedditPost): Listing {
  const text = `${r.title} ${r.selftext}`;
  const bulkItems = parseBulkItems(r.selftext);
  return {
    id: r.id,
    sub: r.subreddit,
    title: r.title,
    body: r.selftext,
    author: r.author,
    price: parsePriceSafe(text),
    isBulk: bulkItems.length >= 2,
    bulkItems,
    sold: detectSold(r.title, r.selftext, r.link_flair_text),
    ups: r.ups ?? 0,
    nc: r.num_comments ?? 0,
    ts: r.created_utc ?? 0,
    url: `https://reddit.com${r.permalink}`,
    isNew: Date.now() / 1000 - (r.created_utc ?? 0) < 86400,
  };
}

async function fetchSubreddit(subId: string, query: string): Promise<Listing[]> {
  const cached = getFromCache(subId, query);
  
  await acquire();
  try {
    const rpath = query
      ? `/r/${subId}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&sort=new&limit=25`
      : `/r/${subId}/new.json?limit=25`;
    const directUrl = `https://www.reddit.com${rpath}`;

    // 1. DIRECT FETCH FIRST:
    try {
      const res = await fetchT(directUrl, 5000, { credentials: 'include', headers: { Accept: 'application/json' }});
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.children) {
          const children: { data: RedditPost }[] = json.data.children;
          const listings = children
            .map((c) => { try { return mapPost(c.data); } catch { return null; } })
            .filter((p): p is Listing => p !== null && typeof p.title === 'string' && p.title.length > 2);
          
          saveToCache(subId, query, listings);
          return listings;
        }
      }
    } catch (e) {}

    // 2. Try proxy methods sequentially
    for (let i = 0; i < PROXIES.length; i++) {
      const pUrl = PROXIES[i](directUrl);
      try {
        const res = await fetchT(pUrl, 15000, { headers: { Accept: 'application/json' }});
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.children) {
            const children: { data: RedditPost }[] = json.data.children;
            const listings = children
              .map((c) => { try { return mapPost(c.data); } catch { return null; } })
              .filter((p): p is Listing => p !== null && typeof p.title === 'string' && p.title.length > 2);
            
            saveToCache(subId, query, listings);
            return listings;
          }
        }
      } catch (e) {}
    }
    
    // If all fetch methods fail (403/429), return cache if available
    if (cached && cached.length > 0) {
      console.warn(`Fetch failed for r/${subId}. Loaded from cache.`);
      return cached;
    }

    return [];
  } finally {
    release();
  }
}

export function useListings() {
  const { query, selectedSubs } = useFiltersStore();
  const activeSubs = SUBS.filter((s) => selectedSubs.has(s.id));

  const results = useQueries({
    queries: activeSubs.map((s) => ({
      queryKey: ['listings', s.id, query],
      queryFn: () => fetchSubreddit(s.id, query),
      staleTime: 5 * 60 * 1000,
      initialData: () => getFromCache(s.id, query) || undefined,
      retry: 1,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.every((r) => r.isError);
  const progress = results.length
    ? Math.round((results.filter((r) => !r.isLoading).length / results.length) * 100)
    : 0;

  const seen = new Set<string>();
  const listings: Listing[] = results
    .flatMap((r) => r.data ?? [])
    .filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    })
    .sort((a, b) => b.ts - a.ts);

  const countsBySub: Record<string, number> = {};
  for (const s of activeSubs) {
    const r = results[activeSubs.indexOf(s)];
    countsBySub[s.id] = r?.data?.length ?? 0;
  }

  return { listings, isLoading, isError, progress, countsBySub };
}