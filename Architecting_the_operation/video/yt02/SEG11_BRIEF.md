# Brief: rewrite YT02 SEG 11 narration: introduce each dashboard component, then the eras

**Never run git. Never edit `Paper/`. Edit only SEG 11 of
`Architecting_the_operation/podcasts/YT02_what_racism_is.md` (between `<!-- SEG 11 ·` and `<!-- SEG 12 ·`).
Leave every other segment byte-identical.**

## Why

The author does not want the full dashboard thrown at the viewer. The visuals now introduce one
component at a time, large and animated, while the narration explains what it tracks; each component
then moves into its slot until the dashboard is assembled. After that, the era walk runs as before,
with one addition: a **complex-wage phasor** for the Buffer Class in every era.

## New SEG 11 structure (keep turn format: `Emmanuel Theodore (MM:SS)` header, 12–40 words, speakable)

1. **Opening (1–2 turns).** The three tests now enter one live readout, built from the book's
   RUNTIME LOG boxes. Say the dashboard is assembled one instrument at a time. Replace the current
   turns that list all fields at once.
2. **Component introductions (1–2 turns each, in this order).** For each, name it, say what it
   tracks in the framework, and how it reads on screen. Ground every definition in the book:
   - System Stress, the min side: class resistance (log field "System Stress (min: class resistance)").
   - Capital, the max side: extraction output.
   - Φ_load, the phase load (interference loading) as a range bar from 0 to 1.
   - ρ_τ = M(t)/τ, proximity to the crash threshold τ, as a dial; τ = 1.0 is the crash line.
   - Active Patch: the recompile the system is running.
   - Variables: chips; dim = loaded from earlier cycles, lit = deployed this cycle.
   - Executing Function: what the algorithm does this cycle.
   - The Buffer Class wage W = ψ_m + jψ_s (Equation 3.5) as a phasor; material on the vertical axis,
     psychological on the horizontal (as SEG 09 established); θ = 90° is pure status, past 90° is
     Quadrant II, which the book calls the fascism threshold. Refer back to SEG 09; do not re-teach it.
   - Result: the [POLICY] lines the cycle produces (or the WARNING line in the terminal logs).
   Then one turn as the instruments lock into the full dashboard.
3. **Era walk (keep the existing era turns, edited down where they now repeat the introductions),
   adding one wage turn per era**, grounded as follows (all Tier 3, ordinal; say "ordinal" once, not
   every time):
   - 1486: the Implicit Contract issues the psychological wage; θ at 90°.
   - 1676–1787: the log records W = jψ_s formalized; θ = 90°.
   - 1704–1865: Buffer Class pacified by jψ_s; θ = 90°.
   - 1894–1965: the log deploys the Complex Wage, weaponized; Chapter 10's Pullman Corollary:
     W = jψ_s squared gives −ψ_s², compounding status destroys material standing.
   - 1968–1994: θ crosses 90° into Quadrant II (Chapter 0's AC-mode exemplars: post-1965 mass
     incarceration, the War on Drugs).
   - 1994–present: deeper in Quadrant II as cannibalization extracts from the Buffer Class itself.
   - 2010s–present: Quadrant II on algorithmic hardware (algorithmic credit scoring and subprime
     lending are among the book's AC-mode exemplars).
   Verify each against `Paper/The_Original_Power.tex` (Chapter 0 AC mode around line 1130, the complex
   wage around line 2896–2925, the Pullman Corollary around line 5808–5820, the runtime logs in the
   Compiled Runtime Log appendix). Fix anything the book does not support.
4. **Close (1 turn):** keep the existing continuity line.

Target length for SEG 11: about 7 minutes at 150 wpm (it was 5). Renumber timestamps in SEG 11 and
shift every later timestamp consistently.

## Rules

Direct declarative sentences, no formulaic antithesis, "tiers" never "jobs", college register.
Run `python3 Architecting_the_operation/video/yt01_redefining_racism/check_script.py
Architecting_the_operation/podcasts/YT02_what_racism_is.md --segments 15 --require ""` and
`python3 tools/check_antithesis.py Architecting_the_operation/podcasts/YT02_what_racism_is.md`;
both must be clean. Append a "SEG 11 rewrite" section to `video/yt02/logs/script_draft.md` with the
new turn list and the `.tex` line behind each wage claim.
