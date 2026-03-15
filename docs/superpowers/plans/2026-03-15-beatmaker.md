# Beatmaker Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a browser-based 16-step drum sequencer at `/games/beatmaker` with Web Audio API playback, per-track mixer, kit switching, and URL-hash sharing.

**Architecture:** Pure client-side Next.js page. A thin model layer (`models/beatmaker/`) holds pure-TypeScript logic (types, presets, serialiser). An audio engine class wraps Web Audio API with a lookahead scheduler. React components consume both via the `<Beatmaker>` root component that owns all state.

**Tech Stack:** Next.js 15 (App Router), React 19, Web Audio API, `@heroui/*` UI components, `next-intl`, Vitest + RTL (unit), Playwright (e2e).

---

## Chunk 1: Foundation — Model Layer, Page, i18n

### Task 1: State Types

**Files:**
- Create: `web/src/models/beatmaker/types.ts`

- [ ] **Step 1: Create the types file**

```typescript
// web/src/models/beatmaker/types.ts
export type Kit = '808' | 'acoustic' | 'lofi'

export type TrackId = 'kick' | 'snare' | 'hihat' | 'openhat' | 'clap' | 'ride'

export const TRACK_IDS: TrackId[] = ['kick', 'snare', 'hihat', 'openhat', 'clap', 'ride']

export const STEP_COUNTS = [8, 16, 32] as const
export type StepCount = (typeof STEP_COUNTS)[number]

export const BPM_MIN = 60
export const BPM_MAX = 200

export interface TrackState {
  steps: boolean[]
  volume: number     // 0.0–1.0
  pan: number        // -1.0 to +1.0
  muted: boolean
  customFile?: File  // session-only, never serialised
}

export interface BeatmakerState {
  kit: Kit
  bpm: number
  stepCount: StepCount
  tracks: Record<TrackId, TrackState>
  isPlaying: boolean
}
```

- [ ] **Step 2: Commit**

```bash
git add web/src/models/beatmaker/types.ts
git commit -m "feat(beatmaker): add state types"
```

---

### Task 2: Kit Definitions

**Files:**
- Create: `web/src/models/beatmaker/kits.ts`
- Create: `web/src/models/beatmaker/kits.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// web/src/models/beatmaker/kits.test.ts
import { expect, test } from 'vitest'
import { getSampleUrl, KITS } from './kits'

test('KITS contains exactly 808, acoustic, and lofi', () => {
  expect(Object.keys(KITS)).toEqual(['808', 'acoustic', 'lofi'])
})

test('getSampleUrl returns versioned path with correct extension', () => {
  expect(getSampleUrl('808', 'kick')).toBe('/samples/v1/808/kick.mp3')
  expect(getSampleUrl('lofi', 'ride')).toBe('/samples/v1/lofi/ride.mp3')
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd web && pnpm run test:unit -- kits.test
```
Expected: FAIL — `Cannot find module './kits'`

- [ ] **Step 3: Create kits.ts**

```typescript
// web/src/models/beatmaker/kits.ts
import type { Kit, TrackId } from './types'

export const SAMPLE_VERSION = 'v1'

export const KITS: Record<Kit, { label: string }> = {
  '808': { label: '808' },
  acoustic: { label: 'Acoustic' },
  lofi: { label: 'Lo-fi' },
}

export function getSampleUrl(kit: Kit, trackId: TrackId): string {
  return `/samples/${SAMPLE_VERSION}/${kit}/${trackId}.mp3`
}

export const TRACK_LABELS: Record<TrackId, string> = {
  kick: 'Kick',
  snare: 'Snare',
  hihat: 'Hi-hat',
  openhat: 'Open HH',
  clap: 'Clap',
  ride: 'Ride',
}
```

- [ ] **Step 4: Run to confirm pass**

```bash
cd web && pnpm run test:unit -- kits.test
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/models/beatmaker/kits.ts web/src/models/beatmaker/kits.test.ts
git commit -m "feat(beatmaker): add kit definitions"
```

---

### Task 3: Pattern Presets

**Files:**
- Create: `web/src/models/beatmaker/presets.ts`
- Create: `web/src/models/beatmaker/presets.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// web/src/models/beatmaker/presets.test.ts
import { expect, test } from 'vitest'
import { PRESETS, buildDefaultState } from './presets'
import { TRACK_IDS } from './types'

test('each preset has steps arrays matching its stepCount', () => {
  for (const preset of Object.values(PRESETS)) {
    for (const trackId of TRACK_IDS) {
      expect(preset.tracks[trackId].steps).toHaveLength(preset.stepCount)
    }
  }
})

test('trap preset has stepCount 32', () => {
  expect(PRESETS.trap.stepCount).toBe(32)
})

test('blank preset has all steps off', () => {
  const blank = PRESETS.blank
  for (const trackId of TRACK_IDS) {
    expect(blank.tracks[trackId].steps.every(s => !s)).toBe(true)
  }
})

test('buildDefaultState returns a valid BeatmakerState', () => {
  const state = buildDefaultState()
  expect(state.isPlaying).toBe(false)
  expect(state.bpm).toBe(120)
  expect(state.stepCount).toBe(16)
  expect(state.kit).toBe('808')
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd web && pnpm run test:unit -- presets.test
```

- [ ] **Step 3: Create presets.ts**

```typescript
// web/src/models/beatmaker/presets.ts
import type { BeatmakerState, StepCount, TrackId } from './types'
import { TRACK_IDS } from './types'

type PresetDef = Omit<BeatmakerState, 'isPlaying'>

function makeTrack(steps: boolean[]): BeatmakerState['tracks'][TrackId] {
  return { steps, volume: 0.8, pan: 0, muted: false }
}

function blank(n: number) {
  return Array<boolean>(n).fill(false)
}

// 16-step helpers: T=true, F=false
const T = true, F = false

const BASIC_ROCK: PresetDef = {
  kit: '808', bpm: 120, stepCount: 16,
  tracks: {
    kick:    makeTrack([T,F,F,F, F,F,F,F, T,F,F,F, F,F,F,F]),
    snare:   makeTrack([F,F,F,F, T,F,F,F, F,F,F,F, T,F,F,F]),
    hihat:   makeTrack([T,F,T,F, T,F,T,F, T,F,T,F, T,F,T,F]),
    openhat: makeTrack(blank(16)),
    clap:    makeTrack(blank(16)),
    ride:    makeTrack(blank(16)),
  },
}

const FOUR_ON_FLOOR: PresetDef = {
  kit: '808', bpm: 128, stepCount: 16,
  tracks: {
    kick:    makeTrack([T,F,F,F, T,F,F,F, T,F,F,F, T,F,F,F]),
    snare:   makeTrack(blank(16)),
    hihat:   makeTrack([F,F,F,F, T,F,F,F, F,F,F,F, T,F,F,F]),
    openhat: makeTrack([F,F,T,F, F,F,T,F, F,F,T,F, F,F,T,F]),
    clap:    makeTrack(blank(16)),
    ride:    makeTrack(blank(16)),
  },
}

const BOOM_BAP: PresetDef = {
  kit: '808', bpm: 90, stepCount: 16,
  tracks: {
    kick:    makeTrack([T,F,F,F, F,F,F,T, F,F,F,F, T,F,F,F]),
    snare:   makeTrack([F,F,F,F, T,F,F,F, F,F,F,F, T,F,F,F]),
    hihat:   makeTrack([T,F,T,F, T,F,T,F, T,F,T,T, T,F,T,F]),
    openhat: makeTrack(blank(16)),
    clap:    makeTrack([F,F,F,F, T,F,F,F, F,F,F,F, T,F,F,F]),
    ride:    makeTrack(blank(16)),
  },
}

// 32-step trap pattern (semiquavers)
const TRAP: PresetDef = {
  kit: '808', bpm: 140, stepCount: 32,
  tracks: {
    kick:    makeTrack([T,F,F,F, F,F,F,F, F,F,F,F, F,F,F,F, F,F,F,F, T,F,F,F, F,F,F,F, F,F,F,F]),
    snare:   makeTrack([F,F,F,F, F,F,F,F, T,F,F,F, F,F,F,F, F,F,F,F, F,F,F,F, T,F,F,F, F,F,F,F]),
    hihat:   makeTrack(Array.from({ length: 32 }, (_, i) => i % 2 === 0)),
    openhat: makeTrack(blank(32)),
    clap:    makeTrack([F,F,F,F, F,F,F,F, T,F,F,F, F,F,F,F, F,F,F,F, F,F,F,F, T,F,F,F, F,F,T,F]),
    ride:    makeTrack(blank(32)),
  },
}

const BLANK_16: PresetDef = {
  kit: '808', bpm: 120, stepCount: 16,
  tracks: Object.fromEntries(TRACK_IDS.map(id => [id, makeTrack(blank(16))])) as BeatmakerState['tracks'],
}

export const PRESETS: Record<string, PresetDef> = {
  'basic-rock': BASIC_ROCK,
  'four-on-floor': FOUR_ON_FLOOR,
  'boom-bap': BOOM_BAP,
  trap: TRAP,
  blank: BLANK_16,
}

export function buildDefaultState(): BeatmakerState {
  return { ...PRESETS['basic-rock'], isPlaying: false }
}
```

