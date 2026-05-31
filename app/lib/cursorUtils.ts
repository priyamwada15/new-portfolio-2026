export const CLICKABLE_CURSOR_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  '[role="button"]:not([aria-disabled="true"])',
  "input:not([type='hidden']):not(:disabled)",
  "select:not(:disabled)",
  "textarea:not(:disabled)",
  "summary",
  "label[for]",
  '[tabindex]:not([tabindex="-1"])',
  ".cursor-pointer",
].join(", ");

export function isClickableCursorTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest(CLICKABLE_CURSOR_SELECTOR));
}

export function isFinePointerDevice(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function triggerAsteriskSpin(head: HTMLElement) {
  head.classList.remove("asterisk-cursor__head--spinning");
  void head.offsetWidth;
  head.classList.add("asterisk-cursor__head--spinning");
}
