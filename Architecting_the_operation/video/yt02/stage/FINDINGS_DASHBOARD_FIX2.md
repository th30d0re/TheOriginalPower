# Findings: Dashboard Fix Pass 2 (`yt02/stage`)

## Summary of Changes per Brief Item

### 1. Panel Legibility Without Blur (`tools/gen_tokens.mjs`, `tokens.ts`, `dashboard/PanelContent.tsx`)

- **Semantic Token Addition**: Added the override `'color/fill/panel-render': 'rgba(13,27,42,0.88)'` (`color/bg/field` `#0d1b2a` at `0.88` alpha) in `tools/gen_tokens.mjs` and regenerated `tokens.ts` without modifying `handoff/`.
- **Rendered (Non-Interactive) Fill Recipe**: Updated `PanelContent` (`dashboard/PanelContent.tsx`) so that when `interactive` is `false`, every compact, expanded, and settings panel receives:
  ```css
  background: linear-gradient(rgba(91,107,125,0.14), rgba(91,107,125,0.14)), rgba(13,27,42,0.88);
  ```
  This layers the `color/fill/panel-wash` tint (`rgba(91,107,125,0.14)`) directly over `color/fill/panel-render` (`rgba(13,27,42,0.88)`), keeping the inset `color/line/hairline` (`rgba(91,107,125,0.45)`) border while ensuring map coastlines and graticules behind panels remain faint and never cross panel text visibly.
- **Interactive Site Path**: Preserved `fill={color(compact ? 'color/fill/panel-wash' : 'color/fill/glass')}` and `backdropFilter: 'blur(6px)'` when `interactive` is `true`.

### 2. Iberia Framing Under Equal Earth (`dashboard/mapGeometry.ts`, `review/map-geometry-fix1.json`, `review/map-geometry-fix2.json`)

- **Measured Reference Height in `handoff/png/dash_1486_compact.png` and `handoff/svg/map.iberia.svg`**:
  - In `handoff/svg/map.iberia.svg` (1856×968 map clip), mainland Portugal (`37.01°N..42.14°N`) spans `y = 134.23..234.30` (**100.07 px** height; **99 px** of gold-filled land pixels `y = 219..317` in the 1920×1080 raster `handoff/png/dash_1486_compact.png`, or **130 px** `y = 219..349` when measured together with the contiguous northern gold route segment, and **~140 px** when measured through the Strait of Gibraltar / Moroccan enclave).
- **Updated Equal Earth Fit (`dashboard/mapGeometry.ts`)**:
  - Set `iberiaFit = {center: [5, 22.2], pxPerDeg: 19.5, extent: [[-30, 2.0], [40, 42.4]]}`, producing Equal Earth `scale = 1247.91` (`iberiaCamera = {center: [5, 22.2], zoom: 3.639685}`).
  - **Measured Portugal Height in Settled 1486 State**:
    - Mainland Portugal (`37.00°N..42.11°N` in Cliopatria): **107.77 px** (`y = 42.99..150.76` in map-local coordinates), which is **+7.7%** vs the 100.07 px SVG height (**+8.9%** vs the 99 px PNG land height) — within the required ±10% band (`[90.0, 110.0] px`).
    - Cliopatria 1486 `Kingdom of Portugal` mainland + Moroccan enclave (`35.32°N..42.11°N`): **144.18 px** (`y = 42.99..187.17`), which is **+3.0%** vs 140 px — also within the ±10% band (`[126.0, 154.0] px`).
  - **Waypoint & Label Clearance (Map-Local Coordinates in 1856×968 Clip)**:
    - `Lisbon` (`[-9.14, 38.72]`): point `[693.64, 114.01]`, `LISBON` label box `[630.64, 107.01, 59, 16]` — clear of the era strip (`y > 12`) and left stack (`x > 317`).
    - `Madeira` (`[-16.9, 32.65]`): point `[546.84, 246.30]`, `MADEIRA` label box `[436.34, 239.30, 68, 16]` — clear of left stack (`x > 317`).
    - `Cape Verde` (`[-23.6, 15.1]`): point `[385.17, 653.40]`, `CAPE VERDE` label box `[291.67, 646.40, 91, 16]` — clear of left stack (`Compass` bottom is at map-local `y = 495.8` in compact mode, above `y = 646.4`).
    - `Elmina` (`[-1.35, 5.08]`): point `[817.99, 893.20]`, `ELMINA` label box `[831.99, 886.20, 59, 16]` — above the bottom strips (`y + h = 902.20 < 921`).
    - Route vertical span across all 1,296 cubic Bezier samples: `y = 114.01..914.62` (all samples inside `12 < y < 921`).
    - **Route Land Hits**: **0 hits** across all 1,296 samples on Natural Earth 50m land geometry.
    - **Monotonic `flyTo`**: Scale increases monotonically from `342.86` (`worldCamera`, `6200 ms`) to `1247.91` (`iberiaCamera`, `8400 ms`) across every 10 ms step without zooming out.

