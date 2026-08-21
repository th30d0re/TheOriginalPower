from __future__ import annotations

import importlib.util
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[2] / "tools" / "chapter_audio_dive.py"
SPEC = importlib.util.spec_from_file_location("chapter_audio_dive", SCRIPT)
assert SPEC and SPEC.loader
chapter_audio = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(chapter_audio)


def test_done_unit_with_missing_audio_is_pending_and_reported(
    tmp_path: Path, monkeypatch: object, capsys: object
) -> None:
    present = tmp_path / "present.m4a"
    present.write_bytes(b"a" * 100_000)
    manifest = {"units": [{"n": 1, "title": "Missing"}, {"n": 2, "title": "Present"}]}
    state = {
        "1": {"status": "done", "audio_path": "missing.m4a"},
        "2": {"status": "done", "audio_path": "present.m4a"},
    }
    monkeypatch.setattr(chapter_audio, "ROOT", tmp_path)

    assert chapter_audio.next_pending(manifest, state) == manifest["units"][0]
    chapter_audio.print_status(manifest, state)

    output = capsys.readouterr().out
    assert "'done': 1" in output
    assert "'done (file missing)': 1" in output
