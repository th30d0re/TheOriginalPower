"""Fit and test stability of alpha/beta framework coefficients."""

from __future__ import annotations

import argparse
import csv
import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING, Any, Sequence

import numpy as np
from scipy.optimize import minimize

if TYPE_CHECKING:
    from systemic_arbitrage.calibration_map import CalibrationMap

PACKAGE_ROOT = Path(__file__).resolve().parent
COEFFICIENTS_PATH = PACKAGE_ROOT / "data" / "reports" / "fitted_coefficients.json"
PAPER_TRADES_PATH = PACKAGE_ROOT / "data" / "paper_trades.jsonl"
REPLAY_PATH = PACKAGE_ROOT / "data" / "backtest" / "resolved_markets.csv"
REPLAY_SOURCE = "replayed_backtest"
REAL_SOURCE = "paper_trades"
L3_MIN_CLOSED_TRADES = 100
L3_MAX_RELATIVE_CHANGE = 0.05
logger = logging.getLogger(__name__)


@dataclass
class FittedCoefficients:
    alpha: float = 1.0
    beta: float = 1.0
    n_trades: int = 0
    brier_skill_improvement: float = 0.0
    fitted: bool = False

    def to_dict(self) -> dict[str, Any]:
        return {
            "alpha": self.alpha,
            "beta": self.beta,
            "n_trades": self.n_trades,
            "brier_skill_improvement": self.brier_skill_improvement,
            "fitted": self.fitted,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "FittedCoefficients":
        return cls(
            alpha=float(data["alpha"]),
            beta=float(data["beta"]),
            n_trades=int(data["n_trades"]),
            brier_skill_improvement=float(data["brier_skill_improvement"]),
            fitted=bool(data["fitted"]),
        )

    @classmethod
    def load(cls) -> "FittedCoefficients":
        """Load persisted coefficients; absence is unfitted and corruption is fatal."""
        if not COEFFICIENTS_PATH.exists():
            logger.warning("No fitted coefficients found at %s; using defaults", COEFFICIENTS_PATH)
            return cls()
        try:
            payload = json.loads(COEFFICIENTS_PATH.read_text())
            if not isinstance(payload, dict):
                raise TypeError("coefficient payload must be a JSON object")
            return cls.from_dict(payload)
        except (OSError, json.JSONDecodeError, KeyError, TypeError, ValueError) as exc:
            raise ValueError(f"Invalid fitted coefficient file {COEFFICIENTS_PATH}: {exc}") from exc

    def save(self) -> None:
        """Write fitted coefficients to the canonical report path."""
        COEFFICIENTS_PATH.parent.mkdir(parents=True, exist_ok=True)
        COEFFICIENTS_PATH.write_text(json.dumps(self.to_dict(), indent=2) + "\n")


@dataclass(frozen=True)
class RefitStabilityReport:
    source: str
    n_trades: int
    subset_size: int
    seed: int
    refits: dict[str, int]
    threshold: float
    reference: dict[str, float]
    coefficients: dict[str, dict[str, float | bool]]
    stable: bool

    def to_dict(self) -> dict[str, Any]:
        return {
            "source": self.source,
            "n_trades": self.n_trades,
            "subset_size": self.subset_size,
            "seed": self.seed,
            "refits": self.refits,
            "threshold": self.threshold,
            "reference": self.reference,
            "coefficients": self.coefficients,
            "stable": self.stable,
        }


@dataclass(frozen=True)
class L3Readiness:
    source: str
    genuine_closed_trades: int
    required_closed_trades: int
    stable_refit_available: bool
    max_relative_change_required: float
    met: bool

    def to_dict(self) -> dict[str, Any]:
        return {
            "source": self.source,
            "genuine_closed_trades": self.genuine_closed_trades,
            "required_closed_trades": self.required_closed_trades,
            "stable_refit_available": self.stable_refit_available,
            "max_relative_change_required": self.max_relative_change_required,
            "met": self.met,
        }


def recompute_delta_p(
    snapshot: dict[str, Any],
    alpha: float,
    beta: float,
    epsilon: float = 1e-6,
) -> float:
    """Recompute delta_P, including snapshots that preserve only baseline delta_P."""
    try:
        ox = float(snapshot["O_x"])
        preal = float(snapshot["P_real"])
        t = float(snapshot.get("T", preal))
        denominator = max(alpha * t * (1.0 - beta * ox), epsilon)
        if snapshot.get("V_E") is not None:
            return float(snapshot["V_E"]) / denominator
        baseline = float(snapshot["delta_P"])
        baseline_denominator = max(t * (1.0 - ox), epsilon)
        return baseline * baseline_denominator / denominator
    except (KeyError, TypeError, ValueError) as exc:
        raise ValueError(f"Snapshot lacks valid coefficient inputs: {snapshot}") from exc


def _brier_score(probs: np.ndarray, outcomes: np.ndarray) -> float:
    if len(probs) == 0:
        return float("nan")
    return float(np.mean((probs - outcomes) ** 2))


def _cross_entropy(
    params: np.ndarray,
    snapshots: list[dict[str, Any]],
    outcomes: np.ndarray,
    calib_map: "CalibrationMap",
    epsilon: float = 1e-12,
) -> float:
    alpha, beta = float(params[0]), float(params[1])
    delta_ps = np.array([recompute_delta_p(item, alpha, beta) for item in snapshots])
    probs = np.clip(calib_map.predict_batch(delta_ps), epsilon, 1.0 - epsilon)
    return float(-np.sum(outcomes * np.log(probs) + (1.0 - outcomes) * np.log(1.0 - probs)))


def _validate_outcome(value: Any, context: str) -> int:
    outcome = int(value)
    if outcome not in (0, 1):
        raise ValueError(f"{context}: resolution_outcome must be 0 or 1; got {value!r}")
    return outcome


def load_closed_trades(
    trade_log_path: Path,
    *,
    include_replayed: bool = False,
) -> list[dict[str, Any]]:
    """Load fit-ready closed trades, rejecting malformed records loudly."""
    if not trade_log_path.exists():
        return []
    closed: list[dict[str, Any]] = []
    for line_number, line in enumerate(trade_log_path.read_text().splitlines(), start=1):
        if not line.strip():
            continue
        context = f"{trade_log_path}: line {line_number}"
        try:
            record = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"{context}: invalid JSON: {exc}") from exc
        if not isinstance(record, dict):
            raise ValueError(f"{context}: trade record must be a JSON object")
        if not record.get("closed"):
            continue
        if record.get("source") == REPLAY_SOURCE and not include_replayed:
            continue
        snapshot = record.get("signal_snapshot")
        if not isinstance(snapshot, dict):
            raise ValueError(f"{context}: closed trade lacks signal_snapshot")
        outcome = record.get("resolution_outcome")
        if outcome is None:
            if record.get("pnl_usd") is None:
                raise ValueError(f"{context}: closed trade lacks outcome and pnl_usd")
            outcome = int(float(record["pnl_usd"]) > 0.0)
        closed.append({
            "snapshot": snapshot,
            "outcome": _validate_outcome(outcome, context),
            "source": record.get("source", REAL_SOURCE),
        })
    return closed


