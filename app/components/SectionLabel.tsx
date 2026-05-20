export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono text-[14px] font-semibold mb-4"
      style={{ color: "var(--accent-dark)" }}
    >
      {children}
    </p>
  );
}
