"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { cn } from "@/lib/utils";
import { AboutAnimatedHeadline } from "./AboutAnimatedHeadline";
import { TIMELINE_DATES, TIMELINE_ENTRIES } from "./aboutTimelineContent";
import {
  RocketMortgagePhotoRow,
  TIMELINE_SECTION_GAP_CLASS,
  TimelineEntryBlock,
  TimelineRow,
} from "./AboutTimeline";
import { TimelineDesktopRail } from "./TimelineDesktopRail";
import TimelinePhotoStripIub from "./TimelinePhotoStripIub";

const STICKY_TOP_PX = 120;
const CHAPTER_BASE_CLASS = "timeline-chapter";
const HTML_SNAP_CLASS = "about-timeline-scroll-snap";
const SNIPPETS_SELECTOR = ".timeline-snap-section";
/** Keep snap off at page top so main padding + headline layout stay natural */
const TOP_SNAP_RELEASE_Y = 80;
const SNIPPETS_ENTER_RATIO = 0.55;
const SNIPPETS_EXIT_RATIO = 0.68;

function getBelowChapterStyle(depth: number) {
  const blurPx = Math.min(14, 4 + depth * 3.5);
  const opacity = Math.max(0.18, 0.72 - depth * 0.22);

  return {
    filter: `blur(${blurPx}px)`,
    opacity,
  };
}

const TimelineChapter = forwardRef<
  HTMLDivElement,
  {
    index: number;
    activeIndex: number;
    reducedMotion: boolean;
    children: ReactNode;
  }
>(function TimelineChapter(
  { index, activeIndex, reducedMotion, children },
  ref
) {
  const depth = index - activeIndex;
  const isActive = depth === 0;
  const isAbove = depth < 0;

  return (
    <div
      ref={ref}
      data-chapter-index={index}
      className={cn(
        CHAPTER_BASE_CLASS,
        !reducedMotion &&
          !isActive &&
          "pointer-events-none transition-[filter,opacity] duration-500 ease-out motion-reduce:transition-none"
      )}
      style={
        reducedMotion || isActive
          ? undefined
          : isAbove
            ? { opacity: 0 }
            : getBelowChapterStyle(depth)
      }
    >
      {children}
    </div>
  );
});

TimelineChapter.displayName = "TimelineChapter";

