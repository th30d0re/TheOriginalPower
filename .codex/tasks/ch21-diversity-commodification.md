# Task — Ch. 21 addition: reform absorbed at the labor layer

## DO NOT COMMIT. DO NOT BUILD. DO NOT TOUCH GIT.

- No `git`, no `make`, no `latexmk`. The orchestrator runs the build and commit.
- You edit: `Paper/The_Original_Power.tex` and `Paper/references.bib`.
- You create: `Sources/ch21-diversity-commodification_FINDINGS.md`.
- Nothing else. Leave `.mcp.json`, `debate/`, and all other files alone.

## Context

Commit `38cbe36` added a Tier-3 `\paragraph{Generative-model instantiation.}` to Chapter 21
(`\label{ch:algorithmic_epoch}`), section "Porting the Legacy Code", right after the
`\paragraph{Illustrative instantiation.}` that cites COMPAS and Gender Shades. It cites
Emmanuel's unpublished hiring study (`theodore_hiring_bias`): GPT-4o selected White-marked
candidates for 68.33% of mid-level roles vs 53.33% at entry/executive; aggregate χ² null.

A literature pass (`Sources/mid-level-gap-literature.md` — read it in full first) found that
the *specific* mid-level U-shape is unreplicated, but two peer-reviewed studies document the
underlying mechanism — diversity pressure absorbed by routing the disadvantage to a
stratum that is not being counted:

- **Weisshaar, Chavez & Hutt 2024** (*American Sociological Review* 89(3):584–613): 11,190
  software-engineering résumés. The anti-Black-male callback penalty was concentrated in
  early-career applications (15.4% White men vs 10.2% Black men, a 33.5% relative penalty);
  Black–White male differences were **not statistically significant** at the early-to-mid
  and mid-to-mid transitions. They call the mechanism "diversity commodification."
- **Law & Tan** (*Journal of Accounting Research* 64(1):317–355; confirm year — online 2025,
  version of record 2026): firms in protest-affected counties after the 2020 racial-justice
  protests added Black directors while **substituting away from other non-Black minority
  directors** (+0.213 pp Black, −0.485 pp non-Black minority in the main specification), with
  no corresponding change for executives or the general workforce. They call it "diversity
  tokenism."

Framework reading: this is the **Concession Theorem** (Ch. 16, `sec:concession_theorem`)
operating in the labor market — reform pressure is metabolized into visible compliance at
the watched levels while the structure is untouched. A model trained on that labor market
inherits the routing.

## Anti-fabrication — `AGENTS.md`, MANDATORY

Every number you place in the manuscript must be one you confirm against the source. You
already opened both papers for `Sources/mid-level-gap-literature.md`; re-open them if you
need to re-check a figure. The findings file must name, per claim, the artifact and the
table/page. "CANNOT CONFIRM" is acceptable; a fabricated or reconstructed citation is not.
Quote at most one sentence per source, attributed.

## Rhetorical constraint — `AGENTS.md`, enforced

Direct affirmative declaratives. No "not X but Y", no corrective contrast, no manufactured
transition. A factual negation ("the difference was not significant at the senior
transitions") is fine; a rhetorical one ("not removal, but displacement") is not — write it
as a plain statement of what happens.

## Change 1 — new paragraph in Ch. 21

**File:** `Paper/The_Original_Power.tex`. Find `\paragraph{Generative-model instantiation.}`
(added in `38cbe36`, in section "Porting the Legacy Code"). Insert a **new paragraph
immediately after it**, before the paragraph beginning `The mathematical objectivity of the
model then functions as the \textbf{Constitutional Shield}`.

Draft (adjust wording to the chapter's voice; keep it to one paragraph; pick a `\paragraph{}`
label that is affirmative — e.g. `The measured surface.` or `Reform absorbed at the labor
layer.`, not a "not-X" construction):

> \paragraph{The measured surface.}
> The human labor market already routes diversification pressure toward the levels where
> representation is counted. Weisshaar, Chavez, and Hutt sent 11{,}190 software-engineering
> résumés and found the anti-Black callback penalty concentrated in early-career
> applications, with Black--White differences falling to statistical insignificance at the
> senior transitions where firms compete for scarce diverse candidates --- a pattern they
> term ``diversity commodification'' \cite{weisshaar_diversify_2024}. Law and Tan found that
> firms under 2020 racial-justice protest pressure added Black directors while shedding
> other minority directors, with no change reaching executives or the general workforce ---
> ``diversity tokenism'' \cite{law_tan_diversity_tokenism}. The disadvantage moves to a
> stratum that is not being measured; the count at the watched levels improves. This is the
> Concession Theorem (Section~\ref{sec:concession_theorem}) operating through hiring. A
> model trained on that labor market inherits the routing, and the résumé experiment above,
> with its gap displaced to the unwatched middle, is consistent with the same mechanism at a
> sample size too small to confirm it.

Verify the cross-reference: check the actual label of the Concession Theorem section
(`grep -n "Concession Theorem\|sec:concession" Paper/The_Original_Power.tex`) and use the
correct one. If it is a `\label` on a theorem rather than a section, reference that.

## Change 2 — two `references.bib` entries

Match the `@article` style already used in `Paper/references.bib` (check a few nearby
entries for field order and formatting). Confirm every field against the source:

```bibtex
@article{weisshaar_diversify_2024,
  author  = {Weisshaar, Katherine and Chavez, Koji and Hutt, Tania},
  title   = {Hiring Discrimination Under Pressures to Diversify: Gender, Race, and Diversity Commodification across Job Transitions in Software Engineering},
  journal = {American Sociological Review},
  year    = {2024},
  volume  = {89},
  number  = {3},
  pages   = {584--613},
  doi     = {10.1177/00031224241245706},
}

@article{law_tan_diversity_tokenism,
  author  = {Law, Kelvin K. F. and Tan, Jingdan},
  title   = {Diversity Tokenism},
  journal = {Journal of Accounting Research},
  volume  = {64},
  number  = {1},
  pages   = {317--355},
  doi     = {10.1111/1475-679X.70019},
  year    = {2026},
}
```

Resolve the Law & Tan year from the artifact (Wiley VoR vs online-first). If the project's
convention is version-of-record year, use that; note what you chose in the findings file.

Check that neither citation key nor DOI already exists in `references.bib`.

## Findings file — `Sources/ch21-diversity-commodification_FINDINGS.md`

- Per-claim verification table: each number (11,190; the callback rates; the not-significant
  senior result; the +0.213 / −0.485 pp; the no-cascade claim; page/volume/pages for both
  papers), the artifact opened, the table/page it came from, match or not.
- The exact before/after of the manuscript change and the bib additions.
- Which Concession Theorem label you used and why.
- The Law & Tan year decision.
- Rhetorical self-check: quote any sentence you were unsure of; confirm no "not-X-but-Y".
- Confirm you ran no git/make/build.
- Anything unverified, listed plainly.
