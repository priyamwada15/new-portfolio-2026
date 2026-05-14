<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project-specific rules for coding agents

Read this before touching any file. Violating these rules has broken the dev server before.

## CSS / Tailwind

### Never use relative `../node_modules/...` paths in `app/globals.css`

`@tailwindcss/postcss` resolves CSS imports relative to the `base` option set in `postcss.config.mjs`, which is the **project root** (`New Portfolio/`). A relative path like `../node_modules/tailwindcss/index.css` from the project root goes one level too high — to the `Desktop/` directory — and breaks the build.

**Always use bare specifiers:**

```css
/* CORRECT */
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/dist/tailwind.css";

/* WRONG — do not write these */
@import "../node_modules/tailwindcss/index.css";
@import "../node_modules/tw-animate-css/dist/tw-animate.css";
@import "../node_modules/shadcn/dist/tailwind.css";
```

The side-effect of using the wrong paths is that Tailwind scans the parent `Desktop/` directory for class names, picking up garbage bytes from unrelated binary files and generating hundreds of invalid CSS rules — which also crashes the CSS parser.

### Never touch `postcss.config.mjs`

This file pins `@tailwindcss/postcss` to the project root as its `base`. Without it, Turbopack loses its resolution context and resolves packages from a parent directory. The comment in the file explains why. Do not remove or change the `base` option.

### This is Tailwind v4, not v3

- No `tailwind.config.js` — configuration lives in `app/globals.css` inside `@theme inline { ... }`.
- No `@tailwind base/components/utilities` directives — replaced by `@import "tailwindcss"`.
- Important modifier syntax changed: use `h-[60px!]` not `!h-[60px]` for arbitrary values.
- `@custom-variant` and `@source` are v4-only directives.

## Next.js

This project runs **Next.js 16 with Turbopack** (`next dev` uses Turbopack by default in this version). APIs, file conventions, and caching behaviour differ from Next.js 13/14/15. When in doubt, read `node_modules/next/dist/docs/` rather than relying on training data.

## Environment

The project lives inside OneDrive (`C:\Users\mukta\OneDrive\Desktop\New Portfolio`). Path resolution is case-sensitive in some contexts and the space in `New Portfolio` must be quoted in shell commands. Never hardcode absolute paths in source files.

## Deployment

Do **not** deploy to Vercel unless the user explicitly says "Let's deploy to Vercel now."
