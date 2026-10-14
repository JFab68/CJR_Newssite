import Link from "next/link";
import AdSlot from "./AdSlot";
import { getPosts } from "@/lib/blog";
import { SECTIONS } from "@/lib/feeds";

export default function Sidebar() {
  const posts = getPosts().slice(0, 3);
  return (
    <aside className="sidebar">
      <AdSlot variant="sidebar" />
      <section className="box">
        <h2 className="box-h">Commentary</h2>
        <ul className="plain">{posts.map((p) => <li key={p.slug}><Link href={`/commentary/${p.slug}`}>{p.title}</Link></li>)}</ul>
      </section>
      <section className="box">
        <h2 className="box-h">Sections</h2>
        <ul className="plain">{Object.entries(SECTIONS).map(([k, v]) => <li key={k}><Link href={`/section/${k}`}>{v.name}</Link></li>)}</ul>
      </section>
      <AdSlot variant="sidebar" />
    </aside>
  );
}
