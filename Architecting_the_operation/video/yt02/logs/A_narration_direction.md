# Narration Direction Audit

## Basis

The audit used the rotated Argand-plane convention in `Paper/The_Original_Power.tex`, Equation 3.5 and the Complex Suppression Allocation passage. Screen coordinates are `x = psi-sub-s` and `y = negative psi-sub-m`. Positive material provision points down, material extraction points up toward the Elite, positive psychological status points right, and Quadrant Two occupies the upper-right region.

The shot mapping came from:

```text
YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py turns 10
YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py turns 12
```

## Edited turns

### Line 1392 — S10-16

- First five words: `Theta begins on the vertical`
- Old: “Theta begins on the vertical material axis. At zero degrees, the phasor points straight up and the wage is purely material.”
- New: “Theta begins on the vertical material axis. At zero degrees, the phasor points straight down and the wage is purely material.”
- Word count: 21 before, 21 after; 0 percent change.
- Cue words checked: `wage_plane_hero.py` initializes S10-16 at zero degrees without a `self.at` cue in the S10-16 turn. S10-16 has no `V2_STATES` entry in `wage_phasor.py`. No cue word changed.

### Line 1420 — S10-23

- First five words: `Continue the rotation past ninety`
- Old: “Continue the rotation past ninety degrees. The phasor drops below the horizontal line into the framework's Quadrant II regime.”
- New: “Continue the rotation past ninety degrees. The phasor rises above the horizontal line into the framework's Quadrant II regime.”
- Word count: 19 before, 19 after; 0 percent change.
- Cue words checked: `wage_plane_hero.py` uses `self.at(0, "past")`. The word `past` remains in the turn. S10-23 has no `V2_STATES` entry in `wage_phasor.py`.

### Line 1862 — S12-12

- First five words: `Material wage extends down the`
- Old: “Material wage rises on the vertical axis, and psychological status extends across the horizontal axis. Theta at ninety degrees is pure status; Quadrant Two begins past ninety.”
- New: “Material wage extends down the vertical axis, and psychological status extends right along the horizontal axis. Theta at ninety degrees is pure status; Quadrant Two begins past ninety.”
- Word count: 27 before, 28 after; 3.7 percent increase.
- Cue words checked: S12-12 has no `self.at` call or `V2_STATES` entry in `wage_plane_hero.py` or `wage_phasor.py`. No cue word changed.

## Direction statements checked and left unchanged

