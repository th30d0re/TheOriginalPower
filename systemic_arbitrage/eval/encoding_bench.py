"""L6 — encoding x prompt-heuristic benchmark harness.

Scores every (graph-to-text encoding x prompt heuristic) pair on the fixed
query set in ``queries.yaml``, at both 1-hop and 2-hop neighbourhood
context, so the hop budget can be set on measurement rather than on faith.

Encodings (GraphQA taxonomy, see ``systemic_arbitrage/prompt_budget.py``):
adjacency list, incident list, semantic proximity.

Heuristics: zero-shot, few-shot, zero-shot CoT ("let's think step by step"),
CoT-Bag ("let's construct a graph with the nodes and edges first").

Model backends are pluggable. The default is a local Ollama model driven
through its CLI subprocess — no network code. A deterministic mock backend
exists for tests.

Usage:

    python -m systemic_arbitrage.eval.encoding_bench \
        --graph systemic_arbitrage/tests/fixtures/framework_kg_fixture.json \
        --queries systemic_arbitrage/eval/queries.yaml \
        --backend ollama --model l6-bench \
        --out systemic_arbitrage/eval/results
"""

from __future__ import annotations

import argparse
import json
import logging
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

import yaml

from systemic_arbitrage.prompt_budget import (
    ENCODINGS,
    Edge,
    FrameworkGraph,
    neighbourhood,
)

logger = logging.getLogger("systemic_arbitrage.eval.encoding_bench")

HEURISTICS = ("zero_shot", "few_shot", "zero_shot_cot", "cot_bag")

NODE_ID_RE = re.compile(
    r"\b(?:E\d{3}|AC_[A-Z0-9_]+|KX_[A-Z0-9_]+|TIER_\d|AXIS_[A-Z]+|CARRIER_[A-Z]+)\b"
)

#: Tiny held-out example graph used only for few-shot prompts, so few-shot
#: exemplars never leak fixture content.
_EXAMPLE_GRAPH = FrameworkGraph(
    nodes={
        "X1": {"id": "X1", "type": "equation", "label": "Example Alpha"},
        "X2": {"id": "X2", "type": "equation", "label": "Example Beta"},
        "X3": {"id": "X3", "type": "anchor_case", "label": "Example Case (1900)"},
    },
    edges=[
        Edge("X3", "X1", "calibrates"),
        Edge("X1", "X2", "derives_from"),
    ],
)
_EXAMPLE_NODES = ["X1", "X2", "X3"]


# --------------------------------------------------------------------------
# Model backends
# --------------------------------------------------------------------------

class OllamaBackend:
    """Local Ollama model via CLI subprocess. Deterministic variants can be
    pinned with ``ollama create`` (temperature 0, fixed seed); the bench was
    run against such a variant (``l6-bench``, FROM llama3.2:3b)."""

    def __init__(self, model: str, timeout: int = 300):
        self.model = model
        self.timeout = timeout

    def complete(self, prompt: str) -> str:
        proc = subprocess.run(
            ["ollama", "run", self.model, prompt],
            capture_output=True,
            text=True,
            timeout=self.timeout,
        )
        if proc.returncode != 0:
            raise RuntimeError(f"ollama run failed: {proc.stderr.strip()[:500]}")
        return proc.stdout.strip()

    def name(self) -> str:
        return f"ollama:{self.model}"


class MockBackend:
    """Deterministic backend for tests. Cycles through queued responses."""

    def __init__(self, responses: list[str]):
        self._responses = list(responses)
        self._i = 0

    def complete(self, prompt: str) -> str:
        out = self._responses[self._i % len(self._responses)]
        self._i += 1
        return out

    def name(self) -> str:
        return "mock"


# --------------------------------------------------------------------------
# Prompt construction
# --------------------------------------------------------------------------

_INSTRUCTION = (
    "You are given a textual encoding of a directed, typed graph, followed by "
    "a structural question about that graph. Base your answer strictly on the "
    "encoded graph."
)

_FEWSHOT_QA = [
    (
        "Does the edge (X3, calibrates, X1) exist in the graph?",
        "yes",
    ),
    (
        "How many distinct nodes is X1 directly connected to, ignoring edge direction?",
        "2",
    ),
]


