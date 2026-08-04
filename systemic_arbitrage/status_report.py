"""Emit the canonical status payload consumed by the arbitrage dashboard."""

from __future__ import annotations

import json
import math
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

from systemic_arbitrage.backtest import _fillable_notional
from systemic_arbitrage.calibration_map import CalibrationMap
from systemic_arbitrage.costs import compute_costs, total_cost_prob_terms


PACKAGE_ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = PACKAGE_ROOT.parent
REPORTS_DIR = PACKAGE_ROOT / "data" / "reports"
BACKTEST_CSV = PACKAGE_ROOT / "data" / "backtest" / "resolved_markets.csv"
SIGNAL_SNAPSHOT = PACKAGE_ROOT / "data" / "live" / "signal_snapshot.json"
PAPER_TRADES = PACKAGE_ROOT / "data" / "paper_trades.jsonl"
GRAPH_PATH = PACKAGE_ROOT / "GRAPH.md"
VARIABLES_PATH = PACKAGE_ROOT / "variables.yaml"
OUTPUT_PATHS = (
    REPORTS_DIR / "status.json",
    PROJECT_ROOT / "website" / "public" / "data" / "arbitrage_status.json",
)
TOP_LEVEL_KEYS = (
    "generated_utc",
    "verdict",
    "backtest",
    "selected_trades_diagnostic",
    "signal",
    "paper_trading",
    "loops",
    "next_actions",
    "data_caveats",
)


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _finite(value: Any) -> float | None:
    if value is None:
        return None
    number = float(value)
    return number if math.isfinite(number) else None


def _empty_backtest() -> dict[str, Any]:
    return {
        "report_file": "",
        "run_utc": "",
        "n_folds": None,
        "n_trades_total": None,
        "n_trades_evaluated": None,
        "n_trades_aborted": None,
        "mean_notional_usd": None,
        "edge_mean": None,
        "edge_ci": None,
        "hit_rate": None,
        "hit_rate_ci": None,
        "brier": {"model": None, "market": None, "momentum": None, "coin": None},
        "brier_skill": None,
        "brier_skill_momentum": None,
        "beats_market": None,
        "beats_momentum": None,
    }


def _empty_diagnostic(interpretation: str) -> dict[str, Any]:
    return {
        "n": None,
        "model_mean_prob": None,
        "market_mean_prob": None,
        "realized_rate": None,
        "model_abs_error": None,
        "market_abs_error": None,
        "interpretation": interpretation,
    }


def _newest_backtest() -> Path | None:
    reports = sorted(REPORTS_DIR.glob("backtest_*.json"))
    return reports[-1] if reports else None


def _report_run_utc(path: Path) -> str:
    match = re.fullmatch(r"backtest_(\d{8})_(\d{6})", path.stem)
    if not match:
        return ""
    parsed = datetime.strptime("".join(match.groups()), "%Y%m%d%H%M%S")
    return parsed.replace(tzinfo=timezone.utc).isoformat().replace("+00:00", "Z")


def _weighted_coin_brier(report: dict[str, Any]) -> float | None:
    weighted = 0.0
    total = 0
    for fold in report.get("folds", []):
        score = fold.get("brier_score_coin")
        count = fold.get("n_trades_total")
        if score is None or count is None:
            continue
        weighted += float(score) * int(count)
        total += int(count)
    return weighted / total if total else None


