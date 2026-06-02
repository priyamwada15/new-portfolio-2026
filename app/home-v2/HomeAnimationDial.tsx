"use client";

import { useDialKit } from "dialkit";
import { useEffect } from "react";
import { HOME_ANIMATION_DIAL_CONFIG, homeAnimationCssVars } from "./homeAnimationDial.config";

const LAYOUT_SELECTOR = ".home-v2-layout";

export function HomeAnimationDial() {
  const dial = useDialKit("Home animations", HOME_ANIMATION_DIAL_CONFIG);

  useEffect(() => {
    const el = document.querySelector(LAYOUT_SELECTOR);
    if (!(el instanceof HTMLElement)) return;

    const vars = homeAnimationCssVars({
      cards: dial.cards,
      snippets: dial.snippets,
      books: dial.books,
    });

    for (const [key, value] of Object.entries(vars)) {
      el.style.setProperty(key, value);
    }
  }, [dial]);

  return null;
}
