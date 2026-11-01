# Brief: minute two, turns 6–10 (YT02v2_ov, 1:20.7–2:18.3)

The author approved the first minute (`first_minute_v1.mp4`, turns 0–5) and asked for the next
minute. You build five scenes, one per OV turn. The narration opens the dictionary entry, reads
senses one to three, and lands on **Figure 2.3** of the book. Before you write any code, read:

- `BRIEF_FIRST_MINUTE.md`: The contract, visual language, text and motion rules.
- `FINDINGS_FIRST_MINUTE.md`, including Fix pass 1.
- The code in `firstminute/`, especially `DictionaryEntry.tsx`. Its exported
  `DefinitionHierarchy` / layout constants are the entry you continue from.

## Rules (override anything below)

- Working directory: `/Users/emmanuel/Documents/Theory/TheOriginalPower`.
- Write only:
  - `Architecting_the_operation/video/yt02/stage/minutetwo/*` (replace the five stubs in place;
    keep each export name; add helpers and data there).
  - `stage/tools/check_minute_two.*`.
  - `stage/FINDINGS_MINUTE_TWO.md`.
- You may import from `firstminute/` and `dashboard/`, but do not edit them. If a first-minute
  file needs a change (for example an extra export), describe the change in the findings and
  work around it.
- Do not edit `index.ts`, `stage_ov.yaml` or the review plans.
- The engine at `/Users/emmanuel/Documents/Theory/scriptCast-stage/` is read-only.
- No git commands that change state; `git status` is fine. No `rm -rf`. Do not read `.env` or
  any secret.
- No Chromium and no Remotion renders; the orchestrator renders. Plan compile, `--dry-run` and
  the site build into a fresh `/tmp` directory are fine.
- Never touch `outputs/YT02v2_ov/video/runs/`.
- Write `FINDINGS_MINUTE_TWO.md` early and append to it after each scene, so partial progress
  survives if the run stops.

## Checkpoint (AGENTS.md commit-before-destroy is satisfied)

The orchestrator committed the checkpoint for this task: stubs, plan and this brief. The dirty
paths outside `stage/` (`.claude/launch.json`, `yt02/logs/…`, `tmp/`) are the author's own
unrelated work. Leave them alone, and do not treat them as blocking. The orchestrator commits
your result after review.

## The contract

`stage_ov.yaml` now lists shots `S00-06` … `S00-10`, and `ov/stage_plan.json` is compiled
(0–139,100 ms with OV audio). Every cue name carries its turn prefix, for example `t6Why` and
`t10Pyramid`. Use `useCue` with those names.

All rules from the first minute apply:
- Deterministic frame path: no React state, effects, refs or DOM measurement; no randomness or
  `Date`.
- Dashboard tokens, `CompactBorder`, and IBM Plex.
- Body text ≥ 28 px and labels ≥ 20 px.
- `MathText` for subscripts, and no literal `_` on screen.
- Every beat lands on its cue, with a 300–700 ms entrance.
- Each scene reads as complete at its last frame.
- No interaction hints.
- On-screen text uses direct declarative statements, with no "not X but Y" antithesis. Grep for it.

**Through-line.** The three senses form a ladder of scale:
1. one **person** acting on another;
2. a **belief** held in minds;
3. a **system** of practices.

Keep a slim numbered entry rail on the left across turns 7–9, at about x 120–420, showing the
slots 1, 2 and 3. The current sense is lit and each earlier sense stays visible. The main card
for the current sense sits to the right. In turn 10 the three senses become the left column of
Figure 2.3.

**Sense wording.** On-screen sense text follows the narration, since the narration is the author's
approved script. Label the entry "Typical dictionary senses (paraphrased)". Do not quote any real
dictionary.

## Scenes

The times are seconds within the turn, for orientation; the cues carry the exact values.

### Turn 6 · `EntryOpen` (1:20.7–1:37.6)

Narration: "So why does the dictionary list individual prejudice first? Open a standard dictionary
entry for racism. Its numbered definitions usually begin with individual prejudice or
discrimination and place systemic racism at the bottom, when the entry includes it at all."

