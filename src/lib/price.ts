export function parsePrice(text: string): number | null {
  if (!text) return null;
  const s = text.replace(/,/g, '');
  const patterns: [RegExp, number][] = [
    [/₹\s*(\d+(?:\.\d+)?)\s*(?:cr|crore)/gi, 1e7],
    [/₹\s*(\d+(?:\.\d+)?)\s*l(?:akh)?/gi, 1e5],
    [/₹\s*(\d+(?:\.\d+)?)\s*k/gi, 1e3],
    [/₹\s*(\d[\d.]*)/gi, 1],
    [/rs\.?\s*(\d+(?:\.\d+)?)\s*l/gi, 1e5],
    [/rs\.?\s*(\d+(?:\.\d+)?)\s*k/gi, 1e3],
    [/rs\.?\s*(\d[\d.]*)/gi, 1],
    [/inr\s*(\d+(?:\.\d+)?)\s*k/gi, 1e3],
    [/inr\s*(\d[\d.]*)/gi, 1],
    [/(\d[\d.]*)\s*k\s*(?:inr|rs|rupees?)/gi, 1e3],
    [/(\d[\d.]*)\s*(?:lakh|lac)\s*(?:inr|rs)?/gi, 1e5],
    [/(\d[\d.]*)\s*(?:inr|rupees?)/gi, 1],
    [/(\d+(?:\.\d+)?)\s*k/gi, 1e3],
  ];
  for (const [rx, m] of patterns) {
    rx.lastIndex = 0;
    const r = rx.exec(s);
    if (r) {
      const v = parseFloat(r[1]) * m;
      if (v >= 10 && v <= 1e8) return Math.round(v);
    }
  }
  return null;
}

export function formatPrice(p: number): string {
  if (p >= 1e7) return '₹' + (p / 1e7).toFixed(1) + 'Cr';
  if (p >= 1e5) return '₹' + (p / 1e5).toFixed(1) + 'L';
  if (p >= 1e3) return '₹' + (p % 1e3 === 0 ? p / 1e3 : (p / 1e3).toFixed(1)) + 'k';
  return '₹' + p;
}