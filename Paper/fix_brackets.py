import re

path = '/Users/emmanuel/Documents/Theory/Redefining_racism/Paper/unified_electrodynamic_framework.tex'
with open(path, 'r') as f:
    text = f.read()

# Replace 
# \[
#      \[ content \]
# \]
# With 
# \[
#      content
# \]

text = re.sub(r'\\\[\s*\\\[\s*(.*?)\s*\\\]\s*\\\]', r'\\[\n      \1\n    \\]', text, flags=re.DOTALL)

with open(path, 'w') as f:
    f.write(text)
