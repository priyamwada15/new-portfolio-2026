"use client";

import { ViewTransition, useEffect, useLayoutEffect } from "react";
import { isCaseStudyPath } from "@/design-system";

/** Fallback for browsers without `document.activeViewTransition`. */
const CLEAR_AFTER_MS = 3000;

let currentTransition: object | undefined;

/**
 * Tags <html> for the duration of the running view transition; globals.css
 * keys the case study blur/fade off it.
 */
function markTransition() {
  const root = document.documentElement;
  const active = (document as Document & { activeViewTransition?: ReturnType<Document["startViewTransition"]> | null })
    .activeViewTransition;
  // The new page must be captured unblurred; the old snapshot already holds the blur.
  delete root.dataset.csPending;
  // Initial page load mounts without a transition; nothing to mark.
  if (active === null) return;

  const token = {};
  currentTransition = token;
  root.dataset.csTransition = "";
  // React hides the root snapshot when no named boundary changed, unless
  // <html> carries an inline view-transition-name.
  root.style.viewTransitionName = "root";
  const clear = () => {
    if (currentTransition !== token) return;
    delete root.dataset.csTransition;
    root.style.viewTransitionName = "";
  };
  // React can hold the transition open while new images load, so clear on
  // finish rather than after a fixed delay.
  if (active) active.finished.finally(clear);
  else setTimeout(clear, CLEAR_AFTER_MS);
}

/** Safety net in case a pending navigation never commits. */
const PENDING_TIMEOUT_MS = 5000;

/**
 * Starts blurring the current page on click, so there's immediate feedback
 * while Next fetches the next route. Only for links that enter or leave a
 * case study, which are the navigations that run the view transition.
 */
function useBlurOnClick() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (isCaseStudyPath(url.pathname) === isCaseStudyPath(location.pathname)) return;

      const root = document.documentElement;
      root.dataset.csPending = "";
      clearTimeout(timer);
      timer = setTimeout(() => delete root.dataset.csPending, PENDING_TIMEOUT_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimeout(timer);
    };
  }, []);
}

/** Layout effects run inside the transition's update, before the new snapshot. */
function CaseStudyMarker() {
  useLayoutEffect(() => {
    markTransition();
    return markTransition;
  }, []);
  return null;
}

/**
 * Entering or leaving a case study blurs the outgoing page out and the
 * incoming one in, with the nav held still. React only starts a document view
 * transition when a <ViewTransition> mounts, so the boundary is keyed on
 * whether this is a case study: entering or leaving one remounts it, other
 * navigations don't. `default="none"` keeps the page in the root snapshot so
 * the CSS in globals.css animates it as a whole.
 */
export default function CaseStudyTransition({
  isCaseStudy,
  children,
}: {
  isCaseStudy: boolean;
  children: React.ReactNode;
}) {
  useBlurOnClick();
  return (
    <ViewTransition key={isCaseStudy ? "case-study" : "page"} default="none">
      {isCaseStudy ? <CaseStudyMarker /> : null}
      {children}
    </ViewTransition>
  );
}
