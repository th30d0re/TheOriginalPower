# REFS-REPORT — Undefined cross-reference resolution

Task: `/Users/emmanuel/Documents/Theory/TheOriginalPower/.kimi/tasks/undefined-refs.md`
Branch: `agent/kimi-refs` (dedicated worktree). Baseline: 11 undefined references across 6
labels, confirmed against a fresh `pdflatex` log before any edit.

## Result summary

| label | refs | status | target |
|---|---|---|---|
| `sec:asymmetric_choice` | 1 | FIXED | `\section{The Asymmetric Choice Paradigm: Broken Windows, the 1994 Crime Bill, and the Carceral Ratchet}` (The Recompile chapter) |
| `sec:complicity_trap` | 2 | FIXED | `\section{Formalizing the Buffer Class ($I_{\text{buffer}}$): From Implicit In-group to Weaponized Partition}` (ch:bacon) |
| `sec:complicity_investment` | 1 | FIXED | `\subsection{The Physical Guarantee: The Second Amendment as Collateral}` (ch:enforcement) |
| `cs:bacons_rebellion` | 1 | FIXED | `\chapter{The Application: Bacon's Rebellion, the Buffer Class, and the Constitutional Patch (1676--1787)}` (ch:bacon) |
| `sec:haitian_contagion` | 4 | UNFIXED — no honest target | report only |
| `part:installation` | 2 | UNFIXED — no honest target | report only |

All edits are bare `\label{}` insertions immediately after the target division command. No
prose was added, removed, or reworded.

## Per-label detail

### `sec:asymmetric_choice` — FIXED

- Referencing line 7789: "the subsequent ``superpredator'' narrative
  (Section~\ref{sec:asymmetric_choice}) attributed the behavioral consequences of engineered
  poisoning to innate criminality".
- Target: `\section{The Asymmetric Choice Paradigm: Broken Windows, the 1994 Crime Bill, and
  the Carceral Ratchet}` in *The Recompile: COINTELPRO, the Variable Swap, and the War on
  Drugs (1968--1994)*. The section traces the conversion of the manufactured crisis (lead,
  deindustrialization, the crack market) into permanent carceral infrastructure under a
  doctrine of latent criminality, and its *Great Crime Decline* subsection shows the
  structural causes (lead exposure among them) corrected themselves. The label name and the
  section title correspond exactly; the label was dropped in the restructure.

### `sec:complicity_trap` — FIXED

- Referencing lines 3148 and 3240: "the Complicity Trap of Section~\ref{sec:complicity_trap}"
  and "the Complicity Trap analyzed in Section~\ref{sec:complicity_trap} ... The structural
  calculation was identical to that of the antebellum American buffer class: the complicity
  investment had already been paid."
- Target: `\section{Formalizing the Buffer Class ($I_{\text{buffer}}$): From Implicit
  In-group to Weaponized Partition}` in *The Application: Bacon's Rebellion*. That section
  analyzes the antebellum buffer class's purchased complicity: the suppression allocation
  that produces the paradox of `$I_{\text{buffer}}$` defending a hierarchy that materially
  harms it, including the subsubsection *The Autonomy Wage: The Currency of Complicity*,
  which derives why the buffer class polices the boundary on the Elite's behalf.

### `sec:complicity_investment` — FIXED

- Referencing line 12402: "The Elite had ensured, through the complicity investment
  (Section~\ref{sec:complicity_investment}), that the distinction between ``extraction
  kernel operator'' and ``white buffer class member'' was not cleanly available to
  $I_{\text{buffer}}$. A population that had patrolled plantations, witnessed documented
  horrors without intervention, and enforced the racial partition for five generations..."
