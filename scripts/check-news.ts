import { getAllStories } from "../lib/news";
import { LEVELS, SECTIONS, Level, Section } from "../lib/feeds";
import { COUNTIES, homeSlots } from "../lib/counties";
(async () => {
  const s = await getAllStories();
  console.log("TOTAL", s.length);
  for (const l of Object.keys(LEVELS) as Level[]) console.log("level", l, s.filter(x => x.level === l).length);
  for (const k of Object.keys(SECTIONS) as Section[]) console.log("section", k, s.filter(x => x.sections.includes(k)).length);
  console.log("breaking", s.filter(x => x.breaking).length);
  for (const c of COUNTIES) console.log("county", c.slug.padEnd(11), String(s.filter(x => x.counties.includes(c.slug)).length).padStart(4), "home-slots", homeSlots(c), "pop2020", c.pop2020);
  if (process.env.DUMP) require("fs").writeFileSync(process.env.DUMP, JSON.stringify(s, null, 1));
  if (process.env.TITLES) for (const x of s) console.log(`[${x.level}]${x.breaking ? "[B]" : ""}[${x.counties.join(",")}] ${x.title} — ${x.source}`);
})();
