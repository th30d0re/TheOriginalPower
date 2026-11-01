# Snubber Circuit

An instrument for the manuscript's switching moment: the kernel breach that cuts the current holding an
era's field in the coil L (`Paper/The_Original_Power.tex`, `:2416`–`:2440`). The collapsing field drives
a back-EMF surge, v = −L di/dt (eq. 1.7d), and its stored energy ½LI₀² (eq. 1.7e) has to go somewhere.
Three paths compete for it.

- **Elite recovery** (red): an ideal diode and R_h into the next coil's capacitor C_next, which starts
  empty. The manuscript: "They do not waste the Back-EMF. They harvest it." (`:2422`)
- **Snubber grid** (teal): R_s in series with C_s, the Out-group routing its energy through local,
  open-source grids (`:14435`, `:14348`).
- **TVS clamp** (gold): an ideal clamp at ±V_br, armed deterrence (`:11598`–`:11630`).

- Published page (private until shared): https://claude.ai/artifact/QRVsfVrcF9cgdBsD9SAowB
- Local copy: open `snubber.html` in a browser. It needs no data files.

## What the page does

- **The schematic is the control panel.** Select a path to switch it on or off (keyboard: Tab, then
  Enter or Space). Five presets: Unprotected, Elite recovery only, Snubber grid, Snubber + TVS, and
  Decoupled grid (the Elite path removed, as in the Parasitic System Collapse Theorem, `:14435`).
- **The surge.** v(t) is integrated numerically (fourth-order Runge–Kutta) with a small stray
  capacitance (0.002) and a small coil resistance (0.05). The clamp level ±V_br is drawn when the TVS
  path is on.
- **The energy ledger.** Energy that charges C_next or heats R_h counts as recovered by the Elite;
  energy in R_s or left in C_s counts as absorbed by the grid; energy at the clamp counts as clamped by
  the TVS node. The ledger closes: the parts add up to ½LI₀² in every preset.

## Default results (illustrative units)

| Preset | Peak surge | Elite | Grid | TVS | Coil loss |
|---|---|---|---|---|---|
| Unprotected | 22.3 | 0% | 0% | 0% | 26% (74% still in the field) |
| Elite recovery only | 2.8 | 96% | 0% | 0% | 2% |
| Snubber grid | 2.0 | 46% | 49% | 0% | 5% |
| Snubber + TVS (V_br = 1.2) | 1.2 | 20% | 22% | 54% | 4% |
| Decoupled grid (V_br = 1.2) | 1.2 | 0% | 28% | 69% | 3% |

The manuscript gives no values for these parts. Every number is illustrative: the page shows how the
paths compete for the energy, not how large any historical surge was.

## An open point: the direction of V_br

The manuscript says arms and training *raise* V_br (`:11611`). In a real TVS diode, a higher breakdown
voltage lets a larger surge through before the clamp acts; protection improves with a *lower* clamping
voltage and a higher power rating. The page keeps the electrical meaning (a lower V_br clamps sooner).
The manuscript's Kinetic Abort Threshold (eq. 13.tvs-abort, P_loss = I²R_kinetic > C_max) puts the
deterrent in the clamp's capacity to absorb power, which fits the electrical reading better than a
higher V_br does.

## Design

Same identity as `tools/rlc_backlash`: cream wires (#ECE7DC), green coil (#7CC08A), red Elite path
(#E0604A), gold TVS (#D4A84B), accent orange surge (#E08A3C), teal snubber (#4CC2C2), on the navy field
(#0D1B2A).
