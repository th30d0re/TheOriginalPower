#!/bin/bash
# Extract the reel's clip turns as 30 fps JPEG frames into the Stage engine's public assets.
# In-points are the archive/clips.yaml starts plus the offset measured by cross-correlating the
# episode audio against each source (2026-11-03): the mix trims 50–90 ms of leading silence,
# so the picture starts that much later to stay lip-synced. Frame counts = turn length × 30 fps.
set -euo pipefail
B=/Users/emmanuel/Documents/Theory/TheOriginalPower
A=$B/Architecting_the_operation/archive/sources
P=/Users/emmanuel/Documents/Theory/scriptCast-stage/video/public/assets/clips
while read -r cid src start frames; do
  mkdir -p "${P:?}/$cid"
  ffmpeg -nostdin -loglevel error -y -i "$A/$src" -ss "$start" -frames:v "$frames" \
    -vf "fps=30,scale=1080:1920:flags=lanczos" -q:v 3 "$P/$cid/f%04d.jpg"
  echo "$cid $start $frames"
done <<'LIST'
bostopia_psychopaths bostopia_q9_2026.mp4 78.3500 217
bostopia_stockpile bostopia_q9_2026.mp4 85.9800 383
bostopia_smith bostopia_q9_2026.mp4 98.8100 209
bostopia_abusers bostopia_q9_2026.mp4 105.7398 308
bostopia_libertarian bostopia_q9_2026.mp4 116.4065 430
reel_a1_short reel_a1.mp4 26.7794 443
LIST
# Loretta Green (inside TheCheck, from cue "green"): offset measured 0 ms.
ffmpeg -nostdin -loglevel error -y -i "$A/loretta_green_poll_tax_2026.mp4" -ss 0 -frames:v 386 \
  -vf "fps=30,scale=1080:1920:flags=lanczos" -q:v 3 "${P:?}/green/f%03d.jpg"
