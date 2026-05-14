"use client";

import { usePathname } from "next/navigation";
import {
  CASE_STUDY_PAGE_BG,
  isCaseStudyPath,
  caseStudyUsesSiteDefaultSurface,
} from "../lib/caseStudy";
import Footer from "./Footer";

export default function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/about") {
    return null;
  }

  const caseStudy = pathname ? isCaseStudyPath(pathname) : false;
  const defaultSurface = pathname ? caseStudyUsesSiteDefaultSurface(pathname) : false;
  const footerFill =
    caseStudy && !defaultSurface ? CASE_STUDY_PAGE_BG : undefined;

  return <Footer backgroundColor={footerFill} />;
}
