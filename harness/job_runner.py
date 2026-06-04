"""Filesystem lock, single-runner guard, and thread-pool job submission.

Jobs submitted while one is already running are queued (FIFO) and executed
sequentially rather than rejected with "busy".
"""

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
# Job runner — FIFO queue with sequential execution
# ---------------------------------------------------------------------------

# _state_lock protects _current_job and _pending.
_state_lock = threading.Lock()
_current_job: dict | None = None
# Each entry: (fn, args, kwargs, event_queue, job_meta)
_pending: list[tuple] = []


def get_job_status() -> dict:
    """Return current job state including the list of queued job names."""
    with _state_lock:
        queued = [meta["fn"] for *_, meta in _pending]
        return {"running": _current_job is not None, "job": _current_job, "queued": queued}


def _start_job(fn: Callable, args: tuple, kwargs: dict, event_queue: queue.Queue) -> None:
    """Spawn a daemon thread that runs *fn* and drains _pending when done."""

    def _run() -> None:
        global _current_job
        try:
            fn(event_queue, *args, **kwargs)
        except Exception as exc:  # noqa: BLE001
            event_queue.put({"event": "error", "data": str(exc)})
        finally:
            event_queue.put(None)  # sentinel for streaming generator
            with _state_lock:
                if _pending:
                    next_fn, next_args, next_kwargs, next_eq, next_meta = _pending.pop(0)
                    _current_job = next_meta
                else:
                    _current_job = None
            # Start next job outside the lock to avoid re-entrant deadlock.
            if _current_job is not None:
                _start_job(next_fn, next_args, next_kwargs, next_eq)

    threading.Thread(target=_run, daemon=True).start()


def submit_job(fn: Callable, *args: Any, **kwargs: Any) -> queue.Queue:
    """
    Submit *fn* as a background job and return its event Queue.

    If a job is already running, *fn* is appended to the FIFO pending queue
    and will execute automatically after all preceding jobs complete.

    The Queue carries SSE-style dicts:
        {"event": "progress", "data": {...}}
        {"event": "done",     "data": result_dict}
        {"event": "error",    "data": "message string"}

    None is put on the Queue after the final event as a stop sentinel.
    """
    global _current_job

    event_queue: queue.Queue = queue.Queue()
    job_meta = {"fn": getattr(fn, "__name__", repr(fn)), "args": str(args)[:200]}

    with _state_lock:
        if _current_job is None:
            _current_job = job_meta
            start_now = True
        else:
            _pending.append((fn, args, kwargs, event_queue, job_meta))
            start_now = False

    if start_now:
        _start_job(fn, args, kwargs, event_queue)

    return event_queue
