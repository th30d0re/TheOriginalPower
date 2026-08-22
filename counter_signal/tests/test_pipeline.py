from __future__ import annotations

import json

import pytest

from counter_signal import compose, pipeline, render
from counter_signal.brief import Brief


@pytest.fixture
def sample_brief() -> Brief:
    return Brief(
        slug="sample",
        title="Sample clip",
        theta_in=82,
        psi_m_in=0.1,
        deflection_axes=["status", "identity"],
        e_amplitude=0.2,
        kernel_named=False,
        obligations=["Name the owner who retained the profit.", "Quantify the wage loss."],
        grievance="Household costs rose while pay remained flat.",
    )


def test_prompt_contains_every_obligation(sample_brief):
    prompt = compose.build_prompt(sample_brief)
    assert all(item in prompt for item in sample_brief.obligations)
    assert sample_brief.grievance in prompt
    assert "status, identity" in prompt
    assert "25 degrees" in prompt and "0.7" in prompt
    assert "identity-band term fails" in prompt


def test_render_refuses_blocklisted_script(monkeypatch):
    called = False

    def forbidden(_request):
        nonlocal called
        called = True

    monkeypatch.setattr(render.urllib.request, "urlopen", forbidden)
    with pytest.raises(render.GateRejected):
        render.submit(
            "Wages, rent, employer profit, worker pay, and household debt all rose "
            "because the culture war redirected the money.",
            "Blocked",
        )
    assert not called


def test_pipeline_is_idempotent_across_two_runs(tmp_path, monkeypatch, sample_brief):
    responses = tmp_path / "responses"
    monkeypatch.setattr(pipeline, "RESPONSES_DIR", responses)
    monkeypatch.setattr(pipeline, "STATE_PATH", responses / "state.json")
    monkeypatch.setattr(pipeline.brief, "build", lambda _slug: sample_brief)
    submissions = []
    monkeypatch.setattr(pipeline.render, "submit",
                        lambda script, subject: submissions.append((script, subject)) or {"task_id": "1"})
    script = tmp_path / "candidate.md"
    script.write_text(
        "Rent rose faster than wages. The landlord kept the profit while the employer "
        "held salary flat. Workers paid the cost through debt and longer hours."
    )

    assert pipeline.run("sample", script, should_render=True) == "rendered"
    assert pipeline.run("sample", script, should_render=True) == "rendered"
    assert len(submissions) == 1
    assert json.loads((responses / "state.json").read_text())["sample"]["stage"] == "rendered"


def test_pipeline_without_script_stops_at_prompt(tmp_path, monkeypatch, sample_brief):
    responses = tmp_path / "responses"
    monkeypatch.setattr(pipeline, "RESPONSES_DIR", responses)
    monkeypatch.setattr(pipeline, "STATE_PATH", responses / "state.json")
    monkeypatch.setattr(pipeline.brief, "build", lambda _slug: sample_brief)

    assert pipeline.run("sample") == "composed"
    artifact_dir = responses / "sample"
    assert (artifact_dir / "brief.json").exists()
    assert (artifact_dir / "prompt.md").exists()
    assert not (artifact_dir / "script.md").exists()
    assert json.loads((responses / "state.json").read_text())["sample"]["stage"] == "composed"
