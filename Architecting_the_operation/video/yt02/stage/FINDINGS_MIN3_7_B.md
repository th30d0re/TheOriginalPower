# Minutes Three to Seven Findings — Package B

Model: GPT-5 Codex

## Package B

### Request

Build `LiteratureHandoff`, `APAGroupDefinitions`, and `TajfelCitation` from `STORYBOARD_MIN3_7.md`, using the committed shared foundation and the real multi-shot plan segments.

### Foundation contract used

Package B uses `StageSceneFrame`, `DefinitionCard`, `CitationCard`, `UsThemSortingField`, and `PersonMark` from `min3_7/shared`. The storyboard also names `LiteratureBoundary` and `AllocationTray`. Those components are absent from the foundation export contract, so Package B supplies local deterministic equivalents inside its own scene files.

### Implementation status

Complete.

### What I built

#### `LiteratureHandoff`

- `t17Social` reveals the established-social-psychology header and three source-card frames.
- `t17Three` reveals Bias, Prejudice, and Discrimination together.
- `t17Distinct` gives each card a separate gold socket.
- `t17Definitions` resolves the three approved definitions and their source lines.
- `t17Experimental` labels Bias as experimental psychology.
- `t17Psychology` labels Prejudice and Discrimination as social psychology and draws the gold literature boundary.
- `t18Preface` introduces the book dock and its `LITERATURE HANDOFF` label.
- `t18Chapter` adds `PREFACE + CHAPTER 2`.
- `t18Original` adds `THE ORIGINAL POWER`.
- `t18Established` extends the three independent literature channels into the dock.
- `t18Each` reveals the three named analytical jobs.
- `t18Job` completes the lock trace and adds `Established definitions enter the book directly.`

The implementation uses `DefinitionCard` for all three source-backed cards. The three cards remain visible across turns 17 and 18, preserving one continuous picture.

#### `APAGroupDefinitions`

- `t19Baseline` introduces 21 fixed person marks, including the identified center mark.
- `t19Sort` moves every mark through a fixed trajectory into three loose clusters.
- `t19American` introduces the APA source card.
- `t19Ingroup` reveals the ingroup definition and expands the gold group boundary to a 285 px radius.
- `t19Membership` connects the enclosed marks to the center and adds `MEMBERSHIP`.
- `t19Identification` adds the identification ring and `PSYCHOLOGICAL IDENTIFICATION`.
- `t20Reference` changes the card to the outgroup definition.
- `t20Outgroup` outlines every exterior mark.
- `t20Outside` shades the exterior field and adds `OUTSIDE THE PERSON’S GROUP`.
- `t20Detachment`, `t20Competition`, and `t20Opposition` add the three relation examples in sequence.
- `t21American` changes the card to the ingroup-bias definition.
- `t21Bias` fills the own-group marks in gold.
- `t21Tendency` draws the own-group tendency arrow.
- `t21Resources` opens the derived-illustration tray and routes twelve fixed tokens, eight inward and four outward.
- `t21Conduct` adds identical conduct marks with warm and cool evaluation frames.
- `t21Behavior` adds the two explanation paths and the favorable own-group path.

The field uses `PersonMark` from the shared foundation. All trajectories and target positions are precomputed at module scope. The resource panel carries `DERIVED ILLUSTRATION` and presents the storyboard’s illustrative 8/4 allocation as a visual example.

#### `TajfelCitation`

- `t22Henri` reveals `HENRI TAJFEL` and the citation plate.
- `t22Turner` completes `HENRI TAJFEL · JOHN C. TURNER`.
- `t22Formalized` draws the gold rule into the year socket.
- `t22SeventyNine` reveals the `1979` medallion.
- `t22Social` begins the title with `AN INTEGRATIVE`.
- `t22Theory` completes `AN INTEGRATIVE THEORY OF INTERGROUP CONFLICT`.
- `t22Relations` draws the outgoing connector toward turn 23.

The implementation uses the shared `CitationCard` as the citation plate and stages the names, year, and title in the storyboard’s named layout regions.

### Layout geometry

- Literature header: x 150–1770, y 105–190.
- Literature cards: x 160–570, 755–1165, and 1350–1760; y 265–650.
- Literature boundary: x 135–1785, y 710.
- Book dock: x 400–1520, y 770–940.
- APA definition card: x 110–760, y 130–920.
- APA sorting field: x 830–1790, y 130–920.
- APA field center: x 1310, y 525 on the full canvas.
- APA group-boundary radius: 285 px.
- APA allocation tray: x 900–1710, y 650–855.
- Tajfel citation plate: x 330–1590, y 190–850.
- Tajfel names line: x 440–1480, y 290–370.
- Tajfel year medallion: x 440–660, y 440–650.
- Tajfel title block: x 720–1470, y 430–680.
- Tajfel outgoing connector: x 1470–1780, y 555.

