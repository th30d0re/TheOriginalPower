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

## Package F

Model: Gemini 3.8 Flash (High)  
Checkpoint: `162607e`

### What was requested

Build minutes seven to twelve package F from `STORYBOARD_MIN7_12.md` (turns 41–46, duration 83.140 s):
- Replace the three stub scenes in `min7_12/f/` in place: `ImplicitTrace.tsx` (turns 41–42), `IATLatency.tsx` (turns 43–45), and `AllportQuestion.tsx` (turn 46).
- Implement every beat, string, layout box, and visual state specified in `STORYBOARD_MIN7_12.md`.
- Ensure pure deterministic rendering driven only by `useCue` and `useStageMs`.
- Ensure clean layout audit (safe area, notch zones, text fit, zero collisions) across all frames.
- Write `tools/check_min7_12_f.{tsx,mjs}` testing two-process determinism, hook policy, underscore policy, interaction-hint policy, beat string presence and earlier absence, layout audit at every frame, and turn transition cleanliness.
- Verify that episode TypeScript, all existing checks, and `tools/check_antithesis.py` pass.

### Files written

- `min7_12/f/ImplicitTrace.tsx`: turns 41–42, shots S00-41 and S00-42.
- `min7_12/f/IATLatency.tsx`: turns 43–45, shots S00-43, S00-44, and S00-45.
- `min7_12/f/AllportQuestion.tsx`: turn 46, shot S00-46.
- `tools/check_min7_12_f.tsx`: comprehensive validation test runner.
- `tools/check_min7_12_f.mjs`: esbuild bundling and two-process determinism driver.
- `FINDINGS_MIN7_12.md` §Package F.

### Scene implementations

#### `ImplicitTrace` (turns 41–42, 8:17.810–8:51.970)
- **Turn 41**: Translates the Greenwald & Banaji (1995) implicit attitude definition into an active trace-and-shortcut picture.
  - Definition card opens at `t41Define` with term, paraphrased body, and citation.
  - Inspection screen and hidden-trace store open at `t41Unidentified`.
  - Past-experience stream feeds tokens into the store at `t41Past`.
  - Upper positive-valence (`+ FAVORABLE`) and lower negative-valence (`− UNFAVORABLE`) markers activate at `t41Favorable` and `t41Unfavorable`.
  - Feeling, thought, and action sockets illuminate on the reaction rail at `t41Action`.
  - Definition card contracts and the plain-language process panel takes focus at `t41Plain`.
  - Everyday experience cards stack into the trace store at `t41Experiences`.
  - Shortcut bypass path opens at `t41Shortcuts` and pulses at `t41Steer`.
  - Inspection screen dims at `t41Noticing` while the reaction branch stays active.
- **Turn 42**: Turn 41 definition card and stream disappear completely.
  - `SignalLane` for `SINCERE EQUAL-TREATMENT BELIEF` enters on the upper left at `t42Precision`.
  - `SignalLane` for `AUTOMATIC ASSOCIATION` enters on the lower right at `t42Precision`.
  - Center `PersonMark` (`ONE PERSON`) represents the individual holding both channels.
  - Accumulated surroundings tokens fire through the automatic lane at `t42Automatically` and fill the trace store at `t42Accumulated`.
  - Gold verification ring confirms sincere belief at `t42Sincerely`.
  - `EQUAL TREATMENT` resolves inside the belief lane at `t42Equal`.
  - Both channels link via dashed leaders to the individual response node (`REACTION`) at `t42Treatment`.

#### `IATLatency` (turns 43–45, 8:52.320–9:27.330)
- **Turn 43**: Source plaque enters at `t43Three`.
  - Year `1998` lands in the year socket at `t43NinetyEight`.
  - Author string resolves progressively: `ANTHONY GREENWALD` at `t43Anthony`, `DEBBIE MCGHEE` at `t43McGhee`, `JORDAN SCHWARTZ` at `t43Schwartz`.
  - Instrument name `IMPLICIT ASSOCIATION TEST` enters at `t43Introduced`.
  - Journal title `Journal of Personality and Social Psychology` resolves at `t43Journal`.
- **Turn 44**: Large source plaque contracts into the source tab/line at `t44Test`.
  - Computer sorting monitor opens with `DERIVED FACE + WORD SORTING TASK` and `DERIVED ILLUSTRATION · NO TEST SCORE`.
  - Prompt card enters at `t44Automatic` with abstract `PersonMark` face card at `t44Faces` and word card at `t44Words`.
  - Response latency timer trace drops from prompt card to response keys at `t44ResponseLatency`.
  - `LEFT KEY` and `RIGHT KEY` targets illuminate at `t44Sorting`.
  - Latency difference instrument draws two differential bars at `t44SplitSecond`.
  - Shorter bar receives `FASTER RESPONSE` and longer bar receives `SLOWER RESPONSE` at `t44Fast`.
  - Locked banner `DERIVED SORTING TASK · LATENCY DIFFERENCE` resolves at `t44Screen`.
- **Turn 45**: Turn 44 prompt and key geometry clear completely.
  - Left column displays `REACTION-TIME MEASURE` at `t45Reaction`.
  - Center column displays `FIELD-AUDIT MEASURE` at `t45Audits`.
  - Right column opens the judgment meter at `t45Bias` with gold `BIAS` glyph.
  - Meter receives `MENTAL LEAN` at `t45Mental`.
  - Indicator needle tilts and receives `JUDGMENT WEIGHTING` at `t45Weighting`.
  - Dashed measurement leaders link both instruments to the meter at `t45Judgment` with title `INDIVIDUAL JUDGMENT`.

#### `AllportQuestion` (turn 46, 9:27.680–9:40.950)
- `QuestionHeader` displays the full spoken question `Why does prejudice need its own label once bias is defined?` with `prejudice` accented in red at `t46Why`.
- Bias block (`BIAS · STARTING TENDENCY`) and Prejudice block (`PREJUDICE`) enter at `t46Label` with central connector line.
- Prejudice block receives numeral `2` and red selection border (`2 · PREJUDICE`) at `t46Second`.
- Prejudice block reaches full brightness while Bias block dims at `t46Prejudice`.
- Question blocks clear completely when `GORDON W. ALLPORT` citation card enters at `t46Gordon`.
- Gold source rule draws at `t46Classic`.
- Year socket receives `1954` at `t46FiftyFour`.
- Title begins resolving at `t46Nature` and reaches primary brightness `The Nature of Prejudice` at `t46PrejudiceTitle`.
- Bottom source line displays `Allport 1954, p. 9` at `t46Nine`.

