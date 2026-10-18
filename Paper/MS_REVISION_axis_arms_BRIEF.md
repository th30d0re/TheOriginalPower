# Brief: reverse the material axis; arms as a joint wage (author-directed, 2026-10-18)

**Never run git. Edit only `Paper/The_Original_Power.tex`, `Paper/references.bib`, `Paper/figures/uef_phasor_cycle.tex`,
and any other TikZ/figure source that draws the complex wage. Write a log to `Paper/logs/ms_axis_arms.md`.**
Read `AGENTS.md` first. Its rhetorical rule is hard: direct declarative sentences, with no formulaic antithesis
("not X but Y", "more than just", "X, not Y" as a correction). Grep your new prose for `not `, `rather than`, `merely`,
`instead of`, `isn't` and rewrite every corrective contrast you find.

## 1. Reverse the material axis (all complex-wage diagrams and the prose that describes them)

Current convention (e.g. `fig:complex_wage_phasor`, tex ~L2862): material ψ_m vertical with positive **up**,
psychological ψ_s horizontal with positive right, and θ opening from the material axis toward ψ_s.

New convention:
- Positive ψ_m (material value delivered **down** to the governed tier) points **down**.
- Material extraction (ψ_m < 0) points **up**, toward the Elite, matching the extraction pyramid.
- ψ_s stays horizontal, positive right. θ is measured from the +ψ_m (downward) direction toward +ψ_s.
- On screen, Quadrant II (ψ_m < 0, ψ_s > 0) now sits upper-right: the phasor swings upward past θ = 90°.

The prose must state the justification exactly once, where the convention is introduced. The display is the standard
Argand plane turned a quarter turn clockwise, i.e. screen (x, y) = (ψ_s, −ψ_m), which is multiplication by −j.
A rotation preserves every magnitude, every angle and the plane's orientation, so W = ψ_m + jψ_s and every
cos/sin projection are unchanged.

Update every figure, caption and sentence that says "up", "down", "vertical", "rises", "above the axis" and so on
about the complex wage. Search for the phasor, the complex wage, quadrants, θ, `\psi_m` near axis words, and the UEF phasor cycle.
Do not change any equation's algebra. List every changed location in the log.

## 2. Arms as a joint material + psychological wage

The book currently lists the right to bear arms inside the psychological wage ψ (tex ~L3338, "The Bribe"), while
§"The Physical Guarantee: The Second Amendment as Collateral" (`sec:complicity_investment`, ~L5081) and the
grandfathering passage (~L4163, "a ψ_m payment") treat arms as material. Reconcile them, using the author's position:

a. **Arms are a material wage.** Arms are the only class of property the Bill of Rights guarantees the right to *keep* by
   name. (Do not write "the only constitutionally protected property": the Fifth Amendment protects property generally.)
   The Second Amendment recognizes a pre-existing right and bars the government from infringing it. It protects
   "the people", and "the people" was compiled as white (Dred Scott, already cited at ~L5067). *United States v.
   Cruikshank* (1876) states that the right is not granted by the Constitution, and it left Black disarmament to the
   states. Cite it only if you can add a correct bib entry.
b. **Joint instantiation.** At the 1705 contract the Buffer Class received arms (material) together with the
   deputized authority to police the boundary (status). The arms wage sits in the **first quadrant**, with both
   components positive, and is drawn illustratively near 45°. It is Tier 3 ordinal; state that no historical θ value is
   claimed. Compulsory militia and slave-patrol service is Quadrant II inside one institution: unpaid labor and risk
   (ψ_m < 0) paid in deputized status (ψ_s > 0). Tie this to the patrol-expenditure data in §2.3.2 (eq05).
   Two facts need verification, from Hening's *Statutes at Large* or a source already in `references.bib` /
   `Paper/research/`:
   - (i) Virginia's 1639/1640 act requiring all persons "except negroes" to be provided with arms;
   - (ii) the 1705 servant act's freedom dues for male servants, including "one well fixed musket or fuzee".
   If you cannot verify a fact, leave it out and list it in the log under UNVERIFIED.
c. **"The people" is the linchpin.** Gun control that withstands challenge works by narrowing who counts as
   "the people". The felon-in-possession bar (18 U.S.C. § 922(g)(1), Gun Control Act of 1968), combined with the War
   on Drugs' felony-conviction disparities (the book already treats the "felony disqualification architecture" at
   ~L4119), keeps a quasi-boundary on the Out-group's ability to amass arms.
d. **Present-day dual erosion.**
   - ψ_s erodes: the arms boundary between the Buffer Class and the Out-group is failing. The book already documents
     Black women as the fastest-growing new-owner cohort (~L4165). Parity in arms makes the shared position visible.
   - ψ_m erodes: the bans target rifles such as the AR-15, the arms with anti-state utility, while rifles account for a
     small share of interpersonal homicide. Cite FBI expanded homicide data only if you add a verifiable bib entry;
     otherwise state it without a number and log it.
   - Both components of the 1705 collateral then fall at once. Connect this to the Necessary Condition Theorem and to
     the solidarity implication: the visible shared position is the precondition for cross-class coherence.
e. **Calibration.** Add a short paragraph proposing the kinetic channel as a two-series anchor for calibrating the
   complex wage:
   - a ψ_m series: the Buffer Class's legal access to classes of arms over time;
   - a ψ_s series: the access differential between the Buffer Class and the Out-group (status is relational).
   Say what it calibrates (the enforcement/kinetic channel) and what it does not (land, wages, schooling). Assign a
   confidence tier.

Place (a)–(e) as a new subsection inside the Second Amendment chapter, adjacent to `sec:complicity_investment`, with
a label. Revise L3338's list so that arms appear as a joint wage, with a cross-reference. Keep the author's vocabulary
(Buffer Class, Out-group, ψ_m, ψ_s, kernel, collateral). Use "cannabis", never the other term.

## 3. Checks

- `make pdf-from-tex` builds with no new undefined references or citations (grep the log).
- The log lists every location changed, every new citation, and the UNVERIFIED items.
