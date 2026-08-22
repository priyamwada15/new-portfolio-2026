"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// Ported from the "Debug Mode Test Run" Claude Design prototype
// (public/new-debug-mode/Debug Mode Test Run Prototype/Debug Mode Test Run.dc.html)

const NODE_W = 132;
const NODE_H = 92;
const CANVAS_W = 2150;
const CANVAS_H = 1120;
const VIEW_W = 980;
const VIEW_H = 720;
const FOCUS_SCALE = 2.7;
const OVERVIEW_SCALE = Math.min(VIEW_W / CANVAS_W, VIEW_H / CANVAS_H) * 0.94;
const TAB_W = 8.5;
const TAB_GAP = 3.5;

type NodeStatus = "untested" | "active" | "passed" | "error";
type PillPhase = "inactive" | "running" | "complete";

interface FlowNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

const NODES: FlowNode[] = [
  { id: "113", label: "Greeting Node", x: 860, y: 40 },
  { id: "114", label: "Preferences", x: 820, y: 200 },
  { id: "115", label: "Credit Limit Increase", x: 560, y: 260 },
  { id: "122", label: "Add-ons", x: 1060, y: 200 },
  { id: "124", label: "Extensions", x: 1020, y: 400 },
  { id: "117", label: "Rewards Card", x: 500, y: 440 },
  { id: "112", label: "Options", x: 1080, y: 560 },
  { id: "116", label: "Parameters", x: 1320, y: 520 },
  { id: "118", label: "Features", x: 200, y: 600 },
  { id: "119", label: "Controls", x: 500, y: 600 },
  { id: "120", label: "Tools", x: 340, y: 760 },
  { id: "128", label: "Dashboards", x: 1300, y: 300 },
  { id: "126", label: "APIs", x: 1280, y: 460 },
  { id: "127", label: "Widgets", x: 1560, y: 400 },
  { id: "129", label: "Reports", x: 1580, y: 200 },
  { id: "130", label: "Analytics", x: 1820, y: 200 },
  { id: "131", label: "Insights", x: 1820, y: 440 },
  { id: "132", label: "Records", x: 1900, y: 580 },
  { id: "133", label: "Logs", x: 1800, y: 700 },
  { id: "134", label: "History", x: 1580, y: 760 },
  { id: "152", label: "Meetings", x: 1560, y: 900 },
  { id: "153", label: "Feedback", x: 1900, y: 840 },
  { id: "154", label: "Reviews", x: 1300, y: 600 },
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
  { id: "145", label: "Upgrade Tier", x: 1560, y: 40 },
  { id: "146", label: "Billing FAQ", x: 1300, y: 780 },
  { id: "147", label: "Contact Us", x: 1040, y: 780 },
  { id: "148", label: "Live Agent", x: 1040, y: 940 },
  { id: "149", label: "Feedback Loop", x: 1780, y: 400 },
  { id: "150", label: "Escalation", x: 1780, y: 540 },
  { id: "151", label: "Session End", x: 1560, y: 900 },
  { id: "155", label: "Language", x: 260, y: 200 },
  { id: "156", label: "Notifications", x: 260, y: 900 },
  { id: "157", label: "Security", x: 1560, y: 700 },
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

const STEPS: { key: string; duration: number }[] = [
  { key: "overview0", duration: 2200 },
  { key: "focus113", duration: 2200 },
  { key: "focus115", duration: 2000 },
  { key: "focus117", duration: 1800 },
  { key: "focus118", duration: 1600 },
  { key: "focus119", duration: 1600 },
  { key: "montage", duration: 2600 },
  { key: "completeHold", duration: 3000 },
  { key: "reset", duration: 1300 },
];

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

interface FlowState {
  nodeStatus: Record<string, NodeStatus>;
  testedCount: number;
  errorCount: number;
  focusNodeId: string | null;
  pillPhase: PillPhase;
  pillErrorVisible: boolean;
  flowEdge: string | null;
  cameraDuration: number;
  fading: boolean;
}

function getInitialFlowState(): FlowState {
  return {
    nodeStatus: Object.fromEntries(NODES.map((n) => [n.id, "untested" as NodeStatus])),
    testedCount: 0,
    errorCount: 0,
    focusNodeId: null,
    pillPhase: "inactive",
    pillErrorVisible: false,
    flowEdge: null,
    cameraDuration: 900,
    fading: false,
  };
}

function getCamera(focusNodeId: string | null) {
  if (!focusNodeId) {
    const scale = OVERVIEW_SCALE;
    return { x: (VIEW_W - CANVAS_W * scale) / 2, y: (VIEW_H - CANVAS_H * scale) / 2, scale };
  }
  const node = byId[focusNodeId];
  const scale = FOCUS_SCALE;
  return { x: VIEW_W / 2 - (node.x + NODE_W / 2) * scale, y: VIEW_H / 2 - (node.y + NODE_H / 2) * scale, scale };
}

function pillStyle(bg: string, border: string, extra?: CSSProperties): CSSProperties {
  return {
    height: 30,
    borderRadius: 80,
    background: bg,
    boxShadow: `inset 0 0 0 1px ${border}`,
    display: "flex",
    flexDirection: "row",
    gap: 8,
    padding: "6px 12px",
    alignItems: "center",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    transition: "background-color .5s ease, box-shadow .5s ease",
    fontFamily: "var(--font-inter, 'Inter', sans-serif)",
    fontWeight: 500,
    fontSize: 12,
    ...extra,
  };
}

function Dot({ color, glow }: { color: string; glow: string }) {
  return (
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        filter: `drop-shadow(0 0 8px ${glow})`,
        flexShrink: 0,
      }}
    />
  );
}

