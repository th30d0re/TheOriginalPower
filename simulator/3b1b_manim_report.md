# Architectural Analysis: 3b1b/manim (ManimGL)

**Repository:** https://github.com/3b1b/manim  
**Local clone:** `/Users/emmanuel/Documents/Theory/Redefining_racism/simulator/3b1b_manim`  
**Package name:** `manimgl` (PyPI)  
**Version:** 1.7.2 (from `setup.cfg`)  
**Analyzed:** 2026-07-01

---

## 1. High-level purpose and audience

ManimGL is Grant Sanderson's (3Blue1Brown) personal animation engine for producing precise, programmatic explanatory-mathematics videos. Its central abstraction is a Python `Scene` whose `construct()` method declares a sequence of `Animation`s over `Mobject`s; the engine renders those declarations to a live OpenGL preview window or to a video/image file via FFmpeg.

- **Audience:** Python-literate video creators, especially those replicating or extending the 3Blue1Brown visual style. It is optimized for 3b1b's own production workflow (interactive preview, IPython embed, hot reload) rather than for absolute beginners.
- **Positioning:** This is the *original* repository. A community fork, `ManimCommunity/manim`, was created in 2020 with a different architecture (historically Cairo-first, now OpenGL-optional) and a stronger focus on stability, tests, and packaging. The README explicitly warns that install instructions are not interchangeable.

---

## 2. Directory structure overview

```
3b1b_manim/
├── manimlib/                 # Core library
│   ├── animation/            # Animation classes (Animation, Transform, Write, FadeIn, ...)
│   ├── camera/               # Camera, CameraFrame
│   ├── event_handler/        # Event dispatcher for interactive scenes
│   ├── mobject/              # Mobject classes
│   │   ├── svg/              # TeX/Text/SVG parsing
│   │   └── types/            # VMobject, PMobject, DotCloud, Surface, ImageMobject
│   ├── scene/                # Scene, InteractiveScene, SceneFileWriter, embed logic
│   ├── shaders/              # GLSL shader source
│   │   ├── quadratic_bezier/ # Stroke/fill/depth shaders for vector paths
│   │   ├── true_dot/         # Point-cloud dots
│   │   ├── surface/          # 3D parametric surfaces
│   │   ├── textured_surface/
│   │   ├── image/            # ImageMobject
│   │   ├── mandelbrot_fractal/
│   │   ├── newton_fractal/
│   │   └── inserts/          # Reusable GLSL snippets (#INSERT includes)
│   ├── utils/                # Bezier math, colors, paths, shaders helpers, sounds, TeX
│   ├── __init__.py           # Public API exports
│   ├── __main__.py           # CLI entry point
│   ├── config.py             # Global config construction and CLI parsing
│   ├── constants.py          # Coordinate/frame constants (derived from config)
│   ├── default_config.yml    # Default styling/directory/run configuration
│   ├── extract_scene.py      # Module loading and scene instantiation
│   ├── module_loader.py      # File import with reload support
│   ├── shader_wrapper.py     # ShaderWrapper, VShaderWrapper
│   ├── window.py             # OpenGL preview window (pyglet)
│   └── tex_templates.yml     # LaTeX templates
├── docs/                     # Sphinx documentation source
│   ├── source/
│   │   └── manim_example_ext.py   # Custom Sphinx directive for embedded examples
│   └── requirements.txt
├── example_scenes.py         # Canonical example scenes (OpeningManimExample, etc.)
├── logo/                     # Project logo assets
├── setup.cfg                 # Package metadata, deps, console_scripts
├── setup.py                  # Delegates to setuptools.setup()
├── pyproject.toml            # Build-system: setuptools + wheel
└── requirements.txt          # Runtime dependencies
```

---

## 3. Core modules/classes and responsibilities

### 3.1 Entry point and configuration

- `manimlib/__main__.py`
  - `main()`: prints version, parses CLI via `parse_cli()`, optionally clears cache, then calls `run_scenes()`.
  - `run_scenes()`: builds a reusable `Window` if preview is requested, then loops calling `manimlib.extract_scene.main(scene_config, run_config)`; catches `KillEmbedded` from IPython to implement hot reload.