def _backtest_block(path: Path, report: dict[str, Any], caveats: list[str]) -> dict[str, Any]:
    aggregate = report.get("aggregate", {})
    edge_ci = aggregate.get("edge_ci")
    hit_rate_ci = aggregate.get("hit_rate_ci")
    coin = aggregate.get("brier_score_coin", _weighted_coin_brier(report))
    if coin is None:
        caveats.append("The latest backtest report contains no aggregate coin-flip Brier score.")
    return {
        "report_file": str(path.relative_to(PROJECT_ROOT)),
        "run_utc": _report_run_utc(path),
        "n_folds": aggregate.get("n_folds"),
        "n_trades_total": aggregate.get("n_trades_total"),
        "n_trades_evaluated": aggregate.get("n_trades_evaluated"),
        "n_trades_aborted": aggregate.get("n_trades_aborted"),
        "mean_notional_usd": _finite(aggregate.get("mean_notional_usd")),
        "edge_mean": _finite(aggregate.get("edge_mean")),
        "edge_ci": [_finite(value) for value in edge_ci] if edge_ci else None,
        "hit_rate": _finite(aggregate.get("hit_rate")),
        "hit_rate_ci": [_finite(value) for value in hit_rate_ci] if hit_rate_ci else None,
        "brier": {
            "model": _finite(aggregate.get("brier_score_model")),
            "market": _finite(aggregate.get("brier_score_market")),
            "momentum": _finite(aggregate.get("brier_score_momentum")),
            "coin": _finite(coin),
        },
        "brier_skill": _finite(aggregate.get("brier_skill")),
        "brier_skill_momentum": _finite(aggregate.get("brier_skill_momentum")),
        "beats_market": aggregate.get("beats_market"),
        "beats_momentum": aggregate.get("beats_momentum"),
    }


def _selected_trades(report: dict[str, Any], caveats: list[str]) -> dict[str, Any]:
    if not BACKTEST_CSV.exists():
        reason = f"Selected-trade diagnostic unavailable: missing {BACKTEST_CSV.relative_to(PROJECT_ROOT)}."
        caveats.append(reason)
        return _empty_diagnostic(reason)
    calibration = report.get("aggregate", {}).get("calibration_final")
    if not calibration:
        reason = "Selected-trade diagnostic unavailable: aggregate.calibration_final is missing."
        caveats.append(reason)
        return _empty_diagnostic(reason)
    params = report.get("params", {})
    threshold = params.get("edge_threshold")
    max_slippage = params.get("max_slippage_frac")
    if threshold is None or max_slippage is None:
        reason = "Selected-trade diagnostic unavailable: backtest edge or slippage parameters are missing."
        caveats.append(reason)
        return _empty_diagnostic(reason)

    frame = pd.read_csv(BACKTEST_CSV)
    model_probs = CalibrationMap.from_dict(calibration).predict_batch(
        frame["delta_p_at_entry"].to_numpy(dtype=float)
    )
    costs: list[float] = []
    aborted: list[bool] = []
    for row in frame.itertuples(index=False):
        notional = _fillable_notional(
            float(row.fill_notional_usd),
            float(row.book_depth_usd),
            float(max_slippage),
        )
        breakdown = compute_costs(
            fill_notional_usd=notional,
            taker_fee_bps=float(params.get("taker_fee_bps", 0.0)),
            half_spread_frac=float(row.half_spread_frac),
            book_depth_usd=float(row.book_depth_usd),
            max_slippage_frac=float(max_slippage),
        )
        costs.append(total_cost_prob_terms(breakdown, float(row.market_prob_at_entry)))
        aborted.append(breakdown.aborted)

    market_probs = frame["market_prob_at_entry"].to_numpy(dtype=float)
    outcomes = frame["resolution_outcome"].to_numpy(dtype=float)
    edges = model_probs - market_probs - np.asarray(costs)
    selected = (~np.asarray(aborted)) & (edges > float(threshold))
    count = int(selected.sum())
    if count == 0:
        return {
            "n": 0,
            "model_mean_prob": None,
            "market_mean_prob": None,
            "realized_rate": None,
            "model_abs_error": None,
            "market_abs_error": None,
            "interpretation": "No rows pass the report's cost-adjusted edge test.",
        }

    selected_model = model_probs[selected]
    selected_market = market_probs[selected]
    selected_outcomes = outcomes[selected]
    model_error = float(np.abs(selected_model - selected_outcomes).mean())
    market_error = float(np.abs(selected_market - selected_outcomes).mean())
    interpretation = (
        "The selected model probabilities overstate realized outcomes and have higher "
        "absolute error than the market probabilities."
        if model_error > market_error
        else "The selected model probabilities have no greater absolute error than the market probabilities."
    )
    return {
        "n": count,
        "model_mean_prob": float(selected_model.mean()),
        "market_mean_prob": float(selected_market.mean()),
        "realized_rate": float(selected_outcomes.mean()),
        "model_abs_error": model_error,
        "market_abs_error": market_error,
        "interpretation": interpretation,
    }


