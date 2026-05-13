"use client";

import { usePathname } from "next/navigation";
import Nav from "./Nav";
import SiteFooter from "./SiteFooter";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bareAbout = pathname === "/about" || pathname.startsWith("/about/");

  if (bareAbout) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  return (
    <>
      <Nav />
      <main className="flex-1 pt-[84px]">{children}</main>
      <SiteFooter />
    </>
  );
}
