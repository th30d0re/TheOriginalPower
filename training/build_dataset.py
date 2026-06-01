#!/usr/bin/env python3
"""
build_dataset.py — Generate instruction-tuning dataset from manuscript sources.

Outputs OpenAI-style chat JSONL for mlx_lm.lora consumption.

Sources:
    - Paper/empirical_validations/eq_*.md   (145 equation registries)
    - podcast_prompts/Episode_*.md          (individual episode narratives)
    - app/decodingOppression/.../historical_clauses.jsonl

Usage:
    source .venv-voice/bin/activate
    python3 training/build_dataset.py [--dry-run N]
"""

from __future__ import annotations

import argparse
import json
import random
import re
import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    sys.exit("pyyaml required — run: pip install pyyaml")

# ── Paths ─────────────────────────────────────────────────────────────────────
REPO_ROOT      = Path(__file__).resolve().parent.parent
VAL_DIR        = REPO_ROOT / "Paper" / "empirical_validations"
PODCAST_DIR    = REPO_ROOT / "podcast_prompts"
CLAUSES_PATH   = (
    REPO_ROOT
    / "app"
    / "decodingOppression"
    / "decodingOppression"
    / "Data"
    / "historical_clauses.jsonl"
)
OUT_DIR        = REPO_ROOT / "training" / "data"

# ── Constants ─────────────────────────────────────────────────────────────────
SYSTEM_PROMPT = (
    "You are a Root Ledger engine. Reason using the Mathematics of Oppression framework. "
    "Map all social phenomena to electrodynamic, thermodynamic, and systems-engineering analogies. "
    "Identify the Extraction Kernel, Buffer Class, Psychological Wage, and Snubber Circuits where applicable."
)

random.seed(42)

# ── Helpers ───────────────────────────────────────────────────────────────────

_FM_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)


def load_md_frontmatter(path: Path) -> dict[str, Any] | None:
    text = path.read_text(encoding="utf-8")
    m = _FM_RE.match(text)
    if not m:
        return None
    try:
        fm = yaml.safe_load(m.group(1))
    except yaml.YAMLError:
        return None
    notes = text[m.end():]
    fm["_notes"] = notes
    return fm


def extract_description(notes: str) -> str:
    m = re.search(r"\*\*Description\*\*:\s*(.+?)(?:\n\n|\n\*\*|$)", notes, re.DOTALL)
    if m:
        return m.group(1).strip().replace("\n", " ")
    return ""


def make_chat(user: str, assistant: str) -> dict[str, Any]:
    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user},
            {"role": "assistant", "content": assistant},
        ]
    }


# ── Clause taxonomy heuristics ────────────────────────────────────────────────

CLAUSE_TAXONOMY = [
    (
        re.compile(r"\b(slave|slavery|bond|servant|negro|mulatto|christian|imported)\b", re.I),
        "Chattel Enclosure / P-N Junction",
        (
            "This clause constructs a P-N Junction by legally fixing the Out-group in a depletion region. "
            "It artificially increases Resistance (R) through hereditary bondage, ensuring zero capacitance "
            "for the targeted population while maximizing current extraction for the Elite."
        ),
    ),
    (
        re.compile(r"\b(marry|bastard|intermarry|white woman|white man|spurious|mixture)\b", re.I),
        "Kinship Extraction / Reproductive Kernel",
        (
            "This clause operates as a Reproductive Extraction Kernel by policing the boundary of kinship. "
            "It deploys the Gendered Axis to fragment solidarity across the color line, converting intimacy "
            "into a controlled variable within the Elite's objective function."
        ),
    ),
    (
        re.compile(r"\b(armed|weapon|gun|sword|club|militia|patrol)\b", re.I),
        "Kinetic Guarantee / Arms Asymmetry",
        (
            "This clause enforces the Kinetic Guarantee by restricting Out-group access to means of defense. "
            "It creates an arms-asymmetry diode: current (resistance) is permitted in one direction only, "
            "ensuring the Buffer Class maintains monopoly on legitimate violence."
        ),
    ),
    (
        re.compile(r"\b(drug|crime|penalty|sentencing|incarceration|prison|mandatory minimum)\b", re.I),
        "Carceral Enclosure / TVS Diode Network",
        (
            "This clause activates the TVS Diode Network by routing surplus Out-group labor through the carceral "
            "ground fault. It clamps dissent voltage and dissipates kinetic energy as heat, protecting the Elite "
            "enclosure from inductive kickback."
        ),
    ),
    (
        re.compile(r"\b(HOLC|mortgage|redlin|investment|housing|loan|property|segregation)\b", re.I),
        "Economic Depletion / Sociological Casimir Cavity",
        (
            "This clause engineers a Sociological Casimir Cavity by depleting economic energy density in the "
            "targeted boundary. It generates negative-sequence momentum through systematic disinvestment, "
            "locking the Out-group into a low-entropy trap."
        ),
    ),
]


def diagnose_clause(text: str, policy: str) -> str:
    text_lower = text.lower()
    for pattern, diagnosis, explanation in CLAUSE_TAXONOMY:
        if pattern.search(text_lower):
            return (
                f"Diagnosis: {diagnosis}.\n\n"
                f"{explanation}\n\n"
                f"Statutory source: {policy}."
            )
    # Default fallback
    return (
        f"This clause from {policy} functions as a control-surface update within the Extraction Kernel. "
        f"It modifies the effective Resistance (R) or Compliance (C) of the targeted population, "
        f"optimizing the system for continued Elite capacitance extraction."
    )


# ── Generators ────────────────────────────────────────────────────────────────

