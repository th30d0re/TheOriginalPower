# G explainers — G5, G11, G30, G32 (2026-10-29)

Figma explainer animations for author notes G5, G11, G30 and G32 (`briefs/G_AUTHOR_NOTES.md`), built under rules R4 (show it, visualize every equation, sweep its variables), R5 (100% Figma) and R7 (derived behaviour is labeled as derived).

- **Figma file:** `6SPd7rWzwyvxHhIj4Cmb7a`, new page **"YT02v2 · Explainers G"** (`143:23372`).
- **Math labels:** the page's `g assets` frame (`143:23373`) holds LaTeX outline SVGs with real sub- and superscripts: Eq. 2.11, L, R, C, t, q(t), V(t), ζ = (R/2)√(C/L) and (ψ_m, ψ_s). `figma/v2/g_math_svgs.py` generates them. The builders also reuse the `w35.*` labels on "YT02 · Assets". No underscore reaches the screen.
- **Styling:** matches "wage S10-06": the field colour variable, border ornament `3:119`, a Heading/H1 headline with the accent rule, Label/Mono Small captions at y 922, Source/Citation at y 968, surface panels with Elevation/1 Panel, and the MAT/STAT/RED/INK palette.
- **Sources (all new, all mine):**
  - `figma/v2/g_prelude.js`: shared helpers.
  - The builders `g_fig22.js`, `g_rlc.js`, `g_warmup.js` and `g_axes_turn.js`.
  - `rlc_sweep.py` → `rlc_sweep.json`.
  - `g_math_svgs.py` → `assets_g/`, `assets_g.json`.
- **How to run a builder:** pass `g_prelude.js` + the builder to `use_figma`. `g_rlc.js` also needs `const DATA = <rlc_sweep.json>;` between the two.
- **Clips:** exported with `export_video` (30 fps, 1920×1080, high quality) and fetched with `fetch_clip.sh` into `outputs/YT02V2/video/figma/`. Each clip is named with the slug its `figma:<frame name>` Render resolves to, following the same convention as `figma:wage S10-06` → `wage-s10-06.mp4`.
- **Timing:** every beat is in seconds from the frame's own start, keyed by the spoken phrase in `outputs/YT02v2_ov/words.json`. Script reordering therefore does not break the beats: the frame starts with its first turn.
- **Stills checked:** `logs/stills_g/` holds frames pulled from the exported clips. I read each one for overlap, clipping and timing. The issues I found and fixed are listed per item.
- **Untouched:**
  - `wage S10-06`, the phasor builder text layer `91:19483`, `phasor_builder.js` and `phasor_spec.py`. Their uncommitted edits are as I found them.
  - The podcast script and its G draft, both shot lists, card JSON, `Paper/`, `scriptcast.toml`, the cone/ortho manim files and `outputs/YT02v2_ov/video/runs/`.
  - Nothing is committed.

---

## G5 · Figure 2.2, the causal reversal (turns 98–100)

| | |
|---|---|
| Figma frame | `g-fig2.2 causal chain` · node **`147:163`** · 42.4 s |
| Clip | `outputs/YT02V2/video/figma/g-fig2.2-causal-chain.mp4` (1920×1080, 30 fps, 42.43 s) |
| Screenshot checked | `logs/stills_g/g5_fig2.2_sheet.png` (t = 11, 24, 28, 41 s) |
| Book source | `Paper/The_Original_Power.tex:1815–1850` (`fig:causal_reversal`), Eq. 2.6 at `tex:1811` |

**What it shows:**
- The book's figure, recreated.
- The historical row: three boxes, *Elite Economic Interests* → *Systemic Racialization* → *Interpersonal Prejudice*, joined by two solid forward arrows labeled with the verbs of Eq. 2.6, "produces" and "cultivates".
- The dashed **Reinforcing Feedback Loop** arc curving underneath, from Interpersonal Prejudice back into Systemic Racialization. It draws dash by dash: Figma cannot path-trim a dashed stroke, so each dash is its own segment.
- The book's struck-through conventional row (Individual Prejudice → Discriminatory Actions → Systemic Outcomes) and the "causal reversal" arrow. Both appear dim on "complete mechanism".
- Each box, arrow and the loop label lights in gold on the word that names it.

