"""Add per-turn beats and the run duration to card batches from the YT02 shot list and manifest.

    python3 card_beats.py BATCH.json > BATCH_with_beats.json

beats[i] = start of the run's i-th turn minus the run start, plus 0.25 s; duration = start of the
first shot after the run minus the run start (end of the episode for the last run).
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
L = (ROOT / "Architecting_the_operation/video/YT02_shotlist.md").read_text()
turns = json.loads((ROOT / "outputs/YT02/episode_manifest.json").read_text())["turns"]
shots = re.findall(r"(?ms)^## (S\d\d-\d\d[a-z]?) — .*?\n(.*?)(?=^## |\Z)", L)
assert len(shots) == len(turns), (len(shots), len(turns))
runs = {}
for k, (sid, body) in enumerate(shots):
    h = re.search(r"\*\*Holds:\*\* `([^`]*)`", body)
    runs.setdefault(h.group(1) if h else sid, []).append(k)
batch = json.load(open(sys.argv[1]))
for card in batch:
    ks = runs[card["id"]]
    t0 = turns[ks[0]]["start_ms"] / 1000
    t1 = turns[ks[-1] + 1]["start_ms"] / 1000 if ks[-1] + 1 < len(turns) else turns[-1]["end_ms"] / 1000
    card["beats"] = [round(turns[k]["start_ms"] / 1000 - t0 + 0.25, 2) for k in ks]
    card["duration"] = round(t1 - t0, 2)
json.dump(batch, sys.stdout, ensure_ascii=False)
