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

# ── Spine ─────────────────────────────────────────────────────────────────────
# Spine width is a function of the block, not a design choice. Recompute it if
# the page count or the stock changes; a wrong spine is the one cover error a
# printer cannot absorb.
#   1114 pp (Paper/The_Original_Power.pdf) x 0.002252 in/page (50lb white offset)
#   = 2.509 in. At a 6x8 in trim the canvas is 200 units/in, so:
PAGE_COUNT = 1114
PAGE_CALIPER_IN = 0.002252          # per-page thickness of the chosen stock
UNITS_PER_IN = W / 6                # 1200 units across a 6 in trim
SPINE_W = round(PAGE_COUNT * PAGE_CALIPER_IN * UNITS_PER_IN)

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
    # Six alternating strokes so the tail lands back on the centerline at y=0.
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
    .accent-area {{ fill:var(--accent); fill-opacity:0.26; stroke:none; }}
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
  <!-- center element: the conductor arrives level, climbs both faces of a
       stepped stack, and OPENS at the peak. Drawn pointing "up"; the bottom
       border instances it flipped. -->
  <symbol id="s-stack" overflow="visible">
    <path class="wire" d="M -150 0 L -78 0 L -14 -60"/>
    <path class="wire" d="M 150 0 L 78 0 L 14 -60"/>
    <path class="wire" d="M -50 -10 l 100 0 M -40 -22 l 80 0 M -30 -34 l 60 0 M -20 -46 l 40 0"/>
  </symbol>
  <!-- ground: stacked rules, narrowing downward.
       Half-width 11 is set by the tightest corner. A coil's windings project 9
       off-axis (+1.6 half-stroke) and, because the top rails rotate +90 and the
       bottom rails -90, they bump TOWARD the corner ground at top-right and
       bottom-left. Clearance there is corner_in - 10.6 - half_width, so 11
       leaves ~6. Three rules, not four: rule spacing must stay near 8 to read
       against the 3.2 stroke, and four rules at this width would merge. -->
  <symbol id="s-ground" overflow="visible">
    <path class="wire" d="M -11 0 l 22 0 M -6 8 l 12 0 M -2 16 l 4 0"/>
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
    # Axis separation of the two parallel inductors that form a corner coupling.
    # One is the end of a side rail (at `left`/`right`); the other is the
    # perpendicular termination of a horizontal rail. Adjacency IS the coupling,
    # so they must read as near-touching while staying visibly separate. The coil
    # windings project 9 units off-axis, so the clear air gap is roughly
    # corner_in - 9 - strokewidth. Shrinking this also lengthens the horizontal
    # run from the termination out to the first capacitor.
    corner_in = 28
    # Wire length between the capacitor and the inductor on each half of a
    # horizontal rail. 80 reproduces the original hand-tuned placement.
    CAP_COIL_GAP = 80
    # Lead between a terminating inductor and its ground. Every other
    # component on the rails is separated by a visible run of wire; without
    # this the ground sits flush against the winding and the two read as one
    # blob rather than as a component and its termination.
    GND_LEAD = 14
    out = []

    def vcoil(x, y, run_down, bump_right):
        """A vertical inductor with run direction and winding side decoupled.

        The rotation is forced by which way the coil must run, and rotate(90)
        happens to bump +x while rotate(-90) bumps -x. Mirroring in the coil's own
        frame with scale(1,-1) flips the windings without disturbing the run, so
        a corner pair can be made to FACE: the left member bumps right, the right
        member bumps left, and the coupling reads as a coupling.
        """
        rot = 90 if run_down else -90
        flip = " scale(1,-1)" if bump_right != run_down else ""
        return (f'  <g transform="translate({x},{y}) rotate({rot}){flip}">'
                f'<use xlink:href="#s-coil"/></g>\n')

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

    # ── horizontal rails: coil, capacitor, [center stack], capacitor, coil ──
    for y, flip in ((top, 1), (bot, -1)):
        xa, xb = left + corner_in, right - corner_in
        cursor = xa
        seg_v(xa, top, top + 0)
        for sx in (-1, 1):
            base = cx + sx * 300
            # coil then capacitor marching outward from center; the capacitor is
            # placed relative to the coil so CAP_COIL_GAP is the literal wire run
            cpos = cx + sx * 190
            kpos = cpos + sx * (COIL / 2 + CAP_COIL_GAP + CAP / 2)
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
        # center stack, flipped for the bottom rail
        # Apexes point inward: the top element hangs down, the bottom rises up.
        fl = " scale(1,-1)" if flip > 0 else ""
        out.append(f'  <g transform="translate({cx},{y}){fl}"><use xlink:href="#s-stack"/></g>\n')

    # ── the perpendicular terminations: vertical inductors hanging off each rail
    # end, each closed to ground. The free end is the only open node on the
    # border, so it terminates rather than dangling.
    for y, ydir in ((top, 1), (bot, -1)):
        for x in (left + corner_in, right - corner_in):
            # at a left corner the termination is the pair's RIGHT member, so it
            # bumps left; at a right corner it is the LEFT member and bumps right
            out.append(vcoil(x, y, ydir > 0, x != left + corner_in))
            # Ground sits at the coil's free end, rules stacking away from the
            # rail. The bottom rail's inductors point up, so their grounds flip.
            ce = y + ydir * COIL                 # coil's free end
            gy = ce + ydir * GND_LEAD            # ground sits a lead beyond it
            out.append(f'  <path class="wire" d="M {x} {ce:.1f} L {x} {gy:.1f}"/>\n')
            flip = "" if ydir > 0 else " scale(1,-1)"
            out.append(f'  <g transform="translate({x},{gy:.1f}){flip}">'
                       f'<use xlink:href="#s-ground"/></g>\n')

    # ── side rails: an inductor at each end, then a continuous populated run ──
    for x in (left, right):
        # the side rail's own end inductors: at `left` they are the pair's LEFT
        # member and bump right; at `right` they bump left
        out.append(vcoil(x, top, True, x == left))
        out.append(vcoil(x, bot, False, x == left))
        # Each side-rail end inductor is open at the corner itself. Ground it
        # there, stacking outward — away from the rail run, so the top corners
        # flip and the bottom corners sit in the symbol's native orientation.
        # Each corner therefore reads as a coupled pair grounded at opposite ends.
        out.append(f'  <path class="wire" d="M {x} {top-GND_LEAD} L {x} {top}"/>\n')
        out.append(f'  <g transform="translate({x},{top-GND_LEAD}) scale(1,-1)">'
                   f'<use xlink:href="#s-ground"/></g>\n')
        out.append(f'  <path class="wire" d="M {x} {bot} L {x} {bot+GND_LEAD}"/>\n')
        out.append(f'  <g transform="translate({x},{bot+GND_LEAD})">'
                   f'<use xlink:href="#s-ground"/></g>\n')
        y0, y1 = top + COIL, bot - COIL
        # (symbol, length along the rail, radius the wire must stop short of).
        # The junction is an open ring; the rail meets its circumference instead
        # of running through the middle of it. r=6 plus the 3.2 stroke means 8
        # lands the wire's rounded cap on the ring itself.
        RING = 8
        items = [("s-arrow", 0, 0), ("s-res", RES, 0), ("s-cap", CAP, 0),
                 ("s-junction", 0, RING), ("s-coil", COIL, 0),
                 ("s-junction", 0, RING), ("s-cap", CAP, 0),
                 ("s-res", RES, 0), ("s-arrow", 0, 0)]
        span = y1 - y0
        occupied = sum(ln for _, ln, _ in items)
        gap = (span - occupied) / (len(items) + 1)
        cur = y0
        pen = y0                       # where the next wire segment starts
        for sym, ln, clr in items:
            cur += gap
            seg_v(x, pen, cur - clr)   # stop short of a ringed symbol
            if ln:
                out.append(f'  <g transform="translate({x},{cur:.1f}) rotate(90)">'
                           f'<use xlink:href="#{sym}"/></g>\n')
                cur += ln
                pen = cur
            else:
                out.append(use(sym, x, cur))
                pen = cur + clr        # resume past the ring
        seg_v(x, pen, y1)
    return "".join(out)


