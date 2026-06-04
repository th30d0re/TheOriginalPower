"""Per-provider throttle state registry.

All state is module-level (in-process); the daemon is a singleton so this
is sufficient without an external store.
"""

from __future__ import annotations

import datetime

# Maps provider_id → datetime until which the provider is throttled, or None.
_throttled_until: dict[str, datetime.datetime | None] = {}


def set_throttled(provider_id: str, duration_seconds: int = 60) -> None:
    """Mark *provider_id* as throttled for *duration_seconds* seconds."""
    _throttled_until[provider_id] = datetime.datetime.utcnow() + datetime.timedelta(
        seconds=duration_seconds
    )


def is_throttled(provider_id: str) -> bool:
    """Return True if the provider is currently throttled."""
    until = _throttled_until.get(provider_id)
    if until is None:
        return False
    if datetime.datetime.utcnow() < until:
        return True
    # Expired — clean up.
    _throttled_until[provider_id] = None
    return False


def throttle_countdown(provider_id: str) -> int | None:
    """Return seconds remaining in the throttle window, or None if not throttled."""
    until = _throttled_until.get(provider_id)
    if until is None:
        return None
    remaining = (until - datetime.datetime.utcnow()).total_seconds()
    if remaining <= 0:
        _throttled_until[provider_id] = None
        return None
    return int(remaining)


def clear_throttle(provider_id: str) -> None:
    """Clear the throttle entry for *provider_id*."""
    _throttled_until[provider_id] = None
