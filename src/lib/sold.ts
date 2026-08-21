const SOLD_RE = /\b(sold|not\s+available|no\s+longer\s+available|gone|deal\s+done|deal\s+closed|item\s+sold|already\s+sold)\b/i;

export function detectSold(title: string, body: string, flair?: string): boolean {
  return SOLD_RE.test(`${title} ${body} ${flair ?? ''}`);
}

export function parseBulkItems(text: string): string[] {
  if (!text || text.length < 40) return [];
  const lines = text
    .split(/[\n,;|•]+/)
    .map((l) => l.trim().replace(/^[-*\d.]+\s*/, ''))
    .filter((l) => l.length > 3 && l.length < 100);
  return lines.length >= 2 ? lines.slice(0, 20) : [];
}