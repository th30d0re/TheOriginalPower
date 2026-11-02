# Minutes Seven to Twelve Findings

## Foundation

Model: Claude Sonnet 5.5 (High)  
Checkpoint: `627f451`

### What was requested

Build the shared foundation of `STORYBOARD_MIN7_12.md` §3 and §4: `EvidenceToken`, `SignalLane`, `QuestionHeader`, `TermTriad` and `GroupDirectionField` under `min7_12/shared/`; the registry additions `L`, `R`, `C`, `q`, `V` in `equations/terms.ts`; and `tools/check_min7_12_shared.{tsx,mjs}`. The packages E–H build against the props contracts below.

### Files written

- `min7_12/shared/audit.tsx`, `EvidenceToken.tsx`, `SignalLane.tsx`, `QuestionHeader.tsx`, `TermTriad.tsx`, `GroupDirectionField.tsx`, `index.ts`
- `equations/terms.ts`: five appended entries. No existing entry changed.
- `tools/check_min7_12_shared.tsx`, `tools/check_min7_12_shared.mjs`

### Conventions every component follows

- **Absolute frame boxes.** Each component takes `box` (or `boxes`) in 1920 × 1080 frame coordinates and positions itself absolutely. A caller moves a component by passing an interpolated box. Components never translate or scale their own geometry, so every declared `data-box` equals the drawn box.
- **Hidden means absent.** A component renders `null` at `progress` 0 (and a triad block renders nothing in state `hidden` or 0). Rendered text exists in the markup only from its beat, so "string absent before its beat" checks hold by construction.
- **Pure.** No hooks, no `useStageMs`, no randomness. All time dependence arrives as `progress` numbers that the scene derives from `useStageMs` and `useCue`.
- **Audit attributes.** Every text element carries `data-text`, `data-box` and `data-fit`. Every frame, mark and stroke carries `data-shape`, `data-role` and `data-box`. Strokes carry `data-points`, and a partially drawn stroke declares only its drawn part.
- **Audit ids.** Every component takes an `id` prefix. Give each instance on screen a distinct `id`: mark `data-layer` defaults to the shape id, and two marks of different layers must not overlap.
- **Tokens.** Colours resolve through `color()`. Labels are IBM Plex Mono 20 px or larger. Body-sized titles are IBM Plex Sans.

### Props contracts

All types are exported from `min7_12/shared`. `Box = {x, y, w, h}` and `Point = readonly [x, y]`.

#### `audit.tsx` helpers (exported for packages)

`textAttrs`, `shapeAttrs`, `lineAttrs`, `pathFrom`, `boxData`, `Label`, `Panel`, `clamp01`, `monoWidth(text, size, ls?)`, `wrapLineCount(text, width, size, advance, ls?)`, `partialPolyline(points, p)`, `arrowBarbs(end, ux, uy, length?, spread?)`, `MONO_ADVANCE` (0.6), `SANS_ADVANCE` (0.56).

- `Label({id, box, children, size?=20, weight?=500, ls?, lh?=1.25, sans?, align?, valign?='top'|'middle', ink?, opacity?, style?})` renders one audited text box.
- `Panel({id, box, opacity?, accent?, style?, children?})` renders one audited `frame`.
- `partialPolyline` returns the first fraction `p` of a polyline's length. Use it so a drawing stroke and its audit points agree.
- `wrapLineCount` is the audit's own greedy wrap. Choose box heights with it.

These mirror `min3_7/b/AuditVisuals.tsx`, which packages may not import.

#### `EvidenceToken`

```ts
EvidenceToken({label, kind, progress, emphasis, box, sourceSocket?, id?='evidence-token', size?=20})
```

- `label: string`. A token is a framed chip with one mono label. An empty string renders a bare chip with no text element.
- `kind: 'fact' | 'documented' | 'experience' | 'contrary' | 'surroundings'`.
  - `fact`: cream label, hairline border. Direct facts and generic evidence.
  - `documented`: gold border and gold side bar. Ledger rows.
  - `experience`: dashed muted border. Past-experience and trace tokens.
  - `contrary`: cream label, orange side bar, strong border. Contradictory facts.
  - `surroundings`: soft label, faint solid border. Accumulated-surroundings tokens.
- `progress: number` is the entrance. 0 renders nothing; the token fades in with progress.
- `emphasis: number` (0–1) sets brightness (overall opacity 0.62 to 1.0) and a same-colour glow.
- `box: Box`. The scene interpolates it to move a token along a path.
- `sourceSocket?: {lock: number; side?: 'left' | 'right'}` adds a 22 px socket inside the frame. `lock` 0 is an open ring, 1 a filled socket with a check.
- `size` is the label size, at least 20.
- Helper `evidenceTokenSize(label, {size?, socket?, kind?}) → {w, h}` returns the one-line box. Height is 46 at size 20. A longer label wraps inside a taller box; at `w` 480 with a socket, `WARINESS TOWARD THE U.S. MEDICAL SYSTEM` needs `h ≥ 72` for two lines.

