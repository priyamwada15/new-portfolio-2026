import { SiteLink } from "@/app/components/SiteLink";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type HomeV2CardLinkProps = {
  href: string;
  ariaLabel: string;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

export function HomeV2CardLink({
  href,
  ariaLabel,
  children,
  style,
  className,
}: HomeV2CardLinkProps) {
  const linkStyle: CSSProperties = {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
    ...style,
  };

  const mergedClassName = cn("home-v2-main-card", className);

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        style={linkStyle}
        className={mergedClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <SiteLink href={href} aria-label={ariaLabel} style={linkStyle} className={mergedClassName}>
      {children}
    </SiteLink>
  );
}
