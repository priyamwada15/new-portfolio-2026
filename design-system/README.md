# Design System

Single source of truth for visual tokens, typography, and layout constants in this portfolio.

## Structure

```
design-system/
├── tokens/           # CSS custom properties (imported by app/globals.css)
│   ├── primitives.css   # Raw color values — never use directly in components
│   ├── semantic.css     # Semantic roles (--ds-text-ink, --ds-surface-page, --ds-case-study-accent, …)
│   ├── compat.css       # Legacy alias (--color-page-bg)
│   ├── motion.css       # Easing (--ds-ease-out-strong)
│   └── shadcn.css       # shadcn/ui oklch tokens (separate from portfolio semantics)
├── theme.css         # Tailwind v4 @theme inline → utilities (text-ink, bg-surface-media, …)
├── typography.ts     # Tailwind class compositions (caseStudyTitle, caseStudySectionTagCaps, …)
├── surfaces.ts       # CSS var references for inline styles
├── brands.ts         # Per-client brand colors (logos and product UI only; see "Case study accent")
├── fonts.ts          # Font role inline styles
├── home.ts           # Homepage widget constants
├── layout.ts         # Page surfaces, case study shell, route helpers, video sources
├── breakpoints.ts    # Breakpoints as numbers for JS (mirrors theme.css)
└── index.ts          # Barrel export — import from `@/design-system`
```

## Usage

### In components (Tailwind)

```tsx
import { caseStudyHeading, caseStudyText, mediaPanel } from "@/design-system";

<h2 className={caseStudyHeading}>Section title</h2>
<p className={caseStudyText}>Body copy</p>
<div className={mediaPanel}>…</div>
```

Prefer semantic utilities: `text-ink`, `text-primary`, `text-secondary`, `bg-surface-media`, `border-border`.

### Font roles

| Utility / token | Role | Actual font |
|---|---|---|
| `font-body` / `font-label` | UI body + section labels | Figtree (`--font-hind`) |
| `font-mono` | Code, terminal, cursors | DM Mono |

**Do not** use `font-mono` for section labels — use `font-label`.

### Inline styles

```tsx
import { surfaces, fontStyle } from "@/design-system";

<div style={{ backgroundColor: surfaces.caseStudy }} />
<p style={fontStyle.figtree}>…</p>
```

### Adding tokens

1. Add the primitive to `tokens/primitives.css`
2. Add a semantic alias in `tokens/semantic.css` if it has a role
3. Expose as a Tailwind utility in `theme.css` if used in class names
4. Add TS helpers in `typography.ts` / `surfaces.ts` / `brands.ts` only when needed in JavaScript

Remove a token when nothing uses it any more. Before you do, search for it as a whole name **and** as a name built at runtime (e.g. `ResearchAreas.tsx` reads `var(--ds-research-${category})`).

## Case study pages

### Type scale (`typography.ts`)

| Style | Use |
|---|---|
| `caseStudyTitle` | Page title (32px medium) |
| `caseStudyHeading` | Section heading (24px semibold) |
| `caseStudySubheading` | Heading inside a section (18px medium) |
| `caseStudySectionTagCaps` | Section, release and testimonial tags: the eyebrow in caps, lightly tracked (e.g. "PROBLEM SPACE"). The meta row labels use the same caps and tracking |
| `caseStudyVisualTitle` | Title on a visual asset (carousel slides, "Early direction / What shipped"): 14px Medium in primary. Visual assets stay neutral, with no rose and no brand colour, so they don't compete with the page accent |
| `caseStudyEyebrow` | Small accent labels that aren't section tags (stat labels, names) |
| `caseStudyText` | Body copy, including the line under a stat |
| `caseStudyRowTitle` | Title above a text + media row |
| `caseStudyStatNumber` | Big impact number (32px semibold, ink) |

Stats are open (no card border or fill): a number in `caseStudyStatNumber` above a line of `caseStudyText`, the same on every case study. `CardRow variant="stat"` follows this.

### Case study accent

Every case study uses one accent, the site's rose: `--ds-case-study-accent` (and `--ds-case-study-accent-light` for tints). Pass them to `CaseStudyLayout` as `accentDark` / `accentLight`; they drive section tags, numbered markers and highlights through `--accent-dark`. Brand colors (`brands.ts`) stay in logos and inside the product demos, not in the page chrome.

### Demo cards

- **Demo card**: the homepage case study cards and each case study's hero visual (`CaseStudyDemoCard`, passed as `CaseStudyLayout`'s `heroVisual`) are the same plain card: a `--ds-surface-demo-card` fill with a `--ds-border-card` stroke, with the study's live coded demo at its designed size.
- **Coded demos** (`app/home-v2/*Embed`) scope their product's own colors to the embed (e.g. `--ra-*`, `--dm-*`). Those are the products' colors, not portfolio tokens.

## Tooltips and footer

- **Tooltips** are rose with light text everywhere: `--ds-tooltip-bg` / `--ds-tooltip-fg` (`app/components/animate-ui/tooltip.tsx`, `CopyEmailIcon`).
- **Site footer** (`app/components/site-footer/SiteFooter.tsx`): the olive panel the page lifts away to reveal, on the homepage, case studies and playground. `--ds-footer-bg` (olive), `--ds-footer-ink` (deep olive type) and `--ds-footer-grain` (the speckle). Sticker positions are in px of the Figma frame (1440×650, or 375×620 on phones) and scale with the screen.

## Responsive breakpoints

Breakpoints live in `breakpoints.ts` and are mirrored as real Tailwind variants in `theme.css`:

| Variant | Min-width |
|---|---|
| `tablet:` / `max-tablet:` | 744px |
| `desktop:` / `max-desktop:` | 1024px |

Use `tablet:` / `desktop:` (and their `max-` inverses) in className strings — not ad-hoc `min-[...]:` arbitrary values. "Mobile" means `max-tablet:` (below 744px).

### Page margins

Content columns follow a 3-tier margin ladder rather than a fixed percentage width: **24px** below `tablet`, **48px** from `tablet` to `desktop`, **120px** from `desktop` up (capped at a max content width beyond which margin keeps growing). This is `RESPONSIVE_CONTENT_WIDTH_CLASS` in `layout.ts` — use it (or compose from it, as `CASE_STUDY_COLUMN_CLASS` does) for any full-page content column instead of a one-off `w-[N%]`.

### Font sizes

Large/prominent text (headlines, card titles, breadcrumbs) steps down at `max-tablet:` — e.g. `text-[32px] max-tablet:text-[24px]` (see `caseStudyHeadline` in `typography.ts`). Small meta/label text (tags, captions) generally doesn't need a mobile-specific size.

## Migration

`app/lib/caseStudy.ts` re-exports from `@/design-system` for backward compatibility. New code should import from `@/design-system` directly.

Hard-coded hex values in page-specific CSS (hero chips, cursors) remain in `app/globals.css` until migrated incrementally.
