# webcloud — 3D Object Studio

A modern, high-performance scroll-scrubbed video landing page for **webcloud**. Built with pure vanilla HTML/CSS/JS in a single self-contained document with zero dependencies and no build step.

## ✨ Features

- **Frame-Accurate Video Scrubbing**: High-key all-intra encoded MP4 stream where every frame is a keyframe for lag-free seek times.
- **Cinematic Interpolation**: Continuous `requestAnimationFrame` render loop with `0.115` lerp easing factor for smooth navigation.
- **In-Memory Blob Buffering**: Fetches and decodes video into a buffered memory blob with fallback to progressive streaming.
- **Pure Editorial Aesthetics**: High-key paper palette (`#f2f0ec`), deep carbon ink (`#0d0c0b`), dynamic veil layering, and subtle inline SVG turbulence noise (`feTurbulence`) to prevent color banding.
- **Cross-Fading Narrative**: Timed cue ranges with dedicated dead zones to present content without clutter.
- **Fully Responsive**: Mobile-first typography scaling with `clamp()`, safe-area insets (`viewport-fit=cover`), touch target accessibility, and landscape viewport optimizations.

## 🚀 Deployment to Vercel

This repository is structured for zero-configuration, instant deployment to Vercel:

1. Import this repository into [Vercel](https://vercel.com).
2. Leave Framework Preset as **Other** (Static HTML).
3. Click **Deploy**.

## 🛠️ Local Preview

You can preview the site locally using any static file server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

Open `http://localhost:8000` or `http://localhost:3000` in your browser.
