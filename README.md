# Justice Now AZ — Criminal Legal System News

A Next.js (App Router, TypeScript) news aggregator for criminal legal system reporting at three levels — **Local** (Phoenix/Maricopa), **Regional** (Arizona & Southwest), **National** — across six sections: Policing; Prosecution & Courts; Jails & Prisons; Probation & Parole; Post-conviction & Reentry; Oversight & Transparency. Deployed on Vercel (Hobby) at https://justicenowaz.org. No paid services or secrets.

## How it works
- `lib/feeds.ts` — levels, sections (with classification keywords), the feed list, and **Oversight Watch** keyword weights.
- `lib/news.ts` — fetches all feeds in parallel (8s timeout each, failures ignored), parses RSS/Atom, filters general feeds for relevance, classifies into sections, scores for oversight, dedupes by normalized headline, drops stories older than 30 days.
- Pages use ISR: `export const revalidate = 3600` (rebuilt at most hourly on request).
- Stories show title, source, date, short snippet, and link to the original. Full articles are never copied.

## Structure
```
app/                 page.tsx (home), level/[level], section/[section], commentary, commentary/[slug], about, advertise
components/          AdSlot, StoryList/StoryCard, Sidebar
content/blog/*.md    Commentary posts (front matter + markdown)
lib/                 feeds.ts, news.ts, blog.ts, ads.config.ts
```

## Add a feed
Add an entry to `FEEDS` in `lib/feeds.ts`:
```ts
{ name: "Outlet Name", url: "https://example.com/feed/", level: "regional", section: "prisons" } // section optional
```
For a Google News search use the `g('query')` helper (searches the last 7 days). Feeds without a `section` are auto-classified and filtered for criminal-justice relevance.

## Tune Oversight Watch
Edit `OVERSIGHT_KEYWORDS` (term → weight). Stories scoring ≥ 4 in the last 7 days are featured; ≥ 3 also appear in the Oversight & Transparency section.

## Write a commentary post
Create `content/blog/my-post.md`:
```md
---
title: My Post Title
date: 2026-10-20
author: Justice Now AZ
summary: One-sentence summary.
placeholder: false
---
Markdown body…
```
Commit and push; Vercel redeploys. Remove the two `placeholder: true` posts when real ones exist.

## Ads
`components/AdSlot.tsx` renders `leaderboard`, `sidebar`, `infeed`, and `footer` slots. With no publisher id they show labeled placeholders. To enable Google AdSense, set `publisherId` and slot ids in `lib/ads.config.ts`; `infeedEvery` controls in-feed frequency. Add `public/ads.txt` with your AdSense line when approved.

## Develop
```
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Deploying
Push to `main`; Vercel builds automatically. On the Hobby plan, commits must be authored by the Vercel account owner (JFab68).
