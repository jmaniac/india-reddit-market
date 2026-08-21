'use client';
import { useFiltersStore } from '@/store/filtersStore';
import type { DateFilter as DF } from '@/types';

const OPTIONS: { value: DF; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export function DateFilter() {
  const { dateFilter, setDateFilter } = useFiltersStore();
  return (
    <div className="px-3 pb-3 border-b border-white/5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-tm py-3">Date Posted</p>
      <div className="flex flex-col gap-1">
        {OPTIONS.map((o) => (
          <label key={o.value} className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded-lg hover:bg-white/5 text-xs text-t2">
            <input
              type="radio"
              name="dateFilter"
              value={o.value}
              checked={dateFilter === o.value}
              onChange={() => setDateFilter(o.value)}
              className="accent-acc"
            />
            <span className={dateFilter === o.value ? 'text-acc font-medium' : ''}>{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}