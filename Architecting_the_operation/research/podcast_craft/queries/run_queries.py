import json, subprocess, sys, pathlib
NB = "f60462d2-38b1-452d-acf3-4786afb2c6e7"
here = pathlib.Path(__file__).parent
IDS = (here.parent / "curated_ids.txt").read_text().strip()
src = {s["id"]: s for s in json.load(open(here.parent / "sources.json"))}
GRADE = (" For every claim, say whether it rests on controlled or field experiments, observational or survey data, "
         "or practitioner experience, name the specific study or author, and say where sources disagree or evidence is thin.")
Q = {
 "A_audio_learning_evidence": "What does controlled experimental research show about learning from audio-only or transient spoken information? Cover the transient information effect, modality and redundancy effects, segmenting and pacing, and expertise reversal. What do these imply for 40 to 75 minute scripted episodes on dense mathematical material, including episode length and where to put breaks?",
 "B_host_roles_dialogue": "How should roles be divided among two or three voices in an explanatory podcast, including a surrogate learner or audience proxy? What makes scripted dialogue sound natural or staged, and what techniques do producers use to write conversation that sounds unscripted?",
 "C_recaps_signposting": "How often and how should an audio program use recaps, previews, signposting, and deliberate repetition to support comprehension and retention? Give concrete practices from radio and podcast producers and any experimental evidence on repetition in spoken instruction.",
 "D_equations_without_visuals": "How should equations, mathematical notation, graphs, and diagrams be conveyed in audio alone? Cover MathSpeak and accessible description guidelines, how science audio journalists handle numbers and formulas, and what must be carried by speech when no visual is available.",
 "E_multilevel_and_analogy": "Does explaining the same idea at several levels of difficulty, as in the WIRED 5 Levels format, help learning for mixed audiences, or does it cause redundancy or expertise reversal problems for advanced listeners? What does research on analogy, including structure-mapping theory and the Teaching-With-Analogies model, say about designing analogies and stating where they break down?",
 "F_series_order_entry_points": "For serialized nonfiction podcasts, what do producers and listener data say about season order, entry-point episodes for new listeners, episode-to-episode hooks, completion and drop-off rates, and making each episode stand alone versus requiring prior episodes?",
 "G_charged_topics_skeptics": "What does the research say about presenting structural racism or other identity-threatening ideas to skeptical listeners? Cover the backfire effect and its replication failures, identity-protective cognition, deep canvassing and nonjudgmental exchange of narratives, messenger effects, and FrameWorks Institute framing research. Which findings could transfer to a one-way audio medium and which require live conversation?",
 "H_writing_for_the_ear": "What concrete rules do radio and podcast writers follow when writing for the ear rather than the page? Cover sentence length and structure, attribution placement, numbers, jargon, active voice, reading scripts aloud, script formatting, and directing voice performance. List them as a practical checklist with sources.",
 "J_synthetic_voices": "What does research show about listener trust, comprehension, learning, and engagement when narration uses synthetic or AI-cloned voices instead of human voices? Cover the voice principle and social cues in multimedia learning, studies of text-to-speech in education, perceived trustworthiness of voice acoustics, emotion perception in AI voices, and the effects of disclosing AI use on credibility. What should a scripted educational podcast using cloned voices do about disclosure and delivery?",
 "I_book_to_podcast_adaptation": "What have scholars and producers learned about adapting academic books or research into podcast series? Cover public scholarship podcasts like Hannah McGregor's work and the Amplify Podcast Network, evidence on learning outcomes from educational podcasts, and common failures of academic podcasts.",
}
only = sys.argv[1:] or list(Q)
for key in only:
    q = Q[key] + GRADE
    out = subprocess.run(["nlm","query","notebook",NB,q,"--source-ids",IDS,"--timeout","400","--json"],capture_output=True,text=True)
    try:
        v = json.loads(out.stdout)["value"]
    except Exception:
        print(key, "FAILED", out.stdout[:300], out.stderr[:300]); continue
    used = []
    for r in v.get("references", []):
        if r["source_id"] not in used: used.append(r["source_id"])
    lines = [f"# {key}\n", f"**Question.** {Q[key]}\n", v["answer"], "\n\n## Sources cited\n"]
    num = {}
    for n, sid in v.get("citations", {}).items(): num.setdefault(sid, []).append(n)
    for sid in used or v.get("sources_used", []):
        s = src.get(sid, {"title": sid, "url": ""})
        lines.append(f"- [{', '.join(num.get(sid, []))}] {s['title']} {s.get('url') or ''}")
    (here / f"{key}.md").write_text("\n".join(lines))
    json.dump(v, open(here / f"{key}.json", "w"), indent=1)
    print(key, "ok", len(v["answer"].split()), "words", len(used), "sources", flush=True)
