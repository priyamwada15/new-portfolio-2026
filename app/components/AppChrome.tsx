"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import { HOME_V2_PAGE_BG, SITE_DEFAULT_PAGE_BG, isRocketMortgagePath } from "../lib/caseStudy";
import { AsciiCursorTrail } from "./AsciiCursorTrail";

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

  useEffect(() => {
    if (!isHomeV2) return;
    document.body.style.backgroundColor = HOME_V2_PAGE_BG;
    document.body.classList.add("ascii-cursor");
    return () => {
      document.body.style.backgroundColor = SITE_DEFAULT_PAGE_BG;
      document.body.classList.remove("ascii-cursor");
    };
  }, [isHomeV2]);

  if (bareAsciiGame || bareSunlight || bareWater) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  return (
    <>
      <Nav />
      <main
        className="flex-1 pt-[96px]"
        style={isRocketMortgage ? { backgroundColor: "#FAFAFA" } : undefined}
      >
        {children}
      </main>
      <Footer />
      {isHomeV2 ? <AsciiCursorTrail /> : null}
    </>
  );
}
