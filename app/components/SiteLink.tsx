"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useSiteHref } from "../lib/reviewPath";

/** `next/link` that stays inside `/dive` on review pages. For server components that can't call the hook. */
export function SiteLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const siteHref = useSiteHref();
  return <Link href={siteHref(href)} {...props} />;
}

/** Plain `<a>` counterpart of `SiteLink`, for links that intentionally do a full page load. */
export function SiteAnchor({ href, ...props }: ComponentProps<"a"> & { href: string }) {
  const siteHref = useSiteHref();
  return <a href={siteHref(href)} {...props} />;
}
