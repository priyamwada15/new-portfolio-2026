"use client";

import type { CSSProperties, ReactNode } from "react";
import { DemoIcon, useCardDemo, type Beat } from "./useCardDemo";
import styles from "./AsimovKnowledgeEmbed.module.css";

type Scene = {
  fading: boolean;
  /** The screen's frame is up */
  shell: boolean;
  /** Breadcrumb, toolbar and the table's frame have landed */
  head: boolean;
  /** The table's header and rows have landed, top to bottom */
  rows: boolean;
  /** The details panel has landed */
  panel: boolean;
  /** The camera is pushed in. It only adds detail: the syncing never waits for it or stops for it. */
  zoom: boolean;
  /** The rows that sync, one after another like a queue: pages read so far, started, finished */
  eng: number;
  engDone: boolean;
  cr: number;
  crOn: boolean;
  crDone: boolean;
  onb: number;
  onbOn: boolean;
  onbDone: boolean;
  /** Every row is synced, so the panel's Last synced says so */
  panelNow: boolean;
};

/** The card at its desktop size. The screen fills it edge to edge, like a showcase tile. */
const STAGE = { w: 1008, h: 575 } as const;
/** Space around the screen's top and sides; it runs off the bottom of the card. */
const PAD = 48;
/** Figma's Knowledge Detail frame without its side nav is 1232 wide (see the CSS module). */
const SCREEN_W = 1232;
const K = (STAGE.w - PAD * 2) / SCREEN_W;

/** The three queued rows' page counts. With the rows that are already synced they add up to the panel's total. */
const ENG_FROM = 41;
const ENG_OF = 147;
const CR_OF = 62;
const ONB_OF = 21;
const OTHER_PAGES = 118 + 96 + 38;
const WORKSPACE_PAGES = 578;

/**
 * The push-in lands on Engineering Docs' row (screen px). The centre is chosen so the view's right edge falls
 * in the gap between the table and the details panel, and its left edge just after the file tiles, so no
 * label is cut mid-word at either side.
 */
const ZOOM = 1.7;
const FOCUS = { x: 519, y: 409 } as const;
/**
 * The camera's two states. The screen is laid out at its pushed-in size (see --k and --pad on it), so the
 * pushed-in state is 1:1 with only a pan, and the full view shrinks it by 1 / ZOOM from the top left.
 */
const REST = `scale(${1 / ZOOM})`;
const PUSHED = `translate(${Math.round(STAGE.w / 2 - (PAD + FOCUS.x * K) * ZOOM)}px, ${Math.round(STAGE.h / 2 - (PAD + FOCUS.y * K) * ZOOM)}px)`;

/** An empty screen with Engineering Docs about to sync: where every pass begins. */
const START: Scene = {
  fading: false,
  shell: false,
  head: false,
  rows: false,
  panel: false,
  zoom: false,
  eng: ENG_FROM,
  engDone: false,
  cr: 0,
  crOn: false,
  crDone: false,
  onb: 0,
  onbOn: false,
  onbDone: false,
  panelNow: false,
};

/** The screen once it has assembled, with every row back where it began: where later passes begin */
const BUILT: Scene = { ...START, shell: true, head: true, rows: true, panel: true };

/** The finished screen, for reduced motion: everything has synced. */
const FINAL: Scene = {
  ...START,
  shell: true,
  head: true,
  rows: true,
  panel: true,
  eng: ENG_OF,
  engDone: true,
  cr: CR_OF,
  crOn: true,
  crDone: true,
  onb: ONB_OF,
  onbOn: true,
  onbDone: true,
  panelNow: true,
};

/** A row's pages counting up in even steps, one beat per step */
const count = (key: "eng" | "cr" | "onb", values: number[], wait: number): Beat<Scene>[] =>
  values.map((value) => ({ set: { [key]: value } as Partial<Scene>, wait }));

/**
 * Each pass: the screen assembles from the top and settles, then the syncing starts and never stops
 * until the screen has fully synced. Engineering Docs counts up and finishes, Customer Research leaves
 * Queued and does the same, then Onboarding Playbook. The camera is only a detail view laid over this:
 * it pushes in once Engineering Docs is under way and pulls back while Customer Research is still
 * syncing, and neither move pauses anything. The loop then fades out, empties, and assembles again.
 */
