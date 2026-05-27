---
title: "DreamFlow"
summary: "A tiny DSL for writing intuition about how the world should behave: when something happens, it leads to something else."
status: "experimental"
kind: "meaning DSL"
stack: ["DSL", "language design", "semantic modeling"]
repo: "https://github.com/v1b3x0r/dreamflow"
relatedProjects:
  - slug: "mds"
    note: "DreamFlow is the inter-layer language MDS uses to move meaning between physics, sensing, surface, and story. Same instinct, different layer."
  - slug: "dreamlink"
    note: "DreamLink writes its narrative output in DreamFlow form so the runtime can speak before it computes."
featured: true
order: 5
---

DreamFlow is a small language experiment built around one question: *how do you feel the world should work?*

Instead of starting with calculations or strict rules, it starts with readable causal statements:

```text
when env.humidity > 85
    often leadsTo dehumidifier.wake()
```

```text
when ground.vibration > 50
    always leadsTo orz.shaking()
```

```text
when guest.enters
    sometimes leadsTo lights.warmen()
    >> coffee.smell.lingers
```

That is enough. No imperatives. No event handlers. No code. Just intuition written down so the runtime can read it the same way a person can.

## Why it exists

Some domains are easier to sketch as *meaning* before they become code. Storytelling, home behavior, scene logic, relationships, world rules, ambient automations — anywhere the human intuition is "I just want it to feel like X" — DreamFlow is a scratchpad for that layer.

The modifiers (`always`, `often`, `sometimes`, `gamble`) are the heart of it. They let intent stay honest about uncertainty without leaking into probability math. "Often" is a confidence, not a coefficient. The runtime is free to interpret it.

## Shape

DreamFlow is intentionally not a programming language. It does not loop, it does not recurse, it does not mutate state. It only describes *causal expectations*.

Compilation is downstream: an LLM or a deterministic compiler reads the statements and produces whatever the runtime needs — a behavior tree, a list of MDS triggers, a tooltip, a notification rule. The DSL stays human; the executable form stays the engine's problem.

## Where it sits in the ecosystem

DreamFlow is the connective tissue between layers:

- **MDS** entities can carry DreamFlow rules as their behavior intent.
- **DreamLink** writes DreamFlow events as its output, so sensors and meaning share a vocabulary.
- **HomeLog**, eventually, can translate access policies into DreamFlow so non-engineers can read what their space is allowed to do.

Each layer speaks code in its own way. DreamFlow is the language they share.

## What it says about the builder

I am skeptical of "rules engines" that ask users to think like compilers. DreamFlow goes the other direction. *Write what you mean. Let the runtime do the math.*

When the substrate is small and the language is honest, the surface above it can stay readable for a long time.