# ── Smith chart ───────────────────────────────────────────────────────────────
# Real geometry, not a drawing of one: constant-resistance circles are centered at
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
def phasor(ox: float, oy: float, R: float = 100) -> str:
    """The complex wage on the unit circle, all four quadrants.

    W is drawn with |W| = 1, so its tip rides ON the circle and theta is read
    directly off it. The axes run past the circle in both directions, so the
    plane is shown whole.
    """
    ext = R + 32                       # how far the axes run past the circle
    ang = math.radians(38)
    tx, ty = ox + R * math.cos(ang), oy - R * math.sin(ang)
    arc = R * 0.34
    return (
        f'  <circle class="chart" cx="{ox}" cy="{oy}" r="{R}"/>\n'
        f'  <path class="wire-thin" d="M {ox-ext} {oy} L {ox+ext} {oy}"/>\n'
        f'  <path class="wire-thin" d="M {ox} {oy+ext} L {ox} {oy-ext}"/>\n'
        f'  <path class="accent" d="M {ox} {oy} L {tx:.1f} {ty:.1f}"/>\n'
        f'  <path class="accent-fill" d="M {tx:.1f} {ty:.1f} l -13 -2 l 5 11 Z"/>\n'
        f'  <path class="wire-thin" style="stroke-dasharray:6 6" '
        f'd="M {tx:.1f} {ty:.1f} L {tx:.1f} {oy}"/>\n'
        f'  <path class="wire-thin" d="M {ox+arc:.1f} {oy} A {arc:.1f} {arc:.1f} 0 0 0 '
        f'{ox+arc*math.cos(ang):.1f} {oy-arc*math.sin(ang):.1f}"/>\n'
        f'  <text class="label" x="{ox+arc+8:.1f}" y="{oy-12}">θ</text>\n'
        f'  <text class="label" x="{tx+10:.1f}" y="{ty-8:.1f}" fill="var(--accent)">W</text>\n'
        # Axis labels sit BESIDE their tips, not beyond them: stacking text above
        # the vertical tip pushes the block into the subtitle.
        f'  <text class="label" x="{ox+ext-30}" y="{oy+22}">ψₘ</text>\n'
        f'  <text class="label" x="{ox+12}" y="{oy-ext+18}">jψₛ</text>\n'
        f'  <text class="label" x="{ox}" y="{oy-ext-20}" text-anchor="middle">'
        f'W = ψₘ + jψₛ</text>\n'
    )


# ── Unified Lorentz force (E219) ──────────────────────────────────────────────
def lorentz(cx: float, cy: float, w: float = 260, h: float = 132) -> str:
    """F = QE_mat + Q(v x sum rho_k B_k).

    The point of the figure is the asymmetry: E_mat is collinear with v and does
    real work; the B term is perpendicular and only deflects. So E is drawn along
    the motion and F is drawn square to it, out of a field into the page.
    """
    out = []
    x0, y0 = cx - w / 2, cy - h / 2
    # cultural B field, into the page
    for i in range(4):
        for j in range(3):
            bx, by = x0 + 26 + i * (w - 52) / 3, y0 + 20 + j * (h - 40) / 2
            out.append(f'  <circle class="chart" cx="{bx:.1f}" cy="{by:.1f}" r="7"/>\n')
            out.append(f'  <path class="chart" d="M {bx-4.6:.1f} {by-4.6:.1f} l 9.2 9.2 '
                       f'M {bx-4.6:.1f} {by+4.6:.1f} l 9.2 -9.2"/>\n')
    my = cy + h / 2 + 26                      # the motion line, below the field
    bend = cx + 24
    # v along the motion line, then the deflection square to it
    out.append(f'  <path class="wire" d="M {x0-6:.1f} {my:.1f} L {bend:.1f} {my:.1f}"/>\n')
    out.append(f'  <path class="accent" d="M {bend:.1f} {my:.1f} L {bend:.1f} {y0+8:.1f}"/>\n')
    out.append(f'  <path class="accent-fill" d="M {bend:.1f} {y0+2:.1f} '
               f'l -7 14 l 14 0 Z"/>\n')
    out.append(f'  <path class="fill-ink" d="M {bend-2:.1f} {my:.1f} '
               f'l -14 -7 l 0 14 Z" transform="translate(-14,0)"/>\n')
    out.append(f'  <text class="label-sm" x="{x0-6:.1f}" y="{my+22:.1f}">v</text>\n')
    out.append(f'  <text class="label-sm" x="{bend+10:.1f}" y="{y0+22:.1f}" '
               f'fill="var(--accent)">F</text>\n')
    out.append(f'  <text class="label-sm" x="{x0+w-14:.1f}" y="{y0-8:.1f}">B</text>\n')
    out.append(f'  <text class="label" x="{cx:.1f}" y="{my+52:.1f}" '
               f'text-anchor="middle">F = QE + Q(v × Σρₖ Bₖ)</text>\n')
    return "".join(out)


# ── Driven harmonic oscillator (E034 / E035) ──────────────────────────────────
def oscillator(cx: float, cy: float, w: float = 260, h: float = 96) -> str:
    """L q'' + R q' + q/C = V(t), drawn as its underdamped response.

    The decay envelope is dashed so the ringdown reads as bounded: a reform
    impulse is absorbed by the reactive components and decays.
    """
    out = []
    x0 = cx - w / 2
    A, alpha, wd = h / 2, 2.6, 15.0
    pts, top, bot = [], [], []
    N = 120
    for i in range(N + 1):
        t = i / N
        env = A * math.exp(-alpha * t)
        x = x0 + w * t
        pts.append(f"{x:.1f} {cy - env*math.cos(wd*t):.1f}")
        top.append(f"{x:.1f} {cy - env:.1f}")
        bot.append(f"{x:.1f} {cy + env:.1f}")
    out.append(f'  <path class="wire-thin" d="M {x0:.1f} {cy:.1f} L {x0+w:.1f} {cy:.1f}"/>\n')
    for env in (top, bot):
        out.append(f'  <path class="chart" style="stroke-dasharray:5 6" '
                   f'd="M {" L ".join(env)}"/>\n')
    out.append(f'  <path class="accent" d="M {" L ".join(pts)}"/>\n')
    # the driving impulse V(t)
    out.append(f'  <path class="wire" d="M {x0:.1f} {cy+A+16:.1f} L {x0:.1f} {cy-A-16:.1f}"/>\n')
    out.append(f'  <text class="label-sm" x="{x0-6:.1f}" y="{cy-A-22:.1f}" '
               f'text-anchor="middle">V(t)</text>\n')
    out.append(f'  <text class="label" x="{cx:.1f}" y="{cy+A+52:.1f}" '
               f'text-anchor="middle">L q&#8243; + R q&#8242; + q/C = V(t)</text>\n')
    return "".join(out)


