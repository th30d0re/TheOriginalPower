# Equation Colour and Pulse Findings

## Registry

The Stage registry lives in `equations/terms.ts`. Its palette is copied from the website dark-theme slots in `website/src/components/EquationCards.css`.

| Term id | Display | Meaning | Slot | Hex |
|---|---|---|---:|---|
| `X` | X | raw sensory input | 0 | `#7dd3fc` |
| `T` | T | threat/status interpretation | 2 | `#fde047` |
| `PiRace` | `Pi_{race}` through `MathText` | the installed racial prior | 1 | `#fca5a5` |
| `i` | subscript i through `MathText` | the individual | 9 | `#e2e8f0` |
| `IndividualPrejudice` | Individual Prejudice | Eq. 2.5, term 1 | 13 | `#fda4af` |
| `DiscriminatoryActions` | Discriminatory Actions | Eq. 2.5, term 2 | 5 | `#fdba74` |
| `SystemicOutcomes` | Systemic Outcomes | Eq. 2.5, term 3 | 4 | `#c4b5fd` |

`EquationTerms` renders fixed-width token lists. `ColoredTerm` applies the registry colour and a deterministic 600 ms pulse. The pulse reaches scale 1.12 and maximum same-colour glow at cue + 200 ms. `TermChip` pairs a registered symbol with its meaning. Every coloured term declares `data-term`, `data-term-color`, `data-pulse`, `data-scale`, `data-text`, and its fixed audit box.

## Scene Cue Maps

### InstalledRacialPrior

| Term | Cues | On-screen locations |
|---|---|---|
| `PiRace` | `t33Pi`, `t33Priors`, `t33Institutions` | cartridge, chip, prior-factor label, posterior-factor label, assembled equation |
| `T` | `t33Priors` | chip, prior-factor label, assembled equation |
| `i` | `t33Priors` | chip, prior-factor label, assembled equation |
| `X` | `t33Sensory` | chip, evidence-factor label, assembled equation |

The chips arrive in narration order. Eq. 2.8a assembles from `t33Evidence` across fixed token entrances. Turn 34 retains the same registry colours. The evidence, prior, and posterior curve strokes keep their established colours and geometry.

Two cue additions were required:

- `t33Priors`: turn 33 word `priors`, start at 406170 ms.
- `t33Sensory`: turn 33 word `sensory`, start at 407410 ms.

The compiled plan diff contains those cue names in the global cue map and the `S00-33` qualified cue map. The compile changed no shot.

### SequenceAsTheory

| Term | Cues | Spoken phrase |
|---|---|---|
| `IndividualPrejudice` | `t12Personal`, `t12Root` | personal hostility; root cause |
| `DiscriminatoryActions` | none | the narration does not name this node |
| `SystemicOutcomes` | `t12Institutional` | institutional patterns |

The three causal nodes use the Eq. 2.5 registry slots. Existing node geometry, arrows, scale changes, and effect pulses remain intact.

### HeartsAudit

The formal statement uses all three Eq. 2.5 registry slots. Turn 15 names the causal ordering and its historical test. It names none of the three formal terms, so the terms carry colour without a pulse cue.

### DictionaryEntry

| Term | Cue | Spoken phrase |
|---|---|---|
| `IndividualPrejudice` | `individual` | individual prejudice |
| `SystemicOutcomes` | `institutional` | institutional pattern |

The approved entry and causal-chain geometry remain fixed. The highlighted phrases and the final Eq. 2.5 chain use registry colours.

## Narration Without an On-Screen Term

- `T` and `i` have no spoken word in turn 33. Their chips enter with the prior factor at `t33Priors`.
- `DiscriminatoryActions` has no spoken occurrence in turns 1, 11, 12, or 15. It stays at rest.
- Turn 15 names no Eq. 2.5 term. The HeartsAudit formal statement therefore has no term pulse.
- `Stereotypes` identifies the compression process and has no registry symbol. Its existing process label remains unchanged.

## Check Tails

- Episode TypeScript: exit 0.
- `check_equations`: `PASS: 14 equation frames; 111 registered coloured terms; 11 pulse cues peak at cue + 200 ms and rest after 600 ms; Eq. 2.5 and Eq. 2.8a are verbatim with MathText subscripts.`
- `check_first_minute`: `PASS: 43 cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified; fix-pass-1 geometry verified.`
- `check_roadmap_boot`: `PASS: RoadmapBoot renders 17 deterministic frames; 13 labels land on their cues and are absent before; console, stack, tray, sweep, pulse, and standby-state contracts verified.`
- `check_minute_two`: `PASS: 44 cue-derived frames; definition spacing, node masking, network wires, flight hand-off, final plate, hierarchy geometry, hook policy, underscore policy, and interaction-hint policy verified.`
- `check_dashboard`: `PASS: 19 frames, 24 tray mode renders, and 3 moved Wage-plane renders repeated in fresh processes with identical hashes; dashboard geometry and content contracts verified.`
- `check_min3_7_shared`: `PASS: 25 representative shared-component states; eleven component contracts, hook policy, underscore policy, Gaussian curves, posterior formula, endpoint bounds, midpoint bound, and monotonic precision sweep verified.`
- `check_min3_7_a`: `PASS: audit self-test; 47 cue-derived frames; 1282 audited boxes; safe area, notch zones, text fit, collisions, geometry, beats, determinism, hook, underscore, and interaction-hint policies verified.`
- `check_min3_7_b`: `PASS: audit self-test; 43 cue-derived frames; 1146 audited boxes; safe area, notch zones, text fit, collisions, package geometry, beats, determinism, hook, underscore, and interaction-hint policies verified.`
- `check_min3_7_c`: `PASS: audit self-test; 195 frames; 6799 audited boxes; safe area, notch zones, text fit, collisions, sorting and replacement states, tilt geometry, strings, hook, underscore, and interaction-hint policies verified.`
- `check_min3_7_d`: `PASS: audit self-test; 211 frames; 5306 audited boxes; safe area, notch zones, text fit, collisions, beat timing, real subscripts, hook and string policies; fixed evidence, Gaussian prior, and monotonic posterior sweep 0.2800 to 0.6755 verified.`
- Plan compile: `wrote Architecting_the_operation/video/yt02/stage/ov/stage_plan.json`; diff limited to `t33Priors` and `t33Sensory` cue entries.