- `manimlib/config.py`
  - `initialize_manim_config()`: merges `default_config.yml`, a local `custom_config.yml`, and an optional `--config_file`, then applies CLI overrides.
  - `parse_cli()`: full `argparse` definition for flags such as `-w`, `-s`, `-l/-m/--hd/--uhd`, `--fps`, `--transparent`, `--prerun`, `--embed`, etc.
  - `manim_config`: a global `addict.Dict` produced at import time and consumed across the library.

### 3.2 Scene lifecycle

- `manimlib/scene/scene.py` — `Scene`
  - `__init__()`: assembles `Camera`, `CameraFrame`, `SceneFileWriter`, mobject lists, and optional `Window`.
  - `run()`: `setup()` → `construct()` → `interact()` → `tear_down()`.
  - `play(*animations, ...)`: the main author-facing API; converts builders/animations, calls `pre_play()`, `begin_animations()`, `progress_through_animations()`, `finish_animations()`, `post_play()`.
  - `wait(duration, ...)`: pauses/scales frames.
  - `update_frame(dt, force_draw)`: advances time, runs mobject updaters, and calls `camera.capture()`.
  - `emit_frame()`: passes frame data to `SceneFileWriter.write_frame()`.
  - `assemble_render_groups()`: batches adjacent mobjects sharing the same shader ID/z-index for efficient GPU submission.

- `manimlib/scene/interactive_scene.py` — `InteractiveScene`
  - Extends `Scene` with keyboard/mouse selection, grabbing, resizing, color picking, and copy/paste. Used by the live preview workflow and by `BlankScene`.

- `manimlib/scene/scene_embed.py`
  - `InteractiveSceneEmbed`: launches an IPython shell inside the running scene so the author can inspect/manipulate state and call `reload()`.

### 3.3 Camera and window

- `manimlib/camera/camera.py` — `Camera`
  - Owns the ModernGL context (`self.ctx`), framebuffers (`fbo_for_files`, `draw_fbo`, `window_fbo`), and the `CameraFrame`.
  - `capture(*mobjects)`: clears, refreshes uniforms, and calls `mobject.render(ctx, uniforms)` for each render group; swaps buffers if a window exists.
  - `refresh_uniforms()`: uploads view matrix, frame scale, pixel size, camera/light positions.
  - `get_raw_fbo_data()`, `get_image()`, `get_pixel_array()`.

- `manimlib/camera/camera_frame.py` — `CameraFrame`
  - A special `Mobject` representing the virtual camera. Stores orientation as a quaternion, computes `view_matrix`, supports Euler-angle manipulation (`set_euler_angles`, `increment_theta`, etc.).

- `manimlib/window.py` — `Window`
  - Subclasses `moderngl_window.context.pyglet.window.Window`; handles pyglet events and forwards them to the scene (`on_key_press`, `on_mouse_press`, `on_resize`, etc.).
  - `pixel_coords_to_space_coords()`: maps mouse pixels to Manim's coordinate frame.

### 3.4 Mobjects and shaders

- `manimlib/mobject/mobject.py` — `Mobject`
  - Base mathematical object. Owns a structured `data` numpy array, shader uniforms, updaters, event listeners, and the submobject family tree.
  - `animate` property returns `_AnimationBuilder`, enabling `self.play(mob.animate.shift(LEFT))`.
  - `always` / `f_always` properties return updater builders.
  - `get_shader_wrapper(ctx)` → `ShaderWrapper`; `render(ctx, camera_uniforms)` delegates to it.
  - Decorators `@affects_data` and `@affects_family_data` mark operations that invalidate cached geometry.

- `manimlib/mobject/types/vectorized_mobject.py` — `VMobject`
  - Represents quadratic-Bézier vector paths with stroke and fill. Uses `VShaderWrapper` and the `quadratic_bezier` shader family.

- `manimlib/mobject/types/dot_cloud.py` — `DotCloud`
  - Uses the `true_dot` point-sprite shader; render primitive is `moderngl.POINTS`.

- `manimlib/shader_wrapper.py`
  - `ShaderWrapper`: compiles vertex/geometry/fragment shaders, manages VBO/VAOs, textures, uniforms, and the render call.
  - `VShaderWrapper`: specialized for vector strokes/fills; implements stencil-style fill rendering via an offscreen `fill_canvas`, with programs for stroke, fill, fill border, and depth.

### 3.5 File output

