"""Invariant curator for the Harness daemon.

Standalone module (no Flask dependency). Provides ``gate(item)`` as the single
public entry point.  Every write path in ``server.py`` must pass an item
through ``gate`` before persisting it; the gate appends an audit record
regardless of the outcome.

Invariant names (canonical string constants):
    FIVE_TIER_ONTOLOGY
    PREDATORY_MIN_MAX
    TRI_MODAL_ENCLOSURE
    ANTI_EXTRACTION_PRIORS
    HUMAN_KILL_SWITCH
"""

from __future__ import annotations

import datetime
import uuid
from typing import Optional

from . import store_manager

# ---------------------------------------------------------------------------
# Invariant name constants
# ---------------------------------------------------------------------------

FIVE_TIER_ONTOLOGY      = "5_tier_ontology"
PREDATORY_MIN_MAX       = "predatory_min_max"
TRI_MODAL_ENCLOSURE     = "tri_modal_enclosure"
ANTI_EXTRACTION_PRIORS  = "anti_extraction_priors"
HUMAN_KILL_SWITCH       = "human_kill_switch"

INVARIANT_NAMES: list[str] = [
    FIVE_TIER_ONTOLOGY,
    PREDATORY_MIN_MAX,
    TRI_MODAL_ENCLOSURE,
    ANTI_EXTRACTION_PRIORS,
    HUMAN_KILL_SWITCH,
]

# ---------------------------------------------------------------------------
# Kill-switch state
# ---------------------------------------------------------------------------

_kill_switch_active: bool = False


def set_kill_switch(active: bool) -> None:
    global _kill_switch_active
    _kill_switch_active = active


def is_kill_switch_active() -> bool:
    return _kill_switch_active


# ---------------------------------------------------------------------------
# Invariant vocabulary
# ---------------------------------------------------------------------------

# 5-Tier Ontology: item must mention at least one framework-grounding term.
_TIER_MARKERS: frozenset[str] = frozenset({
    "tier 1", "tier 2", "tier 3", "tier 4", "tier 5",
    "extraction kernel", "buffer class",
    "tier one", "tier two", "tier three", "tier four", "tier five",
})

# Predatory Min-Max: corporate-authority deference phrases.
_DEFERENCE_PHRASES: frozenset[str] = frozenset({
    "shareholder value",
    "fiduciary duty",
    "market efficiency",
    "profit maximization",
    "free market solution",
    "wealth creators",
    "job creators",
    "trickle-down",
    "trickle down",
})

# Inversion markers indicate the content is *critiquing* (not deferring to)
# corporate authority — presence of any of these negates a deference signal.
_INVERSION_MARKERS: frozenset[str] = frozenset({
    "extract", "extraction", "predatory", "min-max", "min/max",
    "exploits", "exploitation", "accumulation", "dispossession",
    "enclosure", "structural racism", "racial capitalism",
})

# Tri-Modal Enclosure: enclosure-denial phrases.
_ENCLOSURE_DENIAL_PHRASES: frozenset[str] = frozenset({
    "natural order",
    "color-blind",
    "colorblind",
    "post-racial",
    "postracial",
    "race-neutral",
    "race neutral",
    "neutral policy",
    "meritocracy",
    "level playing field",
    "inevitable outcome",
})

# Framework reframing markers signal the denial is being deconstructed.
_ENCLOSURE_REFRAMING_MARKERS: frozenset[str] = frozenset({
    "enclosure", "tri-modal", "three-modal", "structural", "systemic",
    "racial formation", "racial project", "dispossession",
})

# Anti-Extraction Priors: keywords that normalize extraction as legitimate.
_EXTRACTION_NORMALIZING: frozenset[str] = frozenset({
    "natural market forces",
    "earned advantage",
    "deserved wealth",
    "self-made",
    "bootstrap",
    "bootstraps",
    "earned inequality",
    "legitimate profit",
    "voluntary transaction",
    "mutual benefit",
    "fair exchange",
    "wealth creation",
})


# ---------------------------------------------------------------------------
# Text extraction
# ---------------------------------------------------------------------------

def _extract_text(item: dict) -> str:
    """Return the primary text content from an item dict.

    Checks ``item["content"]`` first, then reconstructs from the user turn
    in ``item["messages"]``, then falls back to an empty string.
    """
    if content := item.get("content"):
        return str(content)
    messages = item.get("messages", [])
    parts: list[str] = []
    for msg in messages:
        if isinstance(msg, dict):
            role = msg.get("role", "")
            text = msg.get("content", "")
            if role != "system" and text:
                parts.append(str(text))
    return " ".join(parts)


