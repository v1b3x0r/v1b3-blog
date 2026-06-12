---
title: "HomeLog"
summary: "A LINE-based space access and trust coordination layer for real places: gate access first, timeline memory second, grounded in physical installation reality."
status: "active"
kind: "space access system"
stack: ["LINE LIFF", "SvelteKit", "FastAPI", "PostgreSQL", "relay hardware", "field ops"]
site: "https://homelog.life"
siteLabel: "homelog.life"
relatedProjects:
  - slug: "mds"
    note: "MDS is the meaning-first architecture lens. HomeLog is where roles, passes, and space context become strict because real gates open."
  - slug: "uicp"
    note: "HomeLog's drawer-driven LIFF UI runs on UICP primitives. UICP exists because HomeLog needed sheets that ship static, without dragging in a framework."
  - slug: "dreamlink"
    note: "Future-latent: a Pi-shaped DreamLink could carry HomeLog's sensors into DreamFlow events so the timeline reads like memory, not telemetry."
  - slug: "world-interpreter-engine"
    note: "The interpreter pattern that turns events into a readable timeline started there. HomeLog borrows the same intuition for its access log."
featured: true
order: 3
---

HomeLog is a LINE-based access layer for real spaces: homes, family compounds, small hospitality sites, shopfronts, and any other place where the right person needs to be let in *without turning access into a phone-call chain.*

The current direction is simple. Gate access is the wedge. Space membership is the model. Passes are temporary bridges. The timeline is the memory of what happened.

It is not trying to be a generic smart-home dashboard. Devices and relays are infrastructure. The human-facing job is coordination: who can enter which space, under what permission, at what time, and what the space should remember afterward.

## Current shape

The product lives where real-world access gets messy:

- an owner wants to open a gate from LINE
- a manager needs to give access without handing out a permanent remote
- a guest, cleaner, delivery person, or caretaker needs *one clear action*
- a place needs a readable access timeline after the moment has passed

The strongest rule from field testing is speed. Opening or sharing access has to feel close to a physical remote: roughly three taps, roughly three seconds, very little thinking. If the flow enters through reflective timeline browsing before the gate action, it is already losing.

## Access first

HomeLog treats a space as the root object. A person can belong to one space or many. They might own a house, manage a small property, clean it weekly, or visit once with a temporary pass.

That means the product does not assume one LINE user equals one home. *A LINE user is a human who may move across several real places.*

The practical model:

- **spaces** hold the operational context
- **memberships** define persistent relationships
- **roles** shape permissions and tone
- **passes** grant temporary capability
- **devices** stay below the main user experience

## Timeline second

The timeline still matters, but not as the first screen for urgent work.

Its job is memory and trust: who entered, which space, what kind of permission was used, why the event mattered. It should not become device spam, and it should not overclaim by guessing exact appliances or hidden intent from ambiguous signals.

The older energy-watchdog layer is still useful as infrastructure and context. Main-clamp data can observe household state, and channel-level signals can support richer interpretation when the metadata is clean. But the public product story is no longer "dashboard that reads electricity." The story is *access coordination for places people actually use.*

## Installation reality

HomeLog depends on boring physical truth: the gate motor, relay wiring, internet, power, weatherproofing, manual override, and the person's tolerance for support.

The current field learning is that installation cannot be hand-waved. A relay that works in one house does not automatically become a repeatable package. The system needs checklists, wiring verification, fail-safe behavior, and a rollback path before it pretends to scale.

## Engineering discipline

The difficult part is not making a relay click. It is keeping the meaning clean across LINE entry, pass links, role permissions, API payloads, timeline copy, hardware state, and production ops.

When identity or access semantics matter, HomeLog prefers explicit metadata over inference. Missing or invalid semantic metadata fails closed. Legacy compatibility belongs in migration or translation layers, never in runtime logic that decides who can enter a real place.

This is where HomeLog connects back to MDS. MDS is the meaning-first architecture lens — world, entity, essence, memory, relationship, cognition, context moving through a semantic bus.

HomeLog translates that ontology into a production model: human, space, membership, role, pass, presence, runtime intent, event memory. The translation has to be stricter than a simulation because a role mistake is not just a weird outcome; *it can open the wrong gate for the wrong person.*

The future runtime version is simple: HomeLog's timeline becomes a semantic bus into MDS. HomeLog keeps authority over access. MDS interprets the stream into living context — presence, trust, routines, anomalies, the emotional texture of a space.

## What it taught me

Useful products often start as an unglamorous wedge. The wedge here is opening a real gate quickly from LINE. The bigger system only earns the right to exist if that first loop stays *fast, understandable, and safe enough for the place it controls.*