# ── Phase kick (E226) ─────────────────────────────────────────────────────────
def phase_kick(cx: float, cy: float, R: float = 68) -> str:
    """A step in phi_k on the carrier: same amplitude, rotated argument.

    Amplitude is unchanged and only the argument moves, which is the whole claim
    — the kick transfers nothing material, it re-times the signal.
    """
    a0, a1 = math.radians(34), math.radians(112)
    p0 = (cx + R * math.cos(a0), cy - R * math.sin(a0))
    p1 = (cx + R * math.cos(a1), cy - R * math.sin(a1))
    ar = R * 0.52
    out = [
        f'  <circle class="chart" cx="{cx}" cy="{cy}" r="{R}"/>\n',
        f'  <path class="wire-thin" d="M {cx-R-16} {cy} L {cx+R+16} {cy}"/>\n',
        f'  <path class="wire-thin" d="M {cx} {cy+R+16} L {cx} {cy-R-16}"/>\n',
        f'  <path class="wire-thin" style="stroke-dasharray:5 5" '
        f'd="M {cx} {cy} L {p0[0]:.1f} {p0[1]:.1f}"/>\n',
        f'  <path class="accent" d="M {cx} {cy} L {p1[0]:.1f} {p1[1]:.1f}"/>\n',
        f'  <path class="accent-fill" d="M {p1[0]:.1f} {p1[1]:.1f} l 1 14 l 12 -7 Z" '
        f'transform="rotate({-math.degrees(a1)+90:.1f},{p1[0]:.1f},{p1[1]:.1f})"/>\n',
        # the kick itself
        f'  <path class="accent" style="fill:none" d="M {cx+ar*math.cos(a0):.1f} '
        f'{cy-ar*math.sin(a0):.1f} A {ar:.1f} {ar:.1f} 0 0 0 '
        f'{cx+ar*math.cos(a1):.1f} {cy-ar*math.sin(a1):.1f}"/>\n',
        f'  <text class="label-sm" x="{cx+6:.1f}" y="{cy-ar-10:.1f}" '
        f'fill="var(--accent)">Δφ</text>\n',
        f'  <text class="label" x="{cx:.1f}" y="{cy+R+44:.1f}" text-anchor="middle">'
        f'φₖ → φₖ + Δφ</text>\n',
    ]
    return "".join(out)


# Productivity minus hourly compensation, both indexed to 100 in 1948. The gap is
# output produced and not paid out, which is the integrand of the reparations
# integral. Source: Paper/data/eq10_18_wage_asset_divergence.csv (BLS productivity
# and compensation series). Sampled every other year, 1948-2022.
PROD_COMP_GAP_T0, PROD_COMP_GAP_T1 = 1948, 2022
PROD_COMP_GAP = [
    0.0, -1.5, -2.3, -3.6, -4.6, -5.0, -5.7, -5.9, -6.1, -6.6, -6.9, -6.5,
    -5.6, -4.2, -2.4, -1.3, 6.4, 9.0, 13.2, 17.4, 23.3, 31.7, 38.2, 46.2,
    53.8, 62.5, 78.0, 88.5, 97.9, 107.6, 112.9, 121.5, 130.5, 136.3, 141.7,
    145.1, 148.5, 150.3,
]


# ── Reparations integral (E020 / E228) ────────────────────────────────────────
def reparations(cx: float, cy: float, w: float = 360, h: float = 100) -> str:
    """R = integral of Re[V I*] dt, drawn over a measured series.

    The curve is the productivity-compensation gap, 1948-2022: output produced and
    not paid out. That gap IS the integrand, so the shaded area under it is the
    accumulated total the equation names. The early years run slightly negative,
    where compensation tracked productivity, and the divergence opens after 1979.
    Drawn from data so the shape is checkable rather than decorative.
    """
    x0, base = cx - w / 2, cy + h / 2
    g = PROD_COMP_GAP
    span = max(g)
    scale = (h * 0.86) / span
    pts = [(x0 + w * i / (len(g) - 1), base - v * scale) for i, v in enumerate(g)]
    curve = " L ".join(f"{a:.1f} {b:.1f}" for a, b in pts)
    out = [
        f'  <path class="accent-area" d="M {x0:.1f} {base:.1f} L {curve} '
        f'L {x0+w:.1f} {base:.1f} Z"/>\n',
        f'  <path class="accent" style="stroke-width:2.4" d="M {curve}"/>\n',
        f'  <path class="wire-thin" d="M {x0-10:.1f} {base:.1f} L {x0+w+10:.1f} {base:.1f}"/>\n',
        f'  <path class="wire-thin" d="M {x0:.1f} {base+8:.1f} L {x0:.1f} {base-h*0.62:.1f}"/>\n',
        f'  <path class="wire-thin" d="M {x0+w:.1f} {base+8:.1f} L {x0+w:.1f} {base-h*0.62:.1f}"/>\n',
        f'  <text class="label-sm" x="{x0:.1f}" y="{base+24:.1f}" '
        f'text-anchor="middle">{PROD_COMP_GAP_T0}</text>\n',
        f'  <text class="label-sm" x="{x0+w:.1f}" y="{base+24:.1f}" '
        f'text-anchor="middle">{PROD_COMP_GAP_T1}</text>\n',
        f'  <text class="label" x="{cx:.1f}" y="{base+52:.1f}" text-anchor="middle">'
        f'R = \u222b Re[V\u00b7I*] d\u03c4</text>\n',
    ]
    return "".join(out)


