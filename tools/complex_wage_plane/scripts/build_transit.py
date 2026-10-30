"""Share of workers 16+ who commute by public transportation, by state: Black alone (B08105B) and
White alone not Hispanic (B08105H), ACS 2024 5-year table-based summary files (line 004 / line 001)."""
import sys, json, openpyxl
acs_dir, xlsx, out = sys.argv[1:4]
wb = openpyxl.load_workbook(xlsx, read_only=True); ws = wb['Database']
rows = list(ws.iter_rows(values_only=True)); ix = {h: i for i, h in enumerate(rows[0])}
fips2ab = {str(r[ix['FIPS Code']]).zfill(2): r[ix['State Postal Abbreviation']] for r in rows[1:]}
def load(t):
    res = {}
    with open(f"{acs_dir}/acsdt5y2024-{t}.dat") as f:
        hdr = f.readline().strip().split('|'); c = {h: i for i, h in enumerate(hdr)}
        T = t.upper()
        for line in f:
            p = line.strip().split('|')
            if p[0].startswith('0400000US') and p[0][-2:] in fips2ab:
                tot = float(p[c[f'{T}_E001']]); pt = float(p[c[f'{T}_E004']])
                res[fips2ab[p[0][-2:]]] = (pt / tot if tot else None, int(tot))
            if p[0] == '0100000US':
                res['US'] = (float(p[c[f'{T}_E004']]) / float(p[c[f'{T}_E001']]), int(float(p[c[f'{T}_E001']])))
    return res
b, w = load('b08105b'), load('b08105h')
data = {ab: [round(b[ab][0], 4) if b.get(ab) and b[ab][0] is not None else None, round(w[ab][0], 4), b.get(ab, (0, 0))[1]] for ab in sorted(w)}
json.dump(data, open(out, 'w'), separators=(',', ':'))
for ab in ['US', 'NY', 'NJ', 'MD', 'IL', 'CA', 'HI', 'MA', 'DC', 'TX']:
    print(ab, 'Black', f"{data[ab][0]:.3f}", 'White NH', f"{data[ab][1]:.3f}", 'ratio', f"{data[ab][0]/data[ab][1]:.2f}", 'Black workers', data[ab][2])
print('states', len(data))
