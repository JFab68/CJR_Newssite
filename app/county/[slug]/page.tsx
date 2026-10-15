import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllStories, filterBy, oversightWatch } from "@/lib/news";
import { COUNTIES, countyBySlug, AZ_POP_2020 } from "@/lib/counties";
import StoryList from "@/components/StoryList";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";

export const revalidate = 3600;
export const generateStaticParams = () => COUNTIES.map((c) => ({ slug: c.slug }));
export const generateMetadata = ({ params }: { params: { slug: string } }) => ({ title: `${countyBySlug(params.slug)?.name ?? ""} County` });

export default async function CountyPage({ params }: { params: { slug: string } }) {
  const c = countyBySlug(params.slug);
  if (!c) notFound();
  const stories = filterBy(await getAllStories(), { county: c.slug });
  const watch = oversightWatch(stories, 4);
  const watchIds = new Set(watch.map((s) => s.id));
  const accountability = stories.filter((s) => !s.breaking && !watchIds.has(s.id));
  const breaking = stories.filter((s) => s.breaking);
  const share = ((c.pop2020 / AZ_POP_2020) * 100).toFixed(c.pop2020 / AZ_POP_2020 < 0.01 ? 2 : 1);
  return (
    <div className="layout">
      <div>
        <header className="page-h"><h1>{c.name} County</h1>
          <p>County seat: {c.seat} · Population {c.pop2020.toLocaleString("en-US")} (2020 Census) · {share}% of Arizona</p>
          <p className="chips">{COUNTIES.map((o) => <Link key={o.slug} href={`/county/${o.slug}`} aria-current={o.slug === c.slug ? "page" : undefined}>{o.name}</Link>)}</p>
        </header>
        {stories.length === 0 && <section className="section-block empty-county"><p><strong>No recent stories — check back soon.</strong> We're watching local outlets for {c.name} County's courts, jails and law enforcement.</p>
          {c.resources?.length ? <p>Official sources: {c.resources.map((r, i) => <span key={r.url}>{i ? " · " : ""}<a href={r.url} target="_blank" rel="noopener noreferrer">{r.label}</a></span>)}</p> : null}</section>}
        {watch.length > 0 && <section className="watch-band small"><h2 className="band-h">Oversight Watch</h2><StoryList stories={watch} ads={false} compact /></section>}
        <section className="section-block"><h2 className="sec-h">Courts, Jails & Accountability <small>Sheriff, county attorney, superior court, jail and probation</small></h2>
          <StoryList stories={accountability.slice(0, 40)} empty={`No recent ${c.name} County justice stories — check back soon.`} /></section>
        <AdSlot variant="infeed" index={900} />
        <section className="section-block"><h2 className="sec-h">Breaking & General News <small>Incidents, arrests and crime reports</small></h2>
          <StoryList stories={breaking.slice(0, 30)} empty="No recent incident reports." /></section>
      </div>
      <Sidebar />
    </div>
  );
}
