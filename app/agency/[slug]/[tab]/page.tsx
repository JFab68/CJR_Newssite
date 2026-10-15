import { notFound } from "next/navigation";
import { AGENCIES, agencyBySlug } from "@/lib/agencies";
import { getAgencyArchive, getHistory } from "@/lib/agencyNews";
import { AgencyHeader, YearChips, ItemList, Timeline, agencyTabs } from "@/components/AgencyParts";
import Sidebar from "@/components/Sidebar";

export const revalidate = 3600;
export const dynamicParams = false;
export const generateStaticParams = () => AGENCIES.flatMap((a) => agencyTabs(a).filter((t) => t.slug).map((t) => ({ slug: a.slug, tab: t.slug })));
export function generateMetadata({ params }: { params: { slug: string; tab: string } }) {
  const a = agencyBySlug(params.slug); const t = a && agencyTabs(a).find((x) => x.slug === params.tab);
  return { title: a && t ? `${a.short}: ${t.name}` : "Agency Watch" };
}

export default async function AgencyTab({ params }: { params: { slug: string; tab: string } }) {
  const a = agencyBySlug(params.slug); if (!a) notFound();
  let body: React.ReactNode;
  if (params.tab === "history") {
    const h = getHistory(a.slug);
    body = <><h2 className="section-h">History &amp; Context</h2>
      <p className="tl-intro">Key events, each tied to a published source. Entries we could not verify are marked. Spot an error? <a href="/about">Tell us</a>.</p>
      <Timeline entries={h} /></>;
  } else if (params.tab === "archive") {
    const items = await getAgencyArchive(a);
    body = <><h2 className="section-h">Archive <small>{items.length.toLocaleString("en-US")} stories since {items.at(-1)?.date.slice(0, 4)} · never expires</small></h2>
      <p className="tl-intro">Browse by year:</p><YearChips a={a} items={items} />
      <h2 className="section-h">Most recent 100</h2><ItemList items={items.slice(0, 100)} /></>;
  } else if (a.topicTab && params.tab === a.topicTab.slug) {
    const tt = a.topicTab;
    const items = (await getAgencyArchive(a)).filter((i) => tt.match.some((r) => r.test(i.title)));
    const h = getHistory(a.slug).filter((e) => tt.match.some((r) => r.test(`${e.title} ${e.summary} ${e.tag ?? ""}`)) || (e.tag ?? "").toLowerCase().includes(tt.slug));
    body = <><p className="tl-intro">{tt.blurb}</p>
      <h2 className="section-h">Key moments</h2><Timeline entries={h} />
      <h2 className="section-h">Coverage <small>{items.length} stories</small></h2><ItemList items={items.slice(0, 300)} /></>;
  } else notFound();
  return (
    <div className="layout">
      <div><AgencyHeader a={a} tab={params.tab} />{body}</div>
      <Sidebar />
    </div>
  );
}
