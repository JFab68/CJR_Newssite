import Sidebar from "@/components/Sidebar";
export const metadata = { title: "Advertise" };
export default function Advertise() {
  return (
    <div className="layout">
      <article className="prose">
        <h1>Advertise with Justice Now AZ</h1>
        <p>Reach readers who follow criminal justice, public safety, and civic accountability in Phoenix, across Arizona, and nationally.</p>
        <h2>Placements</h2>
        <ul><li>Leaderboard (728 × 90) — top of every page</li><li>Sidebar (300 × 250) — on every page</li><li>In-feed native — within story lists</li><li>Footer banner (970 × 90)</li></ul>
        <p>Advertising inquiries: contact details coming soon.</p>
      </article>
      <Sidebar />
    </div>
  );
}
