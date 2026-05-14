"use client";
import { useEffect } from "react";
import { CASE_STUDY_PAGE_BG } from "../lib/caseStudy";

export default function CaseStudyPageStyle({
  backgroundColor,
}: {
  /** When omitted, uses the default case-study fill. */
  backgroundColor?: string;
}) {
  const bg = backgroundColor ?? CASE_STUDY_PAGE_BG;
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = bg;
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, [bg]);
  return null;
}
