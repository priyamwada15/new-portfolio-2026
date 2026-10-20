"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { DemoIcon, useCardDemo, type Beat } from "./useCardDemo";
import styles from "./AsimovKnowledgeEmbed.module.css";

type Status = "not" | "s1" | "s2" | "s3" | "s4" | "done";
type RowId = "product" | "sales" | "enterprise";

type Scene = {
  fading: boolean;
  listIn: boolean;
  /** The Add Knowledge modal */
  modal: boolean;
  connected: boolean;
  name: string;
  addReady: boolean;
  /** Where the scripted tap lands */
  tap: "add" | "connect" | "submit" | null;
  count: number;
  newRow: boolean;
  status: Status;
  open: Record<RowId, boolean>;
  pages: number;
  syncedNow: boolean;
  answer: boolean;
};

const NAME = "Product Wiki";
const PAGES = 214;

const START: Scene = {
  fading: false,
  listIn: false,
  modal: false,
  connected: false,
  name: "",
  addReady: false,
  tap: null,
  count: 2,
  newRow: false,
  status: "not",
  open: { product: false, sales: false, enterprise: false },
  pages: 0,
  syncedNow: false,
  answer: false,
};

const FINAL: Scene = {
  ...START,
  listIn: true,
  connected: true,
  name: NAME,
  addReady: true,
  count: 3,
  newRow: true,
  status: "done",
  open: { product: true, sales: false, enterprise: false },
  pages: PAGES,
  syncedNow: true,
  answer: true,
};

/** From the moment a source is added: it syncs, opens to show its details, then an answer cites it. */
const SYNC_STEPS: Beat<Scene>[] = [
  { set: { status: "s1" }, wait: 900 },
  { set: { status: "s2", open: { product: true, sales: false, enterprise: false } }, wait: 700 },
  // Pages count up while the pill fills
  { set: { pages: 31 }, wait: 300 },
  { set: { pages: 74 }, wait: 300 },
  { set: { pages: 118, status: "s3" }, wait: 300 },
  { set: { pages: 152 }, wait: 300 },
  { set: { pages: 181, status: "s4" }, wait: 300 },
  { set: { pages: 203 }, wait: 300 },
  { set: { pages: PAGES }, wait: 500 },
  { set: { status: "done", syncedNow: true }, wait: 1600 },
  { set: { answer: true }, wait: 4200 },
];

/** The scene right after a source is added, before it syncs. */
const ADDED: Partial<Scene> = {
  tap: null,
  modal: false,
  count: 3,
  newRow: true,
  status: "not",
  pages: 0,
  syncedNow: false,
  answer: false,
};

/** The loop, about 22s: add a Notion source, watch it sync, then see an answer cite it. */
const BEATS: Beat<Scene>[] = [
  // Reset while faded out
  { set: { ...START, fading: true }, wait: 700 },
  { set: { fading: false }, wait: 200 },
  { set: { listIn: true }, wait: 1600 },
  { set: { tap: "add" }, wait: 700 },
  { set: { tap: null, modal: true }, wait: 1400 },
  { set: { tap: "connect" }, wait: 700 },
  { set: { tap: null, connected: true }, wait: 1200 },
  // The name types in
  ...Array.from(NAME, (_, i) => ({ set: { name: NAME.slice(0, i + 1) }, wait: i === NAME.length - 1 ? 500 : 90 })),
  { set: { addReady: true }, wait: 700 },
  { set: { tap: "submit" }, wait: 700 },
  { set: ADDED, wait: 1400 },
  ...SYNC_STEPS,
  { set: { fading: true }, wait: 700 },
];

/** Opening frame when the card scrolls into view: the new source already syncing, its details open. */
const ENTRY = {
  scene: {
    ...START,
    listIn: true,
    connected: true,
    name: NAME,
    addReady: true,
    ...ADDED,
    status: "s2" as Status,
    open: { product: true, sales: false, enterprise: false },
    pages: 74,
  },
  beat: BEATS.findIndex((b) => b.set.pages === 74),
};

type Resource = {
  id: RowId;
  name: string;
  location: string;
  pages: number;
  lastSynced: [string, string];
};

const SYNCED: Resource[] = [
  { id: "sales", name: "Sales Wiki", location: "Sales", pages: 96, lastSynced: ["2 days ago", "Auto-sync on"] },
  {
    id: "enterprise",
    name: "Enterprise Client Summary",
    location: "Clients",
    pages: 38,
    lastSynced: ["Yesterday", "Auto-sync on"],
  },
];

const icon = (name: string) => `/asimov-demo/icon-${name}.svg`;

/**
 * Asimov's knowledge base, floating on the library scene: an admin adds a
 * Notion source through the Add Knowledge modal, it syncs (the status pill
 * fills as pages are read), and an answer then cites it. Values come from the
 * Tars dashboard frames (see docs/superpowers/specs/2026-10-20-asimov-coded-ui-design.md).
 * Desktop: the whole flow is clickable (add, connect, name, add, expand rows),
 * which stops the loop. Touch screens get a non-interactive loop; reduced
 * motion shows the finished list.
 */