def build_prompt(
    encoding_name: str, context: str, question: str, heuristic: str
) -> str:
    """Assemble the full prompt for one (encoding, heuristic, query) cell."""
    if heuristic not in HEURISTICS:
        raise ValueError(f"unknown heuristic: {heuristic}")

    blocks: list[str] = []
    if heuristic == "cot_bag":
        # CoT-Bag: the structure-building instruction is prepended so the
        # model instantiates the topology before reasoning over it.
        blocks.append("Let's construct a graph with the nodes and edges first.")
    blocks.append(_INSTRUCTION)

    if heuristic == "few_shot":
        example_ctx = ENCODINGS[encoding_name](
            _EXAMPLE_GRAPH, _EXAMPLE_NODES, _EXAMPLE_GRAPH.edges
        )
        blocks.append("Here are two worked examples on a separate example graph.")
        for q, a in _FEWSHOT_QA:
            blocks.append(f"Graph:\n{example_ctx}\nQuestion: {q}\nAnswer: {a}")

    blocks.append(f"Graph:\n{context}")
    blocks.append(f"Question: {question}")

    if heuristic in ("zero_shot_cot", "cot_bag"):
        blocks.append("Let's think step by step.")
        blocks.append(
            "After your reasoning, give the final answer on the last line, "
            "prefixed with 'Final answer:'."
        )
    else:
        blocks.append("Answer with only the final answer.")
    return "\n\n".join(blocks)


# --------------------------------------------------------------------------
# Answer parsing and scoring
# --------------------------------------------------------------------------

def _candidate_text(raw: str) -> str:
    """Prefer the text after a 'Final answer:' marker; otherwise the last
    non-empty line."""
    lines = [ln for ln in raw.splitlines() if ln.strip()]
    if not lines:
        return ""
    for ln in reversed(lines):
        m = re.search(r"final answer\s*:\s*(.*)$", ln, flags=re.IGNORECASE)
        if m:
            return m.group(1).strip()
    return lines[-1].strip()


def parse_answer(raw: str, query_type: str):
    text = _candidate_text(raw)
    if query_type in ("edge_existence", "connected_nodes", "cycle_check"):
        m = re.search(r"\b(yes|no)\b", text, flags=re.IGNORECASE)
        return m.group(1).lower() if m else None
    if query_type == "node_degree":
        m = re.search(r"-?\d+", text)
        return m.group(0) if m else None
    if query_type == "multi_hop_path":
        return sorted(set(NODE_ID_RE.findall(text))) or None
    raise ValueError(f"unknown query type: {query_type}")


def parse_gold(gold: str, query_type: str):
    if query_type in ("edge_existence", "connected_nodes", "cycle_check"):
        return gold.strip().lower()
    if query_type == "node_degree":
        return gold.strip()
    if query_type == "multi_hop_path":
        return sorted(gold.split(","))
    raise ValueError(f"unknown query type: {query_type}")


# --------------------------------------------------------------------------
# Benchmark runner
# --------------------------------------------------------------------------

@dataclass
class CellResult:
    query_id: str
    query_type: str
    hops_required: int
    encoding: str
    heuristic: str
    hops: int
    prompt_tokens: int
    raw_response: str
    parsed: object
    gold: object
    correct: bool


class _EscalationCounter(logging.Handler):
    """Captures hop_escalation records emitted by prompt_budget."""

    def __init__(self):
        super().__init__()
        self.count = 0

    def emit(self, record: logging.LogRecord) -> None:
        if getattr(record, "event", None) == "hop_escalation":
            self.count += 1


def run_bench(
    graph: FrameworkGraph,
    queries: list[dict],
    backend,
    hops_settings: tuple[int, ...] = (1, 2),
    encodings: tuple[str, ...] = tuple(ENCODINGS),
    heuristics: tuple[str, ...] = HEURISTICS,
    progress: bool = True,
) -> list[CellResult]:
    pb_logger = logging.getLogger("systemic_arbitrage.prompt_budget")
    counter = _EscalationCounter()
    pb_logger.addHandler(counter)
    results: list[CellResult] = []
    try:
        total = len(hops_settings) * len(encodings) * len(heuristics) * len(queries)
        done = 0
        for hops in hops_settings:
            counter.count = 0
            for enc_name in encodings:
                encoder = ENCODINGS[enc_name]
                # Context depends only on (query, hops), so encode once per
                # query per encoding and reuse across heuristics.
                contexts = {}
                for q in queries:
                    hood = neighbourhood(graph, q["focus"], hops=hops)
                    contexts[q["id"]] = encoder(graph, sorted(hood.node_ids), hood.edges)
                for heuristic in heuristics:
                    for q in queries:
                        prompt = build_prompt(
                            enc_name, contexts[q["id"]], q["question"], heuristic
                        )
                        raw, parsed = None, None
                        for attempt in (1, 2):
                            try:
                                raw = backend.complete(prompt)
                                parsed = parse_answer(raw, q["type"])
                                break
                            except Exception as exc:
                                logger.warning(
                                    "backend call failed (query=%s attempt=%d): %s",
                                    q["id"],
                                    attempt,
                                    exc,
                                )
                        if raw is None:
                            raw = "__BACKEND_ERROR__"
                        gold = parse_gold(q["gold"], q["type"])
                        results.append(
                            CellResult(
                                query_id=q["id"],
                                query_type=q["type"],
                                hops_required=q["hops_required"],
                                encoding=enc_name,
                                heuristic=heuristic,
                                hops=hops,
                                prompt_tokens=len(prompt.split()),
                                raw_response=raw,
                                parsed=parsed,
                                gold=gold,
                                correct=parsed == gold,
                            )
                        )
                        done += 1
                        if progress and done % 24 == 0:
                            print(f"  progress: {done}/{total}", file=sys.stderr)
            logger.info(
                "hops=%d complete; hop_escalation records emitted: %d",
                hops,
                counter.count,
            )
    finally:
        pb_logger.removeHandler(counter)
    return results


