"use client";

import { useCallback, type CSSProperties } from "react";
import { DemoIcon, useCardDemo, type Beat } from "./useCardDemo";
import styles from "./DebugModeEmbed.module.css";

/*
 * The gambit canvas from the Tars Debug Mode test-run prototype (formerly
 * app/components/DebugFlowPreview.tsx): node positions, connectors and states.
 * See docs/superpowers/specs/2026-10-20-debug-mode-coded-ui-design.md.
 */

const NODE_W = 132;
const NODE_H = 92;
const CANVAS_W = 2150;
const CANVAS_H = 1120;
const TAB_W = 8.5;
const TAB_GAP = 3.5;

/** Demo stage */
const STAGE_W = 1008;
const STAGE_H = 575;
const OVERVIEW_SCALE = Math.min(STAGE_W / CANVAS_W, STAGE_H / CANVAS_H) * 0.94;
const FOCUS_SCALE = 1.15;
/** With the error detail open, the failed node shifts left so both sit centred. */
const ERROR_SHIFT = 160;
const PANEL_W = 300;
const PANEL_GAP = 28;

type FlowNode = { id: string; label: string; x: number; y: number };

const NODES: FlowNode[] = [
  { id: "113", label: "Greeting Node", x: 860, y: 40 },
  { id: "114", label: "Preferences", x: 820, y: 200 },
  { id: "115", label: "Credit Limit Increase", x: 560, y: 260 },
  { id: "122", label: "Add-ons", x: 1060, y: 200 },
  { id: "124", label: "Extensions", x: 1020, y: 400 },
  { id: "117", label: "Rewards Card", x: 500, y: 440 },
  { id: "112", label: "Options", x: 1080, y: 560 },
  { id: "116", label: "Parameters", x: 1300, y: 520 },
  { id: "118", label: "Features", x: 200, y: 600 },
  { id: "119", label: "Controls", x: 500, y: 600 },
  { id: "120", label: "Tools", x: 340, y: 760 },
  { id: "128", label: "Dashboards", x: 1300, y: 200 },
  { id: "126", label: "APIs", x: 1300, y: 360 },
  { id: "127", label: "Widgets", x: 1520, y: 360 },
  { id: "129", label: "Reports", x: 1520, y: 200 },
  { id: "130", label: "Analytics", x: 1740, y: 200 },
  { id: "131", label: "Insights", x: 1740, y: 360 },
  { id: "132", label: "Records", x: 1740, y: 520 },
  { id: "133", label: "Logs", x: 1740, y: 680 },
  { id: "134", label: "History", x: 1740, y: 840 },
  { id: "152", label: "Meetings", x: 1960, y: 840 },
  { id: "153", label: "Feedback", x: 1960, y: 680 },
  { id: "154", label: "Reviews", x: 1300, y: 680 },
  { id: "135", label: "Statements", x: 40, y: 200 },
  { id: "136", label: "Alerts", x: 40, y: 340 },
  { id: "137", label: "Autopay", x: 40, y: 480 },
  { id: "138", label: "Disputes", x: 60, y: 900 },
  { id: "139", label: "Travel Notice", x: 260, y: 40 },
  { id: "140", label: "Fraud Check", x: 480, y: 40 },
  { id: "141", label: "Card Design", x: 620, y: 900 },
  { id: "142", label: "PIN Reset", x: 820, y: 900 },
  { id: "143", label: "Referrals", x: 1040, y: 40 },
  { id: "144", label: "Promotions", x: 1300, y: 40 },
  { id: "145", label: "Upgrade Tier", x: 1520, y: 40 },
  { id: "146", label: "Billing FAQ", x: 1300, y: 840 },
  { id: "147", label: "Contact Us", x: 1040, y: 780 },
  { id: "148", label: "Live Agent", x: 1040, y: 940 },
  { id: "149", label: "Feedback Loop", x: 1520, y: 520 },
  { id: "150", label: "Escalation", x: 1520, y: 680 },
  { id: "151", label: "Session End", x: 1520, y: 1000 },
  { id: "155", label: "Language", x: 260, y: 200 },
  { id: "156", label: "Notifications", x: 260, y: 900 },
  { id: "157", label: "Security", x: 1520, y: 840 },
];

const EDGES: [string, string][] = [
  ["113", "114"], ["113", "115"], ["114", "115"], ["114", "122"],
  ["115", "117"], ["115", "112"],
  ["117", "118"], ["117", "119"],
  ["119", "120"],
  ["122", "124"], ["122", "128"],
  ["128", "126"], ["128", "127"], ["128", "154"],
  ["127", "129"], ["129", "130"], ["130", "131"], ["131", "132"], ["132", "133"],
  ["133", "134"], ["133", "153"], ["134", "152"],
  ["112", "116"],
  ["139", "113"], ["140", "115"], ["135", "139"], ["136", "135"], ["137", "136"],
  ["118", "138"], ["120", "141"], ["119", "142"], ["142", "148"],
  ["143", "122"], ["144", "143"], ["145", "144"], ["128", "149"], ["149", "150"],
  ["154", "146"], ["146", "147"], ["147", "148"], ["150", "157"], ["157", "151"],
  ["113", "155"], ["138", "156"], ["133", "150"],
];

