# Group E scene findings

Model: Composer (scene-worker group E)

## Round 2 revision (SEG 13–15 scope only; SEG 16 untouched)

| id | class | file | status | what changed |
|---|---|---|---|---|
| S13-01 | RLCTopology | `rlc_topology16x9.py` | rendered | Wide horizontal series loop; tier stack separated left; kinetic supply label. Layout: 14 inspector notes (tier/loop proximity). |
| S13-06 | RLCTopology | `rlc_topology16x9.py` | rendered · layout ok | Figure 2.5 loop fills frame; R/L/C institutional glosses above each element on hold beats. |
| S13-14 | BacklashOscillator | `backlash_oscillator16x9.py` | rendered · layout ok | Full-width q(t) plot; curve grows per shot; 1865/1964 impulses, back-EMF, LC discharge, extraction labels, interface swap; shot-local captions (no duplicate tiles). |
| S13-22 | BacklashOscillator | `backlash_oscillator16x9.py` | rendered · layout ok | Figure 2.6 rebuild (ω_d≈110); animated draw; shock/overshoot markers; per-shot envelope, α tightening, baseline/restorative beats. |
| S13-27 | ResonanceSweep | `resonance_sweep16x9.py` | rendered · layout ok | Large \|q_res\| response curve; ω sweep to ω₀; peak and coordination captions. |
| S13-28 | ResonanceSweep | `resonance_sweep16x9.py` | rendered | Split plot + large \|q_res\|, Q_f equations; resonant scaling callout. |
| S14-07 | SuppressionEnvelope | `suppression_envelope16x9.py` | rendered | Scaled M(t)/Σ_sup axes; curves draw on threshold; ψ_m deploy arrow; Buffer wealth flow. |
| S14-16 | CoherenceThreshold | `coherence_threshold16x9.py` | rendered | Figure 2.8 curves draw in sequence; τ indicate; reform shock line + illustrative badge. |
| S15-10 | BacklashWave | `backlash_wave16x9.py` | rendered | Four panels enlarged with colored frames; sequential panel emphasis on contracted beat. |
| S15-11 | CoherenceThreshold | `coherence_threshold16x9.py` | rendered | Post-1965 comparison badge; curve indicate; directional race footer. |

Sheets reviewed after edits (`edit16x9.py sheet SEG … --only … -o /tmp/`). Primary visual bar met for S13-06, S13-14, S13-22 (distinct tiles, frame-filling plots).

## Runs (prior pass summary)

| id | class | file | status | summary |
|---|---|---|---|---|
| S16-01 | ComplexWage | `complex_wage16x9.py` | not in Round 2 scope | Owned by other worker per REVISION_NOTES. |
| S16-08 | ComplexWage | `complex_wage16x9.py` | not in Round 2 scope | — |
| S16-10 | LorentzForce | `lorentz_force16x9.py` | not in Round 2 scope | — |
| S16-31 | CoilGunInterface | `coil_gun16x9.py` | not in Round 2 scope | — |
| S19-14 | StatusWage | `complex_wage16x9.py` | not in Round 2 scope | — |

## Contract / shared notes

- Figure 2.6 curve uses book illustrative parameters Q₀=1.6, α=0.35, ω_d≈110 (pgfplots in `Paper/The_Original_Power.tex` fig `fig:backlash_oscillator`).
- Figure 2.7 panels remain committed PNGs per brief; 2.8 curves on-screen labelled illustrative.
- S16-13 run split unchanged (see prior log).

## Cue words

All cues resolved via `edit16x9.py turns` / `words.json` for revised runs.

## Unfinished

- S13-01: layout inspector still reports tier/loop proximity (14 samples); geometry separated but wire+tier co-presence triggers overlap checks.
- S13-28, S14-07, S14-16, S15-10/11: minor layout notes remain on some samples; sheets checked; no Metal failures.
