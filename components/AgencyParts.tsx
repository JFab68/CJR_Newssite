import Link from "next/link";
import { Fragment } from "react";
import type { Agency, ArchiveItem, HistoryEntry } from "@/lib/agencies";
import { fmtDate } from "./StoryList";
import AdSlot from "./AdSlot";
import Thumb from "./Thumb";

export function agencyTabs(a: Agency) {
  const tabs = [{ slug: "", name: "Current" }];
  if (a.topicTab) tabs.push({ slug: a.topicTab.slug, name: a.topicTab.name });
  tabs.push({ slug: "archive", name: "Archive" }, { slug: "history", name: "History & Context" });
  return tabs;
}

export function AgencyHeader({ a, tab }: { a: Agency; tab: string }) {
  return (
    <header className="page-h">
      <p className="eyebrow"><Link href="/agency">Agency Watch</Link></p>
      <h1>{a.name}</h1><p>{a.blurb}</p>
      <nav className="chips tabs" aria-label={`${a.short} sections`}>
        {agencyTabs(a).map((t) => <Link key={t.slug} href={`/agency/${a.slug}${t.slug ? "/" + t.slug : ""}`} aria-current={t.slug === tab ? "page" : undefined}>{t.name}</Link>)}
      </nav>
    </header>
  );
}

/** Lead photo story + grid of photo cards for an agency hub. */
export function PhotoCards({ items, label }: { items: ArchiveItem[]; label: string }) {
  if (!items.length) return null;
  const [lead, ...rest] = items;
  const meta = (i: ArchiveItem) => <p className="meta"><span className="src">{i.source}</span>{fmtDate(i.date) ? <> · <time dateTime={i.date}>{fmtDate(i.date)}</time></> : null}</p>;
  return (
    <>
      <article className="story hero has-thumb lead-hero">
        <a href={lead.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="thumb-link"><Thumb src={lead.image} label={label} tone="navy" className="thumb-hero" priority sizes="(max-width: 760px) 100vw, 800px" /></a>
        <div className="story-body"><h3><a href={lead.url} target="_blank" rel="noopener noreferrer">{lead.title}</a></h3>{meta(lead)}</div>
      </article>
      {rest.length > 0 && <div className="photo-grid">{rest.map((i, n) => (
        <article key={i.url + n} className="story photo-card has-thumb">
          <a href={i.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="thumb-link"><Thumb src={i.image} label={label} tone={n % 2 ? "navy" : "teal"} className="thumb-wide" /></a>
          <div className="story-body"><h3><a href={i.url} target="_blank" rel="noopener noreferrer">{i.title}</a></h3>{meta(i)}</div>
        </article>))}</div>}
    </>
  );
}

export function ItemList({ items, empty = "No stories right now — check back soon." }: { items: ArchiveItem[]; empty?: string }) {
  if (!items.length) return empty ? <p className="empty">{empty}</p> : null;
  return (
    <ul className="agency-list">
      {items.map((i, n) => (
        <Fragment key={i.url + n}>
          <li className={i.image ? "with-img" : undefined}>{i.image ? <Thumb src={i.image} label="" className="thumb-sq" sizes="72px" /> : null}<a href={i.url} target="_blank" rel="noopener noreferrer">{i.title}</a>
            <span className="meta"><span className="src">{i.source}</span>{fmtDate(i.date) ? <> · <time dateTime={i.date}>{fmtDate(i.date)}</time></> : null}</span></li>
          {(n + 1) % 15 === 0 && n < items.length - 1 && <li className="ad-li"><AdSlot variant="infeed" index={n} /></li>}
        </Fragment>
      ))}
    </ul>
  );
}

export function YearChips({ a, items, current }: { a: Agency; items: ArchiveItem[]; current?: string }) {
  const counts = new Map<string, number>();
  for (const i of items) counts.set(i.date.slice(0, 4), (counts.get(i.date.slice(0, 4)) ?? 0) + 1);
  return <p className="chips">{[...counts.entries()].map(([y, n]) => <Link key={y} href={`/agency/${a.slug}/archive/${y}`} aria-current={y === current ? "page" : undefined}>{y} ({n})</Link>)}</p>;
}

export function ArchiveByYear({ items }: { items: ArchiveItem[] }) {
  const years = new Map<string, ArchiveItem[]>();
  for (const i of items) { const y = i.date.slice(0, 4); if (!years.has(y)) years.set(y, []); years.get(y)!.push(i); }
  if (!items.length) return <p className="empty">The archive is being built — check back soon.</p>;
  return (
    <>
      <p className="chips">{[...years.keys()].map((y) => <a key={y} href={`#y${y}`}>{y} ({years.get(y)!.length})</a>)}</p>
      {[...years.entries()].map(([y, list]) => (
        <section key={y} id={`y${y}`} className="year-block"><h2 className="section-h">{y}</h2><ItemList items={list} /></section>
      ))}
    </>
  );
}

function fmtHistDate(d: string) {
  if (d === "needs-confirmation") return "Needs confirmation";
  const [y, m, day] = d.split("-");
  if (!m) return y;
  const mo = new Date(Date.UTC(+y, +m - 1, 1)).toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
  return day ? `${mo} ${+day}, ${y}` : `${mo} ${y}`;
}

export function Timeline({ entries }: { entries: HistoryEntry[] }) {
  if (!entries.length) return <p className="empty">Timeline in progress.</p>;
  return (
    <ol className="timeline">
      {entries.map((e, i) => (
        <li key={i} className={e.date === "needs-confirmation" ? "unconfirmed" : undefined}>
          <div className="tl-date">{fmtHistDate(e.date)}{e.tag ? <span className="tl-tag">{e.tag}</span> : null}</div>
          <h3>{e.title}</h3><p>{e.summary}</p>
          {e.note ? <p className="tl-note">Note: {e.note}</p> : null}
          <p className="tl-src">Sources: {e.sources.map((s, j) => <Fragment key={j}>{j ? " · " : ""}<a href={s.url} {...(s.url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{s.label}</a></Fragment>)}</p>
        </li>
      ))}
    </ol>
  );
}
