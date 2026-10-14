import Script from "next/script";
import { adsConfig } from "@/lib/ads.config";

type Variant = "leaderboard" | "sidebar" | "infeed" | "footer";
const dims: Record<Variant, string> = { leaderboard: "728 × 90", sidebar: "300 × 250", infeed: "Native / Fluid", footer: "970 × 90" };

export default function AdSlot({ variant }: { variant: Variant }) {
  const { publisherId, slots } = adsConfig;
  const slot = slots[variant];
  if (publisherId && slot) {
    return (
      <div className={`ad ad-${variant}`} aria-label="Advertisement">
        <span className="ad-label">Advertisement</span>
        <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={publisherId} data-ad-slot={slot}
          data-ad-format={variant === "infeed" ? "fluid" : "auto"} data-full-width-responsive="true" />
        <Script id={`ads-${variant}-${Math.random().toString(36).slice(2)}`} strategy="afterInteractive">
          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>
      </div>
    );
  }
  return (
    <div className={`ad ad-${variant} ad-placeholder`} role="complementary" aria-label="Advertisement placeholder">
      <span className="ad-label">Advertisement</span>
      <span className="ad-dims">{dims[variant]} · Your ad here</span>
      <a href="/advertise">Advertise with Justice Now AZ</a>
    </div>
  );
}
