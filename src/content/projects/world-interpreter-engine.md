---
title: "World Interpreter Engine"
summary: "A minimal engine that turns real-world signals into meaningful, replayable events and human-readable timelines."
status: "experimental"
kind: "signal interpretation"
stack: ["Astro", "TypeScript", "events", "narrative timelines"]
repo: "https://github.com/v1b3x0r/world-interpreter-engine"
relatedProjects:
  - slug: "dreamlink"
    note: "DreamLink is the production-shaped continuation of this experiment — same interpreter pattern, attached to real sensors and feeding an MDS world."
  - slug: "homelog"
    note: "HomeLog's timeline borrows the same instinct: events as story, not just rows of telemetry."
featured: true
order: 2
---

World Interpreter Engine starts from a practical frustration: *raw data is often technically correct and still useless.*

Electricity usage, time ranges, sensor readings — none of them are stories on their own. The engine maps raw signals into events, then turns those events into a timeline that can be read like memory.

```text
[event]   power_draw 1.4kW · zone:kitchen · 18:42–18:51
[home]    Someone cooked.
[rover]   Engine bay drew current for 9 minutes.
[cyber]   Synth-grease flowed through the kitchen subroutine.
```

Same event, three different narrators. The interpreter is swappable.

## Why it exists

Because `120W` does not mean much alone.

"Someone cooked", "the AC ran too long", "something abnormal happened" — those are closer to how a person actually understands a place. Numbers want to be facts. Events want to be stories. The engine is the layer that decides which event in the firehose deserves to become a sentence.

## Shape

The engine has one job: `render(events, interpreter) → string[]`.

`events` is a typed array — actor, device, zone, duration, signal value. `interpreter` is a template map keyed on the event type with placeholder slots (`{actor}`, `{device}`, `{zone}`, `{duration_min}`). Swap the interpreter, change the voice. The events do not move.

Three presets ship with the demo: **Home** (everyday domestic narration), **Rover** (Mars-mission control), **Cyberpunk** (gritty replay of the same data). The point is not the presets. The point is that a single signal stream can carry many readings, depending on whose lens is over it.

## Where it sits in the ecosystem

This was the precursor.

The pattern it sketches — *signal → interpreter → narrative* — is exactly the pattern **DreamLink** later picked up at production scale, with GroundSense for baseline-aware drift detection and DreamFlow for the output grammar. World Interpreter Engine is the toy version, the demo where the architecture is visible without the runtime weight.

**HomeLog**'s timeline borrows the same intuition. The interpreter view is what eventually lets a household timeline read like memory instead of a list of relay flips.

## What it says about the builder

I keep wanting to see machine output the way I see a person retelling their day — selectively, in the right voice, with the boring parts left out.

This little engine is where I first wrote that idea down in code.
