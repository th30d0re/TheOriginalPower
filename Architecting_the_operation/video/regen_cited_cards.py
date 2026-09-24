#!/usr/bin/env python3
"""Batch-regenerate Chapter 135 reaction-video fact cards with citation footers.

Usage: python3 regen_cited_cards.py g05 [g06 ...]

Per card: back up the current PNG (once), write a v2 source text, add it to the
NotebookLM notebook, generate a portrait infographic, download over images/gNN.png.
Resumable: cards with a "done" entry in the log are skipped.
"""
import json
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

NLM = "/Users/emmanuel/.local/bin/nlm"
NOTEBOOK = "e695c969-61c7-4e3a-961c-3a35e6a46499"
ROOT = Path("/Users/emmanuel/Documents/Theory/TheOriginalPower")
IMG = ROOT / "Architecting_the_operation/video/images"
SRCDIR = ROOT / "Architecting_the_operation/video/sources_v2"
LOG = ROOT / "Architecting_the_operation/video/work/regen_cited_cards.jsonl"

STYLE = """
## Visual direction

- Canvas: 1080x1920 portrait (Instagram Reel).
- Style: flat vector illustration, dark navy background, limited accent palette —
  this card joins an existing set and must match it.
- Layout: content centered with generous margins; the render will be scaled to
  ~60-65% of frame height over a backdrop in the edit, so everything must survive
  shrinking.
- Footer: print the source line below in small type, and beneath it leave a small
  empty outlined square (~120x120px) labeled "QR" at bottom-center (a QR code gets
  composited in later).
- HARD RULE: no depiction of any real, named person. Generic faceless figures only.
"""

