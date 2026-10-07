"use client";

import { useEffect, useRef } from "react";

/**
 * Native <video> that pauses when scrolled out of view and resumes when back in view.
 * Also resumes when the tab or app becomes visible again, since a phone may pause it
 * in the background and the observer won't fire again while the video stays in view.
 */
export default function AutoPauseVideo(
  props: React.VideoHTMLAttributes<HTMLVideoElement>
) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    let inView = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    const onVisibility = () => {
      if (document.visibilityState === "visible" && inView && el.paused) el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <video ref={videoRef} {...props} />;
}
