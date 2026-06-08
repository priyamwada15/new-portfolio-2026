"use client";

import { useDialKit } from "dialkit";
import { useEffect } from "react";
import { HOME_LISTENING_DIAL_CONFIG, homeListeningCssVars } from "./homeListeningDial.config";

const WIDGET_SELECTOR = ".home-v2-listening-widget";

export function HomeListeningDial() {
  const dial = useDialKit("Listening widget", HOME_LISTENING_DIAL_CONFIG);

  useEffect(() => {
    const el = document.querySelector(WIDGET_SELECTOR);
    if (!(el instanceof HTMLElement)) return;

    const vars = homeListeningCssVars({ spacing: dial.spacing });

    for (const [key, value] of Object.entries(vars)) {
      el.style.setProperty(key, value);
    }
  }, [dial]);

  return null;
}
