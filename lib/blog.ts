import fs from "fs";
import path from "path";
import { marked } from "marked";

export type Post = { slug: string; title: string; date: string; author: string; summary: string; placeholder: boolean; html: string };
const dir = path.join(process.cwd(), "content/blog");

function parse(file: string): Post {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  (m?.[1] ?? "").split("\n").forEach((l) => { const i = l.indexOf(":"); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, ""); });
  return {
    slug: file.replace(/\.md$/, ""), title: meta.title ?? file, date: meta.date ?? "", author: meta.author ?? "Justice Now AZ",
    summary: meta.summary ?? "", placeholder: meta.placeholder === "true", html: marked.parse(m?.[2] ?? raw) as string,
  };
}

export function getPosts(): Post[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map(parse).sort((a, b) => b.date.localeCompare(a.date));
}
export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);
