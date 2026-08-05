# Architectural Analysis: `3b1b/videos`

**Repository:** https://github.com/3b1b/videos  
**Local clone:** `/Users/emmanuel/Documents/Theory/Redefining_racism/simulator/3b1b_videos`  
**Upstream library:** `3b1b/manim` (ManimGL, installed as `manimgl`)  
**Report date:** 2026-07-01

---

## 1. High-level Purpose and Audience

`3b1b/videos` is the private, content-oriented workspace that Grant Sanderson (3Blue1Brown) uses to author the explanatory mathematics animations published on the 3Blue1Brown YouTube channel. It is **not** a general-purpose animation library; it is a large, year-organized collection of per-video scene scripts, shared visual assets, and personal workflow tooling built on top of the `3b1b/manim` engine.

- **Purpose:** Produce finished, narrated video sequences by composing Manim scenes, reusing channel-specific characters (Pi creatures, end screens, logos), and staging rendered clips into editorial order.
- **Audience:** Primarily Sanderson and a small set of collaborators who already understand `3b1b/manim`. It is not packaged on PyPI, has no formal API surface, and contains hard-coded paths to Dropbox assets (see `custom_config.yml`).
- **License:** The underlying `3b1b/manim` library is MIT, but the content of this repository is CC BY-NC-SA 4.0.

Key evidence of this positioning is in `README.md` and `CLAUDE.md`:

- `README.md` states: "This project contains the code used to generate the explanatory math videos found on 3Blue1Brown."
- `CLAUDE.md` describes the repo as "the 3Blue1Brown video creation repository containing the Python code used to generate the mathematical animations and visualizations."

---

## 2. Directory Structure Overview

The top level is organized chronologically and thematically rather than by library module.

```
3b1b_videos/
├── _2015/ ... _2026/          # One directory per year; each holds video projects
│   └── <topic>/
│       ├── main.py             # Principal scene file(s)
│       ├── supplements.py      # Extra scenes, helpers
│       └── helpers.py          # Topic-specific utilities
├── custom/                     # Channel-specific reusable Manim extensions
│   ├── backdrops.py
│   ├── banner.py
│   ├── characters/
│   │   ├── pi_creature.py
│   │   ├── pi_creature_animations.py
│   │   └── pi_creature_scene.py
│   ├── drawings.py
│   ├── end_screen.py
│   ├── logo.py
│   └── opening_quote.py
├── once_useful_constructs/     # Legacy helper modules (graph_scene, linear_algebra, etc.)
├── outside_videos/             # External collaborations and one-offs
├── sublime_custom_commands/    # Sublime Text plugins for interactive workflow
├── custom_config.yml           # Manim configuration for this workspace
├── manim_imports_ext.py        # Universal import stub
└── stage_scenes.py             # Editorial staging helper
```

### Notable top-level folders

| Folder | Role |
|--------|------|
| `_YYYY/` | Raw scene source for every video, grouped by release year. Examples: `_2024/transformers/`, `_2026/print_gallery/`. |
| `custom/` | Extensions to `manimlib`. These are imported by every video file via `manim_imports_ext.py`. |
| `once_useful_constructs/` | Older helper code kept for reference; many modules are not actively maintained. |
| `outside_videos/` | Scenes for guest appearances and short-form content. |
| `sublime_custom_commands/` | Editor automation (run scene, checkpoint paste, record, skip, exit). |

---

## 3. Core Modules/Classes and Their Responsibilities

### 3.1 Universal import layer

`manim_imports_ext.py` is the single entry point for every scene file in the repo:

```python
from manimlib import *
from manimlib.mobject.svg.old_tex_mobject import *

from custom.backdrops import *
from custom.banner import *
from custom.characters.pi_creature import *
from custom.characters.pi_creature_animations import *
from custom.characters.pi_creature_scene import *
from custom.deprecated import *
from custom.drawings import *
from custom.end_screen import *
from custom.filler import *
from custom.logo import *
from custom.opening_quote import *
```

It pulls in the entire `manimlib` namespace plus the channel-specific customizations. Video files therefore begin with `from manim_imports_ext import *` rather than importing `manimlib` directly.