function FlowEdges({ nodeStatus, flowEdge }: { nodeStatus: Record<string, NodeStatus>; flowEdge: string | null }) {
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: CANVAS_W, height: CANVAS_H, overflow: "visible" }}>
      {EDGES.map(([a, b], i) => {
        const isFlow = flowEdge === `${a}-${b}`;
        const active = nodeStatus[a] !== "untested";
        return (
          <path
            key={i}
            d={elbowPath([a, b])}
            fill="none"
            stroke={active ? "#7CC4FF" : "#DADADA"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={isFlow ? "8 6" : undefined}
            style={{ transition: "stroke .5s ease", animation: isFlow ? "debug-flow-dashflow .5s linear infinite" : "none" }}
          />
        );
      })}
    </svg>
  );
}

function FlowNodeCard({ node, idx, status }: { node: FlowNode; idx: number; status: NodeStatus }) {
  const tested = status !== "untested";
  let accent = "#DADADA";
  let ring = "none";
  let opacity = 0.42;
  let filter = "grayscale(1)";
  if (status === "active") {
    accent = "#65BAFF";
    ring = "0 0 18px 3px rgba(101,186,255,0.55)";
    opacity = 1;
    filter = "none";
  } else if (status === "passed") {
    accent = "#65BAFF";
    opacity = 1;
    filter = "none";
  } else if (status === "error") {
    accent = "#CB2A2F";
    opacity = 1;
    filter = "none";
  }
  const notchColor = tested ? accent : "#E7E7E7";
  const branchCount = Math.max(1, EDGES.filter(([a]) => a === node.id).length);
  const tabH = 9.4;
  const tabsTotalW = TAB_W * branchCount + TAB_GAP * (branchCount - 1);
  const tabsLeft = (NODE_W - tabsTotalW) / 2;

  return (
    <div
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        width: NODE_W,
        height: NODE_H,
        opacity,
        filter,
        transition: "opacity .5s ease, filter .5s ease",
        transitionDelay: `${(idx % 9) * 0.045}s`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: (NODE_W - 9.4) / 2,
          top: -2,
          width: 9.4,
          height: 5.6,
          background: "#E7E7E7",
          borderRadius: "2px 2px 0 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 6.6,
          width: NODE_W,
          height: NODE_H - 6.6,
          background: "#fff",
          borderRadius: 8,
          boxSizing: "border-box",
          border: `0.9px solid ${tested ? accent : "#EFEFEF"}`,
          boxShadow: ring,
          transition: "border-color .5s ease, box-shadow .45s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <div style={{ padding: "2px 11px", borderRadius: 4, background: "#F8F8F8" }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: "#333333" }}>{node.id}</span>
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 400, color: "#373E43", textAlign: "center", padding: "0 10px" }}>
          {node.label}
        </span>
      </div>
      {Array.from({ length: branchCount }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: tabsLeft + i * (TAB_W + TAB_GAP),
            top: NODE_H - 1,
            width: TAB_W,
            height: tabH,
            background: notchColor,
            borderRadius: "0 0 2px 2px",
            transition: "background .5s ease",
          }}
        />
      ))}
    </div>
  );
}

