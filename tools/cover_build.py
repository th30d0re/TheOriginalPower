#!/usr/bin/env python3
"""Generate the layered cover SVG for *The Original Power*.

WHY A GENERATOR: the border is a closed circuit loop with dozens of repeated
components (coils, resistors, capacitors, junctions). Placing those by hand is
what image generators get wrong — they cannot hold identical components in
register. Here every component is a single <symbol> instanced with <use>, so
editing one coil edits all of them.

WORKFLOW: run this ONCE to lay down accurate geometry, then treat the emitted
SVG as the source of truth and edit it directly (in Inkscape, or by asking for a
specific change). Re-running overwrites hand edits — pass --out to a new path if
you want to keep both.

    python3 tools/cover_build.py --out cover/the_original_power_cover.svg

Layers are emitted with Inkscape's groupmode/label attributes, so they appear as
real, toggleable layers in Inkscape's layer panel.
"""
from __future__ import annotations

import argparse
import math
from pathlib import Path

# ── Canvas ────────────────────────────────────────────────────────────────────
# Proportions follow the hand-drawn study (3:4). Set TRIM_* once the print trim
# size is fixed; everything below is expressed in these user units.
W, H = 1200, 1600

# ── Palette ───────────────────────────────────────────────────────────────────
# Exposed as CSS custom properties at the top of the SVG so the whole cover can
# be recolored by editing four values. BLUEPRINT is the hand-drawn study's
# indigo; MIDNIGHT is the darker treatment. Swap by changing --bg / --ink.
PALETTES = {
    "midnight": {"bg": "#0d1b2a", "ink": "#e8c99b", "accent": "#e08a3c", "dim": "#8a6a45"},
    "blueprint": {"bg": "#2e3192", "ink": "#ffffff", "accent": "#ffffff", "dim": "#c9c9e8"},
}

NS = (
    'xmlns="http://www.w3.org/2000/svg" '
    'xmlns:xlink="http://www.w3.org/1999/xlink" '
    'xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" '
    'xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"'
)


def layer(lid: str, label: str, body: str, display: str = "inline") -> str:
    return (
        f'<g id="{lid}" inkscape:groupmode="layer" inkscape:label="{label}" '
        f'style="display:{display}">\n{body}\n</g>\n'
    )


