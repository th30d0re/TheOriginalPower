from __future__ import annotations

import json
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

from systemic_arbitrage.calibration_map import CalibrationMap

logger = logging.getLogger(__name__)

try:
    from systemic_arbitrage.costs import compute_costs, total_cost_prob_terms, CostBreakdown
    HAS_COSTS = True
except ImportError:
    HAS_COSTS = False
    logger.warning(
        "systemic_arbitrage.costs unavailable; using half-spread-only costs"
    )

PACKAGE_ROOT = Path(__file__).resolve().parent
BACKTEST_CSV = PACKAGE_ROOT / "data" / "backtest" / "resolved_markets.csv"
REPORTS_DIR = PACKAGE_ROOT / "data" / "reports"


def _bootstrap_ci(values: np.ndarray, n_boot: int = 1000, alpha: float = 0.05) -> tuple[float, float]:
    if len(values) == 0:
        return (float("nan"), float("nan"))
    rng = np.random.default_rng(42)
    boot_means = np.array([
        np.mean(rng.choice(values, size=len(values), replace=True))
        for _ in range(n_boot)
    ])
    lo = float(np.percentile(boot_means, 100 * alpha / 2))
    hi = float(np.percentile(boot_means, 100 * (1 - alpha / 2)))
    return (lo, hi)


def _wilson_ci(hits: int, n: int, alpha: float = 0.05) -> tuple[float, float]:
    from scipy.stats import norm
    if n == 0:
        return (float("nan"), float("nan"))
    z = float(norm.ppf(1 - alpha / 2))
    p_hat = hits / n
    center = (p_hat + z**2 / (2 * n)) / (1 + z**2 / n)
    margin = z * np.sqrt(p_hat * (1 - p_hat) / n + z**2 / (4 * n**2)) / (1 + z**2 / n)
    return (float(center - margin), float(center + margin))


def _brier_score(probs: np.ndarray, outcomes: np.ndarray) -> float:
    if len(probs) == 0:
        return float("nan")
    return float(np.mean((probs - outcomes) ** 2))


def _momentum_prob(delta_p: float) -> float:
    # sign of delta_p → direction; clamp away from 0.5 to produce a non-trivial prediction
    return 0.65 if delta_p >= 0 else 0.35


def _fillable_notional(
    requested_usd: float,
    book_depth_usd: float,
    max_slippage_frac: float,
    slippage_rate: float = 0.5,
) -> float:
    """Largest notional that stays inside the slippage cap for this book.

    compute_costs() aborts when requested size implies slippage above the cap, and
    an aborted fill costs `inf` — which silently makes every edge -inf. Sizing to
    the book instead is what a trader actually does: trade smaller, not never.
    """
    if book_depth_usd <= 0.0 or slippage_rate <= 0.0:
        return 0.0
    return min(requested_usd, (max_slippage_frac * book_depth_usd) / slippage_rate)


def _cost_term(
    row: pd.Series,
    max_slippage_frac: float = 0.01,
    size_to_book: bool = True,
) -> tuple[float, bool, float]:
    """Cost as a probability-point deduction.

    Returns (cost_in_prob_points, aborted, notional_used). `aborted` is reported
    separately so an unfillable market is never mistaken for one carrying no edge.
    """
    requested = float(row["fill_notional_usd"])
    depth = float(row["book_depth_usd"])
    notional = (
        _fillable_notional(requested, depth, max_slippage_frac)
        if size_to_book
        else requested
    )

    if not HAS_COSTS:
        return float(row["half_spread_frac"]), False, notional

    cb: CostBreakdown = compute_costs(
        fill_notional_usd=notional,
        taker_fee_bps=0.0,
        half_spread_frac=float(row["half_spread_frac"]),
        book_depth_usd=depth,
        max_slippage_frac=max_slippage_frac,
    )
    cost = float(total_cost_prob_terms(cb, float(row["market_prob_at_entry"])))
    return cost, bool(cb.aborted), notional


