"""Phase 3 deterministic trigger engine.

Evaluates the three arbitrage triggers from the execution plan and returns
intended trades. No orders are executed here; the paper-trader wrapper in
polymarket/ handles execution.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from pathlib import Path
from typing import Any, Optional

import yaml


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


@dataclass
class CatalogMarket:
    slug_pattern: str
    description: str
    resolution_source: str
    min_daily_volume_usd: float
    min_book_depth_usd: float
    tradeable: bool
    non_tradeable_reason: Optional[str]
    side_override: Optional[Side]
    resolution_risk: Optional[str]


_CATALOG_PATH = Path(__file__).parent / "contract_catalog.yaml"


def load_catalog() -> dict:
    with _CATALOG_PATH.open() as fh:
        return yaml.safe_load(fh)


def _parse_archetypes(raw_archetypes: list[dict]) -> list[CatalogMarket]:
    result: list[CatalogMarket] = []
    for entry in raw_archetypes:
        floor = entry.get("liquidity_floor", {})
        raw_override = entry.get("side_override")
        side_override = Side[raw_override] if raw_override else None
        result.append(
            CatalogMarket(
                slug_pattern=entry["slug_pattern"],
                description=entry.get("description", ""),
                resolution_source=entry.get("resolution_source", ""),
                min_daily_volume_usd=float(floor.get("min_daily_volume_usd", 0)),
                min_book_depth_usd=float(floor.get("min_book_depth_usd", 0)),
                tradeable=bool(entry.get("tradeable", False)),
                non_tradeable_reason=entry.get("non_tradeable_reason"),
                side_override=side_override,
                resolution_risk=entry.get("resolution_risk"),
            )
        )
    return result


def _select_archetype(
    trigger_key: str,
    catalog: dict,
    market_liquidity: Optional[dict[str, float]],
) -> Optional[CatalogMarket]:
    trigger_block = catalog.get("triggers", {}).get(trigger_key, {})
    raw_archetypes = trigger_block.get("market_archetypes", [])
    archetypes = _parse_archetypes(raw_archetypes)

    for arch in archetypes:
        if not arch.tradeable:
            continue
        if market_liquidity is not None:
            daily_vol = market_liquidity.get("daily_volume_usd", 0.0)
            book_depth = market_liquidity.get("book_depth_usd", 0.0)
            if daily_vol < arch.min_daily_volume_usd or book_depth < arch.min_book_depth_usd:
                continue
        return arch

    return None


def _slug_from_pattern(pattern: str) -> str:
    return pattern.rstrip("*").rstrip("-")


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
    catalog: Optional[dict] = None,
    market_liquidity: Optional[dict[str, float]] = None,
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
    catalog:
        Parsed contract_catalog.yaml dict. When provided, slug resolution uses
        catalog archetypes filtered by tradeable flag and liquidity floor.
        When None, falls back to hardcoded slugs (backward-compatible).
    market_liquidity:
        Live liquidity keyed by "daily_volume_usd" and "book_depth_usd".
        Only used when catalog is provided. When absent, liquidity floor is
        assumed met.

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
        if catalog is not None:
            arch = _select_archetype("heat_shield_reversal", catalog, market_liquidity)
            slug = _slug_from_pattern(arch.slug_pattern) if arch else "signal-only"
            notional = _position_size(delta_p, config) if arch else 0.0
        else:
            slug = "legislative-reform"
            notional = _position_size(delta_p, config)
        trades.append(
            IntendedTrade(
                trigger=Trigger.HEAT_SHIELD_REVERSAL,
                market_slug=slug,
                side=Side.LONG,
                notional_usd=notional,
                reason="Buffer-class-dominant threat with P_real approaching tau",
            )
        )

    # Trigger 2: COINTELPRO Metric.
    if gate == "out_group_dominant" and preal_ratio >= 0.85:
        notional = _position_size(delta_p, config)
        if catalog is not None:
            arch = _select_archetype("cointelpro_metric", catalog, market_liquidity)
            if arch:
                # side_override in the catalog takes precedence over the default trigger side.
                effective_side = arch.side_override if arch.side_override else Side.SHORT
                trades.append(
                    IntendedTrade(
                        trigger=Trigger.COINTELPRO_METRIC,
                        market_slug=_slug_from_pattern(arch.slug_pattern),
                        side=effective_side,
                        notional_usd=notional,
                        reason="Out-group-dominant threat with P_real approaching tau",
                    )
                )
            else:
                trades.append(
                    IntendedTrade(
                        trigger=Trigger.COINTELPRO_METRIC,
                        market_slug="signal-only",
                        side=Side.SHORT,
                        notional_usd=0.0,
                        reason="Out-group-dominant threat with P_real approaching tau",
                    )
                )
        else:
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
        if catalog is not None:
            arch = _select_archetype("interference_spike", catalog, market_liquidity)
            slug = _slug_from_pattern(arch.slug_pattern) if arch else "signal-only"
            notional = _position_size(delta_p, config) if arch else 0.0
        else:
            slug = "trending-political-narrative"
            notional = _position_size(delta_p, config)
        trades.append(
            IntendedTrade(
                trigger=Trigger.INTERFERENCE_SPIKE,
                market_slug=slug,
                side=Side.SHORT,
                notional_usd=notional,
                reason="High O_x noise with flat P_real and crowd pricing structural change",
            )
        )

    return trades


def main() -> None:
    """CLI placeholder: load latest snapshot and print intended trades."""
    import json

    from systemic_arbitrage.interference_engine import compute_signals, ingest_baskets, load_config, load_variables

    config = load_config()
    variables = load_variables()
    df = ingest_baskets()
    snapshot = compute_signals(df, config, variables)
    catalog = load_catalog()
    trades = evaluate_triggers(snapshot, config, catalog=catalog)
    print(json.dumps([{"trigger": t.trigger.value, "side": t.side.value, "notional": t.notional_usd, "reason": t.reason} for t in trades], indent=2))


if __name__ == "__main__":
    main()
