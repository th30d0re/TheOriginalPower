#!/usr/bin/env python3
"""Check that the editor and Makefile PDF builders share critical settings."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent.parent
MAKEFILE = ROOT / "Makefile"
SETTINGS = ROOT / ".vscode" / "settings.json"
HAZARD_REFERENCE = 'AGENTS.md, section "Build Hazards"'


def diagnose(field: str, expected: object, actual: object) -> str:
    """Return a consistent, actionable drift diagnosis."""
    return (
        f"builder drift: {field} differs; expected {expected!r}, "
        f"found {actual!r}. See {HAZARD_REFERENCE}."
    )


def read_build_epoch() -> str:
    text = MAKEFILE.read_text(encoding="utf-8")
    match = re.search(
        r"^\s*PDF_BUILD_EPOCH\s*(?:\?|:|\+)?=\s*([^\s#]+)",
        text,
        flags=re.MULTILINE,
    )
    if match is None:
        raise ValueError(
            diagnose("Makefile PDF_BUILD_EPOCH", "an assigned value", "missing")
        )
    return match.group(1)


def read_settings() -> dict[str, Any]:
    try:
        data = json.loads(SETTINGS.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ValueError(
            diagnose(".vscode/settings.json", "valid JSON", str(error))
        ) from error
    if not isinstance(data, dict):
        raise ValueError(
            diagnose(".vscode/settings.json root", "a JSON object", type(data).__name__)
        )
    return data


def find_latexmk(settings: dict[str, Any]) -> dict[str, Any]:
    tools = settings.get("latex-workshop.latex.tools")
    if not isinstance(tools, list):
        raise ValueError(
            diagnose("latex-workshop.latex.tools", "a list containing latexmk", tools)
        )
    for tool in tools:
        if isinstance(tool, dict) and tool.get("name") == "latexmk":
            return tool
    raise ValueError(
        diagnose("latex-workshop.latex.tools latexmk entry", "present", "missing")
    )


def check() -> list[str]:
    failures: list[str] = []
    try:
        epoch = read_build_epoch()
        settings = read_settings()
        latexmk = find_latexmk(settings)
    except (OSError, ValueError) as error:
        return [str(error)]

    env = latexmk.get("env")
    if not isinstance(env, dict):
        failures.append(diagnose("latexmk env", "a JSON object", env))
        env = {}

    expected_env = {
        "SOURCE_DATE_EPOCH": epoch,
        "FORCE_SOURCE_DATE": "1",
        "TZ": "UTC",
    }
    for name, expected in expected_env.items():
        actual = env.get(name)
        if actual != expected:
            failures.append(diagnose(f"latexmk env.{name}", expected, actual))

    path_value = env.get("PATH")
    first_path_entry = (
        path_value.split(":", 1)[0] if isinstance(path_value, str) else path_value
    )
    if not (
        isinstance(first_path_entry, str)
        and first_path_entry.endswith("/.tooling")
    ):
        failures.append(
            diagnose("latexmk env.PATH first entry", "a path ending in '/.tooling'", first_path_entry)
        )

    expected_root = "Paper/The_Original_Power.tex"
    actual_root = settings.get("latex-workshop.latex.rootFile")
    if actual_root != expected_root:
        failures.append(
            diagnose("latex-workshop.latex.rootFile", expected_root, actual_root)
        )

    return failures


def main() -> int:
    failures = check()
    if failures:
        print("Build consistency check failed:", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1
    print("Build consistency check passed: Makefile and editor settings agree.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