- `t6Why` (0.1): the question sets as a header, "Why does the dictionary list individual prejudice
  first?".
- `t6Open` (3.4): an entry panel opens like a page unfolding from its spine (scaleX from the left
  edge, 500 ms), with the headword **rac·ism** *(noun)*.
- `t6Numbered` (7.2): three empty numbered slots, 1, 2 and 3, draw down the panel.
- `t6Begin` / `t6Individual` (8.7 / 9.4): slot 1 fills with "individual prejudice or
  discrimination" and lights gold.
- `t6Systemic` (12.4): "systemic racism" fills slot 3.
- `t6Bottom` (13.8): slot 3 slides to the bottom of the panel and dims. Slot 2 shows a muted
  placeholder rule.
- `t6Includes` (15.3): slot 3's border turns dashed and the slot fades to about 40%, with the tag
  "when included at all".

### Turn 7 · `SenseOne` (1:37.9–1:46.6)

Narration: "Sense one defines racism as individual prejudice, hostility, or discrimination directed
against another person on the basis of race or ethnicity."

- `t7Sense` (0.0): the entry rail appears at the left with slot 1 lit. The main card opens with the
  title "Sense 1".
- The definition builds phrase by phrase in the card:
  - `t7Prejudice` (2.2): "individual prejudice".
  - `t7Hostility` (2.9): ", hostility,".
  - `t7Discrimination` (4.2): "or discrimination".
  - `t7Person` (6.1): "directed against another person".
  - `t7Race` (7.3): "on the basis of race or ethnicity".
- Diagram under the text, keyed to the same cues: two simple person glyphs drawn in line art
  (circle head and shoulders, no faces). An arrow runs from the left glyph to the right glyph on
  `t7Person`. Three small labels stack on the arrow as the words land: "prejudice", "hostility",
  "discrimination". On `t7Race` a tag under the pair reads "unit: one person".

### Turn 8 · `SenseTwo` (1:47.0–1:58.7)

Narration: "Sense two defines racism as an ideological belief or doctrine holding that built-in
biological differences among human racial groups determine cultural or intellectual
achievement."

- `t8Sense` (0.0): slot 2 lights on the rail, and the main card changes to "Sense 2".
- The definition builds phrase by phrase:
  - `t8Ideological` (2.3): "an ideological belief".
  - `t8Doctrine` (4.0): "or doctrine".
  - `t8Biological` (6.1): "built-in biological differences".
  - `t8Groups` (8.4): "among human racial groups".
  - `t8Determine` (9.0): "determine cultural or intellectual achievement".
- Diagram: the doctrine's claimed chain, drawn as a claim. It sits inside an outline of a thought
  bubble, labelled "doctrine" on `t8Doctrine`. Inside the bubble, three boxes appear: "racial
  groups" on `t8Groups`, "biological differences" on `t8Biological`, and "achievement" on
  `t8Achievement`. Arrows link them, labelled "claimed to determine", on `t8Determine`. On
  `t8Achievement` a tag under the bubble reads "unit: a belief".

### Turn 9 · `SenseThree` (1:59.0–2:08.9)

Narration: "Sense three, when the dictionary includes a third sense at all, mentions institutional or
systemic practices that produce unequal outcomes across racial categories."

- `t9Sense` (0.0): slot 3 on the rail shows dashed, as in turn 6.
- `t9Third` (2.3): slot 3 solidifies and lights, and the main card changes to "Sense 3".
- The definition builds phrase by phrase:
  - `t9Institutional` (4.0): "institutional or systemic practices".
  - `t9Unequal` (7.3): "that produce unequal outcomes".
  - `t9Categories` (9.0): "across racial categories".
- Diagram: a small network of five unlabelled institution nodes (rounded rectangles) with
  connecting wires, drawn on `t9Practices`. On `t9Unequal`, an outcome meter fills two bars to
  clearly unequal heights, labelled "category A" and "category B", with the tag "illustrative".
  On `t9Categories` a tag under the meter reads "unit: a system".
