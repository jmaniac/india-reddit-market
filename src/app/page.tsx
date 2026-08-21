'use client';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { StatsBar } from '@/components/StatsBar';
import { Sidebar } from '@/components/Sidebar';
import { ListingsGrid } from '@/components/ListingsGrid';
import { useListings } from '@/hooks/useListings';
import { useFilteredListings } from '@/hooks/useFilteredListings';
import { useFiltersStore } from '@/store/filtersStore';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { selectedSubs } = useFiltersStore();
  const queryClient = useQueryClient();

  const { listings, isLoading, isError, progress, countsBySub } = useListings();
  const filtered = useFilteredListings(listings);

  useEffect(() => {
    if (!isLoading && listings.length > 0) {
      setLastUpdated(new Date());
    }
  }, [isLoading, listings.length]);

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['listings'] });
  };

  return (
    <div className="min-h-screen bg-bg text-t1">
      <Header onMenuClick={() => setSidebarOpen((o) => !o)} />
      <StatsBar
        listings={listings}
        activeSubs={selectedSubs.size}
        isLoading={isLoading}
        progress={progress}
        lastUpdated={lastUpdated}
      />
      <div className="flex max-w-screen-2xl mx-auto">
        <Sidebar
          countsBySub={countsBySub}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <ListingsGrid
          listings={filtered}
          isLoading={isLoading}
          isError={isError}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
}