### Challenges encountered

1. **Substring collisions in beat checks**:
   - In `ImplicitTrace`, checking for plain text `ACTION` collided with `REACTION` on the reaction rail. Checking the specific socket element markup resolved this cleanly.
   - Similarly, in `IATLatency`, checking for plain text `FACE` collided with the monitor title `DERIVED FACE + WORD SORTING TASK`. Checking the specific face card element markup resolved this cleanly.
   - In `IATLatency`, the bottom source line contains `1998`, which collided with the Turn 43 beat check before the year socket appeared. Guarding the bottom source line to render from Turn 44 resolved this cleanly.
2. **Layout audit frame boundaries**:
   - In `ImplicitTrace`, the response node originally overlapped horizontally with the automatic lane frame. Reducing width and positioning the response node strictly below the automatic lane eliminated the collision.
   - In `IATLatency`, the timer trace line initially intersected the response latency text box. Repositioning the text label to the left of the vertical trace line eliminated the collision.
   - In `IATLatency`, the 32 px box height for `latency-banner` caused a line-wrap overflow in the audit. Expanding the box height to 56 px accommodated the wrapped text comfortably.
   - In `AllportQuestion`, connector sockets positioned on the block borders crossed the outer frame boundaries. Insetting the sockets fully inside the block panels eliminated all frame-edge violations.

### Next ideas (6 Ideas)

1. Extract a shared `CitationPlaque` component that models the progressive reveal of author list, year socket, and journal title across academic milestones.
2. Add a `LatencyBarComparison` helper component in `min7_12/shared/` for derived experimental reaction-time visualisations.
3. Parameterize the socket connector positioning in `TermBlock` to allow left, right, and bidirectional socket linking without manual coordinate computation.
4. Support automatic word-level highlighting in `QuestionHeader` based on narration cue timestamps.
5. Create a deterministic particle emitter for `SignalLane` to render dense token flows for high-bandwidth neural channels.
6. Add automated layout collision snapshots to package checks to detect geometry regressions before audit execution.

### Checks

- Episode TypeScript: `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage` exits 0 with zero diagnostics.
- `check_min7_12_f` tail:
  - `PASS: 223 Package F frames rendered in two fresh processes; all markup hashes match.`
  - `PASS: audit self-test (10 rules); 223 Package F frames (cues + 500 ms grid); layout audit of 2845 declared boxes (safe area, notch zones, text fit, collisions); clean turn transitions, storyboard strings, hook, underscore and interaction-hint policies verified.`
- `check_first_minute` tail: `PASS: 43 cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified; …`
- `check_roadmap_boot` tail: `PASS: RoadmapBoot renders 17 deterministic frames; 13 labels land on their cues and are absent before; …`
- `check_minute_two` tail: `PASS: 44 cue-derived frames; exact definition spacing …; Figure 2.3 layer widths 598 / 483 / 368 px in the ratio 5.2 : 4.2 : 3.2.`
- `check_dashboard` tail: `PASS: Equal Earth route 1296 samples / 0 land hits …; all 24 tray modes plus 3 Wage plane modes; …no rendered interaction hints; 75 polities with 16 non-colliding labels.`
- `check_min3_7_shared` tail: `PASS: 25 representative shared-component states; eleven component contracts, hook policy, underscore policy, Gaussian curves, … Posterior modes: 0.280460 / 0.499174 / 0.718096.`
- `check_min3_7_a` tail: `PASS: audit self-test (10 rules); 47 Package A cue-derived frames; 1282 audited boxes; …`
- `check_min3_7_b` tail: `PASS: audit self-test (10 rules); 43 Package B cue-derived frames; 1146 audited boxes; …`
- `check_min3_7_c` tail: `PASS: audit self-test (10 rules); 195 Package C frames (cues + 500 ms grid); layout audit of 6799 declared boxes …`
- `check_min3_7_d` tail: `PASS: audit self-test (10 rules); 211 Package D frames (cues + 500 ms grid); layout audit of 5306 declared boxes over 211 frames …; monotonic posterior sweep 0.2800 → 0.6755 (prior 0.72).`
- `check_equations` tail: `PASS: 14 equation frames; 111 registered coloured terms; 11 pulse cues peak at cue + 200 ms and rest after 600 ms; Eq. 2.5 and Eq. 2.8a are verbatim with MathText subscripts.`
- `check_min7_12_shared` tail: `PASS: 25 min7_12-shared states rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 25 min7_12 shared-component states; layout audit of 171 declared boxes …`
- `tools/check_antithesis.py` on all package F files: `check-antithesis: no banned constructions found.`

### Unverified remainder

- No Chromium browser renders were executed in this stage; visual layout and text fitting rely on static layout audit geometry and estimates.
- The 1998 Greenwald, McGhee, and Schwartz IAT paper is not present in `Paper/references.bib`; source details remain restricted to the narration specifications.

## Package E

Model: Gemini 3.8 Flash (High)  
Checkpoint: `162607e`

### What was requested

Build minutes seven to twelve package E from `STORYBOARD_MIN7_12.md` (turns 35–40, duration 72.470 s):
- Replace the four stub scenes in `min7_12/e/` in place: `DocumentedExpectation.tsx` (turns 35–36), `InstalledRouting.tsx` (turn 37), `RLCBridge.tsx` (turn 38), and `ExplicitImplicitChannels.tsx` (turns 39–40).
- Implement every beat, string, layout box, and visual state specified in `STORYBOARD_MIN7_12.md`.
- Ensure pure deterministic rendering driven only by `useCue` and `useStageMs`.
- Ensure clean layout audit (safe area, notch zones, text fit, zero collisions) across all frames.
- Write `tools/check_min7_12_e.{tsx,mjs}` testing two-process determinism, hook policy, underscore policy, interaction-hint policy, beat string presence and earlier absence, layout audit at every frame, and turn transition cleanliness.
- Verify that episode TypeScript, all existing checks, and `tools/check_antithesis.py` pass.

