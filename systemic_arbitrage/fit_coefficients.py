"""Fit alpha/beta framework coefficients from closed paper-trade outcomes."""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING

import numpy as np
from scipy.optimize import minimize

if TYPE_CHECKING:
    from systemic_arbitrage.calibration_map import CalibrationMap

COEFFICIENTS_PATH = Path(__file__).parent / "data" / "reports" / "fitted_coefficients.json"
logger = logging.getLogger(__name__)


@dataclass
class FittedCoefficients:
    alpha: float = 1.0
    beta: float = 1.0
    n_trades: int = 0
    brier_skill_improvement: float = 0.0
    fitted: bool = False

    def to_dict(self) -> dict:
        return {
            "alpha": self.alpha,
            "beta": self.beta,
            "n_trades": self.n_trades,
            "brier_skill_improvement": self.brier_skill_improvement,
            "fitted": self.fitted,
        }

    @classmethod
    def from_dict(cls, d: dict) -> "FittedCoefficients":
        return cls(
            alpha=d["alpha"],
            beta=d["beta"],
            n_trades=d["n_trades"],
            brier_skill_improvement=d["brier_skill_improvement"],
            fitted=d["fitted"],
        )

    @classmethod
    def load(cls) -> "FittedCoefficients":
        """Load from fitted_coefficients.json or return defaults."""
        if not COEFFICIENTS_PATH.exists():
            logger.warning(
                "No fitted coefficients found at %s; using defaults",
                COEFFICIENTS_PATH,
            )
            return cls()
        try:
            return cls.from_dict(json.loads(COEFFICIENTS_PATH.read_text()))
        except Exception as exc:
            logger.warning(
                "Could not load fitted coefficients from %s: %s; using defaults",
                COEFFICIENTS_PATH, exc,
            )
            return cls()

    def save(self) -> None:
        """Write to fitted_coefficients.json."""
        COEFFICIENTS_PATH.parent.mkdir(parents=True, exist_ok=True)
        COEFFICIENTS_PATH.write_text(json.dumps(self.to_dict(), indent=2))


def recompute_delta_p(
    snapshot: dict,
    alpha: float,
    beta: float,
    epsilon: float = 1e-6,
) -> float:
    """Recompute delta_P under candidate coefficients from a stored signal_snapshot."""
    ox = snapshot.get("O_x", 0.0) or 0.0
    preal = snapshot.get("P_real", 0.0) or 0.0
    ve = snapshot.get("V_E", 0.0) or 0.0
    t = snapshot.get("T", preal) or preal
    denom = max(alpha * t * (1.0 - beta * ox), epsilon)
    return float(ve / denom)


def _brier_score(probs: np.ndarray, outcomes: np.ndarray) -> float:
    if len(probs) == 0:
        return float("nan")
    return float(np.mean((probs - outcomes) ** 2))


def _cross_entropy(
    params: np.ndarray,
    snapshots: list[dict],
    outcomes: np.ndarray,
    calib_map: "CalibrationMap",
    epsilon: float = 1e-12,
) -> float:
    alpha, beta = float(params[0]), float(params[1])
    delta_ps = np.array([recompute_delta_p(s, alpha, beta) for s in snapshots])
    probs = np.clip(calib_map.predict_batch(delta_ps), epsilon, 1.0 - epsilon)
    return float(-np.sum(outcomes * np.log(probs) + (1.0 - outcomes) * np.log(1.0 - probs)))


def fit_from_closed_trades(
    trade_log_path: Path,
    calib_map: "CalibrationMap",
    min_trades: int = 10,
) -> FittedCoefficients:
    """Fit alpha and beta from closed paper trades via L-BFGS-B on binary cross-entropy."""
    if not trade_log_path.exists():
        logger.warning(
            "Trade log %s does not exist; coefficients remain unfitted",
            trade_log_path,
        )
        return FittedCoefficients(fitted=False)

    lines = [line for line in trade_log_path.read_text().splitlines() if line.strip()]
    closed: list[dict] = []
    for line in lines:
        try:
            record = json.loads(line)
            if not record.get("closed"):
                continue
            if not record.get("signal_snapshot"):
                continue
            outcome = record.get("resolution_outcome")
            if outcome is None:
                pnl = record.get("pnl_usd", 0.0) or 0.0
                outcome = 1 if pnl > 0 else 0
            closed.append({"snapshot": record["signal_snapshot"], "outcome": int(outcome)})
        except Exception as exc:
            logger.warning(
                "Skipping malformed trade record in %s: %s",
                trade_log_path, exc,
            )
            continue

    if len(closed) < min_trades:
        logger.warning(
            "Only %d valid closed trades in %s; need %d, coefficients remain unfitted",
            len(closed), trade_log_path, min_trades,
        )
        return FittedCoefficients(n_trades=len(closed), fitted=False)

    split = max(1, int(len(closed) * 0.8))
    train = closed[:split]
    val = closed[split:]

    train_snapshots = [r["snapshot"] for r in train]
    train_outcomes = np.array([r["outcome"] for r in train], dtype=float)
    val_snapshots = [r["snapshot"] for r in val]
    val_outcomes = np.array([r["outcome"] for r in val], dtype=float)

    result = minimize(
        _cross_entropy,
        x0=np.array([1.0, 1.0]),
        args=(train_snapshots, train_outcomes, calib_map),
        method="L-BFGS-B",
        bounds=[(0.1, 5.0), (0.0, 2.0)],
    )

    alpha_fit, beta_fit = float(result.x[0]), float(result.x[1])

    if len(val_snapshots) == 0:
        skill_improvement = 0.0
    else:
        default_delta_ps = np.array([recompute_delta_p(s, 1.0, 1.0) for s in val_snapshots])
        fitted_delta_ps = np.array([recompute_delta_p(s, alpha_fit, beta_fit) for s in val_snapshots])
        default_probs = calib_map.predict_batch(default_delta_ps)
        fitted_probs = calib_map.predict_batch(fitted_delta_ps)
        brier_default = _brier_score(default_probs, val_outcomes)
        brier_fitted = _brier_score(fitted_probs, val_outcomes)

        if np.isnan(brier_default) or brier_default == 0.0:
            logger.warning(
                "Default validation Brier score is invalid; coefficients remain unfitted"
            )
            return FittedCoefficients(n_trades=len(closed), fitted=False)

        if brier_fitted >= brier_default:
            logger.warning(
                "Fitted coefficients did not improve validation Brier score; "
                "coefficients remain unfitted"
            )
            return FittedCoefficients(n_trades=len(closed), fitted=False)

        skill_improvement = float((brier_default - brier_fitted) / brier_default)

    coeffs = FittedCoefficients(
        alpha=alpha_fit,
        beta=beta_fit,
        n_trades=len(closed),
        brier_skill_improvement=skill_improvement,
        fitted=True,
    )
    coeffs.save()
    return coeffs
