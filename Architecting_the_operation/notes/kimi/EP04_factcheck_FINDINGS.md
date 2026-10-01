# EP04 cold-open fact-check findings

Checked through October 1, 2026. FBI figures below distinguish crimes reported to law enforcement from survey estimates of victimization.

### C1 — Sex of rape offenders and victims
Claim: Of rapes in 2025 FBI data, 90%+ of offenders were men and 90%+ of victims were women.
Verdict: UNVERIFIED
Correct figure / fact: The public 2025 FBI summary confirms that detailed NIBRS data exist, but the accessible national summary does not publish this sex breakdown. The latest BJS national-estimates table I could inspect directly is the 2022 **Table 3a—Person Victims**. It estimates that 89.64% of rape victims were female. Victim/offender-sex cells involving a male offender sum to 93.58% of rape victimizations; these are victimization records involving known offenders, not a count of unique offenders. The first half clears 90%; the victim figure falls slightly below it.
Source: https://api.ojp.gov/bjsdataset/v1/ms42-n765.json?%24where=indicator_name%3D%27Rape%27&%24limit=1000 — “Victim sex / Female / 89.641315853578”; https://www.fbi.gov/news/press-releases/fbi-releases-2025-reported-crimes-in-the-nation-statistics — “detailed data tables on more than 13 million criminal offenses”
Note: Do not label the available 2022 BJS table as “2025 FBI data.” Avoid turning offender records into a population estimate of men.

### C2 — Stranger share of rape
Claim: Less than 9% were committed by strangers; counting “relationship unknown” as strangers, 22%.
Verdict: PARTLY TRUE
Correct figure / fact: In the 2022 BJS NIBRS national estimate, **Table 3a—Person Victims**, stranger was 7.44% and unknown relationship was 13.89%, totaling 21.33%. Unknown does not mean stranger. It means the relationship was unavailable or unknown in the record.
Source: https://api.ojp.gov/bjsdataset/v1/ms42-n765.json?%24where=indicator_name%3D%27Rape%27&%24limit=1000 — “Stranger / 7.44098919754556” and “Unknown relationship / 13.8911078727658”
Note: “Stranger or relationship unknown” is accurate. “Counting unknown as strangers” assigns a relationship the data do not establish. The year must be stated as 2022 unless the 2025 table is obtained and checked.

### C3 — Stranger/unknown share of homicide
Claim: Homicides: strangers + relationship unknown = 62% of last year's homicides.
Verdict: UNVERIFIED
Correct figure / fact: The directly inspected 2022 BJS NIBRS national estimate, **Table 3a—Person Victims**, gives stranger at 22.73% and unknown relationship at 32.76%, totaling 55.49%. I did not locate an opened 2025 national relationship table supporting 62%.
Source: https://api.ojp.gov/bjsdataset/v1/ms42-n765.json?%24where=indicator_name%3D%27Murder%20and%20Non-negligent%20Manslaughter%27&%24limit=1000 — “Stranger / 22.7304553375601” and “Unknown relationship / 32.7578011011981”
Note: State the year and table. Unknown-relationship homicides cannot be described as stranger homicides.

### C4 — Unreported rape
Claim: “Four out of five rapes go unreported.” What do BJS/NCVS and RAINN actually report, and for which population (all women vs. college women 18–24)?
Verdict: PARTLY TRUE
Correct figure / fact: BJS **Criminal Victimization, 2024, Table 4** estimates that 23.6% of rape/sexual-assault victimizations against persons age 12 or older were reported to police, so 76.4% went unreported in that survey year. RAINN’s cited national figure is 310 reports per 1,000 sexual assaults, or about 69% unreported. The four-in-five figure comes from BJS’s pooled 1995–2013 NCVS analysis of female college students ages 18–24: 20% reported, meaning 80% did not. Female nonstudents of the same age reported 32%.
Source: https://bjs.ojp.gov/sites/g/files/xyckuh236/files/media/document/cv24.pdf — “The percentage of rape or sexual assault victimizations reported to police ... 24% in 2024.”; https://bjs.ojp.gov/library/publications/rape-and-sexual-assault-among-college-age-females-1995-2013 — “females ages 18 to 24 who are enrolled and not enrolled in college”; https://rainn.org/sites/default/files/SB%20Resources_Social%20Media%20Toolkit_2021.pdf — “Only 310 out of every 1,000 sexual assaults are reported to the police.”
Note: On air, attach “four out of five” to female college students ages 18–24 in the 1995–2013 pooled NCVS study. It is not a current estimate for all women or all rape victims.

