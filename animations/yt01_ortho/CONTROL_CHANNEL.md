# EffectCraft 0.2.0 control channel

Scouted 2026-10-15. Model: GPT-6 (Codex).

The working entry point is `engine.execute`, with the editor command inside
`params.command` and its arguments inside `params.params`. The live application
advertises 640 editor commands through `engine.commands`. JavaScript execution,
project inspection, queue inspection, and job inspection passed read-only probes.

## Transport and response handling

Connect to TCP `127.0.0.1:47821`. The running process was configured with
`EFFECTCRAFT_CONTROL_PORT=47821`. Send UTF-8 JSON followed by LF; read one JSON
response line. Multiple sequential requests on one connection worked. New
connections per request also worked. No authentication handshake was required.

```json
{"id":10,"method":"engine.execute","params":{"command":"script.run","params":{"code":"1 + 2"}}}
```

Exact observed response:

```json
{"id":10,"ok":true,"result":{"error":null,"ok":true,"output":"","result":3}}
```

`id` is echoed; integer and string IDs worked. Omitting it returned `id:null`.
Omitting `params` worked for `ui.inspect`. Use explicit object parameters for
commands. An omitted method behaved as an empty method name.

Transport/dispatch errors use this envelope:

```json
{"error":"unknown method `foo`","id":32,"ok":false}
```

Calling `engine.execute` with `{}` returned
`{"error":"missing \u0060command\u0060","id":4,"ok":false}`.

Script execution has its own success flag. This read-only failure probe:

```json
{"id":24,"method":"engine.execute","params":{"command":"script.run","params":{"code":"throw new Error(\"SCOUT read-only test\")"}}}
```

returned:

```json
{"id":24,"ok":true,"result":{"error":{"column":7,"file":"script","line":1,"message":"SCOUT read-only test"},"ok":false,"output":"","result":null}}
```

Check the outer `ok`, then the inner script `ok` and `error`. The included
`ec.py` prints the complete envelope and returns exit status 1 for either failure,
2 for a client/connection error, and 0 for a successful response. It performs one
explicit request per invocation, defaults to `ui.inspect`, and writes no files.
Its generic interface can invoke mutating commands when supplied by its caller.

## Top-level methods

The arm64 `effectcraft_ui_egui::control::handle` dispatch contains these 24 method
names. **Live** means a successful read-only request was observed. **Error probe**
means required-parameter validation was observed. **Static** means the handler was
read in the installed binary and execution was deliberately omitted. Static
parameter lists record recovered keys; unresolved types/defaults are identified
below. This table separates the channel methods from the editor command catalogue.

| Method | Parameters recovered | Result / evidence |
|---|---|---|
| `engine.commands` | `{filter?: string, enabledOnly?: bool}` | Live. Command metadata array: `id,label,menu,params,shortcut,enabled,why`. Both filters tested. |
| `engine.execute` | `{command: string, params?: object}` | Live. Executes the named command and wraps its result. |
| `ui.menu.invoke` | `{command: string, params?: object}` | Live with `renderQueue.list`; shares the dispatch branch with `engine.execute`. |
| `ui.inspect` | `{}` | Live. Application, UI, timeline, selection and timing state. |
| `ui.elements` | `{prefix?: string}` | Live, including prefix filtering. Array of `{id,label,rect:[x,y,width,height]}`. |
| `ui.menu.list` | `{}` | Live. Menu entries with `id,label,path,enabled,shortcut` and optional preset `params`. |
| `ui.viewer.locate` | `{x: number, y: number}` | Live. Composition pixels to window/UI point `{x,y}`. |
| `ui.timeline.locate` | `{layer: integer}` | Error probe: `need \u0060layer\u0060 (id)`. Static code calls timeline locator. |
| `ui.viewer.hit` | point object described below | Live. Converts window/UI points to composition pixels, returning `{x,y}`. |
| `render.frame` | `{comp?: id or name, time?: number, seconds?: number, max_side?: number, maxSide?: number, transparent?: bool}` | Static. Resolves a composition, renders and PNG-encodes a frame, returns base64. Exact success payload unconfirmed. |
| `ui.screenshot` | `{panel?: string, path?: string}` | Static. Screenshot handling includes a file-writing path; skipped. Path omission behavior unconfirmed. |
| `ui.click` | point object, optional `button`, modifier keys | Static; injects UI input. |
| `ui.move` | point object | Static; injects pointer movement. |
| `ui.drag` | `{from: point, to: point, steps?: number}`, modifier keys | Static; injects a drag sequence. |
| `ui.scroll` | point object plus `{dx?: number, dy?: number}`, modifier keys | Static; injects wheel input. |
| `ui.type` | `{text: string}` | Static; injects text input. |
| `ui.key` | `{key: string}`, modifier keys | Static; uses the application's shortcut parser. |
| `ui.focus` | `{}` | Static; sends a viewport command to focus the application window. |
| `ui.panel.show` | `{panel: string}` | Static; shows a panel. |
| `ui.panel.close` | `{panel: string}` | Static; closes a panel. |
| `ui.resize` | `{width?: number, height?: number}` | Static; requests window dimensions. |
| `ui.playback` | `{action?: string}` | Static; recovered `toggle` default and action comparisons. Accepted action vocabulary remains unconfirmed. |
| `ui.set` | optional keys listed below | Static; modifies UI state. |
| `app.quit` | `{force?: bool}` | Static; exit handler. Never called. |

The point helper reads `id` (an element identifier), `x`, `y`, and element-relative
`fx`,`fy`. Numeric coordinates refer to UI points. Exact defaults for `fx`,`fy`
and behavior for unavailable element IDs remain unconfirmed. Modifier handling
reads a `modifiers` object with a top-level fallback; accepted modifier names and
button values remain unconfirmed. Obtain targets from `ui.elements` before input.

`ui.set` references these keys: `tool`, `workspace`, `theme`, `focused`, `viewer`,
`zoom`, `res`, `pan`, `rulers`, `safeMargins`, `transparencyGrid`, `pps`, `start`,
`graphEditor`, `showModes`, `openLayers`, `openGroups`, `menuBar`, `projectColumns`,
`animTools`, and `homeTab`. Some are nested UI/viewer/timeline settings. Their
nesting, full accepted value types, and side effects require a separate mutable
test. The binary's theme error names `dark`, `darker`, and `light`.

The live coordinate query `ui.viewer.locate` with `{x:960,y:540}` returned
`{x:840.0,y:324.6000061035156}` with `pixelsPerPoint:2.0` in `ui.inspect`.
These coordinates describe the observed layout and must be refreshed for use.
Passing that returned point to `ui.viewer.hit` returned `{x:960.0,y:540.0}`.

## Discovering editor commands and their parameters

```json
{"id":2,"method":"engine.commands","params":{"filter":"script"}}
{"id":3,"method":"engine.commands","params":{"filter":"renderQueue"}}
```

For JSON Schema metadata, use the editor command directly:

```json
{"id":40,"method":"engine.execute","params":{"command":"command.list","params":{"filter":"script","schemas":true}}}
```

The `schema` objects contain `type`, `properties`, `required`, descriptions, and
`additionalProperties:false`. Several property schemas contain descriptions alone,
so treat them as discovery metadata with incomplete type validation. Passing
`schemas:true` to top-level `engine.commands` produced its usual response without
schema fields. A `prefix` parameter on `engine.commands` returned all 640 entries;
use `filter` there. `enabled` and `why` describe the current project/selection state.

Every advertised editor command and its exact parameter description is preserved
in the final catalogue. The following commands address the scout's three goals:

| Editor command | Parameters | Verification |
|---|---|---|
| `script.run` | `{code:string, name?:string, console?:bool}` | Live arithmetic, read-only project query, and thrown-error probes. |
| `file.runScript` | `{path}` for `.jsx`, `.js`, `.jsonl`, `.json`; alternatively `{name}` or `{steps:[{command,params}]}` | Live catalogue; execution omitted because the scout forbids opening files through the channel. |
| `file.scripts.list` | `{}` | Live catalogue. |
| `renderQueue.render` | `{wait?:bool}`; documented default `true` | Live catalogue plus static asynchronous waiter code; rendering omitted. |
| `renderQueue.list` | `{}` | Live, returns `{items,progress,rendering}`. |
| `jobs.list` | `{}` | Live, returns `{finished,running}`. |
| `jobs.wait` | `{}` | Live with no jobs, returned `{finished:[]}`. |
| `project.summary` | `{}` | Live, returns project path, dirty flag, items, active composition, selection, time, renderer and undo history. |
| `editor.state` | `{}` | Live, returns editor state including open compositions, selection and per-composition times. |

## Render progress and completion

Start a background render with this request during an authorized rendering run:

```json
{"id":102,"method":"engine.execute","params":{"command":"renderQueue.render","params":{"wait":false}}}
```

Poll these read-only requests on fresh connections while it runs:

```json
{"id":103,"method":"engine.execute","params":{"command":"renderQueue.list","params":{}}}
{"id":104,"method":"engine.execute","params":{"command":"jobs.list","params":{}}}
```

Exact idle responses observed:

```json
{"id":11,"ok":true,"result":{"items":[],"progress":null,"rendering":false}}
{"id":22,"ok":true,"result":{"finished":[],"running":[]}}
```

Static inspection of `render_queue::list` recovered the non-null `progress` keys:
`current` (optional unsigned integer), `done` (unsigned integer), `total` (unsigned
integer), `elapsed` (float), `item_elapsed` (float), `remaining` (optional float),
`items_done` (unsigned integer), `items_total` (unsigned integer), and `finished`
(boolean). Types come from serializer calls. Units, counter semantics, and a live
non-null example remain unconfirmed.

For a blocking request, use `wait:true` and a suitably long socket timeout. Static
inspection shows `execute_engine` detects `renderQueue.render`, reads `wait`, and
uses a `JobWaiter` to defer completion while the UI remains active. This behavior
has a binary basis; a successful render/completion reply was not observed.

After `rendering` becomes false, inspect queue item statuses and job errors, then
validate the output file. The idle boolean alone cannot establish render success.
The exact populated item and completed-job payloads remain unconfirmed.

## Worked build-and-render example

This is a prepared execution recipe. The scout executed only the read-only
examples above. The recipe invokes the build script and render commands. The build
brief requires project saving and video output; successful execution remains
unverified. At the start of scouting, `build.jsx` was absent from
the directory; its eventual contents and successful execution remain unverified.

From the repository root, run the build script using the advertised file handler:

```bash
python3 animations/yt01_ortho/ec.py --timeout 300 engine.execute '{"command":"file.runScript","params":{"path":"/Users/emmanuel/Documents/Theory/TheOriginalPower/animations/yt01_ortho/build.jsx"}}'
```

Equivalent wire request:

```json
{"id":100,"method":"engine.execute","params":{"command":"file.runScript","params":{"path":"/Users/emmanuel/Documents/Theory/TheOriginalPower/animations/yt01_ortho/build.jsx"}}}
```

Check the returned errors and inspect the queue:

```bash
python3 animations/yt01_ortho/ec.py engine.execute '{"command":"renderQueue.list","params":{}}'
```

The build brief requires the script to queue `YT01_Ortho` with H.264 output at
`animations/yt01_ortho/yt01_ortho.mp4`. If the queue is empty after a successful
build, the advertised native command provides this explicit fallback:

