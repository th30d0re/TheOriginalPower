"""Timing regression checks using temporary script and manifest fixtures."""
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from common16x9 import Timing, YTScene, YTScene3D, _YTMethods, script_turns

SCRIPT = """Example script.
<!-- SEG 00 · Hook -->
Emmanuel Theodore (00:00)
Opening statement.

<!-- SEG 03 · Partition -->
Emmanuel Theodore (00:06)
First partition.
Continued text.

<!-- production note -->
Emmanuel Theodore (00:12)
Partition and partition again.
"""


class TimingTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.script = self.root / "script.md"
        self.script.write_text(SCRIPT)
        self.ep = self.root / "outputs" / "test"
        self.ep.mkdir(parents=True)

    def tearDown(self):
        self.tmp.cleanup()

    def timing(self, **kwargs):
        return Timing("test", script=self.script, root=self.root, **kwargs)

    def manifest(self):
        (self.ep / "episode_manifest.json").write_text(json.dumps({"turns": [
            {"start_ms": 0, "end_ms": 2000, "text": "Opening statement."},
            {"start_ms": 2000, "end_ms": 5000, "text": "First partition. Continued text."},
            {"start_ms": 5000, "end_ms": 9000, "text": "Partition and partition again."},
        ]}))

    def test_segment_parser(self):
        texts, segments = script_turns(self.script)
        self.assertEqual(segments, {"00": [0], "03": [1, 2]})
        self.assertEqual(texts[1], "First partition. Continued text.")
        self.assertNotIn("production", " ".join(texts))

    def test_six_second_placeholder_word_spacing(self):
        timing = self.timing()
        self.assertTrue(timing.placeholder)
        self.assertEqual(timing.beats, [0, 6, 12])
        self.assertEqual(timing.end, 18)
        self.assertAlmostEqual(timing.cue(seg="03", turn=1, word="partition", nth=1), 14.9)
        self.assertEqual(timing.cue(0, "opening"), 0)

    def test_absent_script_uses_preview(self):
        self.script.unlink()
        timing = self.timing(placeholder_turns=("First preview", "Second preview"))
        self.assertEqual(timing.segments, {"03": [0, 1]})
        self.assertEqual(timing.end, 12)
        self.assertAlmostEqual(timing.cue(1, "unavailable", seg="03"), 8.9)

    def test_missing_script_with_existing_manifest_uses_preview(self):
        self.manifest()
        self.script.unlink()
        self.assertTrue(self.timing().placeholder)

    def test_manifest_and_recorded_word_cues(self):
        self.manifest()
        (self.ep / "words.json").write_text(json.dumps([
            {"text": "Opening", "words": [{"w": "Opening", "t": 0.0}]},
            {"text": "First partition", "words": [{"w": "partition", "t": 0.7}]},
            {"text": "Partition and partition", "words": [{"w": "Partition", "t": 0.1}, {"w": "partition", "t": 1.8}]},
        ]))
        timing = self.timing()
        self.assertFalse(timing.placeholder)
        self.assertAlmostEqual(timing.cue(0, "part", seg="03"), 2.6)
        self.assertAlmostEqual(timing.cue(1, "partition", seg="03", nth=1, lead=0), 6.8)
        with self.assertRaises(KeyError):
            timing.cue(0, "absent", seg="03")

    def test_missing_word_file_uses_manifest_spans(self):
        self.manifest()
        timing = self.timing()
        self.assertFalse(timing.placeholder)
        self.assertAlmostEqual(timing.cue(1, "partition", seg="03", nth=1), 6.9)

    def test_inconsistent_manifest_fails(self):
        (self.ep / "episode_manifest.json").write_text('{"turns": []}')
        with self.assertRaises(ValueError):
            self.timing()
        (self.ep / "episode_manifest.json").write_text('{"turns": [{"start_ms": 0, "end_ms": 1000}]}')
        with self.assertRaises(ValueError):
            self.timing()

    def test_bad_cue_fails(self):
        timing = self.timing()
        for kwargs in ({"turn": -1, "word": "word"}, {"turn": 8, "word": "word", "seg": "03"}):
            with self.assertRaises(IndexError):
                timing.cue(**kwargs)
        with self.assertRaises(KeyError):
            timing.cue(0, "word", seg="99")
        with self.assertRaises(ValueError):
            timing.cue(0, "", seg="03")

    def test_placeholder_suppresses_existing_audio(self):
        timing = self.timing()
        timing.audio.touch()
        class FakeScene(_YTMethods):
            camera = type("Camera", (), {})()
            def add_sound(self, path):
                raise AssertionError("Placeholder preview must be silent")
        with patch("common16x9.Timing", return_value=timing):
            FakeScene().begin()
        self.assertIs(YTScene.cue, YTScene3D.cue)
        self.assertIs(YTScene.until, YTScene3D.until)


if __name__ == "__main__":
    unittest.main()
