import Link from "next/link";
import { getAllStories, filterBy } from "@/lib/news";
import { COUNTIES, AZ_POP_2020 } from "@/lib/counties";
import Sidebar from "@/components/Sidebar";

export const revalidate = 3600;
export const metadata = { title: "Arizona Counties" };

export default async function Counties() {
  const all = await getAllStories();
  return (
    <div className="layout">
      <div>
        <header className="page-h"><h1>Arizona Counties</h1><p>The criminal legal system in each of Arizona’s 15 counties. Population: 2020 U.S. Census.</p></header>
        <table className="county-table"><thead><tr><th>County</th><th>Seat</th><th>Population</th><th>Share</th><th>Recent stories</th></tr></thead>
          <tbody>{COUNTIES.map((c) => (
            <tr key={c.slug}><td><Link href={`/county/${c.slug}`}>{c.name}</Link></td><td>{c.seat}</td><td>{c.pop2020.toLocaleString("en-US")}</td>
              <td>{((c.pop2020 / AZ_POP_2020) * 100).toFixed(1)}%</td><td>{filterBy(all, { county: c.slug }).length}</td></tr>))}</tbody></table>
      </div>
      <Sidebar />
    </div>
  );
}
