import Sidebar from "@/components/Sidebar";
export const metadata = { title: "About" };
export default function About() {
  return (
    <div className="layout">
      <article className="prose">
        <h1>About Justice Now AZ</h1>
        <p>Justice Now AZ is the news desk of a criminal justice reform organization focused on prison oversight and the criminal legal system as a whole — from police through prosecution, pretrial, probation, prisons, parole, and post-release life for returning citizens.</p>
        <h2>What we do</h2>
        <p>Every day we gather criminal legal system reporting from local newsrooms in Phoenix and Maricopa County, from across Arizona and the Southwest, and from national outlets. Stories are organized by level — Local, Regional, and National — and by subject.</p>
        <h2>The Seven Ps</h2>
        <p>Our subject sections follow the <strong>Seven Ps</strong> framework developed by Praxis Initiative, which traces the full path of the criminal legal system: <a href="/section/police">Police</a>, <a href="/section/prosecution">Prosecution</a>, <a href="/section/pretrial">Pretrial</a>, <a href="/section/probation">Probation</a>, <a href="/section/prisons">Prisons</a>, <a href="/section/parole">Parole</a>, and <a href="/section/post-release">Post-Release</a>. Prisons covers state prisons, county jails, and other correctional facilities where incarcerated people are held.</p>
        <h2>Our lens</h2>
        <p>We take a critical look at the systems that arrest, charge, confine, and supervise people. Our <strong>Oversight Watch</strong> highlights reporting that shows why independent oversight, accountability, and transparency are needed — deaths in custody, misconduct, audits, lawsuits, investigations, and the work of watchdogs and ombudsmen.</p>
        <h2>How aggregation works</h2>
        <p>Headlines are collected automatically from public news feeds and refreshed throughout the day. We show the headline, source, date, and a brief excerpt, and link directly to the original publisher. All reporting belongs to the publishers who produced it. Our own analysis appears in <a href="/commentary">Commentary</a>.</p>
      </article>
      <Sidebar />
    </div>
  );
}