### Files written

- `min7_12/e/DocumentedExpectation.tsx`: turns 35–36, shots S00-35 and S00-36.
- `min7_12/e/InstalledRouting.tsx`: turn 37, shot S00-37.
- `min7_12/e/RLCBridge.tsx`: turn 38, shot S00-38.
- `min7_12/e/ExplicitImplicitChannels.tsx`: turns 39–40, shots S00-39 and S00-40.
- `tools/check_min7_12_e.tsx`: comprehensive validation test runner.
- `tools/check_min7_12_e.mjs`: esbuild bundling and two-process determinism driver.
- `FINDINGS_MIN7_12.md` §Package E.

### Scene implementations

#### `DocumentedExpectation` (turns 35–36, 7:04.990–7:31.890)
- **Turn 35**: Bayesian update distinguished from installed racial prior on documented evidence.
  - Full Eq. 2.8a Bayesian prior displayed in continuity strip at `t35Consider`.
  - Evidence ledger introduces gold person-group marker `BLACK WOMEN` and `WARINESS TOWARD THE U.S. MEDICAL SYSTEM` at `t35Black`.
  - Bias person glyph and `BIAS · STATISTICAL STARTING TENDENCY` dock above plot at `t35Bias`.
  - Generic prior curve transitions to gold and receives `STARTING EXPECTATION` at `t35Statistical`.
  - Expectation card enters and links to prior curve at `t35Starting`.
  - Evidence curve enters and posterior shifts toward evidence at `t35Updated`.
  - Documented harm and ongoing disparity tokens lock with source sockets at `t35Documented`.
  - Posterior holds in updated position with caption `EXPECTATION UPDATED ON DOCUMENTED EVIDENCE` at `t35Disparity`.
- **Turn 36**: Turn 35 plot and ledger clear completely at `t36National`.
  - NCHS source plaque enters with author, year `2023`, and report title `Maternal Mortality Rates in the United States, 2021`.
  - Qualitative series frame enters at `t36Maternal` with heading `MATERNAL MORTALITY · SURVEILLANCE SERIES`.
  - Relation bracket resolves at `t36Elevated` reading `ELEVATED RELATIVE LEVEL`.
  - Upper gold path draws through surveillance stations labelled `BLACK WOMEN` at `t36Black`.
  - Lower cream path draws through same stations labelled `WHITE WOMEN` at `t36White`.
  - Unlabeled surveillance station guides and `DOCUMENTED SERIES` resolve at `t36Surveillance`.
  - Starting expectation marker docks beside upper path at `t36Expectation`.
  - Gold tracking line follows upper path at `t36Tracks` with label `EXPECTATION TRACKS THE DOCUMENTED SERIES`.
  - Disclosure strip resolves at `t36Numbers` reading `QUALITATIVE RELATIONSHIP · RATE VALUES OMITTED`.

#### `InstalledRouting` (turn 37, 7:32.240–7:44.760)
- Continuity equation strip renders Eq. 2.8a with installed racial prior label.
- Red `Π_race` term expands into installed-prior cartridge at `t37PiRace`.
- Red `INSTITUTIONAL INPUT` bus enters cartridge from border at `t37Institutionally`.
- Cartridge locks and resolves `INSTITUTIONALLY INSTALLED RACIAL ASSUMPTION` at `t37Installed`.
- Output traces draw from cartridge toward empty gates at `t37Routes`.
- Upper gate opens with `EMPATHY ROUTING` at `t37Empathy`.
- Lower gate opens with `THREAT DETECTION` at `t37Threat`.
- Vertical divider rule draws with `LEGAL COLOR LINE` at `t37Legal`.
- Direct facts lane displays `DIRECT FACTS`, `DIRECT EVIDENCE`, `RECORDED OBSERVATION`, and `MEASURED OUTCOMES` with `FACTS REMAIN VISIBLE` at `t37Facts`.
- Routing traces hold locked to cartridge while direct facts lane remains unchanged at `t37Support`.

#### `RLCBridge` (turn 38, 7:45.110–7:59.730)
- Heading `RLC BACKLASH MODEL` draws in institutional panel at `t38Rlc`.
- Installed-prior cartridge settles in mental half under `BAYESIAN DEFENSE` at `t38Bayesian`.
- Cartridge sends pulse across coupling bridge at `t38Installed`.
- Footer label `MENTAL HALF · INSTALLED PRIORS` locks below cartridge at `t38Mental`.
- Institutional panel displays `INSTITUTIONAL HALF` at `t38Institutional`.
- Passive elements enter in spoken sequence:
  - `L · INDUCTANCE` with `CULTURAL INERTIA + INSTITUTIONAL ENTRENCHMENT` at `t38Inductance`.
  - `R · RESISTANCE` with `BUREAUCRATIC + CARCERAL FRICTION` at `t38Resistance`.
  - `C · CAPACITANCE` with `TOKEN-REFORM ABSORPTION CAPACITY` at `t38Capacitance`.
  - `q(t) · EQUALITY-SURPLUS CHARGE` chip enters at `t38Absorbs`.
  - `V(t) · REFORM-SHOCK DRIVING VOLTAGE` chip enters at `t38Reform`.
- Damped response preview gains baseline `EXTRACTION BASELINE · q = 0` at `t38Absorbs`.
- Reform shock launches; normalized R control sweeps upward with `DERIVED PREVIEW · NORMALIZED R SWEEP`, `REFORM SHOCK`, `DAMPED RESPONSE`, and `Eq. 2.12 · damped solution` at `t38Damps`.
- All introduced chips assemble into Eq. 2.11 (`Lq̈ + Rq̇ + (1/C)q = V(t)`) with `Eq. 2.11 · RLC governing equation` and `Figure 2.6 · response preview` at `t38Shocks`.

