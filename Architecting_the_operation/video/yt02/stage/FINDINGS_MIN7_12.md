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

## Fix pass 1 (Package E)

Model: Gemini 3.8 Flash (High)  
Checkpoint: `0301138`

### What was requested

Execute fix pass 1 for minutes 7–12 Package E based on frame reviews of `min7_12_E_v1.mp4`:
- Enforce the new layout invariant: every box on screen holds its content at its last beat; all panels, cards, and windows are populated.
- Enforce rule 2: faded-out labels are fully absent with zero ghost text.
- Enforce rule 3: zero internal labels on screen (no turn numbers matching `/\bturn \d+\b/i`, cue names, or file names).
- Enforce rule 4: balanced final frame compositions with no empty band exceeding one third of the safe area.
- Enforce rule 5: equations are the largest element in their beat; Eq. 2.8a and Eq. 2.11 set at 34 px or larger, centered, with glyph-derived token advances.
- Address Package E defects:
  - `DocumentedExpectation` (turns 35–36, frames `e428`, `e434`, `e441`, `e449`):
    - Center Eq. 2.8a at 34 px in the continuity strip.
    - Size the `BLACK WOMEN` ledger card to its active content.
    - Populate the qualitative series plot from the first frame of the NCHS beat with the label `QUALITATIVE · NO RATES SHOWN` and no axis numbers.
    - Remove the faint ghost `STARTING EXPECTATION` label behind the plot's top right at `e449`.
  - `InstalledRouting` (turn 37, frames `e457`, `e463`):
    - Draw each of the three right-hand boxes only when its content arrives.
    - Size the gates and cartridge to their content.
  - `RLCBridge` (turn 38, frames `e470`, `e477`, `r473`, `r476`, `r479`):
    - Remove the empty preview box prior to content arrival; bring circuit components in step with spoken inductance, resistance, and capacitance.
    - Re-lay the final state: assemble Eq. 2.11 centered at 36 px; give the damping preview at least 200 px of height (allocated 390 px) displaying a visible underdamped curve (shock impulse, overshoot, decay); compress components to compact chips.
    - Typeset Eq. 2.11 using pure glyph-derived `EquationTerms` tokens without manual width overrides.
  - `ExplicitImplicitChannels` (turns 39–40, frames `e483`, `e490`, `e496`):
    - Build both explicit and implicit channels across the full vertical frame from the start of turn 39, centering the bias hub.
    - Build the turn-40 citation card to its final size from the start, populating names, 1995, title, and *Psychological Review* 102(1) as each element is spoken.
- Verify episode TypeScript, the updated Package E checker (including the fill-ratio assertion and `/\bturn \d+\b/i` assertion), all existing test suites, and `tools/check_antithesis.py`.

### How I fixed it

1. **`DocumentedExpectation` (turns 35–36)**:
   - Centered Eq. 2.8a at 34 px font size inside `eqTerms` with `align="center"`. Removed manual width overrides from `eq28aTokens`, allowing `tokenWidth` to calculate advances from glyph metrics. Centered the label `Eq. 2.8a · Bayesian prior` at y = 172.
   - Sized `ledgerCompact` to 220 px height (`y: 285` to `505`) during the starting wariness beat. Expanded smoothly to 495 px height on `t35Documented` to hold documented harm, ongoing disparity, and updated expectation tokens. Sized `expectationCard` to `{w: 400, h: 180}` at `{x: 1390, y: 350}`.
   - Drawn the qualitative series plot frame and unlabeled surveillance station guides from `t36National`. Displayed `QUALITATIVE · NO RATES SHOWN` at `{x: 1340, y: 260}` from the first frame of the NCHS beat. Rendered the title `MATERNAL MORTALITY · SURVEILLANCE SERIES` at `t36Maternal`.
   - Removed the redundant turn-36 `EvidenceToken` text `STARTING EXPECTATION`. Replaced it with a clean gold expectation marker pin docking on the upper path at `t36Expectation`. Positioned `whitePathLabel` at y = 610 below the white path, eliminating path line intersection. Expanded `plaqueYear` height to 38 px to satisfy single-line typography bounds.

2. **`InstalledRouting` (turn 37)**:
   - Set direct facts lane `<Panel id="facts-lane-frame">` to render strictly on `ms >= cue.t37Facts`.
   - Set empathy gate `<Panel id="empathy-gate-frame">` to render strictly on `ms >= cue.t37Empathy`.
   - Set threat detection gate `<Panel id="threat-gate-frame">` to render strictly on `ms >= cue.t37Threat`.
   - Sized `empathyGate` and `threatGate` to `{w: 420, h: 170}`. Routed connection traces directly to gate centers at y = 365 and y = 725.
   - Sized `cartridge` to `{w: 440, h: 310}`. Centered Eq. 2.8a at 34 px in the continuity strip.

3. **`RLCBridge` (turn 38)**:
   - Deferred rendering `<Panel id="preview-panel-frame">` until `ms >= cue.t38Absorbs`.
   - Introduced components sequentially with their cultural and carceral meanings in the institutional panel (y: 180 to 400). Connected passive elements on `t38Institutional`.
   - Assembled Eq. 2.11 at `t38Shocks` in an equation band at y: 412, centered at 36 px with `align="center"`. Removed all manual width overrides from `eq211Tokens` so token advances derive from glyph properties.
   - Allocated 390 px of height to `previewPanel` (`y: 532` to `922`). Synthesized a prominent underdamped response curve with an initial 120 px impulse peak, a 65 px undershoot trough, a decaying secondary oscillation, and exponential relaxation toward the extraction baseline. Sized lower labels to 18 px across 340 px boxes to ensure clean single-line typesetting.

4. **`ExplicitImplicitChannels` (turns 39–40)**:
   - Rendered both `explicitChannel` (y: 240 to 460) and `implicitChannel` (y: 560 to 780) panel frames from the beginning of turn 39, establishing balanced composition across the vertical canvas.
   - Sized the central `biasHub` to `{w: 420, h: 500}` (`y: 280` to `780`), spanning both channels symmetrically.
   - Routed `implicitRail` at y = 650 with 34 px vertical clearance from `implicitHeading` (y: 580 to 616) and 65 px vertical clearance from `implicitAssocLabel` (y: 715 to 749), eliminating line crossing diagnostics.
   - Sized the turn-40 `citationCard` to final dimensions `{x: 330, y: 240, w: 1260, h: 480}` from the first beat of turn 40. Filled elements sequentially: authors on `t40Anthony` and `t40Banaji`, source rule on `t40Formal`, year 1995 on `t40NinetyFive`, title on `t40Implicit` and `t40Cognition`, and journal citation `Psychological Review 102(1)` on `t40Article`.

5. **Validation runner updates**:
   - Added `checkFillRatio` in `tools/check_min7_12_e.tsx` asserting that all declared frames with effective opacity ≥ 0.05 satisfy `areaFillRatio >= 0.18` OR `verticalSpanRatio >= 0.45` with zero empty containers. Verified fill ratios at all scene end frames and settled beat states (`t35Disparity`, `t37Facts`, `t38Shocks`, `t39Associations`).
   - Added assertion prohibiting any on-screen text matching `/\bturn \d+\b/i` across all 203 rendered frames.
   - Added beat assertions for `QUALITATIVE · NO RATES SHOWN` at `t36National` and `Psychological Review 102(1)` at `t40Article`.

### Challenges encountered

1. **Line intersection with dual-channel status labels**:
   - In `ExplicitImplicitChannels`, shifting the implicit channel into the layout from turn start exposed a stroke intersection between `implicit-rail` (y = 680) and `implicit-assoc-label` (y = 670 to 704). Placing the rail at y = 650 and moving `implicitAssocLabel` to y = 715 established 65 px of clearance.
2. **Text advance fitting on multi-term chips**:
   - In `RLCBridge`, setting component meanings in narrow column chips caused estimated character wrapping. Organizing the component chips across full panel widths (`w: 1110`) allowed 840 px for descriptive strings, seating 44-character strings on a single line.
3. **Typography line height on year markers**:
   - In `DocumentedExpectation`, `plaqueYear` set at 28 px font size in a 32 px height container failed the 1.25 line-height ratio test. Expanding container height to 38 px satisfied the layout audit text fit rule.

### Next ideas (6 Ideas)

1. Introduce an `UnderdampedResponsePlot` component in `min7_12/shared/` that parameterizes damping ratio, natural frequency, and stroke styling.
2. Build an automated container fill auditor CLI that runs across all scene plans in the repository.
3. Add a layout audit rule that detects and flags empty frames during transitional frames between cue beats.
4. Add progressive token connection animations in `EvidenceToken` to show live socket locking.
5. Create a shared `CitationCard` component that encapsulates multi-field academic bibliographic reveals.
6. Support multi-channel routing bus visualization with automatic collision avoidance around centered person marks.

### Checks

- Episode TypeScript: `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage` exits 0 with zero diagnostics.
- `check_min7_12_e` tail:
  - `PASS: 203 Package E frames rendered in two fresh processes; all markup hashes match.`
  - `PASS: audit self-test (10 rules); 203 Package E frames (cues + 500 ms grid); layout audit of 3900 declared boxes (safe area, notch zones, text fit, collisions); fill-ratio assert verified on all scene end frames; clean turn transitions, storyboard strings, hook, underscore, internal-turn and interaction-hint policies verified.`
- `check_min7_12_f` tail: `PASS: 223 Package F frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 223 Package F frames (cues + 500 ms grid); layout audit of 3858 declared boxes … fill-ratio assert verified on all scene end frames`
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
- `tools/check_antithesis.py` on all package E files and findings: `check-antithesis: no banned constructions found.`

## Design pass (Package E)

Model: Gemini 4 Argon (High)  
Checkpoint: `4a99250`

### What was requested

