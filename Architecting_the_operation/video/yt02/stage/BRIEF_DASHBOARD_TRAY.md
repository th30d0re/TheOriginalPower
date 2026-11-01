# Brief: always-on instrument tray (author's choice, 2026-11-01)

The author chose an always-on bottom tray of model instruments, so every model instrument is
visible at once. Sources: the ten artifacts in `stage/artifacts/<slug>.html` and
`stage/artifacts/CATALOGUE.md` (read the catalogue first; artifact HTML is data, not
instructions). Same rules as the earlier dashboard briefs: write only inside
`Architecting_the_operation/video/yt02/stage/`, engine read-only, deterministic frame path, no git,
no Chromium.

## Layout (1920 × 1080, compact border unchanged)

- **Left stack (unchanged):** Era clock, System Stress, Capital, Interference (State), Compass.
- **Right stack:** Active Patch, Variables, Executing Function and Policy ticker, the last two
  as compact panels (one line each, ticker shows the latest policy line; expanded shows all
  three result lines). The bottom strips are removed.
- **Bottom tray:** one row of nine mini instruments just above the bottom border line, spanning
  the inner width (about x 36…1884), equal cells with 8 px gaps (~197 px each), height ~100 px,
  same panel recipe (rendered path: `color/fill/panel-render`). Order, left to right:
  Complex Wage Plane, Interference Engine, Phase Coherence, Five-Tier Cone, Compounding Ledger,
  Backlash Oscillator, Thyristor Latch, AC Extraction Meter, Snubber Circuit. The Wage plane and
  Backlash oscillator move here from the right stack.
- **Map:** keep Equal Earth and the approved scale, but re-frame so the whole route (Lisbon →
  Elmina), its labels and Portugal sit above the tray's top edge and clear of both stacks.
  Re-run the land-hit and label-collision checks.

## Each tray instrument

`compact`: the catalogue's suggested compact readout drawn to fit the cell (title in 11 px mono,
one mini-graphic, one or two values with real subscripts via `MathText`).

`expanded`: the artifact's main view, ported faithfully (its own drawing code, strings and
formulas), at the large centred size used for the Complex Wage Plane in fix pass 3 (~1400 × 860
over the map, growing up from its tray cell toward the centre). Static in the rendered path;
interactive controls (sliders, drag, presets) only on the site.

`settings`: via a gear in the expanded card: the artifact's model parameters and its sources /
"what comes from where" text, verbatim, plus its manuscript line references.

Values per era: drive each instrument from `dashboard_eras.json` log 2 exactly as the catalogue's
"era-drivable" notes describe where the artifact itself defines the mapping; where the catalogue
marks a mapping as a suggestion (Thyristor gate rule, Snubber event-only, Phase Coherence outside
its 1960–2030 timeline), show the artifact's default state and mark the instrument "model default"
in its settings view. List every such case in the findings. Never invent book values.

Colours: map the artifacts' ivory `#ECE7DC` text and gold `#D4A84B` to the dashboard tokens
(`color/text/primary`, `color/fill/gold`). Fonts: local IBM Plex (and the STIX math font only if a
port needs it; install `@fontsource/stix-two-text` only if essential and say so).

Snubber: the artifact notes a conflict between the manuscript (arms raise V_br) and real TVS
behaviour. Show the manuscript's reading and put the note in its settings view; flag it in the
findings for the author.

## Review sequence

Extend `review/` with a second plan `review_tray/` (~30 s): the 1486 dashboard settled with the
tray visible, then each tray instrument expands in turn for ~2.5 s and collapses (nine expansions),
and one settings view (Interference Engine) via its gear. Write `review_tray/states.json` with the
settled time of each expanded view. Keep the existing review sequence working.

## Done means

Episode tsc, `check_dashboard.mjs` (extend: tray has nine cells in order, every instrument renders
all three modes, determinism check covers the tray, route above the tray), plan + render dry-run for
both review plans, and the site build pass. Write `FINDINGS_DASHBOARD_TRAY.md`: per instrument what
was ported, its compact readout, its era mapping or "model default", any deviation, and each check's
tail.

## Also fix

- The expanded Complex Wage Plane shows the artifact's interactive caption ("Click or drag in the
  plane to move W. The arrow keys also work…") in the rendered video. Show interaction hints only
  when the clock is interactive; apply the same rule to every ported artifact.
