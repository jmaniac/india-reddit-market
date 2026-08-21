import { useMemo } from 'react';
import { useFiltersStore } from '@/store/filtersStore';
import type { Listing } from '@/types';

export function useFilteredListings(listings: Listing[]): Listing[] {
  const { query, priceMin, priceMax, dateFilter, sort, hideSold, activeOnly, bulkOnly, pricedOnly } =
    useFiltersStore();

  return useMemo(() => {
    const now = Date.now() / 1000;
    const dateMap = { all: 0, today: now - 86400, week: now - 86400 * 7, month: now - 86400 * 30 };
    const dMin = dateMap[dateFilter] ?? 0;
    const mn = parseFloat(priceMin) || 0;
    const mx = parseFloat(priceMax) || Infinity;
    const q = query.trim().toLowerCase();

    let result = listings.filter((p) => {
      if (hideSold && p.sold) return false;
      if (activeOnly && now - p.ts > 86400 * 7) return false;
      if (bulkOnly && !p.isBulk) return false;
      if (pricedOnly && p.price == null) return false;
      if (p.ts < dMin) return false;
      if (p.price != null) {
        if (p.price < mn) return false;
        if (p.price > mx) return false;
      }
      if (q) {
        const hay = `${p.title} ${p.body} ${p.bulkItems.join(' ')}`.toLowerCase();
        if (!q.split(/\s+/).every((t) => hay.includes(t))) return false;
      }
      return true;
    });

    switch (sort) {
      case 'newest': result.sort((a, b) => b.ts - a.ts); break;
      case 'oldest': result.sort((a, b) => a.ts - b.ts); break;
      case 'price_asc': result.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)); break;
      case 'price_desc': result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0)); break;
      case 'ups': result.sort((a, b) => b.ups - a.ups); break;
      case 'cmts': result.sort((a, b) => b.nc - a.nc); break;
    }

    return result;
  }, [listings, query, priceMin, priceMax, dateFilter, sort, hideSold, activeOnly, bulkOnly, pricedOnly]);
}