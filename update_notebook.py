import json

with open("Paper/scripts/eq47_51_spatial_overlay.ipynb", "r") as f:
    nb = json.load(f)

# Find cell 6: "def _norm_geoid_11"
for cell in nb["cells"]:
    if cell["cell_type"] == "code" and "".join(cell["source"]).startswith("def _norm_geoid_11"):
        cell["source"] = [
            "from spatial_utils import (\n",
            "    build_tract_panel,\n",
            "    load_holc,\n",
            "    make_folium_overlay,\n",
            "    export_map_png,\n",
            "    make_lead_bar_chart\n",
            ")\n",
            "print(\"Imported spatial_utils functions.\")\n"
        ]

# Find cell 7: "def _load_cached_tract_geometry"
for cell in nb["cells"]:
    if cell["cell_type"] == "code" and "".join(cell["source"]).startswith("def _load_cached_tract_geometry"):
        cell["source"] = [
            "# Join functions and grid building are now handled by spatial_utils.build_tract_panel\n"
        ]

# Find cell 8: the pipeline loop "city_panels: dict = {}"
for cell in nb["cells"]:
    if cell["cell_type"] == "code" and "".join(cell["source"]).startswith("city_panels: dict = {}"):
        cell["source"] = [
            "city_panels: dict = {}\n",
            "city_incidents: dict = {}\n",
            "city_holc: dict = {}\n",
            "\n",
            "for city in CITIES:\n",
            "    print(f\"\\n{'='*55}\")\n",
            "    print(f\"Processing: {city['label']}\")\n",
            "    print('='*55)\n",
            "\n",
            "    try:\n",
            "        tracts = build_tract_panel(city)\n",
            "        if tracts is not None and not tracts.empty:\n",
            "            city_panels[city['id']] = tracts\n",
            "        \n",
            "        # Load HOLC for the overlay separately, or use what's loaded\n",
            "        holc = load_holc(city)\n",
            "        if holc is not None:\n",
            "            city_holc[city['id']] = holc\n",
            "            \n",
            "    except Exception as exc:\n",
            "        print(f\"  [ERROR] {city['label']}: pipeline failed — {exc}\")\n",
            "\n",
            "import pandas as pd\n",
            "if city_panels:\n",
            "    non_geom = [c for c in next(iter(city_panels.values())).columns if c != \"geometry\"]\n",
            "    pooled = pd.concat([df[non_geom] for df in city_panels.values() if len(df) > 0], ignore_index=True)\n",
            "    pooled.to_parquet(DATA_DIR / \"pooled_panel.parquet\", index=False)\n"
        ]

# Modify Cell 10 and 11 which handle make_spatial_confluence_overlay and the loop
for cell in nb["cells"]:
    if cell["cell_type"] == "code" and "".join(cell["source"]).startswith("def _has_valid_geometry"):
        cell["source"] = [
            "# Visualization and export are now handled by spatial_utils\n",
            "import matplotlib.pyplot as plt\n",
            "\n",
            "for city in CITIES:\n",
            "    panel = city_panels.get(city['id'])\n",
            "    holc = city_holc.get(city['id'])\n",
            "    if panel is not None and holc is not None:\n",
            "        m = make_folium_overlay(city, holc, panel)\n",
            "        if m is not None:\n",
            "            out_path = FIG_DIR / f\"cs9_overlay_{city['id']}.png\"\n",
            "            export_map_png(m, out_path)\n",
            "            print(f\"  [FIG] Saved map: {out_path.name}\")\n",
            "            \n",
            "        chart_path = FIG_DIR / f\"cs9_lead_bar_{city['id']}.png\"\n",
            "        make_lead_bar_chart(panel, city, chart_path)\n",
            "\n",
            "print(\"\\nSingle-map spatial overlays complete.\")\n"
        ]

with open("Paper/scripts/eq47_51_spatial_overlay.ipynb", "w") as f:
    json.dump(nb, f, indent=1)

