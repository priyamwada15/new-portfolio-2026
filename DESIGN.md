---
name: Priyamwada Pandey Portfolio
description: A quiet grayscale workbench that borrows one committed color per project, never its own.
colors:
  ink: "#111111"
  text-primary: "#333333"
  text-secondary: "#555555"
  text-muted: "#888888"
  text-faint: "#989898"
  surface-page: "#fafafa"
  surface-base: "#fdfdfd"
  surface-card: "#fbfbfb"
  surface-media: "#f5f5f5"
  surface-chip: "#f3f5f6"
  border-default: "#e8e8e8"
  border-media: "#e6e6e6"
  rocket-red: "#de3341"
  rocket-red-dark: "#851f27"
  tars-purple: "#6d33aa"
  salesforce-navy: "#032c5f"
  terminal-pink: "#d6336c"
typography:
  h1:
    fontFamily: "Figtree, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 400
    lineHeight: "1.2"
    letterSpacing: "normal"
  headline:
    fontFamily: "Figtree, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: "1.3"
    letterSpacing: "normal"
  body:
    fontFamily: "Figtree, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.625"
    letterSpacing: "normal"
  label:
    fontFamily: "Figtree, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: "1.4"
    letterSpacing: "normal"
  mono:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  3xl: "22px"
  4xl: "26px"
  media: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "64px"
  xl: "80px"
components:
  button-primary:
    backgroundColor: "rgba(253, 253, 253, 0.35)"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface-base}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
    typography: "{typography.label}"
  chip-default:
    backgroundColor: "{colors.surface-chip}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.xl}"
    padding: "6px 14px"
    typography: "{typography.label}"
  card-media:
    backgroundColor: "{colors.surface-media}"
    rounded: "{rounded.media}"
    padding: "24px"
  nav-shell:
    backgroundColor: "rgba(255, 255, 255, 0.15)"
    rounded: "{rounded.full}"
    height: "60px"
---

# Design System: Priyamwada Pandey Portfolio

## 1. Overview

**Creative North Star: "The Workbench"**

