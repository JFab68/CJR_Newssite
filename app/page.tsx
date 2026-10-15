import Link from "next/link";
import { getAllStories, oversightWatch, filterBy } from "@/lib/news";
import { LEVELS, SECTIONS, Level, Section } from "@/lib/feeds";
import StoryList, { StoryCard } from "@/components/StoryList";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import { COUNTIES, homeSlots } from "@/lib/counties";

export const revalidate = 3600;

export default async function Home() {
  const all = await getAllStories();
  const watch = oversightWatch(all);
  const watchIds = new Set(watch.map((s) => s.id));
  const notWatch = all.filter((s) => !watchIds.has(s.id));
  const rest = notWatch.filter((s) => !s.breaking);
  const breaking = notWatch.filter((s) => s.breaking).slice(0, 9);
  // Each county gets story slots proportional to its 2020 population (min 1–2).
  const countyCards = COUNTIES.map((c) => {
    const pool = filterBy(notWatch, { county: c.slug });
    const nonBreaking = pool.filter((s) => !s.breaking);
    return { c, n: homeSlots(c), stories: [...nonBreaking, ...pool.filter((s) => s.breaking)].slice(0, homeSlots(c)) };
  });
  return (
    <>
      <section className="watch-band" aria-labelledby="ow">
        <h2 id="ow" className="band-h">Oversight Watch <small>Stories that show why oversight and transparency matter</small></h2>
        {watch.length ? (
          <div className="watch-grid">
            {watch[0] && <div className="lead"><StoryCard s={watch[0]} /></div>}
            <div className="watch-rest">{watch.slice(1).map((s) => <StoryCard key={s.id} s={s} compact />)}</div>
          </div>
        ) : <p className="empty">Today’s featured oversight stories are loading — check back shortly.</p>}
      </section>

      <div className="layout">
        <div>
          <div className="levels">
            {(Object.keys(LEVELS) as Level[]).map((l) => (
              <section key={l} className="col" aria-labelledby={`l-${l}`}>
                <h2 id={`l-${l}`} className="sec-h"><Link href={`/level/${l}`}>{LEVELS[l].name}</Link> <small>{LEVELS[l].blurb}</small></h2>
                <StoryList stories={filterBy(rest, { level: l }).slice(0, 7)} ads={false} compact />
                <Link className="more" href={`/level/${l}`}>More {LEVELS[l].name.toLowerCase()} news →</Link>
              </section>
            ))}
          </div>
          <AdSlot variant="infeed" />
          <section className="section-block" aria-labelledby="counties-h">
            <h2 id="counties-h" className="sec-h"><Link href="/county">Arizona Counties</Link> <small>All 15 counties, space proportional to population (2020 Census)</small></h2>
            <div className="county-grid">
              {countyCards.map(({ c, n, stories }) => (
                <section key={c.slug} className={`county-card ${n >= 15 ? "xl" : n >= 4 ? "lg" : ""}`} aria-labelledby={`c-${c.slug}`}>
                  <h3 id={`c-${c.slug}`} className="county-h"><Link href={`/county/${c.slug}`}>{c.name}</Link> <small>{c.seat} · pop. {c.pop2020.toLocaleString("en-US")}</small></h3>
                  {stories.length ? <ul className="plain county-list">{stories.map((s) => <li key={s.id}><a href={s.link} target="_blank" rel="noopener noreferrer">{s.title}</a> <span className="meta">{s.source}</span></li>)}</ul>
                    : <p className="empty">No recent stories.</p>}
                  <Link className="more" href={`/county/${c.slug}`}>{c.name} County →</Link>
                </section>
              ))}
            </div>
          </section>
          <section className="section-block" aria-labelledby="breaking-h">
            <h2 id="breaking-h" className="sec-h"><Link href="/breaking">Breaking & General News</Link> <small>Incidents, arrests, missing persons and crime reports</small></h2>
            <div className="grid3">{breaking.map((s) => <StoryCard key={s.id} s={s} compact />)}</div>
            {breaking.length === 0 && <p className="empty">No recent incident reports.</p>}
            <Link className="more" href="/breaking">All breaking & general news →</Link>
          </section>
          <AdSlot variant="infeed" index={1} />
          {(Object.keys(SECTIONS) as Section[]).map((k) => (
            <section key={k} className="section-block" aria-labelledby={`s-${k}`}>
              <h2 id={`s-${k}`} className="sec-h"><Link href={`/section/${k}`}>{SECTIONS[k].name}</Link> <small>{SECTIONS[k].blurb}</small></h2>
              <div className="grid3">{filterBy(rest, { section: k }).slice(0, 6).map((s) => <StoryCard key={s.id} s={s} />)}</div>
              {filterBy(rest, { section: k }).length === 0 && <p className="empty">No recent stories in this section.</p>}
              <Link className="more" href={`/section/${k}`}>All {SECTIONS[k].name} →</Link>
            </section>
          ))}
        </div>
        <Sidebar />
      </div>
    </>
  );
}
