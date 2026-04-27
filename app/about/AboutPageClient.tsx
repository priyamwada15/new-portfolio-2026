"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { layoutNextLine, prepareWithSegments, type LayoutCursor } from "@chenglou/pretext";
import { PLAY_SURFACE_BG } from "../lib/playSurface";

type LineItem = {
  key: string;
  paragraphIndex: number;
  text: string;
  inset: number;
};

type MagneticMeta = {
  x: number;
  y: number;
  cx: number;
  cy: number;
};

const LEFT_COPY = [
  "I started in visual communication, then kept getting pulled toward product problems that needed equal parts taste and systems thinking.",
  "Most of my work lives in complex spaces, AI features, enterprise workflows, and tooling where people need clarity more than novelty.",
  "I care about interfaces that feel quiet, decisive, and human, especially when the underlying logic is anything but simple.",
];

const RIGHT_COPY = [
  "My process usually starts with reducing ambiguity: what is actually changing for the user, and what can be removed without losing intent.",
  "I design with engineers early, test language as much as layout, and treat interaction details as part of comprehension, not decoration.",
  "Outside client work, I build side experiments to pressure-test ideas quickly and keep my craft honest.",
];

const ease = 0.16;
const influenceRadius = 220;
const maxShift = 18;
const paragraphGap = 22;
const orbRadius = 142;
const orbTop = 132;

function useMagneticEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const desktop = window.matchMedia("(min-width: 1080px)");

    const sync = () => {
      setEnabled(!reduce.matches && finePointer.matches && desktop.matches);
    };

    sync();
    reduce.addEventListener("change", sync);
    finePointer.addEventListener("change", sync);
    desktop.addEventListener("change", sync);

    return () => {
      reduce.removeEventListener("change", sync);
      finePointer.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
    };
  }, []);

  return enabled;
}

function MagneticParagraphColumn({
  paragraphs,
  className,
  wrapSide,
}: {
  paragraphs: string[];
  className?: string;
  wrapSide: "left" | "right";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, inside: false, vx: 0, vy: 0 });
  const boxRef = useRef({ left: 0, top: 0 });
  const lastClientRef = useRef({ x: 0, y: 0, hasValue: false });
  const metasRef = useRef<MagneticMeta[]>([]);
  const rafRef = useRef<number | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const magneticEnabled = useMagneticEnabled();

  const measureLinePositions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    boxRef.current.left = containerRect.left;
    boxRef.current.top = containerRect.top;
    metasRef.current = lineRefs.current.map((line) => {
      if (!line) return { x: 0, y: 0, cx: 0, cy: 0 };
      const rect = line.getBoundingClientRect();
      return {
        x: 0,
        y: 0,
        cx: rect.left - containerRect.left + rect.width / 2,
        cy: rect.top - containerRect.top + rect.height / 2,
      };
    });
  }, []);

  const layoutLines = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    if (width <= 0) return;
    const styles = window.getComputedStyle(container);
    const fontSize = Number.parseFloat(styles.fontSize) || 16;
    const parsedLineHeight = Number.parseFloat(styles.lineHeight);
    const lineHeight = Number.isFinite(parsedLineHeight) ? parsedLineHeight : fontSize * 1.6;
    const font = `${styles.fontWeight} ${fontSize}px ${styles.fontFamily}`;

    let y = lineHeight / 2;
    const getInsetForY = (lineY: number) => {
      const dy = Math.abs(lineY - orbTop);
      if (dy >= orbRadius) return 0;
      const halfChord = Math.sqrt(orbRadius * orbRadius - dy * dy);
      const centerX = wrapSide === "left" ? -48 : width + 48;
      if (wrapSide === "left") {
        const rightEdge = centerX + halfChord;
        return Math.max(0, rightEdge + 8);
      }
      const leftEdge = centerX - halfChord;
      return Math.max(0, width - leftEdge + 8);
    };

    const nextItems: LineItem[] = [];
    paragraphs.forEach((paragraph, paragraphIndex) => {
      const prepared = prepareWithSegments(paragraph, font, {
        whiteSpace: "normal",
        wordBreak: "normal",
      });

      let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
      let lineIndex = 0;
      for (;;) {
        const inset = getInsetForY(y);
        const maxWidth = Math.max(80, width - inset);
        const line = layoutNextLine(prepared, cursor, maxWidth);
        if (!line) break;
        nextItems.push({
          key: `${paragraphIndex}-${lineIndex}`,
          paragraphIndex,
          text: line.text,
          inset,
        });
        cursor = line.end;
        lineIndex += 1;
        y += lineHeight;
      }
      if (paragraphIndex < paragraphs.length - 1) y += paragraphGap;
    });

    setLineItems(nextItems);
  }, [paragraphs, wrapSide]);

  useEffect(() => {
    layoutLines();
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => layoutLines());
    observer.observe(container);
    const fontReady = document.fonts?.ready?.then(() => layoutLines());

    return () => {
      observer.disconnect();
      void fontReady;
    };
  }, [layoutLines]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      lineRefs.current = lineRefs.current.slice(0, lineItems.length);
      measureLinePositions();
    });
    return () => cancelAnimationFrame(id);
  }, [lineItems, measureLinePositions]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tick = () => {
      rafRef.current = null;
      let keepAnimating = pointerRef.current.inside;
      for (let i = 0; i < lineRefs.current.length; i++) {
        const line = lineRefs.current[i];
        const meta = metasRef.current[i];
        if (!line || !meta) continue;

        let targetX = 0;
        let targetY = 0;
        if (magneticEnabled && pointerRef.current.inside) {
          const dx = meta.cx - pointerRef.current.x;
          const dy = meta.cy - pointerRef.current.y;
          const distance = Math.hypot(dx, dy);
          const velocityBoost =
            1 + Math.min(0.45, Math.hypot(pointerRef.current.vx, pointerRef.current.vy) / 900);
          if (distance < influenceRadius) {
            const falloff = 1 - distance / influenceRadius;
            const force = falloff * falloff * maxShift * velocityBoost;
            const ux = dx / Math.max(distance, 0.0001);
            const uy = dy / Math.max(distance, 0.0001);
            targetX = ux * force;
            targetY = uy * force * 0.62;
          }
        }

        meta.x += (targetX - meta.x) * ease;
        meta.y += (targetY - meta.y) * ease;
        pointerRef.current.vx *= 0.86;
        pointerRef.current.vy *= 0.86;
        line.style.transform = `translate3d(${meta.x.toFixed(2)}px, ${meta.y.toFixed(2)}px, 0)`;
        if (Math.abs(meta.x) > 0.06 || Math.abs(meta.y) > 0.06) keepAnimating = true;
      }
      if (keepAnimating) rafRef.current = requestAnimationFrame(tick);
    };

    const ensureRaf = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (!magneticEnabled) return;
      if (lastClientRef.current.hasValue) {
        pointerRef.current.vx = event.clientX - lastClientRef.current.x;
        pointerRef.current.vy = event.clientY - lastClientRef.current.y;
      } else {
        pointerRef.current.vx = 0;
        pointerRef.current.vy = 0;
      }
      lastClientRef.current = { x: event.clientX, y: event.clientY, hasValue: true };
      pointerRef.current.x = event.clientX - boxRef.current.left;
      pointerRef.current.y = event.clientY - boxRef.current.top;
      pointerRef.current.inside = true;
      ensureRaf();
    };

    const onLeave = () => {
      pointerRef.current.inside = false;
      lastClientRef.current.hasValue = false;
      ensureRaf();
    };

    const onViewportChange = () => {
      measureLinePositions();
    };

    container.addEventListener("pointermove", onMove, { passive: true });
    container.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);

    return () => {
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lineRefs.current.forEach((line) => line && (line.style.transform = ""));
    };
  }, [magneticEnabled, measureLinePositions]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        fontFamily: "var(--font-ovo), serif",
        fontSize: "clamp(18px, 1.45vw, 24px)",
        lineHeight: 1.55,
        color: "rgba(255,255,255,0.86)",
      }}
    >
      {lineItems.map((line, index) => {
        const startsNewParagraph =
          index === 0 || lineItems[index - 1].paragraphIndex !== line.paragraphIndex;
        return (
          <p
            key={line.key}
            ref={(node) => {
              lineRefs.current[index] = node;
            }}
            className={startsNewParagraph && index > 0 ? "mt-5" : ""}
            style={{
              willChange: magneticEnabled ? "transform" : "auto",
              paddingLeft: wrapSide === "left" ? `${line.inset.toFixed(2)}px` : undefined,
              paddingRight: wrapSide === "right" ? `${line.inset.toFixed(2)}px` : undefined,
            }}
          >
            {line.text}
          </p>
        );
      })}
    </div>
  );
}

