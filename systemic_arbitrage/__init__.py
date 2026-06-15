"""Systemic Arbitrage Engine.

A deterministic trading subsystem that calibrates *The Original Power*
framework variables against historical cases, processes live spectral signals,
and paper-trades on Polymarket.
"""

__version__ = "0.1.0"
__all__ = ["calibrate", "interference_engine", "spectral", "trigger_engine"]