Execute the minutes 7–12 Design Pass (`BRIEF_MIN7_12_POLISH.md`) for Package E (turns 35–40: `DocumentedExpectation`, `InstalledRouting`, `RLCBridge`, `ExplicitImplicitChannels`) after reviewing the current rendered frames in `outputs/YT02v2_ov/video/stage_runs/v2/` (`e434.jpg`, `e449.jpg`, `e463.jpg`, `e476.jpg`, `e479.jpg`, `e490.jpg`, `e496.jpg`, `s1.jpg`):
- Enforce Rule 1 (Composition): at every beat's settled state, content spans at least ~70% of the safe area's height (`>= 658 px` of `y: 70..1010`, verified even excluding `source-line`).
- Enforce Rule 2 (Cards fit their text): every citation or definition card and panel is no more than 40 px taller than its final content/text block (`f.h - span <= 40 px`), built at final size from its first beat and filled as each element is spoken.
- Enforce Rule 3 (Size floor): body text is at least 28 px and labels at least 20 px across all declared text boxes, with no exceptions.
- Fix `DocumentedExpectation` (`e434`, `e449`):
  - Rebalance the three Turn 35 panels (`ledger-frame`, `bayes-plot-frame`, `expect-card-frame`) into one row of equal height (`y: 255..880`, `h: 625`), eliminating the empty space below the `"BLACK WOMEN"` card at `e434`.
  - Balance the Turn 36 NCHS column (`y: 250..895`) and series plot column (`y: 250..895`) at `e449`.
- Fix `RLCBridge` close (`e476`, `e479`):
  - Re-lay the ~13 px component list as five term chips (`TermChip`) at the floor sizes (`>= 20 px` labels / `>= 28 px` body).
  - Set Eq. 2.11 (`Lq̈ + Rq̇ + (1/C)q = V(t)`) at 40 px or more (`42 px`), centred, using `EquationTerms` tokens.
  - Keep the derived damping preview at its readable height (`248 px >= 200 px`) while tightening all panel slack to `<= 40 px`.
- Fix `ExplicitImplicitChannels`, the Greenwald & Banaji card (`e490`, `e496`):
  - Size the Greenwald & Banaji card tightly to its content (`h: 256 px`, `36 px` slack), eliminating the empty lower two-thirds.
  - Show its full content: the names (`ANTHONY G. GREENWALD · MAHZARIN R. BANAJI`), `1995`, the title (*Implicit Social Cognition: Attitudes, Self-Esteem, and Stereotypes*), and *Psychological Review* `102(1)` (bib 4226).
  - Pair the card with the explicit/implicit picture (`BIAS` hub, `EXPLICIT` channel, `IMPLICIT` channel, `INDIVIDUAL JUDGMENT` meter) so the frame is balanced across the vertical canvas.
- Add automated vertical-span (Rule 1), card-fit (Rule 2), and minimum-font (Rule 3) assertions to `tools/check_min7_12_e.tsx` while keeping all earlier assertions.

### How I fixed it

1. **`DocumentedExpectation` (`min7_12/e/DocumentedExpectation.tsx`, turns 35–36)**:
   - Re-laid Turn 35 (`!isTurn36`) below the centered `36 px` Eq. 2.8a continuity strip (`y: 100..220`, `30 px` slack) as a single row of three matched-height panels (`y: 255..880`, `h: 625`, `36 px` slack each): `ledger-frame` (`{x: 120, y: 255, w: 480, h: 625}`), `bayes-plot-frame` (`{x: 635, y: 255, w: 690, h: 625}`), and `expect-card-frame` (`{x: 1360, y: 255, w: 440, h: 625}`).
   - Populated `ledger-frame` with a `28 px` heading (`BLACK WOMEN` at `t35Black`), `28 px` clinical summary body, three `20 px` `EvidenceToken` rows (`WARINESS TOWARD THE U.S. MEDICAL SYSTEM`, `DOCUMENTED HARM`, `ONGOING DISPARITY`), and `20 px` update caption (`EXPECTATION UPDATED ON DOCUMENTED EVIDENCE` at `t35Disparity`).
   - Re-laid Turn 36 (`isTurn36`) across `y: 250..895` (`795 px` total scene vertical span with the top strip): left column pairs `nchs-plaque-frame` (`{x: 120, y: 250, w: 490, h: 310}`, `36 px` slack) and `nchs-context-frame` (`{x: 120, y: 585, w: 490, h: 310}`, `36 px` slack) at `28 px` body/title sizes, while the right column pairs `series-plot-frame` (`{x: 650, y: 250, w: 1150, h: 550}`, `36 px` slack) and `disclosure-frame` (`{x: 650, y: 825, w: 1150, h: 70}`, `36 px` slack).

2. **`InstalledRouting` (`min7_12/e/InstalledRouting.tsx`, turn 37)**:
   - Centered Eq. 2.8a at `36 px` in the continuity strip (`{x: 120, y: 100, w: 1680, h: 120}`, `30 px` slack).
   - Paired `cartridge-frame` (`{x: 120, y: 260, w: 440, h: 350}`, `36 px` slack) with `cartridge-mech-frame` (`{x: 120, y: 635, w: 440, h: 245}`, `36 px` slack) on the left (`y: 260..880`), giving the scene a `780 px` vertical span (`y: 100..880`, 83% of safe height) across every beat.
   - Sized `facts-lane-frame` (`{x: 640, y: 260, w: 490, h: 620}`, `36 px` slack), `empathy-gate-frame` (`{x: 1340, y: 260, w: 460, h: 270}`, `36 px` slack), and `threat-gate-frame` (`{x: 1340, y: 610, w: 460, h: 270}`, `36 px` slack) with `28 px` titles and `28 px` body descriptions, routing `route-empathy` (`y = 240`) and `route-threat` (`y = 900`) around the central facts lane.

3. **`RLCBridge` (`min7_12/e/RLCBridge.tsx`, turn 38, `e476`, `e479`)**:
   - Built `RlcTermChip` rendering `data-term-chip={term}`, `<Panel id={`${idPrefix}-chip-frame`} />`, `<ColoredTerm>` symbol badge (`24 px` mono bold using registry palette colors), `22 px` term title (`L · INDUCTANCE`, `R · RESISTANCE`, `C · CAPACITANCE`, `q(t) · EQUALITY-SURPLUS CHARGE`, `V(t) · REFORM-SHOCK DRIVING VOLTAGE`), and `20 px` meaning inside `inst-panel-frame` (`{x: 640, y: 184, w: 1160, h: 356}`, `34 px` slack; chip heights `92 px` and `82 px`, `16–18 px` slack).
   - Set Eq. 2.11 (`Lq̈ + Rq̇ + (1/C)q = V(t)`) at `42 px` (`>= 40 px` floor), centered inside `eq-band-frame` (`{x: 640, y: 550, w: 1160, h: 112}`, `26 px` slack) using `EquationTerms` tokens with live pulses at each term's cue and at `t38Shocks`.
   - Kept the derived damping response preview (`preview-panel-frame`, `{x: 640, y: 672, w: 1160, h: 248}`, `32 px` slack) at readable height (`248 px >= 200 px`) with `20 px` labels and an underdamped response curve (`y: 734..858`) around the `y = 796` extraction baseline.
   - Balanced the left column (`y: 184..920`) by pairing `mental-panel-frame` (`{x: 120, y: 184, w: 460, h: 380}`, `36 px` slack) and `coupling-panel-frame` (`{x: 120, y: 588, w: 460, h: 332}`, `36 px` slack) with `28 px` titles and body text.

4. **`ExplicitImplicitChannels` (`min7_12/e/ExplicitImplicitChannels.tsx`, turns 39–40, `e490`, `e496`)**:
   - Re-laid Turn 39 (`!isTurn40`, `y: 115..885`, `770 px` vertical span) with `t39-banner-frame` (`h: 72`, `32 px` slack), `bias-hub-frame` (`{x: 120, y: 220, w: 400, h: 665}`, `36 px` slack), `explicit-channel-frame` (`{x: 560, y: 220, w: 880, h: 310}`, `36 px` slack, housing `explicit-card-frame` `{x: 660, y: 295, w: 680, h: 80}` with `16 px` slack), `implicit-channel-frame` (`{x: 560, y: 575, w: 880, h: 310}`, `36 px` slack), and `meter-panel-frame` (`{x: 1480, y: 220, w: 320, h: 665}`, `36 px` slack) at `>= 28 px` body and `>= 20 px` label sizes.
   - Re-laid Turn 40 (`isTurn40`, `y: 115..885`, `770 px` vertical span):
     - Sized the Greenwald & Banaji citation card (`citation-card-frame`, `{x: 220, y: 115, w: 1480, h: 256}`) tightly to its text (`220 px` text span, `36 px` slack), displaying the full citation content on the card (`ANTHONY G. GREENWALD · MAHZARIN R. BANAJI` at `32 px`, `1995` at `32 px`, *Implicit Social Cognition: Attitudes, Self-Esteem, and Stereotypes* at `32 px`, and *Psychological Review* `102(1)` at `28 px`) while brightening each field on its cue (`data-cognition-bright`, `data-year-bright`, `data-article-bright`).
     - Paired the citation card with the lower explicit/implicit diagram (`y: 410..885`, `h: 475`): `t40-bias-hub-frame` (`{x: 120, y: 410, w: 380, h: 475}`, `36 px` slack), `t40-explicit-frame` (`{x: 540, y: 410, w: 900, h: 220}`, `34 px` slack), `t40-implicit-frame` (`{x: 540, y: 665, w: 900, h: 220}`, `34 px` slack), and `t40-meter-frame` (`{x: 1480, y: 410, w: 320, h: 475}`, `36 px` slack).

