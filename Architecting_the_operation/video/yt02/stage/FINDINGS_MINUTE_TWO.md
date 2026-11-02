# Minute-Two Scene Findings

Model: Kimi Code CLI

Scope: `EntryOpen`, `SenseOne`, `SenseTwo`, `SenseThree`, `FigureTwoThree` for `YT02v2_ov`
turns 6–10 (80,740–139,100 ms), built per `BRIEF_MINUTE_TWO.md`. This file is the session
record for the run, per the first-minute precedent: the brief's write-list scopes output to
`minutetwo/*`, `tools/check_minute_two.*`, and this file, so the findings carry the record.

## Scene Beats and Cues

All cue values are episode-absolute milliseconds from `ov/stage_plan.json`.

### Turn 6 · `EntryOpen` (shot 80,740–97,910)

| Cue | Time | Beat |
|---|---:|---|
| `t6Why` | 80,880 | Header "Why does the dictionary list individual prejudice first?" sets. |
| `t6Open` | 84,120 | Entry panel unfolds from its left edge (`scaleX`, 500 ms): **rac·ism** *(noun)* and the label "Typical dictionary senses (paraphrased)". |
| `t6Numbered` | 87,980 | Three empty numbered slots draw down (staggered 130 ms, 380 ms each). |
| `t6Begin` | 89,480 | Slot 1 fills: "individual prejudice or discrimination". |
| `t6Individual` | 90,100 | Slot 1 lights gold (left rule + gold number, 420 ms). |
| `t6Systemic` | 93,160 | Slot 3 fills: "systemic racism". |
| `t6Bottom` | 94,500 | Slot 3 slides 166 px to the panel bottom and dims; slot 2's muted placeholder rule appears. |
| `t6Includes` | 96,020 | Slot 3's border crossfades solid → dashed, opacity settles at 0.40, and the tag "when included at all" appears. |

### Turn 7 · `SenseOne` (97,910–106,990)

| Cue | Time | Beat |
|---|---:|---|
| `t7Sense` | 97,910 | Entry rail enters at the left (slot 1 lit, slots 2–3 placeholders); the card opens with "Sense 1"; both person glyphs draw (dash trace). |
| `t7Prejudice` | 100,130 | "individual prejudice"; arrow label "prejudice". |
| `t7Hostility` | 100,790 | ", hostility,"; arrow label "hostility". |
| `t7Discrimination` | 102,090 | "or discrimination"; arrow label "discrimination". |
| `t7Person` | 104,050 | "directed against another person"; the arrow draws from the left glyph to the right glyph (500 ms). |
| `t7Race` | 105,210 | "on the basis of race or ethnicity."; card tag "unit: one person"; rail slot 1 gains "one person". |

The diagram is line art: circle head and a shoulder arc per glyph, no faces. The three
labels stack at fixed positions above the arrow's location as their words land; the arrow
draws later on `t7Person`, per the brief's beat order. Nothing moves between beats.

### Turn 8 · `SenseTwo` (106,990–119,000)

| Cue | Time | Beat |
|---|---:|---|
| `t8Sense` | 106,990 | Slot 2 lights on the rail (slot 1 stays visible with its unit); card opens with "Sense 2". |
| `t8Ideological` | 109,270 | "an ideological belief". |
| `t8Doctrine` | 110,950 | " or doctrine"; the dashed thought-bubble outline and its "doctrine" label chip appear. |
| `t8Biological` | 113,070 | " holding that built-in biological differences"; box "biological differences". |
| `t8Groups` | 115,430 | " among human racial groups"; box "racial groups". |
| `t8Determine` | 115,970 | " determine cultural or intellectual achievement."; the two arrows draw with the label "claimed to determine". |
| `t8Achievement` | 117,850 | Box "achievement"; card tag "unit: a belief"; rail slot 2 gains "a belief". |

The bubble is a dashed rounded rect with two trailing circles — the deterministic
equivalent of a cloud outline. Boxes sit at fixed positions and land in cue order
(differences, then groups, then achievement); the second arrow reaches the slot where
"achievement" lands 1.9 s later.

