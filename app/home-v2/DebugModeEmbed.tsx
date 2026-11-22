"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  ArrowSquareOut,
  CheckCircle,
  CornersOut,
  DotsThreeVertical,
  Eye,
  LockKeyOpen,
  Minus,
  PaperPlaneRight,
  Plus,
  WarningCircle,
} from "@phosphor-icons/react";
import { DemoIcon, useCardDemo, type Beat } from "./useCardDemo";
import styles from "./DebugModeEmbed.module.css";

/** The chat panel's controls are Material icons in the Figma frame (bug_report, pause, refresh, stop, close) */
const icon = (name: string) => `/debug-demo/icon-${name}.svg`;

/** The card's size: the screen fills it, the way the showcase tiles and the Asimov demo do. */
const STAGE = { w: 1008, h: 575 } as const;
/** Space around the screen's top and sides; it runs off the bottom of the card. */
const PAD = 48;
/** Figma's Digital Banking Chatbot frame without its side nav is 1429 wide and 960 tall. */
const SCREEN_W = 1429;
const K = (STAGE.w - PAD * 2) / SCREEN_W;

/* The canvas, in Figma px. Gambit positions are the frame's own, moved into the board's coordinates. */
const BOARD = { w: 965, h: 760 } as const;
const CARD_W = 218.33;
const CARD_H = 140.35;
const TAB_W = 14.04;
const TAB_STEP = 23.39;
const TAB_TOP = 151.27;
const TAB_H = 15.59;

type Gambit = { id: string; label: string; x: number; y: number; to: string[] };

/** Figma positions are in a frame 328px right of and 8px above the board's corner. */
const at = (id: string, label: string, fx: number, fy: number, to: string[] = []): Gambit => ({
  id,
  label,
  x: fx - 328,
  y: fy + 8,
  to,
});

/**
 * A slice of the Digital Banking Chatbot's flow, from the Tars frame. Each gambit's tabs run to its children,
 * left to right. The test run takes the Credit Limit Increase branch.
 */
const GAMBITS: Gambit[] = [
  at("113", "Greeting Gambit", 650.3, 51.46, ["115", "114", "122", "128"]),
  at("114", "Preferences", 601.81, 300.69, ["117", "112"]),
  at("122", "Add-ons", 841.15, 314.59, ["124", "126"]),
  at("115", "Credit Limit Increase", 380.04, 412.28, ["118", "119", "155"]),
  at("128", "Dashboards", 1100.11, 410.27, ["127"]),
  at("124", "Extensions", 776.76, 623.45),
  at("126", "APIs", 1038.59, 630.61),
  at("117", "Utilities", 343.55, 722.55),
  at("112", "Options", 968, 942.71),
  at("127", "Widgets", 1300.42, 597.7, ["154"]),
  at("154", "Reviews", 1329.03, 850.94),
  at("118", "Platinum Eligibility", 107, 968.64),
  at("119", "Rewards Eligibility", 380.04, 968.64, ["120", "136", "135"]),
  at("155", "Business Eligibility", 653, 968.64),
  at("120", "Tools", 107, 1252),
  at("136", "Alerts", 380.04, 1252, ["137"]),
  at("135", "Notifications", 653, 1252),
  at("137", "Reminders", 380.04, 1510),
];

const byId: Record<string, Gambit> = Object.fromEntries(GAMBITS.map((g) => [g.id, g]));

/** The test run: Greeting Gambit, then Credit Limit Increase, then Rewards Eligibility, which fails. */
const PATH = ["113", "115", "119"];
const FAILED = PATH.length - 1;

const R = 6.24;

/** A connector from a tab under the parent to the notch on top of the child, with rounded elbows */
function elbow(parentId: string, childId: string) {
  const parent = byId[parentId];
  const child = byId[childId];
  const i = parent.to.indexOf(childId);
  const n = parent.to.length;
  const first = parent.x + (CARD_W - (n * TAB_W + (n - 1) * (TAB_STEP - TAB_W))) / 2;
  const x1 = first + i * TAB_STEP + TAB_W / 2;
  const y1 = parent.y + TAB_TOP + TAB_H;
  const x2 = child.x + CARD_W / 2;
  const y2 = child.y;
  const mid = Math.min(y1 + 30 + i * 12, y2 - 14);
  const dx = x2 - x1;
  if (Math.abs(dx) < 1) return `M ${x1} ${y1} V ${y2}`;
  const r = Math.min(R, Math.abs(dx) / 2);
  const d = Math.sign(dx);
  return `M ${x1} ${y1} V ${mid - r} Q ${x1} ${mid} ${x1 + d * r} ${mid} H ${x2 - d * r} Q ${x2} ${mid} ${x2} ${mid + r} V ${y2}`;
}

