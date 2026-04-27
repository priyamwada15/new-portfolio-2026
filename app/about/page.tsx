import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About | Priyamwada Pandey",
  description: "About Priyamwada Pandey, product designer.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
