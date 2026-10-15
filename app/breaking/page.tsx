import Link from "next/link";
import { getAllStories, filterBy } from "@/lib/news";
import { COUNTIES } from "@/lib/counties";
import StoryList from "@/components/StoryList";
import Sidebar from "@/components/Sidebar";

export const revalidate = 3600;
export const metadata = { title: "Breaking & General News" };

export default async function Breaking() {
  const stories = filterBy(await getAllStories(), { breaking: true });
  return (
    <div className="layout">
      <div>
        <header className="page-h"><h1>Breaking & General News</h1><p>Routine incidents, arrests, missing persons and crime reports from across Arizona</p>
          <p className="chips">{COUNTIES.map((c) => <Link key={c.slug} href={`/county/${c.slug}`}>{c.name}</Link>)}</p></header>
        <StoryList stories={stories.slice(0, 100)} hero />
      </div>
      <Sidebar />
    </div>
  );
}
