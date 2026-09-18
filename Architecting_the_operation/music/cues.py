"""Place finished music into a rendered episode.

The lab makes sounds; this puts them in the show. A cue is a bounced WAV in
`music/cues/`, and `cues.yaml` says which episode uses it and where it sits.
Nothing here regenerates the voices: it takes the stitched episode, mixes the
music around it, and reports how far the speech moved so TURN_INDEX.csv can be
rebuilt against the new timeline.

    python Architecting_the_operation/music/cues.py outputs/ATO_EP03_five_levels

Positions are named by turn, not by timestamp, so a re-render that changes a
turn's length moves its cue with it. `at_turn` starts a cue when that turn
starts; `from_turn`/`to_turn` runs a bed under a range, looping it if the range
is longer than the file and fading it under the speech.
"""
from __future__ import annotations

import argparse
import json
import math
from dataclasses import dataclass
from pathlib import Path

import numpy
import soundfile
import yaml

HERE = Path(__file__).resolve().parent
CUES_DIR = HERE / "cues"
PLAN_PATH = HERE / "cues.yaml"


@dataclass
class Plan:
    opener: str | None
    closer: str | None
    opener_overlap_ms: int
    closer_lead_ms: int
    beds: list[dict]


def load_plan(episode_id: str, path: Path = PLAN_PATH) -> Plan:
    data = yaml.safe_load(path.read_text()) if path.exists() else {}
    defaults = dict((data or {}).get("defaults") or {})
    episode = dict(((data or {}).get("episodes") or {}).get(episode_id) or {})
    merged = {**defaults, **episode}
    return Plan(
        opener=merged.get("opener"),
        closer=merged.get("closer"),
        opener_overlap_ms=int(merged.get("opener_overlap_ms", 2000)),
        closer_lead_ms=int(merged.get("closer_lead_ms", 1500)),
        beds=list(episode.get("beds") or []),
    )


def _read(path: Path, sample_rate: int) -> numpy.ndarray:
    audio, rate = soundfile.read(str(path), dtype="float32", always_2d=True)
    if audio.shape[1] == 1:
        audio = numpy.repeat(audio, 2, axis=1)
    if rate != sample_rate:
        # Linear resample. Cues are beds and stings, and the pitch shift from a
        # better resampler is not worth another dependency here.
        n = int(round(audio.shape[0] * sample_rate / rate))
        src = numpy.linspace(0, audio.shape[0] - 1, n)
        audio = numpy.stack([numpy.interp(src, numpy.arange(audio.shape[0]), audio[:, c])
                             for c in range(2)], axis=1).astype(numpy.float32)
    return audio


def _db(gain_db: float) -> float:
    return 10 ** (gain_db / 20.0)


def _mix(bed: numpy.ndarray, sig: numpy.ndarray, at_ms: int, sample_rate: int,
         gain: float = 1.0) -> None:
    start = max(0, int(at_ms * sample_rate / 1000))
    end = min(bed.shape[0], start + sig.shape[0])
    if end > start:
        bed[start:end] += sig[: end - start] * gain


