#!/usr/bin/env python3
"""
purge_corrective_contrast.py

Systematically eliminates corrective contrast rhetoric from the manuscript:
- "not merely X, it is Y" → direct affirmative
- "not just X, it is Y" → direct affirmative
- "not simply X, it is Y" → direct affirmative
- "not an accident; it is Y" → direct affirmative
- "does not merely X; it Y" → direct affirmative
- etc.

Operates on The_Original_Power.tex with surgical precision.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEX_PATH = ROOT / "The_Original_Power.tex"

with open(TEX_PATH, "r", encoding="utf-8") as f:
    text = f.read()

replacements = []

def log(old, new):
    replacements.append((old.strip()[:120], new.strip()[:120]))

# ---------------------------------------------------------------------------
# Pattern 1: "not merely X; it is Y" / "not merely X, it is Y" / "not merely X. It is Y"
# ---------------------------------------------------------------------------
def repl_not_merely_it_is(m):
    # Extract the Y part (after "it is/was/constitutes/functions as")
    prefix = m.group(1)
    connector = m.group(2)
    suffix = m.group(3)
    # Check if suffix starts with a verb that makes sense standalone
    new = f"{prefix}{suffix}"
    return new

# Handles: "not merely X; it is Y", "not merely X, it is Y", "not merely X. It is Y"
# We want to drop everything before "it is" and keep the Y
# But need to be careful about what X contains

# Pattern: [clause] not merely [X]; it is/was/constitutes [Y]
# We keep [clause] and replace with [clause] [Y]
# Or if [clause] is empty, just [Y]

# Let's handle this with a more targeted approach:
# Find the boundary and reconstruct

# Pattern A: "not merely X; it is/was/constitutes/functions as Y"
# → drop "not merely X; " keep "it is/was/... Y"
# But we want to eliminate "it is" too if possible

# Actually the user wants DIRECT AFFIRMATIVE statements.
# So "not merely X; it is Y" should become just "Y" (possibly with subject)

# Let's use specific regexes for the most common sub-patterns

# 1a. "... was not merely X; it was Y" → "... constituted Y"
text = re.sub(
    r'(?i)(\w+) was not merely [^;]+; it was (\S+)',
    lambda m: f"{m.group(1)} constituted {m.group(2)}",
    text
)

# 1b. "... was not merely X; it Y" → "... Y"
text = re.sub(
    r'(?i)([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,4}) was not merely [^;]+; it (\w+)',
    lambda m: f"{m.group(1)} {m.group(2)}",
    text
)

# 2. "... is not merely X; it is Y" → "... constitutes Y"
text = re.sub(
    r'(?i)([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,4}|The [a-z]+(?:\s+[a-z]+){0,4}) is not merely [^;]+; it is (\S+)',
    lambda m: f"{m.group(1)} constitutes {m.group(2)}",
    text
)

# 3. "... does not merely X; it Y" → "... Y"
text = re.sub(
    r'(?i)([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,4}|The [a-z]+(?:\s+[a-z]+){0,4}) does not merely [^;]+; it (\w+)',
    lambda m: f"{m.group(1)} {m.group(2)}",
    text
)

# 4. "... did not merely X; it Y" → "... Y"
text = re.sub(
    r'(?i)([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,4}|The [a-z]+(?:\s+[a-z]+){0,4}) did not merely [^;]+; it (\w+)',
    lambda m: f"{m.group(1)} {m.group(2)}",
    text
)

# 5. "This/That/The X is not Y. It is Z." → "This/That/The X constitutes Z."
text = re.sub(
    r'(?i)(This|That|The [a-z]+(?:\s+[a-z]+){0,4}) is not [^.]+\. It is (\S+)',
    lambda m: f"{m.group(1)} constitutes {m.group(2)}",
    text
)

# 6. "This/That/The X is not Y; it is Z." → "This/That/The X constitutes Z."
text = re.sub(
    r'(?i)(This|That|The [a-z]+(?:\s+[a-z]+){0,4}) is not [^;]+; it is (\S+)',
    lambda m: f"{m.group(1)} constitutes {m.group(2)}",
    text
)

# 7. "not merely X. It is Y" → "constitutes Y"
text = re.sub(
    r'(?i)not merely [^.]+\. It is (\S+)',
    lambda m: f"constitutes {m.group(1)}",
    text
)

# 8. "not merely X, it is Y" → direct
# This is trickier - need to find the subject
# Pattern: "[Subject] [verb] not merely X, it is Y" 
# But often there's no subject - just "not merely X, it is Y" at sentence start

# 9. "not merely X but Y" → "constitutes Y" or "Y"
text = re.sub(
    r'(?i)not merely [^,]+,?(?:\s*but\s+|\s*but\s+also\s+)it is (\S+)',
    lambda m: f"constitutes {m.group(1)}",
    text
)

# 10. "not just X but Y" → "constitutes Y"
text = re.sub(
    r'(?i)not just [^,]+,?(?:\s*but\s+|\s*but\s+also\s+)it is (\S+)',
    lambda m: f"constitutes {m.group(1)}",
    text
)

# 11. "not simply X but Y" → "constitutes Y"
text = re.sub(
    r'(?i)not simply [^,]+,?(?:\s*but\s+|\s*but\s+also\s+)it is (\S+)',
    lambda m: f"constitutes {m.group(1)}",
    text
)

# 12. "not an accident; it is Y" → "constitutes Y"
text = re.sub(
    r'(?i)not an accident[^;]*; it is (\S+)',
    lambda m: f"constitutes {m.group(1)}",
    text
)

# 13. "not a failure; it is Y" → "constitutes Y"
text = re.sub(
    r'(?i)not a failure[^;]*; it is (\S+)',
    lambda m: f"constitutes {m.group(1)}",
    text
)

# 14. "not an accident of history. It is Y" → "constitutes Y"
text = re.sub(
    r'(?i)not an accident of history[^.]*\. It is (\S+)',
    lambda m: f"constitutes {m.group(1)}",
    text
)

# 15. "not a side effect" / "not accidental" → direct
# "X is structural, not accidental" → "X is structural"
text = re.sub(
    r'(?i), not accidental\.',
    r'.',
    text
)

# 16. "More than just X" → "Beyond X" or direct
# This needs context - skip for now, handle manually

# 17. "not merely X, it was Y" → "constituted Y"
text = re.sub(
    r'(?i)not merely [^,]+, it was (\S+)',
    lambda m: f"constituted {m.group(1)}",
    text
)

# 18. "not merely X. It was Y" → "constituted Y"
text = re.sub(
    r'(?i)not merely [^.]+\. It was (\S+)',
    lambda m: f"constituted {m.group(1)}",
    text
)

# 19. "not merely X; it constitutes Y" → "constitutes Y"
text = re.sub(
    r'(?i)not merely [^;]+; it constitutes (\S+)',
    lambda m: f"constitutes {m.group(1)}",
    text
)

# 20. "not merely X, but Y" (without "it is")
# "The act was not merely symbolic; it was constitutional" → "The act constituted a constitutional"
# Actually let's handle specific common patterns:

# 21. "X was not merely Y; it was Z" → "X constituted Z"
text = re.sub(
    r'(?i)([A-Z][a-z]+(?:\s+[a-z]+){0,6}) was not merely [^;]+; it was (\S+)',
    lambda m: f"{m.group(1)} constituted {m.group(2)}",
    text
)

# 22. "X is not merely Y; it is Z" → "X constitutes Z" 
text = re.sub(
    r'(?i)([A-Z][a-z]+(?:\s+[a-z]+){0,6}) is not merely [^;]+; it is (\S+)',
    lambda m: f"{m.group(1)} constitutes {m.group(2)}",
    text
)

# 23. "X does not merely Y; it Z" → "X Z"
text = re.sub(
    r'(?i)([A-Z][a-z]+(?:\s+[a-z]+){0,6}) does not merely [^;]+; it (\w+)',
    lambda m: f"{m.group(1)} {m.group(2)}",
    text
)

# 24. "X did not merely Y; it Z" → "X Z"
text = re.sub(
    r'(?i)([A-Z][a-z]+(?:\s+[a-z]+){0,6}) did not merely [^;]+; it (\w+)',
    lambda m: f"{m.group(1)} {m.group(2)}",
    text
)

# Save
with open(TEX_PATH, "w", encoding="utf-8") as f:
    f.write(text)

# Verify remaining instances
remaining = []
for i, line in enumerate(text.split("\n"), 1):
    if re.search(r'(?i)not merely|not just.*it is|not simply.*it is|not an accident.*it is|not a failure.*it is|does not merely.*it|did not merely.*it|was not merely.*it|is not merely.*it|are not merely.*it|were not merely.*it|More than just', line):
        remaining.append((i, line.strip()[:200]))

print(f"Remaining instances: {len(remaining)}")
for ln, content in remaining[:30]:
    print(f"  Line {ln}: {content}")
