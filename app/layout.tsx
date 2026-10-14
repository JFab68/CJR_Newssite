import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import AdSlot from "@/components/AdSlot";
import { LEVELS, SECTIONS } from "@/lib/feeds";
import { adsConfig } from "@/lib/ads.config";

export const metadata: Metadata = {
  metadataBase: new URL("https://justicenowaz.org"),
  title: { default: "Justice Now AZ — Criminal Legal System News", template: "%s · Justice Now AZ" },
  description: "Daily criminal legal system news from Phoenix, Arizona, and the nation — with a focus on oversight and transparency.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "America/Phoenix" });
  return (
    <html lang="en">
      <head>
        {adsConfig.publisherId && (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsConfig.publisherId}`} crossOrigin="anonymous" />
        )}
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <div className="wrap"><AdSlot variant="leaderboard" /></div>
        <header className="masthead wrap">
          <div className="dateline">{today} · Phoenix, Arizona</div>
          <Link href="/" className="brand">Justice Now AZ</Link>
          <p className="tagline">Watching the criminal legal system — from policing to reentry</p>
        </header>
        <nav className="nav" aria-label="Main">
          <div className="wrap nav-inner">
            <Link href="/">Home</Link>
            {Object.entries(LEVELS).map(([k, v]) => <Link key={k} href={`/level/${k}`}>{v.name}</Link>)}
            <span className="sep" aria-hidden="true">|</span>
            {Object.entries(SECTIONS).map(([k, v]) => <Link key={k} href={`/section/${k}`}>{v.name}</Link>)}
            <span className="sep" aria-hidden="true">|</span>
            <Link href="/commentary">Commentary</Link>
            <Link href="/about">About</Link>
          </div>
        </nav>
        <main id="main" className="wrap">{children}</main>
        <footer className="footer">
          <div className="wrap">
            <AdSlot variant="footer" />
            <div className="foot-grid">
              <div><strong className="foot-brand">Justice Now AZ</strong><p>An independent aggregator of criminal legal system news. Headlines link to the original publishers; all reporting belongs to them.</p></div>
              <div><h2>Coverage</h2><ul className="plain">{Object.entries(LEVELS).map(([k, v]) => <li key={k}><Link href={`/level/${k}`}>{v.name}</Link></li>)}</ul></div>
              <div><h2>Organization</h2><ul className="plain"><li><Link href="/about">About</Link></li><li><Link href="/commentary">Commentary</Link></li><li><Link href="/advertise">Advertise</Link></li></ul></div>
            </div>
            <p className="copy">© {new Date().getFullYear()} Justice Now AZ</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
