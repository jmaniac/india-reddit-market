'use client';
import { useFiltersStore } from '@/store/filtersStore';

const OPTS = [
  { key: 'hideSold', label: 'Hide Sold' },
  { key: 'activeOnly', label: 'Recent Activity Only' },
  { key: 'bulkOnly', label: 'Bulk Sales Only' },
  { key: 'pricedOnly', label: 'Priced Only' },
] as const;

export function OptionsToggles() {
  const store = useFiltersStore();
  return (
    <div className="px-3 pb-3 border-b border-white/5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-tm py-3">Options</p>
      <div className="flex flex-col gap-2">
        {OPTS.map(({ key, label }) => {
          const on = store[key];
          return (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs text-t2">{label}</span>
              <button
                onClick={() => store.toggleOpt(key)}
                className={`w-8 h-4.5 rounded-full relative transition-colors ${
                  on ? 'bg-acc' : 'bg-white/10 border border-white/10'
                }`}
                style={{ width: '33px', height: '18px' }}
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                    on ? 'left-[17px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}