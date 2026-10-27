# Heron Accountancy Solutions — notes for Claude

Static Astro site deployed to GitHub Pages (`base: /hasni`). See README.md for structure and deploy.

## Animation

- Animations use **GSAP** (`gsap` npm package — all plugins are free, no auth token). Code lives in `src/scripts/animations.js`, loaded from `Base.astro`.
- The official GSAP agent skills are in `.claude/skills/gsap-*` (from github.com/greensock/gsap-skills, MIT). Follow them for any animation work: `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins` (SplitText), `gsap-performance`.
- House rules for this site:
  - Keep motion subtle and professional: short fades/rises, line reveals on page titles, gentle photo parallax. No bounce/elastic eases, no pinning, no scroll-jacking.
  - Animate transforms and `autoAlpha` only.
  - Everything runs inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`; reduced-motion visitors get no animation.
  - Elements start hidden only under `html.has-anim` (set by an inline script in `Base.astro`, with a 3s failsafe). If you add a new animated selector, add it to **both** the `REVEAL` list in `animations.js` and the `.has-anim :is(...)` list in `global.css`.
- Internal links must go through `url()` from `src/lib/url.js` so they respect the base path.
