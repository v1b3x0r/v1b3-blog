# Project Inventory

This file is a human-readable mirror of the Astro project content collection.
The source of truth for rendered pages lives in `src/content/projects/*.md`.

## Featured

- MDS
- World Interpreter Engine
- HomeLog
- WireMesh
- DreamFlow
- hi-introvert
- DreamLink
- UICP
- Squish

## Current Site Shape

- `/` is the only main page.
- `/projects/[slug]/` renders detail pages from the `projects` content collection.
- Theme follows the visitor's system preference through CSS variables.

## Notes

- Keep the site HTML-first.
- Add Tailwind only if repeated layout primitives become painful.
- Keep project metadata in frontmatter before rendering it in pages.
- Related project bridges use `relatedProjects` frontmatter with the related slug plus a short relationship note; the detail template resolves project titles from the collection.
- MDS and HomeLog now form a reciprocal bridge: MDS is the declarative ontology / living-materials engine, while HomeLog is the production access system that translates ontology into human, space, membership, role, pass, and event memory.
- MDS now follows its eight-layer Field Guide and keeps issues #18–20 explicit as research questions about preservation, ritual, and unresolved world knowledge rather than shipped API claims.
- The future runtime vision is explicit but not current-state overclaim: HomeLog's timeline can become a semantic bus into MDS, while HomeLog keeps authority over production access decisions.
- HomeLog should be framed as LINE-based space access and trust coordination, with gate access as the wedge, timeline as memory, and pricing/install details kept honest while still early.
- Squish is the shipped Visual Context Compression product: video becomes one timecoded contact sheet for a vision-language model, entirely on-device in the browser.
- Project placement remains collection-driven; the UI renders and numbers featured entries from their content metadata without project-specific branches.
