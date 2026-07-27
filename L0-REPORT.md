# L0 Graph Construction Report

Model: GPT-5 Codex

## What Was Requested

Materialize the Systemic Arbitrage framework knowledge graph from the structured
equation explorer, empirical-validation registry, variable registry, and market
contract catalog. The deliverable required a deterministic Python builder, a
committed JSON artifact, focused pytest coverage, and an `arbitrage-graph` Make
target. Work remained on `agent/codex-L0`; no files under `Paper/` were modified.

## What Was Built

`systemic_arbitrage.graph_build` constructs and atomically writes
`systemic_arbitrage/data/graph/framework_kg.json`. The artifact contains:

- 558 typed nodes: 239 equations, 146 anchor cases, 146 falsification criteria,
  6 symbols, 5 tier sets, and 16 market contracts.
- 300 typed edges: 145 `calibrates`, 145 `falsifies`, and 10 `maps_to`.
- Provenance on every node, edge, and gap.
- Stable ordering and canonical JSON formatting for reproducible builds.

The empirical registry maps 138 records to explorer equations by exact label.
Seven additional records map by exact normalized TeX statement containment in
combined explorer equations. Contract mappings exist only when a trigger
description contains an exact registered symbol token.

Focused tests cover deterministic output, all required node families, the full
E001--E239 equation set, referential integrity, anchor coverage, explicit orphan
accounting, temporary writes, and committed-artifact freshness.

## Deterministic Gaps

The artifact contains 123 gap records:

1. 121 `orphan_node` records. Each names a node for which the structured inputs
   contain no supported relation.
2. One `relation_source_missing` record for `derives_from`. None of the declared
   structured inputs supplies equation dependency fields.
3. One `unresolved_equation_reference` record for
   `eq:3.5-kinetic-necessary-condition`. Its empirical-validation record has no
   exact label or unique statement-containment match among E001--E239. Its case
   and falsification nodes remain explicit and are listed in the gap.

No inferred dependency, case, or market mapping was added.

## Validation

- `python3 -m systemic_arbitrage.graph_build`: passed; 558 nodes, 300 edges,
  123 gaps.
- `python3 -m pytest systemic_arbitrage/tests/test_graph_build.py -q`: passed.
- `python3 -m pytest systemic_arbitrage/tests/ -q`: 69 tests passed.
- `make arbitrage-graph`: environment bootstrap could not download dependencies
  because network access was unavailable. The target's module command passed
  with the workspace Python, which already provides PyYAML.

## Challenges Encountered

1. Eight empirical registry labels are absent from the explorer. Exact
   normalized statement containment resolved seven without semantic inference.
2. The remaining `eq:3.5` reference has no structured equation target and is
   retained as a declared gap.
3. The contract catalog states exact `O_x` and `P_real` tokens only for the
   interference trigger. Other potential mappings remain unsupported.
4. The declared inputs contain no equation dependency field.
5. The isolated environment could not reach the package index during Make-based
   virtual-environment creation.

## Next Ideas (6 Ideas)

1. Add explicit equation dependency fields to the equation explorer schema.
2. Reconcile `eq:3.5-kinetic-necessary-condition` with the E001--E239 registry.
3. Add explicit `framework_symbols` arrays to each contract trigger.
4. Add stable case identifiers when multiple equations share one empirical case.
5. Validate the JSON artifact against a published JSON Schema.
6. Run artifact freshness checks in continuous integration.