### C5 — Violent crimes more frequent than rape
Claim: “Aggravated assault is the only violent crime that happens more often than rape.”
Verdict: CONTRADICTED
Correct figure / fact: FBI **Reported Crimes in the Nation, 2025** gives rates of 238.0 aggravated assaults, 49.4 robberies, 36.1 rapes, and 4.1 murders per 100,000. Both aggravated assault and robbery were reported more often than rape.
Source: https://www.fbi.gov/news/stories/violent-crime-falls-at-historic-rate-new-fbi-data-show — “The 2025 robbery rate [was] 49.4 per 100,000, while the rape rate [was] 36.1”; https://americanfactbook.org/crime/offense/aggravated-assault — “a rate of 238.0 per 100,000 ... in 2025”
Note: Say that rape exceeds homicide among the four FBI violent-crime categories. Robbery and aggravated assault both exceed rape.

### C6 — E. Jean Carroll verdict and appeals
Claim: Trump was found civilly liable for sexual assault (E. Jean Carroll). What exactly did the jury find (sexual abuse vs. rape under NY law)? Was a criminal statute of limitations the reason for no criminal charge? Current appeal status — did the U.S. Supreme Court deny cert or rule, and when?
Verdict: PARTLY TRUE
Correct figure / fact: On May 9, 2023, the jury found Donald Trump civilly liable for sexual abuse and defamation and awarded $5 million. It did not find the narrow, then-applicable New York Penal Law definition of rape proved. Judge Lewis Kaplan later wrote that the conduct found by the jury constituted rape in ordinary modern usage. The alleged mid-1990s conduct was outside the criminal limitations period when Carroll went public; New York’s Adult Survivors Act revived civil claims for one year and did not revive criminal prosecution. The Supreme Court denied certiorari on June 29, 2026, and denied rehearing on August 17, 2026. It issued no merits ruling. A separate appeal involving the $83.3 million defamation judgment remained a separate matter.
Source: https://apnews.com/article/1a50d1e9e1d12898e78e0803c4627771 — “The high court declined to take up the case in a brief, unexplained order”; https://www.supremecourt.gov/docket/docketfiles/html/public/25-573.html — “DISTRIBUTED for Conference of 6/25/2026”; https://www.cbsnews.com/news/supreme-court-trump-appeal-of-e-jean-carroll-case/ — “declined for the second time to consider President Trump's appeal”; https://time.com/6275589/e-jean-carroll-trump-civil-trial/ — “the Adult Survivors Act ... permits adult sexual violence survivors to sue for attacks ... outside former statutes of limitations”
Note: “Found liable for sexual abuse” tracks the verdict form. “The Supreme Court upheld the verdict” overstates a certiorari denial. The expired criminal limitations period explains the absence of a viable decades-late prosecution, although I found no charging memorandum naming it as the sole cause.

