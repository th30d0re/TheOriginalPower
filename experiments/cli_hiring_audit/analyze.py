#!/usr/bin/env python3
"""Analyze race-by-seniority selection outcomes from the joined CSV."""

from __future__ import annotations

import argparse
import csv
import json
import math
from collections import defaultdict
from pathlib import Path
from typing import Any

import numpy as np
from scipy.optimize import minimize
from scipy.special import expit
from scipy.stats import chi2_contingency, norm

from common import LEVELS, ROOT, write_json


BASELINE = {"LL": 46.67, "ML": 31.67, "EL": 46.67}


def load_rows(path: Path) -> list[dict[str, Any]]:
    with path.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    for row in rows:
        row["batch"] = int(row["batch"])
        row["position"] = int(row["position"])
        row["selected"] = row["selected"].strip().lower() in {"true", "1", "yes"}
        row["rank"] = int(row["rank"]) if row["rank"] else None
    return rows


def black_share(rows: list[dict[str, Any]]) -> float:
    selected = [row for row in rows if row["selected"]]
    return 100.0 * sum(row["race"] == "black" for row in selected) / len(selected) if selected else math.nan


def cluster_bootstrap_ci(rows: list[dict[str, Any]], rng: np.random.Generator) -> tuple[float, float]:
    batches: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        batches[row["batch"]].append(row)
    clusters = list(batches.values())
    samples = []
    for _ in range(1000):
        drawn = [clusters[index] for index in rng.integers(0, len(clusters), len(clusters))]
        value = black_share([row for cluster in drawn for row in cluster])
        if not math.isnan(value):
            samples.append(value)
    if not samples:
        return math.nan, math.nan
    return tuple(float(value) for value in np.percentile(samples, [2.5, 97.5]))


def contingency(rows: list[dict[str, Any]]) -> dict[str, Any]:
    table = [
        [sum(r["race"] == race and r["selected"] for r in rows),
         sum(r["race"] == race and not r["selected"] for r in rows)]
        for race in ("black", "white")
    ]
    try:
        statistic, p_value, dof, expected = chi2_contingency(table, correction=False)
        low_expected = bool((expected < 5).any())
    except ValueError:
        statistic, p_value, dof, expected, low_expected = math.nan, math.nan, 1, [], True
    return {
        "table_black_white_by_selected_not": table,
        "chi2": float(statistic),
        "dof": int(dof),
        "p_value": float(p_value),
        "expected": np.asarray(expected).tolist(),
        "low_expected_count_warning": low_expected,
    }


def logistic_regression(rows: list[dict[str, Any]]) -> dict[str, Any]:
    names = ["Intercept", "race_black", "level_ML", "level_EL", "race_black:level_ML", "race_black:level_EL"]
    matrix, outcome = [], []
    for row in rows:
        black = float(row["race"] == "black")
        ml, el = float(row["level"] == "ML"), float(row["level"] == "EL")
        matrix.append([1.0, black, ml, el, black * ml, black * el])
        outcome.append(float(row["selected"]))
    x, y = np.asarray(matrix), np.asarray(outcome)

    def objective(beta: np.ndarray) -> float:
        eta = x @ beta
        return float(np.logaddexp(0, eta).sum() - y @ eta)

    def gradient(beta: np.ndarray) -> np.ndarray:
        return x.T @ (expit(x @ beta) - y)

    fit = minimize(objective, np.zeros(x.shape[1]), jac=gradient, method="BFGS", options={"maxiter": 2000})
    probabilities = expit(x @ fit.x)
    hessian = x.T @ (x * (probabilities * (1.0 - probabilities))[:, None])
    covariance = np.linalg.pinv(hessian)
    standard_errors = np.sqrt(np.maximum(np.diag(covariance), 0))
    z_scores = np.divide(fit.x, standard_errors, out=np.full_like(fit.x, np.nan), where=standard_errors > 0)
    p_values = 2 * norm.sf(np.abs(z_scores))
    terms = {
        name: {
            "coefficient": float(fit.x[index]),
            "standard_error": float(standard_errors[index]),
            "z": float(z_scores[index]),
            "p_value": float(p_values[index]),
        }
        for index, name in enumerate(names)
    }
    return {
        "formula": "selected ~ C(race) * C(level)",
        "reference_categories": {"race": "white", "level": "LL"},
        "converged": bool(fit.success),
        "message": str(fit.message),
        "terms": terms,
        "interaction_terms": {name: terms[name] for name in names if ":" in name},
    }


def holm_bonferroni(tests: dict[str, dict[str, Any]]) -> dict[str, Any]:
    finite = [(level, result["p_value"]) for level, result in tests.items() if math.isfinite(result["p_value"])]
    ordered = sorted(finite, key=lambda item: item[1])
    adjusted, running = {}, 0.0
    total = len(ordered)
    for index, (level, p_value) in enumerate(ordered):
        running = max(running, (total - index) * p_value)
        adjusted[level] = min(1.0, running)
    return {level: {"adjusted_p_value": adjusted.get(level, math.nan), "reject_0.05": adjusted.get(level, 1.0) <= 0.05} for level in LEVELS}


