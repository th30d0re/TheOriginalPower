"""Still boards for Chapter 0, video 1. Dark field, same inks as the explainers."""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Polygon

HERE = Path(__file__).resolve().parent
OUT = HERE / "boards"

BG = "#0B0C0F"
GOLD = "#E6C26B"
BLUE = "#8CBAD6"
PALE = "#C5D0DA"
RED = "#D16657"
PAPER = "#F4F1EA"
MUTED = "#9E9A90"
INK = "#1A1612"
PUPPET = "#9E7850"
FORCE = "#617C94"
BUFFER = "#807660"

EQ01 = (
    r"$\vec{F}_{\mathrm{total}}=\mathbf{Q}\sum_{j=1}^{M}\vec{E}_{\mathrm{mat}}^{(j)}"
    r"+\mathbf{Q}\left(\vec{v}\times\sum_{k=1}^{N}\rho_{k}\vec{B}_{k}\right)$"
)
EQ01A = (
    r"$\frac{\partial\vec{B}_{k}}{\partial t}=\eta_{k}\left(\mathbf{Q}\cdot"
    r"\sum_{j=1}^{M}\vec{E}_{\mathrm{mat}}^{(j)}\right)-\lambda_{k}\vec{B}_{k}$"
)
EQ02 = (
    r"$\mathrm{Benefit}(E)\gg\mathrm{Benefit}(P)>\mathrm{Benefit}(F)"
    r">\mathrm{Benefit}(I)>\mathrm{Benefit}(O)$"
)

NODES = (
    ("E", "Elite", "the extraction beneficiary", GOLD, INK),
    ("P", "Puppet Class", "writes the policy, absorbs the blame", PUPPET, PAPER),
    ("F", "Enforcement", "makes the partition executable", FORCE, PAPER),
    ("I", "Buffer Class", "defends the line, receives the allocation", BUFFER, PAPER),
    ("O", "Out-group", "extractable, enclosed at the base", RED, PAPER),
)

CIRCUIT = (
    ("E", "voltage source", GOLD, INK),
    ("P", "potential divider", PUPPET, PAPER),
    ("F", "current source", FORCE, PAPER),
    ("I", "dielectric", BUFFER, PAPER),
    ("O", "sink / ground", RED, PAPER),
)


def _fig():
    fig = plt.figure(figsize=(19.2, 10.8), dpi=100)
    fig.patch.set_facecolor(BG)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    ax.set_facecolor(BG)
    return fig, ax


def _save(fig, name):
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{name}.png"
    fig.savefig(path, facecolor=fig.get_facecolor())
    plt.close(fig)
    return path


def _kicker(ax, text):
    ax.text(0.08, 0.90, text, color=GOLD, fontsize=18, fontweight="medium", ha="left", va="center")


def _math(ax, expr, y, size=28):
    ax.text(0.50, y, expr, color=PAPER, fontsize=size, ha="center", va="center")


def title():
    fig, ax = _fig()
    ax.text(0.50, 0.62, "CHAPTER 0", color=GOLD, fontsize=22, ha="center", va="center")
    ax.text(0.50, 0.50, "System Initialization", color=PAPER, fontsize=42, ha="center", va="center")
    ax.text(0.50, 0.40, "The Geometry of Extraction", color=MUTED, fontsize=26, ha="center", va="center")
    return _save(fig, "title")


def layers():
    fig, ax = _fig()
    _kicker(ax, "TWO RESOLUTIONS")
    rows = (
        (0.62, "Software layer", "The interface recompiles. The kernel stays."),
        (0.42, "Hardware layer", "The field equations the history instantiates."),
    )
    for y, head, sub in rows:
        ax.text(0.50, y, head, color=PAPER, fontsize=32, ha="center", va="center")
        ax.text(0.50, y - 0.07, sub, color=MUTED, fontsize=20, ha="center", va="center")
    return _save(fig, "layers")


