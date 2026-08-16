// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Absolute URLs for og:image and canonical. The apex 307s to www, so www is
  // the canonical host — an og:image pointing at the redirecting host makes
  // some scrapers give up rather than follow.
  site: 'https://www.v1b3.io',
  output: 'static',
  adapter: vercel({
    edgeMiddleware: false,
    imageService: false,
  }),
  integrations: [react()],
});
