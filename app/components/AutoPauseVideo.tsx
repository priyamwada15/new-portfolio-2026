"use client";

import { useEffect, useRef } from "react";

/** Native <video> that pauses when scrolled out of view and resumes when back in view. */
export default function AutoPauseVideo(
  props: React.VideoHTMLAttributes<HTMLVideoElement>
) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <video ref={videoRef} {...props} />;
}
