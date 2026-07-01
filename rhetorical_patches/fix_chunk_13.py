from pathlib import Path

src = Path('/Users/emmanuel/Documents/Theory/Redefining_racism/Paper/The_Original_Power.tex')
out = Path('/Users/emmanuel/Documents/Theory/Redefining_racism/rhetorical_patches/chunk_13.tex')

lines = src.read_text(encoding='utf-8').splitlines(keepends=True)
chunk = ''.join(lines[11589:12887])

replacements = [
    # CRITICAL WARNING
    ("A ``solution'' that reduces $\\min$ (class resistance) without dismantling $\\max$ (extraction capacity) is not a solution---it is \\textbf{maintenance}.",
     "A ``solution'' that reduces $\\min$ (class resistance) without dismantling $\\max$ (extraction capacity) is \\textbf{maintenance}."),
    # uninstall routine
    ("A reform that makes the infected system feel less cruel while leaving the extraction kernel intact is not an uninstall routine. It is palliative maintenance for the host wetware, preserving legitimacy long enough for the virus to recompile around the patch.",
     "A reform that makes the infected system feel less cruel while leaving the extraction kernel intact is palliative maintenance for the host wetware, preserving legitimacy long enough for the virus to recompile around the patch."),
    # zip-code proxy
    ("The zip-code variable is not a proxy for race---it is a \\textit{fossil record}",
     "The zip-code variable functions as a \\textit{fossil record}"),
    # speculation
    ("This is not speculation. It is the historical record of the manuscript itself. It is also not an informal observation:",
     "This follows from the historical record of the manuscript itself. It also has a formal basis:"),
    # Lincoln
    ("Lincoln's executive order was not a moral epiphany; it was a military strategy to destabilize the Confederacy's labor base.",
     "Lincoln's executive order was a military strategy to destabilize the Confederacy's labor base."),
    # New Deal
    ("The New Deal was not a race-neutral recovery program with unfortunate gaps; it was a \\textit{racially partitioned material wage}:",
     "The New Deal operated as a \\textit{racially partitioned material wage}:"),
    # not only the racial one
    ("operates across \\textit{every} axis of the extraction architecture, not only the racial one.",
     "operates across \\textit{every} axis of the extraction architecture, including the racial one."),
    # reform kinetic threat
    ("A reform that requires continuous kinetic threat to maintain itself is not evidence of $\\Delta\\max \\neq 0$---it is evidence of the theorem's prediction that concessions track the threat level of $\\min$.",
     "A reform that requires continuous kinetic threat to maintain itself confirms the theorem's prediction that concessions track the threat level of $\\min$."),
    # neutral gifts
    ("The reforms were not neutral gifts; they were interface updates that increased the extraction architecture's long-run efficiency.",
     "The reforms were interface updates that increased the extraction architecture's long-run efficiency."),
    # durability objection
    ("The durability objection, properly analyzed, is not a counter-example to the theorem. It is the theorem's mechanism made visible:",
     "The durability objection, properly analyzed, exposes the theorem's mechanism:"),
    # navigate
    ("if a nation can navigate the transition from extractive to inclusive",
     "if a nation can complete the transition from extractive to inclusive"),
    # AJR
    ("The conclusion is not that AJR are wrong about what causes nations to fail. It is that their model lacks the variables required to write the patch.",
     "AJR's model identifies the causes of national failure accurately; it lacks the variables required to write the patch."),
    # Acemoglu Limit
    ("The Acemoglu Limit does not contest the Reversal of Fortune's empirical findings \\cite{ajr_reversal}. It contests the model's sufficiency as a patch specification.",
     "The Acemoglu Limit accepts the Reversal of Fortune's empirical findings \\cite{ajr_reversal} and contests the model's sufficiency as a patch specification."),
    # Acemoglu global refutation
    ("The Acemoglu Limit is therefore not a global refutation of AJR's empirical project. It is a \\textbf{scope condition}:",
     "The Acemoglu Limit is therefore a \\textbf{scope condition} of AJR's empirical project:"),
    # intent doctrine
    ("The intent doctrine does not fail to detect dog-whistle racism; it \\textit{succeeds at protecting it}.",
     "The intent doctrine \\textit{succeeds at protecting} dog-whistle racism."),
    # judiciary shield
    ("This section demonstrates that the judiciary provides a parallel shield at the constitutional level---not through malfunction, but through a jurisprudential architecture that is \\textit{structurally blind} to the exact form of racial targeting the political establishment has openly admitted to deploying.",
     "This section demonstrates that the judiciary provides a parallel shield at the constitutional level through a jurisprudential architecture that is \\textit{structurally blind} to the exact form of racial targeting the political establishment has openly admitted to deploying."),
    # judicial node blind
    ("The judicial node is therefore not blind. It is a semantic compiler that selectively loads different priors into public cognition.",
     "The judicial node is a semantic compiler that selectively loads different priors into public cognition."),
    # However Bruen
    ("However, the system's response reveals \\textit{Bruen} as algorithmic load-balancing, not liberation.",
     "The system's response reveals \\textit{Bruen} as algorithmic load-balancing that preserves the extraction kernel."),
    # Bruen crack
    ("\\textit{Bruen} is not a crack in the system; it is the system distributing its extraction load across two parallel processors.",
     "\\textit{Bruen} functions as the system distributing its extraction load across two parallel processors."),
    # Sullivan bug
    ("This is not a bug in the Sullivan Law framework; it is the feature.",
     "This is the designed feature of the Sullivan Law framework."),
    # constitutional bug
    ("This is not a bug in the constitutional framework. It is a \\textbf{feature} of the concealment apparatus.",
     "This is a \\textbf{feature} of the concealment apparatus."),
    # But mechanism
    ("But the \\textit{mechanism} by which those blue-state legislative responses actually achieve gradualist disarmament",
     "The \\textit{mechanism} by which those blue-state legislative responses actually achieve gradualist disarmament"),
    # disparate impact
    ("This is not a disparate-impact violation; it is a structural equality violation.",
     "This is a structural equality violation."),
    # May-issue
    ("May-issue was not a bug in the system; it was a feature --- the administrative interface through which the dual-track Second Amendment was operationalized.",
     "May-issue was the administrative interface through which the dual-track Second Amendment was operationalized."),
    # rather than property
    ("Members who had hardware were now fighting for an abstract principle---future buyers' rights---rather than their immediate property.",
     "Members who had hardware were now fighting for an abstract principle---future buyers' rights---with their immediate property no longer at stake."),
    # overreach
    ("The framework reads this not as overreach but as function:",
     "The framework reads this as function:"),
    # Haitian theorem violence
    ("The Haitian Theorem does not advocate for violence; it reports a structural finding.",
     "The Haitian Theorem reports a structural finding; it makes no moral prescription."),
    # framework dispute
    ("The framework does not dispute the moral beauty of nonviolent philosophy. It observes, however, that the \\textit{systemic promotion} of nonviolence",
     "The framework accepts the moral force of nonviolent philosophy and observes that the \\textit{systemic promotion} of nonviolence"),
    # King safe
    ("This does not make King a safe or state-friendly figure.",
     "Selective canonization extracts the nonviolent method from King's radical diagnosis; King nonetheless remains a dangerous figure to the state."),
    # slavery labor
    ("This was not slavery as labor arrangement; it was slavery as \\textit{industrial-scale biological processing}.",
     "Slavery in Saint-Domingue functioned as \\textit{industrial-scale biological processing}."),
    # civilian population
    ("When the revolution destroyed the extraction apparatus, it destroyed the \\textit{apparatus}---not a civilian population, because there was no civilian population to destroy.",
     "When the revolution destroyed the extraction apparatus, it destroyed the \\textit{apparatus}; no civilian population existed to destroy."),
    # phenotype target
    ("The fear is false as a \\textit{racial} claim---the Haitian Revolution did not target European phenotype; it targeted the extraction kernel and its operators, as the Polish proof below confirms.",
     "The fear is false as a \\textit{racial} claim---the Haitian Revolution targeted the extraction kernel and its operators; phenotype was incidental to that target, as the Polish proof below confirms."),
    # Elite need
    ("The Elite did not need the Buffer Class to believe an outright lie. They needed the Buffer Class to be unable to refute the partial truth:",
     "The Elite needed the Buffer Class to be unable to refute the partial truth:"),
    # structural not racial
    ("The revolution's target was structural, not racial.",
     "The revolution targeted the extraction structure; its targets were determined by structural position."),
    # not only possible
    ("cross-racial solidarity---$I_{\\text{buffer}}$ and $O_{\\text{racialized}}$ recognizing their shared interest against $E$---is not only possible but has \\textit{already been demonstrated}",
     "cross-racial solidarity---$I_{\\text{buffer}}$ and $O_{\\text{racialized}}$ recognizing their shared interest against $E$---is possible and has \\textit{already been demonstrated}"),
    # war crime
    ("coded as a war crime rather than a liberation",
     "coded as a war crime, stripping it of its character as liberation"),
    # white people qua white
    ("It did not target white people \\textit{qua} white people, because in Saint-Domingue, whiteness and participation in the extraction kernel were functionally synonymous.",
     "In Saint-Domingue, whiteness and participation in the extraction kernel were functionally synonymous. The revolution targeted participation in the extraction kernel; phenotype was incidental to that participation."),
    # Haitian template predict
    ("The Haitian template does not predict Buffer Class extermination; it predicts \\textit{kernel destruction}",
     "The Haitian template predicts \\textit{kernel destruction}; Buffer Class extermination lies outside its structure."),
    # Second Amendment gift
    ("The Second Amendment is not a gift from the state; it is a structural constraint \\textit{on} the state, mathematically equivalent to a dead man's switch.",
     "The Second Amendment is a structural constraint \\textit{on} the state, mathematically equivalent to a dead man's switch."),
    # post-liberation however
    ("The post-liberation trajectory, however, supplies a different proof.",
     "The post-liberation trajectory supplies a different proof."),
    # existential threat
    ("rather than as the existential threat that would push them toward kinetic threshold.",
     "while the existential threat that would push them toward kinetic threshold is deferred."),
    # political incrementalism
    ("The boiling-frog sequence formalized above is not merely political incrementalism. It is a Low-Pass Filter installed across the extraction circuit",
     "The boiling-frog sequence formalized above is a Low-Pass Filter installed across the extraction circuit"),
    # public-safety measure
    ("This is not a public-safety measure; it is the monopoly on violence made explicit.",
     "This is the monopoly on violence made explicit."),
    # not killed
    ("They were not killed. They were \\textit{welcomed}.",
     "They survived and were \\textit{welcomed}."),
    # robust labor protections
    ("robust labor protections",
     "strong labor protections"),
    # robust comparative support
    ("provide robust comparative support for both equations.",
     "provide strong comparative support for both equations."),
    # Coxe hunting
    ("Coxe is not discussing hunting rifles.",
     "Coxe is discussing military hardware."),
    # National Guard
    ("Madison---the \\textit{author} of the Second Amendment---defines ``well regulated militia'' as ``the body of the people, trained in arms.'' Not the National Guard. Not a standing army. The people. ``Well regulated'' means well trained and well equipped. The modern reinterpretation of ``well regulated'' as ``government controlled'' is a direct inversion of the author's stated definition.",
     "Madison---the \\textit{author} of the Second Amendment---defines ``well regulated militia'' as ``the body of the people, trained in arms.'' The people compose the militia; the National Guard and standing armies are separate institutions. ``Well regulated'' means well trained and well equipped. The modern reinterpretation of ``well regulated'' as ``government controlled'' is a direct inversion of the author's stated definition."),
    # militia of 2026
    ("The militia of 2026 does not consist of ``all classes, high and low, and rich and poor.'' It consists of those who can navigate a bureaucratic labyrinth designed to price the working class and the Out-group out of their own constitutional guarantee.",
     "The militia of 2026 no longer spans ``all classes, high and low, and rich and poor.'' It consists of those who can afford the compliance costs of a bureaucratic system designed to price the working class and the Out-group out of their own constitutional guarantee."),
    # Yet the Act
    ("Yet the Act provided \\textit{no retroactive relief}, leaving tens of thousands of Black citizens to serve out sentences that Congress itself had declared disproportionate.",
     "The Act provided \\textit{no retroactive relief}, leaving tens of thousands of Black citizens to serve out sentences that Congress itself had declared disproportionate."),
    # Reconstruction counter-revolution
    ("Du Bois's analysis in \\textit{Black Reconstruction} \\cite{dubois} is definitive: the counter-revolution that ended Reconstruction was not driven primarily by Southern racism but by a \\textit{class alliance}---Northern industrial capital and Southern Redeemer elites recognizing that multiracial democracy threatened extraction at the national scale.",
     "Du Bois's analysis in \\textit{Black Reconstruction} \\cite{dubois} is definitive: the counter-revolution that ended Reconstruction was driven primarily by a \\textit{class alliance}---Northern industrial capital and Southern Redeemer elites recognizing that multiracial democracy threatened extraction at the national scale."),
    # not only intact
    ("left the extraction kernel not only intact but operating at higher throughput.",
     "left the extraction kernel intact and operating at higher throughput."),
    # equity compensation
    ("Executive compensation in the modern era is overwhelmingly denominated not in cash salary but in \\textbf{equity}: stock options, restricted stock units, and performance shares whose value is a direct function of the firm's market capitalization.",
     "Executive compensation in the modern era is overwhelmingly denominated in \\textbf{equity}: stock options, restricted stock units, and performance shares whose value is a direct function of the firm's market capitalization."),
    # Predatory Min-Max not metaphor
    ("The Predatory Min-Max Function is not a metaphor at the corporate level; it is the \\textbf{job description}.",
     "The Predatory Min-Max Function is the \\textbf{job description} at the corporate level."),
    # legal machine
    ("The constraint is not a pattern the Elite happens to maintain; it is a \\textbf{legal machine} that runs whether any individual Elite member wills it or not.",
     "The constraint is a \\textbf{legal machine} that runs whether any individual Elite member wills it or not."),
    # inclusive institutions
    ("and the extraction Elite dismantled them within twelve years, not by violating the institutional rules but by operating through them.",
     "and the extraction Elite dismantled them within twelve years by operating through the institutional rules."),
    # Botswana skilled labor
    ("the Elite's rational strategy was to invest in $I_{\\text{buffer}}$-style material wages for the skilled labor class rather than to install a full racial partition.",
     "the Elite's rational strategy was to invest in $I_{\\text{buffer}}$-style material wages for the skilled labor class while avoiding a full racial partition."),
    # Botswana psi deployed
    ("$\\psi$ was deployed differently---not as a psychological-wage partition between ethnic groups within a settler society, but as a technocratic material wage to a narrow skilled class.",
     "$\\psi$ was deployed as a technocratic material wage to a narrow skilled class; no psychological-wage partition between ethnic groups within a settler society was installed."),
    # inter-national
    ("South Korea's colonial experience was \\textit{inter-national} rather than \\textit{intra-national}. Japanese colonialism extracted from Korea as a national unit; it did not install a permanent intra-Korean racial partition with a $\\psi$-stabilized buffer class.",
     "South Korea's colonial experience was \\textit{inter-national}. Japanese colonialism extracted from Korea as a national unit; it did not install a permanent intra-Korean racial partition with a $\\psi$-stabilized buffer class."),
    # highway routing
    ("By classifying highway routing as a purely technical, administrative choice rather than a constitutional one, the judiciary granted planners near-absolute immunity to weaponize infrastructure.",
     "By classifying highway routing as a purely technical, administrative choice, the judiciary removed it from constitutional scrutiny and granted planners near-absolute immunity to weaponize infrastructure."),
    # Ames
    ("compiling the civil-rights statute as an individual, direction-agnostic command rather than as a remedial architecture keyed to historical subordination \\cite{ames_ohio_dys_2025}.",
     "compiling the civil-rights statute as an individual, direction-agnostic command detached from remedial architecture keyed to historical subordination \\cite{ames_ohio_dys_2025}."),
    # But direction
    ("But the direction is exactly what Equation~\\ref{eq:12.4a-judicial-double-agent} predicts: the Court's language changes when the protected object changes.",
     "The direction is exactly what Equation~\\ref{eq:12.4a-judicial-double-agent} predicts: the Court's language changes when the protected object changes."),
    # red-state path
    ("The lethal autonomy gap is maintained not through legislation but through the application of force.",
     "The lethal autonomy gap is maintained through the application of force."),
    # delta4 alone
    ("systematically understates the constitutional harm by treating $\\delta_4$ alone rather than $\\prod_k(1 + \\delta_k)$.",
     "systematically understates the constitutional harm by treating $\\delta_4$ alone while ignoring the product $\\prod_k(1 + \\delta_k)$."),
    # principled transactional
    ("$F_{\\text{enforce}}$'s opposition was not principled but transactional: the moment their class interest was satisfied, their solidarity with the civilian gun-owner population dissolved.",
     "$F_{\\text{enforce}}$'s opposition was transactional: the moment their class interest was satisfied, their solidarity with the civilian gun-owner population dissolved."),
    # door-to-door confiscation
    ("By the time the water boils, the population has been disarmed generationally---not through the door-to-door confiscation that created the American Revolution, but through the slow bureaucratic evaporation of the right that Mason warned against 238 years ago.",
     "By the time the water boils, the population has been disarmed generationally---through the slow bureaucratic evaporation of the right that Mason warned against 238 years ago."),
    # trade gun rights
    ("The Buffer Class did not merely trade gun rights for psychological status. It traded its descendants' gun rights for its own present exemption.",
     "The Buffer Class traded its descendants' gun rights for its own present exemption."),
    # kinetic precondition
    ("The August 1791 uprising was kinetic in execution, but its precondition was communicative: the Out-group built a channel the local enforcement layer could not fully monitor, translate, or neutralize.",
     "The August 1791 uprising was kinetic in execution, with a communicative precondition: the Out-group built a channel the local enforcement layer could not fully monitor, translate, or neutralize."),
    # Liberia geography
    ("A cross-continental dataset cannot rule out that Liberia's outcome reflects West African geography rather than colonial intensity; Hispaniola can.",
     "A cross-continental dataset cannot determine whether Liberia's outcome reflects West African geography or colonial intensity; Hispaniola can."),
    # ethnic animosity
    ("an assessment that the framework reads not as ethnic animosity but as the downstream consequence of the financial-kernel architecture forcing the extraction upward:",
     "an assessment that the framework reads as the downstream consequence of the financial-kernel architecture forcing the extraction upward:"),
    # independent variable
    ("the 1966 bifurcation is not an independent variable but the point at which",
     "the 1966 bifurcation is the point at which"),
    # landscape difference
    ("The apparent landscape difference is not climate but forest cover.",
     "The apparent terrain difference reflects forest cover; climate is constant across the island."),
    # apparent landscape difference reflects
    ("The apparent landscape difference reflects forest cover; climate is constant across the island.",
     "The apparent terrain difference reflects forest cover; climate is constant across the island."),
    # Haitians ignorant
    ("During that dormancy, Haitians were not ignorant of structural risk; they were rationally responding to the risks they actually observed.",
     "During that dormancy, Haitians were rationally responding to the risks they actually observed."),
    # frequent threat
    ("The frequent threat was not earthquakes but \\textit{hurricanes}, which batter the island nearly every year.",
     "The frequent threat was \\textit{hurricanes}, which batter the island nearly every year."),
    # cinder block rather than wood
    ("The rational adaptation was to build housing of cement and cinder block rather than wood --- materials that resist the high winds and lateral forces of tropical storms far better than lightweight wood-frame construction, which would be shredded by hurricane winds.",
     "The rational adaptation was to build housing of cement and cinder block, forgoing wood --- materials that resist the high winds and lateral forces of tropical storms far better than lightweight wood-frame construction, which would be shredded by hurricane winds."),
    # character failure
    ("This is a specific, documented mechanism by which the colonial-intensity variable's downstream poverty translates into a \\textit{mortality multiplier} on exogenous-disaster events --- not a character or governance failure but an arithmetic consequence of a 200-year extraction architecture.",
     "This is a specific, documented mechanism by which the colonial-intensity variable's downstream poverty translates into a \\textit{mortality multiplier} on exogenous-disaster events --- an arithmetic consequence of a 200-year extraction architecture."),
    # restitution claim
    ("The restitution claim was structurally stronger: it did not require proving the magnitude of Haiti's suffering but merely documenting the unjust enrichment France had received from a contract signed under the illegal threat of re-enslavement",
     "The restitution claim was structurally stronger: it required only documenting the unjust enrichment France had received from a contract signed under the illegal threat of re-enslavement"),
    # state sovereignty
    ("Aristide survived physically; the correction operated at the level of state sovereignty rather than the biological body.",
     "Aristide survived physically; the correction operated at the level of state sovereignty, sparing the biological body."),
    # irony prediction
    ("The framework reads this not as irony but as prediction: sustained external reimposition produces harm as a structural output, not as an aberration.",
     "The framework reads this as prediction: sustained external reimposition produces harm as a structural output; aberration is the wrong category."),
    # But structural consequence
    ("But the structural consequence was the same whether the bypass was intentional or logistical:",
     "The structural consequence was the same whether the bypass was intentional or logistical:"),
    # border management
    ("The framework reads this wall not as a border-management instrument but as a \\textbf{containment-field physicalization}.",
     "The framework reads this wall as a \\textbf{containment-field physicalization}; border management is its surface function."),
    # scope condition
    ("Each case, analyzed structurally, resolves as a scope condition rather than a counter-example.",
     "Each case, analyzed structurally, resolves as a scope condition."),
    # Mandela vacuum
    ("Nelson Mandela was released from prison not into a vacuum but onto a continent where Umkhonto we Sizwe (MK), the ANC's armed wing, had been conducting military operations for three decades;",
     "Nelson Mandela was released from prison onto a continent where Umkhonto we Sizwe (MK), the ANC's armed wing, had been conducting military operations for three decades;"),
    # moral argument
    ("De Klerk's ``negotiated'' transition was a concession made under conditions where the kinetic threshold was credibly imminent---not a demonstration that the system responds to moral argument.",
     "De Klerk's ``negotiated'' transition was a concession made under conditions where the kinetic threshold was credibly imminent."),
    # refutation
    ("The negotiation was not a refutation of the Haitian Theorem; it was the Concession Theorem operating at the scale of regime transition:",
     "The negotiation was the Concession Theorem operating at the scale of regime transition:"),
    # kinetic precondition outcome
    ("Second, \\textbf{the kinetic potential was the precondition, not the outcome}. The Nordic welfare state was not built in the absence of kinetic threat.",
     "Second, \\textbf{the kinetic potential was the precondition}. The Nordic welfare state was not built in the absence of kinetic threat."),
    # nonviolent moral suasion
    ("The Nordic model was not achieved by nonviolent moral suasion; it was achieved because the credible kinetic alternative existed and the Elite's rational response was genuine concession rather than the Concession Theorem's typical partial patch.",
     "The Nordic model was achieved because the credible kinetic alternative existed and the Elite's rational response was a genuine concession beyond the Concession Theorem's typical partial patch."),
    # Zimbabwe purge
    ("land redistribution (the Fast Track Land Reform Programme, 2000--2002) was implemented not as a systematic economic restructuring but as a political purge that collapsed agricultural production while concentrating the best land in the hands of war veterans and party loyalists.",
     "land redistribution (the Fast Track Land Reform Programme, 2000--2002) was implemented as a political purge that collapsed agricultural production while concentrating the best land in the hands of war veterans and party loyalists."),
    # Constitution adversarial
    ("The Framers designed the Constitution not as a grant of power from the state to the people, but as a \\textit{contract between adversarial parties}---the government and the governed---in which the governed retain the permanent physical capacity to terminate the contract by force.",
     "The Framers designed the Constitution as a \\textit{contract between adversarial parties}---the government and the governed---in which the governed retain the permanent physical capacity to terminate the contract by force."),
    # stigmatized
    ("grandfather clauses create temporal expiration of the right, and $P_{\\text{gaslight}}^{\\text{nonviolence}}$ ensures that firearms culture is stigmatized rather than transmitted.",
     "grandfather clauses create temporal expiration of the right, and $P_{\\text{gaslight}}^{\\text{nonviolence}}$ ensures that firearms culture is stigmatized, preventing its transmission."),
    # atmosphere
    ("it is not the act of using firearms that restrains tyranny, but the ``atmosphere'' of universal armament. This is the mathematical reality of $\\min$: the Elite's extraction is constrained by the \\textit{knowledge} that the population is armed, not by actual combat.",
     "the ``atmosphere'' of universal armament restrains tyranny. This is the mathematical reality of $\\min$: the Elite's extraction is constrained by the \\textit{knowledge} that the population is armed."),
    # rather than confiscation
    ("This is why the modern Elite uses gradualist methods---grandfather clauses, economic filters, bureaucratic friction---rather than confiscation.",
     "This is why the modern Elite uses gradualist methods---grandfather clauses, economic filters, bureaucratic friction---while avoiding confiscation."),
    # scholarly error
    ("Du Bois demonstrated that this was not scholarly error but coordinated historical manufacture:",
     "Du Bois demonstrated that this was coordinated historical manufacture:"),
    # individual failure
    ("and that the Out-group's diminished capacity ($O_t^{\\text{capacity}}$) is the product of individual or cultural failure rather than five centuries of multiplicative policy extraction.",
     "and that the Out-group's diminished capacity ($O_t^{\\text{capacity}}$) results from individual or cultural failure, with no contribution from five centuries of multiplicative policy extraction."),
    # civilians
    ("\\item \\textbf{Erase} the functional identity of the European population on the island---not civilians, but the operators and direct beneficiaries of the extraction kernel.",
     "\\item \\textbf{Erase} the functional identity of the European population on the island---the operators and direct beneficiaries of the extraction kernel."),
    # racial genocide
    ("coding the Haitian Revolution as racial genocide rather than structural liberation",
     "coding the Haitian Revolution as racial genocide, stripping it of its character as structural liberation"),
    # neutral historiographic
    ("This is not a neutral historiographic choice. It is $P_{\\text{gaslight}}$ operating as curriculum:",
     "This is $P_{\\text{gaslight}}$ operating as curriculum:"),
    # Kernel Denial
    ("\\item \\textbf{Kernel Denial}: Asserting that systemic racism does not exist, that disparities are products of individual or cultural failure, and that the compounding capacity model ($O_t^{\\text{capacity}}$) is coincidental rather than engineered.",
     "\\item \\textbf{Kernel Denial}: Asserting that systemic racism does not exist, that disparities are products of individual or cultural failure, and that the compounding capacity model ($O_t^{\\text{capacity}}$) has no engineered cause."),
    # money alone freedom
    ("The market being rationed is not money alone but freedom itself.",
     "The market being rationed is freedom itself."),
    # financial-kernel pressure
    ("this one driven not by colonial administrators but by financial-kernel pressure.",
     "this one driven by financial-kernel pressure."),
    # Saint-Domingue chosen
    ("--- which is precisely why Saint-Domingue, not Santo Domingo, was chosen for industrialization into the world's most productive sugar and coffee extraction machine.",
     "--- which is precisely why Saint-Domingue was chosen for industrialization into the world's most productive sugar and coffee extraction machine."),
    # IMF conditions
    ("The framework reads the 1994 IMF conditions not as an unrelated development policy but as a structural continuation of the extraction architecture:",
     "The framework reads the 1994 IMF conditions as a structural continuation of the extraction architecture:"),
    # aid flows
    ("every dollar of aid that flows through a parallel non-state network rather than through government institutions simultaneously delivers services",
     "every dollar of aid that flows through a parallel non-state network, bypassing government institutions, simultaneously delivers services"),
    # measurement error
    (" rather than measurement error).",
     ", distinct from measurement error)."),
    # inside domain
    ("Three structural features of the Nordic case explain why it falls outside the Haitian Theorem's scope condition rather than inside its domain.",
     "Three structural features of the Nordic case explain why it falls outside the Haitian Theorem's scope condition."),
    # hedge / kernel transplant
    ("Zimbabwe is the empirical proof that the theorem's ``locally'' qualifier is not a hedge---it is the theorem's most important load-bearing word. Liberation that reproduces the architecture rather than dismantling it is a kernel transplant, not a kernel termination.",
     "Zimbabwe is the empirical proof that the theorem's ``locally'' qualifier is the theorem's most important load-bearing word. Liberation that reproduces the architecture without dismantling it produces a kernel transplant."),
    # threat discharge
    ("They specify the conditions under which the kinetic variable operates through \\textit{threat} rather than \\textit{discharge}, confirm that the kinetic variable must be present for the extraction kernel to yield, and demonstrate that kinetic discharge without architectural dismantling produces kernel transplant rather than kernel termination.",
     "They specify the conditions under which the kinetic variable operates through \\textit{threat}; \\textit{discharge} is the limiting case. They confirm that the kinetic variable must be present for the extraction kernel to yield, and demonstrate that kinetic discharge without architectural dismantling produces kernel transplant; kernel termination requires dismantling the architecture."),
    # accessible only
    ("creating a system where the kinetic guarantee exists in theory but is accessible only to those who can afford the compliance costs.",
     "creating a system where the kinetic guarantee exists in theory while remaining accessible only to those who can afford the compliance costs."),
    # Yet because redlining
    ("No feature explicitly references race. Yet because redlining",
     "No feature explicitly references race. Because redlining"),
    # Yet analysis dissolves
    ("Haitian Revolution was required. Yet the analysis dissolves",
     "Haitian Revolution was required. The analysis dissolves"),
    # restraint not adjudication
    ("The doctrine is structurally designed to produce restraint, not adjudication.",
     "The doctrine is structurally designed to produce restraint."),
    # accidental externality
    ("Atwater himself notes that the racial harm is a known ``byproduct,'' not an accidental externality; the abstraction is a deliberate concealment strategy, not a change in objective.",
     "Atwater himself notes that the racial harm is a known ``byproduct''; the abstraction is a deliberate concealment strategy that preserves the objective."),
    # point capacity contradiction
    ("The point is capacity, not contradiction. The legal node can see systemic oppression when the threatened variable is hardware-level kinetic parity.",
     "The observation concerns capacity: the legal node can see systemic oppression when the threatened variable is hardware-level kinetic parity."),
    # individual-Justice estimate
    ("The result is a case-level semantic study, not an individual-Justice ideal-point estimate.",
     "The result is a case-level semantic study."),
    # abstract theory
    ("This is not an abstract theory, nor does it rest on the single tragedy of Philando Castile.",
     "This pattern extends beyond the single tragedy of Philando Castile."),
    # Breyer oversight
    ("Breyer's silence on the racial history of the law he defends is not an oversight. It is a structural impossibility.",
     "Breyer's silence on the racial history of the law he defends is a structural impossibility."),
    # McBath son
    ("McBath's son was not killed by the ergonomic features banned in H.R.\\ 3115---he was killed with a pistol by a man whose violence was motivated by racial contempt, not by hardware configuration.",
     "McBath's son was killed with a pistol by a man whose violence was motivated by racial contempt---a vector unrelated to the ergonomic features banned in H.R.\\ 3115."),
    # does not require bad faith
    ("The Puppet Class mechanism works because the subject does not require bad faith; it requires only that a genuine grievance be channeled through an institutional position into policy that serves $E$'s suppression constraint.",
     "The Puppet Class mechanism works because the subject requires only that a genuine grievance be channeled through an institutional position into policy that serves $E$'s suppression constraint."),
    # intra-Elite revolt
    ("A kinetic revolt that successfully severed the colonial extraction pipeline---though critically, this was an intra-Elite revolt ($E_{\\text{colonial}}$ vs.\\ $E_{\\text{imperial}}$), not an Out-group liberation.",
     "A kinetic revolt that successfully severed the colonial extraction pipeline---though critically, this was an intra-Elite revolt ($E_{\\text{colonial}}$ vs.\\ $E_{\\text{imperial}}$) that preserved the domestic extraction kernel."),
    # Haitian governance failure
    ("This recursion is not a Haitian governance failure; it is the indemnity mechanism executing its logical consequence.",
     "This recursion is the indemnity mechanism executing its logical consequence."),
    # multiplier
    ("What it does not predict on its own is the \\textit{multiplier} that transforms economic degradation into catastrophic mortality when exogenous shocks arrive.",
     "The model requires an additional mechanism to explain the \\textit{multiplier} that transforms economic degradation into catastrophic mortality when exogenous shocks arrive."),
    # retrospective observation
    ("is not a retrospective observation. It is a mathematical consequence of the architecture already documented.",
     "is a mathematical consequence of the architecture already documented."),
    # not simple fencing
    ("its technical specification (surveillance-grade drones and fiber-optic communications, not simple fencing), and its scope",
     "its technical specification (surveillance-grade drones and fiber-optic communications, a specification beyond simple fencing), and its scope"),
    # not proportionate
    ("identify it as a structural quarantine, not a proportionate security measure.",
     "identify it as a structural quarantine; proportionate security is its surface justification."),
    # policy failure
    ("Haiti 2026 is not a policy failure. It is the long-run equilibrium the framework predicts for a state that destroyed its local extraction kernel in 1804",
     "Haiti 2026 is the long-run equilibrium the framework predicts for a state that destroyed its local extraction kernel in 1804"),
    # divergence does not
    ("the cross-island 1789--2023 GDP-per-capita divergence disappeared when controlling for post-independence events alone --- it does not: the divergence is established",
     "the cross-island 1789--2023 GDP-per-capita divergence disappeared when controlling for post-independence events alone --- the divergence persists: it is established"),
    # independent confound
    ("the double-debt architecture is itself a downstream consequence of the colonial-intensity variable, not an independent confound.",
     "the double-debt architecture is itself a downstream consequence of the colonial-intensity variable."),
    # British moral persuasion
    ("British strategic calculation in 1945--1947 was not driven by moral persuasion. It was driven by three compounding variables:",
     "British strategic calculation in 1945--1947 was driven by three compounding variables:"),
    # kinetic not theoretical
    ("the kinetic alternative was not theoretical;",
     "the kinetic alternative was actual;"),
    # concession nonviolence
    ("British withdrawal was not a concession to nonviolence as a moral force; it was a rational calculation that the kinetic threshold was imminent, $F_{\\text{enforce}}$ was unreliable, and the extraction return had fallen below the suppression cost.",
     "British withdrawal was a rational calculation that the kinetic threshold was imminent, $F_{\\text{enforce}}$ was unreliable, and the extraction return had fallen below the suppression cost."),
    # revisionist interpretation
    ("The Haitian Theorem is not a revisionist interpretation imposed upon the Constitution from the outside. It is the \\textit{stated design principle} of the document's own architects.",
     "The Haitian Theorem is the \\textit{stated design principle} of the document's own architects."),
    # moral preference
    ("Intersectionality is therefore not a moral preference appended to the framework; it is a systems-engineering requirement for permanent kernel deletion",
     "Intersectionality is therefore a systems-engineering requirement for permanent kernel deletion"),
    # installer on disk
    ("A revolution that leaves a live partition axis behind has not deleted the virus. It has left the installer on disk.",
     "A revolution that leaves a live partition axis behind has left the installer on disk."),
    # slave colony
    ("Saint-Domingue (colonial Haiti) was not a colony that incidentally contained slaves. It was a \\textit{slave colony}---the epicenter of the transatlantic extraction pipeline",
     "Saint-Domingue (colonial Haiti) was a \\textit{slave colony}---the epicenter of the transatlantic extraction pipeline"),
    # administrative error
    ("This was not an administrative error; it was a structural declaration: in the Haitian framework, ``Black'' meant \\textit{free from the extraction kernel}, not a phenotypic category.",
     "This was a structural declaration: in the Haitian framework, ``Black'' meant \\textit{free from the extraction kernel}; phenotype was irrelevant to the classification."),
    # deforestation not colonial-era
    ("Haiti's forest loss is not primarily a colonial-era phenomenon; it is a \\textbf{debt-service phenomenon}",
     "Haiti's forest loss is a \\textbf{debt-service phenomenon}, not primarily a colonial-era phenomenon"),
    # structural falseness however
    ("This structural falseness requires a precise qualification, however.",
     "A precise qualification follows."),
    # But the Elite had ensured
    ("But the Elite had ensured, through the complicity investment",
     "The Elite had ensured, through the complicity investment"),
    # not evidence of accuracy
    ("The fear's durability across generations is not evidence of its accuracy; it is evidence of the complicity investment's success.",
     "The fear's durability across generations is evidence of the complicity investment's success, not evidence of its accuracy."),
    # critical insight
    ("The critical insight is this:",
     "The insight is this:"),
    # And here is the contradiction
    ("And here is the contradiction",
     "Here is the contradiction"),
    # critical instrument
    ("The critical instrument is the",
     "The central instrument is the"),
    # critical strategic insight
    ("The framework identifies a critical strategic insight:",
     "The framework identifies a strategic insight:"),
    # That last phrase is critical
    ("That last phrase is critical",
     "That last phrase carries the most weight"),
    # critical bug
    ("a critical bug in the constitutional source code",
     "a structural bug in the constitutional source code"),
    # critical structural difference
    ("The critical structural difference:",
     "The structural difference:"),
    # CRITICAL WARNING header
    ("\\textbf{CRITICAL WARNING}",
     "\\textbf{WARNING}"),
    # However Justice Thomas
    ("In \\textit{Bruen}, however, Justice Thomas does the opposite.",
     "In \\textit{Bruen}, Justice Thomas does the opposite."),
    # not outside invariant set
    ("the reform is not outside the algorithm's invariant set; it is one of the directions in which the algorithm was already constructed to move.",
     "the reform lies inside the algorithm's invariant set; it is one of the directions in which the algorithm was already constructed to move."),
    # not confined to red states
    ("Critically, this dynamic is not confined to red states or limited to the Out-group; it is a universal feature of the policing architecture in both red and blue jurisdictions.",
     "This dynamic is a universal feature of the policing architecture in both red and blue jurisdictions, not confined to red states or limited to the Out-group."),
    # misread as cultural antagonism
    ("misread as cultural antagonism rather than as load balancing by the extraction kernel.",
     "misread as cultural antagonism when it is load balancing by the extraction kernel."),
    # unit of analysis
    ("the unit of analysis is the case rather than the Justice.",
     "the unit of analysis is the case, not the Justice."),
    # loyal to maintenance function
    ("loyal to the system's maintenance function rather than to the population it polices",
     "loyal to the system's maintenance function, not to the population it polices"),
    # American rather than French hands
    ("with American rather than French hands.",
     "with American hands, not French ones."),
    # downstream consequences rather than confounds
    ("downstream consequences of the colonial-intensity variable rather than fully independent confounds",
     "downstream consequences of the colonial-intensity variable and not fully independent confounds"),
    # inter-national rather than intra-national
    ("extraction is inter-national rather than intra-national",
     "extraction is inter-national, not intra-national"),
    # enforcement rather than coalition fracture
    ("cost/benefit of enforcement rather than coalition fracture.",
     "cost/benefit of enforcement, not coalition fracture."),
    # visible landscape difference
    ("visible landscape difference",
     "visible terrain difference"),
    # deforestation awkwardness
    ("Haiti's forest loss is a \\textbf{debt-service phenomenon}, not primarily a colonial-era phenomenon with a documented causal chain.",
     "Haiti's forest loss is a \\textbf{debt-service phenomenon} with a documented causal chain, not primarily a colonial-era phenomenon."),
    # Critically GOAL
    ("Critically, GOAL was not in those rooms.",
     "GOAL was not in those rooms."),
    # not treated as neutral filter
    ("New York's ``proper cause'' requirement is not treated as a neutral administrative filter entitled to deference; it is treated as a subjective bottleneck on the kinetic guarantee.",
     "New York's ``proper cause'' requirement is treated as a subjective bottleneck on the kinetic guarantee, not as a neutral administrative filter entitled to deference."),
    # not dismantled in Scandinavia
    ("The extraction kernel was not dismantled in Scandinavia; it was offshored.",
     "The extraction kernel was offshored from Scandinavia, not dismantled there."),
]

for old, new in replacements:
    if old not in chunk:
        print(f"WARNING: pattern not found ({len(old)} chars): {old[:100]!r}")
    else:
        chunk = chunk.replace(old, new)

out.write_text(chunk, encoding='utf-8')
print(f"Wrote {len(chunk)} chars to {out}")
