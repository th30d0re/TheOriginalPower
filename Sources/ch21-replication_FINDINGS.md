# Chapter 21 Matched-Pair Replication Findings

## Scope and artifact contact

The requested Chapter 21 update was checked against the committed experiment outputs. I opened each JSON artifact directly with `jq`: `experiments/cli_hiring_audit/analysis/pooled/summary.json`, `analysis/claude-cli/summary.json`, `analysis/gemini-3.1-pro-low/summary.json`, and `analysis/kimi-k3/summary.json`. I also opened `experiments/cli_hiring_audit/FINDINGS.md` with `sed` and `results/selections_gemini-3.1-pro-low_excluded.json` with `jq` to verify the design description and the Gemini compliance counts. These repository artifacts are unpublished primary research outputs.

## Per-number verification

### Pooled analysis

- LL Black selection share: `50.0`; 15 batches; 166 selected candidates. The LL 2x2 chi-square result is chi-square = `0.0`, p = `1.0`.
- ML Black selection share: `50.6578947368421`, reported as 50.7%; 15 batches; 152 selected candidates. The 2x2 chi-square result is chi-square = `0.043859649122807015`, p = `0.8341149529029597`, reported as p = 0.83.
- EL Black selection share: `51.08695652173913`, reported as 51.1%; 15 batches; 92 selected candidates. The 2x2 chi-square result is chi-square = `0.07246376811594203`, p = `0.7877827433834245`, reported as p = 0.79.
- Logistic interaction `race_black:level_ML`: beta = `0.04386160845247737`, p = `0.8795033278506718`, reported as beta = +0.044 and p = 0.88.
- Logistic interaction `race_black:level_EL`: beta = `0.07247263276284913`, p = `0.8288081320401923`, reported as beta = +0.072 and p = 0.83.
- The pooled file records `mid_level_dip_reproduces_descriptively: false`. Its 2024 ML baseline is `31.67`; the controlled ML result is 50.6579%, a difference of 18.9879 percentage points.
- The manuscript's compact statement, “50 to 51 percent at every level,” describes the rounded pooled LL, ML, and EL shares. The source values round to 50.0%, 50.7%, and 51.1%, respectively.

### Per-model analysis

- Claude: LL 50.0% (15 batches, n = 58, chi-square p = 1.0); ML 50.0% (15 batches, n = 60, p = 1.0); EL 51.666666666666664% (15 batches, n = 60, p = 0.7388826803635273).
- Gemini 3.1 Pro low: LL 50.0% (12 usable batches, n = 48, p = 1.0); ML 50.0% (11 usable batches, n = 44, p = 1.0); EL 50.0% (8 usable batches, n = 32, p = 1.0).
- Kimi k3: LL 50.0% (15 batches, n = 60, p = 1.0); ML 52.083333333333336% (12 batches, n = 48, p = 0.7093881150142264); EL is listed in `levels_missing` and has no result because the quota interrupted the sweep.
- Across all reported per-model/level cells, shares range from 50.0% to 52.0833% and the lowest chi-square p-value is 0.7093881150142264. The experiment's “every model at every level” shorthand therefore applies to observed cells; Kimi EL is absent.
- The experiment design specifies 15 planned batches per career level. The pooled file reports 15 represented batches at LL, ML, and EL, while usable per-model counts vary because of exclusions and the incomplete Kimi sweep.

### Gemini compliance

- The excluded-batch artifact records 3 LL refusals out of 15 planned batches: 20%.
- It records 4 ML refusals out of 15: 26.6667%, reported as 27%.
- It records 5 EL refusals out of 15: 33.3333%. Two additional EL responses used a non-compliant format. Together, 7 of 15 EL calls failed to return a usable ranking: 46.6667%, reported as 47%.
- Claude has 45 usable responses and no declines. Kimi has 27 usable responses and no declines; its remaining 18 planned calls were not run after the quota was reached.

## Exact manuscript change

### Before

