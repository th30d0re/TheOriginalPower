"""Build YT02v2_ov_shotlist.md from the Phonon shot list and the current script.

Turns whose ids survived keep their shots. Inside each gap, a rewritten line keeps
its shot when the text still matches. A line with no shot holds the picture already
on screen.
"""
from __future__ import annotations

import difflib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OLD_SHOTS = ROOT / "Architecting_the_operation/video/YT02v2_shotlist.md"
SCRIPT = ROOT / "Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md"
OUT = ROOT / "Architecting_the_operation/video/YT02v2_ov_shotlist.md"
PHONON = ROOT / "outputs/YT02v2"
OV = ROOT / "outputs/YT02v2_ov"
RATIO = 0.55


def parse_shots(path: Path) -> list[dict]:
    shots = []
    for block in re.finditer(r"(?ms)^## (S(\d\d)-\d\d[a-z]?)(?: — (.*?))?\n(.*?)(?=^## |\Z)", path.read_text()):
        sid, seg, title, body = block.groups()

        def field(name: str) -> str:
            hit = re.search(rf"\*\*{name}:\*\* (.*)", body)
            return hit.group(1).strip() if hit else ""

        render = field("Render").strip("`")
        holds = field("Holds").strip("`") or None
        anchor = field("Anchor").strip("`")
        shots.append({
            "id": sid, "seg": seg, "title": (title or "").strip(), "anchor": anchor,
            "type": field("Type"), "render": render, "holds": holds, "note": field("Note"),
        })
    return shots


def parse_script(path: Path) -> tuple[list[dict], dict[int, str]]:
    turns, cards = [], {}
    seg, speaker, ts, body = None, None, None, None
    pending = None

    def finish():
        nonlocal body, pending
        if body is None:
            return
        index = len(turns)
        turns.append({
            "seg": seg or "00", "speaker": speaker, "ts": ts,
            "text": " ".join(body).strip(),
        })
        if pending:
            cards[index] = pending
        pending = None
        body = None

    for line in path.read_text().splitlines():
        card = re.match(r"<!--\s*CARD:\s*(.*?)\s*-->", line)
        if card:
            pending = card.group(1)
            continue
        if re.match(r"<!--(?!\s*SEG\s+\d+\b).*?-->", line):
            continue
        marker = re.match(r"\s*<!--\s*SEG\s+(\d+)\b", line)
        if marker:
            finish()
            seg = marker.group(1).zfill(2)
            continue
        speaker_line = re.match(r"^(Emmanuel Theodore|Lee Atwater)\s+\((\d+:\d{2}(?::\d{2})?)\)\s*$", line)
        if speaker_line:
            finish()
            speaker, ts, body = speaker_line.group(1), speaker_line.group(2), []
            continue
        if body is not None and line.strip():
            body.append(line.strip())
    finish()
    return turns, cards


def align(old_ids: list[str], old_texts: list[str], new_ids: list[str], new_texts: list[str]) -> list[int | None]:
    pos: dict[str, list[int]] = {}
    for j, nid in enumerate(new_ids):
        pos.setdefault(nid, []).append(j)
    anchors = [(-1, -1)]
    cursor, used = -1, set()
    for i, oid in enumerate(old_ids):
        cands = [p for p in pos.get(oid, []) if p > cursor and p not in used]
        if not cands:
            continue
        j = cands[0]
        used.add(j)
        cursor = j
        anchors.append((i, j))
    anchors.append((len(old_ids), len(new_ids)))
    assign: list[int | None] = [None] * len(new_ids)
    for (i1, j1), (i2, j2) in zip(anchors, anchors[1:]):
        if i1 >= 0:
            assign[j1] = i1
        old_range = list(range(i1 + 1, i2))
        new_range = list(range(j1 + 1, j2))
        cursor_n = 0
        for oi in old_range:
            best, best_r = None, RATIO
            for c in range(cursor_n, len(new_range)):
                ratio = difflib.SequenceMatcher(a=old_texts[oi], b=new_texts[new_range[c]], autojunk=False).ratio()
                if ratio >= best_r:
                    best_r, best = ratio, c
            if best is not None:
                assign[new_range[best]] = oi
                cursor_n = best + 1
    return assign


def alloc(seg: str, used: set[str]) -> str:
    for n in range(1, 100):
        sid = f"S{seg}-{n:02d}"
        if sid not in used:
            used.add(sid)
            return sid
    for n in range(1, 100):
        for letter in "abcdefghijklmnopqrstuvwxyz":
            sid = f"S{seg}-{n:02d}{letter}"
            if sid not in used:
                used.add(sid)
                return sid
    raise SystemExit(f"no free shot id in segment {seg}")


def target(render: str) -> tuple[str, str]:
    file, _, scene = render.partition(":")
    return file, scene


