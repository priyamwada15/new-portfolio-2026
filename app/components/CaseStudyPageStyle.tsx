"use client";
import { useEffect } from "react";
import { CASE_STUDY_PAGE_BG } from "../lib/caseStudy";

export default function CaseStudyPageStyle() {
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = CASE_STUDY_PAGE_BG;
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);
  return null;
}
