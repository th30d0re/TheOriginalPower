# Q9 Argon — design and text

Portrait scenes for the Question 9 reply. Each Emmanuel Theodore turn puts a short fragment of his own sentence on screen when that word is spoken. At most three lines stay up. The newest line is 84 px. The picture under the lines is the claim: the map, the rate bars, the receipt, the rifles, the wage plane, the scatter.

Clip turns are the source reel through `ClipFrames`. The Green excerpt inside TheCheck is the reel alone, from the cue `green` until Virginia.

Tulsa, the machine-gun turn, Madison, the second Locke turn, the stockpile restatement, the second August 1, and the 2004 slip stay off every scene. So do g21's +58%, g12's deadline and fine, g02's Pew percentages, g14's license-fee split, Article 17, and forced-reset.

Cue additions in `stage/stage_q9.yaml` are word cues only. Existing cues and shots are unchanged. The plan was recompiled to `stage/ov/stage_plan.json`.

The 1938 map file in the still renderer's public folder was a symlink, and the still bundle served that link. The bytes from `scriptCast-stage/video/public/assets/frames/boston_holc_shootings_map.png` now sit at that public path. The stage copy is unchanged.

## Checks

```
npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/q9_bostopia/stage
```

Exit 0. The compiler printed nothing.

```
node Architecting_the_operation/video/q9_bostopia/stage/tools/check_q9.mjs
```

```
PASS: 134 Q9 frames rendered in two fresh processes; all markup hashes match.
PASS: audit self-test (10 rules); 134 Q9 frames; layout, cues, numbers, word budget, hook policy.
```

```
python3 tools/check_antithesis.py
```

on every scene file written, `scenes/shared/layout.tsx`, `scenes/shared/WagePlane.tsx`, `stage/tools/check_q9.tsx`, and this file:

```
check-antithesis: no banned constructions found.
```

## Contact sheets

Reviewed after the layout fixes. Boston and the repeal are the later render.

- `/tmp/q9argon-c/HisClose_sheet.png`
- `/tmp/q9argon-c/SaintDomingue_sheet.png`
- `/tmp/q9argon-d/BostonMap_sheet.png`
- `/tmp/q9argon-c/Paranoia_sheet.png`
- `/tmp/q9argon-c/TheCheck_sheet.png`
- `/tmp/q9argon-d/TheRepeal_sheet.png`
- `/tmp/q9argon-c/TheRight_sheet.png`
- `/tmp/q9argon-c/TheWage_sheet.png`
- `/tmp/q9argon-c/TheGovernor_sheet.png`
- `/tmp/q9argon-c/TheReturn_sheet.png`

## What each scene shows

- **HisClose.** Narration: closing his case, a yes on Question 9, in his mouth, makes you a psychopath, one of four kinds, then the only politics he names, Libertarianism, and this answer comes from the left. Picture: four squares, then the politics card with the reel source.
- **SaintDomingue.** Narration: he cites no source, the state bans the AR-15, then arms against this government, a privileged position, your protector. Picture: the 3% bar beside the 42% bar, with the Pew and FBI source.
- **BostonMap.** Narration: here in Boston, graded C and D, seven times the shooting rate, state-sponsored democide. Picture: the 1938 map across the width, and the rate bars for D 3.14, C 3.12, and A and B 0.43.
- **Paranoia.** Narration: gun ownership among Black women, eighty-seven percent, called it paranoia. Picture: the +87% bar rising from a baseline, sourced to NSSF via KRON4.
- **TheCheck.** Narration: Smith and Wesson, September 25th 2024, fifty thousand dollars, one receipt, the small receipts, the listening tours, two hundred dollars or more, Virginia's poll tax, the Court struck it down, median net wealth, seventy-eight hundred, the one still arriving. Picture: the receipt, the field of 3,324 with 2,499 in gold, the fee stack, and $550,000 against $7,800 on one baseline. The Green clip is the reel with no card on it.
- **TheRepeal.** Narration: he should lose the gun, everyone who votes no, the 2024 act was already strict, banned by name, the notice, the same round, register and keep it, the tightening, then stock and grip, a smaller shooter, women and disabled people, a school. Picture: the AR-15 beside the Mini-14, August 1 2024, then the stock and the grip on a light plate.
- **TheRight.** Narration: he calls the right a privilege, unalienable, the Declaration, a permission, the state of nature, other animals, the firearm, a worse condition, when he pleases. Picture: the Locke sentence on the quote card, with the Founders' Constitution source.
- **TheWage.** Narration: sold firearms to enslaved people, arms for captives, the white buffer class as a wage, the slave patrols, George Mason, to disarm the people, let them sink, the date in this law, Lexington in April 1775, the equivalent of an AR-15. Picture: the wage plane, then 1788 beside August 1, 2024.
- **TheGovernor.** Narration: that is Governor Healey, a yes vote funds none of the programs she names, the position is incoherent. Picture: those three lines on the card, with her reel source.
- **TheReturn.** Narration: poverty tracks gun homicide, about point seven, essentially zero, safe storage and background checks, the laws RAND finds work best, then today is voting day, vote no, racism sexism and systemic ableism, safe storage left standing, a larger change. Picture: the state scatter, and the r = +0.72 bar beside the r = +0.29 bar resolving toward about zero.
