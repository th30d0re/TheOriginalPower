# Minutes Three to Seven Findings — Package A

Model: GPT-5 Codex

## Package A

### What was requested

Build turns 11–16 from `STORYBOARD_MIN3_7.md` as three deterministic scenes: `SequenceAsTheory`, `HeartsAudit`, and `TermsInOneBucket`. Preserve the registered export names, use the frozen shared-component contracts, land every visual beat on its compiled cue, and add a package-specific deterministic static-markup checker.

### How I implemented it

- Read the minute-one and minute-two contracts and the Package A storyboard sections.
- Read the frozen foundation contracts in `FINDINGS_MIN3_7.md` without changing that file.
- Confirmed the real segment and cue timings in `ov/stage_plan.json`.
- Confirmed that turn 16 cue order places `t16Distinct` and `t16Terms` before `t16Bucket`; the implementation follows the compiled plan while retaining the final four-channel analytical state.
- Replaced all three Package A stubs and preserved the registered export names.
- Added `PackageAVisuals.tsx` for deterministic icons, causal arrows, scan lines, panel styling, and entrance helpers.
- Built `SequenceAsTheory` as a continuous Figure 2.3 transformation. The numbered rail, causal claim, Eq. 2.5 direction, root assignment, 1.18 first-node state, 0.88 third-node state, and delayed downstream pulses all follow named cues.
- Built `HeartsAudit` as one segment with three cue-driven instruments: a public-debate funnel, a disparity router with a private-thought probe, and a three-bay historical test bench.
- Built `TermsInOneBucket` with four shared `TermBlock` instances, deterministic measurement ticks, a blurred bucket state, four output channels, and a final separated analytical rail.
- Added `check_min3_7_a.tsx` and `check_min3_7_a.mjs`. The checker renders the real plan segment at each segment start, every cue plus 700 ms, and each segment end minus one frame.
- Added explicit package layout constants and sampled separation assertions for every scene.

### Files written

- `min3_7/a/SequenceAsTheory.tsx`
- `min3_7/a/HeartsAudit.tsx`
- `min3_7/a/TermsInOneBucket.tsx`
- `min3_7/a/PackageAVisuals.tsx`
- `tools/check_min3_7_a.tsx`
- `tools/check_min3_7_a.mjs`
- `FINDINGS_MIN3_7_A.md`

### Challenges encountered

1. Package A starts from the completed Figure 2.3 plate, so the first scene must preserve the prior scene’s final visual vocabulary before the causal transformation begins.
2. `HeartsAudit` spans three turns and needs three distinct analytical instruments inside one continuous segment.
3. Turn 16’s compiled cue order differs from the conceptual order of the beat-table rows.

### Verification

- Package A determinism tail: `PASS: 47 Package A frames rendered in two fresh processes; all markup hashes match.`
- Package A assertions tail: `PASS: 47 Package A cue-derived frames; three continuous scene contracts, Figure 2.3 continuity, causal scale sweep, all storyboard beat strings, deterministic hook policy, underscore policy, interaction-hint policy, and sampled layout separation verified.`
- Episode TypeScript: exit 0 with no diagnostics.
- First-minute tail: `PASS: 43 cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified; fix-pass-1 geometry: DictionaryEntry gutter x 985 clear of panel edge 965 with chain at 1050; WhyLadder header/column aligned at x 240; LiteratureStack boundary y 780 and elbow connectors clear of all block text boxes.`
- RoadmapBoot tail: `PASS: RoadmapBoot renders 17 deterministic frames; 13 labels land on their cues and are absent before; console box 580–1340 × 150–790 clears stacks (317 / 1671) and tray (944); panels 12, 9, 14 light on items 06, 09, 10 with wires; item11 sweep complete by +1300 (map opacity 1); item12 pulse present; console collapsed by roadmapEnd+600; era strip empty throughout; Era clock on standby and map outline-only ("1486", "LISBON", "PORTUGAL", "RUNTIME LOG" absent from every frame); no literal underscores; no interaction hints.`
- Minute-two tail: `PASS: 44 cue-derived frames; exact definition spacing through plain text-node separators, opaque node masking, non-crossing network wires, moving-target flight text hand-off across ten samples, centered final plate, tapered gold outline, scene contracts, hook policy, underscore policy, and interaction-hint policy verified; rail x 120–420 clear of card x 480; Figure 2.3 layer widths 598 / 483 / 368 px in the ratio 5.2 : 4.2 : 3.2.`
- Dashboard tail: `PASS: Equal Earth route 1296 samples / 0 land hits, bounds 540.14..821.86 × 84.29..843.36 above tray y=860; Portugal height 102.18px mainland (136.7px with 1486 Moroccan enclave); 18 deterministic timeline states; 5-panel right stack + 8-cell tray geometry; all 24 tray modes plus 3 Wage plane modes; 18 declared layouts ≤ 828px; no literal underscore text; shared 601-point Thyristor traces; Backlash static active preset; gear-only settings; no rendered interaction hints; 75 polities with 16 non-colliding labels.`
- Plan compile tail: `wrote /tmp/stage_plan_min3_7_a.json`; `cmp` returned exit 0 against `ov/stage_plan.json`.
- Prose scan tail: `check-antithesis: no banned constructions found.`
- Repository prose target tail: `check-antithesis: no files to scan` because Package A paths are new or differ from the current checkpoint outside the target’s changed-file selection.
- Independent prose review: `PASS`; 0 CERTAIN findings, 0 arguable findings, and 11 candidate occurrences reviewed and cleared.
- Render status: no Chromium session or video render was started, as required by the package rules.

