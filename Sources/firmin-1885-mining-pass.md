# Firmin 1885 — deep mining pass against the framework

**Source.** Anténor Firmin, *De l'égalité des races humaines : anthropologie positive*,
Paris, F. Pichon, 1885. Public-domain BnF scan via archive.org
(`Antnor1885Bnf30437548r`), 687 PDF pages, French.
Local copy: `Sources/Firmin_De_l_egalite_des_races_humaines_1885.pdf`.

**Page convention.** Printed folio = PDF page − 21 for the arabic-paginated body
(the roman-paginated Préface, PDF 9–20, is cited by PDF page). Every citation below
gives the **printed folio**, which is what a reader of the 1885 book sees.

**Method.** Two-step, per `Sources/firmin-1885-framework-pass.md`: locate a passage by
single-word search in a layout-preserving text extraction, then render the page
(`pdftoppm -f N -l N -r 165 -png`) and read the image. The `-layout` extraction of
this scan turned out to be far more readable than the earlier pass reported — full
sentences survive with mangled spacing — so it was usable for locating and for a
first read, but **image rendering remains the authority** for exact wording and folio.

**Verification status.** Twelve pages were rendered and read against the image; the
list is at the end. A parallel Kimi swarm (five sub-agents, one per region) mined the
same territory independently; where its transcriptions overlap the twelve verified
pages they matched. Passages below marked **[image-verified]** were confirmed against
the rendered page; passages marked **[layout-only]** were read only in the text
extraction and still need an image check before they are quoted in the manuscript.

**What is already done and not repeated here.** The craniometric audit (folios 136,
138, 159), the "école américaine … moyen de légitimer le système de l'esclavage"
line (folio 139), the exploitation-of-man-by-man clause (folio 204), the
slavery/equality conditional (folios 208–209), "méthodiquement dégradé" (folio 488),
"l'orgueil et l'intérêt sont coalisés" (folio 495), and the justification-requirement
passage (folios 566–567) are verified in
`Sources/firmin-leads-verification.md` and built into
`Paper/The_Original_Power.tex:2842`. The word "anarchique" appears nowhere in the book.

---

## 1. Where Firmin's reasoning maps onto the book's machinery

Each row: the book's own term, the Firmin passage that instantiates it, the printed
folio, and one line on the correspondence. The book's vocabulary is left untranslated,
as instructed.

### The extraction kernel / the Elite (E) as a small nucleus

> « En est-il de même de la théorie de l'inégalité des races ? Au contraire,
> d'exclusion en exclusion, elle aboutit fatalement à la conception d'un petit noyau
> d'hommes, presque dieux par la puissance, destinés à subjuguer le reste des
> humains. » — **folio 645** [image-verified]

> « …la théorie de l'inégalité des races conduit logiquement à un système oligarchique
> ou despotique dans le régime intérieur et national des peuples, sans même qu'on ait
> besoin d'y supposer des races franchement distinctes. Les savants et les philosophes,
> qui affirment que les races ne sont pas égales, en viendraient-ils donc à désirer …
> l'établissement de vraies castes, dans la nation même à laquelle ils appartiennent ? »
> — **folio 645** [image-verified]

This is the strongest single find in the pass. Firmin does not draw a rhetorical
parallel to an elite; he **derives** the elite-extraction endpoint from the internal
logic of the doctrine — "from exclusion to exclusion" it terminates in a ruling
nucleus "almost gods in power" over the rest of humanity — and, separately, notes the
same logic produces caste *inside* each nation with no distinct races required. That
is the book's $E$ / extraction-kernel claim and its fractal-execution claim, stated
as a logical consequence in 1885. Belongs beside the definition of $E$ and in
`sec:firmin_counter_signal`.

### The legitimation apparatus

> « La doctrine anti-philosophique et pseudo-scientifique de l'inégalité des races ne
> repose que sur l'idée de l'exploitation de l'homme par l'homme. L'école américaine a
> été seule conséquente avec elle-même, en soutenant cette doctrine ; car ses adeptes
> ne cachaient pas l'intérêt capital qu'ils avaient à la préconiser. » — **folio 204**
> [image-verified]

The manuscript currently quotes this only through "exploitation de l'homme par
l'homme." The continuation — *"ses adeptes ne cachaient pas l'intérêt capital qu'ils
avaient à la préconiser"* — is the motive stated in Firmin's own words and is verified.

