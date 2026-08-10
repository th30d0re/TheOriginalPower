# FC-01 — Constructed-Society Corpus: Pre-Registered Coding Rubric

**Status:** pre-registered, uncoded at time of commit
**Registered:** 2026-08-09
**Purpose:** Test the separability claim of Conjecture `conj:universality`
(`The_Original_Power.tex:15271`) — that the five-node extraction topology is invariant while the
dissipation channel `B_k` is contingent — against a corpus of fully specified power systems.

This document is frozen before any specimen is read for fit. The commit hash of this file is the
registration timestamp. Coding that begins before this file is committed is void.

---

## 1. What this study measures, and what it does not

A constructed society exhibiting the five-node topology supplies no evidence that the topology is
real. It supplies evidence that the author converged on the same structure. The two results are
separable and this study reports both under separate headings:

- **Result A (about the formalism).** Whether five nodes, one wage, and one field are *sufficient*
  to describe a completely specified extractor, and whether the topology holds while `B_k` varies
  across independent authorial draws. Constructed societies are competent to test this because
  they offer **total observability**: the historical anchor cases supply partial state with error
  bars, while a constructed society supplies its own complete circuit by authorial fiat.
- **Result B (about the authors).** How precisely each author modeled power. Here the framework is
  the instrument and the work is the specimen.

Result A carries the scientific weight. Result B carries the expository weight. Neither is offered
as empirical support for the historical claims of the manuscript, and the write-up states this in
its first paragraph.

## 2. Corpus and the calibration/holdout split

Real historical systems form the **calibration set**: their coding is checkable against the 146
anchor cases, so a rubric that miscodes them is broken before it reaches the holdout. Constructed
societies form the **holdout**.

**Calibration set (real, n = 15).** Rome (Principate); Ottoman millet system; British Raj;
Congo Free State; Apartheid South Africa; Spanish colonial casta; Qing dynasty; Antebellum U.S.
South; Nazi Germany; USSR nomenklatura; Japanese occupation of Korea; French Algeria; Portuguese
Brazil; Mughal India; Athenian democracy (metic/slave strata).

**Holdout set (constructed, n = 16).** Dune (Corrino Imperium); Star Wars — Republic→Empire
transition; Star Wars — Galactic Empire steady state; The Expanse (Inners/Belt); Star Trek —
Federation core (**negative control**); Star Trek — frontier (Maquis, DMZ colonies, Section 31);
The Hunger Games (Panem); The Handmaid's Tale (Gilead); Nineteen Eighty-Four (Oceania); Brave New
World (World State); Gattaca; Snowpiercer; Avatar: The Last Airbender (Fire Nation); The Matrix;
Foundation — Asimov novels (Galactic Empire); Foundation — Apple TV+ series (Genetic Dynasty era).

**Phase-splitting rule.** A work that depicts kernel *installation* and kernel *steady state* is
coded as two specimens. Installation and steady state are different dynamical regimes and merging
them destroys the distinction the corpus exists to measure. This rule is why Star Wars and Star
Trek each appear twice.

**Paired-specimen rule.** Where two authorial teams construct the same world, both are coded and
the pair is reported jointly. The world is held constant, so every coding difference is
attributable to the authors. This is the corpus's cleanest instrument for Result B, and it is why
Foundation appears twice: Asimov (1951) and Goyer (2021) model the same Empire, and the Apple TV+
adaptation adds the Genetic Dynasty — a clone succession that fixes `E` as a literal invariant —
where the novels leave succession conventional. Coders code each specimen independently and
without reference to the other before the pair is compared.

## 3. Coding protocol

1. Code from the primary work only. Commentary, wikis, and author interviews are excluded from
   coding and may be cited in the residue field alone.
2. Code Section A **before** Section B, and record Section A without reference to the topology.
   A coder who knows the topology answer will fit the scope conditions to it.
3. `absent` and `indeterminate` are distinct codes. A work that does not depict a node scores
   `indeterminate`; a work that depicts its structural absence scores `absent`.
4. Every non-`indeterminate` code carries a specific evidence citation.
5. Section F is mandatory and may not be left empty as a matter of convenience.

## 4. The rubric

### Section A — Scope gate (Conjecture conditions)

| Field | Codes | Also record |
|---|---|---|
| A1 Bounded resources | absent / local / systemic | the constrained resource |
| A2 Positive feedback | absent / weak / strong | the rule-alteration mechanism |
| A3 Dissipation threat | absent / latent / active | the coherence capacity at issue |

**Gate.** Any `absent` in A1–A3 classifies the specimen as a **negative control**. Sections B–E are
coded anyway, and the registered prediction is that the full topology fails to appear.

### Section B — Topology

For each of `E`, `P_uppet`, `F_enforce`, `I_buffer`, `O`: presence (`absent` / `partial` / `full`),
the named entity, and an evidence citation. Then one system-level field:

