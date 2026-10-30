"""Extract the Compiled Runtime Log from the manuscript for the Interference State instrument.

Usage: python3 build_runtime_log.py [TEX] [OUT_JSON] [--embed PAGE]
Defaults: Paper/The_Original_Power.tex -> tools/interference_state/data/runtime_log.json.
Each entry keeps the log number, title, chapter label, source line, the Phi_load range, the rho_tau range,
a single rho_tau value where the log gives one, and the Interference State text converted to plain text.
Three entries carry notes that the text states in words: log 3 (crash above 1.00), log 6 (Haitian Theorem
at 1.0; the range covers adjacent zones), log 13 (rho_tau -> 0.95).
"""
import json, re, sys, pathlib
root = pathlib.Path(__file__).resolve().parents[3]
args = [a for a in sys.argv[1:] if not a.startswith('--')]
tex_path = pathlib.Path(args[0]) if args else root / 'Paper/The_Original_Power.tex'
out_path = pathlib.Path(args[1]) if len(args) > 1 else root / 'tools/interference_state/data/runtime_log.json'
tex = tex_path.read_text(encoding='utf-8').split('\n')

start = next(i for i, l in enumerate(tex) if r'\label{sec:runtime_log}' in l)
entries, cur = [], None
for n in range(start, len(tex)):
    l = tex[n]
    if r'\chapter{' in l and n > start + 2: break
    m = re.search(r'title=(\d+)\. RUNTIME LOG: (.*?) \\normalfont\\small--- Chapter \\ref\{(.*?)\}\]', l)
    if m:
        cur = {'n': int(m.group(1)), 'title': m.group(2), 'chapter': m.group(3), 'line': n + 1}
        entries.append(cur); continue
    if cur and r'\textbf{Interference State}' in l:
        cur['iline'] = n + 1; cur['raw'] = l
        ph = re.findall(r'\\Phi_\{\\text\{load\}\} \\in \[([\d.]+), ([\d.]+)\]', l)
        m2 = re.search(r'\): \$?\[([\d.]+), ([\d.]+)\]', l)
        cur['phi'] = [float(ph[0][0]), float(ph[0][1])] if ph else ([float(m2.group(1)), float(m2.group(2))] if m2 else None)
        rr = re.findall(r'\\rho_\{?\\tau\}?(?:=M\(t\)/\\tau)? \\in \[([\d.]+), ([\d.]+)\]', l)
        cur['rho'] = [float(rr[-1][0]), float(rr[-1][1])] if rr else None
        pt = re.search(r'\\rho_\{?\\tau\}?(?:=M\(t\)/\\tau)? (?:=|\\rightarrow) ([\d.]+)', l)
        cur['point'] = float(pt.group(1)) if pt else None

def clean(s):
    s = s.replace('\\\\', '')
    s = re.sub(r'\\textbf\{Interference State\}\s*', '', s)
    for a, b in [(r'\Phi_{\text{load}}', 'Φ_load'), (r'\rho_{\tau}', 'ρ_τ'), (r'\rho_\tau', 'ρ_τ'), (r'\tau', 'τ'), (r'\in', '∈'),
                 (r'\rightarrow', '→'), (r'\approx', '≈'), (r'\mathcal{E}', 'ℰ'), (r'\min', 'min'), (r'\max', 'max'),
                 (r'O_{\text{racialized}}', 'O_racialized'), (r'O_{\text{gendered}}', 'O_gendered'), (r'O_{\text{emancipated}}', 'O_emancipated'),
                 (r'I_{\text{buffer}}', 'I_buffer'), (r'E_{\text{global}}', 'E_global'), (r'P_{\text{uppet}}', 'P_uppet'),
                 (r'\alpha_{r,g}', 'α_r,g'), (r'\cap', '∩'), (r'\cup', '∪'), ('---', '—'), ('--', '–'), ('{,}', ',')]:
        s = s.replace(a, b)
    s = re.sub(r'\\text(?:it|bf)\{([^}]*)\}', r'\1', s)
    s = re.sub(r'\\textcolor\{[^}]*\}\{([^}]*)\}', r'\1', s)
    s = re.sub(r'Chapter~\\ref\{[^}]*\}', 'the linked chapter', s)
    s = s.replace('~', ' ').replace('$', '').replace('\\', '')
    s = re.sub(r'\s+', ' ', s).strip()
    return re.sub(r'^\(Φ_load(, proximity to τ)?\):\s*', '', s)

out = []
for e in entries:
    t = clean(e['raw']) if e.get('raw') else ''
    if t.startswith('['): t = 'Φ_load ∈ ' + t
    t = re.sub(r'^:\s*', '', t)
    t = t.replace('P_{text{class}}', 'P_class').replace('P_{text{id}}', 'P_id').replace('eta(t)', 'η(t)').replace('{', '').replace('}', '')
    d = {'n': e['n'], 'title': clean(e['title']), 'chapter': e['chapter'], 'line': e.get('iline') or e['line'],
         'phi': e.get('phi'), 'rho': e.get('rho'), 'point': e.get('point'), 'text': t or 'This log gives no interference-state values.'}
    if d['n'] == 3: d['crash'] = 'ρ_τ > 1.00 at the crash (Bacon’s Rebellion, 1676), then the range after the 1705 patch'
    if d['n'] == 6: d['point'] = 1.0; d['pointLabel'] = 'Haitian Theorem executed at ρ_τ = 1.0'; d['rangeLabel'] = 'adjacent Caribbean extraction zones'
    if d['n'] == 13: d['pointLabel'] = 'ρ_τ → 0.95'
    out.append(d)
blob = json.dumps(out, ensure_ascii=False, separators=(',', ':'))
out_path.write_text(blob, encoding='utf-8')
print('entries', len(out), '->', out_path)
if '--embed' in sys.argv:
    page = pathlib.Path(sys.argv[sys.argv.index('--embed') + 1])
    lines = page.read_text(encoding='utf-8').split('\n')
    hits = [i for i, l in enumerate(lines) if l.startswith('var LOG=')]
    assert len(hits) == 1, len(hits)
    lines[hits[0]] = 'var LOG=' + blob + ';'
    page.write_text('\n'.join(lines), encoding='utf-8'); print('embedded into', page)
