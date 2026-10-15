// Advertising configuration. Leave publisherId empty to show house ads (Advertise with us / Praxis Initiative).
// When approved for Google AdSense, set publisherId (e.g. "ca-pub-1234567890123456")
// and fill in slot IDs for each placement.
export const adsConfig = {
  publisherId: "",
  slots: {
    leaderboard: "",
    sidebar: "",
    infeed: "",
    footer: "",
  } as Record<string, string>,
  infeedEvery: 6, // insert an in-feed ad after every N stories
};

// Contact address for advertising inquiries (used by house ads and /advertise).
export const ADVERTISE_EMAIL = "fred.jf@mail.grokbot.com";
