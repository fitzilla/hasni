# Heron Accountancy Solutions

Website for Heron Accountancy Solutions, chartered certified accountants in Belfast. Built with [Astro](https://astro.build) as a static site and hosted on GitHub Pages.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321/
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

## Search engines and AI tools

- Every page's title and meta description come from the page itself (`title` and `description` props). Write them for people, as they show in Google results.
- `src/layouts/Base.astro` adds schema.org data describing the business (address, phone, hours, team, services) to every page, built from `src/data/site.js`. Service pages add a `Service` entry.
- After each build, `integrations/seo-files.mjs` writes `sitemap.xml`, `robots.txt` and [`llms.txt`](https://llmstxt.org) from the built pages, so they never need hand-editing. Pages with `noindex` (the 404, old-URL redirects) are left out.

## Animation

Animations use [GSAP](https://gsap.com) with ScrollTrigger and SplitText (all free, from the public `gsap` npm package). They switch off for visitors who have "reduce motion" turned on. The official GSAP AI skills live in `.claude/skills/` so Claude Code (or other agents) write GSAP the right way in this repo — see `CLAUDE.md`.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

One-time setup: **Settings → Pages → Source → GitHub Actions**.

The site is served at `https://www.hasni.co.uk`. The custom domain is set under **Settings → Pages → Custom domain** (with Actions deploys, GitHub ignores a `CNAME` file). `hasni.co.uk` without www redirects to www.

### Domain and DNS

The domain is registered at GoDaddy, and its DNS is managed there. Only two records point at this site:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub Pages) |
| CNAME | `www` | `fitzilla.github.io` |

Every other record is email: Microsoft 365 (MX, SPF, autodiscover, lync, msoid, enterprise*) for Nigel and Julie's inboxes, and Resend for the contact form. Never change those when touching the website.

Addresses from the old WordPress site redirect to their new pages (see `redirects` in `astro.config.mjs`).

## To do

- Team photos: add `public/images/julie.jpg` and `nigel.jpg`, then swap the placeholders in `src/pages/index.astro`.
- Confirm years of experience and job titles with Julie and Nigel (copy came from the old site).
- Map image © OpenStreetMap contributors.
