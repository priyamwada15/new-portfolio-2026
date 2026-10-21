# Debug Mode coded UI (homepage card)

Started 2026-10-20 on branch `case-study-coded-ui`. A live slice of the Tars gambit canvas floats on the Debug Mode card's telephone-exchange scene (`public/case-study-scenes/debug-mode-scene.webp`). It follows the pattern of the Rocket and Asimov demos and uses the shared `useCardDemo` hook.

## Source

`app/components/DebugFlowPreview.tsx` (added in eb0e08d, now unused), ported in August 2026 from the user's "Debug Mode Test Run" Claude Design prototype. It has:
- **43 gambit nodes** from a credit-card assistant flow (e.g. 113 Greeting Node, 114 Preferences, 115 Credit Limit Increase, 117 Rewards Card, 118 Features, 119 Controls, 140 Fraud Check, 148 Live Agent), on a 2150×1120 canvas.
- **Node:** 132×92 white card, r8, 0.9px border; an ID chip (#F8F8F8, r4, Inter 500 10px #333333) over the label (Inter 400 12.5px #373E43); a notch on top and small tabs underneath where connectors leave.
- **States:** untested (#DADADA, borders #EFEFEF); active and passed (blue #65BAFF, the single signal); error (red #CB2A2F).
- **Connectors:** elbow paths from each tab, #DADADA; blue (#7CC4FF) along the path being run, with a dash-flow animation.
- **Camera:** overview, then focus on each node in turn at 2.7× zoom.
- Zoom controls bottom-left (+ / − / fit).

## Decisions (2026-10-20)

1. **The direction is "run, then break":** the canvas follows a test run node by node, and the run stops on a failing node.
2. **No status pills.** The "x/253 Nodes Tested" and "N Nodes with Error" pills aren't in the shipped Debug Mode.
3. **Add an error detail** (the prototype never said what broke). It's designed here, in the same visual language.
4. **Craft bar for all three demos:** nothing looks half-worked. Every visible control works and has hover, press and focus states, every surface holds up on the dark scenes, and nothing clips or ghosts.

## Branching flow with a following camera (revised 2026-10-21)

The one-node-at-a-time version had three problems the user called out: a blank moment between nodes (one faded out before the next faded in), a start-stop rhythm (each hop eased, moved, parked), and a straight vertical line that read as a list, not a flow. It now shows a **branching slice of a flow** (10 nodes) with a camera that follows the run:

- **Branches:** every node on the run has two outgoing connectors; the run takes one (lit blue), the other leads to a node it never visits (Language, Add-ons, Notifications, Options; Features and Controls under Rewards Card). The path zig-zags left and right.
- **Depth of field, not disappearing:** the node in focus is sharp; every other node stays visible, blurred (3px) and translucent (42%), and the flow fades out toward the card's edges. Focus moves with the camera, so one node softens as the next sharpens. Nothing vanishes.
- **Continuous motion:** when a node passes, a bright signal dot runs its lit connector (950ms) and the camera sets off after it in one long glide (1600ms), still easing in as the next node lights up. It rests about half a second per node until the run breaks.
- **The break:** Rewards Card turns red and shakes once; the other nodes step back further (26%); the camera shifts left and the error detail opens beside the node.
- **Loop restart:** a short fade; the camera and focus jump back to Greeting while the flow is invisible, so there's no swoop.
- **Opening frame:** on Preferences, active. **Desktop:** click the red node to toggle the detail, Run again. **Phones:** loop only. **Reduced motion:** the final state.

## Error detail (new design)

A frosted white panel (same surface as the Asimov rows), about 280px wide, r12, soft shadow, beside the failed node with a short pointer toward it:
- Header: red dot + **"Error at Rewards Card"** (Inter 500 14/20, #373E43) and the node ID chip (117).
- Body (Inter 400 12/18, #555): "The API call that checks rewards eligibility didn't respond as expected."
- A code line in DM Mono 12px: `GET /rewards/eligibility → 404` (Not Found dropped so it fits on one line)
- Footer: "Step 4 of the test run" (12px, #717684) and a **Run again** button (Inter 500 12px, red-tinted outline).

## Floating treatment

- No canvas panel or border: nodes and connectors sit directly on the scene.
- Connectors not yet travelled are white at about 40%; travelled ones are blue (#7CC4FF).
- Nodes keep their white cards with the soft shared shadow.

## Craft fixes to make on Rocket and Asimov at the same time

- **Rocket, the peeking inspector card:** at 50% opacity on the dark scene it reads as a grey smudge. Keep the card white and fade its contents instead.
- **Rocket, the top message:** the scrolled-away bubble is cut mid-line under the avatar, which looks clipped. Lengthen the top fade so old messages fade out fully before the edge.
- **Asimov, opening several rows:** the list can grow past the card and clip. Make the rows a true accordion (opening one closes the others).
- **Both, frosted surfaces on the dark scenes:** at 82% white they read greyish. Raise to about 92%, so bubbles and rows look as crisp as the modal.
- **Both, interaction states:** add hover and press states to every control (carousel arrows, inspector cards, Add Resource, row headers, modal buttons, Connect, restart), so the demos feel finished when someone actually uses them.
