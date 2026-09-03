import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.crushculture.es',
  output: 'static',
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
