# Circuits for YT01

manimgx typesets with Typst, so it cannot load circuitikz itself. Each circuit here is the
book's own circuitikz code (labels removed, lines thickened, cream stroke), compiled to SVG:

    pdflatex rlc_series.tex && pdftocairo -svg rlc_series.pdf rlc_series.svg

and loaded in a scene with `m.SVGMobject(path)`. Labels are drawn in manimgx so they match
the video's type. rlc_series: Figure 2.5 (fig:rlc_topology); in tikz units the source sits at
x = 0, R spans 0-2.4, L 2.4-4.8, C 4.8-7.2, the top wire at y = 2.5, the return at y = 0.
