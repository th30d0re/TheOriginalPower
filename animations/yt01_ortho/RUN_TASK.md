# Make build.jsx run in EffectCraft and render the shot

**Never run git. Do not touch `Paper/`. Write only files in `animations/yt01_ortho/`.** Do not
quit EffectCraft. You may create, modify and render projects in EffectCraft through the channel:
that is the task. Do not open or modify any other project.

EffectCraft 0.2.0 is running with its control channel on 127.0.0.1:47821. `CONTROL_CHANNEL.md`
(this folder) documents it; `ec.py` is the client. Run the build with:

    python3 animations/yt01_ortho/ec.py --timeout 300 engine.execute '{"command":"file.runScript","params":{"path":"/Users/emmanuel/Documents/Theory/TheOriginalPower/animations/yt01_ortho/build.jsx"}}'

Today it fails: `build.jsx (line 102): TypeError: cannot convert 'null' or 'undefined' to object`.

1. Fix `build.jsx` until the run succeeds, keeping the picture `BRIEF.md` specifies (beat table,
   colours, continuous 3-D camera moves, no cuts). Use `engine.commands` (filter by keyword) and
   small `script.run` probes to learn what the host supports; replace unsupported After Effects
   calls with the host's equivalents. Start each attempt from a new project (`file.newProject`)
   so failed attempts do not pile up comps. EffectCraft's prefs have `allowScriptsWriteFiles:
   false`, so do the render-queue setup and project save through channel commands
   (`renderQueue.add` with `format:"h264"`, `output`, `timeSpan:"comp"`; `renderQueue.render`
   with `wait:true`; `file.saveAs`), not from inside the script.
2. Render to `animations/yt01_ortho/yt01_ortho.mp4` (1920x1080, 30 fps, 18.1 s). Confirm with
   `ffprobe` (dimensions, fps, duration).
3. Check the picture against the beat table: extract frames with ffmpeg at t = 0.5, 3.5, 6.8,
   10, 12.9, 15, 17.5 s into `animations/yt01_ortho/check/`, and for each, measure what the brief
   requires (e.g. at 6.8 s the frame is ≥ 95% white pixels; at 12.9 s ≥ 95% black; at 0.5 s the
   left half white and the right half black; at 17.5 s five tier colours present and the label
   text inside the frame). Fix and re-render until every check passes.
4. Save the project as `animations/yt01_ortho/yt01_ortho.ecproj`.

Report in `animations/yt01_ortho/RUN_NOTES.md`: every error you hit and its fix, the final
commands, the ffprobe line, and the per-frame check results.