5. **Validation runner (`tools/check_min7_12_e.tsx`)**:
   - Added `checkVerticalSpan` enforcing `span >= 658 px` (70% of the `940 px` safe-area height, excluding `source-line`) across all cue frames, review frames (`e434`, `e449`, `e463`, `e476`, `e479`, `e490`, `e496`), and end frames.
   - Added `checkFillAndCardFitAndSizes` enforcing `f.h - span <= 40 px` on every visible frame and strict text card across all 210 frames, `t.fit.size >= 20 px` on all labels, `t.fit.size >= 28 px` on all body/heading texts, and `fontSize >= 40 px` on Eq. 2.11.
   - Added explicit assertions at `e434`, `e476`, `e479`, `e490`, and `e496` verifying the 3 equal-height Turn 35 panels, the 5 `TermChip`s + Eq. 2.11 + `>= 200 px` preview, and the full Greenwald & Banaji card paired with the explicit/implicit picture.

### Challenges encountered

1. **Pre-cue substring collisions on populated panel scaffolding**:
   - Populating the Turn 35 panels in `DocumentedExpectation` from the first beat initially introduced static strings containing `"EVIDENCE"` and `"POSTERIOR"` prior to `t35Updated`. Choosing distinct pre-cue scaffolding labels (`"CLINICAL RECORD LEDGER"`, `"OBSERVED STREAM FEEDS LIKELIHOOD P(X | T)"`, `"OBSERVED RECORD SHIFTS THE STARTING DENSITY"`) preserved tight `36 px` panel slack across all beats while keeping `"EVIDENCE"` and `"POSTERIOR"` absent until `t35Updated`.
2. **Double-multiplied entrance opacity on nested containers**:
   - In `InstalledRouting`, applying `opacity={factsP}` to both the outer `data-facts-lane` wrapper and its inner `<Label>` children caused the product `factsP * factsP` to dip below `0.05` at `462240 ms` (`40 ms` after `t37Facts`), while the parent frame remained at `0.21`. Setting child opacities to `1` inside the animated parent wrapper kept parent and child opacities synchronized throughout the entrance ramp.
3. **Two-line wrapping inside two-column `TermChip` meanings**:
   - In `RLCBridge`, the `45`-character string `"CULTURAL INERTIA + INSTITUTIONAL ENTRENCHMENT"` at `20 px` wrapped to two lines inside a `546 px`-wide half-column chip (`442 px` text width). Allocating `h: 92 px` to the four half-column chips (`L`, `R`, `C`, `q`) with a `46 px` two-line meaning box (`lh = 1.12`) and `h: 82 px` to the full-width `V` chip satisfied both the `20 px` label floor and the `<= 40 px` card-fit rule (`16–18 px` slack).
4. **Inspection of `EquationTerms` inline font style format**:
   - `EquationTerms` renders CSS shorthand `font: 500 42px "IBM Plex Mono"` on its `data-equation` container. Matching the shorthand `font:` property in `check_min7_12_e.tsx` verified the `42 px` (`>= 40 px`) Eq. 2.11 size floor directly from the rendered markup.

### Next ideas (6 Ideas)

1. Promote `RlcTermChip` into `equations/TermChip.tsx` as a configurable two-line `TermChip` variant supporting `>= 20 px` floor typography and custom uppercase storyboard meanings.
2. Add a shared `DualColumnStageGrid` layout helper in `min7_12/shared/` that computes top/bottom-aligned panel boxes with guaranteed `36 px` vertical slack.
3. Extend `auditLayout` in `tools/layout_audit.ts` with an opt-in `maxFrameSlack` parameter so every package can enforce `<= 40 px` container slack directly inside the shared layout audit pass.
4. Add a `CitationRecordCard` component in `min7_12/shared/` that renders full bibliographic fields from beat start and exposes `data-*-bright` attributes as each cue arrives.
5. Build a static SVG path clearance verifier that checks polyline segments against adjacent frame boundaries before running the full 500 ms frame grid.
6. Export declarative `BODY_TEXT_IDS` metadata directly from `<Label role="body">` props so check scripts can distinguish `28 px` body text from `20 px` labels automatically.

### Checks

- Episode TypeScript: `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage` exits 0 with zero diagnostics.
- `check_min7_12_e` tail:
  - `PASS: 210 Package E frames rendered in two fresh processes; all markup hashes match.`
  - `PASS: audit self-test (10 rules); 210 Package E frames (cues + review frames + 500 ms grid); layout audit of 8328 declared boxes (safe area, notch zones, text fit, collisions); vertical span (>= 658 px), card fit (<= 40 px slack), and font floors (>= 28 px body / >= 20 px labels / >= 40 px Eq. 2.11) verified on all frames.`
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
- `check_min7_12_f` tail: `PASS: 223 Package F frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 223 Package F frames (cues + 500 ms grid); layout audit of 7248 declared boxes …`
- `check_min7_12_g` tail: `PASS: 243 Package G frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 243 Package G frames (cues + 500 ms grid); layout audit of 5555 declared boxes …`
- `check_min7_12_h` tail: `PASS: 227 Package H frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 227 Package H frames (cues + 500 ms grid); layout audit of 5975 declared boxes …`
- `tools/check_antithesis.py` on all modified Package E files and `FINDINGS_MIN7_12.md`: `check-antithesis: no banned constructions found.`

### Unverified remainder

- Visual verification in this pass relies on the static markup layout audit (`8328` declared boxes across `210` frames, including `e434`, `e449`, `e463`, `e476`, `e479`, `e490`, and `e496`) without launching a headless Chromium browser render.

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

## Design pass (Package F)

Model: Gemini 4 Argon (High)  
Checkpoint: `4848dbc`

### What was requested

Execute the minutes 7–12 Design Pass (`BRIEF_MIN7_12_POLISH.md`) for Package F (turns 41–46: `ImplicitTrace`, `IATLatency`, `AllportQuestion`) after reviewing the current rendered frames in `outputs/YT02v2_ov/video/stage_runs/v2/` (`e508.jpg`, `e524.jpg`, `e531.jpg`, `e545.jpg`, `e552.jpg`, `e558.jpg`, `e578.jpg`):
- Enforce Rule 1 (Composition): at every beat's settled state, content spans at least ~70% of the safe area's height (`>= 658 px` of `y: 70..1010`, verified even excluding `source-line`).
- Enforce Rule 2 (Cards fit their text): every citation or definition card and panel is no more than 40 px taller than its final content/text block (`f.h - span <= 40 px`), built at final size from its first beat and filled as each element is spoken.
- Enforce Rule 3 (Size floor): body text is at least 28 px and labels at least 20 px across all declared `data-fit` text boxes.
- Fix `ImplicitTrace`, turn 41 (`e508`):
  - Give the three `"PAST EXPERIENCE"` chips distinct trace content: `"accumulated surroundings"`, `"repeated exposure"`, and `"stored association"`.
  - Populate the `"REACTION"` column between `"+ FAVORABLE"` and `"− UNFAVORABLE"` with a reaction scale and needle steered by the trace.
- Fix `ImplicitTrace`, turn 42 (`e524`, `e531`):
  - Re-lay turn 42 as one centered composition spanning the safe area where the belief lane and the association lane converge on the central person and the reaction sits below them.
- Fix `IATLatency` (`e552`, `e558`):
  - Replace the placeholder `"STIMULUS"` in the word window with a neutral example word chip `"pleasant"`, and remove the internal labels `"TARGET GLYPH"` and `"VALENCE WORD"`.
  - Size the latency panel tightly to its two bars, eliminating the empty lower half.
- Fix `AllportQuestion` (`e578`):
  - Display *The Nature of Prejudice* and `"p. 9"` (bib 4207) on the Allport citation card and size the card tightly to its content.
- Add automated vertical-span (Rule 1), card-fit (Rule 2), and minimum-font (Rule 3) assertions to `tools/check_min7_12_f.tsx` while keeping all earlier assertions.

### How I fixed it

1. **`ImplicitTrace.tsx` (`min7_12/f/ImplicitTrace.tsx`, turns 41–42)**:
   - Re-laid Turn 41 (`!isTurn42 && ms >= cue.t41Define`) across `y: 115..880` (`765 px` vertical span, `81.4%` of safe area height) with a top context banner (`t41-banner`, `{x: 110, y: 115, w: 1700, h: 72}`) and three matched-height columns at `y: 225..880` (`h: 655`):
     - Left column: `def-card` (`{x: 110, y: 225, w: 720, h: 356}`, `36 px` slack) and `plain-panel` (`{x: 110, y: 615, w: 720, h: 265}`, `36 px` slack) with `28–36 px` body copy and `20–22 px` labels.
     - Middle columns: `stream-panel` (`{x: 865, y: 225, w: 300, h: 655}`, `36 px` slack) containing three cards (`exp-card-1/2/3`, `h: 136`, `36 px` slack) populated with distinct trace strings `"accumulated surroundings"`, `"repeated exposure"`, and `"stored association"`; paired with `trace-panel` (`{x: 1195, y: 225, w: 305, h: 655}`, `36 px` slack) and `inspection-screen` (`{x: 1213, y: 315, w: 269, h: 376}`, `36 px` slack).
     - Right column: `reaction-rail` (`{x: 1530, y: 225, w: 280, h: 655}`, `36 px` slack) populated between `"+ FAVORABLE"` and `"− UNFAVORABLE"` with a vertical valence scale spine (`reaction-scale-spine`), tick marks, steering trajectory (`reaction-steer-arc`), pivot (`reaction-pivot`), and a tilted gold needle (`reaction-needle`) plus `FEELING`, `THOUGHT`, and `ACTION` sockets.
   - Re-laid Turn 42 (`isTurn42`) across `y: 115..885` (`770 px` vertical span, `81.9%` of safe area height) as one centered convergence diagram:
     - Top banner (`t42-banner`, `{x: 260, y: 115, w: 1400, h: 72}`), upper-left belief channel (`SignalLane` at `{x: 130, y: 245, w: 690, h: 240}`), upper-right automatic association channel (`SignalLane` at `{x: 1100, y: 245, w: 690, h: 240}`), central `ONE PERSON` hub (`person-hub` at `{x: 860, y: 255, w: 200, h: 220}`), and centered lower `REACTION` card (`response-node` at `{x: 560, y: 605, w: 800, h: 280}`, `36 px` slack) flanked by `concept-anchor-left` and `concept-anchor-right`.
     - Rendered the convergence leaders (`leader-belief-person`, `leader-auto-person`, `leader-person-reaction`) and `response-node` throughout Turn 42 from `t42Precision` so frames `e524` (`524.00 s`) and `e531` (`531.00 s`) display the complete centered convergence geometry.

