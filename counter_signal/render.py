"""Gate and submit counter-signal scripts to MoneyPrinterTurbo."""

from __future__ import annotations

import json
import os
import urllib.request
from typing import Any

from counter_signal.lint import check

DEFAULT_BASE_URL = "http://127.0.0.1:8080"
ENDPOINT = "/api/v1/videos"

DEFAULT_PARAMS: dict[str, Any] = {
    "video_aspect": "9:16",
    "voice_name": "",
    "subtitle_enabled": True,
    "video_source": "pexels",
    "video_clip_duration": 5,
    "video_concat_mode": "random",
}


class GateRejected(ValueError):
    """Raised when a script fails the deterministic publication gate."""


def submit(script: str, subject: str, **overrides: Any) -> dict:
    """Submit a passing script and return MoneyPrinterTurbo's JSON response."""
    gate = check(script)
    if not gate.passed:
        raise GateRejected(
            "script failed the publication gate: " + "; ".join(gate.reasons)
        )

    unknown = sorted(set(overrides) - set(DEFAULT_PARAMS))
    if unknown:
        raise TypeError(f"unknown VideoParams override(s): {', '.join(unknown)}")

    payload = {
        "video_subject": subject,
        "video_script": script,
        **DEFAULT_PARAMS,
        **overrides,
    }
    body = json.dumps(payload).encode("utf-8")
    base_url = os.environ.get("MPT_BASE_URL", DEFAULT_BASE_URL).rstrip("/")
    request = urllib.request.Request(
        base_url + ENDPOINT,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request) as response:
        decoded = response.read().decode("utf-8")
    result = json.loads(decoded)
    if not isinstance(result, dict):
        raise ValueError("MoneyPrinterTurbo returned a non-object JSON response")
    return result