- [ ] **Step 4: Run to confirm pass**

```bash
cd web && pnpm run test:unit -- presets.test
```

- [ ] **Step 5: Commit**

```bash
git add web/src/models/beatmaker/presets.ts web/src/models/beatmaker/presets.test.ts
git commit -m "feat(beatmaker): add pattern presets"
```

---

### Task 4: URL Serialiser

**Files:**
- Create: `web/src/models/beatmaker/serialise.ts`
- Create: `web/src/models/beatmaker/serialise.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// web/src/models/beatmaker/serialise.test.ts
import { expect, test } from 'vitest'
import { decode, encode } from './serialise'
import { buildDefaultState } from './presets'
import type { BeatmakerState } from './types'

const state: BeatmakerState = buildDefaultState()

test('encode produces a string starting with "v1:"', () => {
  const hash = encode(state)
  expect(hash).toMatch(/^v1:/)
})

test('encode excludes isPlaying', () => {
  const playing = { ...state, isPlaying: true }
  const notPlaying = { ...state, isPlaying: false }
  expect(encode(playing)).toBe(encode(notPlaying))
})

test('round-trip: decode(encode(state)) reproduces state', () => {
  const hash = encode(state)
  const decoded = decode(hash)
  // isPlaying is not encoded, so compare without it
  expect(decoded?.bpm).toBe(state.bpm)
  expect(decoded?.kit).toBe(state.kit)
  expect(decoded?.stepCount).toBe(state.stepCount)
  expect(decoded?.tracks.kick.steps).toEqual(state.tracks.kick.steps)
  expect(decoded?.tracks.kick.volume).toBe(state.tracks.kick.volume)
  expect(decoded?.tracks.kick.muted).toBe(state.tracks.kick.muted)
})

test('decode returns null for garbage input', () => {
  expect(decode('garbage')).toBeNull()
  expect(decode('')).toBeNull()
  expect(decode('v1:!!notbase64!!')).toBeNull()
})

test('hasCustomSamples flag survives round-trip when true', () => {
  const hash = encode(state, true)
  const decoded = decode(hash)
  expect(decoded?.hasCustomSamples).toBe(true)
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd web && pnpm run test:unit -- serialise.test
```

- [ ] **Step 3: Create serialise.ts**

```typescript
// web/src/models/beatmaker/serialise.ts
import type { BeatmakerState, Kit, StepCount, TrackId } from './types'
import { TRACK_IDS } from './types'
import { buildDefaultState } from './presets'

// URL-safe base64: avoids +, /, = which get mangled in URLs
function toUrlBase64(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromUrlBase64(str: string): string {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4))
  return atob(b64 + pad)
}

// Compact JSON key mapping
type Compact = {
  k: Kit
  b: number
  s: StepCount
  c?: boolean
  t: Record<TrackId, { p: boolean[]; v: number; n: number; m: boolean }>
}

export function encode(state: BeatmakerState, hasCustomSamples = false): string {
  const compact: Compact = {
    k: state.kit,
    b: state.bpm,
    s: state.stepCount,
    t: Object.fromEntries(
      TRACK_IDS.map(id => [
        id,
        {
          p: state.tracks[id].steps,
          v: state.tracks[id].volume,
          n: state.tracks[id].pan,
          m: state.tracks[id].muted,
        },
      ])
    ) as Compact['t'],
  }
  if (hasCustomSamples) compact.c = true
  return `v1:${toUrlBase64(JSON.stringify(compact))}`
}

type DecodedState = Omit<BeatmakerState, 'isPlaying'> & { hasCustomSamples: boolean }

export function decode(hash: string): DecodedState | null {
  try {
    if (!hash.startsWith('v1:')) return null
    const json = fromUrlBase64(hash.slice(3))
    const compact = JSON.parse(json) as Compact

    if (!compact.k || !compact.b || !compact.s || !compact.t) return null

    const defaults = buildDefaultState()

    return {
      kit: compact.k,
      bpm: compact.b,
      stepCount: compact.s,
      hasCustomSamples: compact.c ?? false,
      tracks: Object.fromEntries(
        TRACK_IDS.map(id => {
          const t = compact.t[id]
          if (!t) return [id, defaults.tracks[id]]
          return [
            id,
            {
              steps: t.p,
              volume: t.v,
              pan: t.n,
              muted: t.m,
              customFile: undefined,
            },
          ]
        })
      ) as BeatmakerState['tracks'],
    }
  } catch {
    return null
  }
}
```

- [ ] **Step 4: Run to confirm pass**

```bash
cd web && pnpm run test:unit -- serialise.test
```

- [ ] **Step 5: Commit**

```bash
git add web/src/models/beatmaker/serialise.ts web/src/models/beatmaker/serialise.test.ts
git commit -m "feat(beatmaker): add URL serialiser"
```

---

### Task 5: Barrel Export

**Files:**
- Create: `web/src/models/beatmaker/index.ts`

- [ ] **Step 1: Create the barrel**

```typescript
// web/src/models/beatmaker/index.ts
export * from './types'
export * from './kits'
export * from './presets'
export * from './serialise'
```

- [ ] **Step 2: Commit**

```bash
git add web/src/models/beatmaker/index.ts
git commit -m "feat(beatmaker): add model barrel export"
```

---

### Task 6: Static Assets + Cache Headers

**Files:**
- Create: `public/samples/v1/808/.gitkeep`, `public/samples/v1/acoustic/.gitkeep`, `public/samples/v1/lofi/.gitkeep`
- Create: `public/samples/CREDITS.md`
- Modify: `web/next.config.ts`

