# Draft task: YT01 script, one part

**FILE RULES FIRST. Never run git. Never modify any existing file. Write exactly one new
file, the one named in your dispatch line, under
`Architecting_the_operation/video/yt01_redefining_racism/drafts/`. Create no other files,
no helper scripts.**

You are drafting part of the voiceover script for a long YouTube video that walks
through Chapter 2, *Redefining Racism*, of the book *The Original Power*.

1. Read `Architecting_the_operation/video/yt01_redefining_racism/BRIEF.md` completely.
   Its hard rules and script format are binding.
2. Read the chapter source: `Paper/The_Original_Power.tex`, lines 1621 to 2735. Read
   every line of the sections your segments cover, including footnotes and figure
   captions. Equation, figure and table numbers are given in the brief's segment table
   (the tex labels like `eq:1.5-kernel-optimization` do NOT match the printed numbers;
   use the brief's numbers: Eq 2.1–2.19, Fig 2.1–2.9, Table 2.1, Definition 2.3).
3. For tone and voice, read one existing solo script:
   `Architecting_the_operation/podcasts/q9_louijeune_reply.md` (short declarative
   turns, one card per turn) and skim
   `Architecting_the_operation/podcasts/UEF_orthographic_illusion.md` (how equations are
   spoken).
4. Write only your segments, in order, each opening with its `<!-- SEG NN · ... -->`
   comment. Start timestamps at the offset in your dispatch line.

Voice: Emmanuel, the author, speaking directly to camera-less video. Confident,
precise, warm, collegiate. He explains each equation as: number, what each symbol is,
the sentence the equation says, why it matters. He uses the book's computing and
circuit models as the explanation. Short turns. No filler ("let's dive in", "buckle
up", "in this video"). No rhetorical-question chains. No antithesis (rule 2): run the
grep in the brief on your file and fix every contrast before you finish.

Coverage beats brevity: every item in your segments' "Content to cover" and "Must
include" columns must appear. Do not add facts that are not in the chapter.

At the very end of your file, after the last turn, add an HTML comment block
`<!-- NOTES ... -->` listing: anything in the chapter you found ambiguous or
inconsistent, and any item you could not fit.
