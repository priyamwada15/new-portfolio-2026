"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { PLAY_PORTFOLIO_ITEMS, type PlayPortfolioItem } from "@/app/lib/playPortfolio";
import { useSiteHref } from "@/app/lib/reviewPath";
import styles from "./FunWheel.module.css";

const PROJECT_IDS = ["stellar-scan", "the-intelligencer", "robot-duet"];
const PROJECTS = PROJECT_IDS.map((id) => PLAY_PORTFOLIO_ITEMS.find((item) => item.id === id)).filter(
  (item): item is PlayPortfolioItem => Boolean(item),
);
const N = PROJECTS.length;

/**
 * The cards ride the rim of a big wheel whose hub sits far below the section.
 * A card stands upright at the top and leans as the wheel carries it away, so
 * the tilt comes from where it is on the wheel. SLOT_DEG is the angle between
 * neighbouring cards; the wheel's radius follows from the gap between them.
 */
const SLOT_DEG = 16;
/** Slots rendered either side of the top one; the outer ones are off screen. */
const SIDE_SLOTS = 2;
/** A drag past this many px turns the wheel to the next card even if it's let go early. */
const FLICK_PX = 40;
/** Under this many px of movement, a press counts as a click. */
const CLICK_PX = 6;
const SNAP_MS = 650;
/** The first time the section is on screen the cards rise this far (px) and grow from this scale into place. */
const RISE_PX = 160;
const RISE_SCALE = 0.6;
const ENTER_MS = 900;
/** The side cards start their entrance this much later (in entrance progress) than the top card. */
const ENTER_STAGGER = 0.15;

const mod = (n: number, m: number) => ((n % m) + m) % m;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function primaryHref(item: PlayPortfolioItem) {
  return item.experienceCta?.href ?? item.filledCta?.href ?? item.githubLiquidCta?.href ?? "#";
}

/**
 * "Things I've built for fun": three side projects on a wheel that loops
 * forever. Drag or swipe to turn it; on release it eases to the nearest card.
 * Clicking a side card brings it to the top; clicking the top card opens the
 * project. Only the top card plays its video and shows its title. The first
 * time the section scrolls into view, the cards rise and grow into place.
 */
