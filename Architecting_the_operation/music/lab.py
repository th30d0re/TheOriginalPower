"""Build the sound lab: one Ableton set holding every stem in the palette.

The lab is where the sounds get made. soundmap.py renders the raw material
from the framework, this script lays it out as a Live set, and everything
after that is Emmanuel's: instruments, effects, resampling, whatever the stems
turn into. When a sound is finished it gets bounced back out to
`music/cues/` under its stem name, and cues.py places it in an episode.

    python Architecting_the_operation/music/lab.py

The set is rebuilt from scratch every run, so it is a starting point rather
than a document to keep work in. Existing sets are backed up first; the real
rule is to Save As under a new name once there is work worth keeping.
"""
from __future__ import annotations

import argparse
import copy
import gzip
import shutil
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path

import soundfile

from soundmap import PALETTE

try:
    from scriptcast import als_generator as als
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "scriptCast is not installed. Run `make venv-voice` and use .venv-voice."
    ) from exc

_REQUIRED = ("_load_template_root", "_build_audio_clip", "_set_track_name",
             "_arrangement_events", "_reparent_sample_paths", "_ms_to_beats")
_missing = [name for name in _REQUIRED if not hasattr(als, name)]
if _missing:  # pragma: no cover
    raise SystemExit(
        "scriptcast.als_generator no longer provides: " + ", ".join(_missing) +
        ". The lab builder tracks its internals; update lab.py to match."
    )


@dataclass
class _Stem:
    """What `_build_audio_clip` reads off a rendered segment."""
    wav_path: Path
    duration_ms: int
    sample_rate: int


def _stem_info(path: Path) -> _Stem:
    info = soundfile.info(str(path))
    return _Stem(path, int(round(info.duration * 1000)), int(info.samplerate))


def _fresh_target_ids(track: ET.Element, start: int) -> int:
    """Automation and modulation targets are referenced by id across the whole
    document, so a cloned track needs its own. Everything else inside a track
    is already duplicated between the template's own tracks and is left alone.
    """
    next_id = start
    for element in track.iter():
        if "Id" not in element.attrib:
            continue
        if element.tag.endswith("Target") or element.tag == "Pointee":
            element.attrib["Id"] = str(next_id)
            next_id += 1
    return next_id


def _max_target_id(root: ET.Element) -> int:
    ids = [
        int(element.attrib["Id"])
        for element in root.iter()
        if "Id" in element.attrib
        and (element.tag.endswith("Target") or element.tag == "Pointee")
        and element.attrib["Id"].lstrip("-").isdigit()
    ]
    return max(ids) if ids else 0


def _bump_next_pointee(root: ET.Element) -> None:
    """Live refuses to load a set whose NextPointeeId is not above every id it
    hands out. Cloning tracks mints new automation targets, so the counter has
    to follow them up: without this Live reports the file as corrupt and names
    both numbers in the dialog."""
    highest = _max_target_id(root)
    for element in root.iter():
        if element.tag == "NextPointeeId":
            element.attrib["Value"] = str(highest + 1)


def build(stems_dir: Path, output: Path) -> Path:
    stems = sorted(stems_dir.glob("*.wav"))
    if not stems:
        raise SystemExit(f"no stems in {stems_dir}; run `soundmap.py palette` first")

    root = als._load_template_root()
    tracks_el = root.find("./LiveSet/Tracks")
    audio_tracks = root.findall("./LiveSet/Tracks/AudioTrack")
    prototype = next(
        (t for t in audio_tracks
         if t.find("./Name/EffectiveName").attrib.get("Value", "").startswith("Voice")),
        audio_tracks[0],
    )
    prototype = copy.deepcopy(prototype)
    for track in audio_tracks:
        tracks_el.remove(track)

    next_target = _max_target_id(root) + 1
    descriptions = dict(PALETTE)

    for index, wav in enumerate(stems, start=1):
        track = copy.deepcopy(prototype)
        track.attrib["Id"] = str(index)
        next_target = _fresh_target_ids(track, next_target)

        name = wav.stem.split("_", 1)[1] if "_" in wav.stem else wav.stem
        als._set_track_name(track, wav.stem)
        annotation = track.find("./Name/Annotation")
        if annotation is None:
            annotation = ET.SubElement(track.find("./Name"), "Annotation")
        annotation.attrib["Value"] = descriptions.get(name, "")

        stem = _stem_info(wav)
        beats = als._ms_to_beats(stem.duration_ms)
        clip = als._build_audio_clip(index, 0.0, beats, beats, stem, output.parent)
        events = als._arrangement_events(track)
        events.clear()
        events.append(clip)
        tracks_el.append(track)

    _bump_next_pointee(root)

    ET.indent(root)
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(root, encoding="unicode")

    output.parent.mkdir(parents=True, exist_ok=True)
    if output.exists():
        backup = output.with_suffix(".als.bak")
        shutil.copy2(output, backup)
        print(f"backed up the previous set to {backup.name}")
    with gzip.open(output, "wb") as handle:
        handle.write(xml.encode("utf-8"))
    return output


def main() -> int:
    here = Path(__file__).resolve().parent
    ap = argparse.ArgumentParser()
    ap.add_argument("--stems", type=Path, default=here / "lab" / "stems")
    ap.add_argument("--out", type=Path, default=here / "lab" / "ATO_Sound_Lab.als")
    args = ap.parse_args()
    path = build(args.stems, args.out)
    count = len(sorted(args.stems.glob("*.wav")))
    print(f"wrote {path} with {count} tracks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
