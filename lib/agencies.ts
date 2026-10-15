/** Agency Watch hubs: dedicated feeds, classifier, archive + history for key Arizona agencies. */
export type AgencyTab = { slug: string; name: string };
export type Agency = {
  slug: string; name: string; short: string; blurb: string;
  /** Google News queries for the live feed (last 30 days). */
  queries: string[];
  /** Query variants for the historical backfill (per year). */
  backfillQueries: string[];
  /** A story belongs to the hub if the title/snippet matches any include pattern. */
  include: RegExp[];
  /** ...and none of these (false positives)... */
  exclude?: RegExp[];
  /** ...unless one of these unambiguous patterns matches. */
  strong?: RegExp[];
  /** Extra topic tab (e.g. litigation) defined by its own matcher. */
  topicTab?: { slug: string; name: string; blurb: string; match: RegExp[] };
};

export const AGENCIES: Agency[] = [
  {
    slug: "adcrr", short: "ADCRR",
    name: "Arizona Department of Corrections, Rehabilitation & Reentry",
    blurb: "Arizona's state prison system: its director and staff, the ten state prisons and private contract facilities, deaths in custody, staffing, heat, healthcare, escapes and incidents — and the long fight in federal court over the care of incarcerated people.",
    queries: ["ADCRR", "\"Arizona Department of Corrections\"", "Arizona prison", "\"Ryan Thornell\"", "\"Jensen v. Thornell\" OR \"Jensen v. Shinn\"", "Arizona prison death", "Arizona prison officer", "\"Lewis prison\" OR \"Eyman prison\" OR \"Perryville prison\" OR \"Florence prison\" Arizona"],
    backfillQueries: ["ADCRR", "\"Arizona Department of Corrections\"", "Arizona prison", "Arizona prison death", "Arizona prison healthcare lawsuit", "\"Parsons v. Ryan\" OR \"Jensen v. Shinn\" OR \"Jensen v. Thornell\"", "\"David Shinn\" OR \"Ryan Thornell\" OR \"Charles Ryan\" corrections", "Arizona prison officer", "Lewis OR Eyman OR Perryville OR Florence prison Arizona", "Arizona inmate escape OR killed prison", "Arizona private prison"],
    include: [/\badcrr\b/i, /\badc\b.*prison|prison.*\badc\b/i, /arizona (state )?(department|dept\.?) of corrections/i, /arizona (state )?prison/i, /\b(ryan thornell|david shinn|charles ryan)\b/i, /\b(parsons|jensen) v\.? (ryan|shinn|thornell)\b/i, /\b(lewis|eyman|perryville|florence|douglas|safford|winslow|yuma|tucson|kingman|marana|red rock|la palma|san luis|phoenix west)\b.{0,40}\b(prison|state prison|complex|correctional)/i, /\b(prison|incarcerated|inmate|correctional officer|corrections officer)\b.{0,80}\barizona\b|\barizona\b.{0,80}\b(prison|incarcerated|inmate|correctional officer|corrections officer)\b/i],
    strong: [/\badcrr\b/i, /arizona (state )?(department|dept\.?) of corrections/i, /\b(ryan thornell|david shinn|charles ryan)\b/i, /\b(parsons|jensen) v\.? (ryan|shinn|thornell)\b/i],
    exclude: [/\b(sentenced|sentence[sd]?|years|months|life|decades?)\b.{0,25}\bprison\b/i, /\b(going|headed|sent) to prison\b/i, /\bprison (term|sentence|time)\b/i, /\bfaces?\b.{0,30}\bprison\b/i, /\b(new mexico|colorado|nevada|texas|california|utah|oklahoma|joliet|hawaii)\b/i],
    topicTab: { slug: "litigation", name: "Litigation (Jensen)", blurb: "Parsons v. Ryan → Jensen v. Shinn → Jensen v. Thornell: the class action over healthcare and isolation in Arizona prisons, Judge Roslyn Silver's 2022 ruling, the injunction, the court's experts and monitoring, and talk of receivership.",
      match: [/\b(parsons|jensen)\b/i, /\breceiver(ship)?\b/i, /\b(judge )?(roslyn )?silver\b/i, /\bcontempt\b/i, /prison (health ?care|medical).{0,60}(lawsuit|court|judge|settlement|ruling|fine)/i, /(lawsuit|court|judge|settlement|ruling|fine).{0,60}prison (health ?care|medical)/i, /\b(naphcare|centurion|corizon)\b/i] },
  },
  {
    slug: "phoenix-pd", short: "Phoenix PD",
    name: "Phoenix Police Department",
    blurb: "The nation's fifth-largest city police department: the U.S. Department of Justice pattern-or-practice investigation and its findings, a record of police shootings that led the nation, use of force, the 2020 protest gang-charge scandal, and the city's Office of Accountability and Transparency.",
    queries: ["\"Phoenix police\"", "\"Phoenix Police Department\"", "Phoenix police shooting", "Phoenix police DOJ", "\"Office of Accountability and Transparency\" Phoenix", "Phoenix police chief"],
    backfillQueries: ["\"Phoenix police\"", "\"Phoenix Police Department\"", "Phoenix police shooting", "Phoenix police use of force", "Phoenix police DOJ investigation", "Phoenix police chief", "Phoenix police protest charges gang", "\"Office of Accountability and Transparency\" Phoenix", "Phoenix police misconduct OR lawsuit OR settlement"],
    include: [/\bphoenix (police|pd|officer|cop)s?\b/i, /\bphoenix police department\b/i, /\bphx ?pd\b/i, /office of accountability and transparency/i, /\b(jeri williams|michael sullivan|matt giordano)\b.{0,60}\b(chief|police)\b|\b(chief|police)\b.{0,60}\b(jeri williams|michael sullivan|matt giordano)\b/i],
    exclude: [/\bphoenix,? (oregon|ore\.)\b/i],
    topicTab: { slug: "doj", name: "DOJ Investigation", blurb: "The U.S. Department of Justice pattern-or-practice investigation opened in August 2021, its June 2024 findings, and what has happened since.",
      match: [/\b(doj|department of justice|justice department|pattern[- ]or[- ]practice|consent decree|federal investigation|civil rights division)\b/i] },
  },
  {
    slug: "mcso-jails", short: "MCSO Jails",
    name: "Maricopa County Sheriff's Office Jails",
    blurb: "One of the largest jail systems in the country — Lower Buckeye, 4th Avenue, Estrella and the Towers — with its deaths in custody and conditions, Correctional Health Services, the Melendres v. Arpaio court monitor and its costs, and the legacy of Tent City.",
    queries: ["Maricopa County jail", "\"Maricopa County Sheriff's Office\" jail", "\"Lower Buckeye\" jail", "\"4th Avenue jail\" OR \"Fourth Avenue jail\"", "Melendres monitor sheriff", "\"Correctional Health Services\" Maricopa", "Maricopa County jail death"],
    backfillQueries: ["Maricopa County jail", "Maricopa County jail death", "\"Lower Buckeye\" jail", "\"4th Avenue jail\" OR \"Estrella jail\"", "Melendres Arpaio monitor", "Maricopa sheriff court monitor cost", "Tent City Arpaio jail", "\"Correctional Health Services\" Maricopa", "Maricopa County sheriff jail conditions OR lawsuit"],
    include: [/\bmaricopa county (jail|jails)\b/i, /\b(lower buckeye|4th avenue|fourth avenue|estrella|towers)\b.{0,30}\bjail\b/i, /\bjail\b.{0,60}\b(mcso|maricopa)\b|\b(mcso|maricopa county sheriff)\b.{0,80}\b(jail|detention|inmate|custody)\b/i, /\bmelendres\b/i, /\btent city\b/i, /correctional health services/i, /\b(sheriff )?(arpaio|penzone|sheridan|russ skinner)\b.{0,80}\b(jail|monitor|court|racial profiling)\b/i],
    exclude: [/\bmonroe county\b/i],
  },
];

export const agencyBySlug = (s: string) => AGENCIES.find((a) => a.slug === s);

export type ArchiveItem = { title: string; url: string; source: string; date: string; snippet: string };
export type HistoryEntry = { date: string; title: string; summary: string; sources: { label: string; url: string }[]; note?: string; tag?: string };

export function matchesAgency(a: Agency, hay: string): boolean {
  if (!a.include.some((r) => r.test(hay))) return false;
  if (a.strong?.some((r) => r.test(hay))) return true;
  if (a.exclude?.some((r) => r.test(hay))) return false;
  return true;
}
