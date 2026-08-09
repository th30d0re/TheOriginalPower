#!/usr/bin/env python3
"""Resumable per-chapter NotebookLM deep-dive driver.

One invocation processes exactly one pending unit from
Paper/research/chapter_deep_dives/manifest.json and exits.

Usage:
    python3 tools/chapter_deep_dive.py --next      # process lowest pending unit
    python3 tools/chapter_deep_dive.py --unit 7    # process a specific unit
    python3 tools/chapter_deep_dive.py --status    # print state summary

Loop:
    while python3 tools/chapter_deep_dive.py --next; do :; done

State lives in Paper/research/chapter_deep_dives/state.json, keyed by unit
number: notebook_id, source_id, artifact_id, status
(pending/uploaded/done/failed), attempts, error. Every step is idempotent:
re-running after a crash resumes from recorded state and never re-uploads a
source or re-creates a notebook that already exists.
"""

from __future__ import annotations

import argparse
import datetime
import json
import re
import subprocess
import sys
import time
from pathlib import Path

from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "Paper" / "research" / "chapter_deep_dives"
PDF_DIR = OUT_DIR / "pdf"
MANIFEST_PATH = OUT_DIR / "manifest.json"
STATE_PATH = OUT_DIR / "state.json"

MAX_ATTEMPTS = 2
SOURCE_WAIT_TIMEOUT = 1800  # seconds for nlm source add --wait
REPORT_POLL_INTERVAL = 30  # seconds between studio status polls
REPORT_POLL_TIMEOUT = 3600  # max seconds to wait for report generation

PROMPT_TEMPLATE = """Produce the longest and most detailed deep-dive analysis you can of this document, which is "{title}" from the book *The Original Power*. Cover: the central claim and how it is argued; every formal definition, equation, and theorem, with what each one asserts and what would falsify it; the historical cases and the evidence offered for each; the technical vocabulary introduced; how this section connects to the book's larger argument about extraction as an algorithm; and the stated limits or confidence tier of its claims. Preserve the author's own terminology. Use only this document."""


class UnitError(Exception):
    pass


def log(msg: str) -> None:
    print(f"[deepdive] {msg}", flush=True)


def load_manifest() -> dict:
    return json.loads(MANIFEST_PATH.read_text())


def load_state() -> dict:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text())
    return {}


def save_state(state: dict) -> None:
    tmp = STATE_PATH.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(state, indent=2, sort_keys=True))
    tmp.replace(STATE_PATH)


def unit_state(state: dict, n: int) -> dict:
    return state.setdefault(
        str(n),
        {
            "status": "pending",
            "attempts": 0,
            "notebook_id": None,
            "source_id": None,
            "artifact_id": None,
            "error": None,
        },
    )


def run_nlm(args: list[str], timeout: int) -> str:
    """Run an nlm subcommand, return combined stdout. Raise on failure."""
    cmd = ["nlm"] + args
    log(f"$ {' '.join(cmd)}")
    proc = subprocess.run(
        cmd, capture_output=True, text=True, timeout=timeout
    )
    out = (proc.stdout or "") + (proc.stderr or "")
    out = re.sub(r"\x1b\[[0-9;]*m", "", out)  # strip ANSI
    if proc.returncode != 0:
        raise UnitError(f"nlm {args[0]} {args[1]} failed (rc={proc.returncode}): {out[-2000:]}")
    return out


def extract_id(pattern: str, text: str, what: str) -> str:
    m = re.search(pattern, text)
    if not m:
        raise UnitError(f"could not parse {what} from nlm output: {text[-1000:]}")
    return m.group(1)


def split_pdf(pdf_path: Path, unit: dict, out_path: Path) -> None:
    """Write pages start..end (1-based inclusive) to out_path. Skip if valid."""
    expected = unit["pages"]
    if out_path.exists():
        try:
            if len(PdfReader(str(out_path)).pages) == expected:
                log(f"split exists with {expected} pages: {out_path.name}")
                return
        except Exception:
            pass
        out_path.unlink()
    reader = PdfReader(str(pdf_path))
    writer = PdfWriter()
    for p in range(unit["start"] - 1, unit["end"]):
        writer.add_page(reader.pages[p])
    with out_path.open("wb") as f:
        writer.write(f)
    got = len(PdfReader(str(out_path)).pages)
    if got != expected:
        raise UnitError(f"split page count mismatch: got {got}, expected {expected}")
    log(f"split pages {unit['start']}-{unit['end']} -> {out_path.name} ({got} pages)")


def poll_report(notebook_id: str, artifact_id: str) -> None:
    """Wait until the report artifact completes. Raise on failure/timeout."""
    deadline = time.time() + REPORT_POLL_TIMEOUT
    while time.time() < deadline:
        out = run_nlm(["studio", "status", notebook_id, "--json"], timeout=120)
        try:
            artifacts = json.loads(out[out.index("["): out.rindex("]") + 1])
        except (ValueError, json.JSONDecodeError) as e:
            raise UnitError(f"could not parse studio status JSON: {e}: {out[-500:]}")
        for art in artifacts:
            aid = art.get("id") or art.get("artifact_id")
            if aid == artifact_id:
                status = art.get("status", "unknown")
                log(f"report artifact status: {status}")
                if status == "completed":
                    return
                if status == "failed":
                    raise UnitError("NotebookLM report generation failed")
                break
        time.sleep(REPORT_POLL_INTERVAL)
    raise UnitError(f"report generation timed out after {REPORT_POLL_TIMEOUT}s")


