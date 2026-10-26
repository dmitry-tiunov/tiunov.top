import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tiunov.top',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // В sitemap только индексируемые страницы: «Политика» закрыта noindex
  integrations: [sitemap({ filter: (page) => !page.includes('/admin/') && !page.includes('/privacy/') })],
});