def eq01():
    fig, ax = _fig()
    _kicker(ax, "EQUATION 0.1")
    ax.text(0.08, 0.84, "UNIFIED LORENTZ FORCE", color=MUTED, fontsize=18, ha="left", va="center")
    _math(ax, EQ01, 0.55, 26)
    ax.text(
        0.50, 0.38,
        "The electric term does the economic work. The magnetic term turns the heading.",
        color=MUTED, fontsize=18, ha="center", va="center",
    )
    return _save(fig, "eq01")


def fig01():
    fig, ax = _fig()
    _kicker(ax, "FIGURE 0.1")
    ax.text(0.08, 0.84, "THE UNIFIED LORENTZ-FORCE DECOMPOSITION", color=MUTED, fontsize=18, ha="left", va="center")
    origin = (0.30, 0.30)
    electric = (0.68, 0.30)
    total = (0.78, 0.68)
    style = dict(arrowstyle="-|>", mutation_scale=18, lw=2.2)
    ax.add_patch(FancyArrowPatch(origin, electric, color=BLUE, **style))
    ax.add_patch(FancyArrowPatch(electric, total, color=MUTED, linestyle=(0, (4, 3)), **style))
    ax.add_patch(FancyArrowPatch(origin, total, color=PAPER, lw=2.8, arrowstyle="-|>", mutation_scale=18))
    ax.text(0.49, 0.25, r"$\mathbf{Q}\sum\vec{E}_{\mathrm{mat}}$", color=BLUE, fontsize=16, ha="center")
    ax.text(0.84, 0.50, r"$\mathbf{Q}(\vec{v}\times\vec{B})$", color=MUTED, fontsize=16, ha="left")
    ax.text(0.48, 0.56, r"$\vec{F}_{\mathrm{total}}$", color=GOLD, fontsize=18, ha="center")
    return _save(fig, "fig01")


def eq01a():
    fig, ax = _fig()
    _kicker(ax, "EQUATION 0.1a")
    ax.text(0.08, 0.84, "SELF-EXCITING GENERATOR", color=MUTED, fontsize=18, ha="left", va="center")
    _math(ax, EQ01A, 0.55, 26)
    ax.text(
        0.50, 0.36,
        "The cultural field is funded by the extraction. Sever the extraction and the field decays.",
        color=MUTED, fontsize=18, ha="center", va="center",
    )
    return _save(fig, "eq01a")


def substrate():
    fig, ax = _fig()
    _kicker(ax, "EQUATION 0.1")
    _math(ax, EQ01, 0.62, 22)
    ax.text(0.50, 0.42, "Every later chapter instantiates this equation at another scale.", color=PALE, fontsize=22, ha="center")
    return _save(fig, "substrate")


def _bars(ax, n, caption):
    _kicker(ax, "FIVE STRUCTURAL POSITIONS")
    top = 0.80
    for i, (sym, name, role, fill, ink) in enumerate(NODES[:n]):
        y = top - i * 0.11
        ax.add_patch(FancyBboxPatch(
            (0.18, y - 0.04), 0.64, 0.08,
            boxstyle="round,pad=0.005,rounding_size=0.012",
            facecolor=fill, edgecolor="none",
        ))
        ax.text(0.22, y, sym, color=ink, fontsize=18, fontweight="bold", ha="left", va="center")
        ax.text(0.28, y, name, color=ink, fontsize=18, fontweight="medium", ha="left", va="center")
        ax.text(0.78, y, role, color=ink, fontsize=14, ha="right", va="center")
    if caption:
        ax.text(0.50, 0.20, caption, color=MUTED, fontsize=18, ha="center")


def nodes(n, caption, name):
    fig, ax = _fig()
    _bars(ax, n, caption)
    return _save(fig, name)


def capital():
    fig, ax = _fig()
    _kicker(ax, "DEFINITION")
    ax.text(0.28, 0.70, "Capital", color=PAPER, fontsize=28, ha="center")
    ax.text(0.28, 0.60, "Convertible reserve.\nNet flow upward, toward E.", color=MUTED, fontsize=18, ha="center", va="top")
    ax.text(0.72, 0.70, "Capitalism", color=PAPER, fontsize=28, ha="center")
    ax.text(0.72, 0.60, "The host operating system.\nOwnership, accumulation, wage labor.", color=MUTED, fontsize=18, ha="center", va="top")
    return _save(fig, "capital")


