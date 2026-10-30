"""Build figma/v2/g_cards.json: the G-pass card runs (OV timings) for the card builder 64:2.

    python3 Architecting_the_operation/video/yt02/figma/g_cards.py

Main cards (G1, G8, G13, G24, G28) carry an export name; EXTRA cards only need rebuilding for the subscript fix.
Frames are named "g card <stem>@<primary>" so no existing frame or clip is overwritten.
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
YT = ROOT / "Architecting_the_operation/video/yt02"
OVD = ROOT / "outputs/YT02v2_ov"
turns = json.loads((OVD / "episode_manifest.json").read_text())["turns"]
words = {x["turn"]: x["words"] for x in json.loads((OVD / "words.json").read_text())}
blocks = (ROOT / "Architecting_the_operation/video/YT02v2_ov_shotlist.md").read_text().split("\n## ")[1:]
sid = [b.split(" — ")[0].strip() for b in blocks]
render = [(re.search(r"\*\*Render:\*\* `([^`]*)`", b) or [None, ""])[1] for b in blocks]

def runs():
    out = []
    for n, r in enumerate(render):
        if out and out[-1][0] == r: out[-1][1].append(n)
        else: out.append([r, [n]])
    return out

def start(n): return turns[n]["start_ms"] / 1000

def end_of(turn_list):
    after = turn_list[-1] + 1
    return (turns[after]["start_ms"] if after < len(turns) else turns[-1]["end_ms"]) / 1000

def word_t(turn, nth, prefix):
    """seconds from the turn start of the nth (1-based) word starting with prefix"""
    hits = [w["t"] for w in words[turn] if w["w"].lower().startswith(prefix)]
    return hits[nth - 1]

def build(path, tl, extra=False, custom_beats=None):
    card = json.loads((YT / path).read_text())
    stem = Path(path).stem
    t0 = start(tl[0])
    card["id"] = stem
    card["primary"] = sid[tl[0]]
    card["frame"] = f"g card {stem}@{card['primary']}"
    card["beats"] = custom_beats if custom_beats else [round(start(n) - t0 + 0.25, 2) for n in tl]
    if "revealTurns" in card: card["beats"] = [card["beats"][k] for k in card.pop("revealTurns")]
    card["duration"] = round(end_of(tl) - t0, 2)
    if "maxDuration" in card:
        cap = card.pop("maxDuration"); card["duration"] = min(card["duration"], cap)
        card["beats"] = [b for b in card["beats"] if b < cap - 0.25]
    card["turns"] = [turns[n]["turn_id"] for n in tl]
    card["export"] = None if extra else f"g-card-{stem.lower().removeprefix('g-')}@{card['primary'].lower()}.mp4"
    return card

out = []
# G1 turn 72: new card
w72 = words[72]
out.append(build("cards/g-S02-07.json", [72], custom_beats=[0.25, round(word_t(72, 1, "private") + 0.1, 2), round(word_t(72, 1, "self-perpetuating") + 0.1, 2)]))
# G8 turns 108-112
out.append(build("cards/S06-13.json", list(range(108, 113))))
# G13 Table 2.1 turns 180-182; debate stall points: the run's table part is turns 184-187
out.append(build("cards/S03-39.json", [180, 181, 182]))
out.append(build("cards/S03-43.json", [184, 185, 186, 187]))
# G28 turns 326-329
out.append(build("cards/v2/v2-S09-43.json", [326, 327, 328, 329]))
# G24 turns 247-249: four dates on turn 247, the span after the last date, then turns 248 and 249
t0 = start(247)
b = [round(word_t(247, k, "fourteen") + 0.1, 2) for k in (1, 2, 3, 4)]
b.append(round(words[247][-1]["t"] + 0.15, 2))
b += [round(start(248) - t0 + 0.25, 2), round(start(249) - t0 + 0.25, 2)]
out.append(build("cards/S07-33.json", [247, 248, 249], custom_beats=b))
# extras: any other card whose text holds a subscript underscore
main = {c["id"] for c in out}
for r, tl in runs():
    if not r.startswith("figma-card:"): continue
    path = r.split(":", 1)[1]; stem = Path(path).stem
    if stem in main: continue
    txt = json.dumps({k: v for k, v in json.loads((YT / path).read_text()).items() if k not in ("kind", "latex", "sources", "image")})
    txt = re.sub(r'"(latex)":\s*"[^"]*"', "", txt)
    if not re.search(r"[A-Za-zΑ-Ωα-ω⁺⁻)\u0300-\u036f]_[A-Za-z0-9Α-Ωα-ω]", txt): continue
    out.append(build(path, tl, extra=True)); main.add(stem)
(YT / "figma/v2/g_cards.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
for c in out: print(c["id"], c["frame"], c["duration"], c["beats"], c["export"])
