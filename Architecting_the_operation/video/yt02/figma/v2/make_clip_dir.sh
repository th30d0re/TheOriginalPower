#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../../../../.." && pwd)
SOURCE="$ROOT/outputs/YT02/video/figma"
TARGET="$ROOT/outputs/YT02V2/video/figma"

if [ -L "$TARGET" ]; then
  unlink "$TARGET"
elif [ -e "$TARGET" ]; then
  echo "target already exists as a real path: $TARGET" >&2
  exit 1
fi

mkdir -p "$TARGET"
for clip in "$SOURCE"/*; do
  [ -f "$clip" ] || continue
  name=${clip##*/}
  ln -s "../../../YT02/video/figma/$name" "$TARGET/$name"
done
