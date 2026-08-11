# Extraction Chart Fix Findings

- Carrier: `omega = 0.25 cyc/yr`; illustrative `Q_k = 3`.
- Race: `T = 3.6`, `omega/omega_0 = 0.900`, `delta = -0.211111`; with `r = 0.10`, the chain gives `(-3.248698, -0.417349)`, or `(-3.249, -0.417)` at figure precision. The existing marker is `(-3.249, -0.416)`.
- Old gender check: `T = 6.0`, `omega/omega_0 = 1.500`, `delta = +0.833333`; with `r = 0.50`, the chain gives `(0.852459, 2.622951)`, or `(0.852, 2.623)` at figure precision. The existing marker is `(0.852, 2.624)`.
- Corrected gender: `T = 6.2`, `omega/omega_0 = 1.550`, `delta = +0.904839`; the chain would give `(1.067556, 2.653389)`, or `(1.068, 2.653)` at figure precision.
- The coordinate chain therefore does not reproduce either existing marker exactly. Per the brief's stop condition, `Paper/apx_extraction_chart.tex` was left unchanged and no build was run.
- The brief's claim that the old gender coordinate reproduces from `delta = +0.833` is incorrect at the stated three-decimal coordinate precision; the same one-thousandth discrepancy appears on race's vertical coordinate.
