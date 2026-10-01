"use client";

import { useRef } from "react";
import Image from "next/image";
import styles from "./home.module.css";

const TAGS = ["0→1", "B2B SaaS", "Current work"] as const;

/** Matches the longest close animation in home.module.css (backdropOut). */
const CLOSE_MS = 280;

const FACTS = [
  { label: "Role", value: "Product Designer" },
  { label: "Users", value: "Advertisers and broadcasters" },
  { label: "Scope", value: "Dashboards, landing page and design system" },
] as const;

function Tags() {
  return (
    <div className={styles.tags}>
      {TAGS.map((tag) => (
        <span key={tag} className={styles.tag}>{tag}</span>
      ))}
    </div>
  );
}

/** Small "Currently" snapshot card for Adtua; opens a detail dialog. */
export function AdtuaSnapshot() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();

  // Play the fade/blur-out before actually closing the dialog
  const close = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open || dialog.dataset.closing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }
    dialog.dataset.closing = "true";
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      delete dialog.dataset.closing;
      dialog.close();
    };
    dialog.addEventListener("animationend", finish, { once: true });
    // Fallback in case animations are paused (e.g. a background tab)
    window.setTimeout(finish, CLOSE_MS + 60);
  };

  return (
    <>
      <button
        type="button"
        className={styles.snapshot}
        onClick={open}
        aria-haspopup="dialog"
        aria-label="Open Adtua project snapshot"
      >
        <div className={styles.snapshotHeader}>
          <p className={styles.snapshotTitle}>Adtua</p>
          <Tags />
        </div>
        <div className={styles.snapshotMedia}>
          <Image
            src="/Adtua snippet card image.png"
            alt="Adtua screen setup form with pricing and availability fields"
            fill
            sizes="320px"
            loading="eager"
            className={styles.coverImage}
          />
        </div>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="adtua-dialog-title"
        onCancel={(e) => {
          // Escape key: animate out instead of closing instantly
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          // Backdrop click: the dialog element itself is the click target
          if (e.target === e.currentTarget) close();
        }}
      >
        <AdtuaDetail onClose={close} />
      </dialog>
    </>
  );
}

/** Detail content shown in the Adtua snapshot dialog. */
export function AdtuaDetail({ onClose }: { onClose?: () => void }) {
  return (
    <>
      <div className={styles.dialogMedia}>
        <Image
          src="/Adtua detail screen image.png"
          alt="Adtua screen pricing form next to a Downtown Kiosk listing with earnings and booking requests"
          fill
          sizes="(max-width: 912px) 100vw, 880px"
          // Load up front so the banner is ready when the dialog opens
          loading="eager"
          className={styles.coverImage}
        />
        {onClose && (
          <button type="button" className={styles.dialogClose} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.dialogBody}>
        <div className={styles.dialogMain}>
          <div className={styles.dialogHeader}>
            <h2 id="adtua-dialog-title" className={styles.dialogTitle}>Adtua</h2>
            <p className={styles.dialogSub}>Two-sided ad marketplace at Heartland Community Network</p>
          </div>
          <div className={styles.dialogText}>
            <p className={styles.dialogCopy}>
              I&apos;m the sole product designer on Adtua, a two-sided marketplace where advertisers book
              screen space from broadcasters. I&apos;m designing the platform end to end, including dedicated
              dashboards for advertisers, broadcasters and accounts that do both, along with booking,
              payments and pricing.
            </p>
            <p className={styles.dialogCopy}>
              Alongside the core product, I&apos;m designing upgrade moments that help both sides see the
              value of premium plans, and building the design system the engineering team works from.
            </p>
          </div>
        </div>

        <div className={styles.dialogAside}>
          <Tags />
          <dl className={styles.facts}>
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
