# Group A scene findings

Metal render: ok (`.venv-manimgx`, 960×540@15).

| Run | Class | Status | Shows |
|-----|-------|--------|-------|
| S01-02 | `Orthographic16x9` | rendered · 3D (layout not checked) | Five-tier cone (~1.3× scale) assembles front view; tier focus for Elite extraction, Puppet law/policy, Enforcement boundary, Buffer allocation, status wage + kinetic concessions, O_racialized sourcing, compounding burden, connected architecture |
| S01-19 | `FourComponentLoop` | rendered · layout ok | Four components in a horizontal loop with deflection to individual behavior and structural maintenance |
| S01-28 | `EnclosureSpecialization` | rendered · layout ok | O → O_racialized inside Tri-Modal Enclosure frame; racial mechanisms per mode |
| S02-01 | `SetTheoryPrimer` | rendered · layout ok | 19-shot primer: U, I/O, elements, E⊂I, union/intersection, empty set, dot-cup, partitions, refinement, race vs capital projection on one person |
| S03-01 | `BinaryRefinement` | rendered · layout ok | Coarse I/O projection under-resolved |
| S03-08 | `BinaryRefinement` | rendered · layout ok | COARSE dial; occluded designer/administrator/enforcer/status labels and O fractures |
| S03-17 | `BinaryRefinement` | rendered · layout ok | I cell unfolds to four tiers; maximal benefit at E; suppression allocation at Buffer |
| S03-25 | `OutgroupAxes` | rendered · layout ok | Seven axes orbit O; heterogeneous extraction intensities via color |
| S03-31 | `RecursivePartition` | rendered · layout ok | Local X⁺/X⁻ split, axis α, person moves under race vs capital, local advantage, reject flattening |
| S03-46 | `ZoomingBinary` | rendered · layout ok | Figure 2.1 rebuild: coarse I and O blocks with internal tiers, boundary projection, recursive partitions, local advantage inside O |
| S03-50 | `Orthographic16x9` | rendered · 3D (layout not checked) | Camera below Buffer; orthographic alignment; angle change reveals deeper tiers |

## Cue words

Resolved at render time (prefix match on `words.json`):

- S01-02 hold 5–8: turn boundaries differ from shot-list labels (S01-07/08 share kinetic + concessions in turn 14; sourcing is turn 15). Scene uses `kinetic`, `sourced`, `compounding` on the correct shot indices.
- S02-01 shot 18: `capital` (not `another`) for the second projection beat.
- S03-31 shot 0: `contain` (not `macro`).

## Contract / ports

- `orthographic16x9.py` split into `shot_S01_02` and `shot_S03_50`; removed monolithic `construct`. Tier radii and z positions scaled ×1.3 per brief.
- Figure 2.1 rebuilt in `binary_zoom16x9.py` from book structure (not a static PNG); card headline from `cards/S03-46.json`.
- Out-group axis labels abbreviated on screen (`LEGAL`, `CREDENTIAL`, `CRIMINALIZED`) to stay ≥28 px inside frame; narration retains full terms.

## Unfinished

- 3D runs (`S01-02`, `S03-50`): manimgx reports `layout: not checked (a 3D scene)`; storyboard PNGs should be reviewed manually for overlay legibility.

---

## Round 2 revision (Group A)

| Run | Status | Changes |
|-----|--------|---------|
| S02-01 | rendered · layout ok | Full-width universe (`12.6×5.6`); symbols (`∪`, `∩`, `∅`, `∪̇`) with names in upper margin; distinct S02-04/05 (pulse E vs I members outside E) and S02-13/14 (dot-cup vs count-once); clean I\|O partition from shot 15; run ends on Eq. (binary-partition) `U = I \dot\cup O`, `I \cap O = \varnothing` full-screen |
| S03-46 | rendered · layout ok | Larger I/O macro blocks (34 px tier math); figure fades on `tiers`; tier highlights on Elite / `O_{\text{racialized}}`; boundary projection line clear of labels; recursive-partitions callout separated from arc |
| S01-02 | rendered · 3D | Camera zoom `0.82` → `0.92` for frame fill |
| S03-50 | rendered · 3D | Same cone scale path as S01-02 (inherits `SCALE=1.3`) |
| S01-19, S01-28, S03-01, S03-08, S03-17, S03-25, S03-31 | fresh / prior pass | Re-rendered; no code changes this round |

---

## Round 3 revision (Group A)

| Run | Status | Changes |
|-----|--------|---------|
| S02-01 | rendered · layout ok · sheet judged | ∩ taught on generic **A ∩ B** ellipses; **I** and **O** separate on the empty-set turn and stay disjoint through partition; membership header is one title line plus one math line (drops second line before ∪); S02-04 dims **I** and pulses **E** only, S02-05 highlights **I \\ E** with ⊂; S02-12 large **\\dot\\cup** glyph, S02-13 lone dots travel with **×1**; partition seam only between **I**\\|**O**; refine grid inset inside **I**; finale **Eq. 2.1** at 76 px with primer colors |
| S01-02, S03-50, S01-19, S01-28, S03-01, S03-08, S03-17, S03-25, S03-31, S03-46 | unchanged this round | Round 3 brief scoped to S02-01 primer fixes only |

