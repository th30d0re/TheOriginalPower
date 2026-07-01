#!/usr/bin/env python3
"""Generate annotated JSON for Chapter 12 (The Contradiction) equations."""

import json
import re
from pathlib import Path

SRC = Path("/Users/emmanuel/Documents/Theory/Redefining_racism/equation_audit_chunks/The_Contradiction_Why_Reform_Serves_the_Algorithm.json")
DST = Path("/Users/emmanuel/Documents/Theory/Redefining_racism/equation_analysis_chapter12_contradiction.json")

# Metadata keyed by equation id.
META = {
    "E133": {
        "local_rank": 4,
        "global_score": 8,
        "framework_model": "This equation models a policy reform as a decrement in the \\min resistance variable of the Predatory Min-Max Function, bleeding off Out-group pressure just enough to prevent the kinetic threshold from being reached while leaving the extraction kernel \\max intact.",
        "original_context": "This is an original formulation within the framework's theory of algorithmic extraction. It translates the sociological observation that concessions absorb dissent into a discrete update rule for class resistance.",
        "variables": "\\min(t): class resistance at time t; \\epsilon: marginal reduction in resistance produced by reform; O_{\\text{racialized}}: racialized Out-group; P': policy reform; \\Delta|...|: change in the size of the affected intersection."
    },
    "E134": {
        "local_rank": 2,
        "global_score": 9,
        "framework_model": "This equation states the Concession Theorem: the Elite permits reforms at a rate proportional to the threat level encoded in \\min, always calibrated to reset resistance without altering the extraction kernel \\max.",
        "original_context": "This is an original theorem within the framework. It formalizes a historical pattern in which concessions track rebellion threat rather than moral progress.",
        "variables": "\\text{Reform Rate}(t): rate of policy concession at time t; \\min: class resistance variable; \\max: extraction kernel; \\Delta\\max: change in extraction capacity."
    },
    "E135": {
        "local_rank": 7,
        "global_score": 7,
        "framework_model": "This equation expresses the algorithmic load-balancing constraint: total extraction yield across all demographic or jurisdictional groups equals the Elite's aggregate extraction target, which is non-decreasing over time.",
        "original_context": "The equation adapts the engineering concept of load balancing to demographic extraction. It treats freedom as a zero-sum market rationed across groups.",
        "variables": "G: set of demographic or jurisdictional groups; \\ell_g(t): extraction load assigned to group g at time t; \\mathcal{E}_{\\text{total}}(t): total extraction yield."
    },
    "E136": {
        "local_rank": 6,
        "global_score": 7,
        "framework_model": "This equation gives the mechanical basis of horizontal hostility: any reduction in extraction load on group g must be offset by an increased load on group h unless total extraction also falls.",
        "original_context": "This is an original structural equation within the framework. It formalizes the rerouting of extraction that follows partial reforms.",
        "variables": "\\Delta \\ell_h: change in load on group h; \\Delta \\ell_g: change in load on group g; \\Delta \\mathcal{E}_{\\text{total}}: change in total extraction."
    },
    "E137": {
        "local_rank": 11,
        "global_score": 6,
        "framework_model": "This equation models the judiciary as a discrimination detector that returns a positive signal only when a policy names race explicitly, returning zero for strongly race-correlated proxies.",
        "original_context": "The equation formalizes the intent standard of American constitutional discrimination doctrine, as articulated in Washington v. Davis and McCleskey v. Kemp.",
        "variables": "D(P): judicial detection output for policy P; P: policy or practice; x: proxy variable; \\operatorname{Corr}(x, \\text{race}): correlation between proxy and race."
    },
    "E138": {
        "local_rank": 10,
        "global_score": 7,
        "framework_model": "This equation asserts that the set of racialized people harmed by an explicit race policy and by a race-correlated proxy policy is approximately the same, so the proxy reproduces the racial partition while evading judicial detection.",
        "original_context": "The equivalence claim is original to the framework but is validated by Michelle Alexander's demonstration that the War on Drugs proxy achieved the same racial partition as Jim Crow's explicit targeting.",
        "variables": "O_{\\text{racialized}}: racialized Out-group; P_{\\text{explicit}}: policy explicitly naming race; P_{\\text{proxy}}: policy targeting a race-correlated proxy."
    },
    "E139": {
        "local_rank": 12,
        "global_score": 6,
        "framework_model": "This equation models the judiciary as a selectively routed compiler: it applies semantic formalism that ignores proxy discrimination in civil-rights and voting claims while applying historical-originalist analysis that recognizes kinetic rights in Second Amendment claims.",
        "original_context": "This is an original model within the framework. It synthesizes empirical judicial-politics research on ideological structure in Supreme Court opinions with the doctrine's asymmetry between civil rights and arms rights.",
        "variables": "P_{\\text{jud}}: judicial node/compiler; D_{\\text{sem}}: semantic detection function; D_{\\text{hist}}: historical detection function; P_{\\text{proxy}}: proxy policy; P_{\\text{kinetic}}: kinetic-rights policy."
    },
    "E140": {
        "local_rank": 14,
        "global_score": 5,
        "framework_model": "This equation makes the dual-track Second Amendment visible as a class-conditional function: identical firearm possession receives constitutional protection for the buffer class and felony prosecution for the racialized Out-group.",
        "original_context": "This is an original application of the framework to Second Amendment doctrine. It restates equal-protection analysis in the language of class-conditional response functions.",
        "variables": "\\text{Response}(\\text{arms}, x): legal response to arms possession by actor x; I_{\\text{buffer}}: buffer/intermediary class; O_{\\text{racialized}}: racialized Out-group."
    },
    "E141": {
        "local_rank": 15,
        "global_score": 5,
        "framework_model": "This equation models the grandfather clause as a terminal multiplicative factor in a compounding chain of racial exclusion, where each layer amplifies the burden on the racialized Out-group.",
        "original_context": "This is an original compounding model within the framework. It adapts the finance/economics concept of multiplicative growth factors to cumulative racial disadvantage.",
        "variables": "B(O_{\\text{racialized}}): cumulative burden on the racialized Out-group; \\delta_k: multiplicative burden increment from layer k."
    },
    "E142": {
        "local_rank": 1,
        "global_score": 10,
        "framework_model": "This equation states the non-kinetic half of the Haitian Theorem: every non-kinetic reform in the 1450-2026 dataset left the extraction kernel unchanged, confirming that reform operates as \\min-management within the algorithm.",
        "original_context": "This is an original theorem within the framework. It generalizes the historical finding that legislative and policy concessions preserve elite extraction capacity.",
        "variables": "\\mathcal{R}: set of non-kinetic reforms; R_i: a specific reform; \\Delta\\max(R_i): change in extraction kernel caused by reform R_i."
    },
    "E143": {
        "local_rank": 3,
        "global_score": 10,
        "framework_model": "This equation states the kinetic half of the Haitian Theorem: there exists at least one kinetic revolution that reduced the extraction kernel to zero within the liberated territory, establishing the only historically validated liberation mechanism in the dataset.",
        "original_context": "This is an original theorem within the framework. It identifies the Haitian Revolution as the anchor case of a total kernel override.",
        "variables": "K_j: a kinetic revolution; \\max(t_{\\text{post}}): extraction kernel after the revolution; \\text{(locally)}: within the geographic boundary of the liberated territory."
    },
    "E144": {
        "local_rank": 17,
        "global_score": 5,
        "framework_model": "This equation defines a Colonial-Extraction Intensity Index that combines the slave-to-free population ratio with the duration of extraction to measure the intensity of colonial extraction in a given territory.",
        "original_context": "The index is an original formulation within the framework. It operationalizes historical demographic data from the Hispaniola natural experiment.",
        "variables": "I_{\\text{colonial}}(c): colonial-extraction intensity for colony c; \\text{slave\\_count}(c): enslaved population; \\text{free\\_population}(c): free population; \\text{extraction\\_duration\\_yrs}(c): years of extraction."
    },
    "E145": {
        "local_rank": 16,
        "global_score": 5,
        "framework_model": "This equation predicts that modern per-capita GDP in a former colony decreases linearly with colonial-extraction intensity, with positive coefficient \\beta capturing the long-run economic damage of extraction.",
        "original_context": "This is a standard linear regression specification applied to the framework's colonial-intensity index. It tests the within-island prediction using 2023 GDP-per-capita data.",
        "variables": "\\text{GDP}_{pc,2023}(c): per-capita GDP in 2023 for colony c; \\alpha: intercept; \\beta: negative slope coefficient; I_{\\text{colonial}}(c): colonial-extraction intensity; \\varepsilon: error term."
    },
    "E146": {
        "local_rank": 18,
        "global_score": 5,
        "framework_model": "This equation predicts a terminal degraded equilibrium for Haiti in which the destruction of the local extraction kernel, the persistence of the global extraction kernel, and continuous external reimposition converge on failed-state dynamics.",
        "original_context": "This is an original equilibrium prediction within the framework. It applies the extraction architecture to Haiti's post-independence history of indemnity, intervention, and environmental degradation.",
        "variables": "O_{\\text{degraded}}: degraded Out-group state; \\text{Haiti}: case territory; t: time; \\text{failed-state equilibrium}: terminal political-economic state."
    },
    "E147": {
        "local_rank": 13,
        "global_score": 6,
        "framework_model": "This equation classifies revolutions into intra-Elite forks that change the control plane while preserving the extraction kernel and total overrides that terminate the kernel locally.",
        "original_context": "This is an original typology within the framework. It distinguishes the American Revolution from the Haitian Revolution on the basis of whether the extraction kernel survived.",
        "variables": "\\operatorname{Rev}(K): revolution type function; K: revolution; E_{\\text{global}} \\to E_{\\text{local}}: transfer of Elite control; K_{\\text{extract}} \\to 0: termination of extraction kernel."
    },
    "E148": {
        "local_rank": 19,
        "global_score": 5,
        "framework_model": "This equation defines the gendered Out-group as the set of people excluded from lethal autonomy on the basis of gender, treating gender as a second partition axis analogous to race.",
        "original_context": "The set definition is original to the framework's synthesis. It builds on Chapter 6's gendered-axis analysis and the historical restriction of arms-bearing and citizenship to men.",
        "variables": "O_{\\text{gendered}}: gendered Out-group; x: individual; \\text{Population}: total population; \\text{lethal autonomy}: capacity for armed self-defense."
    },
    "E149": {
        "local_rank": 20,
        "global_score": 5,
        "framework_model": "This equation identifies the intersection of racialized and gendered Out-groups as the locus of compounded extraction, where harms are not reducible to either axis alone.",
        "original_context": "This expression applies Kimberlé Crenshaw's intersectionality framework to the framework's partition architecture. It marks the precise set subject to multiplicative compounding.",
        "variables": "O_{\\text{racialized}}: racialized Out-group; O_{\\text{gendered}}: gendered Out-group; \\cap: set intersection."
    },
    "E150": {
        "local_rank": 8,
        "global_score": 7,
        "framework_model": "This equation models the effective capacity of an intersectional subject as the product of racial and gendered extraction coefficients, so compounding operates multiplicatively rather than additively.",
        "original_context": "This is an original equation within the framework. It applies the compounding model to Crenshaw's intersectionality insight and tests it against AAUW pay-gap data.",
        "variables": "O_t^{\\text{capacity}}: Out-group capacity at time t; O_{t-1}^{\\text{capacity}}: prior capacity; \\alpha_r: racialized extraction coefficient; \\alpha_g: gendered extraction coefficient; P_t: partition operator at time t."
    },
    "E151": {
        "local_rank": 5,
        "global_score": 8,
        "framework_model": "This equation states the kernel-deletion condition: the extraction kernel is eliminated after a liberation struggle if and only if every active partition operator across race, class, gender, and other axes has been neutralized.",
        "original_context": "This is an original synthesis condition within the framework. It formalizes the risk that deleting one partition axis leaves enough surviving structure for the algorithm to recompile.",
        "variables": "K_{\\text{post}}: post-struggle extraction kernel; \\mathcal{A}_{\\text{partition}}: set of partition axes; P_a: partition operator for axis a."
    },
    "E152": {
        "local_rank": 9,
        "global_score": 7,
        "framework_model": "This equation models the nonviolence mandate as a gaslighting operator that constrains the Out-group and buffer class to resistance modes guaranteed to leave the extraction kernel unchanged.",
        "original_context": "This is an original formulation within the framework. It formalizes the one-directional demand that subordinate groups resist only through petition, protest, and ballots.",
        "variables": "P_{\\text{gaslight}}^{\\text{nonviolence}}: nonviolence-mandate operator; O: Out-group; I_{\\text{buffer}}: buffer class; \\Delta\\max: change in extraction kernel."
    },
}


