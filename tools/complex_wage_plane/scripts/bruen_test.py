"""Post-Bruen test: did former may-issue states add more restrictive laws after NYSRPA v. Bruen (June 23, 2022)?
Method fixed before running: treated = CCW regime 'may issue' on 2022-06-22; outcome = count of state laws with
Effect == 'Restrictive' effective in the post window vs an equal-length pre window; federal rows excluded;
difference-in-differences with a permutation test (random 9-state groups)."""
import openpyxl, sys, json, random, datetime as dt, collections
xlsx, out = sys.argv[1], sys.argv[2]
BRUEN = dt.date(2022, 6, 23); CUT = dt.date(2025, 9, 1)
L = (CUT - BRUEN).days
PRE0 = BRUEN - dt.timedelta(days=L)
wb = openpyxl.load_workbook(xlsx, read_only=True); ws = wb['Database']
rows = list(ws.iter_rows(values_only=True)); ix = {h: i for i, h in enumerate(rows[0])}
def d(y, m, dd): return None if y in (None, '', 'NA') else dt.date(int(y), int(m or 1), int(dd or 1))
ccw = collections.defaultdict(list); cnt = collections.defaultdict(lambda: {'r_pre': 0, 'r_post': 0, 'p_pre': 0, 'p_post': 0}); names = {}
REG = ['prohibited', 'may issue', 'shall issue', 'shall issue (permit not required)']
for r in rows[1:]:
    st = r[ix['State Postal Abbreviation']]; names[st] = r[ix['State']]; cnt[st]
    a = d(r[ix['Effective Date Year']], r[ix['Effective Date Month']], r[ix['Effective Date Day']])
    b = d(r[ix['Supersession Date Year']], r[ix['Supersession Date Month']], r[ix['Supersession Date Day']]) or dt.date(2100, 1, 1)
    sub = str(r[ix['Law Class Subtype']] or ''); lc = r[ix['Law Class']]
    if a is None: continue
    if lc == 'carrying a concealed weapon (ccw)' and sub in REG and r[ix['Law ID']] != 'MO1072':
        ccw[st].append((a, 'prohibited' if r[ix['Type of Change']] == 'Repeal' else sub, b))
    if 'federal' in sub.lower(): continue
    eff = r[ix['Effect']]
    win = 'post' if BRUEN <= a < CUT else ('pre' if PRE0 <= a < BRUEN else None)
    if win and eff == 'Restrictive': cnt[st]['r_' + win] += 1
    if win and eff == 'Permissive': cnt[st]['p_' + win] += 1
day = BRUEN - dt.timedelta(days=1)
def regime(st):
    act = [(a, sub) for a, sub, b in ccw[st] if a <= day < b]
    return max(act)[1] if act else None
treated = sorted(st for st in cnt if regime(st) == 'may issue')
states = sorted(cnt)
def did(group, key):
    g = set(group)
    tr = [cnt[s][key + '_post'] - cnt[s][key + '_pre'] for s in states if s in g]
    co = [cnt[s][key + '_post'] - cnt[s][key + '_pre'] for s in states if s not in g]
    return sum(tr) / len(tr) - sum(co) / len(co)
res = {'window_days': L, 'pre': [str(PRE0), str(BRUEN - dt.timedelta(1))], 'post': [str(BRUEN), str(CUT - dt.timedelta(1))], 'treated': treated,
       'counts': {s: dict(cnt[s], name=names[s]) for s in states}}
rng = random.Random(20220623)
for key in ('r', 'p'):
    obs = did(treated, key); n = len(treated); ge = 0; N = 200000
    for _ in range(N):
        if abs(did(rng.sample(states, n), key)) >= abs(obs) - 1e-12: ge += 1
    res['did_' + key] = obs; res['p_' + key] = ge / N
    t = [cnt[s] for s in treated]; c = [cnt[s] for s in states if s not in treated]
    print(f"{'restrictive' if key=='r' else 'permissive'}: treated pre {sum(x[key+'_pre'] for x in t)} post {sum(x[key+'_post'] for x in t)} (n={len(t)}); "
          f"others pre {sum(x[key+'_pre'] for x in c)} post {sum(x[key+'_post'] for x in c)} (n={len(c)}); DiD per state {obs:.2f}; two-sided permutation p {ge/N:.4f}")
print('window days', L, res['pre'], res['post']); print('treated', treated)
for s in treated: print('  ', s, cnt[s])
json.dump(res, open(out, 'w'), separators=(',', ':'))
