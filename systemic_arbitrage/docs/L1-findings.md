# L1 Findings — Two-Step Validation

**Status:** implementation complete; production discrimination blocked in the
current execution sandbox. **Validator model:** local Ollama `l6-bench`, built
from `llama3.2:3b` with `temperature 0` and `seed 42`, using L6's existing CLI
subprocess backend.

## Result

The fraction of the 300 real graph edges passing the discriminative pass is
**unmeasured (0/300 adjudicated)**. The Ollama CLI is installed, but the sandbox
denied its connection to the local service at `127.0.0.1:11434`. The validator
reported the missing service and exited with status 2. No model verdicts were
created, and no substitute backend was used.

The most common discriminative failure reasons are therefore **unmeasured**.
The durable quarantine ledger will contain the model's reason and raw response
for every `FALSE` or unparseable adjudication when the real run completes.

The encoding comparison is also **unmeasured**. The primary policy is semantic
proximity plus zero-shot chain-of-thought, selected from L6's benchmark. The
end-to-end run compares it with incident-list plus zero-shot chain-of-thought on
a deterministic 30-edge sample and writes the agreement rate to
`eval/l1_encoding_comparison.json`. Reporting an encoding effect before those
calls complete would manufacture a result.

## Human holdout and precision

`eval/holdout_l1_unlabelled.jsonl` contains exactly 100 unique triples sampled
deterministically with seed 42. Its composition is 52 `calibrates`, 44
`falsifies`, and 4 `maps_to` edges. Every record carries the provenance file and
a source excerpt. All 100 labels are blank.

Current precision is **unavailable over denominator 0**. The report contains
`human_labelled: 0`, `validated_labelled_denominator: 0`, `precision: null`, and
`exit_criterion_pass: false`. L1 has not met its precision exit criterion. Human
instructions are in `eval/HOLDOUT_L1.md`.

## Structural audit of the real graph

The source-level audit found material graph problems before any model call:

1. Seven empirical registry labels resolve to a different equation label by
   LaTeX containment. Three labels (`eq:6.9`, `eq:6.10`, `eq:6.11`) all target
   `E071` (`eq:6.8-capacity-chain-1619`). Four labels (`eq:9.6` through `eq:9.9`)
   all target `E104` (`eq:9.5-school-funding-property-value`). These may be
   intentional sub-equations embedded in one registry equation, but the graph
   erases that distinction. Both the calibration and falsification edges inherit
   the collapse, producing 14 label-mismatched edges.
2. Thirty-four of 145 nodes used as calibration sources declare
   `existing_case_study: false`. The edge type `calibrates` asserts more than the
   source metadata establishes for those records. A populated
   `case_study_line` does not establish that a case study exists; the explicit
   Boolean field controls that claim.
3. The ten `maps_to` edges are generated from symbols appearing in the trigger
   description and copied onto every contract under that trigger. The provenance
   excerpts name the trigger and contracts, but they do not explicitly state
   each symbol-to-contract relation. All ten mappings join only `O_x` and
   `P_real` to the five `interference_spike` contracts. This is a deterministic
   co-occurrence heuristic recorded as a sourced semantic relation.
4. L6's shared semantic template describes `maps_to` as market contract →
   measured quantity. The production graph stores variable → market contract.
   L1 uses a direction-correct semantic sentence locally because changing L6 is
   outside this task's ownership. Downstream consumers that call L6's semantic
   encoder directly receive reversed endpoint roles for these ten edges.

These findings predict a substantial quarantine count under the strict
source-only prompt. The count remains pending the required local model run.

## Verification

- Focused L1 tests: **15 passed**.
- Full `make arbitrage-test`: **166 passed**.
- `make arbitrage-validate`: holdout and denominator report produced, then a
  clear non-zero failure naming inaccessible Ollama model `l6-bench`.
