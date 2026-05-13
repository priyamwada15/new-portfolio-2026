"use client";
import { useEffect } from "react";

export default function CaseStudyPageStyle() {
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#FDFDFD";
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);
  return null;
}