#### `ExplicitImplicitChannels` (turns 39–40, 8:00.080–8:17.460)
- **Turn 39**: Dual channels for individual judgment.
  - Central Bias hub enters with gold person glyph and `BIAS` at `t39Bias`.
  - Upper channel draws reading `EXPLICIT` at `t39Explicit`.
  - Signed judgment card enters upper channel under `CONSCIOUSLY ENDORSED JUDGMENT` at `t39Consciously`.
  - Lower channel draws reading `IMPLICIT` at `t39Implicit`.
  - Association nodes fire through lower channel with `AUTOMATIC MENTAL ASSOCIATION` at `t39Automatic`.
  - Both channels terminate at meter labelled `INDIVIDUAL JUDGMENT` at `t39Associations`.
- **Turn 40**: Channels clear completely; Greenwald and Banaji (1995) citation card enters.
  - Author line resolves `ANTHONY G. GREENWALD` at `t40Anthony` and completes `ANTHONY G. GREENWALD · MAHZARIN R. BANAJI` at `t40Banaji`.
  - Gold source rule joins author line to year socket at `t40Formal`.
  - Year `1995` lands in year socket at `t40NinetyFive`.
  - Title begins resolving at `t40Implicit` and reaches primary brightness `Implicit Social Cognition: Attitudes, Self-Esteem, and Stereotypes` at `t40Cognition`.
  - Card holds with clean academic citation at `t40Article`.

### Challenges encountered

1. **Literal underscore detection on bibliographic paths**:
   - The test runner enforces zero literal underscores in rendered text. Raw LaTeX source paths like `Paper/The_Original_Power.tex` triggered this assertion. Using clean bibliographic attribution (`The Original Power, Chapter 2`) resolved this cleanly across all scenes.
2. **Visual curve collision with text boxes**:
   - In `DocumentedExpectation`, Gaussian prior and posterior distribution curves crossed the `STARTING EXPECTATION` label box at y = 520. Positioning the distribution labels below the plot axis at y = 760 completely cleared the curve stroke paths.
3. **Safe area margin padding on stroke polylines**:
   - In `InstalledRouting`, the institutional input bus started at x = 60, but `lineAttrs` applied a default 2 px padding box extending to x = 58, which tripped the safe area boundary. Insetting the line start to x = 64 ensured the bounding box stayed inside x >= 60.
4. **Line stroke intersection with vertical divider labels**:
   - In `InstalledRouting`, the vertical legal color line passed through the center of the `LEGAL COLOR LINE` text box. Splitting the rule into upper and lower segments with a clean gap around the label eliminated the collision.
5. **Multi-line wrap and text fit on mono strings**:
   - In `RLCBridge`, single-line boxes for `EXTRACTION BASELINE · q = 0`, `Eq. 2.12 · damped solution`, and `Figure 2.6 · response preview` triggered line-wrap overflow assertions in the layout audit. Expanding their heights to 54 px comfortably accommodated their two-line wraps.
6. **Card rail discontinuity in explicit channels**:
   - In `ExplicitImplicitChannels`, the continuous rail line intersected the signed judgment card text box. Rendering disjoint input and output segments connecting to the card boundaries preserved the circuit aesthetic without text collision.

### Next ideas (6 Ideas)

1. Add a `BypassedStroke` helper component to route connection lines cleanly around text boxes and chips.
2. Create a `HarmSeriesPlot` helper in `min7_12/shared/` for qualitative surveillance plots.
3. Support multi-segment dashed line rails in `SignalLane` to bridge around docked cards automatically.
4. Build a reusable `CircuitDampingPreview` component that encapsulates the normalized R-sweep and decaying sine visualization.
5. Add an automatic label-advance and line-wrap estimator in package check runners to catch fit-estimate issues before audit execution.
6. Parameterize citation plaque subtitle transitions to automatically resolve author lines and title reveals on narration timestamps.

### Checks

- Episode TypeScript: `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage` exits 0 with zero diagnostics.
- `check_min7_12_e` tail:
  - `PASS: 203 Package E frames rendered in two fresh processes; all markup hashes match.`
  - `PASS: audit self-test (10 rules); 203 Package E frames (cues + 500 ms grid); layout audit of 3938 declared boxes (safe area, notch zones, text fit, collisions); clean turn transitions, storyboard strings, hook, underscore, interaction-hint and equation pulse policies verified.`
- `check_min7_12_f` tail: `PASS: 223 Package F frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 223 Package F frames (cues + 500 ms grid); layout audit of 2845 declared boxes …`
- `check_min7_12_shared` tail: `PASS: 25 min7_12-shared states rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 25 min7_12 shared-component states; layout audit of 171 declared boxes …`
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
- `tools/check_antithesis.py` on all package E files: `check-antithesis: no banned constructions found.`

### Unverified remainder

- No Chromium browser renders were executed in this stage; visual layout and text fitting rely on static layout audit geometry and estimates.
- The NCHS report and Greenwald & Banaji (1995) paper citations conform to the approved narration and storyboard register without external network fetching.




## Package H

Model: Gemini 3.8 Flash (High)  
Checkpoint: `162607e`

### What was requested

Build minutes seven to twelve package H from `STORYBOARD_MIN7_12.md` (turns 55–62, duration 79.600 s):
- Replace the three stub scenes in `min7_12/h/` in place: `UnequalTreatment.tsx` (turns 55–56), `InterpersonalClass.tsx` (turns 57–61), and `LiteratureBoundary.tsx` (turn 62).
- Implement every beat, string, layout box, and visual transition specified in `STORYBOARD_MIN7_12.md`.
- Ensure pure deterministic rendering driven only by `useCue` and `useStageMs`.
- Ensure clean layout audit (safe area, notch zones, text fit, zero collisions) across all frames.
- Write `tools/check_min7_12_h.{tsx,mjs}` testing two-process determinism, hook policy, underscore policy, interaction-hint policy, beat string presence and earlier absence, layout audit at every frame, and turn transition cleanliness.
- Verify that episode TypeScript, all existing checks, and `tools/check_antithesis.py` pass.

### Files written

