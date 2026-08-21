import { create } from 'zustand';
import { ALL_SUB_IDS } from '@/lib/subreddits';
import type { SortKey, DateFilter, ViewMode } from '@/types';

interface FiltersStore {
  query: string;
  priceMin: string;
  priceMax: string;
  dateFilter: DateFilter;
  sort: SortKey;
  hideSold: boolean;
  activeOnly: boolean;
  bulkOnly: boolean;
  pricedOnly: boolean;
  selectedSubs: Set<string>;
  view: ViewMode;
  setQuery: (q: string) => void;
  setPriceMin: (v: string) => void;
  setPriceMax: (v: string) => void;
  setDateFilter: (d: DateFilter) => void;
  setSort: (s: SortKey) => void;
  toggleOpt: (key: 'hideSold' | 'activeOnly' | 'bulkOnly' | 'pricedOnly') => void;
  toggleSub: (id: string) => void;
  toggleAllSubs: () => void;
  setView: (v: ViewMode) => void;
  resetPrice: () => void;
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  query: '',
  priceMin: '',
  priceMax: '',
  dateFilter: 'all',
  sort: 'newest',
  hideSold: false,
  activeOnly: false,
  bulkOnly: false,
  pricedOnly: false,
  selectedSubs: new Set(ALL_SUB_IDS),
  view: 'grid',

  setQuery: (q) => set({ query: q }),
  setPriceMin: (v) => set({ priceMin: v }),
  setPriceMax: (v) => set({ priceMax: v }),
  setDateFilter: (d) => set({ dateFilter: d }),
  setSort: (s) => set({ sort: s }),
  toggleOpt: (key) => set((state) => ({ [key]: !state[key] })),
  toggleSub: (id) =>
    set((state) => {
      const next = new Set(state.selectedSubs);
      next.has(id) ? next.delete(id) : next.add(id);
      return { selectedSubs: next };
    }),
  toggleAllSubs: () =>
    set((state) => ({
      selectedSubs: state.selectedSubs.size === ALL_SUB_IDS.size ? new Set<string>() : new Set(ALL_SUB_IDS),
    })),
  setView: (v) => set({ view: v }),
  resetPrice: () => set({ priceMin: '', priceMax: '' }),
}));