# ── Crash condition (E217) ────────────────────────────────────────────────────
def crash(cx: float, cy: float, w: float = 160, h: float = 118) -> str:
    """dM/dt > dSigma/dt — coherence outruns suppression, and the system fails.

    Suppression is linear; coherence is convex. The crossing is the whole figure,
    so it is marked and the threshold tau is ruled through it.
    """
    x0, base = cx - w / 2, cy + h / 2
    N = 60
    sup, coh = [], []
    for i in range(N + 1):
        t = i / N
        sup.append((x0 + w * t, base - h * (0.18 + 0.52 * t)))
        coh.append((x0 + w * t, base - h * (0.05 + 0.92 * t ** 2.1)))
    # crossing: first index where coherence passes suppression
    xi = next((i for i in range(N + 1) if coh[i][1] <= sup[i][1]), N)
    px, py = coh[xi]
    ps = " L ".join(f"{x:.1f} {y:.1f}" for x, y in sup)
    pc = " L ".join(f"{x:.1f} {y:.1f}" for x, y in coh)
    return "".join([
        f'  <path class="wire-thin" d="M {x0-8:.1f} {base:.1f} L {x0+w+8:.1f} {base:.1f}"/>\n',
        f'  <path class="wire-thin" style="stroke-dasharray:5 5" '
        f'd="M {x0-8:.1f} {py:.1f} L {x0+w+8:.1f} {py:.1f}"/>\n',
        f'  <text class="label-sm" x="{x0+w+14:.1f}" y="{py+5:.1f}">τ</text>\n',
        f'  <path class="wire" style="stroke-width:2.6" d="M {ps}"/>\n',
        f'  <path class="accent" style="stroke-width:2.8" d="M {pc}"/>\n',
        f'  <circle class="no-fill" cx="{px:.1f}" cy="{py:.1f}" r="7" '
        f'stroke="var(--accent)" stroke-width="2.4"/>\n',
        f'  <text class="label-sm" x="{x0+w+8:.1f}" y="{base-h*0.68:.1f}">Σ</text>\n',
        f'  <text class="label-sm" x="{x0+w*0.30:.1f}" y="{base-h*0.80:.1f}" '
        f'fill="var(--accent)">M</text>\n',
        f'  <text class="label" x="{cx:.1f}" y="{base+38:.1f}" text-anchor="middle">'
        f'dM/dt &gt; dΣ/dt</text>\n',
    ])


# ── Enclosure capacitance (E223) ──────────────────────────────────────────────
def capacitance(cx: float, cy: float, w: float = 150, h: float = 76) -> str:
    """C = eps A / d — the partition as a gap holding accumulated charge.

    Buffer-class wealth sits on the upper plate, the out-group is held at ground
    potential on the lower one, and d is the separation the partition maintains.
    """
    hw, hh = w / 2, h / 2
    out = [
        f'  <path class="wire" d="M {cx-hw:.1f} {cy-hh:.1f} l {w:.1f} 0"/>\n',
        f'  <path class="wire" d="M {cx-hw:.1f} {cy+hh:.1f} l {w:.1f} 0"/>\n',
        f'  <path class="wire" d="M {cx:.1f} {cy-hh:.1f} l 0 -18"/>\n',
        f'  <path class="wire" d="M {cx:.1f} {cy+hh:.1f} l 0 18"/>\n',
    ]
    for i in range(5):                                   # field across the gap
        fx = cx - hw + 18 + i * (w - 36) / 4
        out.append(f'  <path class="chart" style="stroke-dasharray:4 4" '
                   f'd="M {fx:.1f} {cy-hh+5:.1f} L {fx:.1f} {cy+hh-5:.1f}"/>\n')
    out += [
        f'  <path class="accent" style="stroke-width:2.2" '
        f'd="M {cx-hw-14:.1f} {cy-hh:.1f} L {cx-hw-14:.1f} {cy+hh:.1f}"/>\n',
        f'  <text class="label-sm" x="{cx-hw-22:.1f}" y="{cy+5:.1f}" '
        f'text-anchor="end" fill="var(--accent)">d</text>\n',
        f'  <text class="label-sm" x="{cx+hw+10:.1f}" y="{cy-hh+5:.1f}">A</text>\n',
        f'  <text class="label" x="{cx:.1f}" y="{cy+hh+48:.1f}" '
        f'text-anchor="middle">C = εA/d</text>\n',
    ]
    return "".join(out)


# ── Inductive kickback (E224) ─────────────────────────────────────────────────
def backemf(cx: float, cy: float, w: float = 150, h: float = 88) -> str:
    """V = -L di/dt — cut the current fast and the coil answers with a spike.

    The current ramps, then collapses; the induced voltage is the narrow spike at
    the break. Backlash is drawn as a reactive transient that decays.
    """
    x0, base = cx - w / 2, cy + h / 2
    rise, brk = x0 + w * 0.20, x0 + w * 0.60
    plateau = base - h * 0.44
    return "".join([
        f'  <path class="wire-thin" d="M {x0-8:.1f} {base:.1f} L {x0+w+8:.1f} {base:.1f}"/>\n',
        # current: ramps, HOLDS, then is cut. The plateau is what stops the
        # ramp-and-return reading as a closed triangle against the axis.
        f'  <path class="wire" style="stroke-width:2.6" '
        f'd="M {x0:.1f} {base:.1f} L {rise:.1f} {plateau:.1f} L {brk:.1f} {plateau:.1f} '
        f'L {brk:.1f} {base:.1f} L {x0+w:.1f} {base:.1f}"/>\n',
        # induced voltage: a narrow spike at the break only, overshooting the
        # current level because di/dt there is far larger than during the ramp.
        f'  <path class="accent" style="stroke-width:2.8" '
        f'd="M {brk-9:.1f} {base:.1f} L {brk:.1f} {base-h:.1f} L {brk+9:.1f} {base:.1f}"/>\n',
        f'  <text class="label-sm" x="{x0+w*0.34:.1f}" y="{plateau-8:.1f}">i</text>\n',
        f'  <text class="label-sm" x="{brk+14:.1f}" y="{base-h*0.88:.1f}" '
        f'fill="var(--accent)">V</text>\n',
        f'  <text class="label" x="{cx:.1f}" y="{base+40:.1f}" text-anchor="middle">'
        f'V = −L di/dt</text>\n',
    ])


# ── The parasitic control layer ───────────────────────────────────────────────
def transistor(cx: float, cy: float) -> str:
    """E as a control layer: a trickle of base current gating the whole supply.

    From the Preface — the kinetic labour of O and I_buffer IS the power supply
    (V_cc); the Elite only route it. The asymmetry is the entire argument, so it
    is drawn: the collector-emitter path carries everything
    and is heavy, the base input is a hairline. Nothing about the base is large.
    """
    bar, lead, drop = 20, 22, 18
    ce = "stroke-width:5.2"
    ex, ey = cx + lead, cy + 12 + lead          # emitter elbow
    out = [
        # base bar
        f'  <path class="wire" style="stroke-width:4" '
        f'd="M {cx} {cy-bar} L {cx} {cy+bar}"/>\n',
        # base input — deliberately the thinnest line in the figure
        f'  <path class="chart" style="stroke-width:1.3" '
        f'd="M {cx-58} {cy} L {cx} {cy}"/>\n',
        # collector and emitter: the supply path
        f'  <path class="accent" style="{ce}" d="M {cx+3} {cy-12} L {cx+lead} '
        f'{cy-12-lead} L {cx+lead} {cy-12-lead-drop}"/>\n',
        f'  <path class="accent" style="{ce}" d="M {cx+3} {cy+12} L {ex} {ey} '
        f'L {ex} {ey+drop}"/>\n',
        # emitter arrow, riding the angled lead
        f'  <path class="accent-fill" d="M 0 0 l -13 -5 l 0 10 Z" '
        f'transform="translate({cx+15},{cy+24}) rotate(-135)"/>\n',
        f'  <text class="label-sm" x="{cx-62}" y="{cy-8}" text-anchor="end">Iᵦ</text>\n',
        f'  <text class="label-sm" x="{cx-62}" y="{cy+12}" text-anchor="end">E</text>\n',
        f'  <text class="label-sm" x="{cx+lead+10}" y="{cy-12-lead-drop+14}" '
        f'fill="var(--accent)">V_cc</text>\n',
        f'  <text class="label-sm" x="{cx+lead+10}" y="{ey+drop-2}">O + I</text>\n',
    ]
    return "".join(out)


