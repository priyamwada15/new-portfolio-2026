"use client";

import { useEffect } from "react";
import { useSitePathname } from "../lib/reviewPath";
import Nav from "./Nav";
import Footer from "./Footer";
import { CASE_STUDY_PAGE_BG, HOME_V2_PAGE_BG, PLAYGROUND_PAGE_BG, SITE_DEFAULT_PAGE_BG } from "@/design-system";
import { isCaseStudyPath } from "../lib/caseStudy";
import dynamic from "next/dynamic";
import { HOME_SCROLL_REVEAL_CSS_DEFAULTS } from "../home-v2/homeScrollRevealDial.config";
import DevAgentation from "./DevAgentation";
import { FOOTER_REVEAL_OVERLAP_PX } from "./site-footer/constants";
import CaseStudyTransition from "./CaseStudyTransition";

// The olive sticker footer, revealed as the page lifts away (it replaced the flip-board footer)
const SiteFooter = dynamic(() => import("./site-footer/SiteFooter"), { ssr: false });
export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = useSitePathname();
  const isHomeV2 = pathname === "/";
  const bareArcadeEffwon =
    pathname === "/arcade-effwon" || pathname.startsWith("/arcade-effwon/");
  const bareSunlight =
    pathname === "/sunlight" || pathname.startsWith("/sunlight/");
  const bareWater =
    pathname === "/water" || pathname.startsWith("/water/");
  const bareFloorPlanVersion =
    pathname === "/floor-plan-version" || pathname.startsWith("/floor-plan-version/");
  const bareKineticFacade =
    pathname === "/kinetic-facade" || pathname.startsWith("/kinetic-facade/");
  const bareResume = pathname === "/resume";
  const isBarePage =
    bareArcadeEffwon || bareSunlight || bareWater || bareFloorPlanVersion || bareKineticFacade || bareResume;
  const isFlipBoardTest =
    pathname === "/flip-board-test" ||
    (pathname?.startsWith("/flip-board-test/") ?? false);
  const isCaseStudy = pathname ? isCaseStudyPath(pathname) : false;
  const isPlayground =
    pathname === "/fun" || pathname.startsWith("/fun/");
  const useFlipBoardFooter = isHomeV2 || isFlipBoardTest || isCaseStudy || isPlayground;

  useEffect(() => {
    if (isBarePage) return;

    if (isHomeV2) {
      document.body.style.backgroundColor = HOME_V2_PAGE_BG;
    } else if (isCaseStudy) {
      document.body.style.backgroundColor = CASE_STUDY_PAGE_BG;
    } else if (isPlayground) {
      document.body.style.backgroundColor = PLAYGROUND_PAGE_BG;
    }

    return () => {
      document.body.style.backgroundColor = SITE_DEFAULT_PAGE_BG;
    };
  }, [isBarePage, isCaseStudy, isHomeV2, isPlayground]);

  if (isBarePage) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  const scrollLayerBg = isHomeV2
    ? HOME_V2_PAGE_BG
    : isPlayground
      ? PLAYGROUND_PAGE_BG
      : isCaseStudy
        ? CASE_STUDY_PAGE_BG
        : SITE_DEFAULT_PAGE_BG;

  const mainColumn = (
    <div className="flex min-h-screen flex-1 flex-col">
      <Nav />
      <main className="flex-1 overflow-visible">
        <CaseStudyTransition isCaseStudy={isCaseStudy}>{children}</CaseStudyTransition>
      </main>
      {!useFlipBoardFooter ? <Footer /> : null}
    </div>
  );

  const scrollSheet = (
    <div className="site-scroll-layer__sheet pointer-events-none flex flex-col">
      <div
        className="site-scroll-layer__sheet-surface pointer-events-none flex min-h-0 flex-1 flex-col"
        style={{
          backgroundColor: scrollLayerBg,
          boxShadow: "var(--home-scroll-sheet-shadow)",
        }}
      >
        <div className="site-scroll-layer__sheet-body pointer-events-auto flex min-h-0 flex-1 flex-col [&_*]:pointer-events-auto">
          {mainColumn}
        </div>
        <div className="site-scroll-layer__sheet-foot pointer-events-none flex flex-col [&_*]:pointer-events-none">
          <div
            id="flip-board-reveal-sentinel"
            className="h-px w-full shrink-0"
            aria-hidden
          />
          <div
            className="home-v2-flip-footer-gap min-h-[104px] w-full shrink-0"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {useFlipBoardFooter ? (
        <>
          <div
            className="site-scroll-layer site-scroll-layer--flip-footer pointer-events-none relative z-10 flex min-h-screen flex-col"
            style={{
              ...HOME_SCROLL_REVEAL_CSS_DEFAULTS,
              pointerEvents: "none",
            }}
          >
            {scrollSheet}
            <div
              className="site-scroll-layer__reveal-spacer pointer-events-none w-full shrink-0"
              style={{
                height: `max(0px, calc(var(--footer-reveal-height, 694px) - ${FOOTER_REVEAL_OVERLAP_PX}px))`,
              }}
              aria-hidden
            />
          </div>
          <SiteFooter />
        </>
      ) : (
        <div className="site-scroll-layer relative z-10 flex min-h-screen flex-1 flex-col">
          {mainColumn}
        </div>
      )}
      <DevAgentation />
    </>
  );
}
