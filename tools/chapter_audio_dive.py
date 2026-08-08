#!/usr/bin/env python3
"""Resumable per-chapter NotebookLM Deep Dive audio driver.

Second phase of the per-chapter pipeline. `chapter_deep_dive.py` creates one
notebook per unit and writes a markdown analysis; this creates the Deep Dive
audio overview for those same notebooks and downloads the m4a.

The notebooks already exist and already hold exactly one source each, so this
reuses their ids from state.json and never uploads anything. Audio is scoped to
the unit's own source id, which keeps the isolation the first phase established.

One invocation processes exactly one pending unit and exits.

    python3 tools/chapter_audio_dive.py --next      # lowest pending unit
    python3 tools/chapter_audio_dive.py --unit 7    # a specific unit
    python3 tools/chapter_audio_dive.py --status    # state summary

Loop:
    while python3 tools/chapter_audio_dive.py --next; do :; done

State lives in Paper/research/chapter_deep_dives/audio_state.json, separate
from the markdown phase's state.json so the two phases can run concurrently
without clobbering each other's writes.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "Paper" / "research" / "chapter_deep_dives"
AUDIO_DIR = OUT_DIR / "audio"
MANIFEST_PATH = OUT_DIR / "manifest.json"
DIVE_STATE_PATH = OUT_DIR / "state.json"        # read-only here
STATE_PATH = OUT_DIR / "audio_state.json"

MAX_ATTEMPTS = 2
POLL_INTERVAL = 45      # audio takes minutes; polling faster just burns quota
POLL_TIMEOUT = 5400     # 90 min — long chapters generate slowly
DOWNLOAD_TIMEOUT = 1800

# The artifact reports `completed` before its media is fetchable: a download
# issued the instant status flips returns "Download failed for audio", while the
# identical command minutes later returns the file. Settle, then retry.
DOWNLOAD_SETTLE = 60
DOWNLOAD_RETRIES = 5
DOWNLOAD_BACKOFF = 90

# NotebookLM's own Deep Dive format at maximum length.
AUDIO_FORMAT = "deep_dive"
AUDIO_LENGTH = "long"

FOCUS_TEMPLATE = (
    'Cover "{title}" from the book The Original Power in as much depth as the '
    "format allows: its central claim, its formal definitions and equations, "
    "the historical cases it rests on, and how it fits the book's argument that "
    "extraction runs as an algorithm. Use the author's own terminology."
)


class UnitError(Exception):
    pass


def log(msg: str) -> None:
    print(f"[audio] {msg}", flush=True)


def load_json(path: Path, default=None):
    if not path.exists():
        return {} if default is None else default
    return json.loads(path.read_text())


def save_state(state: dict) -> None:
    STATE_PATH.write_text(json.dumps(state, indent=2, sort_keys=True) + "\n")


def unit_state(state: dict, n: int) -> dict:
    return state.setdefault(str(n), {
        "artifact_id": None,
        "audio_path": None,
        "attempts": 0,
        "error": None,
        "status": "pending",
    })


def run_nlm(args: list[str], timeout: int) -> str:
    cmd = ["nlm"] + args
    log(f"$ {' '.join(cmd)}")
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    out = (proc.stdout or "") + (proc.stderr or "")
    out = re.sub(r"\x1b\[[0-9;]*m", "", out)
    if proc.returncode != 0:
        raise UnitError(f"nlm {' '.join(args[:2])} failed (rc={proc.returncode}): {out[-2000:]}")
    return out


def find_audio_artifact(notebook_id: str) -> tuple[str, str] | None:
    """Return (artifact_id, status) of the notebook's audio overview, if any.

    Recovers the artifact after a crash that lost the id, so a re-run polls the
    generation already in flight instead of starting a second one.
    """
    out = run_nlm(["studio", "status", notebook_id, "--json"], timeout=120)
    try:
        artifacts = json.loads(out[out.index("["): out.rindex("]") + 1])
    except (ValueError, json.JSONDecodeError) as e:
        raise UnitError(f"could not parse studio status JSON: {e}: {out[-500:]}")
    for art in artifacts:
        kind = str(art.get("type") or art.get("artifact_type") or "").lower()
        if "audio" in kind:
            aid = art.get("id") or art.get("artifact_id")
            if aid:
                return aid, art.get("status", "unknown")
    return None


def poll_audio(notebook_id: str, artifact_id: str) -> None:
    deadline = time.time() + POLL_TIMEOUT
    while time.time() < deadline:
        found = find_audio_artifact(notebook_id)
        if found and found[0] == artifact_id:
            status = found[1]
            log(f"audio artifact status: {status}")
            if status == "completed":
                return
            if status == "failed":
                raise UnitError("NotebookLM audio generation failed")
        time.sleep(POLL_INTERVAL)
    raise UnitError(f"audio generation timed out after {POLL_TIMEOUT}s")


def process_unit(state: dict, unit: dict, dive: dict) -> None:
    n = unit["n"]
    st = unit_state(state, n)
    src = dive.get(str(n)) or {}
    notebook_id = src.get("notebook_id")
    source_id = src.get("source_id")
    if not notebook_id:
        raise UnitError(f"unit {n} has no notebook_id in state.json — run the markdown phase first")

    out_path = AUDIO_DIR / f"{n:02d}-{unit['slug']}.m4a"
    if out_path.exists() and out_path.stat().st_size > 100_000:
        log(f"audio already downloaded: {out_path.name}")
        st.update(status="done", audio_path=str(out_path.relative_to(ROOT)), error=None)
        return

    # Reuse an artifact already generating or generated for this notebook.
    if not st["artifact_id"]:
        found = find_audio_artifact(notebook_id)
        if found:
            st["artifact_id"] = found[0]
            log(f"adopted existing audio artifact {found[0]} ({found[1]})")

    if not st["artifact_id"]:
        args = ["audio", "create", notebook_id,
                "--format", AUDIO_FORMAT, "--length", AUDIO_LENGTH,
                "--focus", FOCUS_TEMPLATE.format(title=unit["title"]), "--confirm"]
        if source_id:
            args += ["--source-ids", source_id]
        run_nlm(args, timeout=600)
        found = find_audio_artifact(notebook_id)
        if not found:
            raise UnitError("audio create returned but no audio artifact appeared")
        st["artifact_id"] = found[0]
        save_state(state)

    poll_audio(notebook_id, st["artifact_id"])

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    log(f"settling {DOWNLOAD_SETTLE}s before download")
    time.sleep(DOWNLOAD_SETTLE)
    last = None
    for attempt in range(1, DOWNLOAD_RETRIES + 1):
        try:
            run_nlm(["download", "audio", notebook_id, "--id", st["artifact_id"],
                     "-o", str(out_path), "--no-progress"], timeout=DOWNLOAD_TIMEOUT)
            if out_path.exists() and out_path.stat().st_size >= 100_000:
                break
            last = UnitError(f"download produced no usable file at {out_path}")
        except UnitError as e:
            last = e
        if attempt < DOWNLOAD_RETRIES:
            wait = DOWNLOAD_BACKOFF * attempt
            log(f"download attempt {attempt} failed, retrying in {wait}s")
            time.sleep(wait)
    else:
        raise last or UnitError("download failed")

    mb = out_path.stat().st_size / 1_048_576
    log(f"unit {n} done: {out_path.name} ({mb:.1f} MB)")
    st.update(status="done", audio_path=str(out_path.relative_to(ROOT)), error=None)


def next_pending(manifest: dict, state: dict) -> dict | None:
    for unit in manifest["units"]:
        if unit.get("skip"):
            continue
        st = state.get(str(unit["n"]), {})
        if st.get("status") == "done":
            continue
        if st.get("status") == "failed" and st.get("attempts", 0) >= MAX_ATTEMPTS:
            continue
        return unit
    return None


def print_status(manifest: dict, state: dict) -> None:
    todo = [u for u in manifest["units"] if not u.get("skip")]
    counts: dict[str, int] = {}
    for u in todo:
        s = state.get(str(u["n"]), {}).get("status", "pending")
        counts[s] = counts.get(s, 0) + 1
    print(f"audio units: {len(todo)}  {counts}")
    for u in todo:
        st = state.get(str(u["n"]), {})
        if st.get("status") == "failed":
            print(f"  FAILED {u['n']:>2} {u['title'][:48]}: {str(st.get('error'))[:110]}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--next", action="store_true", help="process lowest pending unit")
    ap.add_argument("--unit", type=int, help="process a specific unit number")
    ap.add_argument("--status", action="store_true", help="print state summary")
    a = ap.parse_args()

    manifest = load_json(MANIFEST_PATH)
    state = load_json(STATE_PATH)
    dive = load_json(DIVE_STATE_PATH)

    if a.status:
        print_status(manifest, state)
        return 0

    if a.unit is not None:
        unit = next((u for u in manifest["units"] if u["n"] == a.unit), None)
        if not unit:
            print(f"no unit {a.unit}", file=sys.stderr)
            return 2
    else:
        unit = next_pending(manifest, state)
        if not unit:
            log("no pending units")
            return 1  # ends `while ...; do :; done`

    st = unit_state(state, unit["n"])
    st["attempts"] = st.get("attempts", 0) + 1
    log(f"unit {unit['n']}: {unit['title']} (attempt {st['attempts']})")
    try:
        process_unit(state, unit, dive)
    except (UnitError, subprocess.TimeoutExpired) as e:
        st["status"] = "failed"
        st["error"] = str(e)[:1500]
        log(f"unit {unit['n']} FAILED: {str(e)[:300]}")
        save_state(state)
        return 0  # let the loop advance past a bad unit
    save_state(state)
    return 0


if __name__ == "__main__":
    sys.exit(main())
