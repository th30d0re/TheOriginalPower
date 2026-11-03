#!/usr/bin/env python3
"""Wireframes for the ten Question 9 stage scenes, portrait 1080 × 1920.

Each frame is the settled picture. Boxes are numbered in reveal order and labeled
with the cue word. Copy is the spoken line, shortened to the on-screen budget.
"""

import json
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent

FIELD = "#0D1B2A"
SURFACE_1 = "#14263A"
SURFACE_2 = "#1B3149"
WELL = "#0A1522"
CREAM = "#E8C99B"
BRONZE = "#8A6A45"
GOLD = "#E0A33C"
ACCENT = "#E08A3C"
FONT = "IBM Plex Sans"


NATIVE = HERE / "q9_bostopia_wireframes.figcraft"


def run(script, src=None):
    step = HERE / "_step.json"
    step.write_text(json.dumps(script))
    out = HERE / "_out.figcraft"
    cmd = ["figcraft-cli", "run", "--out", str(out), "--automation-write-root", str(HERE)]
    if src is not None:
        cmd += ["--in", str(src)]
    cmd.append(str(step))
    proc = subprocess.run(cmd, check=False, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.strip() or proc.stdout.strip() or f"figcraft-cli exited {proc.returncode}")
    rows = [json.loads(line) for line in proc.stdout.splitlines() if line.startswith("{")]
    bad = [row for row in rows if not row.get("ok")]
    if bad:
        raise RuntimeError(json.dumps(bad[0]))
    out.replace(NATIVE)
    return rows


def rect(parent, name, x, y, w, h, fill, stroke=None, radius=0):
    props = {"fills": [] if fill is None else [{"type": "solid", "color": fill, "opacity": 1, "visible": True, "blend": "normal"}]}
    if stroke:
        props["stroke"] = stroke
        props["strokeWeight"] = 1
    if radius:
        props["cornerRadius"] = radius
    return {"command": "node.create", "params": {
        "type": "rectangle", "parent": parent, "name": name,
        "x": x, "y": y, "width": w, "height": h, "select": False, "props": props,
    }}


def text(parent, name, body, x, y, w, size, color, style="Regular"):
    return {"command": "node.create", "params": {
        "type": "text", "parent": parent, "name": name, "text": body,
        "x": x, "y": y, "width": w, "select": False,
        "props": {
            "fontFamily": FONT, "fontStyle": style, "fontSize": size, "fill": color,
            "textAlign": "left", "lineHeight": "120%", "textAutoResize": "height",
        },
    }}


def block(parent, name, x, y, w, h, order, cue, title, body="", ghost=False):
    fill = WELL if ghost else (SURFACE_1 if order % 2 else SURFACE_2)
    cmds = [
        rect(parent, name, x, y, w, h, fill, CREAM, 8),
        text(parent, f"{name} cue", f"{order}  ·  {cue}", x + 24, y + 16, w - 48, 22, ACCENT, "Medium"),
        text(parent, f"{name} title", title, x + 24, y + 52, w - 48, 40 if h >= 180 else 28, GOLD, "Medium"),
    ]
    if body:
        cmds.append(text(parent, f"{name} body", body, x + 24, y + 112, w - 48, 28, BRONZE))
    return cmds


def frame_cmds(fid, shot):
    cmds = [
        rect(fid, "paper", 0, 0, 1080, 1920, FIELD),
        rect(fid, "safe", 60, 140, 960, 1640, None, CREAM),
        text(fid, "shot", shot["title"], 60, 48, 700, 28, GOLD, "Medium"),
        text(fid, "window", shot["window"], 60, 86, 960, 22, BRONZE),
    ]
    for item in shot["blocks"]:
        cmds.extend(block(fid, item["name"], *item["box"], item["order"], item["cue"], item["title"], item.get("body", ""), item.get("ghost", False)))
    if shot.get("source"):
        cmds.append(text(fid, "source", shot["source"], 60, 1808, 960, 22, BRONZE))
    return cmds


