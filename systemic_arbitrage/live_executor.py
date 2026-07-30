"""Live order executor — opt-in only via SYSTEMIC_ARBITRAGE_LIVE=1.

This module places real orders on Polymarket. All promotion gates must pass
before any call to execute_live_session(). Default mode is paper trading.
"""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path
from typing import Optional

from systemic_arbitrage.calibration_map import CalibrationMap

logger = logging.getLogger(__name__)

_PACKAGE_ROOT = Path(__file__).resolve().parent
_REPORTS_DIR = _PACKAGE_ROOT / "data" / "reports"
_LIVE_LOG_PATH = _PACKAGE_ROOT / "data" / "live_intended_trades.jsonl"


def _load_calibration_map() -> CalibrationMap:
    """Load the newest fitted map, warning before any unfitted fallback."""
    report_pattern = "backtest_*.json"
    candidates = sorted(_REPORTS_DIR.glob(report_pattern), reverse=True)
    if not candidates:
        logger.warning(
            "No backtest report matched %r in %s; using unfitted calibration map",
            report_pattern, _REPORTS_DIR,
        )
        return CalibrationMap()
    for path in candidates:
        try:
            data = json.loads(path.read_text())
            calibration = CalibrationMap.from_dict(
                data["aggregate"]["calibration_final"]
            )
            if calibration.fitted:
                return calibration
            logger.warning(
                "Calibration map at aggregate.calibration_final in %s is unfitted",
                path,
            )
        except Exception as exc:
            logger.warning(
                "Could not load aggregate.calibration_final from %s: %s", path, exc
            )
    logger.warning(
        "No fitted calibration map found at aggregate.calibration_final in %s; "
        "using unfitted calibration map",
        _REPORTS_DIR,
    )
    return CalibrationMap()


def _require_live_flag() -> None:
    if os.environ.get("SYSTEMIC_ARBITRAGE_LIVE", "0") != "1":
        raise RuntimeError(
            "Live trading requires SYSTEMIC_ARBITRAGE_LIVE=1. "
            "Use paper-run for paper trading."
        )


def _check_promotion_gates(config: dict, trade_log_path: Path) -> tuple[bool, list[str]]:
    """Check all promotion gates; return (gates_pass, failed_reasons)."""
    failed: list[str] = []

    promotion = config.get("trading", {}).get("promotion_gate", {})
    min_closed = int(promotion.get("min_closed_trades", 200))

    n_closed = 0
    if trade_log_path.exists():
        for line in trade_log_path.read_text().splitlines():
            if not line.strip():
                continue
            try:
                record = json.loads(line)
                if record.get("closed"):
                    n_closed += 1
            except Exception as exc:
                logger.warning(
                    "Skipping malformed trade record in %s: %s",
                    trade_log_path, exc,
                )
                continue

    if n_closed < min_closed:
        failed.append(
            f"min_closed_trades not met: {n_closed} < {min_closed}"
        )

    candidates = sorted(_REPORTS_DIR.glob("backtest_*.json"), reverse=True)
    latest_report: Optional[dict] = None
    for path in candidates:
        try:
            latest_report = json.loads(path.read_text())
            break
        except Exception as exc:
            logger.warning("Could not parse backtest report %s: %s", path, exc)
            continue

    if latest_report is None:
        failed.append("no backtest report found — run arbitrage-backtest first")
    else:
        agg = latest_report.get("aggregate", {})

        edge_ci = agg.get("edge_ci", [None, None])
        if not (isinstance(edge_ci, list) and len(edge_ci) == 2 and
                edge_ci[0] is not None and edge_ci[0] > 0):
            failed.append("walk-forward edge CI does not exclude zero")

        brier_skill = agg.get("brier_skill", None)
        if brier_skill is None or brier_skill <= 0:
            failed.append("brier_skill <= 0 (model does not beat market)")

        beats_momentum = agg.get("beats_momentum", False)
        if not beats_momentum:
            failed.append("model does not beat momentum baseline")

    calibration_map = _load_calibration_map()
    if not calibration_map.fitted:
        failed.append("backtest calibration map is missing or unfitted")

    from systemic_arbitrage.fit_coefficients import FittedCoefficients
    coeffs = FittedCoefficients.load()
    if not coeffs.fitted or coeffs.brier_skill_improvement <= 0:
        failed.append("fitted coefficients not validated OOS — run fit-coefficients first")

    return (len(failed) == 0, failed)


def execute_live_session(
    config: dict,
    fitted_coefficients: "object",
    demographic_gate: Optional[str] = None,
    edge_threshold: float = 0.04,
) -> list[dict]:
    """Live trading session with full gate enforcement."""
    _require_live_flag()

    trade_log_path = Path(
        config.get("paths", {}).get(
            "trade_log",
            str(_PACKAGE_ROOT / "data" / "paper_trades.jsonl"),
        )
    )

    gates_pass, reasons = _check_promotion_gates(config, trade_log_path)
    if not gates_pass:
        raise RuntimeError(f"Promotion gates not met: {reasons}")

    _LIVE_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)

    raise NotImplementedError(
        "Live order placement (Polymarket CLOB API) is not yet wired. "
        "This is intentional — see Phase 4 follow-on PR."
    )