def pyramid():
    fig, ax = _fig()
    _kicker(ax, "FIGURE 0.2")
    ax.text(0.08, 0.84, "THE FIVE-TIER PYRAMID", color=MUTED, fontsize=18, ha="left", va="center")
    apex = (0.50, 0.78)
    left = (0.28, 0.28)
    right = (0.72, 0.28)
    ax.add_patch(Polygon([apex, left, right], closed=True, facecolor="#16303F", edgecolor=PALE, lw=1.4))
    labels = ((0.74, "E"), (0.62, "P"), (0.50, "F"), (0.40, "I"), (0.30, "O"))
    for frac, lab in labels:
        y = left[1] + (apex[1] - left[1]) * (frac - 0.28) / (0.78 - 0.28)
        # frac above is already a y in axes units for the label row
    ys = (0.74, 0.64, 0.54, 0.44, 0.32)
    names = ("E", "P", "F", "I", "O")
    for y, lab in zip(ys, names):
        if y < 0.74:
            t = (0.78 - y) / (0.78 - 0.28)
            x0 = apex[0] + (left[0] - apex[0]) * t
            x1 = apex[0] + (right[0] - apex[0]) * t
            ax.plot([x0, x1], [y, y], color=PALE, lw=0.8, alpha=0.7)
        ax.text(0.50, y + 0.015, lab, color=PAPER, fontsize=16, ha="center", va="bottom")
    ax.annotate("", xy=(0.50, 0.86), xytext=apex, arrowprops=dict(arrowstyle="-|>", color=GOLD, lw=1.2))
    ax.text(0.50, 0.885, "z", color=GOLD, fontsize=14, ha="center")
    return _save(fig, "pyramid")


def circuit(hot):
    fig, ax = _fig()
    _kicker(ax, "THE EXTRACTION CIRCUIT")
    n = len(CIRCUIT)
    for i, (sym, role, fill, ink) in enumerate(CIRCUIT):
        x = 0.08 + i * 0.18
        edge = GOLD if i == hot else "none"
        ax.add_patch(FancyBboxPatch(
            (x, 0.42), 0.15, 0.16,
            boxstyle="round,pad=0.004,rounding_size=0.01",
            facecolor=fill, edgecolor=edge, linewidth=2.4,
        ))
        ax.text(x + 0.075, 0.52, sym, color=ink, fontsize=20, fontweight="bold", ha="center", va="center")
        ax.text(x + 0.075, 0.34, role, color=PALE, fontsize=13, ha="center", va="center")
        if i < n - 1:
            ax.annotate(
                "", xy=(x + 0.175, 0.50), xytext=(x + 0.155, 0.50),
                arrowprops=dict(arrowstyle="-|>", color=MUTED, lw=1.2),
            )
    return _save(fig, f"circuit_{hot}")


def eq02():
    fig, ax = _fig()
    _kicker(ax, "EQUATION 0.2")
    ax.text(0.08, 0.84, "ORDINAL VOLTAGE DROP", color=MUTED, fontsize=18, ha="left", va="center")
    _math(ax, EQ02, 0.55, 22)
    ax.text(
        0.50, 0.36,
        "E sets the gradient. Each node below drops voltage. O is ground.",
        color=MUTED, fontsize=18, ha="center", va="center",
    )
    return _save(fig, "eq02")


def render_all():
    made = [title(), layers(), eq01(), fig01(), eq01a(), substrate(), capital(), pyramid(), eq02()]
    made.append(nodes(0, "", "nodes_0"))
    captions = {5: "Structural positions. A person can hold more than one."}
    for n in range(1, 6):
        made.append(nodes(n, captions.get(n, ""), f"nodes_{n}"))
    for hot in range(-1, 5):
        made.append(circuit(hot))
    return made


if __name__ == "__main__":
    for path in render_all():
        print(path)