#### `SignalLane`

```ts
SignalLane({box, label, progress, accent, direction, tokens, dashed?, bare?, id?='signal-lane'})
```

- `box: Box`. The lane panel. A horizontal lane with a label needs `h ≥ 88`, and a vertical lane needs `w ≥ 60`.
- `label: string` sits in a 28 px band at the top of the box. An empty string removes the band.
- `progress: number` (0–1). The panel and label fade in over progress 0–0.35. The rail draws over 0.2–1. The arrowhead appears from 0.9 of the rail. 0 renders nothing.
- `accent: string` is a dashboard colour token for the rail, arrowhead and default token colour.
- `direction: 'right' | 'left' | 'down' | 'up'`.
- `tokens: readonly {id, at, emphasis?, accent?, shape?: 'dot' | 'card'}[]`. `at` is the fraction along the rail (0 start, 1 arrowhead). Tokens are marks (18 px disc or 34 × 22 chip) with no text. Keep tokens at least 20 px apart.
- `dashed?: boolean` dashes the rail.
- `bare?: boolean` drops the panel frame.
- Helpers `laneGeometry(box, direction, hasLabel?) → {start, end}` and `lanePoint(box, direction, t, hasLabel?) → Point` give the rail endpoints and a point at fraction `t`, so gates, labels and moving tokens attach to the same numbers. Horizontal rail ends sit 24 px inside the box at the middle of the area under the label band.
- Text that a scene places inside the lane box needs its own band clear of the rail. The rail is a `line` shape and no text box may cross it.

#### `QuestionHeader`

```ts
QuestionHeader({box, text, progress, accentTerm?, accent?='color/marker/race', id?='question-header'})
```

- `text: string` is the spoken question, verbatim.
- `progress: number`. 0 renders nothing; the header fades in.
- `accentTerm?: string` is a case-insensitive substring of `text`, first occurrence, set in `accent` at weight 650.
- The header draws a gold bar at the left edge and sets the text in IBM Plex Sans, vertically centred, in a box that starts 26 px right of the bar.
- The size is the largest of 48, 44, 40, 36, 32, 28 px whose wrapped text fits `box`, using the audit's estimate. Helper `questionHeaderFit(text, box) → {size, lines, textBox}`.
- Box sizes from the storyboard hold the questions: 1620 × 135 for `Why does prejudice need its own label once bias is defined?` (one line at 48 px) and 1620 × 140 for the Fiske question (two lines).
- A package that shows a socket beside the question (turn 52) shrinks `box.w` and places the socket in the freed space.

#### `TermTriad`

```ts
TermTriad({boxes, terms, states, sources?, bracketLabel?, progress, bracketBox?, pulses?, socketProgress?=0, layout?='auto', bracketAccent?='color/fill/gold', id?='term-triad'})
```

- `boxes: readonly Box[]`, `terms: readonly TriadTerm[]`, `states: readonly TermState[]`. The component draws `min` of the three lengths. `TermState` comes from `min3_7/shared`: `'hidden' | 'dim' | 'active' | 'selected' | number`. A number is an entrance progress. `selected` draws a 2 px accent border.
- `TriadTerm = {kind: 'bias' | 'stereotype' | 'prejudice' | 'discrimination'; title: string; lines?: readonly {text, progress, tone?: 'accent' | 'soft'}[]}`.
  - `kind` fixes the established accent and glyph: Bias gold with the `PersonMark`, Stereotype cream with a 3 × 3 belief grid, Prejudice red with the heart, Discrimination orange with the action arrow.
  - `title` is IBM Plex Sans 30 px weight 600. It wraps when it exceeds the title width.
  - `lines` are 24 px mono rows under the title. Each has its own `progress` and renders nothing at 0. `tone: 'accent'` uses the block accent.
