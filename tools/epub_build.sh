#!/usr/bin/env bash
# Build an EPUB 3 of The Original Power from Paper/The_Original_Power.tex.
#
# pandoc cannot render TikZ/pgfplots, and EPUB readers cannot display PDF
# images, so vector artwork is rasterised first and the LaTeX is rewritten by
# tools/epub_prepare.py (cross-references, counters, callout titles) before
# pandoc ever sees it.
#
#   tools/epub_build.sh [output.epub]
#
# Env: BUILD_DIR   scratch directory (default: build/epub)
#      DPI         raster resolution for figures (default: 200)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAPER="$ROOT/Paper"
BUILD="${BUILD_DIR:-$ROOT/build/epub}"
DPI="${DPI:-200}"
OUT="${1:-$ROOT/dist/The_Original_Power.epub}"

for tool in pandoc pdflatex pdftoppm python3; do
  command -v "$tool" >/dev/null || { echo "missing required tool: $tool" >&2; exit 1; }
done

mkdir -p "$BUILD/tikz" "$BUILD/img" "$(dirname "$OUT")"

echo "==> 1/5  extracting TikZ pictures"
python3 "$ROOT/tools/epub_prepare.py" --emit-tikz "$BUILD/tikz" "$PAPER"

echo "==> 2/5  compiling TikZ pictures (parallel)"
cd "$BUILD/tikz"
ls fig-*.tex | sed 's/\.tex$//' | xargs -P 8 -I{} \
  sh -c 'pdflatex -interaction=nonstopmode -halt-on-error {}.tex >{}.buildlog 2>&1 \
         || echo "FAILED: {}" >&2'
missing=0
for f in fig-*.tex; do [ -f "${f%.tex}.pdf" ] || { echo "no PDF for ${f%.tex}" >&2; missing=1; }; done
[ "$missing" -eq 0 ] || { echo "TikZ compilation incomplete" >&2; exit 1; }

echo "==> 3/5  rasterising figures at ${DPI}dpi"
for f in fig-*.pdf; do
  [ -f "${f%.pdf}.png" ] && [ "${f%.pdf}.png" -nt "$f" ] && continue
  pdftoppm -r "$DPI" -png -singlefile "$f" "${f%.pdf}"
done
# EPUB readers cannot show a PDF image; mirror every vector figure as PNG.
cd "$PAPER"
find figures -name '*.pdf' ! -name 'cover_*.pdf' | while read -r f; do
  dest="$BUILD/img/${f#figures/}"; dest="${dest%.pdf}.png"
  mkdir -p "$(dirname "$dest")"
  [ -f "$dest" ] && [ "$dest" -nt "$f" ] || pdftoppm -r "$DPI" -png -singlefile "$f" "${dest%.png}"
done
[ -f "$BUILD/cover.jpg" ] || pdftoppm -r 150 -jpeg -singlefile \
  "$PAPER/figures/cover_front.pdf" "$BUILD/cover"

echo "==> 4/5  rewriting LaTeX for pandoc"
python3 "$ROOT/tools/epub_prepare.py" "$PAPER" "$BUILD"

echo "==> 5/5  writing EPUB"
pandoc "$BUILD/body.tex" \
  --from=latex --to=epub3 \
  --metadata-file="$ROOT/tools/epub_metadata.yaml" \
  --resource-path="$BUILD:$PAPER:$PAPER/figures" \
  --epub-cover-image="$BUILD/cover.jpg" \
  --css="$ROOT/tools/epub.css" \
  --mathml \
  --citeproc --bibliography="$PAPER/references.bib" \
  --toc --toc-depth=3 --split-level=2 \
  --output="$OUT"

echo
echo "wrote $OUT ($(du -h "$OUT" | cut -f1))"
