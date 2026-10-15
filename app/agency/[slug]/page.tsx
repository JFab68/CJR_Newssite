import { notFound } from "next/navigation";
import { AGENCIES, agencyBySlug } from "@/lib/agencies";
import { getAgencyLive } from "@/lib/agencyNews";
import { AgencyHeader, ItemList, PhotoCards } from "@/components/AgencyParts";
import Sidebar from "@/components/Sidebar";

export const revalidate = 3600;
export const generateStaticParams = () => AGENCIES.map((a) => ({ slug: a.slug }));
export function generateMetadata({ params }: { params: { slug: string } }) {
  const a = agencyBySlug(params.slug); return { title: a ? `${a.short} — Agency Watch` : "Agency Watch" };
}

export default async function AgencyCurrent({ params }: { params: { slug: string } }) {
  const a = agencyBySlug(params.slug); if (!a) notFound();
  const live = await getAgencyLive(a);
  return (
    <div className="layout">
      <div>
        <AgencyHeader a={a} tab="" />
        {a.slug === "adcrr" && <p className="tl-intro"><strong>Deep dive:</strong> <a href="/agency/adcrr/wassenaar">The Ricky Wassenaar case — from the 2004 Lewis tower standoff to the 2025 Tucson prison killings</a></p>}
        <h2 className="section-h">Current coverage <small>last 30 days · updated hourly</small></h2>
        <PhotoCards items={live.slice(0, 7)} label={a.short} />
        <ItemList items={live.slice(7)} empty={live.length ? "" : undefined} />
      </div>
      <Sidebar />
    </div>
  );
}
