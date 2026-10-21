"use client";

import { type CSSProperties } from "react";
import { DemoIcon, STAGE_H, STAGE_W, useCardDemo, type Beat } from "./useCardDemo";
import styles from "./DebugModeEmbed.module.css";

/*
 * Node styling comes from the Tars Debug Mode test-run prototype (formerly
 * app/components/DebugFlowPreview.tsx). The run is shown one node at a time.
 * See docs/superpowers/specs/2026-10-20-debug-mode-coded-ui-design.md.
 */

/** Node size as in the product; the track draws it at TRACK_SCALE */
const NODE_W = 132;
const NODE_H = 92;
/** Gap between one node and the next on the run */
const NODE_GAP = 96;
const STEP = NODE_H + NODE_GAP;
const TRACK_SCALE = 1.5;

const PANEL_W = 300;
const PANEL_GAP = 28;
/** With the error detail open, the failed node shifts left so the pair sits centred. */
const ERROR_SHIFT = (PANEL_GAP + PANEL_W) / 2;

type RunNode = { id: string; label: string };

/** The test run: Greeting Node → Preferences → Credit Limit Increase → Rewards Card (fails). */
const PATH: RunNode[] = [
  { id: "113", label: "Greeting Node" },
  { id: "114", label: "Preferences" },
  { id: "115", label: "Credit Limit Increase" },
  { id: "117", label: "Rewards Card" },
];
const FAILED = PATH.length - 1;

type Scene = {
  fading: boolean;
  /** Index in PATH of the node under test */
  at: number;
  /** The node under test has passed and is about to hand off */
  done: boolean;
  error: boolean;
  /** The error detail beside the failed node */
  panel: boolean;
};

const START: Scene = { fading: false, at: 0, done: false, error: false, panel: false };
const FINAL: Scene = { ...START, at: FAILED, error: true, panel: true };

/** The loop, about 18s: each node runs, passes and hands off, until one breaks. */
const BEATS: Beat<Scene>[] = [
  // Reset while faded out
  { set: { ...START, fading: true }, wait: 700 },
  { set: { fading: false }, wait: 1600 },
  { set: { done: true }, wait: 800 },
  { set: { at: 1, done: false }, wait: 1600 },
  { set: { done: true }, wait: 800 },
  { set: { at: 2, done: false }, wait: 1600 },
  { set: { done: true }, wait: 800 },
  { set: { at: 3, done: false }, wait: 1400 },
  // Rewards Card fails: the run stops on it in red
  { set: { error: true }, wait: 1000 },
  { set: { panel: true }, wait: 5200 },
  { set: { fading: true }, wait: 700 },
];

/** Opening frame when the card scrolls into view: the run already under way, on Preferences. */
const ENTRY = { scene: { ...START, at: 1 }, beat: BEATS.findIndex((b) => b.set.at === 1) };

type Status = "untested" | "active" | "passed" | "error";

function statusOf(i: number, scene: Scene): Status {
  if (i > scene.at) return "untested";
  if (i < scene.at || scene.done) return "passed";
  return scene.error && i === FAILED ? "error" : "active";
}

const icon = (name: string) => `/debug-demo/icon-${name}.svg`;

/**
 * Debug Mode on the Debug Mode card: a test run on the Tars gambit canvas,
 * one node at a time, floating on the telephone-exchange scene. Each node runs,
 * passes and hands off along its connector to the next, until Rewards Card
 * fails in red and an error detail says what broke.
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
  const shift = showPanel ? ERROR_SHIFT : 0;
  // The rail slides so the node under test sits in the middle of the card
  const railY = -(view.at * STEP + NODE_H / 2);
  const railH = PATH.length * STEP + NODE_GAP;

  const togglePanel = () => takeOver((s) => ({ ...s, fading: false, at: FAILED, done: false, error: true, panel: !s.panel }));

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

        <div className={styles.viewport} data-in={!view.fading || undefined}>
          <div
            className={styles.track}
            style={{ transform: `translate(${STAGE_W / 2 - shift}px, ${STAGE_H / 2}px) scale(${TRACK_SCALE})` }}
          >
            <div className={styles.rail} style={{ transform: `translateY(${railY}px)` }}>
              {/* Connectors: in from the flow above, between the run's nodes, and on past the last */}
              <svg
                className={styles.edges}
                width={NODE_W}
                height={railH + NODE_GAP}
                viewBox={`0 ${-NODE_GAP} ${NODE_W} ${railH + NODE_GAP}`}
                style={{ top: -NODE_GAP }}
                aria-hidden="true"
              >
                {Array.from({ length: PATH.length + 1 }, (_, i) => {
                  // Connector i leads into node i (the last one leads on from the failed node)
                  const y1 = i * STEP - NODE_GAP + 4;
                  const y2 = i * STEP - 2;
                  const lit = i <= view.at;
                  const flowing = i === view.at && !view.done && !view.error;
                  return (
                    <line
                      key={i}
                      x1={NODE_W / 2}
                      x2={NODE_W / 2}
                      y1={y1}
                      y2={y2}
                      className={styles.edge}
                      data-lit={lit || undefined}
                      data-flow={flowing || undefined}
                    />
                  );
                })}
              </svg>

              {PATH.map((node, i) => {
                const status = statusOf(i, view);
                const clickable = interactive && status === "error";
                return (
                  <div
                    key={node.id}
                    className={styles.node}
                    data-status={status}
                    data-current={i === view.at || undefined}
                    style={{ top: i * STEP } as CSSProperties}
                    aria-hidden={i !== view.at || undefined}
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
                    <span className={styles.tab} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* What broke */}
        <div
          className={styles.panel}
          data-open={showPanel || undefined}
          style={
            {
              left: STAGE_W / 2 - ERROR_SHIFT + (NODE_W / 2) * TRACK_SCALE + PANEL_GAP,
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
