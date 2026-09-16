
Research Status:
  Status: completed
  Task ID: 24206c2e-854b-4d8f-94cb-f9b17f60f9df
  Sources found: 61

Report:
# Perceptual, Cognitive, and Regulatory Dimensions of Synthetic Speech in 
Digital Media and E-Learning

The consumption of audio media—spanning podcasts, audiobooks, and digital 
educational environments—is experiencing a profound transformation driven by 
rapid advancements in voice synthesis technologies . Historically constrained by
mechanical, rule-driven concatenative frameworks, the digital audio market has 
transitioned to generative neural text-to-speech (NTTS) architectures . This 
shift has redefined industry cost structures and democratization, enabling 
independent creators and academic institutions to scale long-form auditory 
content . However, the deployment of synthetic voices introduces complex 
challenges at the intersection of media psychology, cognitive science, and 
digital law . Understanding how listeners perceive, comprehend, and engage with 
AI-generated narration requires a multi-dimensional analysis of the acoustic 
parameters that trigger the uncanny valley, the cognitive mechanisms underlying 
learning outcomes, the psychological biases activated by AI disclosure labels, 
and the emerging regulatory frameworks designed to protect personal vocal 
identities .

---

## The Generative Audio Landscape and Market Dynamics

The global text-to-speech market passed \$4.8 billion in 2026 and continues to 
grow at a compound annual growth rate (CAGR) of 22.4%, driven by the widespread 
integration of neural voices across diverse media sectors . The technical 
transition from legacy systems to deep learning-based generative speech has been
marked by several key industry milestones . In late 2022 and early 2023, Apple 
Books introduced digital narration for select English-language titles, marketing
the voices as "naturally sounding" representations of human speech . Despite 
some initial audience skepticism regarding their emotional range, this 
initiative established synthetic narration as a viable option for publishing . 
By September 2024, Google introduced its "Audio Overviews" feature in 
NotebookLM, generating highly naturalistic, bantering dialogues between two AI 
hosts that quickly went viral on social platforms, demonstrating the potential 
for synthetic voices to mimic conversational pacing and humor . In February 
2025, ElevenLabs launched its ElevenReader Publishing platform, allowing authors
and publishers to generate high-fidelity audiobooks from ePub and PDF formats, 
lowering the financial barriers to entry for smaller, independent creators .

This rapid technological evolution has shifted public openness to AI narration .
A major industry study conducted in May 2026 by Edison Research and SSRS 
evaluated fiction audiobook listeners in a blind listening test . Prior to 
hearing the samples, only 31% of the surveyed listeners indicated a willingness 
to consume AI-narrated audiobooks . However, after listening to the clips 
without knowing which were artificially generated, that willingness rose to 65% 
. The study revealed that multicast AI narration—which utilizes multiple 
distinct neural voices to simulate a full-cast performance—received a 61% 
favorable rating, compared to only 53% for single-narrator human recordings . 
Furthermore, 61% of the listeners believed the AI voices were human, 
highlighting how modern generative systems have successfully replicated natural 
vocal attributes .

| Milestone Date | Platform / Initiative | Primary Technological Feature | 
Industry and Perceptual Impact |
| :--- | :--- | :--- | :--- |
| **Late 2022 / Early 2023** | Apple Books AI Narration  | Natural-sounding 
digital voices . | Initial publisher-led deployment; met with mild audience 
skepticism regarding emotional expressiveness . |
| **September 2024** | Google NotebookLM Audio Overviews  | Dual-host 
conversational banter, natural pacing, and colloquial intonation . | Achieved 
viral public reach; proved that neural systems could simulate spontaneous human 
dialogue . |
| **February 2025** | ElevenLabs ElevenReader Publishing  | High-fidelity 
ePub-to-audiobook pipeline with scalable neural voice cloning . | Democratized 
audiobook production; minimized studio costs for independent authors . |
| **May 2026** | Edison Research & SSRS Audiobook Survey  | Blind-test 
evaluation of multicast AI narration vs. single human narrators . | Revealed 
that blind listeners preferred multicast AI over single human narrators on 
engagement ($58\%$ vs. $49\%$) . |

---

## Cognitive Processing and Pedagogical Efficacy in E-Learning

In the domain of e-learning and educational technology, researchers have 
scrutinized the cognitive implications of utilizing synthetic speech . 
Multimedia design frameworks have long relied on the Voice Principle, derived 
from Social Agency Theory, which posits that people learn better when 
instructions are delivered by a human voice rather than a machine-generated 
voice . This theory suggests that a natural human voice conveys rich social cues
that prompt the brain to treat the learning process as a conversational 
interaction, thereby encouraging deeper cognitive processing and superior 
transfer performance . Early text-to-speech engines lacked these social cues, 
inducing extraneous cognitive load as the brain struggled to decode unnatural 
phrasing and mechanical pauses .

However, the transition to modern neural text-to-speech (NTTS) engines has 
challenged the absolute validity of the Voice Principle . Recent comparative 
studies show that learners receiving instruction via modern neural voices do not
display statistically significant differences in retention, transfer scores, or 
perceived cognitive load compared to those taught by recorded human voices . 
This suggests that generative neural speech has successfully overcome the 
intelligibility and prosodic limitations that previously hindered cognitive 
processing . This equivalence is highly beneficial for global e-learning 
platforms, as NTTS allows systems to dynamically localize and translate course 
materials into hundreds of languages while maintaining a consistent 
instructional tone through voice cloning .

Despite these advancements, synthetic speech still displays notable limitations 
in complex educational contexts . A systematic review examining the application 
of text-to-speech in language and professional education notes that neural 
voices often struggle to convey highly nuanced emotional states, such as irony, 
sarcasm, or subtle academic skepticism . Furthermore, learners sometimes report 
a perceived lack of authenticity when listening to synthetic voices compared to 
their actual instructors' speech . Because of these limitations, researchers 
suggest that NTTS is best utilized as a scalable prelearning or supplementary 
tool . Within optimized dental hygiene curricula, strong positive correlations 
have been documented among cognitive outcomes, effective learning, and overall 
learning satisfaction ($r = 0.94\text{--}0.95, p < 0.01$) when NTTS is deployed 
alongside active, multimodal student engagement .

