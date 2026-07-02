---
title: "MDS"
summary: "A deterministic semantic substrate for living worlds: eight layers where identity, memory, emotion, physics, language, and context change one another."
status: "active"
kind: "semantic engine"
stack: ["TypeScript", "ESM", "MDM", "living-world simulation"]
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

MDS asks one question: **what if JSON could be alive?**

Not alive as a chatbot wrapper or a clever animation. Alive as a world where entities remain themselves, remember imperfectly, feel, learn, form relationships, speak only what they know how to say, and change under the weather around them.

The input is declarative material:

```json
{ "essence": "lonely ghost who remembers rain" }
```

The output is not a prewritten state machine. It is behavior that emerges as that essence passes through memory, emotion, physics, learning, communication, relationships, and time.

```text
Normal software:   Data → Logic → Behavior
MDS:               Essence → World → Emergence
```

## What it is — and what it is not

MDS is a deterministic semantic substrate for small living worlds.

It is not a chatbot framework. Conversation is one organ, not the whole body. It is not a game engine; there are no scenes or sprites. It is not a memory database because its memories fade, distort, rehearse, and sometimes crystallize. It is not an agent runtime because its entities are not task executors.

The engine models beings with inner weather, then puts those beings inside a world that also has weather of its own.

## Eight layers, one world

The [MDS Field Guide](https://github.com/v1b3x0r/mds/blob/main/docs/FIELD-GUIDE.md) reads the source like an anthropologist. Under the APIs it finds eight layers, each answering a different question:

1. **What Exists** — identity, position, age, energy, and information-physics.
2. **The Inner Life** — memory, emotion, intent, needs, and relationships.
3. **The Material World** — weather, collision, resources, and the bridge between feeling and matter.
4. **The Learning Mind** — reinforcement, skill growth, collective patterns, and emotional climate.
5. **Between Minds** — authored dialogue, multilingual meaning, and semantic recognition.
6. **Between Worlds** — trust, cognitive links, shared memory, and relationships that decay when left untended.
7. **The Container** — the ordered tick that turns separate systems into one causal world.
8. **The Boundary** — declarative `.mdm` authorship going in and honest rendering coming out.

The order is the architecture. Identity exists before physics constrains it. Bodies settle before minds interpret them. Minds settle before emotion spreads between them. Relationships update before memory consolidates. Language comes last because words should carry what the rest of the world has already made true.

## Follow one rainstorm

Imagine a lonely ghost and a keeper beside a well. It starts to rain.

The storm first changes the material world: humidity rises, temperature falls, the well refills. The ghost's body becomes cold and wet. Its inner life interprets that pressure as emotion and writes the night into memory. The keeper's presence changes the salience of that memory and the trust inside their relationship.

If the rainy meeting repeats, the memory can crystallize. The ghost can practice a declared resilience skill. Calm can travel across the cognitive link between the two beings. Their recollections can become shared history. The words they repeat can eventually crystallize into the world's lexicon.

One event crosses every layer and comes out the other side as language.

That is the useful mental model for MDS: context does not trigger one handler. It travels through a world.

## What the code believes

Read the eight layers together and a worldview appears:

- **Existence precedes physics.** A thing is before it is constrained.
- **Inner life has material consequences.** Arousal changes speed. Sadness changes mass. Negative valence becomes friction. Memory can bend attraction.
- **Decay is the default.** Memories, skills, familiarity, links, and emotional climate all fade.
- **Permanence must be earned.** Rehearsed memory crystallizes. Practiced skills resist decay. Relationships survive only when something tends them.
- **Trust outlives warmth.** Familiarity decays faster than trust.
- **Silence is more honest than fabrication.** If no dialogue was authored for a moment, the entity says nothing.
- **The world itself remembers.** Births and deaths change an emotional climate inherited by entities that did not witness the original event.

These are not metaphors sitting beside the code. They are coefficients, update orders, thresholds, and failure behavior inside it.

## Skills finally tick

MDS 5.12 connected a wire that had been missing from declared skills.

Materials could already declare skills, but those declarations were parsed and then dropped. Skills decayed; nothing in the world could practice them. In 5.12, authored triggers can finally route an event into skill practice:

```text
survives rain → practice resilience → proficiency grows
```

That change is small in API surface and large in meaning. A material can describe what a being learns from experience without embedding imperative training logic in the entity itself.

It also keeps the system honest: identity declares the capacity, experience supplies the event, and time shapes the result.

## The questions still open

The next work in MDS is not being presented as a finished API. It is being kept as a set of research questions:

- [#18 — value selection under universal decay](https://github.com/v1b3x0r/mds/issues/18) asks how a being with limited attention decides which memory, relationship, need, or ritual deserves care when everything meaningful is fading at once.
- [#19 — ritual thresholds](https://github.com/v1b3x0r/mds/issues/19) asks when encounter becomes repetition, repetition becomes ritual, and ritual becomes identity-bearing memory. Not everything repeated should become permanent.
- [#20 — an encyclopedia of unresolved world questions](https://github.com/v1b3x0r/mds/issues/20) treats the issue tracker as part of the research surface: observation → open question → hypothesis → model → API, documentation, and tests.

The shared problem is preservation.

MDS already knows how things decay. It does not yet fully know how a being chooses what is worth saving. Keeping that uncertainty explicit is better than hiding a guess behind a confident method name.

## Where it sits in the ecosystem

MDS is the meaning-first layer behind the other projects here:

- **DreamFlow** explores how meaning moves between layers.
- **DreamLink** turns physical sensor noise into events a semantic world can interpret.
- **hi-introvert** puts the runtime inside one small terminal companion.
- **HomeLog** applies the ontology instinct to people, spaces, roles, passes, presence, and event memory — with stricter boundaries because mistakes can open the wrong gate.

These are architectural relationships, not a claim that every project imports MDS today. The shared idea is that meaning should live inside the system, not survive only as documentation around it.

## What it says about the builder

MDS began as a CSS material library. "Material" meant how a surface looked.

Then JSON stopped describing styling and started describing ontology. Material came to mean declared essence: what a thing is, what it can become, and what the world may do to it.

The name stayed. The question deepened.

I like systems where the code remains small enough to inspect, but the world it describes can grow strange, expressive, and alive enough to surprise me.

MDS is that question kept runnable.