def fit_coefficients(
    records: Sequence[dict[str, Any]],
    calib_map: "CalibrationMap",
) -> FittedCoefficients:
    if not records:
        raise ValueError("At least one closed trade is required for fitting")
    snapshots = [record["snapshot"] for record in records]
    outcomes = np.array([record["outcome"] for record in records], dtype=float)
    result = minimize(
        _cross_entropy,
        x0=np.array([1.0, 1.0]),
        args=(snapshots, outcomes, calib_map),
        method="Powell",
        bounds=[(0.1, 5.0), (0.0, 2.0)],
        options={"xtol": 1e-9, "ftol": 1e-9, "maxiter": 2000},
    )
    if not result.success or not np.all(np.isfinite(result.x)):
        raise RuntimeError(f"Coefficient optimizer failed: {result.message}")
    return FittedCoefficients(
        alpha=float(result.x[0]),
        beta=float(result.x[1]),
        n_trades=len(records),
        fitted=True,
    )


def fit_from_closed_trades(
    trade_log_path: Path,
    calib_map: "CalibrationMap",
    min_trades: int = 10,
) -> FittedCoefficients:
    """Fit alpha and beta with chronological out-of-sample validation."""
    closed = load_closed_trades(trade_log_path)
    if len(closed) < min_trades:
        logger.warning(
            "Only %d genuine valid closed trades in %s; need %d, coefficients remain unfitted",
            len(closed), trade_log_path, min_trades,
        )
        return FittedCoefficients(n_trades=len(closed), fitted=False)

    split = max(1, int(len(closed) * 0.8))
    train, validation = closed[:split], closed[split:]
    fitted = fit_coefficients(train, calib_map)

    if validation:
        snapshots = [record["snapshot"] for record in validation]
        outcomes = np.array([record["outcome"] for record in validation], dtype=float)
        default_probs = calib_map.predict_batch(
            np.array([recompute_delta_p(item, 1.0, 1.0) for item in snapshots])
        )
        fitted_probs = calib_map.predict_batch(
            np.array([recompute_delta_p(item, fitted.alpha, fitted.beta) for item in snapshots])
        )
        brier_default = _brier_score(default_probs, outcomes)
        brier_fitted = _brier_score(fitted_probs, outcomes)
        if not np.isfinite(brier_default) or brier_default == 0.0:
            raise ValueError("Default validation Brier score is invalid")
        if brier_fitted >= brier_default:
            logger.warning("Fitted coefficients did not improve validation Brier score")
            return FittedCoefficients(n_trades=len(closed), fitted=False)
        fitted.brier_skill_improvement = float((brier_default - brier_fitted) / brier_default)

    fitted.n_trades = len(closed)
    fitted.save()
    return fitted