### Turn 9 · `SenseThree` (119,000–129,260)

| Cue | Time | Beat |
|---|---:|---|
| `t9Sense` | 119,000 | Rail enters with slot 3 dashed at 0.45 (as at the end of turn 6); the card frame is dashed with "Sense 3" dim. |
| `t9Third` | 121,280 | Slot 3 and the card solidify and light (450 ms crossfade). |
| `t9Institutional` | 123,040 | "institutional or systemic practices". |
| `t9Practices` | 124,680 | The five-node institution network draws (wires dash-trace, nodes stagger 90 ms). |
| `t9Unequal` | 126,320 | " that produce unequal outcomes"; the meter fills category A to 170 px and category B to 58 px; "category A" / "category B" labels and the "illustrative" chip. |
| `t9Categories` | 127,960 | " across racial categories."; card tag "unit: a system"; rail slot 3 gains "a system" — all three rail senses lit with their unit tags at shot end. |

### Turn 10 · `FigureTwoThree` (129,260–139,100)

| Cue | Time | Beat |
|---|---:|---|
| `t10Figure` | 129,260 | Plate frame dash-traces (700 ms) with the caption bar; turn 9's rail stands at the left; the right column and the centre arrow sit at 0.25 opacity; the "Conventional Hierarchy" header pre-exists at 0.25. |
| `t10Chapter` | 130,500 | "The Original Power, Chapter 2" sets in the caption bar. |
| `t10Displays` | 133,100 | The three rail slots fly into the left column in order 1, 2, 3 (stagger 220 ms, 800 ms cubicInOut each), crossfading from rail content to the manuscript layer text over each flight's last 320 ms. The rail label fades. |
| `t10Order` | 134,640 | All three layers landed at uniform width 598 px. |
| `t10Column` | 135,980 | "Conventional Hierarchy" lights to full; the gold bracket traces around the left column. |
| `t10Pyramid` | 137,460 | Layers 2 and 3 taper 598 → 483 and 598 → 368 px (centred, 500 ms); the pyramid outline traces; "↑ buried, rarely referenced" appears. |
| `t10End` | 137,820 | Hold to shot end. |

## Manuscript Strings on Screen

Figure 2.3 (`fig:hierarchy_inversion`), `Paper/The_Original_Power.tex`:

| On-screen string | tex line |
|---|---|
| "Conventional Hierarchy" | 1951 |
| "1. Individual Prejudice" | 1953 |
| "2. Belief in Superiority" | 1954 |
| "3. Systemic (if present)" (bold "3. Systemic", regular "(if present)") | 1955 |
| "↑ buried, rarely referenced" | 1956 |
| "Must" / "invert" (two lines, as `Must\\invert`) | 1960 |
| "Correct Hierarchy" | 1963 |
| "1. Systemic Policies" | 1965 |
| "2. Ideological Narratives" | 1966 |
| "3. Interpersonal Prejudice" | 1967 |
| "↑ epiphenomenal, downstream" | 1968 |
| "Inverting the Definitional Hierarchy" (in the caption bar) | 1970 |

Sense wording and the turn-6 slot texts ("individual prejudice or discrimination",
"systemic racism", "when included at all", the three sense definitions, the diagram
labels) follow the approved narration script verbatim, as the brief directs; the entry
carries the label "Typical dictionary senses (paraphrased)", and no real dictionary is
quoted. "The Original Power, Chapter 2" names the book and the figure's chapter.

## Figure 2.3 Geometry

- Plate: x 440–1880, y 110–1000, 1 px hairline; caption 28 px mono at y 150, source line
  20 px mono at y 188, caption rule at y 222.
- Column centres x 760 (Conventional) and x 1560 (Correct); headers at y 328.
- Layers: y 352 / 466 / 580, height 92. Widths 598 / 483 / 368 px = 115 × (5.2, 4.2, 3.2)
  exactly (tikz `minimum width` 5.2 / 4.2 / 3.2 cm, tex lines 1953–1955, 1965–1967). The
  left layers land at a uniform 598 px and taper on `t10Pyramid`; the right column holds
  its tapered widths throughout.
