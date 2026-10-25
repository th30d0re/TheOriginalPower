"""Download Figma exports into the v2 clip dir: python3 fetch_by_node.py NODE=URL [NODE=URL ...]"""
import json, subprocess, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
target = {r["nodeId"]: r["target"] for r in json.load(open(HERE / "export_list.json"))}
for arg in sys.argv[1:]:
    node, url = arg.split("=", 1)
    subprocess.run([str(HERE / "fetch_clip.sh"), target[node], url], check=False)
