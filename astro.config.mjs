import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

// Дата последнего изменения страницы для sitemap (lastmod) — по истории git файлов, из которых она собрана.
// Google доверяет lastmod, только если дата честная, поэтому берём реальную дату правки содержимого.
const gitDate = (files) => {
  const dates = files.filter((f) => existsSync(f)).map((f) => {
    try { return execFileSync('git', ['log', '-1', '--format=%cI', '--', f], { encoding: 'utf8' }).trim(); } catch { return ''; }
  }).filter(Boolean);
  return dates.length ? dates.sort().at(-1) : undefined;
};
const sources = (path) => {
  const [section, slug] = path.split('/').filter(Boolean);
  if (!section) return ['src/pages/index.astro', 'src/data/home.json', 'src/data/site.json'];
  const collection = { kejsy: 'cases', uslugi: 'services', blog: 'blog' }[section];
  if (collection && slug) return [`src/content/${collection}/${slug}.md`];
  if (section === 'obo-mne') return ['src/pages/obo-mne.astro', 'src/data/about.json'];
  if (collection) return [`src/pages/${section}/index.astro`, `src/content/${collection}`];
  return [`src/pages/${section}.astro`];
};

export default defineConfig({
  site: 'https://tiunov.top',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // В sitemap только индексируемые страницы: «Политика» закрыта noindex
  integrations: [sitemap({
    filter: (page) => !page.includes('/admin/') && !page.includes('/privacy/'),
    serialize(item) {
      const lastmod = gitDate(sources(new URL(item.url).pathname));
      return lastmod ? { ...item, lastmod } : item;
    },
  })],
});
