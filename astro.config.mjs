import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dealcostruzioni.it',
  output: 'server',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/api/') &&
        !page.includes('/404'),
      changefreq: 'monthly',
      priority: 0.7,
      i18n: {
        defaultLocale: 'it',
        locales: { it: 'it-IT' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: [],
    remotePatterns: [],
  },
  i18n: {
    defaultLocale: 'it',
    locales: ['it'],
  },
});
