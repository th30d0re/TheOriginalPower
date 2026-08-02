# TASK V11 — Small parameterised widgets calibrated to each analysis

You are working in the worktree on branch `agent/codex-V2`, reset to current `main`.
Read `videolab/CONTRACT.md` **§13** first — it defines the widget specification.

## Why the current approach is wrong

The videolab detail page maps a concept id to an existing full-page visualisation. That
puts a twelve-axis Interference Engine on a page about one argument, and an Extraction
Chart on a page where no actor captures material value. The charts decorate; they do
not illustrate.

Replace that with widgets built from parameters the analysis derives from the video.
A reel arguing about gender draws **one** axis. A reel with no extraction kernel draws
**no** extraction widget.

## What to build

Four small React components in `website/src/videolab/widgets/`. Each is embeddable,
self-contained, sized to its container, and carries no route chrome, no viewport-filling
stage, and no full-page control bar. SVG and CSS only — do not import three.js.

Read `PhasorResonance.tsx` first for the house visual language (palette, axis
treatment, label style) and stay consistent with it.

### `WagePhasor` — `{ thetaDeg, psiM, psiS }`
One phasor on the complex plane. Real axis $\psi_m$, imaginary axis $j\psi_s$, quadrant
shading, the angle arc labelled. Static at the given angle; no free-running animation.

### `AxisDeflection` — `{ axes, eAmplitude, bAmplitude }`
The one the owner asked for specifically. Draw the vertical material field $\vec{E}$ as
an upward arrow along $+y$, and for **each named axis** a sine wave perpendicular to it,
labelled with that axis. Then show the resulting $\vec{v} \times \vec{B}$ deflection as a
horizontal arrow turning motion off the vertical.

`axes` holds one to three entries. Give each axis a stable colour. Draw only the axes
passed — a single-axis call renders a single wave, and that is the normal case.

### `CyclotronLoop` — `{ eMagnitude, bMagnitude }`
A charge's trajectory under those two fields. Large `b` with small `e` closes the path
into a loop that returns to its start; raising `e` opens it into a drift toward $+y$.
Mark net vertical displacement numerically so "high energy, zero progress" is legible
rather than implied. Animate the traversal gently; respect
`prefers-reduced-motion`.

### `ConjugateCancel` — `{ psiM, psiS }`
$W = \psi_m + j\psi_s$ and $W^{*} = \psi_m - j\psi_s$ as two vectors, plus their sum.
Show the imaginary parts cancelling and the sum landing at $2\psi_m$ on the real axis.
When `psiM` is 0 the sum lands on the origin — label that state explicitly, since it is
the case the first analysis exercises.

## Wiring

Read `framework_notes.widgets` from the job. Render each spec in order: the widget,
then its `caption` as prose beneath. Unknown `type`, or params outside the documented
ranges, render the caption alone with a quiet note — never crash the page.

Remove the concept→full-page-widget mapping and the link cards added in loop 9.
`concepts` stays as the chip row; it no longer selects visuals. Delete
`linkOnlyWidgets` and the `widgetRegistry` lazy imports, and drop the now-unused
`.vl-widget` containing-block CSS.

Keep `/interference-engine` and `/extraction-chart` exactly as they are. They are good
as immersive routes and are simply not embedded.

## Exit criteria

- `cd website && npm run build` succeeds with no new TypeScript errors, and the videolab
  chunk no longer pulls in three.js.
- `/videolab/instagram-DbaSgWUuwrx` renders exactly three widgets — `conjugate_cancel`,
  `cyclotron_loop`, `axis_deflection` — each with its caption, and **no** extraction
  visual, because that analysis emits no `extraction_ledger` spec.
- `AxisDeflection` with `axes: ["gender"]` draws one labelled wave.
- `ConjugateCancel` with `psiM: 0` shows the sum at the origin with that state labelled.
- A malformed spec renders the caption and a note instead of throwing.
- Append a "Loop 11" section to `videolab/docs/V2-findings.md`.

## Constraints

Add no dependencies. Do not modify the videolab pipeline modules. Never write DM text,
usernames, or thread titles into findings, fixtures, or tests. Do not attempt
`git commit`.
