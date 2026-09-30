import type { Metadata } from "next";
import { AdtuaDetail } from "../home-v2/AdtuaSnapshot";
import styles from "../home-v2/home.module.css";

/** Private page for editing the Adtua snapshot's detail card in isolation. */
export const metadata: Metadata = {
  title: "Adtua detail card",
  robots: { index: false, follow: false },
};

export default function AdtuaCardPage() {
  return (
    <div className="px-4 py-16">
      {/* Same frame as the homepage dialog, rendered inline */}
      <div className={styles.dialog} style={{ maxHeight: "none", overflow: "hidden" }}>
        <AdtuaDetail />
      </div>
    </div>
  );
}
