"""Legend-free Boston HOLC + shootings map for the video card.

Reuses compute() and draw_map() from boston_holc_shootings_figures.py and removes the
legend, which the card explains in its caption. Writes a tightly cropped PNG.
"""
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

sys.path.insert(0, str(Path(__file__).resolve().parent))
import boston_holc_shootings_figures as figs  # noqa: E402

OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("boston_holc_card_map.png")
NAVY = "#0f1b33"  # pass --navy for a full-bleed video background


def main() -> int:
    res = figs.compute()
    face = NAVY if "--navy" in sys.argv else "white"
    fig, ax = plt.subplots(figsize=(10, 10), facecolor=face)
    ax.set_facecolor(face)
    figs.draw_map(ax, res, legend_fs=10, point_size=14)
    legend = ax.get_legend()
    if legend is not None:
        legend.remove()
    fig.savefig(OUT, dpi=150, bbox_inches="tight", pad_inches=0.05, facecolor=face)
    print(OUT)
    return 0


if __name__ == "__main__":
    sys.exit(main())
