import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.crushculture.es',
  output: 'static',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-GB', es: 'es-ES', fr: 'fr-FR', ru: 'ru-RU' },
      },
      filter: (page) => !/\/404$/.test(page),
    }),
  ],
  trailingSlash: 'never',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  build: {
    inlineStylesheets: 'auto',
    format: 'file',
  },
  image: {
    // Real venue photography from crushculture.es (client-owned assets)
    domains: [],
  },
});
