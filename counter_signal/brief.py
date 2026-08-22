"""Turn a videolab job's framework diagnosis into a response brief.

The brief is mechanical, not creative: framework_notes already records where the
clip sits, so the obligations follow from the reading. The response does not
argue with the clip. It carries the same grievance to the material axis and
answers the question the clip left unasked, which is who captured the value.

    python3 -m counter_signal.brief instagram-DbOSI55u3NX
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict, dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JOBS_DIRS = (ROOT / "videolab" / "jobs", ROOT / "videolab" / "jobs-private")

# The one clip in the corpus that already sits on the material axis, scored at
# 12 degrees with psi_m 0.85. Responses target its neighbourhood.
TARGET_THETA_DEG = 25
TARGET_PSI_M = 0.70

_ABSENT_PREFIXES = ("absent", "none", "not named", "not located", "no ", "unnamed")


@dataclass
class Brief:
    slug: str
    title: str
    theta_in: int | None
    psi_m_in: float | None
    deflection_axes: list[str]
    e_amplitude: float | None
    kernel_named: bool
    target_theta_deg: int = TARGET_THETA_DEG
    target_psi_m: float = TARGET_PSI_M
    obligations: list[str] = field(default_factory=list)
    grievance: str = ""


def _job_dir(slug: str) -> Path:
    for base in JOBS_DIRS:
        candidate = base / slug
        if candidate.is_dir():
            return candidate
    raise SystemExit(f"no job directory for {slug}")


def _widget(notes: dict, kind: str) -> dict:
    for widget in notes.get("widgets") or []:
        if widget.get("type") == kind:
            return widget.get("params") or {}
    return {}


def build(slug: str) -> Brief:
    job = _job_dir(slug)
    meta = json.loads((job / f"{slug}_metadata.json").read_text())
    notes = meta.get("framework_notes") or {}
    content = meta.get("content_analysis") or {}
    if not notes:
        raise SystemExit(f"{slug} has no framework_notes; analyse it first")
    # The grievance is what the response preserves. Without it the prompt asks a
    # writer to carry nothing across, which reads as complete and produces a
    # generic script, so refuse instead of degrading.
    if not str(content.get("primary_theme") or "").strip():
        raise SystemExit(
            f"{slug} has framework_notes but no content_analysis.primary_theme. "
            "The brief has no grievance to preserve; write the content analysis first."
        )

    phasor = _widget(notes, "wage_phasor")
    deflection = _widget(notes, "axis_deflection")
    kernel_text = str(notes.get("extraction_kernel") or "").strip().lower()
    kernel_named = bool(kernel_text) and not kernel_text.startswith(_ABSENT_PREFIXES)

    brief = Brief(
        slug=slug,
        title=str(meta.get("title") or slug),
        theta_in=phasor.get("theta_deg"),
        psi_m_in=phasor.get("psi_m"),
        deflection_axes=list(deflection.get("axes") or []),
        e_amplitude=deflection.get("e_amplitude"),
        kernel_named=kernel_named,
        grievance=str(content.get("primary_theme") or ""),
    )

    if not kernel_named:
        brief.obligations.append(
            "Name a beneficiary. The clip describes a harm and no party that captured "
            "value from it, which is the single largest gap to close."
        )
    else:
        brief.obligations.append(
            "The clip already locates a beneficiary. Carry that flow forward and "
            "quantify it rather than re-establishing it."
        )

    if brief.deflection_axes:
        axes = ", ".join(brief.deflection_axes)
        brief.obligations.append(
            f"Keep the grievance and drop {axes} as the causal variable. The felt "
            "complaint is upheld; the axis stops being the explanation."
        )

    if brief.e_amplitude is not None and brief.e_amplitude < 0.3:
        brief.obligations.append(
            f"Supply the material field: E is {brief.e_amplitude} in the source, so "
            "the response has to introduce the flow, the payer, and the amount."
        )

    if brief.theta_in is not None and brief.theta_in > TARGET_THETA_DEG:
        brief.obligations.append(
            f"Rotate the phasor from {brief.theta_in} degrees toward "
            f"{TARGET_THETA_DEG} or below, with psi_m at or above {TARGET_PSI_M}."
        )

    brief.obligations.append(
        "Use class-band vocabulary throughout. Naming an identity-band term fails "
        "the gate in counter_signal.lint."
    )
    return brief


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("slug")
    parser.add_argument("--json", action="store_true", help="emit JSON instead of text")
    args = parser.parse_args(argv)

    brief = build(args.slug)
    if args.json:
        json.dump(asdict(brief), sys.stdout, indent=2)
        print()
        return 0

    print(f"{brief.slug} — {brief.title}")
    print(f"  grievance : {brief.grievance[:200]}")
    print(f"  phasor    : theta {brief.theta_in}deg, psi_m {brief.psi_m_in}"
          f"  ->  target theta <= {brief.target_theta_deg}deg, psi_m >= {brief.target_psi_m}")
    print(f"  deflection: {', '.join(brief.deflection_axes) or 'none recorded'}"
          f"   E={brief.e_amplitude}")
    print(f"  kernel    : {'named' if brief.kernel_named else 'ABSENT'}")
    print("  obligations:")
    for i, item in enumerate(brief.obligations, 1):
        print(f"    {i}. {item}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
