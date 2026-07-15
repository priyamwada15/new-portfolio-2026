"use client";

import { useEffect, useRef, useState } from "react";

/** Mounts children only while the wrapper is in view; unmounts (stopping any embedded playback) when scrolled out. */
export default function VisibilityMount({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-full">
      {visible ? children : null}
    </div>
  );
}
