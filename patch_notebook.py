import json

path = "Paper/scripts/eq47_51_spatial_overlay.ipynb"
with open(path, "r", encoding="utf-8") as f:
    nb = json.load(f)

for cell in nb.get("cells", []):
    if cell.get("cell_type") != "code":
        continue
    source = cell.get("source", [])
    
    # Chunk 1 (Step 3 Part A)
    new_source = []
    i = 0
    while i < len(source):
        line = source[i]
        if 'slm = spreg.GM_Lag(yv, Xv, w=w_sub' in line:
            # We are at the start of the block.
            new_source.append(line)
            new_source.append(source[i+1])
            new_source.append(source[i+2])
            new_source.append('        try:\n')
            new_source.append('            holc_p = slm.z_stat[1][1]\n')
            new_source.append('        except Exception:\n')
            new_source.append('            holc_p = np.nan\n')
            new_source.append('        results["SLM"] = {\n')
            new_source.append('            "rho":       slm.rho,\n')
            new_source.append('            "coefs":     dict(zip(["const"] + x_cols + ["W_y"], slm.betas.flatten())),\n')
            new_source.append('            "pseudo_r2": slm.pr2,\n')
            new_source.append('            "holc_d_flag_pvalue": holc_p,\n')
            new_source.append('        }\n')
            i += 8 # skip the original 8 lines
        else:
            new_source.append(line)
            i += 1
    source = new_source
    
    # Chunk 2 (Step 2 Problem 1)
    new_source = []
    for line in source:
        if 'if not isinstance(panel, su.gpd.GeoDataFrame) or panel.geometry.is_empty.all():' in line:
            indent = line.split('if')[0]
            new_source.append(indent + "if not getattr(su, 'GEOPANDAS_AVAILABLE', False) or not hasattr(su, 'gpd'):\n")
            new_source.append(indent + "    print(f\"  [SKIP LISA] {city['label']}: geopandas unavailable\")\n")
            new_source.append(indent + "    return\n")
            new_source.append(line)
        elif 'if su.CONTEXTILY_AVAILABLE:' in line:
            new_source.append(line.replace('if su.CONTEXTILY_AVAILABLE:', 'if su.CONTEXTILY_AVAILABLE and hasattr(su, \'cx\'):'))
        elif 'np.nan, # Neutral style until real p-values are extracted' in line:
            indent = line.split('np.nan')[0]
            new_source.append(indent + "reg_results.get(c[\"id\"], {}).get(\"SLM\", {}).get(\"holc_d_flag_pvalue\", np.nan),\n")
        else:
            new_source.append(line)
    cell["source"] = new_source

with open(path, "w", encoding="utf-8") as f:
    json.dump(nb, f, indent=1)
    f.write("\n")

print("Notebook patched successfully.")