# ── Component symbols ─────────────────────────────────────────────────────────
# Each is drawn along +x from (0,0) to (len,0) so it can be placed on any edge
# with a single rotation. Change a symbol here and every instance updates.
def defs() -> str:
    coil_r, coils = 9, 4
    d = [f"M 0 0"]
    for i in range(coils):
        x = i * coil_r * 2
        d.append(f"a {coil_r} {coil_r} 0 0 1 {coil_r*2} 0")
    d.append(f"l 10 0")
    inductor = " ".join(d)

    # Even zigzag: half-step in, six full alternating strokes, half-step out.
    # Six alternating strokes so the tail lands back on the centreline at y=0.
    amp, step = 9, 6
    zig = ["M 0 0", f"l {step/2} {-amp}"]
    for i in range(6):
        zig.append(f"l {step} {2*amp if i % 2 == 0 else -2*amp}")
    zig.append(f"l {step/2} {amp}")
    resistor = " ".join(zig)

    return f"""<defs>
  <style><![CDATA[
    :root {{ }}
    .wire   {{ fill:none; stroke:var(--ink); stroke-width:3.2;
               stroke-linecap:round; stroke-linejoin:round; }}
    .wire-thin {{ fill:none; stroke:var(--ink); stroke-width:2.2;
               stroke-linecap:round; }}
    .fill-ink  {{ fill:var(--ink); stroke:none; }}
    .no-fill   {{ fill:none; }}
    .chart     {{ fill:none; stroke:var(--dim); stroke-width:1.6; }}
    .chart-rim {{ fill:none; stroke:var(--ink); stroke-width:3; }}
    .accent    {{ stroke:var(--accent); fill:none; stroke-width:3.4; }}
    .accent-fill {{ fill:var(--accent); stroke:none; }}
    .label     {{ fill:var(--ink); font-family:'Courier New',monospace;
                  font-size:17px; }}
    .label-sm  {{ fill:var(--dim); font-family:'Courier New',monospace;
                  font-size:14px; }}
  ]]></style>

  <!-- inductor: {coils} loops, {coil_r*2*coils+10} long -->
  <symbol id="s-coil" overflow="visible"><path class="wire" d="{inductor}"/></symbol>
  <symbol id="s-res"  overflow="visible"><path class="wire" d="{resistor}"/></symbol>
  <symbol id="s-cap"  overflow="visible">
    <path class="wire" d="M 0 0 l 12 0 M 12 -17 l 0 34 M 26 -17 l 0 34 M 26 0 l 12 0"/>
  </symbol>
  <symbol id="s-junction" overflow="visible">
    <circle class="wire no-fill" cx="0" cy="0" r="6"/>
  </symbol>
  <symbol id="s-arrow" overflow="visible">
    <path class="fill-ink" d="M -11 0 L 11 0 L 0 26 Z"/>
  </symbol>
  <!-- centre element: the conductor arrives level, climbs both faces of a
       stepped stack, and OPENS at the peak. Drawn pointing "up"; the bottom
       border instances it flipped. -->
  <symbol id="s-stack" overflow="visible">
    <path class="wire" d="M -150 0 L -78 0 L -14 -60"/>
    <path class="wire" d="M 150 0 L 78 0 L 14 -60"/>
    <path class="wire" d="M -50 -10 l 100 0 M -40 -22 l 80 0 M -30 -34 l 60 0 M -20 -46 l 40 0"/>
  </symbol>
  <!-- ground: stacked rules, narrowing downward -->
  <symbol id="s-ground" overflow="visible">
    <path class="wire" d="M -34 0 l 68 0 M -24 9 l 48 0 M -14 18 l 28 0 M -6 27 l 12 0"/>
  </symbol>
</defs>
"""


def use(sym: str, x: float, y: float, rot: float = 0, scale: float = 1) -> str:
    tf = f"translate({x:.1f},{y:.1f})"
    if rot:
        tf += f" rotate({rot})"
    if scale != 1:
        tf += f" scale({scale})"
    return f'  <use xlink:href="#{sym}" transform="{tf}"/>\n'


