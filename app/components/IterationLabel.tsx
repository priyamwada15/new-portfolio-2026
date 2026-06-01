import { fontStyle, iterationLabel } from "@/design-system";

export default function IterationLabel({
  children,
  className = "mb-2",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`${iterationLabel} ${className}`}
      style={{ ...fontStyle.label, color: "var(--accent-dark)" }}
    >
      {children}
    </p>
  );
}
