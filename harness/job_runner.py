"""Filesystem lock, single-runner guard, and thread-pool job submission."""

from __future__ import annotations

import fcntl
import queue
import sys
import threading
from pathlib import Path
from typing import Any, Callable

DATA_DIR = Path(__file__).parent / "data"
LOCK_PATH = DATA_DIR / "harness.lock"

_lock_fh = None

# In-process job concurrency guard
_job_lock = threading.Lock()
_current_job: dict | None = None


# ---------------------------------------------------------------------------
# Process-level filesystem lock (daemon singleton)
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Job runner
# ---------------------------------------------------------------------------

def get_job_status() -> dict:
    """Return current job state."""
    return {"running": _job_lock.locked(), "job": _current_job}


def submit_job(fn: Callable, *args: Any, **kwargs: Any) -> dict | queue.Queue:
    """
    Submit *fn* as a background job.

    If a job is already running, returns {"status": "busy"} immediately.

    Otherwise starts *fn* in a daemon thread and returns a Queue that the
    caller can read for SSE events.  The thread communicates via the queue:

        {"event": "progress", "data": {...}}
        {"event": "done",     "data": result_dict}
        {"event": "error",    "data": "message string"}

    The sentinel None is put on the queue after the final event so the
    streaming generator knows when to stop.
    """
    global _current_job

    acquired = _job_lock.acquire(blocking=False)
    if not acquired:
        return {"status": "busy"}

    event_queue: queue.Queue = queue.Queue()

    def _run() -> None:
        global _current_job
        try:
            fn(event_queue, *args, **kwargs)
        except Exception as exc:  # noqa: BLE001
            event_queue.put({"event": "error", "data": str(exc)})
        finally:
            event_queue.put(None)  # sentinel
            _current_job = None
            _job_lock.release()

    _current_job = {"fn": getattr(fn, "__name__", repr(fn)), "args": str(args)[:200]}
    thread = threading.Thread(target=_run, daemon=True)
    thread.start()
    return event_queue
