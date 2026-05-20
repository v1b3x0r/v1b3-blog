---
title: "HomeLog"
summary: "A LINE-based space access and trust coordination layer for real places: gate access first, timeline memory second, with installation and pricing still grounded in field reality."
status: "active"
kind: "space access system"
stack: ["LINE LIFF", "SvelteKit", "FastAPI", "PostgreSQL", "relay hardware", "field ops"]
site: "https://viibe.to/homelog"
siteLabel: "view HomeLog page"
featured: true
order: 3
---

HomeLog is becoming a LINE-based access layer for real spaces: homes, family compounds, small hospitality sites, shopfronts, and other places where people need to let the right person in without turning access into a phone-call chain.

The current direction is simple: gate access is the wedge, space membership is the model, passes are temporary bridges, and the timeline is the memory of what happened.

It is not trying to be a generic smart-home dashboard. Devices and relays are infrastructure. The human-facing job is coordination: who can enter which space, under what permission, at what time, and what the space should remember afterward.

## Current shape

The product lives where real-world access gets messy:

- an owner wants to open a gate from LINE
- a manager needs to give access without handing out a permanent remote
- a guest, cleaner, delivery person, or caretaker needs one clear action
- a place needs a readable access timeline after the moment has passed

The strongest rule from field testing is speed. Opening or sharing access has to feel close to a physical remote: roughly three taps, roughly three seconds, and very little thinking. If the flow enters through reflective timeline browsing before the gate action, it is already losing.

## Access first

HomeLog treats a space as the root object. A person can belong to one space or many spaces. They might be the owner of a house, a manager of a small property, a cleaner with recurring access, or a guest with a single temporary pass.

That means the product should not assume one LINE user equals one home. A LINE user is a human who may move across several real places.

The practical model is:

- spaces hold the operational context
- memberships define persistent relationships
- roles shape permissions and tone
- passes grant temporary capability
- devices stay below the main user experience

## Timeline second

The timeline still matters, but not as the first screen for urgent work.

Its job is memory and trust: who entered, which space they entered, what kind of permission was used, and why the event mattered. It should not become device spam, and it should not overclaim by guessing exact appliances or hidden intent from ambiguous signals.

The older energy-watchdog layer is still useful as infrastructure and context. Main-clamp data can observe household state, and channel-level signals can support richer interpretation when the metadata is clean. But the public product story is no longer "dashboard that reads electricity." The story is "access coordination for places people actually use."

## Installation reality

HomeLog depends on boring physical truth: the gate motor, relay wiring, internet, power, weatherproofing, manual override, and the person's tolerance for support.

The current field learning is that installation cannot be hand-waved. A relay that works in one house does not automatically become a repeatable package. The system needs checklists, wiring verification, fail-safe behavior, and a rollback path before it pretends to scale.

## Pricing maturity

Pricing is intentionally early.

The working hypothesis separates one-time setup from the monthly service. Setup depends on site complexity. The monthly value is the LINE access flow, remote control, temporary access, access timeline, hosted service, owner/manager UX, and support.

Rough single-access service anchors have been discussed around 1,000-2,000 THB/month for premium early setups, but that is not a locked price list. The honest version is: repeat the installation pattern first, then package it.

## Engineering discipline

The difficult part is not just making a relay click. It is keeping the meaning clean across LINE entry, pass links, role permissions, API payloads, timeline copy, hardware state, and production ops.

When identity or access semantics matter, HomeLog should prefer explicit metadata over inference. Missing or invalid semantic metadata should fail closed. Legacy compatibility belongs in migration or translation layers, not in runtime logic that decides who can enter a real place.

## What it taught me

Useful products often start as an unglamorous wedge. In this case, the wedge is opening a real gate quickly from LINE. The bigger system only earns the right to exist if that first loop stays fast, understandable, and safe enough for the place it controls.