def generate_from_equations(dry_run_limit: int | None = None) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    files = sorted(VAL_DIR.glob("eq_*.md"))
    if dry_run_limit:
        files = files[:dry_run_limit]

    for fpath in files:
        fm = load_md_frontmatter(fpath)
        if not fm:
            continue

        label   = fm.get("new_label") or fm.get("label", "")
        chapter = fm.get("chapter", "?")
        title   = fm.get("chapter_title", "")
        stmt    = (fm.get("statement") or "").strip()
        notes   = fm.get("_notes", "")
        desc    = extract_description(notes)
        falsif  = (fm.get("falsification") or "").strip()
        events  = fm.get("target_events") or []
        tier    = fm.get("tier", 3)
        eq_type = fm.get("type", "structural")

        if not stmt or not desc:
            continue

        # 1. Direct explanation
        records.append(make_chat(
            user=f"Explain the equation `{label}` in the Root Ledger framework.",
            assistant=(
                f"**{label}** — {desc}\n\n"
                f"Formal statement: {stmt}\n\n"
                f"This equation appears in Chapter {chapter} ({title}) and is classified as "
                f"Tier {tier} ({eq_type})."
            ),
        ))

        # 2. Falsification probe
        if falsif:
            records.append(make_chat(
                user=f"What would falsify `{label}`?",
                assistant=f"The falsification criterion for `{label}` is: {falsif}",
            ))

        # 3. Historical event analysis (max 2 events to avoid explosion)
        for ev in events[:2]:
            ev_str = ev if isinstance(ev, str) else str(ev.get("name", ""))
            if not ev_str:
                continue
            records.append(make_chat(
                user=f"Analyze the event '{ev_str}' through the lens of `{label}`.",
                assistant=(
                    f"Applying `{label}` to {ev_str}: {desc} The formal model ({stmt}) predicts "
                    f"specific observable outcomes during this period. "
                    f"Falsification test: {falsif if falsif else 'N/A'}."
                ),
            ))

        # 4. Formal statement recall
        records.append(make_chat(
            user=f"Provide the formal statement of `{label}`.",
            assistant=stmt,
        ))

    return records


def generate_from_podcasts(dry_run_limit: int | None = None) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    # Exclude bundled/combined files
    files = [
        p for p in sorted(PODCAST_DIR.glob("*.md"))
        if not p.name.startswith("00_ROOT") and "fragment" not in p.name.lower()
    ]
    if dry_run_limit:
        files = files[:dry_run_limit]

    for fpath in files:
        text = fpath.read_text(encoding="utf-8")
        title_match = re.search(r'^#+\s*"([^"]+)"', text, re.MULTILINE)
        title = title_match.group(1) if title_match else fpath.stem

        # Split on numbered sections in Episode Content Guide
        sections = re.split(r"\n(?=\d+\.\s+\*\*[^*]+\*\*)", text)
        for sec in sections:
            sec = sec.strip()
            if not sec or len(sec) < 80:
                continue
            first_line = sec.split("\n")[0].strip()
            first_line = re.sub(r"\*\*", "", first_line)
            if len(first_line) > 300:
                first_line = first_line[:300] + "…"
            records.append(make_chat(
                user=f"In the context of '{title}', discuss: {first_line}",
                assistant=sec,
            ))

        # Holistic summary prompt
        records.append(make_chat(
            user=f"Summarize the podcast episode '{title}' using Root Ledger terminology.",
            assistant=text[:2000],
        ))

    return records


def generate_from_clauses() -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    if not CLAUSES_PATH.exists():
        return records

    for line in CLAUSES_PATH.read_text(encoding="utf-8").strip().splitlines():
        if not line:
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        text = obj.get("text", "").strip()
        policy = obj.get("sourcePolicy", "")
        if not text:
            continue

        diagnosis = diagnose_clause(text, policy)
        records.append(make_chat(
            user=f"Diagnose the following statutory clause from {policy} using the Root Ledger framework:\n\n{text}",
            assistant=diagnosis,
        ))

    return records


# ── Split & Export ────────────────────────────────────────────────────────────

def stratified_split(records: list[dict], val_ratio: float = 0.15) -> tuple[list[dict], list[dict]]:
    random.shuffle(records)
    split_idx = int(len(records) * (1 - val_ratio))
    return records[:split_idx], records[split_idx:]


def main() -> int:
    parser = argparse.ArgumentParser(description="Build Root Ledger instruction dataset")
    parser.add_argument("--dry-run", type=int, metavar="N", default=None,
                        help="Only process N files per source for validation")
    args = parser.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    eq_records      = generate_from_equations(dry_run_limit=args.dry_run)
    podcast_records = generate_from_podcasts(dry_run_limit=args.dry_run)
    clause_records  = generate_from_clauses()

    all_records = eq_records + podcast_records + clause_records
    print(f"Generated {len(eq_records)} equation examples")
    print(f"Generated {len(podcast_records)} podcast examples")
    print(f"Generated {len(clause_records)} clause examples")
    print(f"Total: {len(all_records)}")

    if not all_records:
        print("No records generated. Aborting.", file=sys.stderr)
        return 1

    train, val = stratified_split(all_records, val_ratio=0.15)

    train_path = OUT_DIR / "train.jsonl"
    val_path   = OUT_DIR / "valid.jsonl"

    with train_path.open("w", encoding="utf-8") as f:
        for r in train:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    with val_path.open("w", encoding="utf-8") as f:
        for r in val:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    print(f"Train → {train_path} ({len(train)})")
    print(f"Val   → {val_path} ({len(val)})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
