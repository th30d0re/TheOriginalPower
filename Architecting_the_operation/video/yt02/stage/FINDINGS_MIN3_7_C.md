# Package C Findings

Model: GPT-5 Codex

## What Was Requested

Build turns 23–29 from `STORYBOARD_MIN3_7.md` as the three continuous scenes `UsThemSorting`, `HostWetware`, and `BiasDefinition`. Preserve the existing exports, shared foundation contract, deterministic frame path, cue-derived beats, dashboard visual language, and package-only write scope.

## Foundation Contract Used

- `StageSceneFrame({segment, title?, source?, children})`
- `SourceLine({text, x?, y?, tone?})`
- `TermBlock({term, summary?, glyph, state, accent, unit?})`
- `DefinitionCard({term, definition, source, paraphrased, progress, accent})`
- `CitationCard({authors, year, title, progress, compact?})`
- `UsThemSortingField({marks, partitionProgress, ingroupProgress, outgroupProgress, labels, mode})`
- `PersonMark({x, y, group, emphasis, scale})`
- `NeuralField({layers, inputs, weights, activationProgress, compressionProgress, labels})`

## Implementation Progress

- Read the Package C storyboard, foundation contracts, house-style briefs, existing shared components, and Package B implementation/checker.
- Confirmed the compiled plan spans 275,600–347,300 ms for the three Package C scenes and contains every storyboard cue from `t23Social` through `t29Explanation`.
- Implementation and validation details will be appended during the build.

## Challenges Encountered

1. The shared sorting and neural fields have fixed internal dimensions, while the Package C storyboard defines larger scene-level regions. The scenes will frame and supplement the shared components with deterministic local overlays.

## Next Ideas (6 Ideas)

1. Add visual regression frames after the orchestrator renders the package.
2. Review the 48-mark sorting trajectories at the first and final partition states.
3. Compare the neural compression field against the later predictive-coding visual language.
4. Validate typography around the turn-29 definition card at delivery resolution.
5. Add accessibility descriptions for the diagrammatic SVG groups.
6. Reuse the local tilt-meter primitive if a later chapter revisits directional bias.

## Check Tails

Pending implementation.

## Fix pass 1

Brief: `BRIEF_MIN3_7_FIX_CD.md`. Frames reviewed: `review_frames/cd_v1/e283`–`e346.5`.

### Layout audit (new, shared with Package D and with the A/B fix pass)

- `tools/layout_audit.ts` reads static markup. Every audited element declares its absolute box with
  `data-text` or `data-shape` + `data-role` (`frame`, `mark` or `line` with `data-points`) +
  `data-box`. The scenes derive each box from the same constants that place the element.
- Effective opacity is the product of all ancestor `opacity` styles and SVG attributes.
  Rules apply above 0.05.
- Rules: safe area x 60–1860, y 70–1010; both notch zones; text fit (mono and sans estimate);
  no text on text; no line through text (2 px leader tolerance); no text or mark across a frame
  edge; no overlap between marks of different layers.
- `auditSelfTest()` proves each rule on known-bad markup. Both checks run it first.
- The marking helpers (`Label`, `textAttrs`, `shapeAttrs`, `lineAttrs`, `SceneSource`) live in
  `min3_7/d/sceneUtils.tsx`. Package C imports them.
- `check_min3_7_c` now samples every cue + 700 ms and a 500 ms grid (195 frames) and audits each frame.

### Per scene

- **`UsThemSorting`:** the field is 1080 × 611 at x 420–1500. The five function chips sit in the
  side margins and join their features through leaders. The marks sort from a jittered 8 × 6 grid
  into a 4 × 6 grid per side. The two "US" bands and the "THEM" band are frames that contain their
  marks fully, and a dashed alliance link joins the two "US" bands. "SMALL BANDS + ALLIANCES" and
  "BOUNDED GROUPS" sit under the field. The audit sees all 48 person boxes and the "US"/"THEM" titles.
- **`HostWetware`:** the input column (24 marks, 4 ghost marks, "IN 1–4" labels, sockets) sits left
  of the network. The network is scaled 0.7 at x 506–1150. The labels sit under the network, and
  "FAST CATEGORIZATION" heads the label bus. Turn 27 fades the old picture to opacity 0 and unmounts
  it before the band diagram enters. The diagram has one "ALLY" with a leader, one "STRANGER" under
  its marks, and the consequence label above the threat pulse.
- **`BiasDefinition`:** the term modules are local cards sized to their glyph and term. "PROCESS"
  heads the group-category token that feeds Bias and Prejudice. "ACT" is a frame at the end of the
  Discrimination channel, with an action glyph. The baseline host-wetware bus is a faint, separate
  picture at the right, with nothing on top of it. The definition card is 120 px tall with its title
  and grows to 360 px with the definition. The duplicate meter label and the faint panels are gone.

### Check tail

```
PASS: 195 Package C frames rendered in two fresh processes; all markup hashes match.
PASS: audit self-test (10 rules); 195 Package C frames (cues + 500 ms grid); layout audit of 6799 declared boxes (safe area, notch zones, text fit, text/shape collisions); 48 deterministic sorting marks, 24-to-3 compression, clean turn-27 and turn-29 replacements, 18% tilt geometry, storyboard strings, hook, underscore and interaction-hint policies verified.
```

### Limits

- The audit checks declared boxes. It cannot see glyph widths. The text-fit estimate is conservative
  (0.6 em mono, 0.56 em sans).
- The internals of shared components (`PrecisionGauge`, `TrainingTextStrip`, `UsThemSortingField`,
  `NeuralField`) are audited as one box each. The person marks and the "US"/"THEM" titles inside
  the sorting field are declared from the shared geometry formula.