The package checker verifies containment and pairwise separation for the declared text boxes. The allocation tray intentionally occupies the lower region of the APA sorting field, following the storyboard.

### Shared API workarounds

1. The foundation exports no `LiteratureBoundary`. `LiteratureHandoff.tsx` draws a package-local deterministic gold boundary at y 710.
2. The foundation exports no `AllocationTray`. `APAGroupDefinitions.tsx` defines a package-local deterministic tray in the storyboard’s x 900–1710, y 650–855 region.
3. The shared `UsThemSortingField` exposes a vertical partition. The APA scene requires a circle centered at x 1310, y 525 with a radius sweep from 0 to 285. The package builds that radial field locally and uses the shared `PersonMark` glyph throughout.
4. The shared `DefinitionCard` renders its metadata tag as `PARAPHRASED`. The storyboard requires `(paraphrased)`. The package passes `paraphrased={false}` and places the exact approved string inside the card wrapper.

### Checker coverage

`check_min3_7_b.tsx` renders each real plan segment at its start, every package cue plus 700 ms, and the final frame. It asserts:

- two-process deterministic markup;
- the permitted scene-hook set;
- deterministic source paths;
- literal-underscore policy;
- interaction-hint policy;
- storyboard-string timing and absence before each named beat;
- the 21-mark fixed field and its specified center and radius;
- eight inward and four outward resource tokens;
- card, field, tray, citation, and declared text-box geometry.

### Challenges encountered

1. The shared sorting field implements a vertical boundary, while turns 19–21 specify a radial membership boundary. A local radial SVG supplies the required geometry and keeps the shared person glyphs.
2. The turn-21 tray must preserve three successive functions. Each panel enters at its own cue and remains visible through the scene’s last frame.
3. The source cards sit above the literature boundary while the dock sits below it. Separate socket and channel phases preserve the visual handoff and keep card text clear.

### Checks

- Package B determinism tail: `PASS: 43 Package B frames rendered in two fresh processes; all markup hashes match.`
- Package B assertions tail: `PASS: 43 Package B cue-derived frames; storyboard strings, deterministic geometry, 8/4 derived allocation, hook policy, underscore policy, interaction-hint policy, and text-box layout verified.`
- Episode TypeScript: exit 0 with no diagnostics.
- First-minute tail: `PASS: 43 cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified; fix-pass-1 geometry: DictionaryEntry gutter x 985 clear of panel edge 965 with chain at 1050; WhyLadder header/column aligned at x 240; LiteratureStack boundary y 780 and elbow connectors clear of all block text boxes.`
- RoadmapBoot tail: `PASS: RoadmapBoot renders 17 deterministic frames; 13 labels land on their cues and are absent before; console box 580–1340 × 150–790 clears stacks (317 / 1671) and tray (944); panels 12, 9, 14 light on items 06, 09, 10 with wires; item11 sweep complete by +1300 (map opacity 1); item12 pulse present; console collapsed by roadmapEnd+600; era strip empty throughout; Era clock on standby and map outline-only ("1486", "LISBON", "PORTUGAL", "RUNTIME LOG" absent from every frame); no literal underscores; no interaction hints.`
- Minute-two tail: `PASS: 44 cue-derived frames; exact definition spacing through plain text-node separators, opaque node masking, non-crossing network wires, moving-target flight text hand-off across ten samples, centered final plate, tapered gold outline, scene contracts, hook policy, underscore policy, and interaction-hint policy verified; rail x 120–420 clear of card x 480; Figure 2.3 layer widths 598 / 483 / 368 px in the ratio 5.2 : 4.2 : 3.2.`
- Dashboard tail: `PASS: Equal Earth route 1296 samples / 0 land hits, bounds 540.14..821.86 × 84.29..843.36 above tray y=860; Portugal height 102.18px mainland (136.7px with 1486 Moroccan enclave); 18 deterministic timeline states; 5-panel right stack + 8-cell tray geometry; all 24 tray modes plus 3 Wage plane modes; 18 declared layouts ≤ 828px; no literal underscore text; shared 601-point Thyristor traces; Backlash static active preset; gear-only settings; no rendered interaction hints; 75 polities with 16 non-colliding labels.`
- Plan compile tail: `wrote /tmp/stage_plan_min3_7_b.json`; `cmp` confirmed byte identity with `ov/stage_plan.json`.
- Prose scan tail: `check-antithesis: no banned constructions found.` for every Package B file.

### Next ideas

1. Add a stable visual-regression frame for the fully expanded ingroup boundary.
2. Add a visual-regression frame for the three-panel allocation tray.
3. Promote a radial mode into the shared sorting-field API if a later episode repeats this geometry.
4. Promote the local allocation tray after a second scene establishes a reusable contract.
5. Add semantic SVG labels for the relation arrows during the accessibility pass.
6. Review the turn-22 outgoing connector beside the Package C opening frame after integration rendering.
