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
  prisons: { name: "Jails & Prisons", blurb: "ADCRR, county jails, and correctional facilities", terms: ["prison", "jail", "inmate", "incarcerat", "correction", "adcrr", "detention", "lower buckeye", "4th avenue jail", "solitary", "custody"] },
  "probation-parole": { name: "Probation & Parole", blurb: "Community supervision and release decisions", terms: ["probation", "parole", "clemency", "supervision", "early release", "board of executive clemency"] },
  reentry: { name: "Post-conviction & Reentry", blurb: "Exonerations, release, and returning to society", terms: ["reentry", "re-entry", "exonerat", "wrongful conviction", "post-conviction", "expunge", "set aside", "record sealing", "formerly incarcerated", "released"] },
  oversight: { name: "Oversight & Transparency", blurb: "Watchdogs, audits, investigations, and public records", terms: ["oversight", "ombudsman", "audit", "transparency", "watchdog", "inspector general", "investigation", "public records", "monitor", "accountability"] },
};

export type Feed = { name: string; url: string; level: Level; section?: Section };

const g = (q: string) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q + " when:7d")}&hl=en-US&gl=US&ceid=US:en`;

// Add or remove feeds here. `section` is optional: when omitted, stories are
// sorted into sections automatically by keyword matching.
export const FEEDS: Feed[] = [
  // ---- Local: Phoenix / Maricopa County
  { name: "Google News", url: g('"Phoenix police" OR "Maricopa County Sheriff" OR MCSO'), level: "local", section: "policing" },
  { name: "Google News", url: g('"Maricopa County Attorney" OR "Maricopa County Superior Court"'), level: "local", section: "courts" },
  { name: "Google News", url: g('"Maricopa County jail" OR "Lower Buckeye" OR "4th Avenue Jail"'), level: "local", section: "prisons" },
  { name: "Google News", url: g('Phoenix probation OR parole Maricopa'), level: "local", section: "probation-parole" },
  { name: "Google News", url: g('Phoenix reentry OR "formerly incarcerated" OR exonerated Maricopa'), level: "local", section: "reentry" },
  { name: "Google News", url: g('Phoenix police oversight OR "Office of Accountability and Transparency" OR "DOJ" Maricopa'), level: "local", section: "oversight" },
  { name: "Phoenix New Times", url: "https://www.phoenixnewtimes.com/phoenix/Rss.xml?section=11080373", level: "local" },
  { name: "KJZZ", url: "https://kjzz.org/rss.xml", level: "local" },

  // ---- Regional: Arizona & Southwest
  { name: "Google News", url: g('Arizona "Department of Corrections" OR ADCRR OR "Arizona prison"'), level: "regional", section: "prisons" },
  { name: "Google News", url: g('Arizona police misconduct OR "use of force" OR Tucson police'), level: "regional", section: "policing" },
  { name: "Google News", url: g('"Arizona Supreme Court" OR "Arizona Court of Appeals" criminal'), level: "regional", section: "courts" },
  { name: "Google News", url: g('Arizona "Board of Executive Clemency" OR Arizona parole OR probation'), level: "regional", section: "probation-parole" },
  { name: "Google News", url: g('Arizona reentry OR "wrongful conviction" OR "Arizona Justice Project"'), level: "regional", section: "reentry" },
  { name: "Google News", url: g('Arizona prison oversight OR "Parsons v. Shinn" OR "Jensen v. Thornell" OR ombudsman'), level: "regional", section: "oversight" },
  { name: "Google News", url: g('"New Mexico" OR Nevada OR Utah prison OR jail OR police accountability'), level: "regional" },
  { name: "Arizona Mirror", url: "https://azmirror.com/feed/", level: "regional" },

  // ---- National
  { name: "The Marshall Project", url: "https://www.themarshallproject.org/rss/recent.rss", level: "national" },
  { name: "The Appeal", url: "https://theappeal.org/feed/", level: "national" },
  { name: "Bolts", url: "https://boltsmag.org/feed/", level: "national" },
  { name: "Prison Policy Initiative", url: "https://www.prisonpolicy.org/feeds/all.atom", level: "national" },
  { name: "Google News", url: g('"police accountability" OR "police misconduct" OR "consent decree"'), level: "national", section: "policing" },
  { name: "Google News", url: g('prosecutor OR "district attorney" criminal justice reform'), level: "national", section: "courts" },
  { name: "Google News", url: g('"death in custody" OR "prison conditions" OR "jail deaths"'), level: "national", section: "prisons" },
  { name: "Google News", url: g('parole board OR probation reform'), level: "national", section: "probation-parole" },
  { name: "Google News", url: g('exoneration OR "wrongful conviction" OR reentry program'), level: "national", section: "reentry" },
  { name: "Google News", url: g('prison oversight OR "inspector general" corrections OR "correctional ombudsman"'), level: "national", section: "oversight" },
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
