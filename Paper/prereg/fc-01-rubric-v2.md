# FC-01 — Coding Rubric v2 (Amendment)

**Status:** amendment, pre-registered, uncoded at time of commit
**Supersedes:** `fc-01-fictional-corpus-rubric.md` (v1, registered `505061b`)
**Registered:** 2026-08-10
**Prompted by:** `fc-01-RESULTS-v1.md` — 62 codings across 31 specimens and two vendors

---

## 1. Amendment discipline

This document changes a frozen pre-registration after results were seen. That is the exact
move pre-registration exists to prevent, so the conditions under which it is legitimate are
stated first and held to:

1. **Every change is traceable to a numbered defect** in `fc-01-RESULTS-v1.md` §6. No change is
   made because a v1 result was unwelcome.
2. **No registered prediction is weakened to fit a v1 outcome.** P4 and P7 were refuted under
   v1. They are carried into v2 **unchanged in substance**, because both rest on fields v1
   measured unreliably and deserve a fair test rather than a rewrite.
3. **The v1 corpus is reported as a pilot**, not as the study. All 62 codings are superseded;
   every specimen is re-coded under v2.
4. **The corpus roster stays frozen** as of `505061b`. No specimen is added or removed. A
   corpus that grows after results are seen is a corpus fitted to them.

## 2. Changes to the instrument

### 2.1 The scope gate stops being a gate (defect 8)

v1 disqualified a specimen when **any** of A1–A3 coded `absent`. Brave New World codes A1
`absent` with A2 `strong` and carries the complete topology under both coders; Star Trek core
codes A1 **and** A2 `absent` and carries none. The conditions are not equivalent and must not
be OR'd.

**v2:** record A1, A2, A3 as an independent vector. There is no gate and no disqualification.
Every specimen is coded in full, and the conjecture is evaluated by which condition-vectors
accompany which topologies.

Registered consequence: the conjecture's condition 1 is now under test rather than assumed.

### 2.2 `I_buffer` keeps one node; the boundary with `F_enforce` gets a conduction test (§4.2)

An earlier draft of this amendment proposed splitting `I_buffer` into an active `I_police` and
a passive `I_pacified`. **That proposal is withdrawn.** `I_police` described conducting
behaviour, which the framework already assigns to `F_enforce`, and the split would have
introduced a sixth node to hold something the existing five already hold.

The manuscript settles the boundary in two places, and v2 adopts its answer:

- The circuit mapping (`The_Original_Power.tex:475–476`) assigns `F_enforce` the **current
  source** — "the conductive path that makes law executable as amperage" — and `I_buffer` the
  **dielectric**, which "stores energy in the ideological field without permitting current to
  reach `E`." These are opposite elements. Anything conducting force toward `O` is not the
  insulator.
- Nodes are roles, not persons (`:423`). Slave patrols were "armed white men **conscripted
  into** `F_enforce`" (`:5359`), under "legal deputization of the entire white male
  population" (`:1794`). The relation between the classes is **transfer**, not containment:
  the same person is `F_enforce` while deputised and `I_buffer` while not.

**v2 coding rule.** Code the role performed in the depicted act, not the person's class:

- Transmits force toward `O` under institutional authority — deputised, conscripted,
  commissioned, employed → **`F_enforce`**, whatever their class origin.
- Receives an allocation and declines to conduct — withholding solidarity, refusing coalition,
  absorbing pressure that would otherwise reach `E` → **`I_buffer`**.

**New field — B6 deputization events.** Record where the specimen depicts buffer-class members
formally moved into `F_enforce`: patrol levies, militia call-ups, citizen informant programmes,
posse laws. This is the transfer mechanism, and v1 had nowhere to put it.

**Recorded as a finding against the manuscript, not a defect of the coders.** The prose
describes `I_buffer` as "recruited to defend the partition" (`:413`) and as "policing the
partition" (`:476`) — active verbs — while the hardware layer assigns it the one element
defined by not conducting. Coders who read the prose hunted for active behaviour; coders who
read the allocation clause hunted for passive. Both read the manuscript correctly, and the
61.3% agreement on `I_buffer` is the measured cost of that inconsistency. Resolving it is a
manuscript edit, not a rubric edit.

### 2.3 Benefit ordering is operationalised (defects 2, 9)

The worst field in v1 at 16.1% agreement, and it carried a headline claim. Replaced by four
explicit pairwise comparisons, each coded `greater` / `lesser` / `equal` / `not commensurable`
/ `n/a — node absent`:

`E vs P_uppet` · `P_uppet vs F_enforce` · `F_enforce vs I_buffer` · `I_buffer vs O`

`holds` is then **derived**, not judged: the gradient holds when every applicable pair codes
`greater` and no pair codes `not commensurable`. Coders never judge the gradient as a whole.

