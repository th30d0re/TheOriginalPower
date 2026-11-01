#!/usr/bin/env python3
"""Extract 1486 period polities from Cliopatria (Seshat Global History Databank)."""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path
from typing import Any

DEFAULT_INPUT = Path(
    "/private/tmp/claude-501/-Users-emmanuel-Documents-Theory-TheOriginalPower/"
    "fea37034-751e-40d2-a512-11766f9ff3a6/scratchpad/cliopatria/cliopatria.geojson"
)
STAGE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_GEOJSON_OUT = STAGE_DIR / "data" / "polities_1486.geojson"
DEFAULT_SOURCES_OUT = STAGE_DIR / "data" / "POLITIES_SOURCES.md"

TARGET_YEAR = 1486
BBOX = (-40.0, -5.0, 40.0, 55.0)  # (min_lon, min_lat, max_lon, max_lat)
TOLERANCE_DEG = 0.05
DECIMALS = 3

MAJOR_LABELS: dict[str, tuple[str, list[float]]] = {
    "Kingdom of Portugal": ("PORTUGAL", [-7.9, 41.3]),
    "Crown of Castile": ("CASTILE", [-4.3, 40.0]),
    "Crown of Aragon": ("ARAGON", [-0.2, 41.3]),
    "Emirate of Granada": ("GRANADA", [-3.6, 37.1]),
    "Wattasid dynasty": ("WATTASID MOROCCO", [-6.8, 32.0]),
    "Zayyanid dynasty": ("ZAYYANIDS", [0.8, 35.0]),
    "Hafsid Dynasty": ("HAFSIDS", [9.0, 33.8]),
    "Mali Empire": ("MALI", [-10.2, 11.2]),
    "Songhai Empire": ("SONGHAI", [-3.5, 15.6]),
    "Bornu Empire": ("BORNU", [13.5, 12.5]),
    "Mamluk Sultanate": ("MAMLUK SULTANATE", [24.5, 25.5]),
    "Makuria Kingdom": ("MAKURIA", [31.2, 20.8]),
    "Alodia": ("ALODIA", [32.5, 16.6]),
    "Ethiopian Empire": ("ETHIOPIA", [37.2, 11.2]),
    "Ottoman Empire": ("OTTOMAN EMPIRE", [22.0, 39.5]),
    "Kingdom of Naples": ("NAPLES", [15.2, 40.5]),
}


def iter_features(path: Path):
    """Stream or load GeoJSON features from Cliopatria."""
    with path.open("r", encoding="utf-8") as fh:
        data = json.load(fh)
    yield from data.get("features", [])


def geometry_bbox(geom: dict[str, Any]) -> tuple[float, float, float, float]:
    min_x = float("inf")
    min_y = float("inf")
    max_x = float("-inf")
    max_y = float("-inf")

    def walk(coords: Any) -> None:
        nonlocal min_x, min_y, max_x, max_y
        if not coords:
            return
        if isinstance(coords[0], (int, float)):
            x, y = float(coords[0]), float(coords[1])
            if x < min_x:
                min_x = x
            if x > max_x:
                max_x = x
            if y < min_y:
                min_y = y
            if y > max_y:
                max_y = y
        else:
            for item in coords:
                walk(item)

    walk(geom.get("coordinates", []))
    return min_x, min_y, max_x, max_y


def bboxes_intersect(
    a: tuple[float, float, float, float],
    b: tuple[float, float, float, float],
) -> bool:
    return a[2] >= b[0] and a[0] <= b[2] and a[3] >= b[1] and a[1] <= b[3]


def rdp(points: list[list[float]], epsilon: float) -> list[list[float]]:
    if len(points) < 3:
        return points
    x1, y1 = points[0][0], points[0][1]
    x2, y2 = points[-1][0], points[-1][1]
    dx = x2 - x1
    dy = y2 - y1
    denom = dx * dx + dy * dy
    max_dist = -1.0
    split_idx = 0
    for i in range(1, len(points) - 1):
        px, py = points[i][0], points[i][1]
        if denom == 0.0:
            dist = math.hypot(px - x1, py - y1)
        else:
            t = max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / denom))
            dist = math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
        if dist > max_dist:
            max_dist = dist
            split_idx = i
    if max_dist > epsilon:
        left = rdp(points[: split_idx + 1], epsilon)
        right = rdp(points[split_idx:], epsilon)
        return left[:-1] + right
    return [points[0], points[-1]]


def signed_ring_area(ring: list[list[float]]) -> float:
    area = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i][0], ring[i][1]
        x2, y2 = ring[i + 1][0], ring[i + 1][1]
        area += (x1 * y2) - (x2 * y1)
    return 0.5 * area


