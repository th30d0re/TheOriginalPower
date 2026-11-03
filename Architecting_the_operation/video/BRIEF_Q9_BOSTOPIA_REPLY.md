# Brief: Question 9, Bostopia reply: build the portrait reel as Stage scenes

Fill the two header lines, then send everything below the line. The format follows
`scriptCast-stage/docs/briefs/TEMPLATE-scene-worker-prompt.md`.

**Recycling means:** take an earlier card's **idea** (its claim, its exact numbers, its source and
URL) and rebuild it as an animated, cue-synced Stage scene in the YT02 visual system. A card's JSON is
the record of facts. Its layout and component are not reused.

## Prerequisites (orchestrator, before the first run)

1. **Word timings.** Run the word-timing step on the rendered Q9 narration, so that
   `outputs/q9_bostopia_reply/word_timings.json` exists next to `episode_manifest.json`. Stage cues key
   on spoken words.
2. **Episode skeleton.** Create `Architecting_the_operation/video/q9_bostopia/stage/`:
   - a `stage_q9.yaml` with one shot per R-01 … R-10 anchor, `width: 1080`, `height: 1920`;
   - a compiled plan;
   - an `index.ts` registering one stub scene per shot.

   The engine sets the frame from the plan's width and height. Confirm the compiler passes them
   through.
3. **Portrait audit.** `tools/layout_audit.ts` assumes 1920 × 1080. Copy it with the portrait safe area
   below, or give it a frame-size parameter.

---

