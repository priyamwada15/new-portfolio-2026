"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import { HOME_V2_PAGE_BG, SITE_DEFAULT_PAGE_BG } from "@/design-system";
import { isCaseStudyPath } from "../lib/caseStudy";
import { AsciiCursorTrail } from "./AsciiCursorTrail";
import { AsteriskCursor } from "./AsteriskCursor";
import dynamic from "next/dynamic";
import { FLIP_BOARD_REVEAL_IMAGE_OVERLAP_PX } from "./flip-board/constants";
import { HOME_SCROLL_REVEAL_CSS_DEFAULTS } from "../home-v2/homeScrollRevealDial.config";
import { initFlipBoardAudioUnlock } from "./flip-board/flipBoardSound";
import DevAgentation from "./DevAgentation";

const FlipBoardFooter = dynamic(
  () => import("./flip-board/FlipBoardFooter"),
  { ssr: false },
);
export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomeV2 = pathname === "/";
  const bareAsciiGame =
    pathname === "/ascii-game" || pathname.startsWith("/ascii-game/");
  const bareSunlight =
    pathname === "/sunlight" || pathname.startsWith("/sunlight/");
  const bareWater =
    pathname === "/water" || pathname.startsWith("/water/");
  const isBarePage = bareAsciiGame || bareSunlight || bareWater;
  const isFlipBoardTest =
    pathname === "/flip-board-test" ||
    (pathname?.startsWith("/flip-board-test/") ?? false);
  const isCaseStudy = pathname ? isCaseStudyPath(pathname) : false;
  const useFlipBoardFooter = isHomeV2 || isFlipBoardTest || isCaseStudy;
  const usePortfolioAsteriskCursor = !isHomeV2 && !isBarePage;

  useEffect(() => {
    if (isBarePage) return;

    if (isHomeV2) {
      document.body.style.backgroundColor = HOME_V2_PAGE_BG;
      document.body.classList.add("ascii-cursor");
      document.body.classList.remove("portfolio-asterisk-cursor");
    } else {
      if (isCaseStudy) {
        document.body.style.backgroundColor = SITE_DEFAULT_PAGE_BG;
      }
      document.body.classList.add("portfolio-asterisk-cursor");
      document.body.classList.remove("ascii-cursor");
    }

    return () => {
      document.body.style.backgroundColor = SITE_DEFAULT_PAGE_BG;
      document.body.classList.remove(
        "ascii-cursor",
        "portfolio-asterisk-cursor",
      );
    };
  }, [isBarePage, isCaseStudy, isHomeV2]);

  useEffect(() => {
    if (!useFlipBoardFooter) return;
    initFlipBoardAudioUnlock();
  }, [useFlipBoardFooter]);

  if (isBarePage) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  const scrollLayerBg = isHomeV2 ? HOME_V2_PAGE_BG : SITE_DEFAULT_PAGE_BG;

  const mainColumn = (
    <div className="flex min-h-screen flex-1 flex-col">
      <Nav />
      <main className="flex-1 overflow-visible">
        {children}
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
            className="home-v2-flip-footer-gap min-h-[56px] w-full shrink-0"
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
                height: `max(0px, calc(var(--flip-footer-height, 540px) - var(--flip-footer-reveal-image-overlap, ${FLIP_BOARD_REVEAL_IMAGE_OVERLAP_PX}px)))`,
              }}
              aria-hidden
            />
          </div>
          <FlipBoardFooter layout="scroll-reveal" />
        </>
      ) : (
        <div className="site-scroll-layer relative z-10 flex min-h-screen flex-1 flex-col">
          {mainColumn}
        </div>
      )}
      <DevAgentation />
      {isHomeV2 ? <AsciiCursorTrail /> : null}
      {usePortfolioAsteriskCursor ? <AsteriskCursor /> : null}
    </>
  );
}
