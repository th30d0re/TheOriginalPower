import json

with open("Paper/scripts/eq47_51_spatial_overlay.ipynb", "r") as f:
    nb = json.load(f)

script = ""
for cell in nb.get("cells", []):
    if cell.get("cell_type") == "code":
        script += "".join(cell.get("source", [])) + "\n\n"

with open("Paper/scripts/test_overlay.py", "w") as f:
    f.write(script)

