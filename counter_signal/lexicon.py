"""Material and status vocabulary, and the density score built from them.

This scores the *wage composition* of a script: how much of its language is
material (wages, rent, employers, allocation) against how much is status
(respect, deserving, loyalty, identity). It is a lexical proxy and nothing more.

Calibration against the 13 videolab clips whose phasor angle an analyst assigned
gives Pearson r = 0.43 to that angle, with two clips scored 86-88 degrees coming
out at 0 because no status word matched. atan2(0, small) reads as "perfectly
material" when it actually means "no signal at all", so this module deliberately
exposes psi_m and psi_s and leaves the angle to the caller.

Use the densities as a necessary condition. The phase angle itself and whether a
beneficiary is named are semantic judgments, and belong to the analyzer that
writes framework_notes.
"""

from __future__ import annotations

import re

MATERIAL_TERMS = """
wage wages pay paid payment salary income earn earnings rent rents landlord mortgage
price prices cost costs bill bills debt loan interest profit profits revenue capital
owner owners employer employers boss company corporation shareholder investor union
strike layoff hire hired fired job jobs labour labor worker workers hours overtime
contract benefits insurance premium tax taxes housing food money dollar dollars percent
budget afford affordable poverty poor rich wealth allocation allocated resources supply
demand market economy economic material funding subsidy subsidies pension welfare
"""

STATUS_TERMS = """
respect respected disrespect deserve deserving loyalty betray betrayal shame shameful
pride proud honour honor dignity preference preferences attracted attraction dating
masculine femininity feminine masculinity manhood womanhood identity pronoun woke
feminist feminism patriarchy misandry misogyny toxic validate validation entitled
entitlement standards worth attention approval judged judging blame blaming victim
narrative agenda ideology cultural culture offended disrespectful loyal
"""


def _lex(block: str) -> frozenset[str]:
    return frozenset(re.findall(r"[a-z]+", block.lower()))


MATERIAL = _lex(MATERIAL_TERMS)
STATUS = _lex(STATUS_TERMS)

_WORD = re.compile(r"[a-z']+")


def densities(text: str) -> tuple[float, float]:
    """Return (psi_m, psi_s) as percentages of total words."""
    words = _WORD.findall((text or "").lower())
    if not words:
        return 0.0, 0.0
    material = sum(1 for w in words if w in MATERIAL)
    status = sum(1 for w in words if w in STATUS)
    return material * 100.0 / len(words), status * 100.0 / len(words)


def material_ratio(psi_m: float, psi_s: float) -> float:
    """Share of scored vocabulary that is material. 0.0 when nothing scored."""
    total = psi_m + psi_s
    return psi_m / total if total else 0.0
