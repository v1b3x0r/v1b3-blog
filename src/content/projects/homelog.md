---
title: "HomeLog / Energy Watchdog"
summary: "A home energy interpretation system that turns device and channel signals into safer, more human-readable status, timeline, and alert behavior."
status: "active"
kind: "home signal system"
stack: ["Python", "FastAPI", "LIFF", "SvelteKit", "PostgreSQL", "ops scripts"]
featured: true
order: 3
---

HomeLog is where the abstract signal-to-meaning idea gets very real.

It watches home energy behavior, interprets device and channel signals, and presents them through APIs, LIFF views, alerts, and operational tooling.

The interesting part is not just the UI. It is the semantic discipline: a device is only a signal container, while a channel is the real circuit unit. Role meaning must come from explicit metadata, not channel index or convenient naming guesses.

## Why it exists

Homes produce a lot of noisy signals. The goal is to make those signals understandable without corrupting the truth model underneath.

## What it taught me

Small shortcuts around semantics become expensive later. When identity or role matters, explicit metadata beats inference.
