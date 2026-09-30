import type { Metadata } from "next";
import { AdtuaSnapshot } from "../home-v2/AdtuaSnapshot";

/** Private page for editing the homepage Adtua snapshot card in isolation. */
export const metadata: Metadata = {
  title: "Adtua card",
  robots: { index: false, follow: false },
};

export default function AdtuaCardPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      {/* Same width as the homepage hero column */}
      <div className="w-full max-w-[320px]">
        <AdtuaSnapshot />
      </div>
    </div>
  );
}
