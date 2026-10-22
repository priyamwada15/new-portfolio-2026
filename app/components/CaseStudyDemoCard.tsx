import type { ReactNode } from "react";
import styles from "./CaseStudyDemoCard.module.css";

/**
 * Hero visual on a case study page: the study's live coded demo on the same
 * plain card as its homepage card, so opening a case study feels like opening
 * the card. The demo fills the card and centres itself at its designed size.
 */
export function CaseStudyDemoCard({ children }: { children: ReactNode }) {
  return <div className={styles.card}>{children}</div>;
}
