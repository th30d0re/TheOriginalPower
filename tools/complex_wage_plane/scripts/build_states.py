"""Build state-year concealed-carry and assault-weapon-ban shares from RAND State Firearm Law Database v6.0.

Usage: python3 build_states.py RAND_WORKBOOK.xlsx PANEL_CSV_OR_DASH STATES_CSV OUT_JSON
  RAND_WORKBOOK  "TL-A243-2-v4 State Firearm Law Database 6.0.xlsx" (not in the repository; see README)
  PANEL_CSV      optional state-year panel used only as a cross-check; pass - to skip
  STATES_CSV     Paper/data/gun_laws_new_england/states.csv (2024 population weights)

Rules: where carry laws overlap, the most recently effective law sets the regime; MO1072 (a permit to
acquire, filed under CCW) is left out; a Repeal row (DC1063) counts as no lawful concealed carry.
"""
import openpyxl, csv, json, sys, datetime as dt, collections
xlsx, panel_csv, states_csv, out = sys.argv[1:5]
Y0, Y1 = 1979, 2025
END = dt.date(2025, 12, 31)
REG = ['prohibited', 'may issue', 'shall issue', 'shall issue (permit not required)']

wb = openpyxl.load_workbook(xlsx, read_only=True); ws = wb['Database']
rows = list(ws.iter_rows(values_only=True)); ix = {h: i for i, h in enumerate(rows[0])}
def d(y, m, dd):
    if y in (None, '', 'NA'): return None
    return dt.date(int(y), int(m or 1), int(dd or 1))
def frac(a, b, year):
    s, e = dt.date(year, 1, 1), dt.date(year + 1, 1, 1)
    lo, hi = max(a, s), min(b, e)
    return max(0, (hi - lo).days) / (e - s).days

ccw = collections.defaultdict(list); aw = collections.defaultdict(list); fed = []; names = {}
for r in rows[1:]:
    st = r[ix['State Postal Abbreviation']]; names[st] = r[ix['State']]
    a = d(r[ix['Effective Date Year']], r[ix['Effective Date Month']], r[ix['Effective Date Day']])
    b = d(r[ix['Supersession Date Year']], r[ix['Supersession Date Month']], r[ix['Supersession Date Day']]) or dt.date(2100, 1, 1)
    lc, sub = r[ix['Law Class']], r[ix['Law Class Subtype']]
    if a is None: continue
    if lc == 'carrying a concealed weapon (ccw)' and sub in REG:
        lid = r[ix['Law ID']]
        if lid == 'MO1072': continue  # permit to acquire a handgun, filed under CCW; not a carry regime
        if r[ix['Type of Change']] == 'Repeal': sub = 'prohibited'  # repeal: no lawful concealed carry while in force
        ccw[st].append((sub, a, b))
    elif lc == 'firearm sales restrictions' and sub == 'assault weapons ban': aw[st].append((a, b))
    elif lc == 'firearm sales restrictions' and sub == 'assault weapons ban — Federal' and st == 'AK': fed.append((a, b))

def union_frac(iv, year):
    days = set(); s = dt.date(year, 1, 1); n = (dt.date(year + 1, 1, 1) - s).days
    for a, b in iv:
        for k in range(n):
            x = s + dt.timedelta(k)
            if a <= x < b: days.add(k)
    return len(days) / n

pop = {}
with open(states_csv, newline='') as f:
    for r in csv.DictReader(f):
        try: pop[r['state']] = float(r['fa_deaths_count_2024']) / float(r['fa_deaths_rate_2024']) * 1e5
        except Exception: pass

data = {'years': [Y0, Y1], 'states': [], 'fedAW': [round(union_frac(fed, y), 3) for y in range(Y0, Y1 + 1)]}
resid = []
for st in sorted(ccw):
    series = []
    for y in range(Y0, Y1 + 1):
        v = [0.0] * 4; s0 = dt.date(y, 1, 1); n = (dt.date(y + 1, 1, 1) - s0).days; covered = 0
        for k in range(n):
            x = s0 + dt.timedelta(k)
            act = [(a, sub) for sub, a, b in ccw[st] if a <= x < b]
            if not act: continue
            covered += 1
            v[REG.index(max(act)[1])] += 1  # the most recently effective law sets the regime
        if covered < n: resid.append((st, y, round(covered / n, 3)))
        if covered: v = [c / covered for c in v]
        series.append([round(x, 3) for x in v])
    awf = [round(union_frac(aw.get(st, []), y), 3) for y in range(Y0, Y1 + 1)]
    data['states'].append({'ab': st, 'name': names[st], 'pop': round(pop.get(names[st], 0)), 'ccw': series, 'aw': awf})
missing_pop = [s['name'] for s in data['states'] if not s['pop']]
print('states', len(data['states']), 'missing pop', missing_pop)
print('state-years with days that no carry law covers:', len(resid), resid[:12])

# optional cross-check against a state-year panel CSV (pass '-' to skip)
if panel_csv != '-':
    pan = collections.defaultdict(lambda: [0.0] * 4)
    with open(panel_csv, newline='', encoding='utf-8', errors='replace') as f:
        for r in csv.DictReader(f):
            if r['law_class'] == 'carrying a concealed weapon (ccw)' and r['law_class_subtype'] in REG:
                pan[(r['state_abb'], int(r['year']))][REG.index(r['law_class_subtype'])] += float(r['year_frac'])
    diff = []
    for s in data['states']:
        for i, y in enumerate(range(Y0, Y1 + 1)):
            p = pan.get((s['ab'], y))
            if p is None: continue
            t = sum(p); p = [x / t for x in p] if t else p
            dmax = max(abs(a - b) for a, b in zip(p, s['ccw'][i]))
            if dmax > 0.02: diff.append((s['ab'], y, [round(x, 2) for x in p], s['ccw'][i]))
    print('panel comparisons differing by > 0.02:', len(diff)); [print('  ', x) for x in diff[:15]]

# national population shares by regime
T = sum(s['pop'] for s in data['states'])
for y in (1979, 1987, 1995, 2005, 2012, 2021, 2023, 2025):
    i = y - Y0; sh = [sum(s['pop'] * s['ccw'][i][k] for s in data['states']) / T for k in range(4)]
    awsh = sum(s['pop'] * s['aw'][i] for s in data['states']) / T
    print(y, 'pop share P/M/S/U', [round(x, 3) for x in sh], 'state AW', round(awsh, 3), 'fed AW', data['fedAW'][i])
json.dump(data, open(out, 'w'), separators=(',', ':'))
