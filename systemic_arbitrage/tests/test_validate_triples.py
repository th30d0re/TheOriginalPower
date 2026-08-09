"""Tests for the L1 two-step triple-validation gate."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from systemic_arbitrage.validate_triples import (
    COMPARISON_ENCODING,
    PRIMARY_ENCODING,
    CandidateTriple,
    emit_holdout,
    ensure_deterministic_ollama,
    generate_candidates,
    graph_candidates,
    measure_precision,
    parse_discriminative_response,
    two_step_validate_source,
    update_quarantine,
    validate_candidates,
    write_results,
)


class QueueBackend:
    def __init__(self, responses):
        self.responses = list(responses)
        self.prompts = []

    def complete(self, prompt):
        self.prompts.append(prompt)
        if not self.responses:
            raise AssertionError("unexpected backend call")
        return self.responses.pop(0)

    def name(self):
        return "mock:test-only"


def candidate(index=1, context="Source explicitly supports this relation."):
    return CandidateTriple(
        source=f"source-{index}",
        relation="calibrates",
        target=f"target-{index}",
        tier=3,
        provenance=f"sources/source-{index}.md",
        source_context=context,
    )


def read_jsonl(path):
    return [json.loads(line) for line in path.read_text().splitlines() if line]


def test_two_step_uses_separate_generation_and_discrimination_calls():
    generated = json.dumps(
        {
            "triples": [
                {
                    "source": "case:A",
                    "relation": "calibrates",
                    "target": "E001",
                    "reasoning": "The source names the case and equation.",
                }
            ]
        }
    )
    backend = QueueBackend(
        [generated, "analysis\nVERDICT: TRUE\nREASON: The source states the link."]
    )

    results = two_step_validate_source("case:A calibrates E001", "source.md", backend)

    assert len(backend.prompts) == 2
    assert "Extract relational triples" in backend.prompts[0]
    assert "Based strictly on this source text" in backend.prompts[1]
    assert results[0].passed is True
    assert results[0].generation_reasoning.startswith("The source names")
    assert results[0].reasoning == "The source states the link."
    assert results[0].encoding == PRIMARY_ENCODING
    assert results[0].provenance == "source.md"


def test_generation_accepts_fenced_json_and_rejects_unsupported_relations():
    good = QueueBackend(
        [
            'Reasoning first.\n```json\n{"triples": [{"source":"a", '
            '"relation":"maps_to", "target":"b", "reasoning":"explicit"}]}\n```'
        ]
    )
    rows = generate_candidates("text", "source.yaml", good)
    assert [(row.source, row.relation, row.target) for row in rows] == [
        ("a", "maps_to", "b")
    ]
    with pytest.raises(ValueError, match="unsupported relation"):
        generate_candidates(
            "text",
            "source.yaml",
            QueueBackend(['{"triples":[{"source":"a","relation":"likes","target":"b"}]}']),
        )


@pytest.mark.parametrize(
    ("raw", "verdict", "passed", "reason"),
    [
        ("VERDICT: TRUE\nREASON: explicit", "true", True, "explicit"),
        ("VERDICT: FALSE\nREASON: absent", "false", False, "absent"),
        (
            "I think this is true.",
            "unparseable",
            False,
            "discriminative response lacked exactly one TRUE/FALSE verdict line",
        ),
        (
            "VERDICT: TRUE",
            "unparseable",
            False,
            "discriminative response lacked a reason",
        ),
    ],
)
def test_discriminative_parser_is_fail_closed(raw, verdict, passed, reason):
    assert parse_discriminative_response(raw) == (verdict, passed, reason)


def test_validator_records_selected_encoding_and_raw_reasoning():
    backend = QueueBackend(["steps\nVERDICT: FALSE\nREASON: Relation is not explicit."])
    result = validate_candidates([candidate()], backend, COMPARISON_ENCODING)[0]
    assert result.verdict == "false"
    assert result.passed is False
    assert result.reasoning == "Relation is not explicit."
    assert result.encoding == COMPARISON_ENCODING
    assert result.raw_response.startswith("steps")
    assert "(source-1, calibrates, target-1)" in backend.prompts[0]


def test_quarantine_is_durable_and_idempotent(tmp_path):
    first = validate_candidates(
        [candidate()], QueueBackend(["VERDICT: FALSE\nREASON: unsupported"])
    )[0]
    path = tmp_path / "quarantine.jsonl"
    assert update_quarantine([first], path) == 1
    assert update_quarantine([first], path) == 1

    passed = validate_candidates(
        [candidate()], QueueBackend(["VERDICT: TRUE\nREASON: now supported"])
    )[0]
    assert update_quarantine([passed], path) == 1
    rows = read_jsonl(path)
    assert rows[0]["quarantine_reason"] == "unsupported"
    assert rows[0]["provenance"] == "sources/source-1.md"


def test_holdout_is_exactly_100_seeded_and_preserves_human_labels(tmp_path):
    candidates = [candidate(index) for index in range(150)]
    first_path = tmp_path / "holdout.jsonl"
    second_path = tmp_path / "holdout-copy.jsonl"
    first = emit_holdout(candidates, first_path, seed=42)
    second = emit_holdout(candidates, second_path, seed=42)
    assert len(first) == 100
    assert first == second
    assert all(row["label"] == "" for row in first)
    assert all(row["provenance"] for row in first)
    assert all(row["source_text_excerpt"] for row in first)

    first[0]["label"] = "true"
    first_path.write_text("".join(json.dumps(row) + "\n" for row in first))
    regenerated = emit_holdout(candidates, first_path, seed=42)
    assert regenerated[0]["label"] == "true"


def test_holdout_refuses_too_small_population(tmp_path):
    with pytest.raises(ValueError, match="at least 100"):
        emit_holdout([candidate(index) for index in range(99)], tmp_path / "h.jsonl")


def test_precision_reports_zero_label_denominator_without_pass(tmp_path):
    holdout = tmp_path / "holdout.jsonl"
    results = tmp_path / "results.jsonl"
    report = tmp_path / "precision.json"
    holdout.write_text(
        json.dumps(
            {
                "triple_id": "a",
                "triple": {"source": "s", "relation": "calibrates", "target": "t"},
                "source_text_excerpt": "text",
                "provenance": "source.md",
                "label": "",
            }
        )
        + "\n"
    )
    results.write_text(json.dumps({"triple_id": "a", "passed": True}) + "\n")

    measured = measure_precision(holdout, results, report)

    assert measured["human_labelled"] == 0
    assert measured["validated_labelled_denominator"] == 0
    assert measured["precision"] is None
    assert measured["exit_criterion_pass"] is False


def test_precision_uses_only_accepted_labelled_triples_as_denominator(tmp_path):
    candidates = [candidate(index) for index in range(100)]
    holdout = tmp_path / "holdout.jsonl"
    rows = emit_holdout(candidates, holdout)
    rows[0]["label"] = "true"
    rows[1]["label"] = "false"
    rows[2]["label"] = "true"
    holdout.write_text("".join(json.dumps(row) + "\n" for row in rows))
    results = tmp_path / "results.jsonl"
    results.write_text(
        "".join(
            json.dumps({"triple_id": row["triple_id"], "passed": index < 2}) + "\n"
            for index, row in enumerate(rows)
        )
    )

    measured = measure_precision(holdout, results, tmp_path / "precision.json")

    assert measured["human_labelled"] == 3
    assert measured["validated_labelled_denominator"] == 2
    assert measured["true_positives"] == 1
    assert measured["false_positives"] == 1
    assert measured["precision"] == 0.5
    assert measured["exit_criterion_pass"] is False


def test_real_graph_yields_all_300_candidates_with_readable_provenance():
    root = Path(__file__).resolve().parents[2]
    rows = graph_candidates(root / "systemic_arbitrage/data/graph/framework_kg.json")
    assert len(rows) == 300
    assert {row.relation for row in rows} == {"calibrates", "falsifies", "maps_to"}
    assert all(row.provenance and row.source_context for row in rows)


def test_results_file_carries_provenance(tmp_path):
    result = validate_candidates(
        [candidate()], QueueBackend(["VERDICT: TRUE\nREASON: explicit"])
    )[0]
    path = tmp_path / "results.jsonl"
    write_results([result], path)
    assert read_jsonl(path)[0]["provenance"] == "sources/source-1.md"


def test_production_backend_rejects_unpinned_model_before_invocation():
    with pytest.raises(RuntimeError, match="pinned to Ollama model 'l6-bench'"):
        ensure_deterministic_ollama("another-model")
