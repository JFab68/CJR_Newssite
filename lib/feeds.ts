export type Level = "local" | "regional" | "national";
export type Section = "policing" | "courts" | "prisons" | "probation-parole" | "reentry" | "oversight";

export const LEVELS: Record<Level, { name: string; blurb: string }> = {
  local: { name: "Local", blurb: "Phoenix & Maricopa County" },
  regional: { name: "Regional", blurb: "Arizona & the Southwest" },
  national: { name: "National", blurb: "Across the United States" },
};

export const SECTIONS: Record<Section, { name: string; blurb: string; terms: string[] }> = {
  policing: { name: "Policing", blurb: "Police conduct, use of force, and accountability", terms: ["police", "officer", "sheriff", "deputy", "use of force", "shooting", "arrest", "dps", "mcso", "phoenix police"] },
  courts: { name: "Prosecution & Courts", blurb: "Prosecutors, judges, sentencing, and the courts", terms: ["prosecutor", "county attorney", "district attorney", "court", "judge", "sentenc", "trial", "plea", "indict", "public defender", "bail"] },
  prisons: { name: "Jails & Prisons", blurb: "ADCRR, county jails, and correctional facilities", terms: ["prison", "jail", "inmate", "incarcerat", "correction", "adcrr", "detention", "lower buckeye jail", "4th avenue jail", "solitary", "custody"] },
  "probation-parole": { name: "Probation & Parole", blurb: "Community supervision and release decisions", terms: ["probation", "parole", "clemency", "supervision", "early release", "board of executive clemency"] },
  reentry: { name: "Post-conviction & Reentry", blurb: "Exonerations, release, and returning to society", terms: ["reentry", "re-entry", "exonerat", "wrongful conviction", "post-conviction", "expunge", "set aside", "record sealing", "formerly incarcerated", "released"] },
  oversight: { name: "Oversight & Transparency", blurb: "Watchdogs, audits, investigations, and public records", terms: ["oversight", "ombudsman", "audit", "transparency", "watchdog", "inspector general", "investigation", "public records", "monitor", "accountability"] },
};

import { COUNTIES } from "./counties";

export type Feed = { name: string; url: string; level: Level; section?: Section; county?: string };

