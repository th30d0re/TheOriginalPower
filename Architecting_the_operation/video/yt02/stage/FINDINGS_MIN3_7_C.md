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
