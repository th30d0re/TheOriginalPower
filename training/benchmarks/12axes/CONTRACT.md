# 12axes benchmark — shared contract

Purpose: have The Original Power's framework "take" the 12 Axes political quiz
(https://12axes.vercel.app, 240-item "extreme" variant), measure how much the quiz's compound
("X and Y") wording distorts the result, and use the book-grounded answer key as a gold standard
for local models (fine-tuned RootLedger MLX models, a local System One `decider`, hosted Jev).

All paths below are relative to `training/benchmarks/12axes/`.

## Fixed inputs (read-only for every loop)

| file | what |
|---|---|
| `questions.tsv` | the 240 items: `id, axis, agree_pole, text`. `agree_pole` is the pole agreement pushes toward (LEFT = the first pole listed in `score.py`'s `AXES`). |
| `score.py` | reproduces the site's scoring. `python3 score.py <key.tsv>` prints per-axis percentages and the results URL. |

## Answer scale (everywhere)

`SA` strongly agree (1.0) · `A` agree (0.75) · `N` neutral / it depends (0.5) · `D` disagree (0.25) · `SD` strongly disagree (0.0)

## Files produced

| file | owner | columns (TSV, header row, UTF-8, no quoting) |
|---|---|---|
| `framework_digest.md` | Codex loop | prose; see Codex brief |
| `atomic.tsv` | Codex loop | `atomic_id, parent_id, axis, agree_pole, text` |
| `keys/gold_forced.tsv` | Codex loop | `id, answer, compound, basis, cite, rationale` |
| `keys/gold_atomic.tsv` | Codex loop | `id, answer, basis, cite, rationale` (ids are `atomic_id`s) |
| `take_quiz.py` | Gemini loop | runner; see Gemini brief |
| `keys/<run_name>.tsv` | written by `take_quiz.py` | `id, answer, p_SA, p_A, p_N, p_D, p_SD, expected, confidence` |

Column rules:
- `compound` is `1` when the item makes two or more separately assessable claims (see the
  definition in the Codex brief), else `0`.
- `basis` is one of `book` (the manuscript states the position), `inferred` (derived from stated
  positions; the rationale names the derivation), `silent` (the manuscript does not address it).
- `cite` is `The_Original_Power.tex:<line>` (semicolon-separated if several), empty when `silent`.
- `atomic_id` is `<parent_id>_a`, `_b`, … . Non-compound items get exactly one atomic row,
  `<parent_id>_a`, with the parent's text unchanged.
- `expected` is Σ p × agreement value (0–1). `confidence` is the model's own confidence where it
  returns one (System One), else max(p).

Every key file must be scoreable: `python3 score.py keys/<file>.tsv` must run for any key over
`questions.tsv` ids. Keys over atomic ids are aggregated to parents by the analysis step
(orchestrator), not by the loops.
