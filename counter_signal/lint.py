"""The publication gate: conditions a response script must satisfy to ship.

Two stages, deliberately separated by what each can actually decide.

Stage 1, here: deterministic. Blocklist the identity-band terms the interference
engine measures, and require the script's vocabulary to be materially dense.
Calibrated against the 13 analyst-scored clips, these conditions accept exactly
the one clip scored at 12 degrees and reject all twelve at 62 degrees and above.

Stage 2, not here: semantic. Whether the script names a beneficiary, and what
phase angle it lands on, are judgments. The Eastern Zhou clip names its
beneficiary as "men receiving animal protein", which no word list catches. Run
the candidate through the same analyzer that writes framework_notes and read the
angle off that.

Passing stage 1 means a script is not obviously broken. It does not mean the
script rotates anything.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

import yaml

from counter_signal.lexicon import densities, material_ratio

VARIABLES_PATH = Path(__file__).resolve().parent.parent / "systemic_arbitrage" / "variables.yaml"

# Calibrated on the labelled corpus; see the module docstring.
PSI_M_FLOOR = 2.0
MATERIAL_RATIO_FLOOR = 0.65


def identity_blocklist(path: Path | None = None) -> list[str]:
    """The identity-band terms O_x is computed from.

    A response that names them deposits power in the band it means to shrink, so
    they are refused outright rather than scored.
    """
    data = yaml.safe_load((path or VARIABLES_PATH).read_text())
    terms = (data.get("keywords") or {}).get("identity_band") or []
    return sorted({str(t).strip().lower() for t in terms if str(t).strip()})


@dataclass
class GateResult:
    passed: bool
    psi_m: float
    psi_s: float
    ratio: float
    blocked_terms: list[str] = field(default_factory=list)
    reasons: list[str] = field(default_factory=list)


def check(script: str, *, blocklist: list[str] | None = None) -> GateResult:
    terms = blocklist if blocklist is not None else identity_blocklist()
    lowered = (script or "").lower()
    hits = sorted({t for t in terms if t in lowered})

    psi_m, psi_s = densities(script)
    ratio = material_ratio(psi_m, psi_s)

    reasons: list[str] = []
    if hits:
        reasons.append(f"names {len(hits)} identity-band term(s): {', '.join(hits[:6])}")
    if psi_m < PSI_M_FLOOR:
        reasons.append(f"material density {psi_m:.2f} below floor {PSI_M_FLOOR}")
    if ratio < MATERIAL_RATIO_FLOOR:
        reasons.append(f"material share {ratio:.2f} below floor {MATERIAL_RATIO_FLOOR}")

    return GateResult(
        passed=not reasons,
        psi_m=round(psi_m, 3),
        psi_s=round(psi_s, 3),
        ratio=round(ratio, 3),
        blocked_terms=hits,
        reasons=reasons,
    )