- `sources?: readonly ({text, progress} | null | undefined)[]` adds a 20 px mono source tag at the block's bottom edge. The tag wraps at the inner width and grows upward.
- `bracketLabel?: string` and `progress: number`. The gold bracket draws over `progress` (nothing at 0) and the label fades in over the last 45%.
- `bracketBox?: Box` places the bracket. Ticks start at `y` and the rule sits at `y + 26`. The label box starts at `y + 38`. The default is a box 55 px under the lowest block, inset 90 px from the outer block edges, 75 px high. Helper `triadBracketBox(boxes)`.
- `pulses?: readonly number[]` (0–1 per block) adds a glow for a spoken-word pulse.
- `socketProgress?: number` draws dashed empty sockets at each block box, fading as the block enters.
- `layout?: 'auto' | 'row' | 'stack'`. `row` puts the glyph beside the title. `stack` puts the glyph above the title. `auto` picks `row` from 420 px wide.
- Helper `triadBlockLayout(box, term, layout?, sourceText?) → {mode, glyph, title, lines, source}` returns the absolute interior boxes, so overlays (a docking token, a pulse ring) attach to the same numbers.
- Box sizing from the storyboard, all verified clean in the check: 480 × 180 rail blocks with a source tag (row); 500 × 470 taxonomy modules with two lines (row); 420 × 290 Fiske cards (row); 340 × 250 literature blocks (stack).
- Compact 340 px blocks hold about 14 title characters per line and 23 source characters per line. `DISCRIMINATION · FISKE 1998` and `BIAS · GREENWALD & BANAJI 1995` are verbatim storyboard strings. Pass them as the `title` (they wrap onto two or three lines in the 250 px block) to keep them verbatim in the markup, or split them into `title` and `sources` when verbatim adjacency does not matter.
- Package F's `FiskeHandoff` cards: `STEREOTYPING · INTERNAL THOUGHT` wraps to three title lines in a 420 px card. Both the one-title and the title-plus-`lines` form pass the audit.

#### `GroupDirectionField`

```ts
GroupDirectionField({box, marks, leftLabel, rightLabel, forwardProgress, reverseProgress, insideLabels?, boundaryProgress?=1, gutter?, id?='group-direction'})
```

- `box: Box` holds two rounded group boundaries and the arrow gutter between them. Boundary width is `(box.w − gutter) / 2` with `gutter` defaulting to `clamp(box.w × 0.2, 120, 220)`.
- `marks: readonly {id, side: 'left' | 'right', x, y, accent?: PersonGroup, emphasis?, scale?, progress?}[]`. `x` and `y` are 0–1 inside the boundary's mark region, which stays clear of the label band at the top and the caption band at the bottom. Marks are `PersonMark` figures.
- `leftLabel`, `rightLabel` are 22 px mono group names at each boundary's top. Left is gold and right is cream.
- `forwardProgress`: Group A → Group B arrow, upper. `reverseProgress`: Group B → Group A arrow, lower. Both use stroke weight 5 and gold, and their timing is independent.
- `insideLabels?: {left?, right?, progress?}` sets 20 px captions at the bottom of each boundary.
- `boundaryProgress` fades boundaries, labels and marks. The component renders nothing when it and both arrow progresses are 0.
- Helpers `groupFieldGeometry(box, gutter?) → {left, right, forward, reverse}` and `groupMarkPlacement(boundary, mark, hasInsideLabel)` expose the boundaries, arrow endpoints and mark centres.
- Both arrows stay inside `box`. A package contracting the field to the left at turn 60 passes a narrower `box`; the check covers a 700 px field.

### Registry additions

`equations/terms.ts` now carries five more entries. Each palette slot was free. Existing entries are unchanged, and the registry still holds one term per slot.

| term id | `show` | slot | hex | first pulse |
|---|---|---:|---|---|
| `L` | `L` | 3 | `#86efac` | `t38Inductance` |
| `R` | `R` | 6 | `#f9a8d4` | `t38Resistance` |
| `C` | `C` | 7 | `#a5f3fc` | `t38Capacitance` |
| `q` | `q(t)` | 8 | `#d9f99d` | `t38Absorbs` |
| `V` | `V(t)` | 10 | `#93c5fd` | `t38Reform` |

Notes for Package E:

- Render `q̈`, `q̇` and `q` with the token-level `math` override on a `q` token. `tokenWidth` counts each UTF-16 code unit as one glyph, so a combining mark adds 0.6 em of estimated width. Pass `width` on those tokens.
- `TermChip` shows the registry meaning at 18 px Plex Sans. The `q` meaning (`equality-surplus charge; also renders q̈, q̇, and q`) is long. Use a chip box at least 560 px wide, or set the chip label text locally.
- The check renders Eq. 2.11 tokens through `EquationTerms` for `L`, `R`, `C`, `V` and verifies each registry colour and its pulse peak at cue + 200 ms.

### Challenges encountered