```bash
python3 animations/yt01_ortho/ec.py engine.execute '{"command":"renderQueue.add","params":{"comp":"YT01_Ortho","format":"h264","output":"/Users/emmanuel/Documents/Theory/TheOriginalPower/animations/yt01_ortho/yt01_ortho.mp4","timeSpan":"comp"}}'
```

Review the queue's composition, output path, enabled items and frame range, then
start rendering and poll:

```bash
python3 animations/yt01_ortho/ec.py engine.execute '{"command":"renderQueue.render","params":{"wait":false}}'
python3 animations/yt01_ortho/ec.py engine.execute '{"command":"renderQueue.list","params":{}}'
python3 animations/yt01_ortho/ec.py engine.execute '{"command":"jobs.list","params":{}}'
```

Repeat the two inspection calls about once per second until rendering ends. For
a blocking alternative, replace the render invocation with:

```bash
python3 animations/yt01_ortho/ec.py --timeout 3600 engine.execute '{"command":"renderQueue.render","params":{"wait":true}}'
```

A code-string alternative uses `script.run` with the file contents supplied by
the client. The following Python recipe is also prepared and unexecuted:

```python
import sys
from pathlib import Path
sys.path.insert(0, "animations/yt01_ortho")
from ec import execute

path = Path("animations/yt01_ortho/build.jsx").resolve()
reply = execute("script.run", {"code": path.read_text(), "name": str(path)}, timeout=300)
print(reply)
if not reply.get("ok") or not reply["result"].get("ok"):
    raise RuntimeError("Build failed; inspect the response")
```

File-relative includes and `$.fileName` behavior for this code-string alternative
remain unverified. Prefer `file.runScript` for the intended file execution path.

## Evidence, scope, and unresolved items

Artifact opened: `/Applications/EffectCraft.app/Contents/MacOS/EffectCraft`.
`file` identified a universal Mach-O with x86_64 and arm64 slices. `strings -a`
located `apps/effectcraft/src/control_server.rs` and
`crates/ui-egui/src/control.rs`. `nm -arch arm64` identified symbols. LLDB created
an offline target and disassembled the binary; it never attached to the running
process. Relevant unslid arm64 addresses:

| Symbol | Address |
|---|---|
| `effectcraft_ui_egui::control::handle` | `0x1015eac80` |
| `effectcraft_ui_egui::control::execute_engine` | `0x1015e8a34` |
| `effectcraft_ui_egui::control::inspect` | `0x1015ef628` |
| `effectcraft_ui_egui::control::point` | `0x1015ea2c4` |
| `effectcraft_ui_egui::control::modifiers` | `0x1015f28dc` |
| `effectcraft_ui_egui::control::JobWaiter::finish` | `0x1015b4ed4` |
| `effectcraft_engine::commands::render_queue::list` | `0x100a3c55c` |

The dispatcher compares method bytes using immediate constants, which explains
why plain strings searches missed many method names. Python's standard-library
socket client supplied all live probes. The read-only JavaScript version query
returned `26.0 (EffectCraft 0.2.0)`.

The observed project had 11 items, active composition 502 (`EffectCraft Intro`),
`dirty:false`, `path:null`, empty undo history, time `5.438766666666667`, and an
empty render queue. No build script, render, project operation, UI input, quit,
or screenshot-saving method was executed. No Git command was run. Output is
restricted to this report and `ec.py`, as required by `SCOUT.md`.

Validation: the client returned the arithmetic result and idle queue response.
Both a script error and an unknown-method error produced exit status 1. Python
AST parsing passed without writing bytecode. A final project query retained the
same item count, active composition, time, clean flag and empty undo history.
The prose checker reported zero banned constructions; its three review findings
were factual negations about observed behavior and scope. Independent prose review
found zero CERTAIN and zero arguable violations, with 11 constructions cleared.
Its qualification of the prepared recipe was incorporated above.

Remaining gaps:

- Actual `build.jsx` compatibility, file-handler success payload, saved project,
  encoded video, populated queue items, and render completion/error payloads.
- Mutable UI parameter types/defaults, exact nested `ui.set` shape, and optional
  screenshot behavior. Static discoveries are identified in the method table.
- Server limits, concurrent request ordering, cancellation after a socket timeout,
  and behavior across other EffectCraft versions.

## Complete editor command catalogue

The following entries are copied from the live `engine.commands` result. They are
application-provided parameter descriptions. Enumeration establishes advertised
availability; the verification sections above identify commands actually executed.

