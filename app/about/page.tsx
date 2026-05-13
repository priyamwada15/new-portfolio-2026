import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About | Priyamwada Pandey",
  description: "About Priyamwada Pandey, product designer.",
};

const ABOUT_COPY =
  "Talking about my work comes easy, trying to fit everything I am into a single page is harder. While I work on this page, here is a small snippet of my world and what I'd yap about if I was working next to you. If you'd like to listen to me talk about tyre strategies, silly season theories and why the V8 engine sounds like opera to me, go ahead and send me a message!";

export default function AboutPage() {
  return <AboutPageClient aboutCopy={ABOUT_COPY} />;
}