> « …étant donné que l'esclavage existait, il fallait bien trouver une raison pour en
> légitimer l'institution, et jamais raison ne fut plus plausible que l'infériorité
> intellectuelle et morale (*diminutio capitis*) qu'on supposait juridiquement comme
> naturelle à l'esclave. » — **folio 210** [image-verified]

The sequence the book calls the institutional feedback loop, stated in order:
the practice of extraction exists first; a justifying reason is *then* required;
inferiority is selected because it is "the most plausible." Firmin puts the science
downstream of the extraction, not upstream.

> « Économistes, philosophes et anthropologistes deviennent ainsi des ouvriers de
> mensonge, qui outragent la science et la nature, en les réduisant au service d'une
> propagande détestable. En fait, ils ne font que continuer dans le monde intellectuel
> et moral l'œuvre abominable que les anciens colons exerçaient si bien, en abrutissant
> l'esclave jaune ou noir par l'éreintement matériel. » — **folio 570** [image-verified]

The clearest statement in the book of the legitimation apparatus as one thing:
the racial science is the same extraction operation as the plantation, run "in the
intellectual and moral world." "Ouvriers de mensonge … propagande détestable" is
Firmin's name for it.

> « Cette doctrine est-elle née d'une inspiration purement platonique ? Nullement.
> Elle est le résultat du plus affreux égoïsme, usurpant le nom de la civilisation,
> adultérant les plus belles notions de la science, pour en faire les soutiens des
> convoitises matérielles, les moins respectables du monde. » — **folio 567**
> [image-verified]

### Signal versus noise / confirmation-biased pattern-matching on pre-labeled data

> « Avec la théorie des moyennes, l'expérimentateur qui dispose d'un grand nombre de
> crânes trouve facilement une façon de leur faire dire ce qu'il veut. Il n'y a qu'à
> choisir ses types dans le tas, écartant les maximums ou les minimums suivant les
> convenances de la thèse à soutenir. … ils sont des hommes et l'on sait combien peu
> on hésite, lorsqu'il s'agit de forcer un fait à concourir à la démonstration d'un
> système que l'on défend. » — **folio 152** [image-verified]

Firmin describing selective sampling — choosing which skulls to include by whether
they help "the thesis to be defended" — in 1885. This is the book's
"confirmation-biased pattern-matching on pre-labeled data" with a period account of
the mechanism.

> « …il a voulu ramener le cubage des crânes à l'établissement d'une preuve cherchée
> partout, afin de confirmer l'existence d'une distinction sérielle et hiérarchique
> entre les races humaines. » (of Broca) — **folio 138** [image-verified]

> « …après avoir reconnu que cinq procédés, appliqués l'un après l'autre, ne donnent
> que des résultats contradictoires, non-seulement dans un même groupe, mais le plus
> souvent sur le même individu, ils affirment néanmoins que c'est de l'ensemble de ces
> mêmes procédés que doit sortir la vérité que l'on cherche. » — **folio 133**
> [layout-only]

