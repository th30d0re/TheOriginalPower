# V19: Original Power add-backs for *The Gender Wars*

Rules: no `git`, no network, no installs, do not compile LaTeX (the orchestrator builds the PDF).
Owned files, edit nothing else:
- `ModernMisandry/the gender wars/paper/The_Gender_Wars.tex`
- `ModernMisandry/the gender wars/paper/black_family_section.tex` (only to add one `\label`, see §6)
- `ModernMisandry/the gender wars/paper/ADDBACKS-findings.md` (new; your report)

All paths below are from the repo root `/Users/emmanuel/Documents/Theory/TheOriginalPower`.
`TOP` means `Paper/The_Original_Power.tex`.

## Why

The draft carries the early framework (interference, selective empathy, patriarchy versus payloads, the
Complicity Trap, men as buffer, PHAM). The finished book (*The Original Power*, `\OP{}` in the draft)
matured further. Add back the pieces below. Do not re-import material the draft already has: the
five-tier hierarchy, dual cognitive payloads, flat-map and delegated privilege, `\Delta_{\max}=0`, the
Complicity Trap, PHAM enclosure, the black-family empirical section, phase loading.

## Hard writing rules (AGENTS.md, read it first)

1. **Rhetorical constraint.** Direct, affirmative declarative sentences only. No corrective contrasts or
   formulaic antithesis: nothing of the form "not merely X, but Y", "It is not X; it is Y", "More than just
   X", "rather than X, Y", "not X but Y". State what the thing is. This applies to every new sentence.
   After writing, search your own text for `not merely`, `not just`, `more than just`, `rather than`,
   `but rather`, `is not .* it is`, and rewrite any hit.
2. **Vocabulary.** Use the book's terms exactly: mode, carrier, band, vector, extraction zone, kernel,
   partition, buffer, Out-group, In-group, wage. Do not translate them into standard social-science words
   (no "tiers of oppression", no "intersectionality" as a taxonomy). "Interface" already means the system's
   swappable proxy layer in the book; do not use it for anything else.
3. **Ground every claim in the sources named below.** If a claim is not in the named lines, omit it and
   list it in the findings file under "Omitted". No outside literature, no new statistics, no new
   citations. The draft has no bibliography; cite the book by section title in italics, for example
   (\OP{}, \textit{The Proto-Partition}). Do not use chapter numbers.
4. **Confidence tiers.** The book labels its formal apparatus Tier 3 (ordinal or structural). Mark each
   formal subsection with a one-line "Confidence tier: Tier 3 (structural)" sentence where the book's
   source does.
5. Match the draft's LaTeX style: `\subsection`, `\textit`, `\begin{itemize}`, `\begin{equation}`,
   booktabs tables. Packages available: amsmath, amssymb, booktabs, longtable, enumitem. No new packages.

## Placement

Insert one new section immediately before `\section{Framework II: PHAM and the Amended Contract}`:

```latex
\section{Framework I-b: What \OP{} Establishes About the Gendered Axis}
```

with the seven subsections below, in this order. Add a two-sentence opening paragraph for the section
that says the later sections of the draft rely on these results. Also fix the appendix entry
`\path{Paper/Redefining_Racism.tex}` (near the end of the file) to `\path{Paper/The_Original_Power.tex}`
and note that the gendered axis is the chapter on the proto-partition.

## The seven subsections

**1. The Proto-Partition and the Scope of "Original"** (about 250 words).
Sources: TOP lines 4022-4040 (§The Proto-Partition) and TOP line 4354 (the scope clause).
State the original-template claim: the gendered Out-group was fully operational before race existed, and
the racial partition was reverse-engineered from it. State the scope clause in the book's own terms:
"original" means upstream in the compiled lineage relative to American juridical history. It does not
mean the first patriarchy on Earth. Hierarchy and a sexual division of labor appear across human
societies, West African baselines included. Add the African counter-model in two sentences (Igbo women's
councils, Yoruba Iyalode, Akan matrilineal inheritance, from TOP 4028-4036) as the evidence that the
European legal format of coverture is a regional juridical format.

**2. The Nuclear Family as Extraction-Optimized Unit** (about 250 words).
Source: TOP §The Nuclear Family as Extraction-Optimized Social Unit (starts near line 4328; read to the
next `\section`). Carry the four properties the book lists (collective labor with atomized consumption,
market dependency, catastrophic dyad failure, inter-household competition). Tie them to what the draft
already says about PHAM enclosure and the "corrupted middle", by name, in two sentences.