**Beats** (0 = start of turn 98 `c8a4cfdabb044e6c`; turn 99 starts at +16.00, turn 100 at +31.32):

| Phrase | s | On screen |
|---|---|---|
| (start) | 0.5 | caption EQUATION 2.6 · THE GENERATIVE CHAIN |
| "Elite Economic Interests" (98) | 8.36 | Elite box appears, lit |
| "produce" | 9.88 | solid arrow 1 draws, "produces" |
| "Systemic Racialization" | 10.28 | Systemic box appears, lit |
| "cultivates" | 13.30 | solid arrow 2 draws, "cultivates" |
| "Interpersonal Prejudice" | 14.12 | Interpersonal box appears, lit |
| "Figure two point two" (99) | 16.00 | caption FIGURE 2.2 · TWO SOLID FORWARD ARROWS |
| "complete mechanism" | 19.08 | conventional row fades in dim; strike-through draws; causal-reversal arrow |
| "Two solid forward arrows" | 20.08 | both arrows light gold; tag "two solid forward arrows · the generative direction" |
| "from Elite Economic Interests" | 23.38 | Elite lit, then arrow 1 (24.28) |
| "to Systemic Racialization" | 25.32 | Systemic lit |
| "and from Systemic Racialization" | 27.36 | arrow 2 lit |
| "to Interpersonal Prejudice" | 29.46 | Interpersonal lit |
| "Curving underneath" (100) | 31.32 | caption FIGURE 2.2 · THE DASHED REINFORCING FEEDBACK LOOP |
| "dashed feedback arc" | 34.00 | dashes start drawing from Interpersonal; tag "dashed · maintenance loop" |
| "from Interpersonal Prejudice" | 35.98 | Interpersonal lit |
| "back into Systemic Racialization" | 37.32 | arc arrives; arrowhead at 37.72; Systemic lit to the end |
| "labeled" | 39.30 | label "Reinforcing Feedback Loop" |
| "Reinforcing Feedback Loop" | 40.26 | label ringed; sub-label "cultivated by the system that produced it" (40.66) |
| (end) | 42.40 | |

**Proposed Render:**

| Shot | turn_id | Spoken text | Render |
|---|---|---|---|
| S04-03 | `c8a4cfdabb044e6c` | "What causal sequence does Equation two point six assert? … Systemic Racialization cultivates Interpersonal Prejudice." | **scene** `figma:g-fig2.2 causal chain` |
| S04-04 | `2a0deb5b5c6527dd` | "Figure two point two in Chapter 2 diagrams the complete mechanism. Two solid forward arrows …" | **hold** S04-03 |
| S04-05 | `88669e7f7aedee0f` | "Curving underneath those solid forward arrows is a dashed feedback arc … labeled Reinforcing Feedback Loop." | **hold** S04-03 |

The clip replaces `cards/v2/v2-S04-04.json` as the picture for turns 99–100. If the reorder separates turn 98 from 99, start the clip at 15.5 s: the chain is already complete there, and every later beat still lands.

**Fixed after the first export:**
- The node-level stroke cap was overriding the arrowheads, so the arrows had none.
- The arrows were too short and "cultivates" wrapped. The boxes were narrowed and spread to 450/960/1470.

**Labels vs. the book:**
- The book labels its two rows "Conventional (incorrect)" and "Actual (historical)". On screen they read "conventional framing" and "historical record · Eq. 2.6", which avoids a corrective contrast on screen.
- The book's arc label is "reinforcing feedback (cultivated)". The narration calls it the Reinforcing Feedback Loop, so the screen shows that name plus "cultivated by the system that produced it".

---

## G11 · Equation 2.11, series RLC, with derived sweeps of L, R and C (turn 141)

| | |
|---|---|
| Figma frame | `g-eq2.11 RLC sweep` · node **`149:163`** · 57.1 s |
| Clip | `outputs/YT02V2/video/figma/g-eq2.11-rlc-sweep.mp4` (1920×1080, 30 fps, 57.13 s) |
| Screenshot checked | `logs/stills_g/g11_rlc_sheet.png` (t = 8, 20, 33, 47 s) |
| Curves | `figma/v2/rlc_sweep.py` → `rlc_sweep.json` |
| Book source | Eq. 2.11 `tex:2207–2208` (L q̈ + R q̇ + q/C = V(t)); solution Eq. 1.7b `tex:2211`; topology `tex:2232–2244` |