export default function AboutPageClient() {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("nav-theme", { detail: "dark" }));
    return () => {
      window.dispatchEvent(new CustomEvent("nav-theme", { detail: "light" }));
    };
  }, []);

  const shellStyle = useMemo<CSSProperties>(
    () => ({
      backgroundColor: PLAY_SURFACE_BG,
      minHeight: "100%",
      height: "100%",
      overflow: "hidden",
      position: "relative",
    }),
    []
  );

  return (
    <section style={shellStyle}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 60%)" }}
      />
      <img
        src="/Arduino.png"
        alt="Placeholder object on the left"
        className="absolute left-[2vw] top-[4vh] w-[12vw] min-w-[120px] max-w-[230px] object-contain opacity-90"
      />
      <img
        src="/Chess.png"
        alt="Placeholder object on the right"
        className="absolute right-[2vw] top-[4vh] w-[10vw] min-w-[100px] max-w-[180px] object-contain opacity-90"
      />
      <div className="relative z-10 mx-auto w-[94%] max-w-[1500px] h-full grid grid-cols-1 min-[1080px]:grid-cols-[1fr_auto_1fr] gap-8 min-[1080px]:gap-12 items-center px-2 min-[1080px]:px-8">
        <MagneticParagraphColumn paragraphs={LEFT_COPY} className="hidden min-[1080px]:block" wrapSide="left" />
        <div className="flex items-center justify-center select-none">
          <h1
            style={{
              fontFamily: "var(--font-ovo), serif",
              color: "#FFFFFF",
              fontSize: "clamp(64px, 8vw, 136px)",
              lineHeight: 1,
              letterSpacing: "-0.5px",
              textShadow: "0 1px 16px rgba(0,0,0,0.35)",
            }}
          >
            Hi
          </h1>
        </div>
        <MagneticParagraphColumn paragraphs={RIGHT_COPY} className="hidden min-[1080px]:block" wrapSide="right" />
        <div className="min-[1080px]:hidden -mt-6 mx-auto w-[92%] max-w-[760px] text-center">
          <p
            className="text-white/90"
            style={{
              fontFamily: "var(--font-ovo), serif",
              fontSize: "clamp(18px, 4vw, 24px)",
              lineHeight: 1.5,
            }}
          >
            I design digital products that make complex systems feel clear and human. I enjoy working at
            the intersection of interaction design, product strategy, and engineering collaboration.
          </p>
        </div>
      </div>
    </section>
  );
}