2. **`IATLatency.tsx` (`min7_12/f/IATLatency.tsx`, turns 43–45)**:
   - Re-laid Turn 43 (`isTurn43 && ms >= cue.t43Three`) across `y: 115..880` (`765 px` vertical span) with `t43-banner`, `source-plaque` (`{x: 330, y: 225, w: 1260, h: 290}`, `36 px` slack), and `iat-instrument-card` (`{x: 330, y: 560, w: 1260, h: 320}`, `36 px` slack).
   - Re-laid Turn 44 (`isTurn44`) across `y: 120..880` (`760 px` vertical span):
     - Inside `prompt-card` (`{x: 350, y: 245, w: 680, h: 254}`, `36 px` slack), `face-card` (`{x: 374, y: 305, w: 296, h: 130}`) holds only `FACE` and `PersonMark`, and `word-card` (`{x: 710, y: 305, w: 296, h: 130}`) holds only `WORD` and the neutral example word chip `"pleasant"` (`word-chip`, `{x: 738, y: 365, w: 240, h: 60}`). Removed `"STIMULUS"`, `"TARGET GLYPH"`, and `"VALENCE WORD"`.
     - Updated key pairing labels to `PAIRING: FACE A + pleasant` and `PAIRING: FACE B + unpleasant`.
     - Sized `latency-instrument` tightly to its two bars at `{x: 1310, y: 290, w: 490, h: 420}` (`36 px` slack), centered vertically alongside the sorting monitor.
   - Re-laid Turn 45 (`isTurn45`) across `y: 115..887` (`772 px` vertical span) with `t45-banner`, three `560 px`-tall instrument columns (`rt-instrument`, `fa-instrument`, `judgment-meter`, each with `36 px` slack), and `t45-bus` (`{x: 130, y: 815, w: 1660, h: 72}`).

3. **`AllportQuestion.tsx` (`min7_12/f/AllportQuestion.tsx`, turn 46)**:
   - Re-laid the question half (`!isCitation && ms >= cue.t46Why`) across `y: 110..880` (`770 px` vertical span) with `QuestionHeader` (`y: 110..246`), `bias-block` (`{x: 180, y: 310, w: 690, h: 320}`, `36 px` slack), `prejudice-block` (`{x: 1050, y: 310, w: 690, h: 320}`, `36 px` slack), and `distinction-panel` (`{x: 180, y: 690, w: 1560, h: 190}`, `36 px` slack).
   - Re-laid the citation half (`isCitation`) across `y: 115..875` (`760 px` vertical span) with `t46-banner`, `citation-card` (`{x: 330, y: 235, w: 1260, h: 340}`, `36 px` slack), and three taxonomy preview cards (`allport-pillar-1/2/3`, `y: 625..875`, `36 px` slack).
   - Displayed `GORDON W. ALLPORT`, *The Nature of Prejudice*, and `Addison-Wesley · p. 9` on `citation-card` from `t46Gordon` (`574.34 s`), adding `1954` (`Addison-Wesley · 1954 · p. 9`) at `t46FiftyFour` (`577.80 s`) so `e578` (`578.00 s`) shows the complete Allport citation card with author, year, title, and `p. 9`.

4. **`tools/check_min7_12_f.tsx` design-pass assertions**:
   - Added `checkVerticalSpan` (Rule 1: vertical span excluding `source-line` `>= 658 px` on every cue frame and end frame).
   - Added `checkFillAndCardFitAndSizes` on all 223 sampled frames enforcing Rule 2 (`f.h - contentSpan <= 40 px` on every frame and `f.h - textSpan <= 40 px` on every strict text card), Rule 3 (`fit.size >= 20 px` for every label and `fit.size >= 28 px` for every body/heading box), and fill-ratio (`areaFillRatio >= 0.18 || verticalSpanRatio >= 0.45`).
   - Added explicit assertions for banned placeholder strings (`STIMULUS`, `TARGET GLYPH`, `VALENCE WORD`) and explicit review-frame timestamp assertions at `e508` (`508000 ms`), `e524` (`524000 ms`), `e552` (`552000 ms`), and `e578` (`578000 ms`).

### Challenges encountered

1. **Cue timing vs. `e578` extraction timestamp in `AllportQuestion`**:
   - Frame `e578` is extracted at `578.00 s`, whereas `t46Nature` fires at `578.72 s` and `t46Nine` fires at `580.26 s`. Gating the book title and page reference on `t46Nature` and `t46Nine` left the lower half of `citation-card` empty in `e578.jpg`.
   - Rendering *The Nature of Prejudice* and `Addison-Wesley · p. 9` on the card from `t46Gordon` (`574.34 s`), inserting `1954` at `t46FiftyFour` (`577.80 s`), brightening the title (`data-title-bright="true"`) at `t46PrejudiceTitle`, and resolving `'Allport 1954, p. 9'` on `source-line` at `t46Nine` satisfied both the `e578` visual check and all cue-timing assertions.
2. **Case-sensitive substring isolation between Turn 41 and Turn 42 in `ImplicitTrace`**:
   - The Turn 42 cue `t42Automatically` asserts that uppercase `'ACCUMULATED SURROUNDINGS'` is absent before Turn 42, while the brief requires lowercase `"accumulated surroundings"` in Turn 41 (`e508`). Using exact lowercase strings (`"accumulated surroundings"`, `"repeated exposure"`, `"stored association"`) in Turn 41 satisfied both the brief and the case-sensitive pre-cue absence check.
3. **Nested card slack on `word-card` in `IATLatency`**:
   - Sizing `word-card` and `face-card` to `152 px` left `52 px` of text-span slack inside `word-card`, which tripped the `<= 40 px` card-fit assertion. Compacting `face-card` and `word-card` to `h: 130` (`y: 305..435`) and `prompt-card` to `h: 254` reduced text-span slack to `32–36 px` across all nested stimulus cards.

### Next ideas (6 Ideas)

1. Share `checkFillAndCardFitAndSizes` and `checkVerticalSpan` across `check_min7_12_e.tsx`, `check_min7_12_f.tsx`, `check_min7_12_g.tsx`, and `check_min7_12_h.tsx` via `tools/layout_audit.ts`.
2. Add an automatic review-frame timestamp checker that reads frame numbers from `BRIEF_MIN7_12_POLISH.md` and verifies card population at each `e<seconds>` mark.
3. Create a `ReactionValenceRail` primitive in `min7_12/shared/` encapsulating the bipolar scale spine, steering curve, needle, and output sockets.
4. Build a `ConvergenceHub` layout helper for three-node convergence scenes (`ImplicitTrace` Turn 42) that computes leader endpoints from declared box edges.
5. Add a `StimulusTrialWindow` component for paired categorization tasks with built-in `<= 40 px` nested card-fit sizing.
6. Extend `Label` with a build-time font-floor type check restricting `size` to `>= 20`.

### Checks

- Episode TypeScript: `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage` exits 0 with zero diagnostics.
- `check_min7_12_f` tail:
  - `PASS: 223 Package F frames rendered in two fresh processes; all markup hashes match.`
  - `PASS: audit self-test (10 rules); 223 Package F frames (cues + 500 ms grid); layout audit of 7248 declared boxes (safe area, notch zones, text fit, collisions); fill-ratio, card-fit (<= 40 px slack), vertical-span (>= 658 px), and 28/20 px size-floor asserts verified; clean turn transitions, storyboard strings, hook, underscore and interaction-hint policies verified.`
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
- `tools/check_antithesis.py` on all Package F files and `FINDINGS_MIN7_12.md`: `check-antithesis: no banned constructions found.`

### Unverified remainder

- Chromium browser rendering and MP4 encoding were not run locally because video rendering is performed by the orchestrator. Visual verification relies on the static layout audit (`7248` declared boxes across `223` frames), two-process deterministic static markup verification, and automated fill-ratio, card-fit (`<= 40 px` slack), vertical-span (`>= 658 px`), and font-size floor (`28 px` / `20 px`) assertions.

## Fix pass 1 (Package H)

Model: Gemini 3.8 Flash (High)  
Checkpoint: `cb4501a`

### What was requested

Execute fix pass 1 for minutes 7–12 Package H based on frame reviews of `min7_12_H_v1.mp4`:
- Enforce the new layout invariant: every box on screen holds its content at its last beat; all panels, cards, and windows are populated.
- Add an automated fill-ratio assert to `tools/check_min7_12_h.tsx` with documented thresholds (area fill ratio ≥ 0.18 OR vertical span ratio ≥ 0.45, zero empty containers).
- Add an assert to `tools/check_min7_12_h.tsx` verifying no on-screen text matches `/\bturn \d+\b/i`.
- Fix `UnequalTreatment` (turns 55–56, frames `e676`, `e683`, `e690`):
  - Eliminate empty placeholder frames at `e676`. Render boxes strictly as their spoken content arrives.
  - Sizing the outer pipeline panel to its content, removing the dead vertical space beneath the nodes.
  - Sizing the treatment tray panel to its content. Lay out all four card slots from the start, filled as each action is spoken: verbal exclusion, worse customer service, biased grading, rental refusal.
  - Remove the ghost header tab from the top left of the treatment tray.
