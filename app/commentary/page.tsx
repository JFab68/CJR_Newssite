import Link from "next/link";
import { getPosts } from "@/lib/blog";
import Sidebar from "@/components/Sidebar";
import { fmtDate } from "@/components/StoryList";

export const metadata = { title: "Commentary" };

export default function Commentary() {
  const posts = getPosts();
  return (
    <div className="layout">
      <div>
        <header className="page-h"><h1>Commentary</h1><p>Analysis and perspective from Justice Now AZ.</p></header>
        {posts.map((p) => (
          <article key={p.slug} className="story">
            <div className="kicker">{p.placeholder && <span className="watch">Placeholder</span>}<span>{p.author}</span></div>
            <h3><Link href={`/commentary/${p.slug}`}>{p.title}</Link></h3>
            <p className="snippet">{p.summary}</p>
            <p className="meta">{fmtDate(p.date + "T12:00:00Z")}</p>
          </article>
        ))}
      </div>
      <Sidebar />
    </div>
  );
}
