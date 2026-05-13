import type { Metadata } from "next";
import {
  Figtree,
  Inter,
  Ovo,
  IBM_Plex_Sans_Devanagari,
} from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "./components/Nav";
import SiteFooter from "./components/SiteFooter";
import SmoothScroll from "./components/SmoothScroll";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";
import { Analytics } from "@vercel/analytics/next";

const figtree = Figtree({
  variable: "--font-hind",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ovo = Ovo({
  variable: "--font-ovo",
  subsets: ["latin"],
  weight: "400",
});

const ibmPlexDevanagari = IBM_Plex_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "Priyamwada Pandey | Product Designer",
  description:
    "Product Designer focused on AI-native interfaces. I work where the design needs me, on paper or in an IDE.",
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
      className={`${figtree.variable} ${ovo.variable} ${inter.variable} ${ibmPlexDevanagari.variable}`}
    >
      <head>
        <Script id="microsoft-clarity" strategy="beforeInteractive">
          {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "vamitov1fh");`}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col bg-[#ECEAE6] text-[#333333] overflow-x-hidden">
        <SmoothScroll />
        <ScrollToTopOnRouteChange />
        <Nav />
        <main className="flex-1 pt-[84px]">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
