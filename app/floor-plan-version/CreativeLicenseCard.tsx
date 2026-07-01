"use client";

import { useState } from "react";
import { CreativeLicenseLightbox } from "@/app/home-v2/CreativeLicenseLightbox";

type Props = {
  style: React.CSSProperties;
};

export function CreativeLicenseCard({ style }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/26june-homepage-assets/Creative License Front.png"
        alt="Creative License"
        data-fp-key="creative-license"
        className="fp-tilt absolute object-contain cursor-hover-pointer"
        style={style}
        onClick={() => setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLightboxOpen(true); }}
      />
      {lightboxOpen && <CreativeLicenseLightbox onClose={() => setLightboxOpen(false)} />}
    </>
  );
}
