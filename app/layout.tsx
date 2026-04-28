import type { Metadata } from "next";
import {
  Hind,
  Ovo,
} from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import SiteFooter from "./components/SiteFooter";
import SmoothScroll from "./components/SmoothScroll";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";
import { Analytics } from "@vercel/analytics/next";

const hind = Hind({
  variable: "--font-hind",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ovo = Ovo({
  variable: "--font-ovo",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Priyamwada Pandey | Product Designer",
  description:
    "Product Designer turning complex AI systems and enterprise tools into experiences people actually understand.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hind.variable} ${ovo.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#fafafa] text-[#333333] overflow-x-hidden">
        <SmoothScroll />
        <ScrollToTopOnRouteChange />
        <Nav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
