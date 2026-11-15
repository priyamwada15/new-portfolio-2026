"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CaseStudySideToc, type SideTocItem } from "../../components/CaseStudySideToc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type StoryTab = "showcase" | "case-study";

const TABS_ID = "story-tabs";

/** Where the tab group lands when a button elsewhere on the page switches it (clears the nav). */
const SCROLL_OFFSET_PX = 96;

const SHOWCASE_TOC: SideTocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "my-role", label: "My role" },
  { id: "knowledge-management", label: "Knowledge" },
  { id: "actions", label: "Actions" },
  { id: "integrations", label: "Integrations" },
];

const CASE_STUDY_TOC: SideTocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "my-role", label: "My role" },
  { id: "story-problem", label: "Problem" },
  { id: "story-releases", label: "Releases" },
  { id: "story-design-system", label: "Design system" },
  { id: "story-reflections", label: "Reflections" },
];

const StoryTabsContext = createContext<{
  value: StoryTab;
  /** Switches the tab where it is (a click on the tab itself). */
  setValue: (tab: StoryTab) => void;
  /** Switches the tab and scrolls the tab group into view (buttons elsewhere on the page). */
  select: (tab: StoryTab) => void;
} | null>(null);

/**
 * Holds which tab is showing, so buttons elsewhere on the page (the closing
 * lines) can switch it while the page itself stays a server component.
 */
export function StoryTabsProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<StoryTab>("showcase");

  const select = useCallback((tab: StoryTab) => {
    setValue(tab);
    const target = document.getElementById(TABS_ID);
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX,
      behavior: reduce ? "auto" : "smooth",
    });
  }, []);

  const context = useMemo(() => ({ value, setValue, select }), [value, select]);
  return <StoryTabsContext.Provider value={context}>{children}</StoryTabsContext.Provider>;
}

/** Switches the tab group. `ghost` is the quieter style for the closing lines. */
export function SwitchTabButton({
  to,
  variant = "primary",
  children,
}: {
  to: StoryTab;
  variant?: "primary" | "ghost";
  children: ReactNode;
}) {
  const tabs = useContext(StoryTabsContext);
  return (
    <button
      type="button"
      onClick={() => tabs?.select(to)}
      className={`inline-flex h-10 w-fit cursor-pointer items-center justify-center rounded-[8px] px-4 font-label text-[14px] font-medium transition-colors ${
        variant === "primary"
          ? "bg-[var(--accent-dark)] text-white hover:opacity-90"
          : "border border-border bg-transparent text-primary hover:bg-black/[0.04]"
      }`}
    >
      {children}
    </button>
  );
}

type Box = { left: number; right: number };

/**
 * The nav's easing: a long, soft ease-out for the leading edge, and a spring
 * with a touch of overshoot (the nav's is stronger) for the trailing one.
 */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_SPRING = "cubic-bezier(0.34, 1.2, 0.64, 1)";

/** The SVG filter that melts the three shapes together while the fill moves. */
const GOO_FILTER = "url(#story-tabs-goo)";

/**
 * Two tabs on a neutral tray. The dark fill is three shapes under a goo
 * filter: a head and a tail, each a pill the size of a tab, joined by a thin
 * bridge. On a switch the head runs ahead to the new tab while the tail waits a
 * beat, so the bridge stretches thin between them and the filter pulls it into
 * a neck, like paste squeezed out of a tube. Then the tail springs after it
 * and the shape pools back into one pill on the new tab.
 */