### C7 — “0.065% of men are rapists”
Claim: “Based on the 2024 FBI stats… 0.065% of men are rapists.” Reconstruct how this could be computed (known offenders ÷ male population?). Say plainly what the number does and does not measure.
Verdict: UNVERIFIED
Correct figure / fact: Multiplying the 2024 U.S. male population, roughly 168 million, by 0.065% implies a numerator near 109,000. That is consistent with using male known-offender records associated with police-reported rape victimizations and dividing by every male resident. I could not reproduce an exact 2024 table cell that yields 0.065%. NIBRS counts incident-linked offender records. One person can appear in multiple incidents, multiple offenders can appear in one incident, offender sex can be unknown, and unreported crimes are absent.
Source: https://bjs.ojp.gov/national-incident-based-reporting-system-nibrs-national-estimates-api — “NIBRS captures multiple characteristics of each crime incident—including demographic characteristics of crime victims, offenders, and persons arrested”
Note: The percentage is not the share of men who are rapists. At most, it is a ratio of police-recorded offender entries to the total male population for one year, subject to coverage, missing-data, duplication, and reporting limitations.

### C8 — Survey estimates of male perpetration
Claim: Survey-based estimates of the share of men who report acts meeting legal definitions of rape or attempted rape (e.g. Lisak & Miller 2002 and later studies). Give 2–3 with figures.
Verdict: CONFIRMED
Correct figure / fact: Lisak and Miller (2002) pooled four samples of 1,882 college men; 120, or 6.4%, self-reported conduct meeting legal definitions of rape or attempted rape. Koss et al.’s 1987 national college sample estimated 4.4% for rape. A 2015 national-college-sample comparison reported 12.7% of men acknowledging rape or attempted rape. A later five-university study of 1,982 college men reported 6.1% completed rape plus 1.5% attempted rape, with behavior measured from age 14 through survey.
Source: https://pubmed.ncbi.nlm.nih.gov/11991158/ — “1,882 men were assessed ... 120 men whose self-reported acts met legal definitions of rape or attempted rape”; https://www.ojp.gov/library/publications/scope-rape-victimization-and-perpetration-among-national-samples-college — “12.7% of men reported perpetration”; https://pmc.ncbi.nlm.nih.gov/articles/PMC6474339/ — “6.1% ... reported perpetrating rape according to the FBI definition”
Note: These estimates describe particular college samples, instruments, age windows, and definitions. They do not yield a single national percentage for all men.

### C9 — Child sexual abuse by family versus strangers
Claim: “Children are five times more likely to be molested by family members than by strangers.”
Verdict: CONFIRMED
Correct figure / fact: The BJS law-enforcement dataset summarized by RAINN reports that among juvenile sexual-abuse victims, 34% of perpetrators were family members and 7% were strangers. The ratio is 4.9 to 1, which supports “about five times” for cases reported to law enforcement. Acquaintances were the largest category at 59%.
Source: https://rainn.org/facts-statistics-the-scope-of-the-problem/statistics-children-teens/ — “59% were acquaintances, 34% were family members, and only 7% were strangers”
Note: Use “in sexual-abuse cases reported to law enforcement.” The statistic does not cover all abuse, and “known to the child” combines family and acquaintances at 93%.

### C10 — Nolan Wells
Claim: She says the system that failed the Cornell woman “is the same system that killed Nolan Wells” who “wasn't able to get justice.” Who is Nolan Wells and what happened? If no such case can be found, say so.
Verdict: CONTRADICTED
Correct figure / fact: Nolan Xavier Wells was an 18-year-old Black college student whose body was found near Mississippi’s Horn Island on July 6, 2026, two days after a boat outing. The family’s independent autopsy listed cause and manner of death as undetermined. On September 21, 2026, a Jackson County grand jury returned no indictments and reported insufficient evidence of criminal wrongdoing. The record opened for this check does not establish that a government system killed him.
Source: https://apnews.com/article/b9327f377853d7934ea70c2e936a4f2e — “His body was found two days later off the island's coast.”; https://mississippitoday.org/2026/09/21/nolan-wells-death-no-indictments/ — “A grand jury found no evidence of criminal wrongdoing”
Note: “His family says the investigation failed to deliver answers or justice” is attributable. “The system killed Nolan Wells” states an unproved cause and actor.