### 3.2 Base scene classes (from `manimlib`)

The repository relies on two core scene bases provided by `3b1b/manim`:

- **`manimlib.scene.scene.Scene`** (`manimlib/scene/scene.py`)
  - Owns the `Camera`, `CameraFrame`, `SceneFileWriter`, and the list of `mobjects`.
  - Implements the animation loop: `setup()` → `construct()` → `interact()` → `tear_down()`.
  - Key methods: `play()`, `wait()`, `add()`, `remove()`, `update_frame()`, `emit_frame()`.

- **`manimlib.scene.interactive_scene.InteractiveScene`** (`manimlib/scene/interactive_scene.py`)
  - Subclass of `Scene`.
  - Adds mouse/keyboard selection, dragging, resizing, copy/paste, and color palette.
  - Used as the base for most 3b1b scenes because it supports the interactive `-se` development workflow.

### 3.3 Channel-specific scene classes (from `custom/`)

- **`custom.characters.pi_creature_scene.PiCreatureScene`** (`custom/characters/pi_creature_scene.py`)
  - Extends `InteractiveScene`.
  - Manages one or more `PiCreature` instances, automatic blinking during `wait()`, and bubble/speech helpers: `say()`, `think()`, `introduce_bubble()`.
  - Subclasses: `MortyPiCreatureScene`, `TeacherStudentsScene`.

- **`custom.backdrops.VideoWrapper`** and **`custom.backdrops.Spotlight`** (`custom/backdrops.py`)
  - `VideoWrapper`: full-screen background + title + animated screen rectangle used to wrap embedded video clips.
  - `Spotlight`: simple title card with an animated boundary.

- **`custom.end_screen.PatreonEndScreen`** (`custom/end_screen.py`)
  - Renders the standard channel end screen with scrolling patron names loaded from `data/top_patrons.txt` and `data/hardcoded_patrons.txt`.
  - Subclass `SideScrollEndScreen` provides the modern layout variant.

- **`custom.logo.Logo`** (`custom/logo.py`)
  - A `VMobject` subclass that constructs the 3Blue1Brown logo (quarter-brown / quarter-blue eye).

### 3.4 Configuration system

Configuration is layered by `manimlib.config.initialize_manim_config()`:

1. `manimlib/default_config.yml` — library defaults.
2. `custom_config.yml` in the current working directory — workspace overrides.
3. `--config_file <path>` — optional user override.
4. CLI arguments from `manimlib.config.parse_cli()`.

`3b1b_videos/custom_config.yml` sets:

```yaml
camera:
  resolution: (3840, 2160)
  background_color: "#000000"
  fps: 30
text:
  font: "CMU Serif"
  alignment: "CENTER"
universal_import_line: "from manim_imports_ext import *"
embed:
  autoreload: True
ignore_manimlib_modules_on_reload: True
```

### 3.5 CLI entry points

The `3b1b/manim` package exposes two equivalent console scripts in `setup.cfg`:

```ini
[options.entry_points]
console_scripts =
    manimgl = manimlib.__main__:main
    manim-render = manimlib.__main__:main
```

`manimlib/__main__.py` defines `main()` and `run_scenes()`. `run_scenes()` creates a reusable `Window` (if preview is enabled), then repeatedly calls `manimlib.extract_scene.main()` and `scene.run()` until the user interrupts or the embedded IPython shell requests a reload.

---

## 4. How Rendering Works End-to-End

The rendering pipeline is implemented in `3b1b/manim`, consumed by the scripts in `3b1b/videos`.

### 4.1 Scene discovery and module loading

1. `manimgl <file> [scene_names] [flags]` invokes `manimlib.__main__:main()`.
2. `parse_cli()` builds an `argparse.Namespace` (`file`, `scene_names`, `-w`, `-s`, `-e`, etc.).
3. `run_scenes()` builds `scene_config` and `run_config` from `manim_config`.
4. `manimlib.extract_scene.main(scene_config, run_config)`:
   - Loads the user module via `ModuleLoader.get_module(run_config.file_name, run_config.is_reload)`.
   - Collects scene classes with `get_scene_classes(module)`.
   - If `-e <line_number>` is passed, `insert_embed_line_to_module()` injects `self.embed()` at that line.
   - Instantiates selected scenes with `scene_from_class()`.

