"""Unit tests for systemic_arbitrage.eval.encoding_bench (L6).

All tests run against the deterministic MockBackend; no model is invoked.
"""

import re

import pytest
import yaml

from systemic_arbitrage.eval.encoding_bench import (
    HEURISTICS,
    MockBackend,
    aggregate,
    build_prompt,
    load_queries,
    parse_answer,
    parse_gold,
    render_markdown_table,
    run_bench,
)
from systemic_arbitrage.prompt_budget import ENCODINGS, FrameworkGraph

FIXTURE = "systemic_arbitrage/tests/fixtures/framework_kg_fixture.json"
QUERIES = "systemic_arbitrage/eval/queries.yaml"


@pytest.fixture(scope="module")
def graph():
    return FrameworkGraph.load(FIXTURE)


@pytest.fixture(scope="module")
def queries():
    return load_queries(QUERIES)


# ---- prompt construction ---------------------------------------------------

@pytest.mark.parametrize("heuristic", HEURISTICS)
def test_build_prompt_contains_context_and_question(heuristic):
    prompt = build_prompt("incident", "Edges: (A, t, B).", "Is A connected to B?", heuristic)
    assert "Edges: (A, t, B)." in prompt
    assert "Is A connected to B?" in prompt


def test_cot_bag_prepends_structure_instruction():
    prompt = build_prompt("incident", "ctx", "q?", "cot_bag")
    assert prompt.startswith("Let's construct a graph with the nodes and edges first.")
    assert "Final answer:" in prompt


def test_zero_shot_cot_appends_step_by_step():
    prompt = build_prompt("incident", "ctx", "q?", "zero_shot_cot")
    assert "Let's think step by step." in prompt
    assert "Final answer:" in prompt


def test_zero_shot_requests_bare_answer():
    prompt = build_prompt("adjacency", "ctx", "q?", "zero_shot")
    assert "Answer with only the final answer." in prompt
    assert "step by step" not in prompt


def test_few_shot_uses_held_out_example_graph_only():
    prompt = build_prompt("incident", "ctx", "q?", "few_shot")
    assert "X1" in prompt and "worked examples" in prompt
    # No fixture identifiers leak into few-shot exemplars.
    assert not re.search(r"\bE\d{3}\b", prompt.split("Graph:\nctx")[0])


def test_build_prompt_rejects_unknown_heuristic():
    with pytest.raises(ValueError):
        build_prompt("incident", "ctx", "q?", "kitchen_sink")


# ---- answer parsing --------------------------------------------------------

@pytest.mark.parametrize(
    "raw,expected",
    [
        ("Yes.", "yes"),
        ("yes", "yes"),
        ("No, the edge does not exist.", "no"),
        ("Reasoning...\nFinal answer: yes", "yes"),
        ("Final Answer: NO", "no"),
        ("maybe", None),
    ],
)
def test_parse_yes_no(raw, expected):
    assert parse_answer(raw, "edge_existence") == expected


@pytest.mark.parametrize(
    "raw,expected",
    [
        ("6", "6"),
        ("The degree is 3.", "3"),
        ("Reasoning\nFinal answer: 12", "12"),
        ("none", None),
    ],
)
def test_parse_degree(raw, expected):
    assert parse_answer(raw, "node_degree") == expected


@pytest.mark.parametrize(
    "raw,expected",
    [
        ("AC_BACON_1676", ["AC_BACON_1676"]),
        (
            "Final answer: AC_PULLMAN_1894, AC_REDLINING_1934",
            ["AC_PULLMAN_1894", "AC_REDLINING_1934"],
        ),
        ("AC_BACON_1676 and AC_BACON_1676", ["AC_BACON_1676"]),
        ("unknown", None),
    ],
)
def test_parse_node_list(raw, expected):
    assert parse_answer(raw, "multi_hop_path") == expected


def test_parse_prefers_final_answer_marker_over_last_line():
    raw = "Final answer: yes\n(but note the caveat about no)"
    assert parse_answer(raw, "cycle_check") == "yes"


def test_parse_gold_normalizes_lists():
    assert parse_gold("E003,E014", "multi_hop_path") == ["E003", "E014"]
    assert parse_gold("yes", "cycle_check") == "yes"
    assert parse_gold("6", "node_degree") == "6"


