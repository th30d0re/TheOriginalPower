#!/usr/bin/env python3
"""Convert a cover SVG into a print-page PDF for binding into the manuscript.

WHY CHROME: pdflatex cannot include SVG, and this machine has no rsvg-convert,
Inkscape, cairosvg or svglib. Chrome renders SVG correctly and prints PURE VECTOR
PDF — verified with `pdfimages -list`, which reports no raster objects — so the
bound page stays sharp at any zoom and at press resolution.

WHY A WRAPPER: the manuscript is letter (612x792 pt, ratio 0.773) and the cover
canvas is 1200x1600 (ratio 0.75). Those do not match. The wrapper pins @page to
the manuscript's page size and centres the artwork inside it, with the cover's own
background colour bled to the page edge, so a bound cover page is exactly the size
of every other page. Scaling the art to fill would distort it; letterboxing onto a
white page would band it. This does neither.

    python3 tools/cover_to_pdf.py --svg cover/the_original_power_cover.svg \\
                                  --out Paper/figures/cover_front.pdf
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
import tempfile
from pathlib import Path

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

WRAPPER = """<!doctype html><html><head><meta charset="utf-8"><style>
@page {{ size: {pw}in {ph}in; margin: 0; }}
html, body {{ margin: 0; padding: 0; background: {bg}; }}
.wrap {{ width: {pw}in; height: {ph}in; background: {bg};
         display: flex; align-items: center; justify-content: center; }}
svg {{ {fit}: {size}in; display: block; }}
</style></head><body><div class="wrap">{svg}</div></body></html>"""


def convert(svg_path: Path, out: Path, pw: float, ph: float) -> None:
    svg = svg_path.read_text(encoding="utf-8")
    m = re.search(r"--bg:\s*(#[0-9a-fA-F]{3,8})", svg)
    if not m:
        sys.exit(f"{svg_path}: no --bg custom property found")
    bg = m.group(1)

    vb = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg)
    if not vb:
        sys.exit(f"{svg_path}: no viewBox")
    aw, ah = float(vb.group(1)), float(vb.group(2))

    # Fit whichever dimension binds first, so nothing is cropped.
    if aw / ah > pw / ph:
        fit, size = "width", pw
    else:
        fit, size = "height", ph

    html = WRAPPER.format(pw=pw, ph=ph, bg=bg, fit=fit, size=size,
                          svg=svg[svg.index("<svg"):])
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        wrap = Path(td) / "wrap.html"
        wrap.write_text(html, encoding="utf-8")
        r = subprocess.run(
            [CHROME, "--headless=new", "--disable-gpu", "--no-sandbox",
             "--no-pdf-header-footer", "--virtual-time-budget=8000",
             f"--print-to-pdf={out}", f"file://{wrap}"],
            capture_output=True, text=True,
        )
    if not out.exists():
        sys.exit(f"chrome produced no output\n{r.stderr[-800:]}")
    print(f"wrote {out}  ({out.stat().st_size:,} bytes, "
          f"{pw}x{ph}in, art fitted by {fit})")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--svg", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--page-w", type=float, default=8.5, help="page width, inches")
    ap.add_argument("--page-h", type=float, default=11.0, help="page height, inches")
    a = ap.parse_args()
    if not Path(CHROME).exists():
        sys.exit(f"Chrome not found at {CHROME}")
    convert(a.svg, a.out, a.page_w, a.page_h)


if __name__ == "__main__":
    main()
