# Minutes Three to Seven Findings · Package D

## Package D

Model: GPT-5 Codex

### What was requested

Build `PredictiveCoding`, `ComputationalBias`, and `InstalledRacialPrior` from `STORYBOARD_MIN3_7.md`, covering turns 30–34. Preserve the shared foundation contracts, deterministic rendering, cue-timed entrances, exact storyboard strings, and the declared layout regions.

### Implementation record

- Checkpoint confirmed at `93b8bcd`.
- Foundation contracts read from `FINDINGS_MIN3_7.md` §Foundation.
- Package cue windows confirmed from `ov/stage_plan.json`.
- Implementation in progress.

### Challenges encountered

1. Package D spans five turns through three continuous scene instances, so turn boundaries require persistent geometry and state.
2. The Bayesian sweep must preserve a fixed likelihood while the posterior mode moves monotonically toward the installed prior.
3. Package checks must validate timed text without relying on image renders.

### Next ideas (6 ideas)

1. Add orchestrator-side screenshot review for the three precision endpoints.
2. Compare the turn-30 and turn-33 plot geometry during render review.
3. Inspect the turn-32 network panels at the divider for visual balance.
4. Review the equation band at final delivery resolution.
5. Add cross-package continuity samples at turns 29–30 and 32–33.
6. Retain the static-markup checker as a regression gate for later copy changes.