def simplify_ring(
    ring: list[list[float]],
    tolerance: float = TOLERANCE_DEG,
    is_exterior: bool = True,
) -> list[list[float]]:
    if len(ring) <= 4:
        pts = [[round(float(p[0]), DECIMALS), round(float(p[1]), DECIMALS)] for p in ring]
        if pts and pts[0] != pts[-1]:
            pts.append(pts[0])
        return pts

    xs = [p[0] for p in ring]
    ys = [p[1] for p in ring]
    span = math.hypot(max(xs) - min(xs), max(ys) - min(ys))
    eff_tol = min(tolerance, span * 0.12) if span < 0.8 else tolerance

    p0 = ring[0]
    far_idx = max(
        range(1, len(ring) - 1),
        key=lambda i: (ring[i][0] - p0[0]) ** 2 + (ring[i][1] - p0[1]) ** 2,
    )
    first_half = rdp(ring[: far_idx + 1], eff_tol)
    second_half = rdp(ring[far_idx:], eff_tol)
    merged = first_half[:-1] + second_half

    rounded = [[round(float(p[0]), DECIMALS), round(float(p[1]), DECIMALS)] for p in merged]
    dedup: list[list[float]] = [rounded[0]]
    for pt in rounded[1:]:
        if pt != dedup[-1]:
            dedup.append(pt)
    if dedup[0] != dedup[-1]:
        dedup.append(dedup[0])

    if len(dedup) < 4:
        fallback = [[round(float(p[0]), DECIMALS), round(float(p[1]), DECIMALS)] for p in ring]
        dedup = [fallback[0]]
        for pt in fallback[1:]:
            if pt != dedup[-1]:
                dedup.append(pt)
        if dedup[0] != dedup[-1]:
            dedup.append(dedup[0])

    area = signed_ring_area(dedup)
    # d3-geo spherical polygons require clockwise exterior rings (negative planar signed area).
    if is_exterior and area > 0:
        dedup.reverse()
    elif (not is_exterior) and area < 0:
        dedup.reverse()
    return dedup


def simplify_geometry(geom: dict[str, Any], tolerance: float = TOLERANCE_DEG) -> dict[str, Any]:
    gtype = geom["type"]
    coords = geom["coordinates"]
    if gtype == "Polygon":
        new_coords = [
            simplify_ring(ring, tolerance, is_exterior=(idx == 0))
            for idx, ring in enumerate(coords)
        ]
        return {"type": "Polygon", "coordinates": new_coords}
    if gtype == "MultiPolygon":
        new_coords = [
            [
                simplify_ring(ring, tolerance, is_exterior=(idx == 0))
                for idx, ring in enumerate(poly)
            ]
            for poly in coords
        ]
        return {"type": "MultiPolygon", "coordinates": new_coords}
    raise ValueError(f"Unsupported geometry type: {gtype}")


def build_feature(raw_feat: dict[str, Any], idx: int) -> dict[str, Any]:
    props = raw_feat["properties"]
    name = str(props.get("Name", "")).strip()
    is_portugal = name == "Kingdom of Portugal"
    is_umbrella = bool(props.get("Components"))

    if is_portugal:
        style = {
            "fill": "rgba(224,163,60,1)",
            "stroke": "rgba(232,201,155,1)",
            "strokeWidth": 1.2,
            "opacity": 1.0,
        }
    else:
        style = {
            "fill": "none",
            "stroke": "rgba(232,201,155,1)",
            "strokeWidth": 0.9,
            "strokeDasharray": "4 3",
            "opacity": 0.22 if is_umbrella else 0.38,
        }

    out_props: dict[str, Any] = {
        "Name": name,
        "FromYear": int(props["FromYear"]),
        "ToYear": int(props["ToYear"]),
        "Type": str(props["Type"]),
        "Area": round(float(props.get("Area", 0.0)), 1),
        "Wikipedia": props.get("Wikipedia") or "",
        "Wikidata": props.get("Wikidata") or "",
        "SeshatID": props.get("SeshatID") or "",
        "MemberOf": props.get("MemberOf") or "",
        "Components": props.get("Components") or "",
        "style": style,
    }
    if name in MAJOR_LABELS:
        label_text, label_at = MAJOR_LABELS[name]
        out_props["label"] = {
            "text": label_text,
            "at": label_at,
            "color": "rgba(232,201,155,0.72)" if not is_portugal else "rgba(232,201,155,1)",
        }

    return {
        "type": "Feature",
        "id": f"cliopatria-1486-{idx}",
        "properties": out_props,
        "geometry": simplify_geometry(raw_feat["geometry"]),
    }