### C11 — UW–Madison “Poopgate”
Claim: “Poopgate” at UW–Madison involving AEPi Wisconsin: what happened, when, and what is documented?
Verdict: PARTLY TRUE
Correct figure / fact: On September 23, 2026, Madison police responded to the unrecognized Alpha Epsilon Pi house on Langdon Street. Officers reported about 30 partially clothed males, mostly 18-year-old pledges, covered in food, condiments, and other liquids in an 81-degree basement; several showed injuries consistent with assault. Police arrested chapter president Brayden Klein and vice president Samuel Vane on tentative hazing and disorderly-conduct allegations. UW–Madison had terminated the group’s recognition in 2015. Police said they had no information showing feces were involved as of the available statement.
Source: https://www.cityofmadison.com/police/incident-reports/2026-09-23/mpd-investigating-hazing-incident-at-fraternity — “Several of these men had visible injuries consistent with being physically assaulted.”; https://news.wisc.edu/a-message-about-hazing-from-vice-chancellor-for-student-affairs-lori-reesor/ — “a student group whose status with the university was terminated in 2015”
Note: The hazing incident and arrests are documented. “Poopgate” and feces claims remain social-media labels unsupported by the police account opened here. Arrests were tentative; the source did not establish filed charges or guilt.

### C12 — Indiana University rhabdomyolysis hazing case
Claim: Bloomington, Indiana: two fraternity pledges hospitalized with deteriorating muscles; the chapter president texted them to lie to doctors and delete texts. Find the case.
Verdict: CONFIRMED
Correct figure / fact: The case concerns Indiana University Bloomington’s Phi Kappa Psi chapter. Police records allege that on October 18, 2025, 36 pledges performed push-ups, planks, squats, and deadlifts for three hours, followed for some by an ice bath. Two pledges were hospitalized with rhabdomyolysis. In August 2026, seven members were charged. Chapter president Arjunkumar Patel was also charged with obstruction; court records allege he told a hospitalized pledge to lie about the injuries and later instructed members to delete hazing-related messages.
Source: https://www.cbsnews.com/chicago/news/7-indiana-university-fraternity-members-charged-hazing/ — “Both were diagnosed with rhabdomyolysis and were hospitalized for multiple days”; https://bloomingtonian.com/2026/08/03/seven-accused-in-iu-fraternity-hazing-case-after-two-phi-kappa-psi-pledges-hospitalized/ — “sent a group message instructing several fraternity members to delete texts”
Note: Attribute the conduct to police affidavits and court documents. Charges are allegations.

### C13 — “85% of Fortune 500 executives”
Claim: On-screen: “85% of Fortune 500 executives… belong to a fraternity or sorority.” Origin of this figure and whether any independent study supports it.
Verdict: UNVERIFIED
Correct figure / fact: The 85% figure circulated through North-American Interfraternity Conference and college Greek-life promotional materials by the early 2010s. A scholarly chapter tracing the statistic says its present accuracy is difficult to determine. I found no underlying dataset, sampling frame, date, or reproducible independent study supporting 85%. A 2003 Forbes review found approximately one-quarter of CEOs on the Forbes Super 500 list were fraternity members, a materially different population and result.
Source: https://www.igi-global.com/chapter/college-fraternal-organizations-offer-experiential-civic-learning-and-engagement-opportunities/285254 — “these statistics are credited to the NIC”; https://www.forbes.com/2003/01/31/cx_dd_0131frat.html — “about a quarter of all chief executives ... were members of college fraternities”
Note: Remove the 85% graphic or label it an old fraternity-industry promotional claim with no located independent validation.

