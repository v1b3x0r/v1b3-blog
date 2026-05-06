---
title: "DreamFlow"
summary: "A tiny DSL for writing intuition about how the world should behave: when something happens, it leads to something else."
status: "experimental"
kind: "meaning DSL"
stack: ["DSL", "language design", "semantic modeling"]
repo: "https://github.com/v1b3x0r/dreamflow"
featured: true
order: 5
---

DreamFlow is a small language experiment built around one question: how do you feel the world should work?

Instead of starting with calculations or strict rules, it starts with readable causal statements:

```text
when env.humidity > 85
    often leadsTo dehumidifier.wake()
```

## Why it exists

Some domains are easier to sketch as meaning before they become code.

DreamFlow is a scratchpad for that layer: storytelling, home behavior, scene logic, relationships, world rules, and anything else that wants to be described before it wants to be implemented.
