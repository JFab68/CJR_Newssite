import { notFound } from "next/navigation";
import { getAllStories, filterBy } from "@/lib/news";
import { LEVELS, SECTIONS, Level, Section } from "@/lib/feeds";
import StoryList from "@/components/StoryList";
import Sidebar from "@/components/Sidebar";

export const revalidate = 3600;
export const generateStaticParams = () => Object.keys(SECTIONS).map((section) => ({ section }));
export const generateMetadata = ({ params }: { params: { section: string } }) => ({ title: SECTIONS[params.section as Section]?.name ?? "" });

export default async function SectionPage({ params }: { params: { section: string } }) {
  const section = params.section as Section;
  if (!SECTIONS[section]) notFound();
  const stories = filterBy(await getAllStories(), { section });
  return (
    <div className="layout">
      <div>
        <header className="page-h"><h1>{SECTIONS[section].name}</h1><p>{SECTIONS[section].blurb}</p></header>
        {(Object.keys(LEVELS) as Level[]).map((l) => (
          <section key={l} className="section-block" aria-labelledby={`h-${l}`}>
            <h2 id={`h-${l}`} className="sec-h">{LEVELS[l].name} <small>{LEVELS[l].blurb}</small></h2>
            <StoryList stories={filterBy(stories, { level: l }).slice(0, 25)} />
          </section>
        ))}
      </div>
      <Sidebar />
    </div>
  );
}