const EDGES = GAMBITS.flatMap((g) => g.to.map((c) => ({ from: g.id, to: c, d: elbow(g.id, c) })));

/** Before Debug Mode starts the whole flow is in view, zoomed out: the Greeting Gambit near the top, the rest running off the edges */
const OVERVIEW = { x: 197, y: 17, s: 0.66 };

/** The gambit under test sits at the top of the canvas, centred across it, so what branches off it is in view below */
const TOP_GAP = 64;

/** Once Debug Mode starts the camera is at 1:1, following the run from gambit to gambit */
function cameraFor(zoomed: boolean, index: number) {
  if (!zoomed) return OVERVIEW;
  const g = byId[PATH[index]];
  return {
    s: 1,
    x: Math.round(BOARD.w / 2 - (g.x + CARD_W / 2)),
    y: Math.round(TOP_GAP - g.y),
  };
}

type Pressed = "debug" | null;

type Scene = {
  fading: boolean;
  /** The screen's frame is up */
  shell: boolean;
  /** Title and toolbar have landed */
  head: boolean;
  /** The canvas and its gambits have landed */
  board: boolean;
  /** The Chatbot Preview panel has landed */
  chat: boolean;
  /** Which control is being tapped */
  pressed: Pressed;
  /** Debug Mode is on: the status bar opens and every gambit but the one under test dims */
  debug: boolean;
  /** Index in PATH of the gambit the run has reached */
  at: number;
  /** The gambit the camera is centred on: it sets off with the signal, so the canvas moves along with it */
  cam: number;
  /** The signal is travelling to the next gambit */
  travel: boolean;
  /** Gambits tested so far */
  tested: number;
  /** Chat messages shown after the greeting: 1 user asks, 2 bot offers cards, 3 user picks one, 4 bot checks */
  msgs: number;
  typing: boolean;
  failed: boolean;
};

const START: Scene = {
  fading: false,
  shell: false,
  head: false,
  board: false,
  chat: false,
  pressed: null,
  debug: false,
  at: 0,
  cam: 0,
  travel: false,
  tested: 0,
  msgs: 0,
  typing: false,
  failed: false,
};

/** The screen once it has assembled, zoomed out with nothing run: where later passes begin */
const BUILT: Scene = { ...START, shell: true, head: true, board: true, chat: true };

/** The finished screen, for reduced motion: the run has failed on Rewards Eligibility. */
const FINAL: Scene = {
  ...START,
  shell: true,
  head: true,
  board: true,
  chat: true,
  debug: true,
  at: FAILED,
  cam: FAILED,
  tested: 3,
  msgs: 4,
  typing: true,
  failed: true,
};

/**
 * The first pass assembles the screen from the top, zoomed out. Debug Mode is then switched on and the camera
 * zooms in. The customer asks for a higher credit limit and the signal runs to Credit Limit Increase, with the
 * camera travelling alongside it and the chat answering in step. The customer picks a card, the run moves on
 * to Rewards Eligibility and fails there: the gambit turns red, the status line says so and the bot's reply
 * never arrives. The loop then fades out and starts over from the zoomed-out view; the screen is not rebuilt.
 */
const BEATS: Beat<Scene>[] = [
  // The assembly: plays on the first pass only
  { set: { shell: true }, wait: 350 },
  { set: { head: true }, wait: 450 },
  { set: { board: true, chat: true }, wait: 1300 },

  // Debug Mode switches on: the camera zooms in on the Greeting Gambit and the run begins
  { set: { pressed: "debug" }, wait: 350 },
  { set: { pressed: null, debug: true, tested: 1 }, wait: 1500 },
  { set: { msgs: 1 }, wait: 800 },

  // The signal runs to Credit Limit Increase and the camera travels with it
  { set: { travel: true, cam: 1 }, wait: 1050 },
  { set: { at: 1, travel: false, tested: 2, typing: true }, wait: 1100 },
  { set: { typing: false, msgs: 2 }, wait: 1300 },

  // The customer picks a card and the run reaches Rewards Eligibility, which fails
  { set: { msgs: 3 }, wait: 800 },
  { set: { travel: true, cam: 2 }, wait: 1050 },
  { set: { at: 2, travel: false, tested: 3, msgs: 4, typing: true }, wait: 800 },
  { set: { failed: true }, wait: 3800 },

  // The seam: fade out, zoom back out and clear the run, fade in. The screen stays built
  { set: { fading: true }, wait: 700 },
  { set: { ...BUILT, fading: true }, wait: 250 },
  { set: { fading: false }, wait: 1100 },
];