def write_svg(path: Path, summaries: dict[str, dict[str, Any]]) -> None:
    width, height, left, top, chart_h = 760, 460, 75, 40, 330
    colors = {"LL": "#386cb0", "ML": "#f0027f", "EL": "#7fc97f"}
    x_positions = {"LL": 170, "ML": 380, "EL": 590}
    y = lambda value: top + chart_h * (1 - value / 100.0)
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">', '<rect width="100%" height="100%" fill="white"/>', '<text x="380" y="24" text-anchor="middle" font-family="sans-serif" font-size="18">Black share of advanced candidates</text>']
    for tick in range(0, 101, 20):
        py = y(tick)
        parts.extend([f'<line x1="{left}" y1="{py}" x2="700" y2="{py}" stroke="#ddd"/>', f'<text x="65" y="{py + 5}" text-anchor="end" font-family="sans-serif" font-size="12">{tick}%</text>'])
    for level in LEVELS:
        value = summaries[level]["black_selection_share_pct"]
        low, high = summaries[level]["bootstrap_95_ci_pct"]
        x = x_positions[level]
        if math.isfinite(value):
            parts.extend([f'<rect x="{x - 35}" y="{y(value)}" width="70" height="{y(0) - y(value)}" fill="{colors[level]}"/>', f'<line x1="{x}" y1="{y(low)}" x2="{x}" y2="{y(high)}" stroke="black" stroke-width="2"/>', f'<line x1="{x - 9}" y1="{y(low)}" x2="{x + 9}" y2="{y(low)}" stroke="black"/>', f'<line x1="{x - 9}" y1="{y(high)}" x2="{x + 9}" y2="{y(high)}" stroke="black"/>'])
        parts.extend([f'<circle cx="{x}" cy="{y(BASELINE[level])}" r="6" fill="white" stroke="black" stroke-width="2"/>', f'<text x="{x}" y="400" text-anchor="middle" font-family="sans-serif" font-size="14">{level}</text>'])
    parts.extend(['<text x="380" y="435" text-anchor="middle" font-family="sans-serif" font-size="12">Bars: current audit; open circles: 2024 baseline; whiskers: 1000× batch-cluster bootstrap CI</text>', '</svg>'])
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(parts) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=ROOT / "results/selections.csv")
    parser.add_argument("--analysis-dir", type=Path, default=ROOT / "analysis")
    parser.add_argument("--figure-dir", type=Path, default=ROOT / "figures")
    parser.add_argument("--seed", type=int, default=20260903)
    args = parser.parse_args()
    rows = load_rows(args.input)
    rng = np.random.default_rng(args.seed)
    summaries, chi_square = {}, {}
    for level in LEVELS:
        subset = [row for row in rows if row["level"] == level]
        if not subset:
            raise ValueError(f"no rows for level {level}")
        share = black_share(subset)
        ci = cluster_bootstrap_ci(subset, rng)
        summaries[level] = {
            "black_selection_share_pct": share,
            "bootstrap_95_ci_pct": ci,
            "baseline_2024_pct": BASELINE[level],
            "difference_from_baseline_points": share - BASELINE[level],
            "batches": len({row["batch"] for row in subset}),
            "selected": sum(row["selected"] for row in subset),
        }
        chi_square[level] = contingency(subset)
    dip = summaries["ML"]["black_selection_share_pct"] < min(summaries["LL"]["black_selection_share_pct"], summaries["EL"]["black_selection_share_pct"])
    output = {
        "bootstrap": {"replicates": 1000, "unit": "batch", "seed": args.seed},
        "levels": summaries,
        "chi_square": chi_square,
        "holm_bonferroni": holm_bonferroni(chi_square),
        "logistic_regression": logistic_regression(rows),
        "mid_level_dip_reproduces_descriptively": bool(dip),
        "full_sweep_required_for_inference": any(summary["batches"] < 15 for summary in summaries.values()),
    }
    write_json(args.analysis_dir / "summary.json", output)
    args.analysis_dir.mkdir(parents=True, exist_ok=True)
    report_lines = ["# Analysis report", "", "Validation-scale results; inferential estimates require the full sweep.", "", "| Level | Black share | 95% bootstrap CI | 2024 baseline | Difference |", "|---|---:|---:|---:|---:|"]
    for level in LEVELS:
        result = summaries[level]
        low, high = result["bootstrap_95_ci_pct"]
        report_lines.append(f"| {level} | {result['black_selection_share_pct']:.2f}% | [{low:.2f}, {high:.2f}] | {BASELINE[level]:.2f}% | {result['difference_from_baseline_points']:+.2f} pp |")
    report_lines.extend(["", f"Mid-level dip reproduces descriptively: **{'yes' if dip else 'no'}**.", "", "See `summary.json` for chi-square tests, Holm-adjusted p-values, and all logistic-regression terms."])
    (args.analysis_dir / "report.md").write_text("\n".join(report_lines) + "\n", encoding="utf-8")
    write_svg(args.figure_dir / "black_selection_share.svg", summaries)
    print(f"wrote analysis for {len(rows)} candidate rows")


if __name__ == "__main__":
    main()
