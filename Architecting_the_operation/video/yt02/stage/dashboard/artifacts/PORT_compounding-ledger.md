# Port Report: Compounding Ledger (`compounding-ledger`)

## 1. What Was Ported

### Functions and Computation
- `computeChain(order, factors)`: Computes progressive remaining capacity values across the policy shock chain starting from normalized baseline $1.0$.
- `fx(v)`: Formats numeric capacity values with adaptive precision ($0.1 \to 2$ decimals, $0.01 \to 3$ decimals, otherwise two significant figures).
- `erfcx(x)`: Exact Chebyshev-rational approximation of the scaled complementary error function $e^{x^2}\operatorname{erfc}(x)$.
- `ml(lam, t)`: Evaluates the Mittag-Leffler function $E_{1/2}(-\lambda\sqrt{t}) = e^{\lambda^2 t}\operatorname{erfc}(\lambda\sqrt{t})$.
- `getMemoryPlotData(lam)`: Module-level memoized generator for 240-point integer-order decay $e^{-\lambda t}$ and fractional-order memory $E_{1/2}(-\lambda\sqrt{t})$ curves, generation-6 evaluation points ($e_6, m_6$), and the vertical memory gap marker.
- `compoundingLedgerFromEra(era)`: Maps runtime log eras to model inputs and active shock indices.
- `CompoundingLedgerView(props)`: Root instrument component branching cleanly between static deterministic SSR and interactive client-side rendering.
- `StaticCompoundingLedgerView`: Pure static rendering component calling zero React state or lifecycle hooks.
- `InteractiveCompoundingLedgerView`: Client component managing state for scale selection, factor sliders, order permutations, enforcement ratio, and decay rate $\lambda$.
- `CompactView`: Compact $177 \times 80$ readout featuring the 5-step log staircase graphic and $O$ capacity readout.
- `ExpandedView`: Full-scale $1368 \times 828$ dashboard view containing the primary waterfall graphic, verdict comparisons, sourced factor cards, asymmetry comparisons, and latent wealth ratios.
- `SettingsView`: Readout displaying model parameter states, empirical inputs, and verbatim manuscript provenance notes.
- Sub-components: `WaterfallSvg`, `AsymmetrySection`, `LatentSection`, `OrderSection`, `MemorySection`, and `LedgerTableSection`.

### Strings and Formulas
- Lede text: "Harm compounds; it does not add. Each policy shock multiplies the Out-group's remaining capacity by a retention factor: $O_t = O_{t−1}\cdot(1 − \alpha P_t)$ (eq. 6.5). Four sourced shocks take a normalized 1450 baseline of 1.0 down to 0.019 by the War on Drugs (eq. 6.12)."
- Additive model comparison verdict: "An additive model would subtract the losses: $1 - (\sum (1 - f_i)) = \text{loss}$, an impossible negative capacity. The multiplicative model gives $0.019$: each shock takes its share of what the earlier shocks left."
- Asymmetric shock note: "eq. 6.6: $\alpha_O P_t \approx 3.73 \cdot \alpha_{I\setminus E} P_t$. The page applies the ratio to the War on Drugs shock only, the one the manuscript calibrates it on. National ratio 3.73× (2010) and 3.64× (2018); states range from about 2.1× to 9.6× (Montana)."
- Latent capacity note: "The chain's 0.019 is latent capacity before transfers, adaptation, public support, informal economies, and partial recovery. The observed ratio is the Federal Reserve SCF 2022 median family wealth: $44.89k Black against $285.01k white, 15.75%. The manuscript models the observed ratio as an output transform of the latent value, not as the same number."
- Memory gap note: "At generation 6, integer-order decay leaves $e_6\%$ of the initial damage; fractional-order memory leaves $m_6\%$. A reform timeline that assumes exponential decay expects the damage to be gone; the power-law kernel keeps it."
- Order note: "Select another order to compare. Multiplication commutes, so every order ends at the same value; the path to it differs. Both orders end at $0.019$. On the way, the two paths differ by up to a factor of $M$. That gap is the difference in what each later shock had left to take, and the reason the manuscript calls the sequence non-commutative in its intermediate states (eq. 6.7)."
- Verbatim sources and manuscript references from lines 124–127 of `compounding-ledger.html`.

## 2. Compact Readout

The compact view fills the $177 \times 80$ box:
- Top label: 11 px mono header `COMPOUNDING LEDGER` in `color/text/dim` (`rgba(138,106,69,1)`).
- Left: An $88 \times 48$ mini-graphic displaying a 5-step descending staircase on a log axis ($1.0, 0.09, 0.055, 0.026, 0.019$). Bars fill progressively up to `activeShocksCount` (`PALETTE.green` for baseline, `PALETTE.teal` for intermediate shocks, and `color/fill/accent` for terminal War on Drugs), with inactive steps rendered in hairline wireframe.
- Right: Large mono value readout `O 0.019` (or `O 1.00` for baseline) accompanied by `-98.1%` (percentage of baseline capacity stripped).

