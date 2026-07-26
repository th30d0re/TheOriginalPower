# Equation Field

A Three.js visualization of every numbered equation in the *Redefining Racism* manuscript,
plus interactive 3D scenes for its canonical equations.

239 equations from 22 chapters are arranged as 3D cards on a ring: one constellation
per chapter, in manuscript order. Each card renders its LaTeX with KaTeX. The 17
equations the manuscript's Equation Registry marks as canonical (E214–E229) plus the
E061 compliance differential also carry a full 3D visualization: surfaces, fields,
particles, and trajectories with live parameter sliders.

## Run

```bash
cd equation_explorer
python3 -m http.server 8793
# open http://localhost:8793
```

Port 8000 is occupied on this machine (Docker); 8793 is the default here. Any free
port works — pass a different number to `http.server` if 8793 collides too.

Any static file server works. Opening `index.html` directly from the filesystem does
not work: browsers block `fetch()` of `data/equations.json` from `file://` URLs.

## Controls

- Drag to orbit, scroll to zoom.
- Click a card to inspect the equation (rendered LaTeX, source, chapter, section).
- `←` / `→` step through equations in manuscript order; `Esc` closes the panel.
- The sidebar jumps to a chapter; the search box filters cards by symbol, label, or section.
- `#E214`-style URL hashes deep-link to a single equation.

## 3D Views (visualization mode)

- Click **Visualize 3D** in the detail panel, press `V`, pick an entry from the
  sidebar's **3D Views** gallery, or open `#viz=E214`-style links directly.
- Each scene floats its own equation as a plaque and exposes parameters as sliders
  (the scene rebuilds live). `Esc` or **← Field** returns to the field.
- Scenes: predatory min-max (E214), effective resistance (E215), suppression envelope
  (E216), crash condition (E217), benefit staircase (E218), compliance differential
  (E061), Lorentz force (E219), complex wage (E220), conjugate identity (E221),
  Drude channel (E222), capacitor (E223), inductor (E224), power triangle (E225),
  spectral carrier (E226), buffer work integral (E227), accumulated extraction
  (E228), damped constrained Lagrangian (E229).

## Data

`build_data.py` consolidates `../equation_audit_chunks/*.json` into
`data/equations.json`, stripping `\label{}` and environment wrappers, repairing
corrupted line breaks, wrapping bare alignment `&` in `aligned`, and deriving
chapter order from manuscript line numbers. Re-run it after the audit chunks change:

```bash
python3 build_data.py
```

## Stack

Three.js (`CSS3DRenderer` for the cards and plaques, WebGL for stars, constellation
lines, and the visualization scenes) and KaTeX, both vendored under `vendor/` so the
site runs offline. Visualization scenes live in `viz/` (`registry.js` maps equation
ids to scene builders).