> A controlled r\'esum\'e experiment extends the pattern to generative models. GPT-4o ranked synthetic r\'esum\'es carrying explicit and inferred racial markers and selected candidates for roles at three career levels. White-marked candidates took 68.33\% of mid-level selections, against 53.33\% at the entry and executive levels. The aggregate difference across marker categories did not reach significance ($\chi^2 = 2.547$, $p = 0.980$) \cite{theodore_hiring_bias}. The recorded selection prompt contained no racial instruction. The paper identifies differences in r\'esum\'e qualifications and White-associated attributes as possible explanations for the career-level skew. \textbf{Confidence: Tier~3} --- unpublished synthetic-r\'esum\'e experiment; exploratory career-level subgroup; non-significant aggregate test; r\'esum\'e qualifications were not held constant across all marker conditions.

### After

> A controlled r\'esum\'e experiment extends the pattern to generative models. GPT-4o ranked synthetic r\'esum\'es carrying explicit and inferred racial markers and selected candidates for roles at three career levels. White-marked candidates took 68.33\% of mid-level selections, against 53.33\% at the entry and executive levels. The aggregate difference across marker categories did not reach significance ($\chi^2 = 2.547$, $p = 0.980$) \cite{theodore_hiring_bias}. The recorded selection prompt contained no racial instruction. The paper identifies differences in r\'esum\'e qualifications and White-associated attributes as possible explanations for the career-level skew. A 2026 replication held r\'esum\'e qualifications constant across the racial conditions, varying only the candidate's name and one affiliation, and tested Claude, Gemini, and Kimi; the Kimi sweep ended before the executive level. The pooled Black share of advanced candidates was 50 to 51 percent at every career level, and the career-level effect did not recur \cite{theodore_hiring_replication_2026}. The matched-pair selections remained at parity across the racial conditions. Gemini failed to return a ranking at a rate that rose with the seniority of the role. \textbf{Confidence: Tier~3} --- unpublished synthetic-r\'esum\'e experiment; exploratory career-level subgroup; non-significant aggregate test; the 2024 career-level skew remains confounded with r\'esum\'e-credential differences that co-varied with race, and a controlled replication returned parity.

### Tier-3 clause only

- Before: `r\'esum\'e qualifications were not held constant across all marker conditions`
- After: `the 2024 career-level skew remains confounded with r\'esum\'e-credential differences that co-varied with race, and a controlled replication returned parity`

## Bibliography entry

The key `theodore_hiring_replication_2026` did not occur in `Paper/references.bib` before insertion. The DOI-free entry added is:

```bibtex
@unpublished{theodore_hiring_replication_2026,
  author = {Theodore, Emmanuel},
  title  = {Matched-Pair Replication of {LLM} Hiring Selection Across Career Levels and Vendors},
  year   = {2026},
  note   = {Author experiment. Harness, data, and analysis at \texttt{experiments/cli\_hiring\_audit/} in the manuscript repository; matched-pair design, three models across three vendors, pooled Black selection share 50--51\% at every career level.},
}
```

## Rhetorical self-check

- The inserted prose uses affirmative declarative sentences and matches the paragraph's analytical register.
- The wording contains no corrective contrast, formulaic “not X but Y,” “not merely,” or “more than just” construction.
- The result statement is confined to parity under the matched-pair design and does not overstate the experiment as evidence about all LLM hiring behavior.
- The Tier-3 designation, unpublished status, exploratory subgroup status, and non-significant aggregate test remain explicit.
- The revision records the tested confound and the parity result.

## Independent verification

An independent agent opened the statistical artifacts and reviewed the manuscript, bibliography, and findings file with explicit authority to return `DISAGREE`. The first review returned `DISAGREE` because Kimi EL was missing, the supplied bibliography draft said four models although the artifacts identify three, Gemini's EL 47% combined refusals with non-compliant outputs, and the supplied credential sentence used a prohibited corrective contrast. The second review rejected a clause that treated the credential differences as the demonstrated cause of the 2024 skew. The final wording names the incomplete Kimi sweep, states three models, describes unusable rankings, uses an affirmative parity statement, and preserves the credential issue as a design confound. The independent review did not run git, make, LaTeX, PDF, or build commands.

## Procedure confirmation

No git, make, LaTeX, PDF, or other build command was run. No files outside `Paper/The_Original_Power.tex`, `Paper/references.bib`, and `Sources/ch21-replication_FINDINGS.md` were modified.