const BEATS: Beat<Scene>[] = [
  // The assembly
  { set: { shell: true }, wait: 350 },
  { set: { head: true }, wait: 450 },
  { set: { rows: true }, wait: 900 },
  { set: { panel: true }, wait: 1000 },

  // Engineering Docs syncs; the camera joins once it is under way
  ...count("eng", [56, 72], 350),
  { set: { eng: 88, zoom: true }, wait: 350 },
  ...count("eng", [104, 120, 135], 350),
  { set: { eng: ENG_OF }, wait: 500 },
  { set: { engDone: true }, wait: 600 },

  // The queue moves on: Customer Research leaves Queued and keeps reading while the camera pulls back
  { set: { crOn: true }, wait: 450 },
  ...count("cr", [12, 24, 36], 380),
  { set: { cr: 44, zoom: false }, wait: 380 },
  ...count("cr", [52, 58], 380),
  { set: { cr: CR_OF }, wait: 450 },
  { set: { crDone: true }, wait: 600 },

  // Then Onboarding Playbook
  { set: { onbOn: true }, wait: 450 },
  ...count("onb", [5, 10, 15], 350),
  { set: { onb: ONB_OF }, wait: 450 },
  { set: { onbDone: true }, wait: 600 },

  // Everything has synced: the panel says so, and the screen holds
  { set: { panelNow: true }, wait: 1500 },

  // The seam: fade out, put every row back to where it began, fade in. The screen stays built
  { set: { fading: true }, wait: 700 },
  { set: { ...BUILT, fading: true }, wait: 250 },
  { set: { fading: false }, wait: 800 },
];

/** Later passes start here, past the assembly, which only plays the first time */
const LOOP_FROM = 4;

const icon = (name: string) => `/asimov-demo/icon-${name}.svg`;

type Kind = "queued" | "syncing" | "done";

/** What changes in a row that syncs during the demo */
type Live = { pages: number; digits: number; kind: Kind; fill: string; last: string[]; lastAt: number };

type Resource = {
  name: string;
  icon: string;
  place: string;
  pages: number;
  of?: number;
  kind: Kind;
  last: string;
};

const RESOURCES: Resource[] = [
  { name: "Product Wiki", icon: "description", place: "Product", pages: 118, of: 214, kind: "done", last: "2 min ago" },
  { name: "Sales Wiki", icon: "description", place: "Sales", pages: 96, kind: "done", last: "1 min ago" },
  { name: "Enterprise Client Summary", icon: "description", place: "Clients", pages: 38, kind: "done", last: "1 min ago" },
  // Engineering Docs is the live row: see below
  { name: "Engineering Docs", icon: "folder-open", place: "Engineering", pages: ENG_FROM, of: ENG_OF, kind: "syncing", last: "In progress" },
  { name: "Customer Research", icon: "table", place: "Research", pages: 0, of: 62, kind: "queued", last: "Queued" },
  { name: "Onboarding Playbook", icon: "description", place: "People", pages: 0, of: 21, kind: "queued", last: "Queued" },
];

/**
 * Asimov's Knowledge screen, drawn from the Tars dashboard frame and sized to fill the card the way the
 * showcase tiles do: the frame's side nav is cropped away and the screen runs off the bottom edge.
 * It assembles from the top, then the queued rows sync one after another without stopping, while the
 * camera pushes in and pulls back over the top for detail. Display-only: the card link sits under it.
 * Reduced motion shows the finished screen.
 */
