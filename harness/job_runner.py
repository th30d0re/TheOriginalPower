"""Filesystem lock and single-runner guard for the harness daemon."""

import fcntl
import sys
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
LOCK_PATH = DATA_DIR / "harness.lock"

_lock_fh = None


def acquire_lock() -> None:
    """Acquire an exclusive process lock; exit if another instance holds it."""
    global _lock_fh
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    fh = open(LOCK_PATH, "w")
    try:
        fcntl.flock(fh, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        print(
            f"ERROR: harness daemon is already running (lock held at {LOCK_PATH}).",
            file=sys.stderr,
        )
        fh.close()
        sys.exit(1)
    fh.write(str(__import__("os").getpid()))
    fh.flush()
    _lock_fh = fh


def release_lock() -> None:
    """Release the filesystem lock (called on clean shutdown)."""
    global _lock_fh
    if _lock_fh is not None:
        fcntl.flock(_lock_fh, fcntl.LOCK_UN)
        _lock_fh.close()
        _lock_fh = None
        if LOCK_PATH.exists():
            LOCK_PATH.unlink()


def submit_job(fn, *args) -> dict:
    """Submit a background job. Stub only — real queue logic in T3+."""
    raise NotImplementedError("job_runner.submit_job is not implemented until T3")
