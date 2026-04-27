"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/about") {
    return null;
  }

  return <Footer />;
}
