#!/usr/bin/env python3
"""Second-pass rhetorical edits for chunk_09."""

from pathlib import Path

src = Path('/Users/emmanuel/Documents/Theory/Redefining_racism/rhetorical_patches/chunk_09.tex')
txt = src.read_text(encoding='utf-8')

replacements = [
    # 1. robust across methodological variations
    (
        'the core finding (near-zero median voter independent effect) is robust across methodological variations documented in the political science literature.',
        'the core finding (near-zero median voter independent effect) is stable across methodological variations documented in the political science literature.',
    ),
    # 2. However, this ascension is not accompanied by true, unrestrained autonomy.
    (
        'When an individual from the Out-group acquires extreme capital, they are absorbed into a probationary tier of the Elite ($E_{\\text{conditional}}$). However, this ascension is not accompanied by true, unrestrained autonomy.',
        'When an individual from the Out-group acquires extreme capital, they are absorbed into a probationary tier of the Elite ($E_{\\text{conditional}}$). This ascension carries strict, unwritten limits.',
    ),
    # 3. However, rather than maintaining focus... he fell into
    (
        'Ye gestured at real critiques of elite power, media consolidation, and the role of ethno-religious state influence. However, rather than maintaining focus on the structural mechanics of extraction, he fell into what political theorists define as the ``socialism of fools\'\'---redirecting a valid critique of state power and elite networks into generalized, conspiratorial blame against an entire identity group.',
        'Ye gestured at real critiques of elite power, media consolidation, and the role of ethno-religious state influence, then lost focus on the structural mechanics of extraction and fell into what political theorists define as the ``socialism of fools\'\'---redirecting a valid critique of state power and elite networks into generalized, conspiratorial blame against an entire identity group.',
    ),
    # 4. However, when an anomaly like Ye uses broad bigotry...
    (
        'Cases like the Epstein network (analyzed in Section~6.15) definitively prove that elite networks do engage in coordinated, systemic wrongdoing while successfully evading carceral accountability. However, when an anomaly like Ye uses broad bigotry to explain these power dynamics, it mathematically weakens the argument.',
        'Cases like the Epstein network (analyzed in Section~6.15) definitively prove that elite networks do engage in coordinated, systemic wrongdoing while successfully evading carceral accountability. When an anomaly like Ye uses broad bigotry to explain these power dynamics, it mathematically weakens the argument.',
    ),
    # 5. Instead, the Elite substituted (in caption)
    (
        'When the Church Committee (1971) exposed COINTELPRO and raised the legitimacy cost of kinetic repression $R(t)$, the system did not destabilize. Instead, the Elite substituted: $\\Phi_{\\text{load}}$ rose sharply via multi-axis identity fragmentation, and $\\psi_s$ rose via the Southern Strategy\'s escalation of racial status wages.',
        'When the Church Committee (1971) exposed COINTELPRO and raised the legitimacy cost of kinetic repression $R(t)$, the system absorbed the shock by substituting within the suppression envelope: $\\Phi_{\\text{load}}$ rose sharply via multi-axis identity fragmentation, and $\\psi_s$ rose via the Southern Strategy\'s escalation of racial status wages.',
    ),
    # 6. class-band coherence breach rather than a full-signal breach
    (
        'The collapse condition is now a \\textit{class-band} coherence breach rather than a full-signal breach:',
        'The collapse condition now applies to the \\textit{class-band} coherence only:',
    ),
    # 7. routing feminist movement ... rather than labor alignment
    (
        'Anti-ERA campaigns (1972--1982); ``war on men\'\' media narratives; routing feminist movement into liberal corporate track rather than labor alignment \\\\',
        'Anti-ERA campaigns (1972--1982); ``war on men\'\' media narratives; routing feminist movement into the liberal corporate track, away from labor alignment \\\\',
    ),
    # 8. toward anti-abortion/anti-homosexuality rather than anti-extraction
    (
        'Moral Majority (1979); evangelical mobilization routing working-class religious subgroups toward anti-abortion/anti-homosexuality rather than anti-extraction \\\\',
        'Moral Majority (1979); evangelical mobilization routing working-class religious subgroups toward anti-abortion/anti-homosexuality, diverting them from anti-extraction frames \\\\',
    ),
    # 9. partial substitution rather than strict complementarity
    (
        'The suppression envelope $\\Sigma_{\\text{sup}}(t) = \\psi_s(t) + \\psi_m(t) + R(t) + \\Phi_{\\text{load}}(t)$ operates through partial substitution rather than strict complementarity: the components act as \\textbf{partial substitutes}:',
        'The suppression envelope $\\Sigma_{\\text{sup}}(t) = \\psi_s(t) + \\psi_m(t) + R(t) + \\Phi_{\\text{load}}(t)$ operates through partial substitution among components that act as \\textbf{partial substitutes}:',
    ),
    # 10. peaks at edge of grid rather than at genuine spectral peak
    (
        'indicating that the periodogram power peaks at the edge of the frequency grid rather than\nat a genuine spectral peak.',
        'indicating that the periodogram power peaks at the edge of the frequency grid, the signature of a boundary artifact.',
    ),
    # 11. theoretically meaningful finding rather than methodological artefact
    (
        'This divergence constitutes a theoretically meaningful finding rather than a methodological artefact.',
        'This divergence is a theoretically meaningful finding.',
    ),
    # 12. total search volume rises rather than redistributing
    (
        'The post-2008 social-media era in particular breaks the closed-system assumption: class\nand identity signals can co-spike during compound crises (2020 is the clearest example),\nso the total search volume rises rather than redistributing.',
        'The post-2008 social-media era in particular breaks the closed-system assumption: class\nand identity signals can co-spike during compound crises (2020 is the clearest example),\nso total search volume rises across both bands.',
    ),
    # 13. inevitable rather than engineered
    (
        'to view interpersonal violence as inevitable rather than engineered, and to direct collective energy toward individual consumption rather than structural critique.',
        'to view interpersonal violence as an inherent feature of their conditions, obscuring its engineered origins, and to direct collective energy toward individual consumption, displacing structural critique.',
    ),
]

for old, new in replacements:
    count = txt.count(old)
    if count == 0:
        print(f'WARNING: pattern not found: {old[:80]}...')
    else:
        txt = txt.replace(old, new)
        print(f'Replaced {count} occurrence(s): {old[:60]}...')

src.write_text(txt, encoding='utf-8')
print(f'Wrote {src} ({src.stat().st_size} bytes)')