def process_unit(manifest: dict, state: dict, unit: dict) -> None:
    n = unit["n"]
    slug = unit["slug"]
    title = unit["title"]
    st = unit_state(state, n)
    prefix = f"{n:02d}-{slug}"
    pdf_path = PDF_DIR / f"{prefix}.pdf"
    md_path = OUT_DIR / f"{prefix}.md"
    book_pdf = ROOT / manifest["pdf"]

    log(f"unit {n:02d} '{title}' (pages {unit['start']}-{unit['end']}, status={st['status']})")

    # 1. Split
    split_pdf(book_pdf, unit, pdf_path)

    # 2. Notebook
    if not st["notebook_id"]:
        out = run_nlm(["notebook", "create", f"TOP {n:02d} — {title}"], timeout=120)
        st["notebook_id"] = extract_id(r"ID:\s*([0-9a-f-]{36})", out, "notebook id")
        st["status"] = "pending"
        save_state(state)
    nb = st["notebook_id"]
    log(f"notebook: {nb}")

    # 3. Source
    if not st["source_id"]:
        out = run_nlm(
            ["source", "add", nb, "--file", str(pdf_path), "--wait",
             "--wait-timeout", str(SOURCE_WAIT_TIMEOUT)],
            timeout=SOURCE_WAIT_TIMEOUT + 120,
        )
        st["source_id"] = extract_id(r"Source ID:\s*([0-9a-f-]{36})", out, "source id")
        st["status"] = "uploaded"
        save_state(state)
    sid = st["source_id"]
    log(f"source: {sid}")

    # 4. Report
    if not st["artifact_id"]:
        prompt = PROMPT_TEMPLATE.format(title=title)
        out = run_nlm(
            ["report", "create", nb, "--format", "Create Your Own",
             "--prompt", prompt, "--source-ids", sid, "--confirm"],
            timeout=300,
        )
        st["artifact_id"] = extract_id(r"Artifact ID:\s*([0-9a-f-]{36})", out, "artifact id")
        save_state(state)
    aid = st["artifact_id"]
    log(f"artifact: {aid}")

    # 5. Wait for completion, download, save
    poll_report(nb, aid)
    tmp_md = OUT_DIR / f".{prefix}.download.md"
    run_nlm(["download", "report", nb, "--id", aid, "--output", str(tmp_md)], timeout=300)
    body = tmp_md.read_text()
    tmp_md.unlink()
    if len(body.strip()) < 200:
        raise UnitError(f"downloaded report suspiciously short ({len(body)} chars)")

    generated = datetime.date.today().isoformat()
    frontmatter = (
        "---\n"
        f"unit: {n}\n"
        f"title: {json.dumps(title)}\n"
        f"pages: {unit['pages']}\n"
        f"page_range: \"{unit['start']}-{unit['end']}\"\n"
        f"notebook_id: {nb}\n"
        f"generated: {generated}\n"
        "---\n\n"
    )
    md_path.write_text(frontmatter + body)
    st["status"] = "done"
    st["error"] = None
    save_state(state)
    log(f"done -> {md_path.name} ({len(body)} chars)")


def next_pending(manifest: dict, state: dict) -> dict | None:
    for unit in manifest["units"]:
        if unit["skip"]:
            continue
        st = unit_state(state, unit["n"])
        if st["status"] == "done" or (st["status"] == "failed" and st["attempts"] >= MAX_ATTEMPTS):
            continue
        return unit
    return None


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--next", action="store_true", help="process lowest pending unit")
    ap.add_argument("--unit", type=int, help="process a specific unit number")
    ap.add_argument("--status", action="store_true", help="print state summary")
    args = ap.parse_args()

    manifest = load_manifest()
    state = load_state()

    if args.status:
        counts: dict[str, int] = {}
        for unit in manifest["units"]:
            if unit["skip"]:
                continue
            st = unit_state(state, unit["n"])
            counts[st["status"]] = counts.get(st["status"], 0) + 1
            if st["status"] in ("failed",):
                print(f"  unit {unit['n']:02d} {unit['slug']}: {st['status']} x{st['attempts']} — {st.get('error')}")
        print("state:", json.dumps(counts))
        return 0

    if args.unit is not None:
        unit = next((u for u in manifest["units"] if u["n"] == args.unit), None)
        if unit is None:
            print(f"no unit {args.unit} in manifest", file=sys.stderr)
            return 2
    elif args.next:
        unit = next_pending(manifest, state)
        if unit is None:
            log("no pending units")
            return 1
    else:
        ap.print_help()
        return 2

    PDF_DIR.mkdir(parents=True, exist_ok=True)
    st = unit_state(state, unit["n"])
    try:
        process_unit(manifest, state, unit)
    except Exception as e:
        st["attempts"] += 1
        st["error"] = str(e)[-1500:]
        if st["attempts"] >= MAX_ATTEMPTS:
            st["status"] = "failed"
        save_state(state)
        log(f"ERROR unit {unit['n']:02d} (attempt {st['attempts']}): {e}")
        # Exit 0 so the driving loop continues to the next unit.
        return 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
