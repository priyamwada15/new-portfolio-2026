"use client";

import { usePathname } from "next/navigation";
import {
  CASE_STUDY_PAGE_BG,
  isCaseStudyPath,
  isRocketMortgagePath,
} from "../lib/caseStudy";
import Footer from "./Footer";

export default function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/about") {
    return null;
  }

  const caseStudy = pathname ? isCaseStudyPath(pathname) : false;
  const rocketMortgage = pathname ? isRocketMortgagePath(pathname) : false;
  const footerFill =
    caseStudy && !rocketMortgage ? CASE_STUDY_PAGE_BG : undefined;

  return <Footer backgroundColor={footerFill} />;
}
