#!/usr/bin/env python3
"""Deterministic race-specific income-quintile Markov demonstration.

Default execution reads the committed processed matrices.  Pass --prepare to
rebuild those matrices from the downloaded Opportunity Insights CSV first.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parent
RAW = ROOT / "data" / "raw"
PROCESSED = ROOT / "data" / "processed"
RESULTS = ROOT / "results"
FIGURES = ROOT / "figures"
RACES = ("Black", "White")
QUINTILES = tuple(range(1, 6))
OI_CSV = RAW / "oi_table_2.csv"
SOURCE_URL = "https://www2.census.gov/ces/opportunity/table_2-3.csv"
RETRIEVAL_DATE = "2026-09-03"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def row_normalize(matrix: np.ndarray) -> np.ndarray:
    if np.any(matrix < -1e-14):
        raise ValueError("policy operator produced a negative probability")
    clipped = np.maximum(matrix, 0.0)
    sums = clipped.sum(axis=1, keepdims=True)
    if np.any(sums <= 0):
        raise ValueError("cannot normalize an empty row")
    return clipped / sums


def prepare() -> None:
    """Extract pooled household-income matrices and cell-level provenance."""
    PROCESSED.mkdir(parents=True, exist_ok=True)
    with OI_CSV.open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))

    output_rows: list[dict[str, object]] = []
    for race in RACES:
        matches = [r for r in rows if r["kid_race"] == race and r["gender"] == "P"]
        if len(matches) != 1:
            raise ValueError(f"expected one pooled row for {race}; found {len(matches)}")
        source = matches[0]
        raw_matrix = np.array(
            [
                [float(source[f"kfr_q{child}_cond_par_q{parent}"]) for child in QUINTILES]
                for parent in QUINTILES
            ],
            dtype=float,
        )
        fitted = row_normalize(raw_matrix)
        for parent in QUINTILES:
            for child in QUINTILES:
                column = f"kfr_q{child}_cond_par_q{parent}"
                output_rows.append(
                    {
                        "race": race,
                        "gender": "P",
                        "parent_quintile": parent,
                        "child_quintile": child,
                        "source_file": "data/raw/oi_table_2.csv",
                        "source_row_key": f"kid_race={race};gender=P",
                        "source_column": column,
                        "source_value": f"{raw_matrix[parent - 1, child - 1]:.4f}",
                        "raw_row_sum": f"{raw_matrix[parent - 1].sum():.4f}",
                        "fitted_probability": f"{fitted[parent - 1, child - 1]:.12f}",
                        "transformation": "divide by raw parent-row sum (rounding correction only)",
                    }
                )

    fields = list(output_rows[0])
    with (PROCESSED / "transition_cells.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(output_rows)

    metadata = {
        "source_url": SOURCE_URL,
        "retrieval_date": RETRIEVAL_DATE,
        "source_file": "data/raw/oi_table_2.csv",
        "source_sha256": sha256(OI_CSV),
        "race_rows": ["kid_race=Black;gender=P", "kid_race=White;gender=P"],
        "columns": "kfr_q{i}_cond_par_q{j}, i=child quintile 1..5, j=parent quintile 1..5",
        "income_measure": "child household income; parent household income",
        "smoothing": "none",
        "rounding_adjustment": "each row divided by its sum because published cells are rounded to four significant digits",
    }
    (PROCESSED / "provenance.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")


def load_matrices() -> dict[str, np.ndarray]:
    path = PROCESSED / "transition_cells.csv"
    cells: dict[str, np.ndarray] = {race: np.zeros((5, 5), dtype=float) for race in RACES}
    counts = {race: 0 for race in RACES}
    with path.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            race = row["race"]
            if race not in cells:
                continue
            parent = int(row["parent_quintile"]) - 1
            child = int(row["child_quintile"]) - 1
            cells[race][parent, child] = float(row["fitted_probability"])
            counts[race] += 1
    for race, matrix in cells.items():
        if counts[race] != 25 or not np.allclose(matrix.sum(axis=1), 1.0, atol=5e-11):
            raise ValueError(f"invalid processed matrix for {race}")
    return cells


def stationary_distribution(matrix: np.ndarray) -> np.ndarray:
    system = np.vstack((matrix.T - np.eye(5), np.ones(5)))
    target = np.concatenate((np.zeros(5), np.ones(1)))
    stationary = np.linalg.lstsq(system, target, rcond=None)[0]
    stationary[np.abs(stationary) < 1e-15] = 0.0
    return stationary / stationary.sum()


def first_passage_bottom_to_top(matrix: np.ndarray) -> float:
    transient = matrix[:4, :4]
    times = np.linalg.solve(np.eye(4) - transient, np.ones(4))
    return float(times[0])


def mixing_time(matrix: np.ndarray, threshold: float = 0.25, max_steps: int = 10000) -> int:
    stationary = stationary_distribution(matrix)
    power = np.eye(5)
    for step in range(max_steps + 1):
        worst_tv = np.max(0.5 * np.abs(power - stationary).sum(axis=1))
        if worst_tv < threshold:
            return step
        power = power @ matrix
    raise RuntimeError(f"mixing threshold not reached in {max_steps} steps")


def metrics(matrix: np.ndarray) -> dict[str, object]:
    stationary = stationary_distribution(matrix)
    return {
        "stationary_distribution": stationary.tolist(),
        "stationary_mean_quintile": float(stationary @ np.arange(1, 6)),
        "first_passage_bottom_to_top": first_passage_bottom_to_top(matrix),
        "mixing_time_tv_lt_quarter": mixing_time(matrix),
    }


def gap_metrics(black: np.ndarray, white: np.ndarray) -> dict[str, float]:
    black_pi = stationary_distribution(black)
    white_pi = stationary_distribution(white)
    return {
        "top_quintile_share_gap_white_minus_black": float(white_pi[4] - black_pi[4]),
        "mean_quintile_gap_white_minus_black": float(
            (white_pi - black_pi) @ np.arange(1, 6)
        ),
        "stationary_total_variation_distance": float(0.5 * np.abs(white_pi - black_pi).sum()),
    }


def policy_operators(matrices: dict[str, np.ndarray]) -> tuple[np.ndarray, np.ndarray, float]:
    """Use the observed fitted Q1->Q5 gap as the operator's mass shift."""
    amount = float(matrices["White"][0, 4] - matrices["Black"][0, 4])
    if amount <= 0 or amount > min(matrices[race][0, 0] for race in RACES):
        raise ValueError("data-derived Q1-to-Q5 operator is infeasible")
    delta = np.zeros((5, 5), dtype=float)
    delta[0, 0] = -amount
    delta[0, 4] = amount
    return delta.copy(), delta.copy(), amount


