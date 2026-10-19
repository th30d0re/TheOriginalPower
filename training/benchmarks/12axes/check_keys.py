"""Validate the owned 12axes gold artifacts without network or Git access.

Run from any directory. --spot-check prints a reproducible sample for human review.
The structural checks establish coverage and citation syntax; source entailment
and the completeness of silence judgments require manuscript reading.
"""
from __future__ import annotations

import argparse
import csv
import random
import re
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parents[2] / 'Paper' / 'The_Original_Power.tex'
SCHEMAS = {
    'questions.tsv': ['id', 'axis', 'agree_pole', 'text'],
    'atomic.tsv': ['atomic_id', 'parent_id', 'axis', 'agree_pole', 'text'],
    'keys/gold_forced.tsv': ['id', 'answer', 'compound', 'basis', 'cite', 'rationale'],
    'keys/gold_atomic.tsv': ['id', 'answer', 'basis', 'cite', 'rationale'],
}
CITE = re.compile(r'The_Original_Power\.tex:([1-9][0-9]*)')
ANSWERS = {'SA', 'A', 'N', 'D', 'SD'}
BASES = {'book', 'inferred', 'silent'}
TOPICS = ['Structure and federalism', 'Representation', 'Security and liberty',
          'Immigration', 'Military and diplomacy', 'Foreign intervention',
          'Public and private economy', 'Planning and markets', 'Trade',
          'Religion', 'Morality', 'Technology']


def require(condition, message):
    if not condition:
        raise ValueError(message)


def read(name):
    text = (HERE / name).read_text(encoding='utf-8')
    lines = text.splitlines()
    require(lines and lines[0].split('\t') == SCHEMAS[name], f'{name}: header')
    require(all(len(line.split('\t')) == len(SCHEMAS[name]) for line in lines),
            f'{name}: malformed TSV row')
    rows = list(csv.DictReader(lines, delimiter='\t', quoting=csv.QUOTE_NONE))
    key = 'atomic_id' if name == 'atomic.tsv' else 'id'
    require(len({r[key] for r in rows}) == len(rows), f'{name}: duplicate ids')
    return rows


def check_cites(cites, label, source):
    for cite in cites.split(';'):
        match = CITE.fullmatch(cite)
        require(match is not None, f'{label}: invalid citation {cite!r}')
        number = int(match[1])
        require(1 <= number <= len(source), f'{label}: nonexistent line {number}')
        content = source[number - 1].strip()
        require(content and not re.fullmatch(r'\\(?:begin|end|label)\{[^}]+\}', content),
                f'{label}: citation points to empty or structural-only line {number}')


