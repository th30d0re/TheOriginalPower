# L1 Human Holdout Adjudication

`holdout_l1_unlabelled.jsonl` contains exactly 100 graph triples sampled with
Python's seeded sampler (`seed=42`) after sorting candidates by stable triple
ID. Each line includes the candidate, its source excerpt, and its provenance
file.

For each line, read the `source_text_excerpt` and set `label` to:

- `true` when that source explicitly supports the directed relation as written.
- `false` when support is absent, ambiguous, reversed, or depends on outside
  knowledge.

Leave uncertain items blank for later review. Do not use an LLM to fill these
labels. A second human should review ambiguous cases against the full file in
`provenance`.

Run `make arbitrage-validate` after saving labels. The precision report states
both the completed-label count and the denominator of accepted, labelled
triples. The L1 exit criterion requires all 100 human labels and precision of
at least 0.95. Partial labels can produce an interim precision value; they
cannot satisfy the exit criterion.
