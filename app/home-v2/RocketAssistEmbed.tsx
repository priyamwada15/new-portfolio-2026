"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useCursorDisc } from "./useCursorDisc";
import styles from "./RocketAssistEmbed.module.css";

/** The layout is drawn at the card's full desktop size and scaled to fit. */
const STAGE_W = 1008;

type Inspector = {
  name: string;
  company: string;
  location: string;
  photo: string;
  specialty: { icon: string; label: string };
  inspections: string;
  rating: string;
  summary: [string, string];
};

const INSPECTORS: Inspector[] = [
  {
    name: "Sarah Millerson",
    company: "WIN Home Inspection",
    location: "St Clair Shores, MI",
    photo: "/rocket-assist/sarah.avif",
    specialty: { icon: "home", label: "General Inspector" },
    inspections: "40+ inspections",
    rating: "4.5 (36 reviews)",
    summary: [
      "Clients consistently praise Sarah for her thoroughness, professionalism, and excellent communication throughout the inspection process. She explains the findings clearly and offers helpful suggestions without being pushy, ensuring clients feel comfortable and well-informed.",
      "Her service includes same-day reports and a wide array of inspection options. Clients recommend Sarah for providing prompt and approachable service.",
    ],
  },
  {
    name: "John Cusack",
    company: "Trademark Inspection Services",
    location: "Livonia, MI",
    photo: "/rocket-assist/john.avif",
    specialty: { icon: "pool", label: "Pool Inspector" },
    inspections: "20+ inspections",
    rating: "4.3 (11 reviews)",
    summary: [
      "Clients consistently praise John for his thoroughness, professionalism, and excellent communication throughout the inspection process. He explains the findings clearly and offers helpful suggestions without being pushy, ensuring clients feel comfortable and well-informed.",
      "His service includes same-day reports and a wide array of inspection options. Clients recommend John for providing prompt and approachable service.",
    ],
  },
];

/** Conversation, in order. `typing` beats show the dots before the next assistant message. */
const MESSAGES = [
  { from: "client", text: "How do I find a home inspector?" },
  {
    from: "assistant",
    text: "I'd start off with a general home inspector to cover the overall condition of your home. Since you've got a pool, it’s smart to also bring in a specialist who knows their way around pool inspections too.",
  },
  { from: "assistant", text: "Here are a few inspectors your realtor recommended:" },
] as const;

type Scene = {
  /** How many messages are showing */
  shown: number;
  typing: boolean;
  cards: boolean;
  tap: boolean;
  flipped: boolean;
  index: number;
  fading: boolean;
};

const START: Scene = { shown: 0, typing: false, cards: false, tap: false, flipped: false, index: 0, fading: false };
const FINAL: Scene = { shown: 3, typing: false, cards: true, tap: false, flipped: false, index: 0, fading: false };

/** The loop: each beat sets part of the scene, then waits. About 13s in all. */
const BEATS: { set: Partial<Scene>; wait: number }[] = [
  // Reset while faded out, so the conversation clears out of sight
  { set: { ...START, fading: true }, wait: 450 },
  { set: { fading: false }, wait: 400 },
  { set: { shown: 1 }, wait: 700 },
  { set: { typing: true }, wait: 1100 },
  { set: { typing: false, shown: 2 }, wait: 1500 },
  { set: { typing: true }, wait: 800 },
  { set: { typing: false, shown: 3 }, wait: 600 },
  { set: { cards: true }, wait: 1300 },
  { set: { tap: true }, wait: 450 },
  { set: { tap: false, flipped: true }, wait: 2600 },
  { set: { flipped: false }, wait: 900 },
  { set: { index: 1 }, wait: 2200 },
  { set: { fading: true }, wait: 500 },
];

/** Horizontal drag distance, in px, that swipes to the other card. */
const SWIPE_PX = 40;

/**
 * Live Rocket Assist chat floating on the Rocket Mortgage card: the client asks
 * how to find a home inspector, Rocket Assist answers and offers the inspectors
 * the realtor recommended. Plays as a loop while on screen. On desktop,
 * visitors can flip and swipe the inspector cards (which stops the loop), and
 * the scene around it shows a "read" cursor that opens the case study. On
 * touch screens it's a non-interactive loop. Reduced motion shows the final
 * state.
 */
