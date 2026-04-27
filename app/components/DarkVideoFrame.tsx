"use client";

import { useEffect, useRef } from "react";
import LightMediaFrame from "./LightMediaFrame";

export default function DarkVideoFrame({
  src,
  className = "w-full",
}: {
  src: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Tracks whether the observer considers the video in-viewport.
    // canplay must check this before playing so a video that loads
    // while scrolled past doesn't start playing off-screen.
    const inView = { current: false };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      // Fire when the video's midpoint crosses into the viewport
      { threshold: 0.5 }
    );

    const onCanPlay = () => {
      if (inView.current) video.play().catch(() => {});
    };

    video.addEventListener("canplay", onCanPlay);
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  return (
    <LightMediaFrame className={className}>
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop
        preload="metadata"
        className="w-full max-w-full block"
      />
    </LightMediaFrame>
  );
}
