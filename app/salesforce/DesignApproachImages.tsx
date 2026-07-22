"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CursorFollowTooltip } from "../about/CursorFollowTooltip";

const DESIGN_APPROACH_IMAGES = [
  {
    key: "info-arch",
    src: "/new-salesforce/InfoArch.png",
    alt: "Information architecture map of Galileo's dashboard, advisor and profile flows",
    tooltip: "Information Architecture",
    style: { width: "70.7%", height: "50.25%", right: "2.6%", top: "0%" },
    rotate: "3.94deg",
  },
  {
    key: "impxopp-matrix",
    src: "/new-salesforce/ImpxOpp%20Matrix.png",
    alt: "Importance x Opportunity matrix scoring academic challenges against other student needs",
    tooltip: "Importance x Opportunity Matrix",
    style: { width: "58.98%", height: "42.01%", left: "0%", top: "18.42%" },
    rotate: "-5.47deg",
  },
  {
    key: "jen-needs",
    src: "/new-salesforce/Jen%20needs.png",
    alt: "Persona needs summary for Jen, an undeclared student",
    tooltip: "Student Persona",
    style: { width: "59.77%", height: "42.5%", left: "0.05%", bottom: "5.93%" },
    rotate: "4.58deg",
  },
  {
    key: "interview-insights",
    src: "/new-salesforce/Interview%20Insights%201.png",
    alt: "Synthesized interview insights from student research sessions",
    tooltip: "1/22 Interview Insights",
    style: { width: "38.15%", height: "52.72%", right: "5.99%", bottom: "6.86%" },
    rotate: "-8.96deg",
  },
];

function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-black/70 p-6 fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={alt}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full animate-in rounded-lg object-contain zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
}

export function DesignApproachImages() {
  const [expanded, setExpanded] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="relative w-full" style={{ aspectRatio: "768 / 607" }}>
      {DESIGN_APPROACH_IMAGES.map((image) => (
        <CursorFollowTooltip key={image.key} label={image.tooltip}>
          <button
            type="button"
            onClick={() => setExpanded(image)}
            className="cursor-hover-pointer absolute overflow-hidden rounded-2xl border border-border"
            style={{ ...image.style, transform: `rotate(${image.rotate})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
          </button>
        </CursorFollowTooltip>
      ))}
      {expanded && (
        <ImageLightbox src={expanded.src} alt={expanded.alt} onClose={() => setExpanded(null)} />
      )}
    </div>
  );
}
