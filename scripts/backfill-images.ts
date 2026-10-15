/**
 * Add `image` (og:image / twitter:image, Google News links resolved) to the most recent
 * archive items in data/archive/*.json. Older items stay lazy (fallback tile).
 * Usage: npx tsx scripts/backfill-images.ts [--per=40]
 */
import fs from "node:fs";
import path from "node:path";
import { articleImage } from "../lib/images";

const per = Number(process.argv.find((a) => a.startsWith("--per="))?.split("=")[1] ?? 40);
const dir = path.join(process.cwd(), "data/archive");

async function main() {
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const p = path.join(dir, f);
    const items: any[] = JSON.parse(fs.readFileSync(p, "utf8"));
    const todo = [...items].sort((a, b) => b.date.localeCompare(a.date)).slice(0, per).filter((i) => i.image === undefined);
    let next = 0, found = 0;
    await Promise.all(Array.from({ length: 8 }, async () => {
      while (next < todo.length) {
        const it = todo[next++];
        const img = await articleImage(it.url, true);
        it.image = img; // "" = looked up, none found (don't retry every run)
        if (img) found++;
      }
    }));
    fs.writeFileSync(p, JSON.stringify(items, null, 1) + "\n");
    console.log(`${f}: ${found}/${todo.length} new images`);
  }
}
main();
