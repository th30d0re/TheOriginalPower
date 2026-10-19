#!/bin/zsh
cd /Users/emmanuel/Documents/Theory/TheOriginalPower
AGY=~/.local/bin/agy
M=gemini-3.8-flash-high
for i in 1 2 3 4 5 6; do
  out=$($AGY --model $M --print-timeout 4m --print="Reply with the single word OK." 2>&1 | tail -1)
  echo "$(date +%H:%M) probe: $out"
  [[ "$out" == *OK* ]] && break
  sleep 600
done
[[ "$out" == *OK* ]] || { echo "quota still exhausted; not dispatched"; exit 3; }
$AGY --model $M --print-timeout 40m --dangerously-skip-permissions --print="$(cat training/benchmarks/12axes/BRIEF-gemini-runner.md)" > training/benchmarks/12axes/gemini-runner.log 2>&1
echo "gemini exit $?"
