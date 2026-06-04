"use client";

import { useDialKit } from "dialkit";
import { useEffect } from "react";
import {
  HOME_SCROLL_REVEAL_DIAL_CONFIG,
  homeScrollRevealCssVars,
} from "./homeScrollRevealDial.config";

const FLIP_FOOTER_LAYER_SELECTOR = ".site-scroll-layer--flip-footer";

export function HomeScrollRevealDial() {
  const dial = useDialKit("Scroll reveal", HOME_SCROLL_REVEAL_DIAL_CONFIG);

  useEffect(() => {
    const layer = document.querySelector(FLIP_FOOTER_LAYER_SELECTOR);
    if (!(layer instanceof HTMLElement)) return;

    const vars = homeScrollRevealCssVars({ sheet: dial.sheet });

    for (const [key, value] of Object.entries(vars)) {
      layer.style.setProperty(key, value);
    }
  }, [dial]);

  return null;
}