> « …on a un but arrêté, systématique, autour duquel tout gravite d'une façon
> évidente. » (of the whole anthropometric enterprise, glossing Claude Bernard on
> *l'idée systématique*) — **folio 233** [layout-only]

### The Ontological Exclusion

> « Non-seulement ils considéraient les esclaves comme des êtres inférieurs aux autres
> hommes, ils en faisaient aussi, — longtemps avant les esclavagistes américains, —
> une espèce distincte. Florus le dit en termes exprès. D'après cet historien, les
> esclaves sont regardés comme une seconde espèce humaine, *quasi secundum hominum
> genus sunt*. » — **folio 210** [image-verified]

The book sources the Ontological Exclusion — positioning a group "as a separate
species, more akin to animals than people" — to Zurara and the Portuguese. Firmin
found the Roman legal template for exactly that move: *capitis diminutio*, the slave
as "a second human species." Same operation, classical precedent, and Firmin already
notes the Americans repeated it "longtemps avant les esclavagistes américains."

> (Broca, quoted approvingly by Firmin) « les partisans de l'ancien ordre de choses,
> menacés dans leurs intérêts les plus chers, furent bien aises de pouvoir dire que
> les Nègres n'étaient pas des hommes mais seulement des animaux domestiques plus
> intelligents et plus productifs que les autres. » — **folio 205** [layout-only]

### The partition variable / the managed boundary / divide-and-conquer

> « La doctrine de l'inégalité des races, enfantant les plus sots préjugés, créant un
> antagonisme des plus malfaisants entre les divers éléments qui composent le peuple
> haïtien, n'est-elle pas la cause la plus évidente des tiraillements et des
> compétitions intestines qui ont enrayé et annihilé les meilleures dispositions de la
> jeune et fière nation ? » — **Préface, PDF 16** (roman-paginated; folio not
> image-verified) [layout-only]

Firmin names the doctrine as an active manufacturer of antagonism between segments of
one people whose interests otherwise align — the book's partition variable, observed
operating on Haiti.

> « Partout où lutte la démocratie, partout où la différence des conditions sociales
> est encore une cause de compétitions et de résistances, la doctrine de l'égalité des
> races sera un salutaire remède. Ce sera le dernier coup porté aux conceptions du
> moyen âge, la dernière étape accomplie dans l'abolition des privilèges. » —
> **folio 645** [image-verified]

Racial equality would *complete* the abolition of privilege; therefore racial
inequality is the counter-move that keeps privilege alive by foreclosing cross-class
solidarity. This is the book's thesis about race as the mechanism that forecloses the
one coordination that would end extraction.

### The buffer / the in-group coalition (E_global, the 5-tier hierarchy)

Chapter XVI is titled **« La solidarité européenne »** and carries an epigraph from
Emilio Castelar: *« …como la idea de raza completa la idea de patria »* — **folio 561**.

> « …toutes les nations européennes, de race blanche, sont naturellement portées à
> s'unir pour dominer ensemble le reste du monde et les autres races humaines. Si on
> dispute à savoir qui dominera en Europe … on est au moins unanime à reconnaître le
> droit qu'a l'Europe d'imposer ses lois aux autres parties du globe. » — **folio 566**
> [image-verified]

The book's global Elite coalition, exactly: nations in open rivalry with each other,
unanimous on the partition. Continues —

> « …on ne vient en aide [à un peuple d'Asie ou d'Afrique] qu'avec l'arrière-pensée de
> pouvoir l'exploiter à son tour ! » — **folio 566** [image-verified]

> « N'est-ce pas toujours la question de race qui domine en ces élans de solidarité,
> mais qui, édulcorée par le miel du parlementarisme, se change en question européenne,
> en la cause de la civilisation ? … la théorie de l'inégalité des races humaines ait
> facilement trouvé dans un tel état des esprits … un appui qui ne se dément jamais. »
> — **folio 574** [layout-only]

The race question relabeled as "the cause of civilization" — the book's polymorphism
("only the file name and the user interface have changed"), and a permanent,
never-failing support base for the doctrine.

> « Quand bien même toutes les légions de l'esprit ancien, scolastique et théologique,
> se coaliseraient pour affirmer que les hommes ne sont pas égaux, que les races ne
> sont pas égales… » — **folio 658** [layout-only]

The Church + Science coalition of the book's institutional-feedback-loop figure,
imagined by Firmin as "legions … in coalition."

### Institutional capture / esprit d'école

> « …il suffit qu'un savant de grand talent … ait adopté une de ces idées aussi
> puissantes qu'éphémères … pour que l'esprit d'école enraye tout progrès dans cette
> branche de la science. … Si cette vérité est contraire à l'opinion de l'école, à la
> parole du maître, on aimera mieux faire preuve de la plus grande incapacité
> discursive, plutôt que de conclure contre la théorie adoptée. » — **folio 212**
> [layout-only]

> « …cette catégorique doctrine mystérieuse implantée à l'égal d'un dogme dans l'esprit
> de nos savants ? » — **folio 212** [layout-only]

The doctrine assumed, never argued, protected by the prestige of the master and the
reflex of the school — the book's institutional-capture mechanism.

> « C'est elle [l'Europe] qui dirige la science, cette science devenue la plus grande
> autorité, la moins discutée et la plus respectable de celles auxquelles on puisse en
> appeler. » — **folio 575** [layout-only]

### Autonomous propagation (Mode 2) / internalization

> « Ces savants ont-ils conscience de leur malheureuse complicité ? Personne ne le
> sait, personne ne peut le savoir. » — **folio 570** [image-verified]

The book's point that the functional output is fixed regardless of intent at any
node. Firmin refuses to adjudicate the scientists' consciousness and pivots straight
to "il y a un fait positif."

> « Ces tendances renforcent chaque jour les préjugés d'une sotte hiérarchisation
> ethnique, plutôt que de les laisser tomber dans un relâchement que l'absence de tout
> intérêt actuel produirait infailliblement et naturellement. » — **folio 570**
> [image-verified]