### 3. Compass Widget (`dashboard/instruments/compass.tsx`, `dashboard/PanelContent.tsx`, `dashboard/Dashboard.tsx`, `dashboard/DashboardMap.tsx`, `stage.yaml`)

- **Removed Map Rose**: Removed `<CompassRose ... />` from `DashboardMap.tsx`.
- **Added 11th Instrument (`Compass`, slug `compass`)**:
  - Created `dashboard/instruments/compass.tsx` and registered `Compass` in `PanelContent.tsx` and `Dashboard.tsx` at the bottom of the left stack (`index 4`, `x: 36, y: 483.8, w: 196, h: 96`).
  - Restacked both the left stack (`indices 0..4`, `start = 0`) and right stack (`indices 5..8`, `start = 5`) directly from `spec.json` heights (`y = 96 + heights.slice(start, i).reduce((sum, h) => sum + h + 8, 0)`). In compact mode, `Compass` sits at `y = 483.8..579.8` (8 px below `Interference`'s 142.8 px spec height); when `Interference` expands to `475.2 px` (`R-03`), `Compass` shifts to `y = 816.2..912.2`, staying clear above `Executing Function` (`y = 921`).
  - Added boot cue `i11: {ms: 5300}` in `stage.yaml` and recompiled `review/stage_plan.json`.
  - **Three Modes (Derived Every Frame from `CameraContext`)**:
    - **compact** (`196 × 96`): 56 px engraved compass rose (`data-compass-rose="56"`) with `N`, mono camera centre coordinates (`22.2°N 5.0°E` in settled 1486; `0.0°N 0.0°E` at boot; live great-circle coordinates during `flyTo`), parallel/zoom line (`φ₀ 22.2°N · 3.64×`), and an Equal Earth horizontal scale bar in km (`500 km` at `87.89 px` in settled 1486; `2000 km` at `92.73 px` in world view).
    - **expanded** (`640 × 312`): 148 px compass rose (`data-compass-rose="148"`) with `N/E/S/W`, camera centre (`22.2°N 5.0°E`) and zoom (`3.64×`), projection name (`Equal Earth`), graphic scale bar (`1000 km` at `175.78 px` with `0 / 500 / 1000 km` ticks), and viewport extent in degrees (`2.8°N–43.3°N · 46.3°W–56.3°E`, `Δφ 40.5° × Δλ 102.6°`).
    - **settings** (`560 × 345.2`): `settingsTemplate` layout with projection note (`Equal Earth projection (equal-area; Šavrič, Patterson and Jenny, 2018)`), data credit line (`Natural Earth, public domain; Cliopatria, CC BY 4.0, Bennett et al. 2025`), units, and live camera centre/zoom readout.

### 4. Period Polities for 1486 — Cliopatria (`tools/extract_polities.py`, `data/polities_1486.geojson`, `data/POLITIES_SOURCES.md`, `dashboard/DashboardMap.tsx`)

- **Archive & Extraction**:
  - Downloaded Cliopatria `v0.0.1` (Zenodo record `13363121`, DOI `10.5281/zenodo.13363121`) and GitHub `README.md` to `/private/tmp/claude-501/-Users-emmanuel-Documents-Theory-TheOriginalPower/fea37034-751e-40d2-a512-11766f9ff3a6/scratchpad/cliopatria/`.
  - Verified property schema against Cliopatria's `README.md`: `Name`, `FromYear`, `ToYear`, `Area`, `Type`, `Wikipedia`, `Wikidata`, `SeshatID`, `MemberOf`, `Components`, `geometry`.
  - Wrote `tools/extract_polities.py` selecting `Type == 'POLITY'`, `FromYear <= 1486 <= ToYear`, and bounding box intersecting `lon -40..40, lat -5..55`, simplifying geometry with planar Douglas-Peucker at `0.05°` tolerance and rounding coordinates to 3 decimal places.
  - Generated `stage/data/polities_1486.geojson` (**75 features, 185,076 bytes / 180.7 KB**, well under the 1 MB ceiling) and `stage/data/POLITIES_SOURCES.md`.
- **Rendering & Styling**:
  - World boot view (`world = true`) remains coastlines only (`<g data-layer="polities"></g>`).
  - Settled 1486 view renders all 75 Cliopatria polities with thin dashed cream boundaries (`stroke: rgba(232,201,155,1)`, `strokeWidth: 0.9`, `strokeDasharray: "4 3"`, `fill: "none"`, `opacity: 0.38` for standalone polities and `0.22` for composite umbrella polities).
  - `Kingdom of Portugal` (`1482..1486`, `SeshatID: pt_portugal_k`) uses Cliopatria's 1486 period polygon for Portugal's gold fill (`rgba(214,154,42,0.55)`) and solid gold stroke (`rgba(214,154,42,0.95)`), replacing the modern Natural Earth `620` highlight when period polities are active.
  - 16 major polities in view carry 10 px mono labels (`PORTUGAL`, `CASTILE`, `ARAGON`, `GRANADA`, `WATTASID MOROCCO`, `ZAYYANIDS`, `HAFSIDS`, `MALI`, `SONGHAI`, `BORNU`, `MAMLUK SULTANATE`, `MAKURIA`, `ALODIA`, `ETHIOPIA`, `OTTOMAN EMPIRE`, `NAPLES`), verified to have 0 collisions with each other, 0 collisions with the 4 route waypoint labels, and 0 collisions with any compact panel.
- **Data Credit Line**:
  - `Natural Earth, public domain; Cliopatria, CC BY 4.0, Bennett et al. 2025`
- **Polities Named in Brief That Cliopatria Lacks for 1486**:
  - **Jolof** (Jolof Empire) and **Benin** (Kingdom of Benin / Edo) are absent from Cliopatria `v0.0.1` for 1486 (`Republic of Benin` appears only for `1961–2024`). Per instructions, no boundaries were invented for them.
  - Morocco in 1486 is represented by the **Wattasid dynasty** (`1472–1554`), which succeeded the Marinid dynasty (`1195–1465`).

###Complete 75-Polity List (`polities_1486.geojson`)

| # | Name | FromYear | ToYear | SeshatID | Label |
|---:|---|---:|---:|---|---|
| 1 | Adal Sultanate | 1415 | 1559 | `et_adal_sult` | — |
| 2 | Ajuuraan Sultanate | 1350 | 1500 | `so_ajuuraan` | — |
| 3 | Alodia | 1200 | 1504 | `sd_alodia` | `ALODIA` |
| 4 | Aq Qoyunlu | 1472 | 1489 | `ir_aq_qoyunlu` | — |
| 5 | Archbisphoric of Salzburg | 1328 | 1803 | `at_salzburg_abp` | — |
| 6 | Archduchy of Austria | 1477 | 1495 | `at_austria_archd` | — |
| 7 |Bornu Empire | 1472 | 1503 | `td_kanem-bornu` | `BORNU` |
| 8 | Burgundian State | 1482 | 1492 | `fr_burgundy_st` | — |
| 9 |Burji Mamluk | 1382 | 1517 | `eg_mamluk_burji` | — |
| 10 |confoederatio helvetica | 1481 | 1500 | `ch_swiss_old` | — |
| 11 | County of Oldenburg | 1389 | 1667 | `de_oldenburg_c` | — |
| 12 |County of Salm | 1165 | 1789 | `de_salm_c` | — |
| 13 | County of Schaumburg | 1295 | 1640 | `de_schaumburg_c` | — |
| 14 | County of Württemberg | 1444 | 1534 | `de_wurttemberg_c` | — |
| 15 | Crown of Aragon | 1479 | 1512 | `es_aragon_cr` | `ARAGON` |
| 16 | Crown of Castile | 1462 | 1492 | `es_castile_cr` | `CASTILE` |
| 17 | Despotate of Dobruja | 1357 | 1599 | `bg_dobruja_desp` | — |
| 18 | Duchy of Bavaria-Landshut | 1450 | 1503 | `de_bavaria-landshut_d` | — |
| 19 | Duchy of Bavaria-Munich | 1450 | 1503 | `de_bavaria-munich_d` | — |
| 20 | Duchy of Brunswick-Lüneburg | 1269 | 1692 | `de_brunswick-luneburg_d` | — |
| 21 | Duchy ofEstonia | 1347 | 1560 | `ee_estonia_d` | — |
| 22 | Duchy of Ferrara | 1264 | 1597 | `it_ferrara_d` | — |
| 23 | Duchy of Lorraine | 1473 | 1551 | `fr_lorraine_d` | — |
| 24 | Duchy of Masovia | 1462 | 1495 | `pl_masovia_d` | — |
| 25 | Duchy of Mecklenburg | 1471 | 1520 | `de_mecklenburg_d` | — |
| 26 | Duchy of Milan | 1454 | 1499 | `it_milan_d` | — |
| 27 | Duchy of Pomerania | 1466 | 1637 | `de_pomerania_d` | — |
| 28 | Duchy of Savoy | 1434 | 1535 | `it_savoy_d` | — |
| 29 | Duchy of Schleswig | 1058 | 1866 | `dk_schleswig_d` | — |
| 30 |Electoral Palatinate | 1329 | 1623 | `de_palatinate_el` | — |
| 31 | Electorate of Saxony | 1485 | 1547 | `de_saxony_el` | — |
| 32 | Emirate of Granada | 1462 | 1492 | `es_granada` | `GRANADA` |
| 33 | Ethiopian Empire | 1468 | 1529 | `et_ethiopia_emp` | `ETHIOPIA` |
| 34 | Grand Duchy of Lithuania | 1482 | 1492 | `lt_lithuania_gd` | — |
| 35 |Grand Duchy of Moscow | 1485 | 1488 | `ru_moscow_gd` | — |
| 36 | Hafsid Dynasty | 1410 | 1534 | `tn_hafsid` | `HAFSIDS` |
| 37 | Holy Roman Empire | 1482 | 1492 | `de_hre` | — |
| 38 | Kalmar Union | 1483 | 1501 | `dk_kalmar` | — |
| 39 | Kingdom of Bohemia | 1479 | 1490 | `cz_bohemia_k` | — |
| 40 | Kingdom of Denmark | 1469 | 1813 | `dk_denmark_k` | — |
| 41 | Kingdom of England | 1482 | 1558 | `gb_england_k` | — |
| 42 | Kingdom of France | 1482 | 1492 | `fr_valois` | — |
| 43 | Kingdom of Hungary | 1485 | 1490 | `hu_hungary_k` | — |
| 44 | Kingdom of Imereti | 1484 | 1529 | `ge_imereti_k` | — |
| 45 | Kingdom of Kakheti | 1465 | 1520 | `ge_kakheti_k` | — |
| 46 | Kingdom of Kartli | 1484 | 1569 | `ge_kartli_k` | — |
| 47 | Kingdom of Naples | 1442 | 1500 | `it_naples_k` | `NAPLES` |
| 48 | Kingdom of Navarre | 1463 | 1511 | `es_navarre_k` | — |
| 49 | Kingdom of Norway | 1472 | 1644 | `no_norway_k` | — |
| 50 | Kingdom of Poland | 1466 | 1492 | `pl_poland_k` | — |
| 51 | Kingdom of Scotland | 1482 | 1602 | `gb_scotland_k` | — |
| 52 | Kingdom of Sweden | 1361 | 1616 | `se_sweden_k` | — |
| 53 | Landgraviate of Hesse | 1479 | 1567 | `de_hesse_lg` | — |
| 54 | Lordship of Ireland | 1300 | 1541 | `ie_ireland_l` | — |
| 55 | Makuria Kingdom | 1365 | 1499 | `sd_makuria` | `MAKURIA` |
| 56 | Mali Empire | 1473 | 1530 | `ml_mali_emp` | `MALI` |
| 57 | Mamluk Sultanate | 1468 | 1516 | `eg_mamluk` | `MAMLUK SULTANATE` |
| 58 |Margraviate of Baden | 1112 | 1535 | `de_baden_mg` | — |
| 59 |Margraviate of Brandenburg | 1455 | 1535 | `de_brandenburg_mg` | — |
| 60 | Moldavia | 1484 | 1538 | `md_moldavia_pr` | — |
| 61 | Novgorod Republic | 1478 | 1547 | `ru_novgorod` | — |
| 62 |Odoyevsky Principality | 1407 | 1494 | `ru_odoyev` | — |
| 63 | Ottoman Empire | 1484 | 1498 | `tr_ottoman` | `OTTOMAN EMPIRE` |
| 64 | Papal States | 1463 | 1505 | `va_papal` | — |
| 65 | Principality of Zeta | 1479 | 1496 | `me_zeta` | — |
| 66 | Pskov Republic | 1348 | 1510 | `ru_pskov` | — |
| 67 | Republic of Florence | 1421 | 1531 | `it_florence_r` | — |
| 68 | Republic of Genoa | 1475 | 1515 | `it_genoa_r` | — |
| 69 | Republic of Lucca | 1160 | 1799 | `it_lucca_r` | — |
| 70 | Republic of Siena | 1410 | 1554 | `it_siena_r` | — |
| 71 | Republic of Venice | 1480 | 1488 | `it_venice_r` | — |
| 72 | Songhai Empire | 1473 | 1500 | `ml_songhai` | `SONGHAI` |
| 73 | Wallachia | 1418 | 1859 | `ro_wallachia` | — |
| 74 | Wattasid dynasty | 1472 | 1554 | `ma_wattasid` | `WATTASID MOROCCO` |
| 75 | Zayyanid dynasty | 1437 | 1509 | `dz_zayyanid` | `ZAYYANIDS` |
| 76* | Kingdom of Portugal *(sorted last for z-order)* | 1482 | 1486 | `pt_portugal_k` | `PORTUGAL` |

*(Note: 75 total features; `Kingdom of Portugal` is feature #75 in `polities_1486.geojson` so its gold fill and solid stroke render on top of shared borders.)*

## Items Not Possible / Engine Notes

- All four deliverables were completed inside `Architecting_the_operation/video/yt02/stage/` (plus the temporary Cliopatria download in `/private/tmp/claude-501/.../scratchpad/cliopatria/`).
- No files in `/Users/emmanuel/Documents/Theory/scriptCast-stage/` were modified.
- `review/states.json` times (`500`, `13000`, `16000`, `21000`) remained unchanged because the new `i11` boot cue (`5300..5550 ms`) completes inside `R-01` (`0..6000 ms`).

## Verification Check Output Tails

### 1. Episode TypeScript Check
```text
$ npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage
(exited 0, 0 errors)
```

### 2. Deterministic Dashboard & Geometry Check (`tools/check_dashboard.mjs`)
```text
$ node Architecting_the_operation/video/yt02/stage/tools/check_dashboard.mjs
PASS: 16 frames rendered twice in fresh Node processes; identical right-stack and strip markup / whole-Dashboard hashes; state/effect/reducer hooks trap on invocation.
PASS: Equal Earth route 1296 samples / 0 land hits; Portugal height 107.77px mainland (144.18px with 1486 Moroccan enclave); monotonic flight; label clearance; 15 deterministic timeline states; all 33 instrument modes (11 instruments × 3 modes) with opaque panel-render fill; Compass widget live camera updates; 75 Cliopatria 1486 polities with 16 non-colliding labels.
```

### 3. Engine TypeScript & Stage Primitives Check
```text
$ cd /Users/emmanuel/Documents/Theory/scriptCast-stage/video && npx tsc --noEmit -p . && npm run check-stage
> scriptcast-video@0.2.0 check-stage
> node scripts/run-check-stage.mjs

PASS: motion/fly-to, springs, cues, instrument growth, four map projections + fit, and MathText parsing.
```

### 4. Stage Plan & Render Dry-Run
```text
$ PYTHONPATH=/Users/emmanuel/Documents/Theory/scriptCast-stage /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m scriptcast.tools.stage plan Architecting_the_operation/video/yt02/stage/review/stage.yaml
wrote /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage_plan.json

$ PYTHONPATH=/Users/emmanuel/Documents/Theory/scriptCast-stage /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m scriptcast.tools.stage render Architecting_the_operation/video/yt02/stage/review/stage_plan.json -o /tmp/x.mp4 --dry-run
STAGE_EPISODE_DIR=/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage npx --no-install remotion render src/stage/index.ts StageEpisode /private/tmp/x.mp4 --props=/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage_plan.json --timeout=120000 --codec h264 --concurrency=8 '--browser-executable=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

### 5. Vite Site Build (`review/site-dist`)
```text
$ cd /Users/emmanuel/Documents/Theory/scriptCast-stage/video && STAGE_EPISODE_DIR=/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage STAGE_PLAN=/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage_plan.json npx vite build --config site/vite.config.ts --outDir /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/site-dist
✓ 247 modules transformed.
../../../TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/site-dist/index.html                                                       0.35 kB │ gzip:   0.25 kB
../../../TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/site-dist/stage/default.json                                               2.99 kB │ gzip:   0.81 kB
../../../TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/site-dist/assets/index-CY3r-dUZ.css                                       15.81 kB │ gzip:   2.09 kB
../../../TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/site-dist/assets/index-C2sL2Hcm.js                                     1,494.29 kB │ gzip: 455.18 kB
✓ built in 844ms
```
