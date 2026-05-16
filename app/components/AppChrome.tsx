"use client";

import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bareAsciiGame =
    pathname === "/ascii-game" || pathname.startsWith("/ascii-game/");
  const bareSunlight =
    pathname === "/sunlight" || pathname.startsWith("/sunlight/");

  if (bareAsciiGame || bareSunlight) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  return (
    <>
      <Nav />
      <main className="flex-1 pt-[96px]">{children}</main>
      <Footer />
    </>
  );
}