# ── The border: a closed circuit loop framing the page ────────────────────────
def border() -> str:
    """Four rails, coupled at the corners by adjacent parallel inductors.

    The top and bottom rails each terminate by turning perpendicular into a short
    VERTICAL inductor. Each side rail is straight and begins and ends with its own
    vertical inductor. The two verticals at a corner sit side by side and parallel
    — that adjacency is the magnetic coupling. There is no core symbol and no wire
    joining them, because the segments are not electrically connected.

    Rails are emitted as segments BETWEEN components, so nothing draws a line
    through a capacitor.
    """
    m, COIL, CAP, RES = 74, 82, 38, 36
    top, bot = m, H - m
    left, right = m, W - m
    cx = W / 2
    corner_in = 74          # how far in from a corner the perpendicular pair sits
    out = []

    def run_h(y, x0, x1, items):
        """Lay components left→right along y, wiring only the gaps between them."""
        x = x0
        for sym, ln in items:
            out.append(f'  <path class="wire" d="M {x:.1f} {y} L {x + (ln*0):.1f} {y}"/>\n')
            out.append(f'  <use xlink:href="#{sym}" transform="translate({x:.1f},{y})"/>\n')
            x += ln
            nxt = x
            out.append(f'  <path class="wire" d="M {nxt:.1f} {y} L {nxt:.1f} {y}"/>\n')
        out.append(f'  <path class="wire" d="M {x:.1f} {y} L {x1:.1f} {y}"/>\n')

    def seg_h(y, x0, x1):
        if x1 - x0 > 1:
            out.append(f'  <path class="wire" d="M {x0:.1f} {y} L {x1:.1f} {y}"/>\n')

    def seg_v(x, y0, y1):
        if y1 - y0 > 1:
            out.append(f'  <path class="wire" d="M {x} {y0:.1f} L {x} {y1:.1f}"/>\n')

    # ── horizontal rails: coil, capacitor, [centre stack], capacitor, coil ──
    for y, flip in ((top, 1), (bot, -1)):
        xa, xb = left + corner_in, right - corner_in
        cursor = xa
        seg_v(xa, top, top + 0)
        for sx in (-1, 1):
            base = cx + sx * 300
            # coil then capacitor marching outward from centre
            cpos = cx + sx * 190
            kpos = cx + sx * 330
            if sx < 0:
                seg_h(y, xa, kpos - CAP / 2)
                out.append(f'  <use xlink:href="#s-cap" transform="translate({kpos - CAP/2:.1f},{y})"/>\n')
                seg_h(y, kpos + CAP / 2, cpos - COIL / 2)
                out.append(f'  <use xlink:href="#s-coil" transform="translate({cpos - COIL/2:.1f},{y})"/>\n')
                seg_h(y, cpos + COIL / 2, cx - 150)
            else:
                seg_h(y, cx + 150, cpos - COIL / 2)
                out.append(f'  <use xlink:href="#s-coil" transform="translate({cpos - COIL/2:.1f},{y})"/>\n')
                seg_h(y, cpos + COIL / 2, kpos - CAP / 2)
                out.append(f'  <use xlink:href="#s-cap" transform="translate({kpos - CAP/2:.1f},{y})"/>\n')
                seg_h(y, kpos + CAP / 2, xb)
        # centre stack, flipped for the bottom rail
        # Apexes point inward: the top element hangs down, the bottom rises up.
        fl = " scale(1,-1)" if flip > 0 else ""
        out.append(f'  <g transform="translate({cx},{y}){fl}"><use xlink:href="#s-stack"/></g>\n')

    # ── the perpendicular terminations: vertical inductors hanging off each rail end
    for y, ydir in ((top, 1), (bot, -1)):
        for x in (left + corner_in, right - corner_in):
            out.append(f'  <g transform="translate({x},{y}) rotate({90*ydir})">'
                       f'<use xlink:href="#s-coil"/></g>\n')

    # ── side rails: an inductor at each end, then a continuous populated run ──
    for x in (left, right):
        out.append(f'  <g transform="translate({x},{top}) rotate(90)">'
                   f'<use xlink:href="#s-coil"/></g>\n')
        out.append(f'  <g transform="translate({x},{bot}) rotate(-90)">'
                   f'<use xlink:href="#s-coil"/></g>\n')
        y0, y1 = top + COIL, bot - COIL
        # Distribute components down the rail and wire every gap between them.
        items = [("s-arrow", 0), ("s-res", RES), ("s-cap", CAP), ("s-junction", 0),
                 ("s-coil", COIL), ("s-junction", 0), ("s-cap", CAP), ("s-res", RES),
                 ("s-arrow", 0)]
        span = y1 - y0
        occupied = sum(ln for _, ln in items)
        gap = (span - occupied) / (len(items) + 1)
        cur = y0
        for sym, ln in items:
            cur += gap
            seg_v(x, cur - gap, cur)
            if ln:
                out.append(f'  <g transform="translate({x},{cur:.1f}) rotate(90)">'
                           f'<use xlink:href="#{sym}"/></g>\n')
                cur += ln
            else:
                out.append(use(sym, x, cur))
        seg_v(x, cur, y1)
    return "".join(out)


