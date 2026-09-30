"use client";

import { useState } from "react";
import Image from "next/image";
import { CreativeLicenseLightbox } from "./CreativeLicenseLightbox";
import styles from "./PriyamwadaNameLink.module.css";

const nameLinkStyle = {
  color: "#858585",
  textDecoration: "underline",
  textDecorationStyle: "dotted" as const,
  textUnderlineOffset: "3px",
};

/**
 * "Priyamwada" in the hero intro — opens the creative license lightbox.
 * `hoverPreview` adds a small rotating license card above the name on hover.
 */
export function PriyamwadaNameLink({ hoverPreview = false }: { hoverPreview?: boolean }) {
  const [open, setOpen] = useState(false);

  const name = (
    <span
      className="cursor-hover-pointer"
      style={nameLinkStyle}
      role="button"
      tabIndex={0}
      aria-label="Open Priyamwada's creative license"
      onClick={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setOpen(true);
      }}
    >
      Priyamwada
    </span>
  );

  return (
    <>
      {hoverPreview ? (
        <span className={styles.wrap}>
          {name}
          <span className={styles.preview} aria-hidden="true">
            <span className={styles.rotator}>
              <Image
                src="/26june-homepage-assets/Creative License Front.png"
                alt=""
                width={104}
                height={66}
                className={styles.face}
              />
              <Image
                src="/26june-homepage-assets/Creative License Back.png"
                alt=""
                width={104}
                height={66}
                className={`${styles.face} ${styles.back}`}
              />
            </span>
          </span>
        </span>
      ) : (
        name
      )}
      {open && <CreativeLicenseLightbox onClose={() => setOpen(false)} />}
    </>
  );
}
