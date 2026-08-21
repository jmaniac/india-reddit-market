'use client';
import { useFiltersStore } from '@/store/filtersStore';

export function PriceRange() {
  const { priceMin, priceMax, setPriceMin, setPriceMax, resetPrice } = useFiltersStore();
  const inp = 'w-full bg-white/5 border border-white/10 rounded-lg pl-5 pr-2 py-2 text-xs text-t1 outline-none focus:border-acc [appearance:textfield]';
  return (
    <div className="px-3 pb-3 border-b border-white/5">
      <div className="flex items-center justify-between py-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-tm">Price Range (INR)</p>
        <button onClick={resetPrice} className="text-[10px] text-acc font-semibold hover:underline">Reset</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-tm">INR</span>
          <input type="number" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className={inp} />
        </div>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-tm">INR</span>
          <input type="number" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className={inp} />
        </div>
      </div>
    </div>
  );
}