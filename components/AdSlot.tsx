import Script from "next/script";
import { adsConfig, ADVERTISE_EMAIL } from "@/lib/ads.config";

type Variant = "leaderboard" | "sidebar" | "infeed" | "footer";

const mailto = `mailto:${ADVERTISE_EMAIL}?subject=${encodeURIComponent("Advertising on Justice Now AZ")}`;

function HouseAd({ variant, index }: { variant: Variant; index: number }) {
  // Alternate between "advertise with us" and the Praxis Initiative promo.
  const praxis = (variant === "sidebar" || variant === "footer") ? index % 2 === 0 : index % 2 === 1;
  if (praxis) {
    return (
      <a className="house house-praxis" href="https://www.praxisinitiative.org" target="_blank" rel="noopener noreferrer">
        <span className="house-eyebrow">Praxis Initiative</span>
        <span className="house-title">Reforming Arizona&rsquo;s criminal legal system — from police to post-release.</span>
        <span className="house-cta">Learn more &amp; get involved →</span>
      </a>
    );
  }
  return (
    <a className="house house-adv" href={mailto}>
      <span className="house-eyebrow">Advertise with Justice Now AZ</span>
      <span className="house-title">Reach Arizona readers who follow justice, public safety &amp; accountability.</span>
      <span className="house-cta">Contact us for rates →</span>
    </a>
  );
}

export default function AdSlot({ variant, index = 0 }: { variant: Variant; index?: number }) {
  const { publisherId, slots } = adsConfig;
  const slot = slots[variant];
  if (publisherId && slot) {
    return (
      <div className={`ad ad-${variant}`} aria-label="Advertisement">
        <span className="ad-label">Advertisement</span>
        <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={publisherId} data-ad-slot={slot}
          data-ad-format={variant === "infeed" ? "fluid" : "auto"} data-full-width-responsive="true" />
        <Script id={`ads-${variant}-${index}`} strategy="afterInteractive">
          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>
      </div>
    );
  }
  return (
    <aside className={`ad ad-${variant} ad-house`} aria-label="Advertisement">
      <span className="ad-label">Advertisement</span>
      <HouseAd variant={variant} index={index} />
    </aside>
  );
}
