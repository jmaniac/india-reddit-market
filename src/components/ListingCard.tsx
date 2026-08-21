'use client';
import { ArrowUp, MessageSquare, ExternalLink } from 'lucide-react';
import { formatPrice } from '@/lib/price';
import { SUBS, CAT_COLORS } from '@/lib/subreddits';
import type { Listing } from '@/types';

function ago(ts: number): string {
  const d = Math.floor(Date.now() / 1000 - ts);
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  if (d < 86400 * 30) return `${Math.floor(d / 86400)}d ago`;
  return `${Math.floor(d / 86400 / 30)}mo ago`;
}

function PriceBadge({ listing }: { listing: Listing }) {
  if (listing.sold)
    return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-500/80 text-white">✕ SOLD</span>;
  if (listing.price != null)
    return <span className="text-[13px] font-bold text-acc-b">{formatPrice(listing.price)}</span>;
  return <span className="text-[10px] text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded-md">💬 Click to Ask</span>;
}

export function ListingCard({ listing, isList }: { listing: Listing; isList: boolean }) {
  const sub = SUBS.find((s) => s.id.toLowerCase() === listing.sub.toLowerCase());
  const catColor = sub ? CAT_COLORS[sub.cat] : CAT_COLORS.nat;
  const snippet = listing.body
    ? listing.body.replace(/\n/g, ' ').trim().slice(0, 120) + (listing.body.length > 120 ? '…' : '')
    : '';

  const handleClick = () => window.open(listing.url, '_blank', 'noopener,noreferrer');

  if (isList) {
    return (
      <article
        onClick={handleClick}
        className={`group flex gap-0 bg-card border border-white/7 rounded-2xl overflow-hidden cursor-pointer hover:bg-card-h hover:border-orange-400/40 hover:shadow-[0_6px_24px_rgba(0,0,0,.4),0_0_18px_rgba(255,140,0,.18)] transition-all animate-fade-up ${
          listing.sold ? 'opacity-60' : ''
        }`}
      >
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-[13px] font-semibold text-t1 leading-snug line-clamp-2 flex-1">{listing.title}</h3>
            <PriceBadge listing={listing} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catColor}`}>r/{listing.sub}</span>
            {listing.isBulk && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-400/10 text-purple-400 border border-purple-400/25">📦 Bulk</span>}
            {listing.isNew && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/25">🟢 New</span>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] text-tm">
              <span className="flex items-center gap-1"><ArrowUp size={10} />{listing.ups}</span>
              <span className="flex items-center gap-1"><MessageSquare size={10} />{listing.nc}</span>
              <span>{ago(listing.ts)} · u/{listing.author}</span>
            </div>
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[11px] font-semibold text-acc border border-orange-400/40 bg-orange-400/10 px-2 py-1 rounded-lg hover:bg-acc hover:text-white transition-colors"
            >
              View Post <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={handleClick}
      className={`group flex flex-col bg-card border border-white/7 rounded-2xl overflow-hidden cursor-pointer hover:bg-card-h hover:border-orange-400/40 hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(0,0,0,.4),0_0_18px_rgba(255,140,0,.18)] transition-all animate-fade-up ${
        listing.sold ? 'opacity-60' : ''
      }`}
    >
      {listing.sold && (
        <div className="absolute top-2.5 right-[-26px] bg-red-500 text-white text-[9px] font-black px-7 py-0.5 rotate-45 z-10 tracking-wider">SOLD</div>
      )}
      <div className="p-3.5 flex flex-col gap-2.5 flex-1">
        <div className="flex items-center justify-between gap-2">
          <PriceBadge listing={listing} />
          <div className="flex gap-1">
            {listing.isBulk && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-400/10 text-purple-400 border border-purple-400/25">📦 Bulk</span>}
            {listing.isNew && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/25">🟢 New</span>}
          </div>
        </div>
        <h3 className="text-[13px] font-semibold text-t1 leading-snug line-clamp-3">{listing.title}</h3>
        {snippet && (
          <p className="text-[11px] text-t2 leading-relaxed line-clamp-2">{snippet}</p>
        )}
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border self-start ${catColor}`}>r/{listing.sub}</span>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <div className="flex items-center gap-2.5 text-[11px] text-tm">
            <span className="flex items-center gap-0.5"><ArrowUp size={10} />{listing.ups}</span>
            <span className="flex items-center gap-0.5"><MessageSquare size={10} />{listing.nc}</span>
          </div>
          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[11px] font-semibold text-acc border border-orange-400/40 bg-orange-400/10 px-2 py-1 rounded-lg hover:bg-acc hover:text-white transition-colors"
          >
            View Post <ExternalLink size={10} />
          </a>
        </div>
        <div className="text-[10px] text-tm">{ago(listing.ts)} · u/{listing.author}</div>
      </div>
    </article>
  );
}