"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChartLineUp,
  Code,
  Headset,
  Megaphone,
  PenNib,
  Robot,
  type Icon,
} from "@phosphor-icons/react";
import { mediaPanel } from "@/design-system";

/** Full class strings so Tailwind can see them. */
const AVATAR = {
  blue: "bg-tag-blue-bg text-tag-blue-fg",
  amber: "bg-tag-amber-bg text-tag-amber-fg",
  pink: "bg-tag-pink-bg text-tag-pink-fg",
  teal: "bg-tag-teal-bg text-tag-teal-fg",
  green: "bg-tag-green-bg text-tag-green-fg",
  purple: "bg-tag-purple-bg text-tag-purple-fg",
} as const;

type Bot = { handle: string; color: keyof typeof AVATAR; icon: Icon };

const TEAM_AGENTS: Bot[] = [
  { handle: "asimov-engineering", color: "blue", icon: Code },
  { handle: "asimov-sales", color: "amber", icon: ChartLineUp },
  { handle: "asimov-marketing", color: "pink", icon: Megaphone },
  { handle: "asimov-customer-success", color: "teal", icon: Headset },
  { handle: "asimov-design", color: "green", icon: PenNib },
];

const SHIPPED_AGENT: Bot[] = [{ handle: "asimov", color: "purple", icon: Robot }];

const QUERY = "@asi";
const TYPE_MS = 140;
const ROW_STAGGER_MS = 90;
const HOLD_MS = 3800;

type BoxState = { chars: number; rows: number };
const EMPTY: BoxState = { chars: 0, rows: 0 };

function BotRow({ bot, visible, active }: { bot: Bot; visible: boolean; active: boolean }) {
  const BotIcon = bot.icon;
  return (
    <li
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-[opacity,transform] duration-300 ease-out ${
        active ? "bg-surface-media" : ""
      } ${visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
    >
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-md ${AVATAR[bot.color]}`}
      >
        <BotIcon size={16} weight="bold" aria-hidden="true" />
      </span>
      <span className="min-w-0 truncate font-label text-[14px] font-medium text-primary">{bot.handle}</span>
      <span className="ml-auto shrink-0 rounded border border-border px-[5px] font-label text-[10px] font-semibold leading-[16px] text-tertiary">
        APP
      </span>
    </li>
  );
}

/** A Slack message box with the @-mention autocomplete opening above it. */
function MentionBox({
  label,
  caption,
  bots,
  state,
}: {
  label: string;
  caption: string;
  bots: Bot[];
  state: BoxState;
}) {
  const listOpen = state.rows > 0;
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <p className="font-label text-[12px] font-semibold uppercase leading-[21px] tracking-[0.08em] text-[var(--accent-dark)]">
        {label}
      </p>
      <div className="flex flex-1 flex-col justify-end gap-2">
        <ul
          className={`flex flex-col gap-1 rounded-2xl border border-border bg-surface-case-study p-2 shadow-[0_0_24px_rgba(0,0,0,0.04)] transition-opacity duration-200 ${
            listOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {bots.map((bot, i) => (
            <BotRow key={bot.handle} bot={bot} visible={i < state.rows} active={i === 0} />
          ))}
        </ul>
        <div className="flex h-[46px] items-center rounded-2xl border border-border bg-surface-case-study px-4 font-label text-[14px] text-primary">
          {QUERY.slice(0, state.chars)}
          <span className="ml-[1px] inline-block h-[18px] w-[1.5px] animate-pulse bg-primary" aria-hidden="true" />
        </div>
      </div>
      <p className="font-label text-[14px] leading-[22px] text-secondary">{caption}</p>
    </div>
  );
}

/**
 * The structural decision as a user would feel it: typing "@asi" in Slack
 * lists one agent per team in the early direction, then a single Asimov in
 * what shipped. Plays on a loop while in view; reduced motion shows the end state.
 */
export default function AgentMentionVisual() {
  const ref = useRef<HTMLElement>(null);
  const [left, setLeft] = useState<BoxState>(EMPTY);
  const [right, setRight] = useState<BoxState>(EMPTY);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    const clear = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    /** Types the query, then reveals rows one by one. Returns when the box is done. */
    const playBox = (start: number, set: typeof setLeft, rowCount: number) => {
      for (let c = 1; c <= QUERY.length; c++) at(start + c * TYPE_MS, () => set({ chars: c, rows: 0 }));
      const listStart = start + QUERY.length * TYPE_MS + 250;
      for (let r = 1; r <= rowCount; r++)
        at(listStart + (r - 1) * ROW_STAGGER_MS, () => set({ chars: QUERY.length, rows: r }));
      return listStart + rowCount * ROW_STAGGER_MS + 300;
    };

    const cycle = () => {
      setLeft(EMPTY);
      setRight(EMPTY);
      const leftDone = playBox(400, setLeft, TEAM_AGENTS.length);
      const rightDone = playBox(leftDone + 500, setRight, SHIPPED_AGENT.length);
      at(rightDone + HOLD_MS, cycle);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        clear();
        if (!entry.isIntersecting) return;
        if (reduceMotion) {
          setLeft({ chars: QUERY.length, rows: TEAM_AGENTS.length });
          setRight({ chars: QUERY.length, rows: SHIPPED_AGENT.length });
        } else {
          cycle();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clear();
    };
  }, []);

  return (
    <figure ref={ref} className={`flex w-full items-stretch gap-12 p-12 max-md:flex-col max-md:gap-8 max-md:p-4 ${mediaPanel}`}>
      <MentionBox
        label="Early direction"
        bots={TEAM_AGENTS}
        state={left}
        caption="One agent per team, so five bots to set up, manage and choose between"
      />
      <MentionBox
        label="What shipped"
        bots={SHIPPED_AGENT}
        state={right}
        caption="One agent that held every team's context, with each team's sources managed separately"
      />
    </figure>
  );
}
