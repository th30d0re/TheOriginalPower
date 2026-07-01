#!/usr/bin/env python3
"""Apply rhetorical-constraint edits to chunk_09 of The_Original_Power.tex."""

from pathlib import Path

src = Path('/tmp/chunk_09_orig.tex')
txt = src.read_text(encoding='utf-8')

# Ordered plain-string replacements.
replacements = [
    # Paragraph around l.6168: multiple corrective contrasts and clichés
    (
        'Crucially, the two-party architecture was not an accidental byproduct of democratic experimentation; it was \\textit{theorized at the founding}. The Framers---themselves members of or proxies for $E$---actively debated the inevitability and utility of factional competition. James Madison\'s \\textit{Federalist No.~10} explicitly argued that a large republic could \\textit{manage} factions rather than eliminate them, channeling popular discontent into competing camps that would neutralize each other. George Washington\'s Farewell Address (1796) warned against the ``spirit of party\'\' even as the Elite had already engineered the Federalist/Anti-Federalist split that would calcify into the two-party system. The Framers did not stumble into Tweedism; they pre-compiled it. They theorized the edge cases---what happens when the poor gain the vote, when factions align against capital---and architected a system robust enough to absorb those shocks. This is why the Elite were able to so seamlessly scale the Puppet Class in the 19th century: the two-party front-end was not a patch; it was a planned upgrade, its logic embedded in the constitutional source code from the beginning.',
        'The two-party architecture was \\textit{theorized at the founding}. The Framers---themselves members of or proxies for $E$---actively debated the inevitability and utility of factional competition. James Madison\'s \\textit{Federalist No.~10} explicitly argued that a large republic could \\textit{manage} factions by channeling popular discontent into competing camps that would neutralize each other. George Washington\'s Farewell Address (1796) warned against the ``spirit of party\'\' even as the Elite had already engineered the Federalist/Anti-Federalist split that would calcify into the two-party system. The Framers pre-compiled Tweedism. They theorized the edge cases---what happens when the poor gain the vote, when factions align against capital---and architected a system to absorb those shocks. This is why the Elite were able to so seamlessly scale the Puppet Class in the 19th century: the two-party front-end was a planned upgrade, its logic embedded in the constitutional source code from the beginning.',
    ),
    # "Instead" as corrective/sequential
    (
        'The Elite could not revert to the old rule of ``only landowners vote.\'\' Instead, they radically upgraded',
        'The Elite could not revert to the old rule of ``only landowners vote.\'\' They radically upgraded',
    ),
    # "merely permitted"
    (
        'The electorate is merely permitted to choose',
        'The electorate is permitted to choose',
    ),
    # did not disappear / merely migrated
    (
        'But the architecture it pioneered---making the general election irrelevant by controlling the selection process that precedes it---did not disappear. It merely migrated from racial exclusion to financial exclusion: the Green Primary replaced the White Primary.',
        'The architecture it pioneered---making the general election irrelevant by controlling the selection process that precedes it---survived. It migrated from racial exclusion to financial exclusion: the Green Primary replaced the White Primary.',
    ),
    # not written to describe... It was written to prove
    (
        'Their result was not written to describe American racial extraction. It was written to prove that, under weak structural assumptions, a small set of stationary ``leaders\'\' can drive an entire follower population into an arbitrarily narrow region of state space and hold them there---with the convergence guaranteed by Mittag-Leffler stability of the governing fractional-order dynamics.',
        'Their result proved that, under weak structural assumptions, a small set of stationary ``leaders\'\' can drive an entire follower population into an arbitrarily narrow region of state space and hold them there---with the convergence guaranteed by Mittag-Leffler stability of the governing fractional-order dynamics.',
    ),
    # Colorism is not a separate phenomenon
    (
        'Colorism is not a separate phenomenon from redlining; both are edges of the same rooted tree, executing the same parent-to-child command at different depths.',
        'Colorism and redlining are edges of the same rooted tree, executing the same parent-to-child command at different depths.',
    ),
    # edge set is not fixed
    (
        'The innovation of \\cite{kan_containment} is that the edge set is \\textit{not fixed}.',
        'The innovation of \\cite{kan_containment} is a time-varying edge set.',
    ),
    # Solidarity is not a static property
    (
        'Solidarity is not a static property of shared material interest; it is an \\textit{edge} in a communication graph, and the edge exists only when the parties\' identity-states are within $\\delta$ of each other.',
        'Solidarity functions as an \\textit{edge} in a communication graph; the edge exists when the parties\' identity-states are within $\\delta$ of each other.',
    ),
    # not anomalies / they are predicted upward excursions
    (
        'The CIO\'s cross-racial organizing drives of the 1930s, the New Deal labor concessions, the 1960s Great Society programs, and the post-WWII peak of labor\'s share of national income are not anomalies the model must explain away. They are the predicted upward excursions visible in the Lyapunov ceiling figure (Figure~\\ref{fig:lyapunov_ceiling}):',
        'The CIO\'s cross-racial organizing drives of the 1930s, the New Deal labor concessions, the 1960s Great Society programs, and the post-WWII peak of labor\'s share of national income constitute the predicted upward excursions visible in the Lyapunov ceiling figure (Figure~\\ref{fig:lyapunov_ceiling}):',
    ),
    # convergence is not contingent; it is the steady state
    (
        'No follower trajectory escapes this hull. The convergence is not contingent on Elite intention after the fact; it is the steady state of the control law.',
        'No follower trajectory escapes this hull. The convergence is the steady state of the control law.',
    ),
    # substitution was not organic. It was engineered
    (
        'The substitution was not organic. It was engineered by $P_{\\text{uppet}}$ and adjacent media systems through four documented channels:',
        'The substitution was engineered by $P_{\\text{uppet}}$ and adjacent media systems through four documented channels:',
    ),
    # Crucially, the harms
    (
        'Crucially, the harms carried by these axes are real.',
        'The harms carried by these axes are real.',
    ),
    # not merely a Variable Swap; it was a structural upgrade
    (
        'The response was \\textit{not} merely a Variable Swap on the race axis; it was a structural upgrade to multi-axis phase injection.',
        'The response was a structural upgrade to multi-axis phase injection.',
    ),
    # However, the advent of digital crowdsourcing
    (
        'However, the advent of digital crowdsourcing introduced a critical system anomaly:',
        'The advent of digital crowdsourcing introduced a critical system anomaly:',
    ),
    # most insidious feature
    (
        'The most insidious feature of the Predatory Min-Max Function is how it handles the anomaly after the threat has been blocked.',
        'A defining feature of the Predatory Min-Max Function is how it handles the anomaly after the threat has been blocked.',
    ),
    # Instead, the system executed Political Capture
    (
        'Instead, the system executed \\textit{Political Capture}.',
        'The system executed \\textit{Political Capture}.',
    ),
    # not a glitch; it is a carefully managed feature
    (
        'Upward mobility from $O_{\\text{racialized}}$ to $E$ is not a glitch in the system; it is a carefully managed feature we define as \\textit{Conditional Assimilation}.',
        'Upward mobility from $O_{\\text{racialized}}$ to $E$ is a carefully managed feature we define as \\textit{Conditional Assimilation}.',
    ),
    # However, the most common pathway / not passive tokenism; it is active service
    (
        'However, the most common pathway into $E_{\\text{conditional}}$ is not passive tokenism; it is \\textit{active service to the extraction kernel}.',
        'The most common pathway into $E_{\\text{conditional}}$ is \\textit{active service to the extraction kernel}.',
    ),
    # not censorship but capture
    (
        'The Elite\'s response was not censorship but \\textit{capture}.',
        'The Elite\'s response was \\textit{capture}.',
    ),
    # not by a lack of numbers, but by
    (
        'The electorate is mathematically defeated not by a lack of numbers, but by the sequential manipulation of their divided interests.',
        'The electorate is mathematically defeated by the sequential manipulation of their divided interests.',
    ),
    # not by superior military force but by
    (
        'the defeat of Reconstruction-era cross-racial labor coalitions was accomplished not by superior military force but by the Elite\'s successful reinvestment of the psychological wage',
        'the defeat of Reconstruction-era cross-racial labor coalitions was accomplished through the Elite\'s successful reinvestment of the psychological wage',
    ),
    # issue is not X but how
    (
        'The issue is not the belief system itself, but how $P_{\\text{uppet}}$ utilizes it to deflect criticism of elite behavior.',
        'The issue is how $P_{\\text{uppet}}$ utilizes the belief system to deflect criticism of elite behavior.',
    ),
    # ceases to be a threat and instead becomes
    (
        'The moment a critique shifts into blaming an entire demographic or identity group, it ceases to be a threat to the Elite and instead becomes a tool that ultimately protects the very systems being criticized.',
        'The moment a critique shifts into blaming an entire demographic or identity group, it becomes a tool that ultimately protects the very systems being criticized.',
    ),
    # robust to partial dismantling
    (
        'The suppression envelope\'s redundancy is what makes the system robust to partial dismantling',
        'The suppression envelope\'s redundancy makes the system stable under partial dismantling',
    ),
    # surface signature changes; the payload does not
    (
        'The surface signature changes; the payload does not.',
        'The surface signature changes; the payload remains invariant.',
    ),
    # alignment, not citizen preference itself, drives
    (
        'When their preferences align, policy changes occur---but Gilens and Page show that this alignment, not citizen preference itself, drives the outcome.',
        'When their preferences align, policy changes occur---but Gilens and Page show that this alignment drives the outcome.',
    ),
    # immigration restriction debates routing ... onto immigrant rather than capital
    (
        'Anti-busing campaigns; immigration restriction debates routing white working-class grievance onto immigrant rather than capital',
        'Anti-busing campaigns; immigration restriction debates routing white working-class grievance onto immigrant groups and away from capital',
    ),
    # disability as medical category rather than class position
    (
        'ADA framing as individual accommodation rather than structural labor right; disability as medical category rather than class position',
        'ADA framing as individual accommodation, displacing the structural labor right; disability framed as a medical category, removing it from the class position',
    ),
    # threat to the family rather than a labor-class alignment
    (
        'framing feminist gains as a threat to the family rather than a labor-class alignment.',
        'framing feminist gains as a threat to the family, which moved the issue away from labor-class alignment.',
    ),
    # anti-communism rather than anti-extraction
    (
        'routed evangelical working-class political energy through abortion, school prayer, and anti-communism rather than anti-extraction.',
        'routed evangelical working-class political energy through abortion, school prayer, and anti-communism, diverting it from anti-extraction frames.',
    ),
    # toward O_racialized rather than E's real estate
    (
        'routed white working-class grievance toward $O_{\\text{racialized}}$ rather than $E$\'s real estate and banking interests that had enforced segregation.',
        'routed white working-class grievance toward $O_{\\text{racialized}}$, diverting it from $E$\'s real estate and banking interests that had enforced segregation.',
    ),
    # Each reform is a descent direction... does not permit reforms that increase V; permits only those that decrease it
    (
        'Each reform \\textit{is} a descent direction of $\\varphi_i$---which is precisely why it gets absorbed. The system does not permit reforms that increase $V$; by construction, it permits only those that decrease it.',
        'Each reform \\textit{is} a descent direction of $\\varphi_i$---which is why it gets absorbed. The control law permits only reforms that decrease $V$.',
    ),
]

for old, new in replacements:
    count = txt.count(old)
    if count == 0:
        print(f'WARNING: pattern not found: {old[:80]}...')
    else:
        txt = txt.replace(old, new)
        print(f'Replaced {count} occurrence(s): {old[:60]}...')

out = Path('/Users/emmanuel/Documents/Theory/Redefining_racism/rhetorical_patches/chunk_09.tex')
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(txt, encoding='utf-8')
print(f'Wrote {out} ({out.stat().st_size} bytes)')