SHOTS = [
    {
        "id": "R-01",
        "title": "R-01  His close",
        "window": "0:00–0:18  ·  the clip is the whole frame until the title",
        "source": "Source: @bostopianews, Question 9 reel, Nov. 2, 2026",
        "blocks": [
            {"name": "politics", "box": (60, 220, 960, 200), "order": 2, "cue": "libertarianism", "title": "Libertarianism", "body": "The only politics he names."},
            {"name": "left", "box": (60, 460, 960, 360), "order": 3, "cue": "left", "title": "From the left", "body": "This answer comes from the left."},
        ],
    },
    {
        "id": "R-02",
        "title": "R-02  Saint-Domingue",
        "window": "0:18–0:49  ·  clip, then the record, then the position",
        "blocks": [
            {"name": "saint", "box": (60, 180, 960, 340), "order": 2, "cue": "saint-domingue", "title": "Saint-Domingue", "body": "Enslaved Black people took up arms and ended the colonial state."},
            {"name": "record", "box": (60, 560, 960, 220), "order": 3, "cue": "haitian", "title": "The Haitian Revolution is the record."},
            {"name": "position", "box": (60, 820, 960, 240), "order": 4, "cue": "privileged", "title": "A privileged position"},
            {"name": "protector", "box": (60, 1100, 960, 280), "order": 5, "cue": "protector", "title": "Your protector", "body": "An easy question when this government has been your protector."},
        ],
    },
    {
        "id": "R-03",
        "title": "R-03  The map",
        "window": "0:49–1:00",
        "source": "Sources: Mapping Inequality · Analyze Boston · ACS 2024",
        "blocks": [
            {"name": "map", "box": (60, 180, 960, 620), "order": 1, "cue": "boston", "title": "1938 Boston map", "body": "Grades C and D light. A and B stay dim."},
            {"name": "bars", "box": (60, 840, 960, 420), "order": 2, "cue": "seven", "title": "D 3.14    C 3.12    A and B 0.43", "body": "Shootings per 10,000 residents per year. Bars grow from the map."},
            {"name": "label", "box": (60, 1300, 960, 200), "order": 3, "cue": "democide", "title": "State-sponsored democide", "body": "His name for the result. The label sits under the ratio."},
        ],
    },
    {
        "id": "R-04",
        "title": "R-04  The record",
        "window": "1:00–1:07",
        "source": "Source: NSSF",
        "blocks": [
            {"name": "stat", "box": (60, 240, 960, 520), "order": 1, "cue": "eighty-seven", "title": "+87%", "body": "Black women, gun ownership, 2021. One bar, growing."},
            {"name": "called", "box": (60, 820, 960, 280), "order": 2, "cue": "paranoia", "title": "He called that record paranoia."},
        ],
    },
    {
        "id": "R-05",
        "title": "R-05  The check",
        "window": "1:07–2:08  ·  clip, then the receipt, then the fee",
        "source": "Source: OCPF report 960537, receipt 17220407",
        "blocks": [
            {"name": "receipt", "box": (60, 180, 960, 640), "order": 2, "cue": "receipt", "title": "$50,000", "body": "Smith & Wesson Brands. September 25, 2024. One large receipt among 3,324. 2,499 are $100 or less."},
            {"name": "caption", "box": (60, 860, 960, 180), "order": 3, "cue": "handguns", "title": "Two handguns", "body": "His account of the bill, the tours, and the purchase. A caption."},
            {"name": "fee", "box": (60, 1080, 960, 520), "order": 4, "cue": "license", "title": "$200 or more", "body": "Poll tax about $15 a year. White median about $550,000. Black about $7,800. The household still arriving."},
        ],
    },
    {
        "id": "R-06",
        "title": "R-06  The repeal",
        "window": "2:08–3:26  ·  the grant leaves when the compare arrives",
        "source": "Source: Massachusetts Attorney General, 2016 notice",
        "blocks": [
            {"name": "grant", "box": (60, 180, 960, 220), "order": 2, "cue": "jail", "title": "He should lose the gun.", "body": "One line. The box leaves when the compare arrives.", "ghost": True},
            {"name": "compare", "box": (60, 430, 960, 440), "order": 3, "cue": "mini-14", "title": "AR-15  ·  Mini-14", "body": "Banned by name. Listed as not covered. Same round."},
            {"name": "date", "box": (60, 900, 960, 240), "order": 4, "cue": "august", "title": "August 1, 2024", "body": "Held that day, the rifle stays. After that date is who the tightening is written against."},
            {"name": "parts", "box": (60, 1170, 960, 400), "order": 5, "cue": "stock", "title": "Stock and grip", "body": "What lets a smaller or disabled shooter fit and control the rifle."},
        ],
    },
    {
        "id": "R-07",
        "title": "R-07  The right",
        "window": "3:26–4:35",
        "source": "Source: Locke, Second Treatise, §137",
        "blocks": [
            {"name": "privilege", "box": (60, 180, 960, 200), "order": 2, "cue": "privilege", "title": "He calls the right a privilege."},
            {"name": "word", "box": (60, 420, 960, 280), "order": 3, "cue": "unalienable", "title": "Unalienable", "body": "The Declaration's word. A right the person already holds."},
            {"name": "locke", "box": (60, 740, 960, 420), "order": 4, "cue": "locke", "title": "A worse condition than the state of nature", "body": "Hand the force to the legislator, and he can make a prey of them when he pleases."},
            {"name": "animals", "box": (60, 1200, 960, 280), "order": 5, "cue": "animals", "title": "Other animals carry that charge.", "body": "His extension. The source line stays off this box."},
        ],
    },
    {
        "id": "R-08",
        "title": "R-08  The wage",
        "window": "4:35–5:29",
        "source": "Source: the manuscript",
        "blocks": [
            {"name": "captives", "box": (60, 180, 960, 320), "order": 1, "cue": "planters", "title": "Arms for captives", "body": "Planters held the enslaved population with the firearms the trade put in their hands."},
            {"name": "wage", "box": (60, 540, 960, 280), "order": 2, "cue": "wage", "title": "The White buffer class, as a wage"},
            {"name": "mason", "box": (60, 860, 960, 420), "order": 3, "cue": "sink", "title": "Weaken them, and let them sink.", "body": "Mason, Virginia, 1788. August 1, 2024 is the date in this law."},
            {"name": "lexington", "box": (60, 1320, 960, 320), "order": 4, "cue": "lexington", "title": "Lexington and Concord", "body": "April 1775. This state. The firearms were the line."},
        ],
    },
    {
        "id": "R-09",
        "title": "R-09  Governor Healey",
        "window": "5:29–5:49  ·  her clip, then three lines",
        "source": "Source: Gov. Healey, her yes-on-9 reel",
        "blocks": [
            {"name": "name", "box": (60, 280, 960, 220), "order": 2, "cue": "healey", "title": "Governor Healey"},
            {"name": "programs", "box": (60, 560, 960, 320), "order": 3, "cue": "none", "title": "A yes vote funds none of the programs she names."},
            {"name": "position", "box": (60, 940, 960, 280), "order": 4, "cue": "incoherent", "title": "The position is incoherent."},
        ],
    },
    {
        "id": "R-10",
        "title": "R-10  Vote no",
        "window": "5:49–6:24",
        "source": "Sources: CDC · Census · RAND Gun Policy in America",
        "blocks": [
            {"name": "plot", "box": (60, 180, 960, 520), "order": 1, "cue": "poverty", "title": "Poverty r = +0.72", "body": "Gun-law rank r = +0.29 alone. About zero once poverty and inequality are in."},
            {"name": "laws", "box": (60, 740, 960, 240), "order": 2, "cue": "storage", "title": "Safe storage and background checks", "body": "The laws RAND finds work."},
            {"name": "vote", "box": (60, 1020, 960, 520), "order": 3, "cue": "tomorrow", "title": "Tomorrow is voting day. Vote no.", "body": "Racism, sexism, and systemic ableism. The word systemic once, on that cue."},
        ],
    },
]