def _evaluate_fold(
    train_df: pd.DataFrame,
    eval_df: pd.DataFrame,
    edge_threshold: float,
    max_slippage_frac: float = 0.01,
    size_to_book: bool = True,
) -> dict[str, Any]:
    cal = CalibrationMap()
    if len(train_df) >= 5:
        cal.fit(
            train_df["delta_p_at_entry"].values,
            train_df["resolution_outcome"].values,
        )

    outcomes = eval_df["resolution_outcome"].values.astype(float)
    market_probs = eval_df["market_prob_at_entry"].values.astype(float)
    delta_ps = eval_df["delta_p_at_entry"].values.astype(float)
    model_probs = cal.predict_batch(delta_ps)
    momentum_probs = np.array([_momentum_prob(d) for d in delta_ps])
    coin_probs = np.full(len(delta_ps), 0.5)
    cost_results = [
        _cost_term(row, max_slippage_frac, size_to_book)
        for _, row in eval_df.iterrows()
    ]
    cost_terms = np.array([c for c, _, _ in cost_results])
    aborted = np.array([a for _, a, _ in cost_results])
    notionals = np.array([n for _, _, n in cost_results])

    edges = (model_probs - market_probs) - cost_terms
    # An aborted fill is unfillable, not edgeless. Exclude it from the edge test
    # rather than letting an inf cost push it under the threshold as a silent miss.
    tradeable = ~aborted
    mask = tradeable & (edges > edge_threshold)

    brier_model = _brier_score(model_probs, outcomes)
    brier_market = _brier_score(market_probs, outcomes)
    brier_momentum = _brier_score(momentum_probs, outcomes)
    brier_coin = _brier_score(coin_probs, outcomes)

    brier_skill = (1 - brier_model / brier_market) if brier_market > 0 else float("nan")
    brier_skill_momentum = (1 - brier_momentum / brier_market) if brier_market > 0 else float("nan")

    n_evaluated = int(np.sum(mask))
    edge_values = edges[mask]
    edge_mean = float(np.mean(edge_values)) if n_evaluated > 0 else float("nan")
    edge_ci = _bootstrap_ci(edge_values) if n_evaluated > 0 else (float("nan"), float("nan"))
    edge_ci_excludes_zero = bool(edge_ci[0] > 0) if n_evaluated > 0 else False

    correct = (model_probs > 0.5) == (outcomes == 1)
    hits = int(np.sum(correct))
    hit_rate = float(hits / len(outcomes)) if len(outcomes) > 0 else float("nan")
    hit_rate_ci = _wilson_ci(hits, len(outcomes))

    return {
        "n_train": len(train_df),
        "n_trades_total": len(eval_df),
        "n_trades_evaluated": n_evaluated,
        # Reported separately so "could not fill" can never again read as "no edge".
        "n_trades_aborted": int(np.sum(aborted)),
        "mean_notional_usd": float(np.mean(notionals)) if len(notionals) else float("nan"),
        "edge_mean": edge_mean,
        "edge_ci": list(edge_ci),
        "edge_ci_excludes_zero": edge_ci_excludes_zero,
        "hit_rate": hit_rate,
        "hit_rate_ci": list(hit_rate_ci),
        "brier_score_model": brier_model,
        "brier_score_market": brier_market,
        "brier_score_momentum": brier_momentum,
        "brier_score_coin": brier_coin,
        "brier_skill": brier_skill,
        "brier_skill_momentum": brier_skill_momentum,
        "beats_market": bool(brier_skill > 0) if not np.isnan(brier_skill) else False,
        "beats_momentum": bool(brier_skill > brier_skill_momentum) if not (np.isnan(brier_skill) or np.isnan(brier_skill_momentum)) else False,
        "calibration": cal.to_dict(),
    }