# ── The operator glyph: Ge'ez ተ (U+1270, ETHIOPIC SYLLABLE TA) ────────────────
# First syllable of Tewodros, the Ethiopian form of Theodore. Carried as an
# outline extracted from Kefa III rather than as a font call, so the shape is
# identical here, in the print PDF, and on any machine without Ethiopic coverage.
# Font space is y-up with a 1000-unit em; the use site flips y and scales.
GEEZ_TA = "M430 116Q430 72 433.0 46.0Q436 20 441 2Q428 -4 414.5 -7.0Q401 -10 389 -10Q361 -10 351.0 2.5Q341 15 341 50Q341 123 343.5 195.0Q346 267 348.5 338.0Q351 409 353.0 477.5Q355 546 355 611Q355 656 354.0 677.0Q353 698 347.5 704.0Q342 710 330 710H325Q323 715 321.5 720.5Q320 726 320 732Q320 742 326.0 749.0Q332 756 347.5 760.0Q363 764 394 764Q420 764 431.0 752.5Q442 741 442 715Q442 664 441.0 605.5Q440 547 438.0 484.5Q436 422 434.0 358.5Q432 295 431.0 233.5Q430 172 430 116ZM240 434Q228 434 208.5 432.5Q189 431 175 430Q175 425 175.0 420.0Q175 415 175 410Q175 368 159.5 352.0Q144 336 111 336Q92 336 78.0 341.0Q64 346 55 355Q64 368 67.5 383.5Q71 399 74 420Q76 444 85.0 457.5Q94 471 118.0 476.5Q142 482 191 482H396Q470 482 530.0 487.5Q590 493 629.5 498.5Q669 504 679 504Q698 504 704.0 490.0Q710 476 711 451Q711 436 717.0 431.5Q723 427 734 427Q736 422 737.0 418.0Q738 414 738 409Q738 391 723.0 383.0Q708 375 681 375Q642 375 627.5 394.0Q613 413 613 457L627 447Q582 441 526.0 437.5Q470 434 409 434Z"


def geez_ta(x: float, y: float, size: float, cls: str = "fill-ink") -> str:
    """Place the operator glyph with its baseline at (x, y)."""
    k = size / 1000.0
    return (f'  <path class="{cls}" d="{GEEZ_TA}" '
            f'transform="translate({x:.1f},{y:.1f}) scale({k:.5f},{-k:.5f})"/>\n')


# ── The Theodore Transform ────────────────────────────────────────────────────
def theodore(cx: float, cy: float, h: float = 200, sep: float = 38) -> str:
    """Carry a claim from one domain to another and test whether it survives.

    Two domains as parallel rails, a claim on the first, and the operator arc
    carrying it to its image on the second. The rails are drawn identical because
    the operator asserts nothing about the domains — the diagnostic is whether the
    claim holds after the transfer, so both endpoints are marked and neither is
    privileged.
    """
    y0, y1 = cy - h / 2, cy + h / 2
    xa, xb = cx - sep, cx + sep
    pa, pb = y0 + h * 0.24, y0 + h * 0.72
    return "".join([
        f'  <path class="wire-thin" d="M {xa} {y0} L {xa} {y1}"/>\n',
        f'  <path class="wire-thin" d="M {xb} {y0} L {xb} {y1}"/>\n',
        f'  <path class="accent" style="stroke-width:2.8" d="M {xa} {pa:.1f} '
        f'C {xa+30} {pa+22:.1f} {xb-30} {pb-22:.1f} {xb} {pb:.1f}"/>\n',
        f'  <path class="accent-fill" d="M 0 0 l -12 -5 l 0 10 Z" '
        f'transform="translate({xb},{pb:.1f}) rotate(28)"/>\n',
        f'  <circle class="fill-ink" cx="{xa}" cy="{pa:.1f}" r="5"/>\n',
        f'  <circle class="accent-fill" cx="{xb}" cy="{pb:.1f}" r="5"/>\n',
        f'  <text class="label-sm" x="{xa}" y="{y0-10}" text-anchor="middle">aᵢ</text>\n',
        f'  <text class="label-sm" x="{xb}" y="{y0-10}" text-anchor="middle">aⱼ</text>\n',
        geez_ta(cx - 42, y1 + 36, 24, "accent-fill"),
        f'  <text class="label" x="{cx+4}" y="{y1+34}" '
        f'fill="var(--accent)"> : a → a′</text>\n',
    ])


# ── Five-tier pyramid ─────────────────────────────────────────────────────────
def sub(s: str) -> str:
    """A subscript run. Unicode has no subscript f or d, so the label markup
    carries the shift rather than the character set."""
    return f'<tspan font-size="0.72em" dy="4">{s}</tspan><tspan dy="-4"></tspan>'


def pyramid(cx: float, base_y: float, w: float, h: float, depth: float = 0.30) -> str:
    """The five-tier stack as a solid, in three-quarter view: E apex, O base.

    The base is a square seen in perspective, so it draws as a rhombus with a
    near corner (F) below the centerline and a far corner (B) above it. `depth`
    is the foreshortening: half-depth as a fraction of half-width. Lateral edges
    run apex→left, apex→right and apex→near-corner (the front ridge). The two
    far base edges are hidden behind the solid and are dashed.

    No conductor passes through this. The circuit-bend-with-open-apex treatment
    belongs to the center element on the top and bottom rails.
    """
    tiers = ["E", "P", "F", "I", "O"]
    n = len(tiers)
    hw, hd = w / 2, (w / 2) * depth
    apex = (cx, base_y - h)
    out = []

    def ring(s: float):
        """Cross-section rhombus at scale s: 0 at the apex, 1 at the base."""
        y = base_y - h * (1 - s)
        return {"L": (cx - hw * s, y), "R": (cx + hw * s, y),
                "F": (cx, y + hd * s), "B": (cx, y - hd * s)}

    def pt(p):
        return f"{p[0]:.1f} {p[1]:.1f}"

    b = ring(1.0)
    # far base edges sit behind the solid
    out.append(f'  <path class="wire-thin" style="stroke-dasharray:5 7" '
               f'd="M {pt(b["L"])} L {pt(b["B"])} L {pt(b["R"])}"/>\n')
    # near base edges
    out.append(f'  <path class="wire" d="M {pt(b["L"])} L {pt(b["F"])} L {pt(b["R"])}"/>\n')
    # lateral edges and the front ridge
    for k in ("L", "R", "F"):
        out.append(f'  <path class="wire" d="M {pt(apex)} L {pt(b[k])}"/>\n')
    # tier divisions: only the two faces that face the viewer
    for i in range(1, n):
        r = ring(i / n)
        out.append(f'  <path class="wire-thin" '
                   f'd="M {pt(r["L"])} L {pt(r["F"])} L {pt(r["R"])}"/>\n')
    # labels ride just outside the right edge, at each tier's mid-height
    for i, t in enumerate(tiers):
        s = (i + 0.5) / n
        r = ring(s)
        out.append(f'  <text class="label" x="{r["R"][0]+20:.1f}" '
                   f'y="{r["R"][1]+6:.1f}">{t}</text>\n')
    # The Predatory Min-Max Function (E10.5). The solid is a picture of the
    # partition; the kernel objective is the rule the partition serves, so the
    # two belong to one figure. The caption clears the near base corner, which
    # hangs `hd` below base_y, and clears the author line below it.
    out.append(f'  <text class="label" x="{cx:.1f}" y="{base_y+hd+34:.1f}" '
               f'text-anchor="middle">max ℰ(t)  s.t.  M{sub("eff")} &lt; τ</text>\n')
    return "".join(out)


