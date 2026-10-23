# Cone Revision Report

## Result

The five-tier three-dimensional hierarchy is now a cone, and the Square Ceiling is now the Flat Ceiling. The two-dimensional pyramid figures remain unchanged. All existing labels and reference keys remain unchanged, including `fig:tier_pyramid`.

## Changed Lines

Line numbers refer to the revised `Paper/The_Original_Power.tex`.

| Line | Old | New |
|---:|---|---|
| 254 | `arrangement as a 3-D pyramid...` | `arrangement as a 3-D cone...` |
| 255 | `...stepping outside that pyramid` | `...stepping outside that cone` |
| 257 | `and the Square Ceiling...` | `and the Flat Ceiling...` |
| 486 | `\section{The Five Nodes and the 3-D Pyramid}` | `\section{The Five Nodes and the 3-D Cone}` |
| 549 | `The hierarchy is therefore a \textbf{3-D pyramid}.` | `The hierarchy is therefore a \textbf{3-D cone}.` |
| 553 | `...from inside the pyramid...` | `...from inside the cone...` |
| 561 | `\coordinate (frontleft) at (-4.3,0);` | `\coordinate (basecenter) at (0,0.6);` |
| 562 | `\coordinate (frontright) at (3.4,0);` | `\coordinate (baseleft) at (-4,0.6);` |
| 563 | `\coordinate (backright) at (4.35,1.15);` | `\coordinate (baseright) at (4,0.6);` |
| 564 | `\coordinate (backleft) at (-0.85,1.15);` | `\fill[blue!7] (apex) -- (baseleft)` |
| 565 | `\fill[blue!7] (apex) -- (frontleft) -- (frontright) -- cycle;` | `arc[start angle=180,end angle=360,x radius=4,y radius=0.9] -- cycle;` |
| 566 | `\fill[gray!16] (apex) -- (frontright) -- (backright) -- cycle;` | `\fill[gray!16] (apex) -- (baseright)` |
| 567 | `\fill[blue!11] (apex) -- (backleft) -- (frontleft) -- cycle;` | `arc[start angle=0,end angle=-90,x radius=4,y radius=0.9] -- cycle;` |
| 568 | `\fill[blue!14] ... -- cycle;` | `\draw (apex) -- (baseleft);` |
| 569 | Pyramid edge path | `\draw (apex) -- (baseright);` |
| 570 | Pyramid base path | `\draw[dashed] (baseright)` |
| 571 | `\foreach \s in {0.22,0.43,0.64,0.84} {` | `arc[start angle=0,end angle=180,x radius=4,y radius=0.9];` |
| 572 | Polygonal tier-cut path | `\draw (baseleft)` |
| 573 | Polygonal tier-cut continuation | `arc[start angle=180,end angle=360,x radius=4,y radius=0.9];` |
| 574 | Old loop close | `\foreach \s in {0.22,0.43,0.64,0.84} {` |
| 575 | Absent | `\draw[black!60]` |
| 576 | Absent | `($(apex)!\s!(basecenter)+(4*\s,0)$)` |
| 577 | Absent | `arc[start angle=0,end angle=360,x radius={4*\s},y radius={0.9*\s}];` |
| 578 | Absent | `}` |
| 587 | `\caption[The five-tier 3-D pyramid]{\textbf{The Five-Tier 3-D Pyramid.} ...}` | `\caption[The five-tier 3-D cone]{\textbf{The Five-Tier 3-D Cone.} ...}` |
| 769 | `The 3-D pyramid explains...` | `The 3-D cone explains...` |
| 771 | `upward through the pyramid.` | `upward through the cone.` |
| 775 | `\textbf{Square Ceiling}` | `\textbf{Flat Ceiling}` |
| 777 | Absent | `The observer on the axis sees the disc-shaped underside of` |
| 778 | Absent | `$I_{\text{buffer}}$ with every higher tier centred behind it, so the alignment` |
| 779 | Absent | `of the proxies along the sightline is exact.` |
| 782 | `...stepping outside the pyramid...` | `...stepping outside the cone...` |
| 789 | `Orthographic Projection / Square Ceiling` | `Orthographic Projection / Flat Ceiling` |
| 790 | `the 3-D pyramid into a 2-D plane...` | `the 3-D cone into a 2-D plane...` |
| 2410 | `...vertical $z$-axis vector of the 3-D pyramid...` | `...vertical $z$-axis vector of the 3-D cone...` |
| 13663 | `3-D Pyramid architecture...` | `3-D Cone architecture...` |
| 13719 | `\textbf{3-D Pyramid}` | `\textbf{3-D Cone}` |
| 13723 | `enclosed beneath the pyramid` | `enclosed beneath the cone` |
| 13726 | `The pyramid's apex disappears.` | `The cone's apex disappears.` |
| 13728 | `the ``Square Ceiling.''` | `the ``Flat Ceiling.''` |
| 13732 | Absent | `The observer on the axis sees the disc-shaped underside of` |
| 13733 | Absent | `$I_{\text{buffer}}$ with every higher tier centred behind it, so the alignment` |
| 13734 | Absent | `of the proxies along the sightline is exact.` |
| 13736 | `the full 3-D pyramid` | `the full 3-D cone` |
| 13767 | `Each layer of the 3-D Pyramid...` | `Each layer of the 3-D Cone...` |

The former back-left coordinate and the `blue!11` and `blue!14` pyramid-face fills were removed as part of the figure-block replacement recorded above.

## Figure Location and Visual Check

The redrawn Figure 0.2 appears on PDF page 77, which carries printed page number 5. The rendered page shows the cone apex, four elliptical tier cuts, elliptical base, dashed back half, tier labels, light blue front fill, gray shading, and the $z$ arrow without clipping or overlap.

## Validation

- `make pdf-from-tex`: passed.
- PDF length: 1,158 pages.
- LaTeX warning count before: 148.
- LaTeX warning count after: 148.
- Undefined references after: 0.
- Undefined citations after: 0.
- Literal `??` in PDF: 0.
- Figure placeholders: 1, matching the established baseline.
- `python3 tools/check_pdf_build.py --expect "The Five-Tier 3-D Cone"`: passed.
- Terminology grep: no `Square Ceiling` remains, and no `pyramid` remains in reference to the three-dimensional model.
