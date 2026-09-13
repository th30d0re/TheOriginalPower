# `formal/` — machine-checked core of *The Original Power*

A Lean 4 + Mathlib project that encodes the deductive core of the manuscript and
checks it. It exists to catch one specific class of defect: **definitional
incoherence**, where two passages assign incompatible meanings to the same
symbol, and nobody notices because the contradiction is four hundred pages wide.

## What this verifies

That conclusions follow from definitions. Specifically:

| File | Encodes | From |
|---|---|---|
| `Formal/Nodes.lean` | the five tiers and their benefit ordering | Eq. 0.2, `sec:hardware_mapping` |
| `Formal/Circuit.lean` | the node-to-circuit-element mapping, in all five of its readings | `sec:hardware_mapping`, tex 1245 |
| `Formal/Wage.lean` | `W = ψ_m + jψ_s`, imaginary squaring, solidarity, the phase angle | tex 2883, 2918, 2932 |
| `Formal/Intersection.lean` | the quaternion model of intersecting axes | tex 15498, 15510 |

## What this does NOT verify

Read this part before citing the project anywhere.

Lean checks that theorems follow from definitions. It is silent on whether the
definitions describe the world. Nothing in this directory bears on:

- **Whether the electrodynamic homology is apt.** That an extraction hierarchy
  behaves like a power-distribution network is the manuscript's substantive
  claim, and it is empirical. A green build here is not evidence for it.
- **Whether identity axes multiply like quaternion units.** The manuscript
  classifies that theorem as Tier 3, ordinal and structural. This project does
  not raise its tier.
- **Any claim resting on data.** The GDELT figures, the SCOTUS corpus, and the
  spectral results live in `Paper/scripts/` and are validated there.

A green build means the formalism is internally consistent. That is a real
property and a narrow one. Treating it as validation of the thesis would repeat
a mistake this project has made before: trusting a check that measures
something other than what is being claimed.

## Findings

Formalizing surfaced two defects that prose review had not settled.

**1. The five-node circuit mapping is incoherent.** Five passages assign circuit
elements to the five tiers and they disagree. The table contradicts itself
inside a single row: the Enforcement Class is listed as a Current Source while
the role description in the same row calls it the conductive path. A source is
active, a conductor is passive. `Formal/Circuit.lean` proves the disagreement
from the electrical behaviour of the elements rather than from their names.

The repair proposed in
`Architecting_the_operation/notes/MAPPING_contradiction_proposal.md` is **not
applied**. `Circuit.contradiction_still_present` is a deliberate tripwire: when
the repair lands, that theorem stops compiling and this directory has to be
updated to state the repaired mapping.

**2. `k` carries two meanings in the quaternion section.** The component table
assigns `d k` to the cisnormative/sexuality status wage. The Misogynoir theorem
then derives `i * j = k` and reads the result as the Black woman's distinct
plane of extraction. In the quaternions `k` is one basis element, so it cannot
be both. `Intersection.misogynoir_collides_with_sexuality_axis` states the
collision. The manuscript's own bivector section one page later is the repair:
in geometric algebra the product of two basis vectors is a bivector, a different
grade, which never collides with a third axis.

## Building

```bash
make formal
```

First run downloads a Mathlib build cache of roughly 7 GB into `formal/.lake/`,
which is gitignored. Afterwards a full check takes under a minute.

Direct equivalent:

```bash
cd formal && lake exe cache get && lake build
```

## Conventions

Every file opens with a `WHAT THIS FILE CHECKS` / `WHAT IT DOES NOT CHECK`
header naming the tex lines it encodes. Keep that. The headers are what stop a
reader from mistaking scope for significance.

Theorem names track the manuscript's own names where the manuscript has one.
Where this project states something the manuscript does not, the docstring says
so explicitly.
