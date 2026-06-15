"""Phase 3 deterministic trigger engine.

Evaluates the three arbitrage triggers from the execution plan and returns
intended trades. No orders are executed here; the paper-trader wrapper in
polymarket/ handles execution.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Any, Optional


class Side(Enum):
    LONG = "LONG"
    SHORT = "SHORT"
    NO_TRADE = "NO_TRADE"


class Trigger(Enum):
    HEAT_SHIELD_REVERSAL = "heat_shield_reversal"
    COINTELPRO_METRIC = "cointelpro_metric"
    INTERFERENCE_SPIKE = "interference_spike"


@dataclass
class IntendedTrade:
    trigger: Trigger
    market_slug: str
    side: Side
    notional_usd: float
    reason: str


def _position_size(delta_p: float, config: dict) -> float:
    """Map the governing-equation score to a capped notional size."""
    for entry in config.get("trading", {}).get("position_size_map", []):
        if delta_p < entry["threshold"]:
            return float(entry["size"])
    return 0.0


def evaluate_triggers(
    snapshot: dict[str, Any],
    config: dict,
    demographic_gate: Optional[str] = None,
    market_implied_change: Optional[float] = None,
) -> list[IntendedTrade]:
    """Evaluate the three deterministic triggers against a signal snapshot.

    Parameters
    ----------
    snapshot:
        Output of interference_engine.compute_signals.
    config:
        Runtime configuration.
    demographic_gate:
        "buffer_class_dominant", "out_group_dominant", or None.
    market_implied_change:
        Optional crowd-implied probability change for the interference-spike
        trigger.

    Returns
    -------
    List of intended trades (possibly empty).
    """
    trades: list[IntendedTrade] = []
    ox = snapshot.get("O_x", 0.0)
    preal = snapshot.get("P_real", 0.0)
    tau = snapshot.get("tau", 0.0)
    delta_p = snapshot.get("delta_P", 0.0)

    preal_ratio = preal / tau if tau > 0 else 0.0
    gate = demographic_gate or snapshot.get("demographic_gate", "unavailable")

    # Trigger 1: Heat Shield Reversal.
    if gate == "buffer_class_dominant" and preal_ratio >= 0.85:
        trades.append(
            IntendedTrade(
                trigger=Trigger.HEAT_SHIELD_REVERSAL,
                market_slug="legislative-reform",
                side=Side.LONG,
                notional_usd=_position_size(delta_p, config),
                reason="Buffer-class-dominant threat with P_real approaching tau",
            )
        )

    # Trigger 2: COINTELPRO Metric.
    if gate == "out_group_dominant" and preal_ratio >= 0.85:
        notional = _position_size(delta_p, config)
        trades.append(
            IntendedTrade(
                trigger=Trigger.COINTELPRO_METRIC,
                market_slug="reform",
                side=Side.SHORT,
                notional_usd=notional,
                reason="Out-group-dominant threat with P_real approaching tau",
            )
        )
        trades.append(
            IntendedTrade(
                trigger=Trigger.COINTELPRO_METRIC,
                market_slug="defense-surveillance-police",
                side=Side.LONG,
                notional_usd=notional,
                reason="Out-group-dominant threat predicts suppression allocation",
            )
        )

    # Trigger 3: Interference Engine Spike.
    if market_implied_change is not None and market_implied_change > 0.15 and ox > 0.85 and preal_ratio < 0.5:
        trades.append(
            IntendedTrade(
                trigger=Trigger.INTERFERENCE_SPIKE,
                market_slug="trending-political-narrative",
                side=Side.SHORT,
                notional_usd=_position_size(delta_p, config),
                reason="High O_x noise with flat P_real and crowd pricing structural change",
            )
        )

    return trades


def main() -> None:
    """CLI placeholder: load latest snapshot and print intended trades."""
    import json
    from pathlib import Path

    from systemic_arbitrage.interference_engine import compute_signals, ingest_baskets, load_config, load_variables

    config = load_config()
    variables = load_variables()
    df = ingest_baskets()
    snapshot = compute_signals(df, config, variables)
    trades = evaluate_triggers(snapshot, config)
    print(json.dumps([{"trigger": t.trigger.value, "side": t.side.value, "notional": t.notional_usd, "reason": t.reason} for t in trades], indent=2))


if __name__ == "__main__":
    main()
