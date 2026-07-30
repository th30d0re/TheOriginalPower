"""L6 — Prompt Budget Control.

Graph-to-text encodings (GraphQA taxonomy) and hop-budgeted neighbourhood
extraction for the framework knowledge graph.

Rules enforced here (see GRAPH.md, loop L6):

- Default neighbourhood radius is 1 hop. Expanding to 2 hops grows token
  volume roughly with the square of the branching factor and triggers the
  lost-in-the-middle failure, so every escalation above ``DEFAULT_HOPS`` is
  emitted as a structured log record.
- Encoding is a tested variable. Three encoders are provided, one per
  GraphQA taxonomy entry: adjacency list, incident list, and semantic
  proximity (natural-language relational analogies).

The graph schema consumed here is the versioned ``framework-kg/1`` contract
(documented in GRAPH.md)::

    {
      "schema": "framework-kg/1",
      "nodes": [{"id": str, "type": str, "tier": int | str,
                 "provenance": str, "label": str, ...}],
      "edges": [{"source": str, "target": str, "type": str,
                 "tier": int | str, "provenance": str}],
      "gaps": [...]  # optional, emitted by L0; ignored here
    }

L0's builder (``graph_build.py``) emits this contract to
``data/graph/framework_kg.json``; the L6 measurements behind this module are
in ``docs/L6-findings.md``.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Iterable

logger = logging.getLogger("systemic_arbitrage.prompt_budget")

#: Hard default radius. Callers must pass hops explicitly to go wider,
#: and every value above DEFAULT_HOPS is logged as an escalation.
DEFAULT_HOPS = 1

#: Absolute ceiling. The hop-budget finding covers 1 vs 2 hops; nothing in
#: the source literature supports going wider, so the extractor refuses to.
MAX_HOPS = 2

EDGE_TYPES = (
    "derives_from",
    "calibrates",
    "falsifies",
    "maps_to",
    "member_of",
    "phase_couples",
)


@dataclass(frozen=True)
class Edge:
    source: str
    target: str
    type: str
    #: Evidence tier carried for L4's generated-edge quarantine. Optional on
    #: read so hand-written graphs and the bench's example graph stay valid.
    tier: object = None
    provenance: str = ""


class FrameworkGraph:
    """Typed, directed graph loaded from a ``framework-kg/1`` JSON artifact."""

    def __init__(self, nodes: dict[str, dict], edges: list[Edge]):
        self.nodes = nodes
        self.edges = edges

    @classmethod
    def load(cls, path: str | Path) -> "FrameworkGraph":
        payload = json.loads(Path(path).read_text(encoding="utf-8"))
        if payload.get("schema") != "framework-kg/1":
            raise ValueError(
                f"unsupported graph schema: {payload.get('schema')!r} "
                "(expected 'framework-kg/1')"
            )
        nodes = {n["id"]: n for n in payload["nodes"]}
        edges = [
            Edge(e["source"], e["target"], e["type"], e.get("tier"), e.get("provenance", ""))
            for e in payload["edges"]
        ]
        unknown = {
            endpoint
            for e in edges
            for endpoint in (e.source, e.target)
            if endpoint not in nodes
        }
        if unknown:
            raise ValueError(f"edges reference unknown nodes: {sorted(unknown)}")
        return cls(nodes, edges)

    def label(self, node: str) -> str:
        return self.nodes[node].get("label", node)

    def node_type(self, node: str) -> str:
        return self.nodes[node].get("type", "unknown")

    def neighbors(self, node: str) -> set[str]:
        """Undirected adjacency: every node sharing an edge with ``node``."""
        out: set[str] = set()
        for e in self.edges:
            if e.source == node:
                out.add(e.target)
            elif e.target == node:
                out.add(e.source)
        return out

    def degree(self, node: str) -> int:
        return len(self.neighbors(node))

    def has_edge(self, source: str, target: str, edge_type: str | None = None) -> bool:
        return any(
            e.source == source
            and e.target == target
            and (edge_type is None or e.type == edge_type)
            for e in self.edges
        )

    def induced_edges(self, node_ids: Iterable[str]) -> list[Edge]:
        keep = set(node_ids)
        return [e for e in self.edges if e.source in keep and e.target in keep]

    def connected(self, a: str, b: str) -> bool:
        """True when an undirected path of any length joins ``a`` and ``b``."""
        if a == b:
            return True
        seen, frontier = {a}, {a}
        while frontier:
            nxt: set[str] = set()
            for n in frontier:
                nxt |= self.neighbors(n) - seen
            if b in nxt:
                return True
            seen |= nxt
            frontier = nxt
        return False

    def on_cycle(self, node: str) -> bool:
        """True when ``node`` lies on a directed cycle (DFS from each out-edge)."""
        for first in (e.target for e in self.edges if e.source == node):
            seen, stack = set(), [first]
            while stack:
                cur = stack.pop()
                if cur == node:
                    return True
                if cur in seen:
                    continue
                seen.add(cur)
                stack.extend(e.target for e in self.edges if e.source == cur)
        return False


@dataclass(frozen=True)
class Neighbourhood:
    """Subgraph context handed to an encoder."""

    focus: str
    hops: int
    node_ids: frozenset[str]
    edges: tuple[Edge, ...]


def neighbourhood(
    graph: FrameworkGraph,
    node: str,
    hops: int = DEFAULT_HOPS,
    reason: str = "caller requested hops above the 1-hop default",
) -> Neighbourhood:
    """BFS neighbourhood of ``node`` with a hard default of 1 hop.

    Any ``hops`` above ``DEFAULT_HOPS`` is an escalation and is emitted as a
    structured log record carrying ``reason``. ``hops`` above ``MAX_HOPS`` is
    refused outright.
    """
    if node not in graph.nodes:
        raise KeyError(f"unknown node: {node}")
    if hops < 1:
        raise ValueError("hops must be >= 1")
    if hops > MAX_HOPS:
        raise ValueError(
            f"hops={hops} exceeds MAX_HOPS={MAX_HOPS}; the hop-budget finding "
            "supports 1-hop by default with 2-hop escalation only"
        )
    if hops > DEFAULT_HOPS:
        logger.warning(
            "hop_escalation",
            extra={
                "event": "hop_escalation",
                "node": node,
                "hops": hops,
                "reason": reason,
            },
        )
    seen = {node}
    frontier = {node}
    for _ in range(hops):
        nxt: set[str] = set()
        for n in frontier:
            nxt |= graph.neighbors(n) - seen
        seen |= nxt
        frontier = nxt
    return Neighbourhood(
        focus=node,
        hops=hops,
        node_ids=frozenset(seen),
        edges=tuple(graph.induced_edges(seen)),
    )


def neighbourhood_with_escalation(
    graph: FrameworkGraph,
    node: str,
    satisfied: Callable[[Neighbourhood], bool],
    reason: str,
) -> Neighbourhood:
    """Return the 1-hop neighbourhood, escalating to 2 hops only when
    ``satisfied`` rejects the 1-hop result. Every escalation is logged with
    the caller-supplied ``reason``.
    """
    hood = neighbourhood(graph, node, hops=DEFAULT_HOPS)
    if satisfied(hood):
        return hood
    # The escalation log record is emitted by neighbourhood() itself, with
    # the caller's reason attached.
    return neighbourhood(graph, node, hops=DEFAULT_HOPS + 1, reason=reason)


# --------------------------------------------------------------------------
# Graph-to-text encodings (GraphQA taxonomy)
# --------------------------------------------------------------------------

def _roster(graph: FrameworkGraph, node_ids: Iterable[str]) -> str:
    parts = [
        f"{n} ({graph.node_type(n)}: {graph.label(n)})" for n in sorted(node_ids)
    ]
    return "Nodes: " + "; ".join(parts) + "."


def encode_adjacency(
    graph: FrameworkGraph, node_ids: Iterable[str], edges: Iterable[Edge]
) -> str:
    """Adjacency list encoding: one line per node listing its connections.

    Example: ``E014 is connected to: E003 (derives_from, outgoing); ...``
    """
    node_ids = sorted(node_ids)
    edges = list(edges)
    lines = [_roster(graph, node_ids)]
    for n in node_ids:
        rels = []
        for e in edges:
            if e.source == n:
                rels.append(f"{e.target} ({e.type}, outgoing)")
            elif e.target == n:
                rels.append(f"{e.source} ({e.type}, incoming)")
        if rels:
            lines.append(f"{n} is connected to: " + "; ".join(sorted(rels)) + ".")
        else:
            lines.append(f"{n} has no connections in this context.")
    return "\n".join(lines)


def encode_incident(
    graph: FrameworkGraph, node_ids: Iterable[str], edges: Iterable[Edge]
) -> str:
    """Incident list encoding: the graph as an explicit list of edges.

    Example: ``(E014, derives_from, E003); (E021, derives_from, E014); ...``
    """
    node_ids = sorted(node_ids)
    triples = "; ".join(
        f"({e.source}, {e.type}, {e.target})"
        for e in sorted(edges, key=lambda e: (e.source, e.type, e.target))
    )
    return _roster(graph, node_ids) + "\nEdges: " + (triples or "none") + "."


#: Semantic-proximity templates: one natural-language relational analogy per
#: edge type, following the GraphQA co-authorship/friendship rephrasing
#: finding. Each template names both endpoint IDs so the mapping back to the
#: abstract graph stays unambiguous.
_SEMANTIC_TEMPLATES: dict[str, Callable[[FrameworkGraph, Edge], str]] = {
    "derives_from": lambda g, e: (
        f"{e.source} ({g.label(e.source)}) is mathematically derived from "
        f"{e.target} ({g.label(e.target)}), the way a corollary descends from a theorem."
    ),
    "calibrates": lambda g, e: (
        f"The anchor case {e.source} ({g.label(e.source)}) supplies the historical "
        f"data that calibrates {e.target} ({g.label(e.target)}), the way a "
        f"reference weight calibrates a scale."
    ),
    "falsifies": lambda g, e: (
        f"The anchor case {e.source} ({g.label(e.source)}) records evidence that "
        f"falsifies {e.target} ({g.label(e.target)}), the way a failed replicate "
        f"voids an experiment."
    ),
    "maps_to": lambda g, e: (
        f"The market contract {e.source} ({g.label(e.source)}) tracks the quantity "
        f"measured by {e.target} ({g.label(e.target)}), the way a thermometer "
        f"reading tracks temperature."
    ),
    "member_of": lambda g, e: (
        f"{e.source} ({g.label(e.source)}) holds {e.target} evidence status, the "
        f"way a source holds a credibility rating."
    ),
    "phase_couples": lambda g, e: (
        f"{e.source} ({g.label(e.source)}) is phase-coupled to {e.target} "
        f"({g.label(e.target)}), the way two oscillators lock frequency."
    ),
}


def encode_semantic(
    graph: FrameworkGraph, node_ids: Iterable[str], edges: Iterable[Edge]
) -> str:
    """Semantic proximity encoding: each edge rendered as a natural-language
    relational analogy."""
    lines = [_roster(graph, sorted(node_ids))]
    for e in sorted(edges, key=lambda e: (e.source, e.type, e.target)):
        template = _SEMANTIC_TEMPLATES.get(e.type)
        if template is None:
            lines.append(f"{e.source} is related to {e.target} by {e.type}.")
        else:
            lines.append(template(graph, e))
    return "\n".join(lines)


ENCODINGS: dict[str, Callable[[FrameworkGraph, Iterable[str], Iterable[Edge]], str]] = {
    "adjacency": encode_adjacency,
    "incident": encode_incident,
    "semantic": encode_semantic,
}
