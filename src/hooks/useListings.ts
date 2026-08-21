import { useQueries } from '@tanstack/react-query';
import { useFiltersStore } from '@/store/filtersStore';
import { SUBS } from '@/lib/subreddits';
import { parsePrice } from '@/lib/price';
import { detectSold, parseBulkItems } from '@/lib/sold';
import type { Listing, RedditPost } from '@/types';

// Concurrency limiter to avoid Reddit 429 Too Many Requests
const queue: (() => void)[] = [];
let active = 0;
const MAX_CONCURRENT = 3;

async function acquire() {
  if (active < MAX_CONCURRENT) {
    active++;
    return;
  }
  return new Promise<void>((resolve) => {
    queue.push(resolve);
  });
}

function release() {
  active--;
  if (queue.length > 0) {
    active++;
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

async function fetchSubreddit(subId: string, query: string): Promise<Listing[]> {
  await acquire();
  try {
    const rpath = query
      ? `/r/${subId}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&sort=new&limit=25`
      : `/r/${subId}/new.json?limit=25`;
    const directUrl = `https://www.reddit.com${rpath}`;

    // 1. DIRECT FETCH FIRST:
    // If the user is logged into Reddit, their browser cookies will instantly bypass the local IP ban.
    try {
      const res = await fetchT(directUrl, 5000, { credentials: 'include', headers: { Accept: 'application/json' }});
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.children) {
          const children: { data: RedditPost }[] = json.data.children;
          return children.map((c) => mapPost(c.data)).filter((p) => p.title.length > 2);
        }
      }
    } catch (e) {}

    // 2. Try proxy methods sequentially with short timeouts so it doesn't hang forever
    for (let i = 0; i < PROXIES.length; i++) {
      const pUrl = PROXIES[i](directUrl);
      try {
        const res = await fetchT(pUrl, 6000, {
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.children) {
            const children: { data: RedditPost }[] = json.data.children;
            return children.map((c) => mapPost(c.data)).filter((p) => p.title.length > 2);
          }
        }
      } catch (e) {}
    }
    
    // If we reach here, all fetch methods failed (likely due to Reddit 429 rate limits)
    throw new Error(`All fetch methods failed for r/${subId}`);
  } finally {
    release();
  }
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
    price: parsePrice(text),
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

export function useListings() {
  const { query, selectedSubs } = useFiltersStore();
  const activeSubs = SUBS.filter((s) => selectedSubs.has(s.id));

  const results = useQueries({
    queries: activeSubs.map((s) => ({
      queryKey: ['listings', s.id, query],
      queryFn: () => fetchSubreddit(s.id, query),
      staleTime: 5 * 60 * 1000,
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