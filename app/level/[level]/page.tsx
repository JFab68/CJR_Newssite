import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllStories, filterBy, oversightWatch } from "@/lib/news";
import { LEVELS, SECTIONS, Level, Section } from "@/lib/feeds";
import StoryList from "@/components/StoryList";
import Sidebar from "@/components/Sidebar";

export const revalidate = 3600;
export const generateStaticParams = () => Object.keys(LEVELS).map((level) => ({ level }));
export const generateMetadata = ({ params }: { params: { level: string } }) => ({ title: `${LEVELS[params.level as Level]?.name ?? ""} News` });

export default async function LevelPage({ params }: { params: { level: string } }) {
  const level = params.level as Level;
  if (!LEVELS[level]) notFound();
  const stories = filterBy(await getAllStories(), { level });
  const watch = oversightWatch(stories, 4);
  return (
    <div className="layout">
      <div>
        <header className="page-h"><h1>{LEVELS[level].name} News</h1><p>{LEVELS[level].blurb}</p>
          <p className="chips">{(Object.keys(SECTIONS) as Section[]).map((k) => <Link key={k} href={`/section/${k}`}>{SECTIONS[k].name}</Link>)}</p>
        </header>
        {watch.length > 0 && <section className="watch-band small"><h2 className="band-h">Oversight Watch</h2><StoryList stories={watch} ads={false} compact /></section>}
        <StoryList stories={stories.slice(0, 80)} hero />
      </div>
      <Sidebar />
    </div>
  );
}
