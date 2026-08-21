# TASK V15b — The continuous chain plays the wrong sections in the wrong order

Follow-up to `.codex/tasks/V15-readaloud-title-and-continuous.md`, which is
merged in the working tree. **The title narration works and is not in question.**
The group ordering and chain termination are broken.

Read `videolab/docs/V15-findings.md` first — it is your own report on this code.

## Reproduction and evidence

Measured live in the browser against a running dev server, with the Siri helper
answering on `127.0.0.1:5277` (the path your report could not exercise, because
the sandbox blocked localhost). `window.fetch` was wrapped to log every call to
the helper, then "Continue to the next section" was enabled and "Play all"
clicked, on `/videolab/instagram-DbqXZ80hAny`.

**Actual `/speak` sequence:**

```
/speak  "primary theme"                 <- title, correct
/speak  "A creator argues, citing British polling, that young women now hold ma…"
/speak  "secondary themes"              <- title, correct
/speak  "Favourability polling: 72% of men under 30 view women positively versu…"
/stop
/speak  "Transcript"                    <- jumped BACKWARDS in the document
/speak  "72% of men under 30 hold a positive view of women."
/stop                                   <- chain ended here, 3 of ~15 sections
```

**Actual DOM order of headings on that page:**

```
H2 Pipeline stages
H2 Engagement
H2 Transcript            <- first reader in the document
H2 On-screen text
H2 Frames
H2 Analysis
   H3 primary theme      <- chain started here instead
   H3 secondary themes
   H3 rhetorical frame        never played
   H3 hashtags               never played
   H3 notable speakers       never played
   H3 key moments            never played
H2 Framework concepts
   H3 extraction kernel      never played
   H3 buffer class           never played
   H3 psychological wage     never played
   H3 snubber circuits       never played
   H3 electrodynamic map     never played
   H3 thermodynamic map      never played
   H3 systems dynamics       never played
   H3 evidence limits        never played
```

## The three defects

1. **The chain does not start at the first reader.** "Play all" began at
   `primary theme`, the seventh reader in the document, skipping Transcript.

2. **Advancement is not in document order.** After `secondary themes` it moved
   *backwards* to `Transcript` rather than forward to `rhetorical frame`.

3. **The chain terminates after three sections.** Eleven or more readers were
   never reached, and the run ended on `/stop` with no further `/speak`.

The V15 brief called this out explicitly: *"Registration must not depend on
render order alone if that would diverge from visual order — verify the order
you get is the order on screen."* It diverges.

## Likely cause — verify rather than assume

React mount order is not document order. Children mount before parents, effects
fire bottom-up, and the render-prop pattern in `ReadableValue` nests a
`ReadAloud` inside each block. A registry populated by `useEffect` registration
order, or keyed into a `Map`/`Set` by insertion, will not match the DOM.

**Order the registry by actual document position**, not by registration time —
for example by comparing registered elements with `compareDocumentPosition`, or
by querying the container in DOM order at play time. Each `ReadAloud` will need
a stable ref to its own root element for that to be possible.

Also re-examine the `/stop` that appears mid-chain. It suggests the
`readaloud:start` mutual-exclusion event is stopping the instance the chain is
trying to start — the stop-then-start race the V15 brief warned about — and that
is a plausible cause of the early termination.

## Requirements

- "Play all" starts at the first reader **in document order** within the group.
- Advancement proceeds strictly forward in document order, one reader at a time,
  through the last reader in the group, with the title spoken for each.
- The chain must not stop early. If a reader is skipped (no sentences), the chain
  continues past it rather than ending.
- Decide deliberately whether Transcript belongs in the same group as the
  analysis blocks. Either is defensible — one group covering the whole page, or a
  group scoped to the analysis and framework sections only. **State which you
  chose and why in the findings.** What is not acceptable is the current
  behaviour, where it is in the group but at the wrong position.
- Everything already working stays working: titles spoken first, toggle
  persisted and defaulting off, shared rate/voice, Stop cancelling the whole
  chain, pause/resume, no scroll-jacking.

## Hard constraints

- Do NOT run any `git` command.
- Do NOT modify `videolab/` (Python), `Paper/`, or `systemic_arbitrage/`.
- Do NOT change the `ReadAloudRenderState` render-prop contract.
- TypeScript strict mode. No `any`.

## Verify

```bash
cd website && npx tsc --noEmit -p tsconfig.app.json && npm run build
```

Both clean, plus the existing tests.

Then **prove the order**. Add a test that asserts the group's play order equals
document order for a fixture with readers deliberately mounted out of tree order.
A test that only checks "advances to the next registered instance" is what let
this through the first time — assert against document position.

## Report

Append to `videolab/docs/V15-findings.md`: what the registry was actually
ordering by, how you now derive document order, what caused the early
termination, and the group-scope decision with its reasoning.
