#!/bin/zsh
# Three Quiver Arrow 2 calls: redraw two NotebookLM illustrations as clean SVGs in our palette,
# then animate the first. Needs QUIVERAI_API_KEY exported in this shell. Prints each cached SVG path.
cd /Users/emmanuel/Documents/Theory/TheOriginalPower || exit 1
S=.venv-voice/bin/scriptcast-video
R=Architecting_the_operation/video/refs
echo "--- gavel and courthouse"
GAVEL=$($S svg generate 'A judge gavel with its sound block on the left and a classical courthouse with a triangular pediment and six columns on the right, side by side, hand-drawn sketch style redrawn as clean flat vector. Same composition as the reference image.' --instructions 'Flat vector with slightly sketchy outlines, no gradients, no background rectangle, transparent background. Palette only: cream #f4ead2 for the building and outlines, gold #d9a441 for the gavel head, muted blue #9fb0cf for column shading. Wide composition about 950 by 320 pixels.' --reference $R/nlm_gavel_court.png --n 1 | tail -1)
echo "$GAVEL"
echo "--- animate the gavel and courthouse"
$S svg animate "Architecting_the_operation/video/$GAVEL" --prompt 'The gavel lifts and strikes its sound block once, with a small impact burst, while the courthouse columns stay still. Loop gently.' 2>/dev/null || $S svg animate "/Users/emmanuel/Documents/Theory/scriptCast/video/public/$GAVEL" --prompt 'The gavel lifts and strikes its sound block once, with a small impact burst, while the courthouse columns stay still. Loop gently.'
echo "--- 87 percent graphic (static)"
$S svg generate 'A large bold 87 percent number with a rising teal arrow made of stacked rifle silhouettes climbing behind it, three stylized women of different skin tones aiming rifles in profile on the left, a small NSSF-style shield badge at the bottom, and an outline of the state of Massachusetts on the right with an X over it. Redrawn as a clean flat vector. Same composition as the reference image.' --instructions 'Flat vector, no gradients, no background rectangle, transparent background. Palette only: cream #f4ead2, gold #d9a441, teal #6ec3c0, red #e2573f, muted blue #9fb0cf, navy #16264a for outlines. The numerals read 87% clearly. Generic stylized figures, no real people. Composition about 950 by 400 pixels.' --reference $R/nlm_stat87.png --n 1
