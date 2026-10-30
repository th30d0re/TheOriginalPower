// node apply_g_patch.js : apply card_builder_patch_g.js to card_builder.js in place (idempotent: skips when already patched).
const fs = require("fs"), path = require("path");
const REPL = require("./card_builder_patch_g.js");
const f = path.join(__dirname, "card_builder.js");
let src = fs.readFileSync(f, "utf8");
if (src.includes("const RICHF = new Map()")) { console.log("already patched"); process.exit(0); }
for (const [a, b] of REPL) { const n = src.split(a).length - 1; if (n !== 1) throw new Error("match count " + n + " for: " + a.slice(0, 60)); src = src.replace(a, () => b); }
fs.writeFileSync(f, src); console.log("patched", src.length);
