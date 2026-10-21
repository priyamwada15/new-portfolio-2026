"use client";

import { type CSSProperties } from "react";
import { DemoIcon, STAGE_H, STAGE_W, useCardDemo, type Beat } from "./useCardDemo";
import styles from "./DebugModeEmbed.module.css";

/*
 * Node styling comes from the Tars Debug Mode test-run prototype (formerly
 * app/components/DebugFlowPreview.tsx). The run follows a branching slice of a
 * flow: the node under test is in focus, its neighbours blurred around it.
 * See docs/superpowers/specs/2026-10-20-debug-mode-coded-ui-design.md.
 */

/** Node size as in the product; the camera draws the flow at CAMERA_SCALE */
const NODE_W = 132;
const NODE_H = 92;
const TAB_W = 8.5;
const TAB_GAP = 3.5;
const CAMERA_SCALE = 1.3;

const PANEL_W = 300;
const PANEL_GAP = 28;
/** With the error detail open, the camera shifts left so the failed node and the detail sit centred together. */
const ERROR_SHIFT = (PANEL_GAP + PANEL_W) / 2;

type FlowNode = { id: string; label: string; x: number; y: number };

/** A slice of the credit-card assistant's flow. Each node branches; the run takes one branch at a time. */
const NODES: FlowNode[] = [
  { id: "113", label: "Greeting Node", x: 0, y: 0 },
  { id: "114", label: "Preferences", x: -180, y: 190 },
  { id: "155", label: "Language", x: 180, y: 190 },
  { id: "122", label: "Add-ons", x: -360, y: 380 },
  { id: "115", label: "Credit Limit Increase", x: 0, y: 380 },
  { id: "156", label: "Notifications", x: 360, y: 380 },
  { id: "117", label: "Rewards Card", x: -180, y: 570 },
  { id: "112", label: "Options", x: 180, y: 570 },
  { id: "118", label: "Features", x: -360, y: 760 },
  { id: "119", label: "Controls", x: 0, y: 760 },
];

const EDGES: [string, string][] = [
  ["113", "114"], ["113", "155"],
  ["114", "122"], ["114", "115"],
  ["155", "156"],
  ["115", "117"], ["115", "112"],
  ["117", "118"], ["117", "119"],
];

/** The test run: Greeting Node → Preferences → Credit Limit Increase → Rewards Card (fails). */
const PATH = ["113", "114", "115", "117"];
const FAILED = PATH.length - 1;

const byId: Record<string, FlowNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));

function outX(nodeId: string, edge: [string, string]) {
  const node = byId[nodeId];
  const siblings = EDGES.filter(([a]) => a === nodeId);
  const i = siblings.findIndex(([, b]) => b === edge[1]);
  const totalW = TAB_W * siblings.length + TAB_GAP * (siblings.length - 1);
  return node.x + (NODE_W - totalW) / 2 + i * (TAB_W + TAB_GAP) + TAB_W / 2;
}

/** Connector from a tab under the parent to the notch on top of the child */
function elbowPath(edge: [string, string]) {
  const a = byId[edge[0]];
  const b = byId[edge[1]];
  const x1 = outX(edge[0], edge);
  const y1 = a.y + NODE_H;
  const x2 = b.x + NODE_W / 2;
  const y2 = b.y;
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
}

type Scene = {
  fading: boolean;
  /** Index in PATH of the node the run has reached */
  at: number;
  /** The node at `at` has passed and the signal is travelling to the next one */
  travel: boolean;
  error: boolean;
  /** The error detail beside the failed node */
  panel: boolean;
};

const START: Scene = { fading: false, at: 0, travel: false, error: false, panel: false };
const FINAL: Scene = { ...START, at: FAILED, error: true, panel: true };

/**
 * The loop, about 17s. Each hop overlaps: the signal leaves along the connector
 * and the camera sets off after it, so the camera is still easing in as the next
 * node lights up and never parks until the run breaks.
 */
const BEATS: Beat<Scene>[] = [
  // Reset while faded out
  { set: { ...START, fading: true }, wait: 600 },
  { set: { fading: false }, wait: 1400 },
  { set: { travel: true }, wait: 1000 },
  { set: { at: 1, travel: false }, wait: 900 },
  { set: { travel: true }, wait: 1000 },
  { set: { at: 2, travel: false }, wait: 900 },
  { set: { travel: true }, wait: 1000 },
  { set: { at: 3, travel: false }, wait: 1100 },
  // Rewards Card fails: the run stops on it in red
  { set: { error: true }, wait: 900 },
  { set: { panel: true }, wait: 5200 },
  { set: { fading: true }, wait: 600 },
];

