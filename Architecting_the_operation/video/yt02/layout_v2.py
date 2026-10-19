"""Layout helpers for YT02v2 manimgx scenes."""

import numpy as np

import manimgx as m

CAPTION_BAND_TOP = -2.9


def _iter_text_mobs(mob):
    if isinstance(mob, m.VGroup):
        for sub in mob.submobjects:
            yield from _iter_text_mobs(sub)
        return
    if isinstance(mob, (m.Text, m.Tex, m.MathTex, m.SingleStringMathTex)):
        opacity = mob.get_opacity() if hasattr(mob, "get_opacity") else 1.0
        if opacity > 0.01:
            yield mob


def _extents(mob):
    return mob.get_left()[0], mob.get_right()[0], mob.get_bottom()[1], mob.get_top()[1]


def _intersects(a, b, pad=0.06):
    al, ar, ab, at = _extents(a)
    bl, br, bb, bt = _extents(b)
    amin = np.array([al, ab, 0.0])
    amax = np.array([ar, at, 0.0])
    bmin = np.array([bl, bb, 0.0])
    bmax = np.array([br, bt, 0.0])
    return not (
        amax[0] + pad < bmin[0]
        or bmax[0] + pad < amin[0]
        or amax[1] + pad < bmin[1]
        or bmax[1] + pad < amin[1]
    )


def assert_no_overlap(scene, extra=(), min_y=CAPTION_BAND_TOP):
    """Raise if any on-screen text/math labels overlap or enter the caption band."""
    mobs = []
    for root in list(scene.mobjects) + list(extra):
        mobs.extend(_iter_text_mobs(root))
    for mob in mobs:
        ymin = mob.get_bottom()[1]
        if ymin < min_y:
            raise ValueError(f"Caption band violation y={ymin:.2f} < {min_y} ({mob})")
    for i, a in enumerate(mobs):
        for b in mobs[i + 1 :]:
            if _intersects(a, b):
                raise ValueError(f"Text overlap: {type(a).__name__} vs {type(b).__name__}")


def clamp_above_caption(mob, min_y=CAPTION_BAND_TOP + 0.08):
    if mob.get_bottom()[1] < min_y:
        mob.shift(m.UP * (min_y - mob.get_bottom()[1]))
    return mob
