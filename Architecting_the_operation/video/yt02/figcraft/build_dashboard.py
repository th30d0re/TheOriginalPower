#!/usr/bin/env python3
"""Build the YT02 SEG 11 runtime dashboard in FigCraft via TCP control channel.

Reads `Architecting_the_operation/video/yt02/dashboard_eras.json` and constructs
seven 1920x1080 era frames (`era 1486`, `era 1676`, `era 1704`, `era 1894`,
`era 1968`, `era 1994`, `era 2010s`), measures shaped text bounds via `node.get`
to size variable chips and level badges to exact glyph widths, wires `afterDelay`
+ `smartAnimate` prototype transitions across the sequence, saves the native
FigCraft file and `.fig` export, and renders 1920x1080 PNG exports for every era.
"""

import argparse
import json
import math
import shutil
import socket
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
YT02_DIR = HERE.parent
ERAS_JSON = YT02_DIR / "dashboard_eras.json"

# YT01 / YT02 Palette
BG = "#0F1B33"
PAGE_BG = "#091020"
PANEL = "#16264A"
PANEL_DARK = "#0B1528"
INK = "#F4EAD2"
DIM = "#9FB0CF"
GOLD = "#D9A441"
GOLD_BG = "#28282B"
RED = "#E2573F"
RED_BG = "#2D1826"
BLUE = "#5FA8D3"
BLUE_BG = "#132A4A"
FONT = "Noto Sans"

ERA_META = [
    {"log": 2, "year": "1486", "frame": "era 1486", "short": "1486"},
    {"log": 3, "year": "1676", "frame": "era 1676", "short": "1676–1787"},
    {"log": 5, "year": "1704", "frame": "era 1704", "short": "1704–1865"},
    {"log": 9, "year": "1894", "frame": "era 1894", "short": "1894–1965"},
    {"log": 14, "year": "1968", "frame": "era 1968", "short": "1968–1994"},
    {"log": 15, "year": "1994", "frame": "era 1994", "short": "1994–PRESENT"},
    {"log": 17, "year": "2010s", "frame": "era 2010s", "short": "2010s–PRESENT"},
]


