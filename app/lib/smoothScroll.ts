/**
 * Scrolls the window to an element with a long ease-out, so it starts quickly
 * and settles gently instead of jumping. Duration grows with distance.
 * A wheel, touch or key press cancels it. Instant for reduced motion.
 */
export function smoothScrollToElement(el: HTMLElement) {
  const target = el.getBoundingClientRect().top + window.scrollY;
  const start = window.scrollY;
  const distance = target - start;
  if (Math.abs(distance) < 1) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, target);
    return;
  }

  const duration = Math.min(1200, Math.max(600, Math.abs(distance) * 0.6));
  const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
  const t0 = performance.now();
  let raf = 0;

  const stop = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
  };
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);

  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, start + distance * easeOutQuint(p));
    if (p < 1) raf = requestAnimationFrame(step);
    else stop();
  };
  raf = requestAnimationFrame(step);
}