- `manimlib/scene/scene_file_writer.py` — `SceneFileWriter`
  - Spawns an FFmpeg rawvideo pipe in `open_movie_pipe()`, writes RGBA bytes in `write_frame()`, and closes/renames the temp file in `close_movie_pipe()`.
  - Supports subdivided output, final-frame PNG, transparent ProRes, GIF, and audio overlay via `pydub`.

### 3.6 Module loading

- `manimlib/extract_scene.py`
  - `main(scene_config, run_config)`: loads the user's module, finds scene classes, instantiates chosen ones.
  - `get_scene_classes()`: inspects module members for `Scene` subclasses or honors `SCENES_IN_ORDER`.
  - `scene_from_class()`: optionally runs a pre-pass via `compute_total_frames()` when `--prerun` is set.
  - `insert_embed_line_to_module()`: implements `-e <line>` by injecting `self.embed()` into the source.

- `manimlib/module_loader.py` — `ModuleLoader`
  - `get_module(file_name, is_during_reload)`: loads a file as a module; during reload, tracks imports and recursively reloads user-defined modules while skipping `manimlib` internals.

---

## 4. How rendering works end-to-end

### 4.1 CLI-to-scene dispatch

1. Console script `manimgl` or `manim-render` invokes `manimlib.__main__:main()` (`setup.cfg`).
2. `main()` calls `run_scenes()`.
3. `run_scenes()` constructs a `Window` if `run_config.show_in_window` is true.
4. `extract_scene.main(scene_config, run_config)` loads the user file via `ModuleLoader.get_module()` and returns instantiated `Scene` objects.
5. Each scene's `run()` method executes.

### 4.2 Inside `Scene.run()`

```
Scene.run()
  ├── setup()                    # subclass hook
  ├── construct()                # user-defined animation script
  │     ├── self.play(...)       # or self.wait(...)
  │     │     ├── prepare_animation(...)
  │     │     ├── begin_animations(...)
  │     │     ├── progress_through_animations(...)
  │     │     │     for t in time_progression:
  │     │     │         animation.update_mobjects(dt)
  │     │     │         animation.interpolate(alpha)
  │     │     │         self.update_frame(dt)
  │     │     │         self.emit_frame()
  │     │     └── finish_animations(...)
  │     └── ...
  ├── interact()                 # live preview loop if windowed
  └── tear_down()
        └── file_writer.finish()
```

### 4.3 Per-frame GPU path

1. `Scene.update_frame(dt)` calls `Camera.capture(*self.render_groups)`.
2. `Camera.capture()`:
   - `clear()` clears the active framebuffer.
   - `refresh_uniforms()` updates camera/light uniforms.
   - For each render group, calls `mobject.render(ctx, uniforms)`.
3. `Mobject.render()` obtains its `ShaderWrapper` and calls `pre_render()` (sets depth test, clip planes, textures), `update_program_uniforms(camera_uniforms)`, then `render()` which issues `vao.render()`.
4. If a window is active, `Camera.capture()` swaps buffers and optionally blits the file FBO to the window FBO.
5. `Scene.emit_frame()` calls `SceneFileWriter.write_frame(camera)`, which reads raw FBO bytes and pipes them to FFmpeg.

### 4.4 File output path

- `SceneFileWriter.begin()` opens a movie pipe (non-subdivided) or defers to `begin_animation()` (subdivided).
- `open_movie_pipe(file_path)` builds an FFmpeg command:
  ```
  ffmpeg -y -f rawvideo -s WxH -pix_fmt rgba -r fps -i - \
         -vf vflip,eq=saturation=...:gamma=... -an -loglevel error \
         -vcodec libx264 -pix_fmt yuv420p <temp_file>
  ```
- `write_frame()` writes `camera.get_raw_fbo_data()` (RGBA bytes) to `writing_process.stdin`.
- `close_movie_pipe()` flushes, waits, then `shutil.move(temp_file, final_file)`.
- If audio was added, `add_sound_to_video()` muxes a WAV segment into the final MP4.
- For `-s` (skip animations + write), `save_final_image()` writes a PNG via `PIL.Image.save()`.

### 4.5 Output formats

- Video: `.mp4` (H.264 / `libx264`, `yuv420p`), `.mov` (`prores_ks` for transparent), `.gif`.
- Image: `.png` final frame.
- Subdivided mode emits one clip per animation under `partial_movie_directory`.

---

## 5. Key dependencies and why they matter