The base surface is a workbench, not a showroom: quiet grayscale ink (#111111) on off-white (#fafafa), with no color of its own. Color shows up only when a specific piece of work is on the table — Rocket Mortgage's red, TARS's purple, Salesforce's navy — and when it shows up, it commits to that one context fully rather than bleeding into the chrome around it. This mirrors the portfolio's own thesis: the site is a work sample, not a brand exercise, so the visual system stays out of the way until a specific project earns its color.

The system explicitly rejects the generic template look (interchangeable SaaS-landing gradients and stock card grids), the slow, effects-heavy feel of the site's previous Framer build, and any visual cue that reads as filler rather than considered craft. Motion and color are earned, not decorative.

**Key Characteristics:**
- Grayscale-first: text and chrome live entirely in ink/charcoal/off-white; color is contextual, not ambient.
- One committed accent per surface: each case study or interactive moment picks a single color and uses it with intent, never several accents competing on one screen.
- Paper-thin depth: shadows are felt, not seen.
- One type voice: Figtree carries headlines, body, and labels; DM Mono steps in only for code and terminal contexts.
- Motion favors physical fill and spring response over fades and gradients.

## 2. Colors

The palette is grayscale-first with contextual accents borrowed per project; no color is "the" brand color.

### Primary
- **Ink** (#111111): the only near-black in the system. Body text, primary button fill, selection background, tooltip background. Functions as the site's one universal action color.

### Secondary
- **Charcoal Text** (#333333): primary reading color for body and headline copy where full ink would be too heavy.
- **Slate Text** (#555555): secondary/supporting copy — captions, metadata, icon default color.

### Tertiary — Borrowed Project Colors (used one at a time, never combined)
- **Rocket Red** (#de3341, deep #851f27): Rocket Mortgage case study only.
- **TARS Purple** (#6d33aa): TARS Debug Mode and Asimov essay only.
- **Salesforce Navy** (#032c5f): Salesforce/Galileo case study only.

### Interaction Accent
- **Terminal Pink** (#d6336c): the hover ring on the homepage's "currently playing" Spotify widget. The system's only micro-interaction accent outside a case study context — used nowhere else.

### Neutral
- **Surface Base** (#fdfdfd): default page background, tooltip/selection foreground.
- **Surface Page** (#fafafa): case study background.
- **Surface Card** (#fbfbfb): card fills.
- **Surface Media** (#f5f5f5): media/image panel fills.
- **Surface Chip** (#f3f5f6): tag/chip backgrounds.
- **Border Default** (#e8e8e8) / **Border Media** (#e6e6e6): hairline dividers and media frame edges.
- **Text Muted** (#888888) / **Text Faint** (#989898): tertiary copy, disabled or de-emphasized states.

### Named Rules
**The Borrowed Color Rule.** The base UI (nav, footer, global chrome) never carries a project's brand color. A color only appears inside the boundary of the case study, section, or component it belongs to, and it commits there rather than being used sparingly — one accent per context, not several diluted ones.

**The One Ink Rule.** There is exactly one near-black across the whole system (#111111). Don't introduce a second "almost black" for a new component; reuse ink.

## 3. Typography

**Body Font:** Figtree (referenced internally as `--font-hind`), also carries the case study headline
**Label/Mono Font:** DM Mono (code, terminal, cursor contexts only)

**Character:** One sans-serif voice carries the whole system, plainly. There is no separate display face — the case study headline is Figtree at scale, not a different typeface.

### Hierarchy
- **H1** (400, 2.5rem / 40px desktop, 1.5rem / 24px mobile, line-height tight): case study headline only. Same typeface as everything else, distinguished by scale alone.
- **Headline** (700, 2rem / 32px, line-height 1.3): section headers within a case study (e.g. "Problem space").
- **Title** (600, 0.875rem / 14px, uppercase-optional): section tags and meta-grid labels above a headline.
- **Body** (400, 1rem / 16px, line-height 1.625, in `text-secondary`): case study prose and context copy. Cap at 65–75ch per line.
- **Label** (600, 0.875rem / 14px): buttons, chips, nav labels, form labels.
- **Mono** (400, 0.875rem / 14px, DM Mono): code snippets, terminal UI, custom cursor labels only — never for section labels or body copy.

### Named Rules
**The One Voice Rule.** Figtree is the only load-bearing typeface across the system — the case study H1 is Figtree at scale, not a different face. DM Mono is a second voice reserved strictly for literal code/terminal/cursor contexts — never decorative.

## 4. Elevation

Paper-thin layering. Nothing sits flat-flat, but nothing casts an obvious shadow either — surfaces feel like thin sheets of paper barely lifted off the one beneath, not objects floating with drama. Shadows exist only as ambient hover/interaction feedback, never as a permanent structural cue for hierarchy.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0px 4px 12px 0px rgba(0,0,0,0.05)`): default lift under a homepage card or media panel.
- **Card hover** (`box-shadow: 0px 15px 30px -22px rgba(0,0,0,0.05)`): slightly deeper lift on hover, still under 5% opacity.
- **Chip ambient** (`box-shadow: 0 2px 2px rgba(0,0,0,0.015), -1px -2px 6px rgba(0,0,0,0.012)`): near-invisible depth under pill-shaped interactive chips, used only when the chip itself needs to feel touchable.
- **Focus ring** (`box-shadow: 0 0 0 2px rgba(116,69,119,0.35)`): the one shadow allowed to be visible — accessibility focus states override the paper-thin rule intentionally.

### Named Rules
**The Paper-Thin Rule.** If a shadow reads as "a shadow" rather than "a piece of paper barely lifted," it's too strong. Opacity stays at or below 5% except for focus rings, which exist to be seen.

## 5. Components

Components read as playful precision: exact, restrained shapes that reveal personality only through motion, never through decoration sitting still.

### Buttons
- **Shape:** fully rounded pill (`border-radius: 9999px`), 1px ink border, no drop shadow at rest.
- **Primary (rest):** transparent-glass fill (`rgba(253,253,253,0.35)`), ink text, 14px semibold label type, `10px 20px` padding.
- **Hover:** an ink fill rises from the bottom of the pill (`scaleY` from 0 to 1, spring physics, ~420ms) and the label flips to off-white — a liquid-fill reveal, not a color crossfade.
- **Focus:** 2px ink focus ring with 2px offset on the page background.

### Chips (hero interactive pills, hashtags, tags)
- **Style:** soft-tinted background (`surface-chip` #f3f5f6, or a project's own borrowed color at low opacity), fully rounded or 80px+ radius, near-invisible ambient shadow.
- **State:** pills can grow in width on hover/interaction (e.g. the AI chip expands from 80px to 151.5px) rather than changing color — motion carries the affordance.

### Cards / Media Panels
- **Corner Style:** 24px radius for media/image panels (`{rounded.media}`); the standard `{rounded}` scale (6–26px) for smaller UI surfaces.
- **Background:** `surface-media` (#f5f5f5) for image/video containers, `surface-card` (#fbfbfb) for content cards.
- **Shadow Strategy:** card-rest at rest, card-hover on hover (see Elevation). No border.
- **Border:** none by default; a hairline `border-default` (#e8e8e8) only where two flat surfaces meet without a shadow to separate them.

### Navigation
- **Style:** full-width pill (`border-radius: 9999px`, 60px height) floating over the page, background is transparent on most routes and a soft `rgba(255,255,255,0.15)` glass tint on the homepage.
- **Icons:** 24px Phosphor icons in `text-secondary` (#555555), with an 8° tilt-on-hover micro-interaction (spring easing) rather than a color change.
- **States:** active route link drops its hover-opacity treatment; every other link dims to 75% opacity on hover.

### Liquid Button (signature component)
The pill-fill button described above is the system's signature interactive moment: physical, spring-driven, and legible from motion alone. Any new primary call-to-action should default to this pattern rather than inventing a flat color-swap button.

## 6. Do's and Don'ts

### Do:
- **Do** keep the base chrome (nav, footer, global page background) strictly grayscale — ink, charcoal, off-white only.
- **Do** let exactly one borrowed color own each case study or section, applied with commitment (backgrounds, accents, chip tints) rather than a single timid swatch.
- **Do** keep Figtree as the one load-bearing voice across headlines, body, and labels; reserve DM Mono strictly for code and terminal contexts.
- **Do** keep shadows at or below 5% opacity at rest; let motion (spring fills, tilts, width changes) carry interactivity instead of heavier shadows or color swaps.
- **Do** cap body copy at 65–75ch and get to the point fast — assume a reader with under two minutes per case study.
- **Do** show problem complexity (a framework visual, decision matrix, or system diagram) before showing UI screens in a case study.
- **Do** hold the creative-coding/side-quest components (ASCII game, shaders, flip-board) to the same craft bar as case study components — they are proof of range, not filler.

### Don't:
- **Don't** use `border-left`/`border-right` stripes greater than 1px as a colored accent on cards or callouts.
- **Don't** use gradient text (`background-clip: text` with a gradient) for emphasis — use ink weight or size instead.
- **Don't** default to glassmorphism; the one exception (the homepage nav's 15% white tint) is deliberate and singular, not a pattern to repeat elsewhere.
- **Don't** build a generic hero-metric block (big number, small label, gradient accent) — it reads as SaaS template, not portfolio craft.
- **Don't** repeat identical icon-plus-heading card grids; vary card treatment by what the content actually needs.
- **Don't** reach for a modal as the first solution — case studies and the site overall favor inline and progressive disclosure.
- **Don't** mix two borrowed project colors on the same screen (e.g. Rocket red and TARS purple never appear together).
- **Don't** let a case study run long and text-heavy — prior reviewer feedback flagged this exact failure mode.
- **Don't** visually frame AI/conversational work with cute chat-bubble or chatbot iconography — it undersells the underlying workflow complexity.
- **Don't** add a shadow, gradient, or decorative flourish to compensate for thin content — the paper-thin, grayscale-first system is meant to expose weak work, not hide it.
