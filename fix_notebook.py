import json

nb_path = "/Users/emmanuel/Documents/Theory/Redefining_racism/Paper/scripts/eq47_51_spatial_overlay.ipynb"
with open(nb_path, "r") as f:
    nb = json.load(f)

for cell in nb["cells"]:
    if cell["cell_type"] == "code":
        source = "".join(cell["source"])

        # Comment 1: LISA cluster map uses removed geopandas/contextily symbols
        if "def make_lisa_cluster_map" in source:
            source = source.replace("SPATIAL_STATS_AVAILABLE", "su.SPATIAL_STATS_AVAILABLE")
            # Wait, su.SPATIAL_STATS_AVAILABLE is not in spatial_utils! It's in the setup cell of the notebook.
            # GEOPANDAS_AVAILABLE was removed from the notebook setup cell, but is in su.
            # Let me check if SPATIAL_STATS_AVAILABLE is in notebook.
            pass

with open("fix_notebook_dump.py", "w") as f:
    f.write("OK")