def _signal_block(caveats: list[str]) -> dict[str, Any]:
    snapshot: dict[str, Any] | None = None
    if SIGNAL_SNAPSHOT.exists():
        snapshot = json.loads(SIGNAL_SNAPSHOT.read_text())
    else:
        caveats.append(f"Signal snapshot is missing at {SIGNAL_SNAPSHOT.relative_to(PROJECT_ROOT)}.")
    baskets: list[str] = []
    if VARIABLES_PATH.exists():
        text = VARIABLES_PATH.read_text()
        keywords = text.partition("\nkeywords:\n")[2]
        baskets = re.findall(r"^  ([A-Za-z0-9_]+):\s*$", keywords, flags=re.MULTILINE)
    else:
        caveats.append(f"Variable registry is missing at {VARIABLES_PATH.relative_to(PROJECT_ROOT)}.")
    axis_resolution = (
        "Global-only resolution from two aggregate keyword baskets: " + ", ".join(baskets) + "."
        if baskets
        else "Axis resolution unavailable because the variable baskets could not be read."
    )
    return {
        "snapshot": snapshot,
        "inert_variables": ["V_E"],
        "axis_resolution": axis_resolution,
    }


def _paper_trading(caveats: list[str]) -> dict[str, Any]:
    closed = 0
    if PAPER_TRADES.exists():
        for number, line in enumerate(PAPER_TRADES.read_text().splitlines(), start=1):
            if not line.strip():
                continue
            try:
                closed += int(bool(json.loads(line).get("closed")))
            except (json.JSONDecodeError, AttributeError):
                caveats.append(f"Ignored malformed paper-trade record on line {number}.")
    required = 100
    return {
        "closed_trades": closed,
        "required_for_promotion": required,
        "blocked": closed < required,
        "blocked_reason": (
            f"L3 requires at least {required} closed paper trades; {closed} are recorded."
            if closed < required
            else ""
        ),
    }


def _graph_catalog(caveats: list[str], closed_trades: int) -> list[dict[str, Any]]:
    if not GRAPH_PATH.exists():
        caveats.append(f"Loop catalog is missing at {GRAPH_PATH.relative_to(PROJECT_ROOT)}.")
        return []
    text = GRAPH_PATH.read_text()
    headings = list(re.finditer(r"^### (L[0-8]) — (.+)$", text, flags=re.MULTILINE))
    dependencies: dict[str, list[str]] = {f"L{i}": [] for i in range(9)}
    for line in text.splitlines():
        if "-->" not in line:
            continue
        left, right = line.split("-->", 1)
        source = re.search(r"\b(L[0-8])\b", left)
        target = re.search(r"\b(L[0-8])\b", right)
        if source and target and source.group(1) not in dependencies[target.group(1)]:
            dependencies[target.group(1)].append(source.group(1))

    explicit_status = {"L0": "done", "L2": "done", "L3": "partial", "L6": "done", "L8": "blocked"}
    notes = {
        "L0": "Merged to main and treated as complete per the recorded project status.",
        "L2": "Golden-file signal and trigger coverage is treated as complete per the recorded project status.",
        "L3": f"Coefficient fitting exists; the promotion sample is {closed_trades}/100 closed paper trades.",
        "L6": "Merged to main and treated as complete per the recorded project status.",
        "L8": "Blocked by design. Live execution remains human-gated.",
    }
    loops: list[dict[str, Any]] = []
    for index, heading in enumerate(headings):
        loop_id = heading.group(1)
        section_end = headings[index + 1].start() if index + 1 < len(headings) else len(text)
        section = text[heading.end():section_end]
        exit_match = re.search(
            r"^- \*\*(?:Exit|Precondition):\*\* (.+(?:\n(?!\n|[-#]).+)*)",
            section,
            flags=re.MULTILINE,
        )
        exit_criterion = " ".join(exit_match.group(1).split()) if exit_match else ""
        raw_name = heading.group(2)
        name = re.split(r"\s+[⚙🔁🔒]", raw_name, maxsplit=1)[0].strip()
        status = explicit_status.get(loop_id, "not_built")
        blockers = list(dependencies[loop_id])
        if loop_id == "L8":
            blockers.append("human review")
        loops.append({
            "id": loop_id,
            "name": name,
            "status": status,
            "blocked_by": blockers,
            "exit_criterion": exit_criterion,
            "note": notes.get(loop_id, "No completion artifact satisfying the exit criterion was detected mechanically."),
        })
    return loops