- At shot end, the rail shows all three senses lit, each with its unit tag: "one person", "a
  belief", "a system".

### Turn 10 · `FigureTwoThree` (2:09.3–2:18.3)

Narration: "Figure two point three in Chapter 2 of The Original Power displays this standard
dictionary order in its left-hand column as an upside-down pyramid."

Recreate **Figure 2.3, "Inverting the Definitional Hierarchy"** (manuscript
`Paper/The_Original_Power.tex`, `fig:hierarchy_inversion`, lines ~1937–1971). Use its labels
verbatim:

- Left column, "Conventional Hierarchy":
  - "1. Individual Prejudice"
  - "2. Belief in Superiority"
  - "3. Systemic (if present)"
  - with the note "↑ buried, rarely referenced" under it.
- A centre arrow labelled "Must invert".
- Right column, "Correct Hierarchy":
  - "1. Systemic Policies"
  - "2. Ideological Narratives"
  - "3. Interpersonal Prejudice"
  - with the note "↑ epiphenomenal, downstream" under it.

Layer widths follow the tikz figure in the ratio 5.2 : 4.2 : 3.2, widest at the top, centred, so
each column is an upside-down pyramid. Conventional layers use the red marker washes
(`color/fill/red-wash` / `red-faint`), and correct layers use gold washes. Draw the figure as a
plate: a thin hairline frame with the caption bar "Figure 2.3 · Inverting the Definitional
Hierarchy" and the small line "The Original Power, Chapter 2".

Beats:

- `t10Figure` (0.0): the plate frame and caption draw. The rail of three senses from turn 9 is
  still at the left as the shot opens.
- `t10Chapter` (1.2): the source line "The Original Power, Chapter 2" sets.
- `t10Displays` / `t10Order` (3.8 / 5.4): the three rail slots fly into the left column and become
  its three layers, in order 1, 2, 3.
- `t10Column` (6.7): the "Conventional Hierarchy" header lights, and a gold highlight bracket
  wraps the left column.
- `t10Pyramid` (7.9): the layers take their tapered widths, 5.2 → 4.2 → 3.2. The pyramid outline
  traces around them, and the note "↑ buried, rarely referenced" appears.

The right column and the centre arrow are present from `t10Figure` at about 25% opacity. The
narration discusses the left column only; the right column belongs to the figure, so draw it,
dimmed. It lights in a later minute.

## Checks (all must pass)

1. Episode tsc:
   `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage`
2. `check_first_minute`, `check_roadmap_boot` and `check_dashboard`: unchanged, still passing.
3. A new `tools/check_minute_two.mjs`, built on the pattern of `check_first_minute.mjs`. It renders
   each scene at shot start, at each cue + 700 ms, and at shot end − 1 frame, and asserts:
   - two-process determinism;
   - the hook policy;
   - no literal underscores;
   - no interaction hints;
   - every quoted string above is present from its beat and absent before it;
   - the Figure 2.3 layer widths are in the ratio 5.2 : 4.2 : 3.2, within 1%;
   - the rail and the main card do not overlap.
4. Plan compile and dry-run:
   - `PYTHONPATH=/Users/emmanuel/Documents/Theory/scriptCast-stage /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m scriptcast.tools.stage plan Architecting_the_operation/video/yt02/stage/stage_ov.yaml -o Architecting_the_operation/video/yt02/stage/ov/stage_plan.json`
     The output must be byte-identical to the committed plan.
   - Then `render <plan> -o /tmp/x.mp4 --dry-run`.
5. The site build into a fresh `/tmp` directory, using the same command as in
   `FINDINGS_FIRST_MINUTE.md`.

## Findings (`FINDINGS_MINUTE_TWO.md`)

- Each scene's beats with their cues.
- Every manuscript string with its tex line.
- The Figure 2.3 geometry.
- Any deviation, with its reason.
- Your antithesis grep.
- Each check's tail.
