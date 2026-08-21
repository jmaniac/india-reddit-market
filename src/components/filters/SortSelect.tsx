'use client';
import { useFiltersStore } from '@/store/filtersStore';
import type { SortKey } from '@/types';

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'ups', label: 'Most Upvoted' },
  { value: 'cmts', label: 'Most Comments' },
];

export function SortSelect() {
  const { sort, setSort } = useFiltersStore();
  return (
    <div className="px-3 pb-3 border-b border-white/5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-tm py-3">Sort By</p>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as SortKey)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-t1 outline-none appearance-none cursor-pointer focus:border-acc"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value} className="bg-card">{o.label}</option>
        ))}
      </select>
    </div>
  );
}