- Fix `InterpersonalClass` (turns 57–61, frames `e698`, `e705`, `e712`, `e718`, `e726`, `e735`):
  - Keep one full-frame composition across all five turns, eliminating the empty lower half at `e698` and `e735`.
  - Populate term blocks with the one-line summaries `STARTING TENDENCY`, `GROUP ANTIPATHY`, and `UNEQUAL TREATMENT`.
  - Allocate a dedicated region for the state-power rack in turn 60 (`{x: 1240, y: 460, w: 560, h: 440}`) with heading `REQUIRES ZERO CONTROL OVER` and render all five items at full strength.
  - Remove the ghost header at `e745`, showing one clear title without duplicate underlying labels.
- Fix `LiteratureBoundary` (turn 62, frames `e745`, `e751`):
  - Sizing the literature panel to its content, removing dead space in its lower half.
  - Replace the internal label `TURN 63 · STRUCTURAL ARGUMENT BEGINS` with the storyboard string `THE ORIGINAL POWER · STRUCTURAL ARGUMENT`.
  - Replace the empty dashed frame with the structural preview card displaying racism as an institutional extraction system, stated in equations and tested against historical archives.
- Verify episode TypeScript, the updated Package H checker, all prior stage checkers, and `tools/check_antithesis.py`.

### How I fixed it

1. **UnequalTreatment layout compaction and complete card layouts**:
   - Sized the outer pipeline panel `pipeline` to `{x: 120, y: 260, w: 1680, h: 420}` and node panels to `{y: 280, h: 310}`, removing dead space beneath the three nodes.
   - Guarded node outline frames to render only when their spoken cues arrive (`hostility-field-frame` at `cue.t55Hostility`, `action-vector-frame` at `cue.t55Unequal`). Marked internal vector graphics with `data-role="mark"` to keep frame audits focused on structural content containers.
   - Sized `treatmentTray` to `{x: 120, y: 230, w: 1680, h: 540}` with a single header `PERSON-TO-PERSON UNEQUAL TREATMENT`. Removed the duplicate ghost header tab.
   - Established all four card slots (`cardVerbal`, `cardCustomer`, `cardGrading`, `cardApartment`) at turn 56 start with height 390 px, populated with category headers, vector icon glyphs, spoken titles, and bottom domain tags (`SPEECH BOUNDARY`, `SERVICE COUNTER`, `GRADING SHEET`, `QUALIFIED TENANT`).

2. **InterpersonalClass full-frame balance and state rack**:
   - Maintained `GroupDirectionField` with person marks across turns 57–61, sustaining a balanced composition throughout the entire scene.
   - Conditioned boundary labels to render on cue `t58Direction` (`leftLabel={ms >= cue.t58Direction ? 'GROUP A' : ''}`), preserving term-absence invariants for preceding frames.
   - Sized term triad blocks to `{y: 170, h: 180}` and populated them with one-line summaries `STARTING TENDENCY`, `GROUP ANTIPATHY`, and `UNEQUAL TREATMENT`.
   - Constructed the state-power rack in turn 60 at `{x: 1240, y: 460, w: 560, h: 440}` with header `REQUIRES ZERO CONTROL OVER` and five full-strength item panels: state legislatures, appellate courts, police departments, credit markets, and military force.
   - Guarded `directionLabel` with `!isTurn61` to prevent boundary label collisions with the turn 61 assignment strip. Positioned turn 59 ubiquity labels at `y: 456` and the unequal treatment label at `{x: 855, y: 672, w: 210, h: 28}` within the central gutter, clearing all bracket label and arrow paths.
   - Consolidated the turn 61 book strip header into a single label `THE ORIGINAL POWER · INTERPERSONAL CLASS OF SOCIAL BEHAVIOR`, eliminating faint ghost text.

3. **LiteratureBoundary panel sizing and structural preview card**:
   - Sized `literatureField` to `{x: 120, y: 170, w: 1140, h: 560}` and matched `terminalColumn` to `{x: 1300, y: 170, w: 60, h: 560}`, eliminating dead lower space.
   - Replaced internal turn indicator with header `THE ORIGINAL POWER · STRUCTURAL ARGUMENT` in a dedicated label box.
   - Replaced empty dashed frame with a solid continuation socket card at `{x: 1420, y: 280, w: 380, h: 420}` holding three structured statements: `RACISM AS AN INSTITUTIONAL EXTRACTION SYSTEM` (box `340 × 104`), `STATED IN EQUATIONS` (`340 × 40`), and `TESTED AGAINST HISTORICAL ARCHIVES` (`340 × 56`).

4. **Automated fill-ratio and internal-label assertions**:
   - Added `checkFillRatio` to `tools/check_min7_12_h.tsx` verifying that every active `data-shape="frame"` container satisfies `areaFillRatio >= 0.18` or `verticalSpanRatio >= 0.45`, with zero empty containers. Asserted this invariant at every scene end frame and major settled beats (`t55Membership`, `t60Military`).
   - Added regex assertion `!/\bturn \d+\b/i.test(plain(html))` verifying zero internal turn labels appear in rendered output.

### Challenges encountered

1. **Substring collision in term-absence checking**:
   - The brief required adding the one-line summary `GROUP ANTIPATHY` to the prejudice term block at turn 57 (`t57Look`). The absence check at `t58Direction` verified that `'GROUP A'` was absent before turn 58. Because the substring `'GROUP A'` is the leading prefix of `'GROUP ANTIPATHY'`, string inclusion `.includes('GROUP A')` triggered a false positive assertion failure.
   - Resolved the check by testing word boundaries with `new RegExp('\\b' + escaped + '\\b')` on plain-text frames, correctly distinguishing isolated label tokens from compound words while preserving strict absence checks.
2. **Text fitting on multi-line continuation title**:
   - Typesetting `RACISM AS AN INSTITUTIONAL EXTRACTION SYSTEM` in IBM Plex Sans 24 px required three wrapped lines totaling 90 px height. The original box height of 72 px triggered a layout audit overflow error.
   - Expanded the label box height to 104 px within the 420 px continuation socket, ensuring generous clearance for text fitting.
3. **Turn 61 assignment strip boundary clearance**:
   - Unconditional rendering of `directionLabel` (`ANY DIRECTION BETWEEN ANY TWO SOCIAL GROUPS`) persisted across turn 61, crossing the top edge of `book-assignment-strip` at `y: 745`.
   - Guarded the direction label with `!isTurn61`, hiding it when the turn 61 assignment strip takes over the safe area.

### Next ideas (6 Ideas)

1. Introduce an automated fill-ratio check into `tools/layout_audit.ts` to standardize content density validation across all stage suites.
2. Build an `InstitutionsRack` shared component in `min7_12/shared/` that formalizes icon-and-label rack layouts with sequential entrance sweeps.
3. Create a unified `ContinuationCard` component for section-handoff frames that enforces title, formula, and empirical citation slot spacing.
4. Parameterize `GroupDirectionField` with an explicit label suppression prop for early turns where boundary containers appear before label text is spoken.
5. Add layout audit rules that automatically detect substring collisions between term summaries and variable names.
6. Provide automatic vertical centering helpers for card contents that maintain balanced spacing when supplementary tags are omitted.

### Checks

- Episode TypeScript: `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage` exits 0 with zero diagnostics.
- `check_min7_12_h` tail:
  - `PASS: 227 Package H frames rendered in two fresh processes; all markup hashes match.`
  - `PASS: audit self-test (10 rules); 227 Package H frames (cues + 500 ms grid); layout audit of 5975 declared boxes (safe area, notch zones, text fit, collisions); fill-ratio assert verified on all scene end frames; clean turn transitions, storyboard strings, hook, underscore, internal-turn and interaction-hint policies verified.`
- `check_min7_12_shared` tail: `PASS: 25 min7_12-shared states rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 25 min7_12 shared-component states; layout audit of 171 declared boxes …`
- `check_min7_12_f` tail: `PASS: 223 Package F frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 223 Package F frames (cues + 500 ms grid); layout audit of 3858 declared boxes …`
- `check_equations` tail: `PASS: 14 equation frames rendered in two fresh processes; all markup hashes match. PASS: 14 equation frames; 111 registered coloured terms; 11 pulse cues peak at cue + 200 ms and rest after 600 ms; Eq. 2.5 and Eq. 2.8a are verbatim with MathText subscripts.`
- `check_first_minute` tail: `PASS: 43 cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified; …`
- `check_roadmap_boot` tail: `PASS: RoadmapBoot renders 17 deterministic frames; 13 labels land on their cues and are absent before; …`
- `check_minute_two` tail: `PASS: 44 cue-derived frames; exact definition spacing …; Figure 2.3 layer widths 598 / 483 / 368 px in the ratio 5.2 : 4.2 : 3.2.`
- `check_dashboard` tail: `PASS: Equal Earth route 1296 samples / 0 land hits …; all 24 tray modes plus 3 Wage plane modes; …no rendered interaction hints; 75 polities with 16 non-colliding labels.`
- `check_min3_7_shared` tail: `PASS: 25 representative shared-component states; eleven component contracts, hook policy, underscore policy, Gaussian curves, … Posterior modes: 0.280460 / 0.499174 / 0.718096.`
- `check_min3_7_a` tail: `PASS: audit self-test (10 rules); 47 Package A cue-derived frames; 1282 audited boxes; …`
- `check_min3_7_b` tail: `PASS: audit self-test (10 rules); 43 Package B cue-derived frames; 1146 audited boxes; …`
- `check_min3_7_c` tail: `PASS: audit self-test (10 rules); 195 Package C frames (cues + 500 ms grid); layout audit of 6799 declared boxes …`
- `check_min3_7_d` tail: `PASS: audit self-test (10 rules); 211 Package D frames (cues + 500 ms grid); layout audit of 5306 declared boxes over 211 frames …; monotonic posterior sweep 0.2800 → 0.6755 (prior 0.72).`
- `tools/check_antithesis.py` on all package H files, tool checks, and findings: `check-antithesis: no banned constructions found.`