const g = (q: string, window = "7d") =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q + " when:" + window)}&hl=en-US&gl=US&ceid=US:en`;

const CJ_Q = "(police OR sheriff OR court OR prison OR jail OR prosecutor OR arrested OR charged OR judge OR probation OR parole)";
const CJ_POLICY = "(prison OR corrections OR ADCRR OR police OR sheriff OR court OR sentencing OR prosecutor OR \"criminal justice\" OR jail OR parole)";
const site = (host: string, window = "7d", terms = CJ_Q) => g(`site:${host} ${terms}`, window);

// Add or remove feeds here. `section` is optional: when omitted, stories are
// sorted into sections automatically by keyword matching.
export const FEEDS: Feed[] = [
  // ---- Local: Phoenix / Maricopa County
  { name: "Google News", url: g('"Phoenix police" OR "Maricopa County Sheriff" OR "Maricopa County sheriff\'s office"'), level: "local", section: "policing" },
  { name: "Google News", url: g('"Maricopa County Attorney" OR "Maricopa County Superior Court"'), level: "local", section: "courts" },
  { name: "Google News", url: g('"Maricopa County jail" OR "Lower Buckeye jail" OR "4th Avenue Jail"'), level: "local", section: "prisons" },
  { name: "Google News", url: g('Phoenix probation OR parole Maricopa'), level: "local", section: "probation-parole" },
  { name: "Google News", url: g('Phoenix reentry OR "formerly incarcerated" OR exonerated Maricopa'), level: "local", section: "reentry" },
  { name: "Google News", url: g('Phoenix police oversight OR "Office of Accountability and Transparency" OR "DOJ" Maricopa'), level: "local", section: "oversight" },
  { name: "Phoenix New Times", url: "https://www.phoenixnewtimes.com/phoenix/Rss.xml?section=11080373", level: "local" },
  { name: "KJZZ", url: "https://kjzz.org/rss.xml", level: "local" },

  // ---- Regional: Arizona & Southwest
  { name: "Google News", url: g('Arizona "Department of Corrections" OR ADCRR OR "Arizona prison"'), level: "regional", section: "prisons" },
  { name: "Google News", url: g('"Tucson police" OR "Mesa police" OR "Arizona DPS" OR "Pima County Sheriff" OR "Arizona police"'), level: "regional", section: "policing" },
  { name: "Google News", url: g('"Arizona Supreme Court" OR "Arizona Court of Appeals" criminal'), level: "regional", section: "courts" },
  { name: "Google News", url: g('Arizona "Board of Executive Clemency" OR Arizona parole OR probation'), level: "regional", section: "probation-parole" },
  { name: "Google News", url: g('Arizona reentry OR "wrongful conviction" OR "Arizona Justice Project"'), level: "regional", section: "reentry" },
  { name: "Google News", url: g('Arizona prison oversight OR "Parsons v. Shinn" OR "Jensen v. Thornell" OR ombudsman'), level: "regional", section: "oversight" },
  { name: "Google News", url: g('"New Mexico" OR Nevada OR Utah prison OR jail OR police accountability'), level: "regional" },
  { name: "Arizona Mirror", url: "https://azmirror.com/feed/", level: "regional" },

  // ---- Arizona outlets suggested by John (Oct 2026). Gannett/BLOX/WordPress
  // feeds block or rate-limit server fetches, so most use Google News site: queries.
  { name: "Arizona Daily Star", url: "https://tucson.com/search/?f=rss&t=article&c=news/local/crime&l=50", level: "regional" },
  { name: "The Arizona Republic", url: site("azcentral.com"), level: "local" },
  { name: "Arizona Daily Star", url: site("tucson.com"), level: "regional" },
  { name: "Arizona Daily Sun", url: site("azdailysun.com"), level: "regional" },
  { name: "East Valley Tribune", url: site("eastvalleytribune.com", "30d"), level: "local" },
  { name: "Prescott Daily Courier", url: site("dcourier.com", "30d"), level: "regional" },
  { name: "Yuma Sun", url: site("yumasun.com", "30d"), level: "regional" },
  { name: "Arizona Capitol Times", url: site("azcapitoltimes.com", "30d", CJ_POLICY), level: "regional" },
  { name: "KFYI 550 AM", url: site("kfyi.iheart.com"), level: "local" },
  { name: "KNST 790 AM", url: site("knst.iheart.com", "30d"), level: "regional" },

  // ---- National
  { name: "The Marshall Project", url: "https://www.themarshallproject.org/rss/recent.rss", level: "national" },
  { name: "The Appeal", url: "https://theappeal.org/feed/", level: "national" },
  { name: "Bolts", url: "https://boltsmag.org/feed/", level: "national" },
  { name: "Prison Policy Initiative", url: "https://www.prisonpolicy.org/feeds/all.atom", level: "national" },
  { name: "Google News", url: g('"police accountability" OR "police misconduct" OR "consent decree"'), level: "national", section: "policing" },
  { name: "Google News", url: g('prosecutor OR "district attorney" criminal justice reform'), level: "national", section: "courts" },
  { name: "Google News", url: g('"death in custody" OR "prison conditions" OR "jail deaths"'), level: "national", section: "prisons" },
  { name: "Google News", url: g('parole board OR probation reform'), level: "national", section: "probation-parole" },
  { name: "Google News", url: g('"reentry program" OR "prison reentry" OR exoneration OR "wrongful conviction"'), level: "national", section: "reentry" },
  { name: "Google News", url: g('prison oversight OR "inspector general" corrections OR "correctional ombudsman"'), level: "national", section: "oversight" },

  // ---- Per-county feeds (all 15 Arizona counties; see lib/counties.ts)
  ...COUNTIES.flatMap((c) => c.queries.map((q): Feed => ({ name: "Google News", // smaller counties publish less, so look back 30 days
    url: g(q, c.pop2020 < 200000 ? "30d" : "7d"), level: c.slug === "maricopa" ? "local" : "regional", county: c.slug }))),
];

// County-feed stories naming another state are dropped (e.g. Douglas, Ga.).
export const OTHER_STATE_TERMS: string[] = [
  "alabama", "alaska", "arkansas", "california", "colorado", "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky",
  "louisiana", "maine", "maryland", "massachusetts", "michigan", "minnesota", "mississippi", "missouri", "montana", "nebraska", "nevada", "new hampshire", "new jersey", "new mexico",
  "new york", "north carolina", "north dakota", "ohio", "oklahoma", "oregon", "pennsylvania", "rhode island", "south carolina", "south dakota", "tennessee", "texas", "utah",
  "vermont", "virginia", "washington", "wisconsin", "wyoming", "n.j.", "ga.", "calif.", "fla.", "wpg talk radio",
];

// "Breaking & General News": routine incidents, arrests, missing persons and
// crime reports. These are kept (never filtered) but shown in their own section
// and only reach Oversight Watch if they score on oversight keywords.
export const BREAKING_TERMS: string[] = [
  "missing", "seek", "seeking", "search for", "located", "found dead", "arrested", "arrest", "arrests", "suspect", "suspects", "shooting", "shot", "stabbing", "stabbed",
  "homicide", "murder", "killed", "dies", "dead", "death investigation", "crash", "collision", "robbery", "burglary", "carjacking", "assault", "kidnapping", "amber alert", "silver alert",
  "standoff", "pursuit", "chase", "barricade", "manhunt", "wanted", "fugitive", "booked", "charged", "identified", "investigating", "police say", "deputies say", "crime", "dui",
];

// Only stories that match at least one of these terms are kept from general
// (non-criminal-justice-specific) feeds like KJZZ or Arizona Mirror.
export const RELEVANCE_TERMS = Object.values(SECTIONS).flatMap((s) => s.terms).concat([
  "criminal", "justice", "crime", "convict", "felony", "death row", "execution",
]);

// Editorial scoring for "Oversight Watch". Weight = importance.
export const OVERSIGHT_KEYWORDS: Record<string, number> = {
  oversight: 3, accountability: 3, transparency: 3, "death in custody": 5, "died in custody": 5,
  "in-custody death": 5, misconduct: 3, audit: 2, lawsuit: 2, sued: 2, abuse: 3, investigation: 2,
  ombudsman: 4, "inspector general": 4, "excessive force": 4, "use of force": 2, "civil rights": 2,
  "public records": 3, "body camera": 2, "consent decree": 4, "wrongful": 2, settlement: 2,
  "solitary confinement": 3, "medical care": 2, neglect: 3, cover: 1, whistleblower: 4, monitor: 2,
};

// ---- Noise filtering -------------------------------------------------------

// Sources (Google News publisher name or link host) that are never relevant:
// real estate, sports, and non-US outlets.
export const BLOCKED_SOURCES: string[] = [
  "realtor.com", "zillow", "redfin", "trulia", "homes.com", "apartments.com", "movoto", "compass", "coldwell", "century 21", "re/max", "remax", "loopnet",
  "espn", "bleacher report", "cbs sports", "fox sports", "yahoo sports", "sports illustrated", "si.com", "the athletic", "arizona sports", "arizonasports",
  "pro football talk", "nba.com", "nfl.com", "mlb.com", "nhl.com", "azcardinals", "revenge of the birds", "bright side of the sun", "fansided", "sportskeeda", "on3", "247sports", "rivals",
  "times of india", "timesofindia", "hindustan times", "ndtv", "india today", "the hindu", "economic times", "news18", "firstpost", "dawn.com", "the express tribune",
  "bbc", "sabrangindia", "voicepk", "lawtext", "wion", "panow", "legal service india", "maktoob", "india.com", "haberler", "geo news", "the sunday guardian", "the guardian nigeria", "punch newspapers", "vanguard news", "vanguardngr", "abc.net.au", "sydney morning herald", "news.com.au", "stuff.co.nz", "nz herald", "ctv news", "global news", "toronto star",
  "daily mail", "the sun (uk)", "mirror.co.uk", "the independent", "sky news", "gulf news", "khaleej times", "arab news", "south china morning post", "straits times", "manila", "inquirer.net", "jamaica",
  "benzinga", "marketbeat", "globenewswire", "pr newswire", "business wire", "accesswire", "seeking alpha", "motley fool", "zacks", "tipranks",
];

// Titles/snippets containing any of these are dropped (sports, real estate,
// business/tech noise). Matched on word boundaries.
export const NEGATIVE_TERMS: string[] = [
  "for sale", "listing", "listings", "bedroom", "bedrooms", "bathroom", "sq ft", "sqft", "square feet", "acres", "home for", "open house", "mortgage", "realtor", "real estate", "zillow",
  "nfl", "nba", "mlb", "nhl", "wnba", "ncaa", "draft pick", "trade deadline", "traded", "free agent", "quarterback", "touchdown", "playoff", "playoffs", "cardinals", "suns", "diamondbacks", "coyotes", "mercury", "spring training", "box score", "fantasy football",
  "stock", "stocks", "shares", "earnings", "ipo", "nasdaq", "dividend", "startup", "smartphone", "iphone", "crypto", "bitcoin", "recipe", "horoscope", "weather forecast",
];

// General feeds (no fixed section) must contain at least one of these.
export const STRONG_CJ_TERMS: string[] = [
  "police", "officer", "sheriff", "deputy", "deputies", "arrest", "arrested", "prosecutor", "county attorney", "district attorney", "attorney general", "public defender",
  "court", "judge", "sentenc", "convict", "indict", "plea", "trial", "jury", "bail", "prison", "jail", "inmate", "incarcerat", "correction", "detention", "custody",
  "probation", "parole", "clemency", "reentry", "re-entry", "exonerat", "wrongful conviction", "post-conviction", "expunge", "death row", "execution", "criminal", "felony", "misdemeanor",
  "use of force", "misconduct", "cop", "cops", "murder", "doj", "department of justice", "civil rights", "policing", "crime", "homicide", "charged", "adcrr", "mcso", "kidnap", "assault", "accused", "stabbing", "shooting", "carjack", "robbery", "dui",
];

// Local stories must mention Phoenix-area / Arizona context.
export const LOCAL_CONTEXT_TERMS: string[] = [
  "phoenix", "maricopa", "arizona", "ariz.", "az", "mesa", "tempe", "scottsdale", "chandler", "glendale", "gilbert", "peoria", "surprise", "avondale", "goodyear", "buckeye",
  "tolleson", "el mirage", "fountain hills", "paradise valley", "queen creek", "laveen", "ahwatukee", "sun city", "valley", "adcrr", "dps", "lower buckeye jail", "4th avenue jail", "kjzz", "ktar", "azfamily", "sinema", "corona del sol", "abc15", "12news", "fox 10", "azcentral",
];

// Other states have "MCSO" agencies (Marion, Manatee, Monroe, Mecklenburg...).
export const LOCAL_EXCLUDE_TERMS: string[] = [
  "marion county", "manatee county", "monroe county", "mecklenburg", "macomb", "mclennan", "mclean county", "montgomery county", "martin county", "madison county", "mahoning", "florida", "north carolina", "michigan", "texas", "ohio", "oregon", "indiana", "costa mesa", "california", "los angeles",
];

// Titles naming these places are almost always non-US stories.
export const FOREIGN_TERMS: string[] = [
  "india", "indian", "delhi", "mumbai", "bihar", "haryana", "pakistan", "karachi", "lahore", "bangladesh", "nigeria", "lagos", "kenya", "ghana", "uganda", "dubai", "uae", "saudi",
  "uk", "britain", "england", "scotland", "london", "ireland", "australia", "new zealand", "canada", "ontario", "philippines", "manila", "malaysia", "singapore", "sri lanka", "nepal", "bjp", "tihar", "rcmp", "first nation", "cree nation",
];
