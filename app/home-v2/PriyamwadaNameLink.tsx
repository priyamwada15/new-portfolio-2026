"use client";

import { useState } from "react";
import { CreativeLicenseLightbox } from "./CreativeLicenseLightbox";

const nameLinkStyle = {
  color: "#858585",
  textDecoration: "underline",
  textDecorationStyle: "dotted" as const,
  textUnderlineOffset: "3px",
};

/** "Priyamwada" in the hero intro — opens the creative license lightbox. */
export function PriyamwadaNameLink() {
  const [open, setOpen] = useState(false);

  return (
    <>
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
      {open && <CreativeLicenseLightbox onClose={() => setOpen(false)} />}
    </>
  );
}
