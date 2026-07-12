/**
 * Shared responsive breakpoints (min-width, px). Mirrored as real Tailwind
 * variants via --breakpoint-tablet / --breakpoint-desktop in theme.css —
 * use `tablet:` / `max-tablet:` / `desktop:` / `max-desktop:` in className
 * strings rather than ad-hoc `min-[...]:` arbitrary values.
 *
 * "Mobile" means below `tablet` (max-tablet:, i.e. < 744px).
 */
export const BREAKPOINTS = {
  tablet: 744,
  desktop: 1024,
} as const;
