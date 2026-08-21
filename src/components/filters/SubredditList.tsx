'use client';
import { useFiltersStore } from '@/store/filtersStore';
import { SUBS } from '@/lib/subreddits';

interface Props {
  countsBySub: Record<string, number>;
}

export function SubredditList({ countsBySub }: Props) {
  const { selectedSubs, toggleSub, toggleAllSubs } = useFiltersStore();
  return (
    <div className="px-3 pb-4">
      <div className="flex items-center justify-between py-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-tm">Subreddits</p>
        <button onClick={toggleAllSubs} className="text-[10px] text-acc font-semibold hover:underline">Toggle All</button>
      </div>
      <div className="flex flex-col gap-0.5 max-h-72 overflow-y-auto">
        {SUBS.map((s) => {
          const checked = selectedSubs.has(s.id);
          const count = countsBySub[s.id] ?? 0;
          return (
            <label key={s.id} className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded-lg hover:bg-white/5">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleSub(s.id)}
                className="hidden"
              />
              <span className={`w-3.5 h-3.5 rounded flex-shrink-0 flex items-center justify-center border text-[8px] transition-colors ${
                checked ? 'bg-acc border-acc text-white' : 'border-white/20'
              }`}>
                {checked ? '✓' : ''}
              </span>
              <span className="flex-1 text-[11px] text-t1 font-medium truncate">{s.ic} r/{s.id}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                count > 0 ? 'bg-orange-400/15 text-acc' : 'bg-white/5 text-tm'
              }`}>{count}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}