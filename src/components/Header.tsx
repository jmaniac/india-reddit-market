'use client';
import { Search, RefreshCw, Settings, Menu } from 'lucide-react';
import { useFiltersStore } from '@/store/filtersStore';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { query, setQuery } = useFiltersStore();
  const queryClient = useQueryClient();
  const [spinning, setSpinning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setSpinning(true);
    await queryClient.invalidateQueries({ queryKey: ['listings'] });
    setTimeout(() => setSpinning(false), 800);
  }, [queryClient]);

  return (
    <header className="sticky top-0 z-50 bg-bg/90 backdrop-blur-xl border-b border-white/5 px-4">
      <div className="max-w-screen-2xl mx-auto flex items-center gap-3 h-16">
        <button onClick={onMenuClick} className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-t2">
          <Menu size={14} />
        </button>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-acc to-orange-600 flex items-center justify-center text-base shadow-[0_0_16px_rgba(255,140,0,.3)]">🛒</div>
          <div className="hidden sm:block">
            <div className="text-sm font-extrabold bg-gradient-to-r from-acc to-acc-b bg-clip-text text-transparent">IndiaReddit Market</div>
            <div className="text-[9px] text-tm uppercase tracking-wide">Buy &amp; Sell on Reddit India</div>
          </div>
        </div>
        <div className="flex-1 max-w-xl relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-tm pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phones, laptops, bikes, cameras…"
            className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-8 py-2.5 text-sm text-t1 placeholder:text-tm outline-none focus:border-acc focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(255,140,0,.15)] transition-all"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-tm hover:text-t1 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-white/10"
            >✕</button>
          )}
        </div>
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <button className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-t2 flex items-center justify-center hover:border-acc hover:text-acc transition-colors">
            <Settings size={13} />
          </button>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-br from-acc to-orange-600 rounded-full text-white text-xs font-semibold shadow-[0_2px_8px_rgba(255,140,0,.3)] hover:shadow-[0_4px_14px_rgba(255,140,0,.4)] hover:-translate-y-px transition-all"
          >
            <RefreshCw size={12} className={spinning ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}