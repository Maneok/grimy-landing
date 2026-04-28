// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://grimy.fr',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss',
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules/react-dom')) return 'react-dom';
            if (id.includes('node_modules/react/') || id.includes('node_modules/react/jsx-runtime')) return 'react';
          },
        },
      },
    },
  },
  integrations: [react(), sitemap()],
});