export function AsimovKnowledgeEmbed() {
  // Timers for a sync the visitor started themselves
  const syncTimers = useRef<number[]>([]);
  const clearSync = () => {
    syncTimers.current.forEach((t) => window.clearTimeout(t));
    syncTimers.current = [];
  };
  useEffect(() => clearSync, []);

  const { rootRef, uiRef, view, interactive, takeOver, rootProps, rootClass, stageProps, chrome } = useCardDemo({
    start: START,
    final: FINAL,
    beats: BEATS,
    sideClear: { left: 24, right: 24 },
    onReset: clearSync,
    entry: ENTRY,
  });

  /** The list as it stands, or the finished one if the loop hadn't got that far. */
  const settled = (s: Scene): Scene => (s.listIn ? { ...s, fading: false, tap: null } : { ...FINAL, open: s.open });

  const toggle = (id: RowId) => takeOver((s) => ({ ...settled(s), open: { ...settled(s).open, [id]: !settled(s).open[id] } }));

  const openModal = () => {
    clearSync();
    takeOver((s) => ({ ...settled(s), modal: true, connected: false, name: "", addReady: false }));
  };
  const closeModal = () => takeOver((s) => ({ ...s, modal: false }));
  const connect = () => takeOver((s) => ({ ...s, connected: true, addReady: s.name.trim().length > 0 }));
  const rename = (name: string) => takeOver((s) => ({ ...s, name, addReady: s.connected && name.trim().length > 0 }));
  const submit = () => {
    clearSync();
    takeOver((s) => ({ ...s, ...ADDED, open: { ...s.open, product: false } }));
    let at = 1400;
    for (const { set, wait } of SYNC_STEPS) {
      syncTimers.current.push(
        window.setTimeout(
          () => takeOver((s) => ({ ...s, ...set, open: set.open ? { ...s.open, product: true } : s.open })),
          at,
        ),
      );
      at += wait;
    }
  };
  const rowName = view.name.trim() || NAME;

  return (
    <div
      ref={rootRef}
      className={`${rootClass} ${styles.root}`}
      {...rootProps}
      aria-label="Asimov demo: adding a Notion knowledge source and watching it sync"
    >
      <div {...stageProps}>
        <div className={styles.column} ref={uiRef} data-in={view.listIn || undefined} data-dim={view.modal || undefined}>
          <div className={styles.header}>
            <p className={styles.title}>
              Resources uploaded <span>({view.count})</span>
            </p>
            <button type="button" className={styles.addButton} disabled={!interactive} onClick={openModal}>
              <DemoIcon src={icon("add")} size={16} />
              Add Resource
              {view.tap === "add" && <Tap />}
            </button>
          </div>

          <div className={styles.rows}>
            <Grow show={view.newRow}>
              <Row
                name={rowName}
                status={view.status}
                open={view.open.product}
                cited={view.answer}
                interactive={interactive}
                onToggle={() => toggle("product")}
                details={[
                  ["Type", "Page"],
                  ["Location", <Location key="l" place="Product" />],
                  ["Pages synced", String(view.pages), "Includes subpages"],
                  view.syncedNow ? ["Last synced", "Just now", "Auto-sync on"] : ["Last synced", "In progress", "Started just now"],
                ]}
              />
            </Grow>
            {SYNCED.map((r) => (
              <Row
                key={r.id}
                name={r.name}
                status="done"
                quiet
                open={view.open[r.id]}
                interactive={interactive}
                onToggle={() => toggle(r.id)}
                details={[
                  ["Type", "Page"],
                  ["Location", <Location key="l" place={r.location} />],
                  ["Pages synced", String(r.pages), "Includes subpages"],
                  ["Last synced", ...r.lastSynced],
                ]}
              />
            ))}
          </div>

          <Grow show={view.answer}>
            <div className={styles.answer}>
              <p className={styles.question}>What did we ship in the last release?</p>
              <div className={styles.reply}>
                <p>Release 4.2 added custom actions and faster syncs for Notion pages.</p>
                <p className={styles.source}>
                  Source
                  <span className={styles.sourceChip}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/asimov-demo/notion.svg" alt="" width={14} height={14} />
                    {rowName}
                  </span>
                </p>
              </div>
            </div>
          </Grow>
        </div>

        <div className={styles.scrim} data-on={view.modal || undefined} />
        <Modal
          scene={view}
          interactive={interactive}
          onClose={closeModal}
          onConnect={connect}
          onRename={rename}
          onSubmit={submit}
        />
      </div>
      {chrome}
    </div>
  );
}

/** Grows in from zero height, so what's below makes room smoothly. */
function Grow({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div className={styles.grow} data-show={show || undefined} aria-hidden={!show || undefined} inert={!show}>
      <div className={styles.growInner}>{children}</div>
    </div>
  );
}

function Tap() {
  return <span className={styles.tap} aria-hidden="true" />;
}

