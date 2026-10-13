# Errata: open corrections for the manuscript and companion drafts

Log a correction here when it's found, and mark it done once the source is fixed and the PDF rebuilt (`make verify-pdf`).

| # | Found | File : line | Problem | Correction | Status |
|---|---|---|---|---|---|
| 1 | 2026-10-13 | `Paper/electrodynamic_unified_theory_intro_pandoc.tex:1202` (§7.13, Snell's law, Eq. UEF-21) | Says a reform wave entering a higher-index institutional medium is redirected "unless it enters at a steep enough angle to avoid total internal reflection." Total internal reflection only occurs going from a higher index to a lower one (n₁ > n₂) beyond the critical angle sin θc = n₂/n₁. A wave entering a denser medium always transmits; it bends toward the normal. | Drop the TIR clause. State the accurate result: at normal incidence (θ₁ = 0) the wave passes through without bending, and refraction grows with the angle of incidence. If TIR is wanted as a metaphor, attach it to the reverse crossing (institution → movement), where it does apply. | Open. Not yet in `The_Original_Power.tex`; fix it before §7.13 is merged into the book. The UEF Snell reel script (`Architecting_the_operation/podcasts/UEF_snell.md`) already uses the corrected physics. |
