'use client';
import type { Listing } from '@/types';

interface Props {
  listings: Listing[];
  activeSubs: number;
  isLoading: boolean;
  progress: number;
  lastUpdated: Date | null;
}

export function StatsBar({ listings, activeSubs, isLoading, progress, lastUpdated }: Props) {
  const sold = listings.filter((p) => p.sold).length;
  const priced = listings.filter((p) => p.price != null).length;

  return (
    <div className="bg-bg2 border-b border-white/5 px-4">
      <div className="max-w-screen-2xl mx-auto">
        {isLoading && (
          <div className="flex items-center gap-2 py-2 text-xs text-acc">
            <span className="w-3 h-3 rounded-full border-2 border-orange-400/30 border-t-acc animate-spin flex-shrink-0" />
            <span>Loading subreddits…</span>
            <div className="flex-1 h-1 bg-orange-400/10 rounded-full max-w-48">
              <div className="h-full bg-gradient-to-r from-acc to-acc-b rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 py-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-t2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <strong className="text-acc">{listings.length}</strong> listings
          </div>
          <div className="text-xs text-t2"><strong className="text-t1">{activeSubs}</strong> subs</div>
          <div className="text-xs text-t2"><strong className="text-green-400">{listings.length - sold}</strong> available</div>
          <div className="text-xs text-t2"><strong className="text-red-400">{sold}</strong> sold</div>
          <div className="text-xs text-t2"><strong className="text-acc">{priced}</strong> priced</div>
          {lastUpdated && (
            <div className="ml-auto text-[11px] text-tm italic">
              Updated {lastUpdated.toLocaleTimeString('en-IN')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}