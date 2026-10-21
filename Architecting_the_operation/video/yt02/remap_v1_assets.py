"""Reassign reused v1 assets in YT02v2_shotlist.md by narration content.

The v2 script reorders the v1 segments (v1 SEG 06 is v2 SEG 04, v1 SEG 04 is v2 SEG 07,
v1 SEG 08-13 are v2 SEG 09-14). The first v2 shot list reused v1 assets by segment
number, so whole segments played the neighbouring segment's visuals. This tool matches
each v2 turn to its v1 turn by word overlap and copies that v1 shot's Type, Render,
Holds and Note. Assets built for v2 (listed in KEEP) stay where they are.

    python yt02/remap_v1_assets.py [--dry-run] [--min-score 0.5]
"""
import argparse
import os
import re
import sys
from pathlib import Path

VIDEO = Path(__file__).resolve().parents[1]
ROOT = VIDEO.parents[1]
sys.path.insert(0, str(VIDEO / "yt01_redefining_racism/manim"))
os.environ.setdefault("YT_EP", "YT02")
import common16x9 as c  # noqa: E402

V1_SCRIPT = ROOT / "Architecting_the_operation/podcasts/YT02_what_racism_is.md"
V2_SCRIPT = ROOT / "Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md"
V1_LIST, V2_LIST = VIDEO / "YT02_shotlist.md", VIDEO / "YT02v2_shotlist.md"
KEEP = re.compile(r"yt02/(wage_plane_hero|rlc_teach|tier_pyramid|set_operations_v2|layout_v2)\.py|^ext:|^clip:")
BLOCK = re.compile(r"(?ms)^## (S\d\d-\d\d) — (.*?)\n(.*?)(?=^## |^<!--|\Z)")


def words(text):
    return {w for w in re.findall(r"[a-z0-9]+", text.lower()) if len(w) > 3}


def blocks(path):
    out = {}
    for sid, title, body in BLOCK.findall(path.read_text()):
        fields = dict(re.findall(r"^- \*\*(\w+):\*\* (.*)$", body, re.M))
        out[sid] = {"title": title.strip(), **fields}
    return out


def match(v1_turns, v2_turns):
    v1_words = [words(t) for t in v1_turns]
    best = []
    for text in v2_turns:
        a = words(text)
        scores = [len(a & b) / len(a | b) if a and b else 0 for b in v1_words]
        j = max(range(len(scores)), key=scores.__getitem__)
        best.append((j, scores[j]))
    return best


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--min-score", type=float, default=0.45)
    ap.add_argument("--segments", default="03-15", help="v2 segments to remap, e.g. 03-15")
    ap.add_argument("--from", dest="source", type=Path, default=V2_LIST,
                    help="v2 shot list to read (default: the file it rewrites)")
    args = ap.parse_args()
    lo, _, hi = args.segments.partition("-")
    segments = {f"{n:02d}" for n in range(int(lo), int(hi or lo) + 1)}

    v1_turns, _ = c.script_turns(V1_SCRIPT)
    v2_turns, _ = c.script_turns(V2_SCRIPT)
    v1, v2 = c.load_shots(V1_LIST), c.load_shots(args.source)
    b1, b2 = blocks(V1_LIST), blocks(args.source)
    assert len(v2_turns) == len(v2), (len(v2_turns), len(v2))
    pairs = match(v1_turns, v2_turns)

    # v1 shot id -> v2 shot id, for the strong matches only.
    to_v2 = {v1[j].id: v2[i].id for i, (j, s) in enumerate(pairs) if s >= args.min_score}
    # Which v1 segment each v2 segment draws from (majority of strong matches).
    votes = {}
    for i, (j, s) in enumerate(pairs):
        if s >= args.min_score:
            votes.setdefault(v2[i].seg, []).append(v1[j].seg)
    source_seg = {seg: max(set(v), key=v.count) for seg, v in votes.items()}
    # Which v1 segments used each render target.
    used_in = {}
    for s1 in v1:
        used_in.setdefault(re.sub(r"\s+as=\S+", "", b1[s1.id]["Render"].strip("`")), set()).add(s1.seg)

    def belongs(render, seg):
        """A kept render fits when v1 used it in the segment this v2 segment came from."""
        if KEEP.search(render):
            return True
        segs = used_in.get(re.sub(r"\s+as=\S+", "", render))
        return segs is None or source_seg.get(seg) in segs

    # A run built for v2 stays whole: every shot holding a v2-built primary is kept.
    kept = {s.id for s in v2 if KEEP.search(b2[s.primary]["Render"])}
    new = {}
    prev_primary = None
    changed = {}
    for i, shot in enumerate(v2):
        cur = b2[shot.id]
        j, score = pairs[i]
        render = cur["Render"].strip("`")
        if shot.seg not in segments or shot.id in kept:
            new[shot.id] = cur
            prev_primary = shot.primary
            continue
        if score < args.min_score:
            # Unmatched (new v2 turn) or v2-built. A render borrowed from the wrong v1
            # segment gives way to the visual already on screen.
            held = (cur.get("Holds") or "").strip("`")
            if not belongs(render, shot.seg) and prev_primary:
                cur = {**cur, "Holds": f"`{prev_primary}`", "Render": new[prev_primary]["Render"]}
            elif held and held in changed and changed[held] != cur["Render"]:
                cur = {**cur, "Holds": f"`{prev_primary}`"} if prev_primary else {k: v for k, v in cur.items() if k != "Holds"}
            if cur.get("Holds"):
                cur = {**cur, "Type": "hold", "Render": new[cur["Holds"].strip("`")]["Render"]}
            new[shot.id] = cur
            prev_primary = (cur.get("Holds") or "").strip("`") or shot.id
            continue
        src = v1[j]
        s1 = b1[src.id]
        primary1 = src.holds or src.id
        primary2 = to_v2.get(primary1)
        out = {"title": s1["title"], "Anchor": cur["Anchor"], "Type": s1["Type"]}
        r1 = s1["Render"].strip("`")
        if src.holds and primary2 and primary2 == prev_primary and primary2 != shot.id:
            out["Holds"] = f"`{primary2}`"
            out["Render"] = new[primary2]["Render"]
        else:
            if src.holds:  # the v1 primary did not carry over: this shot opens the run
                out["Type"] = b1[primary1]["Type"]
            if r1.startswith("manim:") and shot.id != primary1:  # methods carry the v1 primary id
                r1 = re.sub(r"\s+as=\S+", "", r1) + f" as={primary1}"
            out["Render"] = f"`{r1}`"
        out["Note"] = s1["Note"]
        new[shot.id] = out
        prev_primary = (out.get("Holds") or "").strip("`") or shot.id
        if out["Render"] != cur["Render"]:
            changed[shot.id] = out["Render"]

    # Report.
    by_seg = {}
    for shot in v2:
        a, b = b2[shot.id], new[shot.id]
        if (a["Render"], a.get("Holds")) != (b["Render"], b.get("Holds")):
            by_seg[shot.seg] = by_seg.get(shot.seg, 0) + 1
    print("changed shots by v2 segment:", dict(sorted(by_seg.items())), "total", sum(by_seg.values()))
    if args.dry_run:
        return

    text = args.source.read_text()

    def rewrite(m):
        sid = m.group(1)
        f = new[sid]
        lines = [f"## {sid} — {f['title']}"]
        lines += [f"- **{k}:** {f[k]}" for k in ("Anchor", "Type", "Render", "Holds", "Note") if f.get(k)]
        return "\n".join(lines) + "\n\n"

    V2_LIST.write_text(BLOCK.sub(rewrite, text))


if __name__ == "__main__":
    main()
