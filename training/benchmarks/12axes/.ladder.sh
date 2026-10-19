#!/bin/bash
# Full local ladder: every models.tsv run x {none,digest} x {forced,atomic}. Skips keys already written.
cd /Users/emmanuel/Documents/Theory/TheOriginalPower
R=training/benchmarks/12axes
for run in $(tail -n +2 $R/models.tsv | cut -f1); do
  for cond in none digest; do
    dg=""; [ $cond = digest ] && dg="--digest $R/framework_digest.md"
    for items in forced atomic; do
      src=$R/questions.tsv; [ $items = atomic ] && src=$R/atomic.tsv
      out=$R/keys/$run-$cond-$items.tsv
      [ -s $out ] && { echo "skip $out"; continue; }
      s=$(date +%s)
      .venv-voice/bin/python $R/take_quiz.py --backend mlx --registry $R/models.tsv --run $run --items $src $dg --out $out > $R/logs/$run-$cond-$items.log 2>&1
      echo "$(date +%H:%M) $run $cond $items exit=$? $(( $(date +%s)-s ))s $(grep -o 'median=[0-9.]*' $R/logs/$run-$cond-$items.log)"
    done
  done
done
echo LADDER DONE
