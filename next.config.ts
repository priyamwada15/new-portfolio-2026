import type { NextConfig } from "next";
import path from "path";
import { withMicrofrontends } from "@vercel/microfrontends/next/config";

/**
 * Pin Turbopack to this repo. If another `package-lock.json` exists higher on
 * the disk (e.g. under the user profile), Next can otherwise infer the wrong
 * root and dev compiles become very slow.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
  async redirects() {
    return [
      // the-intelligencer.vercel.app's root now falls through to this app
      // (unmatched paths on any project in the microfrontends group land
      // on the default app), so send it to the app's real home instead of
      // showing the portfolio.
      {
        source: "/",
        has: [{ type: "host", value: "the-intelligencer.vercel.app" }],
        destination: "https://www.priyamwada.me/the-intelligencer",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/resume.pdf",
        headers: [{ key: "Content-Disposition", value: "inline" }],
      },
    ];
  },
};

export default withMicrofrontends(nextConfig);