The partition requires active present interest to persist; remove the interest and it
decays "infallibly and naturally." This is the book's claim that
$\partial(I_{\text{buffer}} \cup O_{\text{racialized}})$ carries a continuous
maintenance cost.

> « …ainsi s'est créé lentement, subrepticement, le plus grand obstacle à l'expansion
> du sentiment de la solidarité humaine… » and, of European scientists,
> « …ils ont été le jouet d'une méchante illusion. … les mythes et les légendes dont
> on a bercé leur enfance … les traditions dont leur intelligence a été continuellement
> nourrie, tout les entraînait invinciblement à une doctrine. » — **folio 661**
> [image-verified]

### Lexical / fractal propagation

> « …la seule immixtion de cette doctrine, dans une branche quelconque des
> connaissances humaines, suffit pour y infiltrer un principe de contradiction et
> d'illogisme, lequel entraîne infailliblement les esprits les mieux faits et les plus
> éclairés aux idées les plus absurdes ou les plus monstrueuses. » — **folio 649**
> [layout-only]

The book's lexical-scale claim: the partition logic propagates into any domain it
touches.

### The counter-signal, and the analyst embedded in a remaining partition

The whole book is the counter-signal the manuscript already frames it as; the Préface
states the design — Firmin joins the Société d'Anthropologie de Paris and writes the
book to test the discipline from inside (*« Est-il naturel de voir siéger dans une même
société … des hommes que la science même qu'on est censé représenter semble déclarer
inégaux ? »*, PDF 11, [layout-only]).

On the manuscript's Royer paragraph: at **folio 648** Firmin refers to
*« Mme Clémence Royer et quelques autres savants de la même école »* while rebutting
the Darwinian argument for racial inequality on the merits — i.e. he engages her
science directly in the text even as he dismisses her elsewhere on sex. The
`drouinhans` citation already carries this; folio 648 is the in-text locus.

---

## 2. Why the racial science was produced — motive, function, whom it served

This is the material the task flagged as highest value. Firmin is explicit and
repeats himself across the book. Consolidated, most direct first:

| folio | passage (abridged) | verification |
|---|---|---|
| **567** | « Elle est le résultat du plus affreux égoïsme, usurpant le nom de la civilisation, adultérant les plus belles notions de la science, pour en faire les soutiens des convoitises matérielles, les moins respectables du monde. » | image-verified |
| **567** | Europeans « ne voient en dehors de l'Europe que des pays et des hommes à exploiter. » | image-verified |
| **566** | « …ont communément besoin d'une justification morale ou scientifique, sans laquelle les acteurs ne se sentent pas la conscience tranquille. » | image-verified (matches leads file) |
| **204** | « ses adeptes ne cachaient pas l'intérêt capital qu'ils avaient à la préconiser. » | image-verified |
| **569** | European scientists debating racial equality are « des avocats défendant une cause à laquelle ils sont directement intéressés … l'avocat plaidant *pro domo sua*. » | image-verified |
| **569** | « On ne renonce pas facilement à l'antique exploitation de l'homme par l'homme : tel est pourtant le principal mobile de toutes les colonisations. » | image-verified |
| **570** | scientists = « ouvriers de mensonge … au service d'une propagande détestable » continuing « l'œuvre abominable que les anciens colons exerçaient ». | image-verified |
| **209** | the doctrine lets the slave-owner escape « la répulsion de sa propre conscience ». | layout-only |
| **210** | « il fallait bien trouver une raison pour en légitimer l'institution » — the reason is found because one is needed. | image-verified |
| **211** | producers sorted: « les esclavagistes intéressés, les philosophes inconscients ou les savants aveuglés ». | image-verified |
| **205** | Broca opposed slavery only because it was « le principal obstacle mis à la propagation de la théorie polygéniste ». | layout-only |
| **205** | (Broca, endorsed by Firmin) slaveholders « menacés dans leurs intérêts les plus chers, furent bien aises de pouvoir dire que les Nègres n'étaient pas des hommes ». | layout-only |
| **206** | of Broca: « tout son amour-propre était mis en jeu … il ne s'occupait que du triomphe de sa cause. » | layout-only |
| **564** | « toute la somme d'ambition et d'égoïsme mesquin qu'il est devenu honteux à un homme de concevoir pour lui-même, tend-on à la déverser en faveur de sa patrie, ou de sa race ». | layout-only |
| **572** | doctrine's function: « Pour encourager l'esprit public dans l'acceptation … de ces entreprises lointaines et chanceuses, n'y a-t-il pas la théorie de l'inégalité des races ? » | layout-only |
| **242** | « Plus on cherche la cause d'une telle inconséquence, plus on est porté à la trouver dans l'inspiration de raisons ou de motifs étrangers à la science. » | layout-only |
| **578–579** | scholars « au lieu de la soumettre à une critique méthodique, ne se sont complus qu'à la recherche des moyens propres à la justifier ». | layout-only |
| **646** | Gobineau's class interest: « Pour lui, noble de sang … le roturier et le nègre … lui étaient inférieurs, tant au point de vue organique qu'au point de vue social. » | layout-only |
| **649** | belief in ethnic superiority as an instrument: « par la conviction profonde qu'il a de sa supériorité ethnique, il obtiendra des victoires faciles ». | layout-only |
| **653** | erroneous opinions « n'ont duré à travers tant de siècles qu'à l'aide de légendes et de préjugés ». | layout-only |
| **661** | European savants « le jouet d'une méchante illusion » built from « mythes … légendes … traditions ». | image-verified |
| **658** | (folio 657, adjacent) enslavement drew « de ses sueurs l'or destiné à payer la luxure du colon transformé en Sybarite ». | layout-only |

