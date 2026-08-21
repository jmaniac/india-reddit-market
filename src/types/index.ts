export interface SubredditConfig {
  id: string;
  cat: 'nat' | 'del' | 'blr' | 'mum' | 'city' | 'tec' | 'veh' | 'oth';
  ic: string;
}

export interface Listing {
  id: string;
  sub: string;
  title: string;
  body: string;
  author: string;
  price: number | null;
  isBulk: boolean;
  bulkItems: string[];
  sold: boolean;
  ups: number;
  nc: number;
  ts: number;
  url: string;
  isNew: boolean;
}

export type SortKey = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'ups' | 'cmts';
export type DateFilter = 'all' | 'today' | 'week' | 'month';
export type ViewMode = 'grid' | 'list';

export interface FilterState {
  query: string;
  priceMin: string;
  priceMax: string;
  dateFilter: DateFilter;
  sort: SortKey;
  hideSold: boolean;
  activeOnly: boolean;
  bulkOnly: boolean;
  pricedOnly: boolean;
  selectedSubs: Set<string>;
  view: ViewMode;
}

export interface RedditChild {
  data: RedditPost;
}

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  permalink: string;
  url: string;
  created_utc: number;
  ups: number;
  num_comments: number;
  link_flair_text?: string;
  thumbnail?: string;
  preview?: { images: { source: { url: string } }[] };
  media_metadata?: Record<string, { s?: { u?: string } }>;
}