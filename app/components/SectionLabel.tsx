import { caseStudySectionTag } from "@/design-system";

export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={caseStudySectionTag} style={{ color: "var(--accent-dark)" }}>
      {children}
    </p>
  );
}
