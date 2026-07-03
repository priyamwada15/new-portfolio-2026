# Design System

Single source of truth for visual tokens, typography, and layout constants in this portfolio.

## Structure

```
design-system/
├── tokens/           # CSS custom properties (imported by app/globals.css)
│   ├── primitives.css   # Raw color values — never use directly in components
│   ├── semantic.css     # Semantic roles (--ds-text-ink, --ds-surface-page, …)
│   ├── compat.css       # Legacy aliases (--bg-light, --color-page-bg, …)
│   ├── motion.css       # Easings and durations
│   └── shadcn.css       # shadcn/ui oklch tokens (separate from portfolio semantics)
├── theme.css         # Tailwind v4 @theme inline → utilities (text-ink, bg-surface-media, …)
├── typography.ts     # Tailwind class compositions (caseStudyH2, salesforceBody, …)
├── surfaces.ts       # CSS var references for inline styles
├── brands.ts         # Per-client accent colors
├── fonts.ts          # Font role inline styles
├── layout.ts         # Page surfaces, case study shell, route helpers
└── index.ts          # Barrel export — import from `@/design-system`
```

## Usage

### In components (Tailwind)

```tsx
import { caseStudyH2, caseStudyBody, mediaPanel } from "@/design-system";

<h2 className={caseStudyH2}>Section title</h2>
<p className={caseStudyBody}>Body copy</p>
<div className={mediaPanel}>…</div>
```

Prefer semantic utilities: `text-ink`, `text-primary`, `text-secondary`, `bg-surface-media`, `border-border-media`.

### Font roles

| Utility / token | Role | Actual font |
|---|---|---|
| `font-body` / `font-label` | UI body + section labels | Figtree (`--font-hind`) |
| `font-mono` | Code, terminal, cursors | DM Mono |

**Do not** use `font-mono` for section labels — use `font-label`.

### Inline styles

```tsx
import { surfaces, brands, fontStyle } from "@/design-system";

<div style={{ backgroundColor: surfaces.caseStudy }} />
<CaseStudyLayout accentDark={brands.salesforce.accentDark} />
<p style={fontStyle.figtree}>…</p>
```

### Adding tokens

1. Add the primitive to `tokens/primitives.css`
2. Add a semantic alias in `tokens/semantic.css` if it has a role
3. Expose as a Tailwind utility in `theme.css` if used in class names
4. Add TS helpers in `typography.ts` / `surfaces.ts` / `brands.ts` only when needed in JavaScript

## Migration

`app/lib/caseStudy.ts` re-exports from `@/design-system` for backward compatibility. New code should import from `@/design-system` directly.

Hard-coded hex values in page-specific CSS (hero chips, cursors) remain in `app/globals.css` until migrated incrementally.