# ── Smith chart ───────────────────────────────────────────────────────────────
# Real geometry, not a drawing of one: constant-resistance circles are centred at
# (r/(1+r), 0) with radius 1/(1+r); constant-reactance arcs at (1, 1/x) radius
# 1/|x|. Both live in the reflection-coefficient plane and clip to the unit disc.
def smith(cx: float, cy: float, R: float) -> str:
    out = [f'  <circle class="chart-rim" cx="{cx}" cy="{cy}" r="{R}"/>\n']
    out.append(f'  <path class="chart" d="M {cx-R} {cy} L {cx+R} {cy}"/>\n')

    clip = f'  <clipPath id="smith-clip"><circle cx="{cx}" cy="{cy}" r="{R}"/></clipPath>\n'
    body = []
    for r in (0.2, 0.5, 1, 2, 5):
        rr = R / (1 + r)
        body.append(f'  <circle class="chart" cx="{cx + R*r/(1+r):.2f}" cy="{cy}" r="{rr:.2f}"/>\n')
    for x in (0.2, 0.5, 1, 2, 5):
        ra = R / x
        for sgn in (-1, 1):
            body.append(
                f'  <circle class="chart" cx="{cx + R}" cy="{cy + sgn*ra:.2f}" r="{ra:.2f}"/>\n'
            )
    out.append(clip)
    out.append(f'  <g clip-path="url(#smith-clip)">\n{"".join(body)}  </g>\n')

    # Perimeter ticks every 10 degrees.
    for deg in range(0, 360, 10):
        a = math.radians(deg)
        r0, r1 = R, R + (16 if deg % 30 == 0 else 9)
        out.append(
            f'  <path class="wire-thin" d="M {cx+r0*math.cos(a):.1f} {cy-r0*math.sin(a):.1f} '
            f'L {cx+r1*math.cos(a):.1f} {cy-r1*math.sin(a):.1f}"/>\n'
        )
    for lbl, r in (("0", 0), ("0.2", 0.2), ("0.5", 0.5), ("1", 1), ("2", 2)):
        px = cx - R + 2 * R * (r / (1 + r))
        out.append(f'  <text class="label-sm" x="{px:.1f}" y="{cy+22}" text-anchor="middle">{lbl}</text>\n')
    out.append(f'  <text class="label-sm" x="{cx}" y="{cy-R-24}" text-anchor="middle">90°</text>\n')

    # The three axes plotted as loci, per the study.
    for name, ang, mag, col in (
        ("Race", 205, 0.78, "#e05252"),
        ("Gender", 48, 0.62, "#e0a33c"),
        ("Sexuality", 143, 0.55, "#4fc3e8"),
    ):
        a = math.radians(ang)
        px, py = cx + R * mag * math.cos(a), cy - R * mag * math.sin(a)
        out.append(f'  <circle cx="{px:.1f}" cy="{py:.1f}" r="9" fill="{col}"/>\n')
        anchor = "end" if math.cos(a) < 0 else "start"
        dx = -18 if anchor == "end" else 18
        out.append(
            f'  <text class="label" x="{px+dx:.1f}" y="{py+6:.1f}" '
            f'text-anchor="{anchor}" fill="{col}">{name}</text>\n'
        )
    return "".join(out)


# ── Phasor: W = psi_m + j psi_s ───────────────────────────────────────────────
def phasor(ox: float, oy: float, s: float = 1) -> str:
    L = 150 * s
    ang = math.radians(38)
    tx, ty = ox + L * math.cos(ang), oy - L * math.sin(ang)
    return (
        f'  <path class="wire-thin" d="M {ox-40*s} {oy} L {ox+190*s} {oy}"/>\n'
        f'  <path class="wire-thin" d="M {ox} {oy+55*s} L {ox} {oy-150*s}"/>\n'
        f'  <path class="accent" d="M {ox} {oy} L {tx:.1f} {ty:.1f}"/>\n'
        f'  <path class="accent-fill" d="M {tx:.1f} {ty:.1f} l -13 -2 l 5 11 Z"/>\n'
        f'  <path class="wire-thin" style="stroke-dasharray:6 6" '
        f'd="M {tx:.1f} {ty:.1f} L {tx:.1f} {oy}"/>\n'
        f'  <path class="wire-thin" d="M {ox+42*s} {oy} A {42*s} {42*s} 0 0 0 '
        f'{ox+42*s*math.cos(ang):.1f} {oy-42*s*math.sin(ang):.1f}"/>\n'
        f'  <text class="label" x="{ox+52*s}" y="{oy-14}">θ</text>\n'
        f'  <text class="label" x="{tx+10:.1f}" y="{ty-6:.1f}" fill="var(--accent)">W</text>\n'
        f'  <text class="label" x="{ox+196*s}" y="{oy+20}">ψₘ</text>\n'
        f'  <text class="label" x="{ox+8}" y="{oy-158*s}">jψₛ</text>\n'
        f'  <text class="label" x="{ox-30*s}" y="{oy-186*s}">W = ψₘ + jψₛ</text>\n'
    )


