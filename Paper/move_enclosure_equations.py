#!/usr/bin/env python3
"""
Move eq:1.1-enclosure-score and eq:1.2-total-enclosure from Chapter 0 to Chapter 1.
"""

with open('The_Mathematics_of_Oppression.tex', 'r') as f:
    content = f.read()

# The text block to extract from Chapter 0 and move to Chapter 1
old_ch0_block = """The composite Enclosure Score is the apparent-power magnitude of this
decomposition---the electrodynamic analogue of total apparent power
$S = \\sqrt{P^2 + Q^2}$:
\\begin{equation}\\label{eq:1.1-enclosure-score}
\\mathcal{S}_{\\text{enc}} = \\frac{1}{\\sqrt{2}}\\sqrt{\\,\\mathcal{S}_{\\text{mat}}^{2} + \\mathcal{S}_{\\text{psych}}^{2}\\,} = \\frac{1}{\\sqrt{2}}\\sqrt{\\left(\\frac{e_1 + e_2}{2}\\right)^{\\!2} + e_3^{2}}
\\end{equation}

\\noindent\\textit{Electrodynamic weighting.}\\footnote{This equation is classified as Tier~3 (ordinal/structural); the electrodynamic weighting derives from the AC power analogy (real power = material extraction, reactive power = psychological deflection). The normalization factor $1/\\sqrt{2}$ ensures $\\mathcal{S}_{\\text{enc}} \\in [0,1]$. See the Empirical Methodology chapter (p.~\\pageref{ch:empirical_methodology}) and Appendix~\\ref{app:empirical_index} for the full per-equation index.} Material enclosure ($\\mathcal{S}_{\\text{mat}}$) is the ``real power'' channel: it performs direct economic work by destroying communal infrastructure and blocking mobility. Psychological enclosure ($\\mathcal{S}_{\\text{psych}}$) is the ``reactive power'' channel: it does zero direct work (the cross product $\\vec{v} \\times \\vec{B}$ is always orthogonal to velocity), but it is the enabling condition without which material enclosure cannot be maintained. The square-root formulation naturally gives $e_3$ higher effective weight because a population that cannot perceive its enclosure cannot coordinate to escape it, rendering $e_1$ and $e_2$ interventions structurally insufficient regardless of their magnitude.

For a generalized Out-group $O$, domination loads \\textit{all three} enclosure
modes simultaneously:

\\begin{enumerate}
    \\item \\textbf{Communal Capacity} ($e_1$): the obstruction of internal
    economic, social, educational, kinship, and mutual-aid infrastructure.

    \\item \\textbf{Geographic/Economic Mobility} ($e_2$): the obstruction of
    external movement, market access, property access, employment pathways, and
    the ability to exit the local control field.

    \\item \\textbf{Psychological/Epistemic Autonomy} ($e_3$): the obstruction of
    the population's capacity to name the enclosure, model its contingency, and
    perceive the architecture rather than only its local symptoms.
\\end{enumerate}

When all three modes are driven toward complete obstruction, the system
approaches total enclosure:
\\begin{equation}\\label{eq:1.2-total-enclosure}
\\mathcal{S}_{\\text{enc}}(O) = \\frac{1}{\\sqrt{2}}\\sqrt{\\left(\\frac{1+1}{2}\\right)^{\\!2} + 1^{2}} = \\frac{1}{\\sqrt{2}}\\sqrt{1 + 1} = 1.0 \\quad \\text{(Absolute Subjugation)}
\\end{equation}

This metric\\footnote{This equation is classified as Tier~3 (ordinal/structural); the total-enclosure limiting case ($e_1 = e_2 = e_3 = 1$) is a structural benchmark, not a claim of exact calibration. Its empirical status is defended in the Empirical Methodology chapter (p.~\\pageref{ch:empirical_methodology}). See Appendix~\\ref{app:empirical_index} for the full per-equation index.} explains why isolated reforms fail. A policy that partially improves external mobility while leaving internal destruction and epistemic erasure intact only lowers one channel of the enclosure score. The subject remains enclosed. The Predatory Min-Max Function requires $\\mathcal{S}_{\\text{enc}} \\rightarrow 1.0$ to ensure maximum extraction with minimum friction.

Geometrically,"""

new_ch0_block = """The formal definitions of the Enclosure Score and the absolute-subjugation limit appear in Equations~\\ref{eq:1.1-enclosure-score} and~\\ref{eq:1.2-total-enclosure} below. Geometrically,"""

if old_ch0_block not in content:
    print("ERROR: Could not find the enclosure block in Chapter 0")
    exit(1)

content = content.replace(old_ch0_block, new_ch0_block)
print("Replaced enclosure block in Chapter 0")

