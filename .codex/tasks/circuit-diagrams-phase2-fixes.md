# Task: five fixes to the phase-2 figures

Follow-on to `.codex/tasks/circuit-diagrams-phase2.md`. All six figures are in the tree
and the build passes at 1150 pages. The crops were inspected here. Four figures are
essentially right; five defects need fixing.

**Do not touch** `fig:social_capacitor`'s framing or `fig:reparations_integral`'s
illustrative labelling. Both handled their risks correctly.

## Defect 1 — `fig:tier_pyramid` undercuts the claim it illustrates (most important)

The source text says the hierarchy is a **3-D pyramid** and that the third dimension
"is operational: it is the geometric condition that makes the system's primary" behaviour
work — the whole point being that a flat 2-D triangle misses structure.

The current figure reads as a 2-D triangle with one grey flank. The tier dividing lines
also behave inconsistently: some cross into the shaded right face, some stop at the
front edge, which makes the solid hard to read.

Redraw so the pyramid reads as a solid: a visible base quadrilateral in perspective,
consistent treatment of the tier planes as they cross the visible faces, and edges that
make the depth unambiguous. The five tiers stay exactly where the text places them —
$E$ at the apex on the $z$-axis, $P_{\text{uppet}}$, $F_{\text{enforce}}$,
$I_{\text{buffer}}$ descending beneath, $O$ enclosed at the base. Invent no new
structure; this is a rendering fix, not a content change.

## Defect 2 — `fig:unified_lorentz` will not survive greyscale printing

The electric term is blue and the magnetic term is grey. In a greyscale print both
become mid-greys and the two vectors stop being distinguishable, which destroys the
decomposition the figure exists to show.

Differentiate by **line style as well as colour**: e.g. solid for the electric term,
dashed for the magnetic cross-product term, and keep the resultant solid black and
visibly heavier. Verify by converting your render to greyscale and looking at it.

Apply the same check to every other figure you touched: any distinction carried by
colour alone is a defect in a printed book.

## Defect 3 — `fig:tt_applications` invariance box has broken math spacing

The invariance condition renders with irregular gaps around the operators: "$c$ holds on
$D_\alpha$ ⟹" then "for every $\beta$ ∈ $S(c)$" with visible extra space either side of
$\implies$ and $\in$. It reads as though the spacing were hand-inserted. Set the
condition as a single display or a properly typeset inline expression so the operator
spacing is uniform.

## Defect 4 — `fig:tt_operator` annotation too light for print

"structural relations preserved" is set in a grey lighter than the 40%-black floor the
phase-1 brief established, and so is its double arrow. Darken both to at least
`black!60`.

## Defect 5 — `fig:social_capacitor` label touches its box

In the lower annotation box, `$P_{\text{spatial}}$` runs into the right edge of the
rounded rectangle. Add padding or widen the box.

## Verification

Same as phase 2, plus the greyscale check:

1. `make pdf-from-tex`, `make check-tex`. Both pass. Report page count.
2. Re-save crops to `/tmp/phase2fix-<label>.png` for the four figures you changed.
3. **Also save a greyscale version** of `fig:unified_lorentz` and `fig:tier_pyramid` to
   `/tmp/phase2fix-<label>-gray.png` and confirm every distinction still reads.
4. For each changed figure state whether any label touches any wire, symbol, axis, box
   edge, or other label. Look at the crop before answering.

## Rules

Unchanged. **No `git` commands** except the recovery-only `git show` for a clobbered
PDF. Change only `Paper/The_Original_Power.tex` and `Paper/apx_theodore_transform.tex`.
Build once at the end. Findings to `/tmp/circuit-diagrams-phase2-fixes.findings.md`.