**What it shows:**
- *Left side:*
  - The series RLC circuit, redrawn in Figma: source V(t) labeled "reform shock", then R (zigzag, red), L (coil, green) and C (plates, ink) along the top wire.
  - Equation 2.11 in LaTeX outline beneath the circuit. Its L, R and C terms are ringed when they are named.
  - In part B, three log-scale sliders for L, R and C.
- *Right side:*
  - A scope plot of q(t), the equality-surplus charge, against t. It shows the q = 0 extraction baseline and the shaded region below q = 0, labeled "backlash into the extraction zone", per `tex:2209–2219`.
  - A readout panel holding ζ = (R/2)√(C/L) and the values computed for the curve on screen.

**Curves:**
- Every curve is the numerical solution of L q̈ + R q̇ + q/C = 0, with q(0) = Q₀ and q̇(0) = 0. This is the book's undriven case. `scipy.solve_ivp` produces each curve on 151 samples, and the points are placed exactly as Figma path data.
- The baseline is L = 1, R = 0.4, C = 1, giving ζ = 0.20.
- The parameters are dimensionless and illustrative, as the book's own figure caption says of its parameters (`tex:2309`, `tex:2390`).
- The readouts are measured on the computed curve: ζ, backlash depth (the first undershoot as a % of the shock), the 5 % settling time, and the period.

**Derived (R7):** the frame labels each sweep "DERIVED · NOT IN THE BOOK" and writes each takeaway as "Derived · …".
- **Raising L:** ζ falls, the backlash runs deeper, each swing takes longer, and the ringing lasts longer (base 53 % → 67 % at L = 2.5, settling 13.7 → 36).
- **Raising R:** ζ rises and the overshoot shrinks to 0 at ζ = 1. Past that the return slows (overdamped, R = 2.8: settling 7.6 against 3.1 at R = 1.5).
- **Raising C:** each swing slows and the overshoot softens. The envelope decay rate R/2L does not depend on C, so it holds steady.
- The book itself states only the R direction: the kernel expands R, which increases α (`tex:2316`). So:
  - The L and C sweeps are **BOOK-UPDATE?** candidates (`tex:2316`, `tex:2390`).
  - So is the finding that critical damping is not the fastest return to the 5 % band (R = 1.5 settles faster than R = 2).

**Beats, part A** (0 = start of turn 141 `6017b9e8036ac25d`; turn length 14.17 s):

| Phrase | s | On screen |
|---|---|---|
| (start) | 0.3–1.6 | wires draw; caption EQUATION 2.11 · SERIES RLC RESPONSE TO A REFORM SHOCK |
| "dynamic response" | 1.98 | scope axes, baseline, extraction-zone shading |
| "reform shocks" | 3.02 | shock arrow at t = 0; tag "reform shock" |
| "series RLC" | 4.18 | V, R, L, C components and their labels appear in order |
| "differential equation" | 4.92 | Equation 2.11 appears |
| "state inertia L" | 6.56 | L ringed in the circuit and in the equation; tag "state inertia" |
| "institutional resistance R" | 7.66 | R ringed; tag "institutional resistance" |
| "legal buffering capacitance C" | 10.04 | C ringed; tag "legal buffering capacitance" |
| "absorb statutory perturbations" | 11.82 | baseline damped response draws (to 14.22); "the circuit absorbs the shock and rings back past the baseline" (13.0) |

