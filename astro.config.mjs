// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import { execFileSync } from 'node:child_process';

function bakeGitIntegration() {
  return {
    name: 'bake-git',
    hooks: {
      'astro:config:setup': () => {
        try {
          execFileSync('node', ['scripts/bake-git.mjs'], { stdio: 'inherit' });
        } catch {
          console.warn('[bake-git] failed, continuing with empty data');
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel({
    edgeMiddleware: false,
    imageService: false,
  }),
  integrations: [react(), bakeGitIntegration()],
  vite: {
    optimizeDeps: {
      exclude: ['suncalc'],
    },
  },
});