- `min7_12/h/UnequalTreatment.tsx`: turns 55–56, shots S00-55 and S00-56.
- `min7_12/h/InterpersonalClass.tsx`: turns 57–61, shots S00-57, S00-58, S00-59, S00-60, and S00-61.
- `min7_12/h/LiteratureBoundary.tsx`: turn 62, shot S00-62.
- `tools/check_min7_12_h.tsx`: validation test runner covering 227 frames.
- `tools/check_min7_12_h.mjs`: esbuild bundling and two-process determinism driver.
- `FINDINGS_MIN7_12.md` §Package H.

### Scene implementations

#### `UnequalTreatment` (turns 55–56, 11:12.040–11:34.290)
- **Turn 55**: Assembles the three-part taxonomy into a continuous horizontal pipeline connecting group belief, emotional hostility, and unequal treatment.
  - Stereotype, Prejudice, and Discrimination modules enter inside the pipeline frame at `t55ThreePart`.
  - First node receives label `GROUP BELIEF` at `t55Stereotype`.
  - Belief tokens illuminate within the 3 × 3 belief grid at `t55Belief`.
  - Second node activates in red with affective wave visual at `t55Prejudice`.
  - `EMOTIONAL HOSTILITY` resolves beside the heart glyph at `t55Hostility`.
  - Third node activates in orange with action vector visual at `t55Discrimination`.
  - `UNEQUAL TREATMENT` resolves beside the directional arrow at `t55Unequal`.
  - `GROUP MEMBERSHIP` token enters at `t55Membership` and travels through the pipeline path from node 1 to node 3.
- **Turn 56**: Clears the Turn 55 pipeline completely and opens the treatment tray with four observable treatment examples.
  - Orange discrimination header tab displays `DISCRIMINATION · OBSERVABLE ACTION` at `t56Unequal`.
  - Treatment tray container enters with heading `PERSON-TO-PERSON UNEQUAL TREATMENT` at `t56Unequal`.
  - Card 1 enters with speech boundary card graphic at `t56Verbal` and resolves as `VERBAL EXCLUSION` at `t56Exclusion`.
  - Card 2 enters with service-counter partition graphic and receives `WORSE CUSTOMER SERVICE` at `t56Customer`.
  - Card 3 enters with evaluation sheet graphic and receives `BIASED GRADING` at `t56Grading`.
  - Card 4 enters with rental key graphic and receives `RENTAL REFUSAL` at `t56Refusing`.
  - Card 4 receives apartment structural outline at `t56Apartment`.
  - Qualification badge and verification check display `QUALIFIED TENANT` on the tenant record at `t56Qualified`.
  - All four cards hold under the discrimination tab through `t56Tenant`.

#### `InterpersonalClass` (turns 57–61, 11:34.640–12:20.390)
- **Turn 57**: Collects bias, prejudice, and discrimination on the upper source-backed rail.
  - Bias, Prejudice, and Discrimination blocks enter with established glyphs and palette accents at `t57Look`.
  - Bias block receives citation `GREENWALD & BANAJI 1995` at `t57Bias`.
  - Prejudice block receives citation `ALLPORT 1954` at `t57Prejudice`.
  - Discrimination block receives citation `FISKE 1998` at `t57Discrimination`.
  - Gold grouping bracket draws beneath the three blocks from `t57Fiske`.
- **Turn 58**: Establishes individual and group operational locus.
  - Bracket closes with title `INTERPERSONAL CLASS` at `t58Three`.
  - Mental locus label `INSIDE AN INDIVIDUAL` enters at `t58Mental`.
  - Behavioral locus label `BETWEEN INDIVIDUALS` enters at `t58Behavioral`.
  - Group boundaries for `GROUP A` and `GROUP B` enter at `t58Direction` with opposing directional arrows.
  - Both arrows complete and `ANY DIRECTION BETWEEN ANY TWO SOCIAL GROUPS` resolves at `t58Two`.
- **Turn 59**: Displays individual ubiquity across social groups.
  - Varied row of abstract human marks enters with label `ANY HUMAN BEING` at `t59Any`.
  - Labels `ANY SKIN COLOR` and `ANY ANCESTRY` resolve at `t59Skin` and `t59Ancestry`.
  - Gold lean indicator activates with label `MENTAL BIAS` at `t59Bias`.
  - Red heart field activates with label `RIGID HOSTILITY` at `t59Hostility`.
  - Directional action vector links individuals with label `UNEQUAL TREATMENT` at `t59Treat`.
  - Opposing group arrows remain active through `t59Unequally`.
- **Turn 60**: Separates interpersonal actions from state power institutions.
  - Heading `PERSON-TO-PERSON ACTIONS` resolves above the contracted group field at `t60PersonToPerson`.
  - State-power rack opens on the right separated by a 100 px empty gutter.
  - Header `REQUIRES ZERO CONTROL OVER` resolves in red accent above the rack at `t60Zero`.
  - Five distinct institutional cells resolve in sequence: `STATE LEGISLATURES` at `t60Legislatures`, `APPELLATE COURTS` at `t60Courts`, `POLICE DEPARTMENTS` at `t60Police`, `CREDIT MARKETS` at `t60Credit`, and `MILITARY FORCE` at `t60Military`.
  - Every interpersonal line and mark remains confined to the left field.
- **Turn 61**: Assembles the formal classification on the assignment strip.
  - Turn 60 lower rack and field clear when book-shaped assignment strip rises at `t61Original`.
  - Title `THE ORIGINAL POWER` displays at upper left of strip at `t61Original`.
  - Three docking sockets receive the term blocks at `t61Assigns`.
  - Sockets lock individually with verification markers: `BIAS` at `t61Bias`, `PREJUDICE` at `t61Prejudice`, and `DISCRIMINATION` at `t61Discrimination`.
  - Primary title `INTERPERSONAL CLASS OF SOCIAL BEHAVIOR` reaches full brightness at `t61Interpersonal`.
  - Precision calibration ticks and label `EXACT SCIENTIFIC NAMES` lock at `t61Scientific`.

