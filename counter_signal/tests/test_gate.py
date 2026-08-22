"""The gate is calibrated on real labelled clips, so the corpus is the fixture."""

from __future__ import annotations

import glob
import json
import os

import pytest

from counter_signal import brief, lint
from counter_signal.lexicon import densities, material_ratio

CORPUS = sorted(glob.glob("videolab/jobs/*/*_metadata.json"))


def _labelled():
    """(slug, analyst_theta, transcript) for every clip carrying a phasor."""
    rows = []
    for path in CORPUS:
        meta = json.loads(open(path).read())
        notes = meta.get("framework_notes") or {}
        phasor = next((w for w in (notes.get("widgets") or [])
                       if w.get("type") == "wage_phasor"), None)
        transcript = os.path.join(os.path.dirname(path), "transcript.txt")
        if not phasor or not os.path.exists(transcript):
            continue
        rows.append((os.path.basename(os.path.dirname(path)),
                     phasor["params"]["theta_deg"],
                     open(transcript, encoding="utf-8", errors="ignore").read()))
    return rows


def test_blocklist_loads_from_the_engine_registry():
    terms = lint.identity_blocklist()
    assert "woke" in terms and "culture war" in terms
    assert len(terms) > 20


def test_identity_term_fails_the_gate():
    result = lint.check("Wages fell while rent and profit rose, and the culture war explains none of it.")
    assert not result.passed
    assert "culture war" in result.blocked_terms


def test_material_script_passes():
    script = (
        "Rent rose faster than wages for eleven years. The landlord kept the "
        "difference, the employer paid the same salary, and the cost showed up in "
        "the household budget as debt. That transfer is the whole story: income "
        "moved from workers to owners, and the profit was booked as revenue."
    )
    result = lint.check(script)
    assert result.passed, result.reasons


def test_status_heavy_script_fails():
    result = lint.check(
        "They should respect you and they do not. It is about dignity, pride and "
        "whether you deserve loyalty, and their standards say you are not worth it."
    )
    assert not result.passed


@pytest.mark.skipif(not CORPUS, reason="videolab corpus is gitignored and local")
def test_gate_separates_the_material_clip_from_the_status_clips():
    """Calibration pin: accept the analyst's 12-degree clip, reject 62 and above.

    This is the evidence the thresholds rest on. If it breaks, the thresholds
    were retuned and the claim in lint's docstring no longer holds.
    """
    rows = _labelled()
    if len(rows) < 5:
        pytest.skip("too few analysed clips locally")
    accepted, rejected = [], []
    for _slug, theta, text in rows:
        psi_m, psi_s = densities(text)
        ok = psi_m >= lint.PSI_M_FLOOR and material_ratio(psi_m, psi_s) >= lint.MATERIAL_RATIO_FLOOR
        (accepted if ok else rejected).append(theta)
    assert accepted, "gate accepted nothing; the material clip should pass"
    # The invariant is the response target, not the sample's spread. An earlier
    # version asserted min(rejected) >= 60, which broke when a clip scored at 58
    # arrived: rejecting a 58-degree clip is correct when the target is 25.
    assert max(accepted) <= brief.TARGET_THETA_DEG + 5, (
        f"accepted a status-framed clip: {accepted}")
    assert all(t > brief.TARGET_THETA_DEG for t in rejected), (
        f"rejected a clip already at or below target: {rejected}")


def test_brief_refuses_a_job_with_no_grievance(tmp_path, monkeypatch):
    """framework_notes without content_analysis must fail loudly, not silently.

    A brief with an empty grievance still renders a full-looking prompt, and the
    resulting script has nothing to carry across.
    """
    import json as _json
    import pytest as _pytest
    from counter_signal import brief as _brief

    job = tmp_path / "instagram-empty"
    job.mkdir()
    (job / "instagram-empty_metadata.json").write_text(_json.dumps({
        "content_analysis": {"primary_theme": ""},
        "framework_notes": {"extraction_kernel": "Absent", "widgets": []},
    }))
    monkeypatch.setattr(_brief, "JOBS_DIRS", (tmp_path,))
    with _pytest.raises(SystemExit, match="no content_analysis"):
        _brief.build("instagram-empty")
