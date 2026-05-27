---
title: "UICP"
summary: "Headless UX primitives — state machine, transitions, gestures, ARIA. ~8.6 KB. The visual layer is yours, or your agent's, to scaffold and polish."
status: "active"
kind: "headless UX protocol"
stack: ["TypeScript", "vanilla JS", "Svelte adapter", "monorepo", "@nature-labs"]
site: "https://www.npmjs.com/package/@nature-labs/uicp-core"
siteLabel: "npm @nature-labs/uicp-core"
repo: "https://github.com/v1b3x0r/uicp"
relatedProjects:
  - slug: "homelog"
    note: "HomeLog's LIFF UI runs on UICP drawer primitives. UICP exists because HomeLog needed sheets that ship static, without dragging in a framework — the real-world pressure that made the headless contract serious."
featured: true
order: 8
---

UICP is a small, opinionated library for one specific situation: *you have an AI assistant, you want a drawer (or sheet, or side-nav, or kiosk panel), and you don't want to pull React into the page just to get the gesture right.*

It is the UX skeleton. State, transitions, gestures, ARIA, focus trap, scroll lock, Escape. The visible part — position, transform, easing — is left to whoever (or whatever) is building the surface.

Around 8.6 KB brotlied for the typical drawer setup. Static-site friendly. LLM-friendly by design.

## The human – agent loop

The way I use it most days is a three-step loop:

1. Drop a `<div>` with the content I want shown, wire one line of JavaScript.
2. Ask my agent to scaffold the CSS from intent — "iOS-17 floating sheet", "edge-to-edge bottom drawer with blur backdrop", "side nav that respects the safe-area inset". The output is a drop-in block of selectors.
3. Polish where it's slightly off. The WordPress-plugin tweak vibe — small adjustments, not rewrites.

The loop works because the surface area between us is small. The library does the half that nobody wants to write twice. The agent does the half that wants design judgment. I do the half that wants taste.

## What an agent sees when it picks this up

If you brief a fresh agent on UICP — point it at `llms.txt` and `docs/agent-quickstart.md` — this is roughly what it reports back:

> *Building a drawer from scratch is seven steps: state management, open/close handlers, outside-click detection, body scroll lock, focus trap and restore, ARIA + Escape handling, touch gestures with velocity threshold, and finally the CSS for position, transform, and timing. UICP gives me steps one through six as DOM hooks I can read with selectors. My job collapses to step seven — generate CSS that matches the user's stated intent. The user expects small tweaks on my output, not a rewrite. Aim for "WordPress plugin output" quality — works out of the box, polish-ready.*

That paragraph is the testimonial. Not "UICP is amazing." Just *UICP makes the agent's job small enough to be useful on small tasks.* Which is the whole point of small tasks.

## What it solves

UICP fits when the surface needs real UX — interactions, gesture, accessibility — but does not need a full UI system with design tokens and a component library.

The honest list of "where it earns its keep":

- An edge AI panel or device control UI on a tight JS budget.
- A landing or marketing page that wants modern drawer feel without becoming a React app.
- A static HTML demo or prototype that needs gesture-aware UX.
- An embedded surface — kiosk, in-car HUD, smart-home control — that ships without a heavy stack.
- A LIFF / WeChat / mini-app shell where the runtime is already opinionated and another framework would fight it.

## When it is not a fit

UICP is intentionally narrow. The honest list of "do not use this":

- Your app already uses React with Radix or Vaul. Those integrate tighter inside the React tree. Don't fragment.
- You need modal, popover, tooltip, or menu with the *same polish* as drawer. Only the drawer adapter is fully wrapped today. The other primitives exist in core but are not adapter-shipped yet.
- You want a complete design system. UICP is a protocol, not a component library. There is no Button, no Input, no opinion about typography.

## How to try it (simplest path)

If you have an AI assistant in your terminal or editor, the lowest-friction way is to hand it the whole repo:

> *"Read the README and llms.txt at https://github.com/v1b3x0r/uicp. Install `@nature-labs/uicp-core` and `@nature-labs/uicp-adapter-vanilla` in this project. Build me a bottom sheet that slides up over the page with iOS-17 styling — inset 8px from edges, rounded corners, safe-area aware. Wire one open button. Drop the CSS inline for now; I'll move it later."*

That is the whole interaction.

The agent reads the contract (data-attrs, ARIA hooks, event names) from `llms.txt`, scaffolds the CSS from intent, drops it in. You polish where it feels off — easing curve, snap heights, backdrop blur amount, whatever matters to you.

If the result is wrong, the fix is almost always a CSS tweak. The state machine underneath does not change.

## Where it sits in the ecosystem

UICP is the toolbox piece next to MDS, HomeLog, DreamLink. It does not carry ontology, it does not interpret signals, it does not coordinate access.

It exists because HomeLog needed sheets — pass switcher, gate controls, owner surfaces — that load instantly on a mid-range Android over LINE LIFF. Pulling in a framework runtime for that felt wrong. So the drawer state machine became its own thing, and the lessons from shipping it into a real product flowed back into the library.

Every UICP feature that survives a release survived contact with HomeLog first.

## What it taught me

The interesting work is at the boundary between *what the machine should track* and *what the human (or agent) should design.* Animation is design. State is engineering. A library that tries to own both ends up forcing one to follow the other.

UICP holds the line. The state stays honest. The design stays open. The agent gets a job small enough to do well in one shot.

That, for small tasks, is enough.