def write_shot(shot: dict) -> str:
    lines = [
        f"## {shot['id']} — {shot['title']}",
        f"- **Anchor:** `{shot['speaker']} ({shot['ts']})`",
        f"- **Type:** {shot['type']}",
        f"- **Render:** `{shot['render']}`",
    ]
    if shot["holds"]:
        lines.append(f"- **Holds:** `{shot['holds']}`")
    lines.append(f"- **Note:** {shot['note']}")
    return "\n".join(lines)


def main() -> int:
    old = parse_shots(OLD_SHOTS)
    phonon = json.loads((PHONON / "episode_manifest.json").read_text())["turns"]
    ov = json.loads((OV / "episode_manifest.json").read_text())["turns"]
    words = json.loads((PHONON / "words.json").read_text())
    if not (len(old) == len(phonon) == len(words)):
        sys.exit(f"phonon counts differ: shots {len(old)} manifest {len(phonon)} words {len(words)}")
    script, cards = parse_script(SCRIPT)
    if len(script) != len(ov):
        sys.exit(f"script has {len(script)} turns; OmniVoice manifest has {len(ov)}")
    assign = align(
        [t["turn_id"] for t in phonon],
        [w["text"] for w in words],
        [t["turn_id"] for t in ov],
        [t["text"] for t in script],
    )
    by_id = {shot["id"]: shot for shot in old}
    surviving = {old[i]["id"] for i in assign if i is not None}
    used_ids = set(surviving)
    built, last_primary = [], None
    for j, oi in enumerate(assign):
        turn = script[j]
        if oi is None:
            if last_primary is None:
                sys.exit(f"turn {j} has no earlier picture to hold")
            primary = by_id[last_primary]
            shot = {
                "id": alloc(turn["seg"], used_ids),
                "seg": turn["seg"],
                "title": "Picture holds",
                "speaker": turn["speaker"],
                "ts": turn["ts"],
                "type": "hold",
                "render": primary["render"],
                "holds": last_primary,
                "note": "The picture already on screen holds across this line.",
            }
        else:
            src = old[oi]
            holds = src["holds"]
            render = src["render"]
            if holds and holds not in surviving:
                if last_primary is None:
                    sys.exit(f"turn {j} held {holds}, which this cut dropped, and no earlier picture remains")
                holds = last_primary
                render = by_id[last_primary]["render"]
            shot = {
                "id": src["id"], "seg": src["seg"], "title": src["title"],
                "speaker": turn["speaker"], "ts": turn["ts"], "type": src["type"],
                "render": render, "holds": holds, "note": src["note"],
            }
            by_id.setdefault(shot["id"], shot)
        built.append(shot)
        last_primary = shot["holds"] or shot["id"]
        by_id[last_primary] = by_id.get(last_primary) or shot

    ids = {s["id"] for s in built}
    problems = []
    if len(built) != len(script):
        problems.append(f"built {len(built)} shots for {len(script)} turns")
    if len(ids) != len(built):
        problems.append("duplicate shot ids")
    for shot in built:
        if shot["holds"] and shot["holds"] not in ids:
            problems.append(f"{shot['id']} holds missing {shot['holds']}")
    by_seg: dict[str, list[int]] = {}
    for i, shot in enumerate(built):
        by_seg.setdefault(shot["seg"], []).append(i)
    for seg, idxs in by_seg.items():
        if idxs != list(range(idxs[0], idxs[-1] + 1)):
            problems.append(f"segment {seg} is not contiguous: {idxs[:8]}...")
    order = sorted((idxs[0], seg) for seg, idxs in by_seg.items())
    if [seg for _, seg in order] != sorted(by_seg):
        problems.append(f"segments interleave: {order}")
    runs: dict[str, list[dict]] = {}
    for shot in built:
        runs.setdefault(shot["holds"] or shot["id"], []).append(shot)
    for primary, run in runs.items():
        file0, scene0 = target(run[0]["render"])
        for shot in run:
            file, scene = target(shot["render"])
            if file != file0 or scene != scene0:
                problems.append(f"{primary}: {shot['id']} names a different render target")
                break
    kept = sum(i is not None for i in assign)
    print(f"kept {kept}  holds {len(built) - kept}  shots {len(built)}  segments {sorted(by_seg)}")
    used_old = {i for i in assign if i is not None}
    dropped = [f"{old[i]['id']} {old[i]['title']}" for i in range(len(old)) if i not in used_old]
    print(f"dropped {len(dropped)}")
    for line in dropped:
        print("  drop", line)
    print("card comments", len(cards))
    for index, label in cards.items():
        shot = built[index]
        print(f"  turn {index} {shot['id']} {shot['type']} {label[:80]}")
    if problems:
        print("PROBLEMS")
        for line in problems:
            print(" ", line)
        return 1
    header = (
        "# YT02v2 OmniVoice shot list\n\n"
        "Each shot is one turn of the OmniVoice narration, in order. A shot kept from "
        "the previous cut stays on the line it already covered. A line added in this cut "
        "holds the picture already on screen.\n\n"
    )
    OUT.write_text(header + "\n".join(write_shot(s) for s in built) + "\n")
    print(f"wrote {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
