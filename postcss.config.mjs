import path from "path";
import { fileURLToPath } from "url";

// Pin resolution to this repo. Otherwise Turbopack can use a parent folder as
// context (e.g. Desktop), walk up to a user-level package.json, and fail to
// resolve `@import "tailwindcss"` from this project's node_modules.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: projectRoot,
    },
  },
};

export default config;