def _looped(cue: numpy.ndarray, samples: int, fade_samples: int) -> numpy.ndarray:
    if cue.shape[0] == 0:
        return numpy.zeros((samples, 2), dtype=numpy.float32)
    reps = math.ceil(samples / cue.shape[0])
    out = numpy.tile(cue, (reps, 1))[:samples].copy()
    f = min(fade_samples, out.shape[0] // 2)
    if f:
        out[:f] *= numpy.linspace(0, 1, f)[:, None]
        out[-f:] *= numpy.linspace(1, 0, f)[:, None]
    return out


def _turn_bounds(manifest: dict) -> dict[int, tuple[int, int]]:
    return {t["turn_index"]: (int(t["start_ms"]), int(t["end_ms"])) for t in manifest["turns"]}


def apply(episode_dir: Path, plan: Plan | None = None, cues_dir: Path = CUES_DIR,
          out_name: str | None = None) -> dict:
    manifest = json.loads((episode_dir / "episode_manifest.json").read_text())
    episode_id = manifest["episode_id"]
    sample_rate = int(manifest["sample_rate"])
    plan = plan or load_plan(episode_id)
    bounds = _turn_bounds(manifest)

    source = episode_dir / f"{episode_id}.wav"
    if not source.exists():
        source = episode_dir / f"{episode_id}.mp3"
    if not source.exists():
        raise SystemExit(f"no stitched episode in {episode_dir}; run scriptcast-stitch first")
    speech = _read(source, sample_rate)

    def cue(name: str) -> numpy.ndarray:
        path = cues_dir / name
        if not path.exists():
            raise SystemExit(f"cue not found: {path}. Bounce it out of the lab first.")
        return _read(path, sample_rate)

    opener = cue(plan.opener) if plan.opener else None
    closer = cue(plan.closer) if plan.closer else None

    opener_ms = int(opener.shape[0] * 1000 / sample_rate) if opener is not None else 0
    shift_ms = max(0, opener_ms - plan.opener_overlap_ms)
    speech_ms = int(speech.shape[0] * 1000 / sample_rate)
    closer_at = shift_ms + speech_ms - plan.closer_lead_ms
    closer_ms = int(closer.shape[0] * 1000 / sample_rate) if closer is not None else 0
    total_ms = max(shift_ms + speech_ms, closer_at + closer_ms) + 500

    bed = numpy.zeros((int(total_ms * sample_rate / 1000), 2), dtype=numpy.float32)
    _mix(bed, speech, shift_ms, sample_rate)
    if opener is not None:
        _mix(bed, opener, 0, sample_rate)
    if closer is not None:
        _mix(bed, closer, closer_at, sample_rate)

    placed = []
    for entry in plan.beds:
        audio = cue(entry["cue"])
        gain = _db(float(entry.get("gain_db", -22)))
        if "at_turn" in entry:
            start = bounds[int(entry["at_turn"])][0] + shift_ms
            _mix(bed, audio, start, sample_rate, gain)
            placed.append({"cue": entry["cue"], "start_ms": start,
                           "length_ms": int(audio.shape[0] * 1000 / sample_rate)})
            continue
        start = bounds[int(entry["from_turn"])][0] + shift_ms
        end = bounds[int(entry["to_turn"])][1] + shift_ms
        span = int((end - start) * sample_rate / 1000)
        _mix(bed, _looped(audio, span, int(1.5 * sample_rate)), start, sample_rate, gain)
        placed.append({"cue": entry["cue"], "start_ms": start, "length_ms": end - start})

    peak = float(numpy.max(numpy.abs(bed)))
    if peak > 0.98:
        bed *= 0.98 / peak

    out = episode_dir / (out_name or f"{episode_id}_music.wav")
    soundfile.write(str(out), bed, sample_rate)
    report = {
        "episode_id": episode_id,
        "output": out.name,
        "speech_shift_ms": shift_ms,
        "opener": plan.opener, "closer": plan.closer,
        "closer_at_ms": closer_at if closer is not None else None,
        "beds": placed,
        "total_ms": int(bed.shape[0] * 1000 / sample_rate),
        "peak": round(min(peak, 0.98), 4),
    }
    (episode_dir / "cues_applied.json").write_text(json.dumps(report, indent=2) + "\n")
    return report


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("episode_dir", type=Path)
    ap.add_argument("--cues", type=Path, default=CUES_DIR)
    ap.add_argument("--out-name", default=None)
    args = ap.parse_args()
    report = apply(args.episode_dir, cues_dir=args.cues, out_name=args.out_name)
    print(f"wrote {report['output']}  "
          f"speech moved {report['speech_shift_ms']} ms, "
          f"{len(report['beds'])} bed(s), total {report['total_ms'] // 1000}s")
    print("Speech moved, so rebuild the turn index:")
    print(f"  scriptcast-turn-index {args.episode_dir} --offset-ms {report['speech_shift_ms']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
