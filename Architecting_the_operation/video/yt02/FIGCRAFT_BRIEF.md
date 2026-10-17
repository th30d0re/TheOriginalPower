# Brief: build the YT02 runtime dashboard in FigCraft (Gemini, separate session)

**Never run git. Never edit `Paper/`. Write only under `Architecting_the_operation/video/yt02/figcraft/`
(scripts, the saved FigCraft file, exported PNGs, notes). No helper files anywhere else; scratch goes
in /tmp.**

## Goal

Build the same dashboard specified in `Architecting_the_operation/video/yt02/DASHBOARD_SPEC.md`,
in **FigCraft** (a local, Figma-like design app), driven entirely through its control channel, with
no clicking in the UI. The author wants to see how far the design work can go without Figma.
Claude is building the Figma version in parallel; this is the comparison.

Data: `Architecting_the_operation/video/yt02/dashboard_eras.json` (seven eras, verbatim values from
the book's RUNTIME LOG boxes). Wait for that file to exist before building. Every on-screen value
comes from it, verbatim. Numbers appear only where the file has them.

## FigCraft control channel (verified 2026-10-17)

- FigCraft 0.6.0 is running with `FIGCRAFT_CONTROL_PORT=47831`: JSON lines over TCP on
  127.0.0.1:47831. Request `{"id": 1, "method": "...", "params": {...}}`, one line in, one line out.
- A client exists: `python3 animations/yt01_ortho/ec.py <method> '<params json>' --port 47831`
  (written for EffectCraft; same envelope). Write your own small client under `figcraft/` if you need
  batching.
- `engine.commands {filter?, enabledOnly?}` lists all 552 commands with their parameter docs
  (`id, label, menu, params, shortcut, enabled, why`). **Read the params text of each command
  before using it.**
- `ui.menu.invoke {id, params}` runs a command (verified with `doc.list`).
  `engine.execute {command, params}` timed out on `doc.list`; find out why (it may need a visible
  canvas or an open document) and say what works in your notes.
- `ui.inspect {}` returns the UI state.
- Useful commands: `file.new`, `node.create` (rectangle, ellipse, line, arrow, vector, text, frame,
  …; `props` takes `node.set` keys), `node.set` (fills, strokes, cornerRadius, layout, gap, padding,
  …), `text.create`, `text.style`, `node.reparent`, `file.saveAs`, `file.export` (png at 1920 wide),
  and `proto.interaction.add` (afterDelay + smart animate / dissolve transitions) with
  `proto.present`. FigCraft has **no timeline animation**, so motion means prototype transitions
  between one frame per era.

## Deliver

1. One 1920×1080 frame per era (named `era 1486`, `era 1676`, …), with named layers per
   DASHBOARD_SPEC.md (`stress badge`, `phi bar`, `rho dial`, `chip I_buffer`, `ticker 1`, …).
   YT01 palette: background `#0F1B33`, panel `#16264A`, ink `#F4EAD2`, dim `#9FB0CF`, gold
   `#D9A441`, red `#E2573F`, blue `#5FA8D3`. Font: Noto Sans.
2. A prototype flow that steps through the eras with afterDelay smart-animate transitions.
3. Saved file `figcraft/yt02_dashboard.fig` (or FigCraft's native format), and PNG exports
   `figcraft/era_<year>.png`.
4. `figcraft/NOTES.md`: what worked, what didn't, every command you used, time taken, and anything
   in FigCraft's API that blocked the spec.
