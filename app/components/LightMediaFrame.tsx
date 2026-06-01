import type { ReactNode } from "react";

export default function LightMediaFrame({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={["overflow-hidden rounded-2xl", className].filter(Boolean).join(" ")}
      style={{
        boxShadow: "inset 0 0 0 1.5px var(--ds-border-media)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