# Now insert the block into Chapter 1, right after the Tri-Modal Enclosure Model reference
ch1_insert_point = """The Tri-Modal Enclosure Model ($\\mathcal{S}_{\\text{enc}}$,
Section~\\ref{sec:trimodal}) is developed in Chapter~\\ref{ch:system_init}. In
this chapter, racism supplies the first empirical specialization: the general
Out-group $O$ becomes $O_{\\text{racialized}}$, and each enclosure mode is loaded
with historically specific racial mechanisms.

\\section{The In-Group/Out-Group Binary as a Coarse Projection}"""

new_ch1_block = """The Tri-Modal Enclosure Model ($\\mathcal{S}_{\\text{enc}}$,
Section~\\ref{sec:trimodal}) is developed in Chapter~\\ref{ch:system_init}. In
this chapter, racism supplies the first empirical specialization: the general
Out-group $O$ becomes $O_{\\text{racialized}}$, and each enclosure mode is loaded
with historically specific racial mechanisms.

\\begin{equation}\\label{eq:1.1-enclosure-score}
\\mathcal{S}_{\\text{enc}} = \\frac{1}{\\sqrt{2}}\\sqrt{\\,\\mathcal{S}_{\\text{mat}}^{2} + \\mathcal{S}_{\\text{psych}}^{2}\\,} = \\frac{1}{\\sqrt{2}}\\sqrt{\\left(\\frac{e_1 + e_2}{2}\\right)^{\\!2} + e_3^{2}}
\\end{equation}

\\noindent\\textit{Electrodynamic weighting.}\\footnote{This equation is classified as Tier~3 (ordinal/structural); the electrodynamic weighting derives from the AC power analogy (real power = material extraction, reactive power = psychological deflection). The normalization factor $1/\\sqrt{2}$ ensures $\\mathcal{S}_{\\text{enc}} \\in [0,1]$. See the Empirical Methodology chapter (p.~\\pageref{ch:empirical_methodology}) and Appendix~\\ref{app:empirical_index} for the full per-equation index.} Material enclosure ($\\mathcal{S}_{\\text{mat}}$) is the ``real power'' channel: it performs direct economic work by destroying communal infrastructure and blocking mobility. Psychological enclosure ($\\mathcal{S}_{\\text{psych}}$) is the ``reactive power'' channel: it does zero direct work (the cross product $\\vec{v} \\times \\vec{B}$ is always orthogonal to velocity), but it is the enabling condition without which material enclosure cannot be maintained. The square-root formulation naturally gives $e_3$ higher effective weight because a population that cannot perceive its enclosure cannot coordinate to escape it, rendering $e_1$ and $e_2$ interventions structurally insufficient regardless of their magnitude.

For a generalized Out-group $O$, domination loads \\textit{all three} enclosure
modes simultaneously:

\\begin{enumerate}
    \\item \\textbf{Communal Capacity} ($e_1$): the obstruction of internal
    economic, social, educational, kinship, and mutual-aid infrastructure.

    \\item \\textbf{Geographic/Economic Mobility} ($e_2$): the obstruction of
    external movement, market access, property access, employment pathways, and
    the ability to exit the local control field.

    \\item \\textbf{Psychological/Epistemic Autonomy} ($e_3$): the obstruction of
    the population's capacity to name the enclosure, model its contingency, and
    perceive the architecture rather than only its local symptoms.
\\end{enumerate}

When all three modes are driven toward complete obstruction, the system
approaches total enclosure:
\\begin{equation}\\label{eq:1.2-total-enclosure}
\\mathcal{S}_{\\text{enc}}(O) = \\frac{1}{\\sqrt{2}}\\sqrt{\\left(\\frac{1+1}{2}\\right)^{\\!2} + 1^{2}} = \\frac{1}{\\sqrt{2}}\\sqrt{1 + 1} = 1.0 \\quad \\text{(Absolute Subjugation)}
\\end{equation}

This metric\\footnote{This equation is classified as Tier~3 (ordinal/structural); the total-enclosure limiting case ($e_1 = e_2 = e_3 = 1$) is a structural benchmark, not a claim of exact calibration. Its empirical status is defended in the Empirical Methodology chapter (p.~\\pageref{ch:empirical_methodology}). See Appendix~\\ref{app:empirical_index} for the full per-equation index.} explains why isolated reforms fail. A policy that partially improves external mobility while leaving internal destruction and epistemic erasure intact only lowers one channel of the enclosure score. The subject remains enclosed. The Predatory Min-Max Function requires $\\mathcal{S}_{\\text{enc}} \\rightarrow 1.0$ to ensure maximum extraction with minimum friction.

\\section{The In-Group/Out-Group Binary as a Coarse Projection}"""

if ch1_insert_point not in content:
    print("ERROR: Could not find Chapter 1 insertion point")
    exit(1)

content = content.replace(ch1_insert_point, new_ch1_block)
print("Inserted enclosure block into Chapter 1")

with open('The_Mathematics_of_Oppression.tex', 'w') as f:
    f.write(content)

print("Done")
