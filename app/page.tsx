import Link from "next/link";
import { getAllStories, oversightWatch, filterBy } from "@/lib/news";
import { LEVELS, SECTIONS, Level, Section } from "@/lib/feeds";
import StoryList, { StoryCard } from "@/components/StoryList";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";

export const revalidate = 3600;

export default async function Home() {
  const all = await getAllStories();
  const watch = oversightWatch(all);
  const watchIds = new Set(watch.map((s) => s.id));
  const rest = all.filter((s) => !watchIds.has(s.id));
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