Firmin's answer, stated plainly: the doctrine of racial inequality was produced to
**legitimate an extraction that already existed** — slavery, then colonial conquest —
and to let the people running it keep a clear conscience while doing so. Its
producers are of three kinds (folio 211): those with a direct interest, the
unconscious, and the blinded; the functional output is the same across all three.

---

## 3. Where Firmin describes the system as a system

Not a claim-by-claim rebuttal — passages where he treats the doctrine as a single
constructed structure with parts, producers, and a history.

- **Chapter VI is titled « Hiérarchisation *factice* des races humaines »** — the
  hierarchy named as manufactured. Its section I is « La doctrine de l'inégalité et
  ses *conséquences logiques* » — the doctrine analysed as a system by its
  entailments.
- **folio 204** [image-verified]: the systematic doctrine is *recent* — it "n'a
  commencé à prendre place comme notion positive … qu'avec la naissance de la science
  ethnographique … les travaux systématiques des naturalistes de la fin du XVIIIe
  siècle." Firmin explicitly separates a manufactured 19th-century system from the
  older, diffuse "esprit fait d'égoïsme et d'orgueil" (folio 203).
- **folio 211** [image-verified]: « les esclavagistes sont seuls conséquents avec
  eux-mêmes en soutenant la théorie de l'inégalité des races humaines, étayée sur
  celle de la pluralité des espèces » — a coherent two-part structure (inequality
  propped on polygeny) that only its interested holders can hold consistently.
- **folio 212** [layout-only]: the doctrine as an unargued dogma held unanimously
  across a school, protected by "l'esprit d'école" and "la parole du maître."
- **folio 230** [image-verified]: « toute la phalange fière et orgueilleuse qui
  proclame que l'homme noir est destiné à servir de marchepied à la puissance de
  l'homme blanc … cette anthropologie mensongère : "Non, tu n'es pas une science ! …
  la science n'est pas faite à l'usage d'un cénacle fermé, fût-il aussi grand que
  l'Europe entière augmentée d'une partie de l'Amérique." » — the doctrine as a closed
  transatlantic coterie, judged and condemned as *not* science.
- **folio 233** [layout-only]: the anthropometric enterprise as teleological —
  "un but arrêté, systématique, autour duquel tout gravite."