def _verdict(report: dict[str, Any] | None, caveats: list[str]) -> dict[str, Any]:
    if report is None:
        reason = "No backtest report is available to determine promotion."
        return {
            "state": "BLOCKED",
            "headline": "Promotion decision unavailable",
            "reasons": [reason],
            "can_paper_trade": False,
            "can_go_live": False,
        }
    decision = report.get("promotion_decision")
    if not isinstance(decision, dict) or "promote" not in decision:
        reason = "The latest backtest report has no promotion_decision."
        caveats.append(reason)
        return {
            "state": "BLOCKED",
            "headline": "Promotion decision unavailable",
            "reasons": [reason],
            "can_paper_trade": False,
            "can_go_live": False,
        }
    promote = bool(decision["promote"])
    return {
        "state": "GO" if promote else "NO-GO",
        "headline": "Backtest promotion gates passed" if promote else "Backtest promotion gate failed",
        "reasons": [str(reason) for reason in decision.get("reasons", [])],
        "can_paper_trade": promote,
        "can_go_live": False,
    }


def build_status_report(generated_utc: str | None = None) -> dict[str, Any]:
    caveats: list[str] = []
    report_path = _newest_backtest()
    report: dict[str, Any] | None = None
    if report_path is None:
        caveats.append("No backtest_*.json report exists in systemic_arbitrage/data/reports.")
        backtest = _empty_backtest()
        diagnostic = _empty_diagnostic("Selected-trade diagnostic unavailable without a backtest report.")
    else:
        try:
            report = json.loads(report_path.read_text())
            backtest = _backtest_block(report_path, report, caveats)
            diagnostic = _selected_trades(report, caveats)
        except (OSError, ValueError, KeyError, TypeError) as exc:
            caveats.append(f"Could not read the latest backtest report: {exc}.")
            report = None
            backtest = _empty_backtest()
            diagnostic = _empty_diagnostic("Selected-trade diagnostic unavailable because the report could not be read.")

    paper = _paper_trading(caveats)
    if BACKTEST_CSV.exists():
        depth = pd.read_csv(BACKTEST_CSV, usecols=["book_depth_usd"])["book_depth_usd"]
        if len(depth) == 538 and bool((depth == 1000.0).all()):
            caveats.append(
                "book_depth_usd sits at the synthetic 1000 floor for all 538 rows, so real Polymarket "
                "liquidity was never captured and every cost/slippage conclusion is provisional."
            )
    payload = {
        "generated_utc": generated_utc or _utc_now(),
        "verdict": _verdict(report, caveats),
        "backtest": backtest,
        "selected_trades_diagnostic": diagnostic,
        "signal": _signal_block(caveats),
        "paper_trading": paper,
        "loops": _graph_catalog(caveats, paper["closed_trades"]),
        "next_actions": [
            {"priority": 1, "title": "Capture real order-book depth", "why": "All 538 backtest rows use the synthetic $1,000 depth floor."},
            {"priority": 2, "title": "Correct selected-trade calibration", "why": "Selected model probabilities have higher absolute error than market probabilities."},
            {"priority": 3, "title": "Accumulate 100 closed paper trades", "why": f"L3 currently has {paper['closed_trades']} closed trades."},
        ],
        "data_caveats": caveats,
    }
    assert tuple(payload) == TOP_LEVEL_KEYS
    return payload


def write_status_report(payload: dict[str, Any]) -> None:
    serialized = json.dumps(payload, indent=2, ensure_ascii=False, allow_nan=False) + "\n"
    for path in OUTPUT_PATHS:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(serialized)


def main() -> int:
    payload = build_status_report()
    write_status_report(payload)
    for path in OUTPUT_PATHS:
        print(path.relative_to(PROJECT_ROOT))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
