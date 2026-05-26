---
title: "hi-introvert"
summary: "A terminal companion built on mds-core: a 26-line MDM seed, no LLM, no cloud — everything else (vocabulary, dialogue, emotion, skills) emerges from the engine and the conversation."
status: "experimental"
kind: "terminal companion"
stack: ["TypeScript", "Ink TUI", "mds-core", "Bun", "proto-language"]
site: "https://www.npmjs.com/package/hi-introvert"
siteLabel: "npm package"
repo: "https://github.com/v1b3x0r/hi-introvert"
relatedProjects:
  - slug: "mds"
    note: "hi-introvert is a working showcase of mds-core: a near-blank entity that grows personality from interaction, not from authored config."
featured: true
order: 6
---

hi-introvert is a quiet program that lives in a terminal and learns from whoever talks to it.

It ships as a 26-line companion file and a thin TUI. There is no language model behind the curtain, no API keys, no server. Vocabulary grows when the user teaches it. Emotion shifts with what gets said and with the temperature of the host machine. Memory decays. Silence is a valid reply.

The interesting thing is not the companion. The interesting thing is how little the companion's MDM file has to say for the engine to feel like something.

## The 26-line seed

The default companion ships at `entities/companion.mdm`. It declares an essence, a language profile, four emotion transitions, and three intro lines for the cold start. That is the entire authored personality.

```json
{
  "essence": {
    "en": "a small mind learning to speak. remembers everything you say. has no words of its own — yet."
  },
  "emotion": {
    "transitions": [
      { "trigger": "user.praise",   "to": "happy",    "intensity": 0.5 },
      { "trigger": "user.criticism","to": "sad",      "intensity": 0.4 },
      { "trigger": "user.question", "to": "thinking", "intensity": 0.3 },
      { "trigger": "user.greeting", "to": "curious",  "intensity": 0.3 }
    ]
  },
  "dialogue": {
    "intro": [
      { "lang": { "en": "..." } },
      { "lang": { "en": "hi." } },
      { "lang": { "en": "who are you?" } }
    ]
  }
}
```

Three intro lines exist as a safety net. Until the vocabulary buffer reaches ~20 words, the companion cycles through them. After that, mds-core's proto-language generator takes over.

What is deliberately absent matters more than what is present: no self-monologue array, no emotion-keyed dialogue (happy/sad/curious/...), no behavior rules, no skill ladders, no relationship presets, no decorative cognition or world-mind blocks. The engine handles all of that as runtime mechanics. The MDM stays small so the engine has space to speak.

## What emerges, not what is authored

Once a few turns of conversation land, things start happening that the MDM does not describe.

Vocabulary acquisition learns new words from the user's speech and adds them to a shared pool. Proto-language composes phrases by sampling that pool, weighted by emotion. Crystallization notices when the user repeats word combinations and turns them into permanent patterns in the lexicon. Skill levels (conversation, creativity, empathy, learning) tick from interaction signals. Identity capture detects "call me X" / "I'm X" / "my name is X" and stores a tagged memory the companion can retrieve later when asked.

A typical session reads like this:

```
you: hi
◆ companion: ...

you: hi
◆ companion: who are you?

you: call me wutty
[identity] wutty
◆ companion: hi wutty.

you: do you remember me?
◆ companion: wutty remember wutty.
```

It stutters. It repeats. It forgets. The shape is intentional. Polished output would obscure the underlying claim, which is that the engine carries enough mechanics on its own that authored behavior becomes optional.

## Why it sits next to MDS

MDS asks whether a system can carry essence, memory, relationship, and context as first-class material. hi-introvert is one of the most compact answers to that question.

The companion is essentially a stress test for `@v1b3x0r/mds-core`. If a 26-line seed plus a small Ink terminal can produce something that feels like a presence growing over time, then the engine is doing real work. If the companion still feels alive after months of interaction, that is the engine, not the seed.

HomeLog applies the same engine to access and space coordination, where meaning must stay strict. hi-introvert applies it to companionship, where meaning is allowed to drift. Same substrate, very different surface pressure.

## Where it lives now

The package ships on npm as `hi-introvert`. A single `npx hi-introvert` runs it locally, with auto-save into the current directory and one optional outbound call for local weather (toggle with `/privacy off`). The Thai bilingual variant of the companion is preserved at `entities/companion-th.mdm` for anyone who wants the fuller authored voice.

The source is on GitHub. The MDM file is plain JSON. Edit it, restart, watch what happens. That tends to be the most fun part.

## What it says about the builder

I keep being drawn back to the same question across MDS, HomeLog, DreamFlow, and now hi-introvert: how little do I need to say before a system starts saying something on its own?

hi-introvert is the most explicit version of that question I have shipped so far. The MDM is small enough to read in one screen. Everything else is the engine remembering what you taught it.
