"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** Story photo with an elegant flat fallback tile (navy/teal + label) when missing or broken. */
export default function Thumb({ src, label, tone = "navy", className = "", priority = false, sizes = "(max-width: 760px) 100vw, 33vw" }:
  { src?: string; label: string; tone?: "navy" | "teal" | "brick"; className?: string; priority?: boolean; sizes?: string }) {
  const [broken, setBroken] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  // Catch images that failed before hydration (onError would have been missed).
  useEffect(() => { const img = box.current?.querySelector("img"); if (img && img.complete && img.naturalWidth === 0) setBroken(true); }, []);
  return (
    <div ref={box} className={`thumb ${className}`}>
      {src && !broken ? (
        <Image src={src} alt="" fill unoptimized sizes={sizes} loading={priority ? "eager" : "lazy"} priority={priority}
          referrerPolicy="no-referrer" onError={() => setBroken(true)} style={{ objectFit: "cover" }} />
      ) : (
        <div className={`thumb-fallback tone-${tone}`} aria-hidden="true"><span>{label}</span></div>
      )}
    </div>
  );
}
