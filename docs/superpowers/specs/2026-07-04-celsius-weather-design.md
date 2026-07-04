# Celsius Weather Design

## Goal

The founder HUD must display Chiang Mai weather in degrees Celsius for every
visitor, regardless of visitor locale or upstream unit selection.

## Design

- Keep `/api/weather` as the single source of truth for HUD weather.
- Request metric output from `wttr.in`.
- Normalize a valid Fahrenheit response to Celsius in the API as a fallback.
- Preserve the upstream condition icon and signed temperature formatting.
- Return `weather: null` only when the upstream response is unavailable or not
  a supported short weather string.
- Keep `FounderRow` unchanged; it renders the normalized API value.

## Verification

- Unit-test Celsius pass-through and Fahrenheit conversion.
- Run the project test suite, Astro type check, and production build.
- Record the completed change in `NEXT-SESSION.md`.

## Out of Scope

Music playback is not implemented in this change. Autoplay approaches will be
evaluated separately because browser media policies require an explicit UX
decision.
