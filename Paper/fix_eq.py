import re

path = '/Users/emmanuel/Documents/Theory/Redefining_racism/Paper/unified_electrodynamic_framework.tex'
with open(path, 'r') as f:
    text = f.read()

# Replace \[ and \] inside \begin{equation} ... \end{equation}
def replacer(match):
    inner = match.group(1)
    inner = inner.replace('\\[', '').replace('\\]', '')
    return f'\\begin{{equation}}{inner}\\end{{equation}}'

text = re.sub(r'\\begin\{equation\}(.*?)\\end\{equation\}', replacer, text, flags=re.DOTALL)

with open(path, 'w') as f:
    f.write(text)