> **⚠️ Manual step:** Source 18 CC0-licensed `.mp3` files from [freesound.org](https://freesound.org) — one per track per kit. Record each file's Freesound ID and author in `CREDITS.md` before committing audio files.

- [ ] **Step 1: Create sample directory placeholders**

```bash
mkdir -p web/public/samples/v1/808 web/public/samples/v1/acoustic web/public/samples/v1/lofi
touch web/public/samples/v1/808/.gitkeep web/public/samples/v1/acoustic/.gitkeep web/public/samples/v1/lofi/.gitkeep
```

- [ ] **Step 2: Create CREDITS.md**

```markdown
# Sample Credits

All samples are CC0 licensed from [freesound.org](https://freesound.org).

## 808 Kit

| Track   | Freesound ID | Author |
|---------|-------------|--------|
| kick    | TODO        | TODO   |
| snare   | TODO        | TODO   |
| hihat   | TODO        | TODO   |
| openhat | TODO        | TODO   |
| clap    | TODO        | TODO   |
| ride    | TODO        | TODO   |

## Acoustic Kit

| Track   | Freesound ID | Author |
|---------|-------------|--------|
| kick    | TODO        | TODO   |
| snare   | TODO        | TODO   |
| hihat   | TODO        | TODO   |
| openhat | TODO        | TODO   |
| clap    | TODO        | TODO   |
| ride    | TODO        | TODO   |

## Lo-fi Kit

| Track   | Freesound ID | Author |
|---------|-------------|--------|
| kick    | TODO        | TODO   |
| snare   | TODO        | TODO   |
| hihat   | TODO        | TODO   |
| openhat | TODO        | TODO   |
| clap    | TODO        | TODO   |
| ride    | TODO        | TODO   |
```

Save to `web/public/samples/CREDITS.md`.

- [ ] **Step 3: Add cache headers to next.config.ts**

Open `web/next.config.ts`. Add a `headers` async function inside the `nextConfig` object (before the closing `}`):

```typescript
// Inside nextConfig object, add:
async headers() {
  return [
    {
      source: '/samples/:version/:rest*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ]
},
```

- [ ] **Step 4: Verify config builds without errors**

```bash
cd web && pnpm run build 2>&1 | tail -20
```
Expected: build succeeds (or shows only expected warnings).

- [ ] **Step 5: Commit**

```bash
git add web/public/samples web/next.config.ts
git commit -m "feat(beatmaker): add sample dirs, CREDITS, and cache headers"
```

---

### Task 7: Page Route + i18n

**Files:**
- Create: `web/src/app/[locale]/games/beatmaker/page.tsx`
- Modify: `web/messages/en.json` (and es, fr, ja, ko, zh-tw, zh)
- Modify: `web/src/components/layout/NavBar/Navbar.tsx`

- [ ] **Step 1: Add i18n keys to en.json**

In `web/messages/en.json`, add:
1. Inside `"navbar"`: `"beatmaker": "Beatmaker"`
2. A new top-level `"beatmaker"` namespace:

```json
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
```

- [ ] **Step 2: Add translated keys to all other locale files**

For each of `es.json`, `fr.json`, `ja.json`, `ko.json`, `zh-tw.json`, `zh.json`:
- Add `"beatmaker": "Beatmaker"` inside the `"navbar"` object
- Add the full `"beatmaker"` namespace (use the English strings as placeholder — a human translator or AI can refine them later)

- [ ] **Step 3: Regenerate next-intl type declarations**

```bash
cd web && pnpm run build 2>&1 | grep -E "(error|warning)" | head -10
```

The `en.d.json.ts` file is auto-generated — do **not** edit it by hand. If the build fails with a type error about missing keys, run the build once to regenerate it.

- [ ] **Step 4: Add Beatmaker entry to the navbar**

In `web/src/components/layout/NavBar/Navbar.tsx`, find the `games` group items array and add after the `conway` entry:

```typescript
{
  key: 'beatmaker',
  labelKey: 'beatmaker',
  path: 'beatmaker',
  logo: <BeatmakerIcon className="h-5 w-5" />,
},
```

Create a simple placeholder icon (can be replaced with a real SVG later). Add the import near the top of the file:

```typescript
// Temporary placeholder icon — replace with proper SVG icon
const BeatmakerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
)
```

- [ ] **Step 5: Create the page route**

```typescript
// web/src/app/[locale]/games/beatmaker/page.tsx
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Beatmaker } from '#components/Beatmaker'
import { getMetadata } from '#utils/metadata'

export default function BeatmakerPage() {
  return <Beatmaker />
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'beatmaker.metadata' })

  return await getMetadata({
    locale,
    pageUrl: '/games/beatmaker',
    title: t('title'),
    description: t('description'),
  })
}
```

- [ ] **Step 6: Create empty component barrel (so the page can compile)**

```typescript
// web/src/components/Beatmaker/index.ts
export { Beatmaker } from './Beatmaker'
```

```typescript
// web/src/components/Beatmaker/Beatmaker.tsx
'use client'
export function Beatmaker() {
  return <div data-testid="beatmaker">Coming soon</div>
}
```

- [ ] **Step 7: Verify page renders in dev**

```bash
cd web && pnpm run build 2>&1 | tail -20
```
Expected: build succeeds; `/games/beatmaker` route is listed.

- [ ] **Step 8: Commit**

```bash
git add web/src/app/[locale]/games/beatmaker/page.tsx \
        web/src/components/Beatmaker/index.ts \
        web/src/components/Beatmaker/Beatmaker.tsx \
        web/messages/ \
        web/src/components/layout/NavBar/Navbar.tsx
git commit -m "feat(beatmaker): add page route, i18n strings, navbar entry"
```

---

## Chunk 2: Audio Engine

### Task 8: Audio Engine

**Files:**
- Create: `web/src/models/beatmaker/engine.ts`
- Create: `web/src/models/beatmaker/engine.test.ts`

The engine owns `AudioContext`, the sample buffer cache, and the lookahead scheduler. It is created once per `<Beatmaker>` mount and disposed on unmount. It does **not** hold a reference to React state — the scheduler calls a `getState()` callback on every tick so it always reads the latest values.

- [ ] **Step 1: Write the failing tests**

```typescript
// web/src/models/beatmaker/engine.test.ts
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createEngine } from './engine'

// ── Mock Web Audio API ─────────────────────────────────────────────────────

const mockStart = vi.fn()
const mockConnect = vi.fn()
const mockCreateBufferSource = vi.fn(() => ({
  buffer: null as AudioBuffer | null,
  connect: mockConnect,
  start: mockStart,
  onended: null as (() => void) | null,
}))
const mockGainNode = { gain: { value: 0 }, connect: mockConnect }
const mockPanNode = { pan: { value: 0 }, connect: mockConnect }
const mockCreateGain = vi.fn(() => mockGainNode)
const mockCreateStereoPanner = vi.fn(() => mockPanNode)
const mockDecodeAudioData = vi.fn().mockResolvedValue({} as AudioBuffer)
const mockResume = vi.fn().mockResolvedValue(undefined)
const mockClose = vi.fn().mockResolvedValue(undefined)

const mockCtx = {
  createBufferSource: mockCreateBufferSource,
  createGain: mockCreateGain,
  createStereoPanner: mockCreateStereoPanner,
  decodeAudioData: mockDecodeAudioData,
  destination: {},
  currentTime: 0,
  state: 'running' as AudioContextState,
  resume: mockResume,
  close: mockClose,
}

beforeEach(() => {
  vi.stubGlobal('AudioContext', vi.fn(() => mockCtx))
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    })
  )
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

// ── Tests ──────────────────────────────────────────────────────────────────

describe('createEngine', () => {
  test('does not create AudioContext on construction', () => {
    createEngine()
    expect(vi.mocked(AudioContext)).not.toHaveBeenCalled()
  })

  test('init() creates AudioContext and resumes it', async () => {
    const engine = createEngine()
    await engine.init()
    expect(vi.mocked(AudioContext)).toHaveBeenCalledTimes(1)
    expect(mockResume).toHaveBeenCalledTimes(1)
  })

  test('init() called twice reuses the same context', async () => {
    const engine = createEngine()
    await engine.init()
    await engine.init()
    expect(vi.mocked(AudioContext)).toHaveBeenCalledTimes(1)
  })

test('loadKit() fetches 6 samples', async () => {
    const engine = createEngine()
    await engine.loadKit('808')
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(6)
  })

  test('dispose() closes the AudioContext', async () => {
    const engine = createEngine()
    await engine.init()
    engine.dispose()
    expect(mockClose).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd web && pnpm run test:unit -- engine.test
```
Expected: FAIL — `Cannot find module './engine'`

- [ ] **Step 3: Implement engine.ts**

```typescript
// web/src/models/beatmaker/engine.ts
import type { BeatmakerState, Kit, TrackId } from './types'
import { TRACK_IDS } from './types'
import { getSampleUrl } from './kits'

const SCHEDULE_INTERVAL_MS = 25
const LOOKAHEAD_SECONDS = 0.1

export interface Engine {
  /** Must be called before any playback. Safe to call multiple times. */
  init(): Promise<void>
  loadKit(kit: Kit): Promise<void>
  loadCustomFile(trackId: TrackId, file: File): Promise<void>
  start(getState: () => BeatmakerState): void
  stop(): void
  dispose(): void
}

export function createEngine(onError: (err: Error) => void = () => {}): Engine {
  let ctx: AudioContext | null = null
  const buffers = new Map<string, AudioBuffer>()
  let schedulerTimer: ReturnType<typeof setInterval> | null = null
  let currentStep = 0
  let nextNoteTime = 0

  async function init(): Promise<void> {
    if (ctx) {
      await ctx.resume()
      return
    }
    ctx = new AudioContext()
    await ctx.resume()
  }

  async function loadKit(kit: Kit): Promise<void> {
    // Ensure context exists — kit preloads may happen before first user gesture
    if (!ctx) await init()
    await Promise.all(
      TRACK_IDS.map(async trackId => {
        const url = getSampleUrl(kit, trackId)
        try {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const arrayBuf = await res.arrayBuffer()
          const audioBuf = await ctx!.decodeAudioData(arrayBuf)
          buffers.set(`${kit}/${trackId}`, audioBuf)
        } catch (err) {
          // Keep existing buffer if present; otherwise track plays silently
          onError(err instanceof Error ? err : new Error(String(err)))
        }
      })
    )
  }

  async function loadCustomFile(trackId: TrackId, file: File): Promise<void> {
    if (!ctx) await init()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const arrayBuf = reader.result as ArrayBuffer
          const audioBuf = await ctx!.decodeAudioData(arrayBuf)
          buffers.set(`custom/${trackId}`, audioBuf)
          resolve()
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(file)
    })
  }

  function getBuffer(state: BeatmakerState, trackId: TrackId): AudioBuffer | null {
    return (
      buffers.get(`custom/${trackId}`) ??
      buffers.get(`${state.kit}/${trackId}`) ??
      null
    )
  }

  function scheduleNote(
    state: BeatmakerState,
    trackId: TrackId,
    time: number
  ): void {
    if (!ctx) return
    const track = state.tracks[trackId]
    const buffer = getBuffer(state, trackId)
    if (!buffer) return

    const src = ctx.createBufferSource()
    src.buffer = buffer

    const gain = ctx.createGain()
    gain.gain.value = track.muted ? 0 : track.volume

    const panner = ctx.createStereoPanner()
    panner.pan.value = track.pan

    src.connect(gain)
    gain.connect(panner)
    panner.connect(ctx.destination)

    src.start(time)
  }

  function scheduler(getState: () => BeatmakerState): void {
    if (!ctx) return
    const state = getState()
    const secondsPerBeat = 60 / state.bpm
    const secondsPerStep = secondsPerBeat / 4 // 16th-note grid

    while (nextNoteTime < ctx.currentTime + LOOKAHEAD_SECONDS) {
      const step = currentStep % state.stepCount
      for (const trackId of TRACK_IDS) {
        if (state.tracks[trackId].steps[step]) {
          scheduleNote(state, trackId, nextNoteTime)
        }
      }
      currentStep++
      nextNoteTime += secondsPerStep
    }
  }

  function start(getState: () => BeatmakerState): void {
    if (schedulerTimer !== null) return
    if (!ctx) return
    currentStep = 0
    nextNoteTime = ctx.currentTime
    schedulerTimer = setInterval(() => scheduler(getState), SCHEDULE_INTERVAL_MS)
  }

  function stop(): void {
    if (schedulerTimer !== null) {
      clearInterval(schedulerTimer)
      schedulerTimer = null
    }
    currentStep = 0
  }

  function dispose(): void {
    stop()
    ctx?.close()
    ctx = null
  }

  return { init, loadKit, loadCustomFile, start, stop, dispose }
}
```

- [ ] **Step 4: Run to confirm pass**

```bash
cd web && pnpm run test:unit -- engine.test
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/models/beatmaker/engine.ts web/src/models/beatmaker/engine.test.ts
git commit -m "feat(beatmaker): implement audio engine with lookahead scheduler"
```

---

## Chunk 3: UI Components

### Task 9: Transport Component

**Files:**
- Create: `web/src/components/Beatmaker/Transport.tsx`
- Create: `web/src/components/Beatmaker/Transport.test.tsx`

- [ ] **Step 1: Write the failing tests**

```typescript
// web/src/components/Beatmaker/Transport.test.tsx
import { cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { testWrapper as wrapper } from '#utils/tests'
import { Transport } from './Transport'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const defaultProps = {
  isPlaying: false,
  bpm: 120,
  stepCount: 16 as const,
  onPlayToggle: vi.fn(),
  onBpmChange: vi.fn(),
  onStepCountChange: vi.fn(),
}

test('renders Play button when not playing', () => {
  const { getByRole } = render(<Transport {...defaultProps} />, { wrapper })
  expect(getByRole('button', { name: 'Play' })).toBeDefined()
})

test('renders Stop button when playing', () => {
  const { getByRole } = render(
    <Transport {...defaultProps} isPlaying />, { wrapper }
  )
  expect(getByRole('button', { name: 'Stop' })).toBeDefined()
})

test('calls onPlayToggle when Play button clicked', async () => {
  const user = userEvent.setup()
  const onPlayToggle = vi.fn()
  const { getByRole } = render(
    <Transport {...defaultProps} onPlayToggle={onPlayToggle} />, { wrapper }
  )
  await user.click(getByRole('button', { name: 'Play' }))
  expect(onPlayToggle).toHaveBeenCalledTimes(1)
})

test('renders step count chips for 8, 16, 32', () => {
  const { getByRole } = render(<Transport {...defaultProps} />, { wrapper })
  expect(getByRole('button', { name: '8' })).toBeDefined()
  expect(getByRole('button', { name: '16' })).toBeDefined()
  expect(getByRole('button', { name: '32' })).toBeDefined()
})

test('calls onStepCountChange when a step chip is clicked', async () => {
  const user = userEvent.setup()
  const onStepCountChange = vi.fn()
  const { getByRole } = render(
    <Transport {...defaultProps} onStepCountChange={onStepCountChange} />,
    { wrapper }
  )
  await user.click(getByRole('button', { name: '32' }))
  expect(onStepCountChange).toHaveBeenCalledWith(32)
})

test('BPM slider is present with correct label', () => {
  const { getByLabelText } = render(<Transport {...defaultProps} />, { wrapper })
  expect(getByLabelText('BPM', { selector: 'input' })).toBeDefined()
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd web && pnpm run test:unit -- Transport.test
```

- [ ] **Step 3: Implement Transport.tsx**

```typescript
// web/src/components/Beatmaker/Transport.tsx
'use client'
import { Button } from '@heroui/button'
import { Slider } from '@heroui/slider'
import { useTranslations } from 'next-intl'
import { FaPause as PauseIcon, FaPlay as PlayIcon } from 'react-icons/fa6'

import { BPM_MAX, BPM_MIN, STEP_COUNTS, type StepCount } from '#models/beatmaker'

interface TransportProps {
  isPlaying: boolean
  bpm: number
  stepCount: StepCount
  onPlayToggle: () => void
  onBpmChange: (bpm: number) => void
  onStepCountChange: (steps: StepCount) => void
}

export function Transport({
  isPlaying,
  bpm,
  stepCount,
  onPlayToggle,
  onBpmChange,
  onStepCountChange,
}: TransportProps) {
  const t = useTranslations('beatmaker.transport')

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button
        isIconOnly={false}
        color={isPlaying ? 'danger' : 'primary'}
        onPress={onPlayToggle}
        startContent={isPlaying ? <PauseIcon /> : <PlayIcon />}
      >
        {isPlaying ? t('stop') : t('play')}
      </Button>

      <Slider
        label={t('bpm')}
        minValue={BPM_MIN}
        maxValue={BPM_MAX}
        step={1}
        value={bpm}
        onChange={v => onBpmChange(v as number)}
        className="w-48"
      />

      <div className="flex items-center gap-1">
        <span className="text-sm text-default-500">{t('steps')}</span>
        {STEP_COUNTS.map(n => (
          <Button
            key={n}
            size="sm"
            variant={stepCount === n ? 'solid' : 'bordered'}
            onPress={() => onStepCountChange(n)}
          >
            {n}
          </Button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run to confirm pass**

```bash
cd web && pnpm run test:unit -- Transport.test
```

- [ ] **Step 5: Commit**

```bash
git add web/src/components/Beatmaker/Transport.tsx \
        web/src/components/Beatmaker/Transport.test.tsx
git commit -m "feat(beatmaker): add Transport component"
```

---

### Task 10: KitSelector + PatternPresets

**Files:**
- Create: `web/src/components/Beatmaker/KitSelector.tsx`
- Create: `web/src/components/Beatmaker/KitSelector.test.tsx`
- Create: `web/src/components/Beatmaker/PatternPresets.tsx`
- Create: `web/src/components/Beatmaker/PatternPresets.test.tsx`

- [ ] **Step 1: Write failing tests for KitSelector**

```typescript
// web/src/components/Beatmaker/KitSelector.test.tsx
import { cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { testWrapper as wrapper } from '#utils/tests'
import { KitSelector } from './KitSelector'

afterEach(() => { cleanup(); vi.restoreAllMocks() })

test('renders a button for each kit', () => {
  const { getByRole } = render(
    <KitSelector activeKit="808" onKitChange={vi.fn()} />, { wrapper }
  )
  expect(getByRole('button', { name: '808' })).toBeDefined()
  expect(getByRole('button', { name: 'Acoustic' })).toBeDefined()
  expect(getByRole('button', { name: 'Lo-fi' })).toBeDefined()
})

test('calls onKitChange with kit id on click', async () => {
  const user = userEvent.setup()
  const onKitChange = vi.fn()
  const { getByRole } = render(
    <KitSelector activeKit="808" onKitChange={onKitChange} />, { wrapper }
  )
  await user.click(getByRole('button', { name: 'Acoustic' }))
  expect(onKitChange).toHaveBeenCalledWith('acoustic')
})
```

- [ ] **Step 2: Write failing tests for PatternPresets**

```typescript
// web/src/components/Beatmaker/PatternPresets.test.tsx
import { cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { testWrapper as wrapper } from '#utils/tests'
import { PatternPresets } from './PatternPresets'

afterEach(() => { cleanup(); vi.restoreAllMocks() })

test('renders all preset buttons', () => {
  const { getByRole } = render(<PatternPresets onPresetSelect={vi.fn()} />, { wrapper })
  expect(getByRole('button', { name: 'Basic Rock' })).toBeDefined()
  expect(getByRole('button', { name: 'Blank' })).toBeDefined()
})

test('calls onPresetSelect with preset id on click', async () => {
  const user = userEvent.setup()
  const onPresetSelect = vi.fn()
  const { getByRole } = render(
    <PatternPresets onPresetSelect={onPresetSelect} />, { wrapper }
  )
  await user.click(getByRole('button', { name: 'Blank' }))
  expect(onPresetSelect).toHaveBeenCalledWith('blank')
})
```

- [ ] **Step 3: Run to confirm failures**

```bash
cd web && pnpm run test:unit -- KitSelector.test PatternPresets.test
```

- [ ] **Step 4: Implement KitSelector.tsx**

```typescript
// web/src/components/Beatmaker/KitSelector.tsx
'use client'
import { Button } from '@heroui/button'
import { KITS, type Kit } from '#models/beatmaker'

interface KitSelectorProps {
  activeKit: Kit
  onKitChange: (kit: Kit) => void
}

export function KitSelector({ activeKit, onKitChange }: KitSelectorProps) {
  return (
    <div className="flex gap-2">
      {(Object.entries(KITS) as [Kit, { label: string }][]).map(([id, { label }]) => (
        <Button
          key={id}
          size="sm"
          variant={activeKit === id ? 'solid' : 'bordered'}
          onPress={() => onKitChange(id)}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Implement PatternPresets.tsx**

```typescript
// web/src/components/Beatmaker/PatternPresets.tsx
'use client'
import { Button } from '@heroui/button'
import { useTranslations } from 'next-intl'
import { PRESETS } from '#models/beatmaker'

const PRESET_LABELS: Record<string, string> = {
  'basic-rock': 'Basic Rock',
  'four-on-floor': 'Four-on-the-Floor',
  'boom-bap': 'Boom-bap',
  trap: 'Trap',
  blank: 'Blank',
}

interface PatternPresetsProps {
  onPresetSelect: (presetId: string) => void
}

export function PatternPresets({ onPresetSelect }: PatternPresetsProps) {
  const t = useTranslations('beatmaker.presets')

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-default-500">{t('label')}</span>
      {Object.keys(PRESETS).map(id => (
        <Button
          key={id}
          size="sm"
          variant="bordered"
          onPress={() => onPresetSelect(id)}
        >
          {PRESET_LABELS[id] ?? id}
        </Button>
      ))}
    </div>
  )
}
```

- [ ] **Step 6: Run to confirm pass**

```bash
cd web && pnpm run test:unit -- KitSelector.test PatternPresets.test
```

- [ ] **Step 7: Commit**

```bash
git add web/src/components/Beatmaker/KitSelector.tsx \
        web/src/components/Beatmaker/KitSelector.test.tsx \
        web/src/components/Beatmaker/PatternPresets.tsx \
        web/src/components/Beatmaker/PatternPresets.test.tsx
git commit -m "feat(beatmaker): add KitSelector and PatternPresets"
```

---

### Task 11: MixerStrip

**Files:**
- Create: `web/src/components/Beatmaker/MixerStrip.tsx`
- Create: `web/src/components/Beatmaker/MixerStrip.test.tsx`

- [ ] **Step 1: Write failing tests**

```typescript
// web/src/components/Beatmaker/MixerStrip.test.tsx
import { cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { testWrapper as wrapper } from '#utils/tests'
import { MixerStrip } from './MixerStrip'

afterEach(() => { cleanup(); vi.restoreAllMocks() })

const defaultProps = {
  trackId: 'kick' as const,
  volume: 0.8,
  pan: 0,
  muted: false,
  onVolumeChange: vi.fn(),
  onPanChange: vi.fn(),
  onMuteToggle: vi.fn(),
}

test('renders volume and pan sliders', () => {
  const { getByLabelText } = render(<MixerStrip {...defaultProps} />, { wrapper })
  expect(getByLabelText('Volume', { selector: 'input' })).toBeDefined()
  expect(getByLabelText('Pan', { selector: 'input' })).toBeDefined()
})

test('renders mute button', () => {
  const { getByRole } = render(<MixerStrip {...defaultProps} />, { wrapper })
  expect(getByRole('button', { name: 'Mute' })).toBeDefined()
})

test('calls onMuteToggle when mute button pressed', async () => {
  const user = userEvent.setup()
  const onMuteToggle = vi.fn()
  const { getByRole } = render(
    <MixerStrip {...defaultProps} onMuteToggle={onMuteToggle} />, { wrapper }
  )
  await user.click(getByRole('button', { name: 'Mute' }))
  expect(onMuteToggle).toHaveBeenCalledTimes(1)
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd web && pnpm run test:unit -- MixerStrip.test
```

- [ ] **Step 3: Implement MixerStrip.tsx**

```typescript
// web/src/components/Beatmaker/MixerStrip.tsx
'use client'
import { Button } from '@heroui/button'
import { Slider } from '@heroui/slider'
import { useTranslations } from 'next-intl'
import type { TrackId } from '#models/beatmaker'

interface MixerStripProps {
  trackId: TrackId
  volume: number
  pan: number
  muted: boolean
  onVolumeChange: (v: number) => void
  onPanChange: (v: number) => void
  onMuteToggle: () => void
}

export function MixerStrip({
  trackId,
  volume,
  pan,
  muted,
  onVolumeChange,
  onPanChange,
  onMuteToggle,
}: MixerStripProps) {
  const t = useTranslations('beatmaker.mixer')

  return (
    <div className="flex flex-col items-center gap-1 px-1" data-track={trackId}>
      <Slider
        label={t('volume')}
        minValue={0}
        maxValue={1}
        step={0.01}
        value={volume}
        onChange={v => onVolumeChange(v as number)}
        orientation="vertical"
        size="sm"
        className="h-24"
      />
      <Slider
        label={t('pan')}
        minValue={-1}
        maxValue={1}
        step={0.01}
        value={pan}
        onChange={v => onPanChange(v as number)}
        size="sm"
        className="w-16"
      />
      <Button
        size="sm"
        variant={muted ? 'solid' : 'bordered'}
        color={muted ? 'warning' : 'default'}
        onPress={onMuteToggle}
      >
        {t('mute')}
      </Button>
    </div>
  )
}
```

- [ ] **Step 4: Run to confirm pass**

```bash
cd web && pnpm run test:unit -- MixerStrip.test
```

- [ ] **Step 5: Commit**

```bash
git add web/src/components/Beatmaker/MixerStrip.tsx \
        web/src/components/Beatmaker/MixerStrip.test.tsx
git commit -m "feat(beatmaker): add MixerStrip component"
```

---

### Task 12: TrackRow

**Files:**
- Create: `web/src/components/Beatmaker/TrackRow.tsx`
- Create: `web/src/components/Beatmaker/TrackRow.test.tsx`

- [ ] **Step 1: Write failing tests**

```typescript
// web/src/components/Beatmaker/TrackRow.test.tsx
import { cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { testWrapper as wrapper } from '#utils/tests'
import { TrackRow } from './TrackRow'

afterEach(() => { cleanup(); vi.restoreAllMocks() })

const steps16 = Array<boolean>(16).fill(false)

const defaultProps = {
  trackId: 'kick' as const,
  steps: steps16,
  onStepToggle: vi.fn(),
  onFileLoad: vi.fn(),
  hasCustomFile: false,
  decodeError: undefined as string | undefined,
}

test('renders 16 step buttons', () => {
  const { getAllByRole } = render(<TrackRow {...defaultProps} />, { wrapper })
  // Each step is a button; the file-drop zone label may also be a button, so filter by aria-pressed
  const stepBtns = getAllByRole('button').filter(
    btn => btn.getAttribute('aria-pressed') !== null
  )
  expect(stepBtns).toHaveLength(16)
})

test('toggles step on click', async () => {
  const user = userEvent.setup()
  const onStepToggle = vi.fn()
  const { getAllByRole } = render(
    <TrackRow {...defaultProps} onStepToggle={onStepToggle} />, { wrapper }
  )
  const stepBtns = getAllByRole('button').filter(
    btn => btn.getAttribute('aria-pressed') !== null
  )
  await user.click(stepBtns[0])
  expect(onStepToggle).toHaveBeenCalledWith(0)
})

test('active steps have aria-pressed="true"', () => {
  const activeSteps = steps16.map((_, i) => i === 3)
  const { getAllByRole } = render(
    <TrackRow {...defaultProps} steps={activeSteps} />, { wrapper }
  )
  const stepBtns = getAllByRole('button').filter(
    btn => btn.getAttribute('aria-pressed') !== null
  )
  expect(stepBtns[3].getAttribute('aria-pressed')).toBe('true')
  expect(stepBtns[0].getAttribute('aria-pressed')).toBe('false')
})

test('shows decode error when provided', () => {
  const { getByText } = render(
    <TrackRow {...defaultProps} decodeError="Could not decode audio file." />,
    { wrapper }
  )
  expect(getByText('Could not decode audio file.')).toBeDefined()
})

test('clicking the drop zone label triggers file selection (calls onFileLoad via change)', async () => {
  const user = userEvent.setup()
  const onFileLoad = vi.fn()
  const file = new File(['audio'], 'kick.mp3', { type: 'audio/mpeg' })
  const { container } = render(
    <TrackRow {...defaultProps} onFileLoad={onFileLoad} />, { wrapper }
  )
  const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
  await user.upload(fileInput, file)
  expect(onFileLoad).toHaveBeenCalledWith(file)
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd web && pnpm run test:unit -- TrackRow.test
```

- [ ] **Step 3: Implement TrackRow.tsx**

```typescript
// web/src/components/Beatmaker/TrackRow.tsx
'use client'
import { Button } from '@heroui/button'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import { TRACK_LABELS, type TrackId } from '#models/beatmaker'

interface TrackRowProps {
  trackId: TrackId
  steps: boolean[]
  onStepToggle: (index: number) => void
  onFileLoad: (file: File) => void
  hasCustomFile: boolean
  decodeError?: string
}

export function TrackRow({
  trackId,
  steps,
  onStepToggle,
  onFileLoad,
  hasCustomFile,
  decodeError,
}: TrackRowProps) {
  const t = useTranslations('beatmaker.track')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onFileLoad(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFileLoad(file)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Track label + file drop zone */}
      <div
        className="w-20 cursor-pointer select-none rounded border border-dashed border-default-300 px-2 py-1 text-center text-xs hover:border-primary"
        title={hasCustomFile ? 'Custom file loaded' : t('dropFile')}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        {TRACK_LABELS[trackId]}
        {hasCustomFile && <span className="ml-1 text-primary">●</span>}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {/* Step buttons */}
      <div className="flex flex-1 gap-0.5 overflow-x-auto">
        {steps.map((active, i) => (
          <button
            key={i}
            aria-pressed={active}
            className={[
              'h-9 w-9 shrink-0 rounded border transition-colors',
              active
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-default-300 bg-default-100 hover:bg-default-200',
              // Subtle beat grouping: every 4 steps slightly brighter border
              i % 4 === 0 ? 'border-default-400' : '',
            ].join(' ')}
            onClick={() => onStepToggle(i)}
            tabIndex={0}
          />
        ))}
      </div>

      {decodeError && (
        <p className="ml-2 text-xs text-danger">{decodeError}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run to confirm pass**

```bash
cd web && pnpm run test:unit -- TrackRow.test
```

- [ ] **Step 5: Commit**

```bash
git add web/src/components/Beatmaker/TrackRow.tsx \
        web/src/components/Beatmaker/TrackRow.test.tsx
git commit -m "feat(beatmaker): add TrackRow with file drop"
```

---

### Task 13: SequencerGrid

**Files:**
- Create: `web/src/components/Beatmaker/SequencerGrid.tsx`
- Create: `web/src/components/Beatmaker/SequencerGrid.test.tsx`

- [ ] **Step 1: Write failing tests**

```typescript
// web/src/components/Beatmaker/SequencerGrid.test.tsx
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { testWrapper as wrapper } from '#utils/tests'
import { buildDefaultState } from '#models/beatmaker'
import { SequencerGrid } from './SequencerGrid'

afterEach(() => { cleanup(); vi.restoreAllMocks() })

const state = buildDefaultState()

const defaultProps = {
  tracks: state.tracks,
  stepCount: state.stepCount,
  onStepToggle: vi.fn(),
  onFileLoad: vi.fn(),
  decodeErrors: {} as Record<string, string>,
}

test('renders one row per track (6 rows)', () => {
  const { getAllByRole } = render(<SequencerGrid {...defaultProps} />, { wrapper })
  const stepBtns = getAllByRole('button').filter(
    btn => btn.getAttribute('aria-pressed') !== null
  )
  // 6 tracks × 16 steps = 96 step buttons
  expect(stepBtns).toHaveLength(6 * 16)
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd web && pnpm run test:unit -- SequencerGrid.test
```

- [ ] **Step 3: Implement SequencerGrid.tsx**

```typescript
// web/src/components/Beatmaker/SequencerGrid.tsx
'use client'
import type { BeatmakerState, StepCount, TrackId } from '#models/beatmaker'
import { TRACK_IDS } from '#models/beatmaker'
import { TrackRow } from './TrackRow'

interface SequencerGridProps {
  tracks: BeatmakerState['tracks']
  stepCount: StepCount
  onStepToggle: (trackId: TrackId, index: number) => void
  onFileLoad: (trackId: TrackId, file: File) => void
  decodeErrors: Partial<Record<TrackId, string>>
}

export function SequencerGrid({
  tracks,
  stepCount,
  onStepToggle,
  onFileLoad,
  decodeErrors,
}: SequencerGridProps) {
  return (
    <div className="flex flex-col gap-1 overflow-x-auto">
      {TRACK_IDS.map(trackId => (
        <TrackRow
          key={trackId}
          trackId={trackId}
          steps={tracks[trackId].steps}
          onStepToggle={index => onStepToggle(trackId, index)}
          onFileLoad={file => onFileLoad(trackId, file)}
          hasCustomFile={!!tracks[trackId].customFile}
          decodeError={decodeErrors[trackId]}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run to confirm pass**

```bash
cd web && pnpm run test:unit -- SequencerGrid.test
```

- [ ] **Step 5: Commit**

```bash
git add web/src/components/Beatmaker/SequencerGrid.tsx \
        web/src/components/Beatmaker/SequencerGrid.test.tsx
git commit -m "feat(beatmaker): add SequencerGrid component"
```

---

### Task 14: ShareBar

**Files:**
- Create: `web/src/components/Beatmaker/ShareBar.tsx`
- Create: `web/src/components/Beatmaker/ShareBar.test.tsx`

- [ ] **Step 1: Write failing tests**

```typescript
// web/src/components/Beatmaker/ShareBar.test.tsx
import { cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { testWrapper as wrapper } from '#utils/tests'
import { ShareBar } from './ShareBar'

afterEach(() => { cleanup(); vi.restoreAllMocks() })

test('renders Copy URL button', () => {
  const { getByRole } = render(
    <ShareBar activeKit="808" showCustomSampleBanner={false} />, { wrapper }
  )
  expect(getByRole('button', { name: 'Copy URL' })).toBeDefined()
})

test('copies current URL to clipboard on click', async () => {
  const user = userEvent.setup()
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal('navigator', { clipboard: { writeText } })
  const { getByRole } = render(
    <ShareBar activeKit="808" showCustomSampleBanner={false} />, { wrapper }
  )
  await user.click(getByRole('button', { name: 'Copy URL' }))
  expect(writeText).toHaveBeenCalledWith(expect.stringContaining('http'))
})

test('shows custom sample banner when showCustomSampleBanner is true', () => {
  const { getByText } = render(
    <ShareBar activeKit="808" showCustomSampleBanner />, { wrapper }
  )
  // Spec: "This pattern used custom samples — playing with {kit} instead."
  const banner = getByText(/custom samples/i)
  expect(banner.textContent).toMatch(/808/i)
})

test('does not show banner when showCustomSampleBanner is false', () => {
  const { queryByText } = render(
    <ShareBar activeKit="808" showCustomSampleBanner={false} />, { wrapper }
  )
  expect(queryByText(/custom samples/i)).toBeNull()
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd web && pnpm run test:unit -- ShareBar.test
```

- [ ] **Step 3: Implement ShareBar.tsx**

```typescript
// web/src/components/Beatmaker/ShareBar.tsx
'use client'
import { Button } from '@heroui/button'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import type { Kit } from '#models/beatmaker'
import { KITS } from '#models/beatmaker'

interface ShareBarProps {
  activeKit: Kit
  showCustomSampleBanner: boolean
}

export function ShareBar({ activeKit, showCustomSampleBanner }: ShareBarProps) {
  const t = useTranslations('beatmaker.share')
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-2">
      <Button size="sm" variant="bordered" onPress={handleCopy}>
        {copied ? t('copied') : t('copyUrl')}
      </Button>

      {showCustomSampleBanner && (
        <p className="text-sm text-warning">
          {t('customSampleNotice', { kit: KITS[activeKit].label })}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run to confirm pass**

```bash
cd web && pnpm run test:unit -- ShareBar.test
```

- [ ] **Step 5: Commit**

```bash
git add web/src/components/Beatmaker/ShareBar.tsx \
        web/src/components/Beatmaker/ShareBar.test.tsx
git commit -m "feat(beatmaker): add ShareBar component"
```

---

## Chunk 4: Root Component + E2E

### Task 15: Beatmaker Root Component

**Files:**
- Replace: `web/src/components/Beatmaker/Beatmaker.tsx` (placeholder → full implementation)
- Replace: `web/src/components/Beatmaker/Beatmaker.test.tsx`

The root component owns:
- All `BeatmakerState` via `useState`
- The `Engine` instance via `useRef`
- URL hash sync (read on mount, write on state change, debounced 300 ms)
- Kit loading when kit changes
- Custom file loading via engine

- [ ] **Step 1: Write failing tests**

```typescript
// web/src/components/Beatmaker/Beatmaker.test.tsx
import { cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { testWrapper as wrapper } from '#utils/tests'
import { Beatmaker } from './Beatmaker'

// ── Mock audio engine ──────────────────────────────────────────────────────
const mockEngine = {
  init: vi.fn().mockResolvedValue(undefined),
  loadKit: vi.fn().mockResolvedValue(undefined),
  loadCustomFile: vi.fn().mockResolvedValue(undefined),
  start: vi.fn(),
  stop: vi.fn(),
  dispose: vi.fn(),
}

vi.mock('#models/beatmaker', async importOriginal => {
  const actual = await importOriginal<typeof import('#models/beatmaker')>()
  return { ...actual, createEngine: () => mockEngine }
})

beforeEach(() => {
  vi.clearAllMocks()
  // Reset hash
  window.location.hash = ''
})
afterEach(() => { cleanup(); vi.restoreAllMocks() })

test('renders the Play button on initial load', () => {
  const { getByRole } = render(<Beatmaker />, { wrapper })
  expect(getByRole('button', { name: 'Play' })).toBeDefined()
})

test('clicking Play initialises engine and starts playback', async () => {
  const user = userEvent.setup()
  const { getByRole } = render(<Beatmaker />, { wrapper })
  await user.click(getByRole('button', { name: 'Play' }))
  expect(mockEngine.init).toHaveBeenCalledTimes(1)
  expect(mockEngine.start).toHaveBeenCalledTimes(1)
})

test('clicking Stop stops playback', async () => {
  const user = userEvent.setup()
  const { getByRole } = render(<Beatmaker />, { wrapper })
  await user.click(getByRole('button', { name: 'Play' }))
  await user.click(getByRole('button', { name: 'Stop' }))
  expect(mockEngine.stop).toHaveBeenCalledTimes(1)
})

test('clicking a step button toggles it', async () => {
  const user = userEvent.setup()
  const { getAllByRole } = render(<Beatmaker />, { wrapper })
  const stepBtns = getAllByRole('button').filter(
    btn => btn.getAttribute('aria-pressed') !== null
  )
  const firstStep = stepBtns[0]
  const wasPressed = firstStep.getAttribute('aria-pressed') === 'true'
  await user.click(firstStep)
  expect(firstStep.getAttribute('aria-pressed')).toBe(String(!wasPressed))
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd web && pnpm run test:unit -- Beatmaker.test
```

- [ ] **Step 3: Implement Beatmaker.tsx**

```typescript
// web/src/components/Beatmaker/Beatmaker.tsx
'use client'
import { captureException } from '@sentry/nextjs'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  buildDefaultState,
  createEngine,
  decode,
  encode,
  PRESETS,
  TRACK_IDS,
  type BeatmakerState,
  type Engine,
  type Kit,
  type StepCount,
  type TrackId,
} from '#models/beatmaker'

import { KitSelector } from './KitSelector'
import { MixerStrip } from './MixerStrip'
import { PatternPresets } from './PatternPresets'
import { SequencerGrid } from './SequencerGrid'
import { ShareBar } from './ShareBar'
import { Transport } from './Transport'

export function Beatmaker() {
  useTranslations('beatmaker')

  const [state, setState] = useState<BeatmakerState>(() => {
    // Initialise from URL hash if present
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      const decoded = decode(hash)
      if (decoded) {
        return { ...decoded, isPlaying: false }
      }
    }
    return buildDefaultState()
  })

  const [showCustomBanner, setShowCustomBanner] = useState(false)
  const [decodeErrors, setDecodeErrors] = useState<Partial<Record<TrackId, string>>>({})
  const engineRef = useRef<Engine | null>(null)
  const stateRef = useRef(state) // always-fresh copy for scheduler callback

  // Keep stateRef in sync
  useEffect(() => { stateRef.current = state }, [state])

  // Initialise engine on mount; wire Sentry for sample load errors
  useEffect(() => {
    const engine = createEngine(captureException)
    engineRef.current = engine
    return () => { engine.dispose() }
  }, [])

  // Load initial kit samples (after engine is created)
  useEffect(() => {
    engineRef.current?.loadKit(state.kit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reload samples when kit changes
  useEffect(() => {
    engineRef.current?.loadKit(state.kit)
  }, [state.kit])

  // Sync URL hash on state change (debounced)
  useEffect(() => {
    const hasCustom = TRACK_IDS.some(id => !!state.tracks[id].customFile)
    const timer = setTimeout(() => {
      window.location.hash = encode(state, hasCustom)
    }, 300)
    return () => clearTimeout(timer)
  }, [state])

  // On mount: check for custom sample banner in hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const decoded = decode(hash)
    if (decoded?.hasCustomSamples) setShowCustomBanner(true)
  }, [])

  // ── Handlers ────────────────────────────────────────────────────────────

  const handlePlayToggle = useCallback(async () => {
    const engine = engineRef.current
    if (!engine) return
    if (state.isPlaying) {
      engine.stop()
      setState(s => ({ ...s, isPlaying: false }))
    } else {
      await engine.init()
      engine.start(() => stateRef.current)
      setState(s => ({ ...s, isPlaying: true }))
    }
  }, [state.isPlaying])

  const handleBpmChange = useCallback((bpm: number) => {
    setState(s => ({ ...s, bpm }))
  }, [])

  const handleStepCountChange = useCallback((stepCount: StepCount) => {
    setState(s => {
      const tracks = Object.fromEntries(
        TRACK_IDS.map(id => {
          const current = s.tracks[id].steps
          let steps: boolean[]
          if (stepCount > current.length) {
            steps = [...current, ...Array<boolean>(stepCount - current.length).fill(false)]
          } else {
            steps = current.slice(0, stepCount)
          }
          return [id, { ...s.tracks[id], steps }]
        })
      ) as BeatmakerState['tracks']
      return { ...s, stepCount, tracks }
    })
  }, [])

  const handleKitChange = useCallback((kit: Kit) => {
    setState(s => ({ ...s, kit }))
  }, [])

  const handlePresetSelect = useCallback((presetId: string) => {
    const preset = PRESETS[presetId]
    if (!preset) return
    setState(s => ({ ...s, ...preset, isPlaying: s.isPlaying }))
  }, [])

  const handleStepToggle = useCallback((trackId: TrackId, index: number) => {
    setState(s => {
      const steps = s.tracks[trackId].steps.map((v, i) => (i === index ? !v : v))
      return {
        ...s,
        tracks: { ...s.tracks, [trackId]: { ...s.tracks[trackId], steps } },
      }
    })
  }, [])

  const handleFileLoad = useCallback(async (trackId: TrackId, file: File) => {
    const engine = engineRef.current
    if (!engine) return
    // Ensure AudioContext exists before decoding (satisfies autoplay policy)
    await engine.init()
    try {
      await engine.loadCustomFile(trackId, file)
      setState(s => ({
        ...s,
        tracks: { ...s.tracks, [trackId]: { ...s.tracks[trackId], customFile: file } },
      }))
      setDecodeErrors(e => ({ ...e, [trackId]: undefined }))
    } catch {
      setDecodeErrors(e => ({ ...e, [trackId]: 'Could not decode audio file.' }))
    }
  }, [])

  const handleVolumeChange = useCallback((trackId: TrackId, volume: number) => {
    setState(s => ({
      ...s,
      tracks: { ...s.tracks, [trackId]: { ...s.tracks[trackId], volume } },
    }))
  }, [])

  const handlePanChange = useCallback((trackId: TrackId, pan: number) => {
    setState(s => ({
      ...s,
      tracks: { ...s.tracks, [trackId]: { ...s.tracks[trackId], pan } },
    }))
  }, [])

  const handleMuteToggle = useCallback((trackId: TrackId) => {
    setState(s => ({
      ...s,
      tracks: {
        ...s.tracks,
        [trackId]: { ...s.tracks[trackId], muted: !s.tracks[trackId].muted },
      },
    }))
  }, [])

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
      <Transport
        isPlaying={state.isPlaying}
        bpm={state.bpm}
        stepCount={state.stepCount}
        onPlayToggle={handlePlayToggle}
        onBpmChange={handleBpmChange}
        onStepCountChange={handleStepCountChange}
      />

      <div className="flex flex-wrap items-center gap-4">
        <KitSelector activeKit={state.kit} onKitChange={handleKitChange} />
        <PatternPresets onPresetSelect={handlePresetSelect} />
      </div>

      <SequencerGrid
        tracks={state.tracks}
        stepCount={state.stepCount}
        onStepToggle={handleStepToggle}
        onFileLoad={handleFileLoad}
        decodeErrors={decodeErrors}
      />

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {TRACK_IDS.map(trackId => (
          <MixerStrip
            key={trackId}
            trackId={trackId}
            volume={state.tracks[trackId].volume}
            pan={state.tracks[trackId].pan}
            muted={state.tracks[trackId].muted}
            onVolumeChange={v => handleVolumeChange(trackId, v)}
            onPanChange={v => handlePanChange(trackId, v)}
            onMuteToggle={() => handleMuteToggle(trackId)}
          />
        ))}
      </div>

      <ShareBar
        activeKit={state.kit}
        showCustomSampleBanner={showCustomBanner}
      />
    </div>
  )
}
```

- [ ] **Step 4: Update Beatmaker/index.ts**

```typescript
// web/src/components/Beatmaker/index.ts
export { Beatmaker } from './Beatmaker'
```

- [ ] **Step 5: Run to confirm pass**

```bash
cd web && pnpm run test:unit -- Beatmaker.test
```

- [ ] **Step 6: Run all unit tests to check for regressions**

```bash
cd web && pnpm run test:unit
```
Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add web/src/components/Beatmaker/
git commit -m "feat(beatmaker): implement root Beatmaker component"
```

---

### Task 16: E2E Tests

**Files:**
- Create: `web/e2e/beatmaker.spec.ts`

- [ ] **Step 1: Write E2E tests**

```typescript
// web/e2e/beatmaker.spec.ts
import { expect } from '@playwright/test'
import { test } from './helpers'

test.describe('Beatmaker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/games/beatmaker')
  })

  test('page loads with Play button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Play' })).toBeVisible()
  })

  test('Play button changes to Stop on click', async ({ page }) => {
    await page.getByRole('button', { name: 'Play' }).click()
    await expect(page.getByRole('button', { name: 'Stop' })).toBeVisible()
  })

  test('Stop returns to Play button', async ({ page }) => {
    await page.getByRole('button', { name: 'Play' }).click()
    await page.getByRole('button', { name: 'Stop' }).click()
    await expect(page.getByRole('button', { name: 'Play' })).toBeVisible()
  })

  test('step buttons can be toggled', async ({ page }) => {
    const steps = page.getByRole('button', { pressed: false }).first()
    await steps.click()
    await expect(steps).toHaveAttribute('aria-pressed', 'true')
  })

  test('URL hash updates after interaction', async ({ page }) => {
    // Toggle a step and wait for debounce (300ms + buffer)
    const steps = page
      .getByRole('button')
      .filter({ hasAttribute: 'aria-pressed' })
      .first()
    await steps.click()
    await page.waitForTimeout(500)
    const url = page.url()
    expect(url).toContain('#v1:')
  })

  test('shared URL loads the same pattern', async ({ page, context }) => {
    // Toggle step 0 of first track, copy URL
    const steps = page
      .getByRole('button')
      .filter({ hasAttribute: 'aria-pressed' })
    const firstStep = steps.first()
    await firstStep.click()
    await page.waitForTimeout(500)
    const sharedUrl = page.url()

    // Open in a new tab
    const newPage = await context.newPage()
    await newPage.goto(sharedUrl)
    const loadedStep = newPage
      .getByRole('button')
      .filter({ hasAttribute: 'aria-pressed' })
      .first()
    await expect(loadedStep).toHaveAttribute('aria-pressed', 'true')
    await newPage.close()
  })
})
```

- [ ] **Step 2: Run E2E tests**

```bash
cd web && pnpm run test:e2e -- beatmaker.spec.ts
```

> **Note:** E2E tests require the dev server to be running and sample `.mp3` files to be in place. If sample files are missing, Play/Stop tests will pass (the engine handles missing samples gracefully), but audio will be silent. Run `pnpm run dev` in one terminal before running e2e tests.

- [ ] **Step 3: Commit**

```bash
git add web/e2e/beatmaker.spec.ts
git commit -m "test(beatmaker): add E2E tests"
```

---

### Task 17: Final Build Check

- [ ] **Step 1: Run full build**

```bash
cd web && pnpm run build
```
Expected: no TypeScript errors, no build failures.

- [ ] **Step 2: Run all unit tests**

```bash
cd web && pnpm run test:unit
```
Expected: all pass.

- [ ] **Step 3: Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "chore(beatmaker): final build cleanup"
```

---

## Notes for the Engineer

### Samples
You must source 18 CC0 `.mp3` files before audio will work. Recommended search on [freesound.org](https://freesound.org) — filter by CC0 licence. Encode at 128kbps to keep file sizes small (~50-100 KB each). Document each source in `web/public/samples/CREDITS.md`.

### Storybook
If the project uses Storybook (check `web/package.json` for a `storybook` script), add stories for Transport, KitSelector, MixerStrip, and SequencerGrid. Follow patterns in existing `*.stories.tsx` files. Not a blocker for shipping.

### Mobile layout
`<SequencerGrid>` uses `overflow-x-auto` for horizontal scrolling on narrow screens. Test on a real device or a mobile viewport in DevTools after implementation.

### Version bump for samples
If you need to replace a sample after shipping, put the new file in `public/samples/v2/` and update the `SAMPLE_VERSION` constant in `kits.ts`. Old `v1` URLs remain cached in browsers with no conflict.
