# Minutes Three to Seven Findings

## Foundation

Model: GPT-5 Codex

### Request

Build the shared component foundation specified in `STORYBOARD_MIN3_7.md` §3. Preserve deterministic rendering, dashboard tokens, the 1920 × 1080 stage frame, IBM Plex typography, and real mathematical subscripts.

### Props contracts

- `StageSceneFrame({segment, title?, source?, children})` renders the fixed stage field, `SceneBorder`, an optional title, an optional source line, and scene content.
- `SourceLine({text, x?, y?, tone?})` renders a positioned 20 px IBM Plex Mono source treatment. `tone` accepts `muted`, `soft`, `accent`, or a token/color string.
- `TermBlock({term, summary?, glyph, state, accent, unit?})` renders a reusable analytical term panel. `state` accepts `hidden`, `dim`, `active`, `selected`, or a numeric progress value.
- `DefinitionCard({term, definition, source, paraphrased, progress, accent})` renders a progressive definition plate with explicit source and paraphrase metadata.
- `CitationCard({authors, year, title, progress, compact?})` renders a full or compact bibliographic card.
- `UsThemSortingField({marks, partitionProgress, ingroupProgress, outgroupProgress, labels, mode})` renders a deterministic social field with a moving group boundary. Marks use normalized or local field coordinates. Labels accept an ingroup string, an outgroup string, and an optional boundary string.
- `PersonMark({x, y, group, emphasis, scale})` renders one fixed person glyph. `group` accepts `neutral`, `ingroup`, or `outgroup`.
- `NeuralField({layers, inputs, weights, activationProgress, compressionProgress, labels})` renders a deterministic feed-forward network. `layers` accepts a layer count or node counts. `inputs`, `weights`, and `labels` accept readonly arrays.
- `PredictiveUpdatePlot({evidenceMean, priorMean, precision, showEquation, termHighlight, posteriorProgress})` renders evidence, prior, and posterior Gaussian curves on a normalized axis. `termHighlight` accepts `evidence`, `prior`, `posterior`, `equation`, or `none`.
- `PrecisionGauge({value, derived, label, lowLabel, highLabel})` renders a normalized precision track with an optional derived-status label.
- `TrainingTextStrip({tokens, patternKey, progress, emphasis})` renders a deterministic token stream with repeated-pattern emphasis. `emphasis` accepts a token index, token string, or readonly token list.

### Predictive precision mapping

The plot clamps the normalized precision input to the interval [0, 1]. Evidence precision is fixed at 18. Prior precision uses `18 × (0.001 + α / (1.05 − α))`. The small floor keeps the displayed prior Gaussian finite at zero. At α = 0, the posterior mode differs from the evidence mode by less than 0.1% of their separation. At α = 1, the posterior retains less than 4.8% of the evidence-to-prior separation. The posterior mean is `(μₑτₑ + μₚτₚ) / (τₑ + τₚ)`, and posterior precision is `τₑ + τₚ`.

### Checks

- Shared checker tail: `PASS: 25 shared-foundation states rendered in two fresh processes; all markup hashes match.`
- Shared assertions tail: `PASS: 25 representative shared-component states; eleven component contracts, hook policy, underscore policy, Gaussian curves, posterior weighted-product formula, endpoint bounds, midpoint bound, and monotonic precision sweep verified. Posterior modes: 0.280460 / 0.499174 / 0.718096.`
- Episode TypeScript tail: exit 0 with no diagnostics.
- First-minute tail: `PASS: 43 cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified.`
- RoadmapBoot tail: `PASS: RoadmapBoot renders 17 deterministic frames; 13 labels land on their cues and are absent before; no literal underscores; no interaction hints.`
- Minute-two tail: `PASS: 44 cue-derived frames; exact definition spacing, geometry, scene contracts, hook policy, underscore policy, and interaction-hint policy verified.`
- Dashboard tail: `PASS: Equal Earth route 1296 samples / 0 land hits; 18 deterministic timeline states; all 24 tray modes plus 3 Wage plane modes; no literal underscore text; no rendered interaction hints.`
- Plan compile tail: `wrote /tmp/stage_plan_min3_7_foundation.json`; `cmp` returned exit 0 against `ov/stage_plan.json`.
- Prose scan tail: `check-antithesis: no banned constructions found.` for every written TypeScript, TSX, MJS, and Markdown file.
- Repository prose target tail: `check-antithesis: no files to scan` because this foundation consists of newly added paths relative to `HEAD`.

### Challenges encountered

1. The component contract listed conceptual props. The implementation supplies exported TypeScript shapes for package-facing stability.
2. The zero-precision endpoint requires a finite display curve and an evidence-aligned posterior. A 0.001 precision-ratio floor supplies both properties.
3. The static check exercises `SceneBorder` within clock and plan providers. The first prose-check invocation passed a directory to a file-oriented checker; the completed run expands every written path into individual files.

### Next ideas

1. Add story-level geometry checks after Packages A–D define their final layout constants.
2. Add focused visual regression frames for the three posterior precision states.
3. Add an accessibility review for semantic labels on SVG diagrams.
4. Add package-level fixtures that reuse the foundation checker states.
5. Add a shared curve legend placement helper if both Package D scenes use identical geometry.
6. Add a deterministic mark-layout generator when a later scene needs larger social fields.
