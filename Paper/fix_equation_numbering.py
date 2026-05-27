#!/usr/bin/env python3
"""
Restructure equation numbering in The_Mathematics_of_Oppression.tex
so that rendered numbers match existing labels (Option B).
"""
import re

with open('The_Mathematics_of_Oppression.tex', 'r') as f:
    content = f.read()

# Replace the 4 partition equations with unnumbered display math
replacements = [
    (r'\\begin\{equation\}\\label\{eq:binary-partition\}\n(.*?)\\end\{equation\}', r'\\[\n\1\\]'),
    (r'\\begin\{equation\}\\label\{eq:refined-five-tier-partition\}\n(.*?)\\end\{equation\}', r'\\[\n\1\\]'),
    (r'\\begin\{equation\}\\label\{eq:outgroup-internal-partition\}\n(.*?)\\end\{equation\}', r'\\[\n\1\\]'),
    (r'\\begin\{equation\}\\label\{eq:recursive-local-partition\}\n(.*?)\\end\{equation\}', r'\\[\n\1\\]'),
]

for pattern, replacement in replacements:
    content_new = re.sub(pattern, replacement, content, flags=re.DOTALL)
    if content_new == content:
        print(f'WARNING: Pattern did not match: {pattern[:50]}...')
    else:
        print(f'Replaced: {pattern[:50]}...')
    content = content_new

# Update Chapter 10 reference
old_ref = (
    'The population partition introduced in Chapter~\\ref{ch:redefining} '
    '(Equations~\\ref{eq:binary-partition}--\\ref{eq:recursive-local-partition})'
)
new_ref = (
    'The population partition introduced in Chapter~\\ref{ch:redefining}'
)

if old_ref in content:
    content = content.replace(old_ref, new_ref)
    print('Updated Chapter 10 reference')
else:
    print('WARNING: Chapter 10 reference not found')

with open('The_Mathematics_of_Oppression.tex', 'w') as f:
    f.write(content)

print('Done')
