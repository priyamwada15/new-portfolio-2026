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
};

export default nextConfig;
