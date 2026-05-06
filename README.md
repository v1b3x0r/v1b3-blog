# v1b3-blog

Personal Astro site for `v1b3x0r`.

The site is intentionally HTML-first: Astro renders static pages from Markdown content, with a small shared CSS file for layout, typography, and light/dark color variables.

## Structure

- `src/content/projects/*.md` - project entries and detail-page content
- `src/content.config.ts` - project collection schema
- `src/pages/index.astro` - homepage
- `src/pages/projects/[...slug].astro` - project detail route
- `src/styles/global.css` - minimal global styling and theme variables
- `docs/project-inventory.md` - human-readable project inventory notes

## Commands

```sh
npm run dev
npm run build
npm run preview
```

Astro builds this as a static site by default, so Vercel does not need an Astro adapter unless server rendering is added later.
