import type { ReactNode } from "react";
import styles from "./CardTags.module.css";

/** Bordered tags shared by the homepage case study cards and fun-project cards. */
export function CardTags({ tags }: { tags: readonly ReactNode[] }) {
  return (
    <span className={styles.tags}>
      {tags.map((tag, i) => (
        <span key={i} className={styles.tag}>
          {tag}
        </span>
      ))}
    </span>
  );
}
