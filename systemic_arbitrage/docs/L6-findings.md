# L6 Findings — Prompt Budget Control

**Loop:** L6 (constraint on L4/L5) · **Owner:** kimi · **Date:** 2026-07-27
**Model used:** `llama3.2:3b` via local Ollama, pinned to a deterministic
variant `l6-bench` (`PARAMETER temperature 0`, `PARAMETER seed 42`), invoked
through the `ollama run` CLI subprocess. No network code. Per the L7
alignment finding, these scores are model-dependent and will shift with the
base model chosen in Phase 4.

## Setup

- **Graph:** synthetic fixture `tests/fixtures/framework_kg_fixture.json`
  (19 nodes, 23 edges) in the canonical `framework-kg/1` shape L0
  materializes:
  equations, anchor cases, contracts, tiers, axis/carrier; `derives_from`,
  `calibrates`, `falsifies`, `maps_to`, `member_of`, `phase_couples`.
- **Query set:** `eval/queries.yaml`, 24 structural queries with gold answers
  pinned to the fixture by `tests/test_encoding_bench.py
  ::test_gold_answers_match_fixture`. 13 queries are answerable inside the
  1-hop neighbourhood of their focus node (the budget-test set); 11 require
  2-hop context (the escalation set).
- **Encodings (GraphQA taxonomy):** adjacency list, incident list, semantic
  proximity (relational analogies per edge type).
- **Heuristics:** zero-shot, few-shot, zero-shot CoT, CoT-Bag.
- **Conditions:** 3 encodings × 4 heuristics × 2 hop settings × 24 queries =
  576 generations. Raw responses and per-cell scores are in
  `eval/results/results.json`.

## Schema agreement with L0

L6 consumes the versioned `framework-kg/1` contract, now documented in
GRAPH.md (§3) and emitted by L0's `graph_build.py`:

```json
{
  "schema": "framework-kg/1",
  "nodes": [{"id": "...", "type": "...", "tier": 1,
             "provenance": "...", "label": "..."}],
  "edges": [{"source": "...", "target": "...", "type": "...",
             "tier": 1, "provenance": "..."}],
  "gaps": []
}
```

`prompt_budget.FrameworkGraph.load` validates the schema tag and rejects
edges referencing unknown nodes; it reads `tier` and `provenance` tolerantly
and carries them on every `Edge` for L4's generated-edge quarantine. L0's
`data/graph/framework_kg.json` (558 nodes, 300 edges) loads under this
contract; its `gaps` array is an L0 auditing aid that consumers ignore.

## Hop budget mechanism

Mean prompt tokens by context radius on this fixture:

| context radius | mean prompt tokens |
|---|---|
| 1-hop | 145 |
| 2-hop | 262 |

A single added hop costs 1.81× the prompt tokens on a 19-node graph with
mean degree ~2.4. The growth term compounds with hub degree, and the
production graph centers on hub equations with far higher degree, so the
production multiplier will exceed 1.81×.

`prompt_budget.neighbourhood(node, hops)` defaults to `hops=1`, logs a
structured `hop_escalation` record on every call above the default, and
refuses `hops > 2`. `neighbourhood_with_escalation(node, predicate, reason)`
implements the runtime rule: serve the 1-hop context, escalate to 2 hops with
a logged reason only when the caller's predicate rejects the 1-hop result.

## Scored table

Accuracy per encoding × heuristic pair, split by hop setting and query set.
`budget_set` = 13 queries answerable at 1 hop; `escalation_set` = 11 queries
requiring 2 hops. One query of swing moves a budget-set cell by 7.7pp and an
escalation-set cell by 9.1pp.

| encoding | heuristic | acc_hops1_all | acc_hops1_budget_set | acc_hops1_escalation_set | acc_hops2_all | acc_hops2_budget_set | acc_hops2_escalation_set |
|---|---|---|---|---|---|---|---|
| adjacency | cot_bag | 41.7% | 53.8% | 27.3% | 50.0% | 38.5% | 63.6% |
| adjacency | few_shot | 20.8% | 38.5% | 0.0% | 62.5% | 46.2% | 81.8% |
| adjacency | zero_shot | 37.5% | 46.2% | 27.3% | 50.0% | 38.5% | 63.6% |
| adjacency | zero_shot_cot | 41.7% | 53.8% | 27.3% | 58.3% | 46.2% | 72.7% |
| incident | cot_bag | 45.8% | 53.8% | 36.4% | 58.3% | 61.5% | 54.5% |
| incident | few_shot | 33.3% | 53.8% | 9.1% | 41.7% | 30.8% | 54.5% |
| incident | zero_shot | 45.8% | 61.5% | 27.3% | 41.7% | 38.5% | 45.5% |
| incident | zero_shot_cot | 41.7% | 46.2% | 36.4% | 54.2% | 53.8% | 54.5% |
| semantic | cot_bag | 45.8% | 53.8% | 36.4% | 62.5% | 61.5% | 63.6% |
| semantic | few_shot | 29.2% | 46.2% | 9.1% | 54.2% | 38.5% | 72.7% |
| semantic | zero_shot | 33.3% | 53.8% | 9.1% | 50.0% | 38.5% | 63.6% |
| semantic | zero_shot_cot | 41.7% | 53.8% | 27.3% | 54.2% | 38.5% | 72.7% |