def replay_backtest_trades(path: Path = REPLAY_PATH) -> tuple[list[dict[str, Any]], "CalibrationMap"]:
    """Build in-memory, provenance-tagged closed trades from resolved backtest rows."""
    from systemic_arbitrage.calibration_map import CalibrationMap

    required = {"delta_p_at_entry", "market_prob_at_entry", "resolution_outcome"}
    records: list[dict[str, Any]] = []
    with path.open(newline="") as handle:
        reader = csv.DictReader(handle)
        missing = required.difference(reader.fieldnames or [])
        if missing:
            raise ValueError(f"{path} lacks required columns: {sorted(missing)}")
        for row_number, row in enumerate(reader, start=2):
            try:
                delta_p = float(row["delta_p_at_entry"])
                market_prob = float(row["market_prob_at_entry"])
                outcome = _validate_outcome(row["resolution_outcome"], f"{path}: row {row_number}")
            except (TypeError, ValueError) as exc:
                raise ValueError(f"{path}: invalid replay row {row_number}: {exc}") from exc
            if not np.isfinite(delta_p) or not np.isfinite(market_prob):
                raise ValueError(f"{path}: non-finite replay value on row {row_number}")
            if not 0.0 <= market_prob <= 1.0:
                raise ValueError(f"{path}: market probability outside [0, 1] on row {row_number}")
            records.append({
                "snapshot": {
                    "O_x": market_prob,
                    "P_real": 1.0,
                    "T": 1.0,
                    "delta_P": delta_p,
                    "source": REPLAY_SOURCE,
                },
                "outcome": outcome,
                "source": REPLAY_SOURCE,
            })
    if len(records) < 5:
        raise ValueError(f"{path} supplies {len(records)} rows; at least 5 are required")
    calibration = CalibrationMap().fit(
        np.array([record["snapshot"]["delta_P"] for record in records]),
        np.array([record["outcome"] for record in records]),
    )
    if not calibration.fitted:
        raise RuntimeError("Replay calibration map did not fit")
    return records, calibration


def _relative_change(reference: float, candidate: float, epsilon: float = 1e-12) -> float:
    """Return a symmetric relative change that remains defined at zero."""
    return abs(candidate - reference) / max(abs(reference), abs(candidate), epsilon)


def _maximum_pairwise_change(values: Sequence[float]) -> float:
    """Return the largest symmetric relative change among all fitted values."""
    return max(
        _relative_change(float(left), float(right))
        for index, left in enumerate(values)
        for right in values[index + 1 :]
    )


