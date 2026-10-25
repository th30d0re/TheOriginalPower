"""Print one build batch as a compact use_figma script body: python3 emit_batch.py NN"""
import json, re, sys
s = open(f"build_{int(sys.argv[1]):02d}.js").read()
cards = json.loads(re.match(r"const CARDS = (\[.*?\n\]);", s, re.S).group(1))
origin = re.search(r"const ORIGIN = (\d+);", s).group(1)
for c in cards:  # math renders from the uploaded assets, so the builder never reads the LaTeX text
    c.pop("latex", None)
    for t in c.get("terms") or []:
        t.pop("latex", None)
print(f"ORIGIN={origin}")
print(json.dumps(cards, ensure_ascii=False, separators=(",", ":")))
