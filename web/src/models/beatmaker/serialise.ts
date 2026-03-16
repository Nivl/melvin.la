import { buildDefaultState } from './presets';
import type { BeatmakerState, Kit, StepCount, TrackId } from './types';
import { BPM_MAX, BPM_MIN, STEP_COUNTS, TRACK_IDS } from './types';

// URL-safe base64: avoids +, /, = which get mangled in URLs
function toUrlBase64(str: string): string {
  return btoa(str)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function fromUrlBase64(str: string): string {
  const b64 = str.replaceAll('-', '+').replaceAll('_', '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  return atob(b64 + pad);
}

// Compact JSON key mapping
type Compact = {
  k: Kit;
  b: number;
  s: StepCount;
  c?: boolean;
  t: Record<TrackId, { p: boolean[]; v: number; n: number; m: boolean }>;
};

export function encode(
  state: BeatmakerState,
  hasCustomSamples = false,
): string {
  const compact: Compact = {
    k: state.kit,
    b: state.bpm,
    s: state.stepCount,
    t: Object.fromEntries(
      TRACK_IDS.map(id => [
        id,
        {
          p: state.tracks[id].steps.slice(0, state.stepCount),
          v: state.tracks[id].volume,
          n: state.tracks[id].pan,
          m: state.tracks[id].muted,
        },
      ]),
    ) as Compact['t'],
  };
  if (hasCustomSamples) compact.c = true;
  return `v1:${toUrlBase64(JSON.stringify(compact))}`;
}

type DecodedState = Omit<BeatmakerState, 'isPlaying'> & {
  hasCustomSamples: boolean;
};

export function decode(hash: string): DecodedState | undefined {
  try {
    if (!hash.startsWith('v1:')) return undefined;
    const json = fromUrlBase64(hash.slice(3));
    const compact = JSON.parse(json) as Compact;

    if (
      !compact.k ||
      typeof compact.b !== 'number' ||
      !Number.isFinite(compact.b) ||
      !compact.s ||
      !compact.t
    )
      return undefined;

    const VALID_KITS: Kit[] = ['808', 'acoustic', 'lofi'];
    if (!VALID_KITS.includes(compact.k)) return undefined;
    if (!STEP_COUNTS.includes(compact.s)) return undefined;
    const bpm = Math.max(BPM_MIN, Math.min(BPM_MAX, compact.b));

    const defaults = buildDefaultState();

    return {
      kit: compact.k,
      bpm,
      stepCount: compact.s,
      hasCustomSamples: compact.c ?? false,
      tracks: Object.fromEntries(
        TRACK_IDS.map(id => {
          const t = compact.t[id];
          if (!t) {
            const defaultTrack = defaults.tracks[id];
            const defaultSteps = defaultTrack.steps;
            const normalizedSteps =
              defaultSteps.length === compact.s
                ? defaultSteps
                : defaultSteps.length > compact.s
                  ? defaultSteps.slice(0, compact.s)
                  : [
                      ...defaultSteps,
                      ...Array.from<boolean>({
                        length: compact.s - defaultSteps.length,
                      }).fill(false),
                    ];
            return [
              id,
              {
                ...defaultTrack,
                steps: normalizedSteps,
                customFile: undefined,
              },
            ];
          }
          const rawSteps = Array.isArray(t.p)
            ? t.p.slice(0, compact.s).map(Boolean)
            : defaults.tracks[id].steps;
          const steps =
            rawSteps.length === compact.s
              ? rawSteps
              : [
                  ...rawSteps,
                  ...Array.from({ length: compact.s - rawSteps.length }).fill(
                    false,
                  ),
                ];
          return [
            id,
            {
              steps,
              volume: Number.isFinite(t.v)
                ? Math.max(0, Math.min(1, t.v))
                : defaults.tracks[id].volume,
              pan: Number.isFinite(t.n)
                ? Math.max(-1, Math.min(1, t.n))
                : defaults.tracks[id].pan,
              muted: typeof t.m === 'boolean' ? t.m : defaults.tracks[id].muted,
              customFile: undefined,
            },
          ];
        }),
      ) as BeatmakerState['tracks'],
    };
  } catch {
    return undefined;
  }
}
