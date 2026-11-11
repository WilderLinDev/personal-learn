import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import remarkDirective from 'remark-directive';
import { rehypeTables, remarkComponents } from './system/site/markdown.mjs';

export default defineConfig({
  srcDir: './system/site',
  publicDir: './system/site/public',
  outDir: './dist',
  markdown: { processor: unified({ remarkPlugins: [remarkDirective, remarkComponents], rehypePlugins: [rehypeTables] }) },
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
