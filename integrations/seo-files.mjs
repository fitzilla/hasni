// Writes sitemap.xml, robots.txt and llms.txt after each build, from the built pages
// themselves, so they always match what the site says and never need hand-editing.
//
// - sitemap.xml lists every page except ones marked noindex (the 404, old-URL redirects).
// - llms.txt (https://llmstxt.org) gives AI tools a plain summary: business details from the
//   schema.org data in Base.astro, then each page's own title and meta description.

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function readPage(root, pathname) {
  const clean = pathname.replace(/^\/|\/$/g, '');
  for (const file of [join(root, clean, 'index.html'), join(root, `${clean}.html`)]) {
    try {
      return await readFile(file, 'utf8');
    } catch {}
  }
  return null;
}

function meta(html) {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    try {
      const data = JSON.parse(m[1]);
      return Array.isArray(data) ? data : [data];
    } catch {
      return [];
    }
  });
  return { title: title && decode(title), description: description && decode(description), noindex, ld };
}

export default function seoFiles() {
  let site;
  return {
    name: 'seo-files',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site;
      },
      'astro:build:done': async ({ dir, pages, logger }) => {
        if (!site) throw new Error('seo-files needs `site` set in astro.config.mjs');
        const root = fileURLToPath(dir);
        const found = [];
        for (const { pathname } of pages) {
          const html = await readPage(root, pathname);
          if (!html) continue;
          const m = meta(html);
          if (m.noindex || !m.title) continue;
          const path = `/${pathname.replace(/^\/|\/$/g, '')}${pathname.replace(/^\/|\/$/g, '') ? '/' : ''}`;
          found.push({ url: new URL(path, site).toString(), path, ...m });
        }
        found.sort((a, b) => (a.path === '/' ? -1 : b.path === '/' ? 1 : a.path.localeCompare(b.path)));

        // sitemap.xml
        const today = new Date().toISOString().slice(0, 10);
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${found.map((p) => `  <url><loc>${xmlEscape(p.url)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
        await writeFile(join(root, 'sitemap.xml'), sitemap);

        // robots.txt: everyone (search engines and AI crawlers) may read everything
        await writeFile(join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site)}\n`);

        // llms.txt
        const home = found.find((p) => p.path === '/');
        const biz = home?.ld.find((d) => d['@id']?.endsWith('#business'));
        if (!biz) throw new Error('seo-files: no #business schema.org data on the home page');
        const serviceUrls = (biz.hasOfferCatalog?.itemListElement ?? []).map((o) => o.itemOffered.url);
        const title = (p) => (p.path === '/' ? 'Home' : p.title.split(' | ')[0]);
        const line = (p) => `- [${title(p)}](${p.url})${p.description ? `: ${p.description}` : ''}`;
        const servicePages = serviceUrls.map((u) => found.find((p) => p.url === u)).filter(Boolean);
        const otherPages = found.filter((p) => !servicePages.includes(p));
        const a = biz.address;
        const llms = [
          `# ${biz.name}`,
          '',
          `> ${biz.description}`,
          '',
          `- Phone: ${biz.telephone.replace(/^\+44 /, '0')} (${biz.telephone})`,
          `- Email: ${biz.email}`,
          `- Address: ${a.streetAddress}, ${a.addressLocality} ${a.postalCode}`,
          `- Office hours: ${biz.openingHoursSpecification.dayOfWeek[0]}–${biz.openingHoursSpecification.dayOfWeek.at(-1)}, ${biz.openingHoursSpecification.opens}–${biz.openingHoursSpecification.closes}`,
          `- Team: ${biz.employee.map((e) => `${e.name}, ${e.jobTitle}`).join('; ')}`,
          '',
          '## Services',
          '',
          ...servicePages.map(line),
          '',
          '## Other pages',
          '',
          ...otherPages.map(line),
          '',
        ].join('\n');
        await writeFile(join(root, 'llms.txt'), llms);

        logger.info(`sitemap.xml (${found.length} pages), robots.txt and llms.txt written`);
      },
    },
  };
}
