"""YT02v2 SEG 06: the YT01 binary refinement on v2's three-turn run (S06-19..S06-21)."""

import sys
from pathlib import Path

COMMON = Path(__file__).resolve().parents[1] / "yt01_redefining_racism/manim"
sys.path.insert(0, str(COMMON))

from binary_refinement16x9 import BinaryRefinement  # noqa: E402


class BinaryRefinementV2(BinaryRefinement):
    """Play shot_S03_19 (four v1 beats) over v2's three turns.

    v1 named the Elite and the Enforcement Class in separate turns; v2 names
    both in one sentence of payoffs (turn 1), and the decomposition closes in
    turn 2. Each v1 beat maps to the v2 turn and spoken word that carries it.
    """

    # v1 (beat, cue word) -> v2 (beat, cue word)
    CUES = {
        (1, "Elite"): (1, "vastly"),
        (2, "Enforcement"): (1, "F-sub-enforce"),
        (3, "decomposition"): (2, "decomposition"),
    }
    BEATS_V1_TO_V2 = {0: 0, 1: 1, 2: 1, 3: 2}

    def at(self, k, word, nth=0, lead=0.1):
        k, word = self.CUES.get((k, word), (k, word))
        return super().at(k, word, nth=nth, lead=lead)

    def beat_end(self, k=0):
        return super().beat_end(self.BEATS_V1_TO_V2.get(k, k))