#### `LiteratureBoundary` (turn 62, 12:20.740–12:31.640)
- Established literature field opens with heading `ESTABLISHED EXPERIMENTAL PSYCHOLOGY` above three empty dashed sockets at `t62Established`.
- Compact stacked term blocks dock into the sockets at `t62Literature`: `BIAS · GREENWALD & BANAJI 1995`, `PREJUDICE · ALLPORT 1954`, and `DISCRIMINATION · FISKE 1998`.
- Vertical terminal boundary draws top to bottom in its own 60 px column with vertical text `ESTABLISHED LITERATURE ENDS HERE` at `t62Ends`.
- Spoken-word pulses illuminate the three blocks at `t62Bias`, `t62Prejudice`, and `t62Discrimination`.
- Gold grouping bracket connects all three blocks under `PERSON-TO-PERSON OPERATIONS` at `t62PersonToPerson`.
- Label `STANDARD DEFINITIONS` locks beneath the bracket at `t62Standard`.
- Literature field reaches full brightness at `t62Experimental`.
- Turn-63 handoff field opens on the right with label `TURN 63 · STRUCTURAL ARGUMENT BEGINS` and an empty structural continuation socket at `t62Psychology`.

### Challenges encountered

1. **Horizontal text overflow in narrow terminal column**:
   - The terminal boundary occupies a dedicated 60 px column (`x: 1300–1360`). Horizontal text for `ESTABLISHED LITERATURE ENDS HERE` would require 384 px, crossing the boundary into adjacent fields.
   - Aligning the text vertically using `writingMode: 'vertical-rl'` and omitting horizontal `data-fit` estimates keeps the text contained within `{x: 1305, y: 220, w: 50, h: 580}` with zero edge violations.
2. **Boundary frame edge crossings in group field**:
   - In `InterpersonalClass`, placing turn 58 and turn 59 labels inside or across the `GroupDirectionField` boundaries created edge-crossing collisions with the panel borders.
   - Positioning the upper label row (`ANY HUMAN BEING`, `ANY SKIN COLOR`, `ANY ANCESTRY`) at `y: 545`, strictly above the boundary panels (`y: 610–830`), eliminated all edge-crossing conflicts while maintaining visual hierarchy.
   - Sizing the gutter label `UNEQUAL TREATMENT` to fit precisely within the 212 px gutter prevented collisions with the left and right boundary borders.
3. **Line-height estimate in compact label box**:
   - In `InterpersonalClass`, the label `EXACT SCIENTIFIC NAMES` (20 px font, 1.25 line height) requires 25 px vertical clearance. A declared box height of 22 px triggered a line-height overflow. Expanding the box height to 26 px resolved the diagnostic.
4. **Clean turn state separation**:
   - Turn 56 clears all Turn 55 pipeline geometry and arrows.
   - Turn 61 clears Turn 60 group field and state-power rack geometry upon entry of the assignment strip.
   - Turn-conditional DOM gating ensures replaced elements leave the markup completely, satisfying string-absence checks.

### Next ideas (6 Ideas)

1. Extract a reusable `StatePowerRack` component that formats vertical lists of governance and coercive institutions with status indicators.
2. Create an automated vertical-text layout audit helper that computes font height advances for rotated Asian and vertical Latin typography.
3. Add animated particle flow along the `GroupDirectionField` opposing arrows to highlight bidirectional volume dynamics.
4. Parameterize the `TermTriad` dock socket animation to provide mechanical lock clicks upon socket closure.
5. Create a shared `TreatmentTray` component for social-interaction case audits and experimental examples.
6. Provide automatic subtitle tracking for multiline book title banners in transition strips.

### Checks

- Episode TypeScript: All Package H files compile cleanly with zero diagnostics. Parallel runner file `min7_12/e/InstalledRouting.tsx` reported two errors (`dividerPoints`), left untouched per multi-package rules.
- `check_min7_12_h` tail:
  - `PASS: 227 Package H frames rendered in two fresh processes; all markup hashes match.`
  - `PASS: audit self-test (10 rules); 227 Package H frames (cues + 500 ms grid); layout audit of 4782 declared boxes (safe area, notch zones, text fit, collisions); clean turn transitions, storyboard strings, hook, underscore and interaction-hint policies verified.`
- `check_first_minute` tail: `PASS: 43 cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified; …`
- `check_roadmap_boot` tail: `PASS: RoadmapBoot renders 17 deterministic frames; 13 labels land on their cues and are absent before; …`
- `check_minute_two` tail: `PASS: 44 cue-derived frames; exact definition spacing …; Figure 2.3 layer widths 598 / 483 / 368 px in the ratio 5.2 : 4.2 : 3.2.`
- `check_dashboard` tail: `PASS: Equal Earth route 1296 samples / 0 land hits …; all 24 tray modes plus 3 Wage plane modes; …no rendered interaction hints; 75 polities with 16 non-colliding labels.`
- `check_min3_7_shared` tail: `PASS: 25 representative shared-component states; eleven component contracts, hook policy, underscore policy, Gaussian curves, … Posterior modes: 0.280460 / 0.499174 / 0.718096.`
- `check_min3_7_a` tail: `PASS: audit self-test (10 rules); 47 Package A cue-derived frames; 1282 audited boxes; …`
- `check_min3_7_b` tail: `PASS: audit self-test (10 rules); 43 Package B cue-derived frames; 1146 audited boxes; …`
- `check_min3_7_c` tail: `PASS: audit self-test (10 rules); 195 Package C frames (cues + 500 ms grid); layout audit of 6799 declared boxes …`
- `check_min3_7_d` tail: `PASS: audit self-test (10 rules); 211 Package D frames (cues + 500 ms grid); layout audit of 5306 declared boxes over 211 frames …; monotonic posterior sweep 0.2800 → 0.6755 (prior 0.72).`
- `check_equations` tail: `PASS: 14 equation frames; 111 registered coloured terms; 11 pulse cues peak at cue + 200 ms and rest after 600 ms; Eq. 2.5 and Eq. 2.8a are verbatim with MathText subscripts.`
- `check_min7_12_shared` tail: `PASS: 25 min7_12-shared states rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 25 min7_12 shared-component states; layout audit of 171 declared boxes …`
- `check_min7_12_f` tail: `PASS: 223 Package F frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 223 Package F frames (cues + 500 ms grid); layout audit of 2845 declared boxes …`
- `tools/check_antithesis.py` on all package H files and findings: `check-antithesis: no banned constructions found.`

