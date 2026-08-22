"""Run one resumable counter-signal reel through brief, prompt, gate, and render."""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict
from pathlib import Path
from typing import Any

from counter_signal import brief, compose, lint, render

ROOT = Path(__file__).resolve().parent
RESPONSES_DIR = ROOT / "responses"
STATE_PATH = RESPONSES_DIR / "state.json"


def _write_json(path: Path, value: Any) -> None:
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n")


def _load_state() -> dict:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text())
    return {}


def _save_state(state: dict) -> None:
    RESPONSES_DIR.mkdir(parents=True, exist_ok=True)
    temporary = STATE_PATH.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(state, indent=2, sort_keys=True) + "\n")
    temporary.replace(STATE_PATH)


def _record(state: dict, slug: str, stage: str, *, gate: dict | None = None,
            error: str | None = None) -> None:
    entry = state.setdefault(slug, {})
    entry.update({"stage": stage, "gate": gate, "error": error})
    _save_state(state)


def run(slug: str, script_path: Path | None = None, *, should_render: bool = False) -> str:
    """Advance one slug as far as the supplied inputs permit and return its stage."""
    state = _load_state()
    out_dir = RESPONSES_DIR / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    try:
        current_brief = brief.build(slug)
        brief_data = asdict(current_brief)
        _write_json(out_dir / "brief.json", brief_data)
        _record(state, slug, "briefed")

        prompt = compose.build_prompt(current_brief)
        (out_dir / "prompt.md").write_text(prompt)
        _record(state, slug, "composed")

        if script_path is None:
            print(f"[{slug}] prompt written; provide --script FILE to continue")
            return "composed"

        candidate = script_path.read_text()
        stored_script = out_dir / "script.md"
        if stored_script.exists() and stored_script.read_text() != candidate:
            raise ValueError("script.md already exists with different content")
        stored_script.write_text(candidate)

        gate_result = lint.check(candidate)
        gate_data = asdict(gate_result)
        _write_json(out_dir / "gate.json", gate_data)
        if not gate_result.passed:
            _record(state, slug, "failed", gate=gate_data,
                    error="; ".join(gate_result.reasons))
            print(f"[{slug}] gate failed: {'; '.join(gate_result.reasons)}", file=sys.stderr)
            return "failed"
        _record(state, slug, "gated", gate=gate_data)

        if not should_render:
            print(f"[{slug}] gate passed; rerun with --render to submit")
            return "gated"

        render_path = out_dir / "render.json"
        if not render_path.exists():
            render_result = render.submit(candidate, current_brief.title)
            _write_json(render_path, render_result)
        _record(state, slug, "rendered", gate=gate_data)
        print(f"[{slug}] rendered")
        return "rendered"
    except Exception as exc:
        previous_gate = state.get(slug, {}).get("gate")
        _record(state, slug, "failed", gate=previous_gate, error=str(exc))
        raise


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--slug", required=True)
    parser.add_argument("--script", type=Path)
    parser.add_argument("--render", action="store_true")
    args = parser.parse_args(argv)
    stage = run(args.slug, args.script, should_render=args.render)
    return 1 if stage == "failed" else 0


if __name__ == "__main__":
    raise SystemExit(main())
