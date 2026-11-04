"use client";

import { useEffect, useRef, useState } from "react";
import { mediaPanel } from "@/design-system";

/**
 * A self-contained, same-origin HTML visual (public/hcn/*.html) shown in an
 * iframe that grows to fit its content, so the visual never scrolls inside.
 */
export function HtmlEmbed({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(480);

  const observer = useRef<ResizeObserver>(null);

  function track() {
    const doc = ref.current?.contentDocument;
    if (!doc?.body) return;
    observer.current?.disconnect();
    const update = () =>
      setHeight(Math.ceil(doc.body.getBoundingClientRect().height));
    update();
    observer.current = new ResizeObserver(update);
    observer.current.observe(doc.body);
  }

  // The iframe can finish loading before React hydrates, which would miss onLoad.
  useEffect(() => {
    if (ref.current?.contentDocument?.readyState === "complete") track();
    return () => observer.current?.disconnect();
  }, []);

  return (
    <div className={`${mediaPanel} overflow-hidden`}>
      <iframe
        ref={ref}
        src={src}
        title={title}
        onLoad={track}
        scrolling="no"
        loading="lazy"
        className="block w-full border-0"
        style={{ height }}
      />
    </div>
  );
}
