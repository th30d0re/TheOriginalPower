"""Shared provider contract for Counter-Interference CLI wrappers."""

from __future__ import annotations

import shutil
from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class ProviderResult:
    provider_id: str
    raw: str
    parsed: str | None
    status: str  # "ok" | "unavailable" | "failed" | "unparseable" | "throttled"
    error: str | None = field(default=None)


class BaseProvider(ABC):
    """Abstract base for a CLI-backed inference provider."""

    provider_id: str = ""
    display_name: str = ""

    @abstractmethod
    def query(self, prompt: str, timeout: int = 120) -> ProviderResult:
        """Submit *prompt* to the provider; return a ProviderResult."""

    def _check_available(self) -> bool:
        """Return True if the provider binary is on PATH."""
        return shutil.which(self._binary) is not None

    @property
    def _binary(self) -> str:
        """The CLI binary name; subclasses override if different from provider_id."""
        return self.provider_id

    _THROTTLE_SIGNALS: frozenset[str] = frozenset({
        "429",
        "rate limit",
        "rate_limit",
        "ratelimit",
        "quota exceeded",
        "too many requests",
        "overloaded",
        "retry after",
    })

    def _detect_throttle(self, output: str) -> bool:
        """Return True if *output* contains rate-limit / ban signals."""
        lower = output.lower()
        return any(signal in lower for signal in self._THROTTLE_SIGNALS)
