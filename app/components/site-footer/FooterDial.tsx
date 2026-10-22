"use client";

import { DialRoot, useDialKit } from "dialkit";
import "dialkit/styles.css";
import { useEffect } from "react";

/**
 * Dev-only DialKit panel for the site footer. Sets --footer-border-opacity,
 * which the "Department of Design" border in SiteFooter.module.css reads.
 */
export function FooterDial() {
  const dial = useDialKit("Footer", {
    borderOpacity: [0.3, 0, 1, 0.01],
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--footer-border-opacity", String(dial.borderOpacity));
    return () => {
      root.style.removeProperty("--footer-border-opacity");
    };
  }, [dial.borderOpacity]);

  return <DialRoot position="top-right" />;
}