export function FunWheel() {
  const siteHref = useSiteHref();
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef(new Map<number, HTMLAnchorElement>());
  const videoRefs = useRef(new Map<number, HTMLVideoElement>());
  // Wheel position in slots: 0 is the first project at the top, 1 the next, and so on forever.
  const pos = useRef(0);
  const anim = useRef<number | null>(null);
  const drag = useRef<{ id: number; x: number; start: number; moved: number } | null>(null);
  const suppressClick = useRef(false);
  // The card the wheel is on or turning to, so a click mid-turn knows which card is the top one
  const goal = useRef(0);
  const [base, setBase] = useState(0);
  const [settled, setSettled] = useState(0);
  const [inView, setInView] = useState(false);
  const entered = useRef(false);
  // Entrance progress, 0 (cards below, small and hidden) to 1 (in place)
  const enter = useRef(1);

  /** Width of a card plus the gap to the next one (--card-gap in FunWheel.module.css, resolved to px through column-gap). */
  const slotWidth = () => {
    const stage = stageRef.current;
    if (!stage) return 600;
    const cardW = stage.querySelector<HTMLElement>(`.${styles.card}`)?.offsetWidth ?? 520;
    return cardW + (parseFloat(getComputedStyle(stage).columnGap) || 0);
  };

  /** Places every card for the current wheel position. */
  const layout = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const slotPx = slotWidth();
    const radius = slotPx / Math.sin((SLOT_DEG * Math.PI) / 180);
    for (const [k, el] of slotRefs.current) {
      const d = k - pos.current;
      const a = (d * SLOT_DEG * Math.PI) / 180;
      const x = radius * Math.sin(a);
      const y = radius * (1 - Math.cos(a));
      // The top card leads the entrance; its neighbours follow a beat later
      const e =
        enter.current >= 1
          ? 1
          : easeOutCubic(Math.min(1, Math.max(0, enter.current * (1 + ENTER_STAGGER) - Math.abs(d) * ENTER_STAGGER)));
      const rise = (1 - e) * RISE_PX;
      const grow = RISE_SCALE + (1 - RISE_SCALE) * e;
      el.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), ${(y + rise).toFixed(2)}px, 0) rotate(${(d * SLOT_DEG).toFixed(3)}deg) scale(${grow.toFixed(3)})`;
      el.style.opacity = Math.min(1, e * 1.6).toFixed(3);
      // Cards nearer the top sit above the ones further round the wheel
      el.style.zIndex = String(10 - Math.round(Math.abs(d) * 2));
      // The title fades in as the card reaches the top
      el.style.setProperty("--focus", Math.max(0, 1 - Math.abs(d) * 2.5).toFixed(3));
    }
    const nearest = Math.round(pos.current);
    if (nearest !== base) setBase(nearest);
  }, [base]);

  useLayoutEffect(layout, [layout]);

  // Hold the cards below and hidden until the entrance (none with reduced motion)
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    enter.current = 0;
    layout();
    // Mount only: layout is read here once to place the cards
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => layout());
    ro.observe(stage);
    return () => ro.disconnect();
  }, [layout]);

  // Only the card at the top plays, and only while the wheel is on screen
  useEffect(() => {
    for (const [k, video] of videoRefs.current) {
      if (inView && k === settled) video.play().catch(() => {});
      else video.pause();
    }
  }, [settled, inView, base]);

  useEffect(() => () => {
    if (anim.current !== null) cancelAnimationFrame(anim.current);
  }, []);

  const stop = () => {
    if (anim.current !== null) cancelAnimationFrame(anim.current);
    anim.current = null;
  };

  const turnTo = (target: number, ease: (t: number) => number) => {
    stop();
    goal.current = target;
    // Turning the wheel mid-entrance brings the cards fully in
    enter.current = 1;
    const from = pos.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || from === target) {
      pos.current = target;
      layout();
      setSettled(target);
      return;
    }
    let t0: number | null = null;
    const step = (now: number) => {
      t0 ??= now;
      const t = Math.min(1, (now - t0) / SNAP_MS);
      pos.current = from + (target - from) * ease(t);
      layout();
      if (t < 1) anim.current = requestAnimationFrame(step);
      else {
        anim.current = null;
        setSettled(target);
      }
    };
    anim.current = requestAnimationFrame(step);
  };

  /** Rises and grows the cards into place. */
  const playEntrance = () => {
    stop();
    if (enter.current >= 1) return;
    let t0: number | null = null;
    const step = (now: number) => {
      t0 ??= now;
      enter.current = Math.min(1, (now - t0) / ENTER_MS);
      layout();
      anim.current = enter.current < 1 ? requestAnimationFrame(step) : null;
    };
    anim.current = requestAnimationFrame(step);
  };

  // Track whether the section is on screen. The first time it is, the headline and
  // cards come in (the section's data-entered also drives the headline, in home.module.css).
  useEffect(() => {
    const stage = stageRef.current;
    const section = stage?.closest("section") ?? stage;
    if (!stage || !section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting || entered.current) return;
        entered.current = true;
        stage.setAttribute("data-entered", "");
        section.setAttribute("data-entered", "");
        playEntrance();
      },
      { threshold: 0.25 },
    );
    io.observe(section);
    return () => io.disconnect();
    // Set up once; playEntrance only reads refs and the layout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    stop();
    // Grabbing the wheel mid-entrance brings the cards fully in
    enter.current = 1;
    // A fresh press: only a drag from here on should swallow the click that follows it
    suppressClick.current = false;
    drag.current = { id: e.pointerId, x: e.clientX, start: pos.current, moved: 0 };
    // The open hand closes while the wheel is held
    stageRef.current?.setAttribute("data-grabbing", "");
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    d.moved = Math.max(d.moved, Math.abs(dx));
    if (d.moved < CLICK_PX) return;
    if (!stageRef.current?.hasPointerCapture(e.pointerId)) stageRef.current?.setPointerCapture(e.pointerId);
    // Dragging left brings the next card up
    pos.current = d.start - dx / slotWidth();
    layout();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    stageRef.current?.removeAttribute("data-grabbing");
    if (d.moved < CLICK_PX) return;
    suppressClick.current = true;
    const from = Math.round(d.start);
    const dx = e.clientX - d.x;
    // A short flick still moves one card; a longer drag settles on the nearest
    const target = Math.abs(pos.current - from) < 0.5 && Math.abs(dx) > FLICK_PX ? from - Math.sign(dx) : Math.round(pos.current);
    turnTo(target, easeOutCubic);
  };

  const onCardClick = (e: React.MouseEvent, k: number) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      e.preventDefault();
      return;
    }
    // A side card comes to the top; the top card opens its project
    if (k !== goal.current) {
      e.preventDefault();
      turnTo(k, easeInOutCubic);
    }
  };

  const slots = [];
  for (let k = base - SIDE_SLOTS; k <= base + SIDE_SLOTS; k++) slots.push(k);

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {slots.map((k) => {
        const item = PROJECTS[mod(k, N)];
        const href = primaryHref(item);
        const tags = item.tagParts.slice(0, -1);
        // Only the top card and its two neighbours are on screen
        const visible = Math.abs(k - base) <= 1;
        const isTop = k === settled;
        return (
          <a
            key={k}
            ref={(el) => {
              if (el) slotRefs.current.set(k, el);
              else slotRefs.current.delete(k);
            }}
            href={href.startsWith("/") ? siteHref(href) : href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
            onClick={(e) => onCardClick(e, k)}
            onDragStart={(e) => e.preventDefault()}
            aria-hidden={!visible || undefined}
            tabIndex={visible ? undefined : -1}
            aria-label={isTop ? `${item.title}, opens in a new tab` : `Show ${item.title}`}
            style={{ "--focus": isTop ? 1 : 0 } as CSSProperties}
          >
            <video
              ref={(el) => {
                if (el) videoRefs.current.set(k, el);
                else videoRefs.current.delete(k);
              }}
              className={styles.media}
              src={item.videoSrc}
              poster={item.posterSrc}
              aria-label={item.mediaAlt}
              playsInline
              muted
              loop
              preload={isTop ? "metadata" : "none"}
            />
            <span className={styles.meta} aria-hidden={!isTop || undefined}>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.tags}>
                {tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </span>
            </span>
          </a>
        );
      })}
      <p className={styles.status} aria-live="polite">
        {PROJECTS[mod(settled, N)].title}
      </p>
    </div>
  );
}
