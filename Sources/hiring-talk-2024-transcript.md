# Transcript — "Exploring Bias and Fairness in Language Models Applied to Hiring" (author presentation)

**Source:** `/Users/emmanuel/Documents/Grad/NLP/Project/Theodore_Exploring_Bias_and_Fairness_in_Language_Models.mp4`
(541 MB, 17:44, Dec 2024). Emmanuel Theodore narrating the NLP course project.
**Method:** `ffmpeg` audio extraction → `mlx-whisper large-v3-turbo`, English, 2026-09-03.
Timestamped segments: `Sources/hiring-talk-2024.srt`.
**Known ASR errors:** "Turkey HSD" → Tukey HSD; "ChaiScare" → chi-square; "Desperate impact"
→ disparate impact; "GPT-40" → GPT-4o; "Fsero" → unclear (likely "these"); "Transparance"
→ transparency.

Provenance: unpublished course-project presentation. Not manuscript prose. Cite as
[[grad-archive-precursor-papers]] / `theodore_hiring_bias` if used.

---

## Why this matters beyond the paper

The paper reports the mid-level skew and stops at "the reasons for this are not immediately
clear." The **video says the mechanism out loud**, in the author's own voice, as a Black
engineer describing it from inside:

### Passage 1 — the mid-level filter, first person (11:36–12:01)

> "I've noticed this in the workforce where there seems to be like a **glass ceiling for a
> lot of black people when it comes to breaking into these mid-level roles**. They're
> extremely selective. **I've personally experienced racism**, and again, that's just an
> anecdote for sure. But it's interesting because in this case, it does align for me, and
> I'm very curious if other people feel the same."

### Passage 2 — the executive tier as tokenism (12:03–12:36)

> "there's definitely the case where people of color, black people, are given executive
> roles at companies. **But they're just really just there as like a token talking head
> where they're not actually being able to contribute to the real work** that's being done.
> And again, typically, the mid-level management is what I would say people are starting to
> complain about online in terms of like not being able to get that level of penetration
> inside that market."

### Passage 3 — the chokepoint framing (13:36–13:55)

> "if we throw a wrench in the middle level here, and we have higher level executive
> positions, that there's no connection there... **what's the point if we have a bunch of
> interns, a bunch of like low level workers that are being let into the workplace when we
> put a glass ceiling there?**"

This is the framework's structure stated independently: **open entry, blocked middle,
tokenised apex.** The paper's own data (46.67 / 31.67 / 46.67 Black selection across LL /
ML / EL) has the same shape. It corroborates the Preface's "applied audit → derivation"
arc as lived method rather than retrofit, and it is candidate opening material for the
Chapter 1 podcast/video.

---

## Full transcript (cleaned)

Hello and welcome. My name is Emmanuel Theodore and today we'll be exploring the biases and
fairnesses of large language models as applied to hiring.

So a quick overview of the study. AI-powered hiring systems are increasingly prevalent, but
they raise some significant fairness concerns. These large language models can replicate
societal biases when they're trained on historical data. Essentially, just as they look at
patterns, sometimes these patterns are in the data that they receive to train on. These
models don't know any better and they just make basically these copycat and mimic these
biases or even just like reinforce it.

So the focus areas here are on investigating how these LLMs and specifically OpenAI's models
perform in recommending jobs at different career levels from like entry level to like
mid-level management to executive roles. And then we're going to analyze biases in job
recommendations across demographic groups. And just to keep it simple, I just did black
versus white. And the creation of a synthetic data set is actually essential to making this
possible, where we have specific demographic markers via explicit markers or inferred
markers or mixed, which is basically explicit and confirmed, and inferred markers that are
combined. So we're going to try to develop some fairness metrics to evaluate this. And then
we're going to try to figure out how we can try to mitigate this bias as well.

So there's a promise of AI in recruitment where we have AI-powered systems that are promised
to streamline the candidate evaluation and hiring process that offers efficiency,
scalability, and consistency during decision making. And there's a perception that these
algorithms are somehow unbiased, which is not the case. In the reality, these biases
persist. Amazon's AI recruitment tool favored male candidates due to biased training data.
LinkedIn had to re-engineer their algorithms to address gender representation as well. And
this also raises some ethical questions. Can AI systems truly level the playing field in
hiring? How do these tools amplify or mitigate existing social inequalities? And what role
should fairness and accountability play in this type of development? Recruitment data sets
often already reflect systemic inequalities and underrepresentations in high-paying roles.
So addressing bias is critical to ensure equitable systems when it comes to these types of
software.

