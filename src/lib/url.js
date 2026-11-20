// Prefix internal links with the configured base path. The site now lives at the domain
// root (base "/"), so this is a no-op, but keep using url() so a base path can come back.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path = '') {
  const clean = String(path).replace(/^\//, '');
  if (clean === '' ) return `${BASE}/`;
  if (clean.startsWith('#')) return `${BASE}/${clean}`;
  return `${BASE}/${clean}`;
}
