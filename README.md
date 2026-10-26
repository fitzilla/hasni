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
  components/             Icon, CallButton
  pages/                  index (one-page home) + one file per sub-page
  styles/global.css       All styles, mobile-first
public/images/            Logo and office map
```

Phone number, email, address and hours live in `src/data/site.js` — change them there and every page updates.

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
