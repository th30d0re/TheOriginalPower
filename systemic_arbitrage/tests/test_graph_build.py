from __future__ import annotations

import json

from systemic_arbitrage import graph_build


def test_build_is_deterministic():
    first = graph_build.build_graph()
    second = graph_build.build_graph()
    assert first == second
    assert json.dumps(first, sort_keys=True) == json.dumps(second, sort_keys=True)


def test_schema_tag_is_the_versioned_contract():
    graph = graph_build.build_graph()
    assert graph["schema"] == "framework-kg/1"
    assert set(graph) == {"schema", "nodes", "edges", "gaps"}


def test_all_registry_equations_are_nodes():
    graph = graph_build.build_graph()
    equation_nodes = [node for node in graph["nodes"] if node["type"] == "equation"]
    assert len(equation_nodes) == 239
    assert {node["id"] for node in equation_nodes} == {
        f"E{number:03d}" for number in range(1, 240)
    }


def test_required_node_families_are_present():
    graph = graph_build.build_graph()
    types = {}
    for node in graph["nodes"]:
        types[node["type"]] = types.get(node["type"], 0) + 1
        assert {"id", "type", "tier", "provenance"} <= node.keys()
    assert types == {
        "anchor_case": 146,
        "equation": 239,
        "falsification_criterion": 146,
        "market_contract": 16,
        "symbol": 6,
        "tier_set": 5,
    }


def test_edges_are_typed_and_reference_existing_nodes():
    graph = graph_build.build_graph()
    node_ids = {node["id"] for node in graph["nodes"]}
    assert graph["edges"]
    for edge in graph["edges"]:
        assert set(edge) == {"source", "target", "type", "tier", "provenance"}
        assert edge["source"] in node_ids
        assert edge["target"] in node_ids
        assert edge["type"] in {"derives_from", "calibrates", "falsifies", "maps_to"}


def test_anchor_cases_are_linked_or_record_the_source_discrepancy():
    graph = graph_build.build_graph()
    case_ids = {node["id"] for node in graph["nodes"] if node["type"] == "anchor_case"}
    linked = {edge["source"] for edge in graph["edges"] if edge["type"] == "calibrates"}
    unresolved = {
        node_id
        for gap in graph["gaps"]
        if gap["kind"] == "unresolved_equation_reference"
        for node_id in gap["node_ids"]
        if node_id.startswith("case:")
    }
    assert case_ids == linked | unresolved
    assert unresolved == {"case:eq:3.5-kinetic-necessary-condition"}


def test_every_orphan_is_explicitly_listed():
    graph = graph_build.build_graph()
    incident = {
        endpoint
        for edge in graph["edges"]
        for endpoint in (edge["source"], edge["target"])
    }
    gap_nodes = {
        node_id
        for gap in graph["gaps"]
        for node_id in gap.get("node_ids", [])
    }
    node_ids = {node["id"] for node in graph["nodes"]}
    assert node_ids - incident <= gap_nodes


def test_write_graph_matches_builder(tmp_path):
    destination = tmp_path / "framework_kg.json"
    expected = graph_build.build_graph()
    assert graph_build.write_graph(destination) == expected
    assert json.loads(destination.read_text(encoding="utf-8")) == expected


def test_committed_artifact_is_current():
    committed = json.loads(graph_build.OUTPUT_PATH.read_text(encoding="utf-8"))
    assert committed == graph_build.build_graph()