### 4.2 Scene execution loop

`Scene.run()` (`manimlib/scene/scene.py:149`) orchestrates:

```python
self.virtual_animation_start_time = 0
self.real_animation_start_time = time.time()
self.file_writer.begin()
self.setup()
try:
    self.construct()
    self.interact()
except EndScene:
    pass
self.tear_down()
```

`Scene.construct()` is the user-defined method containing `self.play(...)` and `self.wait(...)` calls.

### 4.3 Animation playback

`Scene.play(*animations, run_time, rate_func, lag_ratio)`:

1. `prepare_animation()` converts `_AnimationBuilder` objects (from `mob.animate...`) into `Animation` instances.
2. `pre_play()` calls `update_skipping_status()` and `file_writer.begin_animation()`.
3. `begin_animations()` invokes `animation.begin()` on each animation and adds animated mobjects to the scene if absent.
4. `progress_through_animations()` iterates over time steps `t in get_animation_time_progression(animations)`:
   - `animation.update_mobjects(dt)` and `animation.interpolate(alpha)` update the scene graph.
   - `update_frame(dt)` advances updaters and renders.
   - `emit_frame()` writes the frame to disk if not skipping.
5. `finish_animations()` finalizes animations and cleans up.
6. `post_play()` calls `file_writer.end_animation()`.

### 4.4 Frame rendering (OpenGL/ModernGL)

`Camera` (`manimlib/camera/camera.py`) owns the ModernGL context:

- If a `Window` exists, it reuses the Pyglet-backed `window.ctx` (`moderngl_window`).
- If rendering headless, it creates a standalone context with `moderngl.create_standalone_context()`.
- Framebuffers:
  - `fbo_for_files` — multisampled off-screen buffer for file output.
  - `draw_fbo` — non-multisampled buffer for readback.
  - `window_fbo` — the Pyglet window's default framebuffer.

`Camera.capture(*mobjects)`:

1. Clears the active framebuffer with `background_rgba`.
2. Refreshes uniforms (`view` matrix, `frame_scale`, light position, camera position) via `refresh_uniforms()`.
3. Calls `mobject.render(ctx, uniforms)` for each render group.
4. Swaps buffers if a window is present.

`Scene.assemble_render_groups()` batches adjacent mobjects that share the same shader type, shader wrapper ID, and `z_index`, minimizing state changes.

### 4.5 Shader architecture

Mobjects render through `ShaderWrapper` (`manimlib/shader_wrapper.py`):

- Each `Mobject`/`VMobject` produces vertex data and a shader folder name (e.g., `quadratic_bezier/fill`).
- `ShaderWrapper` loads `vert.glsl`, optional `geom.glsl`, and `frag.glsl` from `manimlib/shaders/<shader_folder>/`.
- It compiles a ModernGL program, builds VBO/VAOs, binds textures, and dispatches draw calls (`render_primitive`, usually `TRIANGLE_STRIP`).
- Examples of shader pipelines in `manimlib/shaders/`:
  - `quadratic_bezier/fill/` — fills vector paths.
  - `quadratic_bezier/stroke/` — strokes vector paths.
  - `true_dot/` — circular dots with geometry expansion.
  - `surface/` — 3D surfaces.
  - `image/` — textured images.

### 4.6 File output

`SceneFileWriter` (`manimlib/scene/scene_file_writer.py`) handles all output:

- **Video:** When `write_to_movie=True`, it opens an FFmpeg pipe (`open_movie_pipe()`) feeding raw RGBA frames at the camera resolution/fps. It applies `vflip` and `eq=saturation=...:gamma=...` filters, then encodes with `libx264` / `yuv420p` by default.
- **Partial movies:** With `--subdivide`, each animation is written to a separate numbered file in a `partial_movie_directory`.
- **Last frame:** With `-s` (`--skip_animations`), `save_final_image()` writes a PNG.
- **Audio:** `add_sound()` and `add_audio_segment()` build a `pydub.AudioSegment`; on finish, `add_sound_to_video()` muxes it into the final video.