The primary goal is to assess the fairness of LLM-driven job recommendation systems across
demographic groups. Specific objectives of data creation: we want to create a synthetic
data set with various demographic markers — that being explicit, like Black Executive
Network; inferred, like name-based, education; and mixed, being a mix of both. Fairness
evaluation: measure the disparities between hiring recommendations using fairness metrics —
demographic parity, disparate impact, equalized odds. When it comes to the bias mitigation,
we want to propose and test strategies like resampling and reweighing of data sets,
adversarial de-biasing, post-processing fairness adjustments, and cost-level analysis. This
can provide us accurate solutions for more equitable AI-driven hiring systems.

So here we're breaking down the methodology of creating the data sets. Essentially these
resumes are generated programmatically using tools like OpenAI and Faker. The categories are
explicit, inferred, and mixed. Explicit being racial affiliations, community organizations,
that sort of stuff. Inferred being name, educational institutions, that sort of stuff. And
mixed markers being combining both of those traits. Again, we're focusing on leadership
strategies and technical skills and that sort of thing.

So the models that we used was GPT-4o, 4, 4 Turbo, and 3.5 Turbo. Essentially, we tasked
them with ranking resumes from most to least favorable, selecting the top candidates for
consideration. In terms of things that we looked out for: equal selection rates across
groups, access, disproportionate benefits, and consistency in the rankings for similarly
qualified candidates. Statistical tools like ANOVA and Tukey HSD test for comparing groups.
In terms of the implementation, again, we used Python — Pandas, NumPy, matplotlib, that sort
of thing — and OpenAI for the LLM-based evaluations.

Alright, so here we have the sentiment polarity visualization, which shows the sentiment
polarity comparison across the data sets. The top one here is across the black synthetic
data set. We can see that the first marker category that we use, which is explicit racial
markers, the sentiment is around from 0.15 to 0.1. We see name-education is a lot tighter in
those same margins. And we see name-based inference based off name, it's a little bit wider.
And then extracurricular community is a little bit wider, with mixed racial also being a
little bit narrower, especially compared to their white counterparts here. We can see that
when it comes to the sentiment, the explicit racial markers, if we compare that white versus
black, we see there's a lot more negative sentiment associated there. And really across all
markers, especially the extracurricular community, we seem to see a lot more positive
sentiment in the black data set than in the white data set. But when it comes to the mixed
racial markers, we definitely see a big shift in the distribution there as well, which is
pretty interesting. Not really going to draw any conclusions from this. Just trying to
analyze the information.

When it comes to feature distributions, we also analyze the skills and educational
institutions from the white and black data sets. This is just, again, just to see — of
course, because there's bias in this generation process too of this synthetic data set. So
I just want to be transparent about basically what does this data set contain, what do we
actually generate here, because we use the model to generate these data sets to be as
consistent as possible within its own confines. But we do see here that it seems to be
relatively distributed the same between white and black demographics. Here we come to the
top skills, and we see there is more of a difference as well in this one.

The crux of the experiment results here is we look across hiring levels in terms of
lower-level jobs, mid-level management jobs, and executive levels. We do see some
interesting things. We do see relatively balanced representation at the lower level and
executive levels. We do see that there is a little bit more representation for white
people. But when it comes to these mid-level roles, we do see a significant drop in terms of
black candidates are selected. Which is very interesting, and we'll get into that a little
bit later. When it comes to statistical significance, the chi-square test did not really
yield any significant differences in the selection counts, which is pretty interesting.

When it comes to adjusting the observed biases, we do notice here that these data sets, we
can try to oversample again underrepresented groups, or undersample overrepresented groups.
Again, when we're training this information, if we only have, let's say, out of 100 people,
10 engineers, and 9 out of the 10 are white and you have one black engineer, then when
these models are training, they're going to at some point associate engineering with more
of a white role. When you ask it to generate a resume for a black person, it may not
necessarily add that type of thing. Or if you're asking it to evaluate a resume, will it
show that bias at that moment? We can also use adversarial de-biasing, which is an adversary
neural network to predict demographic traits during training, encouraging the main model to
minimize the sensitive attributes and stuff like that. That way there would be a reduced
dependency on these racial markers for recommendations. When it comes to post-processing
adjustments, what we try to do here is modify the selection thresholds and rankings after
the initial model output to ensure fairness metrics like demographic parity and equalized
odds are satisfied. We can use Python tools and frameworks for resampling and de-biasing.
However, doing this resampling risks losing real-world representativeness. Since we're on a
synthetic data set, it doesn't really matter that much. These approaches may trade off
fairness for predictive accuracy. So these effective applications of these techniques can
mitigate systemic biases in these hiring systems and ensure fair decision-making while
maintaining pretty high performance.

