import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

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

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        style={linkStyle}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} style={linkStyle} className={className}>
      {children}
    </Link>
  );
}
