import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import styles from "./CaseStudyStatusPills.module.css";

/*
 * Status of a case study under NDA: shared by the homepage card and the case
 * study page. Both pills use the same material (white, soft hairline border,
 * barely-there lift) and the same quiet text; only the marker differs.
 */
const pill =
  "inline-flex h-6 items-center gap-1.5 rounded-full border border-border/60 bg-white pr-2.5 font-label text-[12px] font-normal leading-none text-tertiary shadow-[0_1px_1px_rgba(17,17,17,0.03)]";

export function CaseStudyStatusPills() {
  return (
    <div className="flex items-center gap-2">
      <span className={`${pill} pl-2.5`}>
        <span className={styles.dot} aria-hidden="true" />
        In progress
      </span>
      <span className={`${pill} pl-2`}>
        <LockSimple size={12} weight="bold" aria-hidden="true" />
        Limited preview
      </span>
    </div>
  );
}
