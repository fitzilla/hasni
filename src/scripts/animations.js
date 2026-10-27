// Site animations: GSAP + ScrollTrigger + SplitText.
// Follows the official GSAP skills in .claude/skills (gsap-core, gsap-scrolltrigger,
// gsap-plugins, gsap-performance): transforms + autoAlpha only, matchMedia for
// reduced motion, ScrollTrigger.batch for reveals, SplitText with autoSplit/onSplit.
//
// Elements start hidden via CSS only when <html> has the `has-anim` class, which
// an inline script in Base.astro adds for users without prefers-reduced-motion.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: 'power3.out', duration: 0.8 });

// Keep in sync with the `.has-anim` hidden list in global.css
const REVEAL = [
  '.facts > div',
  '#services > .eyebrow',
  '#services > .h2',
  '.svc-list > li',
  '.band',
  '#about .split > *',
  '#team > .eyebrow',
  '#team > .h2',
  '.person',
  '.quotes-head',
  '.quote',
  '#contact .contact > div > *',
  '.map-card',
  '.page-main > *',
  '.page-aside',
  '.related',
  '.link-groups > section',
  '.cta-strip',
].join(', ');

const root = document.documentElement;
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Signal to the inline failsafe in Base.astro that animations are running
  window.__heronAnim = true;

  // --- Header / hero entrance -------------------------------------------
  const heroTitle = document.querySelector('.hero__title, .page-hero h1');

  const intro = gsap.timeline({ defaults: { duration: 0.9 } });

  intro.fromTo(
    '.hero .eyebrow, .page-hero .breadcrumb, .page-hero .eyebrow',
    { autoAlpha: 0, y: 12 },
    { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.6 },
  );

  if (heroTitle) {
    SplitText.create(heroTitle, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        gsap.set(heroTitle, { autoAlpha: 1 });
        const tween = gsap.fromTo(
          self.lines,
          { yPercent: 105 },
          { yPercent: 0, stagger: 0.09, duration: 1, ease: 'power4.out' },
        );
        intro.add(tween, 0.15);
        return tween;
      },
    });
  }

  intro.fromTo(
    '.hero__lead, .hero .btn-row > *, .page-hero .lead, .page-hero .chips',
    { autoAlpha: 0, y: 16 },
    { autoAlpha: 1, y: 0, stagger: 0.08 },
    0.45,
  );

  intro.fromTo(
    '.hero .contact-card',
    { autoAlpha: 0, y: 28 },
    { autoAlpha: 1, y: 0, duration: 1 },
    0.55,
  );

  // Photo backdrop: settle in gently, then drift slightly on scroll
  gsap.fromTo('.backdrop__img', { scale: 1.06 }, { scale: 1, duration: 2.4, ease: 'power2.out' });

  const band = document.querySelector('.hero-band, .page-hero');
  if (band) {
    gsap.to('.backdrop__img', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: band, start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  // --- Scroll reveals -----------------------------------------------------
  gsap.set(REVEAL, { autoAlpha: 0, y: 24 });

  ScrollTrigger.batch(REVEAL, {
    start: 'top 88%',
    once: true,
    interval: 0.1,
    onEnter: (elements) =>
      gsap.to(elements, { autoAlpha: 1, y: 0, stagger: 0.08, overwrite: true, clearProps: 'transform' }),
  });

  // Web fonts change line heights; recalculate trigger positions once loaded
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  return () => {
    window.__heronAnim = false;
  };
});

// If the user switches to reduced motion mid-visit, make sure nothing stays hidden
mm.add('(prefers-reduced-motion: reduce)', () => {
  root.classList.remove('has-anim');
});
