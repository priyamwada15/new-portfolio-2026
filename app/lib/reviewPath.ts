import { usePathname } from "next/navigation";

/** Review-only copy of the site (Dive Club) is served under this prefix. See `app/dive/`. */
export const REVIEW_BASE = "/dive";

/** Paths rewritten to another app (see `next.config.ts`), so they can't be mirrored under `/dive`. */
const UNMIRRORED_PREFIXES = ["/the-intelligencer"] as const;

export function isReviewPath(pathname: string): boolean {
  return pathname === REVIEW_BASE || pathname.startsWith(`${REVIEW_BASE}/`);
}

/** `/dive/salesforce` → `/salesforce`, `/dive` → `/`. Public paths pass through. */
export function stripReviewBase(pathname: string): string {
  if (!isReviewPath(pathname)) return pathname;
  return pathname.slice(REVIEW_BASE.length) || "/";
}

/** Internal href → its `/dive` copy. External, hash and unmirrored hrefs pass through. */
export function toReviewHref(href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (UNMIRRORED_PREFIXES.some((p) => href === p || href.startsWith(`${p}/`))) return href;
  return href === "/" ? REVIEW_BASE : `${REVIEW_BASE}${href}`;
}

/** Current pathname with the `/dive` prefix removed, for page-type checks. */
export function useSitePathname(): string {
  return stripReviewBase(usePathname() ?? "/");
}

/** Maps internal hrefs into `/dive` while on a review page; identity elsewhere. */
export function useSiteHref(): (href: string) => string {
  const inReview = isReviewPath(usePathname() ?? "/");
  return (href) => (inReview ? toReviewHref(href) : href);
}
