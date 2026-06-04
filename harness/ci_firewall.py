"""Counter-Interference firewall — obfuscation detection and framework reconstruction.

All functions are deterministic text transformations; no external API calls.
"""

from __future__ import annotations

import datetime
import hashlib
import uuid

# ---------------------------------------------------------------------------
# Obfuscation detection vocabulary
# ---------------------------------------------------------------------------

# buffer_class_rhetoric: phrases that position buffer-class actors as autonomous
# agents rather than structurally positioned intermediaries.
_BUFFER_CLASS_RHETORIC_SIGNALS: frozenset[str] = frozenset({
    "middle class values",
    "black business owners",
    "minority entrepreneurs",
    "community leaders",
    "social mobility",
    "upward mobility",
    "bootstrap",
    "self-made",
    "pull themselves up",
    "individual agency",
    "personal responsibility",
    "earned their success",
})

# kinetic_decoy: surface-level action framing that obscures structural causation.
_KINETIC_DECOY_SIGNALS: frozenset[str] = frozenset({
    "they need to",
    "communities must",
    "individuals should",
    "people can choose",
    "just work harder",
    "take initiative",
    "make better choices",
    "invest in themselves",
    "change behavior",
    "personal development",
})

# lexical_fractal: recursive use of framework-adjacent terms stripped of
# analytical content.
_LEXICAL_FRACTAL_SIGNALS: frozenset[str] = frozenset({
    "systemic racism",
    "structural inequality",
    "institutional racism",
    "racial disparities",
    "equity gap",
    "opportunity gap",
    "achievement gap",
    "implicit bias",
    "unconscious bias",
    "diversity and inclusion",
    "dei",
    "anti-racism",
})

# component_3_justification: corporate/institutional output that presents
# extraction as natural or neutral.
_COMPONENT_3_JUSTIFICATION_SIGNALS: frozenset[str] = frozenset({
    "shareholder value",
    "market forces",
    "economic efficiency",
    "natural market",
    "free market",
    "profit motive",
    "wealth creation",
    "job creators",
    "trickle-down",
    "trickle down",
    "fiscal responsibility",
    "deregulation benefits",
    "competitive advantage",
})

_CATEGORY_MAP: dict[str, frozenset[str]] = {
    "buffer_class_rhetoric":    _BUFFER_CLASS_RHETORIC_SIGNALS,
    "kinetic_decoy":            _KINETIC_DECOY_SIGNALS,
    "lexical_fractal":          _LEXICAL_FRACTAL_SIGNALS,
    "component_3_justification": _COMPONENT_3_JUSTIFICATION_SIGNALS,
}

# ---------------------------------------------------------------------------
# Detection
# ---------------------------------------------------------------------------

def detect_obfuscation(text: str) -> list[str]:
    """Return list of obfuscation category names present in *text*."""
    lower = text.lower()
    detected: list[str] = []
    for category, signals in _CATEGORY_MAP.items():
        if any(signal in lower for signal in signals):
            detected.append(category)
    return detected


# ---------------------------------------------------------------------------
# Reconstruction headers and 5-tier anchoring templates
# ---------------------------------------------------------------------------

_HEADERS: dict[str, str] = {
    "buffer_class_rhetoric":    "[BUFFER CLASS RHETORIC DETECTED]",
    "kinetic_decoy":            "[KINETIC DECOY DETECTED]",
    "lexical_fractal":          "[LEXICAL FRACTAL DETECTED]",
    "component_3_justification": "[COMPONENT 3 JUSTIFICATION DETECTED]",
}