def write_sources_md(features: list[dict[str, Any]], out_path: Path) -> None:
    lines = [
        "# Cliopatria 1486 Polity Boundaries (`polities_1486.geojson`)",
        "",
        "## Dataset and Provenance",
        "",
        "- **Dataset**: Cliopatria — A geospatial database of world-wide political entities from 3400BCE to 2024CE (Seshat Global History Databank)",
        "- **Authors**: Bennett, James S., et al. / Seshat Global History Databank (Bennett et al., *Scientific Data* 12, 2025, DOI: `10.1038/s41597-025-04516-9`)",
        "- **Version / Zenodo Record**: `v0.0.1`, Zenodo record `13363121`, DOI `10.5281/zenodo.13363121`",
        "- **Repository**: `https://github.com/Seshat-Global-History-Databank/cliopatria`",
        "- **Licence**: Creative Commons Attribution 4.0 International (`CC BY 4.0`)",
        "",
        "## Extraction Filter and Geometry Processing",
        "",
        "Generated by `tools/extract_polities.py` with the following filter verified against Cliopatria's `README.md` schema (`Name`, `FromYear`, `ToYear`, `Area`, `Type`, `Wikipedia`, `Wikidata`, `SeshatID`, `MemberOf`, `Components`, `geometry`):",
        "",
        "1. `properties.Type == 'POLITY'`",
        "2. `properties.FromYear <= 1486 <= properties.ToYear`",
        "3. Geometry bounding box intersects `lon in [-40, 40]`, `lat in [-5, 55]`",
        "4. Ramer–Douglas–Peucker ring simplification with `0.05°` tolerance and coordinates rounded to 3 decimal places, preserving clockwise spherical exterior ring orientation for `d3-geo`.",
        "",
        "## Coverage Notes for Named Polities",
        "",
        "- **Included major polities in view**: `Kingdom of Portugal` (with mainland Portugal, Ceuta/Tangier, Madeira, Azores, Cape Verde, and Elmina), `Crown of Castile`, `Crown of Aragon`, `Emirate of Granada`, `Wattasid dynasty` (Morocco), `Zayyanid dynasty`, `Hafsid Dynasty`, `Mali Empire`, `Songhai Empire`, `Bornu Empire`, `Mamluk Sultanate`, `Makuria Kingdom`, `Alodia`, `Ethiopian Empire`, `Ottoman Empire`, and `Kingdom of Naples`.",
        "- **Absent from Cliopatria v0.0.1 for 1486**: The Jolof Empire and the Kingdom of Benin (Edo) have no polygons in Cliopatria v0.0.1 for 1486 (`Republic of Benin` appears only from 1961 to 2024). Per project rules, no synthetic boundaries were added.",
        "",
        f"## Extracted Features ({len(features)} Polities)",
        "",
        "| # | Name | FromYear | ToYear | Area (km²) | SeshatID | Label |",
        "| ---: | --- | ---: | ---: | ---: | --- | --- |",
    ]
    for i, feat in enumerate(features, start=1):
        p = feat["properties"]
        lbl = p.get("label", {}).get("text", "")
        seshat = p.get("SeshatID") or "—"
        lines.append(
            f"| {i} | {p['Name']} | {p['FromYear']} | {p['ToYear']} | {p['Area']:.1f} | `{seshat}` | {lbl} |"
        )
    lines.append("")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--out-geojson", type=Path, default=DEFAULT_GEOJSON_OUT)
    parser.add_argument("--out-sources", type=Path, default=DEFAULT_SOURCES_OUT)
    args = parser.parse_args()

    matched: list[dict[str, Any]] = []
    for raw_feat in iter_features(args.input):
        props = raw_feat.get("properties", {})
        if props.get("Type") != "POLITY":
            continue
        from_year = int(props.get("FromYear", 999999))
        to_year = int(props.get("ToYear", -999999))
        if not (from_year <= TARGET_YEAR <= to_year):
            continue
        f_bbox = geometry_bbox(raw_feat["geometry"])
        if not bboxes_intersect(f_bbox, BBOX):
            continue
        matched.append(raw_feat)

    # Sort deterministically by Name, FromYear, ToYear; place Kingdom of Portugal last so its gold fill and solid stroke sit above shared borders.
    matched.sort(
        key=lambda f: (
            f["properties"].get("Name") == "Kingdom of Portugal",
            str(f["properties"].get("Name", "")),
            int(f["properties"].get("FromYear", 0)),
            int(f["properties"].get("ToYear", 0)),
        )
    )

    features = [build_feature(raw_feat, idx) for idx, raw_feat in enumerate(matched)]
    collection = {"type": "FeatureCollection", "features": features}

    args.out_geojson.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(collection, ensure_ascii=False, separators=(",", ":")) + "\n"
    args.out_geojson.write_text(payload, encoding="utf-8")
    json_alias = args.out_geojson.with_suffix(".json")
    if json_alias != args.out_geojson:
        if json_alias.is_symlink():
            json_alias.unlink()
        json_alias.write_text(payload, encoding="utf-8")
    write_sources_md(features, args.out_sources)
    print(
        f"Wrote {len(features)} features ({len(payload)} bytes) to {args.out_geojson} "
        f"and sources to {args.out_sources}"
    )


if __name__ == "__main__":
    main()
