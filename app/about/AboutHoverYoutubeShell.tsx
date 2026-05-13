"use client";

import { useState } from "react";

const DEFAULT_VIDEO_ID = "6k8es2BNloE";

type AboutHoverYoutubeShellProps = {
  children: React.ReactNode;
  /** YouTube video ID (from the watch URL `v=`). */
  videoId?: string;
};

/**
 * Wraps controls (e.g. music button). On first pointer enter, mounts a YouTube
 * iframe above the slot. The iframe is never unmounted again so playback can
 * continue when the overlay is hidden; only visibility/opacity change on hover
 * / focus-within.
 */
export default function AboutHoverYoutubeShell({
  children,
  videoId = DEFAULT_VIDEO_ID,
}: AboutHoverYoutubeShellProps) {
  const [embedMounted, setEmbedMounted] = useState(false);

  return (
    <div
      className="group/about-yt relative inline-block"
      onPointerEnter={() => {
        setEmbedMounted(true);
      }}
    >
      {embedMounted ? (
        <div
          className="pointer-events-none invisible absolute right-0 bottom-full z-[45] mb-2 w-[min(92vw,360px)] origin-bottom scale-[0.98] opacity-0 shadow-[0_12px_40px_rgba(0,0,0,0.55)] transition-[opacity,transform,visibility] duration-200 group-hover/about-yt:pointer-events-auto group-hover/about-yt:visible group-hover/about-yt:scale-100 group-hover/about-yt:opacity-100 group-focus-within/about-yt:pointer-events-auto group-focus-within/about-yt:visible group-focus-within/about-yt:scale-100 group-focus-within/about-yt:opacity-100"
        >
          <div
            className="aspect-video w-full overflow-hidden rounded-sm border border-white/15 bg-black"
            role="region"
            aria-label="YouTube — Little Black Submarines"
          >
            <iframe
              title="The Black Keys — Little Black Submarines (YouTube)"
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      ) : null}
      {children}
    </div>
  );
}
