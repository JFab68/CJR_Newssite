// Arizona's 15 counties.
// Population source: U.S. Census Bureau, 2020 Decennial Census (P.L. 94-171
// Redistricting Data, April 1, 2020 count), Arizona counties.
// https://data.census.gov  (Table P1, "Total Population", Arizona counties)
// Statewide total: 7,151,502.

export type County = {
  slug: string; name: string; seat: string; pop2020: number;
  /** Place names that reliably mean this county (matched on word boundaries). */
  places: string[];
  /** Ambiguous names (also exist elsewhere) — only count with Arizona context. */
  weakPlaces?: string[];
  /** Google News search queries for this county's criminal legal system. */
  queries: string[];
  /** Official justice-system sites, shown when the county has no recent stories (URLs verified). */
  resources?: { label: string; url: string }[];
};

export const COUNTIES: County[] = [
  { slug: "maricopa", name: "Maricopa", seat: "Phoenix", pop2020: 4420568,
    places: ["maricopa county", "phoenix", "mesa police", "mesa, ariz", "tempe", "scottsdale", "chandler", "glendale, ariz", "gilbert police", "town of gilbert", "peoria, ariz", "surprise, ariz", "avondale", "goodyear", "buckeye", "tolleson", "el mirage", "fountain hills", "queen creek", "laveen", "ahwatukee", "lower buckeye jail", "4th avenue jail", "mcso"],
    weakPlaces: ["glendale", "peoria", "surprise", "mesa", "gilbert"],
    queries: ['"Maricopa County Sheriff" OR "Phoenix police" OR "Mesa police" OR "Scottsdale police" OR "Chandler police"', '"Maricopa County Attorney" OR "Maricopa County Superior Court" OR "Maricopa County jail" OR "Maricopa County probation"'] },
  { slug: "pima", name: "Pima", seat: "Tucson", pop2020: 1043433,
    places: ["pima county", "tucson", "oro valley", "marana", "sahuarita", "south tucson", "pascua yaqui", "tohono o'odham", "tohono oodham"],
    queries: ['"Pima County Sheriff" OR "Tucson police" OR "Oro Valley police" OR "Marana police"', '"Pima County Attorney" OR "Pima County Superior Court" OR "Pima County jail" OR "Pima County probation"'] },
  { slug: "pinal", name: "Pinal", seat: "Florence", pop2020: 425264,
    places: ["pinal county", "casa grande", "san tan valley", "apache junction", "coolidge", "eloy", "arizona state prison complex-florence", "asp-florence", "maricopa police", "city of maricopa", "gila river indian community"],
    weakPlaces: ["florence"],
    queries: ['"Pinal County Sheriff" OR "Casa Grande police" OR "Apache Junction police" OR "Eloy police"', '"Pinal County Attorney" OR "Pinal County Superior Court" OR "Pinal County jail" OR "Florence prison" OR "Eloy detention"'] },
  { slug: "yavapai", name: "Yavapai", seat: "Prescott", pop2020: 236209,
    places: ["yavapai county", "prescott", "prescott valley", "cottonwood", "sedona", "chino valley", "camp verde", "verde valley"],
    queries: ['"Yavapai County Sheriff" OR "Prescott police" OR "Prescott Valley police" OR "Cottonwood police"', '"Yavapai County Attorney" OR "Yavapai County Superior Court" OR "Yavapai County jail"'] },
  { slug: "mohave", name: "Mohave", seat: "Kingman", pop2020: 213267,
    places: ["mohave county", "kingman", "lake havasu", "bullhead city", "fort mohave", "colorado city"],
    queries: ['"Mohave County Sheriff" OR "Kingman police" OR "Lake Havasu City police" OR "Bullhead City police"', '"Mohave County Attorney" OR "Mohave County Superior Court" OR "Mohave County jail"'] },
  { slug: "yuma", name: "Yuma", seat: "Yuma", pop2020: 203881,
    places: ["yuma county", "yuma", "ycso", "san luis, ariz", "somerton", "wellton"],
    queries: ['"Yuma County Sheriff" OR "Yuma police" OR "San Luis police" OR "Somerton police"', '"Yuma County Attorney" OR "Yuma County Superior Court" OR "Yuma County jail" OR "Arizona State Prison Complex-Yuma"'] },
  { slug: "coconino", name: "Coconino", seat: "Flagstaff", pop2020: 145101,
    places: ["coconino county", "flagstaff", "williams, ariz", "page, ariz", "tuba city", "grand canyon"],
    queries: ['"Coconino County Sheriff" OR "Flagstaff police" OR "Coconino County Attorney" OR "Coconino County jail" OR "Coconino County Superior Court"'] },
  { slug: "cochise", name: "Cochise", seat: "Bisbee", pop2020: 125447,
    places: ["cochise county", "sierra vista", "bisbee", "benson, ariz", "willcox", "tombstone", "douglas, ariz", "arizona state prison complex-douglas"],
    weakPlaces: ["douglas"],
    queries: ['"Cochise County Sheriff" OR "Sierra Vista police" OR "Bisbee police" OR "Cochise County Attorney" OR "Cochise County jail" OR "Cochise County" court'] },
  { slug: "navajo", name: "Navajo", seat: "Holbrook", pop2020: 106717,
    places: ["navajo county", "show low", "holbrook", "winslow", "snowflake", "taylor, ariz", "pinetop", "lakeside, ariz", "kayenta", "hopi"],
    weakPlaces: ["winslow"],
    queries: ['"Navajo County Sheriff" OR "Navajo County Attorney" OR "Show Low police" OR "Winslow police" OR "Holbrook police"', '"Navajo Nation police" OR "Hopi" police OR "Navajo Nation" court OR jail OR "tribal justice" Arizona'] },
  { slug: "apache", name: "Apache", seat: "St. Johns", pop2020: 66021,
    places: ["apache county", "st. johns, ariz", "st johns, ariz", "springerville", "eagar", "chinle", "window rock", "ganado", "fort apache", "white mountain apache"],
    queries: ['"Apache County" sheriff OR attorney OR court OR jail OR police OR deputy', '"Window Rock" OR Chinle OR "White Mountain Apache" police OR court OR arrest OR jail'] },
  { slug: "gila", name: "Gila", seat: "Globe", pop2020: 53272,
    places: ["gila county", "payson", "globe, ariz", "miami, ariz", "san carlos apache"],
    weakPlaces: ["globe"],
    queries: ['"Gila County Sheriff" OR "Gila County Attorney" OR "Payson police" OR "Globe police" Arizona OR "San Carlos Apache" police'] },
  { slug: "santa-cruz", name: "Santa Cruz", seat: "Nogales", pop2020: 47669,
    places: ["santa cruz county, ariz", "santa cruz county, arizona", "nogales", "rio rico", "patagonia, ariz"],
    weakPlaces: ["santa cruz county"],
    queries: ['"Santa Cruz County Sheriff" Arizona OR "Nogales police" OR "Santa Cruz County Attorney" Arizona OR Nogales court OR jail'] },
  { slug: "graham", name: "Graham", seat: "Safford", pop2020: 38533,
    places: ["graham county", "safford", "thatcher, ariz", "pima, ariz", "fort grant"],
    queries: ['"Graham County Sheriff" OR "Safford police" OR "Graham County Attorney" OR "Graham County jail" OR Safford court Arizona'] },
  { slug: "la-paz", name: "La Paz", seat: "Parker", pop2020: 16557,
    places: ["la paz county", "quartzsite", "parker, ariz", "colorado river indian tribes", "ehrenberg"],
    weakPlaces: ["parker"],
    resources: [{ label: "La Paz County Sheriff's Office", url: "https://www.lapazsheriff.org/" }, { label: "La Paz County Attorney", url: "https://lapaz.gov/154/County-Attorney" }, { label: "La Paz County Courts", url: "https://www.lapaz.gov/156/Courts" }],
    queries: ['"La Paz County Sheriff" OR "La Paz County Attorney" OR "Parker police" Arizona OR Quartzsite police OR "Colorado River Indian Tribes" police'] },
  { slug: "greenlee", name: "Greenlee", seat: "Clifton", pop2020: 9563,
    places: ["greenlee county", "morenci", "clifton, ariz", "duncan, ariz"],
    weakPlaces: ["clifton"],
    queries: ['"Greenlee County Sheriff" OR "Greenlee County Attorney" OR Morenci police OR Clifton Arizona police OR court'] },
];

export const AZ_POP_2020 = COUNTIES.reduce((n, c) => n + c.pop2020, 0);
export const countyBySlug = (slug: string) => COUNTIES.find((c) => c.slug === slug);

/** Homepage story slots: proportional to 2020 population, with a floor so small counties still appear. */
export const HOME_COUNTY_BUDGET = 40;
export function homeSlots(c: County): number {
  const big = ["maricopa", "pima", "pinal", "yavapai", "mohave", "yuma"].includes(c.slug);
  return Math.max(big ? 2 : 1, Math.round((HOME_COUNTY_BUDGET * c.pop2020) / AZ_POP_2020));
}