def refit_stability(
    records: Sequence[dict[str, Any]],
    calib_map: "CalibrationMap",
    *,
    source: str,
    subset_size: int = L3_MIN_CLOSED_TRADES,
    n_refits: int = 25,
    seed: int = 1729,
    threshold: float = L3_MAX_RELATIVE_CHANGE,
) -> RefitStabilityReport:
    """Measure per-coefficient movement across rolling and bootstrap refits."""
    if source not in {REPLAY_SOURCE, REAL_SOURCE}:
        raise ValueError(f"Unrecognized stability source: {source}")
    if not 2 <= subset_size <= len(records):
        raise ValueError(f"subset_size must be between 2 and {len(records)}")
    if n_refits < 1:
        raise ValueError("n_refits must be positive")
    record_sources = {record.get("source", REAL_SOURCE) for record in records}
    if record_sources != {source}:
        raise ValueError(f"Record sources {sorted(record_sources)} do not match report source {source!r}")

    reference_fit = fit_coefficients(records, calib_map)
    starts = np.linspace(0, len(records) - subset_size, num=n_refits, dtype=int)
    rolling_indices = [np.arange(start, start + subset_size) for start in starts]
    rng = np.random.default_rng(seed)
    bootstrap_indices = [rng.choice(len(records), size=subset_size, replace=True) for _ in range(n_refits)]
    fits = [
        fit_coefficients([records[int(index)] for index in indices], calib_map)
        for indices in rolling_indices + bootstrap_indices
    ]

    reference = {"alpha": reference_fit.alpha, "beta": reference_fit.beta}
    coefficient_results: dict[str, dict[str, float | bool]] = {}
    for name in ("alpha", "beta"):
        values = np.array([getattr(item, name) for item in fits], dtype=float)
        max_change = _maximum_pairwise_change([reference[name], *values.tolist()])
        coefficient_results[name] = {
            "reference": reference[name],
            "minimum": float(np.min(values)),
            "maximum": float(np.max(values)),
            "max_relative_change": float(max_change),
            "threshold": threshold,
            "stable": bool(max_change < threshold),
        }
    return RefitStabilityReport(
        source=source,
        n_trades=len(records),
        subset_size=subset_size,
        seed=seed,
        refits={"rolling": len(rolling_indices), "bootstrap": len(bootstrap_indices)},
        threshold=threshold,
        reference=reference,
        coefficients=coefficient_results,
        stable=all(bool(result["stable"]) for result in coefficient_results.values()),
    )


def count_genuine_closed_trades(path: Path = PAPER_TRADES_PATH) -> int:
    """Count closed paper trades while excluding replay-tagged records."""
    if not path.exists():
        return 0
    count = 0
    for line_number, line in enumerate(path.read_text().splitlines(), start=1):
        if not line.strip():
            continue
        try:
            record = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"{path}: invalid JSON on line {line_number}: {exc}") from exc
        if not isinstance(record, dict):
            raise ValueError(f"{path}: line {line_number} is not a JSON object")
        if record.get("closed") and record.get("source") != REPLAY_SOURCE:
            count += 1
    return count


def check_l3_readiness(
    paper_trades_path: Path = PAPER_TRADES_PATH,
    stability_report: RefitStabilityReport | None = None,
) -> L3Readiness:
    """Evaluate the real L3 gate; replayed stability never satisfies it."""
    closed = count_genuine_closed_trades(paper_trades_path)
    stable_real_refit = bool(
        stability_report is not None
        and stability_report.source == REAL_SOURCE
        and stability_report.stable
    )
    return L3Readiness(
        source=REAL_SOURCE,
        genuine_closed_trades=closed,
        required_closed_trades=L3_MIN_CLOSED_TRADES,
        stable_refit_available=stable_real_refit,
        max_relative_change_required=L3_MAX_RELATIVE_CHANGE,
        met=closed >= L3_MIN_CLOSED_TRADES and stable_real_refit,
    )


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--replayed-backtest", type=Path, default=REPLAY_PATH)
    parser.add_argument("--paper-trades", type=Path, default=PAPER_TRADES_PATH)
    parser.add_argument("--subset-size", type=int, default=L3_MIN_CLOSED_TRADES)
    parser.add_argument("--refits", type=int, default=25)
    parser.add_argument("--seed", type=int, default=1729)
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = _build_parser().parse_args(argv)
    records, calibration = replay_backtest_trades(args.replayed_backtest)
    report = refit_stability(
        records,
        calibration,
        source=REPLAY_SOURCE,
        subset_size=args.subset_size,
        n_refits=args.refits,
        seed=args.seed,
    )
    readiness = check_l3_readiness(args.paper_trades)
    print(f"Refit stability source: {report.source} ({report.n_trades} synthetic closed trades)")
    for name, result in report.coefficients.items():
        state = "PASS" if result["stable"] else "FAIL"
        print(
            f"{name}: max relative change={float(result['max_relative_change']):.2%} "
            f"(threshold < {report.threshold:.2%}) [{state}]"
        )
    readiness_state = "MET" if readiness.met else "NOT MET"
    print(
        f"L3 real readiness: {readiness_state}; genuine closed paper trades "
        f"{readiness.genuine_closed_trades}/{readiness.required_closed_trades}; "
        f"stable real refit available={readiness.stable_refit_available}"
    )
    print(json.dumps({"stability": report.to_dict(), "readiness": readiness.to_dict()}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