# --------------------------------------------------------------------------
# Aggregation and reporting
# --------------------------------------------------------------------------

def _accuracy(rows: list[CellResult]) -> float | None:
    if not rows:
        return None
    return sum(r.correct for r in rows) / len(rows)


def aggregate(results: list[CellResult]) -> list[dict]:
    """One row per (encoding, heuristic) with accuracy split by hop setting
    and by query set (budget-test = hops_required 1, escalation = 2)."""
    rows = []
    pairs = sorted({(r.encoding, r.heuristic) for r in results})
    for enc, heur in pairs:
        mine = [r for r in results if r.encoding == enc and r.heuristic == heur]
        row = {"encoding": enc, "heuristic": heur}
        for hops in sorted({r.hops for r in results}):
            at_hops = [r for r in mine if r.hops == hops]
            row[f"acc_hops{hops}_all"] = _accuracy(at_hops)
            row[f"acc_hops{hops}_budget_set"] = _accuracy(
                [r for r in at_hops if r.hops_required == 1]
            )
            row[f"acc_hops{hops}_escalation_set"] = _accuracy(
                [r for r in at_hops if r.hops_required == 2]
            )
        rows.append(row)
    return rows


def token_summary(results: list[CellResult]) -> dict[int, float]:
    out: dict[int, list[int]] = {}
    for r in results:
        out.setdefault(r.hops, []).append(r.prompt_tokens)
    return {h: sum(v) / len(v) for h, v in sorted(out.items())}


def render_markdown_table(rows: list[dict]) -> str:
    cols = ["encoding", "heuristic"]
    metric_cols = [c for c in rows[0] if c not in cols] if rows else []
    header = "| " + " | ".join(cols + metric_cols) + " |"
    sep = "|" + "---|" * (len(cols) + len(metric_cols))
    lines = [header, sep]
    for row in rows:
        cells = [row[c] for c in cols]
        for c in metric_cols:
            v = row[c]
            cells.append("—" if v is None else f"{v * 100:.1f}%")
        lines.append("| " + " | ".join(cells) + " |")
    return "\n".join(lines)


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------

def load_queries(path: str | Path) -> list[dict]:
    payload = yaml.safe_load(Path(path).read_text(encoding="utf-8"))
    return payload["queries"]


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--graph", required=True, help="framework-kg/1 JSON path")
    ap.add_argument("--queries", required=True, help="queries.yaml path")
    ap.add_argument("--backend", choices=["ollama", "mock"], default="ollama")
    ap.add_argument("--model", default="l6-bench", help="ollama model name")
    ap.add_argument("--hops", type=int, nargs="+", default=[1, 2])
    ap.add_argument("--encodings", nargs="+", default=list(ENCODINGS))
    ap.add_argument("--heuristics", nargs="+", default=list(HEURISTICS))
    ap.add_argument("--limit", type=int, default=None, help="first N queries only")
    ap.add_argument("--out", default=None, help="output directory for results")
    args = ap.parse_args(argv)

    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")

    graph = FrameworkGraph.load(args.graph)
    queries = load_queries(args.queries)
    if args.limit:
        queries = queries[: args.limit]

    if args.backend == "ollama":
        backend = OllamaBackend(args.model)
    else:
        backend = MockBackend(["Final answer: yes"])

    print(f"backend: {backend.name()}  queries: {len(queries)}", file=sys.stderr)
    results = run_bench(
        graph,
        queries,
        backend,
        hops_settings=tuple(args.hops),
        encodings=tuple(args.encodings),
        heuristics=tuple(args.heuristics),
    )

    rows = aggregate(results)
    table = render_markdown_table(rows)
    tokens = token_summary(results)
    print("\n" + table)
    print("\nmean prompt tokens by hop setting: " +
          ", ".join(f"{h}-hop: {t:.0f}" for h, t in tokens.items()))

    if args.out:
        out_dir = Path(args.out)
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "results.json").write_text(
            json.dumps(
                {
                    "backend": backend.name(),
                    "graph": args.graph,
                    "queries": args.queries,
                    "table": rows,
                    "mean_prompt_tokens": tokens,
                    "results": [r.__dict__ for r in results],
                },
                indent=2,
            ),
            encoding="utf-8",
        )
        (out_dir / "results_table.md").write_text(table + "\n", encoding="utf-8")
        print(f"wrote {out_dir / 'results.json'} and results_table.md", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