The cognitive impact of synthetic educational speech is also mediated by accent 
and demographic factors . Historical research, such as Gill (2013), demonstrated
that foreign-accented human speech often yielded lower learning outcomes and 
poorer instructor evaluations because of increased cognitive processing demands 
. Modern NTTS platforms bypass this challenge by generating regional synthetic 
accents (e.g., British English, US English, Indian English) to match local 
student populations . Interestingly, experimental data reveal that learner 
gender interacts with these synthetic accents to influence both comprehension 
and social perception . For instance, a foreign-accented synthetic voice 
significantly affected the objective learning performance of female university 
students, while male university students remained unaffected, demonstrating that
demographic factors modulate how learners process machine-synthesized speech .

---

## Acoustic Correlates of Trust and the Uncanny Valley

The psychology of vocal perception suggests that listeners form 
near-instantaneous judgments of a speaker's identity, competence, and 
trustworthiness based on brief acoustic cues . When navigating synthetic 
interactions, however, subtle acoustic anomalies can trigger the vocal uncanny 
valley—a feeling of cognitive discomfort and eeriness that occurs when an 
artificial voice sounds almost human, but retains minor unnatural features .

Physiologically, human voice production features continuous, micro-acoustic 
instabilities . Two of the primary parameters tracking these micro-perturbations
are:

$$\text{Jitter} = \frac{1}{N-1} \sum_{i=1}^{N-1} |T_i - T_{i+1}|$$

which quantifies cycle-to-cycle variation in fundamental frequency ($F0$) , and:

$$\text{Shimmer} = \frac{1}{N-1} \sum_{i=1}^{N-1} |A_i - A_{i+1}|$$

which measures cycle-to-cycle amplitude fluctuations . In natural human speech, 
these micro-perturbations convey subtle cues about a speaker's emotional state, 
authenticity, and health . Early and intermediate voice synthesis tools often 
generated perfectly uniform waveforms that lacked these micro-perturbations . 
This hyper-clean, acoustic perfection is perceived by the human auditory system 
as sterile, robotic, or uncanny .

To understand how these parameters affect human evaluation, a rigorous study 
compared human speech against an advanced autoregressive Transformer model 
(Seed-TTS) across five distinct emotional states: happy, sad, angry, neutral, 
and fear . 

| Evaluated Parameter | Recorded Human Speech | Neural AI Speech (Seed-TTS) | 
Statistical / Correlational Metrics |
| :--- | :--- | :--- | :--- |
| **Overall Emotion Recognition** | $M = 79.82\%, SD = 40.15\%$  | $M = 72.65\%,
SD = 44.60\%$  | $t(1898) = 3.672, p < .001$ ($d = 0.169$) . |
| **Fear Recognition Accuracy** | $69.47\%$  | $61.08\%$  | The gap reflects the
difficulty of synthesizing subtle, low-arousal vocal fear . |
| **Sadness Recognition Accuracy** | $81.87\%$  | $69.85\%$  | Points to human 
acoustic superiority in low-arousal, emotionally complex states . |
| **Perceived Naturalness** | $M \approx 5.50$ (on a 7-point scale)  | $M 
\approx 4.00$ (on a 7-point scale)  | $t = 65.039, p < .001$; human speech was 
rated as significantly more natural . |
| **Jitter vs. Naturalness Correlation** | Highly present and variable  | Often 
suppressed in raw models  | $r \approx 0.73, p < .001$; strong positive 
correlation with humanlike ratings . |
| **Shimmer vs. Naturalness Correlation** | Highly present and variable  | Often
suppressed in raw models  | $r \approx 0.76, p < .001$; confirms that 
micro-instabilities enhance vocal realism . |

The findings demonstrate that while high-arousal emotions such as anger and 
happiness approach similar recognition rates between AI and human speakers, the 
AI model falls short in low-arousal emotions . Furthermore, principal component 
analysis shows that vocal expressiveness in human speech directly predicts its 
social appeal . For synthetic speech, however, the correlation between 
expressiveness and social appeal is weak . As an AI voice increases its 
expressiveness, the gap in social appeal between it and a human voice actually 
widens, indicating that highly expressive but micro-acoustically flat synthetic 
voices can feel uncanny or insincere to listeners .

Despite these acoustic challenges, modern text-to-speech can offer distinct 
cognitive advantages under certain environmental and physiological conditions . 
For example, organic voice disorders such as hoarseness are highly prevalent 
among professional speakers, affecting up to 41% of university professors . 
Listening to a hoarse human speaker increases cognitive listening effort, 
triggers listener annoyance, and impairs overall information recall—especially 
in environments with poor room acoustics or adverse signal-to-noise ratios 
(SNRs) . Similarly, speech transmission errors or background noise in digital 
media can hinder dialogue comprehension . In these contexts, using 
high-fidelity, consistent, and noise-free neural synthetic voices can bypass the
cognitive strain associated with hoarse human speakers, improving overall 
accessibility and comprehension .

Additionally, the use of synthetic speech within e-learning can sometimes 
resolve the uncanny valley effect . Craig and Schroeder (2017) hypothesized that
when a highly realistic human voice is paired with a visually stylized, virtual 
pedagogical agent, the visual-auditory mismatch creates cognitive dissonance, 
leading to reduced learning outcomes . By utilizing a high-quality synthetic 
voice that matches the virtual visual aesthetic of the agent, developers can 
avoid this sensory mismatch, lowering cognitive load and improving learning 
retention .

---

## Human-Agent Interaction and Reciprocal Self-Disclosure

As conversational AI systems and voice agents become more integrated into daily 
life, researchers are exploring how vocal attributes influence trust in 
long-term human-agent interactions . Applying the Computers Are Social Actors 
(CASA) paradigm, studies show that humans apply social expectations to 
voice-based agents . One area of exploration involves the reciprocal 
self-disclosure effect . Based on Altman and Taylor's Social Penetration Theory 
(1973), human relationships develop through mutual information sharing . When 
applied to human-agent interaction, experiments show that when an AI voice 
assistant utilizes self-disclosure strategies (e.g., sharing a simulated 
personal preference or opinion), it significantly enhances the user's perception
of the agent's warmth . This increased warmth helps lower user risk perceptions,
prompting users to reciprocate by sharing more information with the system .

