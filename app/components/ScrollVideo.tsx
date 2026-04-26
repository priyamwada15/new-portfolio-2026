"use client";

import { useEffect, useRef } from "react";

interface Props {
  src: string;
  caption?: string;
  className?: string;
}

export default function ScrollVideo({ src, caption, className = "" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex-1 overflow-hidden rounded-[28px]" style={{ outline: "1px solid rgba(0,0,0,0.06)" }}>
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="metadata"
          className="h-full w-auto"
          style={{ display: "block" }}
        />
      </div>
      {caption && (
        <p className="font-mono text-[12px] font-medium tracking-wider text-muted mt-3 shrink-0">
          {caption}
        </p>
      )}
    </div>
  );
}
