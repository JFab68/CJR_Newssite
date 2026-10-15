/** @type {import('next').NextConfig} */
// Old topic slugs -> closest Seven Ps section (301). Oversight is now the cross-cutting Oversight Watch strip on the homepage.
const old = { policing: "/section/police", courts: "/section/prosecution", "probation-parole": "/section/probation", reentry: "/section/post-release", oversight: "/" };
export default {
  reactStrictMode: true,
  async redirects() {
    return Object.entries(old).map(([from, to]) => ({ source: `/section/${from}`, destination: to, statusCode: 301 }));
  },
};
