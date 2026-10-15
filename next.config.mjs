/** @type {import('next').NextConfig} */
// Old topic slugs -> closest Seven Ps section (301). Oversight is now the cross-cutting Oversight Watch strip on the homepage.
const old = { policing: "/section/police", courts: "/section/prosecution", "probation-parole": "/section/probation", reentry: "/section/post-release", oversight: "/" };
export default {
  reactStrictMode: true,
  // Agency Watch archives/timelines are read from data/ at request time (ISR), so ship them with the functions.
  experimental: { outputFileTracingIncludes: { "/agency/**": ["./data/**/*"], "/agency": ["./data/**/*"] } },
  async redirects() {
    return Object.entries(old).map(([from, to]) => ({ source: `/section/${from}`, destination: to, statusCode: 301 }));
  },
};