### Next ideas (6 ideas)

1. Add rendered visual-regression baselines after the orchestrator completes the package render.
2. Compare the turn-11 opening frame directly with the final turn-10 frame at integration time.
3. Add a whole-segment motion review for the turn-13-to-turn-15 handoffs.
4. Check legibility at delivery compression settings.
5. Reuse the Package A causal-chain helper if a later storyboard extension repeats Eq. 2.5.
6. Add a plan lint that reports cue-table ordering differences before implementation begins.

## Fix pass 1

### Frame review

Reviewed all attached Package A frames from `ab_v1`: episode seconds 145, 161, 169, 179, 189.5, 200, and 207. The review covered the complete sampled progression through `SequenceAsTheory`, `HeartsAudit`, and `TermsInOneBucket`.

### Changes

- Rebuilt the causal nodes with dedicated 66 px title regions and separate subtitle regions. “Discriminatory Actions” and “INSTITUTIONAL PATTERNS” now wrap above their causal-node subtitles.
- Routed all three numbered-order wires from the right edge of each label with a 12 px gap. The second and third wires use clear lanes above the causal graph.
- Removed the empty outlined rectangle beneath the public-debate funnel.
- Moved “INDIVIDUAL AUDIT” into clear space above the funnel beam.
- Rebuilt the final term composition with four populated analytical blocks above the bucket. Each block carries its concise analytical job: starting tendency, group antipathy, differential behavior, or systemic structure.
- Placed the shared bucket below the restored blocks. Output channels begin below the blocks and terminate at the bucket rim.
- Moved the closing line upward into the active composition and retained a clear source line at y 968.
- Added absolute `data-text` and `data-shape` geometry for visible text, panels, marks, and connectors.

### Geometric verification

- Package A determinism: `PASS: 47 Package A frames rendered in two fresh processes; all markup hashes match.`
- Package A layout and cue check: `PASS: audit self-test (10 rules); 47 Package A cue-derived frames; 1272 audited boxes; safe area, notch zones, text fit, text/shape collisions, 12 px list-wire gaps, populated analytical blocks, separated bucket geometry, storyboard beats, determinism, hook, underscore, and interaction-hint policies verified.`
- The checker runs `auditLayout` on every sampled frame and rejects text-to-text overlap, shape or line crossings through text, safe-area exits, notch-zone entries, and declared text-fit failures.

### Validation

- Episode TypeScript: exit 0 with no diagnostics.
- Shared foundation, minute-two, first-minute, RoadmapBoot, and dashboard checks: exit 0.
- Plan compile: wrote a temporary plan under `/tmp`; `cmp` returned exit 0 against `ov/stage_plan.json`.
- Independent prose review: 0 CERTAIN, 0 arguable, and 43 candidate lines considered and cleared across the complete A/B change set.
- Render status: skipped by instruction.

### Challenges

1. The numbered-order wires required separate upper routing lanes because the expanded first node occupies the direct path to nodes two and three.
2. The compiled turn-16 cue order restores the term blocks before the bucket seal. The final layout therefore keeps the bucket available as a lower destination while the blocks settle above it.
3. The static-markup audit requires explicit absolute geometry for shared visual primitives. Package A now supplies local audited wrappers while preserving the shared directory unchanged.
