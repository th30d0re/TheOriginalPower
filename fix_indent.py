import json
nb_path = "/Users/emmanuel/Documents/Theory/Redefining_racism/Paper/scripts/eq47_51_spatial_overlay.ipynb"
with open(nb_path, "r") as f:
    nb = json.load(f)

for cell in nb["cells"]:
    if cell["cell_type"] != "code": continue
    source = "".join(cell["source"])
    if "from IPython.display import Image, display" in source:
        source = source.replace("        from IPython.display", "    from IPython.display")
        source = source.replace("        display(Image", "    display(Image")
        cell["source"] = [line + "\n" for line in source.split("\n")]
        if cell["source"] and cell["source"][-1].endswith("\n\n"):
            cell["source"][-1] = cell["source"][-1][:-1]

with open(nb_path, "w") as f:
    json.dump(nb, f, indent=1)
