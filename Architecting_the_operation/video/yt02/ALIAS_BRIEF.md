# Brief: map 16 reused-scene shots to their existing methods

**Never run git. Edit only the `Render:` lines of `Architecting_the_operation/video/YT02v2_shotlist.md`. Write
`Architecting_the_operation/video/yt02/logs/alias_v2.md`.**

These shots render a reused scene class whose code has no `shot_<id>` method for the new v2 id:

BacklashOscillator S05-25; BinaryPartitionCut S07-13; BinaryRefinement S03-09; CausalReversal S05-14, S06-07,
S06-08; ClineGradient S07-12; FourComponentLoop S02-06; OutgroupAxes S03-11; PartitionRedraw S08-54;
RecursivePartition S03-13; SetTheoryPrimer S03-04; ThreeModes S14-12, S15-11; WagePhasor S10-29, S10-43.

For each shot:
1. List the `shot_*` methods that its class defines (grep `def shot_` in its file, as given on its Render line).
2. Pick the method whose content best matches this v2 shot's title and Note. The v1 shot lists
   (`Architecting_the_operation/video/YT02_shotlist.md`, `YT01_shotlist.md`) give each old id's title. If the class
   has only `build()`, pick nothing; build() is used automatically.
3. Append ` as=<old id>` (dash form, e.g. `as=S03-08`) to the shot's `Render:` value, inside the backticks after the
   scene, e.g. `manim:yt02/wage_phasor.py:WagePhasor as=S09-14`.

Log a table in the report: shot, class, chosen method, and a one-line reason.

Then run `YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py check`
and report its summary.
