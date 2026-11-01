# Port Report: Thyristor Latch (`thyristor-latch`)

## 1. Overview and Ported Artifact

- **Slug**: `thyristor-latch`
- **Pascal Component**: `ThyristorLatchView`
- **Camel Mapping Function**: `thyristorLatchFromEra`
- **Component File**: `Architecting_the_operation/video/yt02/stage/dashboard/artifacts/ThyristorLatchView.tsx`
- **Data File**: None required. `CATALOGUE.md` confirms: "Data. None. All values are illustrative and say so."

## 2. Ported Mathematics and Formulas

The view implements the self-exciting extraction loop and bistable fold bifurcation from `thyristor-latch.html`:

1. **Extraction Compliance Function**:
   $$g(B) = \frac{B^2}{B^2 + K^2}$$
   Baseline constants: $E_0 = 1$, $K = 1$.

2. **Extraction Current**:
   $$I(B) = (1 - s) \cdot E_0 \cdot g(B) = (1 - s) \cdot E_0 \cdot \frac{B^2}{B^2 + K^2}$$
   where $s$ denotes the share routed to the Out-group's own grid ($0 \le s \le 1$).

3. **Field Evolution Differential Equation**:
   $$\frac{dB}{dt} = \eta \cdot I(B) + \text{gate} - \lambda B$$
   where $\eta$ is feedback efficiency ($0.4 \le \eta \le 2.0$) and $\lambda$ is field decay rate ($0.1 \le \lambda \le 0.6$).

4. **Equilibrium Roots and Bifurcation Thresholds**:
   Setting $dB/dt = 0$ with $\text{gate} = 0$:
   $$a = \eta (1 - s) E_0, \quad r = \frac{a}{\lambda}$$
   Roots for $B > 0$ satisfy $B^2 - r B + K^2 = 0$:
   - Upper stable branch (latched state): $B_{\text{on}} = \frac{r + \sqrt{r^2 - 4K^2}}{2}$
   - Lower unstable branch (threshold): $B_{\text{mid}} = \frac{r - \sqrt{r^2 - 4K^2}}{2}$
   - Fold bifurcation critical share: $s^* = \max\left(0, 1 - \frac{2\lambda K}{\eta E_0}\right)$
   - Holding current at the fold: $I_H = \frac{\lambda K}{\eta}$
   - Stable off state: $B = 0, I = 0$ holds across all parameter regimes.

5. **Memoisation**:
   Module-level cache `bifPathCache` memoises the 401-point bifurcation SVG curves (`up` and `dn`) keyed by parameter tuple $(s^*, \eta, \lambda)$.

## 3. On-Screen Strings and Verbatim Copy

All text and labels match the original artifact:

- **Header and Lede**:
  - Title: `Thyristor Latch`
  - Lede: "A thyristor stays on after its gate pulse ends, as long as the current through it stays above the holding current $I_H$. The Elite's extraction loop latches the same way: extraction funds the cultural field B (eq. 0.1a), and the field keeps the extraction flowing. When the Out-group routes enough of its energy through its own grid, the current falls below $I_H$ and the machine powers down (Parasitic System Collapse Theorem)."
- **Circuit Schematic**:
  - `The self-exciting loop`
  - Labels: `Out-group`, `V_{cc} rail`, `Elite latch`, `gate`, `extracted`, `wealth`, `feedback tap η: media, campaigns, policing`, `B`, `field holds compliance`, `snubber grid`, `share s = X%`.
- **Strip Chart and Readouts**:
  - `Current through the latch`
  - Status badges: `LATCHED` (red) and `RELEASED` (teal).
  - Axis and marker labels: `extraction current I`, `cultural field B`, `I_H = ...`, `latch threshold`, `gate`, `-60 yr` to `now`.
  - Statistics: `Current I`, `Holding I_H`, `Field B`, `Critical share s*`.
  - Conditional verdicts for latched state, supercritical release ($s > s^*$), and subcritical unlatched state.
- **Bifurcation Diagram**:
  - `Where the latch can hold`
  - Annotations: `s > s*: the latch cannot hold`, `s* = ...`, `on: latched`, `off: powered down`, `share s routed through the Out-group’s own grid`, `B`.
  - Note: "Solid lines are states the loop can rest in; the dashed line is the threshold between them. Left of s*, both the on state and the off state are stable, so history decides which one holds (hysteresis). Right of s*, only the off state exists: no gate pulse can latch the machine."
- **Manuscript Citations in Settings**:
  - Eq. 0.1a cited to `Paper/The_Original_Power.tex:474`.
  - Reinforcing extraction loop and Parasitic System Collapse Theorem cited to `:14412`–`:14440`.
  - Enforcement nodes as holding current cited to `:12222`.
  - Subscripts and superscripts formatted via `MathText` (`I_H`, `s^*`, `V_{cc}`, `E_0`, `B_{on}`).