export function StoryTabs({ showcase, caseStudy }: { showcase: ReactNode; caseStudy: ReactNode }) {
  const tabs = useContext(StoryTabsContext);
  const [localValue, setLocalValue] = useState<StoryTab>("showcase");
  const value = tabs?.value ?? localValue;
  const onValueChange = (next: string) => {
    const tab = next as StoryTab;
    if (tabs) tabs.setValue(tab);
    else setLocalValue(tab);
  };

  const listRef = useRef<HTMLDivElement>(null);
  const gooRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const tailRef = useRef<HTMLSpanElement>(null);
  const bridgeRef = useRef<HTMLSpanElement>(null);
  const previous = useRef<Box | null>(null);
  const run = useRef(0);

  useLayoutEffect(() => {
    const list = listRef.current;
    const goo = gooRef.current;
    const head = headRef.current;
    const tail = tailRef.current;
    const bridge = bridgeRef.current;
    if (!list || !goo || !head || !tail || !bridge) return;
    const shapes = [head, tail, bridge];

    // Edge positions in the list's own coordinates: `right` is the gap to the list's right edge.
    const measure = (): Box | null => {
      const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (!active) return null;
      return { left: active.offsetLeft, right: list.clientWidth - (active.offsetLeft + active.offsetWidth) };
    };

    const place = (box: Box) => {
      for (const shape of shapes) {
        shape.style.width = "";
        shape.style.left = `${box.left}px`;
        shape.style.right = `${box.right}px`;
      }
    };

    const to = measure();
    if (!to) return;
    const from = previous.current;
    previous.current = to;
    place(to);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (from && !reduce && from.left !== to.left) {
      const movingRight = to.left > from.left;
      for (const shape of shapes) shape.getAnimations().forEach((animation) => animation.cancel());

      // The head runs ahead; the tail holds for a beat, then springs after it.
      const lead = { duration: 440, easing: EASE_OUT, fill: "backwards" as const };
      const trail = { duration: 760, delay: 170, easing: EASE_SPRING, fill: "backwards" as const };
      const edges = (shape: HTMLElement, timing: typeof lead | typeof trail) => [
        shape.animate({ left: [`${from.left}px`, `${to.left}px`] }, timing),
        shape.animate({ right: [`${from.right}px`, `${to.right}px`] }, timing),
      ];

      const running = [
        ...edges(head, lead),
        ...edges(tail, trail),
        // The bridge spans them: its front edge rides with the head, its back edge with the tail.
        bridge.animate({ left: [`${from.left}px`, `${to.left}px`] }, movingRight ? trail : lead),
        bridge.animate({ right: [`${from.right}px`, `${to.right}px`] }, movingRight ? lead : trail),
      ];

      // The filter only runs during the move, so the fill is crisp at rest.
      const id = ++run.current;
      goo.style.filter = GOO_FILTER;
      Promise.allSettled(running.map((animation) => animation.finished)).then(() => {
        if (id === run.current) goo.style.filter = "";
      });
    }

    // Re-fit without animating if the tabs resize (web font arriving, viewport change).
    const observer = new ResizeObserver(() => {
      const next = measure();
      if (!next) return;
      previous.current = next;
      place(next);
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, [value]);

  const triggerClass =
    "relative z-10 h-10 flex-none rounded-full border-transparent px-5 font-label text-[14px] font-medium text-secondary " +
    "transition-[color,opacity] duration-300 ease-out hover:text-secondary hover:opacity-70 " +
    "data-active:bg-transparent data-active:text-white data-active:opacity-100 data-active:delay-100 data-active:hover:text-white " +
    "group-data-[variant=default]/tabs-list:data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-transparent";

  return (
    <>
      <CaseStudySideToc items={value === "showcase" ? SHOWCASE_TOC : CASE_STUDY_TOC} alignToId="overview" />
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <defs>
          {/* A wide blur, then a hard alpha threshold: shapes that come close melt into one. */}
          <filter id="story-tabs-goo" x="-20%" y="-120%" width="140%" height="340%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11" />
          </filter>
        </defs>
      </svg>
      <Tabs id={TABS_ID} value={value} onValueChange={onValueChange} className="gap-16">
        <TabsList
          ref={listRef}
          aria-label="Page view"
          className="relative h-12 gap-0 rounded-full bg-black/[0.05] p-1 group-data-horizontal/tabs:h-12"
        >
          <div ref={gooRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span ref={bridgeRef} className="absolute bottom-[17px] top-[17px] rounded-full bg-primary" style={{ left: 4, width: 147 }} />
            <span ref={tailRef} className="absolute bottom-1 top-1 rounded-full bg-primary" style={{ left: 4, width: 147 }} />
            <span ref={headRef} className="absolute bottom-1 top-1 rounded-full bg-primary" style={{ left: 4, width: 147 }} />
          </div>
          <TabsTrigger value="showcase" className={triggerClass}>
            Visual Showcase
          </TabsTrigger>
          <TabsTrigger value="case-study" className={triggerClass}>
            Case Study
          </TabsTrigger>
        </TabsList>
        <TabsContent value="showcase" className="text-base animate-in fade-in duration-300">
          {showcase}
        </TabsContent>
        <TabsContent value="case-study" className="text-base animate-in fade-in duration-300">
          {caseStudy}
        </TabsContent>
      </Tabs>
    </>
  );
}
