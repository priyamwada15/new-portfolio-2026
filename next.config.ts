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
};

export default withMicrofrontends(nextConfig);
