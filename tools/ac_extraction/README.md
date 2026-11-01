# AC Extraction Meter

An instrument for the manuscript's DC/AC distinction and the Reparations Integral
(`Paper/The_Original_Power.tex`, `:1082`–`:1440`).

- Published page (private until shared): https://claude.ai/artifact/23PsLevFAsCA9F38tP63fa
- Local copy: open `ac_extraction.html` in a browser. It needs no data files.

## What the page does

- **The wage as complex power.** S = V·I* = P + jQ, with P = ψ_m and Q = ψ_s (eqs. 0.8–0.9). Sliders set θ,
  |V|, and |I|. Presets: DC (θ = 0, eq. 0.7a), covert AC, pure reactive (θ = 90°), and Quadrant II
  (θ > 90°, cos θ < 0). Orientation matches `tools/complex_wage_plane`: +ψ_m points down (6 o'clock), +ψ_s
  points right, clock = 6 − θ/30.
- **One cycle.** v(t), i(t), and p(t) split into the real part P(1 + cos 2ωt) and the reactive part
  Q·sin 2ωt. The page integrates the reactive part over the window and shows that it is zero: the
  Buffer-Class Work Theorem (eq. 0.15).
- **The Reparations Integral** (eq. 0.16), 1619–2026, in three eras: DC (chattel slavery), a half-wave
  rectified era (13th Amendment exception, Jim Crow; `:1259`–`:1275`), and AC (θ from the phasor panel).
  The page shows the running integral and each era's share.

## What the numbers mean

The manuscript says the real-power curve is illustrative. The era levels on this page are illustrative
too, so the shares show how the regimes add up under the chosen settings. The dollar estimates the
manuscript cites (Craemer, about $14–17 trillion; Darity and Mullen, about $10–12 trillion) are not
computed here.