```text
PASS: {{BUILD | FIX ROUND n}}
Checkpoint: {{HASH}} (clean)

# Brief: Question 9 — Bostopia reply. Build the reel's ten shots (R-01 … R-10) as Stage scenes,
# portrait 1080 × 1920, every beat on its spoken word.
# This copy matches the 6:24 cut. Tulsa, the machine-gun turn, Madison, the second Locke turn,
# the stockpile restatement, the second August 1, and the 2004 slip stay off the reel.

The spec is Architecting_the_operation/video/q9_bostopia_reply_remotion_shotlist.md; build it faithfully.
Read first:
- the shot list, all of it. Where it says "recycle" a card, rebuild that card's idea; never reuse the
  old card.
- the script: Architecting_the_operation/podcasts/q9_bostopia_reply_draft.md (the spoken words your
  cues land on);
- the plan: Architecting_the_operation/video/q9_bostopia/stage/ov/stage_plan.json and
  stage_q9.yaml (segments, cue names, ms);
- the facts to recycle, one JSON per card: Architecting_the_operation/video/cards_json/
  g02, g12, g14, g15, g21, g24, g25, g26, g28, g29, g31, y01, y08 (headline, items, caption, sources,
  qrUrl). Their numbers, dates and source lines are the record. Copy them exactly. Their components
  and layouts are not reused;
- the house style and the components you build with: Architecting_the_operation/video/yt02/stage/
  (min3_7/b/APAGroupDefinitions.tsx, min3_7/d/InstalledRacialPrior.tsx, min3_7/shared/,
  equations/, dashboard/ComplexWagePlane.tsx);
- {{FRAMES}}: for a fix round, the review stills. Open every one before changing anything.

## Checkpoint (AGENTS.md commit-before-destroy is satisfied)
The orchestrator committed a clean checkpoint ({{HASH}}). The dirty paths .claude/launch.json,
Architecting_the_operation/video/yt02/logs/… and tmp/ belong to the author. Leave them alone, and do not
treat them as blocking. The orchestrator commits your result after review.

## Files you may write
- Architecting_the_operation/video/q9_bostopia/stage/scenes/*: one scene per shot, replacing the
  stubs and keeping their export names; shared helpers in scenes/shared/
- Architecting_the_operation/video/q9_bostopia/stage/tools/check_q9.{tsx,mjs}
- Architecting_the_operation/video/q9_bostopia/FINDINGS_Q9_STAGE.md (new)
Read-only: the script, both shot lists, the YAML and plan, cards_json/, everything under yt02/ (import
from it, do not edit it), the engine, outputs/. The author owns the script's words.
No git commands that change state. No rm -rf. Do not read .env or secrets. No renders: the orchestrator
renders. Never touch outputs/YT02v2_ov/video/runs/.

## What each shot shows (rebuild the idea, then make it move)

The shot list's Shots section is the cut. Its opening paragraphs still mention a wage plane and a
twelve-shot plan. Those paragraphs are earlier planning. Build the ten shots below. Count is ten.

Numbers that live on an older card and are absent from this script stay off the screen: g21's +58%,
g12's October 28, 2026 deadline and its fine, g02's Pew percentages, g14's $100 and $100–$150 split.
The spoken license line is "two hundred dollars or more." The spoken wealth line is about $550,000
and about $7,800. g26's rates and g24's correlations are spoken by the cards already in this cut, and
they stay.

- R-01: the clip (bostopia_psychopaths), then "This answer comes from the left." His four insults stay
  inside the clip. No screen text puts words in his mouth.
- R-02: the clip (bostopia_stockpile), then "Saint-Domingue." The Haitian Revolution is the record.
  No new number. The illness-and-useless restatement is off this cut.
- R-03: the G-26 idea, drawn. The 1938 Boston map (assets/frames/boston_holc_map_navy.png) with grades
  C and D lighting up, and the shooting rates per 10,000 from g26's caption: D 3.14, C 3.12, A and B
  0.43. Draw them as bars that grow from the map. "State-sponsored democide" is a label, his name for
  it, not a statistic. Tulsa is off this cut.
- R-04: the G-21 idea, the +87% only, as a growing bar. Black women, gun ownership, 2021. He called
  that record paranoia. August 1 is not on this shot.
- R-05: the clip (bostopia_smith), then the receipt. OCPF report 960537, receipt 17220407, Smith &
  Wesson Brands, Inc., $50,000, September 25, 2024. Beside it, the committee file: 3,324 receipts,
  2,499 of them at $100 or less, drawn as a field of small receipts with one large one. His account of
  the bill, the revisions, the listening tours and the two handguns is a caption. Then the fee: two
  hundred dollars or more, Virginia's poll tax at about $15 a year in today's money, white median net
  wealth about $550,000, Black about $7,800. The household it keeps out is the one still arriving.
- R-06: the clip (bostopia_abusers), then the grant as one line and no illustration. Then the G-15
  idea: AR-15 banned by name, Mini-14 listed as not covered, same round. On that same scene, August 1,
  2024, said once: held that day, the rifle can be registered and kept; anyone after that date is who
  the tightening is written against. Then the G-31 idea, stock and grip only. The machine-gun turn,
  the forced-reset trigger, and the Article 17 charge are off this cut.
- R-07: the clip (bostopia_libertarian), then "He calls the right a privilege," then "unalienable,"
  the Declaration's word, then Locke, Second Treatise §137, one sentence (University of Chicago Press
  transcription). The animal-and-firearm sentence is his and carries no citation chip. There is no
  second Locke turn.
- R-08: arms for captives, from the manuscript (Inikori and Whatley), then "The guns went to the White
  buffer class, as a wage." Then Mason, Virginia, 1788, the two sentences the manuscript quotes, and
  "That is the date in this law" on "let them sink." Madison is off this cut. Then Lexington and
  Concord, April 1775, in this state. The firearms were the line. No Virginia map. No YT02 footage,
  and no portrait rebuild of the wage plane.
- R-09: the clip (reel_a1_short), then "That is Governor Healey. A yes vote funds none of the programs
  she names. The position is incoherent."
- R-10: the G-24 idea as a plot that resolves. Poverty r = +0.72. Gun-law rank r = +0.29 alone, about
  zero once poverty and inequality are in (g24's caption). Then the G-25, G-28 and G-29 ideas: RAND,
  safe storage, and background checks. Whether a repeal leaves those two sections standing is still
  unverified, so that claim stays a caption. Then "Tomorrow is voting day. Vote no." Racism, sexism,
  and systemic ableism. The word systemic appears once.

## The standard
Determinism
- Every frame is a pure function of stage ms and the plan. Use only useCue, useStageMs and usePlan
  (plus useNotch via SceneBorder, if used).
- No state, effects, refs, DOM measurement, randomness or Date.

Portrait layout
- 1080 × 1920. Safe area x 60–1020, y 140–1780, clear of the phone's UI bands.
- No text overlaps text. No line or shape crosses text.
- A replaced picture is unmounted or in its own region.
- Mark every text and shape with data-text / data-shape and its box.

Visuals
- The YT02 tokens through color(), and IBM Plex.
- For a phone: headline ≥ 56 px, body ≥ 36 px, source line ≥ 24 px.
- People drawn with PersonMark; subscripts through MathText; equations through equations/
  (colour registry and pulses).

Beats
- Every element enters on the cue where it is spoken, with a 300–700 ms entrance.
- Clip turns play the source reel and take no scene.
- Each scene reads as complete at its last frame.

Sourcing (the rules this reply was written under)
- Every number on screen is one already in the shot list or in a recycled card's JSON, copied exactly.
  Invent no number, date, quote or donor total.
- The speaker's own arguments are captions, never sourced statements: his account of the bill and the
  handguns; "state-sponsored democide"; the Locke extension; the Article 17 charge; "racism, sexism,
  ableism".
- Evan George's words appear only in the clips. No screen text puts words in his mouth ("against this
  government" is the speaker's hearing).
- He says 2004 on the source reel and the on-screen caption corrects it. The spoken track and every
  scene leave the slip alone.
- Every sourced beat carries its source line, from the card JSON or the shot list.

Show, don't describe
- The picture carries the idea: bars grow, the map lights, the switch flips, receipts pile up.
- At most ~25 on-screen words per settled beat (hard limit 30), the source line excluded.
- No filler microcopy, no internal labels (shot ids, turn numbers), no empty containers.
- Use direct declarative statements with no antithesis. Run tools/check_antithesis.py on every file
  you write.

## Your check: tools/check_q9.{tsx,mjs}
Modelled on yt02/stage/tools/check_min3_7_c.*, with the portrait safe area. For each shot's segment,
render at the start, each cue + 700 ms, and the end − 1 frame. Assert:
- two-process determinism;
- the hook and underscore policies;
- every shot-list string present from its cue and absent before it;
- every number on screen equal to its source (the card JSON or the shot list);
- a clean portrait layout audit;
- the word budget;
- no on-screen string matching /\b(socket|slot|module|node|store)\b/i, /\bR-\d+\b/ or /\bturn \d+\b/i.
Collect every failure before exiting.

## Done means (paste each tail into FINDINGS_Q9_STAGE.md)
- episode tsc: npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p
  Architecting_the_operation/video/q9_bostopia/stage
- node Architecting_the_operation/video/q9_bostopia/stage/tools/check_q9.mjs
- tools/check_antithesis.py on every file you wrote
- a table R-01 … R-10: anchor, scene file, the recycled card ideas used and the numbers they carry.

Stop when Done means passes.
```

---

## Sending it, and who should get it

- **Model:** this is design work, so Argon or Codex. Grok 4.7 high on Cursor is the available
  alternative. Flash and Composer under-draw.
- **Split it if quotas allow:** the design pass first (FigCraft wireframes of the ten shots,
  approved by the author), then this brief as the implementation pass, filling the approved designs.
- **One session per reel.** Record its session ID. Every fix round resumes the same session with one
  batched list.

```bash
agy --model gemini-4-argon-high --print-timeout 55m --dangerously-skip-permissions --print="$(cat brief.md)"
agy --conversation <id> --print="$(cat fix.md)"
cursor-agent -p --trust --force --output-format json --model grok-4.7-high "$(cat brief.md)" > run.json
cursor-agent -p --trust --force --output-format json --model grok-4.7-high --resume <session_id> "$(cat fix.md)"
```
