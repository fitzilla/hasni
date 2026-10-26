// Prefix internal links with the configured base path (e.g. /hasni on GitHub Pages).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path = '') {
  const clean = String(path).replace(/^\//, '');
  if (clean === '' ) return `${BASE}/`;
  if (clean.startsWith('#')) return `${BASE}/${clean}`;
  return `${BASE}/${clean}`;
}
