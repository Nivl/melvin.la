# Beatmaker — Design Spec

**Date:** 2026-03-15  
**Status:** Approved  
**Route:** `/games/beatmaker`

---

## Overview

A browser-based 16-step drum sequencer added to the existing `/games` section. Entirely client-side — no backend, no hosting of audio beyond static files in `public/`. Users can program drum patterns, adjust BPM, mix per-track volume/pan/mute, switch between built-in kits, drop in custom audio files, and share patterns via a URL hash.

---

## Goals

- Fun, accessible drum sequencer playable in the browser with no install or sign-in
- Zero backend — all audio processing via Web Audio API, state in memory + URL
- Shareable patterns: full pattern state encoded in the URL hash
- Extensible: versioned sample paths make kit updates safe and cache-friendly

---

## Non-Goals

- No user accounts or saved patterns server-side
- No audio recording or export (WAV/MP3 bounce)
- No melodic/pitched instruments in v1
- No swing control in v1 (nice-to-have for later)
- No hosting of custom user audio files

---

## Route & Page Structure

Follows the same pattern as the existing Conway game.

```
src/app/[locale]/games/beatmaker/page.tsx
```

- Default export renders `<Beatmaker />`
- `generateMetadata` provides SEO title/description via `next-intl` and `getMetadata`
- i18n strings live under the `beatmaker.*` namespace in `messages/en.json` (and all other locales)

---

## State Model

```ts
type Kit = '808' | 'acoustic' | 'lofi'

type TrackId = 'kick' | 'snare' | 'hihat' | 'openhat' | 'clap' | 'ride'

interface TrackState {
  steps: boolean[]     // length matches stepCount (8 | 16 | 32)
  volume: number       // 0.0–1.0
  pan: number          // -1.0 (full left) to +1.0 (full right)
  muted: boolean
  customFile?: File    // local only — never serialised, never uploaded
}

interface BeatmakerState {
  kit: Kit
  bpm: number              // 60–200 inclusive
  stepCount: 8 | 16 | 32
  tracks: Record<TrackId, TrackState>
  isPlaying: boolean
}
```

`isPlaying` and `customFile` are excluded from URL serialisation.

---

## Audio Engine

**Location:** `src/models/beatmaker/engine.ts`

### AudioContext lifecycle
- Created lazily on the first Play press (satisfies browser autoplay policy), **or** when a custom file is dropped — whichever comes first
- Reused for the lifetime of the component; closed on unmount
- `<Beatmaker>` is a Client Component (`'use client'`)
- The play handler must always call `await audioContext.resume()` before starting the scheduler — browsers can suspend an `AudioContext` on tab blur/focus and it must be explicitly resumed

### Sample loading
- Samples are fetched via `fetch()` → `AudioContext.decodeAudioData()` → stored in `Map<string, AudioBuffer>` keyed by `"${kit}/${trackId}"`
- On kit switch: all 6 new samples fetched in parallel; cache updated; takes effect at the start of the next loop iteration
- Custom file: `File` → `FileReader.readAsArrayBuffer()` → `decodeAudioData()` → stored in the same map under a `"custom/${trackId}"` key; takes precedence over the kit sample for that track

### Scheduling
Lookahead scheduler (Chris Wilson pattern):
- `setInterval` fires every **25 ms**
- Schedules all notes that fall within the next **100 ms** window using `AudioBufferSourceNode.start(absoluteTime)`
- Guarantees tight, jitter-free timing regardless of JS garbage collection pauses

### stepCount resizing
When the user changes `stepCount`:
- **Growing** (e.g. 16 → 32): pad each track's `steps` array with `false` values at the tail
- **Shrinking** (e.g. 16 → 8): truncate each track's `steps` array at the new length
- Existing steps are always preserved within the new bounds

### Error handling
- **Sample fetch failure** (404, offline): keep the previous `AudioBuffer` for that track if one exists; if none, the track plays silently. Log via Sentry.
- **`decodeAudioData` rejection** (unsupported format, corrupt file): show a dismissible error notice on the relevant `<TrackRow>`: *"Could not decode audio file."* The track falls back to the kit sample.


```
AudioBufferSourceNode → GainNode (volume) → StereoPannerNode (pan) → AudioContext.destination
```
- Muted tracks: `GainNode.gain.value = 0` — still scheduled, output silenced
- This keeps the scheduler simple (no conditional scheduling)

---

## Static Assets & Caching

### File layout
```
public/
  samples/
    v1/
      808/
        kick.mp3  snare.mp3  hihat.mp3  openhat.mp3  clap.mp3  ride.mp3
      acoustic/
        kick.mp3  snare.mp3  hihat.mp3  openhat.mp3  clap.mp3  ride.mp3
      lofi/
        kick.mp3  snare.mp3  hihat.mp3  openhat.mp3  clap.mp3  ride.mp3
```

18 files total. All must be CC0-licensed (verified before commit).

### Cache headers
`next.config.ts` adds a custom header rule:
```ts
{
  source: '/samples/:version/:rest*',
  headers: [
    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
  ],
}
```
- Versioned paths → browsers and CDN cache for 1 year, no revalidation round-trips
- To replace a sample: move files to `v2/`, update kit definition constant — old URLs remain valid in the CDN