- Target: `\subsection{The Physical Guarantee: The Second Amendment as Collateral}` in *The
  Enforcement Engine*. The subsection analyzes the Elite's purchase of buffer-class
  complicity through lethal-parity collateral and terror-anchored proximity to the witnessed
  plantation horror ("The plantation was visible. The horror was documented, witnessed, and
  understood"; "the daily enforcement of a system"), concluding that the arrangement was the
  Elite purchasing the necessary condition of its own survival. This is the mechanism the
  citing sentence names.

### `cs:bacons_rebellion` — FIXED

- Referencing line 2965 (footnote): "validated by the documented sequence from Bacon's
  Rebellion (1676) to the Virginia Slave Codes (1705). See the anchor case study on
  p.~\pageref{cs:bacons_rebellion} and the Empirical Methodology chapter
  (p.~\pageref{ch:empirical_methodology})."
- Target: `\chapter{The Application: Bacon's Rebellion, the Buffer Class, and the
  Constitutional Patch (1676--1787)}`; the label sits beside the existing `\label{ch:bacon}`.
  The footnote cites the Empirical Methodology chapter separately, so the anchor case study
  is the chapter that documents the 1676--1705 sequence itself. The Era-Level Calibration
  Matrix identifies this era as the $\rho_\tau = 1.0$ anchor case ("Bacon crash evidence +
  legal codification sequence + constitutional patch dynamics").

### `sec:haitian_contagion` — UNFIXED (no honest target)

- Referencing lines 3137, 3148, 3372, 4658 attribute to this section: (a) "the Haitian
  Catalyst that accidentally gifted the American Elite a continental expansion zone"; (b)
  having "established the Elite's reading of Haitian independence as a pathogen requiring
  quarantine"; (c) having "established the structure of the 1825 Sovereign Ransom" in "the
  preceding chapter"; (d) documentation of the "immediate, multi-decade continental panic
  ... culminating in the Louisiana Purchase, the Negro Seamen Acts, the quarantining of
  Haitian diplomatic recognition".
- Finding: no division in the current manuscript contains this content. The pre-restructure
  source (`Paper/Redefining_Racism_BACKUP_pre_restructure.tex`) carried exactly these
  sections — *The Haitian Catalyst and the Spatial Expansion of the Algorithm (1803)*, *The
  Haitian Contagion and the Algorithmic Lockdown* (Negro Seamen Acts, literacy bans, Gabriel
  Prosser, the German Coast Uprising, Denmark Vesey), and *The Sovereign Ransom and the
  $P_{\text{debt}}$ Variable* — and none of that material survives in the current source.
  The chapter-opening paragraph at line 3137 ("The preceding chapter closed with three
  interlocking accounts ...") presupposes a chapter that no longer exists; the actual
  preceding chapter (*The Constitutional Kernel*) contains no Haiti material.
- Options:
  1. Restore the excised material from the backup as a chapter between *The Constitutional
     Kernel* and *The Haitian Export*, and label its contagion section
     `sec:haitian_contagion`. The chapter-opening prose at 3137 was written against exactly
     this structure. (Recommended; editorial decision, restores lost content.)
  2. Retarget the four references to existing divisions (`sec:inverse_contagion`,
     `sec:cic_double_debt`) and rewrite the citing sentences to match. This modifies
     chapter arguments and was ruled out by the task.
  3. Leave the reference unresolved pending an authorial decision.
- Recommendation: option 1.

### `part:installation` — UNFIXED (no honest target)

- Referencing lines 228 and 14444: "Part~\ref{part:installation} (\textit{The Installation,
  1619--1865})", credited with the kinship (ch:kinship), gendered (ch:gendered), and
  enforcement (ch:enforcement) chapters.
- Finding: the book has three parts — I *Specification and Origins (1440s--1787)*, II
  *Scaling and Runtime (1865--Present)*, III *Diagnostics and Output*. The three
  "Installation" chapters currently sit inside Part I, which the same overview prose credits
  separately with the specification/template chapters (Portugal, Bacon, the Convention).
  Labeling Part I with `part:installation` would make one part number carry two conflicting
  titles in the same paragraph ("Part I (Specification and Origins)" and "Part I (The
  Installation, 1619--1865)"). No existing part matches the prose.
- Options:
  1. Split Part I: keep *Specification and Origins* through ch:haitian_export and open a new
     *The Installation, 1619--1865* part at ch:kinship (labeled `part:installation`). The
     dates align: the three chapters run 1619--1865 and Part II opens at 1865. (Recommended;
     editorial restructure, author's call.)
  2. Retitle Part I to span both roles (e.g. *Specification and Installation,
     1440s--1865*) and attach both labels. Changes a part title.
  3. Leave unresolved pending an authorial decision.
- Recommendation: option 1.

## Verification

Build environment notes:

- `biber` is broken on this machine (task statement). The bibliography was recovered by
  copying `Paper/The_Original_Power.bbl` from the main checkout, where it had been generated
  from a `references.bib` byte-identical to this worktree's (verified by diff). The `.bbl`
  is a gitignored build artifact and was not committed.
- `Paper/figures/spectral/*.pdf` is gitignored and was absent in the worktree; the
  manuscript loads those figures through `\IfFileExists` with placeholder fallbacks, so a
  naive build silently typesets 5 pages short (1129 vs 1134). The 22 spectral PDFs were
  copied from the main checkout. They are gitignored and were not committed.

Results (three `pdflatex -interaction=nonstopmode` passes from clean aux state):

- Page count: 1084 (pass 1) → 1134 (pass 2) → 1134 (pass 3). Converged at **1134**,
  matching the baseline and the committed PDF.
- Errors (`grep -ac "^! " Paper/The_Original_Power.log`): **0**.
- Undefined references: **6 remaining** (down from 11) — 4× `sec:haitian_contagion`, 2×
  `part:installation`. Both are reported above with reasons and options.