- Line 288, “vector extraction aimed through law, courts, policing, credit, and capital allocation”: `through` identifies institutional channels and does not assign a screen-plane direction.
- Line 555, “upward economic extraction ... paired with a downward suppression allocation”: extraction runs toward the Elite and the allocation runs toward the governed tier.
- Line 584, “restores net extraction toward its pre-shock equilibrium”: `toward` identifies a dynamical equilibrium in state space and does not describe screen geometry.
- Line 796, “the extraction flowing upward”: upward flow points toward the Elite.
- Line 988, “status wage ... elevated them above enslaved Africans”: `above` describes legal rank in the hierarchy.
- Line 1346, “extraction crosses into the Buffer Class”: the phrase identifies the negative-material regime in which the Buffer Class becomes a source of extraction.
- Line 1359, “rotate the entire plane a quarter turn clockwise” and “x equals psi-sub-s and y equals negative psi-sub-m”: both statements define the required screen transformation.
- Line 1363, “material value ... points down,” “Material extraction points up,” “status points right,” and “Quadrant two sits upper-right”: all four placements state the required convention directly.
- Line 1368, “Theta opens from the downward psi-sub-m direction toward psi-sub-s”: theta starts at the downward material axis and advances toward the rightward status axis.
- Line 1372, “vertical component is psi-sub-m”: the projection identity agrees with Equation 3.5 and leaves its sign to cosine of theta.
- Line 1376, “horizontal component is psi-sub-s”: the projection identity agrees with Equation 3.5 and the rightward positive status axis.
- Line 1388, “regimes at zero, ninety, and beyond ninety degrees”: these values identify pure material, pure status, and negative-material operating modes.
- Line 1400, “the arrow rotates toward the psychological axis”: increasing theta moves the phasor from down toward right.
- Line 1404, “At ninety degrees, the phasor lies entirely on the horizontal axis”: ninety degrees gives zero psi-sub-m and positive psi-sub-s.
- Line 1408, “transferring zero net work across the material axis”: pure reactive power at ninety degrees has zero material projection.
- Line 1424, “Material wealth flows out of the Buffer Class toward the Elite”: negative psi-sub-m sends material wealth upward toward the Elite.
- Line 1436, “The ninety-degree position is the extraction kernel's default operating mode”: the default position is pure positive status with zero material benefit.
- Line 1440, “Past ninety degrees ... Quadrant II”: the stated negative material transfer and positive psychological wage define the upper-right region.
- Line 1486, “Quadrant two: negative material labor ... positive deputized status”: the sign pair places the wage in the upper-right region.
- Line 1490, “Quadrant one, drawn near forty-five degrees”: positive material and positive status components occupy the lower-right region before ninety degrees.
- Line 1507, “Quadrant two remains ordinal direction and sign change”: theta above ninety degrees changes the material sign while status stays positive.
- Line 1512, “stop the phasor” and “placed poor Europeans above enslaved Africans in law”: the phasor instruction has no conflicting placement, and `above` describes legal rank.
- Line 1524, “The phasor therefore shows a mixed allocation”: positive material and psychological components place the allocation between zero and ninety degrees.
- Line 1536, “the phasor animation assigns no invented angle”: the sentence withholds an unsupported historical placement and leaves the convention unchanged.
- Line 1540, “extraction through phase-shifted proxy channels”: `through` identifies institutional routing and leaves the phasor convention unchanged.
- Line 1548, “route extraction through criminal status” and “through spatial and financial proxies”: both phrases identify channels and leave screen direction unchanged.
- Line 1552, “the material projection can cross below zero”: `below zero` describes the signed value of psi-sub-m. Its screen coordinate rises because screen y equals negative psi-sub-m.
- Line 1556, “status remains positive on the horizontal axis” and “Quadrant II phasor describes material loss”: positive status points right, while negative material value places the phasor above the horizontal axis.
- Line 1560, “extraction crosses into the Buffer Class”: the angle records the shift to negative material transfer from the Buffer Class.
- Line 1866, “the phasor shows direction and operating mode”: the sentence assigns no contradictory screen direction.
- Line 1886, “placing the phasor at ninety degrees, pure status”: ninety degrees lies on the rightward psychological axis.
- Line 1902, “W equals j psi-s” and “pure-status wage at ninety degrees”: both expressions place the phasor on the rightward status axis.
- Line 1918, “theta at ninety degrees”: the accompanying psychological status wage agrees with the pure-status position.
- Line 1934, “material direction ... negative psi-s squared”: the Pullman Corollary states a negative material result and agrees with Buffer Class material loss.
- Line 1954, “Theta crosses ninety degrees into Quadrant Two”: theta above ninety degrees enters the upper-right negative-material regime.
- Line 1970, “The phasor moves deeper into Quadrant Two” and “extracts material wealth from the Buffer Class”: the movement increases the negative material component while status remains positive.
- Line 1986, “Quadrant Two now runs on algorithmic hardware”: the operating substrate changes while the negative-material, positive-status sign structure remains fixed.
- Line 2003, “lose material wealth to the Elite”: the transfer runs from the governed tiers upward to the Elite.
- Line 2188, “directing systemic extraction downward onto white Americans”: this sentence uses the separate institutional-force vector from Equation 25.1. That vector runs from the Elite down the five-tier hierarchy toward the targeted Out-group.
- Line 2200, “institutional force vector ... pointing downward at the racialized Out-group”: this is the same hierarchy-force vector from Equation 25.1 and agrees with its manuscript definition.
- Line 2241, “the Buffer Class wage rotates between material provision and psychological status”: the two endpoints are the downward material axis and the rightward status axis.

## Result

Three conflicting turns were corrected. Every edited turn stays within the permitted word-count range. Every Manim cue word associated with those turns remains present.
