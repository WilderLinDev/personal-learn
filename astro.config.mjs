import { cpSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'astro/config';
import remarkDirective from 'remark-directive';
import { rehypeTables, remarkComponents } from './system/site/markdown.mjs';

const TOPICS = 'vault/topics';

// Serve and publish each topic's assets/ at /topics/<topic>/assets/.
const topicAssets = {
  name: 'topic-assets',
  hooks: {
    'astro:server:setup': ({ server }) => {
      server.middlewares.use((req, res, next) => {
        const match = req.url?.match(/^\/topics\/([^/]+)\/assets\/([^/?#]+)/);
        const file = match && join(TOPICS, match[1], 'assets', decodeURIComponent(match[2]));
        if (!file || !existsSync(file)) return next();
        res.end(readFileSync(file));
      });
    },
    'astro:build:done': ({ dir }) => {
      if (!existsSync(TOPICS)) return;
      for (const topic of readdirSync(TOPICS)) {
        const assets = join(TOPICS, topic, 'assets');
        if (existsSync(assets)) cpSync(assets, new URL(`topics/${topic}/assets/`, dir), { recursive: true });
      }
    },
  },
};

export default defineConfig({
  srcDir: './system/site',
  publicDir: './system/site/public',
  outDir: './dist',
  markdown: { remarkPlugins: [remarkDirective, remarkComponents], rehypePlugins: [rehypeTables] },
  integrations: [topicAssets],
});
