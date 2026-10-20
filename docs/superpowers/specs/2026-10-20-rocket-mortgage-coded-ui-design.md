# Rocket Mortgage coded UI (homepage card)

Started 2026-10-20 on branch `case-study-coded-ui`. A live, coded version of the Rocket Assist chat sits in the calm centre of the Rocket Mortgage card's solarpunk street scene (`public/case-study-scenes/rocket-mortgage-scene.webp`), replacing the three phone videos.

Source: Figma frame **"13"** (`397:20401`), exported as node JSON with the user's Figma Tool (`Downloads/13-figma.json`). Layer dump made with `docs/superpowers/specs/figma-json-dump.mjs`.

## Agreed behaviour (2026-10-19 session)

- **Flow:** the client asks a question, Rocket Assist answers in a short bubble, the inspector card slides in, and a scripted tap flips it. Loops in about 8–10s.
- **Plays only while the card is on screen.**
- **Desktop:** visitors can flip the inspector card themselves. The moment they interact, autoplay stops; it restarts if they scroll away and come back.
- **Cursor:** over the scene around the phone, the license card's rose disc follows the pointer and reads "read"; a click there opens the case study. Over the phone, the normal cursor, and the inspector card gets a pointer.
- **Phones:** the UI is a non-interactive loop, and tapping anywhere on the card opens the case study. Applies to all three case studies.
- **Reduced motion:** the finished state, no loop.
- **Design:** identical to the internship design; only motion is new (message arrival, card entrance, flip).

## Frame "13": 393×852, white, 24px radius, clips content

Top to bottom (vertical stack, no gap):

### Status bar (system UI placeholder) — 393×64
Padding 16/32, space-between. Left: one #EAEAEA pill 56×16 r8. Right: #EAEAEA pills 24×16 r8, 20×20 r10, 28×16 r8, 5px apart. A wireframe stand-in, not real status icons.

### Header — 393×72
White, 1px bottom border #E9E9E9, padding 12/16, space-between, centred.
- **Left:** 48×48 circle, #000 at 4%, padding 4, holding the 32×32 Rocket Assist chat icon (#111111 bubble, #DE3341 spark). 12px gap, then **"Rocket Assist"** in WNTL Text 500, 18px / 23.4px, #111111.
- **Right:** two 40×40 round icon buttons, 8px apart, 24px icons in #111111 at 1.5px stroke. The first is at 0% opacity (invisible); the second is a minus (minimize).

### Chat area — 393×644, grows
White, padding 16, 16px gap between messages, **bottom-aligned** (newest at the bottom; older messages scroll off the top). Clips content.

Messages in order (the top ones are partly scrolled out of view in the frame):

1. *(above the fold)* Disclaimer, 12px / 15.6, centred, #111111: "This chat is AI-powered. Chats are recorded for quality using third party services. Learn more in our Privacy Policy." ("Privacy Policy" underlined.) Then "Chat started at 9:02 a.m." 12px 500 centred.
2. *(above the fold)* **Client:** "Schedule a home inspection"
3. *(partly visible)* **Assistant:** "I recommend booking by Wednesday, July 9th, that gives you time to review the report and negotiate any repairs."
4. **Client:** "How do I find a home inspector?"
5. **Assistant:** "I'd start off with a general home inspector to cover the overall condition of your home. Since you've got a pool, it’s smart to also bring in a specialist who knows their way around pool inspections too."
6. **Assistant:** "Here are a few inspectors your realtor recommended:"
7. **Inspector carousel** (below)

A hidden assistant bubble also exists: "Smart move, scheduling your inspection is important. It gives you a clear picture of the home and helps you decide if it's still the one." Hidden layers aren't built.

**Client bubble:** right-aligned, #111111, padding 8/12, radii 12/12/4/12 (tail bottom-right), text WNTL Text 400 16px / 20.8px #FFFFFF.
**Assistant bubble:** left-aligned, max width 272px, #F7F7F7, padding 8/12, radii 12/12/12/4 (tail bottom-left), text WNTL Text 400 16px / 20.8px #111111.
**Typing indicator** (hidden in the frame, but part of the component): 21×21, three dots (4px at 50%, 7px, 4px at 50%), #111111. Useful for the "Rocket Assist is answering" beat.

### Inspector carousel — 377×280
Horizontal row that bleeds off the right edge: the active card (310×280), then the next card scaled to 85% (264×238) at 50% opacity, 16px further right. The carousel footer (arrows + dots) is hidden.

