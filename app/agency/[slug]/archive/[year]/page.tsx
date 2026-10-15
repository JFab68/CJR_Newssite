import { notFound } from "next/navigation";
import { AGENCIES, agencyBySlug } from "@/lib/agencies";
import { getAgencyArchive, getArchive } from "@/lib/agencyNews";
import { AgencyHeader, ItemList, YearChips } from "@/components/AgencyParts";
import Sidebar from "@/components/Sidebar";

export const revalidate = 3600;
export const generateStaticParams = () => AGENCIES.flatMap((a) => [...new Set(getArchive(a.slug).map((i) => i.date.slice(0, 4)))].map((year) => ({ slug: a.slug, year })));
export function generateMetadata({ params }: { params: { slug: string; year: string } }) {
  const a = agencyBySlug(params.slug); return { title: a ? `${a.short} archive: ${params.year}` : "Agency Watch" };
}

export default async function AgencyArchiveYear({ params }: { params: { slug: string; year: string } }) {
  const a = agencyBySlug(params.slug); if (!a || !/^\d{4}$/.test(params.year)) notFound();
  const all = await getAgencyArchive(a);
  const items = all.filter((i) => i.date.startsWith(params.year));
  if (!items.length) notFound();
  return (
    <div className="layout">
      <div>
        <AgencyHeader a={a} tab="archive" />
        <h2 className="section-h">Archive: {params.year} <small>{items.length} stories</small></h2>
        <YearChips a={a} items={all} current={params.year} />
        <ItemList items={items} />
      </div>
      <Sidebar />
    </div>
  );
}
