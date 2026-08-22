"""Build deterministic script-writing prompts from counter-signal briefs."""

from __future__ import annotations

import argparse
from pathlib import Path

from counter_signal.brief import Brief, build as build_brief


def build_prompt(brief: Brief) -> str:
    """Return a complete, deterministic prompt for one response script."""
    axes = ", ".join(brief.deflection_axes) if brief.deflection_axes else "none recorded"
    obligations = "\n".join(
        f"{number}. {obligation}"
        for number, obligation in enumerate(brief.obligations, 1)
    )
    return (
        "Write a counter-signal response script for the source clip described below.\n\n"
        f"Source slug: {brief.slug}\n"
        f"Source title: {brief.title}\n"
        f"Grievance to preserve: {brief.grievance}\n"
        f"Identity/status axes to drop as causal variables: {axes}\n"
        f"Target: theta at or below {brief.target_theta_deg} degrees and psi_m at or "
        f"above {brief.target_psi_m}. This target guides the writing; do not claim the "
        "script has measured its own phase.\n\n"
        "Required obligations:\n"
        f"{obligations}\n\n"
        "Name the party that captured the value and describe the material flow in "
        "concrete terms. Preserve the grievance while removing the listed axes from "
        "the causal explanation. Naming any identity-band term fails the publication "
        "gate. Do not repeat such terms, including while rejecting or quoting them.\n\n"
        "Return only 90–150 seconds of spoken copy. Use plain sentences. Include no "
        "title, labels, bullets, stage directions, production notes, or citations. "
        "The output goes to text-to-speech verbatim.\n"
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slug")
    parser.add_argument("--out", type=Path, help="write the prompt to this file")
    args = parser.parse_args(argv)

    prompt = build_prompt(build_brief(args.slug))
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(prompt)
    else:
        print(prompt, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
