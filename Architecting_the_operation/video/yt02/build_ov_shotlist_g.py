"""Rebuild YT02v2_ov_shotlist.md for the G script (2026-10-29) from the previous OV shot list.

The G pass reordered passages (G10), so turns are matched by content wherever they moved:
first by turn id (repeated ids pair up in order), then by best text match among the old
turns still unused. A run stays together while its shots held the same old primary. A line
with no match holds the picture already on screen. OVERRIDES applies the Renders the G
sessions proposed, keyed by the old turn id they were written against.

    python3 Architecting_the_operation/video/yt02/build_ov_shotlist_g.py OLD_SHOTS OLD_EP_DIR
"""
from __future__ import annotations

import difflib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_ov_shotlist import OUT, OV, SCRIPT, alloc, parse_script, parse_shots, write_shot  # noqa: E402

FIGMA = Path(__file__).resolve().parents[3] / "outputs/YT02v2/video/figma"
RATIO = 0.55

# old turn id -> ("start", Render) begins a run; ("hold", None) joins the run before it.
OVERRIDES = {
    "efe6af7b824b3692": ("start", "figma:g-card-s02-07@s02-07"),  # G1 turn 72
    "c8a4cfdabb044e6c": ("start", "figma:g-fig2.2 causal chain"),  # G5
    "2a0deb5b5c6527dd": ("hold", None),
    "88669e7f7aedee0f": ("hold", None),
    "6017b9e8036ac25d": ("start", "figma:g-eq2.11 RLC sweep"),  # G11
    "fe51fd0e7ca12182": ("hold", None),
    "2ceea706fbc6a5d5": ("hold", None),
    "de291b853c123795": ("start", "figma:g-complex wage warm-up"),  # G30
    "1a8b00ba21498d95": ("hold", None),
    "ddbb09b442535d14": ("start", "figma:g-cine-238-nicholas-v-bulls"),  # G21
    "923528ae0159c6ab": ("hold", None),
    "5859e3f3080a30d1": ("hold", None),
}
# The same, keyed by new turn id, for lines the G script rewrote past matching.
NEW_OVERRIDES = {
    "af14875a5056195e": ("start", "figma:g-cine-234-campaign-map"),  # surprise raids on the shore
    "8a12bf429c148e04": ("start", "figma:g-cine-235-poisoned-arrows"),  # 1446 canoe ambush
    "f66836ca6674b549": ("hold", None),
    "42214e07347b0975": ("start", "figma:g-cine-294-chesapeake-bottom"),  # G21 shared whip, shared quarters
    "2eb89f9ac45edd1f": ("hold", None),
    "82054a32786ea2e2": ("hold", None),
    "1c2d33ddc64441cf": ("start", "figma:card-s08-12@s09-12"),  # the card returns for the planters' answer
    "04a13af0496555ae": ("hold", None),  # "What makes racism count as a system": stays on the checklist card
    "87ff5d63ca3fbebb": ("hold", None),
    "841601f9029a9579": ("start", "figma:g-cine-229-lagos-syndicate"),  # Portugal summary: the institutions that ran the trade
    "0a4f7c7a74c7e737": ("hold", None),
    "7252c082908fd607": ("hold", None),
    "b8c3ead37b2cbf8b": ("hold", None),
}
# Card Renders whose rebuilt clip replaces the old one wherever the card is on screen.
CARD_SWAPS = {
    "figma-card:cards/S06-13.json": "figma:g-card-s06-13@s04-13",
    "figma-card:cards/S03-39.json": "figma:g-card-s03-39@s06-36",
    "figma-card:cards/S03-43.json": "figma:g-card-s03-43@s06-40",
    "figma-card:cards/S07-33.json": "figma:g-card-s07-33@s08-33",
    "figma-card:cards/v2/v2-S09-43.json": "figma:g-card-v2-s09-43@s09-43",
}


def match(old_ids, old_texts, new_ids, new_texts):
    by_id: dict[str, list[int]] = {}
    for i, oid in enumerate(old_ids):
        by_id.setdefault(oid, []).append(i)
    assign: list[int | None] = [None] * len(new_ids)
    used = set()
    for j, nid in enumerate(new_ids):
        if by_id.get(nid):
            assign[j] = by_id[nid].pop(0)
            used.add(assign[j])
    pairs = []
    for j, nid in enumerate(new_ids):
        if assign[j] is not None:
            continue
        for i in range(len(old_ids)):
            if i in used:
                continue
            sm = difflib.SequenceMatcher(a=old_texts[i], b=new_texts[j], autojunk=False)
            if sm.real_quick_ratio() < RATIO or sm.quick_ratio() < RATIO:
                continue
            r = sm.ratio()
            if r >= RATIO:
                pairs.append((r, j, i))
    for r, j, i in sorted(pairs, reverse=True):
        if assign[j] is None and i not in used:
            assign[j] = i
            used.add(i)
    return assign


