"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AutoPauseVideo from "../components/AutoPauseVideo";
import { mediaPanel } from "@/design-system";

function VideoLightbox({
  src,
  label,
  onClose,
}: {
  src: string;
  label: string;
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
      className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-black/70 p-6 fade-in cursor-zoom-out"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={label}
    >
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="max-h-full max-w-full animate-in rounded-lg object-contain zoom-in-95"
      />
    </div>,
    document.body
  );
}

export function CoreFeatureVideo({ src, title }: { src: string; title: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        aria-label={`Expand ${title} video`}
        className={`cursor-zoom-in aspect-[768/501] w-full overflow-hidden ${mediaPanel}`}
      >
        <AutoPauseVideo
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${title} demo`}
          className="h-full w-full object-cover"
        />
      </button>
      {expanded && (
        <VideoLightbox
          src={src}
          label={`${title} demo, expanded`}
          onClose={() => setExpanded(false)}
        />
      )}
    </>
  );
}
