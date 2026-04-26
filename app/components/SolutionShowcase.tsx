"use client";

import { useEffect, useRef } from "react";

interface Props {
  bgSrc: string;
  bgAlt: string;
  videoSrc: string;
  videoAlt?: string;
  videoClipPath?: string;
}

export default function SolutionShowcase({ bgSrc, bgAlt, videoSrc, videoAlt = "", videoClipPath = "inset(0 4px)" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let inView = false;

    const tryPlay = () => {
      if (inView) video.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          // Load first (no-op if already loading), then play once ready
          if (video.readyState === 0) video.load();
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    // Fires after load() has buffered enough — catches the case where
    // play() was called before the video was ready
    video.addEventListener("canplay", tryPlay);
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl min-[400px]:rounded-[28px]"
      style={{ height: "80vh" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bgSrc}
        alt={bgAlt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ outline: "none" }}
      />

      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.35)" }}
      />

      {videoSrc && (
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoSrc}
            aria-label={videoAlt}
            muted
            playsInline
            preload="none"
            className="rounded-[2rem] min-[400px]:rounded-[52px] md:h-[90%] md:w-auto h-auto w-[80%]"
            style={{
              display: "block",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}
    </div>
  );
}