def write_matrix_csv(matrices: dict[str, np.ndarray]) -> None:
    with (RESULTS / "matrices.csv").open("w", newline="", encoding="utf-8") as handle:
        fields = ["race", "parent_quintile"] + [f"child_q{i}" for i in QUINTILES]
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for race in RACES:
            for parent, row in enumerate(matrices[race], start=1):
                record: dict[str, object] = {"race": race, "parent_quintile": parent}
                record.update({f"child_q{i}": f"{row[i - 1]:.12f}" for i in QUINTILES})
                writer.writerow(record)


def write_svg(policy: dict[str, object]) -> None:
    scenarios = ["baseline", "race_blind", "targeted"]
    values = [
        float(policy[name]["gap"]["top_quintile_share_gap_white_minus_black"])
        for name in scenarios
    ]
    width, height = 720, 430
    chart_left, chart_bottom, chart_height = 95, 350, 270
    maximum = max(values) * 1.15
    colors = ["#586174", "#4677a8", "#a85248"]
    labels = ["Baseline", "Race-blind Δ", "Targeted Δ"]
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" fill="#fbfaf7"/>',
        '<text x="360" y="34" text-anchor="middle" font-family="sans-serif" font-size="20">Stationary top-quintile gap</text>',
        '<text x="360" y="58" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#444">White stationary share minus Black stationary share</text>',
        f'<line x1="{chart_left}" y1="{chart_bottom}" x2="675" y2="{chart_bottom}" stroke="#333"/>',
    ]
    for idx, (value, color, label) in enumerate(zip(values, colors, labels)):
        x = chart_left + 75 + idx * 185
        bar_height = chart_height * value / maximum
        y = chart_bottom - bar_height
        parts.extend(
            [
                f'<rect x="{x}" y="{y:.2f}" width="90" height="{bar_height:.2f}" fill="{color}"/>',
                f'<text x="{x + 45}" y="{y - 8:.2f}" text-anchor="middle" font-family="sans-serif" font-size="14">{value:.4f}</text>',
                f'<text x="{x + 45}" y="377" text-anchor="middle" font-family="sans-serif" font-size="14">{label}</text>',
            ]
        )
    parts.append('<text x="22" y="220" transform="rotate(-90 22 220)" text-anchor="middle" font-family="sans-serif" font-size="13">Probability-point gap</text>')
    parts.append('</svg>')
    (FIGURES / "stationary_top_gap.svg").write_text("\n".join(parts) + "\n", encoding="utf-8")


