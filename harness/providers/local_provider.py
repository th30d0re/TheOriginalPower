"""LocalProvider — drives a local model CLI (mlx_lm.generate or configurable binary)."""

from __future__ import annotations

import os
import subprocess

from .base import BaseProvider, ProviderResult

# The binary can be overridden via environment variable LOCAL_MODEL_BINARY.
_DEFAULT_BINARY = "mlx_lm.generate"


class LocalProvider(BaseProvider):
    provider_id = "local"
    display_name = "Local Model"

    @property
    def _binary(self) -> str:
        return os.environ.get("LOCAL_MODEL_BINARY", _DEFAULT_BINARY)

    def query(self, prompt: str, timeout: int = 120) -> ProviderResult:
        binary = self._binary
        if not self._check_available():
            return ProviderResult(
                provider_id=self.provider_id,
                raw="",
                parsed=None,
                status="unavailable",
                error=f"{binary} binary not found on PATH",
            )

        try:
            result = subprocess.run(
                [binary, "--prompt", prompt],
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
                error=f"{binary} timed out after {timeout}s",
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