function Location({ place }: { place: string }) {
  return (
    <span className={styles.location}>
      <span className={styles.muted}>Acme</span>
      <DemoIcon src={icon("expand-more")} size={12} className={styles.caret} />
      {place}
    </span>
  );
}

function Row({
  name,
  status,
  open,
  quiet,
  cited,
  interactive,
  onToggle,
  details,
}: {
  name: string;
  status: Status;
  open: boolean;
  /** Older, already-synced rows sit back so the new one leads */
  quiet?: boolean;
  /** Glows when the answer cites this source */
  cited?: boolean;
  interactive: boolean;
  onToggle: () => void;
  details: [string, ReactNode, string?][];
}) {
  return (
    <div className={styles.row} data-open={open || undefined} data-quiet={quiet || undefined} data-cited={cited || undefined}>
      <button
        type="button"
        className={styles.rowHeader}
        disabled={!interactive}
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className={styles.rowName}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/asimov-demo/notion.svg" alt="" width={20} height={20} />
          {name}
        </span>
        <span className={styles.rowRight}>
          <StatusPill status={status} />
          <DemoIcon src={icon("expand-more")} size={20} className={styles.chevron} />
        </span>
      </button>
      <div className={styles.details} aria-hidden={!open || undefined}>
        <div className={styles.detailsInner}>
          {details.map(([label, value, sub]) => (
            <div key={label} className={styles.field}>
              <span className={styles.label}>{label}</span>
              <span className={styles.value}>{value}</span>
              {sub && <span className={styles.sub}>{sub}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const FILL: Record<Status, string> = { not: "0%", s1: "1%", s2: "44%", s3: "85%", s4: "100%", done: "100%" };

/** Training status: Not Trained → Syncing (a fill moves across the pill) → Synced. */
function StatusPill({ status }: { status: Status }) {
  const kind = status === "not" ? "not" : status === "done" ? "done" : "syncing";
  return (
    <span className={styles.pill} data-kind={kind} style={{ "--fill": FILL[status] } as CSSProperties}>
      <span className={styles.pillFill} aria-hidden="true" />
      <DemoIcon
        src={icon(kind === "not" ? "info" : kind === "done" ? "check" : "hourglass-empty")}
        size={14}
        className={styles.pillIcon}
      />
      <span className={styles.pillText}>{kind === "not" ? "Not Trained" : kind === "done" ? "Synced" : "Syncing"}</span>
    </span>
  );
}

function Modal({
  scene,
  interactive,
  onClose,
  onConnect,
  onRename,
  onSubmit,
}: {
  scene: Scene;
  interactive: boolean;
  onClose: () => void;
  onConnect: () => void;
  onRename: (name: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div
      className={styles.modal}
      data-open={scene.modal || undefined}
      role="dialog"
      aria-label="Add Knowledge"
      aria-hidden={!scene.modal || undefined}
      inert={!scene.modal}
    >
      <div className={styles.modalHeader}>
        <p>Add Knowledge</p>
        <button type="button" className={styles.close} disabled={!interactive} onClick={onClose} aria-label="Close">
          <DemoIcon src={icon("close")} size={20} />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.group}>
          <span className={styles.fieldLabel}>Knowledge Type</span>
          <span className={styles.select}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/asimov-demo/notion.svg" alt="" width={20} height={20} />
            <span>Notion</span>
            <DemoIcon src={icon("expand-more")} size={16} className={styles.selectCaret} />
          </span>

          {/* Workspace: a name and a status, with the action on the right */}
          <span className={styles.workspace} data-on={scene.connected || undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/asimov-demo/notion.svg" alt="" width={40} height={40} />
            <span className={styles.workspaceText}>
              <span className={styles.workspaceName}>{scene.connected ? "Acme workspace" : "Notion workspace"}</span>
              <span className={styles.status}>
                <i />
                {scene.connected ? "Connected" : "Not connected"}
              </span>
            </span>
            <button
              type="button"
              className={styles.connect}
              disabled={!interactive || scene.connected}
              onClick={onConnect}
              tabIndex={scene.connected ? -1 : undefined}
            >
              <DemoIcon src={icon("open-in-new")} size={16} />
              Connect
              {scene.tap === "connect" && <Tap />}
            </button>
          </span>
        </div>

        <label className={styles.group}>
          <span className={styles.fieldLabel}>Name</span>
          {interactive ? (
            <input
              className={styles.input}
              value={scene.name}
              placeholder="e.g. Product Wiki"
              onChange={(e) => onRename(e.target.value)}
              maxLength={32}
            />
          ) : (
            <span className={styles.input}>
              {scene.name}
              <span className={styles.caretLine} data-on={(scene.modal && !scene.addReady) || undefined} />
            </span>
          )}
        </label>
      </div>

      <div className={styles.modalButtons}>
        <button type="button" className={styles.cancel} disabled={!interactive} onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.submit}
          data-ready={scene.addReady || undefined}
          disabled={!interactive || !scene.addReady}
          onClick={onSubmit}
        >
          Add
          {scene.tap === "submit" && <Tap />}
        </button>
      </div>
    </div>
  );
}
