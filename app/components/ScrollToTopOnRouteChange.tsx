"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTopOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    // Preserve in-page hash navigation (e.g. "/#play").
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