Also required: state the currency being compared — material wealth, security, autonomy, status
— since v1's disagreement traced partly to coders comparing different things.

### 2.4 C1 separates live axis from functioning channel (defect 3)

Two fields replace one:

- **C1a — axis present in the society**: the categories from v1.
- **C1b — axis functions as a dissipation channel**: `yes` / `no` / `indeterminate`. Requires
  depicted evidence that the axis routes coherence away from `E`. Prejudice alone is not
  sufficient.

### 2.5 New field — foreclosed axes (defect 4)

**C4 — axes deliberately prohibited.** Which potential dissipation channels does the specimen
depict being *banned* rather than operated? Star Trek's post-Eugenics prohibition forecloses the
genome axis by standing rule. v1 asked only which channels operate.

### 2.6 New field — boundary-condition alteration (defect 5)

**E5 — response mode of the extracted population.** Beyond reform and kinetic termination, a
third mode appeared in v1 that the instrument could not record: altering the system's physical
boundary conditions rather than contesting its distribution. Codes: `none depicted` /
`reform within the distribution` / `kinetic termination` / **`boundary-condition alteration`** /
`exit`.

This field matters to the manuscript directly. Appendix `app:universality`
(`The_Original_Power.tex:15306`) prescribes exactly this move — changing the conditions so the
system leaves its universality class — and v1 had no way to record specimens that attempt it.

### 2.7 Thresholds for D3 and D4 (defects 6, 7)

- **D3 mode.** DC requires `psi_s` coded `absent` **or** depicted as incidental with no
  maintenance. AC requires both channels depicted as actively maintained. Add `indeterminate`.
  Under v1, 30 of 31 specimens coded AC, which is not a discriminating measurement.
- **D4 wage collapse.** Requires a depicted *event or period* in which the allocation is
  withdrawn or devalued, with a named trigger and a depicted consequence for recipients.
  Deterioration without an identifiable trigger codes `no`.

### 2.8 Section E specifies its target (defect 1)

Coders must **enumerate every termination attempt** the specimen depicts, then code E1–E4
against the one that targets the governing extraction kernel. Where several qualify, code the
latest in the specimen's scope. Where the transition is backstory rather than depicted, code
`E1 = not depicted` and say so. Codex and Antigravity split on Star Trek precisely here — one
coded the post-scarcity transition, the other coded Leyton's coup, and both were defensible.

### 2.9 Output format is fixed (defect 10)

Coders produced four distinct layouts in v1, each needing separate parsing. v2 supplies a
template: one `## Field` heading per field, the code alone on the next line prefixed `Code:`,
evidence on the line after prefixed `Evidence:`. Files that do not parse are re-dispatched
rather than hand-corrected.

## 3. Predictions carried into v2

P1, P2, P5 and P6 were confirmed under v1 on reliable fields and are carried unchanged.
P3 was untestable; it is carried unchanged and will remain untestable unless a buffer-less
specimen appears. P4 and P7 were refuted on unreliable fields; both are carried **unchanged**,
for a fair test rather than a convenient one.

Two predictions are added, both derived from v1 findings and both stated so they can fail:

- **P8 (condition 1 unnecessary).** Specimens coding A1 `absent` with A2 `strong` exhibit a
  full or partial five-node topology. Specimens coding A1 `absent` **and** A2 `absent` do not.
  Falsified by any A1-absent / A2-strong specimen without the topology, or any A1-absent /
  A2-absent specimen carrying it.
- **P9 (deputization scaling).** Where a specimen depicts a rising coherence threat, it depicts
  **formal deputization** of buffer-class members into `F_enforce` — an expansion of the
  enforcement base — rather than an increase in the buffer's wage alone. This is the
  suppression-scaling result of Eq. 1.5 (`Paper/scripts/eq05_kernel_optimization.ipynb`,
  `The_Original_Power.tex:1794`) stated as a structural rather than budgetary claim.
  Falsified by specimens whose threat rises and whose only depicted response is raising
  `psi`, with no movement of buffer-class members into enforcement roles.

## 4. Kill conditions

Carried from v1, with one repaired and one added:

1. **The rubric fits everything.** Specimens coding A1 and A2 both `absent` nonetheless coding
   `full` across five nodes.
2. **Residue swallows the result.** More than one third of specimens carry residue load-bearing
   enough to alter the derived benefit ordering. Now assessable, since the ordering is derived
   from pairwise codes rather than judged.
3. **The amendment did not help.** If inter-rater agreement on the repaired fields —
   benefit ordering, the buffer nodes, E1, E2 — fails to exceed 80% under v2, the defects were
   not the cause and the instrument is measuring coders rather than specimens.

## 5. Provenance

Derived from `fc-01-fictional-corpus-rubric.md` (v1) and the defect log in
`fc-01-RESULTS-v1.md` §6. No specimen was re-read in drafting this amendment.
