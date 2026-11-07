"use client";

import { useEffect, useRef, useState } from "react";
import { useCursorDisc } from "./useCursorDisc";

const W = 1008;
const H = 520;
/** The loop is drawn at this share of the card's width, set back like the other demos. */
const SETBACK = 0.8;

/**
 * The marketplace hero loop (public/hcn/hero-loop.html). `zoom` rather than a
 * transform, so the iframe lays out and paints at its real size and stays sharp.
 * Centred in the card.
 */
export function HcnMarketplaceEmbed() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(SETBACK);
  const cursor = useCursorDisc("Read");

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = () => setScale((el.clientWidth / W) * SETBACK);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // "Read" cursor over the whole card: the card link sits under the demo (homepage only)
  useEffect(() => {
    const link = rootRef.current?.closest("[data-study-row]")?.querySelector("a");
    const media = link?.querySelector<HTMLElement>("[data-card-media]");
    if (!link || !media) return;
    let shown = false;
    const onMove = (e: PointerEvent) => {
      const r = media.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (inside) {
        if (shown) cursor.move(e);
        else cursor.show(e);
      } else if (shown) cursor.hide();
      shown = inside;
    };
    const onLeave = () => {
      cursor.hide();
      shown = false;
    };
    link.addEventListener("pointermove", onMove);
    link.addEventListener("pointerleave", onLeave);
    return () => {
      link.removeEventListener("pointermove", onMove);
      link.removeEventListener("pointerleave", onLeave);
    };
    // cursor's methods only touch refs and state setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none! absolute inset-0 overflow-hidden">
      <iframe
        src="/hcn/hero-loop.html"
        title="Advertiser and broadcaster booking flow"
        scrolling="no"
        loading="lazy"
        className="pointer-events-none! absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 border-0"
        style={{ width: W, height: H, zoom: scale }}
      />
      {cursor.disc}
    </div>
  );
}
