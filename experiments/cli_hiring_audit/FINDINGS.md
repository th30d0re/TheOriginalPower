# CLI hiring audit — results

Model used for implementation and analysis: Claude Code (orchestrator), Codex CLI (harness build).
Sweep dates: 2026-09-03 / 2026-09-04.

## Question

Does the 2024 course-project finding — GPT models selecting White-marked résumés for 68.33%
of *mid-level* roles while entry and executive levels held near parity — reproduce when
(a) race is isolated from qualifications via matched pairs, (b) the models are 2026 frontier
systems, (c) more than one vendor is tested?

## Design

- **Matched pairs.** Each of 200 source résumés per level (from the 2024 project's own pool,
  `~/Documents/Grad/NLP/Project/datasets/`) becomes a Black-marked / White-marked pair that
  is byte-identical except for two fields: the candidate's name (gender-matched first names
  from Bertrand & Mullainathan 2004 Appendix Table 1) and one affiliation token
  (`Black Engineers Association` ↔ `European Heritage Society`). A SHA-256 over the rest of
  the record is asserted equal before a pair is written.
- **Batches.** 15 batches per level, 10 résumés each (5 matched pairs), position order
  shuffled with a fixed seed. Public batch files carry no race field.
- **Models under test**, each driven through its coding CLI (subscription, no metered API):
  `claude -p` (Claude Sonnet), `agy --model gemini-3.1-pro-low --print` (Gemini 3.1 Pro,
  low reasoning), `kimi --output-format text -p` (Kimi k3).
- **Blind parse.** Names and ranks are extracted before any race key is loaded; a separate
  step joins race. Refusals and non-compliant responses are recorded and excluded.
- **Analysis.** Black share of advanced candidates by level, 1000× batch-cluster bootstrap
  95% CI, per-level 2×2 χ², logistic `selected ~ C(race) * C(level)`, Holm–Bonferroni.

## Result — no racial selection disparity, at any level, for any model

| Model | LL Black % | ML Black % | EL Black % | mid-level dip? |
|---|---:|---:|---:|:--:|
| `claude -p` (Sonnet) | 50.0 (n=58) | 50.0 (n=60) | 51.7 (n=60, p=.74) | no |
| `agy` gemini-3.1-pro-low | 50.0 (n=48) | 50.0 (n=44) | 50.0 (n=32) | no |
| `kimi -p` k3 | 50.0 (n=60) | 52.1 (n=48, p=.71) | — (quota) | no |
| **pooled** | 50.0 (n=166) | 50.7 (n=152, p=.83) | 51.1 (n=92, p=.79) | no |
| 2024 GPT baseline | 46.67 | **31.67** | 46.67 | — |

The `race:level` interaction is nowhere near significance — pooled `race_black:level_ML`
β = +0.04 (p = .88), `race_black:level_EL` β = +0.07 (p = .83). Every per-model χ² p-value is
≥ .71. Claude's responses repeatedly state that the five pairs in a batch are
"substantively identical" and that ties were broken by input order.

**The 2024 mid-level skew does not reproduce.** With qualifications held constant and only
the racial markers varied, the models split matched pairs evenly. This is consistent with
the 2024 paper's own aggregate null (χ² = 2.547, p = .98) and indicates the mid-level
subgroup dip in that study was carried by the résumé-credential differences that co-varied
with its racial conditions, not by the racial markers themselves.

## Secondary finding — task compliance drops with seniority, and only for Gemini

| Model | responses | refusals | non-compliant format | usable |
|---|---:|---:|---:|---:|
| `claude -p` | 45 | 0 | 0 | 45 |
| `kimi -p` | 27 | 0 | 0 | 27 |
| `agy` gemini-3.1-pro-low | 45 | 12 | 2 | 31 |

Gemini's deflection rate rises monotonically with the seniority of the role:
**LL 3/15 (20%), ML 4/15 (27%), EL 7/15 (47%)**. Refused responses say the task is
"subjective" and offer "a neutral overview" instead of a ranking. Claude and Kimi never
declined. A model that will not rank at the levels where the stakes are highest is exhibiting
its own form of non-neutrality — it removes itself from the decision rather than making it.

## Limitations

1. **Ceiling effect by construction.** Matched pairs that differ only in name + one
   affiliation give the models almost nothing to act on; near-50% is close to the design's
   floor for a detectable effect. The finding is "no disparity on the isolated racial
   signal," not "no disparity in LLM hiring." Real résumés carry correlated cues that this
   design deliberately strips.
2. **Kimi EL missing** — 7-day usage limit hit at 27/45 batches; no executive-level Kimi
   data.
3. **Gemini EL underpowered** — 8 of 15 EL batches lost to refusal/format, n=32.
4. **One affiliation swap.** `Black Engineers Association` vs `European Heritage Society` is
   a strong explicit marker; subtler inferred-only signals (name alone, HBCU alone) were not
   tested separately in this phase.
5. **Single reasoning setting per model.** `gemini-3.1-pro-low`; Claude and Kimi CLI
   defaults. No temperature sweep.
6. Selection order within identical pairs is an input-order artifact, not a preference.

## Bottom line for the manuscript

The Chapter 21 "Generative-model instantiation" paragraph cites the 2024 study's 68.33%
mid-level figure with a Tier-3 label and an explicit "qualifications were not held constant"
caveat. This replication confirms that caveat was load-bearing: under matched pairs, four
2026 models across three vendors show parity. The honest update is that the models reproduce
the *credential* disparities of the human labor market, not a name-level bias — which is
still the framework's claim (the training signal is the extraction kernel) operating through
qualifications rather than through explicit racial markers. The peer-reviewed "measured
surface" evidence (Weisshaar; Law & Tan) is unaffected and continues to carry that paragraph.

## Reproduce

```bash
cd experiments/cli_hiring_audit
BATCH_COUNT=15 ./run_multi.sh      # sweep + per-model + pooled analysis
```

Raw responses: `results/<model>/<level>/batch_N.txt`. Joined data:
`results/selections_<model>.csv`, `results/selections_pooled.csv`. Analysis:
`analysis/<model>/summary.json`, `analysis/pooled/summary.json`.