- Washes mirror the tikz red!25/15/8 and green!25/15/8 steps with the dashboard tokens:
  conventional layers use `color/fill/red-wash`, `color/fill/red-faint`, and red-faint at
  0.6 fill-opacity; correct layers use `color/fill/gold-wash` at 1 / 0.65 / 0.4.
- Centre arrow: double rule from x 1090 to 1230 at y 500 with a filled head, labelled
  "Must" / "invert" beneath.
- Gold bracket: x 445–1075, y 340–684 around the left column. Pyramid outline: triangle
  (452, 344) → (760, 724) → (1068, 344), traced on `t10Pyramid`; notes at y 768.
- Rail and card never overlap: rail x 120–420, card x 480–1800 (asserted).

## Deviations

1. **"holding that" rides the `t8Biological` fragment.** The narration speaks "holding
   that" between "or doctrine" and "built-in biological differences"; the brief's beat
   list omits it, and the sentence reads broken without it. It enters with the
   `t8Biological` fragment, whose 380 ms entrance covers the spoken words.
2. **Layer strings are asserted present at `t10Order`+700 and absent before
   `t10Displays`.** The brief writes the beat as the pair "t10Displays / t10Order": the
   text crossfades in during each flight, so at `t10Displays`+700 slot 3's layer text has
   not started. The checker takes the pair as one beat (absence before the first cue,
   presence after the second).
3. **The left column header pre-exists at 0.25 opacity.** The brief has it "light" at
   `t10Column`; a header appearing from nothing while its column is already built reads
   as a pop. It sits at 0.25 from `t10Figure`, symmetric with the right header, and
   lights to 1.0 on cue.
4. **Slot 3's turn-6 final opacity is exactly 0.40** (1 − 0.38 at `t6Bottom` − 0.22 at
   `t6Includes`), the brief's "about 40%".
5. **SenseThree's rail slot 3 `data-rail-state` flips dashed → lit at the solidify
   midpoint**; the border and opacity crossfade continuously through the 450 ms ramp.
6. **The entry rail's unreached slots are placeholders** (dim number, muted rule), and
   slot 3 alone carries the dashed "when included at all" treatment, continuing the state
   turn 6 establishes. Rail unit tags read "one person" / "a belief" / "a system"; the
   card tags read "unit: one person" / "unit: a belief" / "unit: a system", as briefed.
7. No first-minute file needed changes; nothing was imported that is not already
   exported. `index.ts`, `stage_ov.yaml`, and the review plans are untouched.

## Antithesis Grep

```
$ python3 tools/check_antithesis.py Architecting_the_operation/video/yt02/stage/minutetwo/*.tsx
check-antithesis: no banned constructions found.
```

A manual `grep -nE '\b(not|n't|never|but|rather than|instead of|more than just|merely|no
longer|only)\b'` over the six `minutetwo/*.tsx` sources and `tools/check_minute_two.*`
finds no matches. Every on-screen string is a direct declarative statement or the
narration's verbatim question header.

## Check Output Tails

### Episode TypeScript

```text
$ npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage
exit 0; no diagnostics
```

### Minute-Two Checker

```text
$ node tools/check_minute_two.mjs
PASS: 44 minute-two frames rendered in two fresh processes; all markup hashes match.
PASS: 44 cue-derived frames; five minute-two scene contracts, narration strings, manuscript figure strings, hook policy, underscore policy, and interaction-hint policy verified; strings present from their beat and absent before it; rail x 120–420 clear of card x 480; Figure 2.3 layer widths 598 / 483 / 368 px in the ratio 5.2 : 4.2 : 3.2.
```

### First-Minute Checker (unchanged, still passing)

