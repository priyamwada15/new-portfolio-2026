import type { NextConfig } from "next";
import path from "path";

/**
 * Pin Turbopack to this repo. If another `package-lock.json` exists higher on
 * the disk (e.g. under the user profile), Next can otherwise infer the wrong
 * root and dev compiles become very slow.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    // Case study sheet transition (app/components/CaseStudyTransition.tsx).
    viewTransition: true,
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
      // The playground page was renamed to "fun".
      { source: "/playground", destination: "/fun", permanent: true },
      { source: "/dive/playground", destination: "/dive/fun", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // The Intelligencer is its own Vercel project, built with basePath
      // "/the-intelligencer", so the full path (assets included) is
      // forwarded unchanged.
      {
        source: "/the-intelligencer",
        destination: "https://the-intelligencer.vercel.app/the-intelligencer",
      },
      {
        source: "/the-intelligencer/:path*",
        destination: "https://the-intelligencer.vercel.app/the-intelligencer/:path*",
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

export default nextConfig;