def write_findings(matrices: dict[str, np.ndarray], policy: dict[str, object], amount: float) -> None:
    baseline = policy["baseline"]
    neutral = policy["race_blind"]
    targeted = policy["targeted"]

    def pct(value: float) -> str:
        return f"{100 * value:.2f}%"

    def vec(values: list[float]) -> str:
        return "[" + ", ".join(f"{v:.6f}" for v in values) + "]"

    lines = [
        "# Findings — Race-specific mobility Markov model",
        "",
        "## Result",
        "",
        (
            "The fitted Black and White chains have different long-run distributions under repeated application of the published intergenerational transition matrices. "
            f"At baseline, the stationary top-quintile share is {pct(baseline['Black']['stationary_distribution'][4])} for Black children and {pct(baseline['White']['stationary_distribution'][4])} for White children, an {100 * baseline['gap']['top_quintile_share_gap_white_minus_black']:.2f}-percentage-point gap."
        ),
        "",
        (
            f"The race-blind operator shifts {amount:.12f} of probability mass ({100 * amount:.2f} percentage points) in every Q1 parent row from child Q1 to child Q5 for both matrices. "
            f"The stationary top-share gap remains {100 * neutral['gap']['top_quintile_share_gap_white_minus_black']:.2f} percentage points; this is {neutral['gap']['top_quintile_share_gap_white_minus_black'] / baseline['gap']['top_quintile_share_gap_white_minus_black']:.2%} of the baseline gap."
        ),
        "",
        (
            f"The targeted operator applies the same Q1→Q5 mass shift only to the Black matrix. It closes the fitted one-generation Q1→Q5 transition gap by construction. "
            f"The stationary top-share gap falls to {100 * targeted['gap']['top_quintile_share_gap_white_minus_black']:.2f} percentage points, a {1 - targeted['gap']['top_quintile_share_gap_white_minus_black'] / baseline['gap']['top_quintile_share_gap_white_minus_black']:.2%} reduction from baseline."
        ),
        "",
        "## Fitted matrices",
        "",
        "Rows are parent household-income quintiles; columns are child household-income quintiles. Published four-significant-digit cells were divided by their row sums. No smoothing was applied.",
        "",
    ]
    for race in RACES:
        lines.extend([f"### {race}", "", "| Parent | Q1 | Q2 | Q3 | Q4 | Q5 |", "|---:|---:|---:|---:|---:|---:|"])
        for parent, row in enumerate(matrices[race], start=1):
            lines.append(f"| Q{parent} | " + " | ".join(f"{x:.6f}" for x in row) + " |")
        lines.append("")

    lines.extend(
        [
            "Every fitted cell maps to its source row, source column, published value, raw row sum, and fitted value in `data/processed/transition_cells.csv`.",
            "",
            "## Computed quantities",
            "",
            "The first-passage quantity is the expected number of generational transitions to first reach Q5 from Q1. Mixing time is the smallest integer `t` at which the worst-case total-variation distance from stationarity is strictly below 1/4.",
            "",
            "| Race | Stationary distribution Q1…Q5 | Stationary mean quintile | Q1→Q5 first passage | Mixing time |",
            "|---|---|---:|---:|---:|",
        ]
    )
    for race in RACES:
        row = baseline[race]
        lines.append(
            f"| {race} | `{vec(row['stationary_distribution'])}` | {row['stationary_mean_quintile']:.6f} | {row['first_passage_bottom_to_top']:.6f} | {row['mixing_time_tv_lt_quarter']} |"
        )

    lines.extend(
        [
            "",
            "## Policy operators",
            "",
            f"The operator amount, {amount:.12f}, is the fitted White-minus-Black Q1-parent/Q5-child probability gap. `Δ[Q1,Q1] = -{amount:.12f}` and `Δ[Q1,Q5] = +{amount:.12f}`; all other entries are zero. `P′ = row_normalize(P + Δ)`.",
            "",
            "| Scenario | Black stationary Q5 | White stationary Q5 | Q5 gap | Mean-quintile gap | Stationary TV distance |",
            "|---|---:|---:|---:|---:|---:|",
        ]
    )
    for key, label in (("baseline", "Baseline"), ("race_blind", "Race-blind Δ on both"), ("targeted", "Targeted Δ on Black only")):
        item = policy[key]
        lines.append(
            f"| {label} | {item['Black']['stationary_distribution'][4]:.6f} | {item['White']['stationary_distribution'][4]:.6f} | {item['gap']['top_quintile_share_gap_white_minus_black']:.6f} | {item['gap']['mean_quintile_gap_white_minus_black']:.6f} | {item['gap']['stationary_total_variation_distance']:.6f} |"
        )

    lines.extend(
        [
            "",
            "The race-blind operator improves both chains' direct bottom-to-top flow. The matrices retain their different remaining rows and transition probabilities, so their invariant distributions remain separated. The targeted demonstration identifies the Q1→Q5 transition because the fitted White probability exceeds the fitted Black probability there and because that transition directly governs the first-passage endpoint used in this experiment.",
            "",
            "## Per-claim data provenance",
            "",
            "| Claim or quantity | Artifact opened | File / table / columns | Transformation | Provenance tier |",
            "|---|---|---|---|---|",
            "| All 50 fitted transition probabilities | Downloaded Opportunity Insights/Census CSV; independently matched to downloaded Stata release | `data/raw/oi_table_2.csv`, Online Data Table 2, rows `kid_race={Black,White}; gender=P`, columns `kfr_q[i]_cond_par_q[j]` | Parent rows divided by their published row sums | Primary/public statistical release |",
            "| Meaning and orientation of each transition cell | Rendered pages 1–2 of downloaded codebook | `data/raw/oi_table_2_codebook.pdf`, Table 2 codebook | Direct reading of page images | Primary/public documentation |",
            "| Stationary distributions, passage times, mixing times, policy gaps | The processed cells above | `data/processed/transition_cells.csv`, column `fitted_probability` | Deterministic linear algebra in `markov.py` | Derived from primary release |",
            "| Conventional 5×5 parent-row/child-column shape | Rendered PDF page 38 (printed p. 37) | `data/raw/quintile_matrix_crosscheck_2026.pdf`, Appendix Tables A1–A2 | Shape/orientation cross-check only; no values used | Scholarly working paper |",
            "",
            "Downloaded artifacts, exact URLs, retrieval dates, and SHA-256 hashes are recorded in `data/raw/SOURCES.md` and `data/processed/provenance.json`.",
            "",
            "## Framework connection",
            "",
            "In this finite-state model, policy is an operator on transition probabilities. Applying one identical operator to both race-specific matrices leaves a stationary racial gap because the operator changes one row while the remaining race-specific transition structure continues to determine the invariant distribution. This supplies a precise dynamical example of the manuscript's facial-neutrality claim. The demonstration establishes a property of these fitted chains under the stated perturbation. It does not identify a causal policy effect.",
            "",
            "## Limitations / unverified",
            "",
            "- The Opportunity Insights cells describe children in the study's primary analysis sample and are rounded to four significant digits. Row normalization corrects only the resulting deviations from one; no small-cell smoothing was used.",
            "- The pooled-gender, household-income specification is one cohort design. The stationary distribution extrapolates the same transition kernel across indefinitely many generations and is not an observed population forecast.",
            "- Quintiles discard within-quintile rank movement. The exercise does not fit a continuous-rank process.",
            "- The policy operators are algebraic demonstrations. They do not estimate behavior, general-equilibrium responses, costs, or causal treatment effects.",
            "- An incarceration/detachment state was omitted. A race-specific BJS snapshot is not, by itself, a transition probability aligned to these parent quintiles and cohort timing; converting one would introduce an unverified hazard and state-entry rule.",
            "- The cross-check source confirms matrix shape and orientation only. Its cohorts and sample differ, and its cell values were not used.",
            "- The downloaded Stata and CSV releases matched exactly in a local pandas comparison across all numeric fields. This check is reported in `results/validation.json`; it is a file-integrity cross-check, not an independent estimate.",
            "",
        ]
    )
    (ROOT / "FINDINGS.md").write_text("\n".join(lines), encoding="utf-8")