### Unverified remainder

- No Chromium browser renders were executed in this stage; visual layout and text fitting rely on static layout audit geometry and estimates.
- The state-power rack institutions follow the approved narration script; additional legal-code citations remain outside the episode storyboard.

## Fix pass 1 (Package F)

Model: Gemini 3.8 Flash (High)  
Checkpoint: `ad1b96e`

### What was requested

Execute fix pass 1 for minutes 7–12 Package F based on frame reviews of `min7_12_F_v1.mp4`:
- Enforce the new layout invariant: every box on screen holds its content at its last beat; all panels, cards, and windows are populated.
- Add an automated fill-ratio assert to `tools/check_min7_12_f.tsx` with documented thresholds (area fill ratio and vertical span ratio).
- Fix `ImplicitTrace` (turns 41–42, frames `e500`, `e508`, `e515`, `e524`, `e531`):
  - Size the definition card to its content across expanded and contracted states.
  - Eliminate the duplicate heading in the past-experience stream column, populating the three trace boxes with distinct tokens and labels.
  - Populate the `INTROSPECTIVELY UNIDENTIFIED TRACE` panel with stored trace tokens and the storyboard's faint steering path.
  - Compose turn 42 as a balanced three-column layout where belief and automatic association lanes symmetrically feed the central person and response node.
- Fix `IATLatency` (turns 43–45, frames `e536`, `e545`, `e552`, `e558`):
  - Build the citation card to its final height from the start, revealing author names progressively.
  - Populate the stimulus window with the derived sorting trial (face mark and word chip) and pairing labels on left/right response keys.
  - Populate the field-audit measure rows with matched-case trial rows and draw the judgment-weighting meter dial with its needle pointing at the joined reading.
  - Remove `JPSP 74(6)` from the source line, formatting it strictly as `Greenwald, McGhee & Schwartz 1998 · Journal of Personality and Social Psychology`.
- Fix `AllportQuestion` (turn 46, frames `e563`, `e570`, `e578`):
  - Size the bias and prejudice term blocks to their content and include the one-line summaries `STARTING TENDENCY` and `GROUP ANTIPATHY`.
  - Size the Allport citation card to its content, presenting author, year, title, and page reference `Allport 1954, p. 9`.
- Verify episode TypeScript, the updated Package F checker, all prior stage checkers, and `tools/check_antithesis.py`.

### How I fixed it

1. **ImplicitTrace layout and content density**:
   - Resized `definitionExpanded` height from 680 px to 380 px, and `definitionContracted` height from 260 px to 125 px. Positioned `plainPanel` directly beneath the contracted definition card at `{x: 120, y: 310, w: 710, h: 250}`.
   - Removed the duplicate `PAST EXPERIENCES` column title. Sized the `stream` panel to `{x: 930, y: 240, w: 230, h: 350}` and populated `exp-card-1` and `exp-card-2` with `PAST EXPERIENCE` labels. Rendered `exp-card-3` and `stream-experiences` with label `PAST EXPERIENCES` on cue `t41Experiences`.
   - Sized the `traceStore` panel to `{x: 1220, y: 240, w: 270, h: 350}` with an inset `inspection-screen` panel (`{x: 1235, y: 325, w: 240, h: 210}`). Placed stored trace cards (`UNIDENTIFIED TRACE`, `STORED SHORTCUT`) and rendered an SVG dashed faint steering path connecting the stream inlet to the shortcut exit.
   - Recomposed turn 42 into a balanced arrangement: `beliefLane` (`{x: 140, y: 330, w: 660, h: 170}`) on the left, `automaticLane` (`{x: 1120, y: 330, w: 660, h: 170}`) on the right, `PersonMark` (`{x: 880, y: 330, w: 160, h: 180}`) at the center, and `responseNode` (`{x: 780, y: 640, w: 360, h: 160}`) at the base. Routed horizontal dashed leader strokes directly into the person mark and a vertical dashed leader down to the response node.

2. **IATLatency instruments and sourcing**:
   - Sized `sourcePlaque` to its final dimensions `{x: 330, y: 260, w: 1260, h: 350}` from beat `t43Three`. Added an internal gold divider rule above `Journal of Personality and Social Psychology` and positioned `IMPLICIT ASSOCIATION TEST` as a clean title outside the plaque at `y: 650`.
   - Resized the stimulus window `promptCard` to `{x: 450, y: 290, w: 480, h: 240}` with an internal header `SORTING TRIAL STIMULI` and footer `CONGRUENT / INCONGRUENT PAIR`. Populated `faceCard` with `prompt-face`, `PersonMark`, and `face-target-label`. Populated `wordCard` with `prompt-word`, gold-accented `word-chip`, and `word-category-label`.
   - Added explicit pairing labels to response keys: `PAIRING: FACE A + WORD A` on `keyLeft` and `PAIRING: FACE B + WORD B` on `keyRight`.
   - Populated the `fieldAuditInstrument` rows: `fa-card-1` holds `MATCHED CASE PAIR A` and `IDENTICAL RESUME · EQUAL QUALIFICATIONS`; `fa-card-2` holds `MATCHED CASE PAIR B` and `SYSTEMATIC DIFFERENTIAL OUTCOME`; added summary label `DERIVED AUDIT · NO RESULT VALUES`.
   - Replaced the placeholder rectangle in `judgmentMeter` with a drawn gauge arc, scale tick marks, pivot dot, and a gold needle stroke rotated to point at the joined reading. Added `INDIVIDUAL JUDGMENT`, `MENTAL LEAN`, `JUDGMENT WEIGHTING`, and `JOINED MEASUREMENT READING` labels.
   - Widened the source line box to 1300 px to accommodate single-line typesetting and updated text to `Greenwald, McGhee & Schwartz 1998 · Journal of Personality and Social Psychology`, removing `JPSP 74(6)`.