This dynamic is further influenced by the voice assistant's vocal 
characteristics . Female-gendered voice assistants have been shown to enhance 
users' perceptions of both warmth and competence, which in turn increases users'
intentions to share information . Furthermore, AI voice assistants can reduce 
self-disclosure anxiety and impression management behaviors compared to human 
interlocutors . This unique dynamic is particularly valuable in low-stakes or 
sensitive application domains, such as healthcare intake or mental health 
support . 

To evaluate these voice-based interactions, platforms track metrics such as 
toxicity, fairness, and trust . Users often cite "inhuman speed" or unnatural 
turn-taking cues as signs of insincerity or unfairness, highlighting the need 
for dynamic latency controls and natural pacing in conversational AI .

---

## Psychological Mechanics of AI Disclosure and the Credibility Paradox

As regulatory bodies mandate clear labeling for synthetic media, researchers 
have examined the psychological impacts of these transparency cues . This area 
of study distinguishes between the direct disclosure effect (the psychological 
impact of labels on the audience) and the indirect disclosure effect (how the 
anticipation of a label changes creator behavior) .

### The Direct Disclosure Effect and the Credibility Paradox

The Persuasion Knowledge Model posits that when a consumer encounters an AI 
disclosure label (e.g., "AI-Generated Voice"), it triggers a cognitive defense 
mechanism known as persuasion knowledge, prompting skepticism, counterarguing, 
and resistance . In interpersonal communication, labeling an emotionally 
expressive voice as "AI" causes a drop in perceived authenticity, empathy, and 
behavioral compliance . For example, studies using identical audio clips showed 
that participants informed that a voice was "human" exhibited significantly 
higher trust, empathy, and compliance rates (such as charitable donations and 
advice-following) than those told the voice was "AI" . This identity labeling 
effect is particularly pronounced for high-arousal negative speech, such as 
anger, and less pronounced for sad or happy clips .

