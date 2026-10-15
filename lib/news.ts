import { XMLParser } from "fast-xml-parser";
import { FEEDS, Feed, Level, Section, SECTIONS, OVERSIGHT_KEYWORDS, BLOCKED_SOURCES, NEGATIVE_TERMS, STRONG_CJ_TERMS, LOCAL_CONTEXT_TERMS, LOCAL_EXCLUDE_TERMS, FOREIGN_TERMS, BREAKING_TERMS, OTHER_STATE_TERMS } from "./feeds";
import { COUNTIES } from "./counties";

export type Story = {
  id: string; title: string; link: string; source: string; date: string;
  snippet: string; level: Level; sections: Section[]; score: number;
  counties: string[]; breaking: boolean;
};



const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", textNodeName: "#text" });

function text(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return text(v[0]);
  if (typeof v === "object") { const o = v as Record<string, unknown>; return text(o["#text"] ?? o["@_href"] ?? ""); }
  return "";
}

function clean(html: string): string {
  return html.replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&#8217;|&rsquo;/g, "’")
    .replace(/&#8220;|&#8221;/g, '"').replace(/&#8211;|&#8212;/g, "–").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, "").replace(/\s+/g, " ").trim();
}

function truncate(s: string, n = 220) { return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s; }

function normTitle(t: string) { return t.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim().slice(0, 90); }

export function oversightScore(s: string): number {
  const t = s.toLowerCase();
  let score = 0;
  for (const [k, w] of Object.entries(OVERSIGHT_KEYWORDS)) if (t.includes(k)) score += w;
  return score;
}

const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
// Word-boundary matcher; a term ending in a letter stem (e.g. "sentenc") is matched as a prefix.
const PREFIX_STEMS = new Set(["sentenc", "incarcerat", "exonerat", "convict", "indict", "correction"]);
function matcher(terms: string[], prefix = false) {
  const re = new RegExp("(?:^|[^a-z0-9])(?:" + terms.map((t) => esc(t) + (prefix || PREFIX_STEMS.has(t) ? "" : "(?![a-z0-9])")).join("|") + ")", "i");
  return (s: string) => re.test(s);
}
const isNegative = matcher(NEGATIVE_TERMS);
const isStrongCJ = matcher(STRONG_CJ_TERMS, true) // prefix: "officer" also matches "officers";
const hasLocalContext = matcher(LOCAL_CONTEXT_TERMS);
const isForeign = matcher(FOREIGN_TERMS);
const hasOtherState = matcher(LOCAL_EXCLUDE_TERMS);
const isBreakingText = matcher(BREAKING_TERMS);
const namesOtherState = matcher(OTHER_STATE_TERMS);
const AZ_CONTEXT = /(?:^|[^a-z])(arizona|ariz\.?|az)(?![a-z])/i;
const countyMatchers = COUNTIES.map((c) => ({ slug: c.slug, strong: matcher(c.places), weak: c.weakPlaces?.length ? matcher(c.weakPlaces) : null }));
/** Assigns Arizona counties by place-name matching (ambiguous names need Arizona context). */
export function matchCounties(hay: string, fromCountyFeed?: string, azFeed = false): string[] {
  const out = new Set<string>();
  if (fromCountyFeed) out.add(fromCountyFeed);
  const az = azFeed || AZ_CONTEXT.test(hay);
  for (const m of countyMatchers) {
    if (m.strong(hay)) out.add(m.slug);
    else if (az && m.weak && m.weak(hay)) out.add(m.slug);
  }
  return [...out];
}
function isBlockedSource(source: string, link: string) {
  const s = source.toLowerCase();
  let host = ""; try { host = new URL(link).hostname.toLowerCase(); } catch {}
  return BLOCKED_SOURCES.some((b) => s.includes(b) || (b.includes(".") && host.includes(b)));
}

/** Returns a reason string if the story should be dropped, else null. */
export function rejectReason(st: { title: string; snippet: string; source: string; link: string; level: Level }, general: boolean, context = ""): string | null {
  const hay = `${st.title} ${st.snippet}`;
  if (isBlockedSource(st.source, st.link)) return "blocked-source";
  if (isNegative(st.title)) return "negative-term";
  if (isForeign(st.title)) return "non-us";
  if (general && !isStrongCJ(hay)) return "no-cj-term";
  if (st.level === "local") {
    if (!hasLocalContext(`${hay} ${st.source} ${context}`)) return "no-local-context";
    if (hasOtherState(hay) && !/phoenix|maricopa|arizona/i.test(hay)) return "other-state";
  }
  return null;
}

function classify(s: string): Section[] {
  const t = s.toLowerCase();
  return (Object.keys(SECTIONS) as Section[]).filter((k) => SECTIONS[k].terms.some((term) => t.includes(term)));
}

async function fetchFeed(feed: Feed): Promise<Story[]> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(feed.url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JusticeNowAZ/1.0; +https://justicenowaz.org)" },
      next: { revalidate: 3600 },
    });
    clearTimeout(timer);
    if (!res.ok) return [];
    const xml = parser.parse(await res.text());
    const rawItems = xml?.rss?.channel?.item ?? xml?.feed?.entry ?? xml?.["rdf:RDF"]?.item ?? [];
    const items: any[] = Array.isArray(rawItems) ? rawItems : [rawItems];
    const isGoogle = feed.url.includes("news.google.com");
    const general = !feed.section && !["The Marshall Project", "The Appeal", "Bolts", "Prison Policy Initiative"].includes(feed.name);
    const out: Story[] = [];
    for (const it of items.slice(0, 40)) {
      let title = clean(text(it.title));
      let link = text(it.link);
      if (!link && Array.isArray(it.link)) link = text(it.link.find((l: any) => l["@_rel"] !== "self") ?? it.link[0]);
      if (!title || !link) continue;
      let source = feed.name;
      if (isGoogle) {
        const src = text(it.source);
        const m = title.match(/^(.*) - ([^-]+)$/);
        if (m) { title = m[1].trim(); source = src && !src.startsWith("http") ? src : m[2].trim(); } else if (src) source = src;
      }
      const rawDesc = text(it.description ?? it.summary ?? it.content ?? it["content:encoded"]);
      const snippet = isGoogle ? "" : truncate(clean(rawDesc));
      const d = new Date(text(it.pubDate ?? it.published ?? it.updated ?? it["dc:date"]));
      const date = isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString();
      const hay = `${title} ${snippet}`;
      // KJZZ / Phoenix New Times are local outlets themselves, so their source counts as local context.
      const ctx = feed.section ? "" : feed.name;
      const why = rejectReason({ title, snippet, source, link, level: feed.level }, general, ctx);
      if (why) { if (process.env.NEWS_DEBUG) console.error(`DROP ${why}: [${feed.level}] ${title} — ${source}`); continue; }
      const sections = new Set(classify(hay));
      if (feed.section) sections.add(feed.section);
      const score = oversightScore(hay);
      if (score >= 3) sections.add("oversight");
      if (feed.county && namesOtherState(`${hay} ${source}`) && !AZ_CONTEXT.test(hay)) { if (process.env.NEWS_DEBUG) console.error(`DROP other-state (county feed): ${title}`); continue; }
      const counties = feed.level === "national" ? [] : matchCounties(`${hay} ${source}`, feed.county, !!feed.county || feed.level === "local");
      if (feed.level === "local" && !counties.length) counties.push("maricopa");
      // Routine incident reporting -> Breaking & General News (not filtered out).
      const breaking = feed.level !== "national" && score < 3 && isBreakingText(title);
      out.push({ id: normTitle(title), title, link, source, date, snippet, level: feed.level, sections: [...sections], score, counties, breaking });
    }
    return out;
  } catch {
    return []; // degrade gracefully: one bad feed never breaks the page
  }
}

