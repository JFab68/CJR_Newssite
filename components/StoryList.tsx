import { Fragment } from "react";
import type { Story } from "@/lib/news";
import { SECTIONS, LEVELS } from "@/lib/feeds";
import { adsConfig } from "@/lib/ads.config";
import AdSlot from "./AdSlot";

export function fmtDate(iso: string) {
  const d = new Date(iso);
  if (d.getTime() === 0) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Phoenix" });
}

export function StoryCard({ s, compact = false }: { s: Story; compact?: boolean }) {
  return (
    <article className={`story${compact ? " compact" : ""}`}>
      <div className="kicker">
        <span className="lvl">{LEVELS[s.level].name}</span>
        {s.sections.slice(0, 2).map((k) => <span key={k}>{SECTIONS[k].name}</span>)}
        {s.breaking && <span>Breaking & General</span>}
        {s.score >= 4 && <span className="watch">Oversight Watch</span>}
      </div>
      <h3><a href={s.link} target="_blank" rel="noopener noreferrer">{s.title}</a></h3>
      {!compact && s.snippet && <p className="snippet">{s.snippet}</p>}
      <p className="meta"><span className="src">{s.source}</span>{fmtDate(s.date) ? <> · <time dateTime={s.date}>{fmtDate(s.date)}</time></> : null}</p>
    </article>
  );
}

export default function StoryList({ stories, ads = true, compact = false, empty = "No stories right now — check back soon." }:
  { stories: Story[]; ads?: boolean; compact?: boolean; empty?: string }) {
  if (!stories.length) return <p className="empty">{empty}</p>;
  return (
    <div className="story-list">
      {stories.map((s, i) => (
        <Fragment key={s.id + i}>
          <StoryCard s={s} compact={compact} />
          {ads && (i + 1) % adsConfig.infeedEvery === 0 && i < stories.length - 1 && <AdSlot variant="infeed" index={i} />}
        </Fragment>
      ))}
    </div>
  );
}