def strip_label(rendered: str) -> str:
    """Remove a leading \\label{...} line and any trailing comments."""
    # Remove leading \label{...} possibly followed by whitespace/newline.
    cleaned = re.sub(r"^\\label\{[^}]+\}\s*", "", rendered)
    # Remove trailing comments (percent sign to end of line) and trailing whitespace.
    cleaned = re.sub(r"\s*%.*$", "", cleaned, flags=re.MULTILINE)
    return cleaned.rstrip()


def main() -> None:
    data = json.loads(SRC.read_text(encoding="utf-8"))
    out = []
    for item in data:
        eq_id = item["id"]
        meta = META[eq_id]
        out.append({
            "id": eq_id,
            "label": item["label"],
            "equation": strip_label(item["rendered"]),
            "local_rank": meta["local_rank"],
            "global_score": meta["global_score"],
            "framework_model": meta["framework_model"],
            "original_context": meta["original_context"],
            "variables": meta["variables"],
        })

    # Validate local_rank uniqueness.
    ranks = [x["local_rank"] for x in out]
    assert len(ranks) == len(set(ranks)), "Duplicate local_rank values"
    assert sorted(ranks) == list(range(1, len(out) + 1)), "local_ranks must be 1..N"

    DST.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(out)} annotated equations to {DST}")


if __name__ == "__main__":
    main()
