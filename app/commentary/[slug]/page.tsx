import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/blog";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import { fmtDate } from "@/components/StoryList";

export const dynamicParams = false;
export const generateStaticParams = () => getPosts().map((p) => ({ slug: p.slug }));
export const generateMetadata = ({ params }: { params: { slug: string } }) => ({ title: getPost(params.slug)?.title });

export default function PostPage({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  if (!p) notFound();
  return (
    <div className="layout">
      <article className="prose">
        {p.placeholder && <p className="notice">This is a placeholder post and will be replaced with original commentary.</p>}
        <h1>{p.title}</h1>
        <p className="meta">By {p.author} · {fmtDate(p.date + "T12:00:00Z")}</p>
        <div dangerouslySetInnerHTML={{ __html: p.html }} />
        <AdSlot variant="infeed" />
      </article>
      <Sidebar />
    </div>
  );
}
