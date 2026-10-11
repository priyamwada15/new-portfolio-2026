import type { Metadata } from "next";

/**
 * Review-only copy of the portfolio for Dive Club. Each route under here
 * re-exports the public page, and internal links stay under /dive via
 * `app/lib/reviewPath.ts`. Kept out of the sitemap and public nav.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Inflight review widget, scoped to /dive. React hoists async scripts into <head>. */}
      <script src="https://inflight.co/widget.js" data-org="aius9qpt" data-path="/dive" async></script>
      {children}
    </>
  );
}