/** The test run: Greeting Node → Preferences → Credit Limit Increase → Rewards Card (fails). */
const PATH = ["113", "114", "115", "117"];
const FAILED = "117";

const byId: Record<string, FlowNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));

function outX(nodeId: string, edge: [string, string]) {
  const node = byId[nodeId];
  const siblings = EDGES.filter(([a]) => a === nodeId);
  const i = siblings.findIndex(([sa, sb]) => sa === edge[0] && sb === edge[1]);
  const count = Math.max(1, siblings.length);
  const totalW = TAB_W * count + TAB_GAP * (count - 1);
  const left = (NODE_W - totalW) / 2;
  return node.x + left + i * (TAB_W + TAB_GAP) + TAB_W / 2;
}

function elbowPath(edge: [string, string]) {
  const [aId, bId] = edge;
  const a = byId[aId];
  const b = byId[bId];
  const x1 = outX(aId, edge);
  const y1 = a.y + NODE_H;
  const x2 = b.x + NODE_W / 2;
  const y2 = b.y;
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
}

type Scene = {
  fading: boolean;
  /** The canvas has faded in */
  shown: boolean;
  /** Camera: the whole flow, or following the run */
  view: "overview" | "node";
  /** Index in PATH of the node being tested (-1 before the run starts) */
  at: number;
  error: boolean;
  /** The error detail beside the failed node */
  panel: boolean;
  /** Visitor's zoom, around the centre of the card */
  zoom: number;
};

const START: Scene = { fading: false, shown: false, view: "overview", at: -1, error: false, panel: false, zoom: 1 };
const FINAL: Scene = { ...START, shown: true, view: "node", at: PATH.length - 1, error: true, panel: true };

/** The loop, about 22s: the run follows the flow node by node and stops where it breaks. */
const BEATS: Beat<Scene>[] = [
  // Reset while faded out
  { set: { ...START, fading: true }, wait: 700 },
  { set: { fading: false, shown: true }, wait: 2200 },
  { set: { view: "node", at: 0 }, wait: 2000 },
  { set: { at: 1 }, wait: 1800 },
  { set: { at: 2 }, wait: 1800 },
  { set: { at: 3 }, wait: 1100 },
  // Rewards Card fails: the run stops on it in red
  { set: { error: true }, wait: 1000 },
  { set: { panel: true }, wait: 5200 },
  { set: { fading: true }, wait: 700 },
];

/** Opening frame when the card scrolls into view: the run already under way. */
const ENTRY = { scene: { ...START, shown: true, view: "node" as const, at: 1 }, beat: BEATS.findIndex((b) => b.set.at === 1) };

type Status = "untested" | "active" | "passed" | "error";

function statusOf(id: string, at: number, error: boolean): Status {
  const i = PATH.indexOf(id);
  if (i < 0 || i > at) return "untested";
  if (i < at) return "passed";
  return error && id === FAILED ? "error" : "active";
}

/** Camera position: overview, or centred on the node under test (shifted left when the error detail is open). */
function camera(scene: Scene) {
  let x: number;
  let y: number;
  let scale: number;
  if (scene.view === "overview" || scene.at < 0) {
    scale = OVERVIEW_SCALE;
    x = (STAGE_W - CANVAS_W * scale) / 2;
    y = (STAGE_H - CANVAS_H * scale) / 2;
  } else {
    const node = byId[PATH[scene.at]];
    scale = FOCUS_SCALE;
    const cx = STAGE_W / 2 - (scene.panel ? ERROR_SHIFT : 0);
    x = cx - (node.x + NODE_W / 2) * scale;
    y = STAGE_H / 2 - (node.y + NODE_H / 2) * scale;
  }
  // The visitor's zoom, around the centre of the card
  const z = scene.zoom;
  return { x: STAGE_W / 2 - (STAGE_W / 2 - x) * z, y: STAGE_H / 2 - (STAGE_H / 2 - y) * z, scale: scale * z };
}

const icon = (name: string) => `/debug-demo/icon-${name}.svg`;

/**
 * Debug Mode on the Debug Mode card: a slice of the Tars gambit canvas
 * floating on the telephone-exchange scene. A test run lights the flow node by
 * node (the active node is the only signal), the canvas follows it, and the run
 * stops in red at the node that fails, with an error detail saying what broke.
 * Desktop: click the failed node to toggle the detail, Run again, and zoom.
 */
