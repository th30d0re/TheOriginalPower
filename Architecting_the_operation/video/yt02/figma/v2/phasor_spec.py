"""Timed specs for the three SEG 10 phasor frames in Figma (phasor_builder.js draws them).

    YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt02/figma/v2/phasor_spec.py

Each state is (shot id, cue word, θ, caption, extras). The cue word's spoken time, relative to the
frame's first turn, is when θ moves and the caption changes. Extras:
  hi:<m|s|eq|cs>      pulse ψ_m, ψ_s, Equation 3.5 or the cos/sin row
  ctx:<key>           show context panel CTX[key] (it stays until the next ctx)
  pin:<0|1|2|all>     light the historical marker(s)
  circle / nocircle   the constant-|W| circle
  eq / cs             Equation 3.5 or the cos/sin row appears (frames that start without them)
Writes phasor_specs.json next to this file.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
EDIT = ROOT / "Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py"

# Context panels: (tag, body lines or None, svg asset or None, [(line cue, line)] revealed one by one)
CTX = {
    "alloc": ("SUPPRESSION ALLOCATION", ["ψ_m · the material wage", "ψ_s · the psychological or status wage"], None, None),
    "dubois": ("DU BOIS · THE WAGE OF WHITENESS", ["deference · public standing", "institutional access · legal leniency",
               "W. E. B. Du Bois, Black Reconstruction in America (1935)"], None, None),
    "diag": ("AN ORDINAL DIAGNOSTIC", None, None, [("shrink", "material concessions shrink"), ("expands", "status expands"),
             ("crosses", "extraction crosses into the Buffer Class")]),
    "const": ("SAME |W| · DIFFERENT θ", ["Equal total allocation; different lives for the Buffer Class."], "ph.const", None),
    "tier3": ("CONFIDENCE TIER 3 · ORDINAL REGIMES", None, None, [("zero,", "θ = 0° · pure material"), ("ninety,", "θ = 90° · pure status"),
              ("beyond", "θ > 90° · Quadrant II")]),
    "invest": ("MATERIAL WORK", ["land · capital · healthcare", "wages · public works"], None, None),
    "zero": ("PURE STATUS · θ = 90°", ["ψ_s carries the full wage magnitude."], "ph.zero", None),
    "reactive": ("REACTIVE POWER", ["Sustains a field and redirects current", "with zero net work on the material axis."], None, None),
    "culture": ("THE SOCIAL MAPPING · CULTURE WAR", ["status signaling · hierarchy defense", "identity conflict",
                "zero material improvement for the Buffer Class"], None, None),
    "free": ("ZERO-CAPITAL STATUS WAGE", ["rank · deference · immunity",
             "proximity to the protected side of the boundary"], None, None),
    "neg": ("COSINE TURNS NEGATIVE", ["Material wealth flows up to the Elite;", "the status component stays positive."], "ph.neg", None),
    "lose": ("MATERIAL LOSS · SYMBOLIC GAIN", ["wages · housing security · healthcare", "bargaining power",
             "traded for a larger promise of superiority"], None, None),
    "knob": ("θ · THE SYSTEM'S TUNING KNOB", ["Cheap status allocation replaces", "expensive material concessions."], None, None),
    "csa": ("COMPLEX SUPPRESSION ALLOCATION", ["90° is the extraction kernel's default mode:", "status preserves alignment, capital stays at the apex."], None, None),
    "fascism": ("QUADRANT II · FASCISM THRESHOLD", ["negative material transfer", "+ hyper-inflated psychological wages"], None, None),
    "arms": ("ARMS · A CALIBRATION ANCHOR FOR ψ_m", ["who may carry arms", "who must appear without them", "what object closes an indenture"], None, None),
    "q2dates": ("QUADRANT II · ORDINAL", ["direction and sign change;", "arms statutes supply discrete dates"], None, None),
    "log3": ("COMPILED RUNTIME LOG 3", ["The status channel becomes an explicit", "system component after 1676."], "ph.log3", None),
    "codes": ("THE 1705 CODES", ["freedom dues · a musket", "protection from chattel slavery", "authority to police the racial boundary"], None, None),
    "mixed": ("1705 · A MIXED ALLOCATION", ["material privileges plus the formal", "installation of the psychological component"], None, None),
    "log9": ("COMPILED RUNTIME LOG 9", ["The Complex Wage weaponized alongside", "spatial redlining and the Capture Variable"], None, None),
    "credit": ("THE CONTAINMENT-ERA WAGE", ["ψ_m · partitioned housing credit, infrastructure,", "labor protections",
               "ψ_s · rank and legal protection across the color line"], None, None),
    "tele": ("PHASE LOADING · THRESHOLD PROXIMITY", ["Dashboard ranges only; no measured θ."], "ph.tele", None),
    "ac": ("AFTER 1965 · AC MODE", ["Facially neutral rules preserve extraction", "through phase-shifted proxy channels."], None, None),
    "exemplars": ("THE BOOK'S EXEMPLARS", ["mass incarceration · the War on Drugs", "redlining 2.0 · algorithmic credit scoring",
                  "subprime lending · school-funding gerrymanders", "the culture-war runtime"], None, None),
    "routes": ("TWO PROXY ROUTES", ["criminal status · incarceration, the War on Drugs", "spatial and financial · redlining 2.0, credit, subprime"], None, None),
    "enclose": ("EXTRACTION FROM THE BUFFER CLASS", ["deindustrialization · debt enclosure", "declining union power"], "ph.neg", None),
    "q2loss": ("QUADRANT II", ["material loss paired with", "intensified psychological compensation"], None, None),
    "contract": ("ONE ROTATING QUANTITY", ["Material concessions recede, status expands,", "and extraction crosses into the Buffer Class."], None, None),
}

FRAMES = [
    {"name": "wage S10-01", "first": "S10-01", "next": "S10-06", "theta0": 25, "eq": False, "cs": False, "pins": False,
     "headline": "The Wage Phasor · Two Wage Channels",
     "source": "The Original Power, Ch. 3, Eq. 3.5; Ch. 4 citing Du Bois · θ placements are illustrative",
     "states": [
         ("S10-01", "mechanical", 25, "WHY DEFEND A HIERARCHY THAT EXTRACTS?", []),
         ("S10-02", "suppression", 45, "SUPPRESSION ALLOCATION · TWO WAGE CHANNELS", ["ctx:alloc"]),
         ("S10-02", "material", None, None, ["hi:m"]),
         ("S10-02", "status", None, None, ["hi:s"]),
         ("S10-03", "psychological", 60, "DU BOIS · THE PSYCHOLOGICAL WAGE", ["ctx:dubois", "hi:s"]),
         ("S10-04", "Equation", 45, "EQUATION 3.5 · ONE COMPLEX WAGE", ["eq", "hi:eq"]),
         ("S10-05", "angle", None, "θ · AN ORDINAL DIAGNOSTIC", ["cs", "hi:cs", "ctx:diag"]),
     ]},
    {"name": "wage S10-14", "first": "S10-14", "next": "S10-30", "theta0": 35, "eq": True, "cs": True, "pins": False,
     "headline": "The Wage Phasor · Rotating θ",
     "source": "The Original Power, Ch. 3, Eq. 3.5 and the Complex Suppression Allocation · θ placements are illustrative",
     "states": [
         ("S10-14", "same", 70, "EQUAL MAGNITUDE · DIFFERENT MIX", ["circle", "ctx:const"]),
         ("S10-15", "ordinal", 45, "ORDINAL REGIMES", ["nocircle", "ctx:tier3"]),
         ("S10-16", "zero", 0, "θ = 0° · PURE MATERIAL", ["hi:m"]),
         ("S10-17", "investment", 12, "MATERIAL INVESTMENT", ["ctx:invest"]),
         ("S10-18", "increases", 55, "ROTATION REDISTRIBUTES THE WAGE", ["hi:m", "hi:s"]),
         ("S10-19", "ninety", 90, "θ = 90° · ψ_m = 0", ["ctx:zero", "hi:s"]),
         ("S10-20", "reactive", None, "REACTIVE POWER", ["ctx:reactive"]),
         ("S10-21", "culture", None, "CULTURE WAR · PURE REACTIVE POWER", ["ctx:culture"]),
         ("S10-22", "zero", None, "ZERO-CAPITAL STATUS ALLOCATION", ["ctx:free"]),
         ("S10-23", "past", 118, "PAST 90° · QUADRANT II", []),
         ("S10-24", "negative", 120, "MATERIAL FLOWS UP TO THE ELITE", ["ctx:neg", "hi:m"]),
         ("S10-25", "lose", 125, "LOSS + SYMBOLIC RANK", ["ctx:lose"]),
         ("S10-26", "tuning", 100, "θ · THE SYSTEM'S TUNING KNOB", ["ctx:knob"]),
         ("S10-27", "position", 90, "90° · THE DEFAULT OPERATING MODE", ["ctx:csa", "hi:s"]),
         ("S10-28", "Quadrant", 128, "QUADRANT II · FASCISM THRESHOLD", ["ctx:fascism"]),
         ("S10-29", "Firearms", 45, "ARMS · A DISCRETE ψ_m ANCHOR", ["ctx:arms", "hi:m"]),
     ]},
    {"name": "wage S10-43", "first": "S10-43", "next": "S11-01", "theta0": 128, "eq": True, "cs": True, "pins": True,
     "headline": "The Wage Phasor · Historical Markers",
     "source": "The Original Power, Ch. 4; Compiled Runtime Logs 3 and 9 · θ placements are illustrative",
     "states": [
         ("S10-43", "ordinal", None, "ORDINAL DIRECTION · SIGN CHANGE", ["ctx:q2dates"]),
         ("S10-44", "Bacon's", 90, "1705 · FIRST IMPLEMENTATION", ["pin:0"]),
         ("S10-45", "Runtime", None, "LOG 3 · W = jψ_s", ["ctx:log3", "hi:eq"]),
         ("S10-46", "privileges", 72, "1705 · MATERIAL AND LEGAL PRIVILEGES", ["ctx:codes", "hi:m"]),
         ("S10-47", "mixed", None, "1705 · MIXED ALLOCATION", ["ctx:mixed"]),
         ("S10-48", "containment", 90, "1894–1965 · CONTAINMENT", ["pin:1", "ctx:log9"]),
         ("S10-49", "material", 84, "PARTITIONED CREDIT + PROTECTION", ["ctx:credit", "hi:m"]),
         ("S10-50", "ranges", 90, "NO INVENTED ANGLE", ["ctx:tele"]),
         ("S10-51", "1965", 108, "AFTER 1965 · PROXY CHANNELS", ["pin:2", "ctx:ac"]),
         ("S10-52", "exemplars", 118, "FACIALLY NEUTRAL EXEMPLARS", ["ctx:exemplars"]),
         ("S10-53", "incarceration", 124, "CARCERAL + FINANCIAL PROXIES", ["ctx:routes"]),
         ("S10-54", "deindustrialization", 128, "MATERIAL PROJECTION CROSSES ZERO", ["ctx:enclose", "hi:m"]),
         ("S10-55", "status", 135, "STATUS REMAINS POSITIVE", ["ctx:q2loss", "hi:s"]),
         ("S10-56", "rotating", 132, "ONE ROTATING CONTRACT", ["ctx:contract", "hi:eq", "pin:all"]),
     ]},
]


def norm(w):
    return re.sub(r"[^\w'’\-–]", "", w.lower())


def turns():
    """shot id -> (start seconds, text), from `edit16x9.py turns` for segments 10 and 11."""
    out = {}
    for seg in ("10", "11"):
        txt = subprocess.run([sys.executable, str(EDIT), "turns", seg], capture_output=True, text=True, check=True).stdout
        for m in re.finditer(r"^\s+\[\d+\] (S\d\d-\d\d) \w+ @([\d.]+)s  (.*)$", txt, re.M):
            out[m.group(1)] = (float(m.group(2)), m.group(3).strip())
    return out


def main():
    T = turns()
    words = json.load(open(ROOT / "outputs/YT02V2/words.json"))
    by_text = {w["text"].strip(): w["words"] for w in words}

    def cue(sid, word, after=0.0):
        start, text = T[sid]
        ws = by_text[text]
        hits = [w["t"] for w in ws if norm(w["w"]) == norm(word) and w["t"] >= after]
        if not hits:
            raise SystemExit(f"{sid}: cue {word!r} not spoken in: {text}")
        return start, hits[0]

    specs = []
    for f in FRAMES:
        t0 = T[f["first"]][0]
        spec = {k: f[k] for k in ("name", "theta0", "eq", "cs", "pins", "headline", "source")}
        spec["duration"] = round(T[f["next"]][0] - t0, 2)
        spec["states"] = []
        for sid, word, theta, cap, extras in f["states"]:
            start, rel = cue(sid, word)
            st = {"t": round(start + rel - t0, 2), "theta": theta, "cap": cap, "x": extras}
            for e in extras:
                if e.startswith("ctx:"):
                    tag, body, svg, lines = CTX[e[4:]]
                    st["ctx"] = {"tag": tag, "body": body, "svg": svg,
                                 "lines": [[round(start + cue(sid, lw)[1] - t0, 2), lt] for lw, lt in lines] if lines else None}
            spec["states"].append(st)
        specs.append(spec)
        print(f["name"], spec["duration"], [s["t"] for s in spec["states"]])
    json.dump(specs, open(HERE / "phasor_specs.json", "w"), indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main()