**Card, front** — 310×280, white, 1px #F2F2F2 border, r16, padding 16, vertical, space-between:
- 64×64 round photo (Sarah), 1.37px white ring.
- 8px, then name **"Sarah Millerson"** Inter 500 16px / 20px #111111 centred; **"WIN Home Inspection"** Inter 400 10px / 12.1 #545454.
- 4px, then a row: "St Clair Shores, MI" · "•" · "ASCHI Certified", Inter 400 12px / 14.5 #545454 (the dot is Inter 500 14px).
- 16px, then three equal columns, 8px apart, each a 16px icon (#545454, 1.5 stroke) over 10px Inter text, 4px gap: **home** "General Inspector", **task** "40+ inspections", **grade** "4.5 (36 reviews)".
- Bottom: full-width **"Call now"** pill, #111111, 40px tall, r100, Inter 500 14px #FFFFFF.

**Card, back** (Sarah) — same shell, rotated 180° in Figma (it's the flip side):
- Review summary, Inter 400 12px / 14.5 #111111: "Clients consistently praise Sarah for her thoroughness, professionalism, and excellent communication throughout the inspection process. She explains the findings clearly and offer helpful suggestions without being pushy, ensuring clients feel comfortable and well-informed. / Her service includes same-day reports and a wide array of inspection options. Clients recommend Sarah for providing prompt, and approachable service."
- 8px, then a row: 16px Rocket Assist icon, 4px, "AI-generated summary from client reviews." Inter 400 10px #545454.
- Bottom: the same "Call now" pill.

**Second card** (peeking, 85% scale, 50% opacity): **"John Cusack"**, "Trademark Inspection Services", "Livonia, MI" · "ASCHI Certified", columns **pool** "Pool Inspector", **task** "20+ inspections", **grade** "4.3 (11 reviews)". Its avatar is the "RA" image, not a photo. Back: the same summary text with John and his/he.

### Composer — 393×72
White, 1px top border #E9E9E9, padding 12/24, 8px gap. "Write a message" WNTL Text 400 16px #7B7B7B, then a 48×48 send button (#000 at 4%, 24px send icon in #949494).

## Tokens in the frame
- Text: #111111 primary, #545454 secondary, #7B7B7B placeholder, #FFFFFF on dark
- Surfaces: #FFFFFF, #F7F7F7 assistant bubble, #F2F2F2 card border, #E9E9E9 dividers, #EAEAEA status-bar placeholders, #000 at 4% icon wells
- Rocket red #DE3341 (already `--ds-color-brand-rocket`)
- Fonts: **WNTL Text** (Rocket's brand typeface) for chat UI, **Inter** for the inspector cards

These are Rocket's product colours, not the portfolio's, so they'd live as a scoped set (for example `--ra-*` on the embed) rather than in the site's semantic tokens.

## Assets (in `public/rocket-assist/`, 2026-10-20)
- `rocket-assist-avatar.svg` — the 48px Rocket Assist icon in its 4% black well (from the user's "RA Avatar.svg"). Used in the floating header pill; its inner mark is reused at 16px next to "AI-generated summary from client reviews".
- `sarah.avif`, `john.avif` — inspector photos, converted from the user's PNGs. **John's card uses his photo** instead of the "RA" avatar in the frame. Both sources are 1× (67px and 64px) for a 64px slot, so they'll look soft on retina screens; 2× exports (128px+) would fix that.
- `icon-home.svg`, `icon-pool.svg`, `icon-task.svg`, `icon-grade.svg` — Google Material Symbols **Rounded, unfilled, weight 500, 24px**, from google/material-design-icons. Weight 500 has a 91/960 stroke, which is 1.52px at the cards' 16px icon size, matching the frame's 1.5px strokes.
- Not needed now that the chat floats: send, minus, status-bar placeholders, the typing-animation image (the dots are built in CSS).

## Decisions (2026-10-20)

1. **No device frame.** The chat floats on the scene instead of sitting inside a phone. No status bar. Layout details still open (see below).
2. **The loop starts at "How do I find a home inspector?"** Earlier messages and the disclaimer aren't shown.
3. **Font:** WNTL Text is replaced with Inter or Instrument Sans, whichever is closer. Inter is the working pick, since the cards already use it.
4. **Assets:** the user is exporting Sarah's photo, the "RA" avatar and the icons from Figma.
5. **Both inspector cards show,** and visitors can swipe between them.
6. **Copy fixes on the card backs, approved:** "offer helpful suggestions" → "offers helpful suggestions" (Sarah and John), and "prompt, and approachable" → "prompt and approachable".
7. **No status bar.**

8. **Swiping is desktop only:** drag or trackpad swipe between the two cards, plus arrow buttons (chevrons from Material Symbols, same style). Clicking a card flips it. **On phones** nothing inside the UI is interactive; the loop itself shows both cards.
9. **Loop (desktop autoplay and phones):** the question arrives → typing dots → the answer → "Here are a few inspectors your realtor recommended:" → the cards slide in → a scripted tap flips Sarah's card → it flips back → the carousel slides to John's card → restart.

**Feedback round 1 (2026-10-20, after the first build):**
- **Slower pace:** the loop is about 23s, with longer transitions (messages 0.9s, carousel slide 1.1s, flip 1s).
- **Intro:** the Rocket Assist pill fades in at the centre of the card, then glides up before the first message.
- **"Call now" is 40px tall** again (the card front had overflowed and squeezed it). The front now follows the frame's spacing: profile, then 16px, then the stats, then the button.
- **Shorter AI summaries**, replacing the two-paragraph text (and the earlier copy fixes):
  - Sarah: "Clients praise Sarah for thorough inspections and findings she explains clearly. Reports arrive the same day, and her suggestions are helpful without being pushy."
  - John: "Clients praise John for thorough pool inspections and findings he explains clearly. Reports arrive the same day, and his suggestions are helpful without being pushy."
- **Stat icons are 20px at weight 300** (1.25px stroke; the closest Material Symbols weight to the requested 1.2px). Chevrons stay at weight 500.

**Floating layout (built as proposed):**
- A small floating "Rocket Assist" header pill (avatar + name) above the conversation, so it's clear whose product this is.
- Bubbles and cards get a soft shadow so the #F7F7F7 assistant bubbles hold up on the textured scene.
- At full size the conversation is about 590px, taller than the card's 575px media area, so it behaves like a real chat: as new content arrives, earlier bubbles move up and fade out under a soft mask at the top edge.