| Dependency | Role |
|---|---|
| **moderngl / moderngl_window** | ModernGL wraps OpenGL 3.3+ for Python; `moderngl_window` provides the pyglet window/context plumbing. These replace the older Cairo pipeline in this GL-first version. |
| **PyOpenGL** | Used directly for FBO blitting (`gl.glBlitFramebuffer`) and clip-plane enable/disable in `Camera.blit()` and `ShaderWrapper.set_ctx_clip_plane()`. |
| **pyglet** | Underlying windowing/event backend inherited from `moderngl_window.context.pyglet.window.Window`. |
| **numpy / scipy** | Coordinate/linear-algebra workhorse; `scipy.spatial.transform.Rotation` drives `CameraFrame` orientation. |
| **Pillow** | Image loading for textures and image mobjects; final-frame PNG export. |
| **manimpango** | Pango-based text layout for `Text` mobjects; requires system Pango on Linux. |
| **pydub** | Audio segment construction/mixing for sound overlays. |
| **ffmpeg** | External binary for video encoding/muxing (not a Python dep but required). |
| **addict** | Provides the recursive `Dict` used for `manim_config`. |
| **pyyaml** | Loads `default_config.yml`, `custom_config.yml`, and `tex_templates.yml`. |
| **colour** | Parses background colors from CLI strings. |
| **ipython** | Powers `InteractiveSceneEmbed`; `KillEmbedded` is caught to implement reload. |
| **sympy / matplotlib** | Used by higher-level mobjects/functions where symbolic or plotting support is needed. |
| **tqdm** | Progress bars during rendering. |
| **screeninfo** | Detects monitor geometry for window placement. |
| **pyperclip** | Clipboard integration in `InteractiveScene`. |

---

## 6. Notable design patterns, plugin/extension architecture, and testing

### 6.1 Design patterns

- **Scene graph.** `Scene` holds a flat list of top-level `Mobject`s; each mobject recursively owns `submobjects`. `extract_mobject_family_members()` flattens the tree for rendering and animation.
- **Decorator-driven invalidation.** `@affects_data` and `@affects_family_data` mark mutators that change geometry so that bounding boxes and shader data are regenerated lazily.
- **Builder pattern for animations.** `Mobject.animate` returns `_AnimationBuilder`, which records chained method calls and builds an `ApplyMethod` animation inside `prepare_animation()`.
- **Builder pattern for updaters.** `Mobject.always` / `f_always` return `_UpdaterBuilder` / `_FunctionalUpdaterBuilder`.
- **Strategy pattern for shaders.** Each mobject declares `shader_folder` (e.g., `"true_dot"`, `"quadratic_bezier"`, `"surface"`) and a `data_dtype`; `ShaderWrapper` loads the matching GLSL triplet.
- **Global config object.** `manim_config` is an `addict.Dict` constructed at import; CLI and YAML layers merge into it.
- **Hot-reload loop.** `run_scenes()` catches `KillEmbedded` raised when the user calls `reload()` in the embedded IPython shell, then reconstructs the scene while reusing the same `Window`.

### 6.2 Extension architecture

- **Custom config layer.** Any directory can provide `custom_config.yml`; it is merged with `default_config.yml` to override directories, colors, default sizes, key bindings, etc.
- **Shader folders.** Adding a new mobject type often only requires a new subdirectory under `manimlib/shaders/` with `vert.glsl`, `frag.glsl`, and optionally `geom.glsl`, plus `#INSERT` snippets from `manimlib/shaders/inserts/`.
- **Sphinx directive.** `docs/source/manim_example_ext.py` defines a `manim-example` reStructuredText directive for embedding rendered scenes in documentation.
- **No formal plugin hook system.** Extensibility is by subclassing `Scene`, `Mobject`, `VMobject`, `Animation`, and by adding new shader folders, not by a package-level plugin manager.

### 6.3 Testing approach

- The repository does **not** ship a conventional `tests/` directory or unit-test suite.
- Validation is primarily example-driven: `example_scenes.py` and the 3b1b video repository act as integration tests.
- CI (`.github/workflows/`) is limited to:
  - `docs.yml`: builds and deploys Sphinx docs on `docs/**` changes.
  - `publish.yml`: builds wheels for Python 3.7–3.10 and uploads to PyPI on release.
- No automated rendering regression tests or pytest workflows are present. This reflects the project's origin as a personal toolchain rather than a community-distribution library.

---

## 7. Practical usage examples