### C14 — Cornell lawsuit filing date and court
Claim: Lawsuit filing date (sources say both Sept 14 and Sept 16, 2026) and court.
Verdict: PARTLY TRUE
Correct figure / fact: The complaint is dated/signed September 14, 2026. Reporting tied to the docket gives September 16, 2026 as the filing date. The case was filed in the Supreme Court of the State of New York, New York County. The safest on-air formulation is “a complaint dated September 14 and docketed September 16.”
Source: https://cornellseven.com/sources.html — “Filed September 14, 2026”; https://apnews.com/article/16f59e89ce97e3a40a8e672f7b3f374b — “filed the complaint Sept. 16”
Note: New York Supreme Court is the state trial court. Do not call it the U.S. Supreme Court or a federal court.

### C15 — Cornell’s 2024–25 actions
Claim: Cornell's 2024–25 actions: temporary suspension date, Title IX hearing date, sanctions (“expulsions and suspensions”), chapter closure. Cornell's statement on the essays claim.
Verdict: PARTLY TRUE
Correct figure / fact: Cornell placed the Chi Phi Xi chapter on immediate temporary suspension on November 8, 2024. Cornell publicly announced temporary suspensions of “a number of students” on November 26. The civil complaint alleges at least 12 hearings in May 2025; Cornell confirms a monthslong Title IX investigation and a multi-day faculty-and-staff hearing panel but has not publicly confirmed the count or exact dates. Cornell says sanctions included expulsions and suspensions and that the chapter closed in 2024 and remains barred. Cornell denies that any respondent received an essay as the sole consequence; it has not denied that essays may have been submitted as mitigation.
Source: https://www.cornellsun.com/article/2024/11/university-temporarily-suspends-several-students-amid-ongoing-chi-phi-criminal-investigation — “The fraternity was temporarily suspended on Nov. 8.”; https://www.cornellsun.com/article/2026/09/cornell-denies-that-defendants-in-alleged-chi-phi-gang-rape-only-wrote-essays-confirms-expulsions — “expulsions and suspensions were issued”; https://www.cornellsun.com/article/2026/09/cornell-releases-faq-on-alleged-chi-phi-gang-rape-contradicts-d-a — “essay-writing was not offered as a ‘sole consequence’”
Note: Present the May 2025 hearing count as an allegation from the complaint. Cornell’s narrower denial addresses “sole consequence,” leaving the mitigation-essay allegation unresolved.

### C16 — District attorney’s decision and reopening
Claim: DA Matthew Van Houten: the 2024 reason for declining charges; the reopening date; grand jury.
Verdict: CONFIRMED
Correct figure / fact: Van Houten says his office declined charges in November 2024 because the sworn statement it received did not establish forcible compulsion, unconsciousness/physical helplessness, or mental incapacitation caused by a drug administered without consent under New York law. He announced the reopened investigation on September 28, 2026, and said evidence would be presented to a Tompkins County grand jury after prosecutors determined appropriate charges.
Source: https://www.tompkinscountyny.gov/All-Departments/District-Attorney — “District Attorney statement regarding Jane Doe v. Cornell University, et al. (released 9/28/26)”; https://apnews.com/article/16f59e89ce97e3a40a8e672f7b3f374b — “his office will present evidence to a grand jury”
Note: This is the prosecutor’s account of the 2024 record. Later-reported interview transcripts contain statements that complicate his characterization. A planned grand-jury presentation is not an indictment.

### C17 — Snapchat evidence dispute
Claim: Cornell vs. DA dispute over whether the DA received the Snapchat screenshot.
Verdict: PARTLY TRUE
Correct figure / fact: Cornell’s September 30, 2026 FAQ states that CUPD shared all investigatory information with the district attorney in 2024, expressly including the Snapchat screenshot. Van Houten told ABC that his office had not received that image and later told CNN it was not part of the initial analysis, while acknowledging Cornell had sent it to his team. The opened public record does not resolve who received it, when, or whether prosecutors reviewing the case saw it.
Source: https://www.cornellsun.com/article/2026/09/cornell-releases-faq-on-alleged-chi-phi-gang-rape-contradicts-d-a — “shared ‘all investigatory information’ ... specifically naming ‘the Snapchat screenshot’”; https://transcripts.cnn.com/show/cg/date/2026-09-30/segment/01 — “we did not see them initially. They were not part of our initial analysis.”
Note: Say the transmission and review history is disputed. Avoid declaring that either institution lost or concealed the screenshot without documentary proof.