## 3. Era Mapping and Model Default

`compoundingLedgerFromEra(era)` implements the mapping defined in the catalogue:
- `era.log === 2` (1486 Lisbon): Predates 1619 racialization. Baseline capacity is 1.00. The log entry defines no policy shocks for this instrument. Returns `{ modelDefault: true, activeShocksCount: 0, ...defaults }`.
- `era.log === 3` (1676–1787 Virginia / Philadelphia): Enslavement shock active. Returns `{ modelDefault: false, activeShocksCount: 1, ...defaults }`.
- `era.log === 5` (1704–1865 American South): Enslavement shock active. Returns `{ modelDefault: false, activeShocksCount: 1, ...defaults }`.
- `era.log === 9` (1894–1965 Post-Emancipation Containment): 13th Amendment leasing and HOLC redlining active. Returns `{ modelDefault: false, activeShocksCount: 3, ...defaults }`.
- `era.log === 14`, `15`, `17` (1968–present): War on Drugs shock active. Returns `{ modelDefault: false, activeShocksCount: 4, ...defaults }`.
- `undefined` or unmapped era: Returns `{ modelDefault: true, activeShocksCount: 4, ...defaults }`.

When `modelDefault` is `true`, `SettingsView` renders the exact line:
`Model default: this log does not set this instrument.`

## 4. Porting Adaptations and Exclusions

- Inline script DOM manipulation (`innerHTML`, `document.getElementById`, `addEventListener`) and mutable global state `var S` were converted to structured React JSX.
- Deterministic SSR execution: When `interactive: false`, all interactive controls (`<button>`, `<input type="range">`, drag hints) are eliminated from the render tree. Static badges and value readouts replace input controls.
- Zero hook calls during static rendering: State hooks (`useState`) are confined to `InteractiveCompoundingLedgerView`, ensuring that server-side render tests pass without triggering hook execution traps.
- Mathematical notation: Mathematical expressions and subscripts utilize `MathText` from `@stage` (`O_t`, `O_{t-1}`, `\alpha P_t`, `\rho_\tau`, `\Phi_{load}`, `I_H`, $E_{1/2}$).
- Tokens and Styling: Ivory `#ECE7DC` maps to `color/text/primary`, gold `#D4A84B` maps to `color/fill/gold`, accent `#E08A3C` maps to `color/fill/accent`, rule `#8A6A45` maps to `color/line/chart`, and surface colors map to `color/surface/1` and `color/surface/well`.

## 5. Data Provenance

The four policy shocks are preserved verbatim in `Architecting_the_operation/video/yt02/stage/dashboard/artifacts/data/compounding-ledger.json` from the original artifact script:
1. Enslavement + chattel system (1619–1865): retention factor $f = 0.09$ (Baptist 2014; Darity & Mullen 2020).
2. 13th Amendment exception + convict leasing (1865–1934): retention factor $f = 0.61$ (Blackmon 2008).
3. HOLC redlining + FHA exclusion (1934–1968): retention factor $f = 0.48$ (Mapping Inequality; Rothstein 2017).
4. War on Drugs + cannabis enforcement (1971–2020): retention factor $f = 0.73$ (ACLU 2020).

Calibration datasets and external citations:
- `Paper/data/eq33_cannabis_redlining.csv`: Sourced retention factors.
- Federal Reserve Survey of Consumer Finances (SCF 2022): Median family wealth ratio ($44.89\text{k}$ Black vs $285.01\text{k}$ white, $15.75\%$).
- ACLU (2020) national cannabis arrest disparity: $3.73\times$ in 2010 and $3.64\times$ in 2018 (state range $2.1\times$ to $9.6\times$).

## 6. Verification Checks

### Check 1: TypeScript Diagnostics
Command:
```bash
npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage 2>&1 | grep -i 'CompoundingLedgerView' || echo "no errors in CompoundingLedgerView"
```
Output:
```
no errors in CompoundingLedgerView
```

### Check 2: Server-Render Smoke Test
Test script executed via esbuild bundler with Node.js in `/private/tmp/claude-501/-Users-emmanuel-Documents-Theory-TheOriginalPower/fea37034-751e-40d2-a512-11766f9ff3a6/scratchpad/ports/compounding-ledger/run_smoke.mjs`:
- Non-interactive rendering tested twice for log 2 era with monkey-patched hooks (`useState`, `useEffect`, `useLayoutEffect`, `useReducer` all set to throw on invocation).
- Verified zero `<button>` elements, zero `<input>` elements, and zero `NaN` occurrences.
- Verified exact reproduction across consecutive runs.
- Verified presence of verbatim string `"Model default: this log does not set this instrument."` in settings mode.

Rendered markup byte lengths:
- Compact mode: **1686 bytes**
- Expanded mode: **17001 bytes**
- Settings mode: **6197 bytes**
