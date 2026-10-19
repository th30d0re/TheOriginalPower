# Brief: make the YT02v2 fixed runs render (cue words)

Same file rules as `Architecting_the_operation/video/yt02/MANIM_FIX_V2_BRIEF.md`. Never run git.

`outputs/YT02v2/words.json` now holds the real word timings. Every run below fails, because a scene cues a word that
is absent from its turn:
- `KeyError: 'Elite' absent from turn 66`, `'Enforcement'` turn 67, `'base'` turn 68 (TierPyramid, S02-03/04/05);
- `'oscillation'` turn 138 (RLCTeach, S05-24/26);
- `'answers'` turn 268 (WagePhasor, S09-01);
- `'Equation'` turn 326 (WagePlaneHero, S10-06);
- `'central'` turn 438 (InterferenceEngine, S12-01).

For each run, read its real words with
`YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py turns <seg> --only <primary>`.
Then change every cue in that scene so it uses a word that is actually spoken in that turn and names the element (match
case and punctuation as `words.json` stores them). Check **every** cue in these scenes, beyond the first failing one.

Loop until all seven render:

```
YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 02 05 09 10 12 --only S02-03 S05-24 S09-01 S10-06 S12-01 -r 960x540 --fps 15 -j 4
```

Then run
`… edit16x9.py sheet 02 05 09 10 12 --only S02-03 S02-04 S02-05 S05-24 S05-26 S09-01 S09-36 S10-06 S10-11 S10-20 S12-01 S12-05 -r 960x540 --fps 15`.
Append to `logs/manim_fix_v2.md` the cue changes (scene, old word, new word, turn) and the sheet output path.
Also apply the round-2 layout fixes from `MANIM_FIX_V2b_BRIEF.md` if any remain undone.