### Sample sourcing
- Source: [freesound.org](https://freesound.org) (CC0 licence required)
- Encode to `.mp3` for universal browser support — **iOS Safari has never supported Ogg Vorbis**, making `.ogg` a non-starter for mobile
- Each file must be documented (freesound ID + author) in `public/samples/CREDITS.md`

---

## Component Tree

```
<Beatmaker>                     ← root: state, audio engine, URL sync
  <Transport>                   ← Play/Stop button, BPM slider (60–200), step-count chips (8/16/32)
  <KitSelector>                 ← 808 / Acoustic / Lo-fi chips
  <PatternPresets>              ← preset pattern chips
  <SequencerGrid>               ← scrollable on mobile
    <TrackRow> × 6              ← step pad buttons + track label + file drop zone
  <div class="mixer">
    <MixerStrip> × 6           ← volume fader + pan slider + mute button
  <ShareBar>                    ← copy URL button + custom-sample fallback banner
```

### Mobile layout
- `<SequencerGrid>` scrolls horizontally on narrow viewports
- Mixer strips reflow below the grid in a 2-column grid on mobile

---

## URL Sharing

### Encoding
State is serialised on every change (debounced 300 ms) and written to `window.location.hash`.

**URL-safe Base64:** standard `btoa()` produces `+`, `/`, and `=` which some sharing surfaces mangle. Use URL-safe encoding: replace `+`→`-`, `/`→`_`, strip `=` padding. Decode reverses these substitutions before `atob()`.

```
/games/beatmaker#v1:<base64-encoded-json>
```

The `v1:` prefix enables future format migrations without breaking existing shared links.

Compact JSON keys (single-letter aliases) keep URLs short:
```json
{ "k": "808", "b": 120, "s": 16, "c": false,
  "t": { "kick": { "p": [...], "v": 0.8, "n": 0, "m": false }, ... } }
```

### Decoding on load
- Parse hash on mount; validate shape; fall back to "Basic Rock" preset if invalid or absent
- If decoded payload includes `"c": true` (hasCustomSamples flag): show fallback banner

### Custom-sample fallback banner
When a shared URL is opened and the original pattern used custom samples, display:

> *"This pattern used custom samples — playing with [Kit Name] instead."*

Shown as a dismissible inline notice below the `<ShareBar>`.

---

## Pattern Presets

| ID | Name | Description | stepCount |
|----|------|-------------|-----------|
| `basic-rock` | Basic Rock | Kick on beats 1 & 3, snare on 2 & 4, straight 8th hi-hats | 16 |
| `four-on-floor` | Four-on-the-Floor | Kick every beat, open hi-hat on offbeats | 16 |
| `boom-bap` | Boom-bap | Hip-hop kick/snare, syncopated 16th hi-hats | 16 |
| `trap` | Trap | Rapid 32nd hi-hats, sparse kick, heavy 808 | 32 |
| `blank` | Blank | All steps off — start from scratch | 16 |

Preset objects include a `stepCount` field. Applying a preset sets both the step grid and `stepCount`.

Default on fresh load (no URL hash): `basic-rock`.

---

## Per-track Custom Audio

- Each `<TrackRow>` has a file drop zone (click or drag-and-drop) accepting any browser-decodable audio format
- On file selection: `FileReader.readAsArrayBuffer()` → `AudioContext.decodeAudioData()` → stored in engine cache
- Custom buffers take precedence over kit samples for that track
- Custom files are session-only — refreshing the page clears them
- When any track has a custom file, the serialised URL hash includes `"c": true`

---

## Kits

| Kit | Character |
|-----|-----------|
| `808` | Punchy electronic — deep kick, sharp snare, tight hats |
| `acoustic` | Natural live-room drum kit feel |
| `lofi` | Dusty, lo-fi sampled aesthetic |

Kit is stored in state and serialised to the URL. Switching kits fetches the 6 new samples in parallel; the transition is seamless (swap takes effect at next loop start).

---

## i18n

New keys to add to all `messages/*.json` files:

```json
{
  "navbar": {
    "beatmaker": "Beatmaker"
  },
  "beatmaker": {
    "metadata": {
      "title": "Beatmaker",
      "description": "A browser-based drum machine. Program beats, adjust BPM, and share your patterns."
    },
    "transport": {
      "play": "Play",
      "stop": "Stop",
      "bpm": "BPM",
      "steps": "Steps"
    },
    "mixer": {
      "mute": "Mute",
      "volume": "Volume",
      "pan": "Pan"
    },
    "share": {
      "copyUrl": "Copy URL",
      "copied": "Copied!",
      "customSampleNotice": "This pattern used custom samples — playing with {kit} instead."
    },
    "presets": {
      "label": "Presets"
    },
    "track": {
      "dropFile": "Drop audio file"
    }
  }
}
```

---

## File Structure

```
src/
  models/beatmaker/
    types.ts          ← all TypeScript types
    kits.ts           ← kit definitions and sample URL helpers
    presets.ts        ← built-in pattern presets
    engine.ts         ← Web Audio scheduler + sample loading
    serialise.ts      ← URL hash encode/decode
    index.ts          ← barrel export

  components/Beatmaker/
    index.ts
    Beatmaker.tsx            + .test.tsx + .stories.tsx
    Transport.tsx            + .test.tsx + .stories.tsx
    SequencerGrid.tsx        + .test.tsx + .stories.tsx
    TrackRow.tsx             + .test.tsx
    MixerStrip.tsx           + .test.tsx + .stories.tsx
    KitSelector.tsx          + .test.tsx
    PatternPresets.tsx       + .test.tsx
    ShareBar.tsx             + .test.tsx

  app/[locale]/games/beatmaker/
    page.tsx

public/
  samples/
    v1/808/     ← 6 × .mp3
    v1/acoustic/ ← 6 × .mp3
    v1/lofi/    ← 6 × .mp3
    CREDITS.md  ← freesound IDs + authors
```

---

## Open Items

- [ ] Source and verify CC0 licences for all 18 sample files before committing (use `.mp3`)
- [ ] Confirm navbar i18n structure matches existing pattern in `messages/en.json`
