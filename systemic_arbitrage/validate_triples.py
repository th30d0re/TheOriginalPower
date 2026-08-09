"""L1 two-step generation and discriminative validation for graph triples.

The production path uses the deterministic ``l6-bench`` Ollama model through
L6's existing subprocess backend.  Human labels remain the only ground truth
used by the precision report.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import random
import re
import shutil
import subprocess
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

from systemic_arbitrage.eval.encoding_bench import OllamaBackend
from systemic_arbitrage.prompt_budget import FrameworkGraph

MODEL = "l6-bench"
SEED = 42
PRIMARY_ENCODING = "semantic_proximity+zero_shot_cot"
COMPARISON_ENCODING = "incident_list+zero_shot_cot"
ALLOWED_RELATIONS = {"calibrates", "falsifies", "maps_to"}
LABELS = {"true", "false"}
ROOT = Path(__file__).resolve().parents[1]
GRAPH_PATH = ROOT / "systemic_arbitrage/data/graph/framework_kg.json"
EVAL_DIR = ROOT / "systemic_arbitrage/eval"
HOLDOUT_PATH = EVAL_DIR / "holdout_l1_unlabelled.jsonl"
RESULTS_PATH = EVAL_DIR / "l1_validation_results.jsonl"
QUARANTINE_PATH = EVAL_DIR / "l1_quarantine.jsonl"
PRECISION_PATH = EVAL_DIR / "l1_precision.json"
COMPARISON_PATH = EVAL_DIR / "l1_encoding_comparison.json"


@dataclass(frozen=True)
class CandidateTriple:
    source: str
    relation: str
    target: str
    tier: object
    provenance: str
    source_context: str
    generation_reasoning: str = "supplied candidate"

    @property
    def triple_id(self) -> str:
        payload = json.dumps(
            [self.source, self.relation, self.target, self.provenance],
            ensure_ascii=False,
            separators=(",", ":"),
        )
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:20]


@dataclass(frozen=True)
class ValidationVerdict:
    triple_id: str
    source: str
    relation: str
    target: str
    tier: object
    provenance: str
    source_context: str
    generation_reasoning: str
    verdict: str
    passed: bool
    reasoning: str
    encoding: str
    backend: str
    raw_response: str


def _json_from_response(raw: str) -> object:
    """Decode the first JSON object or array, tolerating prose/code fences."""
    decoder = json.JSONDecoder()
    for index, char in enumerate(raw):
        if char not in "[{":
            continue
        try:
            value, _ = decoder.raw_decode(raw[index:])
            return value
        except json.JSONDecodeError:
            continue
    raise ValueError("model response contained no valid JSON object or array")


def build_generation_prompt(source_context: str, provenance: str) -> str:
    return f"""Extract relational triples supported by the source text.
Use only these relations: calibrates, falsifies, maps_to.
Do not use outside knowledge. Preserve entity identifiers when the text gives them.
Think step by step, then return JSON only with this shape:
{{"triples":[{{"source":"...","relation":"...","target":"...","reasoning":"..."}}]}}
Return {{"triples":[]}} when the text supports no such relation.

SOURCE PROVENANCE: {provenance}
SOURCE TEXT:
{source_context}
"""


def generate_candidates(
    source_context: str,
    provenance: str,
    backend,
    tier: object = 3,
) -> list[CandidateTriple]:
    """L1 pass 1: propose triples from source text with source provenance."""
    raw = backend.complete(build_generation_prompt(source_context, provenance))
    payload = _json_from_response(raw)
    rows = payload.get("triples") if isinstance(payload, dict) else payload
    if not isinstance(rows, list):
        raise ValueError("generative response must contain a 'triples' list")
    candidates: list[CandidateTriple] = []
    for row in rows:
        if not isinstance(row, dict):
            raise ValueError("every generated triple must be a JSON object")
        relation = str(row.get("relation", "")).strip()
        if relation not in ALLOWED_RELATIONS:
            raise ValueError(f"generated triple has unsupported relation: {relation!r}")
        source = str(row.get("source", "")).strip()
        target = str(row.get("target", "")).strip()
        if not source or not target:
            raise ValueError("generated triple endpoints must be non-empty")
        candidates.append(
            CandidateTriple(
                source=source,
                relation=relation,
                target=target,
                tier=tier,
                provenance=provenance,
                source_context=source_context,
                generation_reasoning=str(row.get("reasoning", "")).strip(),
            )
        )
    return sorted(candidates, key=lambda item: item.triple_id)


def encode_candidate(candidate: CandidateTriple, encoding: str) -> str:
    if encoding == PRIMARY_ENCODING:
        templates = {
            "calibrates": (
                "{source} supplies evidence used to calibrate {target}."
            ),
            "falsifies": (
                "{source} states a criterion whose satisfaction would falsify {target}."
            ),
            "maps_to": (
                "Framework variable {source} maps to market contract {target}."
            ),
        }
        return templates[candidate.relation].format(
            source=candidate.source, target=candidate.target
        )
    if encoding == COMPARISON_ENCODING:
        return f"({candidate.source}, {candidate.relation}, {candidate.target})"
    raise ValueError(f"unsupported L1 encoding: {encoding}")


def build_discrimination_prompt(candidate: CandidateTriple, encoding: str) -> str:
    encoded = encode_candidate(candidate, encoding)
    return f"""Based strictly on this source text, is this triple true or false?
