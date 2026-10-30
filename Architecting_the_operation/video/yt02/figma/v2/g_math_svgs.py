"""LaTeX labels for the G explainers, rendered to outline SVG for Figma (real sub- and superscripts).

    python3 Architecting_the_operation/video/yt02/figma/v2/g_math_svgs.py

Writes assets_g/<key>.svg and assets_g.json ({key: svg text}); g_assets.js turns each into a node on
the "YT02v2 · Explainers G" page, where the builders clone them by name.
"""
import json
import re
import subprocess
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "assets_g"
LABELS = {
    "g.eq211": r"L\,\ddot{q} + R\,\dot{q} + \frac{1}{C}\,q = V(t)",
    "g.L": r"L", "g.R": r"R", "g.C": r"C", "g.V": r"V(t)", "g.q": r"q(t)", "g.t": r"t",
    "g.q0": r"q = 0",
    "g.zeta": r"\zeta = \frac{R}{2}\sqrt{\frac{C}{L}}",
    "g.alpha": r"\alpha = \frac{R}{2L}",
    "g.omega": r"\omega_0 = \frac{1}{\sqrt{LC}}",
    "g.pair": r"(\psi_m,\ \psi_s)",
    "g.Wsum": r"W = \psi_m + j\,\psi_s",
    "g.j2": r"j^2 = -1",
    "g.jpsis": r"j\,\psi_s",
}
DOC = r"""\documentclass[preview,border=1pt]{standalone}
\usepackage{amsmath,amssymb}
\begin{document}$\displaystyle %s$\end{document}
"""


def render(key, tex, tmp):
    (tmp / f"{key}.tex").write_text(DOC % tex)
    subprocess.run(["latex", "-interaction=nonstopmode", f"{key}.tex"], cwd=tmp, check=True, capture_output=True)
    subprocess.run(["dvisvgm", "--no-fonts", "--exact-bbox", "-o", str(OUT / f"{key}.svg"), f"{key}.dvi"],
                   cwd=tmp, check=True, capture_output=True)
    svg = (OUT / f"{key}.svg").read_text()
    # two decimals is far below a pixel at label sizes; it halves what each use_figma call carries
    svg = re.sub(r"<\?xml[^>]*>|<!--.*?-->", "", svg)
    svg = re.sub(r"-?\d*\.\d{3,}", lambda m: f"{float(m.group()):.2f}".rstrip("0").rstrip("."), svg)
    svg = re.sub(r">\s+<", "><", svg).replace("version='1.1' ", "").replace(" id='page1'", "")
    (OUT / f"{key}.svg").write_text(svg.strip())
    return svg.strip()


def main():
    OUT.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory() as d:
        svgs = {k: render(k, v, Path(d)) for k, v in LABELS.items()}
    (HERE / "assets_g.json").write_text(json.dumps(svgs, separators=(",", ":")))
    print({k: len(v) for k, v in svgs.items()})


if __name__ == "__main__":
    main()
