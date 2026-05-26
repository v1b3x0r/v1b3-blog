---
title: "DreamLink"
summary: "A semantic gardener for IoT: sensor noise gets interpreted into DreamFlow events that an MDS world can feel, not just log. Layer 3 of the MDS ecosystem — the body and the mind between the physics and the language."
status: "experimental"
kind: "sensor interpreter"
stack: ["Node.js", "ESM", "GroundSense", "DreamFlow", "MDM", "ESP32"]
repo: "https://github.com/v1b3x0r/dreamlink"
relatedProjects:
  - slug: "mds"
    note: "DreamLink sits on top of mds-core: GroundSense feeds interpreted sensor events into the world via broadcastContext, then the entities react."
  - slug: "hi-introvert"
    note: "Same pattern at a different ground — hi-introvert reads OS sensors (cpu, battery, weather) into the companion's world; DreamLink does it for physical hardware. The interpreter shape carries across scales."
  - slug: "dreamflow"
    note: "DreamLink writes its narrative output in DreamFlow form (`when X leadsTo Y`), so the runtime can speak before it computes."
featured: true
order: 7
---

DreamLink is the layer between sensors and meaning.

Most IoT systems treat the world as a stream of dumb numbers. Temperature is 32. Vibration is 50. Light is 0.8. The numbers go into a database and someone, eventually, writes rules around them. The numbers never become a story.

DreamLink tries the inverse. Sensor noise enters, gets interpreted through a baseline-aware algorithm called **GroundSense**, and exits as DreamFlow — small causal sentences that an MDS world can actually feel.

```dreamflow
when ground.vibration > 50 always leadsTo orz.shaking()
```

That line is not a configuration. It is the system's own narrative of what just happened.

## The hierarchy of meaning

DreamLink lives inside a larger stack:

1. **MDS** — the physics. Worlds, entities, memory, emotion, semantic bus.
2. **DreamLink (Body)** — the sensory system. Touches the world, feels the world, reacts before thinking.
3. **DreamLink Oracle (Mind)** — the interpreter. Uses GroundSense to hold a baseline, evaluate drift, and decide what was meaningful.
4. **DreamFlow** — the language the Oracle writes in. Causal, declarative, human-readable.
5. **The Garden** — the TUI surface where invisible structures become visible.

The split between Body and Mind is the part I keep coming back to. Hardware is a dumb terminal. The Oracle is where the meaning lives. If you replace the ESP32 with a different microcontroller, or with a virtual sensor in code, nothing above Layer 2 has to change.

## GroundSense

The algorithm has one job: tell the difference between "the room is warm today" and "something is wrong."

It does that by holding a rolling baseline per signal and watching for drift relative to that baseline. A vibration of 50 in a quiet room is loud. The same 50 in a workshop is background. Without baseline awareness, IoT rules become brittle thresholds that engineers have to retune every season.

GroundSense lets the system decide what counts as "noise" and what counts as a "moment." The Oracle then translates moments into DreamFlow events so the rest of the world can react in semantic terms rather than numeric ones.

If a tree falls in the forest and no IoT sensor logs it, it's a missing data point. If a tree falls and GroundSense is listening, **the Forest feels grief.**

## The mirror to hi-introvert

This is where the projects line up.

[hi-introvert](/projects/hi-introvert) is a terminal companion that watches its host machine: CPU temperature becomes the room's warmth, memory pressure becomes humidity, charger transitions become rituals of arrival and departure. The OS is the ground. The sensors are virtual. The companion reacts to drift in its small world.

DreamLink is the same pattern at a different ground. Physical sensors instead of OS metrics. A garden, a workshop, a hallway instead of a terminal. The interpreter shape is identical: sensor noise enters, drift gets noticed, DreamFlow comes out, entities react. The companion in `companion.mdm` could just as easily react to a real room as to a laptop.

That mirror is the point of having both projects. They prove the interpretation layer is portable.

## Where HomeLog could meet this

The natural next move is a Pi-shaped, offline-first version of DreamLink for HomeLog spaces — door sensors, motion, light, charger transitions inside a real home, all interpreted into DreamFlow events that HomeLog's timeline can carry as semantic context.

That work is not wired yet. HomeLog still needs to ship its access core and earn its keep before it gets a semantic layer on top. DreamLink stays as a stand-alone Layer 3 for now, and the Pi-integration story stays as design intent rather than a roadmap commitment.

## Where it lives

The Oracle is published on npm as `@v1b3x0r/dreamlink`. Run it against a folder of `.mdm` files and it will start writing `worldlog/session.dream` — the narrative of your sensors as they happen.

The source is on GitHub. Like everything else in this ecosystem, the materials are plain JSON and the language the system writes back in is human-readable.

## What it says about the builder

I am consistently drawn to systems where the substrate stays small but the surface grows by itself.

MDS asks the question. HomeLog applies the strict version. hi-introvert applies the playful version. DreamLink fills in the missing layer between the engine and the physical world — the part that decides what a number was actually trying to say.
