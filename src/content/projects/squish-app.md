---
title: "Squish"
summary: "Visual Context Compression for video: turn a whole clip into one clean, timecoded contact sheet that any vision-language model can read."
status: "active"
kind: "visual context compressor"
stack: ["TypeScript", "PWA", "client-side media", "Visual Context Compression"]
site: "https://www.getsquish.app/"
siteLabel: "Open Squish"
repo: "https://github.com/v1b3x0r/squish-app"
featured: true
order: 9
---

Squish turns a video into one image an AI can actually look at.

Drop in a clip. Squish samples frames across its full duration, lays them out in order, and stamps each one with its timecode. The result is a video contact sheet: the whole clip compressed into a single visual artifact, ready to paste into ChatGPT, Claude, Gemini, or any other vision-language model.

```text
video → contact sheet → look at the grid → answer with timestamps
```

That small pipeline is the product.

## The problem is not video playback

When someone asks an AI "what happens in this clip?" the obvious input is the video itself. But many assistants cannot inspect raw video, and the ones that can spend more context, latency, and tokens to do it.

Sending one frame does not solve the real problem either. A still image can show *what* happened, but not what changed before or after it.

A contact sheet keeps the frames that carry the sequence and drops the redundant time between them. The timecodes preserve the link back to the source:

- the error first appears around `0:32`,
- the scene changes at `1:02`,
- the goal happens near `1:48`.

Without timestamps, the grid is a pile of thumbnails. With them, it becomes something a model can reason over.

## Visual Context Compression

Squish is the first working form of a broader idea I call **Visual Context Compression**: turn temporal media into a spatial artifact a vision model can read in one pass.

It is not a video editor and it is not an AI model. It sits between the two — a preprocessing step that changes the shape of the context before the model sees it.

That distinction matters. Squish does not summarize the clip for the model or decide which moment is important. It gives the model an ordered, time-anchored view of the source and lets the reasoning happen downstream.

## Private by architecture

The conversion runs entirely in the browser. The source video does not leave the device. There is no upload server and no account required to use the free flow.

The free version produces 3×3 sheets and includes unlimited image shrinking. Squish Pro is a one-time upgrade that unlocks denser 4×4 through 6×6 sheets when a clip needs more temporal detail.

Photo support follows the same instinct — make media smaller and easier to hand off — but video contact sheets are the reason Squish exists.

## When it earns its keep

Use Squish when:

- a clip is too long to watch or longer than an assistant can ingest,
- the question depends on what happens across time,
- someone needs to find a moment and answer with a timestamp,
- a screen recording needs to become one inspectable bug artifact,
- an AI can understand images but cannot accept the video directly.

Do not use it for a single still image or when audio is the only thing that matters. Compression is useful only when it preserves the evidence the question needs.

## What it says about the builder

I like tools that do one translation cleanly enough to disappear.

Squish does not ask the model to become a video player. It changes the input into something the model already knows how to read.

One clip in. One honest artifact out. The rest is reasoning.

Read the [guide for AI assistants](https://www.getsquish.app/for-ai-assistants) or the deeper explanation of [video contact sheets](https://www.getsquish.app/video-contact-sheet).
