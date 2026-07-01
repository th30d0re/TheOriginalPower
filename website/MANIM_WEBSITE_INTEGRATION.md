# Manim Website Integration

This document describes how the Manim-rendered UEF equation animations were integrated into the React + TypeScript + Vite website.

## What Was Added

### Static Video Assets

All rendered Manim MP4 files were copied from `outputs/manim_animations/rendered/` into `website/public/animations/`:

- `ComplexWage.mp4`
- `DrivenHarmonicOscillator.mp4`
- `InterferenceIntensity.mp4`
- `MaxwellEquations.mp4`
- `PhaseKick.mp4`
- `SnellsLaw.mp4`
- `UnifiedLorentzForce.mp4`

Vite serves files in `public/` as static assets at the root path, so each video is available at `/animations/<FileName>.mp4` in both development and production.

### New Components

- `website/src/components/visualizations/ManimEquationGallery.tsx` — A responsive gallery that lists every Manim animation with a title and caption. Each video is rendered with an HTML5 `<video>` element set to `controls autoPlay muted loop playsInline` for a continuous, gallery-style experience.
- `website/src/components/visualizations/PhasorResonance.tsx` — A self-contained, Manim-style math visual built with SVG and `requestAnimationFrame`. It shows a rotating complex-plane phasor (`W = ψₘ + jψₛ`) alongside a driven harmonic oscillator resonance curve. Interactive sliders control drive frequency and damping.
- `website/src/App.tsx` — Updated to register the `/animations` route and render a persistent top navigation bar with links to Story, Dashboard, Arbitrage, Interference Engine, and Animations.
- `website/src/App.css` — Styles for the navigation bar, including a transparent overlay mode for the full-screen Interference Engine route.

## How to Run

From the `website/` directory:

```bash
npm install      # if dependencies are not already present
npm run dev      # start the Vite development server
npm run build    # type-check and build the production bundle
npm run preview  # preview the production build locally
```

## Build Status

The site builds successfully with `npm run build`. TypeScript type-checking passes and Vite emits the production bundle, including the copied animations in `dist/animations/`.

## Notes

- Videos autoplay muted to comply with browser autoplay policies.
- No additional heavy dependencies were added; the native math visual uses only React and SVG.
- The navigation bar renders as a sticky header on most routes and as a transparent overlay on `/interference-engine` so it does not obscure the full-screen 3D canvas.
