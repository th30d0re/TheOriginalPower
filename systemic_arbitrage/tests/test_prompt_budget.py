"""Unit tests for systemic_arbitrage.prompt_budget (L6)."""

import logging

import pytest

from systemic_arbitrage.prompt_budget import (
    DEFAULT_HOPS,
    MAX_HOPS,
    FrameworkGraph,
    encode_adjacency,
    encode_incident,
    encode_semantic,
    neighbourhood,
    neighbourhood_with_escalation,
)

FIXTURE = "systemic_arbitrage/tests/fixtures/framework_kg_fixture.json"


@pytest.fixture(scope="module")
def graph():
    return FrameworkGraph.load(FIXTURE)


# ---- graph loading and primitives ----------------------------------------

def test_load_rejects_unknown_schema(tmp_path):
    bad = tmp_path / "bad.json"
    bad.write_text('{"schema": "other/9", "nodes": [], "edges": []}')
    with pytest.raises(ValueError, match="schema"):
        FrameworkGraph.load(bad)


def test_load_rejects_dangling_edge(tmp_path):
    bad = tmp_path / "bad.json"
    bad.write_text(
        '{"schema": "framework-kg/1", "nodes": [{"id": "A", "type": "t", "label": "A"}],'
        ' "edges": [{"source": "A", "target": "MISSING", "type": "derives_from"}]}'
    )
    with pytest.raises(ValueError, match="unknown nodes"):
        FrameworkGraph.load(bad)


def test_degree_and_neighbors(graph):
    assert graph.degree("E014") == 6
    assert graph.degree("KX_FED_2026") == 1
    assert graph.neighbors("TIER_1") == {"E003", "E014", "E035"}


def test_has_edge_directionality(graph):
    assert graph.has_edge("E014", "E003", "derives_from")
    assert not graph.has_edge("E003", "E014", "derives_from")
    assert graph.has_edge("E014", "E003")  # untyped


def test_connected_and_cycle(graph):
    assert graph.connected("KX_FED_2026", "AC_HAITI_1804")
    assert not graph.connected("KX_FED_2026", "AXIS_GENDER")
    assert graph.on_cycle("E003")
    assert graph.on_cycle("E035")
    assert not graph.on_cycle("E021")
    assert not graph.on_cycle("AC_BACON_1676")


# ---- neighbourhood extraction and hop budget ------------------------------

def test_default_hops_is_one():
    assert DEFAULT_HOPS == 1


def test_neighbourhood_one_hop(graph):
    hood = neighbourhood(graph, "KX_FED_2026")
    assert hood.hops == 1
    assert hood.node_ids == frozenset({"KX_FED_2026", "E035"})
    assert len(hood.edges) == 1


def test_neighbourhood_two_hop_is_superset(graph):
    one = neighbourhood(graph, "KX_FED_2026", hops=1)
    two = neighbourhood(graph, "KX_FED_2026", hops=2)
    assert one.node_ids < two.node_ids
    assert "AC_HAITI_1804" in two.node_ids
    assert len(two.edges) > len(one.edges)


def test_neighbourhood_rejects_bad_hops(graph):
    with pytest.raises(ValueError):
        neighbourhood(graph, "E014", hops=0)
    with pytest.raises(ValueError, match="MAX_HOPS"):
        neighbourhood(graph, "E014", hops=MAX_HOPS + 1)
    with pytest.raises(KeyError):
        neighbourhood(graph, "NOPE")


def test_escalation_logged_above_default(graph, caplog):
    with caplog.at_level(logging.WARNING, logger="systemic_arbitrage.prompt_budget"):
        neighbourhood(graph, "E014", hops=1)
        assert not [r for r in caplog.records if getattr(r, "event", None) == "hop_escalation"]
        neighbourhood(graph, "E014", hops=2)
    records = [r for r in caplog.records if getattr(r, "event", None) == "hop_escalation"]
    assert len(records) == 1
    assert records[0].node == "E014"
    assert records[0].hops == 2


def test_neighbourhood_with_escalation(graph, caplog):
    # Predicate satisfied at 1 hop: no escalation, no log.
    satisfied = lambda h: "E035" in h.node_ids  # noqa: E731
    with caplog.at_level(logging.WARNING, logger="systemic_arbitrage.prompt_budget"):
        hood = neighbourhood_with_escalation(graph, "KX_FED_2026", satisfied, "test")
        assert hood.hops == 1
        assert not [r for r in caplog.records if getattr(r, "event", None) == "hop_escalation"]

        # Predicate only satisfiable at 2 hops: escalate with a logged reason.
        unsatisfied = lambda h: "AC_HAITI_1804" in h.node_ids  # noqa: E731
        hood = neighbourhood_with_escalation(
            graph, "KX_FED_2026", unsatisfied, "anchor case not in 1-hop context"
        )
        assert hood.hops == 2
        assert "AC_HAITI_1804" in hood.node_ids
    records = [r for r in caplog.records if getattr(r, "event", None) == "hop_escalation"]
    assert len(records) == 1
    assert records[0].reason == "anchor case not in 1-hop context"


# ---- encodings ------------------------------------------------------------

def _ctx(graph, node="E014", hops=1):
    hood = neighbourhood(graph, node, hops=hops)
    return sorted(hood.node_ids), hood.edges


def test_encode_adjacency(graph):
    nodes, edges = _ctx(graph)
    text = encode_adjacency(graph, nodes, edges)
    assert "E014 is connected to:" in text
    assert "E003 (derives_from, outgoing)" in text
    assert "AC_BACON_1676 (calibrates, incoming)" in text
    assert text.startswith("Nodes:")


def test_encode_incident_lists_every_edge(graph):
    nodes, edges = _ctx(graph)
    text = encode_incident(graph, nodes, edges)
    for e in edges:
        assert f"({e.source}, {e.type}, {e.target})" in text


def test_encode_semantic_uses_relational_analogies(graph):
    nodes, edges = _ctx(graph)
    text = encode_semantic(graph, nodes, edges)
    assert "supplies the historical data that calibrates" in text
    assert "mathematically derived from" in text
    # Both endpoint IDs stay present so the analogy maps back to the graph.
    assert "AC_BACON_1676" in text and "E014" in text


def test_encodings_grow_with_hop_budget(graph):
    # The token-volume mechanism behind the hop-budget rule: 2-hop context is
    # strictly larger than 1-hop context in every encoding.
    for encoder in (encode_adjacency, encode_incident, encode_semantic):
        one = encoder(graph, *_ctx(graph, "E035", hops=1))
        two = encoder(graph, *_ctx(graph, "E035", hops=2))
        assert len(two.split()) > len(one.split())
