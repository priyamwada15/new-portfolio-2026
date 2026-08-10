import type { Metadata } from "next";
import AsciiGamePageClient from "./AsciiGamePageClient";

export const metadata: Metadata = {
  title: "ASCII Game | Priyamwada Pandey",
  description:
    "Scroll-linked ASCII lane game with arrow keys, ramping speed and no intro dialog.",
};

export default function AsciiGamePage() {
  return <AsciiGamePageClient />;
}
