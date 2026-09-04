#!/usr/bin/env bash
# Phase-2 multi-vendor sweep: run the same batches through claude / gemini(agy) / kimi CLIs,
# tolerate per-batch failures, then per-model + pooled analysis.
# Usage: BATCH_COUNT=2 ./run_multi.sh    (default BATCH_COUNT=15)
set -uo pipefail
cd "$(dirname "$0")"
HERE="$(pwd)"

BATCH_COUNT="${BATCH_COUNT:-15}"
PY="${PYTHON_BIN:-python3}"
LEVELS=(LL ML EL)
MODELS=(claude-cli gemini-3.1-pro-low kimi-k3)

model_cmd() {
  case "$1" in
    claude-cli)          echo 'claude -p {prompt}' ;;
    gemini-3.1-pro-low)  echo 'agy --model gemini-3.1-pro-low --print {prompt}' ;;
    kimi-k3)             echo 'kimi --output-format text -p {prompt}' ;;
  esac
}

echo "== build inputs =="
"$PY" build_pairs.py
"$PY" assemble_batches.py --count "$BATCH_COUNT"

FAILLOG="$HERE/results/multi_failures.log"
: > "$FAILLOG"

for MODEL in "${MODELS[@]}"; do
  CMD="$(model_cmd "$MODEL")"
  echo "== model: $MODEL  ($CMD) =="
  for LVL in "${LEVELS[@]}"; do
    for N in $(seq 1 "$BATCH_COUNT"); do
      OUT="$HERE/results/$MODEL/$LVL/batch_$N.txt"
      [ -s "$OUT" ] && { echo "  skip $LVL/$N (exists)"; continue; }
      if "$PY" run_model.py --levels "$LVL" --batch "$N" --model "$MODEL" --model-cmd "$CMD" >/dev/null 2>>"$FAILLOG"; then
        echo "  ok   $LVL/$N"
      else
        echo "  FAIL $LVL/$N"
        echo "FAIL $MODEL $LVL $N" >> "$FAILLOG"
      fi
    done
  done
done

echo "== parse + join + per-model analysis =="
CSVS=()
for MODEL in "${MODELS[@]}"; do
  "$PY" parse.py --model "$MODEL" --allow-incomplete || echo "  parse issues for $MODEL (continuing)"
  CSV="$HERE/results/selections_$MODEL.csv"
  if "$PY" join_race.py --model "$MODEL" --output "$CSV"; then
    "$PY" analyze.py --input "$CSV" --analysis-dir "$HERE/analysis/$MODEL" --figure-dir "$HERE/figures/$MODEL" \
      || echo "  analyze issues for $MODEL"
    CSVS+=("$CSV")
  else
    echo "  join failed for $MODEL"
  fi
done

if [ "${#CSVS[@]}" -gt 0 ]; then
  echo "== pooled analysis (${#CSVS[@]} models) =="
  POOL="$HERE/results/selections_pooled.csv"
  { head -1 "${CSVS[0]}"; for f in "${CSVS[@]}"; do tail -n +2 "$f"; done; } > "$POOL"
  "$PY" analyze.py --input "$POOL" --analysis-dir "$HERE/analysis/pooled" --figure-dir "$HERE/figures/pooled"
fi

echo "== done =="
echo "failures:"; cat "$FAILLOG" 2>/dev/null || true
