'use client';
import { LayoutGrid, List, RefreshCw } from 'lucide-react';
import { useFiltersStore } from '@/store/filtersStore';
import { ListingCard } from './ListingCard';
import type { Listing } from '@/types';

function Skeleton() {
  return (
    <div className="bg-card border border-white/7 rounded-2xl overflow-hidden animate-shimmer">
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-white/8 rounded-md w-1/3" />
        <div className="h-3.5 bg-white/8 rounded-md" />
        <div className="h-3.5 bg-white/8 rounded-md w-4/5" />
        <div className="h-3 bg-white/8 rounded-md w-1/4" />
      </div>
    </div>
  );
}

interface Props {
  listings: Listing[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function ListingsGrid({ listings, isLoading, isError, onRetry }: Props) {
  const { view, setView } = useFiltersStore();
  const isList = view === 'list';

  return (
    <main className="flex-1 p-4 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-t2">
          <strong className="text-t1">{listings.length}</strong> listing{listings.length !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setView('grid')}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              !isList ? 'bg-orange-400/15 border border-orange-400/40 text-acc' : 'bg-white/5 border border-white/10 text-tm'
            }`}
          >
            <LayoutGrid size={12} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              isList ? 'bg-orange-400/15 border border-orange-400/40 text-acc' : 'bg-white/5 border border-white/10 text-tm'
            }`}
          >
            <List size={12} />
          </button>
        </div>
      </div>

      {isLoading && listings.length === 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      )}

      {isError && !isLoading && listings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">⚠️</span>
          <h3 className="text-lg font-bold mb-2">Could not load listings</h3>
          <p className="text-sm text-t2 mb-5">Reddit may be unreachable.</p>
          <button onClick={onRetry} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-acc to-orange-600 rounded-full text-white text-sm font-semibold shadow-[0_2px_10px_rgba(255,140,0,.3)] hover:-translate-y-px transition-all">
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && listings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">🔍</span>
          <h3 className="text-lg font-bold mb-2">No listings found</h3>
          <p className="text-sm text-t2">Try a different search term or clear some filters.</p>
        </div>
      )}

      {listings.length > 0 && (
        <div className={isList ? 'flex flex-col gap-3' : 'grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5'}>
          {listings.map((listing, i) => (
            <div key={listing.id} style={{ animationDelay: `${Math.min(i * 25, 500)}ms` }}>
              <ListingCard listing={listing} isList={isList} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}