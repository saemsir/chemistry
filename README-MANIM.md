# Saem Physics — 3b1b-inspired Manim redesign

This is a complete replacement homepage plus a Manim build pipeline.

## Install

Copy the contents of this folder into your `saemsir/saem` repository, replacing:

- `index.html`
- `style.css`
- `script.js`

and adding:

- `manim/saem_physics.py`
- `.github/workflows/render-manim.yml`

Then push to GitHub.

The first GitHub Actions run renders `SaemHero` and creates:

`assets/manim/saem-hero.mp4`

The browser does NOT run Python. Manim runs in GitHub Actions; GitHub Pages serves the resulting static MP4.

## Important

The Manim video is deliberately an explanatory animation rather than a generic background. The next scenes can cover:

- projectile motion
- Newton's laws
- work-energy
- circular motion
- angular momentum
- SHM
- waves
- electrostatics
- optics
- modern physics