## 4. Mode Implementations

### Compact Mode (177 × 80)
- Fills the 177 × 80 content box without outer panel chrome.
- Row 1: 11 px mono uppercase title `THYRISTOR LATCH` with `eq. 0.1a` tag.
- Row 2: Status pill badge (`LATCHED` in red or `RELEASED` in teal) alongside a horizontal mini-graphic SVG displaying current bar $I$ against red vertical holding current tick $I_H$.
- Row 3: Tabular numeric readouts: `s 0.10 / s* 0.40` and `I 0.79 · I_H 0.30`.

### Expanded Mode (1368 × 828)
- Complete two-column layout replicating the artifact.
- Left column: The self-exciting loop circuit schematic SVG with Out-group $V_{cc}$ rail, thyristor SCR symbol, extracted wealth reservoir, feedback tap to cultural field $B$, and snubber grid diversion. Static parameter readouts display $s$, $\eta$, and $\lambda$.
- Right column: 60-year strip chart plotting extraction current $I(t)$ against holding threshold $I_H$ and cultural field $B(t)$ against latch threshold $B_{\text{mid}}$, with 4 summary statistics and dynamic analytical verdict.
- Bottom panel: Bifurcation diagram illustrating stable branches, unstable threshold, and supercritical extinction zone $s > s^*$.

### Settings Mode (1368 × 828)
- Header displaying `SETTINGS · THYRISTOR LATCH` and descriptive subtitle.
- Banner displaying `Model default: this log does not set this instrument.` when `modelDefault` is true.
- Left column: Read-only model parameters ($s, \eta, \lambda, E_0, K$) and derived analytical equilibria ($s^*, I_H, B_{\text{on}}, B_{\text{threshold}}, I(B_{\text{on}})$).
- Right column: Verbatim manuscript citations, theoretical assumptions, and era mapping explanations.

## 5. Era Mapping (`thyristorLatchFromEra`)

- **Implementation**:
  ```tsx
  export function thyristorLatchFromEra(
    _era?: {log: number; fields: Record<string, unknown>}
  ): {modelDefault: boolean; s: number; eta: number; lam: number} {
    return {
      modelDefault: true,
      s: 0.1,
      eta: 1.0,
      lam: 0.3,
    };
  }
  ```
- **Rationale**: `CATALOGUE.md` states: "It has no log input. A driver could pulse the gate when system_stress.level is CRITICAL (logs 3, 14, 15) or when rho_tau_crash is set (log 3), and raise s as ρ_τ approaches 1. That is a mapping rule the author would have to approve; the page does not define one." Under the contract specification, unapproved mappings return artifact defaults with `modelDefault: true`.

## 6. Omissions and Non-Interactive Isolation

- **Non-Interactive Mode**:
  - Deterministic render executes without `useState`, `useEffect`, `useLayoutEffect`, `useReducer`, `useRef`, `requestAnimationFrame`, or timers.
  - Continuous animation loops are replaced with exact analytical steady-state values.
  - Interactive manipulation hints ("Try it: raise s slowly...") are omitted from the non-interactive path.
- **Interactive Mode**:
  - Active strictly when `props.interactive === true`.
  - Isolated inside `InteractiveThyristorLatchView` with state hooks, sliders, gate pulse action, pause/play toggles, reset control, and CSS flowing dash animations.

## 7. Data Provenance

- No external data files loaded.
- Model constants and formulas derive directly from the manuscript theorems and `thyristor-latch.html`.

## 8. Verification Checks

### Check 1: TypeScript Diagnostics
Command executed:
```bash
npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage 2>&1 | grep -i 'ThyristorLatchView' || echo "no errors in ThyristorLatchView"
```
Output:
```
no errors in ThyristorLatchView
```

### Check 2: Server-Render Smoke Test
Test script bundled `ThyristorLatchView` with esbuild, invoked `renderToStaticMarkup` twice across all three modes under the log 2 era with `interactive: false`, and validated React hook isolation:

Output:
```
--- RUN 1 (Non-interactive) ---
Mode: compact, length: 1586 bytes
Mode: expanded, length: 25486 bytes
Mode: settings, length: 10541 bytes
--- RUN 2 (Non-interactive) ---
Mode: compact, length: 1586 bytes
Mode: expanded, length: 25486 bytes
Mode: settings, length: 10541 bytes
SUCCESS: All non-interactive modes match byte-for-byte across runs!
--- INTERACTIVE SMOKE TEST ---
Interactive Mode: compact, length: 1586 bytes
Interactive Mode: expanded, length: 41488 bytes
Interactive Mode: settings, length: 10541 bytes
SUCCESS: thyristorLatchFromEra returns modelDefault true with defaults.
```
