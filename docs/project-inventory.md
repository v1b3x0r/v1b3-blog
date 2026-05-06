# Project Inventory

This file is a human-readable mirror of the Astro project content collection.
The source of truth for rendered pages lives in `src/content/projects/*.md`.

## Featured

- MDS
- World Interpreter Engine
- HomeLog / Energy Watchdog
- WireMesh
- DreamFlow

## Current Site Shape

- `/` is the only main page.
- `/projects/[slug]/` renders detail pages from the `projects` content collection.
- Theme follows the visitor's system preference through CSS variables.

## Notes

- Keep the site HTML-first.
- Add Tailwind only if repeated layout primitives become painful.
- Keep project metadata in frontmatter before rendering it in pages.
