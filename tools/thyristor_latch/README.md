# Thyristor Latch

An instrument for the self-exciting generator (eq. 0.1a, `Paper/The_Original_Power.tex:474`) and the
Parasitic System Collapse Theorem (`:14412`–`:14440`): the holding current I_H drops when the Out-group
routes its energy through its own grid.

- Published page (private until shared): https://claude.ai/artifact/5GVSzcapRRGRENYNzKAJza
- Local copy: open `thyristor_latch.html` in a browser.

## What the page does

- A live simulation (time in years) of the field B and the extraction current I through the Elite's
  latch. Controls: the share s routed to the Out-group's own grid, the feedback efficiency η, the field
  decay rate λ, and a gate pulse (a manufactured crisis that kicks the field).
- A strip chart of I against I_H and of B against the latch threshold, for the last 60 years.
- A bifurcation diagram of the steady states against s, with the critical share s*.

## The assumption the page adds

Eq. 0.1a is linear. With a fixed extraction term, the field settles at η·E/λ and reaches zero only when
extraction stops. A latch also needs extraction to depend on the field (compliance depends on it). The
page uses I = (1 − s)·E₀·B²/(B² + K²). The loop then has two stable states, on and off, for s < s*,
with s* = 1 − 2λK/(ηE₀) and I_H = λK/η, the current at the fold. The behavior that follows:

- raising s past s* releases the latch;
- lowering s again does not re-latch it (hysteresis);
- a gate pulse re-latches it only while s < s*.

E₀ = 1 and K = 1. The values are illustrative.