### 7.1 Run the canonical example

```bash
# Preview in a window
manimgl example_scenes.py OpeningManimExample

# Render to video
manimgl example_scenes.py OpeningManimExample -w

# Save the final frame as a PNG
manimgl example_scenes.py OpeningManimExample -s

# Render and open the result
manimgl example_scenes.py OpeningManimExample -o

# Skip ahead to the 3rd animation
manimgl example_scenes.py OpeningManimExample -n 3
```

### 7.2 Minimal custom scene

Create `minimal.py`:

```python
from manimlib import *

class MinimalExample(Scene):
    def construct(self):
        circle = Circle()
        circle.set_fill(BLUE, opacity=0.5)
        circle.set_stroke(WHITE, width=2)
        self.play(ShowCreation(circle))
        self.play(circle.animate.scale(2).shift(UP))
        self.wait()
```

Run:

```bash
manimgl minimal.py MinimalExample
```

### 7.3 Using the alternate entry point

`manim-render` is an alias for the same `main()` function:

```bash
manim-render minimal.py MinimalExample -w --hd
```

### 7.4 Key CLI flags

| Flag | Effect |
|---|---|
| `-w` / `--write_file` | Write animation to a movie file. |
| `-o` / `--open` | Write and open the output. |
| `-s` / `--skip_animations` | Render only the final frame as an image. |
| `-l`, `-m`, `--hd`, `--uhd` | 480p, 720p, 1080p, 4K presets. |
| `-n N` or `-n N,M` | Start (and optionally end) at animation index. |
| `-e LINE` | Insert `self.embed()` at the given source line. |
| `--prerun` | Do a skip pass to count total frames for a progress bar. |
| `--transparent` | Output `.mov` with ProRes and alpha. |
| `--fps N` | Override frame rate. |

---

## 8. Comparison notes with other Manim repositories

### 8.1 3b1b/manim vs. ManimCommunity/manim

| Aspect | 3b1b/manim (ManimGL) | ManimCommunity/manim |
|---|---|---|
| **PyPI name** | `manimgl` | `manim` |
| **Primary renderer** | OpenGL 3.3+ via ModernGL | Originally Cairo; OpenGL/ManimGL renderer added later as an optional backend |
| **Preview model** | Live OpenGL window with IPython embed and hot reload | File-based rendering plus optional Jupyter / OpenGL preview |
| **Config system** | YAML + global `addict.Dict` (`manim_config`) | Python classes (`ManimConfig`) with CLI integration |
| **Scene base** | `Scene` / `InteractiveScene` | `Scene` with plugin hooks and more config-driven behavior |
| **Testing** | No formal test suite | `pytest` test suite, CI for tests, docs, and release |
| **Maturity target** | Personal production tool for 3b1b videos | Community-driven, stable public API, semantic versioning |
| **Extension model** | Subclassing + shader folders + custom YAML | Plugin system, community-contributed plugins, more formal hooks |

### 8.2 3b1b/manim vs. 3b1b/videos

- `3b1b/manim` is the reusable engine.
- `3b1b/videos` contains the actual scene scripts for 3Blue1Brown episodes and a production-specific `custom_config.yml`. Older video code may not run unchanged against the latest `manimgl`.

### 8.3 Architectural trade-offs

- **Performance:** ManimGL's GPU-centric design yields faster preview iteration than Cairo-based rendering, especially for 3D and particle systems.
- **Correctness vs. convenience:** Because the project is tuned for one author's workflow, breaking changes are acceptable; downstream users pin versions or follow the community fork.
- **Shader complexity:** Vector fills use a custom stencil-style multi-pass approach (`VShaderWrapper.fill_canvas`) instead of relying on Cairo's rasterizer, giving consistent GPU rendering but adding GLSL surface area.

---

## Summary

ManimGL is a tight, GPU-first animation engine built around `Scene.play()`, ModernGL shaders, and an interactive preview loop. Its architecture is intentionally flat and personal: a global YAML-driven config, a direct `Camera → Mobject → ShaderWrapper → OpenGL` render path, and file output via an FFmpeg rawvideo pipe. The codebase is small enough to be read end-to-end and is extended primarily through subclassing and custom GLSL shader folders, not through a plugin framework. The absence of a formal test suite and the presence of hot-reload/IPython tooling confirm its identity as a video author's integrated development environment rather than a general-purpose library.
