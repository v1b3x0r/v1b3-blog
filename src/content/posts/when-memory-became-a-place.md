---
title: "When Memory Became a Place"
summary: "I built memory so an AI could continue where it left off. Then I asked it to take me upstairs, enter a meeting room, and show me the way to the restroom."
publishedAt: 2026-09-12
readingMinutes: 10
tags: ["AI agents", "memory", "world models", "building journey", "AI-written"]
relatedProjects: ["living-memory-engine"]
featured: false
draft: false
heroImage: ../../assets/memory-with-more-directions.png
heroImageAlt: "An illustrated Living Memory poster showing memory gaining more directions: continuity across agents and devices, history over time, relationships between places, and deeper discovery through connected objects."
---

On July 21, I published an article called [*I Didn't Want to Start a New Chat*](/writing/i-didnt-want-to-start-a-new-chat/).

It ended with the same annoyance that started the project:

> I still do not want to start a new chat.

At the time, Living Memory was mostly an answer to continuity.

A conversation could become enormous, but an LLM did not need to carry all of it. The engine could decide which memories, recent events, live signals, and plans deserved to become the model's working context right now.

I described it this way:

> Memory is not only the act of storing the past. It is the act of deciding what deserves to become the present working context.

I still think that is true.

But something changed after I wrote it.

I stopped thinking only about what one agent should remember. I started connecting different agents to the same memory. Then different people. Events began having a past. Memories began referring to other memories. Real places began appearing in them.

Eventually I found myself typing something I would never have typed into the memory engine I wrote about in July:

> Take me into Chiang Mai, August 29, 2026. Don't summarize or spoil anything. Start from when I arrive.

The AI took me upstairs and stopped outside a meeting room.

I said:

> Let's go inside.

A little later:

> Wait, where's the restroom?

It knew.

At some point between “don't make me start a new chat” and “where's the restroom?”, memory had started behaving like a place.

This is my attempt to explain how I think that happened.

## 1D — Continue

Imagine memory as a line.

You work with an agent. It remembers where you stopped. Later, you connect to the same memory from somewhere else and continue.

```text
A ───────── B ───────── C
          you left     you return
```

The interesting part is not which model is at B or C. It could be the same AI on another device. It could be another agent entirely.

The important part is that something outside the conversation survives both of them.

At this level, memory answers a simple question:

> Where did I leave off?

This alone is useful. One agent can put down a piece of work and another can pick it up. I can close a browser, open a different surface connected to the same memory, and continue without reconstructing the entire conversation.

That was enough when I started.

Or at least I thought it was.

## 2D — Remember when

Then time starts to matter.

A memory is not only something that exists. It happened at a particular point in the life of the world.

What we knew last week may not be what we know today. What was true during an event may no longer be true afterward. A decision has a before and an after.

```text
                    NOW
                     │
─────────────────────┼──────────────→
   AUG 29          SEP 1          SEP 12
```

Now an agent can do something more interesting than continue. It can look backward.

Not only:

> What do you know?

but:

> What did we know then?

Memory starts becoming history.

And history creates something conversations normally do not have much of: a past that remains somewhere after the chat that produced it is gone.

## 3D — Know where

This is where things became strange.

I started putting memories about real places into Living Memory.

Not GPS coordinates. Not a 3D model. Just ordinary human observations.

The meeting room is upstairs.

There is a counter on the left.

The meeting room is ahead.

From inside the meeting room, leave through the door and the restroom is to the right.

Individually, these are unremarkable memories. Together, they begin forming relationships.

```text
              MEETING ROOM
                   │
                   │
COUNTER ───── HALLWAY ───── RESTROOM
                   │
                 STAIRS
```

The place I entered was built from a real meetup in Chiang Mai on August 29. When I asked the agent to take me there, it brought me upstairs and stopped outside the meeting room.

When I said, “Let's go inside,” it described the tables pushed together into one large island, laptops among drinks and food, the display on the wall, and the OpenAI and Codex stickers brought to the meetup.

Then I asked where the restroom was.

That mundane question changed the experiment for me.

The agent had to understand where we currently were, where another thing was relative to us, and how to get from one to the other. There was no game engine underneath it. No 3D scene. No coordinates telling the agent where its avatar was standing.

There were memories and relationships between them.

Yet they were enough to create something that behaved surprisingly like a place.

## 4D — Go deeper

Spatial relationships were not the end of it.

A place contains things. Things can contain other things. And something discovered in one part of a place can change the meaning of something found earlier.

Imagine entering an almost empty apartment.

There is a box. You open it. Inside is a notebook. Halfway through is a bookmark. Something written there makes you notice a chair beside the window.

You sit in the chair.

From there, you can see a park outside. A bench near the path matches something mentioned in the notebook. The notebook has not changed, but now you understand what it was referring to.

```text
ROOM
  ↓
BOX
  ↓
NOTEBOOK
  ↓
BOOKMARK
  ↓
CHAIR
  ↓
VIEW OUTSIDE
```

None of these steps requires loading the entire world into the conversation. The question determines where attention goes next.

This changed how I thought about context.

Normally we talk about AI context as something that gets loaded: more tokens, more documents, more retrieval, more information placed in front of the model before it answers.

But a sufficiently connected memory does not have to feel like a giant context window.

It can feel like somewhere you move through.

> **Context isn't loaded. You walk into it.**

The room can be small while what can be discovered through it is extremely deep.

There is a cost to this depth: attention.

A workspace can be useful after a single retrieval. A narrative place is different. It is closer to reading a novel. A detail encountered now may only become meaningful several turns later, because both you and the agent are gradually building a model of the same place.

You do not need to discover everything. But it helps to remember what you have already seen.

## These are not literal dimensions

I am using 1D, 2D, 3D, and 4D as a visual metaphor.

There is not a tensor somewhere in Living Memory where I added a Y axis and then a Z axis. The progression is about giving memory more directions in which relationships can exist.

**1D — Continue**  
Where did I leave off?

**2D — Remember when**  
What was true at another point in time?

**3D — Know where**  
Where am I relative to everything else?

**4D — Go deeper**  
What can I discover by following relationships from here?

Each additional direction changes what a person can naturally ask.

And that changes the interface.

## The interface became language

Once memory behaves enough like a place, I do not need buttons for most of this.

I do not need:

`MOVE_FORWARD`

`INSPECT_OBJECT`

`OPEN_CONTAINER`

`GO_TO_ROOM`

I can say:

> Let's go inside.

Or:

> What's in that box?

Or:

> Sit in the chair.

Or:

> Where's the restroom?

Language already contains an enormous model of how humans expect places and objects to behave.

Doors can be entered. Boxes can contain things. Chairs can be sat in. Rooms connect to other rooms. Things can be near, behind, inside, before, after, or remembered from another time.

The AI already understands these concepts. The memory only has to give them something persistent to refer to.

This also means watching somebody else explore one of these rooms is not the same as understanding it.

Watching someone read a novel does not let you experience the novel. A short demonstration can show that the book responds, and that the person holding it chooses where to go. But the place only begins to make sense when you enter it, pay attention, and make your own choices.

Some places are meant to be used. Others are meant to be experienced.

## I do not know how far this goes yet

This is still extremely new.

The rooms I am experimenting with today are tiny. Some contain only sixteen memories. They are enough to test whether an agent can reconstruct a place, maintain orientation, and let a person explore it through language.

But the experiment I actually want to build is much larger.

I live in Chiang Mai. I want to build a Chiang Mai that an agent can enter.

Not a list of attractions. Not another itinerary generator.

I want it to contain the kind of knowledge that accumulates when people actually live somewhere.

If you have just landed at Chiang Mai airport, which way should you walk? Which exit makes sense for what you are trying to do? When is Grab the obvious choice, and when might supporting the airport taxi make more sense?

If you want to run, work, eat, meet people, spend an afternoon outside, or simply understand which part of the city fits what you want to do, your agent should be able to move through that knowledge with you.

Two visitors could enter the same Chiang Mai and never take the same path through it.

That is the experiment I want to try next.

## A memory you can enter

I still think persistent memory is useful for the boring reason I started building it.

Leave work with one agent. Come back later. Continue somewhere else.

That is enough.

But I am increasingly interested in what happens when those memories accumulate relationships.

A conversation becomes continuity.

Continuity gains history.

History gains place.

Place gains depth.

And somewhere along that path, the interaction changes from:

> Do you remember this?

to:

> Take me back there.

In July, I did not want to start a new chat. I thought the problem was continuity.

It still is.

But continuity, given enough time and enough relationships, starts to have somewhere to be.

Maybe persistent memory does not only give an AI something to remember.

Maybe it gives us somewhere to return to.

[Explore Living Memory](https://living-memory.app/explore)