CARDS = {
    "g05": {
        "title": "G-05 v2 — Neighborhood disadvantage vs poverty (with sources)",
        "focus": "Neighborhood disadvantage predicts gun-violence exposure far more than household poverty alone",
        "body": """# G-05 — Neighborhood disadvantage vs. poverty

## Grounded facts (verified — citations.md Card 10)
A 2022 peer-reviewed study of youth in large U.S. cities found that neighborhood
disadvantage predicts gun-violence exposure far more strongly than household
poverty alone: about a 50-percentage-point gap in exposure between high- and
low-disadvantage neighborhoods, versus 5-10 points attributable to household
poverty by itself.

## Exact on-card copy (use verbatim)
Headline: "Where the violence actually concentrates"
Bar 1 (large): "~50-point gap in gun-violence exposure — high- vs. low-disadvantage
neighborhoods"
Bar 2 (much smaller): "5-10 points — household poverty alone"
Source line: "Source: Inequities in Community Exposure to Deadly Gun Violence,
PMC (2022)"
""",
    },
    "g06": {
        "title": "G-06 v2 — Lead-crime connection (with sources)",
        "focus": "Reyes 2007: leaded-gasoline phase-out and the generation-later violent-crime drop",
        "body": """# G-06 — The lead-crime connection

## Grounded facts (verified — citations.md Card 11)
Jessica Wolpaw Reyes, "Environmental Policy as Social Policy?" (NBER Working Paper
13097, 2007), ties the 1970s-80s state-by-state phase-out of leaded gasoline to a
large share of the violent-crime decline roughly two decades later. States phased
out lead at different times, creating a natural experiment: each state's crime
decline tracks its own phase-out timing with a ~20-year lag, as lead-exposed
cohorts reached adulthood.

## Exact on-card copy (use verbatim)
Headline: "The Lead-Crime Connection"
Phase 1 (1970s-1980s): "Leaded gasoline phase-out — staggered state by state"
Phase 2 (20 years later): "Violent crime falls as lead-free cohorts reach adulthood"
Caption: "Each state's crime drop tracks its own lead phase-out — two decades on."
Source line: "Source: Reyes (2007), NBER Working Paper 13097"
""",
    },
    "g07": {
        "title": "G-07 v2 — Baltimore homicide drop (with sources)",
        "focus": "Baltimore's 2024 homicide decline credited to the Group Violence Reduction Strategy",
        "body": """# G-07 — Baltimore: what actually worked

## Grounded facts (verified — citations.md Card 12)
Baltimore recorded 201 homicides in 2024 versus 261 in 2023 — a 23% drop and the
first year-end total under 300 since 2014. City officials and independent reporting
credit the Group Violence Reduction Strategy: focused deterrence aimed at the
specific social networks driving violence, paired with wraparound services. No new
firearms statute drove the decline.

## Exact on-card copy (use verbatim)
Headline: "Baltimore: what actually worked"
Stat: "Homicides: 261 (2023) → 201 (2024) — down 23%"
Subline: "Credited to the Group Violence Reduction Strategy — focused deterrence
plus real investment. No new gun law."
Source line: "Sources: Office of the Mayor, Baltimore (2025) · The Trace (2026)"
""",
    },
    "g08": {
        "title": "G-08 v2 — NYC shooting decline (with sources)",
        "focus": "NYC shootings down three years running, credited by NYPD to hot-spot policing",
        "body": """# G-08 — NYC: what actually worked

## Grounded facts (verified — citations.md Card 13)
NYPD's own reporting credits the multi-year decline in shootings to deploying
officers to hot-spot locations (including public housing and the subway) and a
stated "laser-like focus on criminals who use illegal guns." A policing-strategy
and enforcement story; New York State passed no new assault-weapons-style statute
driving it.

## Exact on-card copy (use verbatim)
Headline: "NYC: what actually worked"
Stat: "Shootings down three years running"
Subline: "NYPD credits hot-spot deployment and targeted enforcement against
illegal guns — no new state gun statute."
Source line: "Source: NYPD / NYC.gov (Jan 2025)"
""",
    },
    "g09": {
        "title": "G-09 v2 — Article 48 referendum mechanics (with sources)",
        "focus": "How a Massachusetts referendum normally stays a law, and the emergency-preamble exception",
        "body": """# G-09 — Article 48: how a referendum is supposed to work

## Grounded facts (verified — citations.md Card 14)
Under Article 48 of the Massachusetts Constitution, most new laws take effect 90
days after passage, and a certified veto-referendum petition suspends the law
until voters decide. A law carrying an emergency preamble takes effect immediately
and cannot be stayed by a referendum petition — the referendum still happens
later, with the law running in the meantime.

## Exact on-card copy (use verbatim)
Headline: "How a referendum is supposed to work — Article 48"
Flow, three steps: "Law passes" → "90-day clock starts" → "Certified petition STAYS
the law until voters decide"
Fourth box, in a warning color: "UNLESS: emergency preamble — law runs immediately"
Source line: "Sources: MA Constitution, Article XLVIII · mass.gov"
""",
    },
    "g10": {
        "title": "G-10 v2 — The Chapter 135 timeline (with sources)",
        "focus": "Timeline: signing July 25 2024, emergency preamble October 2 (69 days later), signature drive, certification",
        "body": """# G-10 — The timeline

## Grounded facts (verified — citations.md Card 15)
Governor Healey signed Chapter 135 on July 25, 2024, with an October 23, 2024
effective date. On October 2, 2024 — 69 days after signing, after the repeal
campaign's signature drive was publicly past the threshold — she signed an
emergency preamble putting the law into effect immediately, blocking the
referendum petition from staying it. Her stated reasons: the measures needed to
"go into effect without delay," and agencies and municipalities needed time to
prepare for "implementation on Day One." The campaign submitted 93,229 raw
signatures that October; the Secretary of State reported 78,707 verified on
November 22, 2024.

## Exact on-card copy (use verbatim)
Headline: "The timeline they don't put in the press release"
Timeline, five points in order:
1. "Jul 25, 2024 — signed"
2. "Oct 2, 2024 — emergency preamble signed (69 days later). Stated reason:
'without delay'"
3. "Oct 23, 2024 — the law's own original effective date"
4. "Oct 2024 — 93,229 signatures submitted"
5. "Nov 22, 2024 — 78,707 certified"
Source line: "Sources: Ballotpedia · Foley Hoag LLP · AP / NBC Boston (Oct 2, 2024)"
""",
    },
    "g11": {
        "title": "G-11 v2 — Louisiana 1898 grandfather clause (with sources)",
        "focus": "Louisiana 1898 grandfather clause gutted Black voter registration; struck down in Guinn 1915",
        "body": """# G-11 — Grandfather clauses, then

## Grounded facts (verified — citations.md Card 16)
Louisiana's 1898 constitution exempted voters from new literacy and property tests
if they, their father, or their grandfather had been entitled to vote before
January 1, 1867. Black registration collapsed from 130,344 to 5,320 within three
years while white registration fell about 24%. The U.S. Supreme Court struck down
grandfather clauses in Guinn v. United States (1915), explicitly despite their
being "racially neutral on its face."

## Exact on-card copy (use verbatim)
Headline: "Grandfather clauses, then — Louisiana, 1898"
Stat: "Black registration: 130,344 → 5,320 in three years"
Subline: "Cutoff: January 1, 1867. White registration: down about 24%."
Quote: "'racially neutral on its face' — struck down, Guinn v. United States (1915)"
Source line: "Sources: BlackPast.org · Guinn v. United States, 238 U.S. 347 (1915)"
""",
    },
    "g12": {
        "title": "G-12 v2 — Chapter 135 grandfather clause (with sources)",
        "focus": "Same rifle: owned before August 1 2024 you keep it, acquired after it is banned",
        "body": """# G-12 — Grandfather clauses, now

## Grounded facts (verified — citations.md Card 17)
Under Chapter 135, firearms lawfully possessed before August 1, 2024 are
grandfathered (conditioned on registration and serialization by October 28, 2026).
A firearm newly classified as an "assault weapon" and acquired after that date
cannot legally be acquired at all — possession carries criminal exposure.

## Exact on-card copy (use verbatim)
Headline: "Grandfather clauses, now"
Two identical rifle icons stacked vertically:
Top, dated "Owned before Aug 1, 2024": green check — "You keep it."
Bottom, dated "Acquired after Aug 1, 2024": red X — "A felony."
Caption: "Same gun. Same caliber. The only variable is a date."
Source line: "Source: Chapter 135, Acts of 2024 (H.4885)"
""",
    },
    "g13": {
        "title": "G-13 v2 — The two-year lag (with sources)",
        "focus": "2020 Black gun-buyer surge, 2022 Bruen ruling, and Massachusetts' two-year handgun-licensing lag",
        "body": """# G-13 — Who had guns, who's getting them, and the two-year lag

## Grounded facts (verified — citations.md Cards 18, 19, 22)
The national surge in Black gun ownership began in 2020: Black gun buyers rose 58%
that year versus 2019 (NSSF/CNN), and NSSF reported an 87% jump in gun ownership
among Black women in 2021. NYSRPA v. Bruen (June 23, 2022) struck down
discretionary "may issue" licensing and named Massachusetts' "good reason"
provision as the same defect — forcing MA from may-issue to shall-issue for the
License to Carry (LTC), which handguns require. The FID card covering rifles and
shotguns already had no discretionary requirement before Bruen. Net effect:
Massachusetts handgun access lagged the national buying surge by two years.

## Exact on-card copy (use verbatim)
Headline: "The two-year lag"
Timeline, three beats:
1. "2020 — Black gun buyers +58%. 2021 — Black women owners +87% (NSSF)"
2. "Massachusetts: still 'may issue' for handguns — a police chief's personal
sign-off required"
3. "June 2022 — Bruen forces MA to 'shall issue'"
Caption: "Rifles (FID card) were already near-automatic. The lag was
handgun-specific — two years behind a national trend."
Source line: "Sources: NSSF / CNN (2020-21) · NYSRPA v. Bruen (2022)"
""",
    },
    "g14": {
        "title": "G-14 v2 — What an LTC costs (with sources)",
        "focus": "Massachusetts license-to-carry costs: $100 fee plus $100-150 mandatory live-fire course",
        "body": """# G-14 — What it costs to get one

## Grounded facts (verified — citations.md Card 20)
The Massachusetts License to Carry application fee is $100, non-refundable, and
separate from the required safety course, typically $100-150 depending on
provider. Live-fire training became mandatory for all new LTC applicants starting
August 1, 2024.

## Exact on-card copy (use verbatim)
Headline: "What it costs to get one"
Receipt-style card, two line items:
- "State application fee (non-refundable): $100"
- "Mandatory live-fire safety course: $100-150"
Total line: "≈ $200-250 before you own anything."
Source line: "Sources: mass.gov LTC application · MA safety-course providers"
""",
    },
    "g15": {
        "title": "G-15 v2 — AR-15 vs Mini-14 (with sources)",
        "focus": "AR-15 banned by name, Ruger Mini-14 named by the MA AG as not covered, same caliber",
        "body": """# G-15 — AR-15 vs. Mini-14

## Grounded facts (verified — citations.md Card 21)
Massachusetts' assault weapons ban names the Colt AR-15 directly as a banned
enumerated weapon. The Attorney General's own enforcement guidance names "any
Ruger Mini 14 or substantially similar model" as an example of a weapon that is
not a prohibited copy or duplicate — despite firing the same 5.56/.223 round with
comparable ballistics. The operative distinction is a features test (adjustable
stock, grip configuration, attachments), so the legal line runs through a feature
list rather than lethality.

## Exact on-card copy (use verbatim)
Headline: "Same caliber. Different paperwork."
Two rifle silhouettes stacked vertically, shared label "5.56/.223" on both:
Top: "AR-15 — BANNED by name"
Bottom: "Ruger Mini-14 — named by the MA AG as NOT covered"
Caption: "The difference is a feature list. Same round, same ballistics."
Source line: "Source: mass.gov — Enforcing the Massachusetts Assault Weapons Ban"
""",
    },
}