/** Later passes start here, past the assembly, which only plays the first time */
const LOOP_FROM = 4;

const STATUS = ["Debugging ongoing", "Failed: Rewards Eligibility"];

/**
 * Debug Mode's screen, drawn from the Tars "Digital Banking Chatbot" frame and sized to fill the card the way
 * the Asimov demo is: the side nav is cropped away and the screen runs off the bottom edge. It assembles from
 * the top, then a test run steps through the flow while the chatbot answers in the panel beside it. Display-only:
 * the card link sits under it. Reduced motion shows the finished screen.
 */
export function DebugModeEmbed() {
  const { rootRef, view, rootProps, rootClass, stageProps } = useCardDemo({
    start: START,
    final: FINAL,
    beats: BEATS,
    loopFrom: LOOP_FROM,
    stage: STAGE,
    // The assembly only plays once the card is properly on screen, never early offscreen
    startRatio: 0.6,
    startMargin: "0px",
  });

  const cam = cameraFor(view.debug, view.cam);
  const focusId = view.debug ? PATH[view.at] : null;
  const hop = view.travel && view.at < FAILED ? { from: PATH[view.at], to: PATH[view.at + 1] } : null;
  const hopEdge = hop ? EDGES.find((e) => e.from === hop.from && e.to === hop.to) : null;
  const statusAt = view.failed ? 1 : 0;
  const statusKind = view.failed ? "failed" : "running";

  return (
    <div
      ref={rootRef}
      className={`${rootClass} ${styles.root}`}
      {...rootProps}
      aria-label="Debug Mode demo: a test run steps through a chatbot flow and fails at the Rewards Eligibility gambit"
    >
      <div {...stageProps}>
        <div
          className={styles.screen}
          data-in={view.shell || undefined}
          style={{ "--k": K, "--pad": `${PAD}px` } as CSSProperties}
        >
          <div className={styles.main}>
            <div className={`${styles.header} ${styles.drop}`} data-in={view.head || undefined}>
              <span className={styles.title}>
                <Bank />
                Digital Banking Chatbot
              </span>
              <span className={styles.actions}>
                <span className={styles.publish}>Publish Chatbot</span>
                <span className={styles.previewBtn}>
                  <Eye size={20} />
                </span>
                <span className={styles.openBtn}>
                  <ArrowSquareOut size={20} />
                </span>
              </span>
            </div>

            <div className={styles.section}>
              <div className={`${styles.filters} ${styles.drop}`} data-in={view.head || undefined} style={{ "--i": 1 } as CSSProperties}>
                <span className={styles.addGambit}>
                  <Plus size={20} />
                  Add Gambit
                </span>
                <span className={styles.viewLabel}>Build View: 253 Gambits</span>
                <span className={styles.dots}>
                  <DotsThreeVertical size={20} weight="bold" />
                </span>
              </div>

              <div className={styles.work}>
                <div className={`${styles.board} ${styles.fade}`} data-in={view.board || undefined} style={{ "--i": 2 } as CSSProperties}>
                  <div
                    className={styles.world}
                    data-live={view.debug || undefined}
                    style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})` }}
                  >
                    <div className={styles.grid} />
                    <svg className={styles.edges} aria-hidden="true">
                      {EDGES.map((e) => {
                        const k = PATH.indexOf(e.from);
                        const onRun = k >= 0 && PATH[k + 1] === e.to;
                        const lit = view.debug && onRun && k < view.at;
                        const flowing = onRun && hop?.from === e.from;
                        return (
                          <path
                            key={`${e.from}-${e.to}`}
                            d={e.d}
                            className={styles.edge}
                            data-lit={lit || undefined}
                            data-flow={flowing || undefined}
                          />
                        );
                      })}
                    </svg>

                    {hopEdge && (
                      <span
                        key={`${hopEdge.from}-${hopEdge.to}`}
                        className={styles.signal}
                        style={{ offsetPath: `path("${hopEdge.d}")` } as CSSProperties}
                        aria-hidden="true"
                      />
                    )}

                    {GAMBITS.map((g, i) => {
                      const tabs = g.to.length;
                      const first = (CARD_W - (tabs * TAB_W + (tabs - 1) * (TAB_STEP - TAB_W))) / 2;
                      const active = focusId === g.id;
                      const failed = view.failed && g.id === PATH[FAILED];
                      const k = PATH.indexOf(g.id);
                      const passed = view.debug && k >= 0 && k < view.at;
                      return (
                        <div
                          key={g.id}
                          className={`${styles.place} ${styles.drop}`}
                          data-in={view.board || undefined}
                          style={{ left: g.x, top: g.y, "--i": 3 + i * 0.45 } as CSSProperties}
                        >
                          <div
                            className={styles.gambit}
                            data-dim={(view.debug && !active) || undefined}
                            data-passed={passed || undefined}
                            data-active={(active && !failed) || undefined}
                            data-failed={failed || undefined}
                          >
                            <span className={styles.notch} />
                            <span className={styles.glow} />
                            <span className={styles.ring} />
                            <span className={styles.card}>
                              <span className={styles.num}>{g.id}</span>
                              <span className={styles.label}>{g.label}</span>
                              {k >= 0 && (
                                <span className={styles.state}>
                                  <span className={styles.stateIcon} data-kind="passed" data-on={passed || undefined}>
                                    <CheckCircle size={18} weight="fill" />
                                  </span>
                                  <span className={styles.stateIcon} data-kind="active" data-on={(active && !failed) || undefined}>
                                    <i />
                                  </span>
                                  <span className={styles.stateIcon} data-kind="failed" data-on={failed || undefined}>
                                    <WarningCircle size={18} weight="fill" />
                                  </span>
                                </span>
                              )}
                            </span>
                            {Array.from({ length: tabs }, (_, t) => (
                              <span key={t} className={styles.tab} style={{ left: first + t * TAB_STEP }} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <span className={styles.badge} data-in={view.debug || undefined}>
                    <span className={styles.badgeDot} />
                    <span className={styles.badgeText}>
                      <Roll value={view.tested} digits={1} height={18} />
                      /253 Gambits Tested
                    </span>
                  </span>

                  <span className={styles.zoom}>
                    <span className={styles.zoomBtn} data-first>
                      <Plus size={10} />
                    </span>
                    <span className={styles.zoomBtn}>
                      <Minus size={10} />
                    </span>
                    <span className={styles.zoomBtn}>
                      <CornersOut size={10} />
                    </span>
                    <span className={styles.zoomBtn} data-last>
                      <LockKeyOpen size={10} />
                    </span>
                  </span>
                </div>

                <aside className={`${styles.chat} ${styles.drop}`} data-in={view.chat || undefined} style={{ "--i": 1 } as CSSProperties}>
                  <div className={styles.chatHead}>
                    <span className={styles.chatTitle}>Chatbot Preview</span>
                    <span className={styles.chatBtns}>
                      <span className={styles.debugBtn} data-pressed={view.pressed === "debug" || undefined}>
                        <DemoIcon src={icon("bug-report")} size={22} />
                      </span>
                      <span className={styles.closeBtn}>
                        <DemoIcon src="/asimov-demo/icon-close.svg" size={20} />
                      </span>
                    </span>
                  </div>

                  <div className={styles.barWrap} data-open={view.debug || undefined}>
                    <div className={styles.bar}>
                      <span className={styles.status} data-kind={statusKind}>
                        <span className={styles.statusDot} />
                        <Slide items={STATUS} at={statusAt} height={21} />
                      </span>
                      <span className={styles.controls} data-kind={statusKind}>
                        <span className={styles.ctl} data-main>
                          <DemoIcon src={icon("pause-circle")} size={20} />
                        </span>
                        <span className={styles.ctl} data-restart>
                          <DemoIcon src={icon("refresh")} size={20} />
                        </span>
                        <span className={styles.ctl}>
                          <DemoIcon src={icon("stop")} size={20} />
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className={styles.area}>
                    <div className={styles.widget}>
                      <div className={styles.widgetHead}>
                        <span className={styles.brand}>
                          Chatbot
                          <Bolt />
                          TARS
                        </span>
                        <span className={styles.widgetRow}>
                          <span className={styles.widgetWho}>
                            <TarsMark size={26} />
                            <span className={styles.who}>
                              <span className={styles.whoName}>Tars Technologies</span>
                              <span className={styles.whoMeta}>
                                <i />
                                Online
                              </span>
                            </span>
                          </span>
                          <DotsThreeVertical size={16} weight="bold" />
                        </span>
                      </div>

                      <div className={styles.thread}>
                        <div className={styles.botRow}>
                          <TarsMark size={22} />
                          <span className={styles.bubble}>
                            Hi! I can help you with your credit card requests. What would you like to do today?
                          </span>
                        </div>

                        <Msg show={view.msgs >= 1}>
                          <div className={styles.userRow}>
                            <span className={styles.userBubble}>Increase my credit limit</span>
                          </div>
                        </Msg>

                        <Msg show={view.msgs >= 2}>
                          <div className={styles.botRow} data-top>
                            <TarsMark size={22} />
                            <div className={styles.botCol}>
                              <span className={styles.bubble}>Sure, I can help with that. Please select your card:</span>
                              <div className={styles.chips}>
                                <span className={styles.cardChip}>Platinum Card</span>
                                <span className={styles.cardChip} data-picked={view.msgs >= 3 || undefined}>
                                  Rewards Card
                                </span>
                                <span className={styles.cardChip}>Business Card</span>
                              </div>
                            </div>
                          </div>
                        </Msg>

                        <Msg show={view.msgs >= 3}>
                          <div className={styles.userRow}>
                            <span className={styles.userBubble}>Rewards Card</span>
                          </div>
                        </Msg>

                        <Msg show={view.msgs >= 4}>
                          <div className={styles.botRow}>
                            <TarsMark size={22} />
                            <span className={styles.bubble}>Got it. Let me check your eligibility.</span>
                          </div>
                        </Msg>

                        <Msg show={view.typing}>
                          <div className={styles.botRow}>
                            <TarsMark size={22} />
                            <span className={styles.typing} data-stalled={view.failed || undefined}>
                              <i />
                              <i />
                              <i />
                            </span>
                          </div>
                        </Msg>
                      </div>

                      <div className={styles.input}>
                        <span className={styles.field}>Type your message</span>
                        <span className={styles.send}>
                          <PaperPlaneRight size={15} weight="fill" />
                        </span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A chat message that opens its space and rises in, so the ones above stay where they are */
function Msg({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div className={styles.msg} data-in={show || undefined}>
      <div className={styles.msgInner}>
        <div className={styles.msgPad}>{children}</div>
      </div>
    </div>
  );
}

/** A number whose digits roll like an odometer */
function Roll({ value, digits, height }: { value: number; digits: number; height: number }) {
  const text = String(value).padStart(digits, " ");
  return (
    <span className={styles.roll} style={{ "--lh": `${height}px` } as CSSProperties} aria-label={String(value)}>
      {Array.from(text, (ch, i) => {
        const place = digits - 1 - i;
        const empty = ch === " ";
        return (
          <span key={place} className={styles.rollCol} data-empty={empty || undefined} aria-hidden="true">
            <span className={styles.rollStrip} style={{ "--d": empty ? 0 : Number(ch) } as CSSProperties}>
              {Array.from({ length: 10 }, (_, d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** Lines of text stacked in a window; the shown one slides up and the next comes in from below. */
function Slide({ items, at: shown, height }: { items: string[]; at: number; height: number }) {
  return (
    <span className={styles.slide} style={{ "--h": `${height}px` } as CSSProperties}>
      <span className={styles.slideStrip} style={{ "--n": shown } as CSSProperties}>
        {items.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </span>
    </span>
  );
}

/** Tars' mark: a purple disc with the document glyph */
function TarsMark({ size }: { size: number }) {
  return (
    <span className={styles.mark} style={{ width: size, height: size }}>
      <svg width={size * 0.42} height={size * 0.46} viewBox="0 0 10 11" aria-hidden="true">
        <rect x="0" y="0" width="10" height="2.4" rx="1.2" fill="#fff" />
        <rect x="0" y="4.3" width="10" height="2.4" rx="1.2" fill="#fff" />
        <rect x="0" y="8.6" width="6" height="2.4" rx="1.2" fill="#fff" />
      </svg>
    </span>
  );
}

function Bolt() {
  return (
    <svg width="6" height="8" viewBox="0 0 6 8" aria-hidden="true">
      <path d="M3.6 0.4 0.6 4.4h2L2.2 7.6l3.2-4.2h-2.1z" fill="#ffc83d" stroke="#ffc83d" strokeWidth="0.4" strokeLinejoin="round" />
    </svg>
  );
}

/** The bank emoji beside the chatbot's name */
function Bank() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.4 1 8.2h22z" fill="#66757f" />
      <rect x="2.3" y="9" width="19.4" height="1.6" fill="#aab8c2" />
      <rect x="3.7" y="10.6" width="2.6" height="9" fill="#ccd6dd" />
      <rect x="8.2" y="10.6" width="2.6" height="9" fill="#ccd6dd" />
      <rect x="13.2" y="10.6" width="2.6" height="9" fill="#ccd6dd" />
      <rect x="17.7" y="10.6" width="2.6" height="9" fill="#ccd6dd" />
      <rect x="1.4" y="19.6" width="21.2" height="2" fill="#aab8c2" />
      <rect x="0.4" y="21.6" width="23.2" height="1.6" fill="#ccd6dd" />
    </svg>
  );
}
