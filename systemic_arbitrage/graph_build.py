"""Build the deterministic Systemic Arbitrage framework knowledge graph.

Emits the versioned ``framework-kg/1`` contract documented in GRAPH.md:
nodes ``{id, type, tier, provenance, ...}`` and edges
``{source, target, type, tier, provenance}``.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import yaml


ROOT = Path(__file__).resolve().parent.parent
EQUATIONS_PATH = ROOT / "equation_explorer/data/equations.json"
REGISTRY_DIR = ROOT / "Paper/empirical_validations"
VARIABLES_PATH = ROOT / "systemic_arbitrage/variables.yaml"
CONTRACTS_PATH = ROOT / "systemic_arbitrage/contract_catalog.yaml"
OUTPUT_PATH = ROOT / "systemic_arbitrage/data/graph/framework_kg.json"

EQUATIONS_PROVENANCE = "equation_explorer/data/equations.json"
REGISTRY_PROVENANCE = "Paper/empirical_validations"
VARIABLES_PROVENANCE = "systemic_arbitrage/variables.yaml"
CONTRACTS_PROVENANCE = "systemic_arbitrage/contract_catalog.yaml"

TIER_SETS = ("E", "P_uppet", "F_enforce", "I_buffer", "O_racialized")


def _load_yaml(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as stream:
        value = yaml.safe_load(stream)
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a YAML mapping")
    return value


def _load_registry(path: Path) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for source in sorted(path.glob("eq_*.md")):
        parts = source.read_text(encoding="utf-8").split("---\n", 2)
        if len(parts) != 3:
            raise ValueError(f"{source} has invalid YAML frontmatter")
        record = yaml.safe_load(parts[1])
        if not isinstance(record, dict):
            raise ValueError(f"{source} frontmatter must be a mapping")
        record["_provenance"] = source.relative_to(ROOT).as_posix()
        records.append(record)
    return records


def _normalise_latex(value: str) -> str:
    """Remove layout-only TeX so subexpressions can be matched exactly."""
    value = re.sub(r"\\begin\{aligned\}|\\end\{aligned\}", "", value)
    value = re.sub(r"\\\\\s*(?:\[[^\]]+\])?", "", value)
    value = value.replace("&", "").replace(r"\,", "")
    return re.sub(r"\s+", "", value).strip()


def _node(node_id: str, node_type: str, tier: Any, provenance: str, **fields: Any) -> dict[str, Any]:
    return {
        "id": node_id,
        "type": node_type,
        "tier": tier,
        "provenance": provenance,
        **fields,
    }


def _edge(
    source: str, edge_type: str, target: str, tier: Any, provenance: str
) -> dict[str, Any]:
    return {
        "source": source,
        "target": target,
        "type": edge_type,
        "tier": tier,
        "provenance": provenance,
    }


def _criterion_id(label: str) -> str:
    return f"criterion:{label}"


def _case_id(label: str) -> str:
    return f"case:{label}"


def _contract_id(trigger: str, slug_pattern: str) -> str:
    return f"contract:{trigger}:{slug_pattern}"


def build_graph() -> dict[str, Any]:
    """Return a graph derived exclusively from the four declared sources."""
    equation_data = json.loads(EQUATIONS_PATH.read_text(encoding="utf-8"))
    equations = equation_data["equations"]
    registry = _load_registry(REGISTRY_DIR)
    variables = _load_yaml(VARIABLES_PATH)
    catalog = _load_yaml(CONTRACTS_PATH)

    nodes: list[dict[str, Any]] = []
    edges: list[dict[str, Any]] = []
    gaps: list[dict[str, Any]] = []
    incident: set[str] = set()

    equation_by_label = {equation["label"]: equation for equation in equations}
    equation_tiers: dict[str, int] = {}
    registry_targets: dict[str, str] = {}

    for record in registry:
        label = record["label"]
        target = equation_by_label.get(label)
        if target is None:
            statement = _normalise_latex(str(record.get("statement", "")))
            containing = [
                equation
                for equation in equations
                if statement and statement in _normalise_latex(equation["latex"])
            ]
            if len(containing) == 1:
                target = containing[0]
        if target is not None:
            registry_targets[label] = target["id"]
            equation_tiers[target["id"]] = min(
                int(record.get("tier", 3)),
                equation_tiers.get(target["id"], 3),
            )

    for equation in equations:
        nodes.append(
            _node(
                equation["id"],
                "equation",
                equation_tiers.get(equation["id"], "unassigned"),
                EQUATIONS_PROVENANCE,
                label=equation["label"],
                chapter=equation["chapter"],
                chapter_index=equation["chapterIndex"],
                section=equation["section"],
                latex=equation["latex"],
            )
        )

    for tier_name in TIER_SETS:
        nodes.append(
            _node(
                f"tier:{tier_name}",
                "tier_set",
                tier_name,
                VARIABLES_PROVENANCE,
                name=tier_name,
            )
        )

    symbols = variables.get("symbols", {})
    for symbol, details in sorted(symbols.items()):
        nodes.append(
            _node(
                f"symbol:{symbol}",
                "symbol",
                details.get("tier", "derived"),
                VARIABLES_PROVENANCE,
                symbol=symbol,
                name=details.get("name"),
                framework_meaning=str(details.get("framework_meaning", "")).strip(),
            )
        )

    for record in registry:
        label = record["label"]
        provenance = record["_provenance"]
        case_id = _case_id(label)
        criterion_id = _criterion_id(label)
        tier = int(record.get("tier", 3))
        nodes.append(
            _node(
                case_id,
                "anchor_case",
                tier,
                provenance,
                equation_label=label,
                existing_case_study=bool(record.get("existing_case_study")),
                target_events=record.get("target_events") or [],
                case_study_line=record.get("case_study_line"),
            )
        )
        nodes.append(
            _node(
                criterion_id,
                "falsification_criterion",
                tier,
                provenance,
                criterion=str(record.get("falsification", "")).strip(),
            )
        )
        target_id = registry_targets.get(label)
        if target_id:
            edges.append(_edge(case_id, "calibrates", target_id, tier, provenance))
            edges.append(_edge(criterion_id, "falsifies", target_id, tier, provenance))
            incident.update((case_id, criterion_id, target_id))
        else:
            gaps.append(
                {
                    "kind": "unresolved_equation_reference",
                    "node_ids": [case_id, criterion_id],
                    "reason": (
                        f"{label} has no exact label or unique statement containment "
                        f"match in {EQUATIONS_PROVENANCE}"
                    ),
                    "provenance": provenance,
                }
            )

    symbol_tokens = {
        symbol: re.compile(rf"(?<![A-Za-z0-9_]){re.escape(symbol)}(?![A-Za-z0-9_])")
        for symbol in symbols
    }
    for trigger, trigger_details in sorted(catalog.get("triggers", {}).items()):
        trigger_text = str(trigger_details.get("description", ""))
        matched_symbols = [
            symbol for symbol, pattern in symbol_tokens.items() if pattern.search(trigger_text)
        ]
        for contract in trigger_details.get("market_archetypes", []):
            contract_id = _contract_id(trigger, contract["slug_pattern"])
            nodes.append(
                _node(
                    contract_id,
                    "market_contract",
                    "operational",
                    CONTRACTS_PROVENANCE,
                    trigger=trigger,
                    **contract,
                )
            )
            for symbol in matched_symbols:
                symbol_id = f"symbol:{symbol}"
                edges.append(
                    _edge(symbol_id, "maps_to", contract_id, "operational", CONTRACTS_PROVENANCE)
                )
                incident.update((symbol_id, contract_id))

    all_ids = {node["id"] for node in nodes}
    covered_by_gap = {
        node_id
        for gap in gaps
        for node_id in gap.get("node_ids", [])
    }
    for node_id in sorted(all_ids - incident - covered_by_gap):
        gaps.append(
            {
                "kind": "orphan_node",
                "node_ids": [node_id],
                "reason": "No supported relation is present in the structured inputs",
                "provenance": next(node["provenance"] for node in nodes if node["id"] == node_id),
            }
        )

    gaps.append(
        {
            "kind": "relation_source_missing",
            "relation": "derives_from",
            "reason": "The declared structured inputs contain no equation dependency field",
            "provenance": EQUATIONS_PROVENANCE,
        }
    )

    nodes.sort(key=lambda item: item["id"])
    edges.sort(key=lambda item: (item["source"], item["type"], item["target"]))
    gaps.sort(
        key=lambda item: (
            item["kind"],
            item.get("relation", ""),
            ",".join(item.get("node_ids", [])),
        )
    )
    return {
        "schema": "framework-kg/1",
        "nodes": nodes,
        "edges": edges,
        "gaps": gaps,
    }


def write_graph(path: Path = OUTPUT_PATH) -> dict[str, Any]:
    """Build and atomically replace the graph artifact."""
    graph = build_graph()
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(
        json.dumps(graph, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    temporary.replace(path)
    return graph


def main() -> None:
    graph = write_graph()
    print(
        f"Wrote {OUTPUT_PATH.relative_to(ROOT)}: "
        f"{len(graph['nodes'])} nodes, {len(graph['edges'])} edges, "
        f"{len(graph['gaps'])} gaps"
    )


if __name__ == "__main__":
    main()
