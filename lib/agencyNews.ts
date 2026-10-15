import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import { Agency, ArchiveItem, HistoryEntry, matchesAgency } from "./agencies";
import type { Story } from "./news";
import { feedImage, enrichImages } from "./images";

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", textNodeName: "#text" });
const t = (v: any): string => (v == null ? "" : typeof v === "object" ? String(v["#text"] ?? "") : String(v));
const clean = (s: string) => s.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "’").replace(/\s+/g, " ").trim();
export const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim().slice(0, 90);

async function fetchQuery(q: string): Promise<ArchiveItem[]> {
  try {
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(q + " when:30d")}&hl=en-US&gl=US&ceid=US:en`,
      { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; JusticeNowAZ/1.0; +https://justicenowaz.org)" }, next: { revalidate: 3600 } });
    clearTimeout(timer);
    if (!res.ok) return [];
    const raw = parser.parse(await res.text())?.rss?.channel?.item ?? [];
    const items: any[] = Array.isArray(raw) ? raw : [raw];
    return items.map((it) => {
      let title = clean(t(it.title)); let source = t(it.source);
      const m = title.match(/^(.*) - ([^-]+)$/); if (m) { title = m[1].trim(); source ||= m[2].trim(); }
      const d = new Date(t(it.pubDate));
      return { title, url: t(it.link), source, date: isNaN(d.getTime()) ? "" : d.toISOString(), snippet: "", image: feedImage(it) };
    }).filter((i) => i.title && i.url && i.date);
  } catch { return []; }
}

/** Live feed: last 30 days, dedicated queries, filtered by the hub's classifier. */
export async function getAgencyLive(a: Agency): Promise<ArchiveItem[]> {
  const res = await Promise.all(a.queries.map(fetchQuery));
  const byId = new Map<string, ArchiveItem>();
  for (const i of res.flat()) if (matchesAgency(a, i.title) && !byId.has(norm(i.title))) byId.set(norm(i.title), i);
  const cutoff = Date.now() - 30 * 864e5;
  const out = [...byId.values()].filter((i) => new Date(i.date).getTime() > cutoff).sort((x, y) => y.date.localeCompare(x.date));
  await enrichImages(out, (i) => i.url, { max: 30, concurrency: 10, budgetMs: 15000 });
  return out;
}

function readJson<T>(p: string, dflt: T): T {
  const f = path.join(process.cwd(), p);
  try { return JSON.parse(fs.readFileSync(f, "utf8")) as T; } catch { return dflt; }
}
export const getArchive = (slug: string) => readJson<ArchiveItem[]>(`data/archive/${slug}.json`, []);
export const getHistory = (slug: string) => readJson<HistoryEntry[]>(`data/history/${slug}.json`, []);

/** Archive never expires: stored archive + whatever the live feed has picked up since the last backfill. */
export async function getAgencyArchive(a: Agency): Promise<ArchiveItem[]> {
  const byId = new Map(getArchive(a.slug).map((i) => [norm(i.title), i]));
  for (const i of await getAgencyLive(a)) if (!byId.has(norm(i.title))) byId.set(norm(i.title), i);
  return [...byId.values()].sort((x, y) => y.date.localeCompare(x.date));
}

export function toStory(i: ArchiveItem): Story {
  return { id: norm(i.title), title: i.title, link: i.url, source: i.source, date: i.date, snippet: i.snippet, image: i.image, level: "regional", sections: [], score: 0, counties: [], breaking: false };
}
