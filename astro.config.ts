import { defineConfig, fontProviders } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import remarkDirective from 'remark-directive';
import { rehypeTables, remarkComponents } from './system/site/markdown';

export default defineConfig({
  srcDir: './system/site',
  publicDir: './system/site/public',
  outDir: './dist',
  markdown: {
    processor: unified({ remarkPlugins: [remarkDirective, remarkComponents], rehypePlugins: [rehypeTables] }),
  },
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  fonts: [
    { provider: fontProviders.fontsource(), name: 'Inter', cssVariable: '--font-inter', weights: ['100 900'] },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: ['100 800'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Kalam',
      cssVariable: '--font-kalam',
      weights: [400],
      fallbacks: ['Comic Sans MS', 'PingFang SC', 'cursive'],
    },
  ],
});
