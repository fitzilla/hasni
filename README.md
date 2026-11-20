# Heron Accountancy Solutions

Website for Heron Accountancy Solutions, chartered certified accountants in Belfast. Built with [Astro](https://astro.build) as a static site and hosted on GitHub Pages.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321/hasni/
npm run build    # outputs to dist/
npm run preview
```

## Structure

```
src/
  data/site.js            Contact details, services list, social links
  layouts/Base.astro      <head>, header (with mobile menu), footer
  layouts/ServicePage.astro  Shared template for service sub-pages
  components/             Icon, CallButton, ContactSection
  scripts/contact-form.js Contact form validation and sending
  pages/                  index (one-page home) + one file per sub-page
  scripts/animations.js   GSAP animations (ScrollTrigger reveals, SplitText titles)
  styles/global.css       All styles, mobile-first
.claude/skills/           Official GSAP agent skills (for Claude Code / AI agents)
public/images/            Logo and office map
```

Phone number, email, address and hours live in `src/data/site.js` — change them there and every page updates.

## Contact form

The form on the home page and `/contact/` posts to the forms Worker on Cloudflare ([fitzilla/forms-worker](https://github.com/fitzilla/forms-worker)), which emails each message to accounts@hasni.co.uk from `forms@hasni.co.uk` through Resend, with Reply-To set to the visitor.

- The address the form posts to is `formEndpoint` in `src/data/site.js`. Where messages go, and which websites may use the form, live in the Worker's `src/sites.js`.
- To test against a local Worker, copy `.env.example` to `.env.development.local` and run the Worker alongside the site.
- hasni.co.uk's DNS has Resend records (`resend._domainkey`, `send`, `rsend`, `_dmarc`) next to the Microsoft 365 email records. Keep both sets if the DNS ever moves.

## Animation

Animations use [GSAP](https://gsap.com) with ScrollTrigger and SplitText (all free, from the public `gsap` npm package). They switch off for visitors who have "reduce motion" turned on. The official GSAP AI skills live in `.claude/skills/` so Claude Code (or other agents) write GSAP the right way in this repo — see `CLAUDE.md`.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

One-time setup: **Settings → Pages → Source → GitHub Actions**.

The site is served at `https://fitzilla.github.io/hasni/`.

### Moving to hasni.co.uk

1. In `astro.config.mjs`, set `site: 'https://www.hasni.co.uk'` and remove `base`.
2. Add `public/CNAME` containing `www.hasni.co.uk`.
3. Point the domain's DNS at GitHub Pages and add the domain under **Settings → Pages**.

## To do

- Team photos: add `public/images/julie.jpg` and `nigel.jpg`, then swap the placeholders in `src/pages/index.astro`.
- Confirm years of experience and job titles with Julie and Nigel (copy came from the old site).
- Map image © OpenStreetMap contributors.
