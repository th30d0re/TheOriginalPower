#!/bin/sh
# fetch_clip.sh TARGET_NAME URL: download one Figma export into the v2 clip dir.
# The v1 clips are symlinks here; remove the link first so v1's file is never overwritten.
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../../../../.." && pwd)
DIR="$ROOT/outputs/YT02V2/video/figma"
rm -f "$DIR/$1"
curl -sfL -o "$DIR/$1.part" "$2" && mv "$DIR/$1.part" "$DIR/$1"
ffprobe -v error -show_entries format=duration:stream=width,height -of csv=p=0 "$DIR/$1" | tr '\n' ' '; echo " $1"