# ── Five-tier pyramid ─────────────────────────────────────────────────────────
def pyramid(cx: float, base_y: float, w: float, h: float) -> str:
    """The five-tier stack: E apex, O base. Rules and labels only.

    No conductor passes through this. The circuit-bend-with-open-apex treatment
    belongs to the centre element on the top and bottom rails.
    """
    tiers = ["E", "P", "F", "I", "O"]
    n = len(tiers)
    out = []
    for i, t in enumerate(tiers):
        y = base_y - h * (n - 1 - i) / (n - 1)
        hw = (w / 2) * ((i + 1) / n)
        out.append(f'  <path class="wire" d="M {cx-hw:.1f} {y:.1f} L {cx+hw:.1f} {y:.1f}"/>\n')
        out.append(f'  <text class="label" x="{cx+hw+18:.1f}" y="{y+6:.1f}">{t}</text>\n')
    return "".join(out)


def build(palette: str) -> str:
    p = PALETTES[palette]
    cx = W / 2

    title_std = (
        f'  <text x="{cx}" y="300" text-anchor="middle" fill="var(--ink)" '
        f'font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-weight="700" '
        f'font-size="74" letter-spacing="3">THE ORIGINAL POWER</text>\n'
        f'  <text x="{cx}" y="352" text-anchor="middle" fill="var(--accent)" '
        f'font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-size="17" '
        f'letter-spacing="2">THE PHYSICS OF OPPRESSION AND THE ENGINEERING OF CONTROL</text>\n'
    )
    title_od = (
        f'  <text x="{cx}" y="300" text-anchor="middle" fill="var(--ink)" '
        f'font-family="OpenDyslexic,Comic Sans MS,sans-serif" font-weight="700" '
        f'font-size="70">The Original Power</text>\n'
        f'  <text x="{cx}" y="352" text-anchor="middle" fill="var(--accent)" '
        f'font-family="OpenDyslexic,Comic Sans MS,sans-serif" font-size="21">'
        f'The physics of oppression and the engineering of control</text>\n'
    )
    author = (
        f'  <text x="{cx}" y="{H-150}" text-anchor="middle" fill="var(--ink)" '
        f'font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-size="26" '
        f'letter-spacing="10">EMMANUEL THEODORE</text>\n'
    )

    return f"""<svg {NS} viewBox="0 0 {W} {H}" width="{W}" height="{H}"
     style="--bg:{p['bg']};--ink:{p['ink']};--accent:{p['accent']};--dim:{p['dim']}">
<sodipodi:namedview inkscape:document-units="px" pagecolor="{p['bg']}"/>
<title>The Original Power — cover</title>
{defs()}
{layer("layer-bg", "00 background", f'  <rect x="0" y="0" width="{W}" height="{H}" fill="var(--bg)"/>')}
{layer("layer-border", "10 border circuit", border())}
{layer("layer-title", "20 title (standard)", title_std)}
{layer("layer-title-od", "21 title (OpenDyslexic)", title_od, display="none")}
{layer("layer-phasor", "30 phasor W", phasor(430, 560))}
{layer("layer-smith", "40 smith chart", smith(cx, 960, 300))}
{layer("layer-pyramid", "50 tier pyramid", pyramid(268, H - 300, 230, 210))}
{layer("layer-author", "60 author", author)}
</svg>
"""


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="cover/the_original_power_cover.svg")
    ap.add_argument("--palette", default="midnight", choices=sorted(PALETTES))
    a = ap.parse_args()
    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(build(a.palette), encoding="utf-8")
    print(f"wrote {out}  ({out.stat().st_size:,} bytes, palette={a.palette})")


if __name__ == "__main__":
    main()
