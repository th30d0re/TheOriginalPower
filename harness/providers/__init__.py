"""Provider package — CLI subprocess wrappers for Counter-Interference fan-out.

Exports:
    ALL_PROVIDERS  — list of instantiated BaseProvider subclasses
    get_provider   — lookup by provider_id string
"""

from __future__ import annotations

from .base import BaseProvider
# from .claude_provider import ClaudeProvider  # paused — account on hold
from .codex_provider import CodexProvider
from .gemini_provider import GeminiProvider
from .local_provider import LocalProvider

ALL_PROVIDERS: list[BaseProvider] = [
    # ClaudeProvider(),  # paused — account on hold
    CodexProvider(),
    GeminiProvider(),
    LocalProvider(),
]

_PROVIDER_MAP: dict[str, BaseProvider] = {p.provider_id: p for p in ALL_PROVIDERS}


def get_provider(provider_id: str) -> BaseProvider | None:
    """Return the provider with *provider_id*, or None if unknown."""
    return _PROVIDER_MAP.get(provider_id)