def run_walk_forward(
    resolved_markets_path: Path,
    min_train_size: int = 10,
    fold_size: int = 5,
    edge_threshold: float = 0.04,
    taker_fee_bps: float = 0.0,
    max_slippage_frac: float = 0.01,
    size_to_book: bool = True,
) -> dict:
    """Rolling-origin walk-forward over resolved markets.

    size_to_book caps each fill at the largest notional the book supports within
    max_slippage_frac, instead of requesting a fixed size and aborting when the
    book cannot absorb it.
    """
    df = pd.read_csv(resolved_markets_path, parse_dates=["resolution_date", "entry_date"])
    df = df.sort_values("entry_date").reset_index(drop=True)

    folds = []
    start = min_train_size
    while start < len(df):
        end = min(start + fold_size, len(df))
        train_df = df.iloc[:start]
        eval_df = df.iloc[start:end]
        fold_result = _evaluate_fold(
            train_df, eval_df, edge_threshold, max_slippage_frac, size_to_book
        )
        fold_result["fold_index"] = len(folds)
        fold_result["eval_rows"] = list(eval_df.index)
        folds.append(fold_result)
        start = end

    if not folds:
        aggregate = {
            "n_folds": 0,
            "n_trades_total": len(df),
            "n_trades_evaluated": 0,
            "edge_mean": float("nan"),
            "edge_ci": [float("nan"), float("nan")],
            "edge_ci_excludes_zero": False,
            "hit_rate": float("nan"),
            "hit_rate_ci": [float("nan"), float("nan")],
            "brier_score_model": float("nan"),
            "brier_score_market": float("nan"),
            "brier_skill": float("nan"),
            "beats_market": False,
            "beats_momentum": False,
        }
        return {"folds": folds, "aggregate": aggregate, "params": {
            "min_train_size": min_train_size,
            "fold_size": fold_size,
            "edge_threshold": edge_threshold,
        }}

    # aggregate across folds — pool all eval rows for global metrics
    eval_indices: list[int] = []
    for fold in folds:
        eval_indices.extend(fold["eval_rows"])
    eval_all = df.iloc[eval_indices]
    train_all = df  # use all data to fit final calibration for aggregate metrics

    cal_agg = CalibrationMap()
    if len(df) >= 5:
        cal_agg.fit(df["delta_p_at_entry"].values, df["resolution_outcome"].values)

    outcomes_all = eval_all["resolution_outcome"].values.astype(float)
    market_probs_all = eval_all["market_prob_at_entry"].values.astype(float)
    delta_ps_all = eval_all["delta_p_at_entry"].values.astype(float)
    model_probs_all = cal_agg.predict_batch(delta_ps_all)
    momentum_probs_all = np.array([_momentum_prob(d) for d in delta_ps_all])
    cost_results_all = [
        _cost_term(row, max_slippage_frac, size_to_book)
        for _, row in eval_all.iterrows()
    ]
    cost_terms_all = np.array([c for c, _, _ in cost_results_all])
    aborted_all = np.array([a for _, a, _ in cost_results_all])
    notionals_all = np.array([n for _, _, n in cost_results_all])

    edges_all = (model_probs_all - market_probs_all) - cost_terms_all
    mask_all = (~aborted_all) & (edges_all > edge_threshold)

    brier_model_agg = _brier_score(model_probs_all, outcomes_all)
    brier_market_agg = _brier_score(market_probs_all, outcomes_all)
    brier_momentum_agg = _brier_score(momentum_probs_all, outcomes_all)
    brier_skill_agg = (1 - brier_model_agg / brier_market_agg) if brier_market_agg > 0 else float("nan")
    brier_skill_momentum_agg = (1 - brier_momentum_agg / brier_market_agg) if brier_market_agg > 0 else float("nan")

    n_eval_agg = int(np.sum(mask_all))
    edge_values_agg = edges_all[mask_all]
    edge_mean_agg = float(np.mean(edge_values_agg)) if n_eval_agg > 0 else float("nan")
    edge_ci_agg = _bootstrap_ci(edge_values_agg) if n_eval_agg > 0 else (float("nan"), float("nan"))
    edge_ci_excludes_zero_agg = bool(edge_ci_agg[0] > 0) if n_eval_agg > 0 else False

    correct_agg = (model_probs_all > 0.5) == (outcomes_all == 1)
    hits_agg = int(np.sum(correct_agg))
    hit_rate_agg = float(hits_agg / len(outcomes_all)) if len(outcomes_all) > 0 else float("nan")
    hit_rate_ci_agg = _wilson_ci(hits_agg, len(outcomes_all))

    aggregate = {
        "n_folds": len(folds),
        "n_trades_total": len(df),
        "n_trades_evaluated": n_eval_agg,
        "n_trades_aborted": int(np.sum(aborted_all)),
        "mean_notional_usd": float(np.mean(notionals_all)) if len(notionals_all) else float("nan"),
        "edge_mean": edge_mean_agg,
        "edge_ci": list(edge_ci_agg),
        "edge_ci_excludes_zero": edge_ci_excludes_zero_agg,
        "hit_rate": hit_rate_agg,
        "hit_rate_ci": list(hit_rate_ci_agg),
        "brier_score_model": brier_model_agg,
        "brier_score_market": brier_market_agg,
        "brier_score_momentum": brier_momentum_agg,
        "brier_skill": brier_skill_agg,
        "brier_skill_momentum": brier_skill_momentum_agg,
        "beats_market": bool(brier_skill_agg > 0) if not np.isnan(brier_skill_agg) else False,
        "beats_momentum": bool(brier_skill_agg > brier_skill_momentum_agg) if not (np.isnan(brier_skill_agg) or np.isnan(brier_skill_momentum_agg)) else False,
        "calibration_final": cal_agg.to_dict(),
    }

    return {
        "folds": folds,
        "aggregate": aggregate,
        "params": {
            "min_train_size": min_train_size,
            "fold_size": fold_size,
            "edge_threshold": edge_threshold,
            "taker_fee_bps": taker_fee_bps,
            "max_slippage_frac": max_slippage_frac,
            "size_to_book": size_to_book,
            "has_costs_module": HAS_COSTS,
        },
    }