def main() -> int:
    old_shots = parse_shots(Path(sys.argv[1]))
    old_ep = Path(sys.argv[2])
    old_turns = json.loads((old_ep / "episode_manifest.json").read_text())["turns"]
    old_words = json.loads((old_ep / "words.json").read_text())
    if not (len(old_shots) == len(old_turns) == len(old_words)):
        sys.exit(f"old counts differ: shots {len(old_shots)} manifest {len(old_turns)} words {len(old_words)}")
    new_turns = json.loads((OV / "episode_manifest.json").read_text())["turns"]
    script, _ = parse_script(SCRIPT)
    if len(script) != len(new_turns):
        sys.exit(f"script has {len(script)} turns; manifest has {len(new_turns)}")
    old_ids = [t["turn_id"] for t in old_turns]
    assign = match(old_ids, [w["text"] for w in old_words],
                   [t["turn_id"] for t in new_turns], [t["text"] for t in script])
    old_by_id = {s["id"]: s for s in old_shots}

    def old_render(s):
        render = old_by_id[s["holds"]]["render"] if s["holds"] else s["render"]
        render = CARD_SWAPS.get(render, render)
        primary = (s["holds"] or s["id"]).lower()
        if render.startswith("figma-card:"):
            stem = Path(render.split(":", 1)[1]).stem.lower()
            if (FIGMA / f"card-{stem}@{primary}.mp4").exists():
                render = f"figma:card-{stem}@{primary}"  # keep the run's timed export when its id changes
        return render

    # Group new turns into runs.
    runs: list[dict] = []
    for j, oi in enumerate(assign):
        src = old_shots[oi] if oi is not None else None
        key = (src["holds"] or src["id"]) if src else None
        ov = NEW_OVERRIDES.get(new_turns[j]["turn_id"]) or (OVERRIDES.get(old_ids[oi]) if oi is not None else None)
        if ov and ov[0] == "start":
            runs.append({"key": ("override", j), "render": ov[1], "members": [j]})
        elif runs and ((ov and ov[0] == "hold") or src is None or runs[-1]["key"] == key):
            runs[-1]["members"].append(j)
        elif src is None:
            sys.exit(f"turn {j} has no earlier picture to hold")
        else:
            runs.append({"key": key, "render": old_render(src), "members": [j]})

    used_ids: set[str] = set()
    built: list[dict] = [None] * len(script)  # type: ignore[list-item]
    for run in runs:
        primary_id = None
        for j in run["members"]:
            turn, oi = script[j], assign[j]
            src = old_shots[oi] if oi is not None else None
            sid = src["id"] if src and src["seg"] == turn["seg"] and src["id"] not in used_ids else None
            if sid:
                used_ids.add(sid)
            else:
                sid = alloc(turn["seg"], used_ids)
            is_primary = primary_id is None
            primary_id = primary_id or sid
            built[j] = {
                "id": sid, "seg": turn["seg"], "speaker": turn["speaker"], "ts": turn["ts"],
                "title": src["title"] if src else "Picture holds",
                "type": src["type"] if src else "hold",
                "render": run["render"],
                "holds": None if is_primary else primary_id,
                "note": src["note"] if src else "The picture already on screen holds across this line.",
            }

    problems = []
    ids = [s["id"] for s in built]
    if len(set(ids)) != len(ids):
        problems.append("duplicate shot ids")
    seen: dict[str, list[int]] = {}
    for i, s in enumerate(built):
        seen.setdefault(s["seg"], []).append(i)
    for seg, idxs in seen.items():
        if idxs != list(range(idxs[0], idxs[-1] + 1)):
            problems.append(f"segment {seg} is not contiguous")
    for s in built:
        r = s["render"]
        if r.startswith("figma:"):
            slug = "-".join(r.split(":", 1)[1].strip().lower().replace("·", " ").split())
            if not (FIGMA / f"{slug}.mp4").exists():
                problems.append(f"{s['id']} figma clip missing: {slug}.mp4")
    kept = sum(a is not None for a in assign)
    moved = sum(1 for j, a in enumerate(assign) if a is not None and old_shots[a]["seg"] != script[j]["seg"])
    dropped = sorted(set(range(len(old_shots))) - {a for a in assign if a is not None})
    print(f"turns {len(built)}  matched {kept}  new {len(built) - kept}  moved-segment {moved}  "
          f"runs {len(runs)}  dropped old {len(dropped)}")
    for i in dropped:
        print("  drop", old_shots[i]["id"], old_ids[i], old_words[i]["text"][:70])
    for oid in OVERRIDES:
        if oid not in [old_ids[a] for a in assign if a is not None]:
            print("  override unplaced", oid)
    if problems:
        print("PROBLEMS")
        for p in sorted(set(problems)):
            print(" ", p)
        return 1
    header = (
        "# YT02v2 OmniVoice shot list\n\n"
        "Each shot is one turn of the OmniVoice narration, in order. Rebuilt for the G script "
        "(2026-10-29) by `yt02/build_ov_shotlist_g.py`: a turn keeps its picture wherever the "
        "reorder moved it, and a new line holds the picture already on screen.\n\n"
    )
    OUT.write_text(header + "\n".join(write_shot(s) for s in built) + "\n")
    print(f"wrote {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