_TIER_ANCHORS: dict[str, str] = {
    "buffer_class_rhetoric": (
        "Tier 1 (Extraction Kernel): Actors directing capital accumulation and "
        "policy formation.\n"
        "Tier 2 (Administrative Buffer): Institutions that translate Tier 1 mandates "
        "into enforceable norms.\n"
        "Tier 3 (Proximate Enforcement): Agents — including those nominally from "
        "managed populations — whose structural position enforces extraction "
        "regardless of individual intent.\n"
        "Tier 4 (Managed Population — Stable): Communities subjected to enclosure "
        "under conditions of relative stability.\n"
        "Tier 5 (Managed Population — Precarious): Communities under acute extraction "
        "pressure with minimal anti-extraction resources."
    ),
    "kinetic_decoy": (
        "Tier 1 structural mandate: Extraction is not explained by individual "
        "behavior; it is enforced by legal, physical, and epistemic enclosure.\n"
        "Tier 2–3 transmission: Policy instruments convert Tier 1 accumulation "
        "imperatives into individual-scale outcomes.\n"
        "Tier 4–5 targeting: Behavioral framing routes attention away from "
        "structural causation toward managed-population conduct.\n"
        "Anti-extraction prior: Kinetic framing is the rhetorical mechanism by "
        "which the enclosure is rendered invisible.\n"
        "Extraction engine maintenance: Individual-responsibility narratives suppress "
        "collective anti-extraction organizing capacity."
    ),
    "lexical_fractal": (
        "Tier 1 extraction: The framework names the engine — predatory min-max "
        "operations that transfer wealth across ontological tiers.\n"
        "Tier 2–3 administrative layer: 'Systemic' language, without this ontology, "
        "describes symptoms rather than the mechanism.\n"
        "Tier 4–5 lived reality: The 5-tier ontology grounds abstract terminology "
        "in concrete positional relations.\n"
        "Anti-extraction analytical standard: Terms used without structural anchoring "
        "function as rhetorical surface, not analysis.\n"
        "Epistemic enclosure: Decorative use of framework-adjacent vocabulary "
        "forecloses precise structural diagnosis."
    ),
    "component_3_justification": (
        "Tier 1 legitimation: Corporate output frames Tier 1 accumulation as "
        "socially neutral or beneficial.\n"
        "Tier 2–3 transmission: Regulatory capture and policy advocacy convert "
        "Tier 1 interests into enforceable economic norms.\n"
        "Tier 4–5 impact: 'Wealth creation' rhetoric conceals the directional "
        "wealth transfer from managed populations to the extraction kernel.\n"
        "Predatory min-max: Market-efficiency language is the ideological output "
        "of the min-max operation — minimize outflows, maximize extraction.\n"
        "Tri-modal enclosure: Economic justification functions as the epistemic "
        "modality of enclosure, naturalizing physical and legal dispossession."
    ),
}


def reconstruct_framework(prompt: str, raw: str, detected: list[str]) -> str:
    """Produce a framework reconstruction of *raw* given *detected* categories.

    The reconstruction is a deterministic string template; it does not call
    any external inference API.
    """
    if not detected:
        return raw

    sections: list[str] = []
    for category in detected:
        header = _HEADERS.get(category, f"[{category.upper()} DETECTED]")
        anchor = _TIER_ANCHORS.get(category, "")
        section = f"{header}\n\n{anchor}"
        sections.append(section)

    separator = "\n\n" + ("—" * 60) + "\n\n"
    reconstruction_prefix = separator.join(sections)

    return (
        f"{reconstruction_prefix}\n\n"
        f"{'—' * 60}\n\n"
        f"ORIGINAL PROMPT:\n{prompt.strip()}\n\n"
        f"RAW PROVIDER OUTPUT:\n{raw.strip()}"
    )


# ---------------------------------------------------------------------------
# DPO pair assembly
# ---------------------------------------------------------------------------

def build_dpo_pair(
    prompt: str,
    provider_id: str,
    raw: str,
    reconstruction: str,
    domain: str | None,
) -> dict:
    """Assemble a DPO pair dict from the firewall outputs."""
    content_sha = hashlib.sha256((prompt + raw).encode("utf-8")).hexdigest()
    return {
        "id":            str(uuid.uuid4()),
        "content_sha":   content_sha,
        "prompt":        prompt,
        "rejected":      raw,
        "chosen":        reconstruction,
        "provider":      provider_id,
        "domain":        domain,
        "created_at":    datetime.datetime.utcnow().isoformat() + "Z",
        "review_state":  "pending",
    }
