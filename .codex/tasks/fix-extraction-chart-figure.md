# Brief — Correct the Extraction Chart figure and its per-axis table

## Files you own

- `Paper/apx_extraction_chart.tex` — the only file you may edit.

Do not touch any other `.tex`, any script, or anything in `Paper/data/`.
**Do not run `git`.** The orchestrator reviews and commits.

## What is already established — do not re-derive

`Paper/audit/per-axis-frequency-reconciliation.md` (committed) established:

- The published per-axis periods come from Lomb–Scargle peaks on a 57-case, 145-year
  SCOTUS corpus, stored in `Paper/data/scotus_spectral_results.json`: race `3.59 yr`,
  gender `6.18 yr`. They reproduce exactly.
- Chapter `ch:spectral_carrier` publishes these as **3.6 and 6.2**
  (`Paper/chapters_src/15_tweedism_and_the_puppet_class_the_algori.tex:1267-1292`).
- `Paper/apx_extraction_chart.tex:344` instead prints gender as **6.0**, which is a
  less faithful rounding and contradicts the chapter.
- The appendix's `delta = -0.211 / +0.833` is internally consistent only with `3.6 / 6.0`.
- Sexuality has **no resolved period** — the SCOTUS run returned `50.0 yr`, which is the
  edge of its `3-50 yr` search grid, i.e. unresolved.

## The three corrections

### 1. Gender period and detuning

In the table at `apx_extraction_chart.tex:339-349`, change gender from `6.0` to `6.2` yr
and recompute its row. Use `delta_k = omega/omega_0k - omega_0k/omega` at the carrier
`omega = 0.25` cyc/yr, with `omega_0k = 1/T_k`.

Race is unchanged at `T = 3.6`, `delta = -0.211`. Verify this rather than assuming it.
Compute gender's `omega/omega_0` and `delta` and print both to the table's existing
precision.

### 2. Marker honesty

The caption at `apx_extraction_chart.tex:450-461` describes the coloured markers as
placing the sub-bands using "their published natural frequencies", and the surrounding
text reads as measurement. These are **exploratory dominant spectral peaks from a small
selected corpus**, not measured natural frequencies of the axes.

Revise the caption and any adjacent claim so it states what the markers are: dominant
periods recovered by Lomb–Scargle from the SCOTUS corpus, exploratory, with the reactive
component still resting on an illustrative `Q_k = 3`. Keep the existing Tier 3 disclosure.

### 3. The sexuality marker

Sexuality currently gets a plotted marker (`apx_extraction_chart.tex:438-440`) despite no
resolved period. Remove that marker and its label from the TikZ figure, and note in the
caption that sexuality is unresolved and therefore unplotted. Keep the axis in the table
with its existing "threshold-activated" description.

## Figure coordinates

The gender marker's position must move, since it derives from `delta`. The chain is:

    x_k = r_k * Q_k * delta_k        (from eq:xc.14-branch-impedance, Q_k = 3)
    z_k = r_k + j*x_k
    Gamma = (z - 1) / (z + 1)
    plotted point = (Rad * Re(Gamma), Rad * Im(Gamma))   with \def\Rad{4}

The existing gender marker uses `r = 0.50` and is drawn at `(0.852, 2.624)`. Confirm that
reproduces from `delta = +0.833` before trusting the chain, then recompute for the
corrected `delta`. **If your recomputation does not reproduce the existing coordinates for
the old delta, stop and report that in findings rather than writing a number you cannot
derive.**

Race's marker is unchanged if its `delta` is unchanged. Verify, do not assume.

## Prose constraint

`AGENTS.md` imposes a hard style rule on manuscript prose: direct, affirmative declarative
statements. No formulaic antithesis, no corrective contrasts ("not merely X, but Y").
Match the surrounding text.

## Acceptance

1. `make pdf-from-tex` compiles without error.
2. The table, the caption, and the plotted markers are mutually consistent.
3. No marker is plotted for an unresolved axis.

## Findings

Write `Paper/audit/extraction-chart-fix-notes.md` recording the recomputed values, whether
the coordinate chain reproduced the existing markers, and anything in this brief that
turned out to be wrong.