export default function TimelineScrollStage() {
  const [entry1, entry2, entry3, entry4] = TIMELINE_ENTRIES;
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const snippetsReleasedRef = useRef(false);
  const lastChapterReleasedRef = useRef(false);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const updateSnapClass = useCallback(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    if (!desktopQuery.matches || motionQuery.matches) {
      document.documentElement.classList.remove(HTML_SNAP_CLASS);
      return;
    }

    const snippets = document.querySelector(SNIPPETS_SELECTOR);
    const snippetsTop = snippets?.getBoundingClientRect().top ?? Infinity;
    const lastChapter = chapterRefs.current[3];
    const lastChapterBottom = lastChapter?.getBoundingClientRect().bottom ?? Infinity;

    if (snippetsReleasedRef.current) {
      if (
        snippetsTop > window.innerHeight * SNIPPETS_EXIT_RATIO &&
        lastChapterBottom > window.innerHeight * 0.75
      ) {
        snippetsReleasedRef.current = false;
      }
    } else if (
      snippetsTop < window.innerHeight * SNIPPETS_ENTER_RATIO ||
      lastChapterBottom < window.innerHeight * 0.45
    ) {
      snippetsReleasedRef.current = true;
    }

    const lastChapterTop = lastChapter?.getBoundingClientRect().top ?? Infinity;

    if (
      activeIndexRef.current >= 3 ||
      lastChapterTop < window.innerHeight * 0.88
    ) {
      lastChapterReleasedRef.current = true;
    } else if (
      activeIndexRef.current <= 1 &&
      lastChapterTop > window.innerHeight
    ) {
      lastChapterReleasedRef.current = false;
    }

    const nearPageTop = window.scrollY < TOP_SNAP_RELEASE_Y;
    const shouldSnap =
      !nearPageTop &&
      !snippetsReleasedRef.current &&
      !lastChapterReleasedRef.current;

    if (shouldSnap) {
      document.documentElement.classList.add(HTML_SNAP_CLASS);
    } else {
      document.documentElement.classList.remove(HTML_SNAP_CLASS);
    }
  }, []);

  const updateActiveIndex = useCallback(() => {
    const chapters = chapterRefs.current.filter(Boolean) as HTMLDivElement[];
    if (chapters.length === 0) return;

    const headlineHeight = headlineRef.current?.offsetHeight ?? 42;
    const anchor = STICKY_TOP_PX + headlineHeight + 24;

    // Near page top, keep chapter 0 active and avoid snap fighting scroll-up.
    if (window.scrollY < 48) {
      activeIndexRef.current = 0;
      setActiveIndex((prev) => (prev === 0 ? prev : 0));
      return;
    }

    let nextActive = 0;
    for (let i = 0; i < chapters.length; i++) {
      const { top, bottom } = chapters[i].getBoundingClientRect();
      if (top <= anchor && bottom > anchor) {
        nextActive = i;
        break;
      }
      if (top <= anchor) {
        nextActive = i;
      }
    }

    activeIndexRef.current = nextActive;
    setActiveIndex((prev) => (prev === nextActive ? prev : nextActive));
  }, []);

  useLayoutEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const syncMotion = () => {
      setReducedMotion(motionQuery.matches);
      updateSnapClass();
    };

    syncMotion();
    updateActiveIndex();
    updateSnapClass();

    motionQuery.addEventListener("change", syncMotion);
    desktopQuery.addEventListener("change", updateSnapClass);

    return () => {
      document.documentElement.classList.remove(HTML_SNAP_CLASS);
      motionQuery.removeEventListener("change", syncMotion);
      desktopQuery.removeEventListener("change", updateSnapClass);
    };
  }, [updateActiveIndex, updateSnapClass]);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        updateActiveIndex();
        updateSnapClass();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [updateActiveIndex, updateSnapClass]);

  const setChapterRef = (index: number) => (node: HTMLDivElement | null) => {
    chapterRefs.current[index] = node;
  };

  return (
    <div>
      <TimelineDesktopRail>
        <div className="relative">
          <AboutAnimatedHeadline
            ref={headlineRef}
            className="sticky top-[120px] z-30 max-w-[644px] pb-6 text-[32px] font-semibold leading-[130%] text-[#333333]"
          />

          <div className="mt-[25px]">
            <TimelineChapter
              ref={setChapterRef(0)}
              index={0}
              activeIndex={activeIndex}
              reducedMotion={reducedMotion}
            >
              <ScrollReveal revealOnMount>
                <TimelineRow dateLabel={TIMELINE_DATES[0]} badgeMarker="first">
                  <TimelineEntryBlock {...entry1} />
                </TimelineRow>
              </ScrollReveal>
            </TimelineChapter>

          <TimelineChapter
            ref={setChapterRef(1)}
            index={1}
            activeIndex={activeIndex}
              reducedMotion={reducedMotion}
            >
              <ScrollReveal>
                <div className={TIMELINE_SECTION_GAP_CLASS} aria-hidden />
                <TimelineRow dateLabel={TIMELINE_DATES[1]} snapPoint="always">
                  <TimelineEntryBlock {...entry2} />
                </TimelineRow>
              </ScrollReveal>
            </TimelineChapter>

          <TimelineChapter
            ref={setChapterRef(2)}
            index={2}
            activeIndex={activeIndex}
            reducedMotion={reducedMotion}
          >
            <ScrollReveal>
              <div className={TIMELINE_SECTION_GAP_CLASS} aria-hidden />
              <TimelineRow dateLabel={TIMELINE_DATES[2]} snapPoint="always">
                <TimelineEntryBlock {...entry3} />
                <div className="relative mt-8 -ml-[187px] w-[643.57px] max-w-[calc(100%+187px)]">
                  <TimelinePhotoStripIub />
                </div>
              </TimelineRow>
            </ScrollReveal>
          </TimelineChapter>
          </div>
        </div>

        <TimelineChapter
          ref={setChapterRef(3)}
          index={3}
          activeIndex={activeIndex}
          reducedMotion={reducedMotion}
        >
          <ScrollReveal>
            <div className={TIMELINE_SECTION_GAP_CLASS} aria-hidden />
            <TimelineRow dateLabel={TIMELINE_DATES[3]} badgeMarker="last">
              <div className="flex flex-col gap-8">
                <TimelineEntryBlock {...entry4} />
                <RocketMortgagePhotoRow />
              </div>
            </TimelineRow>
          </ScrollReveal>
        </TimelineChapter>
      </TimelineDesktopRail>
    </div>
  );
}