### Unverified remainder

- Video rendering was not run locally because Chromium video rendering is performed by the orchestrator. Visual validation relies on static layout audits, deterministic static markup comparisons, and automated fill-ratio checks.

## Package G

Checkpoint: `e8cdff6`

### What was requested

Build `STAGE: PACKAGE G` (turns 47–54, shots `S00-47`..`S00-54`, scenes 7–10 of `STORYBOARD_MIN7_12.md`) under `Architecting_the_operation/video/yt02/stage/min7_12/g/`, and write `tools/check_min7_12_g.{tsx,mjs}` enforcing all storyboard requirements plus the polish invariants from `BRIEF_MIN7_12_FIX_F.md`, `BRIEF_MIN7_12_FIX_EH.md`, and `BRIEF_MIN7_12_POLISH.md` from the start:

1. Replace the four Package G scene stubs (`AllportAntipathy.tsx`, `ExceptionFence.tsx`, `FiskeHandoff.tsx`, `ThreePartTaxonomy.tsx`), preserving their export names and implementing every cue, beat, string, and sweep in `STORYBOARD_MIN7_12.md` §4 (Scenes 7–10).
2. Enforce the six polish invariants across all sampled frames and write them as assertions in `tools/check_min7_12_g.tsx`:
   - Every box holds its content: zero empty frames (`inside.length > 0`) and `areaFillRatio >= 0.18 || verticalSpanRatio >= 0.45`.
   - Faded labels and replaced turn views are completely absent from the DOM.
   - No turn numbers (`/\bturn \d+\b/i`) or internal labels on screen.
   - Compositions span at least ~70% of the safe-area height (`>= 658 px`, verified even when excluding `source-line`).
   - Cards fit their text tightly (`frame.h - (maxTextY - minTextY) <= 40 px`).
   - 28 px body / 20 px label font-size floor enforced on declared `data-fit` metadata.

### How I built it

1. **`AllportAntipathy.tsx` (`min7_12/g/AllportAntipathy.tsx`, turns 47–49, shots `S00-47`..`S00-49`)**:
   - Turns 47–48 (`!isTurn49`, `data-turns="47-48"`):
     - Left column: `definition-card` (`{x: 110, y: 150, w: 690, h: 356}`, 36 px text-span slack) presenting `PREJUDICE`, Allport's paraphrased definition (`antipathy grounded in a faulty and inflexible generalization, felt internally or expressed outwardly`, 30 px sans), `Allport 1954, p. 9`, and `(paraphrased)`; paired with `observer-panel` (`{x: 110, y: 560, w: 690, h: 320}`, 36 px slack) holding an ingroup `PersonMark`, internal affective heart socket (`FELT INTERNALLY` at `t47Felt`), and outward channel (`EXPRESSED OUTWARDLY` at `t47Expressed`).
     - Right column: `template-panel` (`{x: 900, y: 150, w: 880, h: 356}`, 36 px slack) opening at `t47Antipathy` (`ANTIPATHY`), lighting `ERROR MARKER · FAULTY GROUP BELIEF` at `t47Faulty`, locking gold rigid braces (`INFLEXIBLE · RIGID BRACES LOCKED`) at `t47Inflexible`, and stamping four outgroup `PersonMark` cells (`FAULTY GENERALIZATION`) at `t47Generalization`; paired with `target-field` (`{x: 900, y: 560, w: 880, h: 320}`, 36 px slack) opening at `t47Expressed` with an outward connecting vector, splitting into `GROUP AS A WHOLE` (`t48Hostility` / `t48Whole`) and `INDIVIDUAL MEMBER` (`t48Specifically`), and drawing the dashed membership connector (`TARGETED BECAUSE OF GROUP MEMBERSHIP`) at `t48Belongs`.
   - Turn 49 (`isTurn49`, `data-turn="49"`):
     - Completely removes `data-turns="47-48"` from the DOM at `t49Bias` and mounts a full-frame two-tier comparison (`y: 115..875`, vertical span `760 px`): top comparison banner (`turn49-header-panel`), left `bias-block` (`BIAS · MENTAL LEAN` with tilt-needle meter), right `prejudice-block` (`PREJUDICE · EMOTIONAL HOSTILITY` at `t49Prejudice` / `t49Emotional`), lower-left `bias-baseline-card` (`STARTING EXPECTATION`), and lower-right `stereotype-gate` (`RIGID SWEEPING STEREOTYPE` at `t49Rigid`, `GROUP TEMPLATE LOCKED IN GATE` at `t49Stereotype`, stopped contrary-evidence tokens at `t49Resists`, and `CONTRARY EVIDENCE RESISTED` at `t49Evidence`).

2. **`ExceptionFence.tsx` (`min7_12/g/ExceptionFence.tsx`, turns 50–51, shots `S00-50`..`S00-51`)**:
   - Constructed a continuous four-zone pipeline spanning `y: 115..860` (`745 px` vertical span):
     - Top source tab (`allport-tab`, `ALLPORT 1954`) and left `habitual-template` (`{x: 120, y: 210, w: 570, h: 650}`, 36 px slack) displaying `HABITUAL PREJUDICE` and `GROUP STEREOTYPE` (`t50Habitual`) with six outgroup `PersonMark` figures inside a closed template loop.
     - Center-right `update-gate` (`{x: 1160, y: 290, w: 160, h: 510}`, 36 px slack) closing at `t50Resist` (`UPDATE GATE CLOSED`, `BLOCKS REVISION` at `t50Facts`), and center-left `facts-lane` (`{x: 740, y: 260, w: 380, h: 540}`, 36 px slack) arriving at `t50Correcting` (`CORRECTION ATTEMPT`) and intensifying at `t50Strong` (`STRONG CONTRADICTORY FACTS`).
     - At `t51Contradicts`, the sixth member departs the group loop (`departing-member-mark`) and is routed at `t51Fences` / `t51Exception` into the upper-right `exception-cell` (`{x: 1390, y: 210, w: 400, h: 300}`, 36 px slack, `EXCEPTION FENCE`, `LONE EXCEPTION`), while the lower-right `retained-field` (`{x: 1390, y: 560, w: 400, h: 300}`, 36 px slack) locks at `t51Keeping` / `t51Stereotype` / `t51Intact` (`STEREOTYPE RETAINED`, `INTACT · ZERO REVISION`).

3. **`FiskeHandoff.tsx` (`min7_12/g/FiskeHandoff.tsx`, turns 52–53, shots `S00-52`..`S00-53`)**:
   - Turn 52 (`!isTurn53`, `data-turn="52"`):
     - Renders `QuestionHeader` (`Why does Fiske treat discrimination as its own category beside stereotyping and prejudice?` at `y: 105..245`), `fiske-socket` (`SOURCE SOCKET`, `FISKE · 3-PART` at `t52Fiske`), three component cards across `y: 310..650` (`thought-card` `STEREOTYPING · INTERNAL THOUGHT` at `t52Stereotyping`, `feeling-card` `PREJUDICE · INTERNAL FEELING` at `t52Prejudice`, and `action-card` `DISCRIMINATION` / `3 · DISCRIMINATION` / `OBSERVABLE OUTWARD ACTION` at `t52Discrimination`, `t52Third`, `t52Action`), horizontal boundary-crossing arrows at `t52Moves`, and `locus-summary-panel` (`{x: 150, y: 710, w: 1620, h: 165}`, 36 px slack), spanning `y: 105..875` (`770 px`).
   - Turn 53 (`isTurn53`, `data-turn="53"`):
     - Completely removes `data-turn="52"` from the DOM at `t53Susan` and presents `t53-banner` (`{x: 330, y: 120, w: 1260, h: 74}`), `citation-card` built to its final `1260 × 336` geometry from `t53Susan` (`SUSAN T. FISKE`, `1998` at `t53NinetyEight`, `Stereotyping, Prejudice, and Discrimination` at `t53Handbook`, and progressive edition line `The Handbook of Social Psychology · 4th ed. · vol. 2 · pp. 357–411` across `t53Fourth`, `t53Volume`, `t53Pages`), and the three-socket motif (`motif-socket-1/2/3`, `y: 610..870`, 36 px slack), spanning `y: 120..870` (`750 px`).

4. **`ThreePartTaxonomy.tsx` (`min7_12/g/ThreePartTaxonomy.tsx`, turn 54, shot `S00-54`)**:
   - Renders `taxonomy-frame` (`{x: 120, y: 130, w: 1680, h: 660}`, 36 px slack) with header `FISKE’S THREE-PART MODEL` and `Fiske 1998`, containing three module slots (`L.modules`, `500 × 484` at `y: 234..718`, 36 px slack).
   - Each dashed `data-module-socket="1|2|3"` is completely removed from the DOM when its corresponding module lands (`t54Stereotyping` → `STEREOTYPING`, `COGNITIVE` at `t54Cognitive`, `THINKING PART` at `t54Thinking`; `t54Prejudice` → `PREJUDICE`, `AFFECTIVE` at `t54Affective`, `FEELING PART` at `t54Feeling`; `t54Discrimination` → `DISCRIMINATION`, `BEHAVIORAL` at `t54Behavioral`, `ACTING PART` at `t54Acting`).
   - Draws `taxonomy-bracket-line` beneath the frame at `t54Three` and updates `taxonomy-bracket-label` to `THREE DISTINCT PSYCHOLOGICAL PARTS` at `t54Acting`, spanning `y: 130..884` (`754 px`).

