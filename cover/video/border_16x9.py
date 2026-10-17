"""Generate the 16:9 video border from the cover's circuit symbols (cover/the_original_power_cover.svg).

    python3 cover/video/border_16x9.py > cover/video/border_16x9.svg

Same symbol geometry and stroke as the cover; the rails are re-spaced for 1920x1080.
"""
W, H, M, IN = 1920, 1080, 74, 102          # outer rail at M, inner corner rail at IN (cover values)
INK = "#e8c99b"
S = f'stroke="{INK}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"'
SYM = {
    "coil": f'<path {S} d="M 0 0 a 9 9 0 0 1 18 0 a 9 9 0 0 1 18 0 a 9 9 0 0 1 18 0 a 9 9 0 0 1 18 0 l 10 0"/>',
    "res": f'<path {S} d="M 0 0 l 3.0 -9 l 6 18 l 6 -18 l 6 18 l 6 -18 l 6 18 l 6 -18 l 3.0 9"/>',
    "cap": f'<path {S} d="M 0 0 l 12 0 M 12 -17 l 0 34 M 26 -17 l 0 34 M 26 0 l 12 0"/>',
    "junction": f'<circle {S} cx="0" cy="0" r="6"/>',
    "arrow": f'<path fill="{INK}" d="M -11 0 L 11 0 L 0 26 Z"/>',
    "ground": f'<path {S} d="M -11 0 l 22 0 M -6 8 l 12 0 M -2 16 l 4 0"/>',
    "stack": (f'<path {S} d="M -150 0 L -78 0 L -14 -60"/><path {S} d="M 150 0 L 78 0 L 14 -60"/>'
              f'<path {S} d="M -50 -10 l 100 0 M -40 -22 l 80 0 M -30 -34 l 60 0 M -20 -46 l 40 0"/>'),
}
LEN = {"coil": 82, "res": 45, "cap": 38}
out = []
wire = lambda x1, y1, x2, y2: out.append(f'<path {S} d="M {x1} {y1} L {x2} {y2}"/>')
put = lambda sym, tf: out.append(f'<g transform="{tf}">{SYM[sym]}</g>')

# top and bottom rails: wire, cap, wire, coil | stack | coil, wire, cap, wire
cx = W / 2
for y, flip in ((M, "scale(1,-1)"), (H - M, "")):
    lc, rc = cx - 150 - 82, cx + 150            # coils butt against the stack, as on the cover
    capL, capR = (IN + lc) / 2 - 19, (rc + 82 + W - IN) / 2 - 19
    wire(IN, y, capL, y); put("cap", f"translate({capL},{y})"); wire(capL + 38, y, lc, y)
    put("coil", f"translate({lc},{y})"); put("coil", f"translate({rc},{y})")
    wire(rc + 82, y, capR, y); put("cap", f"translate({capR},{y})"); wire(capR + 38, y, W - IN, y)
    put("stack", f"translate({cx},{y}) {flip}")

# corner terminals: outer coil + ground beyond, inner coil + ground inside (cover pattern)
for x_out, x_in in ((M, IN), (W - M, W - IN)):
    mirror = x_out > W / 2
    put("coil", f"translate({x_out},{M}) rotate(90)")
    put("coil", f"translate({x_out},{H - M}) rotate(-90) scale(1,-1)")
    wire(x_out, M - 14, x_out, M); put("ground", f"translate({x_out},{M - 14}) scale(1,-1)")
    wire(x_out, H - M, x_out, H - M + 14); put("ground", f"translate({x_out},{H - M + 14})")
    put("coil", f"translate({x_in},{M}) rotate(90){' scale(1,-1)' if not mirror else ''}")
    wire(x_in, M + 82, x_in, M + 96); put("ground", f"translate({x_in},{M + 96})")
    put("coil", f"translate({x_in},{H - M}) rotate(-90){' scale(1,-1)' if mirror else ''}")
    wire(x_in, H - M - 82, x_in, H - M - 96); put("ground", f"translate({x_in},{H - M - 96}) scale(1,-1)")

# side rails: arrow, res, junction, cap, junction, res, arrow between the corner coils
top, bot = M + 82, H - M - 82
seq = ["arrow", "res", "junction", "cap", "junction", "res", "arrow"]
span = bot - top
slots = [top + span * (i + 1) / (len(seq) + 1) for i in range(len(seq))]
for x in (M, W - M):
    y = top
    for sym, c in zip(seq, slots):
        n = LEN.get(sym, 0)
        if sym == "junction":
            wire(x, y, x, c - 6); put("junction", f"translate({x},{c})"); y = c + 6
        elif sym == "arrow":
            wire(x, y, x, c); put("arrow", f"translate({x},{c})"); y = c
        else:
            s = c - n / 2
            wire(x, y, x, s); put(sym, f"translate({x},{s}) rotate(90)"); y = s + n
    wire(x, y, x, bot)

print(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
print("\n".join(out))
print("</svg>")