def main():
    setup = [
        {"command": "file.new", "params": {"name": "Q9 Bostopia wireframes"}},
        {"command": "page.rename", "params": {"name": "Ten shots · 1080 × 1920"}},
        {"command": "page.setBackground", "params": {"color": WELL}},
    ]
    for index, shot in enumerate(SHOTS):
        setup.append({"command": "node.create", "params": {
            "type": "frame", "name": shot["id"],
            "x": index * 1200, "y": 0, "width": 1080, "height": 1920,
            "select": False,
            "props": {"clip": True, "fills": [{"type": "solid", "color": FIELD, "opacity": 1, "visible": True, "blend": "normal"}]},
        }})
    created = run(setup)
    frame_ids = [row["result"]["id"] for row in created[-len(SHOTS):]]

    children = []
    for shot, fid in zip(SHOTS, frame_ids):
        children.extend(frame_cmds(fid, shot))
        print(shot["id"], fid, "boxes", len(shot["blocks"]))
    run(children, NATIVE)

    exports = []
    for shot, fid in zip(SHOTS, frame_ids):
        exports.append({"command": "file.export", "params": {
            "ids": [fid], "format": "png", "size": {"by": "width", "value": 1080},
            "path": str(HERE / f"{shot['id']}.png"),
        }})
    run(exports, NATIVE)
    for shot in SHOTS:
        out = HERE / f"{shot['id']}.png"
        print(out.name, out.stat().st_size)


if __name__ == "__main__":
    main()
