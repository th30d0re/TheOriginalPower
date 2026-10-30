"""Write rebuilt data files back into complex_wage_plane.html.

Usage: python3 embed_data.py [PAGE] [DATA_DIR]
The page keeps each data set on one line that starts with `var CARRY=`, `var TRANSIT=`, or `var BRUEN=`.
This script replaces those three lines with the contents of data/states_carry.json, data/transit.json,
and data/bruen_test.json.
"""
import json, sys, pathlib
here = pathlib.Path(__file__).resolve().parent.parent
page = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else here / 'complex_wage_plane.html'
data = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else here / 'data'
blobs = {'var CARRY=': 'states_carry.json', 'var TRANSIT=': 'transit.json', 'var BRUEN=': 'bruen_test.json'}
lines = page.read_text(encoding='utf-8').split('\n')
for prefix, name in blobs.items():
    hits = [i for i, l in enumerate(lines) if l.startswith(prefix)]
    assert len(hits) == 1, (prefix, len(hits))
    obj = json.loads((data / name).read_text())
    lines[hits[0]] = prefix + json.dumps(obj, separators=(',', ':')) + ';'
page.write_text('\n'.join(lines), encoding='utf-8')
print('embedded', ', '.join(blobs.values()), 'into', page.name)
