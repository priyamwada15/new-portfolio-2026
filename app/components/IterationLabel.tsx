export default function IterationLabel({
  children,
  className = "mb-2",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[12px] font-semibold tracking-wider uppercase ${className}`}
      style={{ fontFamily: "var(--font-hind), sans-serif", color: "var(--accent-dark)" }}
    >
      {children}
    </p>
  );
}