- **Chapter XVI « La solidarité européenne »** (folios 561–581): the entire chapter is
  a system description — the doctrine as the common program of a coalition of rival
  nations (folio 566), interlocking with statecraft ("au fond tout s'enchaîne,"
  folio 568), suspending justice on demand ("Ce biais est d'une commodité
  incomparable," folio 568), and relabelling itself as "la cause de la civilisation"
  (folio 574).
- **folio 645** [image-verified]: the doctrine analysed by its terminus — a ruling
  nucleus over humanity, and caste within nations.
- **folio 649** [layout-only]: the doctrine as an infiltrating contaminant of any
  branch of knowledge.
- **folio 650** [layout-only]: « tous les systèmes de hiérarchisation qu'on a essayé
  d'*instituer* parmi les divers groupes de l'humanité » — instituted systems, plural.
- **folio 653** [layout-only]: opponents named as « les faiseurs de systèmes et les
  fondateurs de doctrines » producing « les erreurs systématiques des historiens ».
- **folio 661** [image-verified]: « ainsi s'est créé lentement, subrepticement, le
  plus grand obstacle à l'expansion du sentiment de la solidarité humaine » — the
  doctrine as a slowly, covertly assembled structural obstacle.

---

## 4. Ranked list of what the manuscript should add

Most valuable first. "Section" references are to labels in
`Paper/The_Original_Power.tex`.

1. **folio 645 — the "petit noyau d'hommes … destinés à subjuguer le reste des
   humains" passage.** → `sec:firmin_counter_signal`, and a cross-reference from the
   definition of $E$ (near `ch:redefining` / the formal-containment model). This is
   the highest-value item in the pass: Firmin logically derives the book's
   elite-extraction endpoint — a small ruling nucleus, and caste within nations
   without distinct races — from the structure of the doctrine. It is the closest
   thing in the 19th-century literature to an independent statement of the $E$ /
   extraction-kernel model, and it strengthens the framework by showing the endpoint
   was visible to a rigorous contemporary, not only in hindsight.

2. **folio 570 — "ouvriers de mensonge … continuer dans le monde intellectuel et
   moral l'œuvre … des anciens colons," plus the maintenance-cost counterfactual.**
   → `sec:firmin_counter_signal`, the paragraph naming the legitimation apparatus.
   The single clearest period statement that the racial science *is* the extraction
   operation carried into the ideological register, and that the prejudice decays
   without present interest — i.e. the partition boundary carries a continuous
   maintenance cost. Directly reinforces both the legitimation-apparatus claim and
   the $\partial(I_{\text{buffer}} \cup O_{\text{racialized}})$ maintenance claim.

3. **folio 567 — "le résultat du plus affreux égoïsme … les soutiens des convoitises
   matérielles" — and the folio 204 continuation "l'intérêt capital qu'ils avaient à
   la préconiser."** → same paragraph. Two verified, quotable motive statements. The
   folio 204 clause extends a quotation already in the manuscript by exactly the
   phrase that names the motive; adding it costs one clause.

4. **Chapter XVI « La solidarité européenne » (folios 561–581), anchored on folio 566
   and folio 574.** → `ch:global` (the 5-tier hierarchy / $E_{\text{global}}$). Firmin
   devoted a chapter to the book's global-Elite coalition: rival nations unanimous on
   the right to rule the world, the race question relabelled as "the cause of
   civilization." A footnote or short paragraph in `ch:global` noting that the
   coalition structure was named in 1885 would let the global chapter cite
   `firmin1885` directly rather than the anonymous entry (see §5).

5. **folio 152 — the method of averages ("leur faire dire ce qu'il veut … écartant
   les maximums ou les minimums suivant les convenances de la thèse à soutenir").**
   → `sec:firmin_counter_signal`, the signal/noise paragraph. Firmin describes
   selective sampling in 1885; it makes the book's "confirmation-biased
   pattern-matching on pre-labeled data" claim concrete with a contemporary account of
   the method, alongside the folio 138 line on Broca bending cubage to "une preuve
   cherchée partout."

6. **folio 210 — the Roman precedent and "une seconde espèce humaine."** → the
   Ontological Exclusion passage in the Portugal chapter (near line 2497, currently
   Zurara-sourced). Firmin found the classical legal template for the separate-species
   move: *capitis diminutio*, practice-first then justification, the slave reclassified
   as a second species. Add as "the Roman precedent Firmin identified" — it shows the
   move is a recurring structural device, not a Portuguese invention.

7. **folio 212 — the doctrine "implantée à l'égal d'un dogme," never argued; esprit
   d'école — with folio 575 ("C'est elle qui dirige la science").** → the
   institutional-capture / feedback-loop discussion (near lines 2738–2764). Firmin's
   account of how a school freezes an unargued premise in place.

8. **Préface, PDF 16 — the doctrine "créant un antagonisme … entre les divers éléments
   qui composent le peuple haïtien."** → the partition-variable / divide-and-conquer
   discussion (near line 240 or the Portugal chapter). Firmin naming the doctrine as
   an active manufacturer of intra-group antagonism, observed on Haiti.

9. **folio 661 — "s'est créé lentement, subrepticement … le jouet d'une méchante
   illusion" via "mythes … légendes … traditions."** → `sec:conspiracy_emergence`
   (Mode 2 / autonomous propagation) and the internalization discussion. Firmin's
   account of belief produced by social conditioning rather than evidence.

10. **folio 569 — "l'avocat plaidant *pro domo sua*."** → a compact epigraph-quality
    line for `sec:firmin_counter_signal`. Not a new argument; a sharper phrasing of
    one already made.

Lower priority but usable: folio 133 (five contradictory methods declared jointly to
yield truth), folio 230 ("cénacle fermé … l'Europe entière augmentée d'une partie de
l'Amérique"), folio 649 (doctrine as contaminant of any science), folio 658
(scholastic + theological "legions … in coalition"), folio 572 (doctrine to "rally
public opinion" behind colonial ventures).

---

## 5. Citing the 1885 original, and the claims currently on the anonymous entry

### The BibTeX entry already exists

`Paper/references.bib:997` already holds:

```bibtex
@book{firmin1885,
  author       = {Firmin, Anténor},
  title        = {De l'égalité des races humaines: anthropologie positive},
  publisher    = {F. Pichon},
  address      = {Paris},
  year         = {1885},
  note         = {BnF scan, archive.org identifier Antnor1885Bnf30437548r},
}
```

It is already used at folios 136, 138, 139 and 566–567 in `sec:firmin_counter_signal`.
The citation repair for that section is done. A light refinement only:

```bibtex
@book{firmin1885,
  author       = {Firmin, Anténor},
  title        = {De l'égalité des races humaines: anthropologie positive},
  publisher    = {Librairie Cotillon, F. Pichon},
  address      = {Paris},
  year         = {1885},
  langid       = {french},
  pagetotal    = {662},
  note         = {Public-domain BnF scan, archive.org identifier
                  Antnor1885Bnf30437548r. English translation: Asselin Charles,
                  \textit{The Equality of the Human Races}, Garland, 2000.},
}
```

(`pagetotal = 662` is the last printed folio; the PDF has 687 images.)

### The real problem is `firmin_legacy`, and `firmin1885` does not fix all of it

`Paper/references.bib:990` — `author = {{Anonymous}}`, `journal = {Gradhiva}`,
`year = {2009}` — is still cited **20 times** in the manuscript. Most of those uses are
in the Firmin Protocol section (`sec:firmin_protocol`, lines 12607–12717) and the
biographical paragraphs at 12755–12765: the Môle Saint-Nicolas affair (1891), Admiral
Gherardi's credentials, Killick and the *Crête-à-Pierrot* / SMS *Panther* (1902), the
serialization in *La Fraternité* (1893), the First Pan-African Conference (1900), the
Nkrumah address (1964). **The 1885 book cannot source any of these — they postdate
it.** `firmin1885` is not a drop-in replacement for `firmin_legacy`.

Split the 20 uses into two groups:

**(a) Claims that are about the 1885 framework and can move to `firmin1885` now:**

- **line 633** — "Firmin's attack on pseudo-scientific racial hierarchy supplies an
  early counter-signal against the epistemic layer of $P_{\text{gaslight}}$."
  → `firmin1885`.
- **line 12755** — "the first complete, empirically grounded model of how Western
  racial hierarchies functioned as global extraction architectures." This is precisely
  folios 566–567 + 645 + 570. → `firmin1885` (cite folios 566, 645).
- **line 12763** — "race as a *managed partition boundary* used to divide populations
  whose material interests otherwise aligned … $\partial(I_{\text{buffer}} \cup
  O_{\text{racialized}})$." Supported by folio 645 and Préface PDF 16.
  → `firmin1885` (cite folio 645).
- **line 12763** — "Firmin's framework preceded Du Bois's by eighteen years … both
  were describing" the same partition boundary. The 1885 text supports the framework
  content via folios 561–581 and 645; the "eighteen years" framing is interpretive and
  can stand on `firmin1885` for the Firmin half.

**(b) Claims that need a real biography — not `firmin1885`, not an anonymous entry:**

Everything in `sec:firmin_protocol` (Môle Saint-Nicolas, Gherardi, 24 April 1891),
lines 12619–12631 (Killick, *Crête-à-Pierrot*, SMS *Panther*, 1902), line 12757
(*La Fraternité*, 1893), line 12759 (Pan-African Conference, 1900), line 12765
(Nkrumah, 1964).

Real sources already in `references.bib` that cover this ground:
`manigat` (Leslie F. Manigat, *Anténor Firmin: Les moments marquants d'une vie…*,
2010) — already **co-cited** with `firmin_legacy` in most of the Firmin Protocol
footnotes, so in those places `firmin_legacy` is redundant and can simply be dropped;
`drouinhans` (Drouin-Hans, *Ludus Vitalis*, 2005) — good for the SAP's non-review of
the 1885 book and the Royer episode.

Recommended action for the maintainer (not done here — no `.tex`/`Paper/` edits):

1. In `sec:firmin_protocol` and lines 12755–12765, wherever `\cite{firmin_legacy,
   manigat}` appears, delete `firmin_legacy` and keep `manigat`.
2. For the framework claims in group (a), cite `firmin1885` with the folio numbers
   above.
3. For the standalone `firmin_legacy` uses that remain (Pan-African Conference,
   Nkrumah, *La Fraternité*), either locate the real *Gradhiva* 2009 article and give
   it a proper author, or replace it with a named biography — the introduction to
   Asselin Charles's 2000 translation, or Ghislain Gouraige / Dantès Bellegarde on
   Firmin's diplomatic career.
4. Once no citations remain, delete the `firmin_legacy` entry.

An anonymous entry carrying twenty citations, including the biographical spine of an
entire section, is the citation risk here — larger than the single unsupported
quotation the earlier pass removed.

---

## Verification log

Pages rendered at `-r 165` and read against the image; every folio confirmed at
PDF − 21; every quotation confirmed verbatim with accents:

| PDF | folio | what was confirmed |
|---|---|---|
| 225 | 204 | "ne repose que sur l'idée de l'exploitation…"; "l'intérêt capital qu'ils avaient à la préconiser"; the recent-construction dating |
| 231 | 210 | "il fallait bien trouver une raison pour en légitimer l'institution"; Florus / "seconde espèce humaine, quasi secundum hominum genus sunt" |
| 232 | 211 | "sans reconnaître aux premières le droit de réduire les autres à la servitude, pourvu que la chose leur fasse utilité"; section II heading; "les esclavagistes intéressés, les philosophes inconscients ou les savants aveuglés" |
| 172 | 151 | table + start of the method-of-averages passage |
| 173 | 152 | "l'expérimentateur … trouve facilement une façon de leur faire dire ce qu'il veut … écartant les maximums ou les minimums suivant les convenances de la thèse à soutenir" |
| 251 | 230 | "toute la phalange fière et orgueilleuse …"; "la science n'est pas faite à l'usage d'un cénacle fermé, fût-il aussi grand que l'Europe entière augmentée d'une partie de l'Amérique" |
| 587 | 566 | "toutes les nations européennes, de race blanche, sont naturellement portées à s'unir pour dominer ensemble le reste du monde"; "l'arrière-pensée de pouvoir l'exploiter à son tour"; "besoin d'une justification morale ou scientifique" |
| 588 | 567 | "Pour légitimer les prétentions européennes…"; "Elle est le résultat du plus affreux égoïsme … les soutiens des convoitises matérielles"; "ne voient … que des pays et des hommes à exploiter" |
| 590 | 569 | "des avocats défendant une cause à laquelle ils sont directement intéressés … l'avocat plaidant pro domo sua"; "le principal mobile de toutes les colonisations" |
| 591 | 570 | "ouvriers de mensonge … propagande détestable … l'œuvre abominable que les anciens colons exerçaient"; "Ces savants ont-ils conscience de leur malheureuse complicité ?"; the maintenance-cost counterfactual |
| 666 | 645 | "d'exclusion en exclusion, elle aboutit fatalement à la conception d'un petit noyau d'hommes, presque dieux par la puissance, destinés à subjuguer le reste des humains"; "un système oligarchique ou despotique … l'établissement de vraies castes, dans la nation même"; "la dernière étape accomplie dans l'abolition des privilèges" |
| 682 | 661 | "ainsi s'est créé lentement, subrepticement, le plus grand obstacle …"; "ils ont été le jouet d'une méchante illusion … mythes … légendes … traditions" |

**Not yet image-verified** (read only in the layout extraction; check before quoting):
Préface PDF 11, 14, 16; folios 133, 203, 205, 206, 209, 212, 213, 233, 242, 564,
571, 572, 574, 575, 578–579, 646, 648, 649, 650, 653, 657, 658.

**Process note.** The parallel Kimi run assembled the region findings via a five-way
sub-agent swarm (which completed) but its main agent then hung trying to reassemble
the sub-agent output into a single file; the swarm's raw findings were recovered
directly and folded into this report. No git commands, `.tex` edits, or `Paper/`
writes were made by that run or this one.
