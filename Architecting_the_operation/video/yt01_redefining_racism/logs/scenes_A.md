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
