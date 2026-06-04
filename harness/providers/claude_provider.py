"""ClaudeProvider — drives the `claude` CLI subprocess."""

from __future__ import annotations

import subprocess

from .base import BaseProvider, ProviderResult


class ClaudeProvider(BaseProvider):
    provider_id = "claude"
    display_name = "Claude Code"

    @property
    def _binary(self) -> str:
        return "claude"

    def query(self, prompt: str, timeout: int = 120) -> ProviderResult:
        if not self._check_available():
            return ProviderResult(
                provider_id=self.provider_id,
                raw="",
                parsed=None,
                status="unavailable",
                error="claude binary not found on PATH",
            )

        try:
            result = subprocess.run(
                ["claude", "-p", prompt],
                capture_output=True,
                text=True,
                timeout=timeout,
            )
            output = result.stdout + result.stderr
        except subprocess.TimeoutExpired:
            return ProviderResult(
                provider_id=self.provider_id,
                raw="",
                parsed=None,
                status="failed",
                error=f"claude timed out after {timeout}s",
            )
        except OSError as exc:
            return ProviderResult(
                provider_id=self.provider_id,
                raw="",
                parsed=None,
                status="failed",
                error=str(exc),
            )

        if result.returncode != 0:
            if self._detect_throttle(output):
                return ProviderResult(
                    provider_id=self.provider_id,
                    raw=output,
                    parsed=None,
                    status="throttled",
                    error=output[:500],
                )
            return ProviderResult(
                provider_id=self.provider_id,
                raw=output,
                parsed=None,
                status="failed",
                error=output[:500],
            )

        raw = result.stdout.strip()
        if not raw:
            return ProviderResult(
                provider_id=self.provider_id,
                raw="",
                parsed=None,
                status="unparseable",
                error="empty output",
            )

        return ProviderResult(
            provider_id=self.provider_id,
            raw=raw,
            parsed=raw,
            status="ok",
        )
