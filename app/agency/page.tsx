import Link from "next/link";
import { AGENCIES } from "@/lib/agencies";
import { getArchive, getHistory } from "@/lib/agencyNews";
import Sidebar from "@/components/Sidebar";

export const metadata = { title: "Agency Watch" };

export default function AgencyIndex() {
  return (
    <div className="layout">
      <div>
        <header className="page-h"><h1>Agency Watch</h1><p>Dedicated coverage of the Arizona agencies that most need independent oversight: live news, a permanent archive, and a sourced history of each.</p></header>
        <div className="agency-grid">
          {AGENCIES.map((a) => (
            <article key={a.slug} className="agency-card">
              <h2><Link href={`/agency/${a.slug}`}>{a.short}</Link></h2>
              <p className="agency-full">{a.name}</p><p>{a.blurb}</p>
              <p className="meta">{getArchive(a.slug).length.toLocaleString("en-US")} archived stories · {getHistory(a.slug).length} timeline entries</p>
            </article>
          ))}
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