- **Benefit ordering** — does `Benefit(E) >> Benefit(P) > Benefit(F) > Benefit(I) > Benefit(O)`
  hold (`The_Original_Power.tex:484`)? `holds` / `violated` / `indeterminate`.

### Section C — Dissipation channel `B_k`

- **C1 Axis type:** phenotype / bloodline-caste / geography / religion / species / genome /
  gender-reproductive / class-legible / other.
- **C2 Endogeneity:** is the axis *produced by the extraction itself*? `yes` / `no`. An endogenous
  axis is the literal form of the self-exciting generator, Eq. `eq:0.1a-self-exciting-generator`:
  the field that divides the population is manufactured by the extraction it enables.
- **C3 Axis count:** how many of the six manuscript axes run simultaneously.

### Section D — Suppression allocation `W = psi_m + j*psi_s`

- **D1** Material wage `psi_m` to `I_buffer`: absent / present, plus form.
- **D2** Psychological wage `psi_s`: absent / present, plus form.
- **D3** Mode: DC (`psi_s ~ 0`) / AC (both channels loaded).
- **D4** Wage collapse depicted: no / yes, plus trigger.

### Section E — Termination and outcome

Coded only where the work depicts an attempted termination.

- **E1 Intervention class:** non-kinetic / kinetic / exogenous.
- **E2 Outcome:** no change / interface update / **kernel transplant** (replacement `E` installed) /
  kernel termination.
- **E3 Durability:** not depicted / erodes / persists.
- **E4 Concession check:** does any non-kinetic reform produce a sustained reduction in `E`'s
  extraction share, per the three conditions at `The_Original_Power.tex:15074`?

### Section F — Residue (mandatory)

Free text. Any load-bearing structure in the system that fits no node, no field, and no wage.
This field is the primary scientific output of the study: a node the framework lacks is a finding
about the framework, and forcing such a structure into an existing node destroys the finding.

### Section G — Coder metadata

Confidence per section (1–5); prior familiarity with the work (none / passing / deep); any passage
that changed the coder's mind mid-coding.

## 5. Registered predictions

- **P1 (separability).** Among in-scope specimens, at least 80% code `full` or `partial` on all
  five nodes while C1 spans at least five distinct axis types.
- **P2 (negative control).** Specimens failing the Section A gate fail to exhibit the full
  topology. Named in advance: Star Trek — Federation core.
- **P3 (buffer necessity).** Specimens coding `I_buffer = absent` depict kernel termination by a
  single coordinated kinetic action. Specimens coding `I_buffer = full` depict either no
  termination or kernel transplant. This is the prediction that sorts wish-fulfillment from
  structural realism, and it is the prediction most likely to fail.
- **P4 (condition 5).** Among specimens depicting kinetic termination, kernel transplant occurs
  more often than kernel termination — the pattern the Haitian Theorem's fifth falsification
  condition names (`The_Original_Power.tex:15102`).
- **P5 (residue shape).** Residue entries concentrate on entities monopolizing a *substrate* —
  mobility, information, reproduction — rather than a commodity.
- **P6 (prescription stress test).** Where a work depicts universal baseline provisioning, the
  internal dissipation threat falls while external extraction continues. Appendix
  `app:universality` proposes baseline provisioning as one of two changes that move the system out
  of its universality class (`The_Original_Power.tex:15306`). A specimen showing a pacified core
  funded by an extracted periphery is evidence that the prescription is incomplete on its own.
- **P7 (recompilation necessity).** The manuscript's account of kernel survival is interface
  swapping: the extraction persists because its presenting face is periodically replaced
  (Ch. `ch:recompile`, Eq. 13.16, `Paper/scripts/eq13_16_interface_swap_matrix.ipynb`). The
  prediction is that specimens depicting an `E` structurally barred from recompiling exhibit
  kernel failure without external kinetic action. Named in advance: the Genetic Dynasty of the
  Apple TV+ Foundation, where `E` is a clone lineage and succession is eliminated by construction.
  A kernel that cannot change its interface should die of its own rigidity, and the paired Asimov
  specimen — same Empire, conventional succession — is the control for that comparison.

## 6. Kill conditions

The study reports a null and the rubric is discarded if either holds:

1. **The rubric fits everything.** Negative controls code `full` on all five nodes. A rubric that
   cannot fail to find the topology measures the coder rather than the specimen.
2. **Residue swallows the result.** More than one third of in-scope specimens carry residue that
   is load-bearing enough to alter the benefit ordering. That result reclassifies the study: the
   five-node topology would then be reported as insufficient rather than invariant.

## 7. Provenance

Derived only from: Conjecture `conj:universality` and Appendix `app:universality`
(`The_Original_Power.tex:15258–15306`); the five-tier definitions (`:180`, `:412`, `:476`, `:484`);
the complex wage (`:825`, `:849`, `:873`); the self-exciting generator (`:378`); and the
falsification appendix (`:15062–15113`). No specimen was consulted in drafting this rubric.
