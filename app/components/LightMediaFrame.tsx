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
      className={[
        "box-border overflow-hidden rounded-2xl min-[400px]:rounded-[28px]",
        "border-[1.5px] border-solid border-[#E6E6E6]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}