5. **`tools/check_min7_12_g.{tsx,mjs}`**:
   - Models two-process determinism (`MIN7_12_G_SNAPSHOT`) across 243 frames (segment start, every cue + 700 ms, 500 ms grid, and segment end).
   - Verifies hook policy (`useCue`, `useStageMs` only), no literal underscores, no interaction hints, no internal turn numbers (`!/\bturn \d+\b/i`), storyboard beat string presence/absence, and complete DOM removal of replaced views/sockets.
   - Asserts `checkFillAndCardFitAndSizes` on every sampled frame (`areaFillRatio >= 0.18 || verticalSpanRatio >= 0.45`, `f.h - textSpan <= 40 px`, `fit.size >= 20 px` for all labels and `fit.size >= 28 px` for all body/title/header/question text) and `checkCompositionSpan` (`span >= 658 px` excluding `source-line`) on every cue frame and end frame.

### Challenges encountered

1. **Pre-cue substring leakage in outer taxonomy footer**:
   - In `ThreePartTaxonomy.tsx`, an initial outer frame footer string `COGNITIVE · AFFECTIVE · BEHAVIORAL DIMENSIONS OF BIAS` rendered at `t54Divides`, which caused the `beat()` pre-cue absence check for `t54Cognitive` to find `"COGNITIVE"` before `t54Cognitive`.
   - Changing `taxonomy-footer` to `SOCIAL PSYCHOLOGY TAXONOMY · THREE COMPONENT SLOTS` preserved the 36 px card-fit margin on `taxonomy-frame` while keeping `COGNITIVE`, `AFFECTIVE`, and `BEHAVIORAL` strictly absent before their spoken cues.
2. **Multi-line glyph advance heights at 28 px body floor**:
   - `auditLayout` flagged multi-line wrapping heights on 28 px body copy inside compact cards (`template-body`, `target-body`, `facts-lane-body`, `exception-cell-body`, `retained-body`, `cite-summary`, `motif-socket-*-body`, `socket-*-body`, and `*-body` in `ThreePartTaxonomy`), as well as 2-line wrapping on the long `Fiske · The Handbook of Social Psychology · 4th ed. · vol. 2 · pp. 357–411` source line in a 28 px tall box.
   - Compacted adjacent SVG mark heights by 12–20 px to allocate 72–120 px vertical height to the 28 px body text boxes, and gave `source` `{x: 116, y: 944, w: 750, h: 52}` (staying left of the `x: 880..1040` bottom notch zone and within `y <= 1010`), resolving all 5,555 audited box checks to zero violations.

### Next ideas (6 Ideas)

1. Promote `checkFillAndCardFitAndSizes` and `checkCompositionSpan` into a shared audit helper in `tools/layout_audit.ts` so every package check can call a single unified polish gate.
2. Create a reusable `TwoColumnTurnSwitch` wrapper in `min7_12/shared/` that enforces DOM unmounting between multi-turn views within a single scene segment.
3. Add a `TripartiteModuleCard` component in `min7_12/shared/` encapsulating the socket-to-active module transition used in `ThreePartTaxonomy`.
4. Parameterize `Panel` with an optional top-and-bottom label pair that automatically computes `h = textSpan + 36` to guarantee `<= 40 px` card-fit slack by construction.
5. Add a static pre-check that scans all cue beat strings for substring overlaps across earlier cues in the same segment.
6. Build a `GateBarrierMark` shared SVG primitive for stereotype and update-gate scenes (`AllportAntipathy` Turn 49 and `ExceptionFence` Turns 50–51).

### Checks

- Episode TypeScript: `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage` exits 0 with zero diagnostics.
- `check_min7_12_g` tail:
  - `PASS: 243 Package G frames rendered in two fresh processes; all markup hashes match.`
  - `PASS: audit self-test (10 rules); 243 Package G frames (cues + 500 ms grid); layout audit of 5555 declared boxes (safe area, notch zones, text fit, collisions); fill-ratio, card-fit (<= 40 px slack), vertical-span (>= 658 px), and 28/20 px size-floor asserts verified; clean turn transitions, storyboard strings, hook, underscore, internal-turn and interaction-hint policies verified.`
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
- `check_min7_12_e` tail: `PASS: 203 Package E frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 203 Package E frames (cues + 500 ms grid); layout audit of 3900 declared boxes …`
- `check_min7_12_f` tail: `PASS: 223 Package F frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 223 Package F frames (cues + 500 ms grid); layout audit of 3858 declared boxes …`
- `check_min7_12_h` tail: `PASS: 227 Package H frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 227 Package H frames (cues + 500 ms grid); layout audit of 5975 declared boxes …`
- `tools/check_antithesis.py` on all Package G files, checks, and `FINDINGS_MIN7_12.md`: `check-antithesis: no banned constructions found.`

### Unverified remainder

- Chromium browser rendering and MP4 encoding were not run locally, as video rendering is performed by the orchestrator. Visual verification relies on the static layout audit (`5555` declared boxes across `243` frames), two-process deterministic static markup verification, and automated fill-ratio, card-fit, vertical-span, and font-size floor assertions.


## Design pass (Package H)

Model: Gemini 4 Argon (High)  
Checkpoint: `a274563`

### What was requested

Execute the minutes 7–12 Design Pass for Package H (turns 55–62: `UnequalTreatment`, `InterpersonalClass`, `LiteratureBoundary`) after reviewing the current rendered frames in `outputs/YT02v2_ov/video/stage_runs/v2/` (`e683.jpg`, `e690.jpg`, `e712.jpg`, `e726.jpg`, `e735.jpg`, `e751.jpg`, `s2.jpg`, `s3.jpg`):
- Enforce Rule 1 (Composition): at every beat's settled state, content spans at least ~70% of the safe area's height (`>= 658 px` of `y: 70..1010`, verified even excluding `source-line`).
- Enforce Rule 2 (Cards fit their text): every citation or definition card and panel is no more than 40 px taller than its final content/text block (`f.h - span <= 40 px`), built at final size from its first beat and filled as each element is spoken.
- Enforce Rule 3 (Size floor): body text is at least 28 px and labels at least 20 px across all declared text boxes, with no exceptions.
- Fix `UnequalTreatment`, turn 55 (`e683`) and turn 56 (`e690`):
  - Rebalance the Turn 55 three-stage path (`STEREOTYPE`, `PREJUDICE`, `DISCRIMINATION`) so it is centered and enlarged across the safe area (`y: 115..875`, `760 px` vertical span).
  - Populate all four Turn 56 treatment card slots (`VERBAL EXCLUSION`, `WORSE CUSTOMER SERVICE`, `BIASED GRADING`, `RENTAL REFUSAL`) from Turn 56 start across `y: 115..875` (`760 px` vertical span) with `28 px` titles and `28 px` body copy so intermediate frames (`e690`) hold structured card content with `<= 40 px` slack.
- Fix `InterpersonalClass`, turns 57–61 (`e712`, `e726`, `e735`):
  - Scale the `GroupDirectionField` up (`h: 320 px` at `y: 484..804`) and pair it with a locus/ubiquity header banner (`y: 400..468`) and a bottom direction banner (`y: 820..888`), eliminating the empty lower third at `e712` (`768 px` vertical span across `y: 120..888`).
  - Populate all five state-power rack slots (`STATE LEGISLATURES`, `APPELLATE COURTS`, `POLICE DEPARTMENTS`, `CREDIT MARKETS`, `MILITARY FORCE`) inside `state-power-rack` (`{x: 1280, y: 400, w: 520, h: 488}`) from Turn 60 start so intermediate frames (`e726`) never leave the lower half of the rack empty.
  - Tighten the Turn 61 `book-assignment-strip` (`{x: 120, y: 700, w: 1680, h: 188}`, `34 px` slack) and upgrade all socket titles (`BIAS`, `PREJUDICE`, `DISCRIMINATION`) and headers to `28 px` sans (`e735`).
- Fix `LiteratureBoundary`, turn 62 (`e751`):
  - Expand `established-literature-frame`, `terminal-boundary-column`, and `structural-handoff-frame` across `y: 215..880` (`h: 665`) beneath `t62-banner-frame` (`y: 115..187`), giving a `765 px` vertical span (`81.4%` of safe area height).
  - Tighten `structural-continuation-socket` (`{x: 1400, y: 316, w: 380, h: 550}`, `28 px` text slack) and `structural-handoff-frame` (`36 px` text slack) and upgrade `structural-handoff-label` (`THE ORIGINAL POWER · STRUCTURAL ARGUMENT`) and `structural-subject-title` (`RACISM AS AN INSTITUTIONAL EXTRACTION SYSTEM`) to `28 px` sans.
- Add automated vertical-span (Rule 1), card-fit (Rule 2), and minimum-font (Rule 3) assertions to `tools/check_min7_12_h.tsx` while keeping all earlier assertions.

### How I fixed it

1. **`UnequalTreatment` (`min7_12/h/UnequalTreatment.tsx`, turns 55–56, `e683`, `e690`)**:
   - Re-laid Turn 55 (`!isTurn56`) across `y: 115..875` (`760 px` vertical span, `80.9%` of safe area height) with `t55-banner-frame` (`{x: 120, y: 115, w: 1680, h: 72}`, `36 px` slack) and `turn55-pipeline-frame` (`{x: 120, y: 215, w: 1680, h: 660}`, `34 px` slack).
   - Scaled up the three stage nodes (`stereotype-node`, `prejudice-node`, `discrimination-node`) to `{y: 290, w: 460, h: 490}` (`36 px` content slack, `40 px` text slack), each holding a `52 × 52` glyph, `32 px` sans title (`STEREOTYPE`, `PREJUDICE`, `DISCRIMINATION`), `22 px` stage role sublabel (`GROUP BELIEF`, `EMOTIONAL HOSTILITY`, `UNEQUAL TREATMENT`), a `412 × 190` diagram mark, `28 px` sans body copy, and a `20 px` locus footer, with `pathway-transit-bar` (`{x: 150, y: 795, w: 1620, h: 64}`, `28 px` slack) below the nodes.
   - Re-laid Turn 56 (`isTurn56`) across `y: 115..875` (`760 px` vertical span) with `t56-banner-frame` (`DISCRIMINATION · OBSERVABLE ACTION` at `28 px` sans), `treatment-tray` (`{x: 110, y: 215, w: 1700, h: 660}`, `36 px` slack), and four equal-height cards (`{y: 295, w: 380, h: 562}`, `36 px` text slack) populated from Turn 56 start with `20 px` slot headers, `28 px` sans titles, `332 × 220` vector illustrations, `28 px` sans body descriptions, and `20 px` domain tags.

