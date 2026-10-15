/**
 * Backfill / grow the Agency Watch archives (data/archive/<agency>.json).
 * Uses Google News RSS with after:/before: date operators, per half-year window, per query variant.
 * Usage: npx tsx scripts/backfill-archive.ts [agencySlug] [--from=2015] [--to=2026] [--recent]
 *   --recent : only the last ~60 days (for the weekly GitHub Action)
 * Existing entries are kept forever; new ones are merged, deduped and sorted (newest first).
 */
import { XMLParser } from "fast-xml-parser";
import fs from "node:fs";
import path from "node:path";
import { AGENCIES, matchesAgency, ArchiveItem } from "../lib/agencies";

const args = process.argv.slice(2);
const only = args.find((a) => !a.startsWith("--"));
const from = Number(args.find((a) => a.startsWith("--from="))?.split("=")[1] ?? 2015);
const to = Number(args.find((a) => a.startsWith("--to="))?.split("=")[1] ?? new Date().getFullYear());
const recent = args.includes("--recent");
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", textNodeName: "#text" });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const t = (v: any): string => (v == null ? "" : typeof v === "object" ? String(v["#text"] ?? "") : String(v));
const clean = (s: string) => s.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "’").replace(/\s+/g, " ").trim();
export const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim().slice(0, 90);
const BAD_SOURCES = /(yahoo sports|espn|zillow|realtor|redfin|newsbreak)/i;

function windows(): [string, string][] {
  const out: [string, string][] = [];
  if (recent) { const a = new Date(Date.now() - 60 * 864e5), b = new Date(Date.now() + 864e5); return [[a.toISOString().slice(0, 10), b.toISOString().slice(0, 10)]]; }
  for (let y = from; y <= to; y++) for (const [m1, m2] of [["01-01", "04-01"], ["04-01", "07-01"], ["07-01", "10-01"], ["10-01", "12-31"]])
    out.push([`${y}-${m1}`, `${y}-${m2}`]);
  return out.filter(([a]) => new Date(a).getTime() < Date.now());
}

async function fetchQ(q: string): Promise<ArchiveItem[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const ctrl = new AbortController(); const tm = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; JusticeNowAZ-archive/1.0; +https://justicenowaz.org)" } });
      clearTimeout(tm);
      if (res.status === 429 || res.status >= 500) { await sleep(5000 * (attempt + 1)); continue; }
      if (!res.ok) return [];
      const x = parser.parse(await res.text());
      const raw = x?.rss?.channel?.item ?? [];
      const items: any[] = Array.isArray(raw) ? raw : [raw];
      return items.map((it) => {
        let title = clean(t(it.title)); let source = t(it.source);
        const m = title.match(/^(.*) - ([^-]+)$/); if (m) { title = m[1].trim(); source ||= m[2].trim(); }
        const d = new Date(t(it.pubDate));
        return { title, url: t(it.link), source, date: isNaN(d.getTime()) ? "" : d.toISOString(), snippet: "" };
      }).filter((i) => i.title && i.url && i.date);
    } catch { await sleep(2000); }
  }
  return [];
}

(async () => {
  for (const a of AGENCIES.filter((x) => !only || x.slug === only)) {
    const file = path.join(process.cwd(), "data/archive", `${a.slug}.json`);
    const existing: ArchiveItem[] = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
    const byId = new Map(existing.filter((i) => matchesAgency(a, i.title)).map((i) => [norm(i.title), i])); // re-apply classifier
    let added = 0;
    const jobs = a.backfillQueries.flatMap((q) => windows().map(([af, bf]) => `${q} after:${af} before:${bf}`));
    let done = 0;
    const worker = async () => {
      while (jobs.length) {
        const q = jobs.shift()!;
        for (const i of await fetchQ(q)) {
          const id = norm(i.title);
          if (byId.has(id) || BAD_SOURCES.test(i.source) || !matchesAgency(a, i.title)) continue;
          byId.set(id, i); added++;
        }
        if (++done % 50 === 0) console.log(`  ${a.slug}: ${done} queries, +${added}`);
        await sleep(300);
      }
    };
    await Promise.all(Array.from({ length: 4 }, worker));
    const all = [...byId.values()].sort((x, y) => y.date.localeCompare(x.date));
    fs.writeFileSync(file, JSON.stringify(all, null, 1) + "\n");
    console.log(`${a.slug}: +${added} → ${all.length} (${all.at(-1)?.date.slice(0, 10)} … ${all[0]?.date.slice(0, 10)})`);
  }
})();