### C18 — Hochul and James reviews
Claim: Gov. Hochul's independent review (date, who conducts it) and AG Letitia James's review.
Verdict: PARTLY TRUE
Correct figure / fact: On September 29, 2026, Gov. Kathy Hochul called for outside counsel to conduct a transparent, independent review of Cornell’s response. On September 30, she said President Michael Kotlikoff had agreed. As of October 1, Cornell had not named the outside counsel. The office of Attorney General Letitia James separately confirmed that it was reviewing Cornell’s response; the scope and relationship between the two reviews remained unclear.
Source: https://www.cornellsun.com/article/2026/10/cornell-agrees-to-independent-review-alleged-chi-phi-gang-rape — “did not specify ... who will comprise the outside counsel”; https://apnews.com/article/22bbafb9a267323e4f02d275d915474b — “Hochul calls for an outside law firm to investigate Cornell's response”
Note: “Hochul ordered an investigation by [named firm]” is unsupported as of this check. “Cornell agreed to retain outside counsel after Hochul’s call” is current and precise.

### C19 — Cornell Daily Sun publication of names
Claim: The date the Cornell Daily Sun published the defendants' names.
Verdict: CONFIRMED
Correct figure / fact: The Cornell Daily Sun published all seven names in an editorial at 10:32 p.m. on September 21, 2026; the page records an update at 10:13 a.m. on September 22.
Source: https://www.cornellsun.com/article/2026/09/editorial-cornell-won-t-we-will — “Sep 21, 2026 10:32 pm · Updated Sep 22, 2026 10:13 am”
Note: Identify the item as an editorial, not a straight-news report. The men are civil defendants accused in a complaint; publication of their names does not establish liability or guilt.

### C20 — Charges and defendant statements
Claim: Any criminal charges filed as of today? Any defendant statements?
Verdict: CONFIRMED
Correct figure / fact: As of October 1, 2026, no criminal charges had been filed. The district attorney had announced a reopened investigation and intended grand-jury presentation. Attorney Jeremy Saland, speaking for defendant Scott Kretzschmar, said Kretzschmar was “completely innocent,” denied criminal conduct, and cited a hair-follicle test that he said showed no ketamine. Reporting also states that an attorney for one unnamed defendant denied the allegations in full and said no probable-cause finding had been made. I found no opened public statement from the other six defendants.
Source: https://www.axios.com/2026/09/30/cornell-rape-allegations-house-democratic-women-title-ix — “No criminal charges have been filed.”; https://www.aljazeera.com/features/2026/9/29/why-has-a-cornell-rape-investigation-been-reopened — “Kretzschmar took a hair follicle test that found he did not have the drug in his system”
Note: Attribute every defense assertion to counsel. A negative hair test addresses claimed drug exposure by that defendant; it does not resolve the assault allegations or the source of substances allegedly used by others.

## Verdict summary

| Claim | Verdict |
|---|---|
| C1 | UNVERIFIED |
| C2 | PARTLY TRUE |
| C3 | UNVERIFIED |
| C4 | PARTLY TRUE |
| C5 | CONTRADICTED |
| C6 | PARTLY TRUE |
| C7 | UNVERIFIED |
| C8 | CONFIRMED |
| C9 | CONFIRMED |
| C10 | CONTRADICTED |
| C11 | PARTLY TRUE |
| C12 | CONFIRMED |
| C13 | UNVERIFIED |
| C14 | PARTLY TRUE |
| C15 | PARTLY TRUE |
| C16 | CONFIRMED |
| C17 | PARTLY TRUE |
| C18 | PARTLY TRUE |
| C19 | CONFIRMED |
| C20 | CONFIRMED |