export function RocketAssistEmbed() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [scene, setScene] = useState<Scene>(START);
  const [interactive, setInteractive] = useState(false);
  // Autoplay runs until a visitor touches the cards; it comes back after the card leaves the screen
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const cursor = useCursorDisc("read");

  // Fit the full-size layout to the card
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / STAGE_W));
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setInteractive(fine.matches);
      setReduced(motion.matches);
    };
    sync();
    fine.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        // Leaving the screen resets the loop, so it starts from the question next time
        if (!entry.isIntersecting) {
          setAuto(true);
          setScene(START);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // The loop
  useEffect(() => {
    if (reduced || !inView || !auto) return;
    let beat = 0;
    let timer: number;
    const run = () => {
      const { set, wait } = BEATS[beat];
      setScene((s) => ({ ...s, ...set }));
      beat = (beat + 1) % BEATS.length;
      timer = window.setTimeout(run, wait);
    };
    run();
    return () => window.clearTimeout(timer);
  }, [inView, auto, reduced]);

  /** A visitor took over: stop the loop and show the whole conversation. */
  const takeOver = useCallback((change: Partial<Scene>) => {
    setAuto(false);
    setScene((s) => ({ ...FINAL, flipped: s.flipped, index: s.index, ...change }));
  }, []);

  const goTo = useCallback(
    (index: number) => takeOver({ index, flipped: false }),
    [takeOver],
  );

  // "read" cursor over the scene: the card link sits under this layer, so watch its media area
  useEffect(() => {
    const root = rootRef.current;
    const link = root?.parentElement?.querySelector("a");
    const media = link?.querySelector<HTMLElement>("[data-card-media]");
    if (!interactive || !link || !media) return;
    const inMedia = (e: PointerEvent) => {
      const r = media.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    };
    const onMove = (e: PointerEvent) => {
      if (inMedia(e)) {
        cursor.show(e);
      } else {
        cursor.hide();
      }
    };
    const onLeave = () => cursor.hide();
    link.addEventListener("pointermove", onMove);
    link.addEventListener("pointerleave", onLeave);
    return () => {
      link.removeEventListener("pointermove", onMove);
      link.removeEventListener("pointerleave", onLeave);
    };
    // cursor's methods only touch refs and state setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  // Reduced motion shows the finished conversation until a visitor flips or swipes
  const view = reduced && auto ? FINAL : scene;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-interactive={interactive || undefined}
      role="group"
      aria-label="Rocket Assist demo: a client asks how to find a home inspector"
    >
      <div
        className={styles.stage}
        style={{ "--scale": scale, opacity: scale ? undefined : 0 } as CSSProperties}
        data-fading={view.fading || undefined}
      >
        <div className={styles.column}>
          <div className={styles.header}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/rocket-assist/rocket-assist-avatar.svg" alt="" width={32} height={32} />
            <span>Rocket Assist</span>
          </div>

          <div className={styles.chat}>
            <div className={styles.thread}>
              {MESSAGES.map((m, i) => (
                <Appear key={i} show={view.shown > i}>
                  <p className={m.from === "client" ? styles.client : styles.assistant}>{m.text}</p>
                </Appear>
              ))}
              <Appear show={view.typing}>
                <span className={styles.typing} aria-label="Rocket Assist is typing">
                  <i />
                  <i />
                  <i />
                </span>
              </Appear>
              <Appear show={view.cards}>
                <Carousel scene={view} interactive={interactive} onFlip={takeOver} onGo={goTo} />
              </Appear>
            </div>
          </div>
        </div>
      </div>
      {cursor.disc}
    </div>
  );
}

/** Grows in from zero height, so earlier messages glide up as it arrives. */
function Appear({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div className={styles.appear} data-show={show || undefined} aria-hidden={!show || undefined} inert={!show}>
      <div className={styles.appearInner}>{children}</div>
    </div>
  );
}

function Carousel({
  scene,
  interactive,
  onFlip,
  onGo,
}: {
  scene: Scene;
  interactive: boolean;
  onFlip: (change: Partial<Scene>) => void;
  onGo: (index: number) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; swiped: boolean } | null>(null);
  const suppressClick = useRef(false);
  const last = INSPECTORS.length - 1;

  // Trackpad swipes arrive as horizontal wheel events
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !interactive) return;
    let sum = 0;
    let cooldown = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (performance.now() < cooldown) return;
      sum += e.deltaX;
      if (Math.abs(sum) > 30) {
        const next = Math.max(0, Math.min(last, scene.index + Math.sign(sum)));
        sum = 0;
        cooldown = performance.now() + 600;
        if (next !== scene.index) onGo(next);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [interactive, scene.index, last, onGo]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    drag.current = { x: e.clientX, swiped: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.swiped) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > SWIPE_PX) {
      d.swiped = true;
      suppressClick.current = true;
      const next = Math.max(0, Math.min(last, scene.index - Math.sign(dx)));
      if (next !== scene.index) onGo(next);
    }
  };
  const onPointerEnd = () => {
    drag.current = null;
  };

  const onCard = (i: number) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (i === scene.index) onFlip({ flipped: !scene.flipped });
    else onGo(i);
  };

  return (
    <div className={styles.carousel}>
      <div
        ref={viewportRef}
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onPointerLeave={onPointerEnd}
      >
        <div className={styles.track} style={{ "--index": scene.index } as CSSProperties}>
          {INSPECTORS.map((p, i) => (
            <InspectorCard
              key={p.name}
              person={p}
              active={i === scene.index}
              side={i < scene.index ? "before" : i > scene.index ? "after" : "current"}
              flipped={i === scene.index && scene.flipped}
              tap={i === scene.index && scene.tap}
              interactive={interactive}
              onClick={() => onCard(i)}
            />
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Previous inspector"
          disabled={!interactive || scene.index === 0}
          onClick={() => onGo(scene.index - 1)}
        >
          <Icon name="chevron-left" size={16} />
        </button>
        <span className={styles.dots} aria-hidden="true">
          {INSPECTORS.map((p, i) => (
            <i key={p.name} data-on={i === scene.index || undefined} />
          ))}
        </span>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Next inspector"
          disabled={!interactive || scene.index === last}
          onClick={() => onGo(scene.index + 1)}
        >
          <Icon name="chevron-right" size={16} />
        </button>
      </div>
    </div>
  );
}

function InspectorCard({
  person,
  active,
  side,
  flipped,
  tap,
  interactive,
  onClick,
}: {
  person: Inspector;
  active: boolean;
  side: "before" | "current" | "after";
  flipped: boolean;
  tap: boolean;
  interactive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.card}
      data-side={side}
      data-flipped={flipped || undefined}
      disabled={!interactive}
      aria-pressed={active ? flipped : undefined}
      aria-label={
        active
          ? `${person.name}, ${person.specialty.label}. ${flipped ? "Showing review summary. Press to see the profile." : "Press to see the review summary."}`
          : `Show ${person.name}`
      }
      onClick={onClick}
    >
      <span className={styles.flip}>
        <span className={`${styles.face} ${styles.front}`} aria-hidden={flipped || undefined}>
          <span className={styles.profile}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={person.photo} alt="" width={64} height={64} className={styles.photo} draggable={false} />
            <span className={styles.who}>
              <span className={styles.name}>{person.name}</span>
              <span className={styles.company}>{person.company}</span>
            </span>
            <span className={styles.meta}>
              <span>{person.location}</span>
              <span className={styles.dot}>•</span>
              <span>ASCHI Certified</span>
            </span>
          </span>
          <span className={styles.stats}>
            <Stat icon={person.specialty.icon} label={person.specialty.label} />
            <Stat icon="task" label={person.inspections} />
            <Stat icon="grade" label={person.rating} />
          </span>
          <span className={styles.call}>Call now</span>
        </span>

        <span className={`${styles.face} ${styles.back}`} aria-hidden={!flipped || undefined}>
          <span className={styles.summary}>
            <span>{person.summary[0]}</span>
            <span>{person.summary[1]}</span>
            <span className={styles.aiNote}>
              <RocketAssistMark />
              AI-generated summary from client reviews.
            </span>
          </span>
          <span className={styles.call}>Call now</span>
        </span>
      </span>
      {tap && <span className={styles.tap} aria-hidden="true" />}
    </button>
  );
}

function Stat({ icon, label }: { icon: string; label: string }) {
  return (
    <span className={styles.stat}>
      <Icon name={icon} size={16} />
      <span>{label}</span>
    </span>
  );
}

/** Material Symbols Rounded (weight 500), tinted with the text colour. */
function Icon({ name, size }: { name: string; size: number }) {
  return (
    <span
      className={styles.icon}
      style={{ "--icon": `url(/rocket-assist/icon-${name}.svg)`, width: size, height: size } as CSSProperties}
      aria-hidden="true"
    />
  );
}

/** The Rocket Assist mark (from rocket-assist-avatar.svg, without its well). */
function RocketAssistMark() {
  return (
    <svg width="16" height="16" viewBox="12 10 24 27" aria-hidden="true" className={styles.mark}>
      <path
        d="M25.7222 21.1623C25.7222 18.7077 27.712 16.7179 30.1666 16.7179C32.6212 16.7179 34.6111 18.7077 34.6111 21.1623V31.5512C34.6111 34.0058 32.6212 35.9957 30.1666 35.9957C27.712 35.9957 25.7222 34.0058 25.7222 31.5512V21.1623Z"
        fill="#111111"
      />
      <path
        d="M14.6111 30.4397C14.6111 27.3714 17.0984 24.8841 20.1666 24.8841C23.2349 24.8841 25.7222 27.3714 25.7222 30.4397C25.7222 33.5079 23.2349 35.9952 20.1666 35.9952C17.0984 35.9952 14.6111 33.5079 14.6111 30.4397Z"
        fill="#111111"
      />
      <path
        d="M20.0395 11.6581C20.064 11.5152 20.2693 11.5152 20.2939 11.6581L20.3099 11.7516C20.8648 14.986 23.3982 17.5194 26.6326 18.0743L26.7261 18.0904C26.8691 18.1149 26.8691 18.3202 26.7261 18.3448L26.6326 18.3608C23.3982 18.9157 20.8648 21.4491 20.3099 24.6835L20.2939 24.777C20.2693 24.92 20.064 24.92 20.0395 24.777L20.0234 24.6835C19.4685 21.4491 16.9351 18.9157 13.7007 18.3608L13.6072 18.3448C13.4643 18.3202 13.4643 18.1149 13.6072 18.0904L13.7007 18.0743C16.9351 17.5194 19.4685 14.986 20.0234 11.7516L20.0395 11.6581Z"
        fill="#DE3341"
      />
    </svg>
  );
}
