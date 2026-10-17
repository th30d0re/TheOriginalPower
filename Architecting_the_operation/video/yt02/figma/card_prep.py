"""Prepare card JSON for the Figma card builder: typeset equations and QR codes to SVG.

    .venv-manimgx/bin/python Architecting_the_operation/video/yt02/figma/card_prep.py CARD.json [...] > batch.json

Equations (`latex`, `terms[].latex`, and `$…$` spans in text fields) are typeset with pdflatex
(standalone class) and converted with pdftocairo -svg; QR codes come from segno. Output is one JSON
list the builder reads: the card plus `svg` fields. SVGs are cached under ~/.cache/yt02_tex.
"""
import hashlib, json, re, subprocess, sys, tempfile
from pathlib import Path

CREAM = "#e8c99b"
CACHE = Path.home() / ".cache" / "yt02_tex"
CACHE.mkdir(parents=True, exist_ok=True)
DOC = r"""\documentclass[border=2pt]{standalone}
\usepackage{amsmath,amssymb}\usepackage{xcolor}\definecolor{ink}{HTML}{E8C99B}
\begin{document}\color{ink}$\displaystyle %s$\end{document}
"""


def tex_svg(tex):
    tex = " ".join(tex.split())
    key = hashlib.sha1(tex.encode()).hexdigest()[:16]
    out = CACHE / f"{key}.svg"
    if not out.exists():
        with tempfile.TemporaryDirectory() as d:
            (Path(d) / "e.tex").write_text(DOC % tex)
            r = subprocess.run(["pdflatex", "-interaction=nonstopmode", "-halt-on-error", "e.tex"], cwd=d, capture_output=True, text=True)
            if r.returncode:
                raise SystemExit(f"pdflatex failed on {tex!r}:\n" + r.stdout[-800:])
            subprocess.run(["pdftocairo", "-svg", "e.pdf", str(out)], cwd=d, check=True)
    svg = out.read_text()
    svg = re.sub(r"<\?xml[^>]*>", "", svg)
    svg = re.sub(r'fill="rgb\([^)]*\)"', f'fill="{CREAM}"', svg)
    svg = re.sub(r"(\d+\.\d)\d+", r"\1", svg)                 # one decimal is plenty at video size
    return re.sub(r">\s+<", "><", svg).strip()


def qr_svg(url):
    import segno
    m = segno.make(url, error="m").matrix
    n = len(m); runs = []
    for y, row in enumerate(m):
        x = 0
        while x < n:
            if row[x]:
                s = x
                while x < n and row[x]: x += 1
                runs.append(f"M{s} {y}h{x - s}v1h-{x - s}z")
            else:
                x += 1
    cells = "".join(runs)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 {n + 4} {n + 4}" width="{(n + 4) * 8}" height="{(n + 4) * 8}">'
            f'<rect x="-2" y="-2" width="{n + 4}" height="{n + 4}" fill="#e8c99b"/><path d="{cells}" fill="#0d1b2a"/></svg>')


def prep(path, assets_dir=None, figures_root=None):
    """Return the card (text only) and its asset list [(key, file, mime)] written under assets_dir."""
    card = json.loads(Path(path).read_text())
    cid = card["id"] = Path(path).stem
    out = []
    def put(key, svg):
        f = Path(assets_dir) / f"{key}.svg"; f.write_text(svg); out.append((key, str(f), "image/svg+xml"))
    if card.get("latex"):
        put(f"{cid}.latex", tex_svg(card["latex"])); card["hasLatex"] = True
    for i, t in enumerate(card.get("terms") or []):
        put(f"{cid}.term{i + 1}", tex_svg(t["latex"]))
    if card.get("qrUrl"):
        put(f"{cid}.qr", qr_svg(card["qrUrl"])); card["hasQr"] = True
    if card.get("image"):
        src = Path(figures_root or ".") / card["image"]
        if src.exists():
            dst = Path(assets_dir) / f"{cid}.fig{src.suffix}"; dst.write_bytes(src.read_bytes())
            out.append((f"{cid}.fig", str(dst), "image/png" if src.suffix == ".png" else "image/jpeg")); card["hasFigure"] = True
    return card, out


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("cards", nargs="+"); ap.add_argument("--assets", required=True); ap.add_argument("--figures", default=".")
    ap.add_argument("--out", required=True, help="text-only card batch JSON"); ap.add_argument("--manifest", required=True)
    a = ap.parse_args(); Path(a.assets).mkdir(parents=True, exist_ok=True)
    cards, manifest = [], []
    for c in a.cards:
        card, assets = prep(c, a.assets, a.figures); cards.append(card); manifest += assets
    Path(a.out).write_text(json.dumps(cards, ensure_ascii=False))
    Path(a.manifest).write_text(json.dumps(manifest))
    print(f"{len(cards)} cards, {len(manifest)} assets")