**Beats, part B** (no narration yet; on this frame's clock). Turn 142 (`fe51fd0e7ca12182`, "When a reform shock perturbs the circuit, those three RLC parameters govern the damped oscillation…") starts at +14.52, just before the sweeps begin.

| s | On screen |
|---|---|
| 15.0 | DERIVED badge, sliders, readout; caption DERIVED · RAISE AND LOWER L · STATE INERTIA; baseline drops to a 28 % ghost |
| 16.2–23.4 | L steps every 0.9 s: 1 → 1.6 → 2.5 → 1.6 → 1 → 0.65 → 0.4 → 0.65 → 1 (knob, curve and readout move together) |
| 23.7–26.7 | takeaway L |
| 27.1 | caption DERIVED · RAISE AND LOWER R · INSTITUTIONAL RESISTANCE |
| 28.3–37.9 | R steps every 0.8 s: 0.4 → 0.9 → 1.5 → 2 (ζ = 1) → 2.8 → 2 → 1.5 → 0.9 → 0.4 → 0.2 → 0.1 → 0.2 → 0.4 |
| 38.1–41.1 | takeaway R |
| 41.5 | caption DERIVED · RAISE AND LOWER C · LEGAL BUFFERING CAPACITANCE |
| 42.7–49.9 | C steps every 0.9 s: 1 → 1.6 → 2.5 → 1.6 → 1 → 0.65 → 0.4 → 0.65 → 1 |
| 50.2–53.2 | takeaway C |
| 53.6 | caption ILLUSTRATIVE, DIMENSIONLESS PARAMETERS · NOT CALIBRATED TO THE HISTORICAL RECORD; baseline back to full |
| 57.1 | end |

**Proposed Render:**

| Shot | turn_id | Spoken text | Render |
|---|---|---|---|
| S05-24 | `6017b9e8036ac25d` | "Equation two point eleven models the dynamic response to reform shocks as a series RLC differential equation …" | **diagram** `figma:g-eq2.11 RLC sweep` (replaces `manim:yt02/rlc_teach.py:RLCTeach`) |
| S05-25 | `fe51fd0e7ca12182` | "When a reform shock perturbs the circuit, those three RLC parameters govern the damped oscillation …" | **hold** S05-24 |
| S05-26 | `2ceea706fbc6a5d5` | "All five requirements of the systems checklist are satisfied …" | **hold** S05-24 |

Turn 144 starts at +32.2 s, mid-way through the R sweep, so the current narration covers part B only up to there. The full three-parameter sweep needs about 25 s of new narration between turns 142 and 143. Here is a draft in the R1 register, for the script owner to accept or rewrite:

- 15.0 — "Change one part at a time. Raise the state's inertia, L, and the backlash swings deeper, each swing takes longer, and the ringing lasts longer."
- 27.1 — "Now raise institutional resistance, R. The swing shrinks. At a damping ratio of one it stops crossing the baseline at all, and past that the return gets slower."
- 41.5 — "Raise the legal buffering capacitance, C, and each swing stretches out and lands softer, while the decay rate set by R and L stays the same."
- 53.6 — "These numbers are illustrations. The book's claim is the order: each reform cycle damps faster than the last."

**Fixed after the first export:**
- The component labels collided with the headline rule. The circuit moved down 36 px, the equation and sliders 14 px.
- The three component tags ran together. They are now 144 px wide at 16 px type.
- The source line ran into the bottom ornament and was shortened.

---

## G30 · Complex-wage warm-up (turns 341–342)

| | |
|---|---|
| Figma frame | `g-complex wage warm-up` · node **`151:485`** · 20.6 s |
| Clip | `outputs/YT02V2/video/figma/g-complex-wage-warm-up.mp4` (1920×1080, 30 fps, 20.63 s) |
| Screenshots checked | `logs/stills_g/g30_warmup_sheet.png` (t = 2, 6, 9.6, 16.8 s), `logs/stills_g/g30_warmup_end.png` (t = 20) |

**What it shows:** a plain explainer of the parts before any phasor geometry.
1. Du Bois's two channels appear as chips, "material wage" and "status wage", and bracket into the pair (ψ_m, ψ_s).
2. **The real line** draws as a number line in the episode convention: vertical, with positive values downward ("material value delivered down"). The negative ticks are red, under an "extraction → Elite" arrow pointing up. A green dot slides to 2 to show that a real number is one position on one line.
3. **The imaginary line** draws horizontally, with ticks j, 2j, 3j, 4j and labels ψ_s, "× j · status →". A gold dot slides to 2.5j.
4. Dashed projections from both dots meet at **one point**, W. The point carries the pair (ψ_m, ψ_s), and Equation 3.5, W = ψ_m + jψ_s, appears in its panel.
5. The same number is drawn as an arrow from the origin: the **phasor**.
6. A faint Quadrant II box (upper-right) previews the plane that follows.

**Beats** (0 = start of turn 341 `de291b853c123795`; turn 342 `1a8b00ba21498d95` starts at +10.74):

| Phrase | s | On screen |
|---|---|---|
| "Two coupled components" | 0.16 | channels panel; chips "material wage", "status wage" |
| "form a pair" | 1.04 / 1.54 | bracket; (ψ_m, ψ_s) |
| "material wage" | 3.38 | real line draws (vertical, + down); caption THE REAL LINE · MATERIAL WAGE · POSITIVE POINTS DOWN |
| "real component" | 4.88 | green dot slides to 2; extraction arrow (4.38) |
| "status wage" | 6.12 | imaginary line draws (horizontal, right); caption THE IMAGINARY LINE · STATUS WAGE · POSITIVE POINTS RIGHT |
| "imaginary component" | 7.16 | gold dot slides to 2.5j |
| "producing" | 8.22 | projections meet; point W (8.72); Eq. 3.5 panel; caption ONE POINT · ONE PAIR · ONE COMPLEX NUMBER |
| "complex number" | 9.14 | W label, (ψ_m, ψ_s) at the point, Eq. 3.5 |
| "Electrical engineering" (342) | 10.74 | phasor panel; caption THE SAME NUMBER DRAWN AS AN ARROW · A PHASOR |
| "as a phasor" | 14.36 | the arrow from the origin draws to W; tag "phasor" |
| "path from Du Bois's two-part wage" | 16.56 | channels ringed; both dots pulse |
| "the plot you are about to see" | 18.80 | Quadrant II preview (upper-right) |
| (end) | 20.60 | |

**Proposed Render:**

| Shot | turn_id | Spoken text | Render |
|---|---|---|---|
| S10-59 | `de291b853c123795` | "Two coupled components form a pair. The book places the material wage on the real component and the status wage on the imaginary component, producing one complex number." | **scene** `figma:g-complex wage warm-up` (replaces the hold on `cards/S08-48.json`) |
| (turn 342) | `1a8b00ba21498d95` | "Electrical engineering represents that complex quantity as a phasor. That engineering picture is the path from Du Bois's two-part wage to the plot you are about to see." | **hold** S10-59 |

The phasor tags read "phasor" and "one arrow from the origin carries both parts: its length and its angle".

**G31 interaction:** turns 343–345 restate the two channels (G31). If the reorder moves those lines, the warm-up still stands as a unit, because its beats follow the words of 341–342 only.

**Fixed after the first export:**
- The plane sat against the headline rule. The origin moved to (640, 510) and the unit to 80 px.
- The imaginary-line tag ran into the panel, and the "phasor" tag sat on the arrow. Both moved.

---

## G32 · Turn 350, the cross of axes turns a quarter turn clockwise

| | |
|---|---|
| Figma frame | `g-S10-08 axes quarter turn` · node **`153:485`** · rig **`153:760`** · 14.4 s |
| Clip | `outputs/YT02V2/video/figma/g-s10-08-axes-quarter-turn.mp4` (1920×1080, 30 fps, 14.43 s) |
| Screenshot checked | `logs/stills_g/g32_axes_turn_sheet.png` (t = 6, 8.8, 13, 14.4 s) |

**What it shows:**
- *Geometry:* the S10-06 plane, built as its own turn-350 frame with S10-06's geometry: origin (640, 575), axis half-length 270, |W| = 250, θ = 35°. The right column also matches S10-06: the j = √−1 panel, the Eq. 3.5 panel with its gloss, and the "SCREEN COORDINATES · W × (−j)" panel.
- *Textbook build:*
  - Real horizontal (Re), imaginary vertical (Im).
  - The real part of W draws along the horizontal in green, and the imaginary part up the vertical in gold.
  - Dashed projections, then W itself.
- *The turn:*
  - The axes, both components, the projections and W all sit in one transparent rig frame centred on the origin. On "rotate … quarter turn clockwise" the **whole cross rotates −90°** (clockwise on screen) with the arrow on it.
  - The Re, Im and W labels counter-rotate +90° and stay upright.
  - A curved turn arrow and W·(−j) "quarter turn clockwise" mark the move. They are placed outside the circle the axis tips sweep.
- *After the turn:* ψ_s / "status (+)" appears at the right and ψ_m / "material delivered down (+)" at the bottom, each with its component pulsing. The wording is S10-06's, for a clean hand-off.
- *End state:*
  - W ends at the same tip S10-06 uses (143 px right, 205 px down, θ = 35° from the downward ψ_m axis).
  - S10-06 draws W itself at turn 352 ("Draw the wage as an arrow"). So W, its components and its projections fade out at 13.8–14.3. The last frame is the rotated, labeled plane that S10-06 holds at turn 351.

**Beats** (0 = start of turn 350 `6f57987c14083560`; turn length 14.3 s):

| Phrase | s | On screen |
|---|---|---|
| "The textbook layout" | 0.10 | caption THE TEXTBOOK LAYOUT · REAL HORIZONTAL, IMAGINARY VERTICAL; Re/Im axes and panels already up |
| "real part" | 1.26 | horizontal axis pulses; real component draws (1.46–2.10) |
| "imaginary part" | 3.74 | vertical axis pulses; imaginary component draws up (3.94–4.66) |
| "vertical axis" | 5.06 | projections (4.76); W draws (5.06–5.76); W label (5.66) |
| "For this episode" | 6.66 | caption THIS EPISODE · A QUARTER TURN CLOCKWISE · W × (−j); turn arc; W·(−j) tag; screen-coordinates panel (7.06) |
| "rotate … quarter turn clockwise" | 7.84 → 9.84 | the whole cross with W rotates −90° (eased); labels stay upright |
| (turn complete) | 9.84–10.34 | Re/Im labels fade; turn arc and tag fade (10.24–10.74) |
| "status runs right" | 10.78 | caption STATUS RUNS RIGHT · DELIVERED MATERIAL VALUE RUNS DOWN; ψ_s label and tag; ψ_s component pulses |
| "delivered material value runs down" | 12.08 | ψ_m label and tag; ψ_m component pulses (12.48) |
| (hand-off) | 13.80–14.30 | W and its parts fade, leaving the S10-06 axes |
| (end) | 14.40 | |

**Proposed Render:**

| Shot | turn_id | Spoken text | Render |
|---|---|---|---|
| S10-08 | `6f57987c14083560` | "The textbook layout puts the real part on the horizontal axis and the imaginary part on the vertical axis. For this episode we rotate that plane a quarter turn clockwise, so status runs right and delivered material value runs down." | **scene** `figma:g-S10-08 axes quarter turn` (replaces the hold on `figma:wage S10-06`) |
| S10-09 | `78364eeb24d57ed5` | "That rotation preserves every length, every angle, and the same handedness. …" | back to `figma:wage S10-06`, cut in at its turn-351 point |

**S10-06 itself:**
- S10-06 (`82:19322`) already has an `axes` rig (`110:19966`) rotating −90° at 23.0–24.8 s on its own clock. W is not on it at that point: W appears at 53.1 s.
- I left S10-06 and the phasor builder (`91:19483`, `phasor_builder.js`, `phasor_spec.py`) untouched. The builder draws the S10-01/14/43 frames, none of which contains the textbook-to-episode turn, so G32 needs no change there.
- If the orchestrator prefers the turn inside S10-06 rather than a separate cut, the same move is to put a W, its components and projections inside `110:19966`. `g_axes_turn.js` shows the rig layout to copy.

**Fixed after the first export:** the turn label sat in the sweep of the rotating axis, and the ψ_s tag ran into the panel.

---

## Next steps · Codex visual audit, SEG 02–06 equations (`feedback/G_visual_audit.md`)

These are proposals for Figma explainers in the same kit (`g_prelude.js`, rig rotation and scale, computed paths, LaTeX labels). Each lists its turn_ids and the audit's priority. G11 already covers Eq 2.11.

| Item | Turns (turn_id) | Proposal | Pri |
|---|---|---|---|
| **Eq 2.12** underdamped q(t) = Q₀e^(−αt)[…] | 590 `713ab93e1d7c25db` | Reuse the G11 scope and `rlc_sweep.py`. Add Q₀, α and ω_d sliders, the ±Q₀e^(−αt) envelope, and the 1865 and 1964 shocks with q > 0 / q < 0 zones. This also recreates **Figure 2.6** and the fitted ζ = 0.17, 0.59 and 0.97 at `tex:2390`. The book states this ordering. | P1 |
| **Figure 2.5** series RLC topology | 589 `bfdc46d6110f5831` | Clone the G11 circuit group (`149:163` › `circuit`). Trace current V → R → L → C with the book's glosses (`tex:2235–2243`). | P1 |
| **Figure 2.2** reprise | 140 `30cb7f8f3a083955`; 561 `bb6e8bf338c6270d` | Reuse `147:163`: start the clip at 31.3 s to isolate the dashed arc as the maintenance loop. | P1 |
| **Eq 2.5** conventional chain | 83–97 (`429cc3007f0a0044` … `fb10586decaeb609`) | Use the G5 conventional row as a response strip. Sweep prejudice prevalence and action-conversion rate; the systemic-outcome bar responds after two delays. Overlay the archival order at 92–93. Label it derived. | P2 |
| **Eq 2.6** causal reversal | 96–98, 108 (`e51d9be6fc60b2e2`, `fb10586decaeb609`, `c8a4cfdabb044e6c`, `a18800f1aef65139`) | Extend G5 into a state-flow model. Sweep Elite extraction pressure and code strength; the partition intensity and downstream prejudice update in sequence. Label it derived. | P2 |
| **Eq 2.7** kernel objective, max E s.t. M < τ | 138 `e0579700d2d86aca` | E-versus-M plane with a τ boundary and a feasible region. Sweep τ and enforcement allocation; the optimum slides along M = τ. | P2 |
| **Eq 2.1** U = I ⊔ O, I ∩ O = ∅ | 130, 155–159, 181, 185–186 | Set-membership explainer: dots sort into I and O, an overlap attempt glows red and is forced to ∅. This fits G10 step 4 (the set refresher), before the cone. | P2 |
| **Eq 2.2** Refine(I) into four tiers | 121, 160–163 | Cone stays in manimgx (owned elsewhere). The Figma part: a membership sweep among the four I tiers with a fixed union, after the matched-circle cut. | P2 |
| **Eq 2.3** O decomposition, m adjacent groups | 166–167, 182 | Pie decomposition from the cone's base circle (G12 hand-off). Sweep m and the slice sizes while the union stays O. | P2 |
| **Eq 2.4** recursive local partition X = X⁺_α ⊔ X⁻_α | 172–179, 182 | Nested bisections inside a selected tier. Step α through gender, property/felony, credentials and skin tone; members move between X⁺ and X⁻. | P2 |
| **Eq 0.3** ordinal tier benefit gradient | 164 `a617ff10ae83c0da` | Five aligned benefit bars. Sweep each tier's payoff under the ordinal constraints and flag any violation in red. | P1 |
| **Figure 0.3** five-tier extraction circuit | 121, 132 `e10df915a29cdf5b` | Recreate the circuit (current source, divider, insulation, gate, ground) with current flow and a policy tap, reusing the G11 circuit primitives. | P1 |
| **Figure 2.1** zooming the binary | 180 `cc98cd8143874984`, 183 `2e5ed107beeff5fb` | Recreate the figure: I/O, then a zoom into the I tiers, then the O layers, then the α subdivisions. | P1 |
| **Eq 3.1 / Eq 25.1** racism vector | 66 `ddd4ef7318a18f9e`, 69 `223a12104f98930e` | Vector rig (same rotation and scale method as G32). Sweep magnitude and direction independently, with a prejudice-scalar readout beside it. | P2 |
| **Eq 4.2** I_buffer ∩ O_racialized = ∅ | 131 `18a2a88b01e96c34` | Two sets approach; the 1691 statute drives the overlap back to ∅. Sweep kinship crossings and enforcement intensity. | P2 |

## Flags for the orchestrator

- **Underscores in other frames:** the audit's underscore list does not cover the phasor frames. `phasor_builder.js` writes `ψ_m` in regime labels ("pure status\nψ_m = 0", "Quadrant II\nψ_m < 0"). S10-06's source line reads "ψ_m positive down, ψ_s positive right". Both put underscores on screen. They are outside this task and belong to whoever owns the phasor frames.
- **Source line vs. ornament:** in every frame (mine and S10-06), the left vertical ornament of the border crosses the source line at about x = 205. Mine follow the reference, so they match it.
- **BOOK-UPDATE? (G11):**
  - The L and C sweep directions, and the finding that the fastest 5 % settling sits below ζ = 1.
  - The book states only that the kernel expands R, raising α (`tex:2316`).
