import { getAllStories } from "../lib/news";
import { LEVELS, SECTIONS, Level, Section } from "../lib/feeds";
(async () => {
  const s = await getAllStories();
  console.log("TOTAL", s.length);
  for (const l of Object.keys(LEVELS) as Level[]) console.log("level", l, s.filter(x => x.level === l).length);
  for (const k of Object.keys(SECTIONS) as Section[]) console.log("section", k, s.filter(x => x.sections.includes(k)).length);
  if (process.env.DUMP) require("fs").writeFileSync(process.env.DUMP, JSON.stringify(s, null, 1));
  if (process.env.TITLES) for (const x of s) console.log(`[${x.level}] ${x.title} — ${x.source}`);
})();
