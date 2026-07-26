import re

path = '/Users/emmanuel/Documents/Theory/Redefining_racism/Paper/unified_electrodynamic_framework.tex'
with open(path, 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    # check for known bad lines
    patterns = [
        r'^\s*\\text\{Re\}\(W\) = R\\cos\\theta < 0',
        r'^\s*W\^\* = \\psi_m - j\\psi_s\s*$',
        r'^\s*W \+ W\^\* = \(\\psi_m \+ j\\psi_s\) \+ \(\\psi_m - j\\psi_s\) = 2\\psi_m\s*$',
        r'^\s*W \\cdot W\^\* = \\psi_m\^2 \+ \\psi_s\^2 \\in \\mathbb\{R\}\s*$',
        r'^\s*j\\psi_s\(t\) = j\\psi_s\(t_0\) \\cdot e\^\{\\delta \\cdot t\}\s*$',
        r'^\s*W_\{Q\} = a \+ bi \+ cj \+ dk\s*$',
        r'^\s*i\^2 = j\^2 = k\^2 = ijk = -1\s*$',
        r'^\s*e_1 \\wedge e_4 = e_\{14\}\s*$',
        r'^\s*\\vec\{F\}_\{total\} = q\\vec\{E\} \+ q\\left\(\\vec\{v\} \\times \\sum_\{k=1\}\^\{N\} \\rho_k \\vec\{B\}_k\\right\)\s*$',
        r'^\s*V = iR \+ L\\frac\{di\}\{dt\}\s*$',
        r'^\s*L\\frac\{d\^2I\}\{dt\^2\} \+ R\\frac\{dI\}\{dt\} \+ \\frac\{I\}\{C\} = V\(t\)\s*$',
        r'^\s*\\zeta = \\frac\{R\}\{2\}\\sqrt\{\\frac\{C\}\{L\}\}\s*$',
    ]
    matched = False
    for p in patterns:
        if re.search(p, line):
            indent = line[:len(line) - len(line.lstrip())]
            new_lines.append(f"{indent}\\[ {line.strip()} \\]\n")
            matched = True
            break
    if not matched:
        new_lines.append(line)

with open(path, 'w') as f:
    f.writelines(new_lines)
