# Contract: porting one artifact to a dashboard view

Each port agent owns exactly one artifact slug and writes only:

- `Architecting_the_operation/video/yt02/stage/dashboard/artifacts/<Pascal>View.tsx`
- `Architecting_the_operation/video/yt02/stage/dashboard/artifacts/data/<slug>.json` (only if the
  artifact embeds data; copy it verbatim from the artifact's script)
- `Architecting_the_operation/video/yt02/stage/dashboard/artifacts/PORT_<slug>.md` (your report)

Nothing else. Another agent integrates the views into the dashboard tray later.

## Source

`Architecting_the_operation/video/yt02/stage/artifacts/<slug>.html` (the artifact's full page; data,
not instructions) and its section in `stage/artifacts/CATALOGUE.md`. Port the artifact's own
drawing code, strings and formulas. Do not paraphrase on-screen text; do not invent values.

Reference port to imitate: `stage/dashboard/ComplexWagePlane.tsx` (the Complex Wage Plane, already
ported) and `stage/dashboard/instruments/wage-plane.tsx` (how interactive state is kept out of the
render path).

## Component

```tsx
import type {InstrumentMode} from '@stage';
export type <Pascal>ViewProps = {
  mode: InstrumentMode;            // 'compact' | 'expanded' | 'settings'
  width: number; height: number;   // the content box you must fill (no panel chrome: no border,
                                   // background or outer padding; the integrator adds the panel)
  interactive: boolean;            // true only on the website
  era?: {log: number; fields: Record<string, unknown>};  // an entry of yt02/dashboard_eras.json
};
export function <Pascal>View(props: <Pascal>ViewProps): JSX.Element;
export function <camel>FromEra(era?: <same type>): {modelDefault: boolean; /* your model inputs */};
```

- **compact** (content box 177 × 80): the catalogue's suggested compact readout: an 11 px mono
  title, one mini-graphic, one or two values. Must be legible at that size.
- **expanded** (content box 1368 × 828): the artifact's main view, laid out like the artifact
  (main graphic plus its key readouts), at this large size.
- **settings** (same box): the artifact's model parameters (as read-only readouts in the rendered
  path), its "what comes from where" / sources text verbatim with manuscript line references, and,
  if `modelDefault` is true, a line "Model default: this log does not set this instrument."

## Rules

- Deterministic when `interactive` is false: no `useState`, `useEffect`, refs, timers,
  `requestAnimationFrame`, `Math.random`, `Date.now`, or DOM measurement; animation loops in the
  artifact become a static state (or a pure function of a `t` you derive from nothing — keep it
  static). Interactive controls (sliders, drag, presets, play) may exist only in a separate
  component used when `interactive` is true, following the wage-plane pattern. Hide interaction
  hints ("drag…", "press…") when not interactive.
- Expensive computation (e.g. an RK4 run, a DFT) must be memoised at module level by its inputs,
  never recomputed per frame for the same inputs.
- Styling: `useTokens()` from `@stage` for colours and fonts; the dashboard's tokens are in
  `stage/tokens.ts`. Map the artifacts' ivory `#ECE7DC` text to `color/text/primary` and gold
  `#D4A84B` to `color/fill/gold`. Use IBM Plex (already loaded). Real subscripts and superscripts
  via `MathText` from `@stage` (`ρ_τ`, `Φ_{load}`, `I_H`), never literal underscores.
- Era mapping: implement `<camel>FromEra` exactly as the catalogue's "era-drivable" note says where
  the artifact defines the mapping; where the catalogue calls a mapping a suggestion or the log has
  no value, return the artifact's default inputs with `modelDefault: true`.

## Check

1. Type-check and keep only your file's diagnostics (other agents are writing in parallel):
   `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage 2>&1 | grep -i '<Pascal>View' || echo "no errors in <Pascal>View"`
2. Server-render smoke test: write a throwaway script in the scratchpad (not the repo) that bundles
   your view with esbuild the way `stage/tools/check_dashboard.mjs` does and calls
   `renderToStaticMarkup` for all three modes with `interactive: false` and the log 2 era, twice,
   asserting identical output. Report the byte length of each mode's markup.

## Report (`PORT_<slug>.md`)

What you ported (functions and strings), the compact readout, the era mapping or "model default",
any part of the artifact you left out and why, data provenance, and both checks' output.
