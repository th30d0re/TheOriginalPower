# Task — literature scouting pass: the mid-level advancement gap

## Scope

Emmanuel's unpublished hiring study (`Sources/grad-precursor-survey.md`,
`Sources/hiring-talk-2024-transcript.md`) found that four GPT models, ranking synthetic
résumés with racial markers, selected White candidates at near-parity for entry-level and
executive-level roles but skewed ~68/32 White at **mid-level**. The aggregate test was not
significant; the pattern is a career-level subgroup observation.

He wants to know what the outside literature says about this specific shape. Two questions:

1. **The mid-level gap as an empirical structure.** Has anyone else documented that racial
   (or gender) under-representation is *worst at the middle rung* of the career ladder —
   as opposed to a smooth decline at every level, or a block only at the very top?
2. **Replications of the experiment.** Has anyone run an LLM / algorithmic hiring-bias
   audit that *disaggregates by seniority level* and found a mid-level effect?

## DO NOT COMMIT. DO NOT EDIT THE MANUSCRIPT.

- No `git`. You write exactly one file: `Sources/mid-level-gap-literature.md`.
- Network is ON for this task. Use it to open real sources.
- Do not touch `Paper/`, `.mcp.json`, `debate/`, or any file other than your output.

## Anti-fabrication rules — `AGENTS.md`, MANDATORY

This is the failure mode the project cares about most.

- **Every citation must be a source you actually opened.** Paste the real title, author
  list, year, venue, and a working URL or DOI from the page you loaded.
- If you cannot open it, or cannot confirm a claim, write "CANNOT CONFIRM" and move on.
  An admitted gap is a success. A fabricated citation is the only unacceptable outcome.
- Do not cite from memory. Do not reconstruct a DOI. Do not infer a finding from a title.
- For every empirical number you report, name the table/figure/page it came from.
- Quote at most one sentence per source, in quotation marks, attributed.

## What to search

Cover both the social-science and the algorithmic-audit literatures. Suggested starting
points (find the primary source, not a news summary):

**Career-pipeline / organizational sociology**
- McKinsey & LeanIn, *Women in the Workplace* (2015–2024) — the "broken rung" finding
  (first promotion to manager). Does any edition break the rung gap out by race?
- McKinsey, *Race in the Workplace: The Black Experience in the US Private Sector* (2021).
- Coqual / Center for Talent Innovation, *Being Black in Corporate America* (2019).
- Catalyst, the "concrete ceiling" for women of colour.
- Rosabelle Moss Kanter, *Men and Women of the Corporation* (1977) — tokenism.
- Ryan & Haslam, the "glass cliff."
- "Sticky floor" vs "glass ceiling" — labour-economics usage; any work locating the
  binding constraint at mid-career.
- Vertical occupational segregation by race; the "frozen middle" in management literature.

**Audit studies of hiring discrimination**
- Bertrand & Mullainathan (2004), "Are Emily and Greg More Employable than Lakisha and
  Jamal?" — did it vary by job level / occupation skill tier?
- Quillian et al. (2017, PNAS) meta-analysis of hiring discrimination over time — any
  breakdown by seniority.
- Any résumé-audit study that varies *seniority* of the advertised role.

**LLM / algorithmic hiring bias**
- The University of Washington 2024 résumé-screening study (Wilson & Caliskan?) that
  Emmanuel's paper cites as `uw_bias_2024`.
- Bloomberg's 2024 GPT résumé-ranking analysis.
- Armstrong, Liu et al., "The Silicone Ceiling" (FAccT 2024) or similar LLM-résumé work.
- Gaebler, Goel et al. on LLM hiring; An, Kim et al.; "large language models portray
  socially subordinate groups"; any 2023–2025 arXiv/FAccT/EMNLP paper on LLM hiring bias.
- Specifically hunt for any that report results **by job seniority / career level**.

## What to produce — `Sources/mid-level-gap-literature.md`

1. **Direct answer to Q1** — is the "worst at the middle" shape an established finding?
   State it plainly: strongly supported / partially / mostly not, and for whom (race vs
   gender may differ). The "broken rung" is well documented for women's *first* step to
   manager; corporate pipeline data for Black employees usually shows a *monotonic* leak,
   not a mid-specific pinch; the near-parity-at-executive part of Emmanuel's result is
   likely a small-sample / tokenism artifact. Confirm or correct each of those with sources.

2. **Direct answer to Q2** — list every LLM/algorithmic hiring-bias study you found that
   disaggregates by seniority, with what it found at each level. If none do, say so.

3. **Annotated source list** — for each: full citation, URL/DOI, one-sentence finding, the
   specific table/page, and how it relates to the mid-level-gap claim (supports / partial /
   contradicts / adjacent).

4. **The tokenised-apex thread** — separately, what the literature says about visible but
   powerless minority representation at the executive level (tokenism, glass cliff,
   "diversity optics"). This is the "token talking head" observation in the transcript.

5. **Bottom line for the manuscript** — one paragraph: which parts of Emmanuel's
   mid-level finding have external support strong enough to cite in Chapter 21, which are
   his synthetic-data artifact, and what an honest framing would be.

6. **Gaps** — what you could not find or could not open. List it.

Keep it under ~400 lines. Mark every uncertain item `[uncertain]`.
