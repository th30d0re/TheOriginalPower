// Header for the second-batch builders (g_fig21.js, g_bayes.js, g_rlc_tail.js): loads the helper
// library stored in Figma (node 167:646, the text of g_lib.js's function) instead of resending it.
// Run as: g_head.js + builder.
const H = await eval("(" + (await figma.getNodeByIdAsync("167:646")).characters + ")")();
const { page, C, bp, solid, MAT, STAT, RED, INK, DIMC, SURF, TS, ES, ST, ASSET, txt, svg, kf, op, show, draw, windows, line, rig, panel, frame, captions, source, finish, math, ringAround, curve, stage } = H;
