"""Polymarket paper-trader and live client stubs.

Live trading is intentionally disabled by default. Use the dry-run path to
log intended trades without placing orders.
"""

from systemic_arbitrage.polymarket.client import PolymarketClient

__all__ = ["PolymarketClient"]