def run(cmd, timeout=280):
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)


def done_cards():
    done = set()
    if LOG.exists():
        for line in LOG.read_text().splitlines():
            try:
                rec = json.loads(line)
                if rec.get("status") == "done":
                    done.add(rec["card"])
            except json.JSONDecodeError:
                continue
    return done


def log(rec):
    LOG.parent.mkdir(parents=True, exist_ok=True)
    with LOG.open("a") as f:
        f.write(json.dumps(rec) + "\n")


def poll_artifact(artifact_id, deadline_s=210):
    start = time.time()
    while time.time() - start < deadline_s:
        r = run([NLM, "studio", "status", NOTEBOOK], timeout=60)
        try:
            arts = json.loads(r.stdout)
            status = next(a["status"] for a in arts if a["id"] == artifact_id)
        except Exception:
            status = "parse-error"
        print(f"  poll: {status} ({int(time.time() - start)}s)", flush=True)
        if status in ("completed", "failed"):
            return status
        time.sleep(20)
    return "timeout"


def process(card_id):
    card = CARDS[card_id]
    png = IMG / f"{card_id}.png"
    backup = IMG / f"{card_id}_v1_backup.png"
    if png.exists() and not backup.exists():
        shutil.copy2(png, backup)
        print(f"  backed up {png.name} -> {backup.name}", flush=True)

    SRCDIR.mkdir(parents=True, exist_ok=True)
    src_file = SRCDIR / f"{card_id}_source.md"
    src_file.write_text(card["body"] + STYLE)

    print(f"[{card_id}] adding source…", flush=True)
    r = run([NLM, "source", "add", NOTEBOOK, "--text", src_file.read_text(),
             "--title", card["title"], "--wait"], timeout=280)
    m = re.search(r"Source ID:\s*([0-9a-f-]{36})", r.stdout)
    if not m:
        print(r.stdout, r.stderr, flush=True)
        log({"card": card_id, "status": "error", "stage": "source_add"})
        return
    source_id = m.group(1)
    print(f"  source {source_id}", flush=True)

    print(f"[{card_id}] creating infographic…", flush=True)
    r = run([NLM, "infographic", "create", NOTEBOOK, "--orientation", "portrait",
             "--source-ids", source_id, "--focus", card["focus"], "--confirm"],
            timeout=120)
    m = re.search(r"Artifact ID:\s*([0-9a-f-]{36})", r.stdout)
    if not m:
        print(r.stdout, r.stderr, flush=True)
        log({"card": card_id, "status": "error", "stage": "create",
             "source_id": source_id})
        return
    artifact_id = m.group(1)
    print(f"  artifact {artifact_id}", flush=True)

    status = poll_artifact(artifact_id)
    if status != "completed":
        log({"card": card_id, "status": status, "stage": "generate",
             "source_id": source_id, "artifact_id": artifact_id})
        return

    print(f"[{card_id}] downloading…", flush=True)
    r = run([NLM, "download", "infographic", NOTEBOOK, "--id", artifact_id,
             "--output", str(png), "--no-progress"], timeout=180)
    ok = png.exists() and "Downloaded" in r.stdout
    print(f"  {'✓ done' if ok else '✗ download problem: ' + r.stdout + r.stderr}",
          flush=True)
    log({"card": card_id, "status": "done" if ok else "error",
         "stage": "download", "source_id": source_id,
         "artifact_id": artifact_id})


def main():
    ids = [a for a in sys.argv[1:] if a in CARDS]
    if not ids:
        print("usage: regen_cited_cards.py " + " ".join(CARDS))
        sys.exit(1)
    skip = done_cards()
    for cid in ids:
        if cid in skip:
            print(f"[{cid}] already done, skipping", flush=True)
            continue
        process(cid)


if __name__ == "__main__":
    main()
