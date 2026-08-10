# Brief — Theodore Transform composition: the realization table

## Your deliverable

One file, which you create and own:

    Paper/audit/tt-composition-realization-table.md

Nothing else. Do not edit any `.tex` file. Do not run `git` at all — no add, no
commit. The orchestrator reviews and commits.

## What is already established — do not re-derive any of this

The Theodore Transform `TT_{α→β}` is substitution along a correspondence map
`σ_αβ : V_α → V_β`. Its definition, at `Paper/apx_theodore_transform.tex:38-44`:

> A **structural correspondence** between domains `D_α` and `D_β` is a map
> `σ_αβ : V_α → V_β` assigning each element of the source vocabulary its structural
> analogue in the target vocabulary: the element occupying the same position in the
> extraction topology `(E, P_uppet, F_enforce, I_buffer, O)` and standing in the same
> relations to its neighbors.

`Paper/apx_theodore_transform.tex:279` lists composition as an open problem: whether
`TT_{β→γ} ∘ TT_{α→β} = TT_{α→γ}`.

It has since been shown that composition reduces to a single condition. Because the
definition above makes σ factor through the topology — write `σ_αβ = rel_β ∘ pos_α`,
where `pos_α` reads off a term's topological position and `rel_β` realizes a position
in domain β — composition holds automatically **provided**:

1. `pos_α` is total and single-valued: every vocabulary term sits in exactly one
   topological position, and
2. `rel_β` is total and single-valued: every topological position has exactly one
   realizer in domain β.

If both hold, `pos_β ∘ rel_β = id` and `σ_βγ ∘ σ_αβ = rel_γ ∘ pos_α = σ_αγ`.

**So composition is decided by a finite table.** Your job is to fill it in from the
manuscript and report where it breaks. You are not asked to evaluate the proof.

## The table

Rows — the five positions of the extraction topology:

    E            the Elite
    P_uppet      the Puppet / political interface layer
    F_enforce    the enforcement tier
    I_buffer     the Buffer Class
    O            the Out-group

Columns — the six identity axes. The canonical enumeration is
`Paper/The_Original_Power.tex:6438`: "Race, gender, religion, sexuality, nationality,
and ability each contribute a distinct `f_k`".

    race | gender | religion | sexuality | nationality | ability

That is 30 cells.

## What goes in a cell

For each cell, report **which concrete group, institution, or named quantity the
manuscript identifies as occupying that topological position on that axis**, with a
`file:line` citation for every claim. Then assign exactly one status:

- **UNIQUE** — the manuscript names exactly one realizer. Give it and cite it.
- **EMPTY** — the manuscript names no realizer. Say which files and search terms you
  used before concluding this.
- **OVERLOADED** — the manuscript names two or more *distinct* realizers for the same
  position on the same axis. List all of them with citations. These are the cells
  that break composition, so they are the most valuable thing you can find.

Two realizers that are the same entity under different names are UNIQUE, not
OVERLOADED. Say so explicitly when you make that call, and cite both names.

## The discipline that matters most

**Cite or mark EMPTY. Never invent a realizer.** If the manuscript does not name who
occupies `I_buffer` on the ability axis, the correct answer is EMPTY with a record of
where you looked. A plausible-sounding realizer that you reasoned out yourself, rather
than found in the text, corrupts the entire result — the table is worthless unless
every filled cell is something the manuscript actually says.

A table that comes back mostly EMPTY is a completely acceptable and useful outcome.
So is one that comes back heavily OVERLOADED. Do not shade the result toward looking
complete.

## REVISION 2 — read this before anything above

Revision 1 produced `Paper/audit/tt-composition-realization-table.md`. Its citations were
spot-verified and are sound. **Revise that file in place. Do not start over, and do not
re-verify cells this revision does not touch.**

Revision 1's Finding #1 is correct and it identifies a defect in this brief, not in the
manuscript. Two corrections follow.

### Correction A — fix the domain

A domain is not an axis alone. It is an **axis within one historical instantiation**.
Revision 1 pooled the German, French, Roman, and Portuguese kernels together with the
American one, so every race cell came back OVERLOADED. That is an artifact of this
brief's under-specification.

**Fix the instantiation to the contemporary United States, post-1965** — the domain on
which the manuscript develops all six axes, and the one the spectral decomposition at
`Paper/The_Original_Power.tex:6438` is measured on. A cell is OVERLOADED only when the
manuscript names two or more distinct realizers *for that position, on that axis, within
that instantiation*.

The German, French, Roman, and Portuguese assignments are **different domains**. They are
cross-instantiation transports and they are not overload. Move them to a new section,
`## Cross-instantiation realizers (not overload)`, and keep the citations already
gathered — that material is useful and should not be discarded.

### Correction B — add the source-term check

The composition proof needs two conditions, and Revision 1 measured only the second:

1. `pos_α` single-valued — every population or vocabulary term sits in **exactly one**
   topological position within its domain.
2. `rel_β` single-valued — every topological position has **exactly one** realizer.

Revision 1's Finding #2 is a violation of condition 1 and it is the most valuable result
in the file: women are `$O_{\text{gendered}}$`, while working-class women mobilized by
STOP ERA are placed in `$I_{\text{buffer}}$` (`Paper/chapters_src/15_tweedism_and_the_puppet_class_the_algori.tex:1030`,
verified). The same population term occupies two positions.

Add a section `## Condition 1 violations (source-term multi-position)` listing every case
where one population term is assigned to more than one topological position within the
same axis and instantiation. Search each axis for this specifically. Cite both positions.
State explicitly whether the manuscript anywhere restricts the term to disjoint subsets —
if it does, the violation dissolves and you should say so.

### Verdict format for Revision 2

    Condition 1 (pos single-valued): holds on <axes> | fails on <axes>
    Condition 2 (rel single-valued): UNIQUE n/30, EMPTY n/30, OVERLOADED n/30
    Composition: holds on <axes> | fails on <axes> | undefined on <axes>

Undefined (EMPTY) and failed (OVERLOADED) stay distinct. Do not merge them.

## Where to look

- `Paper/The_Original_Power.tex` — the root manuscript, very large; search it rather
  than reading it start to finish
- `Paper/chapters_src/*.tex` — per-chapter sources, often easier to search
- `Paper/apx_theodore_transform.tex`, `Paper/apx_extraction_chart.tex` — the
  correspondence tables in these two are worked examples of exactly what you are
  cataloguing, and are the best model for what a filled cell looks like
- Ignore `Paper/Redefining_Racism_BACKUP_pre_restructure.tex` and
  `Paper/Redefining_Racism_OpenDyslexic.tex` — superseded copies

Useful symbols: `O_{\text{racialized}}`, `O_{\text{gendered}}`, `O_{\text{queer}}`,
`I_{\text{buffer}}`, `F_{\text{enforce}}`, `P_{\text{uppet}}`. Useful labels:
`ch:gendered`, `ch:enforcement`, `ch:spectral_carrier`, `ch:bacon`, `ch:full_algo`.

## Output format

Start the file with a summary block:

    UNIQUE:     n / 30
    EMPTY:      n / 30
    OVERLOADED: n / 30
    Composition verdict: <holds across all six axes | fails through axes X, Y>

Then the 30 cells, grouped by axis, each with realizer, status, and citations. Then a
short section listing every OVERLOADED cell, since those are the composition failures,
and every EMPTY cell, since those make the transform undefined through that domain.

Close with a **Findings** section: anything that contradicts the brief, any place the
manuscript is ambiguous about who occupies a position, and any case where you had to
make a judgment call. Report disagreements with this brief there rather than acting on
them.