# ── Back cover: a legend of the front's figures ────────────────────────────────
# Each glyph is a stripped version of the corresponding front figure: same shape,
# no labels, no caption. They are drawn into a box so the list can reflow.
def _g_phasor(x, y, w, h):
    cx, cy, r = x + w / 2, y + h / 2, min(w, h) * 0.40
    a = math.radians(38)
    return (f'<circle class="chart" cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}"/>'
            f'<path class="wire-thin" d="M {cx-r-5:.1f} {cy:.1f} h {2*r+10:.1f} '
            f'M {cx:.1f} {cy-r-5:.1f} v {2*r+10:.1f}"/>'
            f'<path class="accent" style="stroke-width:2.4" d="M {cx:.1f} {cy:.1f} '
            f'L {cx+r*math.cos(a):.1f} {cy-r*math.sin(a):.1f}"/>')


def _g_lorentz(x, y, w, h):
    out = []
    for i in range(3):
        for j in range(2):
            bx, by = x + 12 + i * (w - 30) / 2, y + 10 + j * (h - 30) / 1
            out.append(f'<circle class="chart" cx="{bx:.1f}" cy="{by:.1f}" r="4"/>')
    my, bd = y + h - 4, x + w * 0.62
    out.append(f'<path class="wire-thin" d="M {x:.1f} {my:.1f} L {bd:.1f} {my:.1f}"/>')
    out.append(f'<path class="accent" style="stroke-width:2.4" '
               f'd="M {bd:.1f} {my:.1f} L {bd:.1f} {y+4:.1f}"/>')
    return "".join(out)


def _g_kick(x, y, w, h):
    cx, cy, r = x + w / 2, y + h / 2, min(w, h) * 0.40
    a0, a1 = math.radians(30), math.radians(112)
    return (f'<circle class="chart" cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}"/>'
            f'<path class="wire-thin" style="stroke-dasharray:3 3" d="M {cx:.1f} {cy:.1f} '
            f'L {cx+r*math.cos(a0):.1f} {cy-r*math.sin(a0):.1f}"/>'
            f'<path class="accent" style="stroke-width:2.4" d="M {cx:.1f} {cy:.1f} '
            f'L {cx+r*math.cos(a1):.1f} {cy-r*math.sin(a1):.1f}"/>')


def _g_osc(x, y, w, h):
    cy, A = y + h / 2, h * 0.42
    pts = []
    for i in range(49):
        t = i / 48
        pts.append(f"{x+w*t:.1f} {cy-A*math.exp(-2.6*t)*math.cos(14*t):.1f}")
    return (f'<path class="wire-thin" d="M {x:.1f} {cy:.1f} h {w:.1f}"/>'
            f'<path class="accent" style="stroke-width:2.2" d="M {" L ".join(pts)}"/>')


def _g_crash(x, y, w, h):
    b = y + h - 4
    s = " L ".join(f"{x+w*i/12:.1f} {b-h*(0.16+0.5*i/12):.1f}" for i in range(13))
    c = " L ".join(f"{x+w*i/12:.1f} {b-h*(0.04+0.9*(i/12)**2.1):.1f}" for i in range(13))
    return (f'<path class="wire-thin" style="stroke-width:2" d="M {s}"/>'
            f'<path class="accent" style="stroke-width:2.4" d="M {c}"/>')


def _g_cap(x, y, w, h):
    cy = y + h / 2
    o = [f'<path class="wire-thin" style="stroke-width:2.8" '
         f'd="M {x+6:.1f} {cy-h*0.28:.1f} h {w-12:.1f} M {x+6:.1f} {cy+h*0.28:.1f} h {w-12:.1f}"/>']
    for i in range(4):
        fx = x + 14 + i * (w - 28) / 3
        o.append(f'<path class="chart" style="stroke-dasharray:3 3" '
                 f'd="M {fx:.1f} {cy-h*0.24:.1f} V {cy+h*0.24:.1f}"/>')
    return "".join(o)


def _g_emf(x, y, w, h):
    b, rs, bd = y + h - 4, x + w * 0.20, x + w * 0.58
    pl = b - h * 0.42
    return (f'<path class="wire-thin" d="M {x:.1f} {b:.1f} h {w:.1f}"/>'
            f'<path class="wire-thin" style="stroke-width:2.2" d="M {x:.1f} {b:.1f} '
            f'L {rs:.1f} {pl:.1f} L {bd:.1f} {pl:.1f} L {bd:.1f} {b:.1f} '
            f'L {x+w:.1f} {b:.1f}"/>'
            f'<path class="accent" style="stroke-width:2.4" d="M {bd-5:.1f} {b:.1f} '
            f'L {bd:.1f} {y+2:.1f} L {bd+5:.1f} {b:.1f}"/>')


def _g_reparations(x, y, w, h):
    """Same measured series as the front figure, so the two cannot drift apart."""
    b = y + h - 4
    g = PROD_COMP_GAP
    sc = (h * 0.80) / max(g)
    pts = [(x + w * i / (len(g) - 1), b - v * sc) for i, v in enumerate(g)]
    p = " L ".join(f"{a:.1f} {c:.1f}" for a, c in pts)
    return (f'<path class="accent-area" d="M {x:.1f} {b:.1f} L {p} L {x+w:.1f} {b:.1f} Z"/>'
            f'<path class="accent" style="stroke-width:2" d="M {p}"/>'
            f'<path class="wire-thin" d="M {x:.1f} {b:.1f} h {w:.1f}"/>')



def _g_smith(x, y, w, h):
    cx, cy, r = x + w / 2, y + h / 2, min(w, h) * 0.44
    o = [f'<circle class="chart-rim" style="stroke-width:2" cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}"/>']
    for rr in (0.5, 1, 2):
        o.append(f'<circle class="chart" cx="{cx+r*rr/(1+rr):.1f}" cy="{cy:.1f}" '
                 f'r="{r/(1+rr):.1f}"/>')
    o.append(f'<path class="wire-thin" d="M {cx-r:.1f} {cy:.1f} h {2*r:.1f}"/>')
    return "".join(o)


def _g_pyramid(x, y, w, h):
    cx, b, hw, hd = x + w / 2, y + h - 8, w * 0.42, w * 0.12
    o = [f'<path class="wire-thin" style="stroke-width:2" d="M {cx-hw:.1f} {b:.1f} '
         f'L {cx:.1f} {b+hd:.1f} L {cx+hw:.1f} {b:.1f} L {cx:.1f} {y+4:.1f} Z"/>']
    for i in (1, 2, 3):
        s = i / 4
        yy = y + 4 + (b - y - 4) * s
        o.append(f'<path class="chart" d="M {cx-hw*s:.1f} {yy:.1f} L {cx:.1f} '
                 f'{yy+hd*s:.1f} L {cx+hw*s:.1f} {yy:.1f}"/>')
    return "".join(o)


