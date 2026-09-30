"use client";

import { useRef } from "react";
import styles from "./sandbox.module.css";

const FACTS = [
  { label: "Role", value: "Sole product designer" },
  { label: "Users", value: "Advertisers and broadcasters" },
  { label: "Scope", value: "IA, role-based workflows, pricing and upsells" },
  { label: "Design system", value: "Built from scratch" },
  { label: "Tools", value: "Figma, Cursor" },
] as const;

/** Small "Currently" snapshot card for Adtua; opens a detail dialog. */
export function AdtuaSnapshot() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className={styles.snapshot}
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
        aria-label="Open Adtua project snapshot"
      >
        <div className={styles.snapshotMedia} aria-hidden="true" />
        <div className={styles.snapshotMeta}>
          <div>
            <p className={styles.snapshotTitle}>Adtua</p>
            <p className={styles.snapshotSub}>Two-sided ad marketplace</p>
          </div>
          <span className={styles.statusChip}>In development</span>
        </div>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="adtua-dialog-title"
        onClick={(e) => {
          // Backdrop click: the dialog element itself is the click target
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className={styles.dialogMedia}>
          <button
            type="button"
            className={styles.dialogClose}
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.dialogBody}>
          <div>
            <div className={styles.dialogChips}>
              <span className={styles.statusChip}>2026</span>
              <span className={styles.statusChip}>In development</span>
            </div>
            <h2 id="adtua-dialog-title" className={styles.dialogTitle}>Adtua</h2>
            <p className={styles.dialogSub}>Two-sided ad marketplace at Heartland Community Network</p>
            <p className={styles.dialogCopy}>
              I&apos;m the sole product designer on Adtua, a marketplace where advertisers buy airtime
              from broadcasters. I&apos;m designing the whole platform from business, API and pricing
              requirements: the information architecture, the workflows for each role and the design
              system underneath them.
            </p>
            <p className={styles.dialogCopy}>
              While mapping the pricing requirements I saw room for new ways to make money, so I&apos;m
              also designing premium upsells and the pricing screens that help both sides understand
              what they&apos;re paying for.
            </p>
          </div>

          <dl className={styles.facts}>
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </dialog>
    </>
  );
}
