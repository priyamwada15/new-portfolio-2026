"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import { HOME_V2_PAGE_BG, SITE_DEFAULT_PAGE_BG, isRocketMortgagePath, surfaces } from "@/design-system";
import {
  CASE_STUDY_PAGE_BG,
  caseStudyUsesSiteDefaultSurface,
  isCaseStudyPath,
} from "../lib/caseStudy";
import { AsciiCursorTrail } from "./AsciiCursorTrail";
import { AsteriskCursor } from "./AsteriskCursor";
import dynamic from "next/dynamic";
import DevAgentation from "./DevAgentation";

const DevDialKit = dynamic(() => import("./DevDialKit"), { ssr: false });

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomeV2 = pathname === "/";
  const isRocketMortgage = pathname ? isRocketMortgagePath(pathname) : false;
  const bareAsciiGame =
    pathname === "/ascii-game" || pathname.startsWith("/ascii-game/");
  const bareSunlight =
    pathname === "/sunlight" || pathname.startsWith("/sunlight/");
  const bareWater =
    pathname === "/water" || pathname.startsWith("/water/");
  const isBarePage = bareAsciiGame || bareSunlight || bareWater;
  const usePortfolioAsteriskCursor = !isHomeV2 && !isBarePage;

  useEffect(() => {
    if (isBarePage) return;

    if (isHomeV2) {
      document.body.style.backgroundColor = HOME_V2_PAGE_BG;
      document.body.classList.add("ascii-cursor");
      document.body.classList.remove("portfolio-asterisk-cursor");
    } else {
      document.body.classList.add("portfolio-asterisk-cursor");
      document.body.classList.remove("ascii-cursor");
    }

    return () => {
      document.body.style.backgroundColor = SITE_DEFAULT_PAGE_BG;
      document.body.classList.remove("ascii-cursor", "portfolio-asterisk-cursor");
    };
  }, [isBarePage, isHomeV2]);

  if (isBarePage) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  const caseStudy =
    pathname ? isCaseStudyPath(pathname) : false;
  const caseStudyCustomBg =
    caseStudy && pathname && !caseStudyUsesSiteDefaultSurface(pathname);

  const scrollLayerBg = isHomeV2 || isRocketMortgage
    ? HOME_V2_PAGE_BG
    : caseStudyCustomBg
      ? CASE_STUDY_PAGE_BG
      : SITE_DEFAULT_PAGE_BG;

  return (
    <>
      <div className="site-scroll-layer relative z-10 flex min-h-screen flex-1 flex-col">
        <div
          className="flex min-h-screen flex-1 flex-col"
          style={{ backgroundColor: scrollLayerBg }}
        >
          <Nav />
          <main
            className="flex-1 overflow-visible"
            style={isRocketMortgage ? { backgroundColor: surfaces.page } : undefined}
          >
            {children}
          </main>
          <Footer />
        </div>
      </div>
      <DevAgentation />
      <DevDialKit />
      {isHomeV2 ? <AsciiCursorTrail /> : null}
      {usePortfolioAsteriskCursor ? <AsteriskCursor /> : null}
    </>
  );
}