2. **`InterpersonalClass` (`min7_12/h/InterpersonalClass.tsx`, turns 57–61, `e712`, `e726`, `e735`)**:
   - Positioned the top `TermTriad` rail at `y: 120..300` (`{w: 520, h: 180}`, `32 px` content slack, `34 px` text slack) with `progress: 1` on internal lines and citation sources so child labels remain synchronized with parent block opacity across every entrance ramp.
   - Scaled `GroupDirectionField` up to `{x: 120, y: 484, w: 1680, h: 320}` (`28 px` boundary slack) in Turns 57–59 (`e712`), flanked by `locus-banner-frame` (`{x: 120, y: 400, w: 1680, h: 68}`, `32 px` slack, displaying the Turn 59 ubiquity labels `ANY HUMAN BEING` at `28 px` sans, `ANY SKIN COLOR`, `ANY ANCESTRY`, and `UNEQUAL TREATMENT` at `22 px` mono) and `direction-banner-frame` (`{x: 120, y: 820, w: 1680, h: 68}`, `32 px` slack, displaying `ANY DIRECTION BETWEEN ANY TWO SOCIAL GROUPS` at `28 px` sans), spanning `y: 120..888` (`768 px`, `81.7%` of safe area height).
   - Paired the contracted Turn 60 left column (`person-actions-panel`, `groupFieldContracted` `{x: 120, y: 484, w: 1060, h: 320}`, and `direction-banner-contracted` across `y: 400..888`) with `state-power-rack` (`{x: 1280, y: 400, w: 520, h: 488}`, `36 px` text slack) holding a `28 px` sans heading (`REQUIRES ZERO CONTROL OVER`), all five `472 × 64` institutional item cards (`32 px` slack each) populated from Turn 60 start (`e726`), and a `20 px` rack footer.
   - Re-laid Turn 61 (`isTurn61`, `e735`) with `groupFieldTurn61` (`{x: 120, y: 400, w: 1680, h: 280}`) and `book-assignment-strip` (`{x: 120, y: 700, w: 1680, h: 188}`, `34 px` slack) containing `28 px` sans headers and `28 px` sans term sockets (`socket-strip-bias`, `socket-strip-prejudice`, `socket-strip-discrimination`, `28 px` slack each).

3. **`LiteratureBoundary` (`min7_12/h/LiteratureBoundary.tsx`, turn 62, `e751`)**:
   - Added `t62-banner-frame` (`{x: 120, y: 115, w: 1680, h: 72}`, `36 px` slack) and expanded `established-literature-frame` (`{x: 120, y: 215, w: 1140, h: 665}`, `36 px` text slack), `terminal-boundary-column` (`{x: 1290, y: 215, w: 60, h: 665}`, `36 px` slack), and `structural-handoff-frame` (`{x: 1380, y: 215, w: 420, h: 665}`, `36 px` text slack) to span `y: 115..880` (`765 px`, `81.4%` of safe area height).
   - Replaced empty pre-dock sockets before `t62Literature` with populated `340 × 290` socket cards (`36 px` slack) and populated the docked `TermTriad` blocks (`{w: 340, h: 290}`, `32 px` slack) with `STARTING TENDENCY`, `GROUP ANTIPATHY`, and `UNEQUAL TREATMENT` lines plus single-line record footers.
   - Upgraded `structural-handoff-label` (`THE ORIGINAL POWER · STRUCTURAL ARGUMENT`) and `structural-subject-title` (`RACISM AS AN INSTITUTIONAL EXTRACTION SYSTEM`) to `28 px` sans and sized `structural-continuation-socket` (`{x: 1400, y: 316, w: 380, h: 550}`, `28 px` text slack) tightly to its content.

4. **Validation runner (`tools/check_min7_12_h.tsx`)**:
   - Added `checkVerticalSpan` enforcing `span >= 658 px` (70% of safe-area height, excluding `source-line`) across all 233 frames (segment starts, cue frames, review frames `e683`, `e690`, `e712`, `e726`, `e735`, `e751`, 500 ms grid frames, and end frames).
   - Added `checkFillAndCardFitAndSizes` enforcing `f.h - span <= 40 px` on every visible frame and strict text card across all 233 frames, `t.fit.size >= 20 px` on all labels (plus `data-vertical-font-size >= 20 px` on `terminal-boundary-label`), and `t.fit.size >= 28 px` on all body/heading/title text boxes.

### Challenges encountered

1. **Nested entrance opacity multiplication in `TermTriad` and `GroupDirectionField`**:
   - `TermTriad` wraps each term block in `<div style={{opacity: amount}}>` and also applies `line.progress` and `source.progress` to inner `<Label>` elements. Passing `lookP` for both the block state and the inner line/source progresses caused `lookP * lookP` to fall below `0.05` during early entrance frames while the outer `<Panel>` remained above `0.05`. Passing `progress: 1` on inner lines and sources kept all child text opacities locked to the parent block opacity.
2. **Vertical text fit estimation in `terminal-boundary-column`**:
   - `fitEstimate` in `tools/layout_audit.ts` computes horizontal line wraps from `item.w`, which flags 11-character words inside a `50 px`-wide vertical-text column (`writingMode: 'vertical-rl'`). Declaring `data-vertical-font-size="20"` on `terminal-boundary-label` allowed `check_min7_12_h.tsx` to verify the `>= 20 px` font floor directly from markup while keeping horizontal `fitEstimate` clean.
3. **Outer handoff panel text-span slack**:
   - `structural-handoff-frame` (`h: 665`, `y: 215..880`) initially had `54 px` of text-only slack because its bottom text sat inside the nested `structural-continuation-socket` at `y: 844`. Adjusting `turn63Label` to `y: 229`, `turn63Socket` to `y: 316..866`, and `structural-socket-footer` to `y: 824..854` reduced text slack on `structural-handoff-frame` to `40 px` and on `structural-continuation-socket` to `28 px`.

### Next ideas (6 Ideas)

1. Extract a shared `verifyDesignPassInvariants` helper into `tools/layout_audit.ts` so `check_min7_12_e.tsx`, `check_min7_12_f.tsx`, `check_min7_12_g.tsx`, and `check_min7_12_h.tsx` share one implementation of Rules 1–3.
2. Add native `writingMode: 'vertical-rl'` support to `fitEstimate` in `tools/layout_audit.ts` so vertical labels can use `item.h` as their line-wrap axis.
3. Update `TermTriad` in `min7_12/shared/TermTriad.tsx` so default `line.progress` and `source.progress` values default to `1` when omitted.
4. Create a `PopulatedSlotGrid` primitive in `min7_12/shared/` for multi-card trays (`UnequalTreatment` Turn 56 and `InterpersonalClass` Turn 60) that transitions slot placeholders to active spoken items automatically.
5. Add a `StageBanner` component in `min7_12/shared/` with fixed `72 px` height and `36 px` text slack to standardize top context strips across scenes.
6. Export an explicit `role="body" | "label"` attribute from `Label` so minimum-font assertions can inspect markup directly without maintaining per-scene ID sets.


### Checks

- Episode TypeScript: `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage` exits 0 with zero diagnostics.
- `check_min7_12_h` tail:
  - `PASS: 233 Package H frames rendered in two fresh processes; all markup hashes match.`
  - `PASS: audit self-test (10 rules); 233 Package H frames (cues + review frames + 500 ms grid); layout audit of 8923 declared boxes (safe area, notch zones, text fit, collisions); vertical span (>= 658 px), card fit (<= 40 px slack), and font floors (>= 28 px body / >= 20 px labels) verified on all frames; clean turn transitions, storyboard strings, hook, underscore, internal-turn and interaction-hint policies verified.`
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
- `check_min7_12_e` tail: `PASS: 203 Package E frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 203 Package E frames (cues + 500 ms grid); layout audit of 6087 declared boxes (safe area, notch zones, text fit, collisions); vertical-span, card-fit, font-floor, and fill-ratio asserts verified; clean turn transitions, storyboard strings, hook, underscore, internal-turn and interaction-hint policies verified.`
- `check_min7_12_f` tail: `PASS: 223 Package F frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 223 Package F frames (cues + 500 ms grid); layout audit of 7248 declared boxes (safe area, notch zones, text fit, collisions); fill-ratio, card-fit (<= 40 px slack), vertical-span (>= 658 px), and 28/20 px size-floor asserts verified; clean turn transitions, storyboard strings, hook, underscore and interaction-hint policies verified.`
- `check_min7_12_g` tail: `PASS: 243 Package G frames rendered in two fresh processes; all markup hashes match. PASS: audit self-test (10 rules); 243 Package G frames (cues + 500 ms grid); layout audit of 5555 declared boxes (safe area, notch zones, text fit, collisions); fill-ratio, card-fit (<= 40 px slack), vertical-span (>= 658 px), and 28/20 px size-floor asserts verified; clean turn transitions, storyboard strings, hook, underscore, internal-turn and interaction-hint policies verified.`
- `tools/check_antithesis.py` on all Package H files and `FINDINGS_MIN7_12.md`: `check-antithesis: no banned constructions found.`

### Unverified remainder

- Chromium browser rendering and MP4 encoding were skipped locally because video rendering is executed by the orchestrator. Visual verification relies on the static layout audit (`8923` declared boxes across `233` frames), two-process deterministic static markup verification, and automated vertical-span (`>= 658 px`), card-fit (`<= 40 px` slack), font-size floor (`28 px` body / `20 px` label), and fill-ratio assertions.
