// Story images: RSS media first, then the article's og:image / twitter:image.
// Google News links are resolved to the publisher URL first. All lookups are
// cached (Next data cache, 30 days), time-limited, and concurrency-limited.
import { unstable_cache } from "next/cache";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
const mem = new Map<string, string>();

async function get(url: string, ms = 5000, init: RequestInit = {}): Promise<Response | null> {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { ...init, signal: ctrl.signal, headers: { "User-Agent": UA, ...(init.headers || {}) } }); }
  catch { return null; } finally { clearTimeout(t); }
}

const okImg = (u?: string | null) => !!u && /^https:\/\//.test(u) && !/\.svg(\?|$)|logo|favicon|placeholder|default[-_]?(image|share)|googleusercontent\.com\/[^/]*=s0-w\d{2}$/i.test(u);
const unent = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x2F;/gi, "/").replace(/&#47;/g, "/").replace(/&quot;/g, '"');

/** Image from an RSS/Atom item (media:content, media:thumbnail, enclosure, <img> in description). */
export function feedImage(it: any): string | undefined {
  const pick = (v: any): string | undefined => {
    if (!v) return; const arr = Array.isArray(v) ? v : [v];
    for (const x of arr) {
      const u = typeof x === "string" ? x : x?.["@_url"] ?? x?.["@_href"];
      const type = x?.["@_type"] ?? x?.["@_medium"] ?? "image";
      if (u && /image/.test(String(type)) && okImg(u)) return unent(String(u));
      const nested = pick(x?.["media:thumbnail"]) ?? pick(x?.["media:content"]); if (nested) return nested;
    }
  };
  const fromMedia = pick(it?.["media:content"]) ?? pick(it?.["media:thumbnail"]) ?? pick(it?.["media:group"]) ?? pick(it?.enclosure);
  if (fromMedia) return fromMedia.replace(/^http:/, "https:");
  const html = [it?.description, it?.["content:encoded"], it?.content, it?.summary].map((v) => typeof v === "string" ? v : v?.["#text"] ?? "").join(" ");
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m && okImg(unent(m[1])) ? unent(m[1]) : undefined;
}

/** Resolve a news.google.com/rss/articles/… link to the publisher's URL. */
export async function resolveGoogle(link: string): Promise<string | null> {
  const id = link.match(/news\.google\.com\/(?:rss\/)?articles\/([^?]+)/)?.[1];
  if (!id) return link;
  const page = await get(`https://news.google.com/articles/${id}?hl=en-US&gl=US&ceid=US:en`, 5000);
  const h = page && page.ok ? await page.text() : "";
  const sg = h.match(/data-n-a-sg="([^"]+)"/)?.[1], ts = h.match(/data-n-a-ts="([^"]+)"/)?.[1];
  if (!sg || !ts) return null;
  const req = [["Fbv4je", `["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"${id}",${ts},"${sg}"]`]];
  const r = await get("https://news.google.com/_/DotsSplashUi/data/batchexecute", 5000, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: "f.req=" + encodeURIComponent(JSON.stringify([req])),
  });
  try { const j = JSON.parse((await r!.text()).split("\n\n")[1]); return JSON.parse(j[0][2])[1] || null; } catch { return null; }
}

/** og:image / twitter:image of an article page. */
async function pageImage(url: string): Promise<string> {
  const r = await get(url, 5000);
  if (!r || !r.ok || !(r.headers.get("content-type") || "").includes("html")) return "";
  // only the <head> matters; cap the read
  const html = (await r.text()).slice(0, 300_000);
  const metas = html.match(/<meta[^>]+>/gi) ?? [];
  for (const key of ["og:image:secure_url", "og:image", "twitter:image", "twitter:image:src"]) {
    for (const m of metas) {
      if (!new RegExp(`(property|name)=["']${key}["']`, "i").test(m)) continue;
      let u = unent(m.match(/content=["']([^"']+)["']/i)?.[1] ?? "");
      if (u.startsWith("//")) u = "https:" + u;
      else if (u.startsWith("/")) u = new URL(u, url).toString();
      u = u.replace(/^http:/, "https:");
      if (okImg(u)) return u;
    }
  }
  return "";
}

async function lookup(link: string): Promise<string> {
  const url = link.includes("news.google.com") ? await resolveGoogle(link) : link;
  return url ? pageImage(url) : "";
}

const cachedLookup = unstable_cache(async (link: string) => lookup(link), ["story-image-v1"], { revalidate: 30 * 86400 });

/** Image for an article link (cached; "" when none). */
export async function articleImage(link: string, direct = false): Promise<string> {
  if (mem.has(link)) return mem.get(link)!;
  let v = "";
  try { v = direct ? await lookup(link) : await cachedLookup(link); } catch { try { v = await lookup(link); } catch { v = ""; } }
  mem.set(link, v); return v;
}

/** Fill `image` on items missing one: concurrency-limited, with an overall time budget. */
export async function enrichImages<T extends { image?: string }>(items: T[], linkOf: (t: T) => string,
  o: { max?: number; concurrency?: number; budgetMs?: number } = {}): Promise<T[]> {
  const { max = 120, concurrency = 10, budgetMs = 20000 } = o;
  const todo = items.filter((i) => !i.image).slice(0, max);
  const deadline = Date.now() + budgetMs; let next = 0;
  async function worker() {
    while (next < todo.length && Date.now() < deadline) {
      const it = todo[next++];
      const img = await Promise.race([articleImage(linkOf(it)), new Promise<string>((r) => setTimeout(() => r(""), Math.max(0, deadline - Date.now())))]);
      if (img) it.image = img;
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return items;
}
