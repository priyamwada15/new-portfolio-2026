import type { Metadata } from "next";
import {
  DM_Mono,
  Festive,
  Figtree,
  Inter,
  Kalam,
  IBM_Plex_Sans_Devanagari,
  Geist,
  Ovo,
  Young_Serif,
  Frank_Ruhl_Libre,
  Forum,
  Sree_Krushnadevaraya,
} from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AppChrome from "./components/AppChrome";
import SmoothScroll from "./components/SmoothScroll";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";
import { SITE_DEFAULT_PAGE_BG } from "@/design-system";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const figtree = Figtree({
  variable: "--font-hind",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmPlexDevanagari = IBM_Plex_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["500"],
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin", "devanagari"],
  weight: ["400", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const festive = Festive({
  variable: "--font-festive",
  subsets: ["latin"],
  weight: "400",
});

// Temporary: only used by the Asimov page's dialkit font tester.
const ovo = Ovo({
  variable: "--font-ovo",
  subsets: ["latin"],
  weight: "400",
});

const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  subsets: ["latin"],
  weight: "400",
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl-libre",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const forum = Forum({
  variable: "--font-forum",
  subsets: ["latin"],
  weight: "400",
});

const sreeKrushnadevaraya = Sree_Krushnadevaraya({
  variable: "--font-sree-krushnadevaraya",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.priyamwada.me"),
  title: "Priyamwada Pandey | Product Designer",
  description:
    "Hi, I'm Priyamwada. I design interfaces that work with and for AI. I work where the design needs me, on a canvas or in a terminal.",
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
      suppressHydrationWarning
      className={cn(
        figtree.variable,
        inter.variable,
        ibmPlexDevanagari.variable,
        kalam.variable,
        dmMono.variable,
        festive.variable,
        ovo.variable,
        youngSerif.variable,
        frankRuhlLibre.variable,
        forum.variable,
        sreeKrushnadevaraya.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <head>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "vamitov1fh");`}
        </Script>
      </head>
      <body
        className="min-h-screen flex flex-col text-primary"
        style={{ backgroundColor: SITE_DEFAULT_PAGE_BG }}
      >
        <SmoothScroll />
        <ScrollToTopOnRouteChange />
        <AppChrome>{children}</AppChrome>
        <Analytics />
      </body>
    </html>
  );
}
