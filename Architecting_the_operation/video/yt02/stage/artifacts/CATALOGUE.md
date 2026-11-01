# Instrument artifact catalogue

Ten author-built claude.ai artifacts, exported as standalone HTML beside this file. Each page is one HTML file with inline CSS and inline vanilla JS that draws SVG through `innerHTML`. No framework, no chart library, no `fetch`. A coding agent can read the HTML directly and port the model code into a TSX instrument.

Facts that apply to all ten:

- **Network.** The only external request is one Google Fonts stylesheet link (IBM Plex Mono, IBM Plex Sans; eight pages add STIX Two Text for italic math; Complex Wage Plane adds Patrick Hand). The dashboard should load the fonts locally.
- **Palette.** All ten share `--paper #0D1B2A` (navy field), `--rule #8A6A45` (bronze line art and grid), `--accent #E08A3C` (orange reading), `--panel #132538`, `--well #081421` (Complex Wage Plane omits it), `--ink #ECE7DC`, `--ink-2 #A9B6C4`, `--label-sm #B8956A`. Supporting hues: tau coral `#FF7A6B`, red `#E0604A`, teal `#4CC2C2`, green `#7CC08A`, gold `#D4A84B`. Colors are CSS variables on `:root`, so a token swap is one block.
- **Mismatch with `stage/tokens.ts`.** The stage tokens use tan `rgba(232,201,155)` (#E8C99B) for wire and primary text, where the artifacts use ivory #ECE7DC. The stage gold is #E0A33C and the artifacts use #D4A84B. Navy, bronze and orange match exactly. A port should read `colors` from `tokens.ts` and drop the artifact `:root` block.
- **Layout.** Every page is a scrolling 2-column card layout (max width 1180 to 1260 px). The dashboard needs the instrument SVG and its model function, not the page chrome. Each section below names the view to keep.
- **Manuscript references.** Line numbers cited below are copied from the artifacts. About 60 of them were spot-checked against `Paper/The_Original_Power.tex` on 2026-11-01 and landed on the cited topic; a few range-end lines (:2440, :7210, :7256, :14665) land on blank lines.
- **Missing builder scripts.** The pages name build helpers that are not in this repo: `tools/interference_engine/scripts/build_data.py`, `tools/interference_state/data/runtime_log.json`, and `scripts/build_states.py`, `build_transit.py`, `bruen_test.py`. All data is already embedded in the HTML, so the port does not need them.
- **Runtime Log fields.** `dashboard_eras.json` holds 7 eras (logs 2, 3, 5, 9, 14, 15, 17). Each carries `system_stress.level`, `capital.level`, `interference_state.{phi_load, rho_tau, rho_tau_crash}`, `active_patch`, `variables_loaded`, `variables_deployed`, `executing_function` and `results`. Era spans: log 2 = 1486; 3 = 1676–1787; 5 = 1704–1865; 9 = 1894–1965; 14 = 1968–1994; 15 = 1994–present; 17 = 2010s–present. Only `phi_load`, `rho_tau` and `rho_tau_crash` are numeric. The levels are words (MODERATE, HIGH, CRITICAL; EXPANDING, PEAK and others).

---

## 1. complex-wage-plane — Complex Wage Plane

- **Source:** https://claude.ai/artifact/HmJrBgkVS9jeeWhkdGbXFJ · file `complex-wage-plane.html`

**What it shows.** A square plane (800×830 viewBox) with a clock face. The wage vector W = ψ_m + jψ_s is an orange arrow from the origin. Down is +ψ_m (6 o'clock, θ = 0°) and right is +ψ_s (3 o'clock, θ = 90°), with θ growing counterclockwise. A hatched ivory zone marks where class-coherence risk M exceeds τ. Optional extras: an arc at the current |W|, the Elite-optimum diamond, state dots, the firearms path, and a Saint-Domingue overlay with two Buffer phasors. Beside the plane sit a firearms timeline (1705–2026) that drives W, with arms-parity and RAND carry-law panels.

**Equations and model.**
- W = ψ_m + jψ_s; θ = atan2(ψ_s, ψ_m); clock = 6 − θ/30.
- M = M₀ − a·ψ_m − b·ψ_s (+ κ·O-parity); τ zone is M > τ; ρ_τ = M/τ.
- Timeline: ψ_m = k_m·B/F^γ; ψ_s = k_s·(B − O)/F^γ. With parity on, ψ_m = k_m·Parity/F^γ and Parity = P_fed(t)·(1 − h·ban). F is the incarceration rate relative to 1980.
- RAND carry: C = Σ regime score × population share; A = 1 − h·ban; B = w·C + (1−w)·A; O = (w·C_O + (1−w)·A)(1−g). Transit exposure scales C. A Shapley decomposition splits the change in W between two years among B, O, F and parity.
- Saint-Domingue: M = M₀ + p·mobilization·(0.5 + 0.5·O-parity) − aψ_m − bψ_s.
- Calibration fit sets M₀, a, b from pre-1966 eras and tests against later eras (the "held-out" test).
- Manuscript lines cited: rotated Argand plane :2876; θ regimes :2937–2945; joint wage in Quadrant I :5149; constraint M < τ :1531, :2059; Runtime Log ranges :15361–:15515 (targets cite :15361, :15384, :15428, :15471, :15481, :15493, :15515); kinetic-parity claim :15529; Haitian Theorem :12296–:12335; Arcahaie flag :3665; Polish proof :14111, :14125.

**Inputs and defaults.**
- Wage vector: ψ_m 50, ψ_s 40, θ (keeps |W|); sliders −100…100.
- τ model: M₀ 60, τ 40, a 1.0, b 0.7, ψ_s ceiling 80. Toggles: τ zone on, arc on, Elite optimum on.
- Timeline: year 1705 (1705–2026), "Timeline drives W" on, show path on, k_m 40, k_s 70, γ 0. Twelve editable placeholder events (FW0).
- Parity on, NFA level 0.6, Hughes level 0.3, κ 0. RAND on, scope US, w 0.5, scores 0 / 0.25 / 0.75 / 1 (prohibited / may / shall / permitless), δ 0.5, h 0.5, g 0, transit bans on (scale 1), q_B and q_O 0.
- Saint-Domingue overlay off; year 1789 (range 1789–1804), M₀ 20, p 80.
- Six scenario buttons (Bacon's Rebellion, After 1705 = (36, 63), Social democracy, Fascism zone, Buffer demotion, Solidarity side) and three route animations.
- Settings persist in `localStorage` key `cwp-v1`.

**Data.**
- Verbatim from the repo, embedded as arrays: `CASE` (16 gun-law rows) from `Paper/data/eq65_68_2a_case_law.csv`; `SHOCKS` (9) from `Paper/data/historical_shocks.json`; `INC` (15) from `Paper/data/eq63_mass_incarceration.csv`; `TARGETS` (7 ρ_τ ranges) copied from the Compiled Runtime Log.
- Verbatim external: `CARRY` (51 jurisdictions × 1979–2025, RAND State Firearm Law Database 6.0), `TRANSIT` (ACS 2024 5-year tables B08105B and B08105H), `BRUEN` test statistics, `SP_LAWS` and `PB2` (coded from cited news and legal sources). Population weights come from `Paper/data/gun_laws_new_england/states.csv`.
- Proposals, flagged as such in the page: all B/O seeds in `FW0`/`FW_PRE`, regime scores, δ, h, g, q, k_m, k_s, γ, M₀, a, b, τ, the ψ_s ceiling, Quadrants III and IV, and every Saint-Domingue score (`SD_*` coded judgments with rubric and sources).

**Palette and fonts.** Matches (navy, bronze, orange, IBM Plex). Plane-specific: blue `#7FAEFF`, green `#62CC9E`, red `#FF7A6B`, yellow `#F0C940`; regime colors `#9AA3AD / #E8B04A / #4CC2C2 / #B892F2`. Patrick Hand appears on a few SVG labels.

**Suggested compact readout (~200×100).** A 100×100 mini plane on the left: clock ring, hatched τ zone, orange W arrow. On the right, two lines in IBM Plex Mono: the clock reading (for example `4:10`) and `ρτ 0.xx` colored coral when above 1.0. The year sits under them.

**Expanded view.** The sticky plane SVG with its legend, the year slider with Play, and the θ-by-year chart (`#tl-chart`) with the four wage-vector stats (θ, |W|, M, margin to τ). Leave out the RAND, transit, Shapley, calibration, post-Bruen and Saint-Domingue research panels.

**Drivable by Runtime Log or eras.** Partly. Map an era to a year on the slider (log 3 → 1705, 5 → 1785, 9 → 1930, 14 → 1981, 15 → 2010, 17 → 2018; log 2 predates the 1705 minimum). The page's `TARGETS` already hold the log's ρ_τ ranges, so the instrument can show model ρ_τ against the log band. The log's Φ_load has no input here.

**Weight.** Heaviest of the ten: 1,665 lines, 190 KB, 1,242 lines of script (about 150 KB). Roughly 56 KB is the inline `CARRY` JSON. `requestAnimationFrame` drives tweens, Play and routes. `localStorage` for state. No fetches. Port only `Mof`, `clipDanger`, the firearms functions `fwAt0`/`Fat`/`parityAt`, and the drawing code for the plane.

---

## 2. interference-state — Interference State

- **Source:** https://claude.ai/artifact/LGooxw2CeLGYkK6P78bkas · file `interference-state.html`

**What it shows.** The manuscript's Compiled Runtime Log as an instrument. Φ_load is an orange pill on a 0–1 track. ρ_τ is a half-circle dial from 0 to 1.2 with a coral τ = 1.0 tick and an orange arc over the log's range, with a needle at the range midpoint. A field chart below plots every log as a box (Φ_load across, ρ_τ up) against the τ line. A selector steps through all 21 logs and shows each log's own words and tex line.

**Equations and model.** None. The page displays ranges. It computes one correlation: across the 14 logs with both ranges, midpoint Φ_load and midpoint ρ_τ correlate at r = 0.63. Ranges that reach past 1.0 are logs 15, 17, 19 and 21; log 3 passes 1.0 only at its crash; log 14 tops out at 0.98. The reading rule: needle at the range midpoint, or at the single value when the log gives one (Haiti log 6 = 1.0, security patch log 13 = 0.95).
- Manuscript lines cited per entry: 15339, 15350, 15361, 15373, 15384, 15395, 15401, 15417, 15428, 15439, 15451, 15462, 15471, 15481, 15493, 15500, 15515, 15525, 15536, 15546, 15555.

**Inputs and defaults.** Previous/next buttons and a select; arrow keys on the field chart; deep link `#logN`. Opens on log 2 (index 1).

**Data.** The `LOG` array (21 entries: number, title, chapter label, tex line, `phi`, `rho`, `point`, text, plus crash/point labels) is **verbatim from the manuscript's Compiled Runtime Log**. The values are the author's own estimates (Tier 2 and 3 in the manuscript's scheme); the page says so.

**Palette and fonts.** Matches exactly (navy, bronze, orange; coral tau). IBM Plex Mono and Sans only, no STIX.

**Suggested compact readout (~200×100).** The half-dial at about 110×60 with the orange arc, τ tick and needle, and `Φ 0.82–0.95` / `ρτ 0.92–1.05` in mono text beside it. For log 3, add the coral "crash > 1.00" marker.

**Expanded view.** The instrument card (Φ_load pill over the ρ_τ dial) plus the log selector and the log's quoted text. The all-logs field chart is a good second tab.

**Drivable by Runtime Log or eras.** Yes. This page is the Runtime Log. `dashboard_eras.json` supplies `phi_load`, `rho_tau`, `rho_tau_crash` for 7 of the 21 logs (2, 3, 5, 9, 14, 15, 17). Logs 6, 8, 10, 11, 13 and 18–21 exist here and not in the eras file.

**Weight.** 217 lines, 23 KB, 102 lines of script, 15 KB of which is the `LOG` data. No libraries, no fetches; only a `history.replaceState`. Light.

---

## 3. backlash-oscillator — Backlash Oscillator

- **Source:** https://claude.ai/artifact/4GPNJkMBbGKyHfv9KmuMXv · file `backlash-oscillator.html`

**What it shows.** A series RLC circuit drawn as a clickable schematic (source V(t), red resistor R, green inductor L, cream capacitor C), and the response q(t), the equality-surplus charge, in a large plot. The orange trace sits above the q = 0 extraction baseline and turns red below it, labeled as backlash. Four small-multiple cards show the fitted shocks.

**Equations and model.**
- L q̈ + R q̇ + q/C = V(t) (eq. 1.7a). Three drives: an impulse shock (q(0) = 0, q̇(0) = V₀/L), an initial charge Q₀ (eq. 1.7b), and a sustained V₀ cos ωt. Integrated with RK4 (700 output points).
- Derived: α = R/2L, ω₀ = 1/√(LC), ζ = α/ω₀, Q = √(L/C)/R, settling time 4/α, first backlash depth, first zero crossing.
- Fitted shocks (ζ, ωₙ in rad/yr): 1865 Reconstruction (0.170, 0.300); 1964 Civil Rights Act (0.591, 0.525); 2008 Obama election (0.699, 1.080); 2020 Floyd protests (0.972, 6.650). First backlash depth falls 58% → 10% → 5% → 0% of the peak; natural period falls 20.9 → 12.0 → 5.8 → 0.94 yr.
- Manuscript lines cited: eq. 1.7a :2208; convergence prediction :2316; resonance escape :2319; fits :7029–:7034; ordinal-only claim :2390.

**Inputs and defaults.** Preset 0 (1865): R 0.102 (0–15), L 1 (log slider −1…1), C 11.11 (log −2.5…2.5), V₀ 1 (0.1–3), mode impulse, ω/ω₀ 1 (0.2–3, periodic mode only). Clicking a schematic part focuses its slider.

**Data.** `SHOCKS` ζ and ωₙ are **verbatim fit results** from `Paper/scripts/spectral_laplace.ipynb` (proxies in `Paper/data/backlash_proxies.csv`). The parametrization L = 1, C = 1/ωₙ², R = 2ζωₙ is the page's choice, because the fits identify only ζ and ωₙ. The proxy names and the trend sentence follow the manuscript.

**Palette and fonts.** Matches. Extra tokens: zone `#1B1E2B`, gold `#D4A84B`, red `#E0604A`, green `#7CC08A`. IBM Plex plus STIX Two Text italic for R, L, C, q(t).

**Suggested compact readout (~200×100).** A damped-sine sparkline of the selected shock over its own window, orange above zero and red below, with a faint zero line. Text: `ζ 0.17 · 21 yr` (or the active preset's numbers).

**Expanded view.** The response plot with the four stats rows (ζ, period, settling time, backlash depth), plus the four fitted-shock cards as presets. The schematic can stay as a header strip.

**Drivable by Runtime Log or eras.** Partly. The page keys on four shock years, not on log fields. Map eras 5 and 9 to the 1865 fit, 14 to 1964, 15 to 2008, 17 to 2020. `rho_tau_crash` (log 3, Bacon's Rebellion) has no preset here. No runtime-log number feeds the circuit.

**Weight.** 288 lines, 24 KB, 138 lines of script. RK4 runs on each slider move (small). No libraries, no fetches. Light.

---

## 4. interference-engine — Interference Engine

- **Source:** https://claude.ai/artifact/AgvYcJfpeNKujrpzSsthiJ · file `interference-engine.html`

**What it shows.** Three parts. Part 1 is the Engine's state: sliders for the spectral lever u, the phase lever Φ_load, class pressure M₀ and noise floor η feed one readout, ρ_τ, shown on a dial with a τ mark, a Φ_load bar and a phase circle of 24 subgroup dots with a mean vector. Below it, a runtime-log field with boxes per era, the model's ρ_τ-versus-Φ curve and the current point; then four shock-response panels. Part 2 builds a synthetic attention signal (Model C: class carrier plus six identity modes) with its time trace and spectrum. Part 3 shows measured spectra from three embedded datasets.

**Equations and model.**
- ρ_τ = M₀ · P_class · (1 − Φ_load)², with P_class = (1 − η)(1 − u). Crash when ρ_τ ≥ 1. The (1 − Φ)² term follows from N unit phasors summing to N(1 − Φ_load) amplitude. **The joint measure is the page's construction**; the manuscript states the two levers separately.
- Model C signal: class carrier at 1/4.2 per year; six identity modes (race 0.40, gender 0.50, religion 0.67, sexuality 0.80, nationality 1.00, ability 1.20 cycles/yr); bands CB = [0.1, 1/3], IB = [1/3, 1.25]. Hann-windowed periodogram, DFT in JS.
- Shock panels: H(s) = K/(s² + 2ζωₙs + ωₙ²) with the four Backlash fits.
- Presets: Pre-1964 (u 0, Φ 0.078), Post-1980 (u 0.6, Φ 0.403), Weimar 1932 (u 1/1.03), Google Trends 2024 (u 1/1.016).
- Manuscript lines cited: eqs. 8.12–8.16 :6914–:6946; bands :6955; eqs. 8.17 and 8.22 :7195–:7210; ANES calibration :2522; Laplace fits :7032–:7035; Weimar ℛ_suppress ≈ 0.03 :7006; spectral carrier chapter :14446–:14670.

**Inputs and defaults.** u 0.6, η 0.1, Φ_load 0.403, M₀ 3 (log slider, range 0.2–1000), shock size slider, log 15 selected, axes on except ability. At defaults ρ_τ = 3 × 0.36 × 0.3564 = 0.385. A button "Move the model into the selected log" sets Φ_load to the log midpoint and solves M₀ so ρ_τ lands at the log's ρ midpoint (clamped to 0.2–1000).

**Data.** Embedded `DATA` JSON, about 33 KB, built from repo CSVs and carried as embedded values (the page names no CSV files; the likely sources, by name, are `Paper/data/google_trends_class_identity.csv`, `congressional_record_word_freq.csv` and `anes_issue_salience.csv`): Google Trends class/identity weekly, 2004–2024; Congressional Record class/identity counts, 1965–2024; ANES econ/race/solidarity shares, 1948–2020; and 16 runtime-log entries with Φ/ρ ranges (the file `tools/interference_state/data/runtime_log.json` named in the page is not in this repo). M₀ is uncalibrated and flagged as such; the page prints the M₀ each log implies. The 2020 fit's gain sits at the optimizer bound (noted in the page).

**Palette and fonts.** Matches. Extra tokens: teal for the class band and phase dots, gold for the identity band and log boxes. IBM Plex plus STIX Two Text.

**Suggested compact readout (~200×100).** The single number `ρτ 0.97` large, over a thin bar scaled 0–1.2 with a coral τ tick, and a tiny 40 px phase circle with the mean arrow at the right. Color the number coral at or above 1.0.

**Expanded view.** Part 1 only: the readout card (levers, dial, Φ bar, phase circle) and the runtime-log field. Parts 2 and 3 are validation material and should stay out of the dashboard.

**Drivable by Runtime Log or eras.** Yes. `phi_load` and `rho_tau` map one-to-one onto the Φ_load lever and the ρ_τ readout, using the "Move the model into the selected log" step. Eras 2, 3, 5, 9, 14, 15, 17 all have both ranges. `rho_tau_crash` (log 3) can pin the needle above 1.0. The page leaves u and η free, so the driver needs a rule for them (the default pair works).

**Weight.** 472 lines, 80 KB, 279 lines of script, of which about 33 KB is inline data on one line. The JS DFT is O(n·k) on 1,096 weekly points per redraw of Parts 2 and 3. Part 1 is light. No libraries, no fetches. Port only Part 1: `pclass`, `rho`, `ampFor`, `meanR`, `dial`, `pcircle`, `field`.

---

## 5. phase-coherence — Phase Coherence

- **Source:** https://claude.ai/artifact/S6xA8LNFs1NycuS31CrUdh · file `phase-coherence.html`

**What it shows.** A unit circle with 24 teal subgroup dots (each a class-solidarity phase Φ_j) and an orange mean-vector arrow whose length is the coherence r = 1 − Φ_load. A dashed coral ring marks τ coherence. The arrow turns coral when r reaches τ. A time series from 1960 to 2030 plots Φ_load against the manuscript's ANES reference levels, with identity axes switching on at their dates. A wide strip shows the 24 subgroup cosines and their sum against the τ band.

**Equations and model.**
- Φ_j = θ_j + Σ_k a_k·u_kj, with u_kj fixed random draws in [−1, 1] (seeded PRNG, seed 20260611, so runs repeat).
- Kuramoto: dθ_j/dt = σ·ω_j + K·r·sin(ψ − Φ_j). Φ_load = 1 − |mean e^{iΦ}| (eq. 1.11). Crash condition is the zero-sequence case, all phases in step.
- Calibration (page sets amplitudes by bisection): with K = 0, race alone gives Φ_load = 0.078 and race plus four axes gives 0.403, the manuscript's two ANES endpoints. A third ANES level, 0.214, is drawn as the "activation" reference between 1965 and 1980.
- Axis dates: race from the start, gender 1972, nationality 1974, sexuality 1977, religion 1979, ability 1990 (the ADA, from the axis table).
- Engine carrier: redraws the offsets at each election (4-year or 2-year cycle).
- Manuscript lines cited: eq. 1.11 :2517; eq. 8.17 :7193; axis table :7215–:7256; ANES levels :2522; Engine as phase-locked controller, 24.1:1 and 12.8:1 :14640–:14665; Snubber Circuit :14668; zero-sequence :1230.

**Inputs and defaults.** K 0 (0–2), σ 0 (0–0.4), r_τ 0.90 (0.6–0.98), engine 4-year carrier (alternatives: static, 2-year), "Follow history" on, play on. Six axis chips; Restart-at-1960 button.

**Data.** No datasets. The ANES reference levels (0.078, 0.214, 0.403) and the axis dates are **verbatim from the manuscript**. The 24 subgroups, τ level, K and σ are the page's own, labeled illustrative.

**Palette and fonts.** Matches. Teal dots, gold ticks, orange arrow, coral τ. IBM Plex plus STIX Two Text.

**Suggested compact readout (~200×100).** A 90×90 circle with the 24 dots and the arrow on the left; `Φ 0.40` and `r 0.60` in mono on the right. Arrow coral when r ≥ r_τ.

**Expanded view.** The circle card with its four stats and verdict, over the Φ_load time series with axis chips and the K/σ/r_τ sliders. The summed-wave strip is a good secondary panel.

**Drivable by Runtime Log or eras.** Partly. `phi_load` midpoint sets the arrow length directly (r = 1 − Φ), which the page does through its own sliders and calibration. The page's own time axis covers 1960–2030 only, so only eras 14, 15 and 17 line up with its series. Eras 2–9 can still set the circle statically.

**Weight.** 232 lines, 20 KB, 121 lines of script. Runs a continuous `requestAnimationFrame` loop with 4 sub-steps per frame and redraws three SVGs each frame. Moderate. No libraries, no fetches.

---

## 6. five-tier-cone — Five-Tier Cone

- **Source:** https://claude.ai/artifact/2JCEYgZqunVHSe9aMkJHfi · file `five-tier-cone.html`

**What it shows.** An orthographic 3-D cone drawn in SVG. E is the apex disc, then P_uppet, F_enforce and I_buffer as descending discs, with O as the dashed green base. Drag to rotate; drag down to sink under the cone. From inside O (elevation −90°), the lower discs hide the apex: the Flat Ceiling. Enclosure scores limit how high the observer can climb.

**Equations and model.**
- S_enc = (1/√2)·√(((e₁ + e₂)/2)² + e₃²) (eq. 1.1). Highest allowed elevation = −90° + 180°·(1 − S_enc).
- Tier geometry: H = 5, base radius 4; tier z = 4.55 (E), 3.45 (P), 2.35 (F), 1.25 (I); radius = 4(1 − z/5).
- "E visible from inside O" is the share of E's disc that no lower disc covers on the view up the axis (grid-sampled, 41×41).
- Alignment control (θ-collapse, eq. 14.5): at 1.0 the four tiers share the axis; lower values shift them by fixed offsets.
- Circuit legend: E voltage source, P potential divider, F current source, I dielectric, O sink. Benefit(E) ≫ Benefit(P) > Benefit(F) > Benefit(I) > Benefit(O) (eq. 0.2).
- Manuscript lines cited: cone and nodes :486–:593; node-to-circuit table :604–:650; eq. 1.1 :713; Flat Ceiling and Elite Obscuration :770–:810; eq. 14.5 :13751.

**Inputs and defaults.** Elevation 22° (−90…90), azimuth −28°, alignment 1.00, e₁ = e₂ = e₃ = 0.30, "enclosure limits view" on. At defaults S_enc = 0.30, highest view 36°, E visible 0%. Buttons: Outside view, Side view, From inside O.

**Data.** None read or embedded. Geometry from the manuscript's figure; the tier offsets and the link from S_enc to elevation are the page's devices (stated in its notes).

**Palette and fonts.** Matches. Tier colors: E orange, P gold, F red, I teal, O green. IBM Plex plus STIX Two Text.

**Suggested compact readout (~200×100).** A 100×100 side view of the five discs (four tiers and the O base ellipse) in tier colors, and `E visible 0%` in mono. A flat ceiling reads as a stack that collapses to one disc when viewed from below.

**Expanded view.** The draggable cone SVG with the three view buttons and the elevation, azimuth and alignment sliders. Keep the enclosure sliders only if the dashboard shows a "can the observer see E" story.

**Drivable by Runtime Log or eras.** Partly. No numeric field applies. `variables_loaded` and `variables_deployed` name the nodes (E, O_racialized, I in log 2; I_buffer, F_enforce^proto, P_uppet^v1.0 added in log 3), so tiers can light as they deploy. The cone never changes by era otherwise.

**Weight.** 217 lines, 17 KB, 99 lines of script. Redraws on drag; pointer events only, no animation loop. Light. No libraries, no fetches.

---

## 7. compounding-ledger — Compounding Ledger

- **Source:** https://claude.ai/artifact/H2tpKbBBuYJmKrDuC38b8R · file `compounding-ledger.html`

**What it shows.** A waterfall of the Out-group's remaining capacity across four sourced shocks. Starting from a normalized 1450 baseline of 1.0, each shock multiplies capacity by its retention factor, ending at 0.019. Grey caps on the bars mark what each shock removed. A linear/log toggle shows that equal factors drop the log bars equally. Four smaller panels cover the order of shocks, the asymmetric War on Drugs multiplier, latent capacity versus observed wealth, and a memory-gap curve.

**Equations and model.**
- O_t = O_{t−1}·(1 − αP_t) (eq. 6.5). Chain: 1.0 × 0.09 × 0.61 × 0.48 × 0.73 = 0.0192 (eqs. 6.8–6.12).
- Asymmetric enforcement: α_O P_t ≈ 3.73 · α_{I∖E} P_t (eq. 6.6). The page applies the ratio only to the War on Drugs shock.
- Latent 0.019 versus observed wealth ratio 44.89/285.01 = 15.75% (SCF 2022), kept separate by an output transform.
- Memory gap: integer-order e^(−λt) versus Mittag-Leffler E_{1/2}(−λ√t) = e^(λ²t)·erfc(λ√t), computed exactly with an erfc approximation. The manuscript's figure uses a rational stand-in, so the curves differ in detail.
- Manuscript lines cited: model and chain :5345–:5420; eq. 6.6 :5365; latent/observed qualifier :5509–:5510; memory figure :5521–:5566.

**Inputs and defaults.** Four factor sliders (0.01–1): enslavement 1619–1865 = 0.09; 13th Amendment exception and convict leasing 1865–1934 = 0.61; HOLC redlining and FHA exclusion 1934–1968 = 0.48; War on Drugs 1971–2020 = 0.73. Scale: log. Order presets: Historical, Reversed, Redlining first, Enslavement last. Enforcement ratio 3.73 (range 1–9.6; national 3.73× in 2010, 3.64× in 2018, Montana 9.6×). Decay λ 0.5 (0.1–1.2). "Restore sourced values" button.

**Data.** Factors are **verbatim from `Paper/data/eq33_cannabis_redlining.csv`**, with sources (Baptist 2014; Darity and Mullen 2020; Blackmon 2008; Mapping Inequality; Rothstein 2017; ACLU 2020). SCF values and enforcement ratios come from the manuscript. The Buffer Class comparison (divide the loss by the ratio) is the page's reading of eq. 6.6, not a sourced factor.

**Palette and fonts.** Matches. Bars use green (baseline), teal (middle shocks), orange (final), grey for removed capacity. IBM Plex plus STIX Two Text.

**Suggested compact readout (~200×100).** A five-step descending staircase (1.0, 0.09, 0.055, 0.026, 0.019) on a log axis in teal ending orange, with `O 0.019` beside it. When driven by year, only the steps up to that year fill.

**Expanded view.** The waterfall with its scale toggle and the factor sliders, with the asymmetry panel as a second tab. The order, latent and memory panels are optional.

**Drivable by Runtime Log or eras.** Partly. The four shocks have year spans (1619–1865, 1865–1934, 1934–1968, 1971–2020) that map onto eras: log 5 (1704–1865) → enslavement; log 9 (1894–1965) → 13th Amendment and redlining; logs 14, 15, 17 → War on Drugs. No runtime-log number enters the chain.

**Weight.** 257 lines, 22 KB, 126 lines of script. Static SVG redraws on input. Light. No libraries, no fetches.

---

## 8. thyristor-latch — Thyristor Latch

- **Source:** https://claude.ai/artifact/5GVSzcapRRGRENYNzKAJza · file `thyristor-latch.html`

**What it shows.** A self-exciting loop. The Out-group's supply rail feeds extraction through a thyristor symbol (the Elite latch); a feedback tap funds the cultural field B, and B holds the extraction current open. Animated dashes flow along the wires, thicker and faster as current rises. A teal diversion shows the share s routed to the Out-group's own grid. A strip chart plots current I against the holding current I_H and field B over a 60-year window, with a LATCHED / RELEASED badge. A bifurcation diagram shows where the latch can hold.

**Equations and model.**
- dB/dt = η·I(B) + gate − λB, with I(B) = (1 − s)·E₀·B²/(B² + K²) (extraction depends on the field, which is the page's added assumption); E₀ = 1, K = 1.
- On state exists while η(1 − s)E₀ ≥ 2λK. Critical share s* = 1 − 2λK/(ηE₀). Holding current I_H = λK/η. Hysteresis left of s*; only the off state exists right of s*.
- Euler step 0.02 yr, 6 steps per frame.
- Manuscript lines cited: eq. 0.1a :474; reinforcing loop and Parasitic System Collapse Theorem :14412–:14440; enforcement nodes as holding current :12222.

**Inputs and defaults.** s 0.10 (0–1), η 1.00 (0.4–2), λ 0.30 (0.1–0.6). At defaults s* = 0.40, I_H = 0.30, on-state B ≈ 2.62, I ≈ 0.79. Buttons: Gate pulse (manufactured crisis), Pause, Reset.

**Data.** None. All values are illustrative and say so; the manuscript gives eq. 0.1a (linear) and the theorem, and the nonlinear I(B) is the page's addition.

**Palette and fonts.** Matches. Orange current, gold field, red latch and I_H, teal Out-group grid. IBM Plex plus STIX Two Text.

**Suggested compact readout (~200×100).** A pill badge `LATCHED` (red) or `RELEASED` (teal) at the left, and a horizontal pair of bars: current I (orange) against a red I_H tick. Under it, `s 0.10 / s* 0.40`.

**Expanded view.** The loop schematic with the s, η, λ sliders, the strip chart with the badge and stats, and the bifurcation diagram as the closing panel.

**Drivable by Runtime Log or eras.** Partly. It has no log input. A driver could pulse the gate when `system_stress.level` is CRITICAL (logs 3, 14, 15) or when `rho_tau_crash` is set (log 3), and raise s as ρ_τ approaches 1. That is a mapping rule the author would have to approve; the page does not define one.

**Weight.** 224 lines, 19 KB, 116 lines of script. Continuous `requestAnimationFrame` loop redrawing three SVGs per frame (CSS-animated dashes). Moderate. No libraries, no fetches.

---

## 9. ac-extraction-meter — AC Extraction Meter

- **Source:** https://claude.ai/artifact/23PsLevFAsCA9F38tP63fa · file `ac-extraction-meter.html`

**What it shows.** The complex wage as AC power S = V·I* = P + jQ. A phasor diagram on the wage plane shows V along +ψ_m, I at −θ, and the orange S arrow with a dashed power triangle (P = ψ_m real power, Q = ψ_s reactive power). Two cycles of v(t), i(t) and the split of p(t) into a real part (always flowing one way) and a reactive part (averaging to zero) fill the second card. A wide chart integrates real power over 1619–2026 in three regimes: DC chattel slavery, a rectified half-wave era (13th Amendment, Jim Crow), and the AC era.

**Equations and model.**
- DC: P = V·I, W = ψ_m, θ = 0 (eqs. 0.7, 0.7a). AC: S = V·I* = P + jQ, P = |V||I| cos θ = ψ_m, Q = |V||I| sin θ = ψ_s (eqs. 0.8–0.9).
- Instantaneous power splits into P(1 + cos 2ωt) and Q sin 2ωt; the reactive integral over whole cycles is zero (Buffer-Class Work Theorem, eq. 0.15).
- Reparations Integral ℛ = ∫ Re[V·I*] dt over 1619–2026 (eq. 0.16). Power levels: DC era = the DC level; rectified era = DC·(h + (1 − h)·cos θ) with h the rectified share; AC era = |V||I| cos θ.
- Orientation follows the Complex Wage Plane: +ψ_m down, +ψ_s right, clock = 6 − θ/30.
- Manuscript lines cited: regimes by θ and Quadrant II :1150; Variable Swap and carceral state as half-wave rectifier :1240–:1275; Reparations Integral :1385.

**Inputs and defaults.** θ 55° (−180…180), |V| 1.00, |I| 1.00, DC level 1.00, rectified share 0.60, AC |V||I| 1.00. Presets: DC (0°), AC covert (55°), Pure reactive (90°), Quadrant II (125°). At defaults P = 0.57, Q = 0.82, clock 4:10.

**Data.** None read. Era boundaries 1619, 1865, 1965, 2026 are the manuscript's. The era levels are illustrative and the page says so; the dollar estimates (Craemer, Darity and Mullen) in the manuscript come from those studies, not this page.

**Palette and fonts.** Matches. +ψ_m axis green, −ψ_m red, V ivory, I teal, S orange, era washes red/gold/orange. IBM Plex plus STIX Two Text.

**Suggested compact readout (~200×100).** A 90×90 phasor with the orange S arrow and a mono `cos θ 0.57 · 4:10` readout. For a time-keyed version, replace with a 200×60 running-integral curve and an era marker.

**Expanded view.** The phasor card with its θ slider and regime buttons, and the Reparations Integral chart with the three era shares. The waveform card is optional.

**Drivable by Runtime Log or eras.** Partly. The regimes match eras by date: logs 3 and 5 sit in the DC era, log 9 in the rectified era, logs 14, 15, 17 in the AC era. No log field sets θ.

**Weight.** 241 lines, 21 KB, 129 lines of script. Static SVG redraws on input. Light. No libraries, no fetches.

---

## 10. snubber-circuit — Snubber Circuit

- **Source:** https://claude.ai/artifact/QRVsfVrcF9cgdBsD9SAowB · file `snubber-circuit.html`

**What it shows.** A schematic of a coil L whose field current I₀ is cut by a breach switch, plus three parallel paths competing for the collapsing field's energy: the Elite's recovery path (diode, R_h, C_next), the Out-group's snubber grid (R_s with C_s), and the TVS clamp at ±V_br. Clicking a path toggles it. An orange back-EMF surge v(t) plot and a stacked energy bar show where ½LI₀² goes: recovered by the Elite, absorbed by the grid, clamped by the TVS, lost in the coil, or still ringing.

**Equations and model.**
- v = −L di/dt (eq. 1.7d); stored energy U = ½LI² (eq. 1.7e).
- Numerical circuit: coil with series resistance 0.05, stray capacitance 0.002, Elite path through an ideal diode and R_h = 0.5 into C_next (starts empty), snubber R_s in series with C_s, ideal TVS clamp at ±V_br. RK4 with dt = 4×10⁻⁵ over t = 0–6 (150,000 steps), run twice per refresh (the chosen circuit and the unprotected reference).
- Energy accounting: Elite = heat in R_h plus energy in C_next; grid = heat in R_s plus energy in C_s; TVS = ∫|v|·|i| dt; plus coil loss and residual field.
- Manuscript lines cited: back-EMF, energy and recovery :2416–:2440; snubber as local grids :14435, :14348; TVS diode :11598–:11630, V_br :11611.
- **Open conflict noted in the page:** the manuscript says arms and training *raise* V_br (:11611), while in a real TVS a lower V_br clamps sooner. The page keeps the electrical meaning and refers to a README that is not exported here.

**Inputs and defaults.** Preset "Elite recovery only" (h on, s off, t off). I₀ 1.00 (0.2–2), L 1 (log), C_next 0.1 (log), C_s 0.1 (log), R_s 1 (log), V_br 3.0 (0.5–20). Preset buttons: Unprotected, Elite recovery only, Snubber grid, Snubber + TVS (V_br 1.2), Decoupled grid (V_br 1.2).

**Data.** None. All parts are illustrative, and the page says it gives no historical surge sizes.

**Palette and fonts.** Matches. Cream wires, green coil, red Elite path, teal snubber, gold TVS, orange surge. IBM Plex plus STIX Two Text.

**Suggested compact readout (~200×100).** A surge spike sparkline (orange) at the top and a three-segment energy bar below (red Elite, teal grid, gold TVS, grey residual) with the peak value in mono: `peak 1.0 → 0.4`.

**Expanded view.** The schematic with its path toggles, the surge plot, and the energy bar with the peak-reduction stats. Keep the six sliders under a collapsed drawer.

**Drivable by Runtime Log or eras.** Partly, event-only. A kernel breach is the page's trigger, and `rho_tau_crash` in log 3 (Bacon's Rebellion) marks one. Other eras carry no matching field. A driver could open the switch when `rho_tau` first passes 1.0 and select a path preset by era, but the page defines no such rule.

**Weight.** 276 lines, 22 KB, 151 lines of script. The two RK4 runs (about 1.2 million derivative evaluations per refresh) are debounced by 30 ms; expect a few tens of milliseconds on a laptop. Heavier than it looks. For the dashboard, precompute the five presets, or cut dt to 2×10⁻⁴. No libraries, no fetches.

---

## Summary table

| slug | title | compact readout | era-drivable | dependencies |
|---|---|---|---|---|
| complex-wage-plane | Complex Wage Plane | mini plane with τ zone and W arrow; clock reading and ρτ | partly (year per era; ρτ bands already in page) | none external; Google Fonts link; localStorage; ~56 KB inline RAND JSON; 1,665 lines |
| interference-state | Interference State | half-dial with τ tick; Φ and ρτ ranges | yes (it is the Runtime Log; 21 logs, 7 in eras file) | none external; Google Fonts link; 23 KB |
| backlash-oscillator | Backlash Oscillator | damped-sine q(t) sparkline; ζ and period | partly (four shock presets keyed to eras) | none external; Google Fonts link (+STIX); 24 KB |
| interference-engine | Interference Engine | big ρτ number over a 0–1.2 bar; mini phase circle | yes (Φ and ρτ ranges set the model via the fit button) | none external; Google Fonts link (+STIX); 33 KB inline data; JS DFT; 80 KB |
| phase-coherence | Phase Coherence | 24-dot circle with mean arrow; Φ and r | partly (Φ midpoint sets r; own timeline is 1960–2030 only) | none external; Google Fonts link (+STIX); rAF loop; 20 KB |
| five-tier-cone | Five-Tier Cone | five-disc side stack; E visible % | partly (variables_loaded/deployed light the tiers) | none external; Google Fonts link (+STIX); 17 KB |
| compounding-ledger | Compounding Ledger | log-scale staircase 1.0 → 0.019 | partly (shock year spans map to eras) | none external; Google Fonts link (+STIX); 22 KB |
| thyristor-latch | Thyristor Latch | LATCHED/RELEASED badge; I against I_H bars | partly (gate pulse on CRITICAL or crash is an unapproved rule) | none external; Google Fonts link (+STIX); rAF loop; 19 KB |
| ac-extraction-meter | AC Extraction Meter | mini phasor; cos θ and clock | partly (DC, rectified, AC regimes map to eras) | none external; Google Fonts link (+STIX); 21 KB |
| snubber-circuit | Snubber Circuit | surge sparkline over a 3-segment energy bar | partly (event-only; log 3 crash) | none external; Google Fonts link (+STIX); RK4 150k steps ×2 per refresh; 22 KB |
