# Port Report: five-tier-cone

## Overview

- **Slug**: `five-tier-cone`
- **Component**: `FiveTierConeView` in `Architecting_the_operation/video/yt02/stage/dashboard/artifacts/FiveTierConeView.tsx`
- **Helper**: `fiveTierConeFromEra`
- **Data File**: None required. `five-tier-cone.html` contains no external or embedded tabular datasets.

## Ported Functions and Formulas

1. **Hierarchy Geometry and Projection**:
   - Cone parameters: total height $H = 5$, base radius $R_B = 4$, scale factor $SC = 54$, origin $(X_0, Y_0) = (360, 290)$.
   - Tier definitions:
     - $E$: apex $z = 4.55$, radius $r = 0.36$, offset $(-2.6, 2.0)$
     - $P_{uppet}$: $z = 3.45$, radius $r = 1.24$, offset $(-0.5, -1.5)$
     - $F_{enforce}$: $z = 2.35$, radius $r = 2.12$, offset $(1.0, 2.0)$
     - $I_{buffer}$: $z = 1.25$, radius $r = 3.00$, offset $(1.4, -1.6)$
     - $O$: base $z = 0$, radius $r = 4.00$, ground sink
   - Projection (`proj3D`): orthographic projection of $(x, y, z)$ into $(x', y', d)$ incorporating azimuth rotation around the $z$-axis and elevation tilt.
   - Convex Hull (`computeConeHull`): Monotone Chain 2D convex hull of the 96 base perimeter points and apex point, memoized at module level by azimuth and elevation.

2. **Tri-Modal Enclosure and View Limit**:
   - Enclosure score ($S_{enc}$):
     $$S_{enc} = \frac{1}{\sqrt{2}}\sqrt{\left(\frac{e_1 + e_2}{2}\right)^2 + e_3^2}$$
     Retains the unrationalized $1/\sqrt{2}$ factor per the project mathematical notation convention.
   - Maximum elevation allowed:
     $$\text{el}_{max} = -90^\circ + 180^\circ \cdot (1 - S_{enc})$$
     When enclosure lock is active, limits the observer to angles within this boundary.

3. **Disc Obscuration and Alignment**:
   - `computeVisible`: grid-samples $41 \times 41$ coordinates over disc $E$ to measure the fraction uncovered by $P$, $F$, or $I$ looking straight up the $z$-axis. Memoized at module level by alignment factor $al$.
   - Tier alignment ($al$): implements the $\theta$-collapse condition ($\theta_E = \theta_P = \theta_F = \theta_I$, eq. 14.5). At $al = 1.0$, all tier centers align on the central axis ($E$ obscuration is 100%). Lower values translate the tiers along their prescribed displacement vectors.

4. **Verdict Determination**:
   - `verdictText`: evaluates elevation angle, enclosure limit, and visibility percentage to produce the analytical status statement.

## Ported Strings and Citations

All on-screen text, technical descriptions, and manuscript line citations are preserved verbatim:
- Manuscript lines: cone and nodes (`:486–:593`), circuit element mapping table and voltage-drop inequality (`:604–:650`), Tri-Modal Enclosure score eq. 1.1 (`:713`), Flat Ceiling and Elite Obscuration (`:770–:810`), and angular-collapse condition eq. 14.5 (`:13751`).
- Circuit element descriptions:
  - $E$: Voltage source: sets the potential across the network; never touched by the current it generates.
  - $P_{uppet}$: Potential divider: turns E's potential into policy-level drops and absorbs blame that would arc to E.
  - $F_{enforce}$: Current source: the conductive path that makes law executable as amperage.
  - $I_{buffer}$: Dielectric: receives $W = \psi_m + j\psi_s$, stores energy in the ideological field, passes no current to E.
  - $O$: Sink / ground: all net current flows here.
- Circuit benefit ordering: $\text{Benefit}(E) \gg \text{Benefit}(P) > \text{Benefit}(F) > \text{Benefit}(I) > \text{Benefit}(O)$ (eq. 0.2).

## Compact Readout

- **Dimensions**: fits the allocated $177 \times 80$ content box.
- **Header**: 11 px mono title `FIVE-TIER CONE` with right-aligned category label `3D HIERARCHY`.
- **Mini-Graphic**: a $66 \times 52$ SVG rendering the orthographic cone silhouette, apex disc $E$, intermediate layers $P$, $F$, $I$, base ellipse $O$, and upper $z$-axis guide.
- **Telemetry Readout**: tabular numeric values displaying:
  - `E vis 0%` (highlights green when fully obscured, accent orange when visible)
  - `S_{enc} 0.30` (rendered via `MathText`)
  - `max el 36°`

## Era Mapping and Model Default

- **Function**: `fiveTierConeFromEra(era)`
- **Behavior**:
  - The manuscript runtime logs do not define numeric inputs for cone angles or enclosure parameters. Consequently, `fiveTierConeFromEra` returns `modelDefault: true` alongside default model values ($el = 22^\circ$, $az = -28^\circ$, $al = 1.0$, $e_1 = e_2 = e_3 = 0.30$, $\text{lock} = \text{true}$).
  - In `settings` mode, the component explicitly renders the required notice: `"Model default: this log does not set this instrument."`
  - Variable activation: inspects `variables_loaded` and `variables_deployed` from the era object. Node presence modulates tier fill opacity ($1.0$ when active, $0.28$ when uninitialized in earlier historical eras).

## Adaptations and Omissions

1. **Elimination of DOM Manipulation**:
   - Replaced imperative vanilla DOM manipulation (`document.getElementById`, `innerHTML`) with declarative React SVG elements.
2. **Interactive vs Non-Interactive Separation**:
   - When `interactive` is false, the component executes a purely static render path. It invokes zero React state or lifecycle hooks (`useState`, `useEffect`, `useReducer`, `useRef`).
   - Sliders render as static track bars with position pips; drag hints ("drag to rotate...") are omitted.
   - When `interactive` is true, an isolated interactive wrapper provides full pointer-drag rotation with boundary capture, range inputs, preset buttons, and view locking.
3. **Typography and Token Styling**:
   - Palette mapped to `@stage` and dashboard tokens (`color/bg/field`, `color/text/primary`, `color/fill/gold`, `color/line/chart`, `color/surface/well`, `color/surface/1`).
   - Subscripts rendered via `MathText` (`P_{uppet}`, `F_{enforce}`, `I_{buffer}`, `S_{enc}`, `e_1`, `e_2`, `e_3`).

## Verification Output

### Check 1: TypeScript Diagnostics

```bash
npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage 2>&1 | grep -i 'FiveTierConeView' || echo "no errors in FiveTierConeView"
```

**Output**:
```
no errors in FiveTierConeView
```

### Check 2: Server-Render Smoke Test

Executed via throwaway runner in `/private/tmp/claude-501/-Users-emmanuel-Documents-Theory-TheOriginalPower/fea37034-751e-40d2-a512-11766f9ff3a6/scratchpad/ports/five-tier-cone/` bundling with esbuild against `@stage` API and Node 26. Hook invocation traps confirmed zero prohibited hook calls during SSR.

**Output**:
```
Build succeeded. Running smoke test...
Testing FiveTierConeView with Log 2 Era...
PASS: Deterministic static rendering verified twice for all three modes with Log 2 Era.
Byte lengths:
- compact: 3427 bytes
- expanded: 20736 bytes
- settings: 12936 bytes
```
