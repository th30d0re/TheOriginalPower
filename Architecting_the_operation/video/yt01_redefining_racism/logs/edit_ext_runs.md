# ext: run support — edit16x9.py

## Changes

- **`edit16x9.py`**: Shots with `Render: ext:<repo-relative.mp4>` (parsed by `common16x9.load_shots` as `file=ext`, `scene=<path>`) conform via ffmpeg instead of manimgx.
  - `conform_ext()`: `fps`, `scale` to `-r`, `tpad` (clone) + `trim` to the run's manifest frame count (`run_frame_count()`), `-an`, `libx264` / `veryfast` / `crf 23` / `yuv420p`.
  - `render`: writes `outputs/YT01/video/runs/<WxH>@<fps>/<primary>.mp4`; `--force` re-conforms from source; source file is never deleted.
  - `check`: for `ext` primaries, valid when `ROOT/<scene>` exists; holds must still share the same render target.
- **`YT01_shotlist.md`**: S03-50 and S03-51 `Render` set to `ext:animations/yt01_ortho/yt01_ortho.mp4` (S03-51 `Holds: S03-50` unchanged).

## Conform smoke test (not S03-50)

Did not run `render --only S03-50` (ortho worker owns that asset).

```bash
cp outputs/YT01/video/runs/960x540@15/S03-46.mp4 /tmp/ext_test.mp4
# conform_ext(/tmp/ext_test.mp4 → /tmp/ext_conform_out.mp4, 960x540@15, n=run_frame_count(S03-46))
```

- Manifest run length for S03-46 (holds S03-47–49): **573** frames @ 15 fps.
- Conformed output: **960×540**, **r_frame_rate=15/1**, duration **38.07 s**, **nb_frames=572** (within one frame of target; VFR source).

## `check` (repo root, outside sandbox)

```bash
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py check
```

```
every Render target exists
234 runs, 0 problems
```

Exit code **0**. `animations/yt01_ortho/yt01_ortho.mp4` is present on disk at check time, so S03-50 passes ext validation.

## S03-50 run timing (reference)

- Run shots: S03-50, S03-51.
- Manifest frame span @ 15 fps: **271** frames (episode grid indices F[105]..F[107]).
