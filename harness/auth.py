"""Shared-token authentication middleware for the harness daemon."""

import secrets
from pathlib import Path

from flask import request, jsonify

TOKEN_FILE = Path(__file__).parent.parent / ".harness_token"
_active_token: str | None = None


def generate_token() -> str:
    """Generate a random token, persist it to TOKEN_FILE, and return it."""
    global _active_token
    token = secrets.token_hex(32)
    TOKEN_FILE.write_text(token)
    TOKEN_FILE.chmod(0o600)
    _active_token = token
    return token


def _load_token() -> str:
    """Return the active token, reading from disk if not yet cached in memory."""
    global _active_token
    if _active_token is None:
        if TOKEN_FILE.exists():
            _active_token = TOKEN_FILE.read_text().strip()
        else:
            raise RuntimeError("Harness token not initialised — call generate_token() first.")
    return _active_token


def mask_token(token: str, visible: int = 4) -> str:
    """Return a non-authenticating masked representation for logs."""
    if len(token) <= visible * 2:
        return "***"
    return f"{token[:visible]}…{token[-visible:]}"


def require_token():
    """Flask before_request hook: return 401 when the bearer token is absent or wrong."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"status": "unauthorized", "detail": "missing bearer token"}), 401
    provided = auth_header.removeprefix("Bearer ").strip()
    try:
        expected = _load_token()
    except RuntimeError as exc:
        return jsonify({"status": "error", "detail": str(exc)}), 500
    if not secrets.compare_digest(provided, expected):
        return jsonify({"status": "unauthorized", "detail": "invalid token"}), 401
    return None