/** Opening frame when the card scrolls into view: the run already under way, on Preferences. */
const ENTRY = { scene: { ...START, at: 1 }, beat: BEATS.findIndex((b) => b.set.at === 1) };

type Status = "untested" | "active" | "passed" | "error";

function statusOf(id: string, scene: Scene): Status {
  const i = PATH.indexOf(id);
  if (i < 0 || i > scene.at) return "untested";
  if (i < scene.at || scene.travel) return "passed";
  return scene.error && i === FAILED ? "error" : "active";
}

const icon = (name: string) => `/debug-demo/icon-${name}.svg`;

/**
 * Debug Mode on the Debug Mode card: a test run through a branching slice of a
 * Tars flow. A signal travels each lit connector and the camera glides after it;
 * the node under test is in focus, its neighbours blurred and translucent around
 * it. The run stops in red at Rewards Card, with an error detail saying what broke.
 * Desktop: click the failed node to toggle the detail, or Run again.
 */
export function DebugModeEmbed() {
  const { rootRef, uiRef, view, interactive, takeOver, restart, rootProps, rootClass, stageProps, chrome } = useCardDemo({
    start: START,
    final: FINAL,
    beats: BEATS,
    sideClear: { left: 0, right: 0 },
    entry: ENTRY,
  });

  const showPanel = view.panel && view.error;
  // In focus: the node under test, or the one the signal is heading for
  const focusId = PATH[view.travel ? Math.min(view.at + 1, FAILED) : view.at];
  const focus = byId[focusId];
  const camX = STAGE_W / 2 - (showPanel ? ERROR_SHIFT : 0) - (focus.x + NODE_W / 2) * CAMERA_SCALE;
  const camY = STAGE_H / 2 - (focus.y + NODE_H / 2) * CAMERA_SCALE;
  // The connector the signal is on
  const hop: [string, string] | null = view.travel && view.at < FAILED ? [PATH[view.at], PATH[view.at + 1]] : null;

  const togglePanel = () =>
    takeOver((s) => ({ ...s, fading: false, at: FAILED, travel: false, error: true, panel: !s.panel }));

  return (
    <div
      ref={rootRef}
      className={`${rootClass} ${styles.root}`}
      {...rootProps}
      aria-label="Debug Mode demo: a test run stops at the node that fails"
    >
      <div {...stageProps}>
        {/* Sides of the card show the "Read" cursor; the middle is the run */}
        <div className={styles.uiZone} ref={uiRef} />

        <div className={styles.viewport} data-in={!view.fading || undefined} data-error={view.error || undefined}>
          <div
            className={styles.canvas}
            style={{ transform: `translate(${camX}px, ${camY}px) scale(${CAMERA_SCALE})` }}
          >
            <svg className={styles.edges} aria-hidden="true">
              {EDGES.map(([a, b]) => {
                const ai = PATH.indexOf(a);
                const onRun = ai >= 0 && PATH[ai + 1] === b;
                const lit = onRun && ai < view.at;
                const flowing = onRun && hop?.[0] === a;
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

            {/* The signal travelling to the next node */}
            {hop && (
              <span
                key={hop.join("-")}
                className={styles.signal}
                style={{ offsetPath: `path("${elbowPath(hop)}")` } as CSSProperties}
                aria-hidden="true"
              />
            )}

            {NODES.map((node) => {
              const status = statusOf(node.id, view);
              const branches = Math.max(1, EDGES.filter(([a]) => a === node.id).length);
              const tabsLeft = (NODE_W - (TAB_W * branches + TAB_GAP * (branches - 1))) / 2;
              const clickable = interactive && status === "error";
              return (
                <div
                  key={node.id}
                  className={styles.node}
                  data-status={status}
                  data-focus={node.id === focusId || undefined}
                  style={{ left: node.x, top: node.y } as CSSProperties}
                  aria-hidden={node.id !== focusId || undefined}
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
          style={
            {
              left: STAGE_W / 2 - ERROR_SHIFT + (NODE_W / 2) * CAMERA_SCALE + PANEL_GAP,
              top: STAGE_H / 2,
              width: PANEL_W,
            } as CSSProperties
          }
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
      </div>
      {chrome}
    </div>
  );
}
