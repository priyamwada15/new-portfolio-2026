"use client";

import { LiquidButton } from "../components/animate-ui/liquid-button";

const PDF_HREF = "/Files/Pandey_Priyamwada_Resume.pdf";
const PDF_NAME = "Pandey_Priyamwada_Resume.pdf";

function DownloadGlyph({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static SVG asset from /public
    <img
      src="/Icons/DownloadSimple.svg"
      alt=""
      width={18}
      height={18}
      className={`block shrink-0 brightness-0 transition-[filter] duration-300 group-hover:invert ${className ?? ""}`}
      aria-hidden
    />
  );
}

export function ResumeDownloadButton() {
  return (
    <LiquidButton
      href={PDF_HREF}
      download={PDF_NAME}
      hoverScale={1.04}
      tapScale={0.97}
      aria-label="Download resume PDF"
    >
      <DownloadGlyph className="shrink-0" />
      <span>Download</span>
    </LiquidButton>
  );
}