def _g_transistor(x, y, w, h):
    cx, cy = x + w * 0.46, y + h / 2
    return (f'<path class="wire-thin" style="stroke-width:3" d="M {cx:.1f} {cy-14:.1f} '
            f'v 28"/>'
            f'<path class="chart" style="stroke-width:1.2" d="M {x+2:.1f} {cy:.1f} '
            f'H {cx:.1f}"/>'
            f'<path class="accent" style="stroke-width:3.4" d="M {cx+2:.1f} {cy-8:.1f} '
            f'L {cx+16:.1f} {cy-22:.1f} V {y+3:.1f} M {cx+2:.1f} {cy+8:.1f} '
            f'L {cx+16:.1f} {cy+22:.1f} V {y+h-3:.1f}"/>')


def _g_transform(x, y, w, h):
    """Two domains as parallel rails, a claim carried from one to the other.

    The operator glyph rides the arc, so the back names the symbol the front and
    the manuscript both use.
    """
    ya, yb = y + h * 0.24, y + h * 0.80
    pa, pb = x + w * 0.26, x + w * 0.74
    return (f'<path class="wire-thin" d="M {x+2:.1f} {ya:.1f} h {w-4:.1f} '
            f'M {x+2:.1f} {yb:.1f} h {w-4:.1f}"/>'
            f'<path class="accent" style="stroke-width:2.2" '
            f'd="M {pa:.1f} {ya:.1f} C {pa+16:.1f} {ya+12:.1f} {pb-16:.1f} {yb-12:.1f} '
            f'{pb:.1f} {yb:.1f}"/>'
            f'<circle class="fill-ink" cx="{pa:.1f}" cy="{ya:.1f}" r="3.2"/>'
            f'<circle class="accent-fill" cx="{pb:.1f}" cy="{yb:.1f}" r="3.2"/>'
            + geez_ta(x + w * 0.06, y + h * 0.66, 20, "accent-fill").strip())



BACK_ENTRIES = [
    (_g_transform, "The Theodore Transform",
     ("Carry a claim across domains: the gendered axis to the racial,",
      "social mechanics to electrodynamics. Invariance is the test.")),
    (_g_smith, "The Extraction Chart",
     ("Every passive load sits inside the unit disk. The center is",
      "total enclosure; the rim is withdrawn compliance.")),
    (_g_phasor, "The Complex Wage",
     ("W = ψₘ + jψₛ. The material wage is real and does work; the",
      "status wage is imaginary and does none.")),
    (_g_reparations, "The Reparations Integral",
     ("ℛ = ∫ Re[V·I*] dτ. The debt is an area. Plotted: output",
      "produced and not paid out, 1948–2022.")),
    (_g_pyramid, "The Predatory Min-Max Function",
     ("max ℰ subject to M_eff < τ, over five tiers E, P, F, I, O.",
      "Extraction runs at the ceiling, resistance is held below it.")),
    (_g_transistor, "The Parasitic Control Layer",
     ("The Elite gate a supply they do not generate. A trickle of",
      "base current routes the whole of V_cc.")),
    (_g_lorentz, "The Unified Lorentz Force",
     ("The material field does real work. The cultural field only",
      "deflects, and transfers no energy at all.")),
    (_g_crash, "The Crash Condition",
     ("dM/dt > dΣ/dt. When coherence outruns suppression, the",
      "system crosses τ and fails.")),
    (_g_osc, "The Driven Oscillator",
     ("A reform impulse rings and decays inside the reactive",
      "components. The envelope is bounded by design.")),
    (_g_emf, "Inductive Kickback",
     ("Cut the current and the coil answers with a spike.",
      "Backlash is a reactive transient, and it decays.")),
    (_g_cap, "Enclosure Capacitance",
     ("C = εA/d. The partition as a gap: charge accumulates above",
      "it while the out-group is held at ground potential.")),
    (_g_kick, "The Phase Kick",
     ("The argument moves and the amplitude does not. A pivot",
      "re-times the signal without paying anything.")),
]


