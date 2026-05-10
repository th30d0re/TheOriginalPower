import json

nb_path = "/Users/emmanuel/Documents/Theory/Redefining_racism/Paper/scripts/eq47_51_spatial_overlay.ipynb"
with open(nb_path, "r") as f:
    nb = json.load(f)

for cell in nb["cells"]:
    if cell["cell_type"] != "code":
        continue
    
    source = "".join(cell["source"])

    # Fix 1: LISA Cluster Maps missing geopandas/contextily symbols
    if "def make_lisa_cluster_map" in source:
        # replace GEOPANDAS_AVAILABLE -> su.GEOPANDAS_AVAILABLE
        source = source.replace("not GEOPANDAS_AVAILABLE", "not su.GEOPANDAS_AVAILABLE")
        # replace gpd.GeoDataFrame -> su.gpd.GeoDataFrame
        source = source.replace("gpd.GeoDataFrame", "su.gpd.GeoDataFrame")
        # replace CONTEXTILY_AVAILABLE -> su.CONTEXTILY_AVAILABLE
        source = source.replace("CONTEXTILY_AVAILABLE", "su.CONTEXTILY_AVAILABLE")
        # replace ctx.add_basemap -> su.cx.add_basemap
        source = source.replace("ctx.add_basemap", "su.cx.add_basemap")
        # replace ctx.providers -> su.cx.providers
        source = source.replace("ctx.providers", "su.cx.providers")
        
        # apply back
        cell["source"] = [line + "\n" for line in source.split("\n")]
        if cell["source"] and cell["source"][-1].endswith("\n\n"):
            cell["source"][-1] = cell["source"][-1][:-1]

    # Fix 2: Phase B inline lead bar chart
    if "su.make_lead_bar_chart(panel, city, chart_path)" in source:
        source = source.replace(
            "su.make_lead_bar_chart(panel, city, chart_path)",
            "su.make_lead_bar_chart(panel, city, chart_path)\n        from IPython.display import Image, display\n        display(Image(filename=str(chart_path)))"
        )
        cell["source"] = [line + "\n" for line in source.split("\n")]
        if cell["source"] and cell["source"][-1].endswith("\n\n"):
            cell["source"][-1] = cell["source"][-1][:-1]

    # Fix 3: Pooled Forest Plot hardcoded p-value
    if "def make_forest_plot(" in source:
        source = source.replace("0.04,   # assume sig when available; replace with actual p from spreg output", "np.nan, # Neutral style until real p-values are extracted")
        cell["source"] = [line + "\n" for line in source.split("\n")]
        if cell["source"] and cell["source"][-1].endswith("\n\n"):
            cell["source"][-1] = cell["source"][-1][:-1]

with open(nb_path, "w") as f:
    json.dump(nb, f, indent=1)

print("Notebook fixes applied successfully.")