1. **Components must declare audit boxes.** The min3_7 shared components flow inside parents and declare nothing, so they cannot join the audit. The new components take frame-coordinate boxes and own their `data-box` declarations. The mirrored audit helpers live in `min7_12/shared/audit.tsx` because packages may not import `min3_7/b`.
2. **Hidden state versus audit exemption.** The audit exempts opacity below 0.05, but a package check that tests "string absent before its beat" reads raw markup. Every component renders `null` at zero progress for that reason.
3. **Sans width.** The layout audit estimates IBM Plex Sans at 0.56 em, and uppercase Plex Sans is wider. `TermTriad` sizes title boxes with a 0.68 em uppercase advance so the rendered titles stay inside boxes the audit passes.
4. **Narrow term blocks.** The storyboard's literature blocks are 340 px wide, too narrow for the glyph-beside-title row. `TermTriad` switches to the `stack` layout below 420 px.
5. **Source tag wrapping.** A one-line source box overflowed on the longest literature strings. The source box now grows with the wrapped line count.
6. **Key warning.** The first check run reported React key warnings from the check's own `frame` helper, which passed an unkeyed child array. The helper now spreads its children.
7. **Rendering.** No Chromium is available in this stage. Glyph advances are estimated from the audit's rules, so the orchestrator's render is the first pixel check.

### Next ideas

1. Add a `TokenPath` helper that interpolates an `EvidenceToken` box along a polyline, since four scenes move tokens between lanes.
2. Add a `lane.gate` option on `SignalLane` for the update gate and installed-prior gates, with a closed and open state.
3. Let `GroupDirectionField` take a `legalLine` mode so `InstalledRouting` can reuse it for the legal colour line.
4. Add a `QuestionHeader` option that reveals the question word by word on the spoken timing, if the orchestrator wants the header to follow the narration.
5. Add a snapshot of `triadBlockLayout` for each storyboard box so a later edit to padding fails loudly.
6. Extend `TermChip` with a `meaning` override so the long `q` meaning stays within a 400 px chip.

### Checks

- Episode TypeScript: `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage` exits 0 with no diagnostics.
- `check_min7_12_shared` tail:
  - `PASS: 25 min7_12-shared states rendered in two fresh processes; all markup hashes match.`
  - `PASS: audit self-test (10 rules); 25 min7_12 shared-component states; layout audit of 171 declared boxes (safe area, notch zones, text fit, collisions); hook, underscore and interaction-hint policies; hidden states render nothing; five registry additions (L, R, C, q, V) keep their palette colours and peak at cue + 200 ms.`
- `check_first_minute` tail: `PASS: 43 cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified; …`
- `check_roadmap_boot` tail: `PASS: RoadmapBoot renders 17 deterministic frames; 13 labels land on their cues and are absent before; …no literal underscores; no interaction hints.`
- `check_minute_two` tail: `PASS: 44 cue-derived frames; exact definition spacing …; Figure 2.3 layer widths 598 / 483 / 368 px in the ratio 5.2 : 4.2 : 3.2.`
- `check_dashboard` tail: `PASS: Equal Earth route 1296 samples / 0 land hits …; all 24 tray modes plus 3 Wage plane modes; …no rendered interaction hints; 75 polities with 16 non-colliding labels.`
- `check_min3_7_shared` tail: `PASS: 25 representative shared-component states; eleven component contracts, hook policy, underscore policy, Gaussian curves, … Posterior modes: 0.280460 / 0.499174 / 0.718096.`
- `check_min3_7_a` tail: `PASS: audit self-test (10 rules); 47 Package A cue-derived frames; 1282 audited boxes; …`
- `check_min3_7_b` tail: `PASS: audit self-test (10 rules); 43 Package B cue-derived frames; 1146 audited boxes; …`
- `check_min3_7_c` tail: `PASS: audit self-test (10 rules); 195 Package C frames (cues + 500 ms grid); layout audit of 6799 declared boxes …`
- `check_min3_7_d` tail: `PASS: audit self-test (10 rules); 211 Package D frames (cues + 500 ms grid); layout audit of 5306 declared boxes over 211 frames …; monotonic posterior sweep 0.2800 → 0.6755 (prior 0.72).`
- `check_equations` tail: `PASS: 14 equation frames; 111 registered coloured terms; 11 pulse cues peak at cue + 200 ms and rest after 600 ms; Eq. 2.5 and Eq. 2.8a are verbatim with MathText subscripts.`
- `tools/check_antithesis.py` on every written `.ts`, `.tsx`, `.mjs` file: `check-antithesis: no banned constructions found.`

### Unverified remainder

- No render was made, so glyph advances, the belief-grid and heart glyph proportions, and the stack layout's look at 340 px are checked by the audit's estimate only.
- The check exercises each component at representative storyboard boxes. Package checks cover cue timing, because the foundation has no plan segment of its own.