class FigCraftClient:
    """TCP JSON-lines client for FigCraft control channel."""

    def __init__(self, port=47831, timeout=30.0):
        self.port = port
        self.timeout = timeout
        self.req_id = 0
        self.commands_used = []

    def activate_app(self):
        """Ensure FigCraft window is un-occluded on macOS so eframe::App::update drains the queue."""
        subprocess.run(
            ["osascript", "-e", 'tell application "FigCraft" to activate'],
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

    def call(self, method, params=None):
        self.req_id += 1
        request = {
            "id": self.req_id,
            "method": method,
            "params": {} if params is None else params,
        }
        wire = (json.dumps(request, ensure_ascii=False, allow_nan=False) + "\n").encode("utf-8")
        with socket.create_connection(("127.0.0.1", self.port), self.timeout) as conn:
            conn.settimeout(self.timeout)
            conn.sendall(wire)
            with conn.makefile("rb") as reader:
                line = reader.readline()
        if not line:
            raise RuntimeError(f"FigCraft closed connection on {method}")
        resp = json.loads(line)
        if not resp.get("ok"):
            raise RuntimeError(f"FigCraft error on {method}: {resp}")
        return resp.get("result")

    def execute(self, command, params=None):
        self.commands_used.append(command)
        return self.call(
            "engine.execute",
            {"command": command, "params": {} if params is None else params},
        )

    def batch(self, label, commands):
        for item in commands:
            self.commands_used.append(item["command"])
        return self.execute("command.batch", {"label": label, "commands": commands})


def canonical_chip_name(var_text):
    """Map a variable entry from dashboard_eras.json to its canonical `chip <id>` layer name."""
    s = var_text.strip()
    if s in ("The Elite Class (E)", "E") or s.endswith("— E"):
        return "chip E"
    if s in ("The Out-group (O_racialized)", "O_racialized"):
        return "chip O_racialized"
    if s in ("The In-group (I)", "I"):
        return "chip I"
    if s.startswith("I_buffer"):
        return "chip I_buffer"
    if s.startswith("F_enforce^proto"):
        return "chip F_enforce^proto"
    if s.startswith("F_enforce"):
        return "chip F_enforce"
    if s.startswith("P_uppet^v1.0"):
        return "chip P_uppet^v1.0"
    if s.startswith("P_uppet"):
        return "chip P_uppet"
    if s.startswith("W = jψ_s"):
        return "chip W = jψ_s"
    if s.startswith("W (Complex Wage"):
        return "chip W"
    if s.startswith("QI "):
        return "chip QI"
    if s.startswith("P_spatial"):
        return "chip P_spatial"
    if s.startswith("Capture Variable"):
        return "chip Capture Variable"
    if s.startswith("P_criminal"):
        return "chip P_criminal"
    if s.startswith("P_lead"):
        return "chip P_lead"
    if s.startswith("P_deindustrial"):
        return "chip P_deindustrial"
    if s.startswith("P_BrokenWindows"):
        return "chip P_BrokenWindows"
    if s.startswith("P_retroactive"):
        return "chip P_retroactive"
    if s.startswith("Universal Latent Criminality"):
        return "chip Universal Latent Criminality"
    if s.startswith("P_gaslight"):
        return "chip P_gaslight"
    if s.startswith("P_toxin"):
        return "chip P_toxin"
    if s.startswith("P_fetal_personhood"):
        return "chip P_fetal_personhood"
    if s.startswith("new: E"):
        return "chip E_ortho"
    if s.startswith("Γ"):
        return "chip Γ"
    if s.startswith("V/R"):
        return "chip V/R"
    if s.startswith("N ("):
        return "chip N"
    if s.startswith("B ("):
        return "chip B"
    if s.startswith("Full domestic"):
        return "chip hierarchy"
    return f"chip {s}"


def split_title(title):
    """Split 'DATE (PLACE)' into (head, sub) preserving exact text."""
    if " (" in title and title.endswith(")"):
        head, rest = title.split(" (", 1)
        return head.strip(), rest[:-1].strip()
    return title, ""


def badge_colors(level):
    """Return (fill_hex, text_hex, border_hex) for a stress or capital badge."""
    if not level:
        return PANEL_DARK, DIM, DIM
    u = level.upper()
    if u in ("CRITICAL", "AT RISK", "BLOCKED"):
        return RED, INK, RED
    if u in ("HIGH", "PEAK", "STAGNANT"):
        return GOLD, BG, GOLD
    if u in ("MODERATE", "EXPANDING", "RESTRUCTURING", "LOW", "MINIMAL"):
        return BLUE, BG, BLUE
    return GOLD, BG, GOLD


def extract_range_str(text, prefix):
    """Extract verbatim substring for Φ_load or ρ_τ from interference_state.text."""
    if not text:
        return ""
    if prefix == "phi":
        for token in ("Φ_load ∈ [", "["):
            idx = text.find(token)
            if idx != -1:
                end = text.find("]", idx)
                if end != -1:
                    return text[idx : end + 1]
    elif prefix == "rho":
        idx = text.find("ρ_τ")
        if idx != -1:
            last_idx = text.rfind("ρ_τ")
            end = text.find("]", last_idx)
            if end != -1:
                return text[last_idx : end + 1]
    return ""


def rgba(hex_str, alpha=1.0):
    """Convert `#RRGGBB` hex string and alpha float into a FigCraft RGBA dict."""
    h = hex_str.lstrip("#")
    return {
        "r": round(int(h[0:2], 16) / 255.0, 4),
        "g": round(int(h[2:4], 16) / 255.0, 4),
        "b": round(int(h[4:6], 16) / 255.0, 4),
        "a": round(float(alpha), 4),
    }


def linear_gradient_paint(top_hex, bottom_hex, *, mid_hex=None, mid_pos=0.5, opacity=1.0):
    """Build a vertical linear gradient paint object for FigCraft `fills`."""
    stops = [{"position": 0.0, "color": top_hex}]
    if mid_hex is not None:
        stops.append({"position": float(mid_pos), "color": mid_hex})
    stops.append({"position": 1.0, "color": bottom_hex})
    return {
        "type": "gradient",
        "kind": "linear",
        "from": [0.5, 0.0],
        "to": [0.5, 1.0],
        "width": [1.0, 0.0],
        "opacity": float(opacity),
        "blend": "normal",
        "visible": True,
        "stops": stops,
    }


def radial_vignette_paint(center_hex="#182B52", mid_hex=BG, edge_hex="#060C18"):
    """Build a subtle radial vignette paint object for the 1920x1080 era frame (Level 0)."""
    return {
        "type": "gradient",
        "kind": "radial",
        "from": [0.5, 0.5],
        "to": [0.96, 0.5],
        "width": [0.5, 0.96],
        "opacity": 1.0,
        "blend": "normal",
        "visible": True,
        "stops": [
            {"position": 0.0, "color": center_hex},
            {"position": 0.55, "color": mid_hex},
            {"position": 1.0, "color": edge_hex},
        ],
    }


def drop_shadow(color_hex="#000000", alpha=0.35, ox=0.0, oy=2.0, blur=4.0, spread=0.0):
    """Build a FigCraft `dropShadow` effect dict."""
    return {
        "type": "dropShadow",
        "color": rgba(color_hex, alpha),
        "offset": [float(ox), float(oy)],
        "radius": float(blur),
        "spread": float(spread),
        "showBehind": False,
        "blend": "normal",
        "visible": True,
    }


def inner_shadow(color_hex="#000000", alpha=0.45, ox=0.0, oy=2.0, blur=6.0, spread=0.0):
    """Build a FigCraft `innerShadow` effect dict."""
    return {
        "type": "innerShadow",
        "color": rgba(color_hex, alpha),
        "offset": [float(ox), float(oy)],
        "radius": float(blur),
        "spread": float(spread),
        "showBehind": False,
        "blend": "normal",
        "visible": True,
    }


def noise_effect(alpha=0.03, density=0.20, size=0.5):
    """Build a subtle mono `noise` effect dict in navy hue to prevent banding without speckling."""
    return {
        "type": "noise",
        "mode": "mono",
        "color": rgba("#1E3460", alpha),
        "secondary": rgba("#060C18", alpha),
        "density": float(density),
        "size": float(size),
        "opacity": float(alpha),
        "blend": "normal",
        "visible": True,
    }


def panel_fill():
    """Soft vertical gradient for Level 1 panels (top a touch lighter than bottom)."""
    return [linear_gradient_paint("#1B2E58", "#111E3B", mid_hex=PANEL, mid_pos=0.48)]


def panel_effects():
    """Level 1 panel depth: contact shadow, wide ambient shadow, and 1 px top inner highlight."""
    return [
        drop_shadow("#000000", alpha=0.30, ox=0.0, oy=16.0, blur=40.0),
        drop_shadow("#000000", alpha=0.35, ox=0.0, oy=2.0, blur=4.0),
        inner_shadow(INK, alpha=0.06, ox=0.0, oy=1.0, blur=0.5),
    ]


def raised_effects(glow_hex, *, glow_alpha=0.35, glow_blur=20.0, top_highlight=0.10):
    """Level 2 raised element depth: stronger dual drop shadow, outer accent glow, and top highlight."""
    return [
        drop_shadow("#000000", alpha=0.46, ox=0.0, oy=6.0, blur=14.0),
        drop_shadow("#000000", alpha=0.38, ox=0.0, oy=2.0, blur=4.0),
        drop_shadow(glow_hex, alpha=glow_alpha, ox=0.0, oy=0.0, blur=glow_blur),
        inner_shadow("#FFFFFF", alpha=top_highlight, ox=0.0, oy=1.0, blur=0.5),
    ]


def well_fill():
    """Recessed darker vertical gradient for inset wells."""
    return [linear_gradient_paint("#070E1C", PANEL_DARK)]


def well_effects():
    """Inset well depth: top inner shadow (y 2, blur 6, black ~45%) + faint bottom rim light."""
    return [
        inner_shadow("#000000", alpha=0.45, ox=0.0, oy=2.0, blur=6.0),
        drop_shadow(INK, alpha=0.04, ox=0.0, oy=1.0, blur=0.0),
    ]


def data_glow_effects(glow_hex, *, outer_alpha=0.42, outer_blur=18.0, core_alpha=0.28, core_blur=6.0):
    """Luminous glow for live data readings (Φ_load fill, ρ_τ sector/needle, crash marker)."""
    return [
        drop_shadow(glow_hex, alpha=outer_alpha, ox=0.0, oy=0.0, blur=outer_blur),
        drop_shadow(glow_hex, alpha=core_alpha, ox=0.0, oy=0.0, blur=core_blur),
    ]


def badge_gradient(fill_hex):
    """Return a soft vertical gradient fill list matching a badge's semantic color."""
    if fill_hex == RED:
        return [linear_gradient_paint("#EB624A", "#CF4932")]
    if fill_hex == GOLD:
        return [linear_gradient_paint("#E5B350", "#C6902E")]
    if fill_hex == BLUE:
        return [linear_gradient_paint("#6EB6E0", "#4D93BD")]
    return [linear_gradient_paint("#12203D", PANEL_DARK)]


def _apply_paint_and_effects(props, *, fill=None, fills=None, stroke=None, stroke_w=1, stroke_opacity=1.0, effects=None):
    if fills is not None:
        props["fills"] = fills
    elif fill is not None:
        props["fill"] = fill
    else:
        props["fills"] = []
    if stroke is not None:
        if stroke_opacity < 1.0:
            props["strokes"] = [
                {
                    "type": "solid",
                    "color": stroke,
                    "opacity": round(float(stroke_opacity), 3),
                    "visible": True,
                    "blend": "normal",
                }
            ]
        else:
            props["stroke"] = stroke
        props["strokeWeight"] = stroke_w
    if effects:
        props["effects"] = effects


def rect_cmd(
    parent,
    name,
    x,
    y,
    w,
    h,
    *,
    fill=None,
    fills=None,
    stroke=None,
    stroke_w=1,
    stroke_opacity=1.0,
    radius=0,
    opacity=1.0,
    rotation=0.0,
    effects=None,
):
    props = {"opacity": opacity}
    _apply_paint_and_effects(
        props,
        fill=fill,
        fills=fills,
        stroke=stroke,
        stroke_w=stroke_w,
        stroke_opacity=stroke_opacity,
        effects=effects,
    )
    if radius:
        props["cornerRadius"] = radius
    if rotation:
        props["rotation"] = rotation
    return {
        "command": "node.create",
        "params": {
            "type": "rectangle",
            "parent": parent,
            "name": name,
            "x": round(x, 2),
            "y": round(y, 2),
            "width": round(max(1.0, w), 2),
            "height": round(max(1.0, h), 2),
            "select": False,
            "props": props,
        },
    }


def ellipse_cmd(
    parent,
    name,
    x,
    y,
    w,
    h,
    *,
    fill=None,
    fills=None,
    stroke=None,
    stroke_w=1,
    stroke_opacity=1.0,
    arc_start=None,
    arc_sweep=None,
    arc_inner=None,
    opacity=1.0,
    effects=None,
):
    props = {"opacity": opacity}
    _apply_paint_and_effects(
        props,
        fill=fill,
        fills=fills,
        stroke=stroke,
        stroke_w=stroke_w,
        stroke_opacity=stroke_opacity,
        effects=effects,
    )
    if arc_start is not None:
        props["arcStart"] = round(arc_start, 2)
    if arc_sweep is not None:
        props["arcSweep"] = round(arc_sweep, 2)
    if arc_inner is not None:
        props["arcInner"] = round(arc_inner, 3)
    return {
        "command": "node.create",
        "params": {
            "type": "ellipse",
            "parent": parent,
            "name": name,
            "x": round(x, 2),
            "y": round(y, 2),
            "width": round(w, 2),
            "height": round(h, 2),
            "select": False,
            "props": props,
        },
    }


def vector_cmd(
    parent,
    name,
    path_d,
    *,
    fill=None,
    stroke=None,
    stroke_w=2,
    stroke_opacity=1.0,
    opacity=1.0,
    stroke_cap="round",
    effects=None,
):
    props = {"opacity": opacity, "strokeCap": stroke_cap, "strokeJoin": "round"}
    _apply_paint_and_effects(
        props,
        fill=fill,
        stroke=stroke,
        stroke_w=stroke_w,
        stroke_opacity=stroke_opacity,
        effects=effects,
    )
    return {
        "command": "node.create",
        "params": {
            "type": "vector",
            "parent": parent,
            "name": name,
            "path": path_d,
            "select": False,
            "props": props,
        },
    }


def text_cmd(
    parent,
    name,
    text,
    x,
    y,
    *,
    size=16,
    style="Regular",
    color=INK,
    width=None,
    align="left",
    line_height="135%",
    letter_spacing="0%",
    opacity=1.0,
    effects=None,
):
    props = {
        "fontFamily": FONT,
        "fontStyle": style,
        "fontSize": size,
        "fill": color,
        "textAlign": align,
        "lineHeight": line_height,
        "letterSpacing": letter_spacing,
        "opacity": opacity,
    }
    if effects:
        props["effects"] = effects
    params = {
        "type": "text",
        "parent": parent,
        "name": name,
        "text": text if text else " ",
        "x": round(x, 2),
        "y": round(y, 2),
        "select": False,
        "props": props,
    }
    if width is not None:
        params["width"] = round(width, 2)
        props["textAutoResize"] = "height"
    return {"command": "node.create", "params": params}


def create_chip_group(cmds, parent, items, *, x_start, y_start, is_deployed=True):
    """Create initial chip nodes; exact widths and wrapping are refined after font shaping."""
    specs = []
    cx = x_start
    cy = y_start
    row_h = 32
    for raw_item in items:
        cname = canonical_chip_name(raw_item)
        highlight = is_deployed or raw_item.strip().startswith("new:")
        font_sz = 13 if len(raw_item) <= 48 else 12
        chip_fills = (
            [linear_gradient_paint("#323035", "#202024", mid_hex=GOLD_BG, mid_pos=0.5)]
            if highlight
            else [linear_gradient_paint("#070E1C", "#0C172C")]
        )
        stroke_col = GOLD if highlight else DIM
        text_col = GOLD if highlight else DIM
        stroke_w = 1.6 if highlight else 1.0
        stroke_op = 0.76 if highlight else 0.34
        chip_fx = (
            raised_effects(GOLD, glow_alpha=0.35, glow_blur=18.0, top_highlight=0.09)
            if highlight
            else [
                inner_shadow("#000000", alpha=0.40, ox=0.0, oy=2.0, blur=4.0),
                drop_shadow("#000000", alpha=0.24, ox=0.0, oy=2.0, blur=4.0),
            ]
        )
        est_w = max(56, int(len(raw_item) * 8.2 + (42 if highlight else 28)))

        cmds.append(
            rect_cmd(
                parent,
                cname,
                cx,
                cy,
                est_w,
                row_h,
                fills=chip_fills,
                stroke=stroke_col,
                stroke_w=stroke_w,
                stroke_opacity=stroke_op,
                radius=16,
                effects=chip_fx,
            )
        )
        dot_name = f"{cname} dot"
        if highlight:
            cmds.append(
                ellipse_cmd(
                    parent,
                    dot_name,
                    cx + 12,
                    cy + (row_h - 8) / 2,
                    8,
                    8,
                    fill=GOLD,
                    effects=[drop_shadow(GOLD, alpha=0.55, ox=0.0, oy=0.0, blur=6.0)],
                )
            )
        lbl_name = f"{cname} label"
        cmds.append(
            text_cmd(
                parent,
                lbl_name,
                raw_item,
                cx + (26 if highlight else 14),
                cy + (row_h - font_sz - 3) / 2,
                size=font_sz,
                style="Bold" if highlight else "Regular",
                color=INK if highlight else text_col,
                line_height="115%",
            )
        )
        specs.append(
            {
                "chip": cname,
                "dot": dot_name if highlight else None,
                "label": lbl_name,
                "highlight": highlight,
            }
        )
        cx += est_w + 10
    return specs


def build_era_commands(frame_id, era_idx, era, all_eras):
    """Build the list of FigCraft batch commands for one 1920x1080 era frame."""
    cmds = []
    fields = era["fields"]
    raw_fields = era.get("raw_fields", {})
    log_num = era["log"]
    title = era["title"]
    chapter_label = era.get("chapter_label") or ""
    date_head, place_sub = split_title(title)

    # -------------------------------------------------------------------------
    # 1. TOP TIMELINE STRIP (x=40, y=18, w=1840, h=46)
    # -------------------------------------------------------------------------
    tl_x, tl_y, tl_w, tl_h = 40, 18, 1840, 46
    cmds.append(
        rect_cmd(
            frame_id,
            "timeline strip",
            tl_x,
            tl_y,
            tl_w,
            tl_h,
            fills=panel_fill(),
            stroke=BLUE,
            stroke_w=1,
            stroke_opacity=0.42,
            radius=8,
            effects=panel_effects(),
        )
    )
    seg_w = tl_w / len(all_eras)
    band_w = seg_w * (era_idx + 1)
    cmds.append(
        rect_cmd(
            frame_id,
            "era band fill",
            tl_x,
            tl_y,
            band_w,
            tl_h,
            fill=GOLD,
            radius=8,
            opacity=0.12,
        )
    )
    cmds.append(
        rect_cmd(
            frame_id,
            "era band",
            tl_x,
            tl_y + tl_h - 6,
            band_w,
            6,
            fill=GOLD,
            radius=3,
            effects=[drop_shadow(GOLD, alpha=0.35, ox=0.0, oy=0.0, blur=10.0)],
        )
    )
    cmds.append(
        rect_cmd(
            frame_id,
            "era active marker",
            tl_x + era_idx * seg_w + 3,
            tl_y + 3,
            seg_w - 6,
            tl_h - 10,
            fills=[linear_gradient_paint("#1D315C", "#0D182E")],
            stroke=GOLD,
            stroke_w=1.5,
            stroke_opacity=0.82,
            radius=6,
            effects=raised_effects(GOLD, glow_alpha=0.35, glow_blur=18.0, top_highlight=0.10),
        )
    )
    for i, other in enumerate(all_eras):
        o_head, _ = split_title(other["title"])
        sx = tl_x + i * seg_w
        is_curr = i == era_idx
        is_past = i < era_idx
        col = GOLD if is_curr else (INK if is_past else DIM)
        cmds.append(
            text_cmd(
                frame_id,
                f"timeline {ERA_META[i]['year']}",
                f"LOG {other['log']} · {o_head}",
                sx + 8,
                tl_y + 12,
                size=12,
                style="Bold" if is_curr else "Regular",
                color=col,
                width=seg_w - 16,
                align="center",
                line_height="110%",
            )
        )

    # -------------------------------------------------------------------------
    # 2. ERA HEADER (x=40, y=74, w=1140, h=104) & ACTIVE PATCH (x=1196, y=74, w=684, h=104)
    # -------------------------------------------------------------------------
    hdr_x, hdr_y, hdr_w, hdr_h = 40, 74, 1140, 104
    cmds.append(
        rect_cmd(
            frame_id,
            "era header",
            hdr_x,
            hdr_y,
            hdr_w,
            hdr_h,
            fills=panel_fill(),
            stroke=BLUE,
            stroke_w=1,
            stroke_opacity=0.42,
            radius=10,
            effects=panel_effects(),
        )
    )
    cmds.append(
        rect_cmd(
            frame_id,
            "era header accent",
            hdr_x,
            hdr_y,
            6,
            hdr_h,
            fill=GOLD,
            radius=3,
            effects=[drop_shadow(GOLD, alpha=0.30, ox=0.0, oy=0.0, blur=10.0)],
        )
    )
    cmds.append(
        rect_cmd(
            frame_id,
            "era log badge",
            hdr_x + hdr_w - 292,
            hdr_y + 14,
            274,
            28,
            fills=[linear_gradient_paint("#132342", "#0A1324")],
            stroke=GOLD,
            stroke_w=1,
            stroke_opacity=0.60,
            radius=6,
            effects=raised_effects(GOLD, glow_alpha=0.22, glow_blur=14.0, top_highlight=0.08),
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "era chapter",
            f"RUNTIME LOG {log_num} · {chapter_label}",
            hdr_x + hdr_w - 284,
            hdr_y + 20,
            size=12,
            style="Bold",
            color=GOLD,
            width=258,
            align="center",
            letter_spacing="4%",
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "era date",
            date_head,
            hdr_x + 24,
            hdr_y + 12,
            size=34,
            style="Bold",
            color=INK,
            width=820,
            line_height="110%",
            effects=[drop_shadow("#000000", alpha=0.24, ox=0.0, oy=2.0, blur=4.0)],
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "era place",
            place_sub if place_sub else title,
            hdr_x + 24,
            hdr_y + 60,
            size=17,
            style="Bold",
            color=BLUE,
            width=1090,
            letter_spacing="2%",
        )
    )

    # Active Patch Panel
    ap_x, ap_y, ap_w, ap_h = 1196, 74, 684, 104
    active_patch_val = fields.get("active_patch")
    has_patch = bool(active_patch_val)
    cmds.append(
        rect_cmd(
            frame_id,
            "active patch panel",
            ap_x,
            ap_y,
            ap_w,
            ap_h,
            fills=panel_fill(),
            stroke=GOLD if has_patch else BLUE,
            stroke_w=1.5 if has_patch else 1,
            stroke_opacity=0.62 if has_patch else 0.42,
            radius=10,
            effects=panel_effects(),
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "active patch header",
            "Active Patch",
            ap_x + 20,
            ap_y + 12,
            size=13,
            style="Bold",
            color=GOLD if has_patch else DIM,
            letter_spacing="4%",
        )
    )
    cmds.append(
        rect_cmd(
            frame_id,
            "active patch console",
            ap_x + 18,
            ap_y + 36,
            ap_w - 36,
            54,
            fills=well_fill(),
            stroke=GOLD if has_patch else DIM,
            stroke_w=1.2 if has_patch else 0.8,
            stroke_opacity=0.55 if has_patch else 0.28,
            radius=6,
            effects=well_effects(),
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "active patch prompt",
            ">",
            ap_x + 32,
            ap_y + 51,
            size=18,
            style="Bold",
            color=GOLD if has_patch else DIM,
            opacity=1.0 if has_patch else 0.45,
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "active patch",
            active_patch_val if has_patch else " ",
            ap_x + 54,
            ap_y + 51,
            size=18,
            style="Bold",
            color=GOLD,
            width=ap_w - 86,
            opacity=1.0 if has_patch else 0.0,
        )
    )

    # -------------------------------------------------------------------------
    # 3. SYSTEM STRESS PANEL (x=40, y=190, w=562, h=194)
    # -------------------------------------------------------------------------
    st_x, st_y, st_w, st_h = 40, 190, 562, 194
    stress = fields.get("system_stress") or {}
    stress_lvl = stress.get("level")
    stress_reason = stress.get("reason") or ""
    is_crit = stress_lvl == "CRITICAL"
    st_fill, st_txt_col, st_border = badge_colors(stress_lvl)

    cmds.append(
        rect_cmd(
            frame_id,
            "stress pulse",
            st_x - 3,
            st_y - 3,
            st_w + 6,
            st_h + 6,
            fill=None,
            stroke=RED,
            stroke_w=2.5,
            stroke_opacity=0.55,
            radius=12,
            opacity=0.85 if is_crit else 0.0,
            effects=[drop_shadow(RED, alpha=0.30, ox=0.0, oy=0.0, blur=24.0)] if is_crit else None,
        )
    )
    cmds.append(
        rect_cmd(
            frame_id,
            "stress panel",
            st_x,
            st_y,
            st_w,
            st_h,
            fills=panel_fill(),
            stroke=RED if is_crit else BLUE,
            stroke_w=2 if is_crit else 1,
            stroke_opacity=0.72 if is_crit else 0.42,
            radius=10,
            effects=panel_effects(),
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "stress header",
            "System Stress (min: class resistance)",
            st_x + 20,
            st_y + 14,
            size=14,
            style="Bold",
            color=DIM,
        )
    )
    cmds.append(
        rect_cmd(
            frame_id,
            "stress badge halo",
            st_x + 17,
            st_y + 41,
            154,
            38,
            fill=RED,
            stroke=RED,
            stroke_w=1.5,
            stroke_opacity=0.35,
            radius=8,
            opacity=0.10 if is_crit else 0.0,
        )
    )
    cmds.append(
        rect_cmd(
            frame_id,
            "stress badge",
            st_x + 20,
            st_y + 44,
            148,
            32,
            fills=badge_gradient(st_fill),
            stroke=st_border,
            stroke_w=1.5,
            stroke_opacity=0.78,
            radius=6,
            opacity=1.0 if stress_lvl else 0.0,
            effects=raised_effects(
                st_fill,
                glow_alpha=0.38 if st_fill in (RED, GOLD) else 0.30,
                glow_blur=20.0,
                top_highlight=0.18,
            )
            if stress_lvl
            else None,
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "stress badge label",
            stress_lvl if stress_lvl else " ",
            st_x + 20,
            st_y + 51,
            size=15,
            style="Bold",
            color=st_txt_col,
            width=148,
            align="center",
            letter_spacing="4%",
            opacity=1.0 if stress_lvl else 0.0,
        )
    )
    reason_y = st_y + (86 if stress_lvl else 48)
    cmds.append(
        text_cmd(
            frame_id,
            "stress reason",
            stress_reason,
            st_x + 20,
            reason_y,
            size=15,
            style="Regular",
            color=INK,
            width=st_w - 40,
            line_height="140%",
        )
    )

    # -------------------------------------------------------------------------
    # 4. CAPITAL PANEL (x=618, y=190, w=562, h=194)
    # -------------------------------------------------------------------------
    cap_x, cap_y, cap_w, cap_h = 618, 190, 562, 194
    cap = fields.get("capital") or {}
    cap_lvl = cap.get("level")
    cap_reason = cap.get("reason") or ""
    cap_fill, cap_txt_col, cap_border = badge_colors(cap_lvl)

    cmds.append(
        rect_cmd(
            frame_id,
            "capital panel",
            cap_x,
            cap_y,
            cap_w,
            cap_h,
            fills=panel_fill(),
            stroke=BLUE,
            stroke_w=1,
            stroke_opacity=0.42,
            radius=10,
            effects=panel_effects(),
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "capital header",
            "Capital (max: extraction output)",
            cap_x + 20,
            cap_y + 14,
            size=14,
            style="Bold",
            color=DIM,
        )
    )
    cmds.append(
        rect_cmd(
            frame_id,
            "capital badge",
            cap_x + 20,
            cap_y + 44,
            172,
            32,
            fills=badge_gradient(cap_fill),
            stroke=cap_border,
            stroke_w=1.5,
            stroke_opacity=0.78,
            radius=6,
            opacity=1.0 if cap_lvl else 0.0,
            effects=raised_effects(
                cap_fill,
                glow_alpha=0.38 if cap_fill in (RED, GOLD) else 0.30,
                glow_blur=20.0,
                top_highlight=0.18,
            )
            if cap_lvl
            else None,
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "capital badge label",
            cap_lvl if cap_lvl else " ",
            cap_x + 20,
            cap_y + 51,
            size=15,
            style="Bold",
            color=cap_txt_col,
            width=172,
            align="center",
            letter_spacing="4%",
            opacity=1.0 if cap_lvl else 0.0,
        )
    )
    cap_reason_y = cap_y + (86 if cap_lvl else 48)
    cmds.append(
        text_cmd(
            frame_id,
            "capital reason",
            cap_reason,
            cap_x + 20,
            cap_reason_y,
            size=15,
            style="Regular",
            color=INK,
            width=cap_w - 40,
            line_height="140%",
        )
    )

    # -------------------------------------------------------------------------
    # 5. VARIABLES PANEL (x=40, y=396, w=1140, h=284)
    # -------------------------------------------------------------------------
    var_x, var_y, var_w, var_h = 40, 396, 1140, 284
    cmds.append(
        rect_cmd(
            frame_id,
            "variables panel",
            var_x,
            var_y,
            var_w,
            var_h,
            fills=panel_fill(),
            stroke=BLUE,
            stroke_w=1,
            stroke_opacity=0.42,
            radius=10,
            effects=panel_effects(),
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "variables header",
            "Variables Loaded / Deployed This Cycle",
            var_x + 20,
            var_y + 14,
            size=14,
            style="Bold",
            color=DIM,
        )
    )
    cmds.append(
        ellipse_cmd(
            frame_id,
            "legend deployed dot",
            var_x + var_w - 330,
            var_y + 18,
            10,
            10,
            fill=GOLD,
            effects=[drop_shadow(GOLD, alpha=0.50, ox=0.0, oy=0.0, blur=6.0)],
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "legend deployed text",
            "Deployed This Cycle",
            var_x + var_w - 314,
            var_y + 14,
            size=12,
            style="Bold",
            color=GOLD,
        )
    )
    cmds.append(
        ellipse_cmd(frame_id, "legend loaded dot", var_x + var_w - 150, var_y + 18, 10, 10, fill=DIM)
    )
    cmds.append(
        text_cmd(
            frame_id,
            "legend loaded text",
            "Variables Loaded",
            var_x + var_w - 134,
            var_y + 14,
            size=12,
            style="Regular",
            color=DIM,
        )
    )

    deployed_list = fields.get("variables_deployed") or []
    loaded_list = fields.get("variables_loaded") or []
    chip_groups = []

    cur_y = var_y + 44
    if deployed_list:
        cmds.append(
            text_cmd(
                frame_id,
                "variables deployed label",
                "Variables Deployed This Cycle",
                var_x + 20,
                cur_y,
                size=12,
                style="Bold",
                color=GOLD,
            )
        )
        dep_specs = create_chip_group(
            cmds,
            frame_id,
            deployed_list,
            x_start=var_x + 20,
            y_start=cur_y + 20,
            is_deployed=True,
        )
        chip_groups.append(("variables deployed label", cur_y, dep_specs))
        cur_y += 104

    if loaded_list:
        cmds.append(
            text_cmd(
                frame_id,
                "variables loaded label",
                "Variables Loaded",
                var_x + 20,
                cur_y,
                size=12,
                style="Bold",
                color=DIM,
            )
        )
        load_specs = create_chip_group(
            cmds,
            frame_id,
            loaded_list,
            x_start=var_x + 20,
            y_start=cur_y + 20,
            is_deployed=False,
        )
        chip_groups.append(("variables loaded label", cur_y, load_specs))

    # -------------------------------------------------------------------------
    # 6. EXECUTING FUNCTION PANEL (x=40, y=692, w=1140, h=128)
    # -------------------------------------------------------------------------
    ef_x, ef_y, ef_w, ef_h = 40, 692, 1140, 128
    exec_fn = fields.get("executing_function") or ""
    cmds.append(
        rect_cmd(
            frame_id,
            "executing function panel",
            ef_x,
            ef_y,
            ef_w,
            ef_h,
            fills=panel_fill(),
            stroke=BLUE,
            stroke_w=1,
            stroke_opacity=0.42,
            radius=10,
            effects=panel_effects(),
        )
    )
    cmds.append(
        rect_cmd(
            frame_id,
            "executing function accent",
            ef_x,
            ef_y,
            5,
            ef_h,
            fill=BLUE,
            radius=2,
            effects=[drop_shadow(BLUE, alpha=0.30, ox=0.0, oy=0.0, blur=10.0)],
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "executing function header",
            "Executing Function",
            ef_x + 20,
            ef_y + 12,
            size=14,
            style="Bold",
            color=DIM,
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "executing function",
            exec_fn,
            ef_x + 20,
            ef_y + 38,
            size=16,
            style="Bold",
            color=INK,
            width=ef_w - 40,
            line_height="138%",
        )
    )

    # -------------------------------------------------------------------------
    # 7. INTERFERENCE STATE PANEL (x=1196, y=190, w=684, h=630)
    # -------------------------------------------------------------------------
    ip_x, ip_y, ip_w, ip_h = 1196, 190, 684, 630
    ist = fields.get("interference_state") or {}
    ist_text = ist.get("text") or ""
    phi_range = ist.get("phi_load") or [0.0, 0.0]
    rho_range = ist.get("rho_tau") or [0.0, 0.0]
    rho_crash = ist.get("rho_tau_crash")

    cmds.append(
        rect_cmd(
            frame_id,
            "interference panel",
            ip_x,
            ip_y,
            ip_w,
            ip_h,
            fills=panel_fill(),
            stroke=BLUE,
            stroke_w=1,
            stroke_opacity=0.42,
            radius=10,
            effects=panel_effects(),
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "interference header",
            "Interference State (Φ_load, proximity to τ)",
            ip_x + 22,
            ip_y + 14,
            size=14,
            style="Bold",
            color=DIM,
        )
    )

    # --- Φ_load range bar on 0-1 ---
    bar_x = ip_x + 28
    bar_y = ip_y + 76
    bar_w = ip_w - 56  # 628 px
    bar_h = 22
    phi_low, phi_high = float(phi_range[0]), float(phi_range[1])
    phi_str = extract_range_str(ist_text, "phi") or f"[{phi_low:.2f}, {phi_high:.2f}]"

    cmds.append(
        text_cmd(
            frame_id,
            "phi title",
            "Φ_load",
            bar_x,
            ip_y + 46,
            size=16,
            style="Bold",
            color=INK,
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "phi bar label",
            phi_str,
            bar_x + 200,
            ip_y + 46,
            size=15,
            style="Bold",
            color=GOLD,
            width=bar_w - 200,
            align="right",
        )
    )
    cmds.append(
        rect_cmd(
            frame_id,
            "phi bar track",
            bar_x,
            bar_y,
            bar_w,
            bar_h,
            fills=well_fill(),
            stroke=DIM,
            stroke_w=1,
            stroke_opacity=0.32,
            radius=11,
            effects=well_effects(),
        )
    )
    fill_x = bar_x + phi_low * bar_w
    fill_w = max(12.0, (phi_high - phi_low) * bar_w)
    cmds.append(
        rect_cmd(
            frame_id,
            "phi bar",
            fill_x,
            bar_y,
            fill_w,
            bar_h,
            fills=[linear_gradient_paint("#ECC05E", "#D19A36", mid_hex=GOLD, mid_pos=0.5)],
            stroke=INK,
            stroke_w=1,
            stroke_opacity=0.80,
            radius=11,
            effects=data_glow_effects(GOLD, outer_alpha=0.42, outer_blur=18.0, core_alpha=0.30, core_blur=6.0)
            + [inner_shadow("#FFFFFF", alpha=0.22, ox=0.0, oy=1.0, blur=0.5)],
        )
    )
    cmds.append(
        text_cmd(frame_id, "phi tick 0", "0", bar_x, bar_y + 26, size=12, style="Bold", color=DIM)
    )
    cmds.append(
        text_cmd(
            frame_id,
            "phi tick 1",
            "1",
            bar_x + bar_w - 16,
            bar_y + 26,
            size=12,
            style="Bold",
            color=DIM,
            width=16,
            align="right",
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "phi low marker",
            f"{phi_low:.2f}",
            max(bar_x + 18, fill_x - 10),
            bar_y + 26,
            size=12,
            style="Bold",
            color=GOLD,
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "phi high marker",
            f"{phi_high:.2f}",
            min(bar_x + bar_w - 48, fill_x + fill_w - 14),
            bar_y + 26,
            size=12,
            style="Bold",
            color=GOLD,
        )
    )

    # --- ρ_τ dial with crash threshold τ = 1.0 ---
    dial_d = 232.0
    dial_r = dial_d / 2.0
    dial_cx = ip_x + ip_w / 2.0  # 1538
    dial_cy = ip_y + 300.0       # 490
    dial_x = dial_cx - dial_r
    dial_y = dial_cy - dial_r

    rho_low, rho_high = float(rho_range[0]), float(rho_range[1])
    rho_mid = 0.5 * (rho_low + rho_high)
    rho_str = extract_range_str(ist_text, "rho") or f"ρ_τ ∈ [{rho_low:.2f}, {rho_high:.2f}]"
    dial_col = RED if rho_high >= 1.0 else GOLD

    cmds.append(
        text_cmd(
            frame_id,
            "rho title",
            "ρ_τ = M(t)/τ",
            bar_x,
            ip_y + 134,
            size=16,
            style="Bold",
            color=INK,
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "rho dial label",
            rho_str,
            bar_x + 180,
            ip_y + 134,
            size=15,
            style="Bold",
            color=RED if (rho_high >= 1.0 or rho_crash is not None) else GOLD,
            width=bar_w - 180,
            align="right",
        )
    )

    def val_to_deg(v):
        return 135.0 + v * 225.0

    cmds.append(
        ellipse_cmd(
            frame_id,
            "rho dial track",
            dial_x,
            dial_y,
            dial_d,
            dial_d,
            fill="#081121",
            stroke=DIM,
            stroke_w=1.5,
            stroke_opacity=0.35,
            arc_start=135.0,
            arc_sweep=270.0,
            arc_inner=0.76,
            effects=well_effects(),
        )
    )
    cmds.append(
        ellipse_cmd(
            frame_id,
            "rho dial danger zone",
            dial_x,
            dial_y,
            dial_d,
            dial_d,
            fill=RED,
            arc_start=0.0,
            arc_sweep=45.0,
            arc_inner=0.76,
            opacity=0.32,
        )
    )
    rho_start_deg = val_to_deg(rho_low)
    rho_sweep_deg = max(5.0, (rho_high - rho_low) * 225.0)
    cmds.append(
        ellipse_cmd(
            frame_id,
            "rho dial",
            dial_x,
            dial_y,
            dial_d,
            dial_d,
            fill=dial_col,
            stroke=INK,
            stroke_w=1.0,
            stroke_opacity=0.82,
            arc_start=rho_start_deg,
            arc_sweep=rho_sweep_deg,
            arc_inner=0.70,
            effects=data_glow_effects(dial_col, outer_alpha=0.44, outer_blur=20.0, core_alpha=0.30, core_blur=6.0),
        )
    )

    cmds.append(
        rect_cmd(
            frame_id,
            "rho threshold",
            dial_cx + dial_r * 0.68,
            dial_cy - 3,
            dial_r * 0.40,
            6,
            fill=RED,
            radius=3,
            effects=data_glow_effects(RED, outer_alpha=0.44, outer_blur=14.0, core_alpha=0.30, core_blur=4.0),
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "rho threshold label",
            "τ = 1.0",
            dial_cx + dial_r + 12,
            dial_cy - 11,
            size=14,
            style="Bold",
            color=RED,
        )
    )

    mid_rad = math.radians(val_to_deg(rho_mid))
    needle_len = dial_r * 0.78
    tip_x = dial_cx + needle_len * math.cos(mid_rad)
    tip_y = dial_cy + needle_len * math.sin(mid_rad)
    needle_path = f"M {dial_cx:.1f} {dial_cy:.1f} L {tip_x:.1f} {tip_y:.1f}"
    cmds.append(
        vector_cmd(
            frame_id,
            "rho needle",
            needle_path,
            stroke=INK,
            stroke_w=3.5,
            effects=[
                drop_shadow("#000000", alpha=0.45, ox=0.0, oy=2.0, blur=4.0),
                drop_shadow(dial_col, alpha=0.45, ox=0.0, oy=0.0, blur=14.0),
            ],
        )
    )
    cmds.append(
        ellipse_cmd(
            frame_id,
            "rho needle tip",
            tip_x - 7,
            tip_y - 7,
            14,
            14,
            fill=dial_col,
            stroke=INK,
            stroke_w=2,
            stroke_opacity=0.88,
            effects=data_glow_effects(dial_col, outer_alpha=0.48, outer_blur=16.0, core_alpha=0.32, core_blur=5.0),
        )
    )

    has_crash = rho_crash is not None
    crash_deg = val_to_deg(1.09)
    crash_rad = math.radians(crash_deg)
    ctip_x = dial_cx + (dial_r * 0.86) * math.cos(crash_rad)
    ctip_y = dial_cy + (dial_r * 0.86) * math.sin(crash_rad)
    crash_path = f"M {dial_cx:.1f} {dial_cy:.1f} L {ctip_x:.1f} {ctip_y:.1f}"
    cmds.append(
        vector_cmd(
            frame_id,
            "rho crash needle",
            crash_path,
            stroke=RED,
            stroke_w=3.0,
            opacity=1.0 if has_crash else 0.0,
            effects=data_glow_effects(RED, outer_alpha=0.48, outer_blur=16.0, core_alpha=0.32, core_blur=5.0)
            if has_crash
            else None,
        )
    )
    cmds.append(
        ellipse_cmd(
            frame_id,
            "rho crash tip",
            ctip_x - 7,
            ctip_y - 7,
            14,
            14,
            fill=RED,
            stroke=INK,
            stroke_w=2,
            stroke_opacity=0.88,
            opacity=1.0 if has_crash else 0.0,
            effects=data_glow_effects(RED, outer_alpha=0.52, outer_blur=18.0, core_alpha=0.35, core_blur=6.0)
            if has_crash
            else None,
        )
    )
    cmds.append(
        rect_cmd(
            frame_id,
            "rho crash badge",
            dial_cx + dial_r - 10,
            dial_cy + 26,
            168,
            28,
            fills=[linear_gradient_paint("#381C2D", "#23111C")],
            stroke=RED,
            stroke_w=1.5,
            stroke_opacity=0.75,
            radius=6,
            opacity=1.0 if has_crash else 0.0,
            effects=raised_effects(RED, glow_alpha=0.35, glow_blur=18.0, top_highlight=0.10) if has_crash else None,
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "rho crash label",
            "ρ_τ>1.00 at crash",
            dial_cx + dial_r - 4,
            dial_cy + 32,
            size=12,
            style="Bold",
            color=RED,
            width=156,
            align="center",
            opacity=1.0 if has_crash else 0.0,
        )
    )
    cmds.append(
        rect_cmd(
            frame_id,
            "rho postpatch badge",
            ip_x + 24,
            dial_cy - 18,
            156,
            44,
            fills=[linear_gradient_paint("#142444", "#0A1324")],
            stroke=GOLD,
            stroke_w=1.2,
            stroke_opacity=0.65,
            radius=6,
            opacity=1.0 if has_crash else 0.0,
            effects=raised_effects(GOLD, glow_alpha=0.28, glow_blur=16.0, top_highlight=0.08) if has_crash else None,
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "rho postpatch label",
            "ρ_τ ∈ [0.60, 0.75]\npost-patch",
            ip_x + 30,
            dial_cy - 12,
            size=12,
            style="Bold",
            color=GOLD,
            width=144,
            align="center",
            line_height="120%",
            opacity=1.0 if has_crash else 0.0,
        )
    )

    cmds.append(
        ellipse_cmd(
            frame_id,
            "rho needle hub",
            dial_cx - 10,
            dial_cy - 10,
            20,
            20,
            fills=[linear_gradient_paint("#ECC05E", "#C68F2C", mid_hex=GOLD, mid_pos=0.5)],
            stroke=INK,
            stroke_w=2,
            stroke_opacity=0.88,
            effects=raised_effects(GOLD, glow_alpha=0.38, glow_blur=20.0, top_highlight=0.20),
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "rho center readout",
            f"[{rho_low:.2f}, {rho_high:.2f}]",
            dial_cx - 90,
            dial_cy + 56,
            size=18,
            style="Bold",
            color=RED if rho_high >= 1.0 else INK,
            width=180,
            align="center",
        )
    )

    # --- Verbatim Interference State Text Box ---
    it_x = ip_x + 20
    it_y = ip_y + 448
    it_w = ip_w - 40
    it_h = 162
    cmds.append(
        rect_cmd(
            frame_id,
            "interference text box",
            it_x,
            it_y,
            it_w,
            it_h,
            fills=well_fill(),
            stroke=BLUE,
            stroke_w=1,
            stroke_opacity=0.35,
            radius=8,
            effects=well_effects(),
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "interference text",
            ist_text,
            it_x + 16,
            it_y + 14,
            size=14,
            style="Regular",
            color=INK,
            width=it_w - 32,
            line_height="142%",
        )
    )

    # -------------------------------------------------------------------------
    # 8. RESULT / [POLICY] TICKER PANEL (x=40, y=832, w=1840, h=230)
    # -------------------------------------------------------------------------
    rp_x, rp_y, rp_w, rp_h = 40, 832, 1840, 230
    results = fields.get("results") or []
    warning_val = raw_fields.get("CRITICAL WARNING") or raw_fields.get("WARNING")
    warning_key = (
        "CRITICAL WARNING"
        if "CRITICAL WARNING" in raw_fields
        else ("WARNING" if "WARNING" in raw_fields else None)
    )
    result_header_title = "Policies Executed" if "Policies Executed" in raw_fields else "Result"

    cmds.append(
        rect_cmd(
            frame_id,
            "result panel",
            rp_x,
            rp_y,
            rp_w,
            rp_h,
            fills=panel_fill(),
            stroke=RED if warning_val else GOLD,
            stroke_w=1.5,
            stroke_opacity=0.72 if warning_val else 0.62,
            radius=10,
            effects=panel_effects(),
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "result header",
            result_header_title,
            rp_x + 20,
            rp_y + 12,
            size=14,
            style="Bold",
            color=GOLD,
        )
    )

    n_res = len(results)
    avail_y = rp_y + 36
    warn_reserve = 46 if (warning_val and n_res > 0) else 0
    avail_h = rp_h - 46 - warn_reserve
    gap_t = 5 if n_res >= 4 else 6
    slot_h = max(28.0, min(52.0, (avail_h - max(0, n_res - 1) * gap_t) / max(1, n_res)))

    for idx_t in range(4):
        t_num = idx_t + 1
        has_t = idx_t < n_res
        t_text = results[idx_t] if has_t else " "
        ty = avail_y + idx_t * (slot_h + gap_t)
        is_policy = t_text.startswith("[POLICY]")
        accent_col = GOLD if is_policy else BLUE
        t_font_sz = 13 if (n_res >= 4 or len(t_text) >= 180) else 14
        t_pad_y = max(4.0, (slot_h - t_font_sz - 4) / 2.0) if len(t_text) < 180 else 5.0

        cmds.append(
            rect_cmd(
                frame_id,
                f"ticker {t_num} bg",
                rp_x + 20,
                ty,
                rp_w - 40,
                slot_h,
                fills=well_fill(),
                stroke=accent_col,
                stroke_w=1,
                stroke_opacity=0.38,
                radius=6,
                opacity=1.0 if has_t else 0.0,
                effects=well_effects() if has_t else None,
            )
        )
        cmds.append(
            rect_cmd(
                frame_id,
                f"ticker {t_num} bar",
                rp_x + 20,
                ty,
                5,
                slot_h,
                fill=accent_col,
                radius=2,
                opacity=1.0 if has_t else 0.0,
                effects=[drop_shadow(accent_col, alpha=0.30, ox=0.0, oy=0.0, blur=8.0)] if has_t else None,
            )
        )
        cmds.append(
            text_cmd(
                frame_id,
                f"ticker {t_num}",
                t_text,
                rp_x + 36,
                ty + t_pad_y,
                size=t_font_sz,
                style="Bold" if is_policy else "Regular",
                color=INK,
                width=rp_w - 72,
                line_height="128%",
                opacity=1.0 if has_t else 0.0,
            )
        )

    warn_y = (rp_y + rp_h - 46) if n_res > 0 else (rp_y + 44)
    warn_h = 36 if n_res > 0 else 86
    cmds.append(
        rect_cmd(
            frame_id,
            "warning banner",
            rp_x + 20,
            warn_y,
            rp_w - 40,
            warn_h,
            fills=[linear_gradient_paint("#381B2C", "#24111D")],
            stroke=RED,
            stroke_w=1.6,
            stroke_opacity=0.75,
            radius=6,
            opacity=1.0 if warning_val else 0.0,
            effects=raised_effects(RED, glow_alpha=0.34, glow_blur=18.0, top_highlight=0.10) if warning_val else None,
        )
    )
    cmds.append(
        text_cmd(
            frame_id,
            "warning text",
            f"{warning_key}: {warning_val}" if warning_val else " ",
            rp_x + 36,
            warn_y + (9 if n_res > 0 else 18),
            size=13 if n_res > 0 else 16,
            style="Bold",
            color=RED,
            width=rp_w - 72,
            line_height="135%",
            opacity=1.0 if warning_val else 0.0,
        )
    )

    return cmds, chip_groups


def reflow_chips_from_shaped_bounds(client, frame_id, chip_groups):
    """Read shaped text widths via `node.get` and tighten every chip pill and row position."""
    if not chip_groups:
        return
    frame_info = client.execute("node.get", {"id": frame_id})
    by_name = {child["name"]: child for child in frame_info.get("children", [])}

    var_x = 40
    var_w = 1140
    x_start = var_x + 20
    max_width = var_w - 40
    row_h = 32
    gap_x = 10
    gap_y = 8

    adjust_cmds = []
    cur_section_y = 396 + 44

    for section_label_name, _init_y, specs in chip_groups:
        sec_node = by_name.get(section_label_name)
        if sec_node:
            adjust_cmds.append(
                {
                    "command": "node.set",
                    "params": {"ids": [sec_node["id"]], "x": x_start, "y": round(cur_section_y, 2)},
                }
            )
        cx = x_start
        cy = cur_section_y + 20
        for spec in specs:
            c_node = by_name.get(spec["chip"])
            l_node = by_name.get(spec["label"])
            d_node = by_name.get(spec["dot"]) if spec["dot"] else None
            if not c_node or not l_node:
                continue
            text_w = float(l_node.get("width", 40.0))
            text_h = float(l_node.get("height", 16.0))
            highlight = spec["highlight"]
            pad_left = 26.0 if highlight else 14.0
            pad_right = 16.0 if highlight else 14.0
            pill_w = max(48.0, min(max_width, math.ceil(text_w + pad_left + pad_right)))

            if cx + pill_w > x_start + max_width and cx > x_start:
                cx = x_start
                cy += row_h + gap_y

            adjust_cmds.append(
                {
                    "command": "node.set",
                    "params": {
                        "ids": [c_node["id"]],
                        "x": round(cx, 2),
                        "y": round(cy, 2),
                        "width": round(pill_w, 2),
                        "height": row_h,
                    },
                }
            )
            if d_node:
                adjust_cmds.append(
                    {
                        "command": "node.set",
                        "params": {
                            "ids": [d_node["id"]],
                            "x": round(cx + 11, 2),
                            "y": round(cy + (row_h - 8) / 2.0, 2),
                        },
                    }
                )
            adjust_cmds.append(
                {
                    "command": "node.set",
                    "params": {
                        "ids": [l_node["id"]],
                        "x": round(cx + pad_left, 2),
                        "y": round(cy + (row_h - text_h) / 2.0, 2),
                    },
                }
            )
            cx += pill_w + gap_x

        cur_section_y = cy + row_h + 14

    if adjust_cmds:
        client.batch(f"Reflow chips for frame {frame_id}", adjust_cmds)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=47831)
    args = parser.parse_args()

    t0 = time.monotonic()
    eras = json.loads(ERAS_JSON.read_text(encoding="utf-8"))
    if len(eras) != 7:
        raise RuntimeError(f"Expected 7 eras in {ERAS_JSON}, found {len(eras)}")

    client = FigCraftClient(port=args.port)
    client.activate_app()

    # Close any existing open tabs cleanly so we start from a fresh document
    docs = client.execute("doc.list")
    if isinstance(docs, list):
        for _ in docs:
            client.execute("file.close", {"force": True})

    client.execute("file.new", {"name": "YT02 Runtime Dashboard"})
    client.execute("page.rename", {"name": "SEG 11 · Runtime Dashboard"})
    client.execute("page.setBackground", {"color": PAGE_BG})

    frame_ids = []
    for idx, era in enumerate(eras):
        meta = ERA_META[idx]
        assert era["log"] == meta["log"], f"Log mismatch at {idx}: {era['log']} != {meta['log']}"
        fx = idx * 2040
        fy = 0
        res = client.execute(
            "node.create",
            {
                "type": "frame",
                "name": meta["frame"],
                "x": fx,
                "y": fy,
                "width": 1920,
                "height": 1080,
                "select": False,
                "props": {
                    "fills": [radial_vignette_paint()],
                    "clip": True,
                },
            },
        )
        fid = res["id"]
        frame_ids.append(fid)

        # Level 0 subtle anti-banding noise via effect.add + effect.set
        client.execute("effect.add", {"ids": [fid], "type": "noise"})
        client.execute(
            "effect.set",
            {
                "ids": [fid],
                "index": 0,
                "effect": noise_effect(alpha=0.02, density=0.22, size=0.5),
            },
        )

        cmds, chip_groups = build_era_commands(fid, idx, era, eras)
        client.batch(f"Build {meta['frame']}", cmds)
        reflow_chips_from_shaped_bounds(client, fid, chip_groups)
        print(f"Built {meta['frame']} (id={fid}, {len(cmds)} layers)")

    # Wire prototype flow and afterDelay + smartAnimate transitions across the 7 era frames
    client.execute(
        "proto.settings",
        {
            "device": "Custom size",
            "width": 1920,
            "height": 1080,
            "background": PAGE_BG,
        },
    )
    client.execute(
        "proto.flow.add",
        {
            "start": frame_ids[0],
            "name": "YT02 SEG 11 Runtime Log Flow",
        },
    )
    for i in range(len(frame_ids) - 1):
        client.execute(
            "proto.interaction.add",
            {
                "id": frame_ids[i],
                "trigger": {"type": "afterDelay", "ms": 3500},
                "action": {"type": "navigate", "dest": frame_ids[i + 1]},
                "transition": {"type": "smartAnimate"},
                "durationMs": 700,
                "easing": "easeInOut",
            },
        )

    client.execute("view.zoomFit", {})

    # Save native .figcraft files (both yt02_dashboard_depth.figcraft and yt02_dashboard.figcraft) and .fig export
    depth_figcraft_path = str(HERE / "yt02_dashboard_depth.figcraft")
    figcraft_path = str(HERE / "yt02_dashboard.figcraft")
    fig_path = str(HERE / "yt02_dashboard.fig")
    client.execute("file.saveAs", {"path": depth_figcraft_path})
    shutil.copy2(depth_figcraft_path, figcraft_path)
    fig_export = client.execute("file.export", {"format": "fig", "path": fig_path})
    print(f"Saved {depth_figcraft_path}, {figcraft_path}, and {fig_path} (fig export: {fig_export})")

    # Export 1920x1080 PNG for each era frame
    for idx, fid in enumerate(frame_ids):
        year = ERA_META[idx]["year"]
        out_png = HERE / f"era_{year}.png"
        client.execute(
            "file.export",
            {
                "ids": [fid],
                "format": "png",
                "size": {"by": "width", "value": 1920},
                "path": str(out_png),
            },
        )
        print(f"Exported {out_png.name} ({out_png.stat().st_size} bytes)")
        if year == "2010s":
            alias_png = HERE / "era_2010.png"
            shutil.copy2(out_png, alias_png)

    elapsed = time.monotonic() - t0
    unique_cmds = sorted(set(client.commands_used))
    print(
        f"Done in {elapsed:.2f}s. Total command invocations: {len(client.commands_used)} "
        f"({len(unique_cmds)} unique commands: {unique_cmds})"
    )


if __name__ == "__main__":
    main()