def validate():
    source = SOURCE.read_text(encoding='utf-8').splitlines()
    questions, atomic, forced, gold = (read(name) for name in SCHEMAS)
    Q = {q['id']: q for q in questions}
    A = {a['atomic_id']: a for a in atomic}
    F = {f['id']: f for f in forced}
    G = {g['id']: g for g in gold}
    require(len(questions) == 240, 'Expected 240 fixed questions')
    require(set(F) == set(Q), 'Forced key coverage differs from questions')
    require(set(G) == set(A), 'Atomic key coverage differs from atomic ids')
    children = defaultdict(list)
    for a in atomic:
        pid = a['parent_id']
        require(pid in Q, f'{a["atomic_id"]}: unknown parent')
        require(a['axis'] == Q[pid]['axis'], f'{a["atomic_id"]}: wrong axis')
        require(a['agree_pole'] in {'LEFT', 'RIGHT'}, f'{a["atomic_id"]}: invalid pole')
        require(a['text'].strip(), f'{a["atomic_id"]}: empty text')
        children[pid].append(a)
    require(set(children) == set(Q), 'Every parent must appear in atomic.tsv')
    for pid, f in F.items():
        require(f['compound'] in {'0', '1'}, f'{pid}: invalid compound flag')
        group = children[pid]
        require(len(group) >= 2 if f['compound'] == '1' else len(group) == 1,
                f'{pid}: split cardinality conflicts with flag')
        require([a['atomic_id'] for a in group] ==
                [f'{pid}_{chr(97 + i)}' for i in range(len(group))],
                f'{pid}: atomic suffix sequence')
        if f['compound'] == '0':
            require(group[0]['text'] == Q[pid]['text'], f'{pid}: changed singleton text')
            require(group[0]['agree_pole'] == Q[pid]['agree_pole'], f'{pid}: singleton pole')
            require(all(f[k] == G[pid + '_a'][k] for k in
                        ['answer', 'basis', 'cite', 'rationale']), f'{pid}: singleton key differs')
    for name, rows in [('forced', forced), ('atomic', gold)]:
        for r in rows:
            label = f'{name}:{r["id"]}'
            require(r['answer'] in ANSWERS, f'{label}: answer')
            require(r['basis'] in BASES, f'{label}: basis')
            require(0 < len(r['rationale'].split()) <= 30, f'{label}: rationale length')
            if r['basis'] == 'silent':
                require(r['answer'] == 'N' and r['cite'] == '', f'{label}: silence invariant')
            else:
                require(bool(r['cite']), f'{label}: missing citation')
                check_cites(r['cite'], label, source)
    digest = (HERE / 'framework_digest.md').read_text(encoding='utf-8')
    words = len(digest.split())
    require(words <= 1800, f'Digest exceeds word limit: {words}')
    headings = [line[3:] for line in digest.splitlines() if line.startswith('## ')]
    require(headings == TOPICS, 'Digest must cover all twelve topics in order')
    scopes = 0
    for number, line in enumerate(digest.splitlines(), 1):
        if not line or line.startswith('#'):
            continue
        if line.startswith('Unaddressed: '):
            # A labeled scope fragment records absence without inventing a positive citation.
            require(not re.search(r'[.!?]', line), f'Digest:{number}: scope must be a fragment')
            scopes += 1
            continue
        match = re.fullmatch(r'(.+[.!?]) \[([^\]]+)\]', line)
        require(match is not None, f'Digest:{number}: uncited claim sentence')
        check_cites(match[2], f'Digest:{number}', source)
        require(len(re.findall(r'[.!?](?:\s|$)', match[1])) == 1,
                f'Digest:{number}: each sentence needs its own citation')
    require(scopes == 12, 'Digest needs twelve scope fragments')
    require(not re.search(r'\bquiz\b|\b(?:estrutura|representacao)_\d', digest, re.I),
            'Digest must describe the framework independently of item ids')
    print(f'PASS: 240 forced rows; {len(atomic)} atomic rows; '
          f'{sum(f["compound"] == "1" for f in forced)} compound parents')
    print(f'PASS: citations, enums, silent invariants, rationale lengths; digest {words}/1800 words')
    print('PASS: twelve cited topic sections and twelve explicit unaddressed-scope fragments')
    print('Basis forced:', dict(Counter(f['basis'] for f in forced)))
    print('Basis atomic:', dict(Counter(g['basis'] for g in gold)))
    return source, forced, gold


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--spot-check', action='store_true')
    args = parser.parse_args()
    source, forced, atomic = validate()
    if args.spot_check:
        candidates = [(name, row) for name, rows in [('forced', forced), ('atomic', atomic)]
                      for row in rows if row['basis'] == 'book']
        require(len(candidates) >= 20, 'Fewer than 20 book rows available for sampling')
        sample = random.Random(20260928).sample(candidates, 20)
        print('\nBOOK SPOT CHECK: seed 20260928, population includes both key files')
        for name, row in sample:
            print(f'\n{name}:{row["id"]} [{row["answer"]}] {row["rationale"]}')
            for cite in row['cite'].split(';'):
                n = int(CITE.fullmatch(cite)[1])
                print(f'{cite}: {source[n - 1]}')


if __name__ == '__main__':
    main()
