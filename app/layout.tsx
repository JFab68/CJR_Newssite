import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";

const serif = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-serif", display: "swap" });
const sans = Source_Sans_3({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-sans", display: "swap" });
import AdSlot from "@/components/AdSlot";
import { LEVELS, SECTIONS } from "@/lib/feeds";
import { adsConfig } from "@/lib/ads.config";
import { COUNTIES } from "@/lib/counties";

export const metadata: Metadata = {
  metadataBase: new URL("https://justicenowaz.org"),
  title: { default: "Justice Now AZ — Criminal Legal System News", template: "%s · Justice Now AZ" },
  description: "Daily criminal legal system news from Phoenix, Arizona, and the nation — with a focus on oversight and transparency.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const now = new Date();
  const today = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "America/Phoenix" });
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {adsConfig.publisherId ? (
          <Script id="adsbygoogle-loader" strategy="afterInteractive" crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsConfig.publisherId}`} />
        ) : null}
        <a className="skip" href="#main">Skip to content</a>
        <div className="topbar"><div className="wrap"><AdSlot variant="leaderboard" /></div></div>
        <header className="masthead wrap">
          <div className="dateline">{`${today} · Phoenix, Arizona`}</div>
          <Link href="/" className="brand">Justice Now AZ</Link>
          <p className="tagline">Watching the criminal legal system — from police to post-release</p>
        </header>
        <nav className="nav" aria-label="Main">
          <div className="wrap nav-inner">
            <Link href="/">Home</Link>
            <Link href="/breaking">Breaking & General</Link>
            <Link href="/county">Counties</Link>
            <Link href="/agency">Agency Watch</Link>
            {Object.entries(LEVELS).map(([k, v]) => <Link key={k} href={`/level/${k}`}>{v.name}</Link>)}
            <span className="sep" aria-hidden="true">|</span>
            {Object.entries(SECTIONS).map(([k, v]) => <Link key={k} href={`/section/${k}`}>{v.name}</Link>)}
            <span className="sep" aria-hidden="true">|</span>
            <Link href="/commentary">Commentary</Link>
            <Link href="/about">About</Link>
          </div>
          <div className="wrap nav-inner county-nav" aria-label="Counties">
            <span className="nav-label">Counties:</span>
            {COUNTIES.map((c) => <Link key={c.slug} href={`/county/${c.slug}`}>{c.name}</Link>)}
          </div>
        </nav>
        <main id="main" className="wrap">{children}</main>
        <footer className="footer">
          <div className="wrap">
            <AdSlot variant="footer" />
            <div className="foot-grid">
              <div><strong className="foot-brand">Justice Now AZ</strong><p>An independent aggregator of criminal legal system news. Headlines link to the original publishers; all reporting belongs to them.</p></div>
              <div><h2>Coverage</h2><ul className="plain">{Object.entries(LEVELS).map(([k, v]) => <li key={k}><Link href={`/level/${k}`}>{v.name}</Link></li>)}<li><Link href="/breaking">Breaking & General News</Link></li><li><Link href="/county">Arizona Counties</Link></li><li><Link href="/agency">Agency Watch</Link></li></ul></div>
              <div><h2>Organization</h2><ul className="plain"><li><Link href="/about">About</Link></li><li><Link href="/commentary">Commentary</Link></li><li><Link href="/advertise">Advertise</Link></li></ul></div>
            </div>
            <p className="copy">© {now.getFullYear()} Justice Now AZ · In partnership with <a href="https://www.praxisinitiative.org" target="_blank" rel="noopener noreferrer">Praxis Initiative</a></p>
          </div>
        </footer>
      </body>
    </html>
  );
}
