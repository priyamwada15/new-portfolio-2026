"use client";

import { usePathname } from "next/navigation";
import { CASE_STUDY_PAGE_BG, isCaseStudyPath } from "../lib/caseStudy";
import Footer from "./Footer";

export default function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/about") {
    return null;
  }

  const caseStudy = pathname ? isCaseStudyPath(pathname) : false;

  return (
    <Footer
      backgroundColor={caseStudy ? CASE_STUDY_PAGE_BG : undefined}
    />
  );
}