### 4.7 Interactive mode

With `-e <line_number>` (or `self.embed()` in a scene), `InteractiveSceneEmbed` launches an IPython terminal:

- The shell has shortcuts: `play`, `wait`, `add`, `remove`, `save_state`, `undo`, `redo`, `checkpoint_paste`, `reload`.
- `CheckpointManager.checkpoint_paste()` reads clipboard code, detects a leading comment as a checkpoint key, restores the scene state if that key was seen before, then runs the code.
- A custom input hook keeps the OpenGL window responsive while typing.

---

## 5. Key Dependencies and Why They Matter

Dependencies are declared in `3b1b/manim/requirements.txt` and `setup.cfg`. The video repo itself has no package manifest; it depends on the installed `manimgl` library.

| Dependency | Role in the pipeline |
|------------|----------------------|
| `moderngl` + `moderngl_window` | OpenGL context creation, framebuffers, shader programs, VAOs. The entire renderer is ModernGL-based. |
| `PyOpenGL` | Lower-level GL calls used in `Camera.blit()` (`glBindFramebuffer`, `glBlitFramebuffer`) and clip-plane toggling. |
| `pyglet` (via `moderngl_window`) | Interactive windowing, mouse/keyboard events, buffer swapping. |
| `screeninfo` | Multi-monitor window placement (`Window.get_monitor()`). |
| `numpy` | Vertex arrays, transformation matrices, color data, interpolation. |
| `Pillow` | Image readback (`Camera.get_image()`), texture loading, final PNG export. |
| `scipy` | Numerical operations in scenes (e.g., `_2024/manim_demo/lorenz.py` uses `scipy.integrate.solve_ivp`). |
| `matplotlib` | Colormap lookup (`plt.get_cmap`) and some plotting utilities. |
| `pydub` | Audio segment construction and mixing in `SceneFileWriter`. |
| `manimpango` | Text layout and font rendering for `Text` mobjects. |
| `svgelements` + `skia-pathops` | SVG parsing and path operations. |
| `sympy` | Symbolic math where needed. |
| `isosurfaces` + `mapbox-earcut` + `trimesh` + `pywavefront` | 3D surfaces, triangulation, and model loading. |
| `pyyaml` | Configuration parsing (`default_config.yml`, `custom_config.yml`). |
| `addict` | `Dict` objects used pervasively for nested configuration access. |
| `ipython` | Embedded interactive shell (`InteractiveSceneEmbed`). |
| `pyperclip` | Clipboard integration for `checkpoint_paste()`. |
| `tqdm` | Progress bars for rendering and name-list generation. |
| `fontTools` | Font introspection and manipulation. |
| `colour` | Color parsing in CLI/config. |
| `diskcache` | Caching (used by TeX compilation cache). |
| `ffmpeg` (external binary) | Encodes raw frames to MP4/GIF/ProRes. |
| LaTeX distribution (external) | Compiles `Tex()` strings via `manimlib/utils/tex_file_writing.py`. |

---

## 6. Notable Design Patterns, Plugin/Extension Architecture, and Testing

### 6.1 Design patterns

- **Scene graph:** `Mobject` forms a tree via `submobjects`/`parents`; `Scene` keeps a flat list of top-level mobjects and rebuilds render groups after each `add()`/`remove()` with `assemble_render_groups()`.
- **Builder pattern:** `mob.animate.shift(...)` returns an `_AnimationBuilder` that `prepare_animation()` converts into an `ApplyMethod` animation.
- **Template method:** `Scene.setup()`, `Scene.construct()`, `Scene.tear_down()` define extension points; video files override `construct()`.
- **State snapshots:** `Scene.save_state()` / `Scene.restore_state()` (via `SceneState`) support undo/redo and checkpoint paste.
- **Batching by shader compatibility:** `batch_by_property()` groups mobjects by `(type, shader_wrapper_id, z_index)` to reduce GPU state changes.