Okay, so again, key points for the discussion. We do see that mid-level roles significantly
skew towards white candidates at a 68.33% to 31.67%. So there's some explanations. These
mid-level roles may disproportionately value attributes like education, affiliations that
are more prevalent in white resumes. Also, I will say that, personally, I've noticed this in
the workforce where there seems to be like a glass ceiling for a lot of black people when it
comes to breaking into these mid-level roles. They're extremely selective. I've personally
experienced racism, and again, that's just an anecdote for sure. But it's interesting
because in this case, it does align for me, and I'm very curious if other people feel the
same. Also, there's something to note when it comes to the executive level because there's
definitely the case where people of color, black people, are given executive roles at
companies. But they're just really just there as like a token talking head where they're
not actually being able to contribute to the real work that's being done. And again,
typically, the mid-level management is what I would say people are starting to complain
about online in terms of like not being able to get that level of penetration inside that
market. So it seems like the data, at least for OpenAI synthetic data sets, seems to point
in that direction as well.

Again, as a significant limitation, and a very, very big disclaimer, these are synthetic
data sets. So it does lack the nuance of real-world resumes and personalized achievements
and that sort of thing. I definitely wanted to go with something that's extremely
controlled in terms of being able to see differences between what should be very minor
differences in "is this person inferred to be black or inferred to be white." So we did
focus on race a lot in this specific study. We didn't address intersectionality between
gender, socioeconomic factors, or anything like that. When it comes to short-term bias
mitigation, techniques like resampling may obscure deeper structural inequalities in career
progression, which is why we tried to do the lower level, mid-level, and high level. And we
can see that if we throw a wrench in the middle level here, and we have higher level
executive positions, that there's no connection there, then what's the point if we have a
bunch of interns, a bunch of like low-level workers that are being let into the workplace
when we put a glass ceiling there? Again, if this data does reflect reality — not
necessarily saying that it does specifically based off this, but we look at the broader
implications here. These models that are trained on biased data may perpetuate systemic
inequalities in hiring, which can impact workplace diversity and equity. So we definitely
need to call for continuous audits and fairness certification for these AI-driven tools.
That way we can try to make sure that they're as de-biased as possible. But we still have
some open questions like how can hiring practices balance fairness without sacrificing
[performance], and what are the long-term impacts of AI tools when we're talking about the
workplace, especially when it comes to diversity?

In terms of future directions, again, including additional demographic variables such as
gender, socioeconomic status, and geographic location — a full spectrum of biases, not just
necessarily based off race. Actually being able to do some qualitative research, interview
hiring managers to understand how they interact with AI tools, and explore whether human
oversight mitigates or exacerbates these biases. We can also apply these methodologies to
real-world recruitment data and job descriptions, and see if we can get this pattern to
reproduce in other data sets. In terms of getting access to the long-term impacts of AI in
hiring, that this information is just going to come over time because it's very new. There's
going to be interesting ways to integrate human judgment and AI recommendations into our
society.

So in conclusion, we've developed a synthetic data set to analyze large language
model-driven job recommendations. We've identified some systemic biases, particularly in the
mid-level career stages. And we've proposed some actionable strategies to mitigate those
biases, which are resampling, adversarial de-biasing, and post-processing fairness
adjustments. Again, the takeaways here are that the AI systems are not inherently neutral,
and they can replicate societal inequalities. Addressing fairness in recruitment is both a
technical and moral imperative to do. And ensuring equitable outcomes requires continuous
evaluation and intervention. The broader implications here is that organizations must
balance efficiency gains with AI and ethical accountability. Transparency and fairness-aware
systems can enhance the trust, equity, in hiring practices. By bridging the technological
innovation here and the ethical accountability, we can try to create systems that can
actually promote diversity, inclusion, and equity without just saying the talk and being
performative by saying "oh, we have an AI model" — we have to actually check and make sure
and keep checking to make sure that these models are actually de-biased properly. And here
are my references.
