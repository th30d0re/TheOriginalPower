from pathlib import Path

src = Path('/Users/emmanuel/Documents/Theory/Redefining_racism/Paper/The_Original_Power.tex')
out = Path('/Users/emmanuel/Documents/Theory/Redefining_racism/rhetorical_patches/chunk_01.tex')

lines = src.read_text().splitlines(keepends=True)
text = ''.join(lines[:313])

replacements = [
    ("That overlap was not noise. It was the structural signature",
     "That overlap was the structural signature"),

    ("Its central claim is that racism cannot be reduced to a loose collection of bad attitudes or an inevitable expression of human nature. Racism functions as",
     "Its central claim is that racism functions as"),

    ("The claim concerns the equations rather than the units---society is measured in neither volts nor teslas; both electrodynamic",
     "The claim concerns the equations; the specific units are irrelevant to the homology. Both electrodynamic"),

    ("the Elite ($E$) do not \\textit{supply} the energy that drives this system. They \\textit{gate} it.",
     "the Elite ($E$) \\textit{gate} the energy that drives this system."),

    ("This means the architecture is not powered by independent Elite energy; it is powered by",
     "This means the architecture is powered by"),

    ("an outgroup is a group to which the person does not belong or with which the person does not identify",
     "an outgroup is a group outside the one to which the person belongs or with which the person identifies"),

    ("The brain is a predictive, pattern-compressing neural network optimized for survival under uncertainty, not a neutral database optimized for truth under adversarial input.",
     "The brain is a predictive, pattern-compressing neural network optimized for survival under uncertainty; it prioritizes survival under uncertainty over neutral truth-tracking under adversarial input."),

    ("It is a ``mind virus'' because the legal code does not remain outside the person.",
     "It is a ``mind virus'' because the legal code enters the person."),

    ("These are structural positions, not moral identities or biological categories; a person can be advantaged along one axis and subordinated along another.",
     "These are structural positions; a person can be advantaged along one axis and subordinated along another."),

    ("arrangement as a 3-D pyramid rather than a flat 2-D triangle, the Tri-Modal",
     "arrangement as a 3-D pyramid that captures structure the flat 2-D triangle misses, the Tri-Modal"),

    ("The five-tier\narchitecture is therefore not an imposed theoretical preference. It is the\nminimum configuration",
     "The five-tier\narchitecture is therefore the\nminimum configuration"),

    ("in which you do not know which tier you will occupy",
     "in which your tier is hidden from you"),

    ("but its use\nhere is diagnostic rather than prescriptive.",
     "but its use\nhere is diagnostic, with no prescriptive aim."),

    ("This expansion shows that oppressive systems do not ultimately serve the nominal In-group. They serve an Elite class ($E \\subset I$) that uses division to prevent solidarity.",
     "This expansion shows that oppressive systems ultimately serve an Elite class ($E \\subset I$) that uses division to prevent solidarity; the nominal In-group receives only derivative protection."),

    ("The formal claims in this book are not left as unanchored abstractions.",
     "The formal claims in this book are anchored to reproducible evidence."),

    ("Ordinal composite scoring is not a methodological novelty introduced by this framework. It is the standard instrument",
     "Ordinal composite scoring is the standard instrument"),

    ("They are not chosen for rhetorical convenience: they are the only two events in the 1450--2026 dataset that satisfy all three conditions for $\\rho_\\tau = 1.0$---cross-racial or system-wide kinetic mobilisation, documented structural counter-response, and a measurable, durable change in the system's institutional architecture---simultaneously.",
     "They are the only two events in the 1450--2026 dataset that satisfy all three conditions for $\\rho_\\tau = 1.0$---cross-racial or system-wide kinetic mobilisation, documented structural counter-response, and a measurable, durable change in the system's institutional architecture---simultaneously, so their selection is forced by the data."),
]

for old, new in replacements:
    if old not in text:
        print(f"Warning: pattern not found: {old[:80]!r}")
    else:
        text = text.replace(old, new)

out.write_text(text)
print(f"Wrote {out}")
