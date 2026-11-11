import { cpSync, existsSync, readFileSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import remarkDirective from 'remark-directive';
import { rehypeTables, remarkComponents } from './system/site/markdown.mjs';

// Serve Excalidraw's fonts from the Site itself (window.EXCALIDRAW_ASSET_PATH = '/excalidraw/').
const EXCALIDRAW_FONTS = 'node_modules/@excalidraw/excalidraw/dist/prod/fonts';
const excalidrawFonts = {
  name: 'excalidraw-fonts',
  hooks: {
    'astro:server:setup': ({ server }) => {
      server.middlewares.use((req, res, next) => {
        const match = req.url?.match(/^\/excalidraw\/fonts\/([^?#]+)/);
        const file = match && normalize(join(EXCALIDRAW_FONTS, decodeURIComponent(match[1])));
        if (!file || !file.startsWith(EXCALIDRAW_FONTS) || !existsSync(file)) return next();
        res.setHeader('Content-Type', file.endsWith('.woff2') ? 'font/woff2' : 'application/octet-stream');
        res.end(readFileSync(file));
      });
    },
    'astro:build:done': ({ dir }) => {
      cpSync(EXCALIDRAW_FONTS, new URL('excalidraw/fonts/', dir), { recursive: true });
    },
  },
};

export default defineConfig({
  srcDir: './system/site',
  publicDir: './system/site/public',
  outDir: './dist',
  markdown: { processor: unified({ remarkPlugins: [remarkDirective, remarkComponents], rehypePlugins: [rehypeTables] }) },
  integrations: [react(), excalidrawFonts],
  vite: { plugins: [tailwindcss()] },
});
