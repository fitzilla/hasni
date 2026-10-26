// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://fitzilla.github.io/hasni/
// When a custom domain (e.g. hasni.co.uk) is pointed at Pages:
//   1. set `site` to 'https://www.hasni.co.uk'
//   2. delete `base`
//   3. add public/CNAME containing the domain
export default defineConfig({
  site: 'https://fitzilla.github.io',
  base: '/hasni',
  trailingSlash: 'ignore',
});
