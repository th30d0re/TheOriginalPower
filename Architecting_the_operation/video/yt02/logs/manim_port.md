# YT02 manimgx Port

## Scene Inventory

| Class | YT02 primary |
|---|---|
| `Orthographic16x9` | `S02-05` |
| `FourComponentLoop` | `S02-11` |
| `SetTheoryPrimer` | `S03-08` |
| `BinaryRefinement` | `S03-19` |
| `OutgroupAxes` | `S03-27` |
| `RecursivePartition` | `S03-33` |
| `ZoomingBinary` | `S03-42` |
| `CausalReversal` | `S05-10`, `S06-04` |
| `ClineGradient` | `S07-43` |
| `BinaryPartitionCut` | `S07-48` |
| `PartitionRedraw` | `S08-42` |
| `WagePhasor` | `S09-01` |
| `KernelOptimizationCase` | `S10-06` |
| `CottonGinConfound` | `S10-11` |
| `CostBarsOverTime` | `S10-17` |
| `BacklashWave` | `S10-36` |
| `InterferenceEngine` | `S12-01` |
| `HierarchyInversion` | `S13-01` |
| `ThreeModes` | `S14-11` |

## Host Render Commands

Run these commands from the repository root on a Metal-capable host.

```bash
YT_EP=YT02 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 02 --only S02-05 S02-11 -j 3
YT_EP=YT02 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 03 --only S03-08 S03-19 S03-27 S03-33 S03-42 -j 3
YT_EP=YT02 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 05 --only S05-10 -j 3
YT_EP=YT02 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 06 --only S06-04 -j 3
YT_EP=YT02 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 07 --only S07-43 S07-48 -j 3
YT_EP=YT02 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 08 --only S08-42 -j 3
YT_EP=YT02 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 09 --only S09-01 -j 3
YT_EP=YT02 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 10 --only S10-06 S10-11 S10-17 S10-36 -j 3
YT_EP=YT02 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 12 --only S12-01 -j 3
YT_EP=YT02 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 13 --only S13-01 -j 3
YT_EP=YT02 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 14 --only S14-11 -j 3
```

## Sandbox Verification

- Python compilation passed for all 17 edited scene modules.
- All 17 edited scene modules imported under `YT_EP=YT02`.
- All 20 new shot methods completed dry execution with playback hooks disabled.
- Cue lookup resolved 143 direct and sequence lookups covering all 141 run turns.
- The YT02 editor check reports 124 runs and 104 expected missing Figma exports.
- The YT01 editor check remains at 244 runs and 0 problems.
- Mechanical and independent prose reviews found zero prohibited rhetorical constructions.
- Metal rendering remains assigned to the host commands above.