function ToolIconStack() {
  const cellStyle: CSSProperties = {
    boxSizing: "border-box",
    width: 30,
    height: 30,
    background: "#fff",
    border: "1px solid #D5D7DA",
    marginBottom: -1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        bottom: 16,
        width: 30,
        display: "flex",
        flexDirection: "column",
        filter: "drop-shadow(0px 0px 28px rgba(0,0,0,0.05))",
      }}
    >
      <div style={{ ...cellStyle, borderRadius: "8px 8px 0 0" }}>
        <div style={{ position: "relative", width: 10, height: 10 }}>
          <div style={{ position: "absolute", left: 0, top: 4.5, width: 10, height: 1, background: "#555" }} />
          <div style={{ position: "absolute", left: 4.5, top: 0, width: 1, height: 10, background: "#555" }} />
        </div>
      </div>
      <div style={cellStyle}>
        <div style={{ width: 10, height: 1, background: "#555" }} />
      </div>
      <div style={cellStyle}>
        <div style={{ position: "relative", width: 10, height: 10 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: 3, borderTop: "1px solid #555", borderLeft: "1px solid #555" }} />
          <div style={{ position: "absolute", right: 0, top: 0, width: 3, height: 3, borderTop: "1px solid #555", borderRight: "1px solid #555" }} />
          <div style={{ position: "absolute", left: 0, bottom: 0, width: 3, height: 3, borderBottom: "1px solid #555", borderLeft: "1px solid #555" }} />
          <div style={{ position: "absolute", right: 0, bottom: 0, width: 3, height: 3, borderBottom: "1px solid #555", borderRight: "1px solid #555" }} />
        </div>
      </div>
      <div style={{ ...cellStyle, borderRadius: "0 0 8px 8px", marginBottom: 0 }}>
        <div style={{ position: "relative", width: 10, height: 10 }}>
          <div style={{ position: "absolute", left: 3, top: 4, width: 6, height: 5, border: "1px solid #555", borderRadius: 1, boxSizing: "border-box" }} />
          <div style={{ position: "absolute", left: 3.5, top: 0.5, width: 5, height: 4.5, border: "1px solid #555", borderBottom: "none", borderRadius: "3px 3px 0 0", boxSizing: "border-box" }} />
        </div>
      </div>
    </div>
  );
}