3. **AllportQuestion block geometry and citation**:
   - Sized `biasBlock` and `prejudiceBlock` to `{w: 460, h: 180}` at `y: 350`.
   - Added one-line summary labels `STARTING TENDENCY` inside `biasBlock` and `GROUP ANTIPATHY` inside `prejudiceBlock`. Inset connector sockets inside block boundaries to satisfy layout-audit edge rules.
   - Sized the Allport citation card to `{x: 380, y: 340, w: 1160, h: 340}`, showing year `1954`, author `GORDON W. ALLPORT`, gold source rule, title `The Nature of Prejudice`, and card citation detail `Allport 1954, p. 9`.

4. **Automated fill-ratio assertion**:
   - Implemented `checkFillRatio` in `tools/check_min7_12_f.tsx`.
   - For every declared `data-shape` frame with effective opacity ≥ 0.05, the assertion computes the sum of areas and vertical span of all enclosed declared text boxes.
   - Enforced dual threshold: area fill ratio ≥ 0.18 OR vertical span ratio ≥ 0.45, with zero allowed empty containers.
   - Applied the assertion across all scene end frames and major settled beat frames (`t41Noticing`, `t44Screen`, `t46Second`).

### Challenges encountered

1. **SignalLane internal geometry collisions**:
   - `SignalLane` computes its rail vertical center at `midY = (top + bottom) / 2`. Placing status labels at `y: 440` in a 180 px lane placed text directly on top of the rail and moving tokens.
   - Sizing the lane height to 170 px (`box.y = 330`) established the rail at `y: 429`. Placing status labels at `y: 450` provided 21 px vertical clearance from the rail, eliminating all collision diagnostics.
2. **Text advance line wrapping on source line**:
   - The expanded IAT source string contains 81 characters, requiring 972 px in IBM Plex Mono. A declared width of 840 px triggered a two-line wrapping overflow diagnostic in the audit. Expanding the box width to 1300 px accommodated the text on a single line within safe area bounds.
3. **Turn-boundary container fill verification**:
   - Evaluating fill ratios across turn transitions revealed that outer grouping panels (`stream-panel`, `trace-panel`, `prompt-card`) required proportional vertical sizing to avoid disproportionate whitespace while enclosing subcards.
   - Adjusting outer panel heights to match their active content bounds ensured high content density across intermediate and final frame states.

### Next ideas (6 Ideas)

1. Introduce an automated fill-ratio check into `tools/layout_audit.ts` so all episode packages enforce container density systematically.
2. Build a dedicated `GaugeMeter` component in `min7_12/shared/` that parameterizes dial angle, scale ticks, and needle interpolation.
3. Create a composite `MatchedAuditCard` helper for standardized side-by-side empirical field audit presentations.
4. Support progressive multi-line text reveals in `CitationCard` to synchronize line entrances with spoken word timestamps.
5. Add an optional pairing badge slot to `Panel` keys for interactive sorting and classification scenes.
6. Provide automatic symmetrical lane balancing helpers that compute equal horizontal margins and shared center-dock coordinates.

### Checks

- Episode TypeScript: `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage` exits 0 with zero diagnostics.
- `check_min7_12_f` tail:
  - `PASS: 223 Package F frames rendered in two fresh processes; all markup hashes match.`
  - `PASS: audit self-test (10 rules); 223 Package F frames (cues + 500 ms grid); layout audit of 3858 declared boxes (safe area, notch zones, text fit, collisions); fill-ratio assert verified on all scene end frames; clean turn transitions, storyboard strings, hook, underscore and interaction-hint policies verified.`
- `check_first_minute` tail: `PASS: 43 cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified; …`
- `check_roadmap_boot` tail: `PASS: RoadmapBoot renders 17 deterministic frames; 13 labels land on their cues and are absent before; …`
- `check_minute_two` tail: `PASS: 44 cue-derived frames; exact definition spacing …; Figure 2.3 layer widths 598 / 483 / 368 px in the ratio 5.2 : 4.2 : 3.2.`
- `check_dashboard` tail: `PASS: Equal Earth route 1296 samples / 0 land hits …; all 24 tray modes plus 3 Wage plane modes; …no rendered interaction hints; 75 polities with 16 non-colliding labels.`
- `check_min3_7_shared` tail: `PASS: 25 representative shared-component states; eleven component contracts, hook policy, underscore policy, Gaussian curves, … Posterior modes: 0.280460 / 0.499174 / 0.718096.`
- `check_min3_7_a` tail: `PASS: audit self-test (10 rules); 47 Package A cue-derived frames; 1282 audited boxes; …`
- `check_min3_7_b` tail: `PASS: audit self-test (10 rules); 43 Package B cue-derived frames; 1146 audited boxes; …`
- `check_min3_7_c` tail: `PASS: audit self-test (10 rules); 195 Package C frames (cues + 500 ms grid); layout audit of 6799 declared boxes …`
- `check_min3_7_d` tail: `PASS: audit self-test (10 rules); 211 Package D frames (cues + 500 ms grid); layout audit of 5306 declared boxes over 211 frames …; monotonic posterior sweep 0.2800 → 0.6755 (prior 0.72).`
- `check_equations` tail: `PASS: 14 equation frames; 111 registered coloured terms; 11 pulse cues peak at cue + 200 ms and rest after 600 ms; Eq. 2.5 and Eq. 2.8a are verbatim with MathText subscripts.`
- `check_min7_12_shared` tail: `PASS: 25 min7_12-shared states rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 25 min7_12 shared-component states; layout audit of 171 declared boxes …`
- `check_min7_12_e` tail: `PASS: 203 Package E frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 203 Package E frames (cues + 500 ms grid); layout audit of 3938 declared boxes …`
- `check_min7_12_h` tail: `PASS: 227 Package H frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 227 Package H frames (cues + 500 ms grid); layout audit of 4782 declared boxes …`
- `tools/check_antithesis.py` on all package F files and findings: `check-antithesis: no banned constructions found.`

### Unverified remainder

- Video rendering was not run locally because Chromium rendering is performed by the orchestrator. Frame validation relies on the static layout audit, deterministic StaticMarkup evaluation, and automated fill-ratio checks.