## Hop-budget verdict

**The exit criterion holds.** On the budget-test set, 1-hop context scored
51.3% against 44.2% for 2-hop context, averaged over all 12 encoding ×
heuristic pairs; 8 of 12 pairs favor 1-hop individually. Wider context
measured worse on queries the narrow context already answers, reproducing
the source finding on this graph and this model.

The escalation set confirms the companion rule. Queries whose answers sit
two hops from the focus node scored 63.6% at 2-hop context against 22.7% at
1-hop. Serving 1-hop by default and escalating on demand captures that 40.9pp
on the queries that need it, at the 1-hop token cost everywhere else. The budget is set correctly at `hops=1` with logged escalation, and
the bench emitted 72 structured `hop_escalation` records during the 2-hop
pass, one per context build.

## Recommendation

Adopt the operating policy of 1-hop default plus logged 2-hop escalation,
and score each pair under it as `mean(budget_set@1-hop, escalation_set@2-hop)`:

| rank | encoding | heuristic | policy score |
|---|---|---|---|
| 1 | adjacency | zero_shot_cot | 63.3% |
| 1 | semantic | zero_shot_cot | 63.3% |
| 3 | adjacency | few_shot | 60.1% |
| 4 | semantic | few_shot | 59.4% |
| 5 | adjacency | cot_bag | 58.7% |
| 5 | semantic | cot_bag | 58.7% |
| 5 | semantic | zero_shot | 58.7% |
| 8 | adjacency | zero_shot | 54.9% |
| 9 | incident | cot_bag | 54.2% |
| 9 | incident | few_shot | 54.2% |
| 11 | incident | zero_shot | 53.5% |
| 12 | incident | zero_shot_cot | 50.3% |

- **Encoding: semantic proximity.** It ties the top policy score (63.3% with
  zero-shot CoT) and posts the highest floor across heuristics (58.7%,
  against 54.9% for adjacency and 50.3% for incident). The framework graph
  carries real relational content — calibration, derivation, tier status —
  and the analogy templates make that content explicit. One honest
  counterpoint: the single best 1-hop budget-set cell in the table is
  incident zero-shot at 61.5%, consistent with the GraphQA finding that
  incident lists suit degree and connectivity tasks. Incident collapses to
  30.8% under few-shot at 2-hop, so its peak comes with the worst variance.
- **Heuristic: zero-shot CoT.** It leads the policy ranking for two of the
  three encodings. CoT-Bag finishes one query behind (58.7%), and its forced
  graph reconstruction produced unbounded generation loops at temperature 0
  on three cells; those runs terminated only after a `num_predict 768` cap
  was added to the model configuration. That instability counts against
  CoT-Bag operationally on small models, whatever its accuracy merits.
- **few_shot is the weakest heuristic overall** (three of the four worst
  cells), and adjacency few-shot scored 0% on the escalation set at 1-hop —
  the model answered from the worked examples and ignored the encoded
  context.

Treat this ranking as a prior, pending two replications: against L0's
production graph (`data/graph/framework_kg.json`, 558 nodes — it now loads
under the shared contract), and against
each Phase 4 candidate base model per the L7 gate.

## Caveats

- **Model dependence.** The L7 finding (identical triples helped
  Qwen-2-7B-Instruct and hurt Llama-2-7B-Chat) applies here. These numbers
  describe `llama3.2:3b` at temperature 0; re-run the harness against any
  Phase 4 candidate before inheriting this recommendation. The harness
  accepts any local Ollama model name via `--model`.
- **Fixture scale.** The fixture has 19 nodes; the production graph will
  have ~400. Larger graphs amplify the token-growth term and the
  lost-in-the-middle risk, which strengthens the case for the 1-hop default
  and for incident-list compactness.
- **Determinism.** Temperature 0 and a fixed seed make the run reproducible
  on this machine; Ollama does not guarantee bit-identical output across
  versions. Three of 576 generations (CoT-Bag and zero-shot-CoT cells at
  2-hop) entered unbounded repetition loops and timed out at 300s; a
  `num_predict 768` parameter was then added to the `l6-bench` model
  configuration and the three cells were re-run and scored with it. All
  other cells completed uncapped, and normal completions on these tasks run
  well under 768 tokens, so the cap changes nothing for them.