/** Auto-play preview of the TARS debug-mode node graph, scaled to fit its container. */
export function DebugFlowPreview() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [containerScale, setContainerScale] = useState(1);

  const stateRef = useRef<FlowState>(getInitialFlowState());
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const montageIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runIdRef = useRef(0);
  const [errorPop, setErrorPop] = useState(false);
  const prevPillErrorVisibleRef = useRef(false);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setContainerScale(Math.min(width / VIEW_W, height / VIEW_H));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const applyStep = (key: string) => {
      const prev = stateRef.current;
      const ns = { ...prev.nodeStatus };
      const settle = (id: string) => {
        if (ns[id] === "active") ns[id] = "passed";
      };
      let partial: Partial<FlowState> | null = null;
      switch (key) {
        case "overview0":
          partial = { focusNodeId: null, cameraDuration: 900 };
          break;
        case "focus113":
          ns["113"] = "active";
          partial = { nodeStatus: ns, focusNodeId: "113", testedCount: 1, pillPhase: "running", cameraDuration: 1500, flowEdge: null };
          break;
        case "focus115":
          settle("113");
          ns["115"] = "active";
          partial = { nodeStatus: ns, focusNodeId: "115", testedCount: 2, cameraDuration: 1300, flowEdge: "113-115" };
          break;
        case "focus117":
          settle("115");
          ns["117"] = "error";
          partial = { nodeStatus: ns, focusNodeId: "117", testedCount: 3, errorCount: 1, pillErrorVisible: true, cameraDuration: 1100, flowEdge: "115-117" };
          break;
        case "focus118":
          ns["118"] = "active";
          partial = { nodeStatus: ns, focusNodeId: "118", testedCount: 4, cameraDuration: 1000, flowEdge: "117-118" };
          break;
        case "focus119":
          settle("118");
          ns["119"] = "active";
          partial = { nodeStatus: ns, focusNodeId: "119", testedCount: 5, cameraDuration: 1000, flowEdge: "117-119" };
          break;
        case "montage":
          settle("119");
          partial = { nodeStatus: ns, focusNodeId: null, cameraDuration: 2400, flowEdge: null };
          break;
        case "completeHold":
          partial = { pillPhase: "complete", testedCount: 233, errorCount: 5 };
          break;
        default:
          partial = null;
      }
      if (partial) {
        stateRef.current = { ...prev, ...partial };
        rerender();
        if (!prevPillErrorVisibleRef.current && stateRef.current.pillErrorVisible) {
          setErrorPop(true);
          timeoutsRef.current.push(setTimeout(() => setErrorPop(false), 460));
        }
        prevPillErrorVisibleRef.current = stateRef.current.pillErrorVisible;
      }
    };

    const runMontage = (duration: number) => {
      const startTested = stateRef.current.testedCount;
      const startErr = stateRef.current.errorCount;
      const endTested = 233;
      const endErr = 5;
      const t0 = Date.now();
      montageIntervalRef.current = setInterval(() => {
        const p = Math.min(1, (Date.now() - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        stateRef.current = {
          ...stateRef.current,
          testedCount: Math.round(startTested + (endTested - startTested) * eased),
          errorCount: Math.round(startErr + (endErr - startErr) * eased),
        };
        rerender();
        if (p >= 1 && montageIntervalRef.current) {
          clearInterval(montageIntervalRef.current);
          montageIntervalRef.current = null;
        }
      }, 60);
    };

    const scheduleNext = (i: number, myRunId: number) => {
      if (myRunId !== runIdRef.current) return;
      const step = STEPS[i];
      if (step.key === "reset") {
        stateRef.current = { ...stateRef.current, fading: true };
        rerender();
        timeoutsRef.current.push(
          setTimeout(() => {
            if (myRunId !== runIdRef.current) return;
            stateRef.current = getInitialFlowState();
            prevPillErrorVisibleRef.current = false;
            rerender();
            timeoutsRef.current.push(
              setTimeout(() => {
                if (myRunId !== runIdRef.current) return;
                timeoutsRef.current.push(
                  setTimeout(() => scheduleNext((i + 1) % STEPS.length, myRunId), step.duration - 450),
                );
              }, 50),
            );
          }, 450),
        );
        return;
      }
      applyStep(step.key);
      if (step.key === "montage") runMontage(step.duration - 300);
      timeoutsRef.current.push(setTimeout(() => scheduleNext((i + 1) % STEPS.length, myRunId), step.duration));
    };

    const stop = () => {
      runIdRef.current += 1;
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      if (montageIntervalRef.current) {
        clearInterval(montageIntervalRef.current);
        montageIntervalRef.current = null;
      }
    };

    const start = () => {
      stop();
      stateRef.current = getInitialFlowState();
      prevPillErrorVisibleRef.current = false;
      rerender();
      scheduleNext(0, runIdRef.current);
    };

    const el = outerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  const { nodeStatus, focusNodeId, pillPhase, pillErrorVisible, testedCount, errorCount, flowEdge, cameraDuration, fading } =
    stateRef.current;
  const cam = getCamera(focusNodeId);

  let mainPill: React.ReactNode;
  if (pillPhase === "inactive") {
    mainPill = (
      <div style={pillStyle("#EBEBEB", "rgba(23,23,23,0.1)")}>
        <span style={{ color: "#626262" }}>0/253 Nodes Tested</span>
      </div>
    );
  } else if (pillPhase === "running") {
    mainPill = (
      <div style={pillStyle("#EBFAEB", "rgba(101,182,118,0.2)")}>
        <Dot color="#65B676" glow="#8FFF8A" />
        <span style={{ color: "#297A3A" }}>{testedCount}/253 Nodes Tested</span>
      </div>
    );
  } else {
    mainPill = (
      <div style={pillStyle("#EBF5FF", "rgba(101,182,118,0.2)")}>
        <span style={{ color: "#0068D6" }}>233/253 Nodes Tested</span>
      </div>
    );
  }

  let errorPill: React.ReactNode = null;
  if (pillErrorVisible) {
    errorPill =
      pillPhase !== "complete" ? (
        <div style={pillStyle("#FFEBEB", "rgba(203,42,47,0.2)", { animation: errorPop ? "debug-flow-popIn .45s cubic-bezier(.34,1.56,.64,1)" : "none" })}>
          <Dot color="#CB2A2F" glow="#EF7A7E" />
          <span style={{ color: "#CB2A2F" }}>
            {errorCount} {errorCount === 1 ? "Node" : "Nodes"} with Error
          </span>
        </div>
      ) : (
        <div style={pillStyle("#FFEBEB", "rgba(203,42,47,0.2)")}>
          <span style={{ color: "#CB2A2F" }}>5 Nodes with Error</span>
        </div>
      );
  }

  return (
    <div ref={outerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      <style>{`
        @keyframes debug-flow-popIn { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        @keyframes debug-flow-dashflow { from { stroke-dashoffset: 28; } to { stroke-dashoffset: 0; } }
      `}</style>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: VIEW_W,
          height: VIEW_H,
          transform: `translate(-50%, -50%) scale(${containerScale})`,
          fontFamily: "var(--font-inter, 'Inter', sans-serif)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: VIEW_W,
            height: VIEW_H,
            borderRadius: 12,
            overflow: "hidden",
            background: "#F8F8F6",
            boxShadow: "inset 0 0 0 1px #E9EAEB",
          }}
        >
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: fading ? 0 : 1, transition: "opacity .4s ease" }}>
            <div style={{ position: "absolute", inset: 0, backgroundColor: "#FAFAFA" }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: CANVAS_W,
                height: CANVAS_H,
                transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`,
                transformOrigin: "0 0",
                transition: `transform ${cameraDuration}ms cubic-bezier(0.22,0.9,0.28,1)`,
              }}
            >
              <FlowEdges nodeStatus={nodeStatus} flowEdge={flowEdge} />
              {NODES.map((n, idx) => (
                <FlowNodeCard key={n.id} node={n} idx={idx} status={nodeStatus[n.id]} />
              ))}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 16,
              top: 16,
              display: "flex",
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              opacity: fading ? 0 : 1,
              transition: "opacity .4s ease",
            }}
          >
            {mainPill}
            {errorPill}
          </div>

          <ToolIconStack />
        </div>
      </div>
    </div>
  );
}