| Experimental Variable | "Human" Label Group | "AI" Label Group | Statistical 
Findings and Effect Sizes  |
| :--- | :--- | :--- | :--- |
| **Compliance Rates (Donations & Advice)** | Significantly higher compliance 
and social engagement . | Measurably lower donation and advice-following rates .
| Identity labeling accounted for the largest variance in behavioral compliance 
. |
| **Trust for Angry Speech** | Rated as significantly more authentic and 
trustworthy . | Sharp decline in trust and perceived authenticity . | Produced 
the largest labeling effect size (Cohen's $d = 1.365$) . |
| **Trust for Sad Speech** | Moderately higher trust ratings . | Moderate 
reduction in trust and empathy . | Showed a moderate labeling effect (Cohen's $d
= 0.733$) . |
| **Trust for Happy Speech** | Sparing gains in trust and emotional appeal . | 
Minor reductions in trust ratings . | Yielded a smaller labeling effect (Cohen's
$d = 0.572$) . |
| **Veracity Verification (Correct Info)** | Evaluated as highly credible 
($\beta = 0.209$) . | Credibility penalty; lower perceived accuracy . | 
Significant interaction effect ($p < .001$); label acts as a negative heuristic 
. |
| **Veracity Verification (Misinformation)** | Evaluated as standard 
misinformation . | Machine premium ($\beta = -0.922$) . | Machine heuristic 
inflates credibility of false factual claims . |

This labeling penalty is further complicated in scientific and news 
communication, where AI disclosure triggers a **truth-falsity crossover effect**
. A within-subjects experimental design ($N = 433$) evaluating how AI disclosure
labels interact with content veracity on social media uncovered a stark paradox 
:

* **The Correct Information Penalty:** For correct scientific information, the 
presence of an AI disclosure label significantly *reduced* perceived credibility
compared to identical correct information presented without a label ($\beta = 
0.209, p < .001$) .
* **The Misinformation Premium:** For misinformation, the presence of an AI 
disclosure label significantly *increased* perceived credibility compared to 
misinformation presented without a label ($\beta = -0.922, p < .001$) .

This crossover effect indicates that AI disclosure acts as a double-edged cue . 
According to the MAIN Model, AI labels activate a **machine heuristic** . This 
cognitive shortcut leads users to view the AI as an objective, highly logical, 
and data-driven entity that is free from human bias and emotional error . 
Consequently, when misinformation is labeled as "AI-generated," this machine 
heuristic inflates the perceived truthfulness of the false claim, validating the
misinformation . At the same time, the label diminishes human agency cues—such 
as expert authority, personal accountability, and nuanced communicative 
warmth—which are critical for establishing the credibility of correct scientific
assertions .

Pre-existing attitudes toward AI also play a critical moderating role in this 
crossover effect . The construct of NATAI (Negative Attitudes Toward Artificial 
Intelligence) represents a predispositional skepticism toward AI systems . 
Studies show that stronger negative attitudes consistently amplify the 
credibility penalty that disclosure imposes on correct information ($\beta = 
-0.205$ for Topic 1, and $\beta = -0.175$ for Topic 2, $p < .05$) . This 
indicates that algorithm aversion biases are activated, and skeptical consumers 
transfer their negative attitudes directly onto the labeled scientific content .
For misinformation, the moderating effect of NATAI is topic-dependent; while 
disclosure generally increases the credibility of misinformation, this effect is
weaker among individuals with high NATAI scores .

These dynamics are also visible in commercial marketing . AI authorship of 
emotional content reduces consumer attitudes, word-of-mouth, and brand loyalty 
due to a dual-pathway model driven by reduced perceived authenticity and 
heightened moral disgust . Furthermore, Grigsby et al. (2025) documented a 
notable consumer paradox: while 75% of consumers support mandatory AI disclosure
as a matter of principle, actual disclosure labels reduce their trust in the 
advertised services . This trust penalty is especially severe in cause-related 
marketing campaigns, where consumers maintain heightened expectations of human 
sincerity .

### The Indirect Disclosure Effect

Mandatory disclosure regulations also exert a powerful **indirect disclosure 
effect** on the content creators themselves . Applying Erving Goffman's 
sociological theories of impression management, creators who anticipate that 
their work must be labeled with an "AI-generated" or "AI-assisted" tag 
experience a threat to their professional and creative identity . They fear that
audiences will not recognize their human creative agency and will dismiss their 
work as effortless computation . 

Consequently, rather than striving for a balanced human-AI collaboration, the 
majority of creators withdraw from the creative process, delegating the work 
entirely to the generative AI system . This self-preservation response results 
in a self-fulfilling loop: the final output reflects purely algorithmic 
generation, lacks human creative nuance, and is ultimately evaluated poorly by 
audiences—regardless of the disclosure label itself .

---

## Regulatory Frameworks and Legal Protections for Vocal Identity

Because an individual's voice is deeply tied to personal identity, professional 
livelihood, and self-expression, the rapid advancement of voice cloning tools 
has prompted swift legislative and judicial action . Globally, legal systems are
establishing frameworks to protect vocal likeness from unauthorized commercial 
exploitation and deceptive replication .

### The Ensuring Likeness Voice and Image Security (ELVIS) Act

Tennessee, a central hub for the American music and voice acting industries, 
enacted the ELVIS Act (effective July 1, 2024), representing a major milestone 
in right-of-publicity legislation . The ELVIS Act repeals and replaces the older
Personal Rights Protection Act of 1984, explicitly adding a person's "voice" to 
the protected categories of name, photograph, and likeness . 

Crucially, the ELVIS Act defines voice as "a sound in a medium that is readily 
identifiable and attributable to a particular individual, regardless of whether 
the sound contains the actual voice or a simulation of the voice of an 
individual" . This definition targets the core challenge of generative voice 
cloning: it prohibits not only the unauthorized copying of actual audio 
recordings, but also the algorithmic generation of simulations that sound like a
specific individual . The act establishes voice as an exclusive property right 
that is descendible and assignable, protecting these rights post-mortem, but 
terminating them if an executor or heir fails to commercially exploit the voice 
for a continuous period of two years after an initial ten-year post-mortem 
period .

### The Nurture Originals, Foster Art, and Keep Entertainment Safe (NO FAKES) 
Act

At the United States federal level, the NO FAKES Act (S. 4591) advanced 
unanimously out of the Senate Judiciary Committee on June 18, 2026 . Backed by 
an unprecedented coalition of media conglomerates, labor unions, and major 
technology firms (including SAG-AFTRA, the Recording Academy, the MPA, YouTube, 
OpenAI, and Disney), the bill aims to establish a uniform federal right over 
personal likeness and vocal identity .

1. **Federal Property Right:** The bill establishes a federal property right 
giving every individual—not just public figures—the right to control the 
commercial use and distribution of their voice and visual likeness in digital 
replicas .
2. **Platform and Producer Liability:** The act holds individuals and companies 
civilly liable for producing or distributing unauthorized digital replicas . 
Online platforms are liable if they host unauthorized replicas with knowledge of
their non-consensual nature .
3. **Notice-and-Takedown Architecture:** Borrowing heavily from the Digital 
Millennium Copyright Act (DMCA) framework, the bill creates a standardized 
notice-and-takedown system . Rights-holders can issue takedown demands to 
platforms, which must quickly remove the offending content . To prevent abuse, 
anyone who knowingly files a fraudulent counter-notification faces a statutory 
penalty of \$25,000 or actual damages plus attorney fees .
4. **Post-Mortem Protection:** The bill extends vocal protection beyond the 
creator's lifetime, allowing heirs and executors to manage and enforce these 
rights for up to 70 years post-mortem .
5. **First Amendment Balancing and State Preemption:** To preserve artistic 
expression, the act carves out exclusions for news reporting, parody, satire, 
criticism, and non-commercial academic research . Additionally, it preempts 
future state-level digital replica laws to establish a consistent nationwide 
legal landscape, while preserving existing state statutes such as Tennessee's 
ELVIS Act .

---

## Strategic Recommendations for Content Developers and Platforms

The convergence of technological advancement, cognitive perception, 
psychological response, and legislative regulation necessitates a structured 
approach to utilizing synthetic speech . Publishers, educators, and technology 
developers must balance innovation with ethical accountability to maintain 
listener trust and ensure successful comprehension outcomes .

For audio publishers and podcasters, optimizing listener engagement requires a 
careful formatting approach . Because blind-testing has demonstrated that 
multicast AI narration yields higher engagement and favorability ratings than 
single-narrator human recordings, publishers should utilize multicast 
configurations to enhance narrative immersion, particularly in fiction and 
multi-character storytelling . Furthermore, developers should utilize regional 
accent matching for commercial and promotional content, as matching a synthetic 
voice's accent to the listener's demographic region has been shown to increase 
recommendations threefold . To address initial user hesitation and algorithm 
aversion, platforms should offer short, high-fidelity sample previews . This 
exposure can help normalize the technology for listeners, raising their eventual
willingness to engage with the content .

For educational content designers, synthetic speech should be integrated as a 
highly structured, supplementary tool rather than a passive, text-to-speech 
reading device . Since neural text-to-speech achieves learning outcomes and 
cognitive efficiency equivalent to human instruction, developers can confidently
use neural voices to scale course production and dynamically translate lessons .
However, to foster sustained engagement and higher-order cognitive processing, 
NTTS should be paired with active learning elements, such as synchronized text 
highlighting and interactive check-ins, which leverage dual coding mechanics to 
improve retention . Additionally, to minimize both intrinsic and extraneous 
cognitive load, educational designers should calibrate synthetic voices to 
express moderate levels of natural enthusiasm, rather than flat, monotonic tones
.

For voice synthesis developers and platform administrators, minimizing the 
uncanny valley requires focus on fine-grained acoustic modeling . Generative 
neural speech platforms must deliberately incorporate natural 
micro-perturbations—specifically cycle-to-cycle frequency variations (jitter) 
and amplitude fluctuations (shimmer)—as these instabilities strongly predict 
humanlike realism and social appeal . Models that generate perfectly uniform, 
sanitized waveforms should be calibrated to reproduce these biological 
irregularities . Additionally, to prevent the truth-falsity crossover effect 
where simple disclosures can inadvertently validate misinformation and penalize 
correct information, platforms should design nuanced, contextual labeling 
strategies . Disclosures should clearly distinguish between fully automated 
synthetic content, human-AI collaborative speech, and cloned voices, helping 
listeners contextualize the content and avoid misapplying cognitive shortcuts . 
Finally, to remain compliant with emerging laws like Tennessee's ELVIS Act and 
the federal NO FAKES Act, platforms must build robust voice verification 
pipelines and secure licensing frameworks . These steps ensure that vocal 
cloning technologies are deployed ethically, preserving creator consent and 
protecting personal intellectual property .

---

1. AI Voice Acting: How AI Is Transforming Voice Creation & Storytelling, 
(https://arrevoice.com/blog/ai-voice-acting/)
2. Voice AI, authenticity and media: share your views on AI-Generated voices - 
ADM+S Centre, 
(https://www.admscentre.org.au/voice-ai-authenticity-and-media-share-your-views-
on-ai-generated-voices/)
3. AI at the microphone: The voice of the future? – Digital Society Blog, 
(https://www.hiig.de/en/ai-at-the-microphone/)
4. Traditional TTS vs AI Text-to-Speech: How Neural Voices Changed Voice 
Generation, 
(https://medium.com/@yunying0082/traditional-tts-vs-ai-text-to-speech-how-neural
-voices-changed-voice-generation-f85276e661e0)
5. Neural text to speech (TTS) explained: How AI voices work - ElevenLabs, 
(https://elevenlabs.io/blog/neural-text-to-speech-tts)
6. (PDF) Audiobooks and Artificial Intelligence: Tools for Synthetic Audiobook 
Creation and Implications for the Publishing Industry - ResearchGate, 
(https://www.researchgate.net/publication/397623286_Audiobooks_and_Artificial_In
telligence_Tools_for_Synthetic_Audiobook_Creation_and_Implications_for_the_Publi
shing_Industry)
7. Top Use Cases for Text-to-Speech in E-Learning and Education - CAMB.AI, 
(https://www.camb.ai/blog/use-cases-for-tts-in-e-learning-and-education)
8. (PDF) Text-to-Speech Software and Learning: Investigating the Relevancy of 
the Voice Effect - ResearchGate, 
(https://www.researchgate.net/publication/327795958_Text-to-Speech_Software_and_
Learning_Investigating_the_Relevancy_of_the_Voice_Effect)
9. Visible sources and invisible risks: exploring the impact of AI disclosure on
perceived credibility of AI-generated content - Journal of Science 
Communication, (https://jcom.sissa.it/article/pubid/JCOM_2501_2026_A09/)
10. How do voice acoustics affect the perceived trustworthiness of a speaker? A 
systematic review - Frontiers, 
(https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.149
5456/full)
11. Senate Committee Advances Bill to Protect Name, Image, Likeness and Voice 
Against Unauthorized AI Use | Insights | Holland & Knight, 
(https://www.hklaw.com/en/insights/publications/2026/06/senate-judiciary-committ
ee-advances-legislation-to-protect-name)
12. AI Voices BEAT Human Narrators in Blind Audiobook Test - YouTube, 
(https://www.youtube.com/watch?v=fcLlRU990sc)
13. Listeners prefer AI voices, claim two studies | Podnews Daily - Metacast, 
(https://metacast.app/podcast/podnews-daily-podcast-industry-and-podcasting-news
/gnrb9IAH/listeners-prefer-ai-voices-claim-two-studies/box3fJRg)
14. The Application of Text-to-Speech Technology in Language Learning: A 
Systematic Review, 
(https://www.researchgate.net/publication/368486299_The_Application_of_Text-to-S
peech_Technology_in_Language_Learning_A_Systematic_Review)
15. The Learning Science Behind Text-to-Speech's Impact on Digital Learning - 
ReadSpeaker, 
(https://www.readspeaker.com/blog/learning-science-text-to-speech-digital-educat
ion/)
16. Principles Based on Social Cues in Multimedia Learning - ResearchGate, 
(https://www.researchgate.net/publication/359588354_Principles_Based_on_Social_C
ues_in_Multimedia_Learning)
17. Principles Based on Social and Affective Features of Multimedia Learning 
(Part VI), 
(https://www.cambridge.org/core/books/cambridge-handbook-of-multimedia-learning/
principles-based-on-social-and-affective-features-of-multimedia-learning/B8B1F71
6655BBB83DC6165488C0D2F64)
18. I am Alexa, your virtual tutor!: The effects of Amazon Alexa's 
text-to-speech voice enthusiasm in a multimedia learning environment - PMC, 
(https://pmc.ncbi.nlm.nih.gov/articles/PMC9361884/)
19. Mayer's Principles for AI Course Video (2026) - X-Pilot, 
(https://www.x-pilot.ai/blog/mayer-multimedia-learning-principles-ai-video)
20. How Voice Works in Learning | Narration as a Social Cue - eduKate Singapore,
(https://edukatesg.com/2026/09/11/how-voice-works-in-learning-why-narration-is-a
-social-cue-not-just-sound/)
21. Designing Virtual Pedagogical Agents and Mentors for Extended Reality - 
Tiffany D. Do, 
(https://zyrcant.github.io/publication/do-designing-2021/do-designing-2021.pdf)
22. Designing Virtual Pedagogical Agents and Mentors for Extended Reality | 
Request PDF, 
(https://www.researchgate.net/publication/355894114_Designing_Virtual_Pedagogica
l_Agents_and_Mentors_for_Extended_Reality)
23. How do voice acoustics affect the perceived trustworthiness of a speaker? A 
systematic review - PMC, (https://pmc.ncbi.nlm.nih.gov/articles/PMC11931160/)
24. Perceiving emotion in human and AI voices: sensitivity to acoustic cues in 
Korean speech, 
(https://www.researchgate.net/publication/399312963_Perceiving_emotion_in_human_
and_AI_voices_sensitivity_to_acoustic_cues_in_Korean_speech)
25. Interactive Communication — cross-disciplinary perspectives from psychology,
acoustics, and media technology - arXiv, (https://arxiv.org/html/2512.04692v1)
26. Closing the Naturalness Gap in AI Voice Agents | by Kartikay Thakur, 
(https://medium.com/@sky.kartikay/closing-the-naturalness-gap-in-ai-voice-agents
-3dc544248025)
27. Investigating Emotional Prosody, Authenticity, and Trust in AI vs. Human 
Voices" by - eScholarship.org, 
(https://escholarship.org/content/qt8vr8s6h8/qt8vr8s6h8.pdf?v=lg)
28. Research on the Impact of an AI Voice Assistant's Gender and Self-Disclosure
Strategies on User Self-Disclosure in Chinese Postpartum Follow-Up Phone Calls -
MDPI, (https://www.mdpi.com/2076-328X/15/2/184)
29. Complete Guide to Text-to-Speech (TTS) Technology (2026) - Picovoice, 
(https://picovoice.ai/blog/complete-guide-to-text-to-speech/)
30. Superhuman AI Disclosure: Impacts on Toxicity, Fairness, and Trust Vary by 
Expertise and Persona Attributes - arXiv, (https://arxiv.org/html/2503.15514v1)
31. "Crossing the uncanny valley of conversational voice" post by Sesame - 
realtime conversation audio model rivalling OpenAI : r/LocalLLaMA - Reddit, 
(https://www.reddit.com/r/LocalLLaMA/comments/1j00v4y/crossing_the_uncanny_valle
y_of_conversational/)
32. When news is “written by artificial intelligence”: a systematic review of 
provenance and disclosure cues in journalism and their effects on credibility 
and trust - PMC, (https://pmc.ncbi.nlm.nih.gov/articles/PMC13183635/)
33. Visible sources and invisible risks: exploring the impact of AI disclosure 
on perceived credibility of AI-generated content - ResearchGate, 
(https://www.researchgate.net/publication/401762306_Visible_sources_and_invisibl
e_risks_exploring_the_impact_of_AI_disclosure_on_perceived_credibility_of_AI-gen
erated_content)
34. The Indirect Disclosure Effect: How Disclosing Generative AI Use Impacts 
Human Creative Collaboration with AI | Information Systems Research - 
PubsOnLine, (https://pubsonline.informs.org/doi/10.1287/isre.2024.0951)
35. Consumer Trust in AI-Generated Marketing Content: A Systematic Literature 
Review and Research Agenda, 
(https://americanimpactreview.com/articles/e2026024.pdf)
36. NO FAKES Act Passes Senate: What Voice AI Businesses Must Do, 
(https://enterprisedna.co/resources/news/no-fakes-act-senate-committee-voice-ai-
likeness-2026/)
37. What is the Elvis Act? AI Likeness Law Explained (2026) - Atlan, 
(https://atlan.com/know/data-governance/elvis-ai-act/)
38. Tennessee Governor Signs Into Law First-of-its-Kind Bill Addressing AI 
Misappropriation Of Voices, Images, And Songs, 
(https://www.beneschlaw.com/insight/tennessee-governor-signs-into-law-first-of-i
ts-kind-bill-addressing-ai-misappropriation-of-voices-images-and-songs/)
39. PHOTOS: Gov. Lee Signs ELVIS Act Into Law - TN.gov, 
(https://www.tn.gov/governor/news/2024/3/21/photos--gov--lee-signs-elvis-act-int
o-law.html)
40. The ELVIS Act: Setting the Stage for Policing Unauthorized Use of 
AI-Generated Sound and Likeness | Wilson Sonsini, 
(https://www.wsgr.com/en/insights/the-elvis-act-setting-the-stage-for-policing-u
nauthorized-use-of-ai-generated-sound-and-likeness.html)
41. ELVIS Act text (PDF). Tennessee passes law to stop AI deepfakes of voice, in
addition to name, photograph, likeness, 
(https://chatgptiseatingtheworld.com/2024/03/22/elvis-act-text-pdf-tennessee-pas
ses-law-to-stop-ai-deepfakes-of-voice-in-addition-to-name-photograph-likeness/)
42. Senate Judiciary advances NO FAKES Act on unanimous vote - S&P Global, 
(https://www.spglobal.com/market-intelligence/en/news-insights/articles/2026/6/s
enate-judiciary-advances-no-fakes-act-on-unanimous-vote-103007539)
43. NO FAKES Act Passes Senate Judiciary Committee By Unanimous Voice Vote - 
Grammy, 
(https://www.grammy.com/news/no-fakes-act-passes-senate-judiciary-committee/)
44. New podcast: Do synthetic voices work in interactions with public 
authorities?, 
(https://cc.au.dk/en/news-and-events/news/single-news/artikel/ny-podcast-fungere
r-robotstemmer-i-moedet-med-myndighederne)


Discovered Sources:
  [0] Perceptual, Cognitive, and Regulatory Dimensions of Synthetic Speech in 
Digital Media and E-Learning
  [1] Voice AI, authenticity and media: share your views on AI-Generated voices 
- ADM+S Centre
      https://www.admscentre.org.au/voice-ai-authenticity-and-media-share-your-v
iews-on-ai-generated-voices/
  [2] Visible sources and invisible risks: exploring the impact of AI disclosure
on perceived credibility of AI-generated content - Journal of Science 
Communication
      https://jcom.sissa.it/article/pubid/JCOM_2501_2026_A09/
  [3] (PDF) Text-to-Speech Software and Learning: Investigating the Relevancy of
the Voice Effect - ResearchGate
      https://www.researchgate.net/publication/327795958_Text-to-Speech_Software
_and_Learning_Investigating_the_Relevancy_of_the_Voice_Effect
  [4] How do voice acoustics affect the perceived trustworthiness of a speaker? 
A systematic review - Frontiers
      https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.202
5.1495456/full
  [5] (PDF) Audiobooks and Artificial Intelligence: Tools for Synthetic 
Audiobook Creation and Implications for the Publishing Industry - ResearchGate
      https://www.researchgate.net/publication/397623286_Audiobooks_and_Artifici
al_Intelligence_Tools_for_Synthetic_Audiobook_Creation_and_Implications_for_the_
Publishing_Industry
  [6] AI Voices BEAT Human Narrators in Blind Audiobook Test - YouTube
      https://www.youtube.com/watch?v=fcLlRU990sc
  [7] Investigating Emotional Prosody, Authenticity, and Trust in AI vs. Human 
Voices" by - eScholarship.org
      https://escholarship.org/content/qt8vr8s6h8/qt8vr8s6h8.pdf?v=lg
  [8] How Voice Works in Learning | Narration as a Social Cue - eduKate 
Singapore
      https://edukatesg.com/2026/09/11/how-voice-works-in-learning-why-narration
-is-a-social-cue-not-just-sound/
  [9] I am Alexa, your virtual tutor!: The effects of Amazon Alexa's 
text-to-speech voice enthusiasm in a multimedia learning environment - PMC
      https://pmc.ncbi.nlm.nih.gov/articles/PMC9361884/
  [10] Designing Virtual Pedagogical Agents and Mentors for Extended Reality - 
Tiffany D. Do
      https://zyrcant.github.io/publication/do-designing-2021/do-designing-2021.
pdf
  [11] AI at the microphone: The voice of the future? – Digital Society Blog
      https://www.hiig.de/en/ai-at-the-microphone/
  [12] Senate Committee Advances Bill to Protect Name, Image, Likeness and Voice
Against Unauthorized AI Use | Insights | Holland & Knight
      https://www.hklaw.com/en/insights/publications/2026/06/senate-judiciary-co
mmittee-advances-legislation-to-protect-name
  [13] Traditional TTS vs AI Text-to-Speech: How Neural Voices Changed Voice 
Generation
      https://medium.com/@yunying0082/traditional-tts-vs-ai-text-to-speech-how-n
eural-voices-changed-voice-generation-f85276e661e0
  [14] Neural text to speech (TTS) explained: How AI voices work - ElevenLabs
      https://elevenlabs.io/blog/neural-text-to-speech-tts
  [15] Top Use Cases for Text-to-Speech in E-Learning and Education - CAMB.AI
      https://www.camb.ai/blog/use-cases-for-tts-in-e-learning-and-education
  [16] The Application of Text-to-Speech Technology in Language Learning: A 
Systematic Review
      https://www.researchgate.net/publication/368486299_The_Application_of_Text
-to-Speech_Technology_in_Language_Learning_A_Systematic_Review
  [17] The Learning Science Behind Text-to-Speech's Impact on Digital Learning -
ReadSpeaker
      https://www.readspeaker.com/blog/learning-science-text-to-speech-digital-e
ducation/
  [18] Perceiving emotion in human and AI voices: sensitivity to acoustic cues 
in Korean speech
      https://www.researchgate.net/publication/399312963_Perceiving_emotion_in_h
uman_and_AI_voices_sensitivity_to_acoustic_cues_in_Korean_speech
  [19] The Indirect Disclosure Effect: How Disclosing Generative AI Use Impacts 
Human Creative Collaboration with AI | Information Systems Research - PubsOnLine
      https://pubsonline.informs.org/doi/10.1287/isre.2024.0951
  [20] Consumer Trust in AI-Generated Marketing Content: A Systematic Literature
Review and Research Agenda
      https://americanimpactreview.com/articles/e2026024.pdf
  [21] Principles Based on Social Cues in Multimedia Learning - ResearchGate
      https://www.researchgate.net/publication/359588354_Principles_Based_on_Soc
ial_Cues_in_Multimedia_Learning
  [22] Principles Based on Social and Affective Features of Multimedia Learning 
(Part VI)
      https://www.cambridge.org/core/books/cambridge-handbook-of-multimedia-lear
ning/principles-based-on-social-and-affective-features-of-multimedia-learning/B8
B1F716655BBB83DC6165488C0D2F64
  [23] Mayer's Principles for AI Course Video (2026) - X-Pilot
      https://www.x-pilot.ai/blog/mayer-multimedia-learning-principles-ai-video
  [24] Designing Virtual Pedagogical Agents and Mentors for Extended Reality | 
Request PDF
      https://www.researchgate.net/publication/355894114_Designing_Virtual_Pedag
ogical_Agents_and_Mentors_for_Extended_Reality
  [25] How do voice acoustics affect the perceived trustworthiness of a speaker?
A systematic review - PMC
      https://pmc.ncbi.nlm.nih.gov/articles/PMC11931160/
  [26] Interactive Communication — cross-disciplinary perspectives from 
psychology, acoustics, and media technology - arXiv
      https://arxiv.org/html/2512.04692v1
  [27] Closing the Naturalness Gap in AI Voice Agents | by Kartikay Thakur
      https://medium.com/@sky.kartikay/closing-the-naturalness-gap-in-ai-voice-a
gents-3dc544248025
  [28] Research on the Impact of an AI Voice Assistant's Gender and 
Self-Disclosure Strategies on User Self-Disclosure in Chinese Postpartum 
Follow-Up Phone Calls - MDPI
      https://www.mdpi.com/2076-328X/15/2/184
  [29] Complete Guide to Text-to-Speech (TTS) Technology (2026) - Picovoice
      https://picovoice.ai/blog/complete-guide-to-text-to-speech/
  [30] Superhuman AI Disclosure: Impacts on Toxicity, Fairness, and Trust Vary 
by Expertise and Persona Attributes - arXiv
      https://arxiv.org/html/2503.15514v1
  [31] "Crossing the uncanny valley of conversational voice" post by Sesame - 
realtime conversation audio model rivalling OpenAI : r/LocalLLaMA - Reddit
      https://www.reddit.com/r/LocalLLaMA/comments/1j00v4y/crossing_the_uncanny_
valley_of_conversational/
  [32] When news is “written by artificial intelligence”: a systematic review of
provenance and disclosure cues in journalism and their effects on credibility 
and trust - PMC
      https://pmc.ncbi.nlm.nih.gov/articles/PMC13183635/
  [33] Visible sources and invisible risks: exploring the impact of AI 
disclosure on perceived credibility of AI-generated content - ResearchGate
      https://www.researchgate.net/publication/401762306_Visible_sources_and_inv
isible_risks_exploring_the_impact_of_AI_disclosure_on_perceived_credibility_of_A
I-generated_content
  [34] Listeners prefer AI voices, claim two studies | Podnews Daily - Metacast
      https://metacast.app/podcast/podnews-daily-podcast-industry-and-podcasting
-news/gnrb9IAH/listeners-prefer-ai-voices-claim-two-studies/box3fJRg
  [35] NO FAKES Act Passes Senate: What Voice AI Businesses Must Do
      https://enterprisedna.co/resources/news/no-fakes-act-senate-committee-voic
e-ai-likeness-2026/
  [36] What is the Elvis Act? AI Likeness Law Explained (2026) - Atlan
      https://atlan.com/know/data-governance/elvis-ai-act/
  [37] Tennessee Governor Signs Into Law First-of-its-Kind Bill Addressing AI 
Misappropriation Of Voices, Images, And Songs
      https://www.beneschlaw.com/insight/tennessee-governor-signs-into-law-first
-of-its-kind-bill-addressing-ai-misappropriation-of-voices-images-and-songs/
  [38] PHOTOS: Gov. Lee Signs ELVIS Act Into Law - TN.gov
      https://www.tn.gov/governor/news/2024/3/21/photos--gov--lee-signs-elvis-ac
t-into-law.html
  [39] The ELVIS Act: Setting the Stage for Policing Unauthorized Use of 
AI-Generated Sound and Likeness | Wilson Sonsini
      https://www.wsgr.com/en/insights/the-elvis-act-setting-the-stage-for-polic
ing-unauthorized-use-of-ai-generated-sound-and-likeness.html
  [40] ELVIS Act text (PDF). Tennessee passes law to stop AI deepfakes of voice,
in addition to name, photograph, likeness
      https://chatgptiseatingtheworld.com/2024/03/22/elvis-act-text-pdf-tennesse
e-passes-law-to-stop-ai-deepfakes-of-voice-in-addition-to-name-photograph-likene
ss/
  [41] NO FAKES Act Passes Senate Judiciary Committee By Unanimous Voice Vote - 
Grammy
      https://www.grammy.com/news/no-fakes-act-passes-senate-judiciary-committee
/
  [42] New podcast: Do synthetic voices work in interactions with public 
authorities?
      https://cc.au.dk/en/news-and-events/news/single-news/artikel/ny-podcast-fu
ngerer-robotstemmer-i-moedet-med-myndighederne
  [43] AI Voice Acting: How AI Is Transforming Voice Creation & Storytelling
      https://arrevoice.com/blog/ai-voice-acting/
  [44] Senate Judiciary advances NO FAKES Act on unanimous vote - S&P Global
      https://www.spglobal.com/market-intelligence/en/news-insights/articles/202
6/6/senate-judiciary-advances-no-fakes-act-on-unanimous-vote-103007539
  [45] Is AI Replacing Human Voices? The Future of AI in Podcasting
      https://www.krosbyaudio.com/blog/is-ai-replacing-human-voices-the-future-o
f-ai-in-podcasting-radio-and-audiobooks
  [46] Synthetic voices speak loudly as Amazon Music ramps up audiobooks
      https://omdia.tech.informa.com/om124893/synthetic-voices-speak-loudly-as-a
mazon-music-ramps-up-audiobooks
  [47] Robot Voices in Daily Life: Vocal Human-Likeness and Application Context 
as Determinants of User Acceptance - Frontiers
      https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.202
2.787499/full
  [48] How AI Avatars and AI Videos Power Training, Education & Technical 
Learning - IBT Online
      https://ibt.onl/blog/how-ai-avatars-and-ai-videos-power-training-education
-technical-learning/
  [49] Synthetic Speech Evaluation Quality and Context Fritz Seebauer - PUB - 
Publikationen an der Universität Bielefeld
      https://pub.uni-bielefeld.de/download/3016370/3016456/Dissertation_seebaue
r_publication_version.pdf
  [50] Digitalization of trainings in the Business environment : Using the 
example of an E-Learning production in the field of occupati - SerWisS
      https://serwiss.bib.hs-hannover.de/files/2405/sael2022-digitalization_trai
nings_business.pdf
  [51] Robot Voices in Daily Life: Vocal Human-Likeness and Application Context 
as Determinants of User Acceptance - PMC
      https://pmc.ncbi.nlm.nih.gov/articles/PMC9136288/
  [52] BELIEVE IN THE SOUND YOU SEE: THE EFFECTS OF BODY TYPE AND VOICE PITCH ON
THE PERCEIVED AUDIO-VISUAL CORRESPONDENCE AND BELIEVAB
      https://hammer.purdue.edu/ndownloader/files/40221118
  [53] Voice clones are easier to understand in noise than their human 
originals: The voice cloning intelligibility benefit - AIP Publishing
      https://pubs.aip.org/asa/jasa/article/159/4/3476/3387364/Voice-clones-are-
easier-to-understand-in-noise
  [54] Soundgen: An open-source tool for synthesizing nonverbal vocalizations - 
PMC
      https://pmc.ncbi.nlm.nih.gov/articles/PMC6478631/
  [55] MODELING AND GENERATING TRUSTWORTHY SPEECH by
      https://academicworks.cuny.edu/cgi/viewcontent.cgi?article=7968&context=gc
_etds
  [56] Explainable deepfake detection through prosodic analysis of the Spanish 
discourse marker ¿no?
      https://turia.uv.es/index.php/normas/en/article/download/34181/35688/13751
3
  [57] Tennessee's New ELVIS Act Seeks to Protect Artists' Voices from AI Misuse
| Practical Law
      https://uk.practicallaw.thomsonreuters.com/w-042-7524?transitionType=Defau
lt&contextData=(sc.Default)
  [58] Aggregator - REC Networks
      https://recnet.com/index.php/aggregator?page=209
  [59] Blackburn, Coons Bipartisan Bill to Protect Individuals and Creators from
Deepfakes Passes Senate Judiciary Committee
      https://www.blackburn.senate.gov/2026/6/blackburn-coons-bipartisan-bill-to
-protect-individuals-and-creators-from-deepfakes-passes-senate-judiciary-committ
ee
  [60] Letter to Senate Judiciary on NO FAKES Act - Public Knowledge
      https://publicknowledge.org/policy/letter-to-senate-judiciary-on-no-fakes-
act/

Run 'nlm research import f60462d2-38b1-452d-acf3-4786afb2c6e7 <task-id>' to 
import sources.
