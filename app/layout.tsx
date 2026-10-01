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
  Press_Start_2P,
  Sora,
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

// Temporary: only used by the Arcade EffWon game page's pixel-art HUD.
const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: "400",
});

// Temporary: only used by the homepage bento's Intelligencer card.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.priyamwada.me"),
  title: "Priyamwada Pandey | Product Designer",
  description:
    "Hi, I'm Priyamwada. I'm a 0→1 product designer for B2B SaaS, AI and marketplace products, currently designing Adtua, a two-sided ad marketplace.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Priyamwada Pandey",
  url: "https://www.priyamwada.me",
  jobTitle: "Product Designer",
  description:
    "0→1 Product Designer with 3+ years turning complex business and technical requirements into usable B2B SaaS, AI and marketplace products, often as an early or sole designer working with founders. Currently designing Adtua, a two-sided ad marketplace at Heartland Community Network. Previously founding designer on Asimov, Tars' AI agent for Slack, and Conversational AI Design Intern at Rocket Mortgage.",
  worksFor: { "@type": "Organization", name: "Heartland Community Network" },
  address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
  knowsAbout: [
    "AI Product Design",
    "Agentic Interfaces",
    "Agent Configuration Design",
    "Conversational UI Design",
    "Human-in-the-Loop",
    "AI Transparency",
    "Internal Tools Design",
    "Developer Tools UX",
    "Fintech Product Design",
    "Enterprise SaaS UX",
    "Marketplace Design",
    "Design Systems",
    "Information Architecture",
    "Data Visualization",
    "Permissions & Access Control",
    "Payment Flows",
    "Product Strategy",
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Indiana University Bloomington" },
    { "@type": "CollegeOrUniversity", name: "Amity University" },
  ],
  sameAs: [
    "https://www.linkedin.com/in/priyamwadapandey",
    "https://github.com/priyamwada15",
    "https://x.com/PriymwadaPandey",
  ],
} as const;

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
        pressStart2P.variable,
        sora.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
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