# ---- runner plumbing (mock backend) ---------------------------------------

def test_run_bench_scores_against_gold(graph, queries):
    backend = MockBackend(["Final answer: yes"])
    subset = [q for q in queries if q["type"] == "edge_existence"]
    results = run_bench(
        graph,
        subset,
        backend,
        hops_settings=(1,),
        encodings=("incident",),
        heuristics=("zero_shot",),
        progress=False,
    )
    assert len(results) == len(subset)
    yes_gold = [r for r in results if r.gold == "yes"]
    no_gold = [r for r in results if r.gold == "no"]
    assert all(r.correct for r in yes_gold)
    assert not any(r.correct for r in no_gold)


def test_run_bench_survives_backend_failure(graph, queries):
    class FlakyBackend:
        def complete(self, prompt):
            raise TimeoutError("model hung")

        def name(self):
            return "flaky"

    results = run_bench(
        graph,
        queries[:2],
        FlakyBackend(),
        hops_settings=(1,),
        encodings=("incident",),
        heuristics=("zero_shot",),
        progress=False,
    )
    assert len(results) == 2
    assert all(r.raw_response == "__BACKEND_ERROR__" for r in results)
    assert all(r.parsed is None and not r.correct for r in results)


def test_aggregate_and_table_shape(graph, queries):
    backend = MockBackend(["Final answer: yes"])
    results = run_bench(
        graph,
        queries[:4],
        backend,
        hops_settings=(1, 2),
        encodings=("incident",),
        heuristics=("zero_shot",),
        progress=False,
    )
    rows = aggregate(results)
    assert len(rows) == 1
    row = rows[0]
    assert row["encoding"] == "incident"
    assert 0.0 <= row["acc_hops1_all"] <= 1.0
    assert "acc_hops2_budget_set" in row
    table = render_markdown_table(rows)
    assert "| encoding | heuristic |" in table


# ---- gold answers stay pinned to the fixture -------------------------------

def _compute_gold(graph, q):
    if q["type"] == "edge_existence":
        m = re.search(r"\((\w+), (\w+), (\w+)\)", q["question"])
        return "yes" if graph.has_edge(m.group(1), m.group(3), m.group(2)) else "no"
    if q["type"] == "node_degree":
        m = re.search(r"nodes is (\w+) directly", q["question"])
        return str(graph.degree(m.group(1)))
    if q["type"] == "connected_nodes":
        m = re.search(r"between (\w+) and (\w+),", q["question"])
        return "yes" if graph.connected(m.group(1), m.group(2)) else "no"
    if q["type"] == "cycle_check":
        m = re.search(r"Is (\w+) part", q["question"])
        return "yes" if graph.on_cycle(m.group(1)) else "no"
    if q["type"] == "multi_hop_path":
        focus = q["focus"]
        mapped = [e.target for e in graph.edges if e.source == focus and e.type == "maps_to"]
        if mapped:  # contract -> mapped equation -> calibrating anchor cases
            eq = mapped[0]
            ans = sorted(
                e.source for e in graph.edges if e.target == eq and e.type == "calibrates"
            )
        else:  # equation -> tier -> sibling equations
            tier = [e.target for e in graph.edges if e.source == focus and e.type == "member_of"]
            assert len(tier) == 1
            ans = sorted(
                e.source
                for e in graph.edges
                if e.target == tier[0] and e.type == "member_of" and e.source != focus
            )
        return ",".join(ans)
    raise AssertionError(f"unhandled query type {q['type']}")


def test_gold_answers_match_fixture(graph, queries):
    assert len(queries) == 24
    for q in queries:
        assert _compute_gold(graph, q) == q["gold"], q["id"]


def test_query_set_covers_required_types(queries):
    types = {q["type"] for q in queries}
    assert types == {
        "edge_existence",
        "node_degree",
        "connected_nodes",
        "cycle_check",
        "multi_hop_path",
    }


def test_all_encodings_and_heuristics_registered():
    assert set(ENCODINGS) == {"adjacency", "incident", "semantic"}
    assert set(HEURISTICS) == {"zero_shot", "few_shot", "zero_shot_cot", "cot_bag"}