### 6.2 Extension architecture

The repo extends `manimlib` without modifying it:

- `manim_imports_ext.py` acts as a shared prelude, importing `custom.*` modules into the scene namespace.
- `custom/` contains domain-specific mobjects and scenes (Pi creatures, logo, end screens, backdrops).
- `custom_config.yml` overrides library defaults (4K resolution, CMU Serif font, Dropbox asset paths).
- `sublime_custom_commands/` provides editor-level workflow plugins that invoke `manimgl` and `checkpoint_paste()`.

There is no formal plugin API such as entry points or hooks; extensions are plain Python subclasses of `Mobject`, `Scene`, and `InteractiveScene`.

### 6.3 Testing approach

The repository has essentially no automated test suite:

- A search for `test_*.py` or `*_test.py` returns only `_2020/med_test.py`.
- `CLAUDE.md` explicitly notes: "No formal testing framework - scenes are tested through visual preview and rendering."
- Validation is manual: preview with `-p`, interactive iteration with `-se`, and final render with `-w`.

This is appropriate for a personal content-production repo where correctness is judged visually and by narrative timing rather than by assertions.

---

## 7. Practical Usage Examples

### 7.1 Install the underlying library

```bash
git clone https://github.com/3b1b/manim.git
cd manim
pip install -e .
```

This installs the `manimgl` and `manim-render` console scripts.

### 7.2 Run a minimal scene

The repo includes a small demo in `_2024/manim_demo/lorenz.py`:

```bash
cd /Users/emmanuel/Documents/Theory/Redefining_racism/simulator/3b1b_videos
manimgl _2024/manim_demo/lorenz.py
```

If more than one scene exists, `manimgl` lists them and prompts for selection. To run a specific class:

```bash
manimgl _2024/manim_demo/lorenz.py LorenzAttractor
```

### 7.3 Render to file

```bash
manimgl _2024/manim_demo/lorenz.py LorenzAttractor -w
```

Flags:

- `-w` / `--write_file` — encode to MP4.
- `-s` / `--skip_animations` — save the last frame as PNG.
- `-l`, `-m`, `--hd`, `--uhd` — 480p, 720p, 1080p, 4K.
- `--uhd -w` — render the scene at 4K to file.
- `-p` — preview in the interactive window without writing a file.

### 7.4 Interactive development

```bash
manimgl _2024/manim_demo/lorenz.py LorenzAttractor -se 45
```

This drops into an IPython shell at line 45 of `lorenz.py`. Inside the shell:

```python
# Paste some code into the clipboard, then run:
checkpoint_paste()

# Run without animating (instant state update):
checkpoint_paste(skip=True)

# Record the pasted code to disk:
checkpoint_paste(record=True)

# Reload the scene after editing the file:
reload()
```

### 7.5 Staging rendered scenes

`stage_scenes.py` creates symlinks for rendered clips in scene-definition order:

```bash
python stage_scenes.py _2024.manim_demo.lorenz
```

Note: the script currently has a hard-coded Dropbox path inside `stage_scenes()` (`~/Dropbox/3Blue1Brown/videos/2021/holomorphic_dynamics/videos`) and is illustrative of the editorial workflow rather than a turnkey tool.

### 7.6 Minimal custom scene

A file like `my_scene.py` inside `3b1b_videos/` would look like:

```python
from manim_imports_ext import *

class Hello(InteractiveScene):
    def construct(self):
        text = Tex(R"\text{Hello, ManimGL!}")
        self.play(Write(text))
        self.wait(2)
```

Run with:

```bash
manimgl my_scene.py Hello -w
```

---

## 8. Comparison Notes to Other Manim Repositories

### 8.1 `3b1b/videos` vs. `3b1b/manim`

| Aspect | `3b1b/manim` | `3b1b/videos` |
|--------|--------------|---------------|
| Role | The animation engine/library. | The content workspace built on the engine. |
| Installable | Yes (`pip install -e .` → `manimgl`). | No; clone-and-run with local imports. |
| Top-level directories | `manimlib/`, `docs/`, `example_scenes.py`. | `_YYYY/`, `custom/`, `once_useful_constructs/`. |
| CLI | `manimgl`, `manim-render`. | No CLI; calls `manimgl` on its `.py` files. |
| Configuration | `manimlib/default_config.yml`. | `custom_config.yml` + `manim_imports_ext.py`. |
| Tests | Minimal; mostly example scenes. | Essentially none. |

