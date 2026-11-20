// @ts-check
import { defineConfig } from 'astro/config';
import seoFiles from './integrations/seo-files.mjs';

// Served at https://www.hasni.co.uk from GitHub Pages. The custom domain is set in
// the repo's Settings → Pages (deploys run through GitHub Actions, so no CNAME file).
export default defineConfig({
  site: 'https://www.hasni.co.uk',
  trailingSlash: 'ignore',

  // sitemap.xml, robots.txt and llms.txt, generated from the built pages
  integrations: [seoFiles()],

  // Addresses from the old WordPress site, so Google results and bookmarks still land
  // somewhere useful. Pages that kept their address (tax-returns, cloud-accounting,
  // accounts-preparation, accounting-software-training, useful-links) need no entry.
  redirects: {
    '/contact-us': '/contact/',
    '/about-us': '/#about',
    '/about': '/#about',
    '/services': '/#services',
    '/vat-services-and-payroll': '/vat/',
    '/bookkeeping-and-company-secretarial': '/bookkeeping/',
    '/business-advice': '/business-start-up-advice/',
    '/it-advice-and-training': '/#services',
    '/blog': '/',
    '/temp-buttons-page': '/',
    '/uncategorized': '/',
    '/uncategorized/hello-world': '/',
    '/uncategorized/hello-world-2': '/',
    '/uncategorized/new-vat-rate-announced': '/',
    '/uncategorized/budget-2016-a-summary': '/',
    '/uncategorized/sme-business-advice': '/',
    '/uncategorized/taxation-report': '/',
    '/uncategorized/accounting-news': '/',
  },
});