```jsonl
{"command": "file.newProject", "params": "{}"}
{"command": "file.openDemoProject", "params": "{}"}
{"command": "file.open", "params": "{path}"}
{"command": "file.save", "params": "{path?}"}
{"command": "file.saveAs", "params": "{path}"}
{"command": "file.incrementAndSave", "params": "{}"}
{"command": "file.revert", "params": "{}"}
{"command": "file.import", "params": "{paths: [string], importAs?: footage|composition|compositionLayerSizes (Photoshop, PDF, Illustrator and EPS files), layer?: name|index (footage of one Photoshop layer), page?: number from 1 (PDF / Illustrator page), drag?: bool (dropped files: Settings ▸ Import ▸ Default Drag Import As)}"}
{"command": "file.projectSettings", "params": "{bitDepth?: 8|16|32, colorEngine?: adobe|ocio, workingSpace?: none|srgb|rec709|rec2020|p3|acescg|aces2065, linearize?, blendLinear?, hdr?: clip|compand|toneMap, outputSpace?: srgb|rec709|rec2020|p3|rec2100pq|rec2100hlg, renderer?: gpu|software, timeDisplay?: timecode|frames|feet35|feet16}"}
{"command": "file.cycleBitDepth", "params": "{}"}
{"command": "render.backend", "params": "{backend?: gpu|cpu}"}
{"command": "edit.undo", "params": "{}"}
{"command": "edit.redo", "params": "{}"}
{"command": "edit.cut", "params": "{layers?} (keyframes when keys are selected)"}
{"command": "edit.copy", "params": "{layers?} (keyframes when keys are selected)"}
{"command": "edit.copyWithPropertyLinks", "params": "{layers?} (selected properties, or layers, as expressions linking to the originals)"}
{"command": "edit.copyWithRelativePropertyLinks", "params": "{layers?} (like Copy with Property Links, using thisComp)"}
{"command": "edit.copyExpressionOnly", "params": "{}"}
{"command": "edit.paste", "params": "{} (layers, keyframes at the CTI, or property links / expressions)"}
{"command": "edit.pasteReversedKeyframes", "params": "{layers?, prop?|path?, time?}"}
{"command": "edit.clear", "params": "{layers?}"}
{"command": "edit.duplicate", "params": "{layers?}"}
{"command": "edit.splitLayer", "params": "{layers?}"}
{"command": "edit.liftWorkArea", "params": "{layers?}"}
{"command": "edit.extractWorkArea", "params": "{layers?}"}
{"command": "edit.selectAll", "params": "{}"}
{"command": "edit.deselectAll", "params": "{}"}
{"command": "edit.label", "params": "{label: Red|Yellow|Aqua|…, layers?, keys?, target?: layers}"}
{"command": "edit.selectLabelGroup", "params": "{}"}
{"command": "edit.purgeUndo", "params": "{}"}
{"command": "edit.purge", "params": "{what?: all|memoryAndDisk|memory|disk|3d|image|snapshot}"}
{"command": "cache.diskStats", "params": "{}"}
{"command": "edit.editOriginal", "params": "{}"}
{"command": "edit.history.list", "params": "{} → {states: [{index, id, label, parent, depth, current, line, future}], current, branches}"}
{"command": "edit.history.goto", "params": "{index? (from edit.history.list) | id? | steps? (negative = back along the line)}"}
{"command": "comp.new", "params": "{name?, width?, height?, frameRate?, duration? (s), startTime? (s) | startTimecode?, background? [r,g,b]|#hex, pixelAspect?, shutterAngle?, shutterPhase?, motionBlurSamples?, adaptiveSampleLimit? (16–256), preserveFrameRate?: bool, preserveResolution?: bool, renderer? classic3D|advanced3D, anchor?, open?}"}
{"command": "comp.settings", "params": "{comp?, name?, width?, height?, anchor? 0-8 (resize anchor, 4 = center), frameRate?, duration?, startTime? (s) | startTimecode?, background?, shutterAngle?, shutterPhase?, motionBlurSamples?, adaptiveSampleLimit? (16–256), preserveFrameRate?: bool (nested or in the render queue it shows only its own frames), preserveResolution?: bool (nested, it renders at full size), pixelAspect?, renderer? classic3D|advanced3D}"}
{"command": "comp.setPosterTime", "params": "{}"}
{"command": "comp.trimToWorkArea", "params": "{comp?}"}
{"command": "comp.open", "params": "{comp: id|name}"}
{"command": "comp.close", "params": "{comp?}"}
{"command": "comp.workArea", "params": "{start?, end?, set?: begin|end (at CTI)}"}
{"command": "comp.setSwitch", "params": "{switch: hideShy|motionBlur|frameBlending|draft3d, value?}"}
{"command": "comp.addMarker", "params": "{time?, comment?}"}
{"command": "layer.newText", "params": "{text?, name? (layer name; default the text), position? [x,y], box? [x,y,w,h] (paragraph text, comp space), vertical?, edit? (start editing), font?, style?, size?, fill?, stroke?, applyFill?, applyStroke?, strokeWidth?, tracking?, leading?, baselineShift?, hScale?, vScale?, tsume?, fauxBold?, fauxItalic?, allCaps?, smallCaps?, baseline?, superscript?, subscript?, kerning?, ligatures?, justify?, indentLeft?, indentRight?, indentFirst?, spaceBefore?, spaceAfter?, direction?, composer?, hangingPunctuation?, strokeOverFill?} (attributes as layer.setText)"}
{"command": "layer.newSolid", "params": "{name?, color? #hex|[r,g,b], width?, height?, pixelAspect?}"}
{"command": "layer.newNull", "params": "{name?}"}
{"command": "layer.newShape", "params": "{kind?: rect|rounded|ellipse|star|polygon|none, name?, size?, fill?, stroke?, strokeWidth?, position?}"}
{"command": "layer.newAdjustment", "params": "{name?}"}
{"command": "layer.settings", "params": "{layer?, name?, color?, width?, height?, pixelAspect?, affectAll?: bool (default true; false gives this layer its own copy of a solid other layers use)} → {layer, solid?}"}
{"command": "layer.addItem", "params": "{item: id|name, time?, duration? (s, for a still)}"}
{"command": "layer.select", "params": "{layers: [id|name|#n], add?, toggle?}"}
{"command": "layer.selectNext", "params": "{add?}"}
{"command": "layer.selectPrevious", "params": "{add?}"}
{"command": "layer.setSwitch", "params": "{layers?, switch: video|audio|solo|lock|shy|collapse|quality|fx|frameBlend|motionBlur|adjustment|threeD|guide|preserveTransparency, value?}"}
{"command": "layer.rename", "params": "{layer?, name}"}
{"command": "layer.setComment", "params": "{layers?, comment}"}
{"command": "layer.setBlendMode", "params": "{layers?, mode?: Normal|Multiply|Screen|…, step?: ±1}"}
{"command": "layer.setTrackMatte", "params": "{layer?, matte: layer|null, kind?: alpha|alphaInverted|luma|lumaInverted}"}
{"command": "layer.setParent", "params": "{layers?, parent: layer|null}"}
{"command": "layer.timing", "params": "{layers?, op?: moveInToTime|moveOutToTime|trimInToTime|trimOutToTime, delta?, start?, in?, out?, merge?}"}
{"command": "layer.slip", "params": "{layers?, delta? (seconds) | frames?, merge?}"}
{"command": "layer.slipBack", "params": "{layers?}"}
{"command": "layer.slipForward", "params": "{layers?}"}
{"command": "layer.arrange", "params": "{layers?, to: front|forward|backward|back, index?, above?: layer}"}
{"command": "layer.precompose", "params": "{layers?, name?, mode?: move|leave, adjustDuration?, open?}"}
{"command": "layer.addMask", "params": "{layer?, shape?: rect|ellipse, rect? [x,y,w,h], mode?}"}
{"command": "layer.setMask", "params": "{layer?, mask: index|uid|name, mode?, inverted?}"}
{"command": "layer.addShapeItem", "params": "{layer?, kind: group|rect|ellipse|star|polygon|fill|stroke|gfill|trim|repeater|round|offset|pucker|twist|zigzag|wiggle|merge, group?: uid|path} → {uid, path}"}
{"command": "layer.setText", "params": "{layer?, range?: [start, end] (characters; default all), text?, font?, style?, size?, fill?, stroke?, applyFill?, applyStroke?, strokeWidth?, tracking?, leading?: px|\"auto\", baselineShift? px, hScale? %, vScale? %, tsume? %, fauxBold?, fauxItalic?, allCaps?, smallCaps?, baseline?: normal|superscript|subscript, superscript?, subscript?, kerning?: metrics|optical|number, ligatures?, OpenType: discretionaryLigatures?, contextualAlternates?, stylisticAlternates?, stylisticSets?: [1–20], ss01…ss20?, swash?, titling?, ordinals?, fractions?, allSmallCaps?, figureStyle?: default|lining|oldStyle, figureWidth?: default|proportional|tabular, figures?, variations?: {tag: value} (variable font axes; null resets), justify?: left|center|right|justifyLeft|justifyCenter|justifyRight|justifyAll, indentLeft?, indentRight?, indentFirst?, spaceBefore?, spaceAfter?, direction?: ltr|rtl, composer?: everyLine|singleLine, hangingPunctuation?, strokeOverFill?, box?: [x,y,w,h]|null (layer space), vertical?}"}
{"command": "layer.transform", "params": "{layers?, op: reset|center|fit|fitWidth|fitHeight|flipH|flipV}"}
{"command": "layer.style.convertToEditable", "params": "{layers?}"}
{"command": "layer.style.showAll", "params": "{layers?}"}
{"command": "layer.style.removeAll", "params": "{layers?}"}
{"command": "layer.style.dropShadow", "params": "{layers?}"}
{"command": "layer.style.innerShadow", "params": "{layers?}"}
{"command": "layer.style.outerGlow", "params": "{layers?}"}
{"command": "layer.style.innerGlow", "params": "{layers?}"}
{"command": "layer.style.bevelEmboss", "params": "{layers?}"}
{"command": "layer.style.satin", "params": "{layers?}"}
{"command": "layer.style.colorOverlay", "params": "{layers?}"}
{"command": "layer.style.gradientOverlay", "params": "{layers?}"}
{"command": "layer.style.stroke", "params": "{layers?}"}
{"command": "layer.style.add", "params": "{style: dropShadow|innerShadow|outerGlow|innerGlow|bevelEmboss|satin|colorOverlay|gradientOverlay|stroke (or display name), layers?}"}
{"command": "layer.style.remove", "params": "{layer?, style: id|name|uid|layerStyles}"}
{"command": "layer.style.toggle", "params": "{layer?, style: id|name|uid|layerStyles, value?}"}
{"command": "layer.style.globalLight", "params": "{comp?, angle? (deg), altitude? (deg, 0..90), time? (s)} — no values returns the current setting"}
{"command": "layer.style.list", "params": "{layer?}"}
{"command": "layer.autoOrient", "params": "{mode: off|alongPath|towardsCamera|towardsPointOfInterest, layers?}"}
{"command": "layer.newLight", "params": "{kind?: Parallel|Spot|Point|Ambient (default Spot), name?, color?, intensity?, coneAngle?, coneFeather?, falloff?: None|Smooth|Inverse Square Clamped, radius?, falloffDistance?, castsShadows?, shadowDarkness?, shadowDiffusion?, position? [x,y,z], poi? [x,y,z]}"}
{"command": "layer.newCamera", "params": "{name?, type?: oneNode|twoNode (default twoNode), preset?: 15mm|20mm|24mm|28mm|35mm|50mm|80mm|135mm|200mm, zoom?, focalLength? mm, angleOfView? deg, dof?, focusDistance?, aperture?, fStop?, blurLevel?, lockToZoom?, position? [x,y,z], poi? [x,y,z]}"}
{"command": "layer.cameraSettings", "params": "{layer?, name?, type?, preset?, zoom?, focalLength?, angleOfView?, dof?, focusDistance?, aperture?, fStop?, blurLevel?, position?, poi?}"}
{"command": "layer.lightSettings", "params": "{layer?, name?, kind?, color?, intensity?, coneAngle?, coneFeather?, falloff?, radius?, falloffDistance?, castsShadows?, shadowDarkness?, shadowDiffusion?, position?, poi?}"}
{"command": "view.set3DView", "params": "{view: activeCamera|default|front|left|top|back|right|bottom|custom1|custom2|custom3, comp?}"}
{"command": "view.3d.activeCamera", "params": "{comp?}"}
{"command": "view.3d.default", "params": "{comp?}"}
{"command": "view.3d.front", "params": "{comp?}"}
{"command": "view.3d.left", "params": "{comp?}"}
{"command": "view.3d.top", "params": "{comp?}"}
{"command": "view.3d.back", "params": "{comp?}"}
{"command": "view.3d.right", "params": "{comp?}"}
{"command": "view.3d.bottom", "params": "{comp?}"}
{"command": "view.3d.custom1", "params": "{comp?}"}
{"command": "view.3d.custom2", "params": "{comp?}"}
{"command": "view.3d.custom3", "params": "{comp?}"}
{"command": "view.3d.last", "params": "{comp?}"}
{"command": "view.lookAtSelected", "params": "{comp?, layers?}"}
{"command": "view.lookAtAll", "params": "{comp?}"}
{"command": "camera.fromView", "params": "{comp?}"}
{"command": "view.reset3DView", "params": "{comp?}"}
{"command": "view.set3DViewCamera", "params": "{view, eye? [x,y,z], poi? [x,y,z], zoom?}"}
{"command": "camera.orbit", "params": "{yaw|dx deg, pitch|dy deg, layer?, merge?} — current 3D view (camera layer in Active Camera)"}
{"command": "camera.pan", "params": "{dx, dy (comp px), layer?, merge?}"}
{"command": "camera.dolly", "params": "{amount (px, + = forward), layer?, merge?}"}
{"command": "view.get3D", "params": "{comp?} → current 3D view, view camera, active camera layer, lights"}
{"command": "layer.newModel", "params": "{item?: id or name of a 3D model footage item, path?: a .gltf, .glb or .obj file to import, name?, time? (s)}"}
{"command": "layer.new3dPrimitive", "params": "{kind: cube|sphere|plane|torus|cone|cylinder, name?, width?, height?, depth?, radius?, tubeRadius?, segments?, rings?, position? [x,y,z], baseColor?, metallic?, roughness?, emissive?, castsShadows?, acceptsShadows?, acceptsLights?}"}
{"command": "layer.newPrimitive", "params": "{kind: cube|sphere|plane|torus|cone|cylinder, name?, width?, height?, depth?, radius?, tubeRadius?, segments?, rings?, position? [x,y,z], baseColor?, metallic?, roughness?, emissive?, castsShadows?, acceptsShadows?, acceptsLights?}"}
{"command": "comp.renderer", "params": "{renderer?: advanced3d|classic3d (omit to read), value?}"}
{"command": "layer.environment", "params": "{layers?, on?}"}
{"command": "material.set", "params": "{layers?, castsShadows?: off|on|only, acceptsShadows?: off|on|only, acceptsLights?, appearsInReflections?, lightTransmission?, ambient?, diffuse?, specularIntensity?, specularShininess?, metal?, baseColor?, metallic?, roughness?, emissive?, time?}"}
{"command": "material.revealSource", "params": "{layer?}"}
{"command": "material.reset", "params": "{layers?}"}
{"command": "material.duplicateAssign", "params": "{layers? (first = source)}"}
{"command": "camera.stereoRig", "params": "{comp?, configuration?: stereoPair|centerRight|centerLeft, sceneDepth? (% of comp width, default 3), convergence?: bool, convergenceOf?: poi|zoom, zOffset?, view3d?: 3D Glasses view index (default 5 Balanced Colored Red Blue)}"}
{"command": "camera.orbitNull", "params": "{comp?, layer?: camera (default selected/active)}"}
{"command": "camera.fromModel", "params": "{comp?, layers?: 3D model layers (default selected)}"}
{"command": "light.fromModel", "params": "{comp?, layers?: 3D model layers (default selected)}"}
{"command": "light.controlWithCamera", "params": "{comp?, layers?: lights (default selected), camera? (default active), on?: bool (default toggle)}"}
{"command": "light.environmentBackground", "params": "{comp?, layer?: environment light (default selected / first)}"}
{"command": "layer.addTextAnimator", "params": "{layer?, properties: [anchor|position|scale|skew|rotation|opacity|transformAll|lineAnchor|lineSpacing|characterOffset|characterValue|blur|fillColor|fillHue|fillSaturation|fillBrightness|fillOpacity|strokeColor|strokeHue|strokeSaturation|strokeBrightness|strokeOpacity|strokeWidth|tracking|perChar3d], name?}"}
{"command": "layer.addTextAnimatorProperty", "params": "{layer?, animator?: uid|index, property: (see layer.addTextAnimator)}"}
{"command": "layer.addTextSelector", "params": "{layer?, animator?: uid|index, kind: range|wiggly|expression}"}
{"command": "layer.enablePerChar3D", "params": "{layer?, enabled?: bool, toggle?: bool}"}
{"command": "layer.applyTextPreset", "params": "{layer?, preset: typewriter|fadeUpCharacters|bounceInWords|trackingIn|scramble|blurIn|jitter|dropInLines}"}
{"command": "text.animatorFontAxes", "params": "{layer?, axis?: tag|name (omit to list the font's axes), animator?: uid|index}"}
{"command": "text.presets", "params": "{}"}
{"command": "text.animatorProperties", "params": "{}"}
{"command": "text.edit", "params": "{layer?, select?: [anchor, caret]|\"none\", caret?, created?} → {layer, anchor, caret}"}
{"command": "text.endEdit", "params": "{}"}
{"command": "text.fontFeatures", "params": "{layer?, font?, style?} → {family, style, features: [tags], options: {smallCaps, superscript, stylisticSets: [n], fractions, …}} (what the font sets with its own glyphs)"}
{"command": "text.setSelection", "params": "{layer?, start, end?} | {anchor, caret} | {select: \"all\"} (character indices)"}
{"command": "text.moveCaret", "params": "{to: left|right|wordLeft|wordRight|lineStart|lineEnd|up|down|paraStart|paraEnd|start|end, extend?}"}
{"command": "text.insert", "params": "{layer?, text, range?: [start, end], merge?} (replaces the selection)"}
{"command": "text.delete", "params": "{layer?, direction?: backward|forward, word?, range?: [start, end], merge?}"}
{"command": "edit.pasteTextMatchFormatting", "params": "{text?} (the clipboard's text in the style at the caret)"}
{"command": "edit.pasteTextFormattingOnly", "params": "{layer?} (the copied text's formatting on the selected text or text layers)"}
{"command": "layer.timeStretch", "params": "{layers?, percent?|duration? (s), hold?: in|current|out, op?: reverse}"}
{"command": "layer.timeReverse", "params": "{layers?}"}
{"command": "layer.enableTimeRemap", "params": "{layers?, value?}"}
{"command": "layer.freezeFrame", "params": "{layers?}"}
{"command": "layer.freezeOnLastFrame", "params": "{layers?}"}
{"command": "prop.get", "params": "{layer?, path|prop, time? (comp s)}"}
{"command": "prop.set", "params": "{layer?, path|prop, value, time?, merge?}"}
{"command": "prop.toggleAnimation", "params": "{layer?, path|prop, value?}"}
{"command": "prop.addKey", "params": "{layer?, path|prop, time?, value?}"}
{"command": "prop.toggleKey", "params": "{layer?, path|prop}"}
{"command": "keys.toggleTransform", "params": "{layers?, prop: anchor|position|scale|rotation|opacity} (Alt+Shift+A/P/S/R/T)"}
{"command": "prop.setExpression", "params": "{layer?, path|prop, expression?, enabled?}"}
{"command": "prop.reset", "params": "{layer?, path|prop, default?}"}
{"command": "prop.select", "params": "{layer?, path|prop, add?, selectKeys?}"}
{"command": "prop.convertExpressionToKeyframes", "params": "{layer?, path|prop}"}
{"command": "keys.select", "params": "{keys: [{layer, prop: uid | path (or `path`), time (layer s)}], add?, toggle?: bool (Shift+click: in or out of the selection)}"}
{"command": "keys.move", "params": "{delta (s), merge?}"}
{"command": "keys.delete", "params": "{}"}
{"command": "keys.easyEase", "params": "{which?: both|in|out}"}
{"command": "keys.easyEaseIn", "params": "{}"}
{"command": "keys.easyEaseOut", "params": "{}"}
{"command": "keys.toggleHold", "params": "{}"}
{"command": "keys.interpolation", "params": "{interpolation?: linear|bezier|continuousBezier|autoBezier|hold, in?|out?: linear|bezier|hold, autoBezier?, continuous?, spatial?: linear|bezier|continuousBezier|autoBezier, roving?}"}
{"command": "keys.velocity", "params": "{inSpeed?, inInfluence? %, outSpeed?, outInfluence? % (numbers or per-dimension arrays), continuous?}"}
{"command": "prop.renameGroup", "params": "{layer?, prop: uid, name}"}
{"command": "prop.setGroupEnabled", "params": "{layer?, prop: uid, value?}"}
{"command": "prop.removeGroup", "params": "{layer?, prop: uid}"}
{"command": "prop.duplicateGroup", "params": "{layer?, prop: uid} → {prop: new uid}"}
{"command": "prop.moveGroup", "params": "{layer?, prop: uid, index (1-based among its siblings)}"}
{"command": "project.select", "params": "{items: [id|name], add?}"}
{"command": "project.rename", "params": "{item?: id|name (default: selected), name}"}
{"command": "project.move", "params": "{items?: [id|name] (default: selected), folder: id|name|null (root)}"}
{"command": "project.setLabel", "params": "{items?, label: name|index}"}
{"command": "project.setComment", "params": "{items?, comment}"}
{"command": "project.delete", "params": "{items?: [id|name] (default: selected)} (folders with their contents; layers using the items go too)"}
{"command": "project.duplicate", "params": "{items?: [id|name] (default: selected)} → {items}"}
{"command": "keys.copy", "params": "{}"}
{"command": "keys.paste", "params": "{layers?, prop?|path?, time?}"}
{"command": "keys.selectAll", "params": "{layers?, visible?: [{layer, prop}] (every key of these properties)}"}
{"command": "keys.nudge", "params": "{frames, merge?}"}
{"command": "keys.nudgeForward", "params": "{}"}
{"command": "keys.nudgeBackward", "params": "{}"}
{"command": "keys.nudgeForward10", "params": "{}"}
{"command": "keys.nudgeBackward10", "params": "{}"}
{"command": "keys.set", "params": "{layer?, path|prop, time (layer s), newTime?, value?, merge?}"}
{"command": "keys.selectEqual", "params": "{}"}
{"command": "keys.selectPrevious", "params": "{}"}
{"command": "keys.selectFollowing", "params": "{}"}
{"command": "keys.setEase", "params": "{layer?, path|prop, time (layer s), side: in|out, dim?, speed?, influence? %, merge?}"}
{"command": "keys.timeReverse", "params": "{}"}
{"command": "keys.info", "params": "{keys?: [{layer, prop, time}]}"}
{"command": "keys.wiggle", "params": "{apply?: spatial|temporal, noise?: smooth|jagged, dimensions?: one|same|independent, dimension? (index for `one`), frequency? (keys/s, 5), magnitude?, seed?}"}
{"command": "keys.smooth", "params": "{tolerance? (property units, 1)}"}
{"command": "motion.sketch", "params": "{layer?, points: [[t, x, y]…] (t = capture seconds) | [[x, y]…] (one per frame), start? (s, default current time), captureSpeed? (%, 100), smoothing? (px, 1)}"}
{"command": "prop.separateDimensions", "params": "{layer?, value?}"}
{"command": "prop.pickWhip", "params": "{layer?, path|prop, target: {layer, path|prop}} → sets an AE reference expression"}
{"command": "markers.list", "params": "{layer? (omit for composition markers)}"}
{"command": "markers.set", "params": "{layer? (omit: comp marker), index? (0-based) | at? (comp s) | new?: true, time? (comp s), duration? (s), comment?, chapter?, url?, frameTarget?, cuePoint?: {name, navigation?, params?: [[name, value]…]} | null, protected?, label?}"}
{"command": "markers.delete", "params": "{layer?, index? | at? (comp s)}"}
{"command": "markers.convert", "params": "{layer? (layer marker → comp marker), index? | at?, toLayer? (comp marker → layer marker)}"}
{"command": "layer.updateMarkersFromSource", "params": "{layers?}"}
{"command": "mask.new", "params": "{layer?, vertices: [[x,y]…], inTangents?, outTangents?, closed?, mode?}"}
{"command": "mask.addVertex", "params": "{layer?, mask, point: [x,y], in?, out?, index?}"}
{"command": "mask.setVertex", "params": "{layer?, mask, index, point?, in?, out?, merge?}"}
{"command": "mask.setClosed", "params": "{layer?, mask, closed?}"}
{"command": "mask.selectVertices", "params": "{vertices: [{layer, mask, index}], add?, toggle?}"}
{"command": "mask.moveVertices", "params": "{vertices?: [{layer, mask, index}], delta: [dx,dy], merge?}"}
{"command": "mask.deleteVertices", "params": "{vertices?}"}
{"command": "mask.convertVertex", "params": "{layer?, mask: uid (mask or shape Path item), index, smooth?}"}
{"command": "mask.insertVertex", "params": "{layer?, mask: uid (mask or shape Path item), segment, t?: 0..1}"}
{"command": "mask.featherPoint.add", "params": "{layer?, mask, segment?, t?: 0..1, point?: [x,y] (layer space), radius? (px, negative = inner), tension? (%)} → {index}"}
{"command": "mask.featherPoint.set", "params": "{layer?, mask, index, segment?, t?, point? (slide along the path), radius?, toward?: [x,y] (radius from the drag point, layer space), tension? (%), merge?}"}
{"command": "mask.featherPoint.remove", "params": "{layer?, mask, index? | all?}"}
{"command": "mask.featherPoint.list", "params": "{layer?, mask}"}
{"command": "mask.remove", "params": "{layer?, mask}"}
{"command": "mask.removeAll", "params": "{layer?}"}
{"command": "path.rotoBezier", "params": "{layer?, mask?, value?}"}
{"command": "path.convertToBezier", "params": "{layer?, mask?}"}
{"command": "path.groupShapes", "params": "{layer?, items?: [uid]}"}
{"command": "path.ungroupShapes", "params": "{layer?, items?: [group uid]}"}
{"command": "path.setFirstVertex", "params": "{layer?, mask?: uid, index?}"}
{"command": "path.freeTransform", "params": "{layer?, mask?, scale?: % | [x%, y%], rotation?: deg, offset?: [dx, dy], anchor?: [x, y]}"}
{"command": "layer.mask.motionBlur", "params": "{layer?, mask?, mode: sameAsLayer|on|off}"}
{"command": "layer.mask.featherFalloff", "params": "{layer?, mask?, mode: smooth|linear}"}
{"command": "layer.mask.hideLocked", "params": "{value?}"}
{"command": "effect.apply", "params": "{effect: id|name (e.g. Gaussian Blur), layers?}"}
{"command": "effect.pickColor", "params": "{layer?, effect?: index|uid|name, param: id (e.g. screenColour) | prop: uid, x, y (layer px), average?: bool (5×5), time?} — the colour of the effect's input there"}
{"command": "effect.applyLast", "params": "{layers?}"}
{"command": "effect.removeAll", "params": "{layers?}"}
{"command": "effect.remove", "params": "{layer?, effect: index|uid|name}"}
{"command": "effect.toggle", "params": "{layer?, effect, value?}"}
{"command": "effect.reorder", "params": "{layer?, effect, index}"}
{"command": "effect.duplicate", "params": "{layer?, effect}"}
{"command": "effect.copy", "params": "{layer?, effect? | effects?: [uid|name|index]} (default: the selected effects)"}
{"command": "effect.paste", "params": "{layers?} — adds the copied effects to the layers"}
{"command": "effect.reset", "params": "{layer?, effect}"}
{"command": "effect.list", "params": "{filter?}"}
{"command": "effect.plugins.list", "params": "{} → {api, wasm, plugins: [{id, name, category, version, author, source, params}]}"}
{"command": "effect.plugins.load", "params": "{path (.wasm / .wat plug-in, API v1) | folder (loads every .wasm in it)}"}
{"command": "time.set", "params": "{time? (s) | frame? | timecode?}"}
{"command": "time.nextFrame", "params": "{}"}
{"command": "time.previousFrame", "params": "{}"}
{"command": "time.forward10", "params": "{}"}
{"command": "time.back10", "params": "{}"}
{"command": "time.step", "params": "{frames}"}
{"command": "time.start", "params": "{}"}
{"command": "time.end", "params": "{}"}
{"command": "time.layerIn", "params": "{}"}
{"command": "time.layerOut", "params": "{}"}
{"command": "time.nextKey", "params": "{visible?: [{layer, prop}] (only these properties' keys, as the Timeline shows them)}"}
{"command": "time.previousKey", "params": "{visible?: [{layer, prop}]}"}
{"command": "time.go", "params": "{to: start|end|workStart|workEnd|layerIn|layerOut|nextKey|prevKey, prop?: uid, visible?: [{layer, prop}]}"}
{"command": "renderQueue.add", "params": "{comp?: id|name, template?: Render Settings template, format?: h264|hevc|av1|prores|webm|png|jpeg|tiff|exr|gif|wav|aiff, output?: path|template, log?: errorsOnly|plusSettings|plusPerFrameInfo, quality?: best|draft|1-100 (jpeg, webm), resolution?: full|half|third|quarter|scale, proxyUse?, effects?, solo?, guideLayers?, colorDepth?, frameBlending?, fieldRender?, pulldown?, motionBlur?, timeSpan?: workArea|comp|custom, start?: s, end?: s, duration?: s, frameRate?: fps|null, skipExisting?: bool, storageOverflow?: bool, channels?: rgb|rgba|alpha, color?, bitrate?: kbps, webmBitrate?, keyframeInterval?, proresProfile?, profile?, level?, rateControl?, webmCodec?, audioBitrate?, opusApplication?, crop?, resize?, includeProjectLink?, audio?: auto|on|off, sampleRate?, audioChannels?, audioFormat?, loop?: bool (values as in setRenderSettings / setOutputModule)}"}
{"command": "renderQueue.remove", "params": "{item?: id, index?: n}"}
{"command": "renderQueue.setRender", "params": "{item?|index?, render?: bool (toggles)}"}
{"command": "renderQueue.setRenderSettings", "params": "{item?|index?, template?: name, quality?: best|draft, resolution?: full|half|third|quarter|scale, proxyUse?: current|all|comp|none, effects?: current|allOn|allOff, solo?: current|allOff, guideLayers?: current|allOff, colorDepth?: current|8|16|32, frameBlending?: current|onForChecked|offForAll, fieldRender?: off|upper|lower, pulldown?: off|WSSWW|SSWWW|SWWWS|WWWSS|WWSSW, motionBlur?: bool|current|onForChecked|offForAll, timeSpan?: workArea|comp|custom, start?: s, end?: s, duration?: s, frameRate?: fps|null, skipExisting?: bool, storageOverflow?: bool}"}
{"command": "renderQueue.setOutputModule", "params": "{item?|index?, module?: n (1 = first), template?: name, format?: h264|hevc|av1|prores|webm|png|jpeg|tiff|exr|gif|wav|aiff, channels?: rgb|rgba|alpha, color?: straight|premultiplied, quality?: 1-100, bitrate?: kbps, webmBitrate?: bool, keyframeInterval?: frames (0 = auto), proresProfile?: proxy|lt|standard|hq|4444|4444xq, profile?: main|main10 (HEVC/AV1), level?: auto|4.1, rateControl?: bitrate|quality, webmCodec?: vp9|av1, audioBitrate?: Opus kbps, opusApplication?: audio|voice, crop?: bool|{useRoi?, roi?, top?, left?, bottom?, right?}, cropTop?, cropLeft?, cropBottom?, cropRight?, resize?: bool|{preset?, width?, height?, lockAspect?, quality?: low|high}, resizeWidth?, resizeHeight?, postRenderAction?: none|import|importAndReplace|setProxy, includeProjectLink?: bool, audio?: auto|on|off, sampleRate?, audioChannels?: mono|stereo, audioFormat?: 16|24|32, loop?: bool, output?}"}
{"command": "renderQueue.setOutput", "params": "{item?|index?, module?: n, path: file path or template like [compName].[fileExtension]}"}
{"command": "render.addOutputModule", "params": "{item?|index? (default: the last item), format?, output?, channels?, quality?, bitrate?, proresProfile?, audio?}"}
{"command": "render.preRender", "params": "{comp?, output?: path|template, format?}"}
{"command": "render.saveCurrentPreview", "params": "{comp?, path}"}
{"command": "renderQueue.move", "params": "{item?|index?, to: n (1-based)}"}
{"command": "renderQueue.duplicate", "params": "{item?|index?}"}
{"command": "renderQueue.render", "params": "{wait?: bool (default true; the UI renders in the background)}"}
{"command": "renderQueue.stop", "params": "{}"}
{"command": "renderQueue.list", "params": "{}"}
{"command": "renderQueue.templates", "params": "{}"}
{"command": "renderQueue.saveTemplate", "params": "{kind: renderSettings|outputModule, name, item?|index? (save from this item), from?: template to copy, module?, params?: {setRenderSettings / setOutputModule keys}}"}
{"command": "renderQueue.deleteTemplate", "params": "{kind: renderSettings|outputModule, name}"}
{"command": "renderQueue.setTemplateDefault", "params": "{kind: renderSettings|outputModule, slot: movie|still|preRender|movieProxy|stillProxy, name}"}
{"command": "renderQueue.applyTemplate", "params": "{item?|index?, renderSettings?: template name, outputModule?: template name, module?: n}"}
{"command": "renderQueue.setLog", "params": "{item?|index?, log: errorsOnly|plusSettings|plusPerFrameInfo}"}
{"command": "renderQueue.setNotify", "params": "{notify?: bool (toggles)}"}
{"command": "renderQueue.setOverflowFolders", "params": "{folders: [path, …] (used in order when the output volume is full)}"}
{"command": "renderQueue.formats", "params": "{}"}
{"command": "help.docs", "params": "{page?: help|scripting|expressions|effects|agents}"}
{"command": "help.discord", "params": "{}"}
{"command": "help.website", "params": "{}"}
{"command": "help.appPage", "params": "{}"}
{"command": "help.github", "params": "{}"}
{"command": "help.onlineTutorials", "params": "{}"}
{"command": "help.inAppTutorials", "params": "{} → the Home screen's Learn tab"}
{"command": "help.reportIssue", "params": "{}"}
{"command": "help.sibling", "params": "{app: photocraft|vectorcraft|filmcraft|lightcraft|printcraft|designcraft, kind?: page|github}"}
{"command": "command.list", "params": "{filter?, enabledOnly?, schemas? (add each command's params JSON Schema)}"}
{"command": "command.describe", "params": "{command} → id, label, menu, shortcut, params doc, JSON `schema`, enabled"}
{"command": "app.capabilities", "params": "{} → version, command/effect counts, export formats, parity summary"}
{"command": "project.summary", "params": "{}"}
{"command": "comp.info", "params": "{comp?}"}
{"command": "layer.tree", "params": "{layer?, comp?, depth?, time? (comp s)} → nodes with `path`"}
{"command": "editor.state", "params": "{}"}
{"command": "engine.batch", "params": "{steps: [{command, params?}], label? (undo step name, default Batch), atomic?: bool (default true: a failing step rolls the whole batch back)} → {steps, results: [each step's result]}; a string param \"$N\" or \"$N.key.0\" is step N's result (1-based), e.g. {\"layer\": \"$1.layer\"}"}
{"command": "layer.quality", "params": "{layers?, quality: best|draft|wireframe}"}
{"command": "layer.sampling", "params": "{layers?, sampling: bilinear|bicubic}"}
{"command": "layer.frameBlending", "params": "{layers?, mode: off|frameMix|pixelMotion}"}
{"command": "layer.hideOtherVideo", "params": "{layers?}"}
{"command": "layer.showAllVideo", "params": "{comp?}"}
{"command": "layer.unlockAll", "params": "{comp?}"}
{"command": "layer.expressions", "params": "{layers?, enabled: bool}"}
{"command": "layer.setTransform", "params": "{layers?, prop: anchor|position|scale|orientation|rotation|opacity, value}"}
{"command": "layer.centerAnchor", "params": "{layers?}"}
{"command": "layer.mask.shape", "params": "{layer?, mask?, rect: [x, y, w, h], shape?: rect|ellipse}"}
{"command": "layer.mask.set", "params": "{layer?, mask?, field: feather|opacity|expansion, value}"}
{"command": "layer.mask.reset", "params": "{layer?, mask?}"}
{"command": "layer.mask.remove", "params": "{layer?, mask?}"}
{"command": "layer.mask.removeAll", "params": "{layers?}"}
{"command": "layer.mask.mode", "params": "{layer?, mask?, mode: None|Add|Subtract|Intersect|Lighten|Darken|Difference}"}
{"command": "layer.mask.invert", "params": "{layer?, mask?, value?}"}
{"command": "layer.mask.lock", "params": "{layer?, mask?, value?}"}
{"command": "layer.mask.unlockAll", "params": "{layers?}"}
{"command": "layer.mask.lockOthers", "params": "{layer?, mask?}"}
{"command": "layer.addMarker", "params": "{layers?, time?, comment?}"}
{"command": "layer.markersLock", "params": "{layers?, value?}"}
{"command": "layer.deleteAllMarkers", "params": "{layers?}"}
{"command": "layer.trackMatte", "params": "{layers?, op: none|alpha|alphaInverted|luma|lumaInverted|above|below}"}
{"command": "layer.openSource", "params": "{layer?}"}
{"command": "layer.revealInFinder", "params": "{layer?}"}
{"command": "layer.revealSource", "params": "{layer?}"}
{"command": "comp.revealInProject", "params": "{comp?}"}
{"command": "layer.revealExpressionErrors", "params": "{comp?}"}
{"command": "layer.sequence", "params": "{layers? (in order), overlap?: bool, duration? (s), transition?: off|dissolveFront|crossDissolve}"}
{"command": "layer.create", "params": "{op: editableText|shapesFromText|masksFromText|shapesFromVector, layers?}"}
{"command": "anim.savePreset", "params": "{path (.ecpreset), name?} — saves the selected properties/effects"}
{"command": "anim.applyPreset", "params": "{path | preset, layers?}"}
{"command": "anim.addKeyframe", "params": "{} — keys the selected properties at the CTI"}
{"command": "keys.exponentialScale", "params": "{} — two selected Scale keys"}
{"command": "text.addSelector", "params": "{layer?, animator?: uid|index, kind: range|wiggly|expression}"}
{"command": "text.removeAllAnimators", "params": "{layers?}"}
{"command": "anim.reveal", "params": "{kind: keyframes|animation|modified}"}
{"command": "view.addGuide", "params": "{orientation?: vertical|horizontal, position? (comp px)}"}
{"command": "view.clearGuides", "params": "{comp?}"}
{"command": "view.importGuides", "params": "{path}"}
{"command": "view.exportGuides", "params": "{path}"}
{"command": "view.layout", "params": "{views: 1|2|4}"}
{"command": "view.shareViewOptions", "params": "{value?}"}
{"command": "view.extendedViewer", "params": "{value?}"}
{"command": "view.setRegionOfInterest", "params": "{rect?: [x, y, w, h] | null}"}
{"command": "view.snapping", "params": "{value?}"}
{"command": "view.displayColorManagement", "params": "{value?}"}
{"command": "view.simulateOutput", "params": "{profile: none|rec709|ntsc|pal|mac18|srgb|rec2020|p3|linear|myCustom|custom, preserveRgb?, space? (custom)}"}
{"command": "view.customRgb", "params": "{name?, red?/green?/blue?/white?: [x, y] (CIE xy), gamma?, srgbCurve?: bool, icc?: path (RGB ICC profile, matrix/TRC or LUT-based A2B0: read when it changes, \"\" clears; a LUT profile simulates through its tables, `lutProfile` in the reply; typed-in numbers replace it), reload?, from?: a Simulate Output profile to start from, reset?, preserveRgb?, apply?: bool (default true: simulate it)} → the definition (kept in Settings)"}
{"command": "view.splitLockedViewer", "params": "{comp?, view?: 3D view id}"}
{"command": "view.closeLockedViewer", "params": "{}"}
{"command": "view.displayColor", "params": "{} → display colour management, output simulation, display profile, locked viewer"}
{"command": "view.channel", "params": "{channel: rgb|red|green|blue|alpha|rgbStraight, colorized?, toggle?}"}
{"command": "view.exposure", "params": "{stops? | delta?}"}
{"command": "view.resetExposure", "params": "{}"}
{"command": "view.takeSnapshot", "params": "{comp?, scale?: 0.05..1}"}
{"command": "view.showSnapshot", "params": "{value?}"}
{"command": "view.fastPreviewMode", "params": "{mode: off|adaptive|draft|fastDraft|wireframe}"}
{"command": "view.moveGuide", "params": "{comp?, index, position (comp px), merge?}"}
{"command": "view.removeGuide", "params": "{comp?, index}"}
{"command": "shape.newPath", "params": "{layer?, vertices: [[x,y]…], inTangents?, outTangents?, closed?, space?: comp|layer, fill?: [r,g,b]|#hex|false, stroke?, strokeWidth?, name?}"}
{"command": "shape.dashes.add", "params": "{layer?, prop?: stroke uid}"}
{"command": "shape.dashes.remove", "params": "{layer?, prop?: stroke uid}"}
{"command": "shape.stroke.taper", "params": "{layer?, prop?: stroke uid, units?: pixels|percent, startLength?, endLength?, startWidth? (%), endWidth? (%), startEase? (%), endEase? (%)}"}
{"command": "shape.stroke.wave", "params": "{layer?, prop?: stroke uid, amount? (%), units?: pixels|cycles, wavelength?, cycles?, phase? (°)}"}
{"command": "camera.linkFocusToPoi", "params": "{comp?, camera?}"}
{"command": "camera.linkFocusToLayer", "params": "{comp?, camera?, layer?}"}
{"command": "camera.setFocusToLayer", "params": "{comp?, camera?, layer?}"}
{"command": "keys.setLabel", "params": "{label: name|none|0–16}"}
{"command": "keys.selectLabelGroup", "params": "{scope: selected|all|visibleSelected|visibleAll, visible?: [prop uid]}"}
{"command": "keys.transform", "params": "{timeScale?, timeAnchor? (comp s), timeOffset? (s), valueScale?, valueAnchor?, valueOffset?, dim? | dims?: [d…], merge?, fromStart?: bool (with merge: values are the whole transform since the drag started)}"}
{"command": "keys.setSpatialTangents", "params": "{layer?, path|prop, time (layer s), in?: [dx,dy,dz?], out?, break?, merge?}"}
{"command": "project.newFolder", "params": "{name?, parent?}"}
{"command": "file.close", "params": "{comp?}"}
{"command": "file.closeProject", "params": "{}"}
{"command": "file.saveCopy", "params": "{path}"}
{"command": "file.importMultiple", "params": "{paths: [string]}"}
{"command": "file.importPlaceholder", "params": "{name?, width?, height?, frameRate?, duration? (s)}"}
{"command": "file.importSolid", "params": "{name?, color?, width?, height?}"}
{"command": "file.newCompFromSelection", "params": "{duration? (s, for stills), single?: bool (one comp for all), dimensionsFrom?: index, sequence?: bool, overlap?: bool, overlapDuration? (s), transition?: off|dissolveFront|crossDissolve, addToRenderQueue?: bool} → {comps}"}
{"command": "file.collectFiles", "params": "{folder}"}
{"command": "file.consolidateFootage", "params": "{}"}
{"command": "file.removeUnusedFootage", "params": "{}"}
{"command": "file.reduceProject", "params": "{} (keeps the selected comps and what they use)"}
{"command": "file.findMissing", "params": "{what: footage|effects|fonts}"}
{"command": "footage.check", "params": "{items?: [id], wait?} — look for every footage file (in the background unless `wait`) and flag missing items"}
{"command": "file.runScript", "params": "{path (.jsx/.js JavaScript, or a .jsonl/.json command script) | name (an installed or sample script, see file.scripts.list) | steps: [{command, params}]}"}
{"command": "script.run", "params": "{code (JavaScript: app, app.project, CompItem, Layer, Property… like After Effects scripting), name?, console? (Script Console context)} → {ok, result, output, error: {message, line, column} | null}"}
{"command": "file.interpretFootage", "params": "{items?, frameRate?: fps|\"file\", alpha?: straight|premultiplied|ignore|guess, guessAlpha?, matteColor?, invertAlpha?, loop?, pixelAspect?, fields?: off|upper|lower, colorProfile?: srgb|rec709|rec2020|p3|auto, linearLight?}"}
{"command": "file.rememberInterpretation", "params": "{item?}"}
{"command": "file.applyInterpretation", "params": "{items?}"}
{"command": "file.replaceFootage", "params": "{path, item?}"}
{"command": "file.replaceWithPlaceholder", "params": "{item?, width?, height?, frameRate?, duration?}"}
{"command": "file.replaceWithSolid", "params": "{item?, color?, width?, height?}"}
{"command": "file.reloadFootage", "params": "{items?}"}
{"command": "file.revealInFinder", "params": "{item?}"}
{"command": "file.exportLottie", "params": "{comp?, path (.json or .lottie), includeExpressions?: bool, textAsShapes?: bool}"}
{"command": "file.importLottie", "params": "{path (.json or .lottie)}"}
{"command": "file.importTimeline", "params": "{path (.xml Final Cut Pro XML from Premiere Pro or .fcpxml .otio .edl .aaf .omf), format?: auto|xml|fcpxml|otio|edl|aaf|omf, edlFrameRate?: number}"}
{"command": "file.exportTimeline", "params": "{comp?, path (Final Cut Pro XML .xml for Premiere Pro or .fcpxml .otio .edl .aaf .omf), format?: xml|fcpxml|otio|edl|aaf|omf, prerender?: none|unsupported|all, precomps?: nest|prerender}"}
{"command": "file.timelineFormats", "params": "{}"}
{"command": "comp.cropToRegionOfInterest", "params": "{comp?}"}
{"command": "comp.cropToLayerBounds", "params": "{layers?}"}
{"command": "comp.saveFrameAs", "params": "{path (.png; with queue: an output path or template), time?, scale?, queue?: bool (add a Render Queue item from the Frame Default templates instead of writing now)}"}
{"command": "comp.responsiveTime", "params": "{op: intro|outro|workArea}"}
{"command": "comp.saveFrameAsPsd", "params": "{path (.psd), comp?, time?, scale?} → a layered PSD: one layer per visible comp layer (blend mode, opacity) + the merged frame"}
{"command": "comp.saveFrameAsExr", "params": "{path (.exr), comp?, time?, scale?} → a multi-layer OpenEXR: composite R,G,B,A + `<layer>.R/G/B/A` per layer (linear, premultiplied)"}
{"command": "file.watchFolder", "params": "{folder, stop?: bool} → watches the folder for .ecproj files with queued renders, renders them and writes `<project>.status.json`"}
{"command": "file.watchFolder.poll", "params": "{folder? (default: the watched one)} → renders new projects now: {watching, rendered: [{project, state: done|failed, items: [{comp, status, output}]}]}"}
{"command": "file.importVanishingPoint", "params": "{} (always disabled: undocumented format)"}
{"command": "paths.pointsFollowNulls", "params": "{layer?, path?|prop?, pins?: [uid | name…]} → a null per vertex (or Position / Advanced puppet pin); the path (pins) follow them (expressions)"}
{"command": "paths.nullsFollowPoints", "params": "{layer?, path?|prop?, pins?: [uid | name…]} → a null per vertex (or puppet pin) following it (Position expressions)"}
{"command": "paths.tracePath", "params": "{layer?, path?|prop?, loop?: bool} → a null moving along the path (Progress slider)"}
{"command": "comp.vr.environments", "params": "{} → [{output, name, cubeMap, faces: [{face, comp, camera}], view: [x, y, z]}]"}
{"command": "comp.vr.setView", "params": "{comp? (an environment's output / cube map / face comp), orientation?: [x, y, z] degrees, pan?, tilt?, roll?} → turns the six face cameras together"}
{"command": "app.about", "params": "{}"}
{"command": "layer.style.options", "params": "{layer?, style?: blendingOptions|dropShadow|…}"}
{"command": "app.settings", "params": "{page?: general|startup|project|composition|previews|appearance|grids|labels|type|import|export|audio|disk|memory|video|3d|scripting}"}
{"command": "app.gpuInfo", "params": "{}"}
{"command": "app.hide", "params": "{}"}
{"command": "app.hideOthers", "params": "{}"}
{"command": "app.showAll", "params": "{}"}
{"command": "app.quit", "params": "{}"}
{"command": "app.commandPalette", "params": "{query?}"}
{"command": "app.keyboardShortcuts", "params": "{}"}
{"command": "app.templates", "params": "{kind: renderSettings|outputModule}"}
{"command": "app.find", "params": "{query?}"}
{"command": "playback.toggle", "params": "{shortcut?: spacebar|shiftSpacebar|numpad0|shiftNumpad0|altNumpad0 (whose Preview panel options to use; default spacebar)}"}
{"command": "playback.cacheWhenIdle", "params": "{value?}"}
{"command": "playback.audio", "params": "{value?: include audio in previews}"}
{"command": "view.zoomIn", "params": "{}"}
{"command": "view.zoomOut", "params": "{}"}
{"command": "view.res.full", "params": "{}"}
{"command": "view.res.half", "params": "{}"}
{"command": "view.res.third", "params": "{}"}
{"command": "view.res.quarter", "params": "{}"}
{"command": "view.res.custom", "params": "{factor?: 1..40 (render every n-th pixel)}"}
{"command": "view.rulers", "params": "{value?}"}
{"command": "view.panelBackground", "params": "{color?: black|darkGray|mediumGray|lightGray|white|custom|#hex, pick?: true}"}
{"command": "view.guides", "params": "{value?}"}
{"command": "view.snapToGuides", "params": "{value?}"}
{"command": "view.lockGuides", "params": "{value?}"}
{"command": "view.grid", "params": "{value?}"}
{"command": "view.snapToGrid", "params": "{value?}"}
{"command": "view.options", "params": "{}"}
{"command": "view.layerControls", "params": "{value?}"}
{"command": "view.fullScreen", "params": "{}"}
{"command": "window.panel", "params": "{panel: project|effectControls|composition|layer|timeline|info|audio|preview|effectsPresets|properties|character|paragraph|align|tracker|wiggler|smoother|motionSketch|paint|brushes|renderQueue|flowchart|history|markers|tools|lumetriScopes|footage|mediaBrowser|metadata|progress|contentAwareFill|createNullsFromPaths|vrCompEditor}"}
{"command": "window.workspace", "params": "{name: Default|Standard|Small Screen|Animation|Effects|Motion Tracking|Paint|Text|Minimal|All Panels}"}
{"command": "window.saveWorkspace", "params": "{}"}
{"command": "window.saveWorkspaceAs", "params": "{name}"}
{"command": "window.editWorkspaces", "params": "{name, rename?: new name, delete?: bool}"}
{"command": "window.resetWorkspace", "params": "{}"}
{"command": "comp.flowchart", "params": "{}"}
{"command": "comp.miniFlowchart", "params": "{}"}
{"command": "layer.openLayer", "params": "{layer?}"}
{"command": "effect.manage", "params": "{}"}
{"command": "anim.browsePresets", "params": "{}"}
{"command": "track.motion", "params": "{layer?}"}
{"command": "track.stabilize", "params": "{layer?}"}
{"command": "track.new", "params": "{layer?, kind?: transform|stabilize|affine|perspective|raw, position?, rotation?, scale?, target?: layer}"}
{"command": "track.property", "params": "{layer?, source?: layer}"}
{"command": "track.select", "params": "{layer?, tracker?: uid|name|#n}"}
{"command": "track.setType", "params": "{layer?, tracker?, kind?: transform|stabilize|affine|perspective|raw, position?, rotation?, scale?}"}
{"command": "track.setTarget", "params": "{layer?, tracker?, target: layer|null}"}
{"command": "track.options", "params": "{layer?, tracker?, name?, channel?: rgb|luminance|saturation, blur? (px, 0 = off), enhance?, subpixel?, adaptEveryFrame?, threshold? (%), action?: continue|stop|extrapolate|adapt, trackShape?}"}
{"command": "track.setPoint", "params": "{layer?, tracker?, point: n (1-based), center?: [x,y], featureSize?: [w,h], searchOffset?: [x,y], searchSize?: [w,h], attachOffset?: [x,y], move?: [dx,dy], time? (s)}"}
{"command": "track.analyze", "params": "{layer?, tracker?, direction?: forward|backward|frameForward|frameBackward, start? (s), end? (s), wait?: block until done}"}
{"command": "track.stop", "params": "{}"}
{"command": "track.apply", "params": "{layer?, tracker?, dimensions?: xy|x|y}"}
{"command": "track.reset", "params": "{layer?, tracker?}"}
{"command": "track.delete", "params": "{layer?, tracker?}"}
{"command": "track.editTargetDialog", "params": "{}"}
{"command": "track.optionsDialog", "params": "{}"}
{"command": "track.status", "params": "{layer?, tracker?}"}
{"command": "track.mask", "params": "{layer?, mask?: uid|index|name, method?: position|positionScale|positionScaleRotation|positionScaleRotationSkew|perspective|faceOutline|faceDetailed, direction?: forward|backward|frameForward|frameBackward, start? (s), end? (s), wait?: block until done}"}
{"command": "track.maskMethod", "params": "{method: position|positionScale|positionScaleRotation|positionScaleRotationSkew|perspective|faceOutline|faceDetailed}"}
{"command": "track.extractFaceMeasurements", "params": "{layer?} → keys a Face Measurements effect from the layer's Face Track Points (one key per tracked frame) and copies those keys"}
{"command": "mask.interpolate", "params": "{layer?, mask?, times?: [from, to] (s; default the selected Mask Path keys), keyframeRate?: n|auto, keyframeFields?, linearVertexPaths?, bendingResistance? (0-100), quality? (0-100), addVertices?: n|false, addVerticesUnit?: pixels|total|percent, matchingMethod?: auto|curve|polyline, oneToOne?, firstVerticesMatch?}"}
{"command": "mask.interpolationOptions", "params": "{keyframeRate?: n|auto, keyframeFields?, linearVertexPaths?, bendingResistance?, quality?, addVertices?: n|false, addVerticesUnit?: pixels|total|percent, matchingMethod?: auto|curve|polyline, oneToOne?, firstVerticesMatch?}"}
{"command": "track.warpStabilizer", "params": "{layer?, wait?}"}
{"command": "warp.analyze", "params": "{layer?, effect?: uid|name|index, wait?: block until done}"}
{"command": "warp.cancel", "params": "{}"}
{"command": "warp.status", "params": "{layer?, effect?}"}
{"command": "track.camera", "params": "{layer?, shotType?: fixed|variable|specify, aov?: degrees, solveMethod?: auto|typical|flat|tripod, detailed?, lensDistortion?: solve k1/k2, undistort?: render undistorted, wait?}"}
{"command": "camera.analyze", "params": "{layer?, effect?: uid|name|index, wait?: block until done}"}
{"command": "camera.cancel", "params": "{}"}
{"command": "camera.solveStatus", "params": "{layer?, effect?}"}
{"command": "camera.points", "params": "{layer?, effect?, time?: comp seconds} → visible solved points"}
{"command": "camera.selectPoints", "params": "{points: [id], add?, toggle?}"}
{"command": "camera.createFromSolve", "params": "{kind: text|solid|null|shadowCatcher|camera, points?: [id] (default: selected), target?: {center, normal, size?} (comp world), multiple?, layer?, effect?}"}
{"command": "camera.create", "params": "{layer?, effect?}"}
{"command": "camera.setGroundPlane", "params": "{points?: [id] (default: selected), layer?, effect?}"}
{"command": "camera.deletePoints", "params": "{points?: [id] (default: selected), layer?, effect?, wait?}"}
{"command": "roto.stroke", "params": "{layer?, kind?: fg|bg|refine|refineErase, points: [[x, y], …] (layer pixels), frame? (layer frame; default current), radius? (layer px; default the tool's diameter / 2), effect?}"}
{"command": "roto.propagate", "params": "{layer?, effect?, direction?: forward|backward|both, to? (layer frame: extend the span), wait?: block until done}"}
{"command": "roto.span", "params": "{layer?, effect?, start?, end? (layer frames)}"}
{"command": "roto.freeze", "params": "{layer?, effect?, wait?}"}
{"command": "roto.unfreeze", "params": "{layer?, effect?}"}
{"command": "roto.clearStrokes", "params": "{layer?, effect?, frame? (only this layer frame), kind?}"}
{"command": "roto.cancel", "params": "{}"}
{"command": "roto.options", "params": "{diameter?, refineDiameter?, view?: alphaBoundary|alpha|alphaOverlay|none, overlayColor?: [r,g,b], overlayOpacity?, boundaryColor?: [r,g,b], autoPropagate?}"}
{"command": "roto.status", "params": "{layer?, effect?, frame? (layer frame: also report its matte), matte?: include the matte (RLE, base64), compute?: compute the frame if needed, compareTo?: RLE matte to report the IoU against}"}
{"command": "paint.stroke", "params": "{layer?, kind?: brush|clone|eraser, points: [[x,y,pressure?],…] (layer space), time? (s) | frame?, duration? (s, drawing time for Write On), color?: [r,g,b,a], diameter?, angle?, hardness?, roundness?, spacing?, opacity?, flow?, mode?, channels?: RGBA|RGB|Alpha, durationMode?: constant|writeOn|singleFrame|custom, customFrames?, eraseMode?: layerSourceAndPaint|paintOnly|lastStrokeOnly, cloneSource?: layer id, clonePosition?: [x,y], cloneTimeShift? (s), lockSourceTime?, cloneTime? (s), sizePressure?, minSize?, opacityPressure?, flowPressure?}"}
{"command": "paint.options", "params": "{color?, background?, opacity?, flow?, mode?, channels?, durationMode?, customFrames?, eraseMode?, diameter?, angle?, roundness?, hardness?, spacing?, preset?, sizePressure?, minSize?, opacityPressure?, flowPressure?, clonePreset?, cloneSource?, clonePoint?, cloneOffset?, aligned?, lockSourceTime?, cloneTimeShift?, cloneTime?, showOverlay?, overlayOpacity?, overlayDifference?, reset?}"}
{"command": "paint.brushPreset", "params": "{preset?: index | name}"}
{"command": "paint.setCloneSource", "params": "{layer?, point: [x,y]}"}
{"command": "paint.removeStroke", "params": "{layer?, stroke: uid | name}"}
{"command": "paint.presets", "params": "{}"}
{"command": "puppet.addPin", "params": "{layer?, kind?: position|advanced|bend|starch|overlap, position: [x,y] (layer space), time? (s) | frame?, mesh?: uid, newMesh?, density?, expansion?, triangles?}"}
{"command": "puppet.movePin", "params": "{layer?, pin: uid | name, position: [x,y], time? | frame?, merge?}"}
{"command": "puppet.setPin", "params": "{layer?, pin: uid | name, position?, scale? (%), rotation? (°), amount? (%), extent? (px), inFront?, time? | frame?, merge?}"}
{"command": "puppet.removePin", "params": "{layer?, pin?: uid | name, pins?: [uid | name…]} (default: the selected pins)"}
{"command": "puppet.selectPins", "params": "{layer?, pins: [uid | name…] ([] deselects), add?, toggle?}"}
{"command": "puppet.mesh", "params": "{layer?, mesh?: uid, density?, expansion?, triangles?, showMesh?, time?, merge?}"}
{"command": "puppet.info", "params": "{layer?, time? | frame?}"}
{"command": "puppet.recordPin", "params": "{layer?, pin: uid | name, samples: [[t, x, y]…] (t = seconds since the drag began, layer space), pins?: [uid | name…] (more pins that move by the same displacement), start? (s, default current time), speed? (%, Record Options), smoothing? (Record Options)}"}
{"command": "puppet.follow", "params": "{layer?, leader?: uid | name (default: the first selected pin), pins?: [uid | name…] (default: the other selected pins), delay? (s, 0.1), amount? (%, 100), cascade? (true: the k-th nearest pin trails k × delay)}"}
{"command": "puppet.recordOptions", "params": "{speed? (%, 100), smoothing? (0-100), useDraftDeformation?, showMesh?}"}
{"command": "liquify.stroke", "params": "{layer?, effect?: uid, tool?: warp|turbulence|twirlClockwise|twirlCounterclockwise|pucker|bloat|shiftPixels|reflection|clone|reconstruction|freeze|thaw, points: [[x,y],…] (layer space), size?, pressure? (1-100), jitter? (1-100), cloneOffset?: [dx,dy], time? (s) | frame?}"}
{"command": "liquify.clear", "params": "{layer?, effect?: uid}"}
{"command": "prefs.get", "params": "{key?: e.g. general.undoLevels (omit for all settings)}"}
{"command": "prefs.set", "params": "{key, value, values?: {key: value}}"}
{"command": "prefs.reset", "params": "{page?: general|labels|project|…}"}
{"command": "prefs.open", "params": "{page?: general|startup|project|composition|previews|appearance|grids|labels|type|import|export|audio|disk|memory|video|3d|scripting}"}
{"command": "prefs.pages", "params": "{}"}
{"command": "shortcuts.list", "params": "{query?, keys?, assigned?: bool}"}
{"command": "shortcuts.set", "params": "{command, params?, keys: \"Cmd+Shift+K\" | [keys] | null}"}
{"command": "shortcuts.reset", "params": "{command?, params?}"}
{"command": "shortcuts.preset", "params": "{op: select|new|duplicate|delete|rename, name?, from?, newName?}"}
{"command": "shortcuts.export", "params": "{preset?, path?}"}
{"command": "shortcuts.import", "params": "{path? | preset?: exported document, name?}"}
{"command": "shortcuts.conflicts", "params": "{}"}
{"command": "file.openRecent", "params": "{index? | path?}"}
{"command": "file.clearRecent", "params": "{}"}
{"command": "file.autoSave", "params": "{}"}
{"command": "file.recoveryInfo", "params": "{}"}
{"command": "edit.history", "params": "{steps?: n (undo n steps), redo?: n}"}
{"command": "file.importRecent", "params": "{index? | path?}"}
{"command": "file.clearRecentFootage", "params": "{}"}
{"command": "anim.applyRecentPreset", "params": "{index? | path?, layers?}"}
{"command": "anim.clearRecentPresets", "params": "{}"}
{"command": "file.saveCopyAsXml", "params": "{path: .ecprojx}"}
{"command": "file.replaceWithLayeredComp", "params": "{item?}"}
{"command": "file.executeFile", "params": "{path, confirmed?}"}
{"command": "view.assign3dShortcut", "params": "{slot: F10|F11|F12, comp?}"}
{"command": "window.assignWorkspaceShortcut", "params": "{slot: Shift+F10|Shift+F11|Shift+F12, workspace?}"}
{"command": "help.enableLogging", "params": "{on?}"}
{"command": "help.revealLogFile", "params": "{}"}
{"command": "help.systemReport", "params": "{quiet?}"}
{"command": "comp.vr.createEnvironment", "params": "{comp?, size?: face pixels (1024), position?: [x,y,z]}"}
{"command": "comp.vr.extractCubemap", "params": "{comp?, faceSize?}"}
{"command": "help.systemInfo", "params": "{}"}
{"command": "keys.audioToKeyframes", "params": "{comp?}"}
{"command": "keys.rpfCameraImport", "params": "{path: .json|.csv camera data, comp?}"}
{"command": "essential.setPrimary", "params": "{comp}"}
{"command": "essential.setName", "params": "{comp?, name}"}
{"command": "essential.addProperty", "params": "{comp?, layer?, path?|prop?: uid (default: the selected properties), name?, group?: control id, index?, as?: font (Source Text font family/style/size) | scale (uniform Scale), mirror?: bool (a property already present is added as a mirror; default true)}"}
{"command": "essential.addMirror", "params": "{comp?, control, name?, group?, index?}"}
{"command": "essential.linkProperty", "params": "{comp?, control, layer?, path?|prop? (default: the selected property)}"}
{"command": "essential.unlinkProperty", "params": "{comp?, control, layer?, path?|prop? (default: the selected property)}"}
{"command": "essential.addMedia", "params": "{layer, name?, group?}"}
{"command": "essential.addGroup", "params": "{comp?, name?, index?}"}
{"command": "essential.addComment", "params": "{comp?, text?, group?}"}
{"command": "essential.rename", "params": "{comp?, control, name}"}
{"command": "essential.remove", "params": "{comp?, control}"}
{"command": "essential.move", "params": "{comp?, control, group?: id (null = top level), index?}"}
{"command": "essential.soloSupported", "params": "{on?}"}
{"command": "essential.exportTemplate", "params": "{comp?, path (.ectemplate), name?}"}
{"command": "essential.importTemplate", "params": "{path (.ectemplate), comp?, addToComp?: bool}"}
{"command": "essential.set", "params": "{layer, control: id|name, value | item (media)}"}
{"command": "essential.pushToComp", "params": "{layer, control? (default: all overridden)}"}
{"command": "essential.revert", "params": "{layer, control? (default: all overridden)}"}
{"command": "effect.editDropdown", "params": "{layer, path?|prop?, items: [string]}"}
{"command": "essential.list", "params": "{comp?, supported?: bool}"}
{"command": "essential.canAdd", "params": "{layer, path|prop, as?} → {ok, type?, reason?}"}
{"command": "comp.openInEssentialGraphics", "params": "{comp?} → makes it the Essential Graphics panel's Primary composition and shows the panel"}
{"command": "essential.instance", "params": "{layer}"}
{"command": "essential.templateInfo", "params": "{path}"}
{"command": "expr.errors", "params": "{comp?, time? (s)}"}
{"command": "expr.languageMenu", "params": "{}"}
{"command": "file.createProxy", "params": "{kind: still|movie, comp?|item?, path?|output? (template), resolution? (default 0.5)}"}
{"command": "file.setProxy", "params": "{path, items?|item?}"}
{"command": "file.setProxyNone", "params": "{items?|item?}"}
{"command": "file.useProxy", "params": "{items?|item?, on?}"}
{"command": "file.interpretProxy", "params": "{items?|item?, alpha?, matteColor?, invertAlpha?, frameRate?, loop?, pixelAspect?, fields?, colorProfile?, linearLight?}"}
{"command": "file.installScript", "params": "{path (.jsx / .js)} → copies it to the Scripts folder; it appears in File ▸ Scripts"}
{"command": "file.installScriptUIPanel", "params": "{path (.jsx / .js)} → copies it to the ScriptUI Panels folder; it appears in the Window menu"}
{"command": "file.uninstallScript", "params": "{name}"}
{"command": "file.scripts.list", "params": "{} → [{name, panel, source: installed|sample}]"}
{"command": "window.scriptPanel", "params": "{name (a script in the ScriptUI Panels folder, e.g. `Layer Tools.jsx`)} → opens it as a dockable panel"}
{"command": "scriptui.list", "params": "{} → [{window, title, kind: dialog|palette|window|panel, script, modal, size}]"}
{"command": "scriptui.get", "params": "{window?: id | title} → {id, title, kind, root: {id, type, name, text, value, checked, items, selection, bounds, enabled, draw (onDraw paint list), children…}}"}
{"command": "scriptui.click", "params": "{window?: id | title, widget: id | \"#id\" | properties.name | text} (buttons, checkboxes, radio buttons, tabs)"}
{"command": "scriptui.set", "params": "{window?, widget, value: text | number | bool | item index | item text, changing?: bool (a live update: each keystroke / slider step; fires onChanging only)} (edit text, sliders, checkboxes, lists) → fires onChanging / onChange"}
{"command": "scriptui.close", "params": "{window?, result? (a dialog's show() returns it; default 2 = Cancel)}"}
{"command": "jobs.list", "params": "{}"}
{"command": "jobs.cancel", "params": "{job?: render|track|maskTrack|warp|camera|roto|task:<n>|all}"}
{"command": "jobs.wait", "params": "{}"}
{"command": "mediaBrowser.list", "params": "{path?, importableOnly?}"}
{"command": "mediaBrowser.go", "params": "{path?: folder | \"..\", importableOnly?}"}
{"command": "mediaBrowser.addFavorite", "params": "{path?}"}
{"command": "mediaBrowser.removeFavorite", "params": "{path?}"}
{"command": "mediaBrowser.import", "params": "{paths, addToComp?}"}
{"command": "mediaBrowser.action", "params": "{action}: an action from mediaBrowser.list's `actions` (web: openFolder, addFiles, uploadFolder)"}
{"command": "mediaBrowser.fileInfo", "params": "{path}"}
{"command": "item.metadata", "params": "{item?: id|name}"}
{"command": "project.setProjectComment", "params": "{comment}"}
{"command": "scopes.analyze", "params": "{comp?, time?|frame?, scope?: waveformRgb|waveformLuma|waveformYc|vectorscopeYuv|vectorscopeHls|histogram|paradeRgb|paradeYuv, standard?: rec601|rec709|rec2020, float?, clamp?, size?}"}
{"command": "footage.open", "params": "{item: id|name}"}
{"command": "footage.info", "params": "{}"}
{"command": "footage.setTime", "params": "{time? (s, source) | frame?}"}
{"command": "footage.setIn", "params": "{time? | frame? (default: the panel's time)}"}
{"command": "footage.setOut", "params": "{time? | frame? (default: the panel's time)}"}
{"command": "footage.clearInOut", "params": "{}"}
{"command": "footage.overlayEdit", "params": "{item?, comp?, in? (s), out? (s), at? (comp s; default the current time)}"}
{"command": "footage.rippleInsertEdit", "params": "{item?, comp?, in? (s), out? (s), at? (comp s; default the current time)}"}
{"command": "layer.autoTrace", "params": "{layer?, timeSpan?: currentFrame|workArea, channel?: alpha|red|green|blue|luminance, invert?, blur? (px, 1), tolerance? (px, 1), threshold? (%, 50), minimumArea? (px, 10), cornerRoundness? (%, 50), applyToNewLayer?}"}
{"command": "layer.sceneEditDetection", "params": "{layer?, mode?: markers|split|splitPrecompose, threshold? (0…1, 0.25), wait?: bool}"}
{"command": "layer.alignVideoToData", "params": "{layer?, data?: data footage id|name, key?: time field, videoStart?: ISO date-time | hh:mm:ss | timecode | seconds (default: file creation time), dataStart? (comp s of the first sample, 0)}"}
{"command": "layer.align", "params": "{edge: left|hcenter|right|top|vcenter|bottom, to?: composition|selection (default composition), layers?}"}
{"command": "layer.distribute", "params": "{mode: left|hcenter|right|top|vcenter|bottom (edges or centres), layers?}"}
{"command": "contentFill.set", "params": "{method?: object|surface|edgeBlend, range?: workArea|entire, alphaExpansion? (px), lightingCorrection?: none|subtle|moderate|strong, referenceLayer?: layer|null, referenceTime? (s)}"}
{"command": "contentFill.generate", "params": "{layer?, method?: object|surface|edgeBlend, range?: workArea|entire, alphaExpansion? (px), lightingCorrection?: none|subtle|moderate|strong, referenceLayer?, referenceTime? (s), outputDir?, wait?: bool}"}
{"command": "layer.newContentAwareFill", "params": "{layer?, method?: object|surface|edgeBlend, range?: workArea|entire, alphaExpansion? (px), lightingCorrection?: none|subtle|moderate|strong, referenceLayer?, referenceTime? (s), outputDir?, wait?: bool}"}
{"command": "storage.info", "params": "{} → {available, backend, usage, quota, persisted, files: {count, bytes, media, projects, autoSaves}, diskCache: {enabled, entries, bytes, maxBytes, hits, misses, writes, evictions}}"}
{"command": "storage.persist", "params": "{} → {requested, persisted}"}
{"command": "storage.clear", "params": "{what: diskCache|media|projects|autoSaves|all} → {cleared, entries, bytes}"}
{"command": "learn.list", "params": "{} → [{id, title, summary, minutes, steps}]"}
{"command": "learn.state", "params": "{} → {tutorial, step, steps, done, current: {title, text, target, accepts}} | null"}
{"command": "learn.start", "params": "{id}"}
{"command": "learn.step", "params": "{action?: next|back|showMe|goto, index?}"}
{"command": "learn.stop", "params": "{}"}
{"command": "templates.list", "params": "{thumbnails?: bool} → [{id, name, description, category, builtin, width, height, frameRate, duration, controls, thumbnail? (hex RGB 256×144)}]"}
{"command": "templates.thumbnail", "params": "{id} → {id, width, height, rgb (hex)}"}
{"command": "templates.create", "params": "{id (templates.list) | path (.ectemplate), projectPath? (save the new project there; embedded footage goes to `<stem> Footage/` next to it), footageDir?} → an untitled copy (embedded footage extracted: `footage` lists the files)"}
{"command": "templates.saveAs", "params": "{name, description?, category?, overwrite?: bool (default true), embedFootage?: bool (default true: the footage files go into the template), embedLimitMB? (default 256: footage beyond it stays linked, with a warning)} → {id, path, embedded, embeddedBytes, linked: [{item, name, reason}], warning?}"}
{"command": "templates.delete", "params": "{id: user/<file>}"}
{"command": "file.newFromTemplate", "params": "{} → the Home screen's Templates tab"}
{"command": "playback.settings.get", "params": "{shortcut?: spacebar|shiftSpacebar|numpad0|shiftNumpad0|altNumpad0 (default: the one shown in the Preview panel)} → options + plan {start, end, first, step, fps}"}
{"command": "playback.settings.set", "params": "{shortcut?, current?: shortcut shown in the panel, reset?: bool, values?: {…}, includeVideo?, includeAudio?, includeOverlays?, includeLayerControls?, loop?, cacheBeforePlayback?, range?: workArea|workAreaExtended|entireDuration|aroundCurrentTime, preRoll?, postRoll?: seconds, playFrom?: rangeStart|currentTime, frameRate?: fps|\"auto\", skip?, resolution?: auto|full|half|third|quarter|custom, customResolution?, fullScreen?, playCachedFrames?, moveTimeToPreviewTime?}"}
```