---

## Orthographic rebuild

| Run | Status | What changed |
|-----|--------|----------------|
| S01-02 | rendered · 3D | Full L/R `#F5F3F0` / `#030304` split from frame 0; rotate on `mathematically`, bottom-up prism stack (`S=1.38`, unlit slabs, no ground plane); tier names on fixed side legend (36 px + leaders). Shot 5 status/kinetic/concessions panels sit in the Buffer row right of the stack (`panel_x`), not in the corner. Shots 1–9 beats unchanged. |
| S03-50 | rendered · 3D | Split visible frame 0 (no navy hold); unlit L/R prisms through `orthographic` rotation, then fixed-frame horizontal split until `looking`; fullscreen flat fills + single bottom caption keyed to `looking` / `below` (hold lengths follow those cues, not a fixed 5:1); pure black pan at `below`; `deeper` pyramid matches S01-02 scale/legend + DEEPER ARCHITECTURE. |

**Acceptance:** `.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 01 03 --only S01-02 S03-50 -j 2 --force` → both `ok` (2026-10-15). `layout: not checked (a 3D scene)`.

**Frame review** (`ffmpeg -ss … -frames:v 1` on `outputs/YT01/video/runs/960x540@15/*.mp4`):

| Check | S03-50 | S01-02 |
|-------|--------|--------|
| Frame 0 | 50% paper / 50% night pixels, no navy (`S03-50_f0`) | Same split at `t=0` (`S01-02_f0`) |
| White beat (`t≈12`) | Center ~`(230,229,228)`, caption only at bottom | — |
| Black beat (`t≈13`) | ~99% night pixels, center `(2,2,2)`, white caption | — |
| Pyramid width | ~75% of frame on midline at `t≈17` | Same stack/legend at `t≈40` (Buffer beat) |
| Labels on faces | None; side legend only | Same |

**Cues:** S03-50 — `orthographic`, `looking`, `below`, `deeper`; S01-02 — `mathematically` / `hierarchy`.

---

## Orthographic layout (round 3, reviewer frames)

| Run | Status | What changed |
|-----|--------|----------------|
| S01-02 | rendered · 3D | Pyramid shifted to `PYRAMID_X = -2` with camera `frame_center` matched; legend column `LEADER_X0 = 2.6`, labels right-aligned at `6.35` with `width = 3.55` (36 px floor); Buffer/Elite legend type uses cream `INK` on navy. Split opens before tiers are added (same order as S03-50, zoom `1.48`); `shown` primed + `wait(0.05)` so the run opens on the L/R prisms. Shot 5 STATUS / MATERIAL / kinetic gauge sit in `STATUS_PANEL_Y` below the legend, not on the Buffer row. |
| S03-50 | rendered · 3D | Same pyramid offset and legend geometry as S01-02. |

**Acceptance:** `.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 01 03 --only S01-02 S03-50 -j 2 --force` → both `ok` (2026-10-15).

**Frame review** (`edit16x9.py sheet 01 03 --only S01-02 S03-50 -r 960x540 --fps 15` → 12 tiles; plus `ffmpeg -ss … -frames:v 1` on `outputs/YT01/video/runs/960x540@15/*.mp4`):

| Check | S03-50 | S01-02 |
|-------|--------|--------|
| Open split | L/R prisms at `t≈1.5s` in run time (`top≈(230,229,225)`, `bot≈(53,53,52)`) | Same at `t≈1.5s`; storyboard `#0` at `t=0.45s` shows vertical split before rotation |
| Five legend labels | All five rows show text in column `x∈[2.5,6.45]`; max glyph extent ≈ `6.34–6.36` fu (≤ `6.4`) | Same on pyramid (`t≈35s` run) and shot 5 (`t≈34.7s` run) |
| Elite / Buffer text | Cream labels readable (no missing strings) | Same |
| STATUS / MATERIAL panel | — | Panel center `y≈-3.35` / `-3.85` fu (`py≈496` vs Buffer legend `py≈361`) |
| Pyramid fill | Stack left of legend; base span ≥ 7.5 fu with `S=1.38` | Matches S03-50 |

**Cues:** unchanged.

---

## Round 4: set primer ∪/∩ and Figure 2.1 arrows (reviewer preview defects)

| Run | Status | Changes |
|-----|--------|---------|
| S02-01 | rendered · layout ok · sheet `/tmp/S02-01.png` | Shots 7–9: `clear()` drops **U**, **I**, **O**, and **E** before teaching **A ∪ B** / **A ∩ B** alone (large centred ellipses, gold union fill then intersection lens, OR/AND); shot 10 restores **U** with disjoint **I** \| **O** plus ∅; heading stays title-only after the clear |
| S03-46 | rendered · layout ok · sheet `/tmp/S03-46.png` | **boundary projection**: short dashed `Arrow` between **I** and **O** titles (book `fig:binary-refinement`); **recursive partitions**: thin `Arrow` with `path_arc` below the blocks and two-line label |

**Acceptance:** `.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 02 03 --only S02-01 S03-46 -j 2 --force` → both `ok`, logs `layout: no problems`.