export function AsimovKnowledgeEmbed() {
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

  // The rows that sync, in queue order. Each reads Queued, then In progress, then Just now.
  const syncRow = (pages: number, of: number, digits: number, on: boolean, done: boolean): Live => ({
    pages,
    digits,
    kind: done ? "done" : on ? "syncing" : "queued",
    fill: done ? "100%" : `${(pages / of) * 100}%`,
    last: ["Queued", "In progress", "Just now"],
    lastAt: done ? 2 : on ? 1 : 0,
  });
  const liveRows: Record<number, Live> = {
    3: syncRow(view.eng, ENG_OF, 3, true, view.engDone),
    4: syncRow(view.cr, CR_OF, 2, view.crOn, view.crDone),
    5: syncRow(view.onb, ONB_OF, 2, view.onbOn, view.onbDone),
  };
  // Pages indexed is always what the rows add up to
  const total = OTHER_PAGES + view.eng + view.cr + view.onb;

  return (
    <div
      ref={rootRef}
      className={`${rootClass} ${styles.root}`}
      {...rootProps}
      aria-label="Asimov demo: the Knowledge screen filling in as Engineering Docs syncs"
    >
      <div {...stageProps}>
        <div className={styles.camera} style={{ transform: view.zoom ? PUSHED : REST }}>
          <div
            className={styles.screen}
            data-in={view.shell || undefined}
            style={{ "--k": K * ZOOM, "--pad": `${PAD * ZOOM}px` } as CSSProperties}
          >
            <div className={`${styles.header} ${styles.drop}`} data-in={view.head || undefined}>
              <span className={styles.crumb}>Knowledge</span>
              <DemoIcon src={icon("chevron-right")} size={18} className={styles.crumbArrow} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/asimov-demo/notion.svg" alt="" width={24} height={24} />
              <span className={styles.crumbHere}>Acme Notion</span>
            </div>

            <div className={styles.body}>
              <div className={styles.section}>
                <div className={`${styles.toolbar} ${styles.drop}`} data-in={view.head || undefined} style={{ "--i": 1 } as CSSProperties}>
                  <div className={styles.tools}>
                    <span className={styles.search}>
                      <DemoIcon src={icon("search")} size={18} />
                      Search resources
                    </span>
                    {["Status", "Type", "Citations"].map((label) => (
                      <span key={label} className={styles.chip}>
                        <svg className={styles.chipStroke} aria-hidden="true">
                          <rect />
                        </svg>
                        <DemoIcon src={icon("add")} size={14} />
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className={styles.actions}>
                    <span className={styles.sync}>
                      <span className={styles.syncMain}>
                        <DemoIcon src={icon("sync")} size={14} />
                        Sync
                      </span>
                      <span className={styles.syncMore}>
                        <DemoIcon src={icon("expand-more")} size={14} />
                      </span>
                    </span>
                    <span className={styles.add}>
                      <DemoIcon src={icon("add")} size={16} />
                      Add Resource
                    </span>
                  </div>
                </div>

                <div className={styles.tableFrame}>
                  <div className={`${styles.table} ${styles.fade}`} data-in={view.head || undefined} style={{ "--i": 2 } as CSSProperties}>
                    <div className={`${styles.thead} ${styles.drop}`} data-in={view.rows || undefined}>
                      <span className={styles.check} data-head />
                      <span className={`${styles.th} ${styles.cName}`}>Name</span>
                      <span className={`${styles.th} ${styles.cLoc}`}>Location</span>
                      <span className={`${styles.th} ${styles.cPages}`}>Pages</span>
                      <span className={`${styles.th} ${styles.cCite}`}>Citations</span>
                      <span className={`${styles.th} ${styles.cStatus}`}>Status</span>
                      <span className={`${styles.th} ${styles.cLast}`}>Last synced</span>
                    </div>

                    {RESOURCES.map((r, i) => {
                      const live = liveRows[i];
                      const kind: Kind = live ? live.kind : r.kind;
                      return (
                        <div
                          key={r.name}
                          className={`${styles.row} ${styles.drop}`}
                          data-in={view.rows || undefined}
                          style={{ "--i": i + 1 } as CSSProperties}
                        >
                          <span className={styles.check} />
                          <span className={`${styles.name} ${styles.cName}`}>
                            <span className={styles.fileTile}>
                              <DemoIcon src={icon(r.icon)} size={20} />
                            </span>
                            {r.name}
                          </span>
                          <span className={`${styles.place} ${styles.cLoc}`}>Acme / {r.place}</span>
                          <span className={`${styles.pages} ${styles.cPages}`}>
                            {live ? <Roll value={live.pages} digits={live.digits} /> : r.pages}
                            {r.of && <span className={styles.of}> / {r.of}</span>}
                          </span>
                          <span className={`${styles.dash} ${styles.cCite}`}>—</span>
                          <span className={`${styles.statusCell} ${styles.cStatus}`}>
                            <Pill kind={kind} fill={live?.fill} />
                          </span>
                          <span className={`${styles.last} ${styles.cLast}`}>
                            {live ? <Slide items={live.last} at={live.lastAt} /> : r.last}
                          </span>
                          <span className={styles.rowEnd}>
                            <span className={styles.more}>
                              <DemoIcon src={icon("more-vert")} size={18} />
                            </span>
                            <DemoIcon src={icon("chevron-right")} size={20} className={styles.rowCaret} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <aside className={`${styles.panel} ${styles.drop}`} data-in={view.panel || undefined}>
                <div className={styles.group}>
                  <p className={styles.groupTitle}>Details</p>
                  <Field label="Workspace" first>
                    <span className={styles.workspace}>
                      <span className={styles.workspaceMark}>
                        <DemoIcon src={icon("spa")} size={14} />
                      </span>
                      Acme
                    </span>
                  </Field>
                  <Field label="Connected by">
                    <span className={styles.workspace}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className={styles.avatar} src="/asimov-demo/user-avatar.png" alt="" width={20} height={20} />
                      You
                    </span>
                  </Field>
                  <Field label="Auto-sync">Every 6 hours</Field>
                  <Field label="Pages indexed">
                    <Roll value={total} digits={3} />
                    <span className={styles.of}> of {WORKSPACE_PAGES}</span>
                  </Field>
                  <Field label="Last synced">
                    <Slide items={["In progress", "Just now"]} at={view.panelNow ? 1 : 0} />
                  </Field>
                  <Field label="Citations, 30 days">
                    <span className={styles.dash}>—</span>
                  </Field>
                </div>

                <div className={styles.group}>
                  <p className={styles.groupTitle}>Contents</p>
                  <Content label="Pages" count={4} icon="description" first />
                  <Content label="Folders" count={1} icon="folder-open" />
                  <Content label="Databases" count={1} icon="table" />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, first, children }: { label: string; first?: boolean; children: ReactNode }) {
  return (
    <div className={styles.field} data-first={first || undefined}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{children}</span>
    </div>
  );
}

function Content({ label, count, icon: name, first }: { label: string; count: number; icon: string; first?: boolean }) {
  return (
    <div className={styles.content} data-first={first || undefined}>
      <span className={styles.contentLabel}>
        <DemoIcon src={icon(name)} size={18} />
        {label}
      </span>
      <span className={styles.contentCount}>{count}</span>
    </div>
  );
}

/** A number whose digits roll like an odometer. Each place keeps its own column, so a new digit grows in. */
function Roll({ value, digits }: { value: number; digits: number }) {
  const text = String(value).padStart(digits, " ");
  return (
    <span className={styles.roll} aria-label={String(value)}>
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
function Slide({ items, at, height = 17 }: { items: string[]; at: number; height?: number }) {
  return (
    <span className={styles.slide} style={{ "--h": `${height}px` } as CSSProperties}>
      <span className={styles.slideStrip} style={{ "--n": at } as CSSProperties}>
        {items.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </span>
    </span>
  );
}

const KINDS: Kind[] = ["queued", "syncing", "done"];
const LABEL: Record<Kind, string> = { queued: "Queued", syncing: "Syncing", done: "Synced" };

/** Training status: Queued, Syncing (a fill moves across the pill as pages are read) or Synced. */
function Pill({ kind, fill }: { kind: Kind; fill?: string }) {
  return (
    <span className={styles.pill} data-kind={kind} style={{ "--fill": fill ?? "0%" } as CSSProperties}>
      <span className={styles.pillFill} aria-hidden="true" />
      <span className={styles.pillIcon} aria-hidden="true">
        <span data-on={kind === "queued" || undefined}>
          <DemoIcon src={icon("spinner")} size={14} className={styles.spin} />
        </span>
        <span data-on={kind === "syncing" || undefined}>
          <DemoIcon src={icon("hourglass-empty")} size={16} />
        </span>
        <span data-on={kind === "done" || undefined}>
          <DemoIcon src={icon("check-circle")} size={16} />
        </span>
      </span>
      <span className={styles.pillText}>
        <Slide items={KINDS.map((k) => LABEL[k])} at={KINDS.indexOf(kind)} height={20} />
      </span>
    </span>
  );
}
