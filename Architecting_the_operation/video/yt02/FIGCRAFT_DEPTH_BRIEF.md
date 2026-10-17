# Brief: depth pass on the FigCraft runtime dashboard (Gemini, round 2)

**Never run git. Never edit `Paper/`. Write only under `Architecting_the_operation/video/yt02/figcraft/`.**

The author reviewed your dashboard (`figcraft/build_dashboard.py`, `era_*.png`, `NOTES.md`) and likes
it. Keep the layout, data, palette, line-art character and layer names exactly. It reads flat; add
**shadows and depth so the system looks modern**. Edit `build_dashboard.py` and rebuild every era, so the
look stays reproducible.

FigCraft supports `effect.add {ids?, type: dropShadow|innerShadow|layerBlur|backgroundBlur|noise|texture|glass, effect?}`,
`effect.set`, and gradient paints in `fills`. Read each command's params with `engine.commands` first.

**Find the effect and gradient formats empirically, never from the binary.** Do not run objdump,
strings, or any disassembler on FigCraft (a previous attempt spent 25 minutes doing that and produced
nothing). Instead: create a scratch rectangle, call `effect.add {ids: [id], type: "dropShadow"}` with no
`effect`, then `node.get {id}` and read the effect object FigCraft wrote; edit that shape and write it
back with `effect.set` or `node.set {effects: [...]}`. Do the same for a gradient: set
`fills: [{type: "linearGradient", ...}]` variations and read back with `node.get` until one sticks.
Delete the scratch node afterwards.

## Depth system (apply consistently, three elevation levels)

1. **Background (level 0).** A subtle radial vignette on the frame: slightly lighter navy at the centre,
   darker at the corners. Optional very low noise/texture (2–4%) so large navy areas do not band.
2. **Panels (level 1).** Fill with a soft vertical gradient (top a touch lighter than bottom).
   Two stacked drop shadows: a tight contact shadow (y 2, blur 4, black ~35%) and a wide ambient shadow
   (y 16, blur 40, black ~30%). A 1 px inner highlight along the top edge (inner shadow, light, ~6%)
   so edges catch light. Keep the existing 1–2 px outlines, at lower opacity.
3. **Raised elements (level 2):** the active era tab, the CRITICAL/AT RISK badges, deployed chips,
   the dial needle hub. Stronger shadow than panels, plus a soft outer **glow** in the element's own
   accent colour (gold or red drop shadow, y 0, blur 16–24, ~35%).
4. **Wells (inset):** the Φ_load track, the dial track, the Active Patch console line, the Result
   rows and the Interference text box sit *into* the panel: inner shadow (y 2, blur 6, black ~45%),
   darker fill than their panel.
5. **Data glow:** the Φ_load range fill, the ρ_τ sector and needle, and the crash marker get a
   gentle glow in their colour so the live readings are the brightest things on screen.

Keep text crisp: no shadows on text except a very faint one on the era date. No glass or blur on
anything that holds text. Contrast must not drop.

## Deliver

Rebuild all seven eras, keep the smart-animate prototype flow, re-export `figcraft/era_<year>.png`
(overwrite), save `figcraft/yt02_dashboard_depth.figcraft`, and append a "Round 2: depth" section to
`NOTES.md` with the effect values you used and anything FigCraft could not do.