export function DebugModeEmbed() {
  const { rootRef, uiRef, view, interactive, takeOver, restart, rootProps, rootClass, stageProps, chrome } = useCardDemo({
    start: START,
    final: FINAL,
    beats: BEATS,
    sideClear: { left: 0, right: 0 },
    entry: ENTRY,
  });

  const cam = camera(view);
  const failed = byId[FAILED];
  // Where the failed node sits on the card, for placing the error detail beside it
  const nodeRight = cam.x + (failed.x + NODE_W) * cam.scale;
  const nodeMidY = cam.y + (failed.y + NODE_H / 2) * cam.scale;
  const showPanel = view.panel && view.error && view.view === "node";

  const zoomBy = useCallback(
    (f: number) => takeOver((s) => ({ ...s, fading: false, zoom: Math.min(1.6, Math.max(0.7, s.zoom * f)) })),
    [takeOver],
  );
  const fit = () => takeOver((s) => ({ ...s, fading: false, view: "overview", zoom: 1, panel: false }));
  const togglePanel = () =>
    takeOver((s) => ({ ...s, fading: false, view: "node", at: PATH.length - 1, error: true, panel: !s.panel }));

  return (
    <div
      ref={rootRef}
      className={`${rootClass} ${styles.root}`}
      {...rootProps}
      aria-label="Debug Mode demo: a test run stops at the node that fails"
    >
      <div {...stageProps}>
        {/* Sides of the card show the "Read" cursor; the middle is the canvas */}
        <div className={styles.uiZone} ref={uiRef} />

        <div className={styles.viewport} data-in={view.shown || undefined}>
          <div
            className={styles.canvas}
            style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})` }}
          >
            <svg className={styles.edges} width={CANVAS_W} height={CANVAS_H} aria-hidden="true">
              {EDGES.map(([a, b]) => {
                const ai = PATH.indexOf(a);
                const bi = PATH.indexOf(b);
                const onRun = ai >= 0 && bi === ai + 1;
                const lit = onRun && bi <= view.at;
                const flowing = onRun && bi === view.at && !view.error;
                return (
                  <path
                    key={`${a}-${b}`}
                    d={elbowPath([a, b])}
                    className={styles.edge}
                    data-lit={lit || undefined}
                    data-flow={flowing || undefined}
                  />
                );
              })}
            </svg>

            {NODES.map((node) => {
              const status = statusOf(node.id, view.at, view.error);
              const branches = Math.max(1, EDGES.filter(([a]) => a === node.id).length);
              const tabsLeft = (NODE_W - (TAB_W * branches + TAB_GAP * (branches - 1))) / 2;
              const clickable = interactive && status === "error";
              return (
                <div
                  key={node.id}
                  className={styles.node}
                  data-status={status}
                  style={{ left: node.x, top: node.y } as CSSProperties}
                >
                  <span className={styles.notch} />
                  <button
                    type="button"
                    className={styles.nodeCard}
                    disabled={!clickable}
                    onClick={clickable ? togglePanel : undefined}
                    aria-label={status === "error" ? `${node.label}, failed. Show what broke.` : undefined}
                    tabIndex={clickable ? 0 : -1}
                  >
                    <span className={styles.nodeId}>{node.id}</span>
                    <span className={styles.nodeLabel}>{node.label}</span>
                  </button>
                  {Array.from({ length: branches }, (_, i) => (
                    <span key={i} className={styles.tab} style={{ left: tabsLeft + i * (TAB_W + TAB_GAP) }} />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* What broke */}
        <div
          className={styles.panel}
          data-open={showPanel || undefined}
          style={{ left: nodeRight + PANEL_GAP, top: nodeMidY, width: PANEL_W } as CSSProperties}
          role="status"
          aria-hidden={!showPanel || undefined}
          inert={!showPanel}
        >
          <span className={styles.pointer} aria-hidden="true" />
          <div className={styles.panelHeader}>
            <span className={styles.errorDot} aria-hidden="true" />
            <span className={styles.panelTitle}>Error at Rewards Card</span>
            <span className={styles.nodeId}>117</span>
          </div>
          <p className={styles.panelBody}>The API call that checks rewards eligibility didn&rsquo;t respond as expected.</p>
          <code className={styles.code}>GET /rewards/eligibility → 404</code>
          <div className={styles.panelFooter}>
            <span className={styles.step}>Step 4 of the test run</span>
            <button type="button" className={styles.runAgain} disabled={!interactive} onClick={restart}>
              <DemoIcon src={icon("replay")} size={14} />
              Run again
            </button>
          </div>
        </div>

        {/* Zoom controls, as in the product */}
        <div className={styles.zoom} data-in={view.shown || undefined}>
          <button type="button" disabled={!interactive} onClick={() => zoomBy(1.25)} aria-label="Zoom in">
            <DemoIcon src={icon("add")} size={16} />
          </button>
          <button type="button" disabled={!interactive} onClick={() => zoomBy(0.8)} aria-label="Zoom out">
            <DemoIcon src={icon("remove")} size={16} />
          </button>
          <button type="button" disabled={!interactive} onClick={fit} aria-label="Fit the whole flow">
            <DemoIcon src={icon("fit-screen")} size={16} />
          </button>
        </div>
      </div>
      {chrome}
    </div>
  );
}