let cache: { at: number; stories: Story[] } | null = null;

export async function getAllStories(): Promise<Story[]> {
  if (cache && Date.now() - cache.at < 10 * 60 * 1000) return cache.stories;
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const byId = new Map<string, Story>();
  const levelRank: Record<Level, number> = { local: 0, regional: 1, national: 2 };
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const s of r.value) {
      const prev = byId.get(s.id);
      if (!prev) { byId.set(s.id, s); continue; }
      // merge duplicates: keep most local level, union sections, best snippet
      prev.sections = [...new Set([...prev.sections, ...s.sections])];
      if (levelRank[s.level] < levelRank[prev.level]) prev.level = s.level;
      if (!prev.snippet && s.snippet) prev.snippet = s.snippet;
      prev.score = Math.max(prev.score, s.score);
      prev.counties = [...new Set([...prev.counties, ...s.counties])];
      prev.breaking = prev.breaking && s.breaking && prev.score < 3;
    }
  }
  const cutoff = Date.now() - 30 * 24 * 3600 * 1000;
  const stories = [...byId.values()]
    .filter((s) => new Date(s.date).getTime() > cutoff)
    .sort((a, b) => b.date.localeCompare(a.date));
  if (stories.length) cache = { at: Date.now(), stories };
  return stories;
}

export function oversightWatch(stories: Story[], n = 6) {
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  return stories.filter((s) => s.score >= 4 && new Date(s.date).getTime() > weekAgo)
    .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date)).slice(0, n);
}

export const filterBy = (stories: Story[], o: { level?: Level; section?: Section; county?: string; breaking?: boolean }) =>
  stories.filter((s) => (!o.level || s.level === o.level) && (!o.section || s.sections.includes(o.section))
    && (!o.county || s.counties.includes(o.county)) && (o.breaking === undefined || s.breaking === o.breaking));