`3b1b/videos` is the canonical consumer of `3b1b/manim`; many features in the library (e.g., `InteractiveScene`, `checkpoint_paste`, 4K output) exist because this repo needs them.

### 8.2 `3b1b/manim` (ManimGL) vs. `ManimCommunity/manim` (ManimCE)

| Aspect | `3b1b/manim` (ManimGL) | `ManimCommunity/manim` (ManimCE) |
|--------|------------------------|----------------------------------|
| Renderer | OpenGL/ModernGL-first; real-time preview. | Historically Cairo-first; modern versions also use OpenGL via `manim.opengl`. |
| CLI name | `manimgl` | `manim` / `manimce` |
| Windowing | `moderngl_window` + Pyglet. | Also supports `moderngl_window`; older tutorials use PIL/Cairo preview. |
| Interactive mode | Deep IPython embed with `checkpoint_paste`, mouse selection, state snapshots. | Has `--embed` and interactive features, but the workflow is less central. |
| Configuration | YAML (`default_config.yml`, `custom_config.yml`). | Python-based config in `manim/_config/` plus `manim.cfg`. |
| Package manager | `setuptools` (`setup.cfg` + `setup.py`). | Poetry/`uv` (`pyproject.toml` + `uv.lock`). |
| Testing | Sparse. | Extensive pytest suite under `tests/`. |
| Community | Single maintainer (Grant Sanderson). | Large community with plugins, translations, extensive docs. |
| LaTeX class | `Tex()`, `TexText()` via `manimlib.mobject.svg.tex_mobject`. | `MathTex()`, `Tex()`; different API conventions. |
| Mobject base | `Mobject` → `VMobject` with shader-driven rendering. | Similar hierarchy but with separate OpenGL and Cairo mobject paths. |

### 8.3 Why `3b1b/videos` cannot use ManimCE directly

- It imports `manimlib` everywhere via `manim_imports_ext.py`.
- It relies on ManimGL-specific APIs: `InteractiveScene`, `self.frame.reorient(...)`, `checkpoint_paste()`, `GlowDot`, `TracingTail`, `fix_in_frame()`, and the shader-based `VMobject` internals.
- Its `custom/` modules subclass `manimlib` classes and use `manimlib.utils.rate_functions`, `manimlib.utils.space_ops`, etc.
- Configuration uses `custom_config.yml` parsed by `manimlib.config`, not ManimCE's config system.

### 8.4 Porting considerations

A scene like `_2024/manim_demo/lorenz.py` would require at minimum:

- Replacing `from manim_imports_ext import *` with ManimCE imports.
- Replacing `InteractiveScene` with ManimCE's `Scene` or interactive equivalent.
- Replacing `self.frame.reorient(...)` with ManimCE camera controls.
- Adapting `Tex()` usage (ManimCE uses `MathTex()` for math mode).
- Rewriting custom classes in `custom/` to inherit from ManimCE mobjects.

In practice, the repo is tightly coupled to `3b1b/manim` and should be treated as a ManimGL-only project.

---

## 9. Summary

`3b1b/videos` is a large, personal, content-first repository that turns mathematical ideas into finished YouTube videos using the `3b1b/manim` (ManimGL) engine. Its architecture is straightforward: year-organized scene scripts import a shared prelude (`manim_imports_ext.py`), reuse channel-specific classes from `custom/`, and render through an OpenGL/ModernGL pipeline driven by `Scene`, `InteractiveScene`, `Camera`, `ShaderWrapper`, and `SceneFileWriter`. There is no formal packaging, testing, or plugin system; iteration happens through interactive preview, checkpoint paste, and final FFmpeg-backed renders. The repo is not interchangeable with ManimCommunity and serves as the primary real-world validation of the `3b1b/manim` library.
