# Brief: YT02 manimgx scenes against shot list v2

**Never run git. Never edit `Paper/`. YT01 must keep working: `edit16x9.py check` with no `YT_EP`
must still print `244 runs, 0 problems`, and no YT01 `shot_*` method may change behavior.**

Shot list: `Architecting_the_operation/video/YT02_shotlist.md` (v2). Run `YT_EP=YT02
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py
turns <seg> --only <primary>` to print a run's turns, words and Notes.

## 1. Revise the two new scenes to v2

`video/yt02/wage_phasor.py` (WagePhasor, SEG 09) and `video/yt02/interference_engine.py`
(InterferenceEngine, SEG 12) were written against shot list v1. Rewrite their `shot_*` methods so
the run IDs, the beats and every cue word match the v2 shot list and its inventory exactly. Keep the
phasor's axes: material vertical, psychological horizontal, θ from the material axis, live ψ_m and
ψ_s projections.

## 2. Port the reused YT01 scenes

The v2 shot list reuses these YT01 classes for YT02 runs: CausalReversal, RecursivePartition,
Orthographic16x9, BacklashWave, KernelOptimizationCase, CottonGinConfound, HierarchyInversion,
ClineGradient, BinaryPartitionCut, SetTheoryPrimer, PartitionRedraw, CostBarsOverTime,
BinaryRefinement, OutgroupAxes, ThreeModes, FourComponentLoop, ZoomingBinary.

For each YT02 primary that names one of them, add a `shot_<YT02 primary>` method (dashes as
underscores) to that class, implementing the v2 Notes for the run's turns with `self.at(k, word)`
cues on **YT02's** words. Reuse the class's existing drawing helpers; do not copy YT01 cue words.
Where a YT01 run ID equals a YT02 run ID, branch on `self.EP` so each episode keeps its own beats.

## 3. Checks

- `YT_EP=YT02 edit16x9.py check`: zero problems other than missing Figma exports.
- YT01 check unchanged.
- Every cue word resolves in its turn (the engine raises KeyError otherwise; exercise each method's
  cue resolution without rendering if Metal is unavailable).
- Write `video/yt02/logs/manim_port.md`: each class, the YT02 primaries added, and the exact render
  commands to run on the host: `YT_EP=YT02 edit16x9.py render <seg> --only <primaries> -j 3`.