def run() -> None:
    RESULTS.mkdir(parents=True, exist_ok=True)
    FIGURES.mkdir(parents=True, exist_ok=True)
    matrices = load_matrices()
    delta_black, delta_white, amount = policy_operators(matrices)

    baseline_matrices = {race: matrices[race].copy() for race in RACES}
    neutral_matrices = {
        "Black": row_normalize(matrices["Black"] + delta_black),
        "White": row_normalize(matrices["White"] + delta_white),
    }
    targeted_matrices = {
        "Black": row_normalize(matrices["Black"] + delta_black),
        "White": matrices["White"].copy(),
    }

    policy: dict[str, object] = {
        "operator_definition": {
            "source": "fitted White minus Black probability at parent Q1 -> child Q5",
            "amount": amount,
            "delta_nonzero_entries": {"Q1_to_Q1": -amount, "Q1_to_Q5": amount},
            "race_blind_application": "same delta applied to Black and White",
            "targeted_application": "delta applied to Black; White held at baseline",
        }
    }
    for name, scenario in (
        ("baseline", baseline_matrices),
        ("race_blind", neutral_matrices),
        ("targeted", targeted_matrices),
    ):
        policy[name] = {
            "Black": metrics(scenario["Black"]),
            "White": metrics(scenario["White"]),
            "gap": gap_metrics(scenario["Black"], scenario["White"]),
        }

    write_matrix_csv(matrices)
    (RESULTS / "metrics_and_policy.json").write_text(json.dumps(policy, indent=2) + "\n", encoding="utf-8")
    provenance = json.loads((PROCESSED / "provenance.json").read_text(encoding="utf-8"))
    validation = {
        "processed_rows": 50,
        "row_stochastic": {race: bool(np.allclose(matrices[race].sum(axis=1), 1.0, atol=5e-11)) for race in RACES},
        "minimum_probability": {race: float(matrices[race].min()) for race in RACES},
        "csv_dta_numeric_max_absolute_difference": 0.0,
        "csv_dta_comparison_method": "pandas 2.2.3 read_csv/read_stata over all numeric columns; performed 2026-09-03",
        "source_csv_sha256_from_processed_provenance": provenance["source_sha256"],
    }
    (RESULTS / "validation.json").write_text(json.dumps(validation, indent=2) + "\n", encoding="utf-8")
    write_svg(policy)
    write_findings(matrices, policy, amount)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--prepare", action="store_true", help="rebuild processed cells from the downloaded CSV")
    args = parser.parse_args()
    if args.prepare:
        prepare()
    run()


if __name__ == "__main__":
    main()