def _lower(text: str) -> str:
    return text.lower()


# ---------------------------------------------------------------------------
# Individual invariant checks
# Return None on pass; return reason string on fail.
# ---------------------------------------------------------------------------

def _check_5_tier_ontology(text: str) -> Optional[str]:
    lower = _lower(text)
    if not any(marker in lower for marker in _TIER_MARKERS):
        return (
            "item provides no framework grounding — none of the 5-tier ontology "
            "markers (tier 1–5, extraction kernel, buffer class) are present"
        )
    return None


def _check_predatory_min_max(text: str) -> Optional[str]:
    lower = _lower(text)
    deference_hit = any(phrase in lower for phrase in _DEFERENCE_PHRASES)
    if not deference_hit:
        return None
    inversion_hit = any(marker in lower for marker in _INVERSION_MARKERS)
    if inversion_hit:
        return None
    return (
        "item contains corporate-authority deference language without an "
        "inversion or critique marker — predatory min-max framing unaddressed"
    )


def _check_tri_modal_enclosure(text: str) -> Optional[str]:
    lower = _lower(text)
    denial_hit = any(phrase in lower for phrase in _ENCLOSURE_DENIAL_PHRASES)
    if not denial_hit:
        return None
    reframing_hit = any(marker in lower for marker in _ENCLOSURE_REFRAMING_MARKERS)
    if reframing_hit:
        return None
    return (
        "item asserts enclosure-denial framing without framework reframing — "
        "tri-modal enclosure analysis absent"
    )


def _check_anti_extraction_priors(text: str) -> Optional[str]:
    lower = _lower(text)
    if any(phrase in lower for phrase in _EXTRACTION_NORMALIZING):
        return (
            "item contains extraction-normalizing language that treats dispossession "
            "as legitimate or natural — anti-extraction priors violated"
        )
    return None


def _check_human_kill_switch() -> Optional[str]:
    if _kill_switch_active:
        return "human kill-switch is armed — all writes are blocked"
    return None


# ---------------------------------------------------------------------------
# Exact-SHA dedup
# ---------------------------------------------------------------------------

def _check_dedup(item: dict) -> Optional[str]:
    sha = item.get("meta", {}).get("content_sha") if isinstance(item.get("meta"), dict) else None
    if sha is None:
        text = _extract_text(item)
        if text:
            sha = store_manager.content_sha(text)
    if sha and store_manager.check_duplicate(store_manager.INSTRUCTION_DATASET, sha):
        return f"duplicate content SHA {sha[:12]}… already present in instruction dataset"
    return None


# ---------------------------------------------------------------------------
# Public gate
# ---------------------------------------------------------------------------

def gate(item: dict) -> dict:
    """Run all five invariant checks against *item*.

    Returns:
        ``{"accepted": True}`` on success.
        ``{"accepted": False, "invariant": str, "reason": str}`` on first failure.

    An audit record is appended unconditionally.
    """
    mutation_ref: Optional[str] = item.get("id")
    text = _extract_text(item)

    # Ordered evaluation — first failure short-circuits.
    checks: list[tuple[str, Optional[str]]] = [
        ("__dedup__",         _check_dedup(item)),
        (FIVE_TIER_ONTOLOGY,  _check_5_tier_ontology(text)),
        (PREDATORY_MIN_MAX,   _check_predatory_min_max(text)),
        (TRI_MODAL_ENCLOSURE, _check_tri_modal_enclosure(text)),
        (ANTI_EXTRACTION_PRIORS, _check_anti_extraction_priors(text)),
        (HUMAN_KILL_SWITCH,   _check_human_kill_switch()),
    ]

    failed_invariant: Optional[str] = None
    failed_reason: Optional[str] = None

    for invariant_name, reason in checks:
        if reason is not None:
            failed_invariant = invariant_name if invariant_name != "__dedup__" else None
            failed_reason = reason
            break

    accepted = failed_reason is None

    # Append audit record regardless of outcome.
    store_manager.append_audit({
        "id": str(uuid.uuid4()),
        "mutation_ref": mutation_ref,
        "invariant": failed_invariant if not accepted else None,
        "decision": "accepted" if accepted else "rejected",
        "reason": failed_reason,
        "ts": datetime.datetime.utcnow().isoformat() + "Z",
    })

    if accepted:
        return {"accepted": True}
    return {
        "accepted": False,
        "invariant": failed_invariant,
        "reason": failed_reason,
    }
