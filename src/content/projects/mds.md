---
title: "MDS"
summary: "A declarative ontology engine for living materials: worlds, entities, memory, emotion, behavior, and the semantic bus that moves context through them."
status: "active"
kind: "semantic engine"
stack: ["TypeScript", "ESM", "MDM", "semantic systems"]
repo: "https://github.com/v1b3x0r/mds"
relatedProjects:
  - slug: "homelog"
    note: "HomeLog is where the ontology becomes strict — same model, applied to access for real places where mistakes have weight."
  - slug: "dreamlink"
    note: "DreamLink interprets physical sensor noise into events the MDS world can feel, not just log. Layer 3 of the stack."
  - slug: "hi-introvert"
    note: "A 26-line companion that proves the engine carries enough on its own — vocabulary, emotion, memory all emerge from mds-core, not authored config."
  - slug: "dreamflow"
    note: "DreamFlow is the inter-layer language MDS speaks to itself. Same instinct, different layer: describe meaning, let behavior emerge."
featured: true
order: 1
---

MDS is the substrate everything else here sits on.

The core idea is small. Treat *data* as something closer to a living world than a static object. Describe materials as declarations, then let the world interpret those declarations into behavior. The system spends its energy on emergence, not on hand-wiring branches.

```text
Normal software:   Data → Logic → Behavior
MDS:               Essence → Physics → Emergence
```

## Why it exists

Most software treats meaning as documentation *around* the system. MDS tries to put meaning *inside* it.

An entity does not need to declare an emotional state machine, a memory schedule, a relationship graph, or a learning rule. It only needs an essence:

```json
{ "essence": "Lonely ghost" }
```

That is complete and valid. The engine fills in the rest — needs that drift, memory that decays, emotion shaped by the PAD model, relationships that form and weaken, semantic-similarity physics that pulls some entities together and pushes others apart.

## Architecture shape

A `world` is the container. `.mdm` files are the declarative material specs. Entities are spawned instances with essence, memory, emotion, relationship, and cognition.

The Semantic Bus is the important bridge. `world.broadcastContext({ ... })` lets external context enter the world *as meaning*, not just data. Temperature, festivals, noise, light, schedules, or sensor hints can change what entities say, remember, and become — without anyone editing the entities.

That makes MDS less like a UI library and more like an information-physics engine. Digital worlds, autonomous NPCs, smart devices, ambient systems — anywhere behavior should emerge from *identity plus context* rather than from explicit reactions.

## Where it sits in the ecosystem

Everything else on this site is downstream of MDS in some way:

- **DreamFlow** is the language MDS uses to talk to itself across layers.
- **DreamLink** is how physical sensors become events MDS can feel.
- **HomeLog** is the production translation, where the same ontology has to be strict because a wrong role opens a wrong gate.
- **hi-introvert** is the playful translation — same engine, no enforcement pressure.
- **World Interpreter Engine** was the early sketch of "interpret signals into a readable timeline" that DreamLink later took further.

## Real-world pressure

MDS asks how a system can carry essence, memory, relationship, and context as first-class material. HomeLog translates that question into human, space, membership, role, pass, presence, and event memory.

The connection is conceptual architecture, not a runtime claim yet. MDS is the meaning-first engine. HomeLog is the real-world operating layer that shows why those meanings need strict boundaries when they control access to physical space.

## What it says about the builder

I like systems where the code stays small but the world it describes can become weird, expressive, and alive enough to surprise me.

MDS is the question every other project here is trying to answer in its own way.