def back(palette: str) -> str:
    m = 74
    out = []
    # blurb
    lines = [
        "Racism runs as an extraction algorithm.",
        "This is the circuit diagram.",
    ]
    for i, t in enumerate(lines):
        out.append(f'  <text x="{W/2}" y="{215+44*i}" text-anchor="middle" '
                   f'fill="var(--ink)" font-family="Helvetica Neue,Helvetica,Arial,sans-serif" '
                   f'font-size="34" font-weight="600">{t}</text>\n')
    body = [
        "Five centuries of policy, read as one machine. This book derives the",
        "extraction kernel from the historical record, calibrates it against 146",
        "anchor cases, and states the conditions under which it fails.",
    ]
    for i, t in enumerate(body):
        out.append(f'  <text x="{W/2}" y="{330+30*i}" text-anchor="middle" '
                   f'fill="var(--dim)" font-family="Helvetica Neue,Helvetica,Arial,sans-serif" '
                   f'font-size="19">{t}</text>\n')
    out.append(f'  <path class="wire-thin" d="M {m+56} 452 H {W-m-56}"/>\n')
    out.append(f'  <text x="{W/2}" y="486" text-anchor="middle" fill="var(--accent)" '
               f'font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-size="15" '
               f'letter-spacing="4">WHAT IS ON THE COVER</text>\n')

    # two-column legend
    col_x, row_y, cw, rh = (m + 36, W / 2 + 12), 520, 500, 96
    for i, (glyph, title, text) in enumerate(BACK_ENTRIES):
        cxx = col_x[i % 2]
        yy = row_y + (i // 2) * rh
        out.append(f'  <g>{glyph(cxx, yy, 72, 54)}</g>\n')
        # The first entry is the author's own operator; it is set in accent so it
        # reads as the contribution rather than as one item among eleven.
        tcol = "var(--accent)" if i == 0 else "var(--ink)"
        out.append(f'  <text x="{cxx+90}" y="{yy+20}" fill="{tcol}" '
                   f'font-family="Helvetica Neue,Helvetica,Arial,sans-serif" '
                   f'font-size="17" font-weight="600">{title}</text>\n')
        for j, t in enumerate(text):
            out.append(f'  <text x="{cxx+90}" y="{yy+42+19*j}" fill="var(--dim)" '
                       f'font-family="Helvetica Neue,Helvetica,Arial,sans-serif" '
                       f'font-size="14">{t}</text>\n')

    # author line + imprint + barcode plate
    out.append(f'  <path class="wire-thin" d="M {m+56} 1148 H {W-m-56}"/>\n')
    bio = [
        "EMMANUEL THEODORE derives the framework from set theory, discrete",
        "mathematics and electrodynamics, and tests it against the archive.",
    ]
    for i, t in enumerate(bio):
        out.append(f'  <text x="{m+56}" y="{1188+26*i}" fill="var(--dim)" '
                   f'font-family="Helvetica Neue,Helvetica,Arial,sans-serif" '
                   f'font-size="16">{t}</text>\n')
    # Official BISAC subjects drive retail shelving, so they are set verbatim.
    # The imprint line beneath is the book's own framing and carries no code.
    for i, cat in enumerate(("SOCIAL SCIENCE / DISCRIMINATION",
                             "POLITICAL SCIENCE / PUBLIC POLICY")):
        out.append(f'  <text x="{m+56}" y="{1272+22*i}" fill="var(--dim)" '
                   f'font-family="Helvetica Neue,Helvetica,Arial,sans-serif" '
                   f'font-size="13" letter-spacing="2">{cat}</text>\n')
    out.append(f'  <text x="{m+56}" y="1326" fill="var(--accent)" '
               f'font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-size="16" '
               f'letter-spacing="4">APPLIED SOCIAL ENGINEERING</text>\n')
    # ISBN plate — an explicit placeholder, not a drawn barcode
    bx, by, bw, bh = W - m - 340, 1330, 284, 132
    out.append(f'  <rect x="{bx}" y="{by}" width="{bw}" height="{bh}" fill="#ffffff" '
               f'rx="4"/>\n')
    out.append(f'  <text x="{bx+bw/2}" y="{by+bh/2-6}" text-anchor="middle" fill="#0d1b2a" '
               f'font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-size="15" '
               f'font-weight="600">ISBN BARCODE</text>\n')
    out.append(f'  <text x="{bx+bw/2}" y="{by+bh/2+18}" text-anchor="middle" fill="#5b6b7d" '
               f'font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-size="13">'
               f'PLACEHOLDER — SUPPLY AT PRINT</text>\n')
    return "".join(out)


def spine(palette: str) -> str:
    """Title and author set down the spine, each pinned to an explicit band.

    Rotated runs are sized with textLength/lengthAdjust rather than by choosing a
    font size and hoping. Font metrics vary between the renderer here and the
    printer's RIP, and a spine has no slack: the bands below are the contract, and
    the type is fitted to them.
    """
    sw = SPINE_W
    out = []
    # Five-tier mark at the head, and its inversion at the foot. Top narrows
    # upward (apex at the head); bottom narrows downward, so the pair reads as
    # the pyramid and its reflection with the type running between them.
    for i in range(5):
        hw_t = (sw * 0.15) * ((i + 1) / 5)
        hw_b = (sw * 0.15) * ((5 - i) / 5)
        out.append(f'  <path class="wire" d="M {sw/2-hw_t:.1f} {150+15*i} '
                   f'L {sw/2+hw_t:.1f} {150+15*i}"/>\n')
        out.append(f'  <path class="wire" d="M {sw/2-hw_b:.1f} {1390+15*i} '
                   f'L {sw/2+hw_b:.1f} {1390+15*i}"/>\n')

    # Title and author run PARALLEL down the spine, title leading and author set
    # under it. Under rotate(90) the glyph body grows toward +x and "below the
    # baseline" is -x, so the author baseline sits at a smaller x than the title.
    # Cap heights: 70pt -> ~50, 26pt -> ~19. Block spans [x_t-30, x_t+50], so
    # centring the block on the spine puts x_t at sw/2 - 10.
    x_t = sw / 2 - 10
    x_a = x_t - 30
    TITLE_C, TITLE_LEN = 800, 800        # runs y 400..1200
    AUTH_C, AUTH_LEN = 550, 300          # runs y 400..700 — starts level with title
    out.append(
        f'  <text x="{x_t:.1f}" y="{TITLE_C}" text-anchor="middle" fill="var(--ink)" '
        f'font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-weight="700" '
        f'font-size="70" textLength="{TITLE_LEN}" lengthAdjust="spacingAndGlyphs" '
        f'transform="rotate(90,{x_t:.1f},{TITLE_C})">THE ORIGINAL POWER</text>\n')
    out.append(
        f'  <text x="{x_a:.1f}" y="{AUTH_C}" text-anchor="middle" fill="var(--dim)" '
        f'font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-size="26" '
        f'letter-spacing="2" textLength="{AUTH_LEN}" lengthAdjust="spacingAndGlyphs" '
        f'transform="rotate(90,{x_a:.1f},{AUTH_C})">EMMANUEL THEODORE</text>\n')
    return "".join(out)


def build(palette: str, face: str = "front") -> str:
    p = PALETTES[palette]
    cx = W / 2
    style = (f"--bg:{p['bg']};--ink:{p['ink']};"
             f"--accent:{p['accent']};--dim:{p['dim']}")

    if face == "back":
        return f"""<svg {NS} viewBox="0 0 {W} {H}" width="{W}" height="{H}"
     style="{style}">
<sodipodi:namedview inkscape:document-units="px" pagecolor="{p['bg']}"/>
<title>The Original Power — back cover</title>
{defs()}
{layer("layer-bg", "00 background", f'  <rect x="0" y="0" width="{W}" height="{H}" fill="var(--bg)"/>')}
{layer("layer-border", "10 border circuit", border())}
{layer("layer-back", "70 back matter", back(palette))}
</svg>
"""

    if face == "spine":
        sw = SPINE_W
        return f"""<svg {NS} viewBox="0 0 {sw} {H}" width="{sw}" height="{H}"
     style="{style}">
<sodipodi:namedview inkscape:document-units="px" pagecolor="{p['bg']}"/>
<title>The Original Power — spine ({sw}u / {PAGE_COUNT}pp)</title>
{defs()}
{layer("layer-bg", "00 background", f'  <rect x="0" y="0" width="{sw}" height="{H}" fill="var(--bg)"/>')}
{layer("layer-spine", "80 spine", spine(palette))}
</svg>
"""

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
{layer("layer-phasor", "30 phasor W", phasor(460, 536, 103))}
{layer("layer-smith", "40 smith chart", smith(cx, 960, 300))}
{layer("layer-pyramid", "50 tier pyramid", pyramid(268, H - 260, 230, 210))}
{layer("layer-lorentz", "31 unified Lorentz force", lorentz(950, 520))}
{layer("layer-kick", "32 phase kick", phase_kick(216, 872))}
{layer("layer-osc", "33 driven harmonic oscillator", oscillator(960, 1295))}
{layer("layer-crash", "34 crash condition", crash(188, 566))}
{layer("layer-transistor", "38 parasitic control layer", transistor(196, 1052))}
{layer("layer-cap", "35 enclosure capacitance", capacitance(1000, 772))}
{layer("layer-emf", "36 inductive kickback", backemf(1000, 1000))}
{layer("layer-reparations", "37 reparations integral", reparations(620, 1296))}
{layer("layer-theodore", "39 Theodore transform", theodore(700, 500, 200))}
{layer("layer-author", "60 author", author)}
</svg>
"""


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="cover/the_original_power_cover.svg")
    ap.add_argument("--palette", default="midnight", choices=sorted(PALETTES))
    ap.add_argument("--face", default="front", choices=("front", "back", "spine"))
    a = ap.parse_args()
    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(build(a.palette, a.face), encoding="utf-8")
    extra = f", spine={SPINE_W}u ({PAGE_COUNT}pp)" if a.face == "spine" else ""
    print(f"wrote {out}  ({out.stat().st_size:,} bytes, "
          f"palette={a.palette}, face={a.face}{extra})")


if __name__ == "__main__":
    main()
