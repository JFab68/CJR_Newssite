import Sidebar from "@/components/Sidebar";
import { ADVERTISE_EMAIL } from "@/lib/ads.config";
export const metadata = { title: "Advertise" };

const PLACEMENTS = [
  { name: "Leaderboard", size: "728 × 90 (320 × 50 on mobile)", where: "Top of every page, above the masthead" },
  { name: "Medium Rectangle", size: "300 × 250", where: "Sidebar on home, section, county, and agency pages" },
  { name: "In-Feed Native", size: "Fluid / native", where: "Within story lists, every few headlines" },
  { name: "Billboard Footer", size: "970 × 90 (responsive)", where: "Footer of every page" },
  { name: "Section Sponsorship", size: "Custom", where: "Exclusive sponsorship of one of the Seven Ps, a county, or an Agency Watch hub" },
];

export default function Advertise() {
  const mail = `mailto:${ADVERTISE_EMAIL}?subject=${encodeURIComponent("Advertising on Justice Now AZ")}`;
  return (
    <div className="layout">
      <article className="prose">
        <p className="eyebrow">Partner with us</p>
        <h1>Advertise with Justice Now AZ</h1>
        <p>Reach readers who follow criminal justice, public safety, and civic accountability in Phoenix, across Arizona&rsquo;s 15 counties, and nationally — attorneys, advocates, policymakers, journalists, and engaged residents.</p>
        <h2>Placements</h2>
        <div className="table-scroll">
          <table className="rate-card">
            <thead><tr><th scope="col">Placement</th><th scope="col">Size</th><th scope="col">Where it runs</th><th scope="col">Rate</th></tr></thead>
            <tbody>{PLACEMENTS.map((p) => <tr key={p.name}><th scope="row">{p.name}</th><td>{p.size}</td><td>{p.where}</td><td>Contact for rates</td></tr>)}</tbody>
          </table>
        </div>
        <h2>Standards</h2>
        <ul>
          <li>All ads are clearly labeled &ldquo;Advertisement&rdquo; and kept separate from news and commentary.</li>
          <li>Advertisers have no influence over which stories we aggregate or how we cover them.</li>
          <li>We reserve the right to decline any ad.</li>
        </ul>
        <p><a className="btn" href={mail}>Contact us for rates</a></p>
        <p className="meta">Or email <a href={mail}>{ADVERTISE_EMAIL}</a></p>
      </article>
      <Sidebar />
    </div>
  );
}