Treat missing, ambiguous, or merely plausible support as false.
The entity names in the candidate identify the claim; they are not evidence.
Think step by step using only explicit statements in the source text.

SOURCE PROVENANCE: {candidate.provenance}
SOURCE TEXT:
{candidate.source_context}

CANDIDATE TRIPLE ({encoding}):
{encoded}

End with exactly two lines:
VERDICT: TRUE or FALSE
REASON: one concise source-grounded reason
"""


def parse_discriminative_response(raw: str) -> tuple[str, bool, str]:
    matches = re.findall(r"(?im)^\s*VERDICT\s*:\s*(TRUE|FALSE)\s*$", raw)
    reasons = re.findall(r"(?im)^\s*REASON\s*:\s*(.+?)\s*$", raw)
    if len(matches) != 1:
        return (
            "unparseable",
            False,
            "discriminative response lacked exactly one TRUE/FALSE verdict line",
        )
    if not reasons or not reasons[-1].strip():
        return "unparseable", False, "discriminative response lacked a reason"
    verdict = matches[0].lower()
    return verdict, verdict == "true", reasons[-1].strip()


def validate_candidates(
    candidates: Iterable[CandidateTriple], backend, encoding: str = PRIMARY_ENCODING
) -> list[ValidationVerdict]:
    """L1 pass 2: independently discriminate every supplied triple."""
    results: list[ValidationVerdict] = []
    ordered = sorted(candidates, key=lambda item: item.triple_id)
    for candidate in ordered:
        raw = backend.complete(build_discrimination_prompt(candidate, encoding))
        verdict, passed, reasoning = parse_discriminative_response(raw)
        results.append(
            ValidationVerdict(
                triple_id=candidate.triple_id,
                source=candidate.source,
                relation=candidate.relation,
                target=candidate.target,
                tier=candidate.tier,
                provenance=candidate.provenance,
                source_context=candidate.source_context,
                generation_reasoning=candidate.generation_reasoning,
                verdict=verdict,
                passed=passed,
                reasoning=reasoning,
                encoding=encoding,
                backend=backend.name(),
                raw_response=raw,
            )
        )
    return results


def two_step_validate_source(
    source_context: str, provenance: str, backend, tier: object = 3
) -> list[ValidationVerdict]:
    candidates = generate_candidates(source_context, provenance, backend, tier=tier)
    return validate_candidates(candidates, backend)


def _read_source_excerpt(path: Path, needles: Iterable[str], limit: int = 6000) -> str:
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        raise RuntimeError(f"cannot read provenance source {path}: {exc}") from exc
    positions = [
        text.find(needle) for needle in needles if needle and text.find(needle) >= 0
    ]
    if not positions or len(text) <= limit:
        return text[:limit]
    center = min(positions)
    start = max(0, center - limit // 3)
    end = min(len(text), start + limit)
    start = max(0, end - limit)
    return text[start:end]


def graph_candidates(graph_path: str | Path) -> list[CandidateTriple]:
    path = Path(graph_path)
    graph = FrameworkGraph.load(path)
    candidates: list[CandidateTriple] = []
    for edge in graph.edges:
        if edge.type not in ALLOWED_RELATIONS:
            continue
        source_node = graph.nodes[edge.source]
        target_node = graph.nodes[edge.target]
        provenance_path = ROOT / edge.provenance
        needles = (
            str(target_node.get("slug_pattern", "")),
            str(source_node.get("label", "")),
            str(target_node.get("label", "")),
            edge.source,
            edge.target,
        )
        context = _read_source_excerpt(provenance_path, needles)
        candidates.append(
            CandidateTriple(
                source=edge.source,
                relation=edge.type,
                target=edge.target,
                tier=edge.tier,
                provenance=edge.provenance,
                source_context=context,
                generation_reasoning="candidate loaded from framework-kg/1",
            )
        )
    return candidates


def _read_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    rows = []
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            rows.append(json.loads(line))
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid JSONL in {path}:{line_number}: {exc}") from exc
    return rows


def _write_jsonl(path: Path, rows: Iterable[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    body = "".join(
        json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n" for row in rows
    )
    path.write_text(body, encoding="utf-8")


def emit_holdout(
    candidates: Iterable[CandidateTriple], path: Path = HOLDOUT_PATH, seed: int = SEED
) -> list[dict]:
    population = sorted(candidates, key=lambda item: item.triple_id)
    if len(population) < 100:
        raise ValueError(f"holdout requires at least 100 triples; found {len(population)}")
    sampled = random.Random(seed).sample(population, 100)
    old_labels = {
        row.get("triple_id"): row.get("label", "") for row in _read_jsonl(path)
    }
    rows = []
    for candidate in sorted(sampled, key=lambda item: item.triple_id):
        rows.append(
            {
                "triple_id": candidate.triple_id,
                "triple": {
                    "source": candidate.source,
                    "relation": candidate.relation,
                    "target": candidate.target,
                    "tier": candidate.tier,
                },
                "source_text_excerpt": candidate.source_context,
                "provenance": candidate.provenance,
                "label": old_labels.get(candidate.triple_id, ""),
            }
        )
    _write_jsonl(path, rows)
    return rows


def write_results(results: Iterable[ValidationVerdict], path: Path = RESULTS_PATH) -> None:
    _write_jsonl(path, (asdict(result) for result in results))


def update_quarantine(
    results: Iterable[ValidationVerdict], path: Path = QUARANTINE_PATH
) -> int:
    """Merge failures into a durable JSONL ledger without removing old rows."""
    existing = _read_jsonl(path)
    fingerprints = {
        (row.get("triple_id"), row.get("encoding"), row.get("raw_response"))
        for row in existing
    }
    additions = []
    for result in results:
        if result.passed:
            continue
        row = asdict(result)
        row["quarantine_reason"] = result.reasoning
        fingerprint = (result.triple_id, result.encoding, result.raw_response)
        if fingerprint not in fingerprints:
            additions.append(row)
            fingerprints.add(fingerprint)
    _write_jsonl(path, existing + additions)
    return len(existing) + len(additions)


def measure_precision(
    holdout_path: Path = HOLDOUT_PATH,
    results_path: Path = RESULTS_PATH,
    report_path: Path = PRECISION_PATH,
) -> dict:
    holdout = _read_jsonl(holdout_path)
    results = {row["triple_id"]: row for row in _read_jsonl(results_path)}
    labelled = [row for row in holdout if str(row.get("label", "")).lower() in LABELS]
    invalid = [
        row for row in holdout
        if str(row.get("label", "")).strip()
        and str(row.get("label", "")).lower() not in LABELS
    ]
    accepted = [row for row in labelled if results.get(row["triple_id"], {}).get("passed")]
    true_positives = sum(str(row["label"]).lower() == "true" for row in accepted)
    false_positives = sum(str(row["label"]).lower() == "false" for row in accepted)
    denominator = true_positives + false_positives
    precision = true_positives / denominator if denominator else None
    try:
        holdout_provenance = str(holdout_path.relative_to(ROOT))
    except ValueError:
        holdout_provenance = str(holdout_path)
    report = {
        "schema": "l1-precision/1",
        "provenance": holdout_provenance,
        "holdout_size": len(holdout),
        "human_labelled": len(labelled),
        "invalid_labels": len(invalid),
        "validated_labelled_denominator": denominator,
        "true_positives": true_positives,
        "false_positives": false_positives,
        "precision": precision,
        "threshold": 0.95,
        "threshold_met_on_labelled_subset": precision is not None and precision >= 0.95,
        "exit_criterion_pass": (
            len(holdout) == 100
            and len(labelled) == 100
            and not invalid
            and precision is not None
            and precision >= 0.95
        ),
    }
    report_path.write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    return report


def ensure_deterministic_ollama(model: str = MODEL) -> OllamaBackend:
    if model != MODEL:
        raise RuntimeError(
            f"L1 is pinned to Ollama model {MODEL!r}; received {model!r}"
        )
    if shutil.which("ollama") is None:
        raise RuntimeError("Ollama CLI is missing; install 'ollama' and model 'l6-bench'")
    try:
        proc = subprocess.run(
            ["ollama", "show", "--modelfile", model],
            capture_output=True,
            text=True,
            timeout=30,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise RuntimeError(f"Ollama service is unavailable for model {model!r}: {exc}") from exc
    if proc.returncode:
        detail = (proc.stderr or proc.stdout).strip()[:500]
        raise RuntimeError(
            f"Ollama service or required model {model!r} is unavailable: {detail}"
        )
    modelfile = proc.stdout
    required = {
        "temperature 0": r"(?im)^\s*PARAMETER\s+temperature\s+0(?:\.0+)?\s*$",
        "seed 42": r"(?im)^\s*PARAMETER\s+seed\s+42\s*$",
    }
    missing = [
        name for name, pattern in required.items() if not re.search(pattern, modelfile)
    ]
    if missing:
        raise RuntimeError(
            f"Ollama model {model!r} lacks deterministic settings: {', '.join(missing)}"
        )
    return OllamaBackend(model)


def compare_encodings(
    candidates: list[CandidateTriple], backend, primary: list[ValidationVerdict], size: int
) -> dict:
    if not 0 <= size <= len(candidates):
        raise ValueError(
            f"comparison size must be between 0 and {len(candidates)}; got {size}"
        )
    selected = random.Random(SEED).sample(
        sorted(candidates, key=lambda item: item.triple_id), size
    )
    alternate = validate_candidates(selected, backend, COMPARISON_ENCODING)
    primary_by_id = {row.triple_id: row for row in primary}
    rows = []
    for other in alternate:
        first = primary_by_id[other.triple_id]
        rows.append(
            {
                "triple_id": other.triple_id,
                "provenance": other.provenance,
                "primary_verdict": first.verdict,
                "comparison_verdict": other.verdict,
                "agrees": first.verdict == other.verdict,
            }
        )
    return {
        "schema": "l1-encoding-comparison/1",
        "provenance": str(GRAPH_PATH.relative_to(ROOT)),
        "seed": SEED,
        "sample_size": size,
        "primary_encoding": PRIMARY_ENCODING,
        "comparison_encoding": COMPARISON_ENCODING,
        "agreement": sum(row["agrees"] for row in rows) / size if size else None,
        "rows": rows,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--graph", type=Path, default=GRAPH_PATH)
    parser.add_argument("--model", default=MODEL)
    parser.add_argument("--seed", type=int, default=SEED)
    parser.add_argument("--comparison-size", type=int, default=30)
    parser.add_argument("--emit-holdout-only", action="store_true")
    args = parser.parse_args(argv)

    candidates = graph_candidates(args.graph)
    holdout = emit_holdout(candidates, seed=args.seed)
    preliminary = measure_precision()
    quarantined = update_quarantine([])
    print(
        f"holdout: {len(holdout)} triples (seed={args.seed}), "
        f"{preliminary['human_labelled']}/100 human labels -> {HOLDOUT_PATH}",
        flush=True,
    )
    if preliminary["precision"] is None:
        print("precision: unavailable; validated labelled denominator is 0", flush=True)
    else:
        print(
            f"interim precision: {preliminary['precision']:.3f} over denominator "
            f"{preliminary['validated_labelled_denominator']}",
            flush=True,
        )
    if args.emit_holdout_only:
        return 0

    try:
        backend = ensure_deterministic_ollama(args.model)
    except RuntimeError as exc:
        print(f"L1 validation unavailable: {exc}", file=sys.stderr)
        return 2

    print(f"validating {len(candidates)} graph triples with {backend.name()}", file=sys.stderr)
    results: list[ValidationVerdict] = []
    pending: list[ValidationVerdict] = []
    for index, candidate in enumerate(sorted(candidates, key=lambda x: x.triple_id), 1):
        try:
            result = validate_candidates([candidate], backend)[0]
        except (RuntimeError, OSError, subprocess.TimeoutExpired) as exc:
            write_results(results)
            quarantined = update_quarantine(pending)
            print(
                f"L1 validation stopped at triple {index}/{len(candidates)}: {exc}",
                file=sys.stderr,
            )
            return 2
        results.append(result)
        pending.append(result)
        if index % 25 == 0 or index == len(candidates):
            write_results(results)
            quarantined = update_quarantine(pending)
            pending.clear()
            print(f"  discriminative pass: {index}/{len(candidates)}", file=sys.stderr)
    write_results(results)
    try:
        comparison = compare_encodings(candidates, backend, results, args.comparison_size)
    except (RuntimeError, OSError, subprocess.TimeoutExpired) as exc:
        print(f"L1 encoding comparison failed: {exc}", file=sys.stderr)
        return 2
    COMPARISON_PATH.write_text(
        json.dumps(comparison, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    report = measure_precision()
    passed = sum(row.passed for row in results)
    print(f"discriminative pass: {passed}/{len(results)} ({passed / len(results):.1%})")
    print(f"durable quarantine: {quarantined} records -> {QUARANTINE_PATH}")
    if report["precision"] is None:
        print(
            "precision: unavailable; validated labelled denominator is 0 "
            f"({report['human_labelled']}/100 holdout labels completed)"
        )
    else:
        print(
            f"precision: {report['precision']:.3f} over denominator "
            f"{report['validated_labelled_denominator']} "
            f"({report['human_labelled']}/100 holdout labels completed)"
        )
    if not report["exit_criterion_pass"]:
        print("L1 exit criterion NOT MET", file=sys.stderr)
        return 1
    print("L1 exit criterion MET")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
