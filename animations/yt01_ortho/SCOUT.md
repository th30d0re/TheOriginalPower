# Scout: EffectCraft's local control channel

**Never run git. Write only `animations/yt01_ortho/CONTROL_CHANNEL.md` and, if useful,
`animations/yt01_ortho/ec.py` (a client). Read-only probing: do not create, open, save or delete
projects or files through the channel, do not quit the app.**

EffectCraft 0.2.0 (`/Applications/EffectCraft.app/Contents/MacOS/EffectCraft`, a Rust binary) is
running with `EFFECTCRAFT_CONTROL_PORT=47821`, so it listens on TCP 127.0.0.1:47821. Known so far:
it accepts one JSON object per line, `{"id":1,"method":"...","params":{}}`, and replies with a JSON
line, e.g. `{"error":"unknown method `foo`","id":1,"ok":false}`. Editor command names that appear
in the binary (`file.open`, `renderQueue.list`, `script.runJavaScript`, `file.scripts.list`) are
rejected as unknown methods, so the channel's own method names differ.

Find the method set. Use `strings`/`otool`/disassembly of the binary (look near "EffectCraft control
channel", "control server listening", "unknown method", and any table of short identifiers), and
probe candidates over the socket. The goals, in order: (1) a method that runs a JavaScript/ExtendScript
file or code string (an equivalent of File > Run Script File), (2) one that starts a render-queue
render and reports progress/completion, (3) one that reports app/project state.

Report in CONTROL_CHANNEL.md: the exact request/response formats, every method found with its
params, a worked example for running `animations/yt01_ortho/build.jsx` and rendering it, and what
you could not determine.
