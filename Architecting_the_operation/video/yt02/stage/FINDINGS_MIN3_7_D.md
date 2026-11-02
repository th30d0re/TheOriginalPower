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

## Fix pass 1

Brief: `BRIEF_MIN3_7_FIX_CD.md`. Frames reviewed: `review_frames/cd_v1/e360`–`e424.5`.

### Root cause of the top-left elements

`FadeIn` and the gauge, ribbon and card wrappers spread layout boxes (`{x, y, w, h}`) into `style`.
Those keys are not CSS, so the question, the computer-science title, the training strips, both
precision gauges and the turn-34 cards rendered at (0, 0). All placement now goes through
`left/top/width/height` from the layout constants (`Label`, `Panel`, explicit wrappers).

### Per scene

- **`PredictiveCoding`:** the question is 46 px in the header box and shrinks into a 30 px strip at
  `t30Predictive`. The loop, lanes, core and output use the storyboard boxes. The output plot ends
  at y 620, so the precision gauge has its own box at x 1270–1770, y 640–890 (the storyboard gives
  no gauge box in this scene). The core is re-drawn around one comparator. "UPDATE", "GUESS" and
  "COMPARE" are clear of every wire. "BIAS" and "BIAS = A TILT IN THE STARTING ASSUMPTION" sit in
  their own rows. The prior updates 0.40 → 0.52 toward the fixed evidence (0.64) in turn 30 and
  tilts 0.52 → 0.36 in turn 31, without a jump at the turn boundary.
- **`ComputationalBias`:** the title sits at y 108–156. The left panel has a constant-input node with
  a bus to every layer, and gold offset traces that all move 36 px. The right panel has its own
  training-strip column (x 1040–1380) feeding the network, and three "pattern" output strips at
  `t32Repeats`.
- **`InstalledRacialPrior`:** Eq. 2.8a builds term by term in fixed columns:
  - `P(X | T)` at `t33Book`;
  - `Pᵢ(T | Π_race)` at `t33Pi`;
  - posterior, ∝ and · at `t33Bayesian`.

  The plot is local because the shared plot draws the prior flat at α = 0. The prior is a Gaussian
  on its mean, and it narrows from τ = 34 to τ₀ = 160 at "Stereotypes". The gauge (with the DERIVED
  label) sits in x 1390–1760, y 320–700. The α labels sit under its two ends, and "INSTITUTIONAL
  REINFORCEMENT" is the bus box below them. Turn 33 fades out fully before turn 34. Turn 34 has the
  equation strip, "BIAS", the three-field rail (APA sorting field, predictive loop, trained network)
  joined to "PREDICTION FROM PRIOR EXPERIENCE", the Π_race cartridge with its history ribbon, and
  the three cards at x 300–1620, y 700–850.

### The sweep (derived display model)

- The model is a power prior: posterior ∝ likelihood × prior^α. It gives τ_post = τ_e + α·τ₀ and
  μ_post = (τ_e μ_e + α τ₀ μ_p)/τ_post, with τ_e = 18, τ₀ = 160, μ_e = 0.28, μ_p = 0.72.
- α holds at 0 from `t33Override` and rises from `t33Institutions` to 1 at `t33Weight`.
- At α = 0 the mode is 0.2800 (at the evidence). At α = 1 the mode is 0.6755 (near the prior).
- The evidence curve geometry is identical in every turn-33 frame.

### Check changes

- The check now samples every cue + 700 ms and a 500 ms grid (209 frames) and audits each frame.
- The "absent before" asserts follow the storyboard:
  - "POSTERIOR" and "RACIAL PRIOR" are no longer required to be absent before `t33Bayesian`
    ("RACIAL PRIOR" is part of "INSTALLED RACIAL PRIOR").
  - The DERIVED gauge label is required from `t33Override`, where the sweep begins.
- New asserts:
  - the Gaussian prior peaks on its mean;
  - the turn-31 tilt is continuous;
  - all four layer offsets are equal;
  - the final frame holds all three fields and all three cards.

### Check tail

```
PASS: 209 Package D frames rendered in two fresh processes; all markup hashes match.
PASS: audit self-test (10 rules); 209 Package D frames (cues + 500 ms grid); layout audit of 4727 declared boxes over 209 frames (safe area, notch zones, text fit, text/shape collisions); exact beat timing, real subscripts, hook and string policies; fixed evidence, Gaussian prior, monotonic posterior sweep 0.2800 → 0.6755 (prior 0.72).
```

### Limits

- No render was made. The layout was checked with the audit and with box wireframes at the 16
  review timestamps.
- The `stage_ov.yaml` plan compile needs `outputs/YT02v2_ov/` (author machine). `stage_ov.yaml` did
  not change.