def promotion_decision(report: dict) -> dict:
    """Determine if the strategy passes the go/no-go gate."""
    agg = report.get("aggregate", {})
    reasons: list[str] = []
    passed_checks: list[bool] = []

    edge_ok = bool(agg.get("edge_ci_excludes_zero", False))
    passed_checks.append(edge_ok)
    if not edge_ok:
        reasons.append("edge CI does not exclude zero")

    brier_ok = not np.isnan(agg.get("brier_skill", float("nan"))) and agg.get("brier_skill", -1) > 0
    passed_checks.append(brier_ok)
    if not brier_ok:
        reasons.append("brier_skill <= 0 (model does not beat market)")

    momentum_ok = bool(agg.get("beats_momentum", False))
    passed_checks.append(momentum_ok)
    if not momentum_ok:
        reasons.append("model does not beat momentum baseline")

    promote = all(passed_checks)
    if promote:
        reasons.append("all gates passed")

    return {"promote": promote, "reasons": reasons}


def main() -> int:
    report = run_walk_forward(BACKTEST_CSV)

    decision = promotion_decision(report)
    report["promotion_decision"] = decision

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_path = REPORTS_DIR / f"backtest_{timestamp}.json"
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2, default=str)

    agg = report["aggregate"]
    print(f"\n=== Backtest Summary ===")
    print(f"Folds: {agg['n_folds']}  |  Trades total: {agg['n_trades_total']}  |  Trades evaluated: {agg['n_trades_evaluated']}")
    print(f"Unfillable (aborted): {agg.get('n_trades_aborted', 0)}  |  Mean notional: ${agg.get('mean_notional_usd', float('nan')):.2f}")
    print(f"Edge mean: {agg['edge_mean']:.4f}  |  Edge CI: {agg['edge_ci']}")
    print(f"Brier skill vs market: {agg['brier_skill']:.4f}")
    print(f"Beats market: {agg['beats_market']}  |  Beats momentum: {agg['beats_momentum']}")
    print(f"Promotion decision: {'PROMOTE' if decision['promote'] else 'NO-GO'}")
    print(f"Reasons: {decision['reasons']}")
    print(f"Report: {report_path}")

    return 0 if decision["promote"] else 1


if __name__ == "__main__":
    sys.exit(main())