**3. The Four Primal Wounds** (about 400 words, one table).
Sources: TOP §The Racialized Primal Wound (line 4634 on) and §The Masculine Primal Wound (4695 on) and the
table at TOP 4752-4770. Reproduce the 2x2 as a booktabs table: rows `I_masculine` and `O_gendered`,
columns In-group (racial) and Out-group (racial). Cells: enclosure *as* the contract (white men, response:
divestment from the performance); exclusion *from* the contract plus the demand to perform it (Black men,
response: recognition as prize); enclosure *within* the contract (white women, response: autonomy as
liberation); exclusion *from* the contract (Black women, response: recognition as prize). Then state the
result: four populations, two axes, opposite vectors, and why a single "men versus women" field cannot
carry them. Name the diagonal divide-and-conquer vectors the book names.

**4. Intraracial Contention: Where the Wounds Collide** (about 300 words).
Source: TOP §Intersectional Out-group Contention (starts line 4772; read through 4815). Carry the
structural collision points and the social-reproduction layer in the book's grammar. End with one sentence
pointing forward to the black-family structural comparison section by `\ref` (see §6): the contention
vector is the intimate grammar, the black-family section reports its structural outputs.

**5. The Contemporary Intimate Sphere as Active Execution** (about 200 words, short on purpose).
Source: TOP §The Contemporary Intimate Sphere as Active Execution Environment (starts line 4817). Give the
four findings the book lists in one compact `itemize` and state the mapping discipline (both partners
remain outside the Elite class). Point to Framework II for PHAM; do not reprint PHAM.

**6. The Wage Phase on the Gendered Axis** (about 700 words, with equations).
Source: `ModernMisandry/the gender wars/derivations/dc_to_ac_gendered_axis.md` (read all of it) and the
book lines it cites. This subsection carries a derivation. Follow the derivation file exactly:
- Set up `W = \psi_m + j\psi_s`, `\theta = \operatorname{atan2}(\psi_s,\psi_m)`; DC mode and AC mode as
  the book defines them (TOP 1060-1175).
- State assumptions A1 to A4 as numbered assumptions. Mark A3 (fixed holding requirement `R^*`) as
  the weakest and unsourced.
- Equations G1 to G5 in order, with the monotonicity result `d\theta/d\psi_m = -1/\psi_s`.
- The ledger distinction: provision `T` to a partner is within-axis redistribution and sums to zero;
  only leakage `L` to the Elite is Quadrant II. State this plainly; it keeps the man's grievance and the
  structural claim separate.
- State that the fall in the male material wage is the other face of women regaining their own labor
  (assumption A1: the male `\psi_m` was sourced from it), and that the surviving grievance is that the
  status obligations were not retired when that sourcing closed. Write it as affirmative statements.
- Evidence paragraph: TT-OOS-03 (men's real median weekly earnings +2.6 percent against productivity
  +136.8 percent, women +35.3 percent, 1979 to 2025; labor-market earnings only; composition confound;
  `\psi_s` unmeasured). Do not cite TT-OOS-02 (it ran on synthesized data).
- Scope paragraph: the initial condition `\theta_0 = 0` fits white men; the other three quadrants of
  subsection 3 start elsewhere.
- Do not call `\theta > 90^\circ` "fascism"; write "Quadrant II geometry". Do not assert that the wage
  phase `\theta` equals the axis phase `\phi_k` of the interference engine, and do not describe any control
  as amplitude `A_k` (the controlled parameters are phase, frequency and weight).
- Close with the confidence tier (Tier 3) and the open items from section 8 of the derivation file as a
  short itemize.

**7. Compile History: Coverture to the Present** (about 350 words, light).
Sources: TOP §Coverture (line 4396) and §Persistence of the Economic Algorithm (4406); §Gendered
Disarmament (4041-4100) for global femicide and the 4B reading; §Structural Immunity (4186-4260) in two
sentences; §Ideological Genealogy (4348-4395) in two sentences (Roman penetration hierarchy to Augustine);
the post-1968 phase-load injections if and only if TOP names them (search for `ERA`, `Moral Majority`,
`Anita Bryant`, `Phi_{\text{load}}`). One paragraph each; a single-paragraph compile timeline from
coverture through the ECOA and *Dobbs* if the book states those. Anything the book does not state goes
in "Omitted".

## §6 Labels

Add `\label{sec:black_family}` to the first `\section` of `black_family_section.tex` if it has no label
(check first; reuse an existing label if present), and use it in subsection 4's `\ref`. Add
`\label{sec:wound_map}` to subsection 3 and `\label{sec:wage_phase}` to subsection 6.

## Findings file

`ModernMisandry/the gender wars/paper/ADDBACKS-findings.md` lists, per subsection: source lines used;
anything omitted and why; any sentence where the source and the draft disagree (for example the draft
calls men "Enforcement and Buffer tiers" while the book's table places men in `I_masculine`); and the
results of your search for forbidden constructions.

Verification you can run: none for LaTeX. Check brace balance by reading, and run the search from rule 1.
