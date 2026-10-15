import { Fragment } from "react";
import type { Story } from "@/lib/news";
import { SECTIONS, LEVELS } from "@/lib/feeds";
import { COUNTIES } from "@/lib/counties";
import { adsConfig } from "@/lib/ads.config";
import AdSlot from "./AdSlot";
import Thumb from "./Thumb";

export function storyLabel(s: Story) {
  if (s.breaking) return "Breaking & General";
  return s.sections[0] ? SECTIONS[s.sections[0]].name : LEVELS[s.level].name;
}
export const storyTone = (s: Story): "navy" | "teal" | "brick" => s.score >= 4 ? "brick" : s.level === "national" ? "navy" : "teal";

export function fmtDate(iso: string) {
  const d = new Date(iso);
  if (d.getTime() === 0) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Phoenix" });
}

export function StoryCard({ s, compact = false, hero = false, photo = true }: { s: Story; compact?: boolean; hero?: boolean; photo?: boolean }) {
  const cls = `story${compact ? " compact" : ""}${hero ? " hero" : ""}${photo ? " has-thumb" : ""}`;
  return (
    <article className={cls}>
      {photo && <a href={s.link} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="thumb-link">
        <Thumb src={s.image} label={storyLabel(s)} tone={storyTone(s)} className={hero ? "thumb-hero" : compact ? "thumb-sq" : "thumb-wide"} priority={hero}
          sizes={hero ? "(max-width: 760px) 100vw, 800px" : compact ? "96px" : "(max-width: 760px) 100vw, 300px"} /></a>}
      <div className="story-body">
      <div className="kicker">
        <span className="lvl">{LEVELS[s.level].name}</span>
        {s.sections.slice(0, 2).map((k) => <span key={k} className={`tag tag-${k}`}>{SECTIONS[k].name}</span>)}
        {(s.counties ?? []).slice(0, 2).map((c) => { const co = COUNTIES.find((x) => x.slug === c); return co ? <span key={c} className="cbadge">{co.name} Co.</span> : null; })}
        {s.breaking && <span className="tag tag-breaking">Breaking & General</span>}
        {s.score >= 4 && <span className="watch">Oversight Watch</span>}
      </div>
      <h3><a href={s.link} target="_blank" rel="noopener noreferrer">{s.title}</a></h3>
      {!compact && s.snippet && <p className="snippet">{s.snippet}</p>}
      <p className="meta"><span className="src">{s.source}</span>{fmtDate(s.date) ? <> · <time dateTime={s.date}>{fmtDate(s.date)}</time></> : null}</p>
      </div>
    </article>
  );
}

export default function StoryList({ stories, ads = true, compact = false, hero = false, empty = "No stories right now — check back soon." }:
  { stories: Story[]; ads?: boolean; compact?: boolean; hero?: boolean; empty?: string }) {
  if (!stories.length) return <p className="empty">{empty}</p>;
  return (
    <div className="story-list">
      {stories.map((s, i) => (
        <Fragment key={s.id + i}>
          <StoryCard s={s} compact={hero && i === 0 ? false : compact} hero={hero && i === 0} />
          {ads && (i + 1) % adsConfig.infeedEvery === 0 && i < stories.length - 1 && <AdSlot variant="infeed" index={i} />}
        </Fragment>
      ))}
    </div>
  );
}
