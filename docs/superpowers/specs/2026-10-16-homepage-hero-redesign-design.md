# Homepage hero redesign

Started 2026-10-16 after Geoff Keehan's (ex-VP Design, Meta) review on `/dive`: the portfolio reads as generic, the hero says little, the Adtua thumbnail isn't a hook, the Asimov and Rocket Mortgage card videos are hard to read, and the page has too many similar text and button styles.

## Locked hero headline (2026-10-23)

> **I design agentic and B2B products. Lately that’s meant AI assistants for mortgage clients, agent builders for enterprise teams and a multi-role ad marketplace.**

This is the only text in the hero, under the creative license card. Each sentence starts its own line on desktop, and the second wraps within a 1008px measure. On desktop the first line is 52px/40px medium in `--ds-text-primary`, the second is 20px/28px regular in `--ds-text-secondary`, with a 24px gap between them. Both step down to 24px/32px below the tablet breakpoint (744px). The license card sits 48px below the nav's reserved space and 56px above the headline. It fits itself to the screen height so the first case study peeks in, up to 560px wide. A dev-only DialKit panel (`home-v2/HeroDial`, hidden; render it in `app/page.tsx` to bring it back) tunes the card width and both gaps.

Why this line:
- The Oct 19 line said how she works but gave no context about what she designs. The first sentence names it, and the second backs it up with the actual projects, the way the reference portfolios (Tushar, Yutong) pair a role line with evidence.
- "Agentic" stands in for "AI", which reads as keyword-stuffy on its own.
- "Agentic and B2B" are two separate words so every project fits one of them: Rocket Assist is agentic but B2C, Adtua is B2B with no agents, and Asimov and Debug Mode are both.
- "Usually the only designer in the room" from her elevator pitch belongs on the About page.

## Previous headline (2026-10-19, replaced)

> I make complicated systems clear enough to act on.

Set as two lines at 56px/60px. Why it was chosen then:
- It covers all four projects: Rocket Assist's sourced cards, Asimov's setup, controls and answer verification, Debug Mode stopping on the broken node, and the Heartland ad marketplace. The earlier "answer"-based options left out Asimov's setup side and the marketplace.
- "AI" is left out on purpose, since it can read as gimmicky. The case study tags ("AI Assistant") carry it, and they're visible in the peek below the hero.
- "B2B" is left out because the first case study, Rocket Mortgage, is B2C.
- There's no proof line under it. That made the hero busy. The card gives her name and role, and the Rocket Mortgage card peeking in below gives the proof.

Type rules for the homepage: use only design-system colours (`--ds-text-primary`, `--ds-text-secondary`), and keep every font size, line height, padding and gap a multiple of 4 or 8.

## Earlier copy (2026-10-16, replaced)

> I use AI every day and I still want to know how it got to an answer.
>
> Product designer building AI and complex products that show their reasoning, so people can understand what's happening and decide what to do next.
>
> Previously at Rocket Mortgage and Tars. Currently designing a two-sided ad marketplace at Heartland Community Network.

The positioning behind it still holds. The headline above says the same thing without naming AI.

## Decisions

- The positioning thread is transparency in AI products: Debug Mode, Asimov knowledge sources and answer verification, Rocket Mortgage sourced cards and human handoff, plus proposing an AI interaction patterns focus area on the Salesforce project.
- Copy must read well to AI-first companies as well as fintech. Avoid wording like "when it might be wrong" or "decide whether to trust it".
- No "founding designer" claim anywhere in the hero. Use "product designer".
- Salesforce is left out of the hero (it was a sponsored project). The case study card still names it.
- Adtua is described, not named, in the hero. The large Adtua card at the top of the homepage goes away, since unfinished work shouldn't be judged first.
- Collaboration (sales demos at Tars, talking to everyone at Rocket) is supporting proof for case studies or the About page, not the headline.

## Homepage decisions (2026-10-16 to 10-17)

- Project order: Rocket Mortgage, Asimov, Debug Mode. Adtua moves to a smaller "what I'm working on now" block below them.
- No university projects on the homepage.
- Interactive over static. Per feedback from another designer, static images and video walkthroughs read as early 2025. Coded versions of the designs should be the visual assets for thumbnails and case studies.
- The hero and the thumbnails have to read as one site.

## Hero visual direction: parked (2026-10-17)

The user parked this so it doesn't stall the other updates. What we know so far:
- Two sides of her: product design is clean and Apple-like, and graphic design is maximalist, inspired by Indian graphic design (matchboxes, truck lettering, shop signs). Her own work joins the two, e.g. the ooni ऊ+ni wordmark.
- Rejected: static poster heroes (truck panel, matchbox label, shop sign). They were static, and they clashed with the clean cards below. The shop-sign one also copied her Adtua client branding.
- Rejected: a literal "trust and transparency" hero (she tried it before and it felt forced).
- Open: what the hero does interactively, and whether the Indian maximalism lives in the hero or somewhere else (type, behaviour, playground, About).

## Still to plan

- Project order and what replaces the Adtua card at the top
- Card thumbnails: one designed moment per project instead of raw screen recordings
- Reducing tag pills and button styles, and fewer micro-interactions
- Editing the playground down to the strongest experiments
- Exact hero typography
