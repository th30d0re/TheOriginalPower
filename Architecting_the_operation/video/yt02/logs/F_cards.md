# YT02v2 card and phasor pass — 2026-10-28

Model: Kimi Code CLI

Scope: picture edits for N3, N5, N7, N16, N17, N18, N19, N20, N21, N24, and N25. This pass leaves the podcast script, voice configuration, `Paper/`, `outputs/`, and `YT02v2_shotlist.md` unchanged.

## Findings

| Note | Finding and action | Shot / block | Status |
|---|---|---|---|
| N3 | Block 62 holds the wetware card at S01-47. A new S01-47 quote card displays the complete literature-ends sentence and names bias, prejudice, and discrimination as interpersonal operations. The wetware card remains at its later spoken placements, S02-08 and S02-11. | S01-47; wetware at S02-08, S02-11 | Card ready |
| N5 | Equation 2.5 now builds as three left-to-right panels. Individual Prejudice, Discriminatory Actions, and Systemic Outcomes reveal at their spoken onsets in S03-08. | S03-06–S03-09 | Done; beats below |
| N7 | Opened `Architecting_the_operation/video/yt01_redefining_racism/cards/S08-13.json`. Its current Equation 2.7 content and claim position remain unchanged. No YT02 copy exists. | S08-13 | Preserved; no edit |
| N16 | Added `v2-S10-40.json` for the eroding arms boundary and rifle bans, and `v2-S10-42.json` for the two-series ψ_m / ψ_s calibration. Both use the spoken sentences without added coefficients. | S10-40 / block 360; S10-42 / block 362 | Cards ready |
| N17 | The current v2 `intro 2` cues omit BLOCKED but draw only STAGNANT, EXPANDING, and AT RISK. The older v1 cue file contains the stray BLOCKED keyframe. The new `v2-S12-05.json` card draws all six spoken conditions and excludes BLOCKED. | S12-05 / block 442 | Card ready; retarget proposed |
| N18 | Moved the material-value label below the y-axis arrow, named the rightward psychological-status axis, reflowed θ = 90° and Quadrant II labels, and retained `QUADRANT II · FASCISM THRESHOLD`. Added `wage S12-11` for the actual S12-11–S12-13 dashboard shots. Log 3 uses an illustrative 45° Quadrant I joint wage with the required citation comment. | S12-11–S12-13 / blocks 449–450; S10-44–S10-47 | DISAGREE recorded; geometry and 45° keyframes done |
| N19 | Block 484 holds `card v2 S13-01` at S13-02, with primary run S13-01. The first row now has a short `0.2π phase gap` title and a one-line coherent-sum detail, removing the two-line overflow. | S13-02 / block 484 | Reflowed |
| N20 | Added equation cards for Equation 0.15, 180° cancellation, Equation 22.1, and Equation 22.2. Equation 22.2 displays the expression itself. The existing Madison phase-jammer row remains for block 488. | S13-07, S13-10, S13-12, S13-13 / blocks 489–495 | Cards ready; Figure 0.6 export gap below |
| N21 | `Paper/figures/eq_fourier_electoral_cycle.png` exists and is referenced by the new S13-16 figure card. The S13-19 table card carries the manuscript ratios and a separately labelled Parseval row. | S13-16 / block 498; S13-19–S13-21 / blocks 501–503 | Cards ready; existing spectral figure used |
| N24 | The cropped frame is `card v2 S14-16`, whose source is `cards/S13-20.json`. Its second column now reads `Out-Group → In-Group`, retaining the full words inside the builder’s existing 20-pixel cell inset. The unrelated falsification card at `cards/S14-16.json` is unchanged. | S14-16 / block 525 | Fixed in source and prepared JSON |
| N25 | Added six renderer-consumed camera beats to `tier_cone.py`. The existing shot remains unchanged by default; `YT02V2_N25=1` enables the storyboard for inspection. No Remotion or Node project was created. | TierCone / orthographic illusion | Done; preview command below |

## N18 manuscript verification and DISAGREE

Artifacts opened directly in the current working tree:

- `Paper/The_Original_Power.tex:2939-2941` defines generic θ = 90° as 100% psychological with zero material benefit.
- `Paper/The_Original_Power.tex:15346-15354` contains Compiled Runtime Log 2. That passage assigns no numeric phasor angle and does not discuss the Second Amendment.
- `Paper/The_Original_Power.tex:3262` states the current Runtime Log 3 correction: `W = ψ_m + jψ_s`, the 1705 musket supplies ψ_m > 0, and the phasor moves into Quadrant I near an illustrative 45°.
- `Paper/The_Original_Power.tex:5107-5113` calls the arms guarantee tangible collateral and a payment to the Buffer Class.
- `Paper/The_Original_Power.tex:5142-5151` documents corn, money, and a musket in freedom dues; assigns ψ_m > 0 and ψ_s > 0; places the 1705 joint wage in Quadrant I near 45°; and disclaims a measured historical angle.
- `Paper/The_Original_Power.tex:15357-15364` repeats the current mixed-wage Runtime Log 3 in the compiled appendix.

**DISAGREE:** the generic 90° definition still says zero material benefit, and the current log-3 passage says the musket is a material concession. This pass does not edit or retcon the manuscript. The card uses the log-specific 45° illustration and labels it Tier 3 ordinal.

An independent verifier opened the same artifacts and agreed with 45° for S10-45 and S10-46. It identified the stale 72° shotlist hold and the current working-tree Runtime Log 3 correction. S10-44, S10-45, and S10-46 now use 45°; S10-47 inherits 45°. The sequence then moves to 90° at containment, 84° for partitioned credit, 90° for telemetry, and 108° after 1965. The buffer phasor therefore changes across logs. The generic `th === 90` regime remains `pure status · ψ_m = 0`.

The required source comment is in `phasor_spec.py` beside S10-44 and cites `Paper/The_Original_Power.tex:2939-2941`, `:3262`, and `:5148-5151`.

## N5 reveal beats

Run S03-06 starts at 857.756 seconds. S03-08 starts at 879.486 seconds, 21.730 seconds into the run. The beat values use the existing word alignment in `outputs/YT02V2/words.json`:

| Reveal | Word onset inside S03-08 | Run-relative beat |
|---|---:|---:|
| Card heading | — | 0.25 s |
| Individual Prejudice | 2.28 s | 24.01 s |
| → Discriminatory Actions | 4.18 s | 25.91 s |
| → Systemic Outcomes | 7.74 s | 29.47 s |

The full causal chain no longer appears before the spoken terms. The three panels accumulate in spoken order.

## N17 runtime states and beats

The dedicated S12-05 card contains STAGNANT, EXPANDING, RESTRUCTURING, AT RISK, THREATENED, and PEAK. Their run-relative reveal beats are 5.90, 6.60, 7.28, 8.74, 9.56, and 10.78 seconds. BLOCKED is absent.

## N19 shot held at speaker block 484

S13-02 holds S13-01 and renders `cards/v2/v2-S13-01.json`. Its spoken sentence introduces the Interference Engine. The phase-gap row belongs to that held card. Its shortened text is:

- Title: `0.2π phase gap`
- Detail: `i₁(t) + i₂(t) → coherent I_E(t) at the Elite node.`

## N20 and N21 figure availability

- Equation 0.15 uses `i_k(t) = ρ_k A_k cos(ωt + φ_k), k = 1, …, N`, matching the spoken definitions and `Paper/The_Original_Power.tex:1174-1177`.
- **MISSING FIGURE:** Figure 0.6 exists as inline TikZ at `Paper/The_Original_Power.tex:1182-1191`; no standalone PNG, PDF, or SVG export exists. The proposed wave picture uses the existing animation in `Architecting_the_operation/video/yt02/interference_engine.py`. The S13-10 card carries the antiphase expression and sum.
- Equation 22.1 uses the expression at `Paper/The_Original_Power.tex:14453-14455`.
- Equation 22.2 uses the expression at `Paper/The_Original_Power.tex:14459-14461`.
- The spectral figure at `Paper/figures/eq_fourier_electoral_cycle.png` was opened by the asset scout and its path was verified locally. S13-16 points to that existing figure.
- Table 22.1 exists in manuscript source at `Paper/The_Original_Power.tex:14550-14564`. **MISSING FIGURE:** no standalone table image exists. S13-19 renders a table from those rows: 0.2500 cycles/year and 24.06 for the presidential cycle, 21.02 for Senate, 12.86 for two-term, plus the Nyquist-caution row. Parseval 0.9996 is labelled as a separate consistency check from `Paper/The_Original_Power.tex:14578-14584`.

## Proposed shotlist lines

`YT02v2_shotlist.md` remains unchanged. Apply these retargets when its owner integrates the picture pass:

```text
S01-47 — Type: card; Render: figma-card:cards/S01-47.json
S02-08, S02-11 — retain figma-card:cards/S01-42.json for wetware / social software
S03-06 — retain figma-card:cards/S05-06.json; beats: 0.25, 24.01, 25.91, 29.47

S10-40 — Type: card; Render: figma-card:cards/v2/v2-S10-40.json
S10-42 — Type: card; Render: figma-card:cards/v2/v2-S10-42.json
S10-44, S10-45, S10-46 — θ = 45°; mixed joint wage; Tier 3 illustration
S10-47 — hold θ = 45°; remove the stale 72° note

S12-05 — Type: card; Render: figma-card:cards/v2/v2-S12-05.json
S12-11 — Type: scene; Render: figma:wage S12-11
S12-12, S12-13 — Type: hold; Render: figma:wage S12-11; Holds: S12-11

S13-07 — Type: card; Render: figma-card:cards/v2/v2-S13-07.json
S13-09 — Type: scene; Render: manim:yt02/interference_engine.py:InterferenceEngine
S13-10 — Type: card; Render: figma-card:cards/v2/v2-S13-10.json
S13-12 — Type: card; Render: figma-card:cards/v2/v2-S13-12.json
S13-13 — Type: card; Render: figma-card:cards/v2/v2-S13-13.json
S13-16 — Type: card; Render: figma-card:cards/v2/v2-S13-16.json
S13-19 — Type: card; Render: figma-card:cards/v2/v2-S13-19.json
S13-20, S13-21 — Type: hold; Render: figma-card:cards/v2/v2-S13-19.json; Holds: S13-19

S14-16 — retain figma-card:cards/S13-20.json; second column: Out-Group → In-Group
```

Adjacent holds need to end where a dedicated card begins. The generic S13-01 card can resume on later generic shots after those holds are split.

## N25 six-beat camera storyboard

1. Frame the cone on the band between the out-group and buffer class, with white on the left and black on the right.
2. Rotate the cone 90° counterclockwise inside the tight frame so the image reads as the coarse white / black binary.
3. Rotate 90° clockwise to the upright cone, retaining the tight frame with buffer class above and out-group below.
4. Move inside the cone between buffer and out-group, then pan up to the flat ceiling; the out-group’s upward view frames the in-group.
5. Pan down to the buffer class’s view of the group below.
6. Zoom out to the whole cone.

`N25_CAMERA_STORYBOARD` supplies camera poses, cone rotations, binary visibility, and tier opacity. `_play_n25_camera` iterates every entry using `move_camera`, `m.Rotate`, and the current slab objects. The two interior poses use a short focal distance. The default S05-05 sequence calls the storyboard only when `YT02V2_N25=1`.

Preview the final whole-cone frame without producing an MP4:

```bash
YT_EP=YT02V2 YT02V2_N25=1 YT02V2_SHOT=S05-05 \
  .venv-manimgx/bin/manimgx inspect \
  Architecting_the_operation/video/yt02/tier_cone.py TierCone \
  -t end -o /tmp/tier_cone_n25.png
```

Use a run-relative second with `-t` to inspect an earlier pose. Episode integration needs editorial time for the appended storyboard.

## Verification performed

- `node --check Architecting_the_operation/video/yt02/figma/v2/phasor_builder.js` exits 0. The async IIFE returns its Promise to `use_figma`, preserving the frame-metadata contract.
- `cards_v2.json` and every changed source card parse successfully. Source fields match the prepared entries across 128 card runs.
- `python3 -m py_compile` passed for `phasor_spec.py` and `tier_cone.py`.
- `TierCone` imported successfully; the storyboard contains six beats with the expected camera-pose counts.
- The existing `card_prep.py` prepared all 12 changed/new cards and produced 13 assets in `/tmp`, including every new equation and the existing spectral PNG.
- Independent factual review agreed with the 45° log-3 correction, equation strings, table values, and S08-13 preservation. Its initial syntax rejection was resolved and independently rechecked.
- `make check-prose` and the focused F_cards check report no banned constructions.
- `git diff --stat` includes the podcast script modification that predated this pass and a concurrent four-line manuscript modification. This pass made neither. No `outputs/` change appears.
- No episode render, `scriptcast`, video render, or shotlist edit was run. Actual Figma frames and the cone camera sequence remain visually unverified.