```text
PASS: 43 first-minute frames rendered in two fresh processes; all markup hashes match.
PASS: 43 cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified; fix-pass-1 geometry: DictionaryEntry gutter x 985 clear of panel edge 965 with chain at 1050; WhyLadder header/column aligned at x 240; LiteratureStack boundary y 780 and elbow connectors clear of all block text boxes.
```

### RoadmapBoot Checker (unchanged, still passing)

```text
PASS: 17 RoadmapBoot frames rendered in two fresh Node processes with identical markup; state/effect/reducer/ref hooks trap on invocation.
PASS: RoadmapBoot renders 17 deterministic frames; 13 labels land on their cues and are absent before; console box 580–1340 × 150–790 clears stacks (317 / 1671) and tray (944); panels 12, 9, 14 light on items 06, 09, 10 with wires; item11 sweep complete by +1300 (map opacity 1); item12 pulse present; console collapsed by roadmapEnd+600; era strip empty throughout; Era clock on standby and map outline-only ("1486", "LISBON", "PORTUGAL", "RUNTIME LOG" absent from every frame); no literal underscores; no interaction hints.
```

### Dashboard Regression (unchanged, still passing)

```text
PASS: 19 frames plus all 24 tray mode renders and 3 moved Wage plane mode renders repeated in fresh Node processes; identical stack/tray markup and whole-Dashboard hashes; state/effect/reducer hooks trap on invocation.
PASS: Equal Earth route 1296 samples / 0 land hits, bounds 540.14..821.86 × 84.29..843.36 above tray y=860; Portugal height 102.18px mainland (136.7px with 1486 Moroccan enclave); 18 deterministic timeline states; 5-panel right stack + 8-cell tray geometry; all 24 tray modes plus 3 Wage plane modes; 18 declared layouts ≤ 828px; no literal underscore text; shared 601-point Thyristor traces; Backlash static active preset; gear-only settings; no rendered interaction hints; 75 polities with 16 non-colliding labels.
```

### Plan Compile and Render Dry-Run

```text
$ PYTHONPATH=…/scriptCast-stage .venv-voice/bin/python -m scriptcast.tools.stage plan …/stage_ov.yaml -o …/ov/stage_plan.json
wrote Architecting_the_operation/video/yt02/stage/ov/stage_plan.json
sha256 before and after: d283f60db13e898c4835c16275cff7be29c5fe41f63dc38b3f720243bb32e35d (byte-identical; git diff empty)

$ PYTHONPATH=…/scriptCast-stage .venv-voice/bin/python -m scriptcast.tools.stage render …/ov/stage_plan.json -o /tmp/x.mp4 --dry-run
STAGE_EPISODE_DIR=…/stage npx --no-install remotion render src/stage/index.ts StageEpisode /private/tmp/x.mp4 --props=…/stage/ov/stage_plan.json --timeout=120000 --codec h264 --concurrency=8 '--browser-executable=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

### Site Build

Fresh `/tmp` output directory (`/tmp/yt02-minute-two-site.hDhYvj`):

```text
$ cd /Users/emmanuel/Documents/Theory/scriptCast-stage/video && STAGE_EPISODE_DIR=…/stage STAGE_PLAN=…/stage/ov/stage_plan.json npx vite build --config site/vite.config.ts --outDir /tmp/yt02-minute-two-site.hDhYvj
✓ built in 1.29s
assets/index-DsygasvR.js   1,863.20 kB │ gzip: 548.79 kB
```

Vite emitted its existing chunk-size warning. The built bundle contains the new strings
("Inverting the Definitional Hierarchy", "when included at all", "claimed to determine",
"unit: a system", "buried, rarely referenced", "epiphenomenal, downstream", "Typical
dictionary senses" ×2).

### Git State

`git status --porcelain` shows modifications only in the five `minutetwo/` stubs and new
files `minutetwo/EntryRail.tsx`, `tools/check_minute_two.{mjs,tsx}`, and this findings
file. The pre-existing dirty paths outside the task scope (`.claude/launch.json`,
`yt02/logs/…`, `tmp/`) were left untouched. No git state was changed